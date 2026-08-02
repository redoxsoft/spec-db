/**
 * Emit lightweight HTML for Pagefind + write the search bundle.
 * Usage:
 *   tsx scripts/pagefind-index.ts --root public   # dev (before vite)
 *   tsx scripts/pagefind-index.ts --root dist     # postbuild
 */
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as pagefind from 'pagefind'
import type { ResourceDetail } from '../src/catalog/types.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function parseRootArg(): string {
  const flag = process.argv.indexOf('--root')
  const value = flag >= 0 ? process.argv[flag + 1] : 'public'
  if (value !== 'public' && value !== 'dist') {
    throw new Error(`--root must be "public" or "dist" (got ${value})`)
  }
  return value
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function bodyText(detail: ResourceDetail): string {
  const parts: string[] = [detail.summary]

  if (detail.outline?.length) parts.push(detail.outline.join(' '))

  if (detail.templateGuidance) parts.push(detail.templateGuidance)
  if (detail.sections) {
    for (const section of detail.sections) {
      parts.push(section.title, section.guidance)
    }
  }

  if (detail.contentPreview) parts.push(detail.contentPreview)
  else if (detail.previewHtml) parts.push(stripTags(detail.previewHtml))

  if (detail.tasks) {
    for (const task of detail.tasks) {
      parts.push(task.name, task.prompt)
    }
  }

  if (detail.inputVarDefinitions) {
    for (const def of detail.inputVarDefinitions) {
      parts.push(def.key)
      if (def.description) parts.push(def.description)
    }
  }

  return parts.filter(Boolean).join('\n\n')
}

function renderSearchPage(detail: ResourceDetail): string {
  const body = escapeHtml(bodyText(detail))
  const title = escapeHtml(detail.title)
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
</head>
<body>
  <article data-pagefind-body>
    <h1>${title}</h1>
    <p data-pagefind-meta="slug:${escapeHtml(detail.slug)}"></p>
    <p data-pagefind-meta="kind:${escapeHtml(detail.kind)}"></p>
    <p>${escapeHtml(detail.summary)}</p>
    <div>${body}</div>
  </article>
</body>
</html>
`
}

async function main() {
  const rootName = parseRootArg()
  const siteRoot = path.join(ROOT, rootName)
  const generatedResources = path.join(siteRoot, 'generated', 'resources')
  const searchDocs = path.join(siteRoot, 'search-docs')
  const pagefindOut = path.join(siteRoot, 'pagefind')

  let files: string[]
  try {
    files = (await readdir(generatedResources)).filter((name) =>
      name.endsWith('.json'),
    )
  } catch {
    throw new Error(
      `Missing ${path.relative(ROOT, generatedResources)} — run npm run index first`,
    )
  }

  await rm(searchDocs, { recursive: true, force: true })
  await mkdir(searchDocs, { recursive: true })

  for (const file of files) {
    const detail = JSON.parse(
      await readFile(path.join(generatedResources, file), 'utf8'),
    ) as ResourceDetail
    await writeFile(
      path.join(searchDocs, `${detail.slug}.html`),
      renderSearchPage(detail),
      'utf8',
    )
  }

  await rm(pagefindOut, { recursive: true, force: true })

  const { index, errors: createErrors } = await pagefind.createIndex()
  if (!index) {
    throw new Error(`pagefind.createIndex failed: ${createErrors.join('; ')}`)
  }

  const { errors: addErrors } = await index.addDirectory({
    path: searchDocs,
    glob: '**/*.html',
  })
  if (addErrors.length > 0) {
    throw new Error(`pagefind.addDirectory failed: ${addErrors.join('; ')}`)
  }

  const { errors: writeErrors } = await index.writeFiles({
    outputPath: pagefindOut,
  })
  if (writeErrors.length > 0) {
    throw new Error(`pagefind.writeFiles failed: ${writeErrors.join('; ')}`)
  }

  console.log(
    `pagefind-index: ${files.length} pages → ${path.relative(ROOT, pagefindOut)}`,
  )
}

main().catch((error) => {
  console.error('pagefind-index: failed')
  console.error(error)
  process.exit(1)
})
