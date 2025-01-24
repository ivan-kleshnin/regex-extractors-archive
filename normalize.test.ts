import {normalizeText} from "./normalize"

describe("normalizeText()", () => {
  it("collapses and trims whitespace", () => {
    expect(normalizeText("I  know  PHP")).toBe("I know PHP")
    expect(normalizeText(" foo bar ")).toBe("foo bar")
  })

  // TODO fixes cyrillic/latin mixed cases...

  // it("replaces non-ASCII chars with bullets", () => {
  //   expect(normalizeText("x 🧘🏻 something 🈺")).toBe("x • something")
  // })

  // it("collapses bullets and punctuation around", () => {
  // eslint-disable-next-line no-irregular-whitespace
  //   expect(normalizeStr("6 years ​.• •, of experience")).toBe("6 years • experience") // invisible char before "of" (try to Backspace)
  // })

  it("preserves .js", () => {
    expect(normalizeText("Node.js / TypeScript")).toBe("Node.js / TypeScript")
    expect(normalizeText("React.JS is not a library!")).toBe("React.JS is not a library!")
  })

  it("preserves .NET", () => {
    expect(normalizeText(".NET ftw")).toBe(".NET ftw")
    expect(normalizeText("foo bar .NET")).toBe("foo bar .NET")
    expect(normalizeText("foo (.NET)")).toBe("foo (.NET)")
    expect(normalizeText("scabbiaza.net")).toBe("scabbiaza.net")
  })

  it("preserves C#", () => {
    expect(normalizeText("foo C#")).toBe("foo C#")
    expect(normalizeText("C# (foo)")).toBe("C# (foo)")
    expect(normalizeText("(C#)")).toBe("(C#)")
  })
})
