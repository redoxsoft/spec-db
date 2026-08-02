/**
 * Spec DB markdown → import package sections/blocks (Node-only).
 */
import { toString } from 'mdast-util-to-string'
import type {
  Blockquote,
  Code,
  Heading,
  Html,
  List,
  Nodes,
  Root,
  Table,
} from 'mdast'
import remarkGithubBlockquoteAlert from 'remark-github-blockquote-alert'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import type {
  PackageBlock,
  PackageCalloutTone,
  PackageSection,
} from './packageSchemas'

const SECTION_KEY_COMMENT = /^<!--\s*key:\s*([A-Za-z0-9._-]+)\s*-->$/i
/** Spec section depth: H2 = 1 … H5 = 4 (aligned with SpecX outline max). */
export const MAX_SPEC_SECTION_DEPTH = 4

export type MarkdownToSpecResult = {
  sections: PackageSection[]
  warnings: string[]
}

function parseSpecMarkdownTree(markdown: string): Root {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkGithubBlockquoteAlert)
  const tree = processor.parse(markdown)
  return processor.runSync(tree) as Root
}

function sanitizeKey(value: string): string {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return cleaned || 'section'
}

function extractHeadingMeta(heading: Heading): { title: string; key?: string } {
  let key: string | undefined
  const titleParts: string[] = []
  for (const child of heading.children) {
    if (child.type === 'html') {
      const match = SECTION_KEY_COMMENT.exec(child.value.trim())
      if (match) {
        key = match[1]
        continue
      }
      // Non-key HTML in headings is unusual; ignore for title text.
      continue
    }
    titleParts.push(toString(child))
  }
  const title = titleParts.join('').replace(/\s+/g, ' ').trim()
  return { title, key }
}

function isKeyCommentHtml(node: Html): boolean {
  return SECTION_KEY_COMMENT.test(node.value.trim())
}

function isIgnorablePreamble(node: Nodes): boolean {
  if (node.type === 'html') return isKeyCommentHtml(node)
  if (node.type === 'paragraph' && toString(node).trim() === '') return true
  return false
}

function alertToneFromBlockquote(
  node: Blockquote,
): PackageCalloutTone | undefined {
  const props = node.data?.hProperties as
    | { className?: string | string[] }
    | undefined
  const className = props?.className
  const classes = Array.isArray(className)
    ? className.map(String)
    : typeof className === 'string'
      ? className.split(/\s+/)
      : []

  if (classes.includes('markdown-alert-warning')) return 'warning'
  if (classes.includes('markdown-alert-caution')) return 'warning'
  if (classes.includes('markdown-alert-important')) return 'decision'
  if (classes.includes('markdown-alert-note')) return 'info'
  if (classes.includes('markdown-alert-tip')) return 'info'
  if (classes.some((c) => c.startsWith('markdown-alert-'))) return 'info'
  return undefined
}

function calloutTextFromAlert(node: Blockquote): string {
  const paragraphs = node.children.filter((child) => child.type === 'paragraph')
  // First paragraph is the alert title (NOTE/WARNING/…); body follows.
  const body = paragraphs.slice(1)
  if (body.length === 0) return toString(node).trim()
  return body.map((p) => toString(p).trim()).filter(Boolean).join('\n\n')
}

function listItems(list: List): string[] {
  return list.children.map((item) => toString(item).replace(/\s+/g, ' ').trim())
}

function tableToBlock(table: Table, warnings: string[]): PackageBlock | null {
  const rows = table.children.map((row) =>
    row.children.map((cell) => toString(cell).replace(/\s+/g, ' ').trim()),
  )
  if (rows.length === 0) {
    warnings.push('Empty table degraded to nothing (skipped)')
    return null
  }

  const columnCount = Math.max(...rows.map((row) => row.length), 0)
  if (columnCount < 1) {
    warnings.push('Table with no columns skipped')
    return null
  }
  if (columnCount > 6) {
    throw new Error(
      `SPEC_TABLE_TOO_WIDE: tables may have at most 6 columns (got ${columnCount})`,
    )
  }

  const normalized = rows.map((row) => {
    const next = [...row]
    while (next.length < columnCount) next.push('')
    return next.slice(0, columnCount)
  })

  return {
    type: 'table',
    columnCount,
    headerRow: true,
    headerColumn: false,
    rows: normalized,
  }
}

function blockquoteToBlocks(
  node: Blockquote,
  warnings: string[],
): PackageBlock[] {
  const tone = alertToneFromBlockquote(node)
  if (tone) {
    return [{ type: 'callout', tone, text: calloutTextFromAlert(node) }]
  }
  const text = toString(node).trim()
  if (!text) return []
  warnings.push('Plain blockquote degraded to paragraph')
  return [{ type: 'paragraph', text }]
}

function codeToBlock(node: Code): PackageBlock {
  return {
    type: 'code_block',
    code: node.value,
    language: node.lang?.trim() ? node.lang.trim() : null,
  }
}

