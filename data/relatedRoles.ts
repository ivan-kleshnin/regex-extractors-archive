export const stemRoles = new Set(["Analyst", "Architect", "Engineer", "Researcher", "Scientist"])
export const engineeringRoles = new Set(["Architect", "Engineer"])
export const designRoles = new Set(["Designer"]) // humanitarian?
export const managementRoles = new Set(["Manager"])

export const relatedRolesForSkillBorrowing: Dict<string[]> = {
  Analyst: ["Analyst", "Architect", "Engineer", "Researcher", "Scientist"],
  Architect: ["Analyst", "Architect", "Engineer", "Researcher", "Scientist"],
  Engineer: ["Analyst", "Architect", "Engineer", "Researcher", "Scientist"],
  Designer: ["Designer"],
  Lead: ["Lead"],
  Manager: ["Manager"],
  Researcher: ["Analyst", "Architect", "Engineer", "Researcher", "Scientist"],
  Scientist: ["Analyst", "Architect", "Engineer", "Researcher", "Scientist"],
}

// export const relatedRolesForDeduplication: Dict<string[]> = {
//   Analyst: ["Analyst", "Researcher", "Scientist"],
//   Architect: ["Architect"],
//   Engineer: ["Engineer", "Architect"],
//   Designer: ["Designer"],
//   Lead: ["Lead"],
//   Manager: ["Manager"],
//   Researcher: ["Analyst", "Researcher", "Scientist"],
//   Scientist: ["Scientist"],
// }

// "key" consumes its "value"s
export const relatedRolesForConsumption: Dict<string[]> = {
  Analyst: ["Analyst"],
  Architect: ["Architect", "Engineer"],
  Designer: ["Designer"],
  Engineer: ["Engineer"],
  Lead: ["Lead"],
  Manager: ["Manager"],
  Scientist: ["Scientist"],
}
