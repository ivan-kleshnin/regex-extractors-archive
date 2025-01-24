import {D} from "lib/belt"
import {ClaimExtractor} from "./ClaimExtractor"
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
import type {Claim} from "./utils"

function cleanClaim(claim: Claim): Partial<Claim> {
  return D.filter(claim, (v) => (v instanceof Array) ? v.length > 0 : Boolean(v))
}

const extractor = new ClaimExtractor({
  stopExtractor: new TermExtractor(stopTable),
  skillExtractor: new TermExtractor(skillTable, [roleTable, shortcutTable]),
  roleExtractor: new TermExtractor(roleTable, [skillTable]),
  seniorityExtractor: new TermExtractor(seniorityTable, [skillTable, roleTable, shortcutTable]),
  shortcutExtractor: new ShortcutExtractor(shortcutTable, [roleTable, seniorityTable, skillTable]),
})

describe("ClaimExtractor()", () => {
  describe(".extractFromText(_, 'User')", () => {
    function extract(text: string): Partial<Claim>[] {
      text = normalizeText(text)
      const claims = extractor.extractFromText(text, "User")
      return claims.map(claim => cleanClaim({
        seniorities: claim.seniorities?.sort(),
        skills: claim.skills?.sort(),
        role: claim.role,
      }))
    }
    function expected(text: string) {
      return expect(extract(text))
    }

    describe("handles special cases", () => {
      it("handles ambiguous role combinations", () => {
        expected("Engineer Mobile Designer").toEqual([{
          skills: ["Mobile"],
        }])
      })

      it("handles tautologies", () => {
        expected("Software Engineering Developer").toEqual([{
          skills: ["Software"],
          role: "Engineer",
        }])
        expected("Design Designer").toEqual([{
          role: "Designer",
        }])
        expected("Management Manager").toEqual([{
          role: "Manager",
        }])
      })

      it("handles dev word", () => {
        expected("Dev").toEqual([])
        expected("Backend Dev").toEqual([
          {skills: ["Backend"], role: "Engineer"}
        ])
        expected("Backend Dev Engineer").toEqual([
          {skills: ["Backend"]}
        ])
      })

      it("handles 'ops' shortcuts", () => {
        expected("cool devops").toEqual([
          {skills: ["DevOps"], role: "Engineer"}
        ])
        expected("cool dataops").toEqual([
          {skills: ["Data"], role: "Engineer"}
        ])
        expected("cool secops").toEqual([
          {skills: ["Security"], role: "Engineer"}
        ])
        expected("cool devsecops").toEqual([
          {skills: ["DevOps", "Security"], role: "Engineer"}
        ])
        expected("cool sysops").toEqual([
          {skills: ["System"], role: "Administrator"}
        ])
      })
    })

    describe("handles synthetic cases with 0-1 roles", () => {
      it("handles empty input", () => {
        expected("").toEqual([])
        expected("xaxaxa").toEqual([])
      })

      it("handles a stop word", () => {
        // Stops on "recruiter"
        expected("junior developer, senior recruiter").toEqual([])

        // Stops on "hiring"
        // expected("CTO & Co-founder at https://quest.app We're hiring senior frontend/backend/fullstack engineers!").toEqual([])
      })

      it("handles an isolated Seniority", () => {
        expected("JUNIOR").toEqual([{
          seniorities: ["Junior"],
        }])
        expected("Middle").toEqual([{
          seniorities: ["Middle"],
        }])
        expected("Intermediate").toEqual([{
          seniorities: ["Middle"],
        }])
        expected("senior").toEqual([{
          seniorities: ["Senior"],
        }])
      })

      it("handles an isolated Skill", () => {
        expected("PHP").toEqual([{
          skills: ["PHP"],
        }])
        expected("front-end").toEqual([{
          skills: ["Frontend"],
        }])
        expected("BE").toEqual([{
          skills: ["Backend"],
        }])
      })

      it("handles an isolated Role", () => {
        expected("Engineer").toEqual([{
          role: "Engineer",
        }])
        expected("Manager").toEqual([{
          role: "Manager",
        }])
        expected("Designer").toEqual([{
          role: "Designer",
        }])
        expected("Analyst").toEqual([{
          role: "Analyst",
        }])
        expected("expert").toEqual([{
          role: "Expert",
        }])
        expected("ENTHUSIAST").toEqual([{
          role: "Enthusiast",
        }])
        expected("Student").toEqual([{
          role: "Student",
        }])
        expected("Grader").toEqual([{
          role: "Student",
        }])
      })

      it("handles an isolated Shortcut", () => {
        expect(extract("Developer")).toEqual([{
          role: "Engineer",
        }])
        expect(extract("DevOps")).toEqual([{
          skills: ["DevOps"],
          role: "Engineer",
        }])
        expect(extract("QA")).toEqual([{
          skills: ["QA"],
          role: "Engineer",
        }])
        expect(extract("MEAN")).toEqual([{
          skills: ["Angular", "Express", "MongoDB", "NodeJS"].sort(),
        }])
        expect(extract("MERN stack")).toEqual([{
          skills: ["Express", "MongoDB", "NodeJS", "React"].sort(),
        }])
      })

      it("handles mixed terms, set #1", () => {
        expect(extract("young senior engineer")).toEqual([{
          seniorities: ["Senior"],
          role: "Engineer",
        }])
        expect(extract("senior backend engineer")).toEqual([{
          seniorities: ["Senior"],
          skills: ["Backend"],
          role: "Engineer",
        }])
        expect(extract("aspiring php engineer")).toEqual([{
          seniorities: ["Aspiring"],
          skills: ["PHP"],
          role: "Engineer",
        }])
        expect(extract("senior php engineer")).toEqual([{
          seniorities: ["Senior"],
          skills: ["PHP"],
          role: "Engineer",
        }])
      })

      it("handles mixed terms, set #2", () => {
        expect(extract("Developer Mobile | Backend | Frontend")).toEqual([{
          skills: ["Backend", "Frontend", "Mobile"].sort(),
          role: "Engineer",
        }])
        expect(extract("frontend / backend / infrastructure engineer")).toEqual([{
          skills: ["Backend", "Frontend", "Infrastructure"],
          role: "Engineer",
        }])
        expect(extract("Fullstack Backend, Frontend, Database and Mobile App Developer")).toEqual([{
          skills: ["Backend", "Database", "Frontend", "Fullstack", "Mobile"].sort(),
          role: "Engineer",
        }])
        expect(extract("Web Backend Frontend Database Mobile Engineer")).toEqual([{
          skills: ["Backend", "Database", "Frontend", "Mobile", "Web"],
          role: "Engineer",
        }])
      })

      it("handles mixed terms, set #3", () => {
        expect(extract("Web developer (frontend + backend)")).toEqual([{
          skills: ["Backend", "Frontend", "Web"].sort(),
          role: "Engineer",
        }])
        expect(extract("Software Engineer Frontend Backend")).toEqual([{
          skills: ["Backend", "Frontend", "Software"],
          role: "Engineer",
        }])
        expect(extract("frontend, backend... whatever goes")).toEqual([{
          skills: ["Backend", "Frontend"],
        }])
        expect(extract("Backend + Front-end + Data Engineer")).toEqual([{
          skills: ["Backend", "Data", "Frontend"],
          role: "Engineer"
        }])
      })

      it("handles mixed terms, set #4", () => {
        // @_@ "DevOps" is the only role below:
        expect(extract("Tech Guy (Backend, Frontend, IoT, Devops)")).toEqual([
          {
            skills: ["Backend", "DevOps", "Frontend", "IoT"/*, "Tech"*/],
            role: "Engineer",
          },
        ])
        expect(extract("Developer Backend Java and Curious by Frontend")).toEqual([
          {
            skills: ["Backend", "Frontend", "Java"].sort(),
            role: "Engineer",
          },
        ])
        expect(extract("Mid-senior on backend development and junior in frontend with frameworks like EJS and React")).toEqual([
          {
            seniorities: ["Junior", "Middle-Senior"],
            skills: ["Backend", "Development", "Frontend", "React"],
          },
        ])
        expect(extract("senior backend/frontend developer")).toEqual([
          {
            seniorities: ["Senior"],
            skills: ["Backend", "Frontend"].sort(),
            role: "Engineer",
          },
        ])
      })
    })

    describe("handles synthetic cases with 2 roles", () => {
      it("handles set #1", () => {
        expect(extract("Formerly a backend developer, now a frontend developer")).toEqual([
          {
            skills: ["Backend"],
            role: "Engineer",
          },
          {
            skills: ["Frontend"],
            role: "Engineer",
          },
        ])

        expect(extract("Developer Senior Frontend 🔥 (JS, React, Angular, Vue, etc..) Junior Backend Developer")).toEqual([
          {
            seniorities: ["Senior"],
            skills: ["Frontend"],
            role: "Engineer"
          },
          {
            seniorities: ["Junior"],
            skills: [
              "Backend",
              "Angular",
              "React",
              "VueJS",
              "JavaScript",
            ].sort(),
            role: "Engineer"
          }
        ])

        expect(extract("Senior Software Engineer. I'm a frontend engineer who isn't scared of the backend.")).toEqual([
          {
            seniorities: ["Senior"],
            skills: ["Software"],
            role: "Engineer"
          },
          {},
          {
            skills: ["Frontend", "Backend"].sort(),
            role: "Engineer"
          },
        ])

        expect(extract("Junior Frontend developer and Senior Backend developer.")).toEqual([
          {
            seniorities: ["Junior"],
            skills: ["Frontend"],
            role: "Engineer",
          },
          {
            seniorities: ["Senior"],
            skills: ["Backend"],
            role: "Engineer",
          },
        ])
      })

        // Ex 15.
        // "Senior Lead Engineer (System, Backend & Frontend), active on bitbucket (because company uses it lmao)"
        // System skill!

        // Ex 17.
        // "Senior Software Engineer/Team Leader Senior Frontend & Backend & Full Stack Developer/Engineer"
        // ^ go figure which seniority applies to which role...
        // => Senior Software Engineer Lead Frontend Backend Web
        // => Senior [Backend Engineer, Frontend Engineer, Team Lead]

        // Ex 19.
        // "Ing en sistemas - Backend Lead - Senior backend developer (C#) - Trainee frontend developer (Angular) Ella/She/Her."
        // => Backend Lead Senior Developer Trainee Frontend
        // => Senior [Backend Developer, Frontend Developer]
    })

    describe("handles real-world cases", () => {
      it("handles QA set (27)", () => {
        expect(extract("QA")).toEqual([{
          skills: ["QA"],
          role: "Engineer",
        }])

        expect(extract("QA Automation")).toEqual([{
          skills: ["QA", "Automation"].sort(),
          role: "Engineer",
        }])

        expect(extract("QA Automation Engineer")).toEqual([{
          skills: ["QA", "Automation"].sort(),
          role: "Engineer",
        }])

        expect(extract("Automation QA Engineer")).toEqual([{
          skills: ["QA", "Automation"].sort(),
          role: "Engineer",
        }])

        expect(extract("QA Expert")).toEqual([{
          skills: ["QA"],
          role: "Expert",
        }])

        expect(extract("QA Enthusiast")).toEqual([{
          skills: ["QA"],
          role: "Enthusiast",
        }])

        expect(extract("QA Engineer")).toEqual([{
          skills: ["QA"],
          role: "Engineer",
        }])

        expect(extract("Automation QA Developer")).toEqual([{
          skills: ["QA", "Automation"].sort(),
          role: "Engineer",
        }])

        expect(extract("Automation Engineer")).toEqual([{
          skills: ["Automation"].sort(),
          role: "Engineer",
        }])

        expect(extract("QA Test Automation Engineer")).toEqual([{
          skills: ["QA", "Automation"].sort(),
          role: "Engineer",
        }])

        expect(extract("Python AQA & Go enthusiast")).toEqual([
          {
            skills: ["Python", "QA", "Go", "Automation"].sort(),
            role: "Enthusiast",
          },
        ])

        expect(extract("Very enthusiastic and responsible QA")).toEqual([{
          skills: ["QA"],
          role: "Engineer",
        }])

        // FP for "Engineer" role: `Quality Assurance` has no right role term so it's treated as role
        expect(extract("Quality Assurance Automation Enthusiast")).toEqual([{
          skills: ["QA", "Automation"].sort(),
          role: "Enthusiast",
        }])

        expect(extract("An enthusiastic and ambitious Quality Assurance expert")).toEqual([{
          skills: ["QA"].sort(),
          role: "Expert",
        }])

        expect(extract("Web Developer | QA Developer")).toEqual([
          {
            skills: ["Web"],
            role: "Engineer",
          },
          {},
          {
            skills: ["QA"],
            role: "Engineer",
          },
        ])

        expect(extract("Web Developer and QA Analyst")).toEqual([
          {
            skills: ["Web"],
            role: "Engineer",
          },
          {
            skills: ["QA"],
            role: "Analyst",
          },
        ])

        expect(extract("QA / Developer")).toEqual([
          {
            skills: ["QA"],
            role: "Engineer",
          },
          {
            role: "Engineer",
          },
        ])

        expect(extract("QA Automation Engineer and Developer")).toEqual([
          {
            skills: ["QA", "Automation"].sort(),
            role: "Engineer",
          },
          {
            role: "Engineer",
          },
        ])

        expect(extract("Experienced Manual QA Engineer with 1,5 + years of expertise in testing web and mobile applications")).toEqual([{
          skills: ["QA", "Manual", "Mobile", "Testing", "Web"].sort(),
          role: "Engineer",
        }])

        expect(extract("An enthusiastic and ambitious QA Manual Engineer")).toEqual([{
          skills: ["QA", "Manual"].sort(),
          role: "Engineer",
        }])

        expect(extract("QA Manual expert")).toEqual([{
          skills: ["QA", "Manual"].sort(),
          role: "Expert",
        }])

        expect(extract("I am a junior front-end developer and automation QA enthusiast from Serbia")).toEqual([
          {
            seniorities: ["Junior"],
            skills: ["Frontend"],
            role: "Engineer",
          },
          {
            skills: ["QA", "Automation"].sort(),
            role: "Enthusiast",
          },
        ])

        expect(extract("📚 I'm currently studying Automation QA at SoftUni, where I'm gaining expertise in the latest testing tools and methodologies.")).toEqual([
          {
            skills: ["Automation", "QA"].sort(),
          },
          {
            skills: ["Testing"],
          },
        ])

        expect(extract("Junior QA | Manual & Automation Tester 🕵️‍♂️ | Selenium & C# Enthusiast 🌟 | Passionate about Quality Assurance 🚀")).toEqual([
          {
            seniorities: ["Junior"],
            skills: ["QA"],
            role: "Engineer",
          },
          {},
          {
            skills: ["QA", "Manual", "Automation"].sort(),
            role: "Engineer",
          },
          {},
          {
            skills: ["Selenium", "C#"].sort(),
            role: "Enthusiast",
          },
          {},
          {
            skills: ["QA"],
            role: "Engineer",
          },
        ])

        expect(extract("E2E software QA intern @Dell, Internet Systems student @ifrs, UX enthusiast, previously a pharmacist.")).toEqual([
          {
            skills: ["E2E", "QA", "Software"].sort(),
            role: "Intern",
          },
          {
            skills: ["System"], // FP for "System"
            role: "Student",
          },
          {
            skills: ["UI/UX"],
            role: "Enthusiast",
          },
        ])

        expect(extract("QA Test Automation Expert | Selenium (Java/Python) | BDD Frameworks | API Testing (Postman) | CI/CD Integration (Jenkins, Gitlab) | 6.5 Years of Experience")).toEqual([
          {
            skills: ["API", "QA", "BDD", "Postman", "Testing", "CI/CD", "Jenkins", "Automation", "Selenium", "Java", "Python"].sort(),
            role: "Expert",
          },
        ])

        expect(extract("17 yrs+, Test Automation, Test Architect, Lead QA, Mentor, Expert in Domains: Web2, Web3, FinTech, Ticketing System, Food Delivery, Ride Sharing, E-commerce.")).toEqual([
          {},
          {
            skills: ["Automation"],
          },
          {
            role: "Architect",
          },
          {
            skills: ["QA"],
            role: "Lead",
          },
          {},
          {
            role: "Expert",
          },
          {
            skills: ["Crypto"],
          },
          {
            skills: ["Fintech"],
          },
          {
            skills: ["System"],
          },
          {},
          {},
          {
            skills: ["E-commerce"],
          }
        ])
      })

      it("handles Lead + QA set", () => {
        expect(extract("Lead QA")).toEqual([
          {
            skills: ["QA"],
            role: "Lead",
          },
        ])

        expect(extract("Team Lead, QA")).toEqual([
          {
            skills: ["Team", "QA"].sort(),
            role: "Lead"
          },
        ])
      })

      it("handles Lead + Expert set", () => {
        expect(extract("Tech Expert Lead")).toEqual([
          {
            skills: ["Tech"].sort(),
            role: "Lead",
          },
        ])

        expect(extract("Team Lead UI/UX Design Expert")).toEqual([
          {
            skills: ["Design", "Team", "UI/UX"].sort(),
            role: "Lead",
          },
        ])
      })

      it("handles DevOps set (14)", () => {
        expect(extract("DevOps")).toEqual([{
          skills: ["DevOps"],
          role: "Engineer",
        }])

        expect(extract("DevOps Engineer")).toEqual([{
          skills: ["DevOps"],
          role: "Engineer",
        }])

        expect(extract("DevOps Expert")).toEqual([{
          skills: ["DevOps"],
          role: "Expert",
        }])

        expect(extract("DevOps Enthusiast")).toEqual([{
          skills: ["DevOps"],
          role: "Enthusiast",
        }])

        expect(extract("DevOps | VA/PT | AWS | Jenkins | ELK")).toEqual([{
          skills: ["DevOps", "AWS", "Elasticsearch", "Jenkins", "Kibana", "Logstash", "Vulnerability"].sort(),
          role: "Engineer",
        }])

        // This case will be better with NLP where we can detect that DevOps is a subject hence not a role...
        // expect(extract("An enthusiastic Senior Golang developer who loves Go, Rust, Docker, Kubernetes, and DevOps")).toEqual([
        //   {
        //     seniorities: ["Senior"],
        //     skills: ["Kubernetes", "Go", "Docker", "Rust", "Software", "DevOps"].sort(),
        //     role: "Engineer"
        //   }
        // ])

        expect(extract("DevOps Cloud Engineer")).toEqual([{
          skills: ["DevOps", "Cloud"].sort(),
          role: "Engineer",
        }])

        expect(extract("FOSS lover, developer, DevOps enthusiast.")).toEqual([
          {
            skills: ["Open Source"],
          },
          {
            role: "Engineer",
          },
          {
            skills: ["DevOps"],
            role: "Enthusiast",
          }
        ])

        expect(extract("Senior Backend Developer | DevOps | Crypto enthusiast - Certified Laravel / AWS  / Golang")).toEqual([
          {
            seniorities: ["Senior"],
            skills: ["Backend"].sort(),
            role: "Engineer",
          },
          {},
          {
            skills: ["DevOps"],
            role: "Engineer",
          },
          {},
          {
            skills: ["Crypto", "Laravel", "AWS", "Go"].sort(),
            role: "Enthusiast",
          }
        ])

        expect(extract("DevOps, cloud enthusiast, QA Engineer, developer focusing on open source software, processes and education")).toEqual([
          {
            skills: ["DevOps"],
            role: "Engineer",
          },
          {
            skills: ["Cloud"],
            role: "Enthusiast",
          },
          {
            skills: ["QA"],
            role: "Engineer",
          },
          {
            skills: ["Software", "Open Source"].sort(),
            role: "Engineer",
          }
        ])

        // Insane case, 3️⃣ prevents web from being captured as a word
        expect(extract("Frontend👨‍🎨 + DevOps📦 web3️⃣ / DeFi 💰, TypeScript❄, enthusiast after 12 A.M. 🧛")).toEqual([
          {
            skills: ["Crypto", "DevOps", "Frontend"].sort(),
            role: "Engineer",
          },
          {
            skills: ["TypeScript"],
          },
          {
            role: "Enthusiast",
          },
        ])

        expect(extract("I`m a Devops/Data Engineer, open source contributor programmer & enthusiast")).toEqual([
          {
            skills: ["DevOps"],
            role: "Engineer",
          },
          {
            skills: ["Data"],
            role: "Engineer",
          },
          {
            skills: ["Open Source"].sort(),
            role: "Engineer",
          },
          {
            role: "Enthusiast",
          },
        ])

        expect(extract("Empowering startups with cutting-edge expertise: software architecture, optimal practices, database design, web infrastructure, and DevOps mastery.")).toEqual([{
          skills: ["Architecture", "Database", "DevOps", "Infrastructure", "Software", "Startup", "Web"].sort(),
          role: "Engineer",
        }])

        expect(extract("Senior DevOps engineer and Cloud-Native tech evangelist")).toEqual([
          {
            seniorities: ["Senior"],
            skills: ["DevOps"],
            role: "Engineer",
          },
          {
            skills: ["Cloud", "Tech"].sort(),
            role: "Expert",
          }
        ])
      })

      it("handles Lead + DevOps set", () => {
        expect(extract("Lead DevOps")).toEqual([
          {
            skills: ["DevOps"],
            role: "Lead"
          },
        ])

        expect(extract("Team Lead, DevOps")).toEqual([
          {
            skills: ["DevOps", "Team"],
            role: "Lead"
          },
        ])
      })

      it("handles Web set", () => {
        // => FP for "Web Engineer"
        expect(extract("Experienced Engineer with expertise in testing web and mobile applications")).toEqual([{
          skills: ["Web", "Mobile", "Testing"].sort(),
          role: "Engineer",
        }])
      })

      it("handles Mobile set", () => {
        expect(extract("Mobile")).toEqual([{
          skills: ["Mobile"],
        }])

        expect(extract("Mobile Engineer")).toEqual([{
          skills: ["Mobile"],
          role: "Engineer",
        }])

        expect(extract("Mobile Expert")).toEqual([{
          skills: ["Mobile"],
          role: "Expert",
        }])

        expect(extract("Mobile Enthusiast")).toEqual([{
          skills: ["Mobile"],
          role: "Enthusiast",
        }])

        expect(extract("Web & Mobile Designer, UI/UX padavan")).toEqual([
          {
            skills: ["Mobile", "Web", "UI/UX"].sort(),
            role: "Designer",
          }
        ])

        expect(extract("Casual Swift dev")).toEqual([{
          skills: ["Swift"],
          role: "Engineer",
        }])

        expect(extract("Django/Swift dev 👨🏻‍💻")).toEqual([{
          skills: ["Django", "Swift"].sort(),
          role: "Engineer",
        }])

        expect(extract("Flutter Developer at Íslandsbanki, django enthusiast, software freak")).toEqual([
          {
            skills: ["Flutter"].sort(),
            role: "Engineer",
          },
          {
            skills: ["Django"],
            role: "Enthusiast",
          },
          {
            skills: ["Software"],
          }
        ])

        // => FP for "Mobile Engineer"
        expect(extract("Manual QA with years of expertise in testing web and mobile applications")).toEqual([
          {
            skills: ["Manual", "QA", "Testing", "Mobile", "Web"].sort(),
            role: "Engineer",
          }
        ])

        expect(extract("Xamarin expert")).toEqual([{
          skills: ["Xamarin"],
          role: "Expert",
        }])
      })
    })

    describe("has known issues", () => {
      it("has disambiguation flaws", () => {
        expected("frontend - react, java - spring. I don't want to be programmer, i try be a engineer").toEqual([
          {
            skills: ["Java", "Frontend", "Spring", "React"].sort(),
          },
          {},
          {skills: ["Backend"], role: "Engineer"}, // FP from "be" word near "engineer"
          {role: "Engineer"}
        ])
      })
    })
  })
})
