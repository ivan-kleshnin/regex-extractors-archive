import {LB, RB} from "./utils"

// TODO how to detect freaking icons by unicode codes?!
export const UNICODE_ICONS = "💻📚🎨🎮😎‍😵🤓☺️👨🧑‍👩‍👍🚀☺️❄❤️🔥💯💣🔭👨‍🎨"
export const UNICODE_ICON = "[" + UNICODE_ICONS + "]"

export const SEP_HIERARCHY = [
  "\\n\\n",
  ["\\n", `\\.${RB}`, `\\?${RB}`, `!${RB}`].join("|"),
  ";",
  ["\\|\\|", "&&", "\\|"].join("|"),
  // Claim skills can be looked behind starting from this level:
  [","].join("|"),
  [`${LB}/`, `/${RB}`].join("|"),
  ["\\+", `${LB}&`, `&${RB}`, ` ?${LB}and${RB} ?`, ` ?${LB}or${RB} ?`].join("|"),
]
export const ANY_SEP = SEP_HIERARCHY.join("|")

export function simplifyParens(text: string): string {
  // Replace all non-space separators inside parentheses with whitespace
  return text
    .replace(/(?<=\()[^)]+(?=\))*/g, (match) => match.replace(new RegExp(ANY_SEP, "ig"), " "))
}

const cyrillicToSameLookingLatin: Dict<string> = {
  "З": "3", // cyrillic "З" -> latin "3"
  "А": "A", // cyrillic "А" -> latin "A"
  "В": "B", // ...
  "С": "C",
  "Е": "E",
  "Н": "H",
  "К": "K",
  "М": "M",
  "О": "O",
  "Р": "P",
  "Т": "T",
  "Х": "X",
}

function fixMixedCyrillicLatinCase(str: string): string {
  const CYRILLIC = Object.keys(cyrillicToSameLookingLatin).join("")
  return str
    .replace(new RegExp(`(?<=\\w)[${CYRILLIC}]|[${CYRILLIC}](?=\\w)`, "g"), (c) => cyrillicToSameLookingLatin[c])
}

function collapseWhitespace(str: string): string {
  return str.replace(/[\t ]+/g, " ")
}

function resolveAts(str: string): string {
  return str.replace(/(?<=\s)@(?=\s)/g, "at")
}

export function normalizeText(text: string): string {
  let homogeneousText = collapseWhitespace(text.trim())
  return fixMixedCyrillicLatinCase(resolveAts(homogeneousText))
}

export function trimPunctuation(str: string): string {
  return str
    .replace(/^[ ,.?!;]+/, "")
    .replace(/[ ,.?!;]+$/, "")
}

// export function normalizeStr(str: string): string {
//   return str
//     // .replace(/[^\x00-\x7F•]+/ug, "•")
//     // .replace(new RegExp(`${DANGLING}*•${DANGLING}*`, "g"), " • ")
//     // .replace(/^ *•|• *$/g, "")
//     // .replace(/(?<=[(]) *•|• *(?=[)])/g, "")
//     // .replace(/\s+/g, " ")
//     // .replace(new RegExp(` ([,.])${RB}`, "g"), "$1")
//     // .replace(/\( /g, "(")
//     // .replace(/\[ /g, "[")
//     // .replace(/ \)/g, ")")
//     // .replace(/ ]/g, "]")
//     // .replace(/\( ?\)|\[ ?]/g, "")
//     .trim()
// }
//
// const DANGLING = `([-_+–,:;.?!%^&*/|~'"\` •]|${LB}(and|at|in|of|on|ex|@)${RB})`
// // |com|ai|org|net|co
