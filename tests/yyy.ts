import {roleGroups} from "../roles"
import {specializationGroups} from "../specializations"
import {deriveSpecializations} from "../taxonomy"

// console.log(
//   deriveSpecializations([
//     {skill: "Solution", role: "Architect"},
//     {skill: "Cloud", role: "Engineer"},
//   ])
// )

console.log(
  deriveSpecializations([
    {skill: 'DevOps', role: 'Engineer' },
    {skill: 'Security', role: ''}
  ])
)

console.log(
  specializationGroups["Analyst"]["Business"].obviousSkills
)

console.log(
  specializationGroups["Manager"]["Product"].obviousSkills
)

console.log(
  roleGroups["Manager"].obviousSkills
)

// console.log(
//   deriveSpecializations([
//     {skill: "Native iOS", role: "Engineer"},
//   ])
// )
//
// console.log(
//   deriveSpecializations([
//     {skill: "DevOps", role: "Engineer"},
//   ])
// )
//
// console.log(
//   deriveSpecializations([
//     {skill: "Cloud", role: "Engineer"},
//   ])
// )
//
// console.log(
//   deriveSpecializations([
//     {skill: "Data", role: "Engineer"},
//   ])
// )
//
// console.log(
//   deriveSpecializations([
//     {skill: "ETL", role: "Engineer"},
//   ])
// )
//
// console.log(
//   deriveSpecializations([
//     {skill: "Android", role: "Engineer"}
//   ])
// )
//
// console.log(
//   deriveSpecializations([
//     {skill: "Android", role: "Engineer"},
//     {skill: "Flutter", role: "Engineer"},
//   ])
// )

// console.log(
//   deriveSpecializations([
//     {skill: "UE5", role: "Engineer"},
//   ])
// )

/*
  skillTable -> определяет термины (скиллы) и таблицу Engineer vs Designer vs ... для непонятных случаев (для Экспертов)

  ^ ClaimExtractor -> Claim[] -- это наборы слов (скиллы и роли) условно в оригинальном порядке
  ^ ClaimInterpreter -> Competence[] -- это связки ролей и скиллов в более очищенном виде
  ^ specializationPredicates + deriveSpecializations -> Specialization[] -- это уже специализации в том
  виде в котором они представлены в дереве, плюс/минус
*/
