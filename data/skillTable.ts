export type SkillRow = {
  pattern: string
  category: "tech" | "platform" | "lang" | "topic"
  role?: string
}

// SECURITY TOOLS
// React: 4.6M repos (for number scale)
// Splunk: 8.9K repos -- logging platform. Belongs to "DevOps" and "Security".
// Nmap: 6.8K repos -- network mapper, security scanner. Belongs to "Networking" and "Security".
// Metasploit: 3.6K repos -- pen. test software. Belongs to "Security" mostly.
// Wireshark: 4.6K repos -- network scanner. Lower-level data than Nmap. Belongs to "Security" and "Networking".
// Netcat (Ncat): 2.5K repos -- TCP/IP utility. Used by "Security" testers mostly.
// Snort: 1.8K repos -- network security system. Belongs to "Security". Conflicts with "snort" verb.
// Nessus: 1.6K repos, 83 users -- vulnerability scanner. Belongs to "Security".
// Burpsuite: 1.3K repos, 15 users
// Aircrack-ng: 454 repos, 5 users
// Nikto: 352 repos -- too many false positives
// John the Ripper: 210 repos, 7 ysers

export const rawSkillTable: Dict<SkillRow> = {
  ".NET": {pattern: "asp.net, dotnet=core, dotnet, .net=core, .net", category: "platform", role: "Engineer"},
  // .NET is a general-purpose platform for Windows development
  // TODO ASP.NET is a framework for web service (backend) development, a part of .NET platform
  "AWS": {pattern: "aws", category: "platform", role: "Engineer"},
  "Azure": {pattern: "microsoft-azure, azure", category: "platform", role: "Engineer"},
  "GCP": {pattern: "google=cloud, gcp", category: "tech", role: "Engineer"},
  "Airflow": {pattern: "airflow", category: "platform"},
  "Airtable": {pattern: "airtable", category: "platform", role: "Engineer"},
  "Firebase": {pattern: "firebase", category: "platform", role: "Engineer"},
  "Anaconda": {pattern: "anaconda, miniconda, conda", category: "tech"},
  "Angular": {pattern: "angular=js, angular", category: "platform", role: "Engineer"},
  "Ansible": {pattern: "ansible", category: "platform", role: "Engineer"},
  // "Apache": -- ambiguous
  "Apollo": {pattern: "apollo=js, apollo=client, apollo=server, apollo", category: "platform", role: "Engineer"},
  "Beautiful Soup": {pattern: "beautiful=soup", category: "tech", role: "Engineer"},
  "Bootstrap": {pattern: "bootstrap", category: "tech"},
  "Blazor": {pattern: "microsoft-blazor, blazor", category: "tech"},
  "C": {pattern: "c=lang, C", category: "lang", role: "Engineer"},
  "C++": {pattern: "c=plus=plus, C++", category: "lang", role: "Engineer"},
  "C#": {pattern: "c=sharp, C#", category: "lang", role: "Engineer"},
  "Chef": {pattern: "chef", category: "platform", role: "Engineer"},
  "Clojure": {pattern: "clojurian, clojure", category: "lang", role: "Engineer"},
  "ClojureScript": {pattern: "clojure=script", category: "lang", role: "Engineer"},
  "CouchDB": {pattern: "couch=db", category: "platform", role: "Engineer"},
  "Couchbase": {pattern: "couchbase", category: "platform", role: "Engineer"},
  "Cordova": {pattern: "cordova", category: "platform", role: "Engineer"},
  "CSS": {pattern: "css3?", category: "lang"},
  // should we add new char like "css𝐕" or should we consume numbers after EACH term?
  // Most skills have versions BUT topics don't @_@
  // So it can be a per-table configuration
  "Crystal": {pattern: "crystal=lang, crystal", category: "lang", role: "Engineer"},
  "Cypress": {pattern: "cypress", category: "platform", role: "Engineer"},
  "D": {pattern: "d=lang, D", category: "lang", role: "Engineer"},
  "D3JS": {pattern: "d3.=js", category: "tech", role: "Engineer"},
  "Dart": {pattern: "dart", category: "lang", role: "Engineer"},
  "Docker": {pattern: "docker", category: "platform", role: "Engineer"},
  "Django": {pattern: "django", category: "platform", role: "Engineer"},
  "Drupal": {pattern: "drupal", category: "platform", role: "Engineer"},
  "Electron": {pattern: "electron", category: "platform", role: "Engineer"},
  "Elasticsearch": {pattern: "elastic=search", category: "platform", role: "Engineer"},
  "Elixir": {pattern: "elixir", category: "lang", role: "Engineer"},
  "EmberJS": {pattern: "ember.=js, ember", category: "platform", role: "Engineer"},
  "Erlang": {pattern: "erlang", category: "lang", role: "Engineer"},
  "Ethereum": {pattern: "ethereum", category: "tech"},
  "ETL": {pattern: "etl", category: "topic", role: "Engineer"},
  "Express": {pattern: "express.=js, express", category: "platform", role: "Engineer"},
  "FastAPI": {pattern: "fast=api", category: "tech", role: "Engineer"},
  "Figma": {pattern: "figma", category: "platform"},
  "Flask": {pattern: "flask", category: "tech", role: "Engineer"},
  "Flutter": {pattern: "flutter", category: "platform", role: "Engineer"},
  "FTP": {pattern: "s?ftp", category: "tech"},
  "Go": {pattern: "go=lang, !G[oO]", category: "lang", role: "Engineer"},
  "Godot": {pattern: "godot", category: "platform", role: "Engineer"},
  "GraphQL": {pattern: "graph=ql", category: "lang"},
  "HTTP": {pattern: "http", category: "tech"},
  "HTML": {pattern: "html\\d?", category: "lang"},
  "Hygraph": {pattern: "hygraph, graph-cms", category: "platform", role: "Engineer"},
  "Ionic": {pattern: "ionic", category: "platform", role: "Engineer"},
  "Java": {pattern: "java=lang, java\\d?\\d?", category: "lang", role: "Engineer"},
  "JavaScript": {pattern: "javascript, js", category: "lang", role: "Engineer"},
  "Jenkins": {pattern: "jenkins", category: "platform", role: "Engineer"},
  "Jupyter": {pattern: "jupyter=notebooks?, jupyter", category: "tech"},
  "Keras": {pattern: "keras", category: "tech", role: "Engineer"},
  "Kibana": {pattern: "kibana", category: "tech", role: "Engineer"},
  "Koa": {pattern: "koa=js, koa", category: "platform", role: "Engineer"},
  "Kotlin": {pattern: "kotlin", category: "lang", role: "Engineer"},
  "Kubernetes": {pattern: "kubernetes, k8s", category: "platform", role: "Engineer"},
  "Lua": {pattern: "lua", category: "lang", role: "Engineer"},
  "Magento": {pattern: "magento=cms, magento", category: "platform", role: "Engineer"},
  "MATLAB": {pattern: "matlab", category: "platform"/*, generalizeTo: {skills: ["Mathematics"]}*/}, // TODO generalize?, or math lang?
  "Matplotlib": {pattern: "matplotlib", category: "tech"},
  "MariaDB": {pattern: "mariadb", category: "platform", role: "Engineer"},
  "Metasploit": {pattern: "metasploit", category: "tech", role: "Engineer"},
  "MomentJS": {pattern: "moment.=js, !Moment", category: "tech"},
  "MongoDB": {pattern: "mongo=db, mongo", category: "platform", role: "Engineer"},
  "Material UI": {pattern: "material=ui, mui", category: "tech"},
  "MySQL": {pattern: "my=sql", category: "platform", role: "Engineer"},
  "Neo4j": {pattern: "neo4j", category: "platform", role: "Engineer"},
  "Netcat": {pattern: "netcat, ncat", category: "tech", role: "Engineer"},
  "NumPy": {pattern: "num=py", category: "tech"},
  "Laravel": {pattern: "laravel", category: "platform", role: "Engineer"},
  "Logstash": {pattern: "logstash", category: "tech", role: "Engineer"},
  "Native Android": {pattern: "native=android", category: "platform", role: "Engineer"},
  "Native iOS": {pattern: "native-ios", category: "platform", role: "Engineer"},
  "NativeScript": {pattern: "native-script", category: "platform", role: "Engineer"},
  "NetBeans": {pattern: "netbeans", category: "tech"},
  "NextJS": {pattern: "next.=js, !Next", category: "platform", role: "Engineer"},
  "NodeJS": {pattern: "node.=js, Node", category: "platform", role: "Engineer"},
  "Nessus": {pattern: "nessus", category: "tech", role: "Engineer"},
  "NestJS": {pattern: "nest.=js, Nest", category: "platform", role: "Engineer"},
  "Nginx": {pattern: "nginx", category: "tech", role: "Engineer"},
  "Nmap": {pattern: "nmap", category: "tech", role: "Engineer"},
  "Numba": {pattern: "numba", category: "tech"},
  "NuxtJS": {pattern: "nuxt.=js, Nuxt", category: "platform", role: "Engineer"},
  "Octave": {pattern: "octave", category: "lang"},
  "OpenCV": {pattern: "opencv", category: "tech"},
  "Pandas": {pattern: "pandas", category: "platform"},
  "Perl": {pattern: "perl\\d?", category: "lang", role: "Engineer"},
  "Playwright": {pattern: "playwright", category: "platform", role: "Engineer"},
  // "Polygon": {pattern: "polygon", category: "tech", role: "Engineer"},
  "PHP": {pattern: "php\\d?\\d?", category: "lang", role: "Engineer"},
  "Phoenix": {pattern: "phoenix", category: "tech", role: "Engineer"},
  "PhoneGap": {pattern: "phonegap", category: "platform", role: "Engineer"},
  "Prisma": {pattern: "prisma", category: "tech", role: "Engineer"},
  "PyCharm": {pattern: "pycharm", category: "tech"},
  "Python": {pattern: "python\\d?", category: "lang", role: "Engineer"},
  "PyTest": {pattern: "pytest", category: "tech", role: "Engineer"}, // 11K stars on GitHub
  "PyTorch": {pattern: "pytorch", category: "platform", role: "Engineer"},
  "Objective C": {pattern: "objective=c", category: "lang", role: "Engineer"},
  "OpenAPI": {pattern: "open=api", category: "tech"},
  "OpenAuth": {pattern: "open=auth2?, oauth2?", category: "tech"},
  "PostgreSQL": {pattern: "postgres?=sql, postgres", category: "platform", role: "Engineer"},
  "Postman": {pattern: "postman", category: "tech", role: "Engineer"},
  "Power Platform": {pattern: "power=platform", category: "platform"},
  "Power BI": {pattern: "power=bi", category: "platform", role: "Analyst"},
  "Pulumi": {pattern: "pulumi", category: "tech", role: "Engineer"},
  "Puppet": {pattern: "puppet", category: "platform", role: "Engineer"},
  "R": {pattern: "r=lang, R", category: "lang"},
  "React": {pattern: "react.=js, react", category: "platform", role: "Engineer"},
  "React Native": {pattern: "react=native", category: "platform", role: "Engineer"},
  "Redux": {pattern: "redux=js, redux", category: "tech", role: "Engineer"},
  "Remix": {pattern: "remix=js, remix", category: "platform", role: "Engineer"},
  "REST": {pattern: "rest=api, !REST", category: "tech"},
  "Snort": {pattern: "!snort", category: "tech", role: "Engineer"},
  "tRPC": {pattern: "trpc", category: "tech"},
  "RPC": {pattern: "rpc", category: "tech"},
  "Redis": {pattern: "redis", category: "platform", role: "Engineer"},
  "Ruby": {pattern: "ruby=lang, ruby", category: "lang", role: "Engineer"},
  "Ruby on Rails": {pattern: "ruby=on=rails, rails, RoR", category: "platform", role: "Engineer"},
  "Rust": {pattern: "rust", category: "lang", role: "Engineer"},
  "RxJS": {pattern: "rx.=js, RX", category: "tech", role: "Engineer"},
  "Salesforce": {pattern: "salesforce", category: "tech"},
  "SASS": {pattern: "sass, scss", category: "lang", role: "Engineer"},
  "Scala": {pattern: "scala", category: "lang", role: "Engineer"},
  "SciPy": {pattern: "sci=py", category: "tech"},
  "Seaborn": {pattern: "seaborn", category: "tech"},
  "Selenium": {pattern: "selenium", category: "platform", role: "Engineer"},
  "Scikit-learn": {pattern: "scikit=learn, sklearn", category: "platform", role: "Engineer"},
  "Shopify": {pattern: "shopify", category: "platform", role: "Engineer"},
  "Solidity": {pattern: "solidity", category: "lang", role: "Engineer"},
  "Spacy": {pattern: "spacy", category: "platform", role: "Engineer"},
  "Spark": {pattern: "spark", category: "tech", role: "Engineer"}, // or Apache Spark?
  "Splunk": {pattern: "splunk", category: "tech", role: "Engineer"},
  "Spring": {pattern: "spring", category: "tech"}, // TODO how to confidently differentiate Spring.js and Java Spring?!
  "SQL": {pattern: "sql", category: "lang"},
  "SQLite": {pattern: "sqlite\\d?", category: "platform", role: "Engineer"}, // not sure, ~600 analysts mentioned "MySQL", and ~8 also "SQLite"
  "Salt": {pattern: "salt", category: "platform", role: "Engineer"},
  "Svelte": {pattern: "svelte", category: "platform", role: "Engineer"},
  "SvelteKit": {pattern: "svelte=kit", category: "platform", role: "Engineer"},
  "Swift": {pattern: "swift", category: "lang", role: "Engineer"},
  "Tailwind": {pattern: "tailwind=css, tailwind", category: "tech"},
  "TensorFlow": {pattern: "tensorflow", category: "platform", role: "Engineer"},
  "Terraform": {pattern: "terraform", category: "platform", role: "Engineer"},
  "TypeScript": {pattern: "type=script, ts", category: "lang", role: "Engineer"},
  "Unity": {pattern: "unity=3d, unity", category: "platform", role: "Engineer"},
  "Unreal": {pattern: "unreal\\d?, UE=\\d?", category: "platform", role: "Engineer"},
  "Vim": {pattern: "neovim, vim", category: "tech"},
  "VueJS": {pattern: "vue.=js, vue\\d?", category: "platform", role: "Engineer"},
  "Vue Native": {pattern: "vue=native", category: "platform", role: "Engineer"},
  "Visual Studio Code": {pattern: "vs=code", category: "tech"},
  "WordPress": {pattern: "wordpress", category: "platform", role: "Engineer"},
  "WebAssembly": {pattern: "web=assembly, wasm", category: "tech"},
  "WebStorm": {pattern: "webstorm=ide, webstorm", category: "tech"},
  "Wireshark": {pattern: "wireshark", category: "tech", role: "Engineer"},
  "Xamarin": {pattern: "xamarin", category: "platform", role: "Engineer"},
  "XML": {pattern: "xml", category: "lang"},
  "Vyper": {pattern: "vyper", category: "lang", role: "Engineer"},
  "Web3.js": {pattern: "web3.js", category: "tech"},

  "Windows": {pattern: "windows", category: "platform", role: "Engineer"},
  "macOS": {pattern: "mac=os", category: "platform", role: "Engineer"},
  "Linux": {pattern: "linux, ubuntu", category: "platform", role: "Engineer"},
  "Unix": {pattern: "unix", category: "platform", role: "Engineer"},
  "iOS": {pattern: "ios", category: "platform", role: "Engineer"},
  "Android": {pattern: "android", category: "platform", role: "Engineer"},
  "Raspberry Pi": {pattern: "raspberry=pi'?s?", category: "platform", role: "Engineer"},
  "Arduino": {pattern: "arduino", category: "platform", role: "Engineer"},

  // TOPICS ----------------------------------------------------------------------------------------
  "Application": {pattern: "application", category: "topic"},
  "Security": {pattern: "cyber=security, cyber=sec, it=security, security", category: "topic"},
  "Performance": {pattern: "performance", category: "topic"},
  "Scalability": {pattern: "scalability", category: "topic"},
  "Vulnerability": {pattern: "vulnerability, penetration, VA/PT", category: "topic"},
  "Testing": {pattern: "testing", category: "topic"},
  "Business": {pattern: "business, biz, !BI", category: "topic"},
  "Biotech": {pattern: "biotech", category: "topic"},
  "Fintech": {pattern: "fintech", category: "topic"},
  "Edtech": {pattern: "edtech", category: "topic"},
  "E-commerce": {pattern: "e=commerce", category: "topic"},
  "Open Source": {pattern: "open=source, fl?oss, f?oss", category: "topic"},
  "Robotics": {pattern: "robotics, robocon", category: "topic"},
  "Mathematics": {pattern: "mathematics, maths?", category: "topic"},
  "CI/CD": {pattern: "ci/=cd", category: "topic"},
  "UI/UX": {pattern: "u[ix]/=u[ix], u[ix], user=interface, human=interface", category: "topic"},
  "Chemistry": {pattern: "chemistry", category: "topic"},
  "Physics": {pattern: "physics", category: "topic"},
  "Photography": {pattern: "photography", category: "topic"},
  "2D": {pattern: "2d", category: "topic"},
  "3D": {pattern: "3d", category: "topic"},
  // "Font": {pattern: "fonts?", category: "topic"}, // disambiguate?
  "Animation": {pattern: "animation, motion", category: "topic"},
  "Automation": {pattern: "automation", category: "topic", role: "Engineer"},
  "Backend": {pattern: "back=end, !BE", category: "topic", role: "Engineer"},
  "Blockchain": {pattern: "block=chain, smart=contract", category: "topic", role: "Engineer"},
  "Cloud": {pattern: "cloud=native, cloud", category: "topic", role: "Engineer"},
  "DevOps": {pattern: "", category: "topic", role: "Engineer"},
  "Fullstack": {pattern: "full=stack", category: "topic", role: "Engineer"},
  "Mobile": {pattern: "mobile", category: "topic"},
  "Game": {pattern: "!game", category: "topic"},
  "Graphic": {pattern: "graphics?", category: "topic", role: "Designer"},
  "Software": {pattern: "software, !SW", category: "topic", role: "Engineer"},
  "Hardware": {pattern: "hardware", category: "topic", role: "Engineer"},
  "Firmware": {pattern: "firmware", category: "topic", role: "Engineer"},
  "Frontend": {pattern: "front=end, !FE", category: "topic", role: "Engineer"},
  "QA": {pattern: "", category: "topic", role: "Engineer"},
  "Embedded": {pattern: "embedded", category: "topic", role: "Engineer"},
  "IoT": {pattern: "iot", category: "topic", role: "Engineer"},
  "Computer Vision": {pattern: "computer=vision", category: "topic"},
  "AI": {pattern: "artifical=intelligence, ai", category: "topic"},
  "Level": {pattern: "level", category: "topic"},
  "Enterprise": {pattern: "enterprise", category: "topic"},
  "CMS": {pattern: "cms", category: "topic", role: "Engineer"},
  "Headless CMS": {pattern: "headless=cms", category: "topic", role: "Engineer"},
  "Low-Code": {pattern: "low=code", category: "topic", role: "Engineer"},

  "Analytics": {pattern: "analytics", category: "topic", role: "Analyst"},
  "Architecture": {pattern: "architecture", category: "topic", role: "Architect"},
  "Design": {pattern: "design", category: "topic", role: "Designer"},
  "Engineering": {pattern: "engineering, R&D", category: "topic", role: "Engineer"},
  "Development": {pattern: "Development", category: "topic", role: "Engineer"},
  "Management": {pattern: "management", category: "topic", role: "Manager"},
  "Science": {pattern: "science", category: "topic", role: "Scientist"},

  // Role-agnostic (multi-role) topics
  "Data": {pattern: "big=data, data", category: "topic"},
  "Database": {pattern: "database=design, databases?", category: "topic"},
  "Infrastructure": {pattern: "infrastructure", category: "topic"}, // role: "Engineer" / "Architect"
  "Manual": {pattern: "manual", category: "topic"},
  "Marketing": {pattern: "marketing", category: "topic"},
  "R&D": {pattern: "r ?& ?d", category: "topic"},
  "Sales": {pattern: "sales", category: "topic"}, // another problematic word @_@
  "System": {pattern: "systems?", category: "topic"},
  "Web": {pattern: "web", category: "topic"},
  "Typography": {pattern: "typography", category: "topic"},
  "Startup": {pattern: "startups?", category: "topic"},
  "Product": {pattern: "!Products?", category: "topic"},
  "Project": {pattern: "!Projects?", category: "topic"},
  "Solution": {pattern: "!Solutions?", category: "topic"},
  "Team": {pattern: "!Teams?", category: "topic"},
  "Data Science": {pattern: "data=science, DS", category: "topic"},
  "Computer Science": {pattern: "computer=science, CS", category: "topic"},
  "Statistics": {pattern: "statistics", category: "topic"},
  "Machine Learning": {pattern: "machine=learning, ML", category: "topic"},
  "Deep Learning": {pattern: "deep=learning", category: "topic"},
  "NLP": {pattern: "natural=language=processing, nlp", category: "topic"},
  "Functional Programming": {pattern: "functional=programming, fp", category: "topic"},
  "Object Oriented Programming": {pattern: "object=oriented=programming, oop", category: "topic"},
  "Tech": {pattern: "tech, technical", category: "topic"},
  "Crypto": {pattern: "crypto, defi, web=3", category: "topic"}, // crypto enthusiast = crypto-currencies + decentralized finance (DeFi)
  "E-Commerce": {pattern: "e=commerce", category: "topic"},

  "API": {pattern: "api", category: "topic"},
  "E2E": {pattern: "end=to=end, e2e", category: "topic"},
  "TDD": {pattern: "tdd", category: "topic"},
  "BDD": {pattern: "bdd", category: "topic"},
  // Crypto vs Blockchain?!?!
  // Containers?
  // should nopCommerce -> eCommerce? But then NodeJS -> js, are there INVALID precedents like that?
  // Cloud vs Web, Cloud-Native
  //
  // "Web" is found in "Amazon Web Services": skills vs topics

  /*
  UI/UX specific words
  menu
  button
  mouse
  keyboard (can be WEB or CLI)
  screen
  scroll, scrollbar
  form (?)
  theme
  animation

  FRONTEND specific words
  image, img, gif, jpg, jpeg, png, woff
  svg
  canvas
  bundler (webpack, vite)

  BACKEND specific words
  orm
  memcached
  ActiveRecord
  migration
  KV store

  WEB specific words
  mime, header
  upload, download
  HTTPs?, s?FTP


  OS specific words
  stdin, stdout, terminal, filesystem, socket, stream, thread, process
  cli, command line, shell, runtime, schedule

  SECURITY specific words
  ssh, tls, ssl
  token, authentication, authorization, jwt, cookie
  ddos, session

  DEVOPS specific words
  cluster, container(?)
  serverless, monitoring, logging
  development, production, staging

  DEVOPS terms
  Nomad, Vault, Consul

  ARCHITECT specific words
  microservice, monolith, monorepo, Event-Driven, Vertical Slice
  Distributed
  large-scale
  saas, paas
  architectures?
  scalability
  performance
  self-hosted

  QA specific words
  Reliability

  SWE specific words
  datastructure, algorithm, oop, fp, !SOLID
  dependency injection middleware, concept, pattern, anti-patter, idiom, best practice
  deploy, build, compiler
  roadmap, computer science
  coding skills, application ideas

  TODO
  RabbitMQ, CQRS
  Kafka
  ecommerce
  infrastructure
  Vulnerability
  scanner
  auth0, aws cognito, firebase auth
  OpenID Connect Identity Provider
  network
  command

  ???
  client, server
  */
}

// TODO should we have `ruby=lang` variations if we parse `ruby` nevertheless?
// Or `=platform` if we really parse without it...
// It all slows down the parser...

// TODO GitHub Actions, GitLab CI/CD -- how to avoid false positives with GitHub

//     {name: "Architecture", role: "Architect"},
//     {name: "Analysis", role: "Analyst"},
//     {name: "Analytics", role: "Analyst"},
//     {name: "Engineering", role: "Engineer"},
//     {name: "Development", role: "Engineer"},

// TODO consider to capture "Web Frontend" as just "Frontend" because in such cases "Web"
// simply clarifies "Frontend". Such person is not a "Web Developer" in the same sense.

// https://github.com/ivan-kleshnin/devscanr/issues/701

// 4. Terms that are useful in repositories but confusing in user bios
// E.g. toast, menu, carousel, chartjs, palette, flexbox, bundler, webpack, vite, scrollbar

// http://localhost:3000/platform/search/adw0rd
// Why this profile has experienceYears: undefined?
