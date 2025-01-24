import {TitleFormatter} from "../TitleFormatter"

const formatTitle = new TitleFormatter().formatTitle

// TODO move to tests...

console.log(
  formatTitle({
    competences: [{skill: "", role: "Engineer"}],
    specializations: [],
  }), // "Engineer" -- just role case
)

console.log(
  formatTitle({
    competences: [{skill: "", role: "Analyst"}],
    specializations: [],
  }), // "Analyst" -- just role case
)

console.log(
  formatTitle({
    competences: [{skill: "PHP", role: "Engineer"}],
    specializations: [],
  }), // "PHP Developer"
)

console.log(
  // Technically it works, semantically it's an unexpected input (Developers must be unified to Engineers first)
  formatTitle({
    competences: [{skill: "Frontend", role: "Developer"}],
    specializations: [],
  }), // "Frontend Developer"
)

console.log(
  formatTitle({
    competences: [{skill: "Business", role: "Analyst"}],
    specializations: [],
  }), // "Business Analyst"
)

console.log(
  formatTitle({
    competences: [{skill: "QA", role: ""}],
    specializations: [],
  }), // "QA" -- just skill case
)

console.log(
  formatTitle({
    competences: [
      {skill: "Frontend", role: "Engineer"},
      {skill: "", role: "Architect"},
      {skill: "", role: "Analyst"}
    ],
    specializations: [],
    company: "Facebook"
  }),
  // "Frontend Engineer / Architect / Analyst @ Facebook"
)

console.log(
  formatTitle({
    competences: [
      {skill: "QA", role: "Engineer"},
      {skill: "Automation", role: "Engineer"},
      {skill: "", role: "Architect"},
      {skill: "", role: "Analyst"}
    ],
    specializations: [],
    company: "Facebook"
  })
  // "QA Engineer / Automation Engineer / Architect / Analyst @ Facebook"
)
