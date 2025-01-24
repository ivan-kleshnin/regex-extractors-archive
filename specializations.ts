import type {Competence} from "./competence"
import {
  analystSkills,
  architectSkills,
  designerSkills,
  engineerSkills,
  managerSkills,
  scientistSkills
} from "./roles"
import {joinWords} from "./utils"

function whiteBlack(whitelist: string[], blacklist: string[] = []) {
  const whitelistSet = new Set(whitelist)
  const blacklistSet = new Set(blacklist)

  function isWhitelisted({skill, role}: Competence): boolean {
    return whitelistSet.has(joinWords([skill, role])) || whitelistSet.has(skill) || whitelistSet.has(role)
  }
  function isBlacklisted({skill, role}: Competence): boolean {
    return blacklistSet.has(joinWords([skill, role])) || blacklistSet.has(skill) || blacklistSet.has(role)
  }

  return function (cs: Competence[]): boolean {
    return (
      cs.some(c => isWhitelisted(c)) &&
      !cs.some(c => isBlacklisted(c))
    )
  }
}

type Predicate = (competences: Competence[]) => boolean

export type SpecializationCategory = {
  predicate: Predicate
  obviousSkills: string[]
}

export const analystGroup: Dict<SpecializationCategory> = {
  "Business": {
    predicate: whiteBlack(["Business Analyst"]),
    obviousSkills: analystSkills("Business"),
  },
  "Data": {
    predicate: whiteBlack(["Data Analyst"]),
    obviousSkills: analystSkills("Data"),
  },
  "Marketing": {
    predicate: whiteBlack(["Marketing Analyst"]),
    obviousSkills: analystSkills("Marketing"),
  },
  "Security": {
    predicate: whiteBlack(["Security Analyst"]),
    obviousSkills: analystSkills("Security"),
  },
}

export const architectGroup: Dict<SpecializationCategory> = {
  "Backend": {
    predicate: whiteBlack(["Backend Architect"]),
    obviousSkills: architectSkills("Backend"),
  },
  "Blockchain": {
    predicate: whiteBlack(["Blockchain Architect"]),
    obviousSkills: architectSkills("Blockchain"),
  },
  "Cloud": {
    predicate: whiteBlack(["Cloud Architect", "AWS Architect", "GCP Architect", "Azure Architect"]),
    obviousSkills: architectSkills("Cloud"),
  },
  "Data": {
    predicate: whiteBlack(["Data Architect"]),
    obviousSkills: architectSkills("Data"),
  },
  "Database": {
    predicate: whiteBlack(["Database Architect"]),
    obviousSkills: architectSkills("Database"),
  },
  "DevOps": {
    predicate: whiteBlack(["DevOps Architect"]),
    obviousSkills: architectSkills("DevOps"),
  },
  "Frontend": {
    predicate: whiteBlack(["Frontend Architect"]),
    obviousSkills: architectSkills("Frontend"),
  },
  "Hardware": {
    predicate: whiteBlack(["Hardware Architect"]),
    obviousSkills: architectSkills("Hardware"),
  },
  "Infrastructure": {
    predicate: whiteBlack(["Infrastructure Architect"]),
    obviousSkills: architectSkills("Infrastructure"),
  },
  "Mobile": {
    predicate: whiteBlack(["Mobile Architect"]),
    obviousSkills: architectSkills("Mobile"),
  },
  "Security": {
    predicate: whiteBlack(["Security Architect"]),
    obviousSkills: architectSkills("Security"),
  },
  "Software": {
    predicate: whiteBlack(["Software Architect"]),
    obviousSkills: architectSkills("Software"),
  },
  "Solution": {
    predicate: whiteBlack(["Solution Architect"]),
    obviousSkills: architectSkills("Solution"),
  },
  "System": {
    predicate: whiteBlack(["System Architect"]),
    obviousSkills: architectSkills("System"),
  },
  "Web": {
    predicate: whiteBlack(["Web Architect"]),
    obviousSkills: architectSkills("Web"),
  },
}
/*
  Architect
    Solution Architect ~= Entreprise Solution Architect (the most general but in a non-tech scope, so it's not a parent of below)
    System Architect ~= Cloud Architect (in-between Solution and Software architects)
    Software Architect
    Infrastructure Architect -- not used yet (jobs are eaten by Cloud)
    Data Architect
    Security Architect

  DevOps Architect ~= Principal DevOps Engineer
  Database Architect ~= Principal Database Engineer
  Frontend Architect ~= Principal Frontend Engineer
  Backend Architect ~= Principal Backend Engineer
  Technical Architect ~= Application Architect ~= Lead Software Engineer
  ^ almost India-specific title
*/

