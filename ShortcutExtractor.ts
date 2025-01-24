import autoBind from "auto-bind"
import {ShortcutTable, TermTable} from "./Table"
import {LEFT_WORD_AND_PUNCT, RIGHT_PUNCT_AND_WORD} from "./TermExtractor"
import {type Claim, isCommonWord} from "./utils"

export class ShortcutExtractor {
  table: ShortcutTable
  extraDisambiguateTables: TermTable<object>[]

  constructor(table: ShortcutTable, extraDisambiguateTables: TermTable<object>[] = []) {
    autoBind(this)
    this.table = table
    this.extraDisambiguateTables = extraDisambiguateTables
  }

  extractFromText(input: string, context: "User" | "Other"): [Claim[], string] {
    let text = input

    const result: Claim[] = []
    // const matchedNames = new Set<string>()

    for (const row of this.table) {
      const {
        name, regex, disambiguate, seniorities = [], skills = [], role,
      } = row
      // if (matchedNames.has(name)) {
      //   // Do not match shorter patterns if previously matched longer (of the same name)
      //   continue
      // }
      let PATTERN = regex.source
      if (disambiguate) {
        PATTERN = LEFT_WORD_AND_PUNCT + PATTERN + RIGHT_PUNCT_AND_WORD
        // ^ TODO support optional SS on both sides, instead of just PUNCT
      }
      for (const match of text.matchAll(new RegExp(PATTERN, "ig"))) {
        // matchedNames.add(name)
        const word = match[1].replace(/#/g, "")
        const isTag = match[1].startsWith("#")
        const isCommon = isCommonWord(word)
        if (disambiguate) {
          const [left, right] = match[0].split(match[1]).map(w => w.trim())
          const claims_ = disambiguate(this, {
            context, name, isTag,
            left, word, right,
            claim: {seniorities, skills, role: role || ""},
          })
          if (claims_) {
            result.push(claims_)
            text = text.replace(match[1], "[TERM]")
          }
        } else if (isTag || !isCommon) {
          result.push({seniorities, skills, role: role || ""})
          text = text.replace(match[1], "[TERM]")
        }
      }
    }
    return [result, text]
  }

  isTerm(word: string): boolean {
    return (
      word == "[TERM]" ||
      Boolean(this.table.parse(word)) ||
      this.extraDisambiguateTables.some(table => table.parse(word))
    )
  }
}
