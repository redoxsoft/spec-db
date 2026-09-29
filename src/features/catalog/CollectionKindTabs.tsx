import type { ResourceKind } from '../../catalog'
import { cn } from '../../lib/cn'
import type { KindFilter } from './filterCatalog'
import { kindFilterOptions } from './kindFilterOptions'

type CollectionKindTabsProps = {
  allowedKinds: readonly ResourceKind[]
  kind: KindFilter
  onChange: (kind: KindFilter) => void
}

/** Local grid tabs. Does not change the pack message `items`. */
export function CollectionKindTabs({
  allowedKinds,
  kind,
  onChange,
}: CollectionKindTabsProps) {
  if (allowedKinds.length < 2) return null

  const options = kindFilterOptions(allowedKinds)

  return (
    <div
      role="tablist"
      aria-label="Resource type"
      className="mb-6 flex flex-wrap gap-2"
    >
      {options.map(({ id, label, icon: Icon, iconClassName }) => {
        const selected = kind === id
        const tabLabel = id === 'all' ? 'All' : label
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(id)}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
              selected
                ? 'border-brand-200 bg-brand-50 text-brand-700'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50',
            )}
          >
            <Icon className={cn('h-4 w-4', iconClassName)} aria-hidden />
            {tabLabel}
          </button>
        )
      })}
    </div>
  )
}
