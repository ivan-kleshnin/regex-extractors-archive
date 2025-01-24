import type {Competence} from "./competence"
import {deriveSpecializations} from "./taxonomy"

describe("deriveSpecializations()", () => {
  function expected(competences: Competence[]) {
    return expect(deriveSpecializations(competences))
  }

  describe("handles simple competence", () => {
    it("handles {role} competence", () => {
      expected([{skill: "", role: "Analyst"}]).toEqual([])
      expected([{skill: "", role: "Architect"}]).toEqual([])
      expected([{skill: "", role: "Designer"}]).toEqual([])
      expected([{skill: "", role: "Engineer"}]).toEqual([])
      expected([{skill: "", role: "Lead"}]).toEqual([])
      expected([{skill: "", role: "Manager"}]).toEqual([])
      expected([{skill: "", role: "Researcher"}]).toEqual([])
      expected([{skill: "", role: "Scientist"}]).toEqual([])
    })

    it("handles {skill} competence", () => {
      expected([{skill: "Software", role: ""}]).toEqual([])
      expected([{skill: "Web", role: ""}]).toEqual([])
      expected([{skill: "Backend", role: ""}]).toEqual([])
      expected([{skill: "PHP", role: ""}]).toEqual([])
    })
  })

  describe("handles complex competence", () => {
    it("handles {skill} + Engineer", () => {
      expected([{skill: "Software", role: "Engineer"}]).toEqual(["Software Engineer"])
      // expected([{skill: "Web", role: "Engineer"}]).toEqual(["Web (Generalist) Engineer"])
      expected([{skill: "Web", role: "Engineer"}]).toEqual(["Web Engineer"])
      // expected([{skill: "Backend", role: "Engineer"}]).toEqual(["Backend Engineer"])
      expected([{skill: "Backend", role: "Engineer"}]).toEqual(["Web Engineer"])
      // expected([{skill: "PHP", role: "Engineer"}]).toEqual(["Backend Engineer"])
      expected([{skill: "PHP", role: "Engineer"}]).toEqual(["Web Engineer"])
      expected([{skill: "Java", role: "Engineer"}]).toEqual([])
      expected([{skill: "Python", role: "Engineer"}]).toEqual([])
      // expected([{skill: "Data", role: "Engineer"}]).toEqual(["Data Engineer"])
      expected([{skill: "Data", role: "Engineer"}]).toEqual(["Data & ML Engineer"])
      // expected([{skill: "Machine Learning", role: "Engineer"}]).toEqual(["Machine Learning Engineer"])
      expected([{skill: "Machine Learning", role: "Engineer"}]).toEqual(["Data & ML Engineer"])
      expected([{skill: "QA", role: "Engineer"}]).toEqual(["QA & Automation Engineer"])
      expected([{skill: "Automation", role: "Engineer"}]).toEqual(["QA & Automation Engineer"])
      expected([{skill: "Selenium", role: "Engineer"}]).toEqual(["QA & Automation Engineer"])
    })

    it("handles {skill} + Analyst", () => {
      expected([{skill: "Business", role: "Analyst"}]).toEqual(["Business Analyst"])
      expected([{skill: "Data", role: "Analyst"}]).toEqual(["Data Analyst"])
      expected([{skill: "Security", role: "Analyst"}]).toEqual(["Security Analyst"])
    })

    it("handles {skill} + Architect", () => {
      expected([{skill: "Software", role: "Architect"}]).toEqual(["Software Architect"])
      expected([{skill: "Solution", role: "Architect"}]).toEqual(["Solution Architect"])
      expected([{skill: "Cloud", role: "Architect"}]).toEqual(["Cloud Architect"])
    })

    it("handles skill + role for Manager", () => {
      expected([{skill: "Engineering", role: "Manager"}]).toEqual(["Engineering Manager"])
      expected([{skill: "Product", role: "Manager"}]).toEqual(["Product Manager"])
      expected([{skill: "Project", role: "Manager"}]).toEqual(["Project Manager"])
    })

    it("handles {skill} + Designer", () => {
      expected([{skill: "3D", role: "Designer"}]).toEqual(["3D Designer"])
      expected([{skill: "Graphic", role: "Designer"}]).toEqual(["Graphic Designer"])
      expected([{skill: "Product", role: "Designer"}]).toEqual(["Product Designer"])
    })

    // it("handles skill + role for Lead", () => {
    //   expected([{skill: "Team", role: "Lead"}]).toEqual([["Lead", "Team"]])
    //   expected([{skill: "Tech", role: "Lead"}]).toEqual([["Lead", "Tech"]])
    // })
    //
    // it("handles skill + role for Scientist", () => {
    //   expected([{skill: "Data", role: "Scientist"}]).toEqual([["Scientist", "Data"]])
    //   // TODO "Data Scientist" should be an alias for "DS Scientist"
    //   // or scientists should have their own `skillTable` with their own hierarchy...
    //   // @_@
    // })
  })

  describe("handles 2 competences", () => {
  //   it("handles Lead role", () => {
  //     expected([{skill: "Tech", role: "Lead"}, {skill: "Backend", role: ""}]).toEqual([
  //       ["Lead", "Tech"],
  //       ["Software", "Web", "Backend"],
  //     ])
  //
  //     expected([{skill: "Software", role: ""}, {skill: "Team", role: "Lead"}]).toEqual([
  //       ["Software"],
  //       ["Lead", "Team"],
  //     ])
  //   })

    it("handles Architect + {Skill}", () => {
      expected([
        {skill: "System", role: "Architect"},
        {skill: "AWS", role: ""}
      ]).toEqual(["System Architect"])

      expected([
        {skill: "System", role: "Architect"},
        {skill: "AWS", role: "Architect"},
      ]).toEqual(["Cloud Architect", "System Architect"])

      expected([
        {skill: "Software", role: ""},
        {skill: "Solution", role: "Architect"},
      ]).toEqual(["Solution Architect"])

      expected([
        {skill: "Software", role: "Architect"},
        {skill: "Solution", role: "Architect"}
      ]).toEqual(["Software Architect", "Solution Architect"])
    })

    it("handles {skill} + Architect, {skill}", () => {
      expected([
        {skill: "System", role: "Architect"},
        {skill: "AWS", role: ""}
      ]).toEqual(["System Architect"])
      expected([
        {skill: "Software", role: ""},
        {skill: "Solution", role: "Architect"},
      ]).toEqual(["Solution Architect"])
    })

    it("handles {skill} + Architect, {skill} + Architect", () => {
      expected([
        {skill: "System", role: "Architect"},
        {skill: "AWS", role: "Architect"},
      ]).toEqual(["Cloud Architect", "System Architect"])
      expected([
        {skill: "Software", role: "Architect"},
        {skill: "Solution", role: "Architect"}
      ]).toEqual(["Software Architect", "Solution Architect"])
    })

    it("handles {skill} + Architect, {skill} + Engineer", () => {
      expected([
        {skill: "System", role: "Architect"},
        {skill: "AWS", role: "Engineer"},
      ]).toEqual(["System Architect", "DevOps Engineer"])
      expected([
        {skill: "Software", role: "Engineer"},
        {skill: "Solution", role: "Architect"}
      ]).toEqual(["Solution Architect", "Software Engineer"])
    })
  })
})

