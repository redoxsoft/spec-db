/**
 * Build-time markdown helpers (Node-only — used by validate/index).
 * Do not import from React client bundles.
 */
import rehypeShikiFromHighlighter from '@shikijs/rehype/core'
import { toString } from 'mdast-util-to-string'
import remarkGithubBlockquoteAlert from 'remark-github-blockquote-alert'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import { createHighlighter, type Highlighter } from 'shiki'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import type { Root as MdastRoot } from 'mdast'

const SECTION_KEY_COMMENT = /^<!--\s*key:\s*([A-Za-z0-9._-]+)\s*-->$/i

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'div', 'section'],
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), ['className']],
    span: [
      ...(defaultSchema.attributes?.span ?? []),
      ['className'],
      ['style'],
    ],
    pre: [
      ...(defaultSchema.attributes?.pre ?? []),
      ['className'],
      ['style'],
      ['tabindex'],
    ],
    div: [...(defaultSchema.attributes?.div ?? []), ['className']],
    section: [...(defaultSchema.attributes?.section ?? []), ['className']],
    a: [...(defaultSchema.attributes?.a ?? []), ['className'], ['rel']],
  },
} as typeof defaultSchema

let highlighterPromise: Promise<Highlighter> | null = null

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light'],
      langs: [
        'text',
        'javascript',
        'typescript',
        'tsx',
        'jsx',
        'json',
        'bash',
        'shell',
        'markdown',
        'html',
        'css',
        'yaml',
        'diff',
      ],
    })
  }
  return highlighterPromise
}

function parseMarkdownTree(markdown: string): MdastRoot {
  return unified().use(remarkParse).use(remarkGfm).parse(markdown)
}

export type MarkdownStructure = {
  h1: string | null
  /** ATX ## titles outside code (via mdast). */
  h2Titles: string[]
  /** `<!-- key: … -->` from HTML nodes (not fenced code). */
  sectionKeys: string[]
}

/** AST-based structure extract — no whole-file regex for keys/headings. */
export function extractMarkdownStructure(markdown: string): MarkdownStructure {
  const tree = parseMarkdownTree(markdown)
  let h1: string | null = null
  const h2Titles: string[] = []
  const sectionKeys: string[] = []

  visit(tree, 'heading', (node) => {
    const text = toString(node).trim()
    if (!text) return
    if (node.depth === 1 && h1 === null) h1 = text
    if (node.depth === 2) h2Titles.push(text)
  })

  visit(tree, 'html', (node) => {
    const match = SECTION_KEY_COMMENT.exec(node.value.trim())
    if (match) sectionKeys.push(match[1])
  })

  return { h1, h2Titles, sectionKeys }
}

/** True if markdown contains image nodes or raw HTML `<img` (AST-aware). */
export function markdownContainsMedia(markdown: string): boolean {
  const tree = parseMarkdownTree(markdown)
  let found = false

  visit(tree, 'image', () => {
    found = true
  })
  if (found) return true

  visit(tree, 'html', (node) => {
    if (/<img\b/i.test(node.value)) found = true
  })

  return found
}

/** Compile GFM (+ GitHub alerts) to sanitized HTML with build-time Shiki. */
export async function compileMarkdownToHtml(markdown: string): Promise<string> {
  const highlighter = await getHighlighter()
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkGithubBlockquoteAlert)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeShikiFromHighlighter, highlighter, {
      theme: 'github-light',
      defaultLanguage: 'text',
      fallbackLanguage: 'text',
    })
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .process(markdown)

  return String(file)
}
