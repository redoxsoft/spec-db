import { useEffect, useState } from 'react'
import { LoaderCircle, SearchX, SlidersHorizontal } from 'lucide-react'
import type {
  CatalogCollection,
  CatalogLiteItem,
  ResourceKind,
} from '../../catalog'
import {
  requestImportCollection,
  type SpecDbImportItem,
} from '../../lib/importHandoff'
import { BatchImportBar } from './BatchImportBar'
import { CatalogCardGrid, type CardGridOptions } from './CatalogCardGrid'
import { CollectionFolderSections } from './CollectionFolderSections'
import { CollectionKindTabs } from './CollectionKindTabs'
import { CollectionLink } from './CollectionLink'
import { CollectionPackCta } from './CollectionPackCta'
import { CollectionSearchHits } from './CollectionSearchHits'
import {
  CollectionViewToggle,
  type CollectionView,
} from './CollectionViewToggle'
import {
  activeChildFolders,
  collectionSearchTargets,
  groupByFolder,
  importPackItems,
  packCopy,
  resolveCollectionPage,
} from './collectionPack'
import {
  filterCatalog,
  type KindFilter,
} from './filterCatalog'

type CollectionBrowseProps = {
  collections: CatalogCollection[]
  collectionId: string
  subcollectionId: string | null
  catalog: CatalogLiteItem[]
  allowedKinds: ResourceKind[]
  embed: boolean
  loading?: boolean
  searching?: boolean
  searchError?: string | null
  error?: string | null
  /** Pagefind query that `searchSlugs` belongs to. Empty when search is off. */
  resolvedQuery: string
  searchSlugs: Set<string> | null
  collectionHits: readonly { id: string; parentId: string | null }[]
  filterQuery: string
  onOpenCollection: (id: string, subcollectionId?: string | null) => void
  onOpenFilters: () => void
  onSelect: (slug: string) => void
  selectionEnabled?: boolean
  selectedKeys?: ReadonlySet<string>
  selectedItems?: SpecDbImportItem[]
  batchImportTarget?: string
  onToggleSelected?: (item: CatalogLiteItem) => void
  onClearSelection?: () => void
}

function Unavailable() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-lg font-semibold text-gray-900">
        Collection unavailable
      </h1>
      <p className="mt-1 max-w-sm text-gray-500">
        This collection is missing or no longer published.
      </p>
    </div>
  )
}

export function CollectionBrowse({
  collections,
  collectionId,
  subcollectionId,
  catalog,
  allowedKinds,
  embed,
  loading = false,
  searching = false,
  searchError = null,
  error = null,
  resolvedQuery,
  searchSlugs,
  collectionHits,
  filterQuery,
  onOpenCollection,
  onOpenFilters,
  onSelect,
  selectionEnabled = false,
  selectedKeys,
  selectedItems = [],
  batchImportTarget = 'Workspace',
  onToggleSelected,
  onClearSelection,
}: CollectionBrowseProps) {
  const [localKind, setLocalKind] = useState<KindFilter>('all')
  const [view, setView] = useState<CollectionView>('folders')

  useEffect(() => {
    setLocalKind('all')
  }, [collectionId, subcollectionId])

  const filterCount = filterQuery.trim() ? 1 : 0
  const page = resolveCollectionPage(
    collections,
    collectionId,
    subcollectionId,
  )

  return (
    <section className="relative flex-1 overflow-y-auto bg-ui-bg">
      <div className="mx-auto flex min-h-full max-w-6xl flex-col p-6 md:p-8 lg:p-10">
        {loading ? (
          <p className="py-20 text-center text-sm text-gray-500">
            Loading catalog…
          </p>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Catalog unavailable
            </h3>
            <p className="mt-1 max-w-sm text-gray-500">{error}</p>
          </div>
        ) : page.status !== 'ready' ? (
          <Unavailable />
        ) : (
          <CollectionReady
            page={page}
            catalog={catalog}
            allowedKinds={allowedKinds}
            embed={embed}
            localKind={localKind}
            onLocalKind={setLocalKind}
            view={view}
            onView={setView}
            searching={searching}
            searchError={searchError}
            resolvedQuery={resolvedQuery}
            searchSlugs={searchSlugs}
            collectionHits={collectionHits}
            collections={collections}
            filterCount={filterCount}
            onOpenCollection={onOpenCollection}
            onOpenFilters={onOpenFilters}
            onSelect={onSelect}
            selectionEnabled={selectionEnabled}
            selectedKeys={selectedKeys}
            onToggleSelected={onToggleSelected}
          />
        )}

        {selectionEnabled && onClearSelection ? (
          <BatchImportBar
            items={selectedItems}
            importTarget={batchImportTarget}
            onClear={onClearSelection}
            onSent={onClearSelection}
          />
        ) : null}
      </div>
    </section>
  )
}

