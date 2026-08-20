/**
 * Contract check for `tags/` + `resources/` (Zod + authoring rules).
 * Usage: npm run check  (alias: npm run validate)
 *
 * Catalog contributors should run this before opening a PR.
 */
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ZodError } from 'zod'
import {
  checkPipelineVarCoverage,
  collectOutlineInvariantIssues,
  extractMarkdownStructure,
  loadImportPackage,
  markdownContainsMedia,
  metadataSchema,
  pipelineContentSchema,
  tagsRegistrySchema,
  templateContentSchema,
  type ResourceKind,
  type ResourceMetadata,
  type TagDefinition,
  type TagsRegistryFile,
} from '../src/mapper/index.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TAGS_PATH = path.join(ROOT, 'tags', 'tags.json')
const RESOURCES_ROOT = path.join(ROOT, 'resources')

const KIND_DIRS: { dir: string; kind: ResourceKind }[] = [
  { dir: 'specs', kind: 'spec' },
  { dir: 'templates', kind: 'template' },
  { dir: 'pipelines', kind: 'pipeline' },
]

const BINARY_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg',
  '.ico',
  '.bmp',
  '.mp4',
  '.mov',
  '.mp3',
  '.wav',
  '.pdf',
  '.zip',
  '.gz',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
])

type Issue = { path: string; message: string }

const issues: Issue[] = []

function fail(filePath: string, message: string) {
  issues.push({
    path: path.relative(ROOT, filePath) || filePath,
    message,
  })
}

function formatZod(error: ZodError): string {
  return error.issues
    .map((issue) => {
      const where = issue.path.length > 0 ? issue.path.join('.') : '(root)'
      return `${where}: ${issue.message}`
    })
    .join('; ')
}

