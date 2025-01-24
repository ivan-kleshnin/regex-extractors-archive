import {A, F} from "lib/belt"
import autoBind from "auto-bind"
import {cleanClaim} from "./ClaimExtractor"
import {
  type Competence, knownCompetenceRolesSet,
  knownCompetenceSkillsSet, knownCompetencesSet
} from "./competence"
import {relatedRolesForConsumption, relatedRolesForSkillBorrowing,} from "./data"
import {seniorityStopWords} from "./extractMOE"
import {SkillTable} from "./Table"
import {skillTable} from "./taxonomy"
import {type Claim, joinWords} from "./utils"

type ClaimInterpreterProps = {
  skillTable: SkillTable
}

export class ClaimInterpreter {
  skillTable: SkillTable

  constructor({skillTable}: ClaimInterpreterProps) {
    autoBind(this)
    this.skillTable = skillTable
  }

  interpretCompetences(claims: Claim[]): Competence[] {
    claims = claims.map(claim => this.magicHandler(claim))
    if (!claims.some(claim => claim.role)) {
      const allSkills = claims.flatMap(claim => claim.skills)
      const allRoles = A.uniq(this.generalizeRoles(allSkills).map(claim => claim.role))
      if (allRoles.length == 1) {
        // Intentionally narrow condition for now, can be expanded in the future
        claims = claims.map(claim => cleanClaim({...claim, role: allRoles[0]}))
      }
    }

    const competences = claims.flatMap((claim, i) => {
      const prevClaim = i >= 1 ? claims[i - 1] : undefined
      const canBorrowSkills = (
        claim.role && !claim.seniorities.length &&
        prevClaim?.role && areRolesRelatedForSkillBorrowing(claim.role, prevClaim.role)
      )
      const skills = (
        claim.skills.length ? claim.skills :
        canBorrowSkills ? prevClaim.skills : []
      )
      const isExpertEnthusiast = claim.role == "Enthusiast" && i == 0
      const isExpertWithSeniority = !knownCompetenceRolesSet.has(claim.role) && claim.seniorities.length

      if (claim.role == "Lead") {
        const leadCompetences = this.deriveCompetences(skills, "Lead").filter(c => c.role)
        const unusedSkills = skills.filter(skill => !leadCompetences.some(c => c.skill == skill))
        return A.uniq([
          ...leadCompetences,
          ...this.deriveCompetences(unusedSkills, "")
        ])
      } else if (claim.role == "Expert" || isExpertEnthusiast || isExpertWithSeniority) {
        return this.generalizeRoles(skills)
      } else if (claim.role) {
        return this.deriveCompetences(skills, claim.role)
      } else {
        return this.deriveCompetences(skills, "")
      }
    })

    return this.dropExcessiveCompetences(competences)
  }

  interpretSkills(claims: Claim[]): string[] {
    return A.uniq(
      claims.flatMap(claim => {
        if (!claim.skills) {
          return []
        }
        return claim.skills
      })
    )
  }

  interpretSeniority(claims: Claim[]): string | undefined {
    const claimedSeniorities = A.uniq(
      claims.flatMap(claim => {
        if (claim.role == "Student" || claim.role == "Intern") { // Undergrad
          return []
        } else {
          return claim.seniorities
        }
      })
    )
    const seniority = claimedSeniorities.length >= 2 ? undefined : claimedSeniorities[0]
    return seniority && !seniorityStopWords.has(seniority)
      ? seniority
      : undefined
  }

  protected magicHandler(claim: Claim): Claim {
    return {
      ...claim,
      skills: this.magicHandlerForSkills(claim.skills),
      role: this.magicHandlerForRole(claim.role, claim.skills),
    }
  }

  protected magicHandlerForRole(role: string, skills: string[]): string {
    if (role == "Designer") {
      if (A.intersection(skills, ["Software", "Hardware", "System"]).length) {
        // "Software Designer" => "Software Engineer" (don't add "Design" skill which will be generalized back to "Designer")
        // ...
        return "Engineer"
      }
    }
    return role
  }

  protected magicHandlerForSkills(skills: string[]): string[] {
    skills = [...skills]
    if (skills.includes("Design")) {
      if (A.intersection(skills, ["Software", "Hardware", "System"]).length) {
        skills = A.removeFirst(skills, "Design")
      }
    }
    return skills
  }

  // TODO how to handle "Design Team Lead", "Engineering Tech Lead"...
  protected deriveCompetences(skills: string[], role: string): Competence[] {
    const competences = skills.flatMap(skill => {
      const competenceStr = joinWords([skill, role])
      const isKnownCompetence = knownCompetencesSet.has(competenceStr)
      const isKnownSkill = knownCompetenceSkillsSet.has(skill)
      if (isKnownCompetence) {
        return [{skill, role}]
      } else if (isKnownSkill) {
        return [{skill, role: ""}]
      } else {
        return []
      }
    })

    if (competences.some(c => c.role == role)) {
      return competences
    } else {
      const isKnownRole = knownCompetenceRolesSet.has(role)
      if (isKnownRole) {
        competences.push({skill: "", role})
      }
      return competences
    }
  }

