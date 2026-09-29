import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { parseKindsAllowlist } from '../../app/runtimeParams'
import {
  fetchCatalogLite,
  fetchCollectionsRegistry,
  fetchTagsRegistry,
  type CatalogCollection,
  type CatalogLiteItem,
  type ResourceKind,
  type TagsRegistry,
} from '../../catalog'
import { ensurePagefind, searchPagefind } from '../search/pagefindClient'
import type { PagefindCollectionHit } from '../search/pagefindClient'
import {
  browseCollectionParams,
  clearCollectionParams,
  readBrowseId,
} from './browseParams'
import {
  catalogTitle,
  coerceKindFilter,
  filterCatalog,
  hasActiveFilters,
  type CatalogFilters,
  type KindFilter,
} from './filterCatalog'

const KIND_VALUES: KindFilter[] = ['all', 'template', 'spec', 'pipeline']
const EMPTY_TAGS: TagsRegistry = { domain: [], usecase: [] }
const SEARCH_DEBOUNCE_MS = 300

type ResolvedSearch = {
  /** Query that `slugs` corresponds to (stale-while-revalidate). */
  query: string
  slugs: Set<string> | null
  collections: PagefindCollectionHit[]
}

function parseKind(value: string | null): KindFilter {
  if (value && KIND_VALUES.includes(value as KindFilter)) {
    return value as KindFilter
  }
  return 'all'
}

function readFilters(params: URLSearchParams): CatalogFilters {
  return {
    kind: parseKind(params.get('kind')),
    q: params.get('q') ?? '',
    tags: params.getAll('tag'),
  }
}

function writeFilters(
  prev: URLSearchParams,
  next: CatalogFilters,
  allowedKinds: ResourceKind[],
): URLSearchParams {
  const params = new URLSearchParams(prev)
  const kind = coerceKindFilter(next.kind, allowedKinds)

  if (allowedKinds.length === 1 || kind === 'all') params.delete('kind')
  else params.set('kind', kind)

  const q = next.q.trim()
  if (!q) params.delete('q')
  else params.set('q', q)

  params.delete('tag')
  for (const tag of next.tags) params.append('tag', tag)

  return params
}

