/** URL helpers for collection browse. Preserves embed, kinds, and library filters. */

export function readBrowseId(value: string | null): string | null {
  const trimmed = value?.trim() ?? ''
  return trimmed ? trimmed : null
}

export function browseCollectionParams(
  prev: URLSearchParams,
  collectionId: string,
  subcollectionId?: string | null,
): URLSearchParams {
  const next = new URLSearchParams(prev)
  next.set('collection', collectionId)
  if (subcollectionId) next.set('subcollection', subcollectionId)
  else next.delete('subcollection')
  next.delete('q')
  return next
}

export function clearCollectionParams(prev: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(prev)
  next.delete('collection')
  next.delete('subcollection')
  return next
}
