import {ClaimExtractor} from "./ClaimExtractor"
import {ClaimInterpreter} from "./ClaimInterpreter"
import type {Competence} from "./competence"
import {normalizeText} from "./normalize"
import {ShortcutExtractor} from "./ShortcutExtractor"
import {
  roleTable,
  seniorityTable,
  shortcutTable,
  skillTable,
  stopTable
} from "./taxonomy"
import {TermExtractor} from "./TermExtractor"

const extractor = new ClaimExtractor({
  stopExtractor: new TermExtractor(stopTable),
  skillExtractor: new TermExtractor(skillTable, [roleTable, shortcutTable]),
  roleExtractor: new TermExtractor(roleTable, [skillTable]),
  seniorityExtractor: new TermExtractor(seniorityTable, [skillTable, roleTable, shortcutTable]),
  shortcutExtractor: new ShortcutExtractor(shortcutTable, [roleTable, seniorityTable, skillTable]),
})

const interpreter = new ClaimInterpreter({skillTable})

describe("ClaimInterpreter()", () => {
  describe(".interpretSpecializations() in 'User' context", () => {
    function interpret(text: string): Competence[] {
      text = normalizeText(text)
      const claims = extractor.extractFromText(text, "User")
      return interpreter.interpretCompetences(claims)
    }
    function expected(text: string) {
      return expect(interpret(text))
    }

    describe("handles base cases", () => {
      it("handles {Role}", () => {
        expected("Lead").toEqual([{skill: "", role: "Lead"}])
        expected("Analyst").toEqual([{skill: "", role: "Analyst"}])
        expected("Architect").toEqual([{skill: "", role: "Architect"}])
        expected("Designer").toEqual([{skill: "", role: "Designer"}])
        expected("Engineer").toEqual([{skill: "", role: "Engineer"}])
        expected("Expert").toEqual([])
        expected("Manager").toEqual([{skill: "", role: "Manager"}])
        expected("Scientist").toEqual([{skill: "", role: "Scientist"}])
      })

      it("handles {Skill}", () => {
        expected("PHP").toEqual([{skill: "PHP", role: "Engineer"}])
        expected("Frontend").toEqual([{skill: "Frontend", role: "Engineer"}])
        expected("Software").toEqual([{skill: "Software", role: "Engineer"}])
        expected("Python").toEqual([{skill: "Python", role: "Engineer"}])
        expected("API").toEqual([])  // known skill that does not produce any competene
        expected("REST").toEqual([]) // known skill that does not produce any competene
      })

      it("handles {Skill} + Developer", () => {
        expected("Developer").toEqual([{skill: "", role: "Engineer"}])
        expected("PHP Developer").toEqual([{skill: "PHP", role: "Engineer"}])
        expected("Backend Developer").toEqual([{skill: "Backend", role: "Engineer"}])
        expected("Frontend Developer").toEqual([{skill: "Frontend", role: "Engineer"}])
        expected("Web Developer").toEqual([{skill: "Web", role: "Engineer"}])
        expected("Software Developer").toEqual([{skill: "Software", role: "Engineer"}])
        expected("Data Developer").toEqual([{skill: "Data", role: "Engineer"}])
        expected("Go Developer").toEqual([{skill: "Go", role: "Engineer"}])
        expected("Product Developer").toEqual([{skill: "Product", role: ""}, {skill: "", role: "Engineer"}])
        expected("API Developer").toEqual([{skill: "", role: "Engineer"}])
        expected("REST Developer").toEqual([{skill: "", role: "Engineer"}])
      })

      it("handles Data + {Role}", () => {
        expected("Data Lead").toEqual([
          {role: "Lead", skill: ""}, {role: "", skill: "Data"}
        ])
        // expected("Data Designer").toEqual([skills.Data, designers._])
        expected("Data Dev").toEqual([{skill: "Data", role: "Engineer"}])
        expected("Data Developer").toEqual([{skill: "Data", role: "Engineer"}])
        expected("Data Engineer").toEqual([{skill: "Data", role: "Engineer"}])
        expected("Data Expert").toEqual([{skill: "Data", role: ""}])
      })

      it("handles DevOps + {Role}", () => {
        expected("DevOps Lead").toEqual([
          {role: "Lead", skill: ""}, {role: "", skill: "DevOps"}
        ])
        // expected("DevOps Designer").toEqual([skills.DevOps, designers._])
        expected("DevOps Dev").toEqual([{skill: "DevOps", role: "Engineer"}])
        expected("DevOps Developer").toEqual([{skill: "DevOps", role: "Engineer"}])
        expected("DevOps Engineer").toEqual([{skill: "DevOps", role: "Engineer"}])
        expected("DevOps Expert").toEqual([{skill: "DevOps", role: "Engineer"}])
      })

      it("handles Software + {Role}", () => {
        expected("Software Lead").toEqual([
          {role: "Lead", skill: ""}, {role: "", skill: "Software"}
        ])
        // expected("Software Designer").toEqual([engineers.Software])
        expected("Software Dev").toEqual([{skill: "Software", role: "Engineer"}])
        expected("Software Developer").toEqual([{skill: "Software", role: "Engineer"}])
        expected("Software Engineer").toEqual([{skill: "Software", role: "Engineer"}])
        expected("Software Expert").toEqual([{skill: "Software", role: "Engineer"}])
      })

      it("handles Web + {Role}", () => {
        expected("Web Lead").toEqual([
          {role: "Lead", skill: ""}, {role: "", skill: "Web"}
        ])
        // expected("Web Designer").toEqual([designers.Web])
        expected("Web Dev").toEqual([{skill: "Web", role: "Engineer"}])
        expected("Web Developer").toEqual([{skill: "Web", role: "Engineer"}])
        expected("Web Engineer").toEqual([{skill: "Web", role: "Engineer"}])
        expected("Web Expert").toEqual([{skill: "Web", role: ""}])
      })

      it("handles Fullstack + {Role}", () => {
        expected("Fullstack Lead").toEqual([
          {role: "Lead", skill: ""}, {role: "", skill: "Fullstack"}
        ])
        // expected("Fullstack Designer").toEqual([skills.Fullstack, designers._])
        expected("Fullstack Dev").toEqual([{skill: "Fullstack", role: "Engineer"}])
        expected("Fullstack Developer").toEqual([{skill: "Fullstack", role: "Engineer"}])
        expected("Fullstack Engineer").toEqual([{skill: "Fullstack", role: "Engineer"}])
        expected("Fullstack Expert").toEqual([{skill: "Fullstack", role: "Engineer"}])
      })

      it("handles Frontend + {Role}", () => {
        expected("Frontend Lead").toEqual([
          {role: "Lead", skill: ""}, {role: "", skill: "Frontend"}
        ])
        // expected("Frontend Designer").toEqual([{skill: "Frontend", role: "Engineer"}, designers._])
        expected("Frontend Dev").toEqual([{skill: "Frontend", role: "Engineer"}])
        expected("Frontend Developer").toEqual([{skill: "Frontend", role: "Engineer"}])
        expected("Frontend Engineer").toEqual([{skill: "Frontend", role: "Engineer"}])
        expected("Frontend Expert").toEqual([{skill: "Frontend", role: "Engineer"}])
      })

      it("handles Backend + Role", () => {
        expected("Backend Lead").toEqual([
          {role: "Lead", skill: ""}, {role: "", skill: "Backend"}
        ])
        // expected("Backend Designer").toEqual([skills.Backend, designers._])
        expected("Backend Dev").toEqual([{skill: "Backend", role: "Engineer"}])
        expected("Backend Developer").toEqual([{skill: "Backend", role: "Engineer"}])
        expected("Backend Engineer").toEqual([{skill: "Backend", role: "Engineer"}])
        expected("Backend Expert").toEqual([{skill: "Backend", role: "Engineer"}])
      })

      it("handles Mobile + Role", () => {
        expected("Mobile Lead").toEqual([
          {role: "Lead", skill: ""}, {role: "", skill: "Mobile"}
        ])
        expected("Mobile Android Lead").toEqual([
          {role: "Lead", skill: ""}, {role: "", skill: "Android"}, {role: "", skill: "Mobile"}
        ])
        expected("Mobile Designer").toEqual([{skill: "Mobile", role: "Designer"}])
        expected("Mobile Dev").toEqual([{skill: "Mobile", role: "Engineer"}])
        expected("Mobile Developer").toEqual([{skill: "Mobile", role: "Engineer"}])
        expected("Mobile Engineer").toEqual([{skill: "Mobile", role: "Engineer"}])
        expected("Mobile Expert").toEqual([{skill: "Mobile", role: ""}])
        expected("Mobile Android Expert").toEqual([
          {skill: "Android", role: "Engineer"}, {skill: "Mobile", role: "Engineer"}
        ])
      })

      it("handles NodeJS + Role", () => {
        expect(interpret("NodeJS Lead")).toEqual([
          {role: "Lead", skill: ""},
          {role: "", skill: "NodeJS"},
        ])
        // expect(interpret("NodeJS Designer")).toEqual([skills.NodeJS, designers._])
        expect(interpret("NodeJS Dev")).toEqual([{skill: "NodeJS", role: "Engineer"}])
        expect(interpret("NodeJS Developer")).toEqual([{skill: "NodeJS", role: "Engineer"}])
        expect(interpret("NodeJS Engineer")).toEqual([{skill: "NodeJS", role: "Engineer"}])
        expect(interpret("NodeJS Expert")).toEqual([{skill: "NodeJS", role: "Engineer"}])
      })

      it("handles WordPress + Role", () => {
        expect(interpret("WordPress Lead")).toEqual([
          {role: "Lead", skill: ""},
          {role: "", skill: "WordPress"},
        ])
        expect(interpret("WordPress Dev")).toEqual([{skill: "WordPress", role: "Engineer"}])
        expect(interpret("WordPress Developer")).toEqual([{skill: "WordPress", role: "Engineer"}])
        expect(interpret("WordPress Engineer")).toEqual([{skill: "WordPress", role: "Engineer"}])
        expect(interpret("WordPress Expert")).toEqual([{skill: "WordPress", role: "Engineer"}])
      })

      it("handles TypeScript + Role", () => {
        expect(interpret("TypeScript Lead")).toEqual([
          {role: "Lead", skill: ""},
          {role: "", skill: "TypeScript"},
        ])
        expect(interpret("TypeScript Dev")).toEqual([{skill: "TypeScript", role: "Engineer"}])
        expect(interpret("TypeScript Developer")).toEqual([{skill: "TypeScript", role: "Engineer"}])
        expect(interpret("TypeScript Engineer")).toEqual([{skill: "TypeScript", role: "Engineer"}])
        expect(interpret("TypeScript Expert")).toEqual([{skill: "TypeScript", role: "Engineer"}])
      })

      it("handles iOS + Role", () => {
        expect(interpret("iOS Dev")).toEqual([{skill: "iOS", role: "Engineer"}])
        expect(interpret("iOS Developer")).toEqual([{skill: "iOS", role: "Engineer"}])
        expect(interpret("iOS Engineer")).toEqual([{skill: "iOS", role: "Engineer"}])
        expect(interpret("iOS Expert")).toEqual([{skill: "iOS", role: "Engineer"}])
      })

      it("handles Flutter + Role", () => {
        expect(interpret("Flutter Dev")).toEqual([{skill: "Flutter", role: "Engineer"}])
        expect(interpret("Flutter Developer")).toEqual([{skill: "Flutter", role: "Engineer"}])
        expect(interpret("Flutter Engineer")).toEqual([{skill: "Flutter", role: "Engineer"}])
        expect(interpret("Flutter Expert")).toEqual([{skill: "Flutter", role: "Engineer"}])
      })

      it("handles Blockchain + Role", () => {
        expect(interpret("Blockchain Dev")).toEqual([{skill: "Blockchain", role: "Engineer"}])
        expect(interpret("Blockchain Developer")).toEqual([{skill: "Blockchain", role: "Engineer"}])
        expect(interpret("Blockchain Engineer")).toEqual([{skill: "Blockchain", role: "Engineer"}])
        expect(interpret("Blockchain Expert")).toEqual([{skill: "Blockchain", role: "Engineer"}])
      })

      // it("handles Solidity + Role", () => {
      //   expect(interpret("Solidity")).toEqual([skills.Solidity])
      //   expect(interpret("Solidity Lead")).toEqual([leads._, skills.Solidity])
      //   expect(interpret("Solidity Designer")).toEqual([skills.Solidity, designers._])
      //   expect(interpret("Solidity Dev")).toEqual([engineers.Solidity])
      //   expect(interpret("Solidity Developer")).toEqual([engineers.Solidity])
      //   expect(interpret("Solidity Engineer")).toEqual([engineers.Solidity])
      //   expect(interpret("Solidity Expert")).toEqual([engineers.Solidity])
      // })

      it("handles Game + Role", () => {
        expect(interpret("Game Dev")).toEqual([{skill: "Game", role: "Engineer"}])
        expect(interpret("Game Developer")).toEqual([{skill: "Game", role: "Engineer"}])
        expect(interpret("Game Engineer")).toEqual([{skill: "Game", role: "Engineer"}])
        expect(interpret("Game Expert")).toEqual([{skill: "Game", role: ""}])
      })

    //   it("handles Unity + Role", () => {
    //     expect(interpret("Unity")).toEqual([])
    //     expect(interpret("Unity Lead")).toEqual([s.lead, s.unityEngineer])
    //     expect(interpret("Unity Designer")).toEqual([s.designer]) // should such cases be generalized to "Game Designer" instead of just "Designer"?
    //     expect(interpret("Unity Dev")).toEqual([s.unityEngineer])
    //     expect(interpret("Unity Developer")).toEqual([s.unityEngineer])
    //     expect(interpret("Unity Engineer")).toEqual([s.unityEngineer])
    //     expect(interpret("Unity Expert")).toEqual([s.unityEngineer])
    //   })
    //
    //   // it("handles Figma + Role", () => {
    //   //   expect(interpret("Figma")).toEqual([])
    //   //   expect(interpret("Figma Lead")).toEqual([s.lead])
    //   //   expect(interpret("Figma Designer")).toEqual([s.uiDesigner])
    //   //   expect(interpret("Figma Dev")).toEqual([s.softwareEngineer])
    //   //   expect(interpret("Figma Developer")).toEqual([s.softwareEngineer])
    //   //   expect(interpret("Figma Engineer")).toEqual([s.engineer])
    //   //   expect(interpret("Figma Expert")).toEqual([])
    //   // })
    //
    //   it("handles Lead combinations", () => {
    //     expect(interpret("Lead")).toEqual([leads._])
    //     expect(interpret("Tech Lead")).toEqual([leads.Tech])
    //     expect(interpret("Web Lead")).toEqual([leads._, skills.Web])
    //     expect(interpret("Web Tech Lead")).toEqual([leads.Tech, skills.Web])
    //     expect(interpret("Frontend Lead")).toEqual([leads._, skills.Frontend])
    //     expect(interpret("Frontend Team Lead")).toEqual([leads.Team, skills.Frontend])
    //
    //     expect(interpret("Frontend Leader")).toEqual([leads._, skills.Frontend])
    //     expect(interpret("Lead DevOps")).toEqual([leads._, skills.DevOps])
    //     expect(interpret("DevOps Lead")).toEqual([leads._, skills.DevOps])
    //     expect(interpret("Lead, DevOps")).toEqual([leads._, skills.DevOps])
    //     expect(interpret("DevOps, Lead")).toEqual([engineers.DevOps, leads._])
    //     expect(interpret("Frontend Team Lead")).toEqual([leads.Team, skills.Frontend])
    //     expect(interpret("Frontend Tech Lead")).toEqual([leads.Tech, skills.Frontend])
    //     expect(interpret("Team Frontend Lead")).toEqual([leads.Team, skills.Frontend])
    //     expect(interpret("Tech Frontend Lead")).toEqual([leads.Tech, skills.Frontend])
    //     expect(interpret("Design Team Leader")).toEqual([leads.Team/*, skills.Design*/])
    //     // expect(interpret("UI/UX Lead")).toEqual([s.lead, s.uiDesigner])
    //     // expect(interpret("UI/UX Design Team Lead")).toEqual([s.teamLead, s.uiDesigner])
    //
    //     expect(interpret("Backend Engineer Team Lead")).toEqual([engineers.Backend, leads.Team])
    //     expect(interpret("Solution Architect Lead")).toEqual([architects.Solution, leads._])
    //   })

      // it("handles Architect combinations", () => {
      //   expect(interpret("Architect")).toEqual([architects._])
      //   expect(interpret("AWS Architect")).toEqual([architects.AWS])
      //   expect(interpret("Solution Architect")).toEqual([architects.Solution])
      //   expect(interpret("Solutions Architect")).toEqual([architects.Solution])
      //   expect(interpret("AWS Solution Architect")).toEqual([architects.Solution, architects.AWS])
      //   expect(interpret("Cloud Architect")).toEqual([architects.Cloud])
      //
      //   expect(interpret("Mobile Architect")).toEqual([architects.Mobile])
      //   expect(interpret("Mobile Architect, Backend")).toEqual([architects.Backend, architects.Mobile])
      //   expect(interpret("Mobile Architect, Engineer")).toEqual([architects.Mobile])
      //   expect(interpret("Mobile Architect, Backend Engineer")).toEqual([architects.Mobile, engineers.Backend])
      // })

      // it("handles QA & Automation combinations", () => {
      //   expect(interpret("QA")).toEqual([engineers.QA])
      //   expect(interpret("Automation")).toEqual([skills.Automation])
      //   expect(interpret("QA Automation")).toEqual([engineers.QA, engineers.Automation])
      //
      //   expect(interpret("QA Engineer")).toEqual([engineers.QA])
      //   expect(interpret("Automation Engineer")).toEqual([engineers.Automation])
      //   expect(interpret("QA Automation Engineer")).toEqual([engineers.QA, engineers.Automation])
      // })

      it("handles Product + {Role}", () => {
        expect(interpret("Product Manager")).toEqual([{role: "Manager", skill: "Product"}])
        // expect(interpret("Manager of a Product")).toEqual([s.productManager]) TODO broken
        expect(interpret("Product Management Expert")).toEqual([{role: "Manager", skill: "Product"}])
        expect(interpret("Product Designer")).toEqual([{role: "Designer", skill: "Product"}])
        expect(interpret("Designer of a Product")).toEqual([{role: "Designer", skill: "Product"}])
        expect(interpret("Product Design Expert")).toEqual([{role: "Designer", skill: "Product"}])
      })
    })

    describe("handles advanced cases", () => {
      it("does not generalize", () => {
        expected("Software, TypeScript Engineer").toEqual([
          {role: "Engineer", skill: "TypeScript"},
          {role: "Engineer", skill: "Software"},
        ])
        expected("Software Engineer").toEqual([{role: "Engineer", skill: "Software"}])
        expected("TypeScript Engineer").toEqual([{role: "Engineer", skill: "TypeScript"}])
        expected("React Engineer").toEqual([{role: "Engineer", skill: "React"}])
      })

  //     it("handles Expert / Enthusiast cases", () => {
  //       expected("PHP expert, React enthusiast").toEqual([engineers.PHP, skills.React])
  //       expected("Backend expert, Frontend enthusiast").toEqual([engineers.Backend, skills.Frontend])
  //       expected("Backend expert, Software enthusiast").toEqual([engineers.Backend, skills.Software])
  //       expected("Software expert, Backend enthusiast").toEqual([engineers.Software, skills.Backend])
  // //     expected("PHP enthusiast, React expert").toEqual([s.phpEngineer, s.reactEngineer])
  // //     expected("Backend enthusiast, Frontend expert").toEqual([s.backendEngineer, s.frontendEngineer]
  // //     expected("Backend enthusiast, Software expert").toEqual([s.backendEngineer, s.softwareEngineer])
  // //     expected("Software enthusiast, Backend expert").toEqual([s.softwareEngineer, s.backendEngineer])
  //     })
  //
  //   //   it("handles Engineer-X, Engineer-Y cases", () => {
  //   //     expect(interpret("Backend engineer, Frontend developer")).toEqual([s.backendEngineer, s.frontendEngineer])
  //   //     expect(interpret("Full-Stack Programmer, SWE")).toEqual([s.fullstackEngineer, s.softwareEngineer])
  //   //     expect(interpret("Django coder, Ruby developer")).toEqual([s.djangoEngineer, s.rubyEngineer])
  //   //     expect(interpret("Game engineer, Mobile engeneer")).toEqual([s.gameEngineer, s.mobileEngineer])
  //   //   })

      it("handles Engineer, Analyst", () => {
        expect(interpret("Engineer/Analyst")).toEqual([
          {role: "Engineer", skill: ""},
          {role: "Analyst", skill: ""},
        ])
        expect(interpret("Engineer/Data Analyst")).toEqual([
          {role: "Engineer", skill: ""},
          {role: "Analyst", skill: "Data"},
        ])
        expect(interpret("Data Engineer/Analyst")).toEqual([
          {role: "Engineer", skill: "Data"},
          {role: "Analyst", skill: "Data"},
        ])
        expect(interpret("Data Engineer/Business Analyst")).toEqual([
          {role: "Engineer", skill: "Data"},
          {role: "Analyst", skill: "Business"},
        ])
      })

      it("handles Engineer, Designer", () => {
        expect(interpret("Software Engineer || UI/UX designer")).toEqual([
          {role: "Engineer", skill: "Software"},
          {role: "Designer", skill: "UI/UX"},
        ])
        expect(interpret("Web Developer, Web designer")).toEqual([
          {role: "Engineer", skill: "Web"},
          {role: "Designer", skill: "Web"},
        ])
        expect(interpret("Graphics designer & Frontend Engineer")).toEqual([
          {role: "Designer", skill: "Graphic"},
          {role: "Engineer", skill: "Frontend"},
        ])
        expect(interpret("Designer, Software Developer, Writer, Speaker")).toEqual([
          {role: "Designer", skill: ""},
          {role: "Engineer", skill: "Software"},
        ])
        expect(interpret("Software Engineer. Occasional Designer")).toEqual([
          {role: "Engineer", skill: "Software"},
          {role: "Designer", skill: ""},
        ])
      })

  //   //   it("handles Manager, Designer", () => {
  //   //     expect(interpret("Project Manager and Product Designer")).toEqual([s.projectManager, s.productDesigner])
  //   //     // expect(interpret("Manager of the Project, MUI Design Expert")).toEqual([s.projectManager, s.designer]) TODO
  //   //     expect(interpret("Product Management Wizard, Designer of Mobile UIs")).toEqual([s.productManager, s.mobileDesigner])
  //     })
    })

    describe("handles insane cases", () => {
      it("handles tautologies", () => {
        expect(interpret("Software Developer")).toEqual([{skill: "Software", role: "Engineer"}])
        expect(interpret("Development Engineer")).toEqual([{skill: "", role: "Engineer"}])
        expect(interpret("Software Engineering Developer")).toEqual([{skill: "Software", role: "Engineer"}])
        expect(interpret("Software Engineering Engineer")).toEqual([{skill: "Software", role: "Engineer"}])
        // Treating "Web" + "Fullstack" like non-aliases:
        expect(interpret("Web Fullstack Developer")).toEqual([
          {skill: "Fullstack", role: "Engineer"},
          {skill: "Web", role: "Engineer"},
        ])
        expect(interpret("Fullstack Web Engineer")).toEqual([
          {skill: "Fullstack", role: "Engineer"},
          {skill: "Web", role: "Engineer"},
        ])
      })

      it("infers specializations from pure skills", () => {
        expect(interpret("PHP, Ruby, Laravel, Docker")).toEqual([
          {skill: "PHP", role: "Engineer"},
          {skill: "Laravel", role: "Engineer"},
          {skill: "Docker", role: "Engineer"},
          {skill: "Ruby", role: "Engineer"},
        ])

        // Limited to a single role for now:
        expect(interpret("PHP, Power BI")).toEqual([
          {skill: "PHP", role: ""},
          {skill: "Power BI", role: ""},
        ])
      })
    })

    describe("handles realistic cases", () => {
      it("handles set #1", () => {
        expect(interpret("Senior Software Engineer & Architect with over 15 years of experience")).toEqual([
          {role: "Architect", skill: "Software"},
          // "Software Engineer" is consumed by a higher role
        ])
        expect(interpret("Software Engineer | AI / ML Researcher | CyberSecurity Enthusiast")).toEqual([
          {role: "Engineer", skill: "Software"},
          {role: "Scientist", skill: "Machine Learning"},
          {role: "", skill: "Security"},
        ])
        expect(interpret("Backend: PHP, Laravel, WP, Node.js Frontend: React.js, Angular.js , Vue.js , Javascript Desktop: C++, C#, Unity")).toEqual([
          {role: "Engineer", skill: "JavaScript"},
          {role: "Engineer", skill: "React"},
          {role: "Engineer", skill: "Frontend"},
          {role: "Engineer", skill: "NodeJS"},
          {role: "Engineer", skill: "PHP"},
          {role: "Engineer", skill: "Backend"},
          {role: "Engineer", skill: "Laravel"},
          {role: "Engineer", skill: "VueJS"},
          {role: "Engineer", skill: "Unity"},
          {role: "Engineer", skill: "C++"},
          {role: "Engineer", skill: "C#"},
        ])
        expect(interpret("Junior Data Analyst/Engineer at Facebook. Skilled with Jupyter Notebook and Python. Open for offers")).toEqual([
          {role: "Analyst", skill: "Data"},
          {role: "Engineer", skill: "Data"},
          {role: "", skill: "Python"},
        ])
        expect(interpret("Cloud engineer, Go expert. Interested in Security and Scalability")).toEqual([
          {role: "Engineer", skill: "Cloud"},
          {role: "Engineer", skill: "Go"},
          {role: "", skill: "Security"},
        ])
      })
//
//       it("handles set #2", () => {
//         expect(interpret("TypeScript team Manager")).toEqual([
//           skills.TypeScript, skills.Team, managers._
//         ]) // .toEqual([s.engineeringManager]) TODO
//         expect(interpret("Frontend (React) ninja. My skills include: CSS | HTML | TYPESCRIPT")).toEqual([
//           engineers.TypeScript,
//           engineers.Frontend,
//           engineers.React,
//         ])
//         expect(interpret("SQL Data Analyst, Data Engineer, MBA Project Manager, M.Sc. Polymer Science, B.S Chemical Engineering.")).toEqual([
//           analysts.Data, skills.SQL, engineers.Data, managers.Project, skills.Engineering
//         ])
//         expect(interpret("Teamlead, backend dev, beer enjoyer :)")).toEqual([
//           leads.Team, engineers.Backend
//         ])
//       })
//
//       it("handles set #3", () => {
//         expected("PHP Lead. Python Tech Lead").toEqual([
//           skills.PHP,
//           leads.Tech,
//           skills.Python,
//         ])
//         expected("UI/UX • Graphic Design • IoT • Blockchain Enthusiast • Photography • Marketing").toEqual([
//           engineers.Blockchain,
//           engineers.IoT,
//           skills.Marketing,
//           designers.Graphic,
//           designers["UI/UX"],
//         ])
//         expected("I`m a Devops/Data Engineer, open source contributor programmer & enthusiast").toEqual([
//           engineers.DevOps,
//           engineers.Data,
//         ])
//         expected("🔍 QA Engineer | Python & Pytest | Automation Enthusiast 🚀").toEqual([
//           engineers.QA,
//           skills.Python,
//           skills.Automation,
//         ])
//         expected("Young enthusiastic wanderer with 1+ year of experience as a QA Engineer.").toEqual([
//           engineers.QA,
//         ])
//       })
//
//       it("handles set #4", () => {
//         expected("ALX Software Engineer || Graphic Designer (interested in Typography) || Python Developer").toEqual([
//           engineers.Software,
//           designers.Graphic,
//           engineers.Python
//         ])
//         expected("Full-Stack Web Development 💻 || Data Analytics || DevOps Enthusiast").toEqual([
//           engineers.Fullstack,
//           engineers.Data, // FP
//           engineers.Web,
//           analysts.Data,
//           engineers.DevOps,
//         ])
//         expected("Frontend👨‍🎨 + DevOps📦 web3️⃣ / DeFi 💰, TypeScript❄, React/Next/Nest⚛️ engineer at @Rock-n-Block⚡️, ex. freelancer✨, enthusiast after 12 A.M. 🧛, baptist 🕊").toEqual([
//           engineers.Frontend,
//           engineers.DevOps,
//           skills.TypeScript,
//           engineers.NextJS,
//           engineers.React,
//           engineers.NestJS,
//         ])
//         expected("I'm available for anything in my area of expertise. | Jr Backend Developer | Cyber Security Analyst & QA Enthusiast").toEqual([
//           engineers.Backend,
//           analysts.Security,
//           skills.QA,
//         ])
//         expected("AWS Solutions Architect | DevOps | JS, Go, Rust | AI Enthusiast").toEqual([
//           architects.Solution,
//           architects.AWS,
//           engineers.DevOps,
//           skills.Go,
//           skills.JavaScript,
//         ])
//       })
//
//       it("handles set #5", () => {
//         expected("Android / Unreal Engine programmer").toEqual([
//           engineers.Unreal, engineers.Android
//         ])
//         expected("Full Stack Web Developer | Cloud & DevOps Engineering | Web 3 Developer").toEqual([
//           engineers.Fullstack,
//           engineers.Web,
//           skills.Engineering,
//           skills.Cloud,
//           skills.DevOps,
//         ])
//         expected("DevSecOps, embedded hobbyist, electronics enthusiast, and maker.").toEqual([
//           engineers.DevOps,
//           engineers.Security,
//           skills.Embedded,
//         ])
//         expected("Senior Cryptography Engineer, Senior Firmware Engineer").toEqual([
//           engineers.Firmware, // FN "Cryptography Engineer" not captured yet
//         ])
//         expected("MERN Developer.").toEqual([
//           engineers.MongoDB,
//           engineers.Express,
//           engineers.React,
//           engineers.NodeJS,
//         ])
//       })
//
// //       it("handles set #6", () => {
// //         expected("Blockchain System Architect; Information Security MSc from Royal Holloway; Computer Science BSc from Warsaw University").toEqual(
// //           [s.blockchainArchitect, s.systemArchitect, s.security]
// //         )
// //         expected("Full-Stack Developer | Blockchain Architect | Smart Contract Developer.").toEqual(
// //           [s.fullstackEngineer, s.blockchainArchitect]
// //         )
// //         expected(`💻 Senior Full Stack | Blockchain Engineer
// // 📚 Always learning!
// // 🎨 5.5+ years of Software Dev`).toEqual(
// //           [s.blockchainEngineer, s.fullstackEngineer, s.softwareEngineer]
// //         )
// //         expected(`🎮 GAME DEVELOPER😵`).toEqual(
// //           [s.gameEngineer]
// //         )
// //         expected(`Engineering Manager at Qandle | Tech Enthusiast | Android and iOS | Python | Tensorflow | Flask | Email Automation | Server Handling | Docker`).toEqual(
// //           [s.engineeringManager]
// //         )
// //       })
// //
// //       it("handles set #7", () => {
// //         expected(`☯ Software Engineer by day, AI Enthusiast by night`).toEqual(
// //           [s.softwareEngineer]
// //         )
// //         expected(`Data science project manager at Latvijas Banka, sampling expert for the European Social Survey`).toEqual(
// //           [s.projectManager]
// //         )
// //         // Cyrillic C:
// //         expected(`️❤️ JavaScript Wizard ❄ React.js Magician 🎨 СSS painter`).toEqual(
// //           [s.javascriptEngineer, s.reactEngineer]
// //         )
// //         expected(`️Data science project manager at Latvijas Banka, sampling expert for the European Social Survey`).toEqual(
// //           [s.projectManager]
// //         )
// //         // FN for "Software Engineer Game Developer"
// //         expected(`️Software Engineer Game Developer, Designer, Blogger, Animal Lover`).toEqual(
// //           [s.designer]
// //         )
// //       })
// //
// //       it("handles set #9", () => {
// //         expected(`Frontend developer 🤓,
// // Designer 👨‍🎨,
// // Junior iOS-developer ☺️`).toEqual(
// //           [s.frontendEngineer, s.designer, s.iosEngineer]
// //         )
// //         expected(`• Android-Developer
// // • Front-End Web Developer`).toEqual(
// //           [s.androidEngineer, s.frontendEngineer, s.webEngineer]
// //         )
// //         expected(`IT-Security Engineer & Developer`).toEqual(
// //           [s.securityEngineer]
// //         )
// //         expected(`E2E software QA intern @Dell,  Internet Systems student @ifrs, UX enthusiast, previously a pharmacist.`).toEqual(
// //           []
// //         )
// //         expected(`️Ph.D. student, engineer (photonics) & data/ml enthusiast", // can be improved by adding data/ml to shortcuts`).toEqual(
// //           [s.dataEngineer]
// //         )
// //       })
// //
// //       it("handles set #9", () => {
// //         expected(`Software Engineer | Jr FullStack Developer | Graphic designer | React | Node | JavaScript`).toEqual(
// //           [s.softwareEngineer, s.fullstackEngineer, s.graphicDesigner]
// //         )
// //         expected(`Solution Architect 🚀 | Co-founder at Nitron | Tech enthusiast | Content creator 🌟`).toEqual(
// //           [s.solutionArchitect]
// //         )
// //         expected(`Python Developer, security and new technologies enthusiast. Ph.D.`).toEqual(
// //           [s.pythonEngineer]
// //         )
// //         expected(`Cloud Software Engineer, Linux enthusiast, Cyclist 🚴‍♀️`).toEqual(
// //           [s.cloudEngineer, s.softwareEngineer]
// //         )
// //         expected(`️UX Engineer / Software Engineer / Designer / Ring Bearer`).toEqual(
// //           [s.softwareEngineer, s.designer]
// //         )
// //       })
// //
// //       it("handles set #10", () => {
// //         expected(`Cyber-Sec Engineer and Programmer backend`).toEqual(
// //           [s.securityEngineer, s.backendEngineer]
// //         )
// //          expected(`JavaScript enthusiast. Front End Architect.`).toEqual(
// //           [s.javascriptEngineer, s.frontendArchitect]
// //         )
// //          expected(`IT Solution Architect, infrastructure administrator, enthusiast of Microsoft cloud solutions, integrator, consultant, and trainer (MCT)`).toEqual(
// //           [s.solutionArchitect]
// //         )
// //         expected(`Senior Backend Developer | DevOps | Crypto enthusiast - Certified Laravel / AWS / Golang`).toEqual(
// //           [s.backendEngineer, s.devopsEngineer]
// //         )
// //         expected(`An enthusiastic Senior Golang developer who loves Go, Rust, Docker, Kubernetes, and DevOps`).toEqual(
// //           [s.goEngineer, s.devopsEngineer]
// //         )
// //       })
// //
// //       // "Junior Frontend developer and Senior Backend developer.",
// //       // "I am a junior front-end developer and automation QA enthusiast from Serbia",
// //       // "Android developer, functional programming enthusiast, a humble servant of JUG Łódź.", // FP for "DB" language
// //       // "Principal Software Engineer. Human Interface Designer.",
// //       // "Software engineer with expertise in cross-platform development using React Native",
// //       // "iOS Developer || Product Enthusiast",
// //       // "Software Engineer . Product Designer . Architect", // not clear what kind of "Architect", ignored
// //       // "Software Engineer and UI/UX Designer | React | Angular | MERN | MEAN | Typescript | Python | Django | C | C++ | C#",
// //       // "Audio Engineer / Sound Designer and Software Engineer", // 🤔
// //     })
  })

  // describe(".interpretSkills() in 'User' context", () => {
  //   function interpret(text: string): string[] {
  //     text = normalizeText(text)
  //     const claims = extractor.extractFromText(text, "User")
  //     return interpreter.interpretSkills(claims).sort()
  //   }
  //   function expected(text: string) {
  //     return expect(interpret(text))
  //   }
  //
  //   describe("handles synthetic cases", () => {
  //     it("handles empty input", () => {
  //       expected("").toEqual([])
  //       expected("xaxaxa").toEqual([])
  //     })
  //
  //     it("handles an isolated term", () => {
  //       expected("CSS").toEqual(["CSS"])
  //       expected("JavaScript").toEqual(["JavaScript"])
  //       expected("Js").toEqual(["JavaScript"])
  //       expected("ROR").toEqual(["Ruby on Rails"])
  //     })
  //
  //     it("handles a duplicated term", () => {
  //       expected("JS JavaScript").toEqual(["JavaScript"])
  //       expected("JS, JavaScript").toEqual(["JavaScript"])
  //       expected("TypeScript TS").toEqual(["TypeScript"])
  //       expected("TypeScript / TS").toEqual(["TypeScript"])
  //       expected("Node.js also NodeJS/Node.js").toEqual(["NodeJS"])
  //     })
  //
  //     it("handles terms and separators", () => {
  //       expected("Ruby & JavaScript").toEqual(["JavaScript", "Ruby"].sort())
  //       expected("TS, PHP").toEqual(["PHP", "TypeScript"].sort())
  //       expected("TypeScript and JS").toEqual(["JavaScript", "TypeScript"].sort())
  //       expected("Node | Elixir").toEqual(["Elixir", "NodeJS"].sort())
  //       expected("HTML5|CSS3").toEqual(["CSS", "HTML"].sort())
  //     })
  //
  //     it("handles ambiguos cases", () => {
  //       // FP for "Julia" (see `TermExtractor` tests)
  //       expected("My name is Julia. I'm a marketing manager. Now I'm studying the basics of managing a WEB project").toEqual(
  //         ["Julia", "Marketing", "Project", "Web"].sort()
  //       )
  //     })
  //   })
  //
  //   describe("handles realistic cases", () => {
  //     it("handles set #1", () => {
  //       expect(interpret("WEB developer, proficient with HTML, CSS, PHP")).toEqual(
  //         ["CSS", "HTML", "PHP", "Web"].sort()
  //       )
  //       expect(interpret("MERN Stack Developer | Blockchain enthusiast")).toEqual(
  //         ["Blockchain", "Express", "MongoDB", "NodeJS", "React", "Web"].sort()
  //       )
  //       expect(interpret("Front-end Developer, Embedded Enthusiast, Bachelor of  Computer Science")).toEqual(
  //         ["Embedded", "Frontend"].sort()
  //       )
  //       expect(interpret("iOS Developer && ML Enthusiast")).toEqual(
  //         ["Machine Learning", "iOS"].sort()
  //       )
  //     })
  //
  //     it("handles set #2", () => {
  //       expect(interpret("Full-stack web developer / Rust&Cybersecurity enthusiast")).toEqual(
  //         ["Rust", "Security", "Web"].sort()
  //       )
  //       expect(interpret("Enthusiastic, fast learning Java Developer oriented for hard-working, determined to finish project the best way possible.")).toEqual(
  //         ["Java"].sort()
  //       )
  //       expect(interpret("Open-minded and enthusiastic about #Go, #Rust")).toEqual(
  //         ["Go", "Rust"].sort()
  //       )
  //       expect(interpret("Managing software developer, tech lead. Clean code advocate, performance enthusiast, .Net freak")).toEqual(
  //         [".NET", "Performance", "Software", "Tech"].sort()
  //       )
  //     })
  //
  //     it("handles set #3", () => {
  //       expect(interpret("Data Engineer/Developer also interested in UI/UX")).toEqual(
  //         ["Data", "UI/UX"].sort()
  //       )
  //       expect(interpret("Junior (Vue, React, Angular, AngularJS) developer")).toEqual(
  //         ["Angular", "React", "VueJS"].sort()
  //       )
  //       // FN: missing React Native in the following
  //       expect(interpret("Computer Animator, Graphic Designer. Full Stack JavaScript specialist, React JS/Native, Redux, Mongo, MySQL, Sqlite3")).toEqual(
  //         ["Animation", "Graphic", "JavaScript", "MongoDB", "MySQL", "React", "Redux", "SQLite", "Web"].sort()
  //       )
  //        expect(interpret("Blockchain | Solidity Ninja | DevOps | VA/PT | AWS | Jenkins | ELK")).toEqual(
  //         ["AWS", "Blockchain", "DevOps", "Elasticsearch", "Jenkins", "Kibana", "Logstash", "Security", "Solidity"].sort()
  //       )
  //     })
  //   })
  // })

  // describe(".interpretSeniority() in 'User' context", () => {
  //   function interpret(text: string): string | undefined {
  //     text = normalizeText(text)
  //     const claims = extractor.extractFromText(text, "User")
  //     return interpreter.interpretSeniority(claims)
  //   }
  //
  //   describe("handles synthetic cases", () => {
  //     it("handles empty input", () => {
  //       expect(interpret("")).toEqual(undefined)
  //       expect(interpret("xaxaxa")).toEqual(undefined)
  //     })
  //
  //     it("handles an isolated term", () => {
  //       expect(interpret("Junior")).toEqual("Junior")
  //       expect(interpret("Middle")).toEqual("Middle")
  //       expect(interpret("Intermediate")).toEqual("Middle")
  //       expect(interpret("Senior")).toEqual("Senior")
  //     })
  //
  //     it("handles an isolated shortening", () => {
  //       expect(interpret("Jun Engineer")).toEqual("Junior")
  //       expect(interpret("Sen Engineer")).toEqual("Senior")
  //     })
  //
  //     it("handles ambiguous cases", () => {
  //       expect(interpret("Junior Senior")).toEqual(undefined)
  //       expect(interpret("Junior Student")).toEqual(undefined)
  //       expect(interpret("Senior Middle")).toEqual(undefined)
  //     })
  //
  //     it("handles normal cases", () => {
  //       expect(interpret("Junior Engineer")).toEqual("Junior")
  //       expect(interpret("Junior Lead")).toEqual("Junior")
  //       expect(interpret("Junior Dev")).toEqual("Junior")
  //       expect(interpret("Junior Developer")).toEqual("Junior")
  //       expect(interpret("Junior DevOps")).toEqual("Junior")
  //       expect(interpret("Junior Manager")).toEqual("Junior")
  //     })
  //   })
  //
  //   // TODO do not attempt to resolve any confusing case:
  //   // "Junior / Middle" -- should be undefined or "Middle"?
  //   // "Architect" -- should be undefined or "Principal"?
  //   // "Lead" -- should be undefined or "Senior"?
  // })
})

// describe("interpretSeniority()", () => {
//   it("has defaults", () => {
//     expect(interpretSeniority([]))
//       .toEqual([undefined, 0])
//
//     expect(interpretSeniority([{roles: ["Engineer"]}]))
//       .toEqual([undefined, 0])
//   })
//
//   describe("result confusion score", () => {
//     it("is affected by number of seniorites per claims", () => {
//       expect(interpretSeniority([{seniorities: ["Junior"], roles: ["Engineer"]}])[1])
//         .toEqual(0)
//
//       expect(interpretSeniority([{seniorities: ["Junior", "Middle"], roles: ["Engineer"]}])[1])
//         .toEqual(0.5)
//
//       expect(interpretSeniority([{seniorities: ["Junior", "Middle", "Senior"], roles: ["Engineer"]}])[1])
//         .toEqual(1)
//
//       expect(interpretSeniority([{seniorities: ["Junior", "Middle", "Senior", "Principal"], roles: ["Engineer"]}])[1])
//         .toEqual(1.5)
//     })
//
//     it("is affected by number of claims", () => {
//       expect(interpretSeniority([
//         {seniorities: ["Junior"], roles: ["Engineer"]},
//         {seniorities: ["Junior"], roles: ["Engineer"]}
//       ])[1])
//         .toEqual(0.5)
//     })
//
//     it("is affected by Student role", () => {
//       expect(interpretSeniority([{roles: ["Student"]}])[1])
//         .toEqual(0.5)
//
//       expect(interpretSeniority([{seniorities: ["Junior"], roles: ["Student"]}])[1])
//         .toEqual(0.5)
//
//       expect(interpretSeniority([{seniorities: ["Junior", "Middle"], roles: ["Student"]}])[1])
//         .toEqual(1)
//     })
//   })
//
//   describe("result seniority", () => {
//     it("is the highest seniority of a non-student role", () => {
//       expect(interpretSeniority([{seniorities: ["Junior"], roles: ["Engineer"]}])[0])
//         .toEqual("Junior")
//
//       expect(interpretSeniority([{seniorities: ["Junior", "Middle"], roles: ["Engineer"]}])[0])
//         .toEqual("Middle")
//
//       expect(interpretSeniority([{seniorities: ["Junior"], roles: ["Student"]}])[0])
//         .toEqual(undefined)
//     })
//
//     it("and the same is true across claims", () => {
//       expect(interpretSeniority([
//         {seniorities: ["Junior"], roles: ["Engineer"]},
//         {seniorities: ["Middle"], roles: ["Designer"]},
//       ])[0])
//         .toEqual("Middle")
//
//       expect(interpretSeniority([
//         {seniorities: ["Middle"], roles: ["Engineer"]},
//         {seniorities: ["Junior"], roles: ["Designer"]},
//       ])[0])
//         .toEqual("Middle")
//     })
//
//     it("is ignored for unrelated roles", () => {
//       expect(interpretSeniority([
//         {seniorities: ["Senior"], roles: ["Enthusiast"]},
//         {seniorities: ["Middle"], roles: ["Engineer"]},
//       ])[0])
//         .toEqual("Middle")
//     })
//
//     it("is inferred from certain roles", () => {
//       expect(interpretSeniority([
//         {roles: ["Software Architect"]},
//       ])[0])
//         .toEqual("Principal")
//
//       expect(interpretSeniority([
//         {seniorities: ["Senior"], roles: ["Software Architect"]},
//       ])[0])
//         .toEqual("Senior")
//
//       expect(interpretSeniority([
//         {roles: ["Lead"]},
//       ])[0])
//         .toEqual("Senior")
//
//       expect(interpretSeniority([
//         {seniorities: ["Principal"], roles: ["Lead"]},
//       ])[0])
//         .toEqual("Principal")
//     })
//   })
//
//   describe("when alone", () => {
//     it("handles ambiguous cases", () => {
//       expect(interpretSeniority([
//         {seniorities: ["Junior"], roles: ["Engineer"]},
//         {seniorities: ["Middle"], roles: ["Student"]},
//         {seniorities: ["Senior"], roles: ["Manager"]},
//       ]))
//         .toEqual([undefined, 1.5])
//
//       expect(interpretSeniority([
//         {seniorities: ["Junior", "Middle"], roles: ["Student"]},
//         {seniorities: ["Senior"], roles: ["Manager"]},
//       ]))
//         .toEqual([undefined, 1.5])
//     })
//
//     it("handles non-ambiguous cases", () => {
//       expect(interpretSeniority([
//         {seniorities: ["Junior", "Middle"], roles: ["Engineer"]},
//       ]))
//         .toEqual(["Middle", 0.5])
//
//       expect(interpretSeniority([
//         {seniorities: ["Junior"], roles: ["Designer"]},
//         {seniorities: ["Middle"], roles: ["Engineer"]},
//       ]))
//         .toEqual(["Middle", 0.5])
//
//       expect(interpretSeniority([
//         {seniorities: ["Junior"], roles: ["Engineer"]},
//         {seniorities: ["Middle"], roles: ["Designer"]},
//         {seniorities: ["Senior"], roles: ["Manager"]},
//       ]))
//         .toEqual(["Senior", 1])
//
//       expect(interpretSeniority([
//         {seniorities: ["Middle"], roles: ["Student"]},
//         {seniorities: ["Senior"], roles: ["Manager"]},
//       ]))
//         .toEqual(["Senior", 1])
//     })
//   })
//
//   describe("after claim extractors", () => {
//     it("handles non-ambiguous cases", () => {
//       const claims1 = extractClaims("php junior, python senior")
//       expect(interpretSeniority([claims1])[0]).toEqual(undefined)
//
//       const claims2 = extractClaims("python senior engineer, php junior engineer")
//       expect(interpretSeniority([claims2])[0]).toEqual("Senior")
//
//       const groups3 = extractClaimGroups("python senior engineer. php junior engineer")
//       expect(interpretSeniority(groups3)[0]).toEqual("Senior")
//
//       const groups4 = extractClaimGroups("senior student. php junior engineer")
//       expect(interpretSeniority(groups4)[0]).toEqual("Junior")
//
//       const groups5 = extractClaimGroups("senior developer. architect")
//       expect(interpretSeniority(groups5)[0]).toEqual("Principal")
//     })
//
//     it("handles ambiguous cases", () => {
//       const claims1 = extractClaims("junior")
//       expect(interpretSeniority([claims1])[0]).toEqual(undefined)
//
//       const claims2 = extractClaims("junior enthusiast, python senior")
//       expect(interpretSeniority([claims2])[0]).toEqual(undefined)
//
//       const claims3 = extractClaims("junior student")
//       expect(interpretSeniority([claims3])[0]).toEqual(undefined)
//
//       const groups4 = extractClaimGroups("junior student. senior developer. middle architect")
//       expect(interpretSeniority(groups4)[0]).toEqual(undefined)
//
//       const groups5 = extractClaimGroups("junior middle senior principal developer")
//       expect(interpretSeniority(groups5)[0]).toEqual(undefined)
//     })
//   })
})
