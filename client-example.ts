// Copied from pipes-github/enrich/...

import {
  ClaimExtractor, ClaimInterpreter,
  roleTable,
  seniorityTable, ShortcutExtractor,
  shortcutTable,
  skillTable, stopTable,
  TermExtractor
} from "lib/extractors"

let claimExtractor = new ClaimExtractor({
  seniorityExtractor: new TermExtractor(seniorityTable, [skillTable, roleTable, shortcutTable]),
  roleExtractor: new TermExtractor(roleTable),
  skillExtractor: new TermExtractor(skillTable, [roleTable, shortcutTable]),
  shortcutExtractor: new ShortcutExtractor(shortcutTable, [roleTable, seniorityTable, skillTable]),
  stopExtractor: new TermExtractor(stopTable),
})

let claimInterpreter = new ClaimInterpreter({skillTable})
