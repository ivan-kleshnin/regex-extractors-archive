// import {skillTable} from "../taxonomy"
//
// console.log(
//   // skillTable.getNode("Automation"),
//   skillTable.getFlatNodes("Web").map(node => node.name),
//   skillTable.getFlatNodes("QA").map(node => node.name),
//   skillTable.getFlatNodes("Automation").map(node => node.name),
// )

import {ClaimExtractor} from "../ClaimExtractor"
import {ClaimInterpreter} from "../ClaimInterpreter"
import {ShortcutExtractor} from "../ShortcutExtractor"
import {TermExtractor} from "../TermExtractor"
import {normalizeText} from "../normalize"
import {
  deriveSpecializations,
  roleTable,
  seniorityTable,
  shortcutTable,
  skillTable,
  stopTable
} from "../taxonomy"
import {TitleFormatter} from "../TitleFormatter"

const seniorityExtractor = new TermExtractor(seniorityTable, [skillTable, roleTable, shortcutTable])
const roleExtractor = new TermExtractor(roleTable, [skillTable])
const skillExtractor = new TermExtractor(skillTable, [roleTable, shortcutTable])
const shortcutExtractor = new ShortcutExtractor(shortcutTable, [roleTable, seniorityTable, skillTable])
const stopExtractor = new TermExtractor(stopTable)

const claimsExtractor = new ClaimExtractor({
  seniorityExtractor,
  roleExtractor,
  skillExtractor,
  shortcutExtractor,
  stopExtractor,
})

const claimsInterpreter = new ClaimInterpreter({skillTable})
const tf = new TitleFormatter()
const context = "User"

// const sample = `aspiring security consultant`
const sample = `Web Development Expert`

const text = normalizeText(sample)

const claims = claimsExtractor.extractFromText(text, context)
const competences = claimsInterpreter.interpretCompetences(claims)
const specializations = deriveSpecializations(competences)
const title = tf.formatTitle({competences, specializations: []})
// const seniority = claimsInterpreter.interpretSeniority(claims)
// const skills = claimsInterpreter.interpretSkills(claims)
// const topics = skills.filter(skill => skillTable.get(skill)?.category == "topic")
// const isHireable = extractIsHireable(text)
// const moe = extractMOE(text)
// const specNodes = specializations.map(specialization => specTree.get(specialization)).filter(Boolean)
// const obviousSkills = specNodes.flatMap(node => node.obviousSkills)

console.log("text:", "'" + text + "'")
console.log("claims:", claims)
console.log("competences:", competences)
console.log("specializations:", specializations)
console.log("title:", title)
// console.log("seniority:", seniority)
// console.log("skills:", skills)
// console.log("interests:", A.difference(topics, obviousSkills))
// console.log("isHireable:", isHireable)
// console.log("MOE:", moe)


/*
const backendRows = skillTable.rows.filter(row => {
  return row.generalizeTo?.some(skill => skill == "Backend")
})
*/
