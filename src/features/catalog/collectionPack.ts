import type { CatalogCollection, CatalogLiteItem, ResourceKind } from '../../catalog'

const KIND_SORT_ORDER: Record<ResourceKind, number> = {
  template: 0,
  spec: 1,
  pipeline: 2,
}

export type CollectionSearchTarget = {
  key: string
  collectionId: string
  subcollectionId?: string
  displayName: string
  description: string
}

export type ResolvedCollectionPage =
  | { status: 'library' }
  | { status: 'unavailable' }
  | {
      status: 'ready'
      collection: CatalogCollection
      subcollection: CatalogCollection | null
    }

export type ChildFolder = { child: CatalogCollection; count: number }

/** Cards under one heading. `folder` is null for collection-root items. */
export type FolderSection = {
  folder: ChildFolder | null
  items: CatalogLiteItem[]
}

export type PackCopy = {
  count: number
  here: number
  inSubfolders: number
  showBreakdown: boolean
  buttonLabel: string
  helper: string
  unit: string
  displayName: string
}

function isActiveTopLevel(entry: CatalogCollection): boolean {
  return entry.status === 'active' && entry.parentId == null
}

function findCollection(
  collections: readonly CatalogCollection[],
  id: string,
): CatalogCollection | undefined {
  return collections.find((entry) => entry.id === id)
}

function sortItems(items: CatalogLiteItem[]): CatalogLiteItem[] {
  return [...items].sort((a, b) => {
    const kindDelta = KIND_SORT_ORDER[a.kind] - KIND_SORT_ORDER[b.kind]
    if (kindDelta !== 0) return kindDelta
    return a.slug.localeCompare(b.slug)
  })
}

export function activeTopLevelCollections(
  collections: readonly CatalogCollection[],
): CatalogCollection[] {
  return collections
    .filter(isActiveTopLevel)
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
}

export function resolveCollectionPage(
  collections: readonly CatalogCollection[],
  collectionId: string | null,
  subcollectionId: string | null,
): ResolvedCollectionPage {
  if (!collectionId) return { status: 'library' }

  const collection = findCollection(collections, collectionId)
  if (!collection || !isActiveTopLevel(collection)) {
    return { status: 'unavailable' }
  }

  if (!subcollectionId) {
    return { status: 'ready', collection, subcollection: null }
  }

  const subcollection = findCollection(collections, subcollectionId)
  if (
    !subcollection ||
    subcollection.status !== 'active' ||
    subcollection.parentId !== collection.id
  ) {
    return { status: 'unavailable' }
  }

  return { status: 'ready', collection, subcollection }
}

function allowlisted(
  item: CatalogLiteItem,
  allowedKinds: readonly ResourceKind[],
): boolean {
  return allowedKinds.includes(item.kind)
}

/**
 * Files the pack CTA imports, which are also the page's cards.
 * Top-level includes every sub-collection file.
 */
export function importPackItems(
  catalog: readonly CatalogLiteItem[],
  collectionId: string,
  subcollectionId: string | null,
  allowedKinds: readonly ResourceKind[],
): CatalogLiteItem[] {
  return sortItems(
    catalog.filter((item) => {
      if (!allowlisted(item, allowedKinds)) return false
      if (item.collection !== collectionId) return false
      if (subcollectionId) return item.subcollection === subcollectionId
      return true
    }),
  )
}

/** Files that sit directly in the collection root, or in the open child. */
function directPageItems(
  catalog: readonly CatalogLiteItem[],
  collectionId: string,
  subcollectionId: string | null,
  allowedKinds: readonly ResourceKind[],
): CatalogLiteItem[] {
  return sortItems(
    catalog.filter((item) => {
      if (!allowlisted(item, allowedKinds)) return false
      if (item.collection !== collectionId) return false
      if (subcollectionId) return item.subcollection === subcollectionId
      return !item.subcollection
    }),
  )
}

function directChildCount(
  catalog: readonly CatalogLiteItem[],
  collectionId: string,
  childId: string,
  allowedKinds: readonly ResourceKind[],
): number {
  return catalog.filter(
    (item) =>
      allowlisted(item, allowedKinds) &&
      item.collection === collectionId &&
      item.subcollection === childId,
  ).length
}

