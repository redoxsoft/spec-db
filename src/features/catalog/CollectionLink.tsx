import type { ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { browseCollectionParams } from './browseParams'

type CollectionLinkProps = {
  collectionId: string
  subcollectionId?: string | null
  onOpenCollection: (id: string, subcollectionId?: string | null) => void
  className?: string
  children: ReactNode
}

/** Opens a collection page in place. Modified clicks keep browser link behavior. */
export function CollectionLink({
  collectionId,
  subcollectionId,
  onOpenCollection,
  className,
  children,
}: CollectionLinkProps) {
  const [params] = useSearchParams()
  const search = browseCollectionParams(
    params,
    collectionId,
    subcollectionId,
  ).toString()

  return (
    <Link
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
        onOpenCollection(collectionId, subcollectionId)
      }}
      className={className}
    >
      {children}
    </Link>
  )
}
