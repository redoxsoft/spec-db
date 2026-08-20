/**
 * Emit static catalog APIs under public/generated/.
 * Usage: npm run index (after validate in CI/build).
 */
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { CatalogLiteItem, ResourceDetail, TagsRegistry } from '../src/catalog/types.ts'
import {
  compileMarkdownToHtml,
  extractMarkdownStructure,
  loadImportPackage,
  metadataSchema,
  pipelineContentSchema,
  tagsRegistrySchema,
  templateContentSchema,
  type OutlineNode,
  type ResourceKind,
  type ResourceMetadata,
  type TagDefinition,
  type TagsRegistryFile,
} from '../src/mapper/index.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TAGS_PATH = path.join(ROOT, 'tags', 'tags.json')
const RESOURCES_ROOT = path.join(ROOT, 'resources')
const OUT_ROOT = path.join(ROOT, 'public', 'generated')

const KIND_DIRS: { dir: string; kind: ResourceKind }[] = [
  { dir: 'specs', kind: 'spec' },
  { dir: 'templates', kind: 'template' },
  { dir: 'pipelines', kind: 'pipeline' },
]

type DiskResource = {
  meta: ResourceMetadata
  dir: string
}

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, 'utf8')) as unknown
}

function flattenOutlineTitles(nodes: OutlineNode[]): string[] {
  const titles: string[] = []
  for (const node of nodes) {
    titles.push(node.title)
    if (node.children?.length) {
      titles.push(...flattenOutlineTitles(node.children))
    }
  }
  return titles
}

async function flattenSections(
  nodes: OutlineNode[],
): Promise<{ title: string; guidance: string; guidanceHtml: string }[]> {
  const sections: { title: string; guidance: string; guidanceHtml: string }[] =
    []
  for (const node of nodes) {
    sections.push({
      title: node.title,
      guidance: node.guidance,
      guidanceHtml: await compileMarkdownToHtml(node.guidance),
    })
    if (node.children?.length) {
      sections.push(...(await flattenSections(node.children)))
    }
  }
  return sections
}

function toUiTags(registry: TagsRegistryFile): TagsRegistry {
  const active = registry.tags.filter((tag) => tag.status === 'active')
  const sortTags = (tags: TagDefinition[]) =>
    [...tags].sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id.localeCompare(b.id))

  const domain = sortTags(
    active.filter(
      (tag) =>
        tag.parentId === 'domain' ||
        (tag.id.startsWith('domain.') && tag.ui === 'facet'),
    ),
  ).map((tag) => ({ id: tag.id, label: tag.displayName }))

  const usecase = sortTags(
    active.filter(
      (tag) =>
        tag.parentId === 'use-case' ||
        (tag.id.startsWith('use-case.') && tag.ui === 'facet'),
    ),
  ).map((tag) => ({ id: tag.id, label: tag.displayName }))

  return { domain, usecase }
}

async function loadDiskResources(): Promise<DiskResource[]> {
  const loaded: DiskResource[] = []

  for (const { dir, kind } of KIND_DIRS) {
    const kindRoot = path.join(RESOURCES_ROOT, dir)
    const entries = await readdir(kindRoot)
    for (const name of entries) {
      if (name.startsWith('.')) continue
      const resourceDir = path.join(kindRoot, name)
      const info = await stat(resourceDir)
      if (!info.isDirectory()) continue

      const meta = metadataSchema.parse(await readJson(path.join(resourceDir, 'metadata.json')))
      if (meta.kind !== kind) {
        throw new Error(`${meta.slug}: kind mismatch (expected ${kind})`)
      }
      if (meta.slug !== name) {
        throw new Error(`${name}: slug/directory mismatch`)
      }
      loaded.push({ meta, dir: resourceDir })
    }
  }

  return loaded.sort((a, b) => a.meta.slug.localeCompare(b.meta.slug))
}

async function catalogBase(
  resource: DiskResource,
): Promise<
  Pick<
    CatalogLiteItem,
    | 'slug'
    | 'kind'
    | 'title'
    | 'summary'
    | 'summaryHtml'
    | 'tags'
    | 'collections'
    | 'updatedAt'
    | 'featured'
  >
> {
  return {
    slug: resource.meta.slug,
    kind: resource.meta.kind,
    title: resource.meta.title,
    summary: resource.meta.summary,
    summaryHtml: await compileMarkdownToHtml(resource.meta.summary),
    tags: resource.meta.tags,
    ...(resource.meta.collections?.length
      ? { collections: resource.meta.collections }
      : {}),
    updatedAt: resource.meta.updatedAt ?? resource.meta.createdAt ?? '',
    featured: resource.meta.featured,
  }
}

