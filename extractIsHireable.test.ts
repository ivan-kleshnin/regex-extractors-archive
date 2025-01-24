import {A} from "lib/belt"
import {extractIsHireable} from "./extractIsHireable"
import {normalizeText} from "./normalize"

function extract(str: string): boolean | undefined {
  return extractIsHireable(normalizeText(str))
}

describe("extractIsHireable()", () => {
  describe("hireable cases", () => {
    it("handles certain positions", () => {
      expect(extract("Hireable")).toBe(true)
      expect(extract("Blah. Hireable. Blah")).toBe(true)
      expect(extract("Blah-blah. I'm hireable")).toBe(true)

      expect(extract("something, hireable, something else")).toBe(undefined)

      expect(extract("Not hireable")).toBe(false)
      expect(extract("Blah. Not hireable. Blah")).toBe(false)
      expect(extract("Blah-blah. I'm not hireable")).toBe(false)
    })

    it("handles internal spaces", () => {
      expect(extract("Hire able")).toBe(true)
      expect(extract("Not hire able")).toBe(false)
    })

    it("handles direct mentions", () => {
      const messages = [
        "I'm hireable...",
        "I am hireable...",
        "He's hireable...",
        "He is hireable...",
      ]
      const negMessages = messages.map(message => message.replace("hireable", "not hireable"))

      expect(messages.map(extract)).toEqual(A.repeat(messages.length, true))
      expect(negMessages.map(extract)).toEqual(A.repeat(messages.length, false))
    })

    it("avoids false positives", () => {
      expect(extract("This tool is to make everyone hireable")).toBe(undefined)
      expect(extract("This tool is to make everyone hireable.")).toBe(undefined)
      expect(extract("This tool is for everyone. Hireable.")).toBe(true)
    })
  })

  describe("open for/to cases", () => {
    it("handles a direct mention", () => {
      const messages = [
        "Open to work",
        "Always open to work",
        "Not always open to work",
        "Sometimes open to work",
        "Open to freelance work",
        "Open to remote work",
        "Open for hire",
        "Open to hiring",
        "Opened to work", // checking all those Bad English variants... @_@
        "I am opened to remote job offers",
        "Open for remote job",
        "Open to work proposals",
        "Open to new ideas",
        "Open to job offers",
        "Open to offers for freelance work",
        "Open to new opportunities",
        "Open to interesting offers",
        "Open for new opportunities", // common typo
        "Open to collaborations and work",
        "Open to enquiries",
        "Open to future challenges",
        "Open to professional project enquiries",
        "Open to internship and job",
        "Currently opened to opportunities",
        "Open for relocation",
      ]
      const negMessages = messages.map(message => message.replace(/Open/i, "Not open"))

      expect(messages.map(extract)).toEqual(A.repeat(messages.length, true))
      expect(negMessages.map(extract)).toEqual(A.repeat(messages.length, false))
    })
  })

  describe("hire me cases", () => {
    it("handles direct mentions", () => {
      const messages = [
        "Hire me, wechat: xxx",
        "Freelance open source developer. Hire me!",
        "Interested in hiring me?",
        "Whether you hire me or not, I am overly committed",
      ]
      expect(messages.map(extract)).toEqual(A.repeat(messages.length, true))

      const negMessages = [
        "Don't try to hire me.",
        "Do not try to hire me.",
        "You can not hire me.",
        "You can't hire me.",
      ]
      expect(negMessages.map(extract)).toEqual(A.repeat(messages.length, false))
    })
  })

  describe("seeking cases", () => {
    it("handles direct mentions", () => {
      const messages = [
        "Seeking new job opportunities",
        "Seeking new work possibilities",
        "Seeking well paid job options",
      ]
      const negMessages = messages.map(message => message.replace(/Seeking/i, "Not Seeking"))

      expect(messages.map(extract)).toEqual(A.repeat(messages.length, true))
      expect(negMessages.map(extract)).toEqual(A.repeat(messages.length, false))
    })
  })

  describe("looking-for cases", () => {
    it("handles direct mentions", () => {
      const messages = [
        "Looking for new job opportunities",
        "Looking for new work possibilities",
        "Looking for well paid job options",
        "Looking for a position",
      ]
      const negMessages = messages.map(message => message.replace(/Looking for/i, "Not Looking for"))

      expect(messages.map(extract)).toEqual(A.repeat(messages.length, true))
      expect(negMessages.map(extract)).toEqual(A.repeat(messages.length, false))
    })
  })

  describe("real-world cases", () => {
    it("handles positive set #1", () => {
      expect(extract("JS, TS, React, Angular; open to relocation")).toBe(true)
      expect(extract("I am a freelance front-end developer. you can hire me if you want")).toBe(true)
      expect(extract("Pragmatic polyglot, solving problems and loving it. Interested in hiring me?")).toBe(true)
      expect(extract("Digital Entrepreneur | Code Lover | Open for New Opportunities")).toBe(true)
      expect(extract("Open for Hire - Full-Stack Software Developer | building railsinit.org")).toBe(true)
    })

    it("handles positive set #2", () => {
      expect(extract("Open to new challenges💻")).toBe(true)
      expect(extract("Open to AI/ML Roles")).toBe(true)
      expect(extract("Full-Stack Software Developer. Seeking new employment possibilities")).toBe(true)
      expect(extract("Computer science student who excels at Python. Seeking challenging employment opportunities")).toBe(true)
      expect(extract("looking for job options intern etc.")).toBe(true)
    })

    it("handles positive set #3", () => {
      expect(extract("Looking for new #rstats opportunities")).toBe(true)
      expect(extract("Looking for a job now.")).toBe(true)
      expect(extract("Student. Looking for internships.")).toBe(true)
      expect(extract("iOS Developer . Computer Engineer. Seeking remote contract work.")).toBe(true)
      expect(extract("Web developer. Always seeking contract work. Available via Telegram")).toBe(true)
    })

    it("handles positive set #4", () => {
      expect(extract("Professional UI/UX Designer, I Am Ready for hire.")).toBe(true)
      expect(extract("Mobile Apps & Web Developer | Freelancer | Ready for Hire")).toBe(true)
    })

    it("handles neutral set #1", () => {
      expect(extract("If you enjoy my open source work...")).toBe(undefined)
      expect(extract("Open to interpretation")).toBe(undefined)
      expect(extract("An open source ecosystem to liberate the work")).toBe(undefined)
      expect(extract("A tool to hire best developers. Myself included ;)")).toBe(undefined)
      expect(extract("🚀Open To You! 🚀")).toBe(undefined)
    })

    it("handles neutral set #2", () => {
      expect(extract("Open to Organizations !")).toBe(undefined)
      expect(extract("🈺 open for business! 🈺")).toBe(undefined)
      expect(extract("🧘🏻 Web Developer | JS ❤ ~ Always open to learn")).toBe(undefined)
      expect(extract("Connect the world of science. Make research open to all.")).toBe(undefined)
      expect(extract("Looking for teleportation")).toBe(undefined)
    })

    it("handles neutral set #3", () => {
      expect(extract("What are you looking for and what am I looking for?")).toBe(undefined)
      expect(extract("Looking for something")).toBe(undefined)
      expect(extract("Looking for the next big thing.")).toBe(undefined)
      expect(extract("I'm looking for: Ruby Ninjas,Ember.js Masters, Python Dev, QAs ...if you're one of them, just let me know!")).toBe(undefined)
      expect(extract("I'm a highly motivated Ninja. Always looking for new things to learn.")).toBe(undefined)
    })

    it("handles negative set #1", () => {
      expect(extract("Recruiters, don't try to hire me.")).toBe(false)
      expect(extract("Never try to hire me.")).toBe(false)
      expect(extract("See this: I AM NOT HIREABLE")).toBe(false)
      expect(extract("I'm non hireable")).toBe(false)
      expect(extract("Don't hire me for lulz")).toBe(false)
    })

    it("handles negative set #2", () => {
      expect(extract("Just for fun. Not hirable.")).toBe(false)
      expect(extract("I'm not for hire. Thank you for your cooperation")).toBe(false)
      expect(extract("Freelance Programmer | Not for Hire")).toBe(false)
      expect(extract("Working on VR Game w/kobugindustries (Not an expert) NOT FOR HIRE")).toBe(false)
    })

    it("has known limitations", () => {
      expect(extract("@ zhakky studios not hire able.")).toBe(undefined)
      expect(extract("Looking for a PhD position!")).toBe(true)
    })
  })
})
