import { useSearchParams } from 'react-router-dom'
import type { ResourceKind } from '../catalog'
import {
  allowlistFromKindsPreset,
  kindsPresetFromAllowlist,
  nextKindsPreset,
  parseEmbed,
  parseKindsAllowlist,
  writeKindsAllowlist,
  type KindsPreset,
} from './runtimeParams'

/** URL-driven embed chrome + host kinds allowlist. */
export function useRuntimeChrome(): {
  embed: boolean
  allowedKinds: ResourceKind[]
  kindsPreset: KindsPreset
  toggleEmbed: () => void
  cycleKindsPreset: () => void
} {
  const [searchParams, setSearchParams] = useSearchParams()
  const embed = parseEmbed(searchParams)
  const allowedKinds = parseKindsAllowlist(searchParams)
  const kindsPreset = kindsPresetFromAllowlist(allowedKinds)

  return {
    embed,
    allowedKinds,
    kindsPreset,
    toggleEmbed: () => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (parseEmbed(next)) next.delete('embed')
          else next.set('embed', 'true')
          return next
        },
        { replace: true },
      )
    },
    cycleKindsPreset: () => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          const current = kindsPresetFromAllowlist(parseKindsAllowlist(next))
          const allowed = allowlistFromKindsPreset(nextKindsPreset(current))
          writeKindsAllowlist(next, allowed)
          // Drop user kind filter when allowlist shrinks / changes
          next.delete('kind')
          return next
        },
        { replace: true },
      )
    },
  }
}
