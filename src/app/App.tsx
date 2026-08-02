import { useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useSearchParams,
} from 'react-router-dom'
import { CatalogMain } from '../features/catalog/CatalogMain'
import { CatalogSidebar } from '../features/catalog/CatalogSidebar'
import { MobileFiltersDrawer } from '../features/catalog/MobileFiltersDrawer'
import { useCatalog } from '../features/catalog/useCatalog'
import { DetailModal } from '../features/detail/DetailModal'
import { cn } from '../lib/cn'
import { AppHeader } from './AppHeader'
import { DemoBar, EmbedDevExit } from './DemoBar'
import { useRuntimeChrome } from './useRuntimeChrome'

function CatalogShell() {
  const {
    items,
    tags,
    filters,
    allowedKinds,
    title,
    loading,
    searching,
    searchError,
    error,
    setKind,
    setQuery,
    toggleTag,
    removeTag,
    clearFilters,
    prepareSearch,
  } = useCatalog()
  const { embed, kindsPreset, toggleEmbed, cycleKindsPreset } =
    useRuntimeChrome()
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filterPanelProps = {
    tags,
    filters,
    allowedKinds,
    onKindChange: setKind,
    onQueryChange: setQuery,
    onToggleTag: toggleTag,
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
        <CatalogMain
          title={title}
          items={items}
          filters={filters}
          allowedKinds={allowedKinds}
          tags={tags}
          loading={loading}
          searching={searching}
          searchError={searchError}
          error={error}
          onSelect={setSelectedSlug}
          onClearKind={() => setKind('all')}
          onClearQuery={() => setQuery('')}
          onRemoveTag={removeTag}
          onClearFilters={clearFilters}
          onOpenFilters={() => setFiltersOpen(true)}
        />
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
