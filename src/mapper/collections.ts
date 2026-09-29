import type {
  CollectionDefinition,
  CollectionsRegistryFile,
  ResourceMetadata,
} from './schemas'

export type CollectionLookup = ReadonlyMap<string, CollectionDefinition>

export type PackagePlacement = {
  id: string
  displayName: string
}

/** First entry wins when ids are duplicated; the registry check reports the duplicate. */
export function collectionsById(
  registry: CollectionsRegistryFile,
): Map<string, CollectionDefinition> {
  const byId = new Map<string, CollectionDefinition>()
  for (const entry of registry.collections) {
    if (!byId.has(entry.id)) byId.set(entry.id, entry)
  }
  return byId
}

function isTopLevel(entry: CollectionDefinition): boolean {
  return entry.parentId == null
}

/** Registry constraints enforced by `npm run check`. */
export function collectionRegistryIssues(
  registry: CollectionsRegistryFile,
): string[] {
  const issues: string[] = []
  const byId = new Map<string, CollectionDefinition>()

  for (const entry of registry.collections) {
    if (byId.has(entry.id)) {
      issues.push(`duplicate collection id "${entry.id}"`)
      continue
    }
    byId.set(entry.id, entry)
  }

  for (const entry of registry.collections) {
    if (entry.parentId == null) continue
    const parent = byId.get(entry.parentId)
    if (!parent) {
      issues.push(
        `collection "${entry.id}" has unknown parentId "${entry.parentId}"`,
      )
      continue
    }
    if (!isTopLevel(parent)) {
      issues.push(
        `collection "${entry.id}" exceeds max hierarchy depth 2 (parent "${parent.id}" is not top-level)`,
      )
    }
  }

  const siblings = new Map<string, CollectionDefinition[]>()
  for (const entry of registry.collections) {
    const key = entry.parentId ?? ''
    const group = siblings.get(key)
    if (group) group.push(entry)
    else siblings.set(key, [entry])
  }

  for (const [parentKey, group] of siblings) {
    const seen = new Map<string, CollectionDefinition>()
    for (const entry of group) {
      const label = entry.displayName.toLowerCase()
      const prior = seen.get(label)
      if (prior) {
        const where =
          parentKey === ''
            ? 'among top-level collections'
            : `under parent "${parentKey}"`
        issues.push(
          `displayName "${entry.displayName}" duplicates "${prior.displayName}" (${prior.id} and ${entry.id}) ${where}`,
        )
      } else {
        seen.set(label, entry)
      }
    }
  }

  return issues
}

/** Membership rules for a resource. Ids must exist, be active, and sit at the right depth. */
export function resourceCollectionIssues(
  meta: Pick<ResourceMetadata, 'collection' | 'subcollection'>,
  byId: CollectionLookup,
): string[] {
  const issues: string[] = []

  if (meta.subcollection && !meta.collection) {
    issues.push('subcollection requires collection')
  }

  if (meta.collection) {
    const entry = byId.get(meta.collection)
    if (!entry) {
      issues.push(`unknown collection "${meta.collection}"`)
    } else {
      if (entry.status !== 'active') {
        issues.push(`deprecated collection "${meta.collection}" is not allowed`)
      }
      if (!isTopLevel(entry)) {
        issues.push(
          `collection "${meta.collection}" must be a top-level collection`,
        )
      }
    }
  }

  if (meta.subcollection && meta.collection) {
    const entry = byId.get(meta.subcollection)
    if (!entry) {
      issues.push(`unknown subcollection "${meta.subcollection}"`)
    } else {
      if (entry.status !== 'active') {
        issues.push(
          `deprecated subcollection "${meta.subcollection}" is not allowed`,
        )
      }
      if (entry.parentId !== meta.collection) {
        issues.push(
          `subcollection "${meta.subcollection}" is not a child of collection "${meta.collection}"`,
        )
      }
    }
  }

  return issues
}

export function placementFor(
  meta: Pick<ResourceMetadata, 'slug' | 'collection' | 'subcollection'>,
  byId: CollectionLookup,
): { collection?: PackagePlacement; subcollection?: PackagePlacement } {
  const issues = resourceCollectionIssues(meta, byId)
  if (issues.length > 0) {
    throw new Error(`${meta.slug}: ${issues.join('; ')}`)
  }

  const collection = meta.collection
    ? toPlacement(byId.get(meta.collection))
    : undefined
  const subcollection = meta.subcollection
    ? toPlacement(byId.get(meta.subcollection))
    : undefined

  return {
    ...(collection ? { collection } : {}),
    ...(subcollection ? { subcollection } : {}),
  }
}

function toPlacement(
  entry: CollectionDefinition | undefined,
): PackagePlacement {
  if (!entry) {
    throw new Error('collection registry entry missing after validation')
  }
  return { id: entry.id, displayName: entry.displayName }
}