/** Host-aware noun for folder counts. Mixed allowlists stay generic. */
export function packUnit(allowedKinds: readonly ResourceKind[]): string {
  const hasSpecx = allowedKinds.some(
    (kind) => kind === 'spec' || kind === 'template',
  )
  const hasPipeline = allowedKinds.includes('pipeline')
  if (hasPipeline && !hasSpecx) return 'pipelines'
  if (hasSpecx && !hasPipeline) return 'SpecX files'
  return 'files'
}

/** Host-aware kind list for the pack help popup. */
export function packHelperKinds(
  allowedKinds: readonly ResourceKind[],
): string {
  const labels: string[] = []
  if (allowedKinds.includes('spec')) labels.push('specs')
  if (allowedKinds.includes('template')) labels.push('templates')
  if (allowedKinds.includes('pipeline')) labels.push('pipelines')
  if (labels.length === 0) return 'files'
  if (labels.length === 1) return labels[0]
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`
  return `${labels[0]}, ${labels[1]} and ${labels[2]}`
}

export function packCopy(options: {
  catalog: readonly CatalogLiteItem[]
  collectionId: string
  subcollectionId: string | null
  displayName: string
  allowedKinds: readonly ResourceKind[]
}): PackCopy {
  const imported = importPackItems(
    options.catalog,
    options.collectionId,
    options.subcollectionId,
    options.allowedKinds,
  )
  const here = directPageItems(
    options.catalog,
    options.collectionId,
    options.subcollectionId,
    options.allowedKinds,
  ).length
  const count = imported.length
  const inSubfolders = count - here
  const showBreakdown = options.subcollectionId == null && inSubfolders > 0
  const unit = packUnit(options.allowedKinds)
  const kinds = packHelperKinds(options.allowedKinds)

  return {
    count,
    here,
    inSubfolders,
    showBreakdown,
    buttonLabel: `Import All (${count})`,
    helper: showBreakdown
      ? `This will copy all ${kinds} in ${options.displayName} to your workspace, including ${inSubfolders} in subfolders.`
      : `This will copy all ${kinds} in ${options.displayName} to your workspace.`,
    unit,
    displayName: options.displayName,
  }
}

/** Active children in display order, with their direct allowlisted count. Empty ones are hidden. */
export function activeChildFolders(
  collections: readonly CatalogCollection[],
  collectionId: string,
  catalog: readonly CatalogLiteItem[],
  allowedKinds: readonly ResourceKind[],
): ChildFolder[] {
  return collections
    .filter(
      (entry) => entry.status === 'active' && entry.parentId === collectionId,
    )
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
    .map((child) => ({
      child,
      count: directChildCount(catalog, collectionId, child.id, allowedKinds),
    }))
    .filter((folder) => folder.count > 0)
}

/** Root items first, then one section per folder in order. Sections with no items are dropped. */
export function groupByFolder(
  items: readonly CatalogLiteItem[],
  folders: readonly ChildFolder[],
): FolderSection[] {
  const sections: FolderSection[] = [
    { folder: null, items: items.filter((item) => !item.subcollection) },
    ...folders.map((folder) => ({
      folder,
      items: items.filter((item) => item.subcollection === folder.child.id),
    })),
  ]
  return sections.filter((section) => section.items.length > 0)
}

export function collectionSearchTargets(
  hits: readonly { id: string; parentId: string | null }[],
  collections: readonly CatalogCollection[],
): CollectionSearchTarget[] {
  const seen = new Set<string>()
  const targets: CollectionSearchTarget[] = []

  for (const hit of hits) {
    if (hit.parentId) {
      const parent = findCollection(collections, hit.parentId)
      const child = findCollection(collections, hit.id)
      if (!parent || !isActiveTopLevel(parent)) continue
      if (
        !child ||
        child.status !== 'active' ||
        child.parentId !== parent.id
      ) {
        continue
      }
      const key = `${parent.id}/${child.id}`
      if (seen.has(key)) continue
      seen.add(key)
      targets.push({
        key,
        collectionId: parent.id,
        subcollectionId: child.id,
        displayName: child.displayName,
        description: child.description,
      })
      continue
    }

    const entry = findCollection(collections, hit.id)
    if (!entry || !isActiveTopLevel(entry)) continue
    if (seen.has(entry.id)) continue
    seen.add(entry.id)
    targets.push({
      key: entry.id,
      collectionId: entry.id,
      displayName: entry.displayName,
      description: entry.description,
    })
  }

  return targets
}
