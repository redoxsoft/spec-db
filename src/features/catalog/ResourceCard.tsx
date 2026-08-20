import { Star } from 'lucide-react'
import type { CatalogLiteItem } from '../../catalog'
import { cn } from '../../lib/cn'
import { getKindStyles } from '../../lib/kindStyles'
import { ProseHtml } from '../detail/ProseHtml'

type ResourceCardProps = {
  item: CatalogLiteItem
  onSelect: (slug: string) => void
  activeCollections?: readonly string[]
  onAddCollection?: (id: string) => void
  /** Embed multi-select: show checkbox and selected chrome. */
  selectionEnabled?: boolean
  selected?: boolean
  onToggleSelected?: () => void
}

function CardSummary({ item }: { item: CatalogLiteItem }) {
  if (item.summaryHtml) {
    return (
      <ProseHtml
        className="text-gray-500 [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
        html={item.summaryHtml}
      />
    )
  }

  return (
    <p className="text-sm leading-relaxed text-gray-500">{item.summary}</p>
  )
}

function TemplateOutline({ outline }: { outline: string[] }) {
  const visible = outline.slice(0, 4)
  const remaining = outline.length - visible.length

  return (
    <div className="shrink-0 border-t border-gray-50 pt-4">
      <h4 className="mb-3 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
        Outline
      </h4>
      <div className="space-y-2">
        {visible.map((node) => (
          <div
            key={node}
            className="flex items-center gap-2 text-xs text-gray-600"
          >
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
            <span className="truncate">{node}</span>
          </div>
        ))}
        {remaining > 0 ? (
          <div className="flex items-center gap-2 text-xs text-gray-400 italic">
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-200" />
            +{remaining} more sections
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function ResourceCard({
  item,
  onSelect,
  activeCollections = [],
  onAddCollection,
  selectionEnabled = false,
  selected = false,
  onToggleSelected,
}: ResourceCardProps) {
  const styles = getKindStyles(item.kind)
  const Icon = styles.icon
  const collections = item.collections?.slice(0, 2) ?? []

  return (
    <div
      className={cn(
        'relative flex h-full min-h-80 w-full flex-col rounded-2xl border bg-ui-card shadow-card transition-all duration-200',
        selected
          ? 'border-brand-500 ring-2 ring-brand-100'
          : 'border-ui-border hover:shadow-card-hover',
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(item.slug)}
        className="flex min-h-0 flex-1 cursor-pointer flex-col gap-4 p-6 pb-0 text-left"
      >
        <div className="flex shrink-0 items-center gap-3">
          <div className="relative shrink-0">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm',
                styles.bg,
                styles.color,
                styles.border,
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            {item.featured ? (
              <span
                className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-100 text-amber-600 ring-2 ring-white"
                title="Featured"
              >
                <Star className="h-2.5 w-2.5 fill-current" aria-hidden />
              </span>
            ) : null}
          </div>

          <h3 className="min-w-0 flex-1 line-clamp-2 text-lg leading-tight font-semibold text-gray-900">
            {item.title}
          </h3>

          {selectionEnabled ? (
            <label
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md"
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() => onToggleSelected?.()}
                aria-label={`Select ${item.title}`}
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
            </label>
          ) : null}
        </div>

        <CardSummary item={item} />
        {item.kind === 'template' && item.outline ? (
          <TemplateOutline outline={item.outline} />
        ) : null}
      </button>

      <div className="mt-auto flex items-center justify-between gap-3 px-6 pt-3 pb-5 text-xs font-medium text-gray-400">
        <span className="shrink-0">{item.stats}</span>
        {collections.length > 0 ? (
          <div className="flex min-w-0 flex-wrap justify-end gap-1.5">
            {collections.map((id) => {
              const active = activeCollections.includes(id)
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onAddCollection?.(id)}
                  className={cn(
                    'inline-flex max-w-full truncate rounded-md px-2 py-1 text-[11px] font-medium transition-colors',
                    active
                      ? 'bg-brand-600 text-white hover:bg-brand-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800',
                  )}
                  title={`Filter by ${id}`}
                >
                  {id}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}
