import {N} from "lib/belt"

export function extractMOE(str: string): number | undefined {
  // 1. Prepare regexes (TODO move outside)
  const regexes = [REGEX1, REGEX2]

  // 2. Match
  const matches = regexes.flatMap(REGEX =>
    Array.from(
      str.matchAll(new RegExp(REGEX, "ig"))
    ).map(match => {
      str = str.replace(match[0], "") // drop consumed substring to avoid overlapping matches
      if (match[4]) {
        return [
          {value: match[1], unit: match[2].toLowerCase() as "year" | "month"},
          {value: match[3], unit: match[4].toLowerCase() as "year" | "month"},
        ]
      } else {
        return [{value: match[1], unit: match[2].toLowerCase() as "year" | "month"}]
      }
    })
  )

  // 3. Parse
  if (matches.length) {
    const numbers = matches.map((data) => {
      return data.reduce((z, {value: rawValue, unit}) => {
        if (z === undefined) {
          return undefined
        }
        rawValue = rawValue.toLowerCase().trim()
        const value = rawValue
          .replace(/\+|>|plus|over|more|than/ig, "")
          .replace(/^\.+/, "")
          .toLowerCase()
          .trim()
        const extraMonths = value == rawValue ? 0 : (unit == "year" ? 6 : 1)
        if (value in cardinals) {
          return z + toMonths(unit, cardinals[value]) + extraMonths
        } else {
          const f = parseFloat(value)
          if (isNaN(f)) {
            return undefined
          }
          return z + Math.round(toMonths(unit, f)) + extraMonths
        }
      }, 0 as number | undefined)
    }).filter((x): x is number => x !== undefined)
    return N.sum(numbers) || undefined
  } else {
    return undefined
  }
}

function toMonths(unit: "year" | "month", num: number): number {
  return num * (unit == "year" ? 12 : 1)
}

const cardinals: Dict<number> = {
  a: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
}

const experienceNouns = ["experiences?", "expertises?", "knowledge", "expr?\\."]

const NUM = "(?:\\d+[.]?\\d*|" + Object.keys(cardinals).join("|") + ")"
const NUM_EXT = `((?:\\+|>|more(?: than)?|over)? ?${NUM} ?(?:\\+|plus)?)`
const NUM_UNIT = `${NUM_EXT}[- ]*(year|month)['’s]*(?! old| without)`
const _EXTRA_WORDS = `(?: [-.\\w@#+/]*){0,5}?`
const EXP_NOUNS = "(?<!no |without )(?:" + experienceNouns.join("|") + ")"
const _OF = `(?: around| for| over| in| of|:|)`
const _AND = `(?:,| and)?`

const REGEX1 = `${NUM_UNIT}(?:${_AND}${_EXTRA_WORDS}${_AND}${NUM_UNIT})?${_AND}${_EXTRA_WORDS} ${EXP_NOUNS}`
const REGEX2 = `${EXP_NOUNS}${_OF}${_EXTRA_WORDS}${_OF}${NUM_UNIT}(?:${_AND}${_EXTRA_WORDS}${_AND} ${NUM_UNIT})?`

// TODO not covered: almost 1 year
// Search GH:
// 28 results for "almost 1 year",
// 88 results for "almost 2 years",
// 83 results for "almost 3 years",
// 68 results for "almost 4 years",
// 49 results for "almost 5 years",
// not very important IMO

export const seniorityStopWords = new Set(["student", "grader"]) // Undergrad