export const designerGroup: Dict<SpecializationCategory> = {
  "3D": {
    predicate: whiteBlack(["3D Designer"]),
    obviousSkills: designerSkills("3D"),
  },
  "Game": {
    predicate: whiteBlack(["Game Designer"]),
    obviousSkills: designerSkills("Game"),
  },
  "Graphic": {
    predicate: whiteBlack(["Graphic Designer"]),
    obviousSkills: designerSkills("Graphic"),
  },
  "Product": {
    predicate: whiteBlack(["Product Designer"]),
    obviousSkills: designerSkills("Product"),
  },
  // UI/UX
  "UI/UX": {
    predicate: whiteBlack(["UI/UX Designer"]),
    obviousSkills: designerSkills("UI/UX"),
  },
  "Mobile": {
    predicate: whiteBlack(["Mobile Designer"]),
    obviousSkills: designerSkills("Mobile"),
  },
  "Web": {
    predicate: whiteBlack(["Web Designer"]),
    obviousSkills: designerSkills("Web"),
  },
}

export const engineerGroup: Dict<SpecializationCategory> = {
  // SOFTWARE
  "Software": {
    predicate: whiteBlack([
      "Software Engineer"
    ]),
    obviousSkills: engineerSkills("Software"),
  },

  // BLOCKCHAIN
  "Blockchain": {
    predicate: whiteBlack([
      "Blockchain Engineer", "Solidity Engineer", "Vyper Engineer",
    ]),
    obviousSkills: engineerSkills("Blockchain"),
  },
  // TODO not clear: "Crypto", "DeFi", "Web3",
  // "Smart-Contract" aliased to "Blockchain"

  // DEVOPS
  "DevOps": {
    predicate: whiteBlack([
      "DevOps Engineer", "Cloud Engineer", // Ansible? Maven?
      "Chef Engineer", "Jenkins Engineer",
      "Kubernetes Engineer", "Puppet Engineer", "Salt Engineer", "Terraform Engineer",
      "AWS Engineer", "GCP Engineer", "Azure Engineer"
    ]),
    obviousSkills: engineerSkills("Cloud", "DevOps"),
  },

  // EMBEDDED
  // "Embedded": whiteBlack([
  //   "Embedded Engineer", "Arduino Engineer", "Firmware Engineer", "Raspberry Pi Engineer"
  // ]),

  // WEB
  "Web": {
    predicate: whiteBlack([
      // FE
      "Angular Engineer", "ClojureScript Engineer", "EmberJS Engineer", "Frontend Engineer",
      "Svelte Engineer", "React Engineer", "VueJS Engineer",
      // BE
      "Backend Engineer", "Django Engineer", "Express Engineer", "Flask Engineer", "PHP Engineer",
      "Koa Engineer", "Laravel Engineer", "NestJS Engineer", "Phoenix Engineer", "Ruby on Rails Engineer",
      // FS
      "Fullstack Engineer", "NextJS Engineer", "NextJS Engineer", "Remix Engineer", "SvelteKit Engineer",
      // LOW-CODE
      "Airtable Engineer", "Drupal Engineer", "Hygraph Engineer",
      "Magento Engineer", "Shopify Engineer", "WordPress Engineer",
      // *
      "Web Engineer"
    ]),
    obviousSkills: engineerSkills("Web"),
  },
  // "Web (Generalist)": {
  //   predicate: function (cs: Competence[]): boolean {
  //     // Do we even need this category given two other Generalist categories??
  //     // If we remove it – where people with only "Web Engineers" competence would go...?
  //     const doesFrontend = engineerGroup["Frontend"].predicate(cs)
  //     const doesBackend = engineerGroup["Backend"].predicate(cs)
  //     const doesFullstack = engineerGroup["Fullstack"].predicate(cs)
  //     const doesLowCode = engineerGroup["Low-Code"].predicate(cs)
  //     const doesAbstractWeb = !(doesFrontend || doesBackend || doesFullstack || doesLowCode)
  //       && whiteBlack(["Web Engineer"])(cs)
  //     return doesFullstack || doesLowCode || doesAbstractWeb
  //   },
  //   obviousSkills: ["Web"],
  // },
  // "Fullstack": {
  //   predicate: function (cs: Competence[]): boolean {
  //     const doesFrontend = engineerGroup["Frontend"].predicate(cs)
  //     const doesBackend = engineerGroup["Backend"].predicate(cs)
  //     const extra = ["Fullstack Engineer", "NextJS Engineer", "NextJS Engineer", "Remix Engineer", "SvelteKit Engineer"]
  //     const doesFullstack = whiteBlack(extra)(cs)
  //     return (doesFrontend && doesBackend) || doesFullstack
  //   },
  //   obviousSkills: ["Web", "Fullstack"],
  // },
  // Can be "Frontend" and "Backend" at the same time but not "Frontend" and "Fullstack"...
  // "Frontend": {
  //   predicate: whiteBlack([
  //     "Angular Engineer", "ClojureScript Engineer", "EmberJS Engineer", "Frontend Engineer",
  //     "Svelte Engineer", "React Engineer", "VueJS Engineer",
  //   ]),
  //   obviousSkills: ["Frontend"],
  // },
  // "Backend": {
  //   predicate: whiteBlack([
  //     "Backend Engineer", "Django Engineer", "Express Engineer", "Flask Engineer", "PHP Engineer",
  //     "Koa Engineer", "Laravel Engineer", "NestJS Engineer", "Phoenix Engineer", "Ruby on Rails Engineer",
  //   ]),
  //   obviousSkills: ["Backend"],
  // },
  // "Low-Code": {
  //   predicate: whiteBlack([
  //     "Airtable Engineer", "Drupal Engineer", "Hygraph Engineer",
  //     "Magento Engineer", "Shopify Engineer", "WordPress Engineer",
  //   ]),
  //   obviousSkills: ["Low-Code"],
  // },

  // HARDWARE
  // ...
  // NETWORKING
  // ...
  // INFRASTRUCTURE
  // ...

  // MOBILE
  "Mobile": {
    predicate: whiteBlack([
      // CP
      "Dart Engineer", "Flutter Engineer", "Xamarin Engineer", "React Native", "Vue Native",
      // HY
      "Cordova Engineer", "Ionic Engineer", "PhoneGap Engineer", "NativeScript Engineer",
      // NA
      "Native Android Engineer", "Kotlin Engineer",
      // NI
      "Native iOS Engineer", "Swift Engineer", "Objective C Engineer",
      // *
      "Mobile Engineer", "Android Engineer", "iOS Engineer",
    ]),
    obviousSkills: engineerSkills("Mobile"),
  },
  // "Mobile (Generalist)": function (cs: Competence[]): boolean {
  //   const doesAndroidNative = this["Native Android"](cs)
  //   const doesIosNative = this["Native iOS"](cs)
  //   const doesCrossPlatform = this["Cross-Platform"](cs)
  //   const doesMobileWebHybrid = this["Mobile/Web Hybrid"](cs)
  //   const doesAbstractMobile = !(doesAndroidNative || doesIosNative || doesCrossPlatform || doesMobileWebHybrid)
  //     && whiteBlack(["Mobile Engineer"])(cs)
  //   return (
  //     doesCrossPlatform || doesMobileWebHybrid || (doesAndroidNative && doesIosNative) || doesAbstractMobile
  //   )
  // },
  // // Can be "Android Native" and "iOS Native" at the same time but not "Android" and "Cross-Platform"...
  // // Can be "Cross-Platform" and "Hybrid" at the same time
  // "Cross-Platform": whiteBlack([
  //   "Dart Engineer", "Flutter Engineer", "Xamarin Engineer", "React Native", "Vue Native"
  // ]),
  // "Mobile/Web Hybrid": whiteBlack([
  //   "Cordova Engineer", "Ionic Engineer", "PhoneGap Engineer", "NativeScript Engineer"
  // ]),
  // "Native Android": function (cs: Competence[]) {
  //   const extraSet = new Set(["Native Android Engineer", "Kotlin Engineer"])
  //   return cs.some(c => extraSet.has(joinWords(c.skill, c.role))) ||
  //     whiteBlack(["Android Engineer"], ["Flutter", "Xamarin", "Cordova", "NativeScript", "PhoneGap", "React Native", "Vue Native"])(cs)
  // },
  // "Native iOS": function (cs: Competence[]) {
  //   const extraSet = new Set(["Native iOS Engineer", "Objective C Engineer", "Swift Engineer"])
  //   return cs.some(c => extraSet.has(joinWords(c.skill, c.role))) ||
  //     whiteBlack(["iOS Engineer"], ["Flutter", "Xamarin", "Cordova", "NativeScript", "PhoneGap", "React Native", "Vue Native"])(cs)
  // },

  // QA / AUTOMATION
  "QA & Automation": {
    predicate: whiteBlack([
      "QA Engineer", "Automation Engineer", "Cypress Engineer", "Playwright Engineer", "Selenium Engineer",
    ]),
    obviousSkills: engineerSkills("QA", "Automation"),
  },
  // TODO "Cucumber", "Gherkin", find more automation tools
  // TODO how to fit "Tester" & "Testing"?

  // DATA
  "Data & ML": {
    predicate: whiteBlack([
      // DT
      "Data Engineer", "ETL Engineer",
      // ML
      "Deep Learning Engineer", "Keras Engineer", "Machine Learning Engineer", "NLP Engineer",
      "PyTorch Engineer", "Scikit-learn Engineer", "Spacy Engineer", "TensorFlow Engineer",
    ]),
    obviousSkills: engineerSkills("Data", "Machine Learning"),
  },
  // "Data": whiteBlack(new Set([
  //   "Data Engineer", "ETL Engineer",
  // ])),
  // // R, Julia, Pandas, Spacy, NLP, AI, Jupyter -- not sure
  // "Machine Learning": whiteBlack(new Set([
  //   "Deep Learning Engineer", "Keras Engineer", "Machine Learning Engineer",
  //   "PyTorch Engineer",
  //   "Scikit-learn Engineer", "Spacy Engineer", "TensorFlow Engineer",
  // ])),

  // GAMES
  "Game": { // shouldn't it be "Gamedev"?
    predicate: whiteBlack(["Game Engineer", "Godot Engineer", "Unity Engineer", "Unreal Engineer"]),
    obviousSkills: engineerSkills("Game"),
  },
  // TODO AR/VR skill

  // SECURITY
  "Security": {
    predicate: whiteBlack(["Security Engineer"]),
    obviousSkills: engineerSkills("Security"),
  },
  // TODO Metasploit, Nmap, Netcat, Ncat, Nikto, Burpsuite, Splunk, Wireshark, John the Ripper, Aircrack-ng, Nessus, Snort
}

