type Row = {
  pattern: string
}

export const rawRoleTable: Dict<Row> = {
  "Administrator": {pattern: "administrator"},
  "Analyst": {pattern: "analyst"},
  "Architect": {pattern: "architect"},
  "Consultant": {pattern: "consultant"},
  "Designer": {pattern: "designer"},
  "Engineer": {pattern: "eng[ie]neer, programmer, coder, developer, !dev"},
  "Enthusiast": {pattern: "enthusiast, hobbyist, enjoyer, interested in"},
  "Expert": {pattern: "expert, specialist, guru, evangelist, ninja, wizard, M.?Sc, B.?Sc"},
  // ^ "MS.?", "BS.?" variants are intentionally omitted as ambiguous
  "Intern": {pattern: "intern, trainee"},
  "Lead": {pattern: "leader, lead"},
  "Manager": {pattern: "manager"},
  "Student": {pattern: "student, grader, beginner, studying, novice, newbie, wannabe"}, // Undergrad
  "Scientist": {pattern: "scientist, researcher"},
  // TODO "advocate", "freak" (rare)
  // aff?ici[oa]nado, connoisseur, hobbyist
  // TODO consultant, hacker, freelancer, coach, mentor, teacher, trainer
  // TODO founder practitioner, generalist
}

// TODO disambiguate "Manager" from "Tag Manager" with custom function?!
