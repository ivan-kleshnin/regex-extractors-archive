import {A} from "lib/belt"

export type RoleCategory = {
  obviousSkills: string[]
}

// Might be unnecessary if we support "just Manager", "just Scientist" specializations...
export const roleGroups: Dict<RoleCategory> = {
  Analyst: {
    obviousSkills: analystSkills(),
  },
  Architect: {
    obviousSkills: architectSkills(),
  },
  Designer: {
    obviousSkills: designerSkills(),
  },
  Engineer: {
    obviousSkills: engineerSkills(),
  },
  Manager: {
    obviousSkills: managerSkills(),
  },
  Scientist: {
    obviousSkills: scientistSkills(),
  },
}

export function analystSkills(...skills: string[]): string[] {
  return A.uniq(["Analytics", "Analysis", ...skills])
}

export function architectSkills(...skills: string[]): string[] {
  return engineerSkills("Architecture", "Software", ...skills)
}

export function designerSkills(...skills: string[]): string[] {
  return A.uniq(["Design", ...skills])
}

export function engineerSkills(...skills: string[]): string[] {
  return A.uniq(["Development", "Engineering", "Tech", ...skills])
}

export function managerSkills(...skills: string[]): string[] {
  return A.uniq(["Management", ...skills])
}

export function scientistSkills(...skills: string[]): string[] {
  return analystSkills("Research", "Science", ...skills)
}
