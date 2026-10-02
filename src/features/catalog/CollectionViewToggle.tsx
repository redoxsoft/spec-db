import { FolderTree, LayoutGrid, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

export type CollectionView = 'folders' | 'all'

const OPTIONS: { id: CollectionView; label: string; icon: LucideIcon }[] = [
  { id: 'folders', label: 'By folder', icon: FolderTree },
  { id: 'all', label: 'All', icon: LayoutGrid },
]

type CollectionViewToggleProps = {
  view: CollectionView
  onChange: (view: CollectionView) => void
}

/** Layout switch for a collection with folders. Does not change what is imported. */
export function CollectionViewToggle({
  view,
  onChange,
}: CollectionViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Layout"
      className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5"
    >
      {OPTIONS.map(({ id, label, icon: Icon }) => {
        const selected = view === id
        return (
          <button
            key={id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(id)}
            className={cn(
              'inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors',
              selected
                ? 'bg-brand-50 text-brand-700'
                : 'text-gray-600 hover:bg-gray-50',
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </button>
        )
      })}
    </div>
  )
}