/** Loads generated catalog-lite, tags, and collections; text search via Pagefind. */
export function useCatalog(): {
  allItems: CatalogLiteItem[]
  items: CatalogLiteItem[]
  tags: TagsRegistry
  collections: CatalogCollection[]
  filters: CatalogFilters
  allowedKinds: ResourceKind[]
  title: string
  hasFilters: boolean
  loading: boolean
  searching: boolean
  searchError: string | null
  error: string | null
  collectionId: string | null
  subcollectionId: string | null
  resolvedQuery: string
  searchSlugs: Set<string> | null
  collectionHits: PagefindCollectionHit[]
  setKind: (kind: KindFilter) => void
  setQuery: (q: string) => void
  setGroupTag: (groupTagIds: readonly string[], tagId: string | null) => void
  removeTag: (tagId: string) => void
  openCollection: (id: string, subcollectionId?: string | null) => void
  clearCollection: () => void
  clearFilters: () => void
  prepareSearch: () => void
} {
  const [searchParams, setSearchParams] = useSearchParams()
  const [catalog, setCatalog] = useState<CatalogLiteItem[]>([])
  const [tags, setTags] = useState<TagsRegistry>(EMPTY_TAGS)
  const [collections, setCollections] = useState<CatalogCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searching, setSearching] = useState(
    () => Boolean((searchParams.get('q') ?? '').trim()),
  )
  const [searchError, setSearchError] = useState<string | null>(null)
  const [draftQuery, setDraftQuery] = useState(
    () => searchParams.get('q') ?? '',
  )
  const [resolvedSearch, setResolvedSearch] = useState<ResolvedSearch>(() => {
    const q = (searchParams.get('q') ?? '').trim()
    return { query: q, slugs: null, collections: [] }
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [lite, registry, collectionsFile] = await Promise.all([
          fetchCatalogLite(),
          fetchTagsRegistry(),
          fetchCollectionsRegistry(),
        ])
        if (cancelled) return
        setCatalog(lite)
        setTags(registry)
        setCollections(collectionsFile.collections)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : String(err))
        setCatalog([])
        setTags(EMPTY_TAGS)
        setCollections([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const allowedKinds = parseKindsAllowlist(searchParams)
  const allowedKindsKey = allowedKinds.join(',')
  const rawFilters = readFilters(searchParams)
  const committed: CatalogFilters = {
    ...rawFilters,
    kind: coerceKindFilter(rawFilters.kind, allowedKinds),
  }
  const query = committed.q.trim()
  const collectionId = readBrowseId(searchParams.get('collection'))
  const subcollectionId = readBrowseId(searchParams.get('subcollection'))

  useEffect(() => {
    setDraftQuery(committed.q)
  }, [committed.q])

  useEffect(() => {
    if (draftQuery === committed.q) return

    if (!draftQuery.trim()) {
      setSearchParams(
        (prev) => {
          const allowed = parseKindsAllowlist(prev)
          return writeFilters(
            prev,
            {
              ...readFilters(prev),
              kind: coerceKindFilter(readFilters(prev).kind, allowed),
              q: '',
            },
            allowed,
          )
        },
        { replace: true },
      )
      return
    }

    const timer = window.setTimeout(() => {
      setSearchParams(
        (prev) => {
          const allowed = parseKindsAllowlist(prev)
          return writeFilters(
            prev,
            {
              ...readFilters(prev),
              kind: coerceKindFilter(readFilters(prev).kind, allowed),
              q: draftQuery,
            },
            allowed,
          )
        },
        { replace: true },
      )
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [draftQuery, committed.q, setSearchParams])

  useEffect(() => {
    let cancelled = false
    const kinds = allowedKindsKey.split(',') as ResourceKind[]

    async function runSearch() {
      if (!query) {
        setResolvedSearch({ query: '', slugs: null, collections: [] })
        setSearching(false)
        setSearchError(null)
        return
      }

      setSearching(true)
      setSearchError(null)
      try {
        const hits = await searchPagefind(query)
        if (cancelled) return
        setResolvedSearch({
          query,
          slugs: new Set(
            hits.resources
              .filter((hit) => kinds.includes(hit.kind))
              .map((hit) => hit.slug),
          ),
          collections: hits.collections,
        })
      } catch (err) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : String(err)
        console.error(err)
        setSearchError(message)
        setResolvedSearch({ query, slugs: new Set(), collections: [] })
      } finally {
        if (!cancelled) setSearching(false)
      }
    }

    void runSearch()
    return () => {
      cancelled = true
    }
  }, [query, allowedKindsKey])

  const scopedCatalog = catalog.filter((item) =>
    allowedKinds.includes(item.kind),
  )
  const items = filterCatalog(
    scopedCatalog,
    { ...committed, q: resolvedSearch.query },
    allowedKinds,
    resolvedSearch.slugs,
  )
  const filters: CatalogFilters = { ...committed, q: draftQuery }

  function update(patch: Partial<CatalogFilters>) {
    setSearchParams(
      (prev) => {
        const allowed = parseKindsAllowlist(prev)
        return writeFilters(
          prev,
          {
            ...readFilters(prev),
            kind: coerceKindFilter(readFilters(prev).kind, allowed),
            ...patch,
          },
          allowed,
        )
      },
      { replace: true },
    )
  }

  return {
    allItems: scopedCatalog,
    items,
    tags,
    collections,
    filters,
    allowedKinds,
    title: catalogTitle(committed, allowedKinds),
    hasFilters: hasActiveFilters(filters, allowedKinds),
    loading,
    searching,
    searchError,
    error,
    collectionId,
    subcollectionId,
    resolvedQuery: resolvedSearch.query,
    searchSlugs: resolvedSearch.slugs,
    collectionHits: resolvedSearch.collections,
    setKind: (kind) => {
      if (allowedKinds.length === 1) return
      if (kind !== 'all' && !allowedKinds.includes(kind)) return
      setSearchParams(
        (prev) => {
          const allowed = parseKindsAllowlist(prev)
          const next = writeFilters(
            clearCollectionParams(prev),
            {
              ...readFilters(prev),
              kind: coerceKindFilter(kind, allowed),
            },
            allowed,
          )
          return next
        },
        { replace: true },
      )
    },
    setQuery: (q) => {
      setDraftQuery(q)
    },
    setGroupTag: (groupTagIds, tagId) => {
      const group = new Set(groupTagIds)
      const rest = committed.tags.filter((id) => !group.has(id))
      update({ tags: tagId ? [...rest, tagId] : rest })
    },
    removeTag: (tagId) => {
      update({ tags: committed.tags.filter((id) => id !== tagId) })
    },
    openCollection: (id, childId) => {
      // Clear `q` in the same URL write. Draft follows `committed.q` so it
      // does not schedule a second search-param update that drops `collection`.
      setSearchParams(
        (prev) => browseCollectionParams(prev, id, childId),
        { replace: true },
      )
    },
    clearCollection: () => {
      setSearchParams((prev) => clearCollectionParams(prev), { replace: true })
    },
    clearFilters: () => {
      setDraftQuery('')
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.delete('kind')
          next.delete('q')
          next.delete('tag')
          return next
        },
        { replace: true },
      )
    },
    prepareSearch: () => {
      void ensurePagefind().catch((err) => {
        console.error(err)
      })
    },
  }
}

export type { CatalogFilters, KindFilter }
