import { z } from 'zod'

export const resourceKindSchema = z.enum(['spec', 'template', 'pipeline'])
export type ResourceKind = z.infer<typeof resourceKindSchema>

export const schemaVersionSchema = z.literal('1')

export const inputVarDefinitionSchema = z.object({
  key: z
    .string()
    .min(1)
    .regex(/^\S+$/, 'key cannot contain whitespace'),
  description: z.string().optional(),
  suggestedDefault: z.string().optional(),
})

const kebabCaseId = (message: string) =>
  z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, message)

export const collectionDefinitionSchema = z
  .object({
    id: kebabCaseId('id must be lowercase kebab-case'),
    displayName: z.string().min(1),
    description: z.string().min(1),
    parentId: kebabCaseId('parentId must be lowercase kebab-case').nullable().optional(),
    order: z.number(),
    status: z.enum(['active', 'deprecated']),
  })
  .strict()

export const collectionsRegistrySchema = z
  .object({
    schemaVersion: schemaVersionSchema,
    collections: z.array(collectionDefinitionSchema),
  })
  .strict()

export type CollectionDefinition = z.infer<typeof collectionDefinitionSchema>
export type CollectionsRegistryFile = z.infer<typeof collectionsRegistrySchema>

export const tagDefinitionSchema = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
  description: z.string().min(1),
  applicableKinds: z.array(resourceKindSchema).min(1),
  ui: z.enum(['facet', 'category', 'folder', 'badge', 'hidden']),
  parentId: z.string().min(1).optional(),
  order: z.number().optional(),
  aliases: z.array(z.string().min(1)).optional(),
  status: z.enum(['active', 'deprecated']),
})

export const tagsRegistrySchema = z.object({
  schemaVersion: schemaVersionSchema,
  tags: z.array(tagDefinitionSchema).min(1),
})

export type TagsRegistryFile = z.infer<typeof tagsRegistrySchema>
export type TagDefinition = z.infer<typeof tagDefinitionSchema>

export const metadataSchema = z
  .object({
    slug: z
      .string()
      .min(1)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'slug must be lowercase kebab-case',
      ),
    kind: resourceKindSchema,
    title: z.string().min(1),
    summary: z.string().min(1),
    tags: z.array(z.string().min(1)),
    collection: kebabCaseId('collection must be lowercase kebab-case').optional(),
    subcollection: kebabCaseId(
      'subcollection must be lowercase kebab-case',
    ).optional(),
    authors: z.array(z.string().min(1)).optional(),
    license: z.string().min(1).optional(),
    createdAt: z.string().min(1).optional(),
    updatedAt: z.string().min(1).optional(),
    sourceVersion: z
      .string()
      .min(1)
      .regex(/^\d+\.\d+$/, 'sourceVersion must be MAJOR.MINOR (e.g. "1.0")'),
    schemaVersion: schemaVersionSchema,
    featured: z.boolean().optional(),
    templateSlug: z.string().min(1).optional(),
    relatedSlugs: z.array(z.string().min(1)).optional(),
    icon: z.string().min(1).optional(),
  })
  .strict()
  .superRefine((meta, ctx) => {
    if (meta.subcollection && !meta.collection) {
      ctx.addIssue({
        code: 'custom',
        path: ['subcollection'],
        message: 'subcollection requires collection',
      })
    }
  })

export type ResourceMetadata = z.infer<typeof metadataSchema>

/**
 * SpecX outline `cardinality`. Omitted on disk → `{ min: 1, max: 1 }`.
 * `max: null` means unbounded repeatable instances.
 */
export const outlineCardinalitySchema = z
  .object({
    min: z.number().int().min(0),
    max: z.number().int().min(1).nullable(),
  })
  .superRefine((value, ctx) => {
    if (value.max !== null && value.max < value.min) {
      ctx.addIssue({
        code: 'custom',
        path: ['max'],
        message: 'cardinality.max must be greater than or equal to cardinality.min',
      })
    }
  })

export type OutlineCardinality = z.infer<typeof outlineCardinalitySchema>

/**
 * Spec DB per-node authoring hint. Mapper → SpecX outline node `description`.
 * (Template-level SpecX `guidance` is `templateContent.guidance`, not this field.)
 */
