// console.log(
//   // extractTitles("Technical / Project Manager | Full stack Developer"),
//   // extractTitles("Swift Developer, Mobile Developer"),
//   // extractTitles("Swift Mobile Developer"),
//   extractTitles("Senior Developer, Swift Developer, Java Developer, Backend Developer"),
//   // extractTitles("Swift Java Developer, Java Developer"),
//   // extractTitles("Swift Developer | Mobile Generalist"),
//   extractTitles("Senior Technical / Project Manager | Swift Developer | Mobile Generalist. Looking for work opportunities. Twitter DMs open."),
//   // extractTitles("Senior Manager: Product. Junior Project Manager. Generalist Manager"),
// )

// extractFromBio("Full Stack MERN, Laravel-PHP Developer, SDE Intern@Trello"),
// extractFromBio("Junior computer engineering student at Middle East Technical University"),

console.log(
  // extractClaims("Power Platform Developer | AWS Solution Architect")
  // extractFromBio("Power Platform Developer | AWS Solution Architect")
  // extractFromBio("Senior Frontend Engineer at @Fignum. MSc in Informatics and BSc in Computer Science. Interested in web development and IoT.")
  // extractFromBio("Junior Full-Stack Web Developer • Senior Architect")
  // extractFromBio("Senior Tech Recruiter && Junior Full Stack Developer")
  // extractFromBio("Junior Web Developer | Senior Motorcyclist")
  // extractFromBio("junior software engineer, senior at life and stuff") // original had ; which worked differently
  // extractFromBio("Senior analyst, junior rails developer")
  // extractFromBio("Junior web dev (4 months old), can also be useful as senior designer (15 years old)")
  // extractFromBio("Junior coder, senior gamer")
)

// FLAWS
// extractFromBio("Senior Computer Engineering student |Junior Software developer")
// -> "Junior" seniority is lost because | is not a hard separator and "student" consumed that Claims obj.
//    if it wasn't consumed, it'd get "Senior"...
// -> "Engineering" is added to interests @_@

// extractFromBio("Not So (X) Senior Software Engineer．Tech Lead．Life Hacker．Junior Entrepreneur")
// -> "Technical" is added to interests @_@
// -> because "Tech Lead" vs "Technical Lead". Related to the above.

// extractFromBio("Senior Tech Recruiter && Junior Full Stack Developer")
// -> "Technical" is added to interests @_@
// -> gets seniority: "Senior"
// = should Recruiter be a stop role?
// = revisit HARD_SEP? (or toggle SEP modes conditionally?)

// extractFromBio("Junior Web Developer | Senior Motorcyclist")
// -> gets "Senior" from the other group
// = revisit HARD_SEP? (or toggle SEP modes conditionally?)
// = return back to [SENIORITY] [TERM] [ROLE] parsing @_@

// extractFromBio("junior software engineer, senior at life and stuff") // original had ; which worked differently
// => gets "Senior" from the other group
// = as above

// extractFromBio("Junior coder, senior gamer")
// => gets "Senior" from the other group
// = as above

// extractFromBio("Junior Full-Stack Web Developer • Senior Architect")
// -> by "Architect" he meant 🏗️ @_@

// console.log(
//   extractTitleGroups("Django/Python junior/middle programmer"),
//   "\n=>\n",
//   generalizeTitles(extractTitleGroups("Django/Python junior/middle programmer"))
//   // extractTitleGroups("Junior HTML & CSS Developer. Senior JAVA"),
//   // extractTitleGroups("Junior computer engineering student at Middle East Technical University"),
//   // "\n=>\n",
//   // generalizeTitles(extractTitleGroups("Junior HTML & CSS Developer. Senior JAVA")),
// )

// console.dir(
//   extractTitles("Frontend Middle Developer"),
//   // generalizeTitles(extractTitleGroups("Frontend Middle Developer")),
//   // {depth: 99}
// )