function CollectionReady({
  page,
  catalog,
  collections,
  allowedKinds,
  embed,
  localKind,
  onLocalKind,
  view,
  onView,
  searching,
  searchError,
  resolvedQuery,
  searchSlugs,
  collectionHits,
  filterCount,
  onOpenCollection,
  onOpenFilters,
  onSelect,
  selectionEnabled,
  selectedKeys,
  onToggleSelected,
}: {
  page: Extract<ReturnType<typeof resolveCollectionPage>, { status: 'ready' }>
  catalog: CatalogLiteItem[]
  collections: CatalogCollection[]
  allowedKinds: ResourceKind[]
  embed: boolean
  localKind: KindFilter
  onLocalKind: (kind: KindFilter) => void
  view: CollectionView
  onView: (view: CollectionView) => void
  searching: boolean
  searchError: string | null
  resolvedQuery: string
  searchSlugs: Set<string> | null
  collectionHits: readonly { id: string; parentId: string | null }[]
  filterCount: number
  onOpenCollection: (id: string, subcollectionId?: string | null) => void
  onOpenFilters: () => void
  onSelect: (slug: string) => void
  selectionEnabled: boolean
  selectedKeys?: ReadonlySet<string>
  onToggleSelected?: (item: CatalogLiteItem) => void
}) {
  const current = page.subcollection ?? page.collection
  const scopedId = page.subcollection?.id ?? null
  // Full allowlisted membership. Local tabs and search must not shrink this.
  const pack = importPackItems(
    catalog,
    page.collection.id,
    scopedId,
    allowedKinds,
  )
  const copy = packCopy({
    catalog,
    collectionId: page.collection.id,
    subcollectionId: scopedId,
    displayName: current.displayName,
    allowedKinds,
  })
  const folders = page.subcollection
    ? []
    : activeChildFolders(
        collections,
        page.collection.id,
        catalog,
        allowedKinds,
      )
  const visible = filterCatalog(
    pack,
    { kind: localKind, q: resolvedQuery, tags: [] },
    allowedKinds,
    searchSlugs,
  )
  const showPackCta = embed && copy.count > 0
  const byFolder = folders.length > 0 && view === 'folders'
  const grouped = localKind === 'all' && allowedKinds.length > 1
  const cards: CardGridOptions = {
    searching,
    onSelect,
    selectionEnabled,
    selectedKeys,
    onToggleSelected,
  }
  const hits = resolvedQuery
    ? collectionSearchTargets(collectionHits, collections)
    : []

  function handleImport(force: boolean) {
    if (!showPackCta) return
    const result = requestImportCollection({
      embed: true,
      collectionId: page.collection.id,
      subcollectionId: page.subcollection?.id,
      force,
      items: pack.map((item) => ({ kind: item.kind, slug: item.slug })),
    })
    if (import.meta.env.DEV) {
      console.info('[spec-db] Collection import handoff', result)
    }
  }

  return (
    <>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="min-w-0">
          {page.subcollection ? (
            <CollectionLink
              collectionId={page.collection.id}
              onOpenCollection={onOpenCollection}
              className="text-sm font-medium text-brand-700 hover:text-brand-800"
            >
              {page.collection.displayName}
            </CollectionLink>
          ) : null}
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {current.displayName}
          </h1>
          <p className="mt-2 max-w-2xl text-gray-500">{current.description}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {showPackCta ? (
            <CollectionPackCta copy={copy} onImport={handleImport} />
          ) : null}
          <button
            type="button"
            onClick={onOpenFilters}
            className="relative flex h-11 shrink-0 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Filters
            {filterCount > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[10px] font-bold text-white">
                {filterCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 empty:hidden">
        <CollectionKindTabs
          allowedKinds={allowedKinds}
          kind={localKind}
          onChange={onLocalKind}
        />
        {folders.length > 0 ? (
          <CollectionViewToggle view={view} onChange={onView} />
        ) : null}
      </div>

      {searching ? (
        <div
          className="mb-6 flex items-center gap-2 rounded-lg border border-brand-100 bg-brand-50 px-3 py-2 text-sm text-brand-800"
          role="status"
          aria-live="polite"
        >
          <LoaderCircle className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
          <span>Searching…</span>
        </div>
      ) : null}

      <CollectionSearchHits hits={hits} onOpenCollection={onOpenCollection} />

      {searchError && !searching ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <SearchX className="mb-4 h-8 w-8 text-gray-400" aria-hidden />
          <h3 className="text-lg font-semibold text-gray-900">
            Search unavailable
          </h3>
          <p className="mt-1 max-w-sm text-gray-500">{searchError}</p>
        </div>
      ) : visible.length > 0 ? (
        byFolder ? (
          <CollectionFolderSections
            collectionId={page.collection.id}
            sections={groupByFolder(visible, folders)}
            unit={copy.unit}
            onOpenCollection={onOpenCollection}
            cards={cards}
          />
        ) : (
          <CatalogCardGrid items={visible} grouped={grouped} {...cards} />
        )
      ) : searching ? null : resolvedQuery ? (
        <p className="py-10 text-center text-sm text-gray-500">
          No resources match your search.
        </p>
      ) : localKind !== 'all' ? (
        <p className="py-10 text-center text-sm text-gray-500">
          No resources in this tab.
        </p>
      ) : (
        <p className="py-10 text-center text-sm text-gray-500">
          No resources in this collection.
        </p>
      )}
    </>
  )
}
