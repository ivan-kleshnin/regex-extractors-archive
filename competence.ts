import {A} from "lib/belt"
import {roleGroups} from "./roles"
import {SkillTable} from "./Table"
import {skillTable} from "./taxonomy"
import {joinWords} from "./utils"

// HELPERS -----------------------------------------------------------------------------------------

export type Competence = {skill: string, role: string}

function deriveFromGeneralized(skillTable: SkillTable, role: string): [string[], string[], string[]] {
  const roleEntries = Object.entries(skillTable.rows).filter(([_, row]) => row.role == role)
  const topics = A.difference(
    roleEntries.flatMap(([name, row]) => row.category == "topic" ? [name] : []),
    roleGroups[role]?.obviousSkills || []
  )
  const langs = roleEntries.flatMap(([name, row]) => row.category == "lang" ? [name] : [])
  const platforms = roleEntries.flatMap(([name, row]) => row.category == "platform" ? [name] : [])
  return [topics, langs, platforms]
}

// COMPETENCES -------------------------------------------------------------------------------------

// ANALYST
const [analystTopics, analystLangs, analystPlatforms] = deriveFromGeneralized(skillTable, "Analyst")
analystTopics.push(...["Business", "Data", "Marketing", "Security"])

export const analystSkillsArr = [...analystTopics, ...analystLangs, ...analystPlatforms]
export const analystSkillsSet = new Set(analystSkillsArr)

export const analystCompetencesArr = analystSkillsArr.map(skill => ({skill, role: "Analyst"}))
export const analystCompetencesSet = new Set(analystCompetencesArr.map(c => joinWords([c.skill, c.role])))

// ARCHITECT
const architectTopics = [
  "AWS", "Azure", "Backend", "Blockchain", "Cloud", "Data", "Database", "DevOps",
  "Frontend", "GCP", "Hardware", "Mobile", "Security", "Software", "Solution", "System", "Web"
]

export const architectSkillsArr = [...architectTopics]
export const architectSkillsSet = new Set(architectSkillsArr)

export const architectCompetencesArr = architectSkillsArr.map(skill => ({skill, role: "Architect"}))
export const architectCompetencesSet = new Set(architectCompetencesArr.map(c => joinWords([c.skill, c.role])))

// ENGINEER & DEVELOPER
const [engineerTopics, engineerLangs, engineerPlatforms] = deriveFromGeneralized(skillTable, "Engineer")
engineerTopics.push(...["Data", "Database", "Deep Learning", "Game", "Machine Learning", "Mobile", "NLP", "Security", "Web"])
engineerLangs.push(...["R", "SQL"])
engineerPlatforms.push(...["Pandas"])

export const engineerSkillsArr = [...engineerTopics, ...engineerLangs, ...engineerPlatforms]
export const engineerSkillsSet = new Set(engineerSkillsArr)

export const engineerCompetencesArr = engineerSkillsArr.map(skill => ({skill, role: "Engineer"}))
export const engineerCompetencesSet = new Set(engineerCompetencesArr.map(c => joinWords([c.skill, c.role])))

// DESIGNER
const designerTopics = ["3D", "Graphic", "Mobile", "Product", "UI/UX", "Web"]

export const designerSkillsArr = [...designerTopics]
export const designerSkillsSet = new Set(designerSkillsArr)

export const designerCompetencesArr = designerSkillsArr.map(skill => ({skill, role: "Designer"}))
export const designerCompetencesSet = new Set(designerCompetencesArr.map(c => joinWords([c.skill, c.role])))

// LEAD
const leadTopics = ["Team", "Tech"]

export const leadSkillsArr = [...leadTopics]
export const leadSkillsSet = new Set(leadSkillsArr)

export const leadCompetencesArr = leadSkillsArr.map(skill => ({skill, role: "Lead"}))
leadCompetencesArr.push({skill: "", role: "Lead"})
export const leadCompetencesSet = new Set(leadCompetencesArr.map(c => joinWords([c.skill, c.role])))

// MANAGER
const managerTopics = ["Engineering", "Product", "Project"]

export const managerSkillsArr = [...managerTopics]
export const managerSkillsSet = new Set(managerSkillsArr)

export const managerCompetencesArr = managerSkillsArr.map(skill => ({skill, role: "Manager"}))
managerCompetencesArr.push({skill: "", role: "Manager"})
export const managerCompetencesSet = new Set(managerCompetencesArr.map(c => joinWords([c.skill, c.role])))

// SCIENTIST & RESEARCHER
const scientistTopics = [
  "Computer", "Data",
  "Deep Learning", "Machine Learning",
  "NLP", "Security", "Vulnerability",
]

export const scientistSkillsArr = [...scientistTopics]
export const scientistSkillsSet = new Set(scientistSkillsArr)

export const scientistCompetencesArr = scientistSkillsArr.map(skill => ({skill, role: "Scientist"}))
scientistCompetencesArr.push({skill: "", role: "Scientist"})
export const scientistCompetencesSet = new Set(scientistCompetencesArr.map(c => joinWords([c.skill, c.role])))

// ALL
export const knownCompetencesArr = [
  ...analystCompetencesArr,
  ...architectCompetencesArr,
  ...designerCompetencesArr,
  ...engineerCompetencesArr,
  ...leadCompetencesArr,
  ...managerCompetencesArr,
  ...scientistCompetencesArr,
]
export const knownCompetencesSet = new Set(knownCompetencesArr.map(c => joinWords([c.skill, c.role])))
export const knownCompetenceSkillsSet = new Set(knownCompetencesArr.map(c => c.skill))
export const knownCompetenceRolesSet = new Set(knownCompetencesArr.map(c => c.role))