async function readJson(filePath: string): Promise<unknown | undefined> {
  let raw: string
  try {
    raw = await readFile(filePath, 'utf8')
  } catch {
    fail(filePath, 'file is missing')
    return undefined
  }

  try {
    return JSON.parse(raw) as unknown
  } catch (error) {
    fail(
      filePath,
      `invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
    )
    return undefined
  }
}

function validateTagHierarchy(registry: TagsRegistryFile) {
  const byId = new Map<string, TagDefinition>()
  for (const tag of registry.tags) {
    if (byId.has(tag.id)) {
      fail(TAGS_PATH, `duplicate tag id "${tag.id}"`)
      continue
    }
    byId.set(tag.id, tag)
  }

  for (const tag of registry.tags) {
    if (!tag.parentId) continue

    if (!byId.has(tag.parentId)) {
      fail(TAGS_PATH, `tag "${tag.id}" has unknown parentId "${tag.parentId}"`)
      continue
    }

    let depth = 1
    let current: TagDefinition | undefined = tag
    const seen = new Set<string>()

    while (current?.parentId) {
      if (seen.has(current.id)) {
        fail(TAGS_PATH, `tag "${tag.id}" has a parentId cycle`)
        break
      }
      seen.add(current.id)
      depth += 1
      if (depth > 2) {
        fail(
          TAGS_PATH,
          `tag "${tag.id}" exceeds max hierarchy depth 2 (parentId chain too deep)`,
        )
        break
      }
      current = byId.get(current.parentId)
    }
  }

  return byId
}

function checkResourceTags(
  metaPath: string,
  meta: ResourceMetadata,
  byId: Map<string, TagDefinition>,
) {
  for (const tagId of meta.tags) {
    const tag = byId.get(tagId)
    if (!tag) {
      fail(metaPath, `unknown tag "${tagId}"`)
      continue
    }
    if (tag.status === 'deprecated') {
      fail(metaPath, `deprecated tag "${tagId}" is not allowed`)
      continue
    }
    if (!tag.applicableKinds.includes(meta.kind)) {
      fail(
        metaPath,
        `tag "${tagId}" is not applicable to kind "${meta.kind}"`,
      )
    }
  }
}

function checkMarkdownMedia(filePath: string, markdown: string) {
  if (markdownContainsMedia(markdown)) {
    fail(filePath, 'media embeds are not allowed in markdown')
  }
}

async function listFilesRecursive(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    if (entry.name === '.gitkeep' || entry.name === 'README.md') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(full)))
    } else if (entry.isFile()) {
      files.push(full)
    }
  }
  return files
}

async function assertNoBinaryAssets(resourceDir: string) {
  const files = await listFilesRecursive(resourceDir)
  for (const filePath of files) {
    const ext = path.extname(filePath).toLowerCase()
    if (BINARY_EXTENSIONS.has(ext)) {
      fail(filePath, 'binary/media assets are not allowed under resources/')
    }
  }
}

type LoadedResource = {
  metaPath: string
  meta: ResourceMetadata
  dir: string
}

async function loadResources(
  byId: Map<string, TagDefinition>,
): Promise<LoadedResource[]> {
  const loaded: LoadedResource[] = []
  const slugOwners = new Map<string, string>()

  for (const { dir, kind } of KIND_DIRS) {
    const kindRoot = path.join(RESOURCES_ROOT, dir)
    let entries: string[]
    try {
      entries = await readdir(kindRoot)
    } catch {
      fail(kindRoot, 'kind directory is missing')
      continue
    }

    for (const name of entries) {
      if (name.startsWith('.')) continue
      const resourceDir = path.join(kindRoot, name)
      const info = await stat(resourceDir)
      if (!info.isDirectory()) continue
      if (name === 'README.md') continue

      await assertNoBinaryAssets(resourceDir)

      const metaPath = path.join(resourceDir, 'metadata.json')
      const raw = await readJson(metaPath)
      if (raw === undefined) continue

      const parsed = metadataSchema.safeParse(raw)
      if (!parsed.success) {
        fail(metaPath, formatZod(parsed.error))
        continue
      }

      const meta = parsed.data
      if (meta.kind !== kind) {
        fail(
          metaPath,
          `kind "${meta.kind}" does not match folder "${dir}/" (expected "${kind}")`,
        )
      }
      if (meta.slug !== name) {
        fail(
          metaPath,
          `slug "${meta.slug}" does not match directory name "${name}"`,
        )
      }

      const prior = slugOwners.get(meta.slug)
      if (prior) {
        fail(metaPath, `duplicate slug "${meta.slug}" (also at ${prior})`)
      } else {
        slugOwners.set(meta.slug, path.relative(ROOT, resourceDir))
      }

      checkResourceTags(metaPath, meta, byId)
      checkMarkdownMedia(metaPath, meta.summary)
      loaded.push({ metaPath, meta, dir: resourceDir })
    }
  }

  return loaded
}

function checkRefs(resources: LoadedResource[]) {
  const slugs = new Set(resources.map((resource) => resource.meta.slug))
  const bySlug = new Map(
    resources.map((resource) => [resource.meta.slug, resource]),
  )

  for (const resource of resources) {
    const { meta, metaPath } = resource

    if (meta.templateSlug) {
      if (meta.kind !== 'spec') {
        fail(metaPath, 'templateSlug is only allowed on specs')
      } else if (!slugs.has(meta.templateSlug)) {
        fail(
          metaPath,
          `templateSlug "${meta.templateSlug}" does not resolve to a catalog resource`,
        )
      } else if (bySlug.get(meta.templateSlug)?.meta.kind !== 'template') {
        fail(
          metaPath,
          `templateSlug "${meta.templateSlug}" must point to a template`,
        )
      }
    }

    for (const related of meta.relatedSlugs ?? []) {
      if (!slugs.has(related)) {
        fail(
          metaPath,
          `relatedSlugs entry "${related}" does not resolve to a catalog resource`,
        )
      }
    }
  }
}

async function validateSpec(resource: LoadedResource) {
  const contentPath = path.join(resource.dir, 'content.md')
  let markdown: string
  try {
    markdown = await readFile(contentPath, 'utf8')
  } catch {
    fail(contentPath, 'specs require content.md')
    return
  }

  checkMarkdownMedia(contentPath, markdown)

  const { h1 } = extractMarkdownStructure(markdown)
  if (h1 !== null && h1 !== resource.meta.title) {
    fail(
      contentPath,
      `H1 "${h1}" must exactly match metadata.title "${resource.meta.title}"`,
    )
  }

  try {
    const built = await loadImportPackage(resource.dir, resource.meta)
    const warnings = 'warnings' in built ? built.warnings : undefined
    if (warnings?.length) {
      for (const warning of warnings) {
        console.warn(`validate: ${resource.meta.slug}: ${warning}`)
      }
    }
  } catch (error) {
    fail(
      contentPath,
      `import package invalid: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

async function validateTemplate(resource: LoadedResource) {
  const contentPath = path.join(resource.dir, 'content.json')
  const raw = await readJson(contentPath)
  if (raw === undefined) return

  const parsed = templateContentSchema.safeParse(raw)
  if (!parsed.success) {
    fail(contentPath, formatZod(parsed.error))
    return
  }

  for (const issue of collectOutlineInvariantIssues(parsed.data.outline)) {
    fail(contentPath, `${issue.message} (${issue.path})`)
  }

  try {
    await loadImportPackage(resource.dir, resource.meta)
  } catch (error) {
    fail(
      contentPath,
      `import package invalid: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

async function validatePipeline(resource: LoadedResource) {
  const contentPath = path.join(resource.dir, 'content.json')
  const raw = await readJson(contentPath)
  if (raw === undefined) return

  const parsed = pipelineContentSchema.safeParse(raw)
  if (!parsed.success) {
    fail(contentPath, formatZod(parsed.error))
    return
  }

  const content = parsed.data
  const stepKeys = new Set<string>()

  for (const step of content.steps) {
    if (stepKeys.has(step.key)) {
      fail(contentPath, `duplicate step key "${step.key}"`)
    }
    stepKeys.add(step.key)

    if (step.type === 'pipeline') {
      fail(
        contentPath,
        `step "${step.key}" uses nested pipeline type (forbidden in v1)`,
      )
    } else if (step.type !== undefined) {
      fail(
        contentPath,
        `step "${step.key}" has unsupported type "${step.type}" (omit type for flat task steps)`,
      )
    }
  }

  const tasksDir = path.join(resource.dir, 'tasks')
  let taskFiles: string[] = []
  try {
    taskFiles = (await readdir(tasksDir)).filter((name) => name.endsWith('.md'))
  } catch {
    fail(tasksDir, 'pipelines require a tasks/ directory')
    return
  }

  const taskBodies: Record<string, string> = {}
  const onDiskKeys = new Set(
    taskFiles.map((name) => name.replace(/\.md$/i, '')),
  )

  for (const step of content.steps) {
    const taskPath = path.join(tasksDir, `${step.key}.md`)
    if (!onDiskKeys.has(step.key)) {
      fail(contentPath, `missing tasks/${step.key}.md for step "${step.key}"`)
      continue
    }
    const body = await readFile(taskPath, 'utf8')
    checkMarkdownMedia(taskPath, body)
    taskBodies[step.key] = body
  }

  for (const key of onDiskKeys) {
    if (!stepKeys.has(key)) {
      fail(
        path.join(tasksDir, `${key}.md`),
        `orphan task file not referenced by content.json steps`,
      )
    }
  }

  for (const issue of checkPipelineVarCoverage(content, taskBodies)) {
    fail(contentPath, issue.message)
  }

  try {
    await loadImportPackage(resource.dir, resource.meta)
  } catch (error) {
    fail(
      contentPath,
      `import package invalid: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

async function main() {
  const tagsRaw = await readJson(TAGS_PATH)
  if (tagsRaw === undefined) {
    printAndExit()
    return
  }

  const tagsParsed = tagsRegistrySchema.safeParse(tagsRaw)
  if (!tagsParsed.success) {
    fail(TAGS_PATH, formatZod(tagsParsed.error))
    printAndExit()
    return
  }

  const byId = validateTagHierarchy(tagsParsed.data)
  const resources = await loadResources(byId)
  checkRefs(resources)

  for (const resource of resources) {
    if (resource.meta.kind === 'spec') await validateSpec(resource)
    else if (resource.meta.kind === 'template') await validateTemplate(resource)
    else await validatePipeline(resource)
  }

  printAndExit()
}

function printAndExit() {
  if (issues.length === 0) {
    console.log('validate: ok')
    process.exit(0)
  }

  console.error(`validate: ${issues.length} issue(s)\n`)
  for (const issue of issues) {
    console.error(`- ${issue.path}: ${issue.message}`)
  }
  process.exit(1)
}

main().catch((error) => {
  console.error('validate: unexpected error')
  console.error(error)
  process.exit(1)
})