async function buildTemplateDetail(resource: DiskResource): Promise<ResourceDetail> {
  const content = templateContentSchema.parse(
    await readJson(path.join(resource.dir, 'content.json')),
  )
  const outline = flattenOutlineTitles(content.outline)
  const sections = await flattenSections(content.outline)

  return {
    ...(await catalogBase(resource)),
    kind: 'template',
    stats: `${sections.length} Sections`,
    outline,
    sections,
    templateGuidance: content.guidance,
    templateGuidanceHtml: await compileMarkdownToHtml(content.guidance),
  }
}

async function buildSpecDetail(resource: DiskResource): Promise<ResourceDetail> {
  const markdown = await readFile(path.join(resource.dir, 'content.md'), 'utf8')
  const { h2Titles } = extractMarkdownStructure(markdown)
  const trimmed = markdown.trim()

  return {
    ...(await catalogBase(resource)),
    kind: 'spec',
    stats: `${Math.max(h2Titles.length, 1)} Sections`,
    outline: h2Titles.length > 0 ? h2Titles : undefined,
    contentPreview: trimmed,
    previewHtml: await compileMarkdownToHtml(trimmed),
  }
}

async function buildPipelineDetail(resource: DiskResource): Promise<ResourceDetail> {
  const content = pipelineContentSchema.parse(
    await readJson(path.join(resource.dir, 'content.json')),
  )
  const tasks = []
  for (const step of content.steps) {
    const prompt = (
      await readFile(path.join(resource.dir, 'tasks', `${step.key}.md`), 'utf8')
    ).trim()
    tasks.push({
      key: step.key,
      name: step.name,
      prompt,
      previewHtml: await compileMarkdownToHtml(prompt),
      iteratorFields: step.iteratorFields,
    })
  }

  return {
    ...(await catalogBase(resource)),
    kind: 'pipeline',
    stats: `Steps: ${tasks.length}`,
    tasks,
    inputVarDefinitions: content.inputVarDefinitions,
    iteratorFields: content.iteratorFields,
  }
}

function toLite(detail: ResourceDetail): CatalogLiteItem {
  return {
    slug: detail.slug,
    kind: detail.kind,
    title: detail.title,
    summary: detail.summary,
    ...(detail.summaryHtml ? { summaryHtml: detail.summaryHtml } : {}),
    tags: detail.tags,
    ...(detail.collections?.length
      ? { collections: detail.collections }
      : {}),
    updatedAt: detail.updatedAt,
    stats: detail.stats,
    featured: detail.featured,
    outline: detail.outline,
  }
}

async function writeJson(filePath: string, data: unknown) {
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

async function main() {
  const tagsFile = tagsRegistrySchema.parse(await readJson(TAGS_PATH))
  const uiTags = toUiTags(tagsFile)
  const diskResources = await loadDiskResources()

  const details: ResourceDetail[] = []
  for (const resource of diskResources) {
    if (resource.meta.kind === 'template') {
      details.push(await buildTemplateDetail(resource))
    } else if (resource.meta.kind === 'spec') {
      details.push(await buildSpecDetail(resource))
    } else {
      details.push(await buildPipelineDetail(resource))
    }
  }

  await rm(OUT_ROOT, { recursive: true, force: true })
  await mkdir(path.join(OUT_ROOT, 'resources'), { recursive: true })
  await mkdir(path.join(OUT_ROOT, 'packages'), { recursive: true })

  await writeJson(path.join(OUT_ROOT, 'tags.json'), uiTags)
  await writeJson(
    path.join(OUT_ROOT, 'catalog-lite.json'),
    details.map(toLite),
  )

  for (const detail of details) {
    await writeJson(
      path.join(OUT_ROOT, 'resources', `${detail.slug}.json`),
      detail,
    )
  }

  let packageCount = 0
  for (const resource of diskResources) {
    const built = await loadImportPackage(resource.dir, resource.meta)
    const { warnings, ...pkg } = built as typeof built & { warnings?: string[] }
    if (warnings?.length) {
      for (const warning of warnings) {
        console.warn(`index: ${resource.meta.slug}: ${warning}`)
      }
    }
    await writeJson(
      path.join(
        OUT_ROOT,
        'packages',
        resource.meta.kind,
        `${resource.meta.slug}.json`,
      ),
      pkg,
    )
    packageCount += 1
  }

  console.log(
    `index: wrote ${details.length} resources, ${packageCount} packages → ${path.relative(ROOT, OUT_ROOT)}`,
  )
}

main().catch((error) => {
  console.error('index: failed')
  console.error(error)
  process.exit(1)
})
