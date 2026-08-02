import { X } from 'lucide-react'
import { getTagLabel, type ResourceKind, type TagsRegistry } from '../../catalog'
import { KIND_TITLES, type CatalogFilters } from './filterCatalog'

type ActiveFilterChipsProps = {
  filters: CatalogFilters
  allowedKinds: ResourceKind[]
  tags: TagsRegistry
  onClearKind: () => void
  onClearQuery: () => void
  onRemoveTag: (tagId: string) => void
  onClearAll: () => void
}

function Chip({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-md bg-brand-50 px-2.5 py-2 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100 md:min-h-0 md:py-1"
    >
      {label}
      <X className="h-3 w-3" aria-hidden />
    </button>
  )
}

export function ActiveFilterChips({
  filters,
  allowedKinds,
  tags,
  onClearKind,
  onClearQuery,
  onRemoveTag,
  onClearAll,
}: ActiveFilterChipsProps) {
  const query = filters.q.trim()
  const showKindChip = allowedKinds.length > 1 && filters.kind !== 'all'
  const show =
    showKindChip || query.length > 0 || filters.tags.length > 0

  if (!show) return null

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {showKindChip ? (
        <Chip label={KIND_TITLES[filters.kind]} onRemove={onClearKind} />
      ) : null}
      {query ? <Chip label={`“${query}”`} onRemove={onClearQuery} /> : null}
      {filters.tags.map((tagId) => (
        <Chip
          key={tagId}
          label={getTagLabel(tags, tagId)}
          onRemove={() => onRemoveTag(tagId)}
        />
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="min-h-11 px-2 py-2 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900 md:min-h-0 md:py-1"
      >
        Clear all
      </button>
    </div>
  )
}
