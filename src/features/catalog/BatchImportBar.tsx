import { useEffect, useState } from 'react'
import { Check, Download, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  requestImportBatch,
  type SpecDbImportItem,
} from '../../lib/importHandoff'

type BatchImportBarProps = {
  items: SpecDbImportItem[]
  importTarget: string
  onClear: () => void
  onSent: () => void
}

/**
 * Embed-only multi-select Import (N). Fire-and-forget local ack — does not
 * wait for host batch-progress / batch-completed.
 */
export function BatchImportBar({
  items,
  importTarget,
  onClear,
  onSent,
}: BatchImportBarProps) {
  const [sent, setSent] = useState(false)
  const count = items.length

  useEffect(() => {
    setSent(false)
  }, [count])

  if (count === 0) return null

  function handleImport() {
    if (sent) return

    const result = requestImportBatch({ items, embed: true })

    if (import.meta.env.DEV) {
      console.info('[spec-db] Batch import handoff', result)
    }

    setSent(true)
    window.setTimeout(() => {
      onSent()
    }, 1200)
  }

  return (
    <div
      className="sticky bottom-0 z-10 -mx-6 mt-auto border-t border-ui-border bg-ui-bg/95 px-6 py-3 backdrop-blur md:-mx-8 md:px-8 lg:-mx-10 lg:px-10"
      role="region"
      aria-label="Batch import"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <p className="text-sm font-medium text-gray-900">
            {count} selected
          </p>
          <button
            type="button"
            onClick={onClear}
            disabled={sent}
            className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm text-gray-500 transition-colors hover:text-gray-800 disabled:opacity-50"
          >
            <X className="h-4 w-4" aria-hidden />
            Clear
          </button>
        </div>
        <button
          type="button"
          onClick={handleImport}
          disabled={sent}
          className={cn(
            'flex min-h-11 items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors',
            sent
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-brand-600 hover:bg-brand-700',
          )}
        >
          {sent ? (
            <Check className="h-4 w-4" aria-hidden />
          ) : (
            <Download className="h-4 w-4" aria-hidden />
          )}
          {sent
            ? 'Sent!'
            : `Import (${count}) to ${importTarget}`}
        </button>
      </div>
    </div>
  )
}