// const mobileSamples = [
// //   // [
// //   //   {role: "Engineer", skill: "Android"},
// //   // ],
// //   // [
// //   //   {role: "Engineer", skill: "iOS"},
// //   // ],
// //   // [
// //   //   {role: "Engineer", skill: "Android"},
// //   //   {role: "Engineer", skill: "iOS"},
// //   // ],
// //   // [
// //   //   {role: "Engineer", skill: "Mobile"},
// //   // ],
// //   // [
// //   //   {role: "Engineer", skill: "Mobile"},
// //   //   {role: "Engineer", skill: "iOS"},
// //   // ],
// //   // [
// //   //   {role: "Engineer", skill: "Mobile"},
// //   //   {role: "Engineer", skill: "Android"},
// //   // ],
// //   // [
// //   //   {role: "Engineer", skill: "Mobile"},
// //   //   {role: "Engineer", skill: "Android"},
// //   //   {role: "Engineer", skill: "iOS"},
// //   // ],
// //   // [
// //   //   {role: "Engineer", skill: "Mobile"},
// //   //   {role: "Engineer", skill: "Flutter"},
// //   // ],
// //   // [
// //   //   {role: "Engineer", skill: "Mobile"},
// //   //   {role: "Engineer", skill: "Cordova"},
// //   // ],
// //   // [
// //   //   {role: "Engineer", skill: "Mobile"},
// //   //   {role: "Engineer", skill: "Flutter"},
// //   //   {role: "Engineer", skill: "Cordova"},
// //   // ],
// //   // [
// //   //   {role: "Engineer", skill: "Flutter"},
// //   //   {role: "Engineer", skill: "Cordova"},
// //   // ],
// //   // [
// //   //   {role: "Engineer", skill: "Flutter"},
// //   //   {role: "Engineer", skill: "Cordova"},
// //   // ],
// //   // [
// //   //   {role: "Engineer", skill: "Android"},
// //   //   {role: "Engineer", skill: "Flutter"},
// //   // ],
// //   // [
// //   //   {role: "Engineer", skill: "Flutter"},
// //   // ],
// //   [
// //     {role: "Engineer", skill: "Android"}, // we do not know whether it's Native or Cross-Platform developer
// //     {role: "", skill: "Flutter"},         // so skipping this one
// //   ],
// //   [
// //     {role: "Engineer", skill: "Flutter"}, // we do not know whether it's Native or Cross-Platform developer
// //     {role: "", skill: "Android"},         // so skipping this one
// //   ],
// //   // [
// //   //   {role: "Engineer", skill: "Mobile"},
// //   //   {role: "", skill: "Flutter"},
// //   // ],
// //   // [
// //   //   {role: "Engineer", skill: "Flutter"},
// //   // ],
// //   // [
// //   //   {role: "Engineer", skill: "Android"},
// //   // ],
// //
// //   // [{skill: "Mobile", role: ""}, {skill: "Android", role: "Engineer"}],
// //   [{skill: "Mobile", role: "Engineer"}, {skill: "Android", role: "Engineer"}],
//   [{skill: "Android", role: "Engineer"}, {skill: "Flutter", role: ""}],
//   // [{skill: "Native Android", role: "Engineer"}, {skill: "Flutter", role: ""}],
//   // [{skill: "Native Android", role: "Engineer"}, {skill: "Flutter", role: "Engineer"}],
//   // [{skill: "Native Android", role: ""}, {skill: "Flutter", role: "Engineer"}],
// ]
//
// const mobileTitles = ["Mobile Generalist", "Native Android", "Native iOS", "Cross-Platform", "Mobile/Web Hybrid"]
// for (const competences of mobileSamples) {
//   const mobileValues = mobileTitles.map(title => engineerPredicates[title](competences))
//   console.log("mobileValues:", mobileValues)
//   console.log(competences.map(c => (c.skill + " " + c.role).trim()))
//   console.log(mobileTitles.join(" | "))
//   console.log(A.zip(mobileTitles, mobileValues).map(([title, value]) => String(Number(value)).padStart(title.length)).join(" | "))
//   console.log()
// }
//
// // const webSamples = [
// //   [{skill: "", role: "Engineer"}],
// //
// //   [{skill: "Frontend", role: ""}], // -- "interested in Frontend", "learning Frontend" do not qualify for Specializations
// //   [{skill: "Frontend", role: "Engineer"}],
// //
// //   [{skill: "Frontend", role: "Engineer"}, {skill: "Web", role: ""}],
// //   [{skill: "Frontend", role: "Engineer"}, {skill: "Web", role: "Engineer"}],
// //   [{skill: "Frontend", role: "Engineer"}, {skill: "Fullstack", role: ""}],
// //   [{skill: "Frontend", role: "Engineer"}, {skill: "Fullstack", role: "Engineer"}],
// //
// //   [{skill: "React", role: "Engineer"}, {skill: "Web", role: ""}],
// //   [{skill: "React", role: "Engineer"}, {skill: "Web", role: "Engineer"}],
// //   [{skill: "React", role: "Engineer"}, {skill: "Fullstack", role: ""}],
// //   [{skill: "React", role: "Engineer"}, {skill: "Fullstack", role: "Engineer"}],
// //
// //   [{skill: "Fullstack", role: ""}],
// //   [{skill: "Fullstack", role: "Engineer"}],
// //   [{skill: "Web", role: ""}],
// //   [{skill: "Web", role: "Engineer"}],
// //
// //   // [{skill: "Web", role: "Engineer"}],
// //   // [{skill: "Backend", role: "Engineer"}],
// //   // [{skill: "Frontend", role: "Engineer"}, {skill: "Backend", role: "Engineer"}],
// //   // [{skill: "Fullstack", role: "Engineer"}],
// //   // [{skill: "Fullstack", role: "Engineer"}, {skill: "Backend", role: ""}],
// //   // [{skill: "Backend", role: "Engineer"}, {skill: "Fullstack", role: ""}],
// //   // [{skill: "Backend", role: "Engineer"}, {skill: "Fullstack", role: ""}, {skill: "Web", role: ""}],
// //
// //   // [{skill: "Web", role: ""}, {skill: "Backend", role: "Engineer"}],
// //   // [{skill: "Web", role: "Engineer"}, {skill: "Backend", role: "Engineer"}],
// //   // [{skill: "Fullstack", role: ""}, {skill: "Backend", role: ""}],
// //   // [{skill: "Fullstack", role: ""}, {skill: "Backend", role: "Engineer"}],
// //   // [{skill: "Fullstack", role: "Engineer"}, {skill: "Backend", role: ""}],
// //   // [{skill: "Fullstack", role: "Engineer"}, {skill: "Backend", role: "Engineer"}],
// //
// //   // [{skill: "Web", role: ""}, {skill: "Frontend", role: "Engineer"}],
// //   // [{skill: "Web", role: ""}, {skill: "Backend", role: "Engineer"}],
// //   // [{skill: "WordPress", role: "Engineer"}],
// //   // [{skill: "Web", role: ""}, {skill: "WordPress", role: "Engineer"}],
// //   // [{skill: "Frontend", role: ""}, {skill: "WordPress", role: "Engineer"}],
// // ]
// //
// // // const webTitles = ["Web Generalist", "Web Fullstack", "Web Frontend", "Web Backend", "Low-Code"]
// // // for (const competences of webSamples) {
// // //   const webValues = webTitles.map(title => engineerPredicates[title](competences))
// // //   console.log(competences.map(c => (c.skill + " " + c.role).trim()))
// // //   console.log(webTitles.join(" | "))
// // //   console.log(A.zip(webTitles, webValues).map(([title, value]) => String(Number(value)).padStart(title.length)).join(" | "))
// // //   console.log()
// // // }
