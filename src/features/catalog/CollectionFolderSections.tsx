import { ChevronRight, Folder } from 'lucide-react'
import { cn } from '../../lib/cn'
import { folderIconClassName } from '../../lib/kindStyles'
import { CatalogCardGrid, type CardGridOptions } from './CatalogCardGrid'
import { CollectionLink } from './CollectionLink'
import type { ChildFolder, FolderSection } from './collectionPack'

type CollectionFolderSectionsProps = {
  collectionId: string
  sections: FolderSection[]
  unit: string
  onOpenCollection: (id: string, subcollectionId?: string | null) => void
  cards: CardGridOptions
}

/** Every card in a collection, under its folder's heading. */
export function CollectionFolderSections({
  collectionId,
  sections,
  unit,
  onOpenCollection,
  cards,
}: CollectionFolderSectionsProps) {
  return (
    <div className="space-y-10">
      {sections.map(({ folder, items }) => (
        <section key={folder?.child.id ?? 'root'}>
          {folder ? (
            <FolderHeading
              collectionId={collectionId}
              folder={folder}
              unit={unit}
              onOpenCollection={onOpenCollection}
            />
          ) : (
            <h2 className="mb-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
              Top level
            </h2>
          )}
          <CatalogCardGrid items={items} grouped={false} {...cards} />
        </section>
      ))}
    </div>
  )
}

function FolderHeading({
  collectionId,
  folder,
  unit,
  onOpenCollection,
}: {
  collectionId: string
  folder: ChildFolder
  unit: string
  onOpenCollection: (id: string, subcollectionId?: string | null) => void
}) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-900">
        <CollectionLink
          collectionId={collectionId}
          subcollectionId={folder.child.id}
          onOpenCollection={onOpenCollection}
          className="group inline-flex items-center gap-2 hover:text-brand-700"
        >
          <Folder
            className={cn('h-5 w-5 shrink-0', folderIconClassName)}
            aria-hidden
          />
          {folder.child.displayName}
          <span className="text-sm font-normal text-gray-500">
            {folder.count} {unit}
          </span>
          <ChevronRight
            className="h-4 w-4 text-gray-400 group-hover:text-brand-700"
            aria-hidden
          />
        </CollectionLink>
      </h2>
      <p className="mt-1 max-w-3xl text-sm text-gray-500">
        {folder.child.description}
      </p>
    </div>
  )
}