// export const rawSpecializationTree: SpecNode = {
//   name: "",
//   obviousSkills: [],
//   children: [
//     {
//       name: "Engineer",
//       obviousSkills: ["Engineering", "Tech"],
//       children: [
//         {
//           name: "Software Engineer",
//           aliases: ["Technical Architect", "Application Architect"], // "Architect" implies "Principal" seniority
//           obviousSkills: ["Development", "Programming", "Software"],
//           children: [
//             {
//               name: "Security Engineer", obviousSkills: ["Security"]
//             },
//             {
//               name: "Data Engineer", obviousSkills: ["Data"]
//             },
//             {
//               name: "Mobile Engineer",
//               aliases: ["Mobile Architect"],
//               obviousSkills: ["Mobile"],
//               children: [
//                 {name: "iOS Engineer", obviousSkills: ["Apple", "iOS"]},
//                 {name: "Android Engineer", obviousSkills: ["Android"]},
//               ],
//             },
//             {
//               name: "Web Engineer",
//               obviousSkills: ["Web"],
//               children: [
//                 {
//                   name: "Frontend Engineer",
//                   aliases: ["Frontend Architect"], // "Architect" implies "Principal" seniority
//                   obviousSkills: ["Frontend"]
//                 },
//                 {
//                   name: "Backend Engineer",
//                   aliases: ["Backend Architect"], // "Architect" implies "Principal" seniority
//                   obviousSkills: ["Backend"]
//                 },
//               ]
//             },
//             {name: "Game Engineer", obviousSkills: ["Game"]},
//             {
//               name: "QA Engineer",
//               obviousSkills: ["QA", "Testing"],
//               children: [
//                 {name: "QA Automation Engineer", obviousSkills: ["Automation"]},
//                 {name: "QA Manual Engineer", obviousSkills: ["Manual"]},
//               ]
//             },
//             {
//               name: "DevOps Engineer",
//               aliases: ["Cloud Engineer", "DevOps Architect"], // "Architect" implies "Principal" seniority
//               obviousSkills: ["Cloud", "DevOps"]
//             },
//             {
//               name: "Blockchain Engineer",
//               aliases: ["Crypto Engineer", "Blockchain Architect"], // "Architect" implies "Principal" seniority
//               // candidate: "Smart Contract Developer"
//               obviousSkills: ["Blockchain", "Crypto"]
//             },
//             {name: "IoT Engineer", obviousSkills: ["IoT"]},
//           ]
//         },
//         {
//           name: "Embedded Engineer",
//           aliases: ["Firmware Engineer"],
//           obviousSkills: ["Embedded"],
//         },
//         {
//           name: "Hardware Engineer", obviousSkills: ["Hardware"],
//         },
//       ]
//     },
//     //
//     // {
//     //   name: "Data Expert",
//     // },
//     //
//     // {
//     //   name: "Security Expert",
//     // },
//
//     {
//       name: "Architect",
//       obviousSkills: ["Architecture", "Application", "Software", "Engineering"],
//       children: [
//         {
//           name: "Solution Architect", // raw results: 12k on Github
//           aliases: ["Enterprise Architect"],
//           obviousSkills: ["Solution", "Enterprise"]
//         },
//         {
//           name: "System Architect", // raw results: 2.7k on Github
//           aliases: ["Cloud Architect"],
//           obviousSkills: ["System", "Cloud"]
//         },
//         {
//           name: "Software Architect", // raw results: 10.4k on Github
//           obviousSkills: []
//         },
//         {
//           name: "Security Architect", // raw results: 1.1k on Github
//           obviousSkills: ["Security"]
//         },
//       ]
//     },
//
//     {
//       name: "Designer",
//       obviousSkills: ["Design"],
//       children: [
//         {name: "Animation Designer", obviousSkills: ["Animation"]},
//         {name: "3D Designer", obviousSkills: ["3D"]},
//         {name: "Font Designer", obviousSkills: ["Font", "Typography"]},
//         {name: "Graphic Designer", obviousSkills: ["Graphic"]},
//         {name: "Product Designer", obviousSkills: ["Product"]},
//         {name: "Game Designer", obviousSkills: ["Game"], children: [
//           {name: "Level Designer", obviousSkills: ["Level"]}
//         ]},
//         {
//           name: "UI/UX Designer",
//           obviousSkills: ["UI/UX"],
//           children: [
//             {name: "Mobile Designer", obviousSkills: ["Mobile"]},
//             {name: "Web Designer", obviousSkills: ["Web"]},
//           ]
//         },
//       ],
//     },
//
//     {
//       name: "Lead",
//       isParallel: true,
//       obviousSkills: ["Leadership"],
//       children: [
//         {name: "Engineering Lead", obviousSkills: ["Engineering"]},
//         // "Engineering Lead" should be an alias of "Tech Lead"?!
//         {name: "Team Lead", obviousSkills: ["Team"]},
//         {name: "Tech Lead", obviousSkills: ["Tech"]},
//       ]
//     },
//
//     {
//       name: "Manager",
//       obviousSkills: ["Management"],
//       children: [
//         {
//           name: "Engineering Manager",
//           aliases: ["Software Manager", "Development Manager"],
//           obviousSkills: ["Engineering", "Development"]
//         },
//         // 2. R&D Manager, Tech Lead Manager, R&D Team Lead, IT Manager, Dev manager, Software Development Manager, SW Development Manager  -> Engineering Manager
//         {name: "Product Manager", obviousSkills: ["Product"]},
//         {name: "Project Manager", obviousSkills: ["Project"]},
//         {name: "Marketing Manager", obviousSkills: ["Marketing"]},
//         {name: "Sales Manager", obviousSkills: ["Sales"]},
//       ]
//     },
//   ]
// }

// "Network Engineer" seems to be parallel to "Software Engineer" and "Hardware Engineer"
