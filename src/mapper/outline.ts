import type { OutlineCardinality, OutlineNode } from './schemas'

/** SpecX-aligned max outline depth (root = depth 1). */
export const MAX_OUTLINE_DEPTH = 4

export type OutlineInvariantCode =
  | 'TOP_LEVEL_MUST_BE_FIXED'
  | 'REQUIRED_UNDER_OPTIONAL'
  | 'OUTLINE_DEPTH_EXCEEDED'
  | 'DUPLICATE_OUTLINE_KEY'

export type OutlineInvariantIssue = {
  code: OutlineInvariantCode
  message: string
  /** Dot path like `outline[2].children[0]` for contributor debugging. */
  path: string
}

function isFixedCardinality(cardinality: OutlineCardinality): boolean {
  return cardinality.min === 1 && cardinality.max === 1
}

/** Walk outline depth-first; return first duplicate key or null. */
export function findDuplicateOutlineKey(outline: OutlineNode[]): string | null {
  const seen = new Set<string>()

  const visit = (nodes: OutlineNode[]): string | null => {
    for (const node of nodes) {
      if (seen.has(node.key)) return node.key
      seen.add(node.key)
      if (node.children?.length) {
        const nested = visit(node.children)
        if (nested) return nested
      }
    }
    return null
  }

  return visit(outline)
}

/**
 * SpecX import invariants for template outlines.
 * Call on Zod-parsed outline (cardinality defaults already applied).
 */
export function collectOutlineInvariantIssues(
  outline: OutlineNode[],
): OutlineInvariantIssue[] {
  const issues: OutlineInvariantIssue[] = []

  const duplicateKey = findDuplicateOutlineKey(outline)
  if (duplicateKey) {
    issues.push({
      code: 'DUPLICATE_OUTLINE_KEY',
      message: `DUPLICATE_OUTLINE_KEY: outline key "${duplicateKey}" is reused (keys must be unique tree-wide)`,
      path: 'outline',
    })
  }

  const visit = (
    nodes: OutlineNode[],
    depth: number,
    hasOptionalAncestor: boolean,
    pathPrefix: string,
  ) => {
    for (const [index, node] of nodes.entries()) {
      const path = `${pathPrefix}[${index}]`
      const cardinality = node.cardinality

      if (depth > MAX_OUTLINE_DEPTH) {
        issues.push({
          code: 'OUTLINE_DEPTH_EXCEEDED',
          message: `OUTLINE_DEPTH_EXCEEDED: node "${node.key}" is at depth ${depth} (max ${MAX_OUTLINE_DEPTH})`,
          path,
        })
        continue
      }

      if (depth === 1 && !isFixedCardinality(cardinality)) {
        issues.push({
          code: 'TOP_LEVEL_MUST_BE_FIXED',
          message: `TOP_LEVEL_MUST_BE_FIXED: top-level node "${node.key}" must be fixed { min: 1, max: 1 } (got min=${cardinality.min}, max=${cardinality.max})`,
          path,
        })
      }

      if (hasOptionalAncestor && cardinality.min > 0) {
        issues.push({
          code: 'REQUIRED_UNDER_OPTIONAL',
          message: `REQUIRED_UNDER_OPTIONAL: node "${node.key}" has min=${cardinality.min} under an optional ancestor (every descendant of min===0 must also have min===0)`,
          path,
        })
      }

      if (node.children?.length) {
        visit(
          node.children,
          depth + 1,
          hasOptionalAncestor || cardinality.min === 0,
          `${path}.children`,
        )
      }
    }
  }

  visit(outline, 1, false, 'outline')
  return issues
}
