import {
  ChevronDown,
  FileText,
  Layers,
  Layout,
  Search,
  Workflow,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import type { ResourceKind, TagsRegistry } from '../../catalog'
import type { CatalogFilters, KindFilter } from './filterCatalog'

const KIND_FILTERS: {
  id: KindFilter
  label: string
  icon: typeof Layers
}[] = [
  { id: 'all', label: 'All Resources', icon: Layers },
  { id: 'template', label: 'Templates', icon: Layout },
  { id: 'spec', label: 'Specs', icon: FileText },
  { id: 'pipeline', label: 'Pipelines', icon: Workflow },
]

const TAG_GROUPS = [
  { id: 'domain', label: 'Domain', key: 'domain' as const },
  { id: 'usecase', label: 'Use Case', key: 'usecase' as const },
]

export type CatalogFiltersPanelProps = {
  tags: TagsRegistry
  filters: CatalogFilters
  allowedKinds: ResourceKind[]
  onKindChange: (kind: KindFilter) => void
  onQueryChange: (q: string) => void
  onToggleTag: (tagId: string) => void
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
  tags,
  filters,
  allowedKinds,
  onKindChange,
  onQueryChange,
  onToggleTag,
  onSearchFocus,
}: CatalogFiltersPanelProps) {
  const showKindFilter = allowedKinds.length > 1
  const kindOptions = KIND_FILTERS.filter(
    (option) =>
      option.id === 'all' || allowedKinds.includes(option.id as ResourceKind),
  )

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
            Resource Type
          </h2>
          <div className="space-y-1">
            {kindOptions.map(({ id, label, icon: Icon }) => {
              const selected = filters.kind === id
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
                    <Icon className="h-4 w-4" aria-hidden />
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
          Browse by Tags
        </h2>
        {TAG_GROUPS.map(({ id, label, key }) => (
          <div key={id} className="mb-5">
            <h3 className="mb-2 flex items-center gap-1 text-xs font-semibold text-gray-500">
              <ChevronDown className="h-3 w-3" aria-hidden />
              {label}
            </h3>
            <div className="space-y-1 pl-4">
              {tags[key].map((tag) => {
                const selected = filters.tags.includes(tag.id)
                return (
                  <label
                    key={tag.id}
                    className={cn(
                      'group flex min-h-11 cursor-pointer items-center gap-2 rounded-md py-2 transition-colors',
                      selected && 'text-brand-700',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onToggleTag(tag.id)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span
                      className={cn(
                        'text-sm transition-colors',
                        selected
                          ? 'font-medium text-brand-700'
                          : 'text-gray-600 group-hover:text-gray-900',
                      )}
                    >
                      {tag.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
