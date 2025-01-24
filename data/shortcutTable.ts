import {type DisambiguateShortOpts, disambiguateShortRole} from "../disambiguate"
import {ShortcutExtractor} from "../ShortcutExtractor"
import type {Claim} from "../utils"

type Row = {
  pattern: string
  skills?: string[]
  role?: string
  disambiguate?: (extractor: ShortcutExtractor, opts: DisambiguateShortOpts) => Claim | undefined
}

export const rawShortcutTable: Dict<Row> = {
  // "SSE": {seniorities: ["Senior"], specializations: ["Software"], roles: ["Engineer"]},
  // also "Stockholm School of Economics", "Server-Sent Events"...

  // Roles
  "Rubist": {pattern: "ruby?ist", skills: ["Ruby"], role: "Engineer"},
  "Pythonist": {pattern: "pythonista?", skills: ["Python"], role: "Engineer"},
  "Vimer": {pattern: "vimer", skills: ["Vim"], role: "Engineer"},
  "Gopher": {pattern: "gopher", skills: ["Go"], role: "Engineer"},
  "Rustacean": {pattern: "rustacean", skills: ["Rust"], role: "Engineer"},
  "PHPer": {pattern: "phper", skills: ["PHP"], role: "Engineer"},
  "JavaScripter": {pattern: "javascripter", skills: ["JavaScript"], role: "Engineer"},
  "Kubernaut": {pattern: "kubernaut", skills: ["Kubernetes", "DevOps"], role: "Engineer"},
  "Animator": {pattern: "animator", skills: ["Animation"], role: "Designer"},
  "Fullstacker": {pattern: "fullstacker", skills: ["Web"], role: "Engineer"},
  "Backender": {pattern: "backender", skills: ["Backend"], role: "Engineer"},
  "Frontender": {pattern: "frontender", skills: ["Frontend"], role: "Engineer"},

  "Software Engineer": {pattern: "!swe, !sde", skills: ["Software", "Engineering"], role: "Engineer", disambiguate: disambiguateShortRole},
  "QA-Manual": {pattern: "!manual=qa, !qa=manual", skills: ["QA", "Manual"], role: "Engineer", disambiguate: disambiguateShortRole},
  "QA-Automation": {pattern: "!automation-qa, !qa=automation, !aqa", skills: ["QA", "Automation"], role: "Engineer", disambiguate: disambiguateShortRole},
  "QA": {pattern: "tester, !qa=test, !quality=assurance, !qa", skills: ["QA"], role: "Engineer", disambiguate: disambiguateShortRole},
  "DevOps": {pattern: "!devops", skills: ["DevOps"], role: "Engineer", disambiguate: disambiguateShortRole},
  "DevSecOps": {pattern: "!devsecops", skills: ["DevOps", "Security"], role: "Engineer", disambiguate: disambiguateShortRole},
  "DataOps": {pattern: "!dataops", skills: ["Data"], role: "Engineer", disambiguate: disambiguateShortRole},
  "SecOps": {pattern: "!secops", skills: ["Security"], role: "Engineer", disambiguate: disambiguateShortRole},
  "SysOps": {pattern: "!sysops", skills: ["System"], role: "Administrator", disambiguate: disambiguateShortRole},
  "Team Lead": {pattern: "teamlead", skills: ["Team"], role: "Lead"},
  "Tech Lead": {pattern: "teamlead", skills: ["Team"], role: "Lead"},
  // Flawed disambiguation/tokenization logic prevents "game-dev", "data-dev", etc. to work without shortcuts:
  "Game-Dev": {pattern: "!game-dev", skills: ["Game", "Engineering"], role: "Engineer", disambiguate: disambiguateShortRole},
  "Data-Dev": {pattern: "!data-dev", skills: ["Data", "Engineering"], role: "Engineer", disambiguate: disambiguateShortRole},
  "Web-Dev": {pattern: "!web-dev", skills: ["Web", "Engineering"], role: "Engineer", disambiguate: disambiguateShortRole},
  "Mobile-Dev": {pattern: "!mobile-dev", skills: ["Web", "Engineering"], role: "Engineer", disambiguate: disambiguateShortRole},

  "MEAN Stack": {pattern: "mean=stack, !MEAN", skills: ["MongoDB", "Express", "Angular", "NodeJS"]},
  "MERN Stack": {pattern: "mern=stack, MERN", skills: ["MongoDB", "Express", "React", "NodeJS"]},
  "ELK Stack": {pattern: "elk=stack, ELK", skills: ["Elasticsearch", "Logstash", "Kibana"]},
}
