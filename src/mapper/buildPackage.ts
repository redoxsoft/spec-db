import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { markdownToSpecSections } from './markdownToSpecPackage'
import { collectOutlineInvariantIssues } from './outline'
import {
  importPackageSchema,
  type ImportPackage,
  type PackageOutlineNode,
  type PipelinePackage,
  type SpecPackage,
  type TemplatePackage,
} from './packageSchemas'
import {
  pipelineContentSchema,
  templateContentSchema,
  type OutlineNode,
  type PipelineContent,
  type ResourceMetadata,
  type TemplateContent,
} from './schemas'

export type PackageEnvelopeSource = Pick<
  ResourceMetadata,
  | 'slug'
  | 'kind'
  | 'title'
  | 'summary'
  | 'tags'
  | 'updatedAt'
  | 'createdAt'
  | 'sourceVersion'
  | 'schemaVersion'
>

export type PackageBuildWarnings = {
  warnings: string[]
}

function envelopeFields(meta: PackageEnvelopeSource) {
  const updatedAt = meta.updatedAt ?? meta.createdAt
  return {
    packageVersion: '1' as const,
    slug: meta.slug,
    title: meta.title,
    summary: meta.summary,
    ...(meta.tags.length > 0 ? { tags: meta.tags } : {}),
    ...(updatedAt ? { updatedAt } : {}),
    sourceVersion: meta.sourceVersion,
    schemaVersion: meta.schemaVersion,
  }
}

/** Materialize package outline: always emit cardinality + children[]. */
export function toPackageOutline(nodes: OutlineNode[]): PackageOutlineNode[] {
  return nodes.map((node) => ({
    key: node.key,
    title: node.title,
    guidance: node.guidance,
    cardinality: node.cardinality,
    children: toPackageOutline(node.children ?? []),
  }))
}

export function buildTemplatePackage(
  meta: PackageEnvelopeSource,
  content: TemplateContent,
): TemplatePackage {
  if (meta.kind !== 'template') {
    throw new Error(`buildTemplatePackage: expected kind template, got ${meta.kind}`)
  }

  const outlineIssues = collectOutlineInvariantIssues(content.outline)
  if (outlineIssues.length > 0) {
    throw new Error(
      `buildTemplatePackage(${meta.slug}): ${outlineIssues.map((i) => i.message).join('; ')}`,
    )
  }

  const pkg: TemplatePackage = {
    ...envelopeFields(meta),
    kind: 'template',
    template: {
      guidance: content.guidance,
      outline: toPackageOutline(content.outline),
    },
  }

  return importPackageSchema.parse(pkg) as TemplatePackage
}

export function buildPipelinePackage(
  meta: PackageEnvelopeSource,
  content: PipelineContent,
  taskBodies: Record<string, string>,
): PipelinePackage {
  if (meta.kind !== 'pipeline') {
    throw new Error(`buildPipelinePackage: expected kind pipeline, got ${meta.kind}`)
  }

  for (const step of content.steps) {
    if (step.type === 'pipeline') {
      throw new Error(
        `buildPipelinePackage(${meta.slug}): step "${step.key}" forbids nested type "pipeline"`,
      )
    }
    if (step.type !== undefined) {
      throw new Error(
        `buildPipelinePackage(${meta.slug}): step "${step.key}" has unsupported type "${step.type}"`,
      )
    }
    if (!(step.key in taskBodies)) {
      throw new Error(
        `buildPipelinePackage(${meta.slug}): missing task body for step "${step.key}"`,
      )
    }
  }

  const pkg: PipelinePackage = {
    ...envelopeFields(meta),
    kind: 'pipeline',
    pipeline: {
      inputVarDefinitions: content.inputVarDefinitions,
      iteratorFields: content.iteratorFields ?? [],
      steps: content.steps.map((step) => ({
        key: step.key,
        name: step.name,
        instructions: taskBodies[step.key] ?? '',
        iteratorFields: step.iteratorFields ?? [],
      })),
    },
  }

  return importPackageSchema.parse(pkg) as PipelinePackage
}

export function buildSpecPackage(
  meta: PackageEnvelopeSource,
  markdown: string,
): SpecPackage & PackageBuildWarnings {
  if (meta.kind !== 'spec') {
    throw new Error(`buildSpecPackage: expected kind spec, got ${meta.kind}`)
  }

  const { sections, warnings } = markdownToSpecSections(markdown)
  const pkg: SpecPackage = {
    ...envelopeFields(meta),
    kind: 'spec',
    spec: { sections },
  }

  return {
    ...(importPackageSchema.parse(pkg) as SpecPackage),
    warnings,
  }
}

/** Load + build a template import package from an authoring directory. */
export async function loadTemplatePackage(
  resourceDir: string,
  meta: PackageEnvelopeSource,
): Promise<TemplatePackage> {
  const raw = JSON.parse(
    await readFile(path.join(resourceDir, 'content.json'), 'utf8'),
  ) as unknown
  const content = templateContentSchema.parse(raw)
  return buildTemplatePackage(meta, content)
}

/** Load + build a pipeline import package from an authoring directory. */
export async function loadPipelinePackage(
  resourceDir: string,
  meta: PackageEnvelopeSource,
): Promise<PipelinePackage> {
  const raw = JSON.parse(
    await readFile(path.join(resourceDir, 'content.json'), 'utf8'),
  ) as unknown
  const content = pipelineContentSchema.parse(raw)
  const taskBodies: Record<string, string> = {}
  for (const step of content.steps) {
    taskBodies[step.key] = (
      await readFile(path.join(resourceDir, 'tasks', `${step.key}.md`), 'utf8')
    ).trim()
  }
  return buildPipelinePackage(meta, content, taskBodies)
}

/** Load + build a spec import package from an authoring directory. */
export async function loadSpecPackage(
  resourceDir: string,
  meta: PackageEnvelopeSource,
): Promise<SpecPackage & PackageBuildWarnings> {
  const markdown = await readFile(path.join(resourceDir, 'content.md'), 'utf8')
  return buildSpecPackage(meta, markdown)
}

export async function loadImportPackage(
  resourceDir: string,
  meta: PackageEnvelopeSource,
): Promise<ImportPackage & Partial<PackageBuildWarnings>> {
  if (meta.kind === 'template') return loadTemplatePackage(resourceDir, meta)
  if (meta.kind === 'pipeline') return loadPipelinePackage(resourceDir, meta)
  if (meta.kind === 'spec') return loadSpecPackage(resourceDir, meta)
  throw new Error(`loadImportPackage: unsupported kind`)
}
