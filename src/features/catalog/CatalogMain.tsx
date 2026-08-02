import { Clock3, LoaderCircle, SearchX, SlidersHorizontal } from 'lucide-react'
import type {
  CatalogLiteItem,
  ResourceKind,
  TagsRegistry,
} from '../../catalog'
import { ActiveFilterChips } from './ActiveFilterChips'
import {
  coerceKindFilter,
  hasActiveFilters,
  type CatalogFilters,
} from './filterCatalog'
import { ResourceCard } from './ResourceCard'

type CatalogMainProps = {
  title: string
  items: CatalogLiteItem[]
  filters: CatalogFilters
  allowedKinds: ResourceKind[]
  tags: TagsRegistry
  loading?: boolean
  searching?: boolean
  searchError?: string | null
  error?: string | null
  onSelect: (slug: string) => void
  onClearKind: () => void
  onClearQuery: () => void
  onRemoveTag: (tagId: string) => void
  onClearFilters: () => void
  onOpenFilters: () => void
}

function catalogSubtitle(allowedKinds: ResourceKind[]): string {
  if (allowedKinds.length === 1) {
    if (allowedKinds[0] === 'pipeline') {
      return 'Browse automated pipelines ready to import into WorkX.'
    }
    if (allowedKinds[0] === 'spec') {
      return 'Browse verified specs ready to import into SpecX.'
    }
    return 'Browse global templates ready to import into SpecX.'
  }
  if (
    allowedKinds.length === 2 &&
    allowedKinds.includes('spec') &&
    allowedKinds.includes('template')
  ) {
    return 'Browse global templates and verified specs for SpecX.'
  }
  return 'Browse global templates, verified specs, and automated pipelines.'
}

function activeFilterCount(
  filters: CatalogFilters,
  allowedKinds: ResourceKind[],
): number {
  let count = 0
  if (allowedKinds.length > 1 && filters.kind !== 'all') count += 1
  if (filters.q.trim()) count += 1
  count += filters.tags.length
  return count
}

function SearchStatusBar({ label }: { label: string }) {
  return (
    <div
      className="mb-6 flex items-center gap-2 rounded-lg border border-brand-100 bg-brand-50 px-3 py-2 text-sm text-brand-800"
      role="status"
      aria-live="polite"
    >
      <LoaderCircle className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
      <span>{label}</span>
    </div>
  )
}

function CatalogSkeleton() {
  return (
    <div
      className="grid auto-rows-max grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      aria-hidden
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="h-48 animate-pulse rounded-xl border border-gray-100 bg-white"
        >
          <div className="space-y-3 p-5">
            <div className="h-3 w-16 rounded bg-gray-100" />
            <div className="h-5 w-3/4 rounded bg-gray-100" />
            <div className="h-3 w-full rounded bg-gray-50" />
            <div className="h-3 w-5/6 rounded bg-gray-50" />
          </div>
        </div>
      ))}
    </div>
  )
}

function isComingSoonKind(
  filters: CatalogFilters,
  allowedKinds: ResourceKind[],
): boolean {
  const kind = coerceKindFilter(filters.kind, allowedKinds)
  return kind === 'spec' || kind === 'pipeline'
}

export function CatalogMain({
  title,
  items,
  filters,
  allowedKinds,
  tags,
  loading = false,
  searching = false,
  searchError = null,
  error = null,
  onSelect,
  onClearKind,
  onClearQuery,
  onRemoveTag,
  onClearFilters,
  onOpenFilters,
}: CatalogMainProps) {
  const empty = items.length === 0
  const filterCount = activeFilterCount(filters, allowedKinds)
  const showClearEmpty = hasActiveFilters(filters, allowedKinds)
  const comingSoon = empty && isComingSoonKind(filters, allowedKinds)

  return (
    <section className="relative flex-1 overflow-y-auto bg-ui-bg">
      <div className="mx-auto max-w-6xl p-6 md:p-8 lg:p-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
            <p className="mt-2 text-gray-500">{catalogSubtitle(allowedKinds)}</p>
          </div>
          <button
            type="button"
            onClick={onOpenFilters}
            className="relative flex h-11 shrink-0 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Filters
            {filterCount > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[10px] font-bold text-white">
                {filterCount}
              </span>
            ) : null}
          </button>
        </div>

        <ActiveFilterChips
          filters={filters}
          allowedKinds={allowedKinds}
          tags={tags}
          onClearKind={onClearKind}
          onClearQuery={onClearQuery}
          onRemoveTag={onRemoveTag}
          onClearAll={onClearFilters}
        />

        {loading ? (
          <p className="py-20 text-center text-sm text-gray-500">
            Loading catalog…
          </p>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Catalog unavailable
            </h3>
            <p className="mt-1 max-w-sm text-gray-500">{error}</p>
            <p className="mt-3 max-w-sm text-xs text-gray-400">
              Run <code className="rounded bg-gray-100 px-1">npm run index</code>{' '}
              then restart the dev server.
            </p>
          </div>
        ) : (
          <>
            {searching ? <SearchStatusBar label="Searching…" /> : null}

            {searchError && !searching ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <SearchX className="h-8 w-8 text-gray-400" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Search unavailable
                </h3>
                <p className="mt-1 max-w-sm text-gray-500">{searchError}</p>
                <p className="mt-3 max-w-sm text-xs text-gray-400">
                  Run{' '}
                  <code className="rounded bg-gray-100 px-1">
                    npm run pagefind
                  </code>{' '}
                  then reload.
                </p>
              </div>
            ) : !empty ? (
              <div
                key={items.map((item) => item.slug).join('|')}
                className={
                  searching
                    ? 'grid auto-rows-max grid-cols-1 gap-6 opacity-60 transition-opacity md:grid-cols-2 lg:grid-cols-3'
                    : 'grid auto-rows-max grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
                }
              >
                {items.map((item, index) => (
                  <div
                    key={item.slug}
                    className="catalog-card-enter h-full"
                    style={{
                      animationDelay: `${Math.min(index, 8) * 40}ms`,
                    }}
                  >
                    <ResourceCard item={item} onSelect={onSelect} />
                  </div>
                ))}
              </div>
            ) : searching ? (
              <CatalogSkeleton />
            ) : comingSoon ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
                  <Clock3 className="h-8 w-8 text-brand-600" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Coming soon
                </h3>
                <p className="mt-1 max-w-sm text-gray-500">
                  {coerceKindFilter(filters.kind, allowedKinds) === 'pipeline'
                    ? 'Pipelines will appear here when they are ready to browse and import.'
                    : 'Specs will appear here when they are ready to browse and import.'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <SearchX className="h-8 w-8 text-gray-400" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  No resources found
                </h3>
                <p className="mt-1 max-w-sm text-gray-500">
                  Try adjusting your filters or search query to find what
                  you&apos;re looking for.
                </p>
                {showClearEmpty ? (
                  <button
                    type="button"
                    onClick={onClearFilters}
                    className="mt-4 min-h-11 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Clear all filters
                  </button>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
