import {D} from "lib/belt"
import {ShortcutExtractor} from "./ShortcutExtractor"
import {roleTable, seniorityTable, shortcutTable, skillTable} from "./taxonomy"
import type {Claim} from "./utils"

function cleanClaim(claim: Claim): Partial<Claim> {
  return D.filter(claim, (v) => (v instanceof Array) ? v.length > 0 : Boolean(v))
}

const shortcutExtractor = new ShortcutExtractor(
  shortcutTable, [roleTable, seniorityTable, skillTable]
)

describe("ShortcutExtractor()", () => {
  describe(".extractFromText(_, 'User')", () => {
    function extract(text: string) {
      const claims = shortcutExtractor.extractFromText(text, "User")[0]
      return claims.map(claim => cleanClaim({
        seniorities: claim.seniorities?.sort(),
        skills: claim.skills?.sort(),
        role: claim.role,
      }))
    }

    describe("handles unique shortcuts", () => {
      it("handles isolated terms", () => {
        expect(extract("swe")).toEqual([{
          skills: ["Software", "Engineering"].sort(),
          role: "Engineer"
        }])

        expect(extract("qa")).toEqual([{
          skills: ["QA"],
          role: "Engineer"
        }])
      })

      it("handles spaced terms", () => {
        expect(extract("php swe")).toEqual([{
          skills: ["Software", "Engineering"].sort(),
          role: "Engineer"
        }])

        expect(extract("qa engineer")).toEqual([{
          skills: ["QA"],
        }])

        expect(extract("qa swe")).toEqual([
          {
            skills: ["Engineering", "Software"].sort(),
            role: "Engineer"
          },
          {
            skills: ["QA"],
          }
        ])
      })

      it("handles dashed terms", () => {
        expect(extract("php-swe")).toEqual([{
          skills: ["Software", "Engineering"].sort(),
          role: "Engineer"
        }])

        expect(extract("qa-engineer")).toEqual([{
          skills: ["QA"],
        }])

        expect(extract("qa-swe")).toEqual([
          {
            skills: ["Engineering", "Software"].sort(),
            role: "Engineer"
          },
          {
            skills: ["QA"],
          }
        ])
      })
    })
  })

  describe(".extractFromText(_, 'Other')", () => {
    function extract(text: string) {
      const groups = shortcutExtractor.extractFromText(text, "Other")[0]
      return groups.map(claims => cleanClaim({
        seniorities: claims.seniorities?.sort(),
        skills: claims.skills?.sort(),
        role: claims.role,
      }))
    }

    describe("handles terms that collide with common words", () => {
      // "dev" is not a shortcut now...
      // it("handles Dev word", () => {
      //   // In the "User" context resolves as "developer"
      //   expect(extract("dev")).toEqual([])
      //   expect(extract("web dev")).toEqual([{
      //     skills: ["Web", "Engineering"].sort(),
      //   }])
      //   expect(extract("dev engineer")).toEqual([{
      //     skills: ["?Software", "?Engineering"].sort(),
      //   }])
      //   expect(extract("I'm a junior dev, aspiring to become senior.")).toEqual([{
      //     skills: ["?Software", "?Engineering"].sort(),
      //   }])
      //   expect(extract("PHP dev.")).toEqual([{
      //     skills: ["?Software", "?Engineering"].sort(),
      //   }])
      //   expect(extract("I'm a Dev with a knowledge of web")).toEqual([{
      //     skills: ["?Software", "?Engineering"].sort(),
      //   }])
      //   expect(extract("Enable Dev mode to run this.")).toEqual([{
      //     skills: ["?Software", "?Engineering"].sort(),
      //   }])
      //   // FP for "DEV"
      //   expect(extract("Disable DEV mode")).toEqual([{
      //     skills: ["?Software", "?Engineering"].sort(),
      //   }])
      //   expect(extract("We develop this product for fun and profit!")).toEqual([])
      //   expect(extract("PHP developers are very nice.")).toEqual([])
      // })
    })

    describe("handles unique shortcuts", () => {
      it("handles set #1", () => {
        expect(extract("swe")).toEqual([{
          skills: ["Software", "Engineering"].sort(),
        }])
      })
    })
  })
})


