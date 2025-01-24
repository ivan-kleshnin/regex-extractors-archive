import autoBind from "auto-bind"
import type {Competence} from "./competence"
import {joinWords} from "./utils"

type FormatTitleProps = {
  competences: Competence[]
  specializations: string[]
  company?: string
  maxLen?: number
}

export class TitleFormatter {
  // skillTable: SkillTable

  constructor(/*skillTable: SkillTable*/) {
    autoBind(this)
    // this.skillTable = skillTable
  }

  formatTitle({competences, specializations, maxLen = 80}: FormatTitleProps): string {
    if (competences.length) {
      return this.formatTitleFromCompetences(competences, maxLen)
    } else if (specializations.length) {
      return this.formatTitleFromSpecializations(specializations, maxLen)
    } else {
      return ""
    }
  }

  protected formatTitleFromSpecializations(specializations: string[], maxLen: number): string {
    const pseudoCompetences = specializations.flatMap(specialization => {
      if (!specialization.includes(" ")) {
        return []
      }
      const words = specialization.split(" ")
      const prefix = words.slice(0, -1)
      const last = words.at(-1) || ""
      return {skill: prefix.join(" "), role: last}
    })
    return this.formatTitleFromCompetences(pseudoCompetences, maxLen)
  }

  protected formatTitleFromCompetences(competences: Competence[], maxLen: number): string {
    let n = Math.min(3, competences.length)
    while (n >= 1) {
      const initCompetences =  competences.slice(0, n)
      const title = initCompetences.map(competence => this.formatCompetence(competence)).join(" / ")
      const title_ = title + (competences.length > initCompetences.length ? " / ..." : "")
      if (title_.length < maxLen) {
        return title_
      } else {
        n -= 1
      }
    }
    return "Malformed Title"
  }

  protected formatCompetence({skill, role}: Competence): string {
    if (!skill && !role) {
      return ""
    } else if (!skill) {
      return role
    } else if (!role) {
      return skill
    }
    if (role == "Engineer") {
      if (engineerTopics.has(skill)) {
        return joinWords([skill, "Engineer"])
      } else {
        return joinWords([skill, "Developer"])
      }
    } else if (role == "Scientist") {
      if (scientistTopics.has(skill)) {
        return joinWords([skill, "Scientist"])
      } else {
        return joinWords([skill, "Researcher"])
      }
    } else {
      return joinWords([skill, role])
    }
  }
}

const engineerTopics = new Set([
  "Software",
  "Blockchain",
  "Data",
  "Machine Learning",
  "Game",
  "DevOps",
  "Embedded",
  "Game",
  "Mobile",
  "Automation",
  "QA",
  "Web",
  "Hardware",
  "Infrastructure",
  "Security",
  // Other are _developer_ topics
])

const scientistTopics = new Set([
  "Computer",
  "Data",
  // Other are _researcher_ topics
])
