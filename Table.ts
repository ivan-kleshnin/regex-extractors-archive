import {A} from "lib/belt"
import autoBind from "auto-bind"
import type {SkillRow} from "./data"
import {
  type DisambiguateShortcut,
  disambiguateTerm,
  type DisambiguateTerm,
  disambiguateShortTerm
} from "./disambiguate"
import {type Claim, expandSubpattern, expandSubpatternForLengthComparison, LB, RB} from "./utils"

abstract class Table {
  ambiguous: Map<string, RegExp>

  protected constructor() {
    autoBind(this)
    this.ambiguous = new Map()
  }

  abstract [Symbol.iterator](): Iterator<{name: string, regex: RegExp}>

  // Find `name` by matched `value` (currently used for captured LEFT / RIGHT terms to disambiguate a central TERM)
  parse(word: string | undefined): string | undefined {
    if (!word) {
      return undefined
    }
    for (const {name, regex} of this) {
      if (new RegExp("^" + regex.source + "$", "i").test(word)) {
        return name
      }
    }
    return undefined
  }

  isPerfectlyCased(name: string, term: string): boolean | undefined {
    const regex = this.ambiguous.get(name)
    if (!regex) {
      return undefined
    }
    return regex.test(term)
  }
}

// TermTable
export type TermRow<R extends object> = {
  pattern: string
  disambiguate?: DisambiguateTerm
} & R

export type TermItem<R extends object> = {
  name: string
  regex: RegExp
  disambiguate?: DisambiguateTerm
} & R

export class TermTable<R extends object> extends Table {
  rows: Dict<TermRow<R>>
  items: TermItem<R>[]

  constructor(rows: Dict<TermRow<R>>) {
    super()

    this.rows = rows
    this.items = []

    const namedRows: (TermRow<R> & {name: string})[] = []
    for (const [name, {pattern, disambiguate = disambiguateTerm, ...rest}] of Object.entries(rows)) {
      const subpatterns = pattern.split(/ ?, ?/).map(s => s.trim())
      const ambiguous = pattern.includes("!")
      if (ambiguous) {
        const caseSensitiveRegex = new RegExp(
          "^(" + subpatterns.filter(p => p.startsWith("!")).map(this.expandSubpattern).join("|") + ")$"
        )
        this.ambiguous.set(name, caseSensitiveRegex)
      }
      const lowerSubpatterns = A.uniq(subpatterns.map(s => s.toLowerCase()))
      for (const subpattern of lowerSubpatterns) {
        const ambiguous = subpattern.includes("!")
        namedRows.push({
          name,
          pattern: subpattern,
          disambiguate: ambiguous ? disambiguate : undefined,
          ...rest
        } as TermRow<R> & {name: string})
      }
    }

    namedRows.sort((a, b) => {
      const subpatternA = expandSubpatternForLengthComparison(a.pattern)
      const subpatternB = expandSubpatternForLengthComparison(b.pattern)
      return subpatternA.length < subpatternB.length ? 1 :
             subpatternA.length > subpatternB.length ? -1 : 0
    })

    for (const row of namedRows) {
      const regex = new RegExp(this.expandSubpattern(row.pattern), "i") // case insensitive
      this.items.push({
        ...row,
        regex,
      })
    }
  }

  [Symbol.iterator](): Iterator<TermItem<R>> {
    return Array.from(this.items.values()).filter(r => {
      return r.regex.source && r.regex.source != "(?:)" // "(?:)" is a source value of `new RegExp("", "i")`
    }).values()
  }

  getRow(name: string): TermRow<R> | undefined {
    return this.rows[name]
  }

  protected expandSubpattern(str: string): string {
    if (!str) {
      return str
    }
    return LB + "(" + expandSubpattern(str) + ")" + RB
  }
}

// type TermNode<R extends {}> = {
//   name: string
//   row: TermRow<R>
//   children: TermNode<R>[]
// }

