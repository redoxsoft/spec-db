import type { CatalogLiteItem, ResourceKind } from '../../catalog'
import { ALL_RESOURCE_KINDS } from '../../lib/resourceKinds'

export type KindFilter = 'all' | ResourceKind

export type CatalogFilters = {
  kind: KindFilter
  q: string
  tags: string[]
  collections: string[]
}

export const KIND_TITLES: Record<KindFilter, string> = {
  all: 'Catalog',
  template: 'Templates',
  spec: 'Specs',
  pipeline: 'Pipelines',
}

const KIND_SORT_ORDER: Record<ResourceKind, number> = {
  template: 0,
  spec: 1,
  pipeline: 2,
}

export function coerceKindFilter(
  kind: KindFilter,
  allowedKinds: ResourceKind[],
): KindFilter {
  if (allowedKinds.length === 1) return allowedKinds[0]
  if (kind === 'all') return 'all'
  if (allowedKinds.includes(kind)) return kind
  return 'all'
}

function sortByKindThenSlug(items: CatalogLiteItem[]): CatalogLiteItem[] {
  return [...items].sort((a, b) => {
    const kindDelta = KIND_SORT_ORDER[a.kind] - KIND_SORT_ORDER[b.kind]
    if (kindDelta !== 0) return kindDelta
    return a.slug.localeCompare(b.slug)
  })
}

/** Group items in display order: templates → specs → pipelines (empty groups omitted). */
export function groupCatalogByKind(
  items: CatalogLiteItem[],
): { kind: ResourceKind; title: string; items: CatalogLiteItem[] }[] {
  const groups: Record<ResourceKind, CatalogLiteItem[]> = {
    template: [],
    spec: [],
    pipeline: [],
  }
  for (const item of items) {
    groups[item.kind].push(item)
  }
  return ALL_RESOURCE_KINDS.filter((kind) => groups[kind].length > 0).map(
    (kind) => ({
      kind,
      title: KIND_TITLES[kind],
      items: groups[kind],
    }),
  )
}

/**
 * Filter catalog by kind/tags/allowlist.
 * Search (`q`) is applied via `searchSlugs` from Pagefind — not in-memory title match.
 * Results are ordered templates → specs → pipelines, then by slug.
 */
export function filterCatalog(
  items: CatalogLiteItem[],
  filters: CatalogFilters,
  allowedKinds: ResourceKind[] = ALL_RESOURCE_KINDS,
  searchSlugs: Set<string> | null = null,
): CatalogLiteItem[] {
  const kind = coerceKindFilter(filters.kind, allowedKinds)
  const hasQuery = filters.q.trim().length > 0

  const filtered = items.filter((item) => {
    if (!allowedKinds.includes(item.kind)) return false

    if (kind !== 'all' && item.kind !== kind) return false

    if (hasQuery) {
      if (!searchSlugs || !searchSlugs.has(item.slug)) return false
    }

    if (
      filters.tags.length > 0 &&
      !filters.tags.every((tag) => item.tags.includes(tag))
    ) {
      return false
    }

    if (
      filters.collections.length > 0 &&
      !filters.collections.every((id) =>
        (item.collections ?? []).includes(id),
      )
    ) {
      return false
    }

    return true
  })

  return sortByKindThenSlug(filtered)
}

export function hasActiveFilters(
  filters: CatalogFilters,
  allowedKinds: ResourceKind[] = ALL_RESOURCE_KINDS,
): boolean {
  const kind = coerceKindFilter(filters.kind, allowedKinds)
  const kindIsUserChoice = allowedKinds.length > 1 && kind !== 'all'

  return (
    kindIsUserChoice ||
    filters.q.trim().length > 0 ||
    filters.tags.length > 0 ||
    filters.collections.length > 0
  )
}

export function catalogTitle(
  filters: CatalogFilters,
  allowedKinds: ResourceKind[],
): string {
  const kind = coerceKindFilter(filters.kind, allowedKinds)
  if (allowedKinds.length === 1) return KIND_TITLES[allowedKinds[0]]
  return KIND_TITLES[kind]
}
