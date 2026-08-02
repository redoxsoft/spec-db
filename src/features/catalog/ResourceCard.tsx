import { MoreVertical, Star } from 'lucide-react'
import { cn } from '../../lib/cn'
import { getKindStyles } from '../../lib/kindStyles'
import type { CatalogLiteItem } from '../../catalog'

type ResourceCardProps = {
  item: CatalogLiteItem
  onSelect: (slug: string) => void
}

function formatUpdated(date: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

function TemplateOutline({ outline }: { outline: string[] }) {
  const visible = outline.slice(0, 4)
  const remaining = outline.length - visible.length

  return (
    <div className="mt-auto border-t border-gray-50 pt-4">
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

export function ResourceCard({ item, onSelect }: ResourceCardProps) {
  const styles = getKindStyles(item.kind)
  const Icon = styles.icon

  return (
    <button
      type="button"
      onClick={() => onSelect(item.slug)}
      className="flex h-full w-full cursor-pointer flex-col rounded-2xl border border-ui-border bg-ui-card p-6 text-left shadow-card transition-all duration-200 hover:shadow-card-hover"
    >
      <div className="mb-4 flex items-start justify-between">
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
        <div className="flex items-center gap-1">
          {item.featured ? (
            <span
              className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-[10px] font-semibold tracking-wide text-amber-700 uppercase"
              title="Featured"
            >
              <Star className="h-3 w-3 fill-current" aria-hidden />
              Featured
            </span>
          ) : null}
          <span className="p-1 text-gray-400">
            <MoreVertical className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </div>

      <h3 className="mb-2 text-lg leading-tight font-semibold text-gray-900">
        {item.title}
      </h3>

      {item.kind === 'template' && item.outline ? (
        <>
          <p className="mb-6 flex-1 text-sm text-gray-500">{item.summary}</p>
          <TemplateOutline outline={item.outline} />
        </>
      ) : null}

      {item.kind === 'spec' ? (
        <p className="mb-6 line-clamp-4 flex-1 text-sm leading-relaxed text-gray-500 italic">
          {item.summary}
        </p>
      ) : null}

      {item.kind === 'pipeline' ? (
        <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-500">
          {item.summary}
        </p>
      ) : null}

      <div className="mt-auto flex items-center justify-between pt-5 text-xs font-medium text-gray-400">
        <span>{item.stats}</span>
        <span>Updated {formatUpdated(item.updatedAt)}</span>
      </div>
    </button>
  )
}
