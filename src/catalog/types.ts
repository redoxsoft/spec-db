export type ResourceKind = 'template' | 'spec' | 'pipeline'

export type Tag = {
  id: string
  label: string
}

/** UI facet groups (emitted by `npm run index`). */
export type TagsRegistry = {
  domain: Tag[]
  usecase: Tag[]
}

export type OutlineSection = {
  title: string
  guidance: string
  /** Build-time sanitized HTML for `guidance` (M9). */
  guidanceHtml?: string
}

export type InputVarDefinition = {
  key: string
  description?: string
  suggestedDefault?: string
}

export type PipelineTask = {
  key: string
  name: string
  /** Raw markdown (var extraction / import). */
  prompt: string
  /** Build-time sanitized HTML for preview (M9). */
  previewHtml?: string
  iteratorFields?: string[]
}

/** Card / browse record — no heavy bodies. */
export type CatalogLiteItem = {
  slug: string
  kind: ResourceKind
  title: string
  summary: string
  tags: string[]
  updatedAt: string
  stats: string
  featured?: boolean
  outline?: string[]
}

/** Full detail payload at `/generated/resources/<slug>.json`. */
export type ResourceDetail = CatalogLiteItem & {
  sections?: OutlineSection[]
  /** @deprecated Prefer previewHtml — raw markdown kept for debugging only. */
  contentPreview?: string
  /** Spec body as sanitized HTML (M9). */
  previewHtml?: string
  tasks?: PipelineTask[]
  inputVarDefinitions?: InputVarDefinition[]
  iteratorFields?: string[]
  templateGuidance?: string
  templateGuidanceHtml?: string
}

/** @deprecated Prefer CatalogLiteItem / ResourceDetail — alias for existing UI props. */
export type CatalogItem = ResourceDetail
