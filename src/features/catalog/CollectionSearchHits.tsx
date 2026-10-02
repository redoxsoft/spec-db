import { Folder } from 'lucide-react'
import { cn } from '../../lib/cn'
import { folderIconClassName } from '../../lib/kindStyles'
import { CollectionLink } from './CollectionLink'
import type { CollectionSearchTarget } from './collectionPack'

type CollectionSearchHitsProps = {
  hits: CollectionSearchTarget[]
  onOpenCollection: (id: string, subcollectionId?: string | null) => void
}

export function CollectionSearchHits({
  hits,
  onOpenCollection,
}: CollectionSearchHitsProps) {
  if (hits.length === 0) return null

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
        Collections
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hits.map((hit) => (
          <CollectionLink
            key={hit.key}
            collectionId={hit.collectionId}
            subcollectionId={hit.subcollectionId}
            onOpenCollection={onOpenCollection}
            className="flex flex-col gap-2 rounded-xl border border-ui-border bg-white p-4 text-left shadow-card transition-shadow hover:shadow-card-hover"
          >
            <span className="flex items-center gap-2">
              <Folder
                className={cn('h-4 w-4 shrink-0', folderIconClassName)}
                aria-hidden
              />
              <span className="rounded bg-kind-folder-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-kind-folder-800 uppercase">
                Collection
              </span>
            </span>
            <span className="font-semibold text-gray-900">{hit.displayName}</span>
            <span className="line-clamp-2 text-sm text-gray-500">
              {hit.description}
            </span>
          </CollectionLink>
        ))}
      </div>
    </div>
  )
}
