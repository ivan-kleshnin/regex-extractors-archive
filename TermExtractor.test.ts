import {A} from "lib/belt"
import {roleTable, shortcutTable, skillTable} from "./taxonomy"
import {TermExtractor} from "./TermExtractor"

const skillExtractor = new TermExtractor(skillTable, [roleTable, shortcutTable])

describe("TermExtractor() as skillExtractor", () => {
  describe(".extractFromText(_, 'User')", () => {
    function extract(text: string): string[] {
      return A.uniq(skillExtractor.extractFromText(text, "User")).sort()
    }

    describe("handles terms that collide with common words", () => {
      it("handles Go word", () => {
        // Standalone
        expect(extract("go")).toEqual([])
        expect(extract("Go")).toEqual(["Go"])
        expect(extract("#go")).toEqual(["Go"])
        expect(extract("golang")).toEqual(["Go"])

        // Start of sentence
        // | [@]
        expect(extract("go outside, it's beautiful out there.")).toEqual([])
        // | [@/pc]
        expect(extract("Go outside!")).toEqual([])
        // | [@] [TERM]
        expect(extract("go, rest")).toEqual(expect.arrayContaining(["Go"]))
        // | [@/pc] [TERM]
        expect(extract("Go, REST")).toEqual(expect.arrayContaining(["Go"]))
        // | [@] [TERM/u]
        expect(extract("go & rust taste the dust")).toEqual(expect.arrayContaining(["Go"]))
        expect(extract("go developer")).toEqual(["Go"])
        expect(extract("go engineer")).toEqual(["Go"])

        // End of sentence
        // [@] |
        expect(extract("I would like to go")).toEqual([])
        // HS [@/pc] |
        expect(extract("I would like to. Go")).toEqual([])
        // SS [@/pc] |
        expect(extract("I would like to Go")).toEqual(["Go"])
        // -
        expect(extract("Rest and go")).toEqual(expect.arrayContaining(["Go"]))
        // [TERM/u] [@]
        expect(extract("Rust and go")).toEqual(expect.arrayContaining(["Go"]))     // uSkill + Skill
        expect(extract("developer of go")).toEqual(expect.arrayContaining(["Go"])) // Role + Skill
        expect(extract("engineer of go")).toEqual(expect.arrayContaining(["Go"]))  // Shortcut + Skill

        // Middle of sentence (behaves as at the end of sequence)
        // [@]
        expect(extract("I would go with automation and feedback")).toEqual(["Automation"])
        // HS [@/pc]
        expect(extract("I would. Go with automation and feedback")).toEqual(["Automation"])
        // SS [@/pc]
        expect(extract("I would Go with automation and feedback")).toEqual(["Automation", "Go"])
        // [TERM] [@]
        expect(extract("My skills include python, go")).toEqual(expect.arrayContaining(["Go"]))
        // [@] [TERM]
        expect(extract("finally go rest")).toEqual([])
        // [@] [TERM/u]
        expect(extract("My skills include go, python")).toEqual(expect.arrayContaining(["Go"]))
        expect(extract("I'm finally a go engineer")).toEqual(["Go"])  // Skill + Role
        expect(extract("I'm finally a go developer")).toEqual(["Go"]) // Skill + Shortcut
        // [TERM/u] [@]
        expect(extract("My skills include python, go")).toEqual(expect.arrayContaining(["Go"]))
      })

      it("handles REST word", () => {
        // Same as "Go" but additionally extracts this
        expect(extract("foo. REST")).toEqual(["REST"])
      })

      it("handles Product word", () => {
        expect(extract("product manager")).toEqual(["Product"])
        expect(extract("foo bar Product something")).toEqual(["Product"])
        expect(extract("manager of product")).toEqual(["Product"])
        expect(extract("we develop this product for fun and profit, and I'm the manager")).toEqual([])
        expect(extract("Determined to finish project the best way possible.")).toEqual([])
      })

      it("handles BI word", () => {
        expect(extract("BI Analyst")).toEqual(["Business"])
        expect(extract("hey are a bi person")).toEqual([])
      })
    })

    describe("handles separators", () => {
      expect(extract("frontend@to.backend backend@to.frontend frontend@google.com backend@google.com"))
        .toEqual([])

      expect(extract("my-sql-engineer just-manager-sql"))
        .toEqual(["MySQL"])
    })

    describe("handles duplicates", () => {
      expect(extract("PHP php PHP"))
        .toEqual(["PHP"])

      expect(extract("Node JS"))
        .toEqual(["NodeJS"])
    })

    describe("handle synthetic cases", () => {
      it("handles set #1", () => {
        expect(extract("frontend.to@google to.frontend@google backend.to@google to.backend@google"))
          .toEqual([])

        expect(extract("frontend-backend backend-frontend"))
          .toEqual(["Backend", "Frontend"])

        expect(extract("Speaks assembly, will travel"))
          .toEqual([])
      })
    })

    describe("handles skills in real bios", () => {
      // Tested on 80+ (many are multicased in one) real-world bios
      it("handles set #1 (+3/-2)", () => {
        expect(extract("Software Engineer, Tech Lead in Rust, WASM, TypeScript"))
          .toEqual(["Rust", "WebAssembly", "Software", "Tech", "TypeScript"].sort())

        expect(extract("Web developer with experience in JavaScript, Go and Swift"))
          .toEqual(["JavaScript", "Go", "Swift", "Web"].sort())

        expect(extract("Containers , Rest API, Python , Go and Beyond"))
          .toEqual(["REST", "Python", "Go"].sort())

        expect(extract("I would go with Automation and Feedback. The rest are secondary tools"))
          .toEqual(["Automation"])

        expect(extract("Young, passionate and enthusiastic. Always learning, go rest in your grave"))
          .toEqual([])
      })

      it("handles set #2 (+3/-2)", () => {
        expect(extract("Self-employed web engineer. #Rust #Wasm #Go #TypeScript #React #REST"))
          .toEqual(["Rust", "WebAssembly", "Go", "TypeScript", "React", "REST", "Web"].sort())

        expect(extract("I like Python, JS/TS, Go, Postgres, Kubernetes, Docker, DevOps."))
          .toEqual(["Python", "JavaScript", "TypeScript", "Go", "PostgreSQL", "Kubernetes", "Docker"].sort())

        expect(extract("working with React, Node, Go, and the rest"))
          .toEqual(["React", "NodeJS", "Go"].sort())

        expect(extract("LDM ball cube ball big cube ball next Rest In Peace niflheim vismuth slow wave fast robot keep going! slow ship go! slow ball Auto? fast dual ship slow fast ufo"))
          .toEqual([])

        expect(extract("I have no idea how far I can go, but I`m sure I don`t like to stay here for the rest of my life"))
          .toEqual([])
      })

      it("handles set #3 (+3/-2)", () => {
        expect(extract("A Full Stack developer with expertise in ASP.Net (Legacy, Core), Angular, Ionic, NativeScript, nopCommerce and more..."))
          .toEqual(["Fullstack", ".NET", "Angular", "Ionic"].sort())

        expect(extract("Time to move on. Learning MomentJS currently"))
          .toEqual(["MomentJS"].sort())

        // "MEAN Stack" can be captured as skills via shortcuts (separately)
        expect(extract("React | Node JS | REST | MEAN Stack developer"))
          .toEqual(["React", "NodeJS", "REST"].sort())

        expect(extract("I'm learning the rest as I go on"))
          .toEqual([])

        // FP, until POS analysis
        expect(extract("Where projects go to rest"))
          .toEqual(["Go"])
      })

      it("handles set #4 (+3/-2)", () => {
        expect(extract("Fullstack Developer | Dotnet | Angular"))
          .toEqual(["Fullstack", ".NET", "Angular"].sort())

        expect(extract("Elegant Golang REST API Framework"))
          .toEqual(["Go", "REST"].sort())

        expect(extract("Simple HTTP and REST client library for Go"))
          .toEqual(["HTTP", "REST", "Go"].sort())

        expect(extract("No time to rest/ Time to go"))
          .toEqual([])

        expect(extract("When we meet you would find out the rest"))
          .toEqual([])
      })

      it("handles set #5 (+3/-2)", () => {
        expect(extract("Po of Open棟梁 Pj / PMP / .NET, .NET Core ≫ OAuth / OIDC, FAPI, FIDO, SAML ≫ IdMaaS, mBaaS / JavaScript ≫ Frontend, IoT Edge. 静岡 → 新潟 → 東京 → 広島"))
          .toEqual(["Frontend", "IoT", ".NET", "JavaScript", "OpenAuth"].sort())

        // FP for "Data" from "Apollo Data Graph"
        expect(extract("I transform ideas into a beautiful reality. (Flutter, Node.js, Angular, React.js, PHP, Apollo Data Graph, OpenAPI, More...)"))
          .toEqual(["Data", "Flutter", "NodeJS", "Angular", "React", "PHP", "Apollo", "OpenAPI"].sort())

        expect(extract("Fullstack web developer with focus on front end services. Experienced with React/React Native, PHP, MySQL, GraphQL, Angularjs, Prisma, Expo"))
          .toEqual(["Web", "Fullstack", "Frontend", "React", "React Native", "PHP", "MySQL", "GraphQL", "Angular", "Prisma"].sort())

        expect(extract("With no desire，at rest and still. All things go right as of their will"))
          .toEqual([])

        expect(extract("far better rest I go to than I have ever known"))
          .toEqual([])
      })

      it("handles set #6 (+3/-2)", () => {
        expect(extract("Senior Backend Developer (.NET) at Dow Jones"))
          .toEqual([".NET", "Backend"].sort())

        // "Fullstack" is a shortcut
        expect(extract("Full-stack developer Vue, Nuxt, Headless CMS, Wordpress+GraphQL, Django/Python - 15+years"))
          .toEqual(["Django", "Fullstack", "GraphQL", "NuxtJS", "Headless CMS", "Python", "VueJS", "WordPress"].sort())

        expect(extract("javascript, reactjs, react native, redux, electron, nodejs, php/laravel, mysql"))
          .toEqual(["JavaScript", "React", "React Native", "Redux", "Electron", "NodeJS", "PHP", "Laravel", "MySQL"].sort())

        // FP, until POS analysis
        expect(extract("Where old projects go to live out the rest of their days"))
          .toEqual(["Go"])

        expect(extract("Go big or go home"))
          .toEqual([])
      })

      it("handles set #7 (+3/-2)", () => {
        // "frontender" is a shortcut
        expect(extract("Learning React & Next.js to become a proficient frontender"))
          .toEqual(["React", "NextJS"].sort())

        expect(extract("just wanna do some go/rust for the rest of life"))
          .toEqual(["Go", "Rust"].sort())

        expect(extract("xR / Unity Engineer"))
          .toEqual(["Unity"])

        expect(extract("rust@to.go go@to.rust rust@google.com go@google.com"))
          .toEqual([])

        expect(extract("rust.to@google to.rust@google go.to@google to.go@google"))
          .toEqual([])
      })

      it("handles set #8 (+3/-2)", () => {
        expect(extract("✐Python ✎Jupyter Notebook"))
          .toEqual(["Python", "Jupyter"].sort())

        expect(extract("#Python #Jupyter #pandas #docker"))
          .toEqual(["Python", "Jupyter", "Pandas", "Docker"].sort())

         expect(extract("I'm a FrontEnd Developer Vue Angular RxJs Redux Typescript JavaScript HTML5 CSS3 WebStorm"))
           .toEqual(["Frontend", "VueJS", "Angular", "RxJS", "Redux", "TypeScript", "JavaScript", "HTML", "CSS", "WebStorm"].sort())

        expect(extract("go-rust-php rust-go-php"))
          .toEqual(["Rust"])

        expect(extract("Speaks assembly, will travel."))
          .toEqual([])
      })

      it("handles set #9 (+3/-2)", () => {
        expect(extract("data science | machine learning | deep learning | artificial intelligence | Python | SQL | Jupyter | Matlab | RaspberryPi"))
          .toEqual(["Data Science", "Deep Learning", "Machine Learning", "Python", "SQL", "Jupyter", "MATLAB", "Raspberry Pi"].sort())

        expect(extract("Python/PyData/Jupyter dev. Thoughtful bug filer, aspirant open source messaging crafter, sometimes lisper."))
          .toEqual(["Open Source", "Jupyter", "Python"].sort())

        // "DevOps" is a shortcut
        expect(extract("Fields of Interest : 🔢 💯 • Cyber Security • Cloud Computing • Python, R, Jupyter • Advanced DevOps • Amazon Web Services (AWS)"))
          .toEqual(["Cloud", "Security", "Web", "Jupyter", "Python", "AWS", "R"].sort())

        expect(extract("@jupyter | @jupyterhub | @ipython | @jupyter-incubator | @jupyter-resources | @jupytercalpoly | @jupyter-attic"))
          .toEqual([])

        // "Fullstack" is a shortcut
         expect(extract("Full Stack Developer and Software Engineering Instructor at General Assembly"))
          .toEqual(["Engineering", "Fullstack", "Software"].sort())
      })

      it("handles set #10 (+3/-2)", () => {
        // FP for "management"
        expect(extract("FULL STACK JAVA | NETBEANS | C# | MICROSOFT MANAGEMENT STUDIO | JAVASCRIPT | VISUAL CODE | JUPYTER NOTEBOOK | PYTHON & RUBY"))
          .toEqual(["Jupyter", "Fullstack", "JavaScript", "Management", "NetBeans", "Python", "Java", "C#", "Ruby"].sort())

        expect(extract("MSTICPy author/maintainer. Working in Microsoft Threat Intelligence Center (MSTIC) on Python and Jupyter notebooks for security defenders/blue teams."))
          .toEqual(["Security", "Python", "Jupyter"].sort())

        // "MERN stack" can be captured as skills via shortcuts (separately)
        expect(extract("Application Architect with 10+ years of experience in MERN, DJANGO, REACT/REDUX, CODEIGNITER, JUPYTER, ANACONDA"))
          .toEqual(["Application", "Django", "React", "Redux", "Jupyter", "Anaconda"].sort())

        // "Gopher", "Pythonista", "Rubyist" can be captured as skills via shortcuts (separately)
        expect(extract("Gopher, Pythonista, Rubyist"))
          .toEqual([])

        expect(extract("University of Florida CS Graduate Student, worked at @jupyter, currently working for @facebook"))
          .toEqual(["Computer Science"])
      })

      it("handles set #11 (+3/-2)", () => {
        expect(extract("Debugger debugger at WebStorm JetBrains MSE student at ITMO University"))
          .toEqual(["WebStorm"].sort())

        expect(extract("Web & Blockchain Developer 🎨React(Next), Vue(Nuxt), Angular, 🎄Laravel, Node.js, Django 🎗React Native, Flutter 🎈Smart Contract(Solidity)="))
          .toEqual(["Web", "Blockchain", "React", "NextJS", "VueJS", "NuxtJS", "Angular", "Laravel", "NodeJS", "Django", "React Native", "Flutter", "Solidity"].sort())

        expect(extract("NumPy, SciPy, Numba, Conda, PyData, NumFocus, Anaconda, Quansight, OpenTeams"))
          .toEqual(["NumPy", "SciPy", "Numba", "Anaconda"].sort())

        expect(extract("cosmologist | @conda-forge core | @conda steering (emeritus)"))
          .toEqual([])

        expect(extract("Ce qui mérite d'être"))
          .toEqual([])
      })

      it("handles set #12 (+4/-1)", () => {
        expect(extract("Ruby/Rails JavaScript Ember.js Clojure Node.js"))
          .toEqual(["Ruby", "Ruby on Rails", "JavaScript", "EmberJS", "Clojure", "NodeJS"].sort())

        expect(extract("Ethereum | Flutter | Hyperledger Fabric"))
          .toEqual(["Ethereum", "Flutter"].sort())

        expect(extract("Unity, ECS, C#, Typescript Node.JS, Android"))
          .toEqual(["Unity", "C#", "TypeScript", "NodeJS", "Android"].sort())

        expect(extract("developer:iOS,Robot,Fintech"))
          .toEqual(["Fintech", "iOS"])

        expect(extract("rest-http-api api-http-rest"))
          .toEqual(["API"])
      })

      it("handles set #13 (+3/-2)", () => {
        expect(extract("B.Sc Computer Science Graduated | JAVA,Android , React, React Native ,C#,C++,C,JS,SQL,Firebase,Unity"))
          .toEqual(["Computer Science", "Java", "Android", "React", "React Native", "C#", "C++", "C", "JavaScript", "SQL", "Firebase", "Unity"].sort())

        expect(extract("Ruby and C, plus Perl back in the day. Wannabe Crystal and Elixir programmer. Currently doing Rails stuff."))
          .toEqual(["Ruby", "C", "Perl", "Crystal", "Elixir", "Ruby on Rails"].sort())

        expect(extract("C Plus Plus programmar from India"))
          .toEqual(["C++"].sort())

        expect(extract("software house company from surabaya. website dveloper and roid developer ecoomerce and ERP."))
          .toEqual(["Software"])

        expect(extract("Le code c'est plus qu'une passion pour moi"))
          .toEqual([])
      })

      it("handles set #14 (+3/-2)", () => {
        expect(extract("Go/Python/Java, Web/K8S"))
          .toEqual(["Go", "Python", "Java", "Kubernetes", "Web"].sort())

        expect(extract("practical experience with C++/Java"))
          .toEqual(["C++", "Java"].sort())

        expect(extract("Agile developer (Java, Web, Android...) , blog #javamind, CEO of @Dev-Mind , @mixitconf staff, @MixTeen"))
          .toEqual(["Java", "Android", "Web"].sort())

        expect(extract("Java Web Media is a web design company based in Depok, West Java Indonesia."))
          .toEqual(["Design", "Java", "Web"]) // accepted false positives for "Java" and "Web" (first instance)

        expect(extract("The java.lang.Math"))
          .toEqual([])
      })

      it("handles set #15 (+3/-1)", () => {
        expect(extract("NIT Robocon Member 🥰 Arduino / OpenSiv3D / Qt / WindowsAPI / C / C++"))
          .toEqual(["Arduino", "C", "C++", "Robotics"].sort())

        expect(extract("Android on Raspberry Pi"))
          .toEqual(["Android", "Raspberry Pi"].sort())

        expect(extract("Arduino addict. Java programmer in real life"))
          .toEqual(["Arduino", "Java"].sort())

        // "Rubist" and "Vimer" can be captured as skills via shortcuts (separately)
        expect(extract("Rubist, Vimer, write Crust, Koltin"))
          .toEqual([])
      })

      it("handles set #16 (+3/-2)", () => {
        expect(extract("Keen user of d3.js, and Raspberry Pi's."))
          .toEqual(["D3JS", "Raspberry Pi"].sort())

        expect(extract("Unity, Serverless, Kubernetes, Pulumi, Terraform, Swift, Go, Kotlin, C#, PowerShell, TypeScript, AWS, Google Cloud and Azure."))
          .toEqual(["AWS", "Azure", "C#", "GCP", "Go", "Kotlin", "Kubernetes", "Pulumi", "Swift", "Terraform", "TypeScript", "Unity"].sort())

        expect(extract("Full-stack developer / Node.JS / Angular / MongoDB / Google Cloud Platform"))
          .toEqual(["NodeJS", "Fullstack", "Angular", "MongoDB", "GCP"].sort())

        expect(extract("Creator of vim-go. Tool maker. Vimming into the Rusts"))
          .toEqual(["Vim"])

        expect(extract("👩🏽‍💻 Software Developer 📚 Book worm 🎬 Movie enthusiast 🎧 Music lover 🥔 Couch potato"))
          .toEqual(["Software"]) // should not match with CouchDB and Couchbase
      })

      it("handles set #17 (+3/-1)", () => {
        expect(extract("Developer • Speaker • Microsoft MVP Azure, .NET, Blazor"))
          .toEqual([".NET", "Blazor", "Azure"].sort())

        expect(extract("Developer Advocate for Google Cloud Platform. #python #golang"))
          .toEqual(["GCP", "Python", "Go"].sort())

        expect(extract("Lead Engineer @firstdollar GraphQL/TypeScript/PostgreSQL on Google Cloud"))
          .toEqual(["GraphQL", "TypeScript", "PostgreSQL", "GCP"].sort())

        // ! Azure-AWS not matched, intentionally but
        expect(extract("Losang Jinpa, PhD, MCSE/MCT: Cloud Native DevOps-GitOps Engineer on Azure-AWS, Kubernetes AKS-EKS-GKE, Terraform, Python, Golang, Ansible, HashiCorp Vault"))
          .toEqual(["Ansible", "Azure", "Cloud", "Go", "Kubernetes", "Python", "Terraform"].sort())
      })

      it("handles set #18 (+2/-0)", () => {
        expect(extract("Cloud Engineer - Google Cloud, AWS, Terraform, Python, Docker"))
          .toEqual(["AWS", "Cloud", "GCP", "Terraform", "Python", "Docker"].sort())

        expect(extract("R3F | Hubs | Nextjs | FlutterGetX | ThirdWeb | Alchemy | Solidity | Firebase | Mongodb | CouchDB | Polygon | Ethereum | Google Cloud"))
          .toEqual(["NextJS", "Solidity", "Firebase", "MongoDB", "CouchDB"/*, "Polygon"*/, "Ethereum", "GCP"].sort())

        expect(extract("Fullstack Web Dev PHP5 | MariaDB | CSS3 | HTML5 | SASS | JavaScript"))
          .toEqual(["PHP", "Fullstack", "MariaDB", "CSS", "HTML", "SASS", "JavaScript", "Web"].sort())

        expect(extract("Full stack Developer || Angular || React (NextJs) || Svelte kit || Node || Nest || PHP5 || Couch CMS ||"))
          .toEqual(["Angular", "CMS", "Fullstack", "React", "NextJS", "NodeJS", "NestJS", "PHP", "SvelteKit"].sort())
      })
    })
  })
})

// TODO
//   expect(extract("I'm a web dev, enthusiastic and purposeful.")).toEqual([webEngineer])
//   expect(extract("I'm a junior dev, aspiring to become senior.")).toEqual([softwareEngineer])
//   expect(extract("PHP dev.")).toEqual([softwareEngineer])
//   expect(extract("I'm a Dev with a knowledge of web")).toEqual([softwareEngineer])
//   expect(extract("Enable Dev mode to run this.")).toEqual([softwareEngineer]) // FP in 'User' mode, TN in 'Other'
//   expect(extract("Disable DEV mode")).toEqual([softwareEngineer])             // FP in 'User' mode, TN in 'Other'
//   expect(extract("We develop this product for fun and profit!")).toEqual([])
//   expect(extract("PHP developers are very nice.")).toEqual([])
