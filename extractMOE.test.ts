import {extractMOE} from "./extractMOE"

describe("extractMOE", () => {
  describe("alt1 cases", () => {
    it("handles numeric months", () => {
      expect(extractMOE("1 month of experience")).toBe(1)
      expect(extractMOE("2 month of experience")).toBe(2)
      expect(extractMOE("3 months of experience")).toBe(3)
    })

    it("handles numeric years", () => {
      expect(extractMOE("1 year of experience")).toBe(12)
      expect(extractMOE("2 year of experience")).toBe(24)
      expect(extractMOE("3 years of experience")).toBe(36)
    })

    it("handles literal months", () => {
      expect(extractMOE("one month of experience")).toBe(1)
      expect(extractMOE("two month of experience")).toBe(2)
      expect(extractMOE("three months of experience")).toBe(3)
    })

    it("handles literal years", () => {
      expect(extractMOE("one year of experience")).toBe(12)
      expect(extractMOE("two year of experience")).toBe(24)
      expect(extractMOE("three years of experience")).toBe(36)
    })

    it("handles common typos", () => {
      expect(extractMOE("2 month's of experience")).toBe(2)
      expect(extractMOE("2 year's of experience")).toBe(24)
    })

    it("handles capitalization", () => {
      expect(extractMOE("TWO MONTHS OF EXPERIENCE")).toBe(2)
      expect(extractMOE("3 Years Of Experience")).toBe(36)
    })

    it("handles 'of'-less variant for months", () => {
      expect(extractMOE("1 month experience")).toBe(1)
      expect(extractMOE("2 month experience")).toBe(2)
      expect(extractMOE("3 months experience")).toBe(3)
      expect(extractMOE("4 months experience")).toBe(4)
    })

    it("handles '-' variant for months", () => {
      expect(extractMOE("1-month of experience")).toBe(1)
      expect(extractMOE("2-month of experience")).toBe(2)
      expect(extractMOE("3-months of experience")).toBe(3)
      expect(extractMOE("4-months of experience")).toBe(4)
    })

    it("handles 'of'-less variant for years", () => {
      expect(extractMOE("1 year experience")).toBe(12)
      expect(extractMOE("2 year experience")).toBe(24)
      expect(extractMOE("3 years experience")).toBe(36)
      expect(extractMOE("4 years experience")).toBe(48)
    })

    it("handles '-' variant for years", () => {
      expect(extractMOE("1-year of experience")).toBe(12)
      expect(extractMOE("2-year of experience")).toBe(24)
      expect(extractMOE("3-years of experience")).toBe(36)
      expect(extractMOE("4-years of experience")).toBe(48)
    })

    it("handles '+' postfix", () => {
      expect(extractMOE("1+ year of experience")).toBe(18)
      expect(extractMOE("2+ months of experience")).toBe(3)
      expect(extractMOE("3+ years of experience")).toBe(42)
      expect(extractMOE("4+ month of experience")).toBe(5)
    })

    it("handles '+' prefix", () => {
      expect(extractMOE("+1 year of experience")).toBe(18)
      expect(extractMOE("+2 months of experience")).toBe(3)
      expect(extractMOE("+3 years of experience")).toBe(42)
      expect(extractMOE("+4 month of experience")).toBe(5)
    })

    it("handles '>' sign", () => {
      expect(extractMOE(">1 year of experience")).toBe(18)
      expect(extractMOE(">2 months of experience")).toBe(3)
      expect(extractMOE("> 3 years of experience")).toBe(42)
      expect(extractMOE("> 4 month of experience")).toBe(5)
    })

    it("handles 'plus' postfix", () => {
      expect(extractMOE("1 plus year of experience")).toBe(18)
      expect(extractMOE("2 plus months of experience")).toBe(3)
      expect(extractMOE("3 plus years of experience")).toBe(42)
      expect(extractMOE("4 plus month of experience")).toBe(5)
    })

    it("handles 'over' prefix", () => {
      expect(extractMOE("over 1 year of experience")).toBe(18)
      expect(extractMOE("over 2 months of experience")).toBe(3)
      expect(extractMOE("over 3 years of experience")).toBe(42)
      expect(extractMOE("over 4 months of experience")).toBe(5)
    })

    it("handles 'more than' prefix", () => {
      expect(extractMOE("more than 1 year of experience")).toBe(18)
      expect(extractMOE("more than 2 months of experience")).toBe(3)
      expect(extractMOE("more than 3 years of experience")).toBe(42)
      expect(extractMOE("more than 4 month of experience")).toBe(5)
    })

    it("handles extra words", () => {
      expect(extractMOE("1 month of php experience")).toBe(1)
      expect(extractMOE("2 year of python experience")).toBe(24)
      expect(extractMOE("3 month of c++ experience")).toBe(3)
      expect(extractMOE("4 year of programming experience")).toBe(48)

      expect(extractMOE("1 month of extensive php experience")).toBe(1)
      expect(extractMOE("2 months of extensive php experience")).toBe(2)
      expect(extractMOE("3 months of very extensive php experience")).toBe(3)
      expect(extractMOE("3 months of very very extensive php experience")).toBe(3)
    })

    it("handles extra words with symbols", () => {
      expect(extractMOE("1 month of c++ experience")).toBe(1)
      expect(extractMOE("2 year of c# experience")).toBe(24)
      expect(extractMOE("3 month of objective-c experience")).toBe(3)
      expect(extractMOE("4 year of node.js experience")).toBe(48)
    })

    it("handles float numbers", () => {
      expect(extractMOE("Engineer with 1.9 years of experience")).toBe(23)
    })

    it("handles alt experience nouns variant", () => {
      expect(extractMOE("Engineer with 2 years of expertise")).toBe(24)
      expect(extractMOE("Developer with 3 years expertise")).toBe(36)
      expect(extractMOE("6 years of healthcare domain knowledge")).toBe(72)
    })

    it("handles 'exp' variant", () => {
      expect(extractMOE("3+ years of Software Developer Exp.")).toBe(42)
    })

    it("handles 'a' variants", () => {
      expect(extractMOE("with a month of experience")).toBe(1)
      expect(extractMOE("with a year of experience")).toBe(12)
    })
  })

  describe("alt2 cases", () => {
    it("handles numeric units", () => {
      expect(extractMOE("having experience of 13 years and 1 month")).toBe(157)
    })

    it("handles literal units", () => {
      expect(extractMOE("having experience of thirteen years and one month")).toBe(157)
    })
  })

  describe("alt3 cases", () => {
    it("handles numeric units", () => {
      expect(extractMOE("Experience: 1 year 5 months")).toBe(17)
    })

    it("handles literal months", () => {
      expect(extractMOE("Experience: one year, five months")).toBe(17)
    })
  })

  describe("union cases", () => {
    it("avoids overlapping groups", () => {
      expect(extractMOE("1 month experience 1 month")).toBe(1)    // not 2
      expect(extractMOE("experience 1 month experience")).toBe(1) // not 2
    })

    it("handles numeric variants", () => {
      expect(
        extractMOE("1 month of php experience, 2 months of php experience")
      ).toBe(3)
      expect(
        extractMOE("2 years of php experience, 1 year of php experience")
      ).toBe(36)
    })

    it("handles literal variants", () => {
      expect(
        extractMOE("one month php experience. two month php experience")
      ).toBe(3)
      expect(
        extractMOE("two years php experience. one year php experience")
      ).toBe(36)
    })

    it("handles mixed variants", () => {
      expect(
        extractMOE("one year programming experience; 2 months markup experience")
      ).toBe(14)
      expect(
        extractMOE("2 years programming experience; 1 month markup experience")
      ).toBe(25)
    })

    it("handles reverted variants", () => {
      expect(
        extractMOE("1 month of experience | 3 years of php experience")
      ).toBe(37)
      expect(
        extractMOE("two months of python experience | one month of experience")
      ).toBe(3)
    })
  })

  describe("multi-unit cases", () => {
    it("handles numeric variants", () => {
      expect(
        extractMOE("1 year 2 months experience")
      ).toBe(14)
      expect(
        extractMOE("2 years 1 month experience")
      ).toBe(25)
    })

    it("handles literal variants", () => {
      expect(
        extractMOE("one year two months php experience")
      ).toBe(14)
      expect(
        extractMOE("two years one month php experience")
      ).toBe(25)
    })

    it("handles mixed variants", () => {
      expect(
        extractMOE("one year 2 months programming experience")
      ).toBe(14)
      expect(
        extractMOE("2 years one month programming experience")
      ).toBe(25)
    })

    it("handles 'and' variants", () => {
      expect(
        extractMOE("1 year and two months web experience")
      ).toBe(14)
      expect(
        extractMOE("two years and 1 month web experience")
      ).toBe(25)
    })
  })

  describe("real-world cases", () => {
    it("positive set #1", () => {
      const messages = [
        "Five years programming experience, including a M.S. in BioInformatics, with the last year focusing on web development",
        "Over five year experience as a data scientist on mostly image processing",
        "Indonesian with five-year professional experience in the design industry",
        "Three plus year experience in iOS app development",
        "I am a mathematician with a four-year Bachelor's degree and a front-end developer with one year of experience",
      ]

      expect(
        messages.map(message => extractMOE(message))
      ).toEqual([60, 66, 60, 42, 12])
    })

    it("positive set #2", () => {
      const messages = [
        "Unity Developer with 1 Year and 5 months of Experience",
        "Unity Developer with 1 Year and 12 months of Experience",
        "Unity Developer for 2 Years and 13 months of Experience",
        "6+months of javascript experience",
        "web developer having four year plus experience in developing projects",
      ]

      expect(
        messages.map(message => extractMOE(message))
      ).toEqual([17, 24, 37, 7, 48])
    })

    it("positive set #3", () => {
      const messages = [
        "30+ years' expertise",
        "Data-driven professional with a combined five-year experience in Software Support, Audit, and Data analytics",
        "Ph.D. in EE, over twenty year experience in semiconductors",
        "Highly motivated and focused with 1 year 10 months' experience",
        "I have 1.4 years of experience in Asp.net core Web API and SQL Server and 3 months of experience in Angular",
      ]

      expect(
        messages.map(message => extractMOE(message))
      ).toEqual([366, 60, 246, 22, 20])
    })

    it("positive set #4", () => {
      const messages = [
        "I hold good knowledge and over 13+ months of experience in Data Analytics and Visualization",
        "Junior Front-end Developer | 6+ Months of Experience",
        "I have one year experience on GitHub",
        "Analyst/Software Engineer with 1.5 year of experience",
        "Junyung, KIM has three years experience in nuclear politics and strategy field, one year in corporate fiannce and two years in military (US Army).",
      ]

      expect(
        messages.map(message => extractMOE(message))
      ).toEqual([14, 7, 12, 18, 36])
    })

    it("positive set #5", () => {
      const messages = [
        "2 years 1 months Industry experience & 2 Industry Projects",
        "I have four year's experience of working as a software engineer",
        "Combining my extensive four-year experience in the automotive industry",
        "Overall, 16 years experience in Apparel Industry • More than five-year experience knitt Fabric dyeing",
        "I'm a 20 years old boy with 1+ year of python and 6+months of javascript experience"
      ]

      expect(
        messages.map(message => extractMOE(message))
      ).toEqual([25, 48, 48, 258, 25])
    })

    it("positive set #5", () => {
      const messages = [
        "background in ML and deep learning.10+ years of experience interpreting data to find patterns",
        "Sr. Android Developer with 8+ years of software and web development experience",
        "having experience of 5+ years with hands on various technologies",
        "Experience of python: 12 years",
        "Experience in PHP: 12 years",
      ]

      expect(
        messages.map(message => extractMOE(message))
      ).toEqual([126, 102, 66, 144, 144])
    })

    it("negative set #1", () => {
      const messages = [
        "Three 11 year olds working together for the ultimate coding experience",
        "I have N years of experience",
        "I'm twenty-year old guy from Norway. I'm new to programming, no previous experience.",
        "Global DevOps Bootcamp is a worldwide community event that has now been organized for three years in a row. Each year, we create a full-day experience",
        "12 years old no programming experience",
      ]

      expect(
        messages.map(message => extractMOE(message))
      ).toEqual([undefined, undefined, undefined, undefined, undefined])
    })

    it("negative set #2", () => {
      const messages = [
        "6 years without programming experience",
      ]

      expect(
        messages.map(message => extractMOE(message))
      ).toEqual([undefined])
    })
  })

  describe("known limitations", () => {
    it("not handles all variations", () => {
      const messages = [
        "I am a senior software developer, have been working for last 4 years.",
        "Senior data scientist with over (3) years of experience at top-tier research institutions",
      ]

      expect(
        messages.map(extractMOE)
      ).toEqual([undefined, undefined])
    })

    it("not too smart with laxy unions", () => {
      // Current behavior assumes "over, etc." are global modifiers
      // and models cases like "over 1 year of python and 2 months of js experience"
      expect(
        extractMOE("over 1 year and two months web experience")
      ).toBe(20) // should ideally be 18?
      expect(
        extractMOE("over two years and 1 month web experience")
      ).toBe(31) // should ideally be 25?
    })
  })
})