export class SkillTable extends TermTable<Omit<SkillRow, "pattern">> {
  // getNode(name: string): TermNode<Omit<SkillRow, "pattern">> | undefined {
  //   const row = this.getRow(name)
  //   const children = Object.entries(this.rows).filter(([_, childRow]) => {
  //     return childRow.generalizeTo?.some(competence => competence.skill == name)
  //   })
  //   return row ? {
  //     name,
  //     row,
  //     children: children.map(([childName, _]) => this.getNode(childName)).filter(Boolean),
  //   } : undefined
  // }
  //
  // getFlatNodes(name: string): TermNode<Omit<SkillRow, "pattern">>[] {
  //   const node = this.getNode(name)
  //   if (!node) {
  //     return []
  //   }
  //   return [node, ...node.children.flatMap(childNode => this.getFlatNodes(childNode.name))]
  // }

  // - [x] Support hyphens on the right
  // - [x] Support hashmarks on the left
  // - [ ] TODO Auto-add versions to languages and techs
  protected override expandSubpattern(str: string): string {
    if (!str) {
      return str
    }
    // js -> #?js | js-?
    return LB + `(#?` + expandSubpattern(str) + `)` + `(?:-|${RB})`
  }
}

export class RoleTable extends TermTable<Omit<object, "pattern">> {
  // - [x] Support hyphens on the left
  protected override expandSubpattern(str: string): string {
    if (!str) {
      return str
    }
    // developer -> -?developer
    return `(?:-|${LB})` + `(` + expandSubpattern(str) + `)` + RB
  }
}

// ShortcutTable
export type ShortcutRow = Partial<Claim> & {
  pattern: string
  disambiguate?: DisambiguateShortcut
}

export type ShortcutItem = Partial<Claim> & {
  name: string
  regex: RegExp
  disambiguate?: DisambiguateShortcut
}

export class ShortcutTable extends Table {
  rows: Dict<ShortcutRow>
  items: ShortcutItem[]

  constructor(rows: Dict<ShortcutRow>) {
    super()

    this.rows = rows
    this.items = []

    const namedRows: (ShortcutRow & {name: string})[] = []
    for (const [name, {pattern, disambiguate = disambiguateShortTerm, ...rest}] of Object.entries(rows)) {
      const subpatterns = pattern.split(/ ?, ?/).map(s => s.trim())
      const ambiguous = pattern.includes("!")
      if (ambiguous) {
        const caseSensitiveRegex = new RegExp(
          "^(" + subpatterns.filter(p => p.startsWith("!")).map(this.expandSubpattern).join("|") + ")$"
        )
        this.ambiguous.set(name, caseSensitiveRegex)
      }
      const lowerSubpatterns = A.uniq(subpatterns.map(s => s.toLowerCase()))
      for (const subpattern of lowerSubpatterns) {
        const ambiguous = subpattern.includes("!")
        namedRows.push({
          name,
          pattern: subpattern,
          disambiguate: ambiguous ? disambiguate : undefined,
          ...rest
        })
      }
    }

    namedRows.sort((a, b) => {
      const subpatternA = expandSubpatternForLengthComparison(a.pattern)
      const subpatternB = expandSubpatternForLengthComparison(b.pattern)
      return subpatternA.length < subpatternB.length ? 1 :
             subpatternA.length > subpatternB.length ? -1 : 0
    })

    for (const row of namedRows) {
      const regex = new RegExp(this.expandSubpattern(row.pattern), "i") // case insensitive
      this.items.push({
        ...row,
        regex,
      })
    }
  }

  [Symbol.iterator](): Iterator<ShortcutItem> {
    return Array.from(this.items.values()).filter(r => {
      return r.regex.source && r.regex.source != "(?:)" // "(?:)" is a source value of `new RegExp("", "i")`
    }).values()
  }

  getRow(name: string): ShortcutRow | undefined {
    return this.rows[name]
  }

  // - [x] Support hyphens on the left
  // - [x] Support hyphens on the right
  protected expandSubpattern(str: string): string {
    // Should ideally support #MERN. But that means we have to assign role/skill category to shortcuts...
    // But that means shortcuts can be seen as table extensions and merged with them. IMO it would be the best
    // if only we knew there're no mixed shortcuts...
    if (!str) {
      return str
    }
    return `(?:-|${LB})` + `(` + expandSubpattern(str) + `)` + `(?:-|${RB})`
  }
}
