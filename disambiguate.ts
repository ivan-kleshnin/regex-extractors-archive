import {S} from "lib/belt"
import {ShortcutExtractor} from "./ShortcutExtractor"
import {TermExtractor} from "./TermExtractor"
import {type Claim, isCommonWord, HS, LB, RB} from "./utils"

export type DisambiguateTermOpts = {
  context: "User" | "Other"
  name: string
  isTag: boolean
  left: string
  word: string
  right: string
}

export type DisambiguateShortOpts = {
  context: "User" | "Other"
  name: string
  isTag: boolean
  left: string
  word: string
  right: string
  claim: Claim
}

export type DisambiguateTerm = (extractor: TermExtractor, opts: DisambiguateTermOpts) => string | undefined
export type DisambiguateShortcut = (extractor: ShortcutExtractor, opts: DisambiguateShortOpts) => Claim | undefined

// Note: pulled out from TermExtractor with an assumption that we'll have different `disambiguate` versions
// for different terms or term categories (skills vs topics, etc). If that is not confirmed – move it back
// to the `TermExtractor` class.
export function disambiguateTerm(extractor: TermExtractor, opts: DisambiguateTermOpts): string | undefined {
  if (process.env.DEBUG) {
    console.log("-- @disambiguateTerm", opts)
  }
  const {name, isTag, left, word, right} = opts

  if (isTag) {
    if (process.env.DEBUG) {
      console.log("-- isTag")
    }
    // - A non-common word OR
    // - A tag version of an ambiguous word, e.g. was "#go" (hashmark is trimmed at this point)
    return name
  }

  if (!left && !right) {
    const isPerfectlyCased = extractor.table.isPerfectlyCased(name, word)
    if (isPerfectlyCased) {
      if (process.env.DEBUG) {
        console.log("-- isolated [@/pc]")
      }
      return name
    } else {
      return undefined
    }
  }

  const cleanLeft = cleanJunk(left.replace(rightAndOr, ","))
  const cleanRight = cleanJunk(right.replace(leftAndOr, ", "))

  const hasLeftHS = leftHS.test(left)
  const hasRightHS = rightHS.test(right)

  const hasLeftTerm = extractor.isTerm(cleanLeft)
  if (hasLeftTerm) {
    if (!isCommonWord(cleanLeft)) {
      if (process.env.DEBUG) {
        console.log("-- [TERM/u] [@]")
      }
      return name
    } else if (hasRightHS) {
      if (process.env.DEBUG) {
        console.log("-- [TERM] [@] HS")
      }
      return name
    }
  }

  const hasRightTerm = extractor.isTerm(cleanRight)
  if (hasLeftTerm && hasRightTerm) {
    if (process.env.DEBUG) {
      console.log("-- [TERM] [@] [TERM]")
    }
    return extractor.table.isPerfectlyCased(name, word) ? name : undefined
  }
  if (hasRightTerm) {
    if (!isCommonWord(cleanRight)) {
      if (process.env.DEBUG) {
        console.log("-- [@] [TERM/u]")
      }
      return name
    } else if (hasLeftHS) {
      if (process.env.DEBUG) {
        console.log("-- HS [@] [TERM]")
      }
      return name
    } else if (!left) {
      if (process.env.DEBUG) {
        console.log("-- | [@] [TERM]")
      }
      return name
    }
  }

  const isPerfectlyCased = extractor.table.isPerfectlyCased(name, word)
  if (isPerfectlyCased) {
    if (hasRightTerm && !left) {
      if (process.env.DEBUG) {
        console.log("-- | [@/pc] [TERM]")
      }
      return name
    } else if (hasLeftTerm && !right) {
      if (process.env.DEBUG) {
        console.log("-- [TERM] [@/pc] |")
      }
      return name
    } else if (!hasLeftHS && left) {
      if (process.env.DEBUG) {
        console.log("-- SS [@/pc]")
      }
      return name
    } else
    if (S.isUpperCase(word)) {
      if (process.env.DEBUG) {
        console.log("-- [@/upc]")
      }
      return name
    }
  }

  return undefined
}

export function disambiguateShortTerm(extractor: ShortcutExtractor, opts: DisambiguateShortOpts): Claim | undefined {
  const result = disambiguateTerm(extractor as unknown as TermExtractor, opts)
  return result ? opts.claim : undefined
}

export function disambiguateShortRole(extractor: ShortcutExtractor, opts: DisambiguateShortOpts): Claim | undefined {
  // In the "negative" case of disambiguation means that we forward a limited subset of claims
  // e.g. `{topics: ["QA"]}` instead of `{role: "Engineer", topics: ["QA", "Software"]}`.
  // In the "positive" case we forward the full claims.
  if (process.env.DEBUG) {
    console.log("-- @disambiguateShortRole", opts)
  }
  const {context, isTag, left, right, claim} = opts

  if (context != "User") {
    return {...claim, role: ""}
  }
  if (isTag) {
    return {...claim, role: ""}
  }

  if (!left && !right) {
    if (process.env.DEBUG) {
      console.log("-- context == 'User' && !isTag && isIsolated")
    }
    return claim
  }

  const hasRightSSorHS = /^ ?[,.?!;/|)(]/.test(right)
  if (hasRightSSorHS) {
    if (process.env.DEBUG) {
      console.log("-- context == 'User' && !isTag && hasRightSSorHS")
    }
    return claim
  }

  const cleanLeft = cleanJunk(left.replace(rightAndOr, ", "))
  const cleanRight = cleanJunk(right.replace(leftAndOr, ", "))

  const hasRightTerm = extractor.isTerm(cleanRight)
  if (hasRightTerm) {
    return {...claim, role: ""}
  }
  if (cleanLeft == "Lead") {
    return {...claim, role: ""}
  }
  if (process.env.DEBUG) {
    console.log("-- context == 'User' && !isTag && hasNoRightTerm")
  }
  return claim
}

// "QA Engineer": {pattern: "!qa=automation, !qa", topics: ["QA", "Software"], role: "Engineer", disambiguate: disambiguateAsRole},

const JUNK = `[,. &?!/|()]+`
const leftJunk = new RegExp("^" + JUNK, "i")
const rightJunk = new RegExp(JUNK + "$", "i")
const leftHS = new RegExp(HS + "$", "i")
// const leftSS = new RegExp(SS + "$", "i")
const rightHS = new RegExp("^" + HS, "i")
const leftAndOr = new RegExp(`^(-|(and|or|of)${RB})`, "i")
const rightAndOr = new RegExp(`(-|${LB}(and|or|of))$`, "i")

function cleanJunk(str: string): string {
  return str.replace(leftJunk, "").replace(rightJunk, "")
}
