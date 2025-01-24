export function extractIsResume(str: string): boolean {
  let hasStopWords = RESUME_STOP_WORDS.map(regexGen).filter(regex => str.match(regex)).length
  if (hasStopWords) return false

  let hasResumeWords = RESUME_SYNONYMS.map(regexGen).filter(regex => str.match(regex)).length
  if (hasResumeWords) return true

  let hasMixitWords = RESUME_MIXED_WORDS.map(regexGen).filter(regex => str.match(regex)).length
  if (!hasMixitWords) return false

  let hasPositiveWords = RESUME_POSITIVE_WORDS.map(regexGen).filter(regex => str.match(regex)).length
  if (hasPositiveWords) return true

  return false
}

function regexGen(str: string) {
  return new RegExp(`(?<![a-z0-9'’])(${str})(?![a-z0-9’'])`, "ig")
}

export let RESUME_SYNONYMS = [
  "resume",
  "curriculum vitae",
  "portfolio",
  "personal site",
  "about me",
  "резюме"
]

let RESUME_STOP_WORDS = [
  "theme", "template",
  "builder", "maker", "generator", "parser",
  "free",
  "get started",
  "customized", "customised"
]

let RESUME_MIXED_WORDS = [
  "cv",
  "projects"
]

let RESUME_POSITIVE_WORDS = [
  "my",
  "personal", "personalized",
]
