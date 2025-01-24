import autoBind from "auto-bind"
import {ShortcutTable, TermTable} from "./Table"
import {isCommonWord, SS} from "./utils"

// TODO this crap does not skip "a", "the", "of", "in" etc.
// Another bug: when we split by SEP, we lose potential left and right terms
// e.g. "Manager of the Project, MUI": MUI will disambiguate "Project"
//  but "Manager of the Project, MUI Expert": MUI will not disambiguate "Project" (will disappear after splitting)
export const LEFT_WORD_AND_PUNCT = `(?:[-.\\w\\[\\]]+${SS}?)?`  // "[]" allow [TERM] placeholder
export const RIGHT_PUNCT_AND_WORD = `(?:${SS}?[-.\\w\\[\\]]+)?` // /

// Q: How to extract from tags of GithubRepository?
// A: `A.uniq(tags.flatMap(text => topicTable.parse(text)))`

export class TermExtractor<R extends object = object> {
  table: TermTable<R>
  extraDisambiguateTables: (TermTable<R> | ShortcutTable)[]

  constructor(table: TermTable<R>, extraDisambiguateTables: (TermTable<R> | ShortcutTable)[] = []) {
    autoBind(this)
    this.table = table
    this.extraDisambiguateTables = extraDisambiguateTables
  }

  extractFromText(input: string, context: "User" | "Other"): string[] {
    let text = input.replace(/\s+/g, " ")

    const foundTerms: string[] = []

    for (const row of this.table) {
      const {name, regex, disambiguate} = row
      let PATTERN = regex.source
      if (disambiguate) {
        PATTERN = LEFT_WORD_AND_PUNCT + PATTERN + RIGHT_PUNCT_AND_WORD
        // ^ TODO support optional SS on both sides, instead of just PUNCT
      }
      for (const match of text.matchAll(new RegExp(PATTERN, "ig"))) {
        const word = match[1].replace(/#/g, "")
        const isTag = match[1].startsWith("#")
        const isCommon = isCommonWord(word)
        if (disambiguate) {
          const [left, right] = match[0].split(match[1]).map(w => w.trim())
          const name_ = disambiguate(this, {
            context, name, isTag,
            left, word, right,
          })
          if (name_) {
            foundTerms.push(name_)
            text = text.replace(match[1], "[TERM]")
          }
        } else if (isTag || !isCommon) {
          foundTerms.push(name)
          text = text.replace(match[1], "[TERM]")
        }
      }
    }
    return foundTerms
  }

  isTerm(word: string): boolean {
    return (
      word == "[TERM]" ||
      Boolean(this.table.parse(word)) ||
      this.extraDisambiguateTables.some(table => table.parse(word))
    )
  }
}