  protected generalizeRoles(skills: string[]): Competence[] {
    const competences = skills.flatMap(skill => {
      const skillRow = skillTable.getRow(skill)
      return skillRow?.role ? this.deriveCompetences(
        [skill], // [partialCompetence.dropSkill ? "" : skill],
        skillRow.role
      ) : (knownCompetenceSkillsSet.has(skill) ? [{skill, role: ""}] : [])
    })

    const foundRoles = A.uniq(competences.flatMap(({role}) => role ? [role] : []))
    return competences.flatMap(competence => {
      if (competence.role) {
        return [competence]
      }
      // "Mobile Android Expert" -> ["Android Engineer", "Mobile Engineer"]
      const moreCompetences = foundRoles.flatMap(role => this.deriveCompetences(skills, role))
      return moreCompetences.length ? moreCompetences : [competence]
    })
  }

  protected dropExcessiveCompetences(competences: Competence[]): Competence[] {
    /*
    competences = [
      {skill: "Mobile", role: "Engineer"}, -- kept
      {skill: "", role: "Engineer"}, -- dropped
      {skill: "Mobile", role: ""}, -- dropped
      {skill: "Mobile", role: "Architect"}, -- kept
      {skill: "", role: "Architect"}, -- dropped
      {skill: "Mobile", role: ""}, -- dropped
      {skill: "PHP", role: ""}, -- kept
      {skill: "", role: "Analyst"}, -- kept
    ] -- order is irrelevant:
    */
    return competences.filter((competence, i) => {
      return !competences.some((otherCompetence, j) => {
        // Find at least one reason to drop: `return true` drops `competence`
        if (i == j) {
          return false // ignore self reference
        }
        if (F.equals(competence, otherCompetence)) {
          return j > i // drop second+ `competence` duplicates (to avoid `A.uniq` on occasion)
        }
        return firstIsLarger(otherCompetence, competence)
      })
    })
  }
}

function firstIsLarger(c1: Competence, c2: Competence): boolean {
  /*
  RULE: `c1` is larger IFF `c2 - exp(c1) = ∅` => `c1` is effectively a superset of `c2` => `c2` can be dropped
  EXAMPLES:
  c1=[Architect], c2=[Engineer]         -> [Engineer] - [Architect Engineer]         => true
  c1=[Mobile Engineer], c2=[Engineer]   -> [Engineer] - [Mobile Engineer]            => true
  c1=[Mobile Architect], c2=[Architect] -> [Architect] - [Mobile Engineer Architect] => true
  c1=[Mobile Architect], c2=[Engineer]  -> [Engineer] - [Mobile Engineer Architect]  => true
  c1=[Mobile Engineer], c2=[Mobile]     -> [Mobile] - [Mobile Engineer]              => true
  c1=[Mobile Architect], c2=[Mobile]    -> [Mobile] - [Mobile Engineer Architect]    => true
  c1=[Architect], c2=[Mobile]           -> [Mobile] - [Engineer, Architect]          => false
  c1=[Mobile], c2=[Architect]           -> [Engineer Architect] - [Mobile]           => false
  c1=[Mobile], c2=[Engineer]            -> [Engineer] - [Mobile]                     => false
  c1=[Engineer], c2=[Architect]         -> [Architect] - [Engineer]                  => false
  c1=[Engineer], c2=[Mobile Engineer]   -> [Mobile Engineer] - [Engineer]            => false
  c1=[Architect], c2=[Mobile Engineer]  -> [Mobile Engineer] - [Architect Engineer]  => false
  c1=[Architect], c2=[Mobile Architect] -> [Mobile Architect] - [Architect Engineer] => false
  c1=[Engineer], c2=[Mobile Architect]  -> [Mobile Architect] - [Engineer]           => false
  c1=[Mobile], c2=[Mobile Engineer]     -> [Mobile Engineer] - [Mobile]              => false
  c1=[Mobile], c2=[Mobile Architect]    -> [Mobile Architect] - [Mobile]             => false
  c1=[Mobile Engineer], c2=[Architect]  -> [Architect] - [Mobile Engineer]           => false
  */
  const expandedFirst = [c1.skill, ...(relatedRolesForConsumption[c1.role] || [])].filter(Boolean)
  const second = [c2.skill, c2.role].filter(Boolean)
  return !A.difference(second, expandedFirst).length
}

function areRolesRelatedForSkillBorrowing(roleA: string, roleB: string): boolean {
  if (roleA == roleB) {
    return true
  }
  return (relatedRolesForSkillBorrowing[roleA] || []).includes(roleB) || (relatedRolesForSkillBorrowing[roleB] || []).includes(roleA)
}
