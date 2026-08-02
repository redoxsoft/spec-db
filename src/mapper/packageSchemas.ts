import { z } from 'zod'
import {
  inputVarDefinitionSchema,
  outlineCardinalitySchema,
  schemaVersionSchema,
  type OutlineCardinality,
} from './schemas'

/** Import package contract version (distinct from authoring `schemaVersion`). */
export const packageVersionSchema = z.literal('1')
export type PackageVersion = z.infer<typeof packageVersionSchema>

const packageEnvelopeFields = {
  packageVersion: packageVersionSchema,
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase kebab-case'),
  title: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).optional(),
  updatedAt: z.string().min(1).optional(),
  schemaVersion: schemaVersionSchema,
}

/** Packaged outline node — full tree; cardinality + children always present. */
export type PackageOutlineNode = {
  key: string
  title: string
  guidance: string
  cardinality: OutlineCardinality
  children: PackageOutlineNode[]
}

export const packageOutlineNodeSchema: z.ZodType<PackageOutlineNode> = z.lazy(
  () =>
    z.object({
      key: z.string().min(1),
      title: z.string().min(1),
      guidance: z.string(),
      cardinality: outlineCardinalitySchema,
      children: z.array(packageOutlineNodeSchema),
    }),
)

export const templatePackageSchema = z
  .object({
    ...packageEnvelopeFields,
    kind: z.literal('template'),
    template: z.object({
      guidance: z.string().min(1),
      outline: z.array(packageOutlineNodeSchema).min(1),
    }),
  })
  .strict()

export type TemplatePackage = z.infer<typeof templatePackageSchema>

export const pipelinePackageStepSchema = z
  .object({
    key: z
      .string()
      .min(1)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'step key must be lowercase kebab-case',
      ),
    name: z.string().min(1),
    instructions: z.string(),
    iteratorFields: z.array(z.string().min(1)),
  })
  .strict()

export const pipelinePackageSchema = z
  .object({
    ...packageEnvelopeFields,
    kind: z.literal('pipeline'),
    pipeline: z.object({
      inputVarDefinitions: z.array(inputVarDefinitionSchema),
      iteratorFields: z.array(z.string().min(1)),
      steps: z.array(pipelinePackageStepSchema).min(1),
    }),
  })
  .strict()

export type PipelinePackage = z.infer<typeof pipelinePackageSchema>

export const packageCalloutToneSchema = z.enum(['info', 'warning', 'decision'])
export type PackageCalloutTone = z.infer<typeof packageCalloutToneSchema>

export const packageBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('paragraph'), text: z.string() }).strict(),
  z
    .object({ type: z.literal('bullet_list'), items: z.array(z.string()) })
    .strict(),
  z
    .object({ type: z.literal('numbered_list'), items: z.array(z.string()) })
    .strict(),
  z
    .object({
      type: z.literal('code_block'),
      code: z.string(),
      language: z.string().nullable().optional(),
    })
    .strict(),
  z
    .object({
      type: z.literal('callout'),
      text: z.string(),
      tone: packageCalloutToneSchema.optional(),
    })
    .strict(),
  z
    .object({
      type: z.literal('table'),
      columnCount: z.number().int().min(1).max(6),
      headerRow: z.boolean(),
      headerColumn: z.boolean(),
      rows: z.array(z.array(z.string())),
    })
    .strict(),
  z.object({ type: z.literal('divider') }).strict(),
])

export type PackageBlock = z.infer<typeof packageBlockSchema>

export type PackageSection = {
  key?: string
  title: string
  blocks: PackageBlock[]
  children: PackageSection[]
}

export const packageSectionSchema: z.ZodType<PackageSection> = z.lazy(() =>
  z.object({
    key: z.string().min(1).optional(),
    title: z.string().min(1),
    blocks: z.array(packageBlockSchema),
    children: z.array(packageSectionSchema),
  }),
)

export const specPackageSchema = z
  .object({
    ...packageEnvelopeFields,
    kind: z.literal('spec'),
    spec: z.object({
      sections: z.array(packageSectionSchema).min(1),
    }),
  })
  .strict()

export type SpecPackage = z.infer<typeof specPackageSchema>

/** Host import packages under `public/generated/packages/{kind}/{slug}.json`. */
export const importPackageSchema = z.discriminatedUnion('kind', [
  templatePackageSchema,
  pipelinePackageSchema,
  specPackageSchema,
])

export type ImportPackage = z.infer<typeof importPackageSchema>
