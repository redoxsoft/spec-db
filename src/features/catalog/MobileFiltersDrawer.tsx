import { useEffect } from 'react'
import { X } from 'lucide-react'
import {
  CatalogFiltersPanel,
  type CatalogFiltersPanelProps,
} from './CatalogFiltersPanel'

type MobileFiltersDrawerProps = CatalogFiltersPanelProps & {
  open: boolean
  onClose: () => void
}

export function MobileFiltersDrawer({
  open,
  onClose,
  ...panelProps
}: MobileFiltersDrawerProps) {
  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] md:hidden" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        aria-label="Close filters"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-filters-title"
        className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-white shadow-xl"
      >
        <div className="flex flex-none items-center justify-between border-b border-ui-border px-5 py-3">
          <h2
            id="mobile-filters-title"
            className="text-sm font-semibold text-gray-900"
          >
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <CatalogFiltersPanel {...panelProps} />
        </div>
      </div>
    </div>
  )
}
