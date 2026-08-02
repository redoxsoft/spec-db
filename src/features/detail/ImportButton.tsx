import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Check, Download } from 'lucide-react'
import { parseEmbed } from '../../app/runtimeParams'
import type { CatalogItem } from '../../catalog'
import { cn } from '../../lib/cn'
import { requestImport } from '../../lib/importHandoff'

type ImportButtonProps = {
  item: CatalogItem
  importTarget: string
  onImported?: () => void
}

/**
 * Import → embed: postMessage to host; standalone: open host import URL.
 */
export function ImportButton({
  item,
  importTarget,
  onImported,
}: ImportButtonProps) {
  const [searchParams] = useSearchParams()
  const embed = parseEmbed(searchParams)
  const [imported, setImported] = useState(false)

  useEffect(() => {
    setImported(false)
  }, [item.slug])

  function handleClick() {
    if (imported) return

    const result = requestImport({
      kind: item.kind,
      slug: item.slug,
      embed,
    })

    if (import.meta.env.DEV) {
      console.info('[spec-db] Import handoff', result)
    }

    setImported(true)

    window.setTimeout(() => {
      onImported?.()
    }, 1200)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={imported}
      className={cn(
        'flex min-h-11 items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors',
        imported
          ? 'bg-green-600 hover:bg-green-700'
          : 'bg-brand-600 hover:bg-brand-700',
      )}
    >
      {imported ? (
        <Check className="h-4 w-4" aria-hidden />
      ) : (
        <Download className="h-4 w-4" aria-hidden />
      )}
      {imported ? 'Imported!' : `Import to ${importTarget}`}
    </button>
  )
}
