import type { ResourceKind } from '../catalog'

export const IMPORT_REQUESTED_TYPE = 'spec-db:import:requested' as const
export const IMPORT_BATCH_REQUESTED_TYPE =
  'spec-db:import:batch-requested' as const
export const IMPORT_BATCH_PROGRESS_TYPE =
  'spec-db:import:batch-progress' as const
export const IMPORT_BATCH_COMPLETED_TYPE =
  'spec-db:import:batch-completed' as const

/** Default SpecX standalone `/import` base (templates + specs). */
export const DEFAULT_SPECX_IMPORT_BASE = 'https://specx.redoxsoft.com/import'

/** Default WorkX standalone `/import` base (pipelines). */
export const DEFAULT_WORKX_IMPORT_BASE = 'https://workx.redoxsoft.com/import'

export type SpecDbImportItem = {
  kind: ResourceKind
  slug: string
}

export type SpecDbImportRequested = {
  type: typeof IMPORT_REQUESTED_TYPE
  kind: ResourceKind
  slug: string
}

export type SpecDbImportBatchRequested = {
  type: typeof IMPORT_BATCH_REQUESTED_TYPE
  batchId: string
  items: SpecDbImportItem[]
}

export type SpecDbImportBatchProgressStatus =
  | 'started'
  | 'succeeded'
  | 'failed'
  | 'skipped'

export type SpecDbImportBatchProgress = {
  type: typeof IMPORT_BATCH_PROGRESS_TYPE
  batchId: string
  index: number
  total: number
  item: SpecDbImportItem
  status: SpecDbImportBatchProgressStatus
  attempt?: number
  error?: { code?: string; message: string }
}

export type SpecDbImportBatchCompleted = {
  type: typeof IMPORT_BATCH_COMPLETED_TYPE
  batchId: string
  results: Array<{
    item: SpecDbImportItem
    status: 'succeeded' | 'failed' | 'skipped'
    error?: { code?: string; message: string }
  }>
}

/**
 * postMessage targetOrigin for embed Import.
 * Prefer ancestorOrigins (embedding parent), then document.referrer.
 * Referrer alone is unreliable: in-iframe navigations can make it equal Spec DB's
 * own origin, which breaks postMessage to SpecX/WorkX.
 * Dev may fall back to '*'; production warns before '*' last resort.
 */
export function resolvePostMessageTargetOrigin(): string {
  const ancestors = (
    window.location as Location & { ancestorOrigins?: DOMStringList }
  ).ancestorOrigins
  const ancestor = ancestors?.[0]
  if (ancestor) {
    try {
      return new URL(ancestor).origin
    } catch {
      /* ignore */
    }
  }

  try {
    if (document.referrer) {
      const referrerOrigin = new URL(document.referrer).origin
      // Never target our own origin — that cannot be the host parent.
      if (referrerOrigin !== window.location.origin) {
        return referrerOrigin
      }
    }
  } catch {
    /* ignore invalid referrer */
  }

  if (import.meta.env.DEV) return '*'

  console.warn(
    '[spec-db] No host parent origin; using "*" for postMessage',
  )
  return '*'
}

function importBaseForKind(kind: ResourceKind): string {
  if (kind === 'pipeline') {
    return (
      import.meta.env.VITE_WORKX_IMPORT_BASE?.trim() || DEFAULT_WORKX_IMPORT_BASE
    )
  }
  return (
    import.meta.env.VITE_SPECX_IMPORT_BASE?.trim() || DEFAULT_SPECX_IMPORT_BASE
  )
}

/**
 * Standalone host import deep link.
 * SpecX for template/spec; WorkX for pipeline.
 * Query params: `kind` + `slug` only (no contentUrl, no workspace id).
 */
export function hostImportUrl(kind: ResourceKind, slug: string): string {
  const url = new URL(importBaseForKind(kind))
  url.search = ''
  url.searchParams.set('kind', kind)
  url.searchParams.set('slug', slug)
  return url.href
}

export function createImportBatchId(): string {
  return crypto.randomUUID()
}

export function importItemKey(item: SpecDbImportItem): string {
  return `${item.kind}:${item.slug}`
}

export type ImportHandoffResult =
  | { mode: 'embed'; message: SpecDbImportRequested; targetOrigin: string }
  | { mode: 'standalone'; url: string }

export type ImportBatchHandoffResult = {
  mode: 'embed'
  message: SpecDbImportBatchRequested
  targetOrigin: string
}

/** Perform Import handoff (embed postMessage or standalone window.open). */
export function requestImport(options: {
  kind: ResourceKind
  slug: string
  embed: boolean
}): ImportHandoffResult {
  const message: SpecDbImportRequested = {
    type: IMPORT_REQUESTED_TYPE,
    kind: options.kind,
    slug: options.slug,
  }

  if (options.embed) {
    const targetOrigin = resolvePostMessageTargetOrigin()
    window.parent.postMessage(message, targetOrigin)
    return { mode: 'embed', message, targetOrigin }
  }

  const url = hostImportUrl(options.kind, options.slug)
  window.open(url, '_blank', 'noopener,noreferrer')
  return { mode: 'standalone', url }
}

/**
 * Embed-only batch handoff. Posts identity-only items + batchId to the parent.
 * Standalone multi-import is out of scope — use requestImport per item.
 */
export function requestImportBatch(options: {
  items: SpecDbImportItem[]
  embed: boolean
}): ImportBatchHandoffResult {
  if (!options.embed) {
    throw new Error('requestImportBatch is embed-only')
  }
  if (options.items.length < 1) {
    throw new Error('requestImportBatch requires at least one item')
  }

  const message: SpecDbImportBatchRequested = {
    type: IMPORT_BATCH_REQUESTED_TYPE,
    batchId: createImportBatchId(),
    items: options.items.map((item) => ({
      kind: item.kind,
      slug: item.slug,
    })),
  }

  const targetOrigin = resolvePostMessageTargetOrigin()
  window.parent.postMessage(message, targetOrigin)
  return { mode: 'embed', message, targetOrigin }
}
