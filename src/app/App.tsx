import { useEffect, useMemo, useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useSearchParams,
} from 'react-router-dom'
import type { CatalogLiteItem, ResourceKind } from '../catalog'
import { CatalogMain } from '../features/catalog/CatalogMain'
import { CatalogSidebar } from '../features/catalog/CatalogSidebar'
import { CollectionBrowse } from '../features/catalog/CollectionBrowse'
import { MobileFiltersDrawer } from '../features/catalog/MobileFiltersDrawer'
import { activeTopLevelCollections } from '../features/catalog/collectionPack'
import { useCatalog } from '../features/catalog/useCatalog'
import { DetailModal } from '../features/detail/DetailModal'
import { cn } from '../lib/cn'
import {
  importItemKey,
  type SpecDbImportItem,
} from '../lib/importHandoff'
import { getKindStyles } from '../lib/kindStyles'
import { AppHeader } from './AppHeader'
import { DemoBar, EmbedDevExit } from './DemoBar'
import { useRuntimeChrome } from './useRuntimeChrome'

function batchImportTarget(kinds: ResourceKind[]): string {
  const targets = new Set(kinds.map((kind) => getKindStyles(kind).importTarget))
  if (targets.size === 1) return [...targets][0]!
  return 'host'
}

function CatalogShell() {
  const {
    allItems,
    items,
    tags,
    collections,
    filters,
    allowedKinds,
    title,
    loading,
    searching,
    searchError,
    error,
    collectionId,
    subcollectionId,
    resolvedQuery,
    searchSlugs,
    collectionHits,
    setKind,
    setQuery,
    setGroupTag,
    removeTag,
    openCollection,
    clearFilters,
    prepareSearch,
  } = useCatalog()
  const { embed, kindsPreset, toggleEmbed, cycleKindsPreset } =
    useRuntimeChrome()
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedByKey, setSelectedByKey] = useState<
    Record<string, SpecDbImportItem>
  >({})

  const selectedItems = useMemo(
    () => Object.values(selectedByKey),
    [selectedByKey],
  )
  const selectedKeys = useMemo(
    () => new Set(Object.keys(selectedByKey)),
    [selectedByKey],
  )

  useEffect(() => {
    if (!embed) setSelectedByKey({})
  }, [embed])

  function toggleSelected(item: CatalogLiteItem) {
    const entry: SpecDbImportItem = { kind: item.kind, slug: item.slug }
    const key = importItemKey(entry)
    setSelectedByKey((prev) => {
      if (prev[key]) {
        const next = { ...prev }
        delete next[key]
        return next
      }
      return { ...prev, [key]: entry }
    })
  }

  function clearSelection() {
    setSelectedByKey({})
  }

  const sidebarCollections = activeTopLevelCollections(collections)
  const filterPanelProps = {
    filters,
    allowedKinds,
    collections: sidebarCollections,
    activeCollectionId: collectionId,
    onKindChange: setKind,
    onQueryChange: setQuery,
    onOpenCollection: (id: string) => openCollection(id),
    onSearchFocus: prepareSearch,
  }

  return (
    <div
      className={cn(
        'relative flex h-dvh flex-col overflow-hidden bg-ui-bg font-sans text-gray-900 selection:bg-brand-100 selection:text-brand-700',
        embed && import.meta.env.DEV && 'ring-4 ring-inset ring-indigo-500/20',
      )}
    >
      <DemoBar
        embed={embed}
        kindsPreset={kindsPreset}
        onToggleEmbed={toggleEmbed}
        onCycleKinds={cycleKindsPreset}
      />
      {embed ? (
        <EmbedDevExit
          kindsPreset={kindsPreset}
          onToggleEmbed={toggleEmbed}
          onCycleKinds={cycleKindsPreset}
        />
      ) : null}
      {!embed ? <AppHeader /> : null}
      <main className="flex min-h-0 flex-1 overflow-hidden">
        <CatalogSidebar {...filterPanelProps} />
        {collectionId ? (
          <CollectionBrowse
            collections={collections}
            collectionId={collectionId}
            subcollectionId={subcollectionId}
            catalog={allItems}
            allowedKinds={allowedKinds}
            embed={embed}
            loading={loading}
            searching={searching}
            searchError={searchError}
            error={error}
            resolvedQuery={resolvedQuery}
            searchSlugs={searchSlugs}
            collectionHits={collectionHits}
            filterQuery={filters.q}
            onOpenCollection={openCollection}
            onOpenFilters={() => setFiltersOpen(true)}
            onSelect={setSelectedSlug}
            selectionEnabled={embed}
            selectedKeys={selectedKeys}
            selectedItems={selectedItems}
            batchImportTarget={batchImportTarget(
              selectedItems.map((item) => item.kind),
            )}
            onToggleSelected={toggleSelected}
            onClearSelection={clearSelection}
          />
        ) : (
          <CatalogMain
            title={title}
            items={items}
            filters={filters}
            allowedKinds={allowedKinds}
            tags={tags}
            collections={collections}
            resolvedQuery={resolvedQuery}
            collectionHits={collectionHits}
            loading={loading}
            searching={searching}
            searchError={searchError}
            error={error}
            onSelect={setSelectedSlug}
            onClearKind={() => setKind('all')}
            onClearQuery={() => setQuery('')}
            onOpenCollection={openCollection}
            onRemoveTag={removeTag}
            onSetGroupTag={setGroupTag}
            onClearFilters={clearFilters}
            onOpenFilters={() => setFiltersOpen(true)}
            selectionEnabled={embed}
            selectedKeys={selectedKeys}
            selectedItems={selectedItems}
            batchImportTarget={batchImportTarget(
              selectedItems.map((item) => item.kind),
            )}
            onToggleSelected={toggleSelected}
            onClearSelection={clearSelection}
          />
        )}
      </main>
      <MobileFiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        {...filterPanelProps}
      />
      <DetailModal
        slug={selectedSlug}
        tags={tags}
        onClose={() => setSelectedSlug(null)}
      />
    </div>
  )
}

function RedirectHome() {
  const [params] = useSearchParams()
  const search = params.toString()
  return (
    <Navigate
      to={{ pathname: '/', search: search ? `?${search}` : '' }}
      replace
    />
  )
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CatalogShell />} />
        <Route path="*" element={<RedirectHome />} />
      </Routes>
    </BrowserRouter>
  )
}
