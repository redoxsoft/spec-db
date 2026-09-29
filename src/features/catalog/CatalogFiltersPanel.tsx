import { Folder, Search } from 'lucide-react'
import type { CatalogCollection, ResourceKind } from '../../catalog'
import { cn } from '../../lib/cn'
import { folderIconClassName } from '../../lib/kindStyles'
import type { CatalogFilters, KindFilter } from './filterCatalog'
import { kindFilterOptions } from './kindFilterOptions'

export type CatalogFiltersPanelProps = {
  filters: CatalogFilters
  allowedKinds: ResourceKind[]
  collections: CatalogCollection[]
  activeCollectionId: string | null
  onKindChange: (kind: KindFilter) => void
  onQueryChange: (q: string) => void
  onOpenCollection: (id: string) => void
  /** Prefetch Pagefind bundle on search focus. */
  onSearchFocus?: () => void
}

function searchPlaceholder(allowedKinds: ResourceKind[]): string {
  if (allowedKinds.length === 1) {
    if (allowedKinds[0] === 'pipeline') return 'Find pipelines...'
    if (allowedKinds[0] === 'spec') return 'Find specs...'
    if (allowedKinds[0] === 'template') return 'Find templates...'
  }
  if (
    allowedKinds.length === 2 &&
    allowedKinds.includes('spec') &&
    allowedKinds.includes('template')
  ) {
    return 'Find specs, templates...'
  }
  return 'Find specs, templates...'
}

export function CatalogFiltersPanel({
  filters,
  allowedKinds,
  collections,
  activeCollectionId,
  onKindChange,
  onQueryChange,
  onOpenCollection,
  onSearchFocus,
}: CatalogFiltersPanelProps) {
  const inCollection = Boolean(activeCollectionId)
  const showKindFilter = allowedKinds.length > 1
  const kindOptions = kindFilterOptions(allowedKinds)

  return (
    <>
      <div className="border-b border-ui-border p-5">
        <h2 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
          Search
        </h2>
        <div className="relative">
          <Search
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <input
            type="search"
            value={filters.q}
            onChange={(event) => onQueryChange(event.target.value)}
            onFocus={() => onSearchFocus?.()}
            placeholder={searchPlaceholder(allowedKinds)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-3 pl-9 text-sm transition-colors placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {showKindFilter ? (
        <div className="border-b border-ui-border p-5">
          <h2 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
            Library
          </h2>
          <div className="space-y-1">
            {kindOptions.map(({ id, label, icon: Icon, iconClassName }) => {
              // Kind selection only applies in Library; keep shortcuts expanded
              // while browsing a collection, but do not highlight any of them.
              const selected = !inCollection && filters.kind === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onKindChange(id)}
                  className={cn(
                    'flex min-h-11 w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    selected
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-600 hover:bg-gray-50',
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon
                      className={cn('h-4 w-4', iconClassName)}
                      aria-hidden
                    />
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto p-5">
        <h2 className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
          Collections
        </h2>
        <div className="space-y-1">
          {collections.map((collection) => {
            const selected = collection.id === activeCollectionId
            return (
              <button
                key={collection.id}
                type="button"
                onClick={() => onOpenCollection(collection.id)}
                aria-current={selected ? 'page' : undefined}
                className={cn(
                  'flex min-h-11 w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                  selected
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50',
                )}
              >
                <Folder
                  className={cn('h-4 w-4 shrink-0', folderIconClassName)}
                  aria-hidden
                />
                <span className="truncate">{collection.displayName}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
