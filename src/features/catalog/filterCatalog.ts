import type { CatalogLiteItem, ResourceKind } from '../../catalog'
import { ALL_RESOURCE_KINDS } from '../../lib/resourceKinds'

export type KindFilter = 'all' | ResourceKind

export type CatalogFilters = {
  kind: KindFilter
  q: string
  tags: string[]
}

export const KIND_TITLES: Record<KindFilter, string> = {
  all: 'Catalog',
  template: 'Templates',
  spec: 'Specs',
  pipeline: 'Pipelines',
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

/**
 * Filter catalog by kind/tags/allowlist.
 * Text (`q`) is applied via `searchSlugs` from Pagefind — not in-memory title match.
 */
export function filterCatalog(
  items: CatalogLiteItem[],
  filters: CatalogFilters,
  allowedKinds: ResourceKind[] = ALL_RESOURCE_KINDS,
  searchSlugs: Set<string> | null = null,
): CatalogLiteItem[] {
  const kind = coerceKindFilter(filters.kind, allowedKinds)
  const hasQuery = filters.q.trim().length > 0

  return items.filter((item) => {
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

    return true
  })
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
    filters.tags.length > 0
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