console.log(
  // extractClaims("Azure IoT Engineer | Azure Data Engineer"),
  // extractFromBio("Full-Stack Developer | JavaScript | PHP | TailwindCSS | WordPress | React | Former intern @appsters and student @Medieinstitutet"),
  // extractFromBio("Backend Programmer | IoT Engineer"),
  // extractClaims("Foo PHP. Backend and Frontend (CSS & HTML) developer / coder. Sometimes a manager"),
  // extractClaims("manual QA-engineer (junior)"),
  // extractClaims("junior developer-devops"),
  // interpretSpecializations([
  //   {/*skills: ["php"],*/ specializations: ["backend", "frontend"/*, "project"*/], roles: []/*"engineer", "manager"]*/},
  // ]),
  // extractClaims("senior DevOps"),
  // extractClaims("I'm very mobile. php backend but also css frontend"),
  // extractClaimGroups("I'm very mobile. php backend but also css frontend. manager. studied in middle university"),
)

// TODO junior[-–]middle
// TODO middle[-–]senior
// should be specializations with MOE defined in CRM

// console.dir(
//   extractTitles("Project Manager. Know CSS / JavaScript. Former PHP engineer"),
//   {depth: 99}
// )
// console.log()
// console.log(
//   extractTitles("ui&ux designer"),
//   extractTitles("ui &ux designer")
// )