export const managerGroup: Dict<SpecializationCategory> = {
  "Engineering": {
    predicate: whiteBlack(["Engineering Manager"]),
    obviousSkills: managerSkills("Engineering"),
  },
  "Product": {
    predicate: whiteBlack(["Product Manager"]),
    obviousSkills: managerSkills("Product"),
  },
  "Project": {
    predicate: whiteBlack(["Project Manager"]),
    obviousSkills: managerSkills("Project"),
  },
  // TODO "Program"?
}

export const scientistGroup: Dict<SpecializationCategory> = {
  // COMPUTER
  "Computer": {
    predicate: whiteBlack(["Computer Scientist"]),
    obviousSkills: scientistSkills("Computer"),
  },
  "Security": {
    predicate: whiteBlack(["Security Scientist", "Vulnerability Scientist"]),
    obviousSkills: scientistSkills("Security"),
  },

  // DATA
  "Data": {
    predicate: whiteBlack(["Data Scientist"]),
    obviousSkills: scientistSkills("Data"),
  },
  "Machine Learning": {
    predicate: whiteBlack(["Machine Learning Scientist"]),
    obviousSkills: scientistSkills("Machine Learning"),
  },
  "NLP": {
    predicate: whiteBlack(["NLP Scientist"]),
    obviousSkills: scientistSkills("NLP"),
  },
}

