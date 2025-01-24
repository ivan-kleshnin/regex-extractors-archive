export type SkillNode = {
  name: string
  role?: string
  generalize?: boolean
  children?: SkillNode[]
}

export type FlatSkillNode = SkillNode & {
  role: string
  generalize?: boolean
  path: string[]
  level: number
}

export class SkillTree {
  leaves: FlatSkillNode[]

  constructor(tree: SkillNode) {
    this.leaves = this.flatten(tree, "*")
  }

  has(name: string): boolean {
    return this.get(name) != undefined
  }

  get(name: string): FlatSkillNode | undefined {
    return this.leaves.find(leave => leave.name == name)
  }

  getParent(name: string): FlatSkillNode | undefined {
    const node = this.leaves.find(leave => leave.name == name)
    if (node) {
      const parentName = node.path.at(-2)
      return parentName ? this.get(parentName) : undefined
    } else {
      return undefined
    }
  }

  protected flatten(node: SkillNode, parentRole: string, level = 0): FlatSkillNode[] {
    const {name, role = parentRole, generalize, children} = node
    const result: FlatSkillNode[] = name
      ? [{name, role, generalize, path: [name], level}]
      : []
    if (children) {
      for (const child of children) {
        result.push(...this.flatten(child, role, level + 1).map(node => name ? ({
          ...node,
          path: [name, ...node.path],
          level: node.level,
        }) : node))
      }
    }
    return result
  }
}