// // import {
// //   extractCompanies,
// //   extractPrevCompanies,
// //   preNormalizeStr,
// //   PREV_COMPANY1,
// //   PREV_COMPANY2
// // } from "../??"
// // // //  Engineer @vercel. Previously @atlassian and @facebook -> {input: "Engineer", company: "vercel"}, {prevCompany: "atlassian"}, {prevCompany: "facebook"}
// // // //  Prev @Facebook, @OMMultiverse
// // // //  software engineer in Facebook
// // // //  Building developer tools at Replay; formerly React core at @facebook, and @google.
// // // //  eng @ Chime. previously @facebook @pinterest
// // // //  Research Scientist at Facebook Reality Labs -> {input: "Research Scientist", company: "facebook reality labs", current: true}
// // // //  @maxcnunes on Twitter, Facebook, and etc    -> ???
// // // //  Google Brain. Previously at Facebook AI Research -> {input: "Google Brain"}, {company: "facebook ai research", current: false}
// // // //  CTO @ Gab, Former Facebook, created Parse Server -> {input: "CTO", company: "Gab"}, {prevCompany: "Facebook", input: "Created Parser Server"}
// // // //  @graphql co-creator, ex-@facebook engineer
// // // //  Founder & hacker @tidbyt (formerly @facebook, @spotify) Bla-Blah
// // // //    -> {input: "Founder & hacker", company: "tidbyt"}, {prevCompany: "facebook"}, {prevCompany: "spotify"}, {input: "Bla-blah"}
// // // //  Founder & hacker @tidbyt (formerly @facebook, @spotify Bla-Blah)
// // // //    -> {input: "Founder & hacker", company: "tidbyt"}, {prevCompany: "facebook"}, {prevCompany: "spotify", input: "Bla-blah"}
// // // //  Previously built tools @facebook and designed @github, @twitter, and @pinterest.
// // // //    -> {input: "built tools", prevCompany: "facebook"}
// // // //    -> {input: "designed", prevCompany: "github"}
// // // //    -> {prevCompany: "twitter"}
// // // //    -> {prevCompany: "pinterest"}
// // // //  Research Scientist @ Facebook
// // // //  Studied Computer Science at ETHZ. Fluent in Nix and Haskell
// // // //  Studied @SoftUni
// // // //
// // // //  https://github.com/oliviertassinari
// // // //  CEO, co-founder at @mui • co-creator of Material UI • studied @TelecomParis • ex @doctolib
// // // //    -> {input: "CEO, co-founder", company: "mui"}
// // // //    -> {input: "co-creator of Material UI"}
// // // //    -> {education: "TelecomParis"}
// // // //    -> {prevCompany: "doctolib"}
// // // // */
// // // //
// // // //
// // // // const cases = [
// // // //   "Tech & Something Lead @facebook",
// // // //   // "Frontend Engineer @Facebook. React, GraphQL, etc. Studied Web Design at University",
// // // //   // "React, GraphQL, etc. Learned all that at University",
// // // //   // "Frontend Engineer @Facebook. React & GraphQL ftw!",
// // // //   // I am an aspiring CSS, PHP Developer working hard at Facebook",
// // // //   // "Java Full Stack Developer",   // fails: support chained specializations
// // // //   // "Java Backend Developer",      // fails: support chained specializations
// // // //   // "Full Stack/Freelance Developer", // fails: support chained specializations
// // // // // Back -end-developer              // fails: typos
// // // // //   "Java, Python, Web developer"
// // // // //   "Senior FullStack Cloud Developer", // incomplete: support chained specializations
// // // // // Multi Cloud Developer (AWS, AZURE, GCP)
// // // // // SharePoint, Microsoft 365, Power Platform and Azure developer
// // // // // .Net, Angular, SqlServer and Azure developer
// // // // //   ".NET Full stack Developer", -- incomplete, support chained specializations
// // // // // Azure Cloud DevOps Engineer
// // // // // Azure Certified Developer Associate
// // // // //   "designer/developer", // ok
// // // // // C++ Developer
// // // // //   "Python-developer", // fails: typos, how often is that?
// // // // //   "FullStack Developer & DevOps Engineer", // partially ok
// // // // //   "ML developer", // special case, should get Data Science and Software Engineer?!
// // // // //   "Golang developer", //  ok
// // // // //   "Computer Vision Developer", // ok
// // // // //   "C# Backend Developer",      // ok
// // // // //   "Python / Django developer", // ok
// // // // // Software Developer (Node.js, Python, React)
// // // // //   "Backend Software Developer", // ok
// // // // // mobile/web developer
// // // // //   "Ruby On Rails Developer", // ok
// // // // //
// // // // // Python / C++ / Verilog developer // fails: support microelectronics?
// // // // // Frontend-developer JavaScript
// // // // //   "Developer / software engineer, .NET (C#)", // wtf, water is wet? // ok
// // // // // Python, C++, C developer
// // // // // Java/Kotlin freelance developer
// // // // // Java/Scala/Big data developer
// // // // // Java, cloud, big data, analytics, BI developer
// // // // // Senior Hadoop and Spark Developer. (Big Data )
// // // // // Java/Big Data Developer
// // // // // Programmer, Java, Scala, Python, Big data developer.
// // // // //   "MySql developer",
// // // //   // "PHP Intern",
// // // //   // "Junior Designer",
// // // //   // "Senior Student",
// // // //   // "Front End Trainee",
// // // //   // "Front-End Trainee",
// // // //   // "Frontend Trainee",
// // // //   // "Fullstack Trainee",
// // // //   // "Trainee Fullstack Developer",
// // // //   // "Intern in Invogue Solutions",
// // // //   // "Accomplished Software Engineer, Ping Pong Novice",
// // // //   // "Beginner Angular Dev at Microsoft",
// // // //   // "Senior @ Amazon. Trainee at Amazon",
// // // //   // "Computer Engineering student at CEFET-MG.",
// // // //   // "I am a js, python, php developer. I live in the hometown of pandas",
// // // //   // "Student",
// // // //   // "Guru",
// // // //   // "QA at Amazon",
// // // //   // "CSS coder, JS, PHP Developer, Manager dev at Amazon", // wtf is "Manager dev"?
// // // //   // "react developer", // ok
// // // //   // "PHP, Python",
// // // //   // "Student, MTUCI(2024), 20 y.o. Trainee Frontend / Trainee Data Engineer. Stack: html+css, c++, java, python(pandas, jupyter and other), hadoop, kafka, spark",
// // // //   // "Frontend Trainee @Microsoft. Senior Engineer @ Facebook. Developer & Programmer at Amazon.",
// // // //   // "Graphic Designer",
// // // //   // "Front End Trainee | UX & UI Designer",
// // // //   // "Trainee front-end Developer",
// // // //   // "Frontend",
// // // //   // "Frontend Developer",
// // // //   // "Senior Frontend",
// // // //   // "Junior Frontend",
// // // //   // "Frontend Engineer",
// // // //   // "Frontend Trainee",
// // // //   // "Trainee Frontend",
// // // //   // "Frontend Trainee Frontend",
// // // //   // "Backend Developer",
// // // //   // "Backend Senior",
// // // //   // "Devops",
// // // //   // "PHP Developer",
// // // //   // "Laravel Developer",
// // // //   // "Ruby / Rails Developer",
// // // //   // "Senior Angular Dev at Microsoft",
// // // // ]
// // // //
// // // // // Developer
// // // // // Java Developer
// // // // // Rshiny Developer
// // // // // full stack web developer
// // // // // python developer
// // // // // Python Developer Django
// // // // // Front end web developer
// // // // // Data Scientist Software Developer
// // // // // Software Developer
// // // // // Android Developer
// // // // // Machine Learning Developer
// // // // // Cloud developer | DevOps engineer | Azure architect
// // // // // Azure PaaS Engineer
// // // // // DevOps Engineer
// // // // // Azure Developer
// // // // // Xamarin Developer
// // // // // Backend/Devops Engineer
// // // // // Azure Data Engineer
// // // // // Azure IoT Engineer | Azure Data Engineer
// // // // // Solution Architect
// // // // // Cloud-Native Full-Stack Developer
// // // // // AWS Solutions Architect, Android Developer, Web developer,
// // // // // Multi Stack Developer
// // // // // .NET+Azure developer
// // // // // MERN Stack Developer
// // // // // Full stack dot net developer
// // // // // .net, angular, azure developer
// // // // // Dotnet / Azure Developer
// // // // // new
// // // // // Java Full Stack Developer
// // // // // Java Backend Developer
// // // // // Full Stack/Freelance Developer
// // // // // Back -end-developer
// // // // // Java, Python, Web developer
// // // // // Senior FullStack Cloud Developer
// // // // // Power Platform Developer | AWS Solution Architect
// // // // // Multi Cloud Developer (AWS, AZURE, GCP)
// // // // // SharePoint, Microsoft 365, Power Platform and Azure developer
// // // // // .Net, Angular, SqlServer and Azure developer
// // // // // .NET Full stack Developer
// // // // // Azure Cloud DevOps Engineer
// // // // // Azure Certified Developer Associate
// // // // // designer/developer
// // // // // C++ Developer
// // // // // Python-developer
// // // // // FullStack Developer & DevOps Engineer
// // // // // ML developer
// // // // // Golang developer
// // // // // Computer Vision Developer
// // // // // C# Backend Developer
// // // // // Software Developer (Node.js, Python, React)
// // // // // Backend Software Developer
// // // // // Python / Django developer
// // // // // mobile/web developer
// // // // // Ruby On Rails Developer
// // // // // Python / C++ / Verilog developer
// // // // // Frontend-developer JavaScript
// // // // // Python-web-developer
// // // // // Developer / software engineer, .NET (C#)
// // // // // Robotics, Web, Android, Swift developer
// // // // // Python, C++, C developer
// // // // // Java/Kotlin freelance developer
// // // // // Salesforce Developer
// // // // // Blockchain Developer
// // // // // Java/Scala/Big data developer
// // // // // Aspiring Flutter App Developer
// // // // // Java, cloud, big data, analytics, BI developer
// // // // // Senior Hadoop and Spark Developer. (Big Data )
// // // // // Java/Big Data Developer
// // // // // Programmer, Java, Scala, Python, Big data developer.
// // // // // Developer and Security Analyst
// // // // // Sql server developer
// // // // // Ruby/RoR developer
// // // //
// // // // // TODO specializations for MANAGER, DESIGNER, etc. roles
