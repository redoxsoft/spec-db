import {
  CatalogFiltersPanel,
  type CatalogFiltersPanelProps,
} from './CatalogFiltersPanel'

export function CatalogSidebar(props: CatalogFiltersPanelProps) {
  return (
    <aside className="hidden h-full w-64 flex-none flex-col overflow-y-auto border-r border-ui-border bg-white md:flex">
      <CatalogFiltersPanel {...props} />
    </aside>
  )
}