export const specializationGroups: Dict<Dict<SpecializationCategory>> = {
  "Analyst": analystGroup,
  "Architect": architectGroup,
  "Designer": designerGroup,
  "Engineer": engineerGroup,
  "Manager": managerGroup,
  "Scientist": scientistGroup,
}

/*
type Node = {
  name: string
  role?: string
  // generalize?: boolean
  children?: Node[]
}

export const rawAnalystSkillTree: Node = {name: "", children: [
  {name: "Business"},
  {name: "Data"},
  {name: "Marketing"},
  {name: "Security"},
]}

export const rawArchitectSkillTree: Node = {name: "", children: [
  {name: "Backend"},
  {name: "Blockchain"},
  {name: "Cloud"},
  {name: "Data"},
  {name: "Database"},
  {name: "DevOps"},
  {name: "Frontend"},
  {name: "Mobile"},
  {name: "Security"},
  {name: "Software"},
  {name: "Solution"},
  {name: "System"},
  {name: "Web"},
]}

export const rawDesignerSkillTree: Node = {name: "", children: [
  {name: "3D"},
  {name: "Graphic"},
  {name: "Product"},
  {name: "UI/UX", children: [
    {name: "Mobile"},
    {name: "Web"},
  ]}
]}

export const rawEngineerSkillTree: Node = {name: "", children: [
  {name: "Software", children: [
    {name: "Blockchain"},
    {name: "DevOps"},
    {name: "Embedded"},
    {name: "Game", children: [
      // {name: "Unity"},
      // {name: "Unreal"},
    ]},
    {name: "Mobile (Generalist)", children: [
      {name: "Cross-Platform"},
      {name: "Mobile/Web Hybrid"},
      {name: "Native Android"},
      {name: "Native iOS"},
    ]},
    {name: "Web (Generalist)", children: [
      {name: "Backend"},
      {name: "Frontend"},
      {name: "Fullstack"},
      {name: "Low-Code"},
    ]},
    {name: "QA & Automation"},
  ]},
  {name: "Hardware", children: []},
  {name: "Infrastructure", children: []},
  {name: "Security", children: []},
  {name: "Robotics", children: []},
  // LATER {name: "IoT"},
  // LATER {name: "Data", role: "?", children: [
  //       {name: "Anaconda", generalize: true},
  //       {name: "Power BI", generalize: true, role: "Analyst"},
  //       {name: "Jupyter", generalize: true},
  //       {name: "Linear Algebra", generalize: true},
  //       {name: "Machine Learning", generalize: true, children: [
  //         {name: "Deep Learning"},
  //         {name: "TensorFlow"},
  //       ]},
  //       {name: "NLP", generalize: true},
  //       {name: "Statistics", generalize: true, children: [
  //         {name: "R"},
  //       ]},
  //     ]},
  //   ]
  // }
]}
*/
