import { useEffect, useId, useState } from 'react'
import { Download } from 'lucide-react'
import type { PackCopy } from './collectionPack'

type CollectionPackCtaProps = {
  copy: PackCopy
  onImport: (force: boolean) => void
}

/** Embed-only. Callers hide this when the allowlisted pack is empty or standalone. */
export function CollectionPackCta({ copy, onImport }: CollectionPackCtaProps) {
  const [open, setOpen] = useState(false)
  const [overwrite, setOverwrite] = useState(true)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (open) setOverwrite(true)
  }, [open])

  function confirm() {
    setOpen(false)
    onImport(overwrite)
  }

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
      >
        <Download className="h-4 w-4 shrink-0" aria-hidden />
        {copy.buttonLabel}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
          >
            <h2 id={titleId} className="text-lg font-semibold text-gray-900">
              Import {copy.displayName}
            </h2>
            <p id={descriptionId} className="mt-2 text-sm text-gray-600">
              {copy.helper}
            </p>
            <label className="mt-4 flex items-start gap-3 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={overwrite}
                onChange={(event) => setOverwrite(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <span>Overwrite copies already in this workspace</span>
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-10 items-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirm}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-brand-600 px-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <Download className="h-4 w-4 shrink-0" aria-hidden />
                {copy.buttonLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
