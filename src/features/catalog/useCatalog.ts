import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { parseKindsAllowlist } from '../../app/runtimeParams'
import {
  fetchCatalogLite,
  fetchTagsRegistry,
  type CatalogLiteItem,
  type ResourceKind,
  type TagsRegistry,
} from '../../catalog'
import { ensurePagefind, searchPagefind } from '../search/pagefindClient'
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
    collections: params.getAll('collection'),
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

  params.delete('collection')
  for (const id of next.collections) params.append('collection', id)

  return params
}

/** Loads generated catalog-lite + tags; text search via Pagefind. */
export function useCatalog(): {
  allItems: CatalogLiteItem[]
  items: CatalogLiteItem[]
  tags: TagsRegistry
  filters: CatalogFilters
  allowedKinds: ResourceKind[]
  title: string
  hasFilters: boolean
  loading: boolean
  searching: boolean
  searchError: string | null
  error: string | null
  setKind: (kind: KindFilter) => void
  setQuery: (q: string) => void
  toggleTag: (tagId: string) => void
  removeTag: (tagId: string) => void
  addCollection: (id: string) => void
  removeCollection: (id: string) => void
  clearFilters: () => void
  prepareSearch: () => void
} {
  const [searchParams, setSearchParams] = useSearchParams()
  const [catalog, setCatalog] = useState<CatalogLiteItem[]>([])
  const [tags, setTags] = useState<TagsRegistry>(EMPTY_TAGS)
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
    // null slugs + non-empty query → waiting for first Pagefind response
    return { query: q, slugs: null }
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [lite, registry] = await Promise.all([
          fetchCatalogLite(),
          fetchTagsRegistry(),
        ])
        if (cancelled) return
        setCatalog(lite)
        setTags(registry)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : String(err))
        setCatalog([])
        setTags(EMPTY_TAGS)
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

  // Keep draft in sync when URL is cleared/changed externally (chips, clear all, back/forward).
  useEffect(() => {
    setDraftQuery(committed.q)
  }, [committed.q])

  // Debounce writing the search box into the URL (Pagefind runs off the URL query).
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
        setResolvedSearch({ query: '', slugs: null })
        setSearching(false)
        setSearchError(null)
        return
      }

      // Keep previous resolvedSearch visible until this fetch finishes.
      setSearching(true)
      setSearchError(null)
      try {
        const hits = await searchPagefind(query)
        if (cancelled) return
        setResolvedSearch({
          query,
          slugs: new Set(
            hits
              .filter((hit) => kinds.includes(hit.kind))
              .map((hit) => hit.slug),
          ),
        })
      } catch (err) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : String(err)
        console.error(err)
        setSearchError(message)
        setResolvedSearch({ query, slugs: new Set() })
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
  // Apply kind/tags from URL immediately; search filter stays on last resolved result.
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
    filters,
    allowedKinds,
    title: catalogTitle(committed, allowedKinds),
    hasFilters: hasActiveFilters(filters, allowedKinds),
    loading,
    searching,
    searchError,
    error,
    setKind: (kind) => {
      if (allowedKinds.length === 1) return
      if (kind !== 'all' && !allowedKinds.includes(kind)) return
      update({ kind })
    },
    setQuery: (q) => {
      setDraftQuery(q)
    },
    toggleTag: (tagId) => {
      const nextTags = committed.tags.includes(tagId)
        ? committed.tags.filter((id) => id !== tagId)
        : [...committed.tags, tagId]
      update({ tags: nextTags })
    },
    removeTag: (tagId) => {
      update({ tags: committed.tags.filter((id) => id !== tagId) })
    },
    addCollection: (id) => {
      if (committed.collections.includes(id)) return
      update({ collections: [...committed.collections, id] })
    },
    removeCollection: (id) => {
      update({
        collections: committed.collections.filter((c) => c !== id),
      })
    },
    clearFilters: () => {
      setDraftQuery('')
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.delete('kind')
          next.delete('q')
          next.delete('tag')
          next.delete('collection')
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
