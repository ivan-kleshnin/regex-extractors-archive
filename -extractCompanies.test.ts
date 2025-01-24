describe("dummy()", () => {
  it("dummy", () => {
    expect(22).toBe(22)
  })
})

// import {extractPreviousCompanies, extractCurrentCompanies, extractCompanies} from "../extractCompanies"
//
// describe("extractPreviousCompanies()", () => {
//   describe("avoids false positives", () => {
//     it("matches selected patterns only", () => {
//       expect(extractPreviousCompanies("worked at Facebook")).toEqual(["Meta"])
//       expect(extractPreviousCompanies("worked at Facebook-AI")).toEqual(["Meta"])
//       expect(extractPreviousCompanies("worked at Facebook.AI")).toEqual(["Meta"])
//       expect(extractPreviousCompanies("worked at UnFacebook")).toEqual([])
//       expect(extractPreviousCompanies("worked at Facebooker")).toEqual([])
//       expect(extractPreviousCompanies("worked at Face-book")).toEqual([])
//       expect(extractPreviousCompanies("worked at Facebook.com")).toEqual(["Meta"])
//       expect(extractPreviousCompanies("worked at https://Facebook.com")).toEqual([])
//       expect(extractPreviousCompanies("worked at @Facebook.com")).toEqual(["Meta"])
//       expect(extractPreviousCompanies("worked at foo@Facebook.com")).toEqual([])
//     })
//
//     it("does not match common words", () => {
//       expect(extractPreviousCompanies("worked at previous form")).toEqual([])
//       expect(extractPreviousCompanies("currently this, previously that")).toEqual([])
//     })
//
//     it("does not match unknown companies (or twitter accounts)", () => {
//       expect(extractPreviousCompanies("worked at @justintv")).toEqual([])
//       expect(extractPreviousCompanies("worked at @paqmind")).toEqual([])
//       expect(extractPreviousCompanies("previously known as @foobar")).toEqual([])
//     })
//   })
//
//   describe("handles 'previously-(..)' patterns", () => {
//     it("for one previous company", () => {
//       expect(extractPreviousCompanies("@twitter previously Meta")).toEqual(["Meta"])
//       expect(extractPreviousCompanies("@twitter previously @Meta")).toEqual(["Meta"])
//       expect(extractPreviousCompanies("@twitter formerly Meta")).toEqual(["Meta"])
//       expect(extractPreviousCompanies("@twitter formerly @Meta")).toEqual(["Meta"])
//       expect(extractPreviousCompanies("@twitter worked at Meta")).toEqual(["Meta"])
//       expect(extractPreviousCompanies("@twitter worked at @Meta")).toEqual(["Meta"])
//     })
//
//     it("is case insensitive", () => {
//       expect(extractPreviousCompanies("previously FACEBOOK")).toEqual(["Meta"])
//       expect(extractPreviousCompanies("formerly @facebook")).toEqual(["Meta"])
//       expect(extractPreviousCompanies("worked at FaceBook")).toEqual(["Meta"])
//     })
//
//     it("for two previous companies", () => {
//       expect(extractPreviousCompanies("@twitter previously @Facebook Amazon")).toEqual(["Meta", "Amazon"])
//       expect(extractPreviousCompanies("@twitter formerly Google, Github")).toEqual(["Google", "GitHub"])
//       expect(extractPreviousCompanies("@twitter previously Amazon & @Facebook")).toEqual(["Amazon", "Meta"])
//       expect(extractPreviousCompanies("@twitter formerly @Google and @Github")).toEqual(["Google", "GitHub"])
//     })
//
//     it("stops at hard separator", () => {
//       expect(extractPreviousCompanies("previously @Meta. Amazon")).toEqual(["Meta"])
//       expect(extractPreviousCompanies("formerly Google; Twitter")).toEqual(["Google"])
//       expect(extractPreviousCompanies("previously Amazon • @Facebook")).toEqual(["Amazon"])
//       expect(extractPreviousCompanies("formerly Microsoft (xcode) • @Facebook")).toEqual(["Microsoft"])
//       expect(extractPreviousCompanies("formerly Microsoft (xcode) (dotnet) • @Facebook")).toEqual(["Microsoft"])
//       expect(extractPreviousCompanies("Previously @facebook (https://www.facebook.com), @twitter")).toEqual(["Meta", "Twitter"])
//     })
//
//     it("stops at closing paren", () => {
//       expect(extractPreviousCompanies("(previously @Meta) Amazon")).toEqual(["Meta"])
//       expect(extractPreviousCompanies("(formerly Google) @Twitter")).toEqual(["Google"])
//       expect(extractPreviousCompanies("(also formerly Google) @Twitter")).toEqual(["Google"])
//       expect(extractPreviousCompanies("(also formerly Microsoft (xcode)) @Twitter")).toEqual(["Microsoft"])
//     })
//   })
//
//   describe("handles 'ex-(..)' pattern", () => {
//     it("for one previous company", () => {
//       expect(extractPreviousCompanies("@twitter ex-@Meta")).toEqual(["Meta"])
//       expect(extractPreviousCompanies("@twitter ex-Amazon")).toEqual(["Amazon"])
//     })
//
//     it("for two previous companies", () => {
//       expect(extractPreviousCompanies("@twitter ex-@Facebook, github")).toEqual(["Meta", "GitHub"])
//       expect(extractPreviousCompanies("@twitter ex-Amazon, @google")).toEqual(["Amazon", "Google"])
//     })
//
//     it("stops at hard separator or closing paren", () => {
//       expect(extractPreviousCompanies("ex-@Facebook. github")).toEqual(["Meta"])
//       expect(extractPreviousCompanies("ex-Amazon • @twitter")).toEqual(["Amazon"])
//       expect(extractPreviousCompanies("(ex-@google) @twitter")).toEqual(["Google"])
//     })
//
//     it("for one previous company + words", () => {
//       expect(extractPreviousCompanies("@twitter ex-lead @Facebook")).toEqual(["Meta"])
//       expect(extractPreviousCompanies("@twitter ex-lead at Amazon")).toEqual(["Amazon"])
//       expect(extractPreviousCompanies("@twitter ex-team-lead & manager @ facebook")).toEqual(["Meta"])
//     })
//
//     it("for two previous companies + words", () => {
//       expect(extractPreviousCompanies("ex-lead @Facebook, manager @twitter"))
//         .toEqual(["Meta", "Twitter"])
//     })
//
//     it("multiple companies & separators", () => {
//       expect(extractPreviousCompanies("coder @twitter (ex-lead @jnj, also @github, ex-manager @ozon) ex-gab, ex-@lyft. @gitlab"))
//         .toEqual(["Johnson & Johnson", "GitHub", "Ozon", "Gab", "Lyft"])
//
//       expect(extractPreviousCompanies("(also ex-lead @jnj (foo) and @github (bar), ex-manager @ozon) remainder"))
//         .toEqual(["Johnson & Johnson", "GitHub", "Ozon"])
//     })
//   })
//
//   describe("handles special cases", () => {
//     it("company aliases", () => {
//       expect(extractPreviousCompanies("previously Facebook")).toEqual(["Meta"])
//       expect(extractPreviousCompanies("formerly @Facebook")).toEqual(["Meta"])
//       // expect(extractPreviousCompanies("worked @AWS")).toEqual(["Amazon"])
//       expect(extractPreviousCompanies("ex @google")).toEqual(["Google"]) // TODO alt. alias
//     })
//
//     it("companies with spaced titles", () => {
//       expect(extractPreviousCompanies("worked at j&j & amazon")).toEqual(["Johnson & Johnson", "Amazon"])
//       expect(extractPreviousCompanies("ex-j&j & amazon")).toEqual(["Johnson & Johnson", "Amazon"])
//       expect(extractPreviousCompanies("ex-johnson & johnson & amazon")).toEqual(["Johnson & Johnson", "Amazon"])
//     })
//   })
// })
//
// describe("extractCurrentCompanies()", () => {
//   describe("avoids false positives", () => {
//     it("matches selected patterns only", () => {
//       expect(extractCurrentCompanies("Meta")).toEqual([])
//       expect(extractCurrentCompanies("@Meta")).toEqual([])
//       expect(extractCurrentCompanies("foo @Meta")).toEqual(["Meta"])
//       expect(extractCurrentCompanies("Meta.com")).toEqual([])
//       expect(extractCurrentCompanies("https://Meta.com")).toEqual([])
//       expect(extractCurrentCompanies("amazon")).toEqual([])
//       expect(extractCurrentCompanies("YANDEX")).toEqual([])
//     })
//
//     it("does not match common words", () => {
//       expect(extractCurrentCompanies("currently this, previously that")).toEqual([])
//     })
//   })
//
//   describe("handles 'at-(..)' pattern", () => {
//     it("one company", () => {
//       expect(extractCurrentCompanies("foo at Google")).toEqual(["Google"])
//       expect(extractCurrentCompanies("foo @Google")).toEqual(["Google"])
//       expect(extractCurrentCompanies("foo @ Google")).toEqual(["Google"])
//       expect(extractCurrentCompanies("foo at @Google")).toEqual(["Google"])
//
//       expect(extractCurrentCompanies("foo at Amazon bar")).toEqual(["Amazon"])
//       expect(extractCurrentCompanies("foo @Amazon bar")).toEqual(["Amazon"])
//       expect(extractCurrentCompanies("foo @ Amazon bar")).toEqual(["Amazon"])
//       expect(extractCurrentCompanies("foo at @Amazon bar")).toEqual(["Amazon"])
//
//       expect(extractCurrentCompanies("working at Yandex.Taxi")).toEqual(["Yandex"])
//     })
//
//     it("two companies", () => {
//       expect(extractCurrentCompanies("foo Facebook, @amazon")).toEqual(["Amazon"])
//       expect(extractCurrentCompanies("foo @ github, amazon")).toEqual(["GitHub", "Amazon"])
//       expect(extractCurrentCompanies("foo at twitter, google")).toEqual(["Twitter", "Google"])
//       expect(extractCurrentCompanies("foo @twitter, @google")).toEqual(["Twitter", "Google"])
//       expect(extractCurrentCompanies("foo @twitter, google")).toEqual(["Twitter", "Google"])
//       expect(extractCurrentCompanies("foo @twitter. google")).toEqual(["Twitter"])
//     })
//   })
//
//   describe("handles 'role, company' pattern", () => {
//     it("one company", () => {
//       // Feels like this pattern can have false-positives...
//       expect(extractCurrentCompanies("developer, Github")).toEqual(["GitHub"])
//       expect(extractCurrentCompanies("founder of Github")).toEqual(["GitHub"])
//       expect(extractCurrentCompanies("co-founder of Github")).toEqual(["GitHub"])
//
//       // Expected non-matches
//       expect(extractCurrentCompanies("founder of Github, Google")).toEqual(["GitHub"]) // COMPANY_SEQ not supported here, should be?
//       expect(extractCurrentCompanies("of Github")).toEqual([])
//       expect(extractCurrentCompanies("foo, Github")).toEqual([])
//     })
//   })
//
//   describe("handles aliases", () => {
//     it("for all cases", () => {
//       expect(extractCurrentCompanies("works at FaceBook")).toEqual(["Meta"])
//       expect(extractCurrentCompanies("works at @Facebook")).toEqual(["Meta"])
//       expect(extractCurrentCompanies("works at @AMAZON")).toEqual(["Amazon"])
//       expect(extractCurrentCompanies("works at @google")).toEqual(["Google"]) // TODO alt. alias
//     })
//   })
//
//   describe("handles mixed patterns", () => {
//     it("two companies", () => {
//       expect(extractCurrentCompanies("designer, Facebook, @google etc")).toEqual(["Meta", "Google"])
//       expect(extractCurrentCompanies("designer at Facebook, Amazon etc")).toEqual(["Meta", "Amazon"])
//       expect(extractCurrentCompanies("designer in Meta @Amazon etc")).toEqual(["Meta", "Amazon"])
//     })
//   })
// })
//
// describe("extractCompanies()", () => {
//   describe("handles <=2 previous + current companies", () => {
//     it("Set #1", () => {
//       expect(extractCompanies("designer @Facebook ex-@google")).toEqual({
//         currentCompanies: ["Meta"],
//         previousCompanies: ["Google"],
//       })
//
//       expect(extractCompanies("ex-@google. Designer @Facebook")).toEqual({
//         currentCompanies: ["Meta"],
//         previousCompanies: ["Google"],
//       })
//
//       expect(extractCompanies("ex-@google, @Facebook")).toEqual({
//         currentCompanies: [],
//         previousCompanies: ["Google", "Meta"],
//       })
//
//       // TODO allow only COMPANY_SEQ after `ex-` variant? This is wrong IMO:
//       expect(extractCompanies("ex-@google, designer @Facebook")).toEqual({
//         currentCompanies: [],
//         previousCompanies: ["Google", "Meta"],
//       })
//
//       expect(extractCompanies("Formerly Google. Currently an engineer @Facebook")).toEqual({
//         currentCompanies: ["Meta"],
//         previousCompanies: ["Google"],
//       })
//     })
//
//     it("Set #2", () => {
//       expect(extractCompanies("engineer @Facebook AI ex-@google")).toEqual({
//         currentCompanies: ["Meta"],
//         previousCompanies: ["Google"],
//       })
//
//       expect(extractCompanies("designer at google ex-Facebook")).toEqual({
//         currentCompanies: ["Google"],
//         previousCompanies: ["Meta"],
//       })
//
//       expect(extractCompanies("ex-Facebook wizard. Now team-lead at @Google")).toEqual({
//         currentCompanies: ["Google"],
//         previousCompanies: ["Meta"],
//       })
//
//       expect(extractCompanies("Former @Google manager. Someone @Facebook")).toEqual({
//         currentCompanies: ["Meta"],
//         previousCompanies: ["Google"],
//       })
//     })
//   })
//
//   describe("handles multiple previous + current companies", () => {
//     it("Set #1", () => {
//       expect(extractCompanies("designer @Facebook, @google, ex-Twitter")).toEqual({
//         currentCompanies: ["Meta", "Google"],
//         previousCompanies: ["Twitter"],
//       })
//
//       expect(extractCompanies("designer at google, Twitter (ex-Facebook)")).toEqual({
//         currentCompanies: ["Google", "Twitter"],
//         previousCompanies: ["Meta"],
//       })
//
//       expect(extractCompanies("Designer, Facebook. Google. Previously Amazon")).toEqual({
//         currentCompanies: ["Meta"],
//         previousCompanies: ["Amazon"],
//       })
//
//       expect(extractCompanies("designer @Facebook. Previously @google, @twitter")).toEqual({
//         currentCompanies: ["Meta"],
//         previousCompanies: ["Google", "Twitter"],
//       })
//     })
//   })
//
//   describe("handles real GitHub bios", () => {
//     it("Set #1", () => {
//       expect(extractCompanies("ex-Meta, ex-Twitter wizard. Now team-lead @Google @Amazon")).toEqual({
//         currentCompanies: ["Google", "Amazon"],
//         previousCompanies: ["Meta", "Twitter"],
//       })
//
//       expect(extractCompanies("Team-lead @Google and @Twitter. Previously @Facebook and @amazon")).toEqual({
//         currentCompanies: ["Google", "Twitter"],
//         previousCompanies: ["Meta", "Amazon"],
//       })
//
//       expect(extractCompanies("Former at @Google, @Facebook manager. Now @Twitter")).toEqual({
//         currentCompanies: ["Twitter"],
//         previousCompanies: ["Google", "Meta"],
//       })
//
//       expect(extractCompanies("works @amazon (aws), previously @facebook (GraphQL), and @microsoft (dotnet, Xbox)")).toEqual({
//         currentCompanies: ["Amazon"],
//         previousCompanies: ["Meta", "Microsoft"],
//       })
//
//        expect(extractCompanies("I was hacked over 2 years ago. My identity was stolen. My pictures erased, Facebook ruined, instagram ruined. All my apps and my entire phone is compromised")).toEqual({
//         currentCompanies: [],
//         previousCompanies: [],
//       })
//     })
//
//     it("Set #2", () => {
//       expect(extractCompanies("AI Researcher, ex-Meta, ex-Lyft")).toEqual({
//         currentCompanies: [],
//         previousCompanies: ["Meta", "Lyft"],
//       })
//
//       expect(extractCompanies("🌿 Building @mintlify | Ex-SWE @Meta")).toEqual({
//         currentCompanies: ["Mintlify"],
//         previousCompanies: ["Meta"],
//       })
//
//       expect(extractCompanies("former intern @appsters and student @Medieinstitutet")).toEqual({
//         currentCompanies: [],
//         previousCompanies: ["Appsters", "Medieinstitutet"],
//       })
//
//       expect(extractCompanies("4th year systems design engineering student at the University of Waterloo. Data science intern @facebook. Previously @asc-csa and @LoyaltyOne.")).toEqual({
//         currentCompanies: ["University of Waterloo", "Meta"],
//         previousCompanies: ["Canadian Space Agency", "LoyaltyOne"],
//       })
//     })
//
//     it("Set #3", () => {
//       expect(extractCompanies("Previously: security engineer at Square, co-author of HackLang, put the 's' in https at Facebook. Maker of CTFs.")).toEqual({
//         currentCompanies: [],
//         previousCompanies: ["Square", "Meta"],
//       })
//
//       expect(extractCompanies("working on spanner @google. previously @twosigma + @facebook on database engines + distributed systems")).toEqual({
//         currentCompanies: ["Google"],
//         previousCompanies: ["Twosigma", "Meta"],
//       })
//
//       expect(extractCompanies("product engineer @getcord, passionate about virtual reality, artificial intelligence and cloud computing. previously @facebook, @OculusVR, @adobe")).toEqual({
//         currentCompanies: [],
//         previousCompanies: ["Meta", "Adobe"],
//       })
//
//       expect(extractCompanies("PE Intern @Meta. Previously @justintv, @uniiverse, and @wizeline")).toEqual({
//         currentCompanies: ["Meta"],
//         previousCompanies: [],
//       })
//
//       expect(extractCompanies("Currently ToDesktop. Previously PingyHQ. @DaveJ on Twitter.")).toEqual({
//         currentCompanies: ["Todesktop"],
//         previousCompanies: [],
//       })
//     })
//
//     it("Set #4", () => {
//       expect(extractCompanies("Cofounder @beeper. Previously, Partner @ YCombinator, founder of Pebble. Contact: DM me on Twitter")).toEqual({
//         currentCompanies: [],
//         previousCompanies: ["Y Combinator", "Pebble"],
//       })
//
//       expect(extractCompanies("Senior Data Scientist in Twitter, previously at @datasparkanalytics")).toEqual({
//         currentCompanies: ["Twitter"],
//         previousCompanies: ["Dataspark Analytics"],
//       })
//
//       // TODO
//       // Applied Research @DeepMind / Previously ML R&D @Twitter, @Spotify / PhD in Brain Graph Analysis and Machine Learning @BioMedIA
//     })
//   })
// })
//
