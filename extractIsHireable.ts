// Use like `extractIsHireable(talent.bio) ?? talent.isHireable`

export function extractIsHireable(str: string): boolean | undefined {
  // 1. Prepare regexes
  const REGEXES = [RE1, RE2, RE3, RE4, RE5]

  const posRegex = REGEXES
    .join("|")
    .replace(/<not[1|2]>/g, "")
  const negRegex = [
    ...REGEXES.filter(m => /<not[1|2]>/.test(m)),
    "not for hire"
  ].join("|")
    .replace(/<not1>/g, "(not|non) ")
    .replace(/<not2>/g, "(not|never|can['’]t|don['’]t)( \\w+){0,2} ")

  // 2. Match negative regex
  const negMatch = str.match(new RegExp(negRegex, "i"))
  if (negMatch) {
    return false
  }

  // 3. Match positive regex
  const posMatch = str.match(new RegExp(posRegex, "i"))
  if (posMatch) {
    return true
  }

  // 4. Signal ambiguity
  return undefined
}

const opportunityRegexes = [
  "challenges?", "enquir(y|ies)", "hir(e|ing)", "ideas?",
  "internships?", "job", "offers?", "options?", "opportunit(y|ies)",
  "position", "possibilit(y|ies)", "proposals?", "relocation", "roles?", "work",
]

const OPP_NOUNS = "(" + opportunityRegexes.join("|") + ")"
const _EXTRA_WORDS = `(?: [\\w#+-/]+){0,3}`

const RE1 = `<not1>(open(ed)?|ready) (for|to)${_EXTRA_WORDS} ${OPP_NOUNS}`
const RE2 = `<not1>(seeking|looking( for)?)${_EXTRA_WORDS} ${OPP_NOUNS}`
const RE3 = "(i['’]m|i am|he['’]s|he is) <not1>hire? ?able"
const RE4 = "(^[^\\w]*<not1>hire ?able[^\\w]*$|\\. <not1>hire? ?able\\.)"
const RE5 = "<not2>hir(e|ing) me"

// Currently open to remote / relocated job offers. -> hireable
// I am opened to remote job offers
