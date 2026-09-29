import { Folder } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import type { CatalogCollection } from '../../catalog'
import { cn } from '../../lib/cn'
import { folderIconClassName } from '../../lib/kindStyles'
import { browseCollectionParams } from './browseParams'

type CollectionTilesProps = {
  collectionId: string
  tiles: Array<{ child: CatalogCollection; count: number }>
  unit: string
  onOpenCollection: (id: string, subcollectionId?: string | null) => void
}

export function CollectionTiles({
  collectionId,
  tiles,
  unit,
  onOpenCollection,
}: CollectionTilesProps) {
  const [params] = useSearchParams()
  if (tiles.length === 0) return null

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tiles.map(({ child, count }) => {
        const search = browseCollectionParams(
          params,
          collectionId,
          child.id,
        ).toString()
        return (
          <Link
            key={child.id}
            to={{ pathname: '/', search }}
            onClick={(event) => {
              if (
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.button !== 0
              ) {
                return
              }
              event.preventDefault()
              onOpenCollection(collectionId, child.id)
            }}
            className="flex flex-col rounded-xl border border-ui-border bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover"
          >
            <span className="flex items-center gap-2 font-semibold text-gray-900">
              <Folder
                className={cn('h-4 w-4 shrink-0', folderIconClassName)}
                aria-hidden
              />
              {child.displayName}
            </span>
            <span className="mt-2 text-sm text-gray-500">
              {count} {unit}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
