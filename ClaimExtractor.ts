import {A} from "lib/belt"
import autoBind from "auto-bind"
import {SEP_HIERARCHY, simplifyParens, trimPunctuation, UNICODE_ICON} from "./normalize"
import {ShortcutExtractor} from "./ShortcutExtractor"
import {roleGroups} from "./roles"
import {TermExtractor} from "./TermExtractor"
import {type Claim, emptyClaim, isEmptyClaim} from "./utils"

type ClaimExtractorProps = {
  roleExtractor: TermExtractor
  seniorityExtractor: TermExtractor
  shortcutExtractor: ShortcutExtractor
  skillExtractor: TermExtractor
  stopExtractor: TermExtractor
}

export class ClaimExtractor {
  roleExtractor: TermExtractor
  seniorityExtractor: TermExtractor
  shortcutExtractor: ShortcutExtractor
  skillExtractor: TermExtractor
  stopExtractor: TermExtractor

  constructor(props: ClaimExtractorProps) {
    autoBind(this)
    this.roleExtractor = props.roleExtractor
    this.seniorityExtractor = props.seniorityExtractor
    this.shortcutExtractor = props.shortcutExtractor
    this.skillExtractor = props.skillExtractor
    this.stopExtractor = props.stopExtractor
  }

  extractFromText(text: string, context: "User" | "Other"): Claim[] {
    text = this.normalizeSeparators(text)

    // The following is extracted only the first time, once
    const stopWords = this.stopExtractor.extractFromText(text, context)
    if (stopWords.length) {
      return []
    }
    return trimTrailingEmptyClaims(this.extractFromTextRecursive(text, 0, context)).map(cleanClaim)
  }

  protected extractFromTextRecursive(text: string, sepLevel: number, context: "User" | "Other"): Claim[] {
    if (!text) {
      return []
    }

    const [shortcutClaims, text2] = this.shortcutExtractor.extractFromText(text, context)
    const roles = this.roleExtractor.extractFromText(text2, context)
    const foundRoles = [...roles, ...shortcutClaims.flatMap(claims => claims.role ? [claims.role] : [])]

    const CURR_SEP = SEP_HIERARCHY[sepLevel]

    if (foundRoles.length <= 1 || !CURR_SEP) {
      const unicodeIcon = new RegExp(UNICODE_ICON, "gu")
      if (text.match(unicodeIcon)) {
        return this.extractFromTextRecursive(text.replace(unicodeIcon, "+"), sepLevel - 1, context)
      }

      const mainRoles = foundRoles.filter(role => !["Expert", "Enthusiast", "Lead"].includes(role))
      const mainRole = mainRoles.length == 1 ? mainRoles[0] : undefined
      const leadRole = foundRoles.find(role => role == "Lead")
      const expertRole = foundRoles.find(role => role == "Expert")
      const enthusiastRole = foundRoles.find(role => role == "Enthusiast")

      const seniorities = A.uniq([
        ...this.seniorityExtractor.extractFromText(text2, context),
        ...shortcutClaims.flatMap(claims => claims.seniorities),
      ])
      const skills = A.uniq([
        ...this.skillExtractor.extractFromText(text2, context),
        ...shortcutClaims.flatMap(claims => claims.skills)
      ])

      if (mainRole && leadRole) {
        return [
          {seniorities, skills, role: mainRole},
          {seniorities: [], skills, role: leadRole},
        ]
      } else if (mainRole) {
        return [
          {seniorities, skills, role: mainRole}
        ]
      } else if (leadRole || expertRole || enthusiastRole) {
        return [
          {seniorities, skills, role: leadRole || expertRole || enthusiastRole || ""}
        ]
      } else {
        return [
          {seniorities, skills, role: ""}
        ]
      }
    }

    const textFragments = text.split(new RegExp(CURR_SEP, "ig"))
    return textFragments.flatMap(textFragment => {
      return [
        ...this.extractFromTextRecursive(textFragment, sepLevel + 1, context),
        ...(sepLevel <= 3 ? [emptyClaim] : []),
      ]
    })
  }

  normalizeSeparators(text: string): string {
    // 1. Normalize "/" and "&" as word separators (remove whitespace)
    const regexesWithAmbiguousSeparators= [
      ...Array.from(this.seniorityExtractor.table),
      ...Array.from(this.skillExtractor.table),
    ].flatMap(term =>
      term.regex.source.includes("/") || term.regex.source.includes("&") ? [term.regex] : []
    )
    for (const regex of regexesWithAmbiguousSeparators) {
      text = text.replace(new RegExp(regex, "ig"), (match) => match.replace(/ /g, ""))
    }

    // 2. Normalize "/" as sentence separators (add whitespace)
    text = text.split(" ").map(word => {
      if ((word.includes("/") && word != "/") || (word.includes("&") && word != "&")) {
        const cleanWord = trimPunctuation(word)
        // An assumption is that no words have these curiosities:
        // - leading "." like in ".NET"
        // - middle "/" like in "VA/PT"
        // at the same time. Otherwise, it will end up split by "/".
        if (!this.skillExtractor.table.parse(cleanWord)) {
          return word.replace("/", " / ").replace("&", " & ")
        }
      }
      return word
    }).join(" ")

    // 3. Drop punctuation inside parentheses
    return simplifyParens(text)
  }
}

export function trimTrailingEmptyClaims(claims: Claim[]): Claim[] {
  // Leading empty claims are significant (interpreter uses lookbacks) so we keep them.
  return A.dropWhile(claims.toReversed(), isEmptyClaim).toReversed()
}

export function cleanClaim(claim: Claim): Claim  {
  if (!claim.role) {
    return claim
  }
  if (!roleGroups[claim.role]) {
    return claim
  }
  return {
    ...claim,
    skills: A.difference(claim.skills, roleGroups[claim.role].obviousSkills),
  }
}
