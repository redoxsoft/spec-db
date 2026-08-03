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
    collections: z
      .array(
        z
          .string()
          .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            'collection id must be lowercase kebab-case',
          ),
      )
      .max(2)
      .refine(
        (ids) => new Set(ids).size === ids.length,
        'collections must be unique',
      )
      .optional(),
    authors: z.array(z.string().min(1)).optional(),
    license: z.string().min(1).optional(),
    createdAt: z.string().min(1).optional(),
    updatedAt: z.string().min(1).optional(),
    schemaVersion: schemaVersionSchema,
    featured: z.boolean().optional(),
    templateSlug: z.string().min(1).optional(),
    relatedSlugs: z.array(z.string().min(1)).optional(),
    icon: z.string().min(1).optional(),
  })
  .strict()

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

export const outlineNodeSchema: z.ZodType<OutlineNode> = z.lazy(() =>
  z.object({
    key: z.string().min(1),
    title: z.string().min(1),
    guidance: z.string(),
    cardinality: outlineCardinalitySchema.default({ min: 1, max: 1 }),
    children: z.array(outlineNodeSchema).optional(),
  }),
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
