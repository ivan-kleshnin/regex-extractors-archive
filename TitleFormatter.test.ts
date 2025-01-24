import {TitleFormatter} from "./TitleFormatter"

describe("TitleFormatter()", () => {
  const tf = new TitleFormatter()
  describe("formatTitle()", () => {
    it("formats mentioned competences", () => {
      expect(tf.formatTitle({
        competences: [
          {skill: "Web", role: "Engineer"},
          {skill: "PHP", role: "Engineer"},
        ],
        specializations: [],
      })).toEqual("Web Engineer / PHP Developer")
    })

    it("formats predicted specializations", () => {
      expect(tf.formatTitle({
        competences: [],
        specializations: ["Backend Engineer", "Security Analyst"],
      })).toEqual("Backend Developer / Security Analyst")
    })

    it("prefers competences to specializations", () => {
      expect(tf.formatTitle({
        competences: [{skill: "Frontend", role: "Engineer"}],
        specializations: ["Backend Engineer"],
      })).toEqual("Frontend Developer")
    })

    it("trims the result to fit into 'maxLen' (80 chars by default)", () => {
      expect(tf.formatTitle({
        competences: [
          {skill: "Frontend", role: "Engineer"},
          {skill: "Web (Generalist)", role: "Engineer"}
        ],
        specializations: [],
        maxLen: 36
      })).toEqual("Frontend Developer / ...")
    })

    it("supports engineer/developer distinction", () => {
      expect(tf.formatTitle({
        competences: [{skill: "Data", role: "Engineer"}],
        specializations: [],
      })).toEqual("Data Engineer")

      expect(tf.formatTitle({
        competences: [{skill: "PHP", role: "Engineer"}],
        specializations: [],
      })).toEqual("PHP Developer")
    })

    it("supports scientist/researcher distinction", () => {
      expect(tf.formatTitle({
        competences: [{skill: "Data", role: "Scientist"}],
        specializations: [],
      })).toEqual("Data Scientist")

      expect(tf.formatTitle({
        competences: [{skill: "NLP", role: "Scientist"}],
        specializations: [],
      })).toEqual("NLP Researcher")
    })
  })
})