function nodeToBlocks(node: Nodes, warnings: string[]): PackageBlock[] {
  switch (node.type) {
    case 'paragraph': {
      const text = toString(node).trim()
      return text ? [{ type: 'paragraph', text }] : []
    }
    case 'list':
      return [
        {
          type: node.ordered ? 'numbered_list' : 'bullet_list',
          items: listItems(node),
        },
      ]
    case 'code':
      return [codeToBlock(node)]
    case 'thematicBreak':
      return [{ type: 'divider' }]
    case 'table': {
      const block = tableToBlock(node, warnings)
      return block ? [block] : []
    }
    case 'blockquote':
      return blockquoteToBlocks(node, warnings)
    case 'html':
      if (isKeyCommentHtml(node)) return []
      warnings.push('Raw HTML degraded to paragraph')
      return [{ type: 'paragraph', text: node.value.trim() }]
    case 'heading':
      // Headings are handled by the section walker; nested headings shouldn't appear.
      warnings.push(
        `Unexpected nested heading "${toString(node).trim()}" degraded to paragraph`,
      )
      return [{ type: 'paragraph', text: toString(node).trim() }]
    default: {
      const text = toString(node).trim()
      if (!text) return []
      warnings.push(`Unsupported markdown "${node.type}" degraded to paragraph`)
      return [{ type: 'paragraph', text }]
    }
  }
}

type SectionDraft = {
  key: string
  title: string
  blocks: PackageBlock[]
  children: SectionDraft[]
  depth: number
}

function allocateKey(
  requested: string | undefined,
  title: string,
  used: Set<string>,
): string {
  const base = sanitizeKey(requested ?? title)
  if (!used.has(base)) {
    used.add(base)
    return base
  }
  let suffix = 2
  while (used.has(`${base}-${suffix}`)) suffix += 1
  const next = `${base}-${suffix}`
  used.add(next)
  return next
}

function finalizeSections(drafts: SectionDraft[]): PackageSection[] {
  return drafts.map((draft) => ({
    key: draft.key,
    title: draft.title,
    blocks: draft.blocks,
    children: finalizeSections(draft.children),
  }))
}

/**
 * Convert spec `content.md` into package `spec.sections`.
 * Hard errors throw; unsupported constructs degrade to paragraph with warnings.
 */
export function markdownToSpecSections(markdown: string): MarkdownToSpecResult {
  const trimmed = markdown.trim()
  if (!trimmed) {
    throw new Error('SPEC_EMPTY: content.md is empty')
  }

  const tree = parseSpecMarkdownTree(trimmed)
  const warnings: string[] = []
  const roots: SectionDraft[] = []
  const stack: SectionDraft[] = []
  const usedKeys = new Set<string>()
  let sawH1 = false
  let inPreamble = true

  for (const node of tree.children) {
    if (node.type === 'heading') {
      if (node.depth === 1) {
        if (sawH1 || !inPreamble) {
          throw new Error(
            'SPEC_MULTIPLE_H1: only one H1 is allowed at the start of the document (document title)',
          )
        }
        sawH1 = true
        continue
      }

      const sectionDepth = node.depth - 1
      if (sectionDepth > MAX_SPEC_SECTION_DEPTH) {
        throw new Error(
          `SPEC_SECTION_DEPTH_EXCEEDED: heading "${toString(node).trim()}" is depth ${sectionDepth} (max ${MAX_SPEC_SECTION_DEPTH}; use H2–H5)`,
        )
      }

      inPreamble = false
      const { title, key: requestedKey } = extractHeadingMeta(node)
      if (!title) {
        throw new Error('SPEC_EMPTY_HEADING: headings must have a non-empty title')
      }

      while (stack.length > 0 && stack[stack.length - 1]!.depth >= sectionDepth) {
        stack.pop()
      }

      if (stack.length === 0 && sectionDepth !== 1) {
        throw new Error(
          `SPEC_ORPHAN_HEADING: heading "${title}" (H${node.depth}) has no parent H2 section`,
        )
      }

      // Explicit duplicate requested keys fail; auto-suffix only for generated keys.
      if (requestedKey && usedKeys.has(requestedKey)) {
        throw new Error(
          `DUPLICATE_SECTION_KEY: section key "${requestedKey}" is reused`,
        )
      }

      const key = requestedKey
        ? (usedKeys.add(requestedKey), requestedKey)
        : allocateKey(undefined, title, usedKeys)

      const draft: SectionDraft = {
        key,
        title,
        blocks: [],
        children: [],
        depth: sectionDepth,
      }

      if (stack.length === 0) roots.push(draft)
      else stack[stack.length - 1]!.children.push(draft)
      stack.push(draft)
      continue
    }

    if (inPreamble) {
      if (isIgnorablePreamble(node)) continue
      throw new Error(
        'SPEC_PREAMBLE_CONTENT: content before the first H2 is not allowed (H1 is title only; start sections at H2)',
      )
    }

    if (stack.length === 0) {
      throw new Error(
        'SPEC_CONTENT_WITHOUT_SECTION: body content requires an H2 section',
      )
    }

    if (node.type === 'html' && isKeyCommentHtml(node)) continue

    stack[stack.length - 1]!.blocks.push(...nodeToBlocks(node, warnings))
  }

  if (roots.length === 0) {
    throw new Error(
      'SPEC_NO_SECTIONS: content.md must include at least one H2 section',
    )
  }

  return { sections: finalizeSections(roots), warnings }
}
