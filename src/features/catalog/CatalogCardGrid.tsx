import type { CatalogLiteItem } from '../../catalog'
import { ResourceCard } from './ResourceCard'
import { groupCatalogByKind } from './filterCatalog'

type CatalogCardGridProps = {
  items: CatalogLiteItem[]
  grouped: boolean
  searching?: boolean
  onSelect: (slug: string) => void
  selectionEnabled?: boolean
  selectedKeys?: ReadonlySet<string>
  onToggleSelected?: (item: CatalogLiteItem) => void
}

/** Card behavior shared by every grid on a page. */
export type CardGridOptions = Omit<CatalogCardGridProps, 'items' | 'grouped'>

export function CatalogCardGrid({
  items,
  grouped,
  searching = false,
  onSelect,
  selectionEnabled = false,
  selectedKeys,
  onToggleSelected,
}: CatalogCardGridProps) {
  const gridClass = searching
    ? 'grid auto-rows-max grid-cols-1 gap-6 opacity-60 transition-opacity md:grid-cols-2 lg:grid-cols-3'
    : 'grid auto-rows-max grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
  const kindGroups = grouped ? groupCatalogByKind(items) : null

  function renderCard(item: CatalogLiteItem, index: number) {
    const key = `${item.kind}:${item.slug}`
    return (
      <div
        key={item.slug}
        className="catalog-card-enter h-full"
        style={{
          animationDelay: `${Math.min(index, 8) * 40}ms`,
        }}
      >
        <ResourceCard
          item={item}
          onSelect={onSelect}
          selectionEnabled={selectionEnabled}
          selected={selectedKeys?.has(key) ?? false}
          onToggleSelected={() => onToggleSelected?.(item)}
        />
      </div>
    )
  }

  if (kindGroups) {
    return (
      <div key={items.map((item) => item.slug).join('|')} className="space-y-10">
        {kindGroups.map((group) => (
          <section key={group.kind}>
            <h2 className="mb-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
              {group.title}
            </h2>
            <div className={gridClass}>
              {group.items.map((item, index) => renderCard(item, index))}
            </div>
          </section>
        ))}
      </div>
    )
  }

  return (
    <div key={items.map((item) => item.slug).join('|')} className={gridClass}>
      {items.map((item, index) => renderCard(item, index))}
    </div>
  )
}
