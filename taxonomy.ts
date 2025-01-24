import {A} from "lib/belt"
import type {Competence} from "./competence"
import {
  rawRoleTable,
  rawSeniorityTable,
  rawSkillTable,
  rawStopTable
} from "./data"
import {rawShortcutTable} from "./data/shortcutTable"
import {specializationGroups} from "./specializations"
import {RoleTable, ShortcutTable, SkillTable, TermTable} from "./Table"
import {joinWords} from "./utils"

// TABLES
export const stopTable = new TermTable(rawStopTable)
export const seniorityTable = new TermTable(rawSeniorityTable)
export const skillTable = new SkillTable(rawSkillTable)
export const roleTable = new RoleTable(rawRoleTable)
export const shortcutTable = new ShortcutTable(rawShortcutTable)

// TREES
export function deriveSpecializations(competences: Competence[]): string[] {
  return Object.entries(specializationGroups).flatMap(([role, categories]) => {
    const result: string[] = []
    for (const [specName, category] of Object.entries(categories)) {
      const predicate = category.predicate.bind(category.predicate)
      if (predicate(competences)) {
        result.push(joinWords([specName, role]))
      }
    }
    return A.uniq(result)
  })
}
