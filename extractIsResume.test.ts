import {extractIsResume} from "./extractIsResume"
import {normalizeText} from "./normalize"

function extract(str: string): boolean | undefined {
  return extractIsResume(normalizeText(str))
}

describe("extractIsResume()", () => {
  it("included words", () => {
    expect(extract("resume")).toBe(true)
    expect(extract("my resume")).toBe(true)
    expect(extract("personal resume")).toBe(true)

    expect(extract("notresume")).toBe(false)
    expect(extract("resume2")).toBe(false)
    expect(extract("resum'e")).toBe(false)
  })

  it("stop words", () => {
    // expect(extract("resume template")).toBe(false)
    // expect(extract("resume theme")).toBe(false)
    // expect(extract("personal resume\ngenerator")).toBe(false)
    //
    // // real examples
    // expect(extract("GitHub Personal Portfolio Website - A simple solution to create a free portfolio, offering bulk rendering of HTML pages and projects. This portfolio features a modern design with a dark-light theme switcher and is optimized for SEO.")).toBe(false)
    expect(extract("A Customised portfolio for Every developer")).toBe(false)
  })

  it("mixid words, without positive support", () => {
    expect(extract("json-cv")).toBe(false)
    expect(extract("opencv")).toBe(false)
  })

  it("mixid words, with positive support", () => {
    expect(extract("my cv")).toBe(true)
    expect(extract("cv-my-words")).toBe(true)
  })
})
