import { Info, Layers, Layout, LayoutTemplate } from 'lucide-react'
import { kindsPresetLabel, type KindsPreset } from './runtimeParams'

type DemoBarProps = {
  embed: boolean
  kindsPreset: KindsPreset
  onToggleEmbed: () => void
  onCycleKinds: () => void
}

/** Dev-only bar — flip embed / kinds without rebuild. Hidden when embed=true. */
export function DemoBar({
  embed,
  kindsPreset,
  onToggleEmbed,
  onCycleKinds,
}: DemoBarProps) {
  if (!import.meta.env.DEV || embed) return null

  return (
    <div className="relative z-50 flex flex-none flex-col items-start gap-2 bg-indigo-900 px-4 py-2 text-xs text-white sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2 sm:items-center">
        <Info
          className="mt-0.5 h-4 w-4 shrink-0 text-indigo-300 sm:mt-0"
          aria-hidden
        />
        <span>
          <strong>Prototype Mode:</strong> Toggle embed and host{' '}
          <code className="text-indigo-200">kinds=</code> scope (WorkX /
          SpecX).
        </span>
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <button
          type="button"
          onClick={onCycleKinds}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-indigo-800 px-3 py-1.5 font-medium transition-colors hover:bg-indigo-700 sm:h-auto sm:min-h-0 sm:w-auto"
        >
          <Layers className="h-3 w-3" aria-hidden />
          {kindsPresetLabel(kindsPreset)}
        </button>
        <button
          type="button"
          onClick={onToggleEmbed}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-indigo-700 px-3 py-1.5 font-medium transition-colors hover:bg-indigo-600 sm:h-auto sm:min-h-0 sm:w-auto"
        >
          <LayoutTemplate className="h-3 w-3" aria-hidden />
          Switch to Embed Mode
        </button>
      </div>
    </div>
  )
}

/** Compact DEV controls when already in embed (DemoBar is hidden). */
export function EmbedDevExit({
  kindsPreset,
  onToggleEmbed,
  onCycleKinds,
}: {
  kindsPreset: KindsPreset
  onToggleEmbed: () => void
  onCycleKinds: () => void
}) {
  if (!import.meta.env.DEV) return null

  return (
    <div className="pointer-events-none absolute top-2 right-2 z-[60] flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={onCycleKinds}
        className="pointer-events-auto flex min-h-11 items-center gap-2 rounded-md border border-indigo-200 bg-white/95 px-3 py-1.5 text-xs font-medium text-indigo-900 shadow-sm backdrop-blur transition-colors hover:bg-indigo-50"
      >
        <Layers className="h-3 w-3" aria-hidden />
        {kindsPresetLabel(kindsPreset)}
      </button>
      <button
        type="button"
        onClick={onToggleEmbed}
        className="pointer-events-auto flex min-h-11 items-center gap-2 rounded-md border border-indigo-200 bg-white/95 px-3 py-1.5 text-xs font-medium text-indigo-900 shadow-sm backdrop-blur transition-colors hover:bg-indigo-50"
      >
        <Layout className="h-3 w-3" aria-hidden />
        Switch to Standalone
      </button>
    </div>
  )
}
