import {F} from "lib/belt"

// "data" folder must not import from this module
export const commonWords = new Set([
  "be",
  "go",
  "mean", "moment", "move",
  "next",
  "product", "project",
  "rest",
  "solution"
])

export function expandSubpattern(str: string): string {
  if (!str) {
    return str
  }
  return escapeSubpattern(str)
    .replace(/^!/, "")
    .replace(/\/=/g, " ?[-/]? ?")
    .replace(/\.=/g, " ?[-.]? ?")  // "–" is too rare to bother
    .replace(/=/g, " ?-? ?")       // "_" is too slug specific, should be handled separately at normalization
}

export function expandSubpatternForLengthComparison(str: string): string {
  if (!str) {
    return str
  }
  return str
    .replace(/\[.+\]/, "x")
    .replace(/\?/, "")
}

// left/right boundaries
export const LB = "(?<!(?:\\w\\.|[-\\w@'’]))" // the 1st branch prevents matches with "go@to.rust"
export const RB = "(?!(?:\\.\\w|[-\\w@'’]))"  // the 1st branch prevents matches with "java.pdf"

// soft/hard separators
export const SS = "(?:" + `(?:[-– &,/|()]|,? ?(?:${LB}(?:and|or|of)${RB}))` + "+)"
export const HS = "(?: *[.?!]+ *)"

// LEGACY
export const _AT = `(?: @| at${RB}| in${RB})`
export const _SOFT_SEP = `(?: ?\\/| ?,? (?:and|or|of|in|an?|the)${RB}| ?&| ?\\|| ?,| | ?[()]| ?[-–] ?)`
export const _HARD_SEP = `(?:^| ?\\.${RB}| ?;| ?•| ?$)+`

export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function escapeSubpattern(str: string): string {
  // Only "[]" and "?" from Regex syntax is supported
  // "+" and "." are treated literally
  if (/\||\(|\)|\*/.test(str)) {
    throw new Error(`Invalid subpattern '${str}'`)
  }
  return str
    .replace(/[+]|\.(?!=)/g, (m) => "\\" + m) // escape "+" and "." that are not parts of ".="
}

// WORDS & PLACEHOLDERS
export function isCommonWord(term: string): boolean {
  if (term == "[TERM]") {
    return false
  } else {
    return commonWords.has(term.toLowerCase())
  }
}

export function joinWords(words: (string | undefined)[]): string {
  return words.filter(Boolean).join(" ")
}

// CLAIMS
export type Claim = {
  seniorities: string[] // used by `interpretSeniorities`
  skills: string[]      // used by `interpretSpecializations`
  role: string          // used by `interpretSpecializations`
}

export const emptyClaim = {
  seniorities: [],
  skills: [],
  role: "",
}

export function isEmptyClaim(claim: Claim): boolean {
  return F.equals(claim, emptyClaim)
}