export type OutlineNode = {
  key: string
  title: string
  guidance: string
  cardinality: OutlineCardinality
  children?: OutlineNode[]
}

const OUTLINE_KEY_MESSAGE =
  'key must use lowercase letters, digits, and underscores, starting and ending with a letter or digit, e.g. "acceptance_criteria" (no hyphens)'

/** Outline node key: snake_case (lowercase letters, digits, underscores). */
export const outlineKeySchema = z
  .string()
  .regex(/^[a-z0-9](?:[a-z0-9_]*[a-z0-9])?$/, OUTLINE_KEY_MESSAGE)
  .describe(OUTLINE_KEY_MESSAGE)

export const OUTLINE_TITLE_DESCRIPTION =
  'Section title. A repeatable node (cardinality.max null or above 1) needs a {placeholder}, e.g. "Requirement: {summary}", so each instance gets its own title.'

export const outlineTitleSchema = z
  .string()
  .min(1)
  .describe(OUTLINE_TITLE_DESCRIPTION)

/**
 * Placeholders belong to repeatable nodes only: a title has a real `{name}` (non-empty after trim)
 * if and only if `cardinality.max !== 1`. An empty `{}` is malformed on any node.
 */
export function checkRepeatableTitle(
  node: { title: string; cardinality: { max: number | null } },
  ctx: z.RefinementCtx,
): void {
  if (/\{\s*\}/.test(node.title)) {
    ctx.addIssue({
      code: 'custom',
      path: ['title'],
      message: 'Placeholder names must be non-empty',
    })
  }
  const hasPlaceholder = [...node.title.matchAll(/\{([^{}]+)\}/g)].some(
    (m) => m[1].trim().length > 0,
  )
  if (node.cardinality.max !== 1 && !hasPlaceholder) {
    ctx.addIssue({
      code: 'custom',
      path: ['title'],
      message: `Repeatable section "${node.title}" needs a {placeholder} in its title so each instance gets its own title, e.g. "${node.title}: {summary}"; or set cardinality.max to 1.`,
    })
  }
  if (node.cardinality.max === 1 && hasPlaceholder) {
    ctx.addIssue({
      code: 'custom',
      path: ['title'],
      message: `Only repeatable sections use {placeholders}. Remove the {…} from "${node.title}", or make the section repeatable (cardinality.max null or above 1).`,
    })
  }
}

export const outlineNodeSchema: z.ZodType<OutlineNode> = z.lazy(() =>
  z
    .object({
      key: outlineKeySchema,
      title: outlineTitleSchema,
      guidance: z.string(),
      cardinality: outlineCardinalitySchema.default({ min: 1, max: 1 }),
      children: z.array(outlineNodeSchema).optional(),
    })
    .superRefine((node, ctx) => checkRepeatableTitle(node, ctx)),
)

export const templateContentSchema = z.object({
  schemaVersion: schemaVersionSchema,
  /** Importable template instructions → SpecX `Template.guidance`. */
  guidance: z.string().min(1),
  outline: z.array(outlineNodeSchema).min(1),
})

export type TemplateContent = z.infer<typeof templateContentSchema>

export const pipelineStepSchema = z
  .object({
    key: z
      .string()
      .min(1)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'step key must be lowercase kebab-case',
      ),
    name: z.string().min(1),
    iteratorFields: z.array(z.string().min(1)).optional(),
    /** Forbidden in v1 when set to nested pipeline. */
    type: z.string().optional(),
  })
  .strict()

export const pipelineContentSchema = z
  .object({
    schemaVersion: schemaVersionSchema,
    inputVarDefinitions: z.array(inputVarDefinitionSchema).default([]),
    iteratorFields: z.array(z.string().min(1)).optional(),
    steps: z.array(pipelineStepSchema).min(1),
  })
  .superRefine((content, ctx) => {
    const seen = new Set<string>()
    for (const [index, definition] of content.inputVarDefinitions.entries()) {
      if (seen.has(definition.key)) {
        ctx.addIssue({
          code: 'custom',
          path: ['inputVarDefinitions', index, 'key'],
          message: `duplicate inputVarDefinitions key "${definition.key}"`,
        })
      }
      seen.add(definition.key)
    }
  })

export type PipelineContent = z.infer<typeof pipelineContentSchema>
