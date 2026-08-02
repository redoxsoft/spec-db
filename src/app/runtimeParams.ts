import type { ResourceKind } from '../catalog'
import { ALL_RESOURCE_KINDS } from '../lib/resourceKinds'

export { ALL_RESOURCE_KINDS }

export function parseEmbed(params: URLSearchParams): boolean {
  const value = params.get('embed')
  return value === 'true' || value === '1'
}

/** Host allowlist from `?kinds=pipeline` or `?kinds=spec,template`. Default = all. */
export function parseKindsAllowlist(params: URLSearchParams): ResourceKind[] {
  const raw = params.get('kinds')
  if (!raw?.trim()) return [...ALL_RESOURCE_KINDS]

  const allowed: ResourceKind[] = []
  for (const part of raw.split(',')) {
    const kind = part.trim() as ResourceKind
    if (ALL_RESOURCE_KINDS.includes(kind) && !allowed.includes(kind)) {
      allowed.push(kind)
    }
  }

  return allowed.length > 0 ? allowed : [...ALL_RESOURCE_KINDS]
}

export function writeKindsAllowlist(
  params: URLSearchParams,
  allowed: ResourceKind[],
): void {
  const all =
    allowed.length === ALL_RESOURCE_KINDS.length &&
    ALL_RESOURCE_KINDS.every((kind) => allowed.includes(kind))

  if (all || allowed.length === 0) params.delete('kinds')
  else params.set('kinds', allowed.join(','))
}

/** DEV preset labels for cycling host scopes. */
export type KindsPreset = 'all' | 'pipeline' | 'spec-template'

export function kindsPresetFromAllowlist(allowed: ResourceKind[]): KindsPreset {
  if (allowed.length === 1 && allowed[0] === 'pipeline') return 'pipeline'
  if (
    allowed.length === 2 &&
    allowed.includes('spec') &&
    allowed.includes('template')
  ) {
    return 'spec-template'
  }
  return 'all'
}

export function allowlistFromKindsPreset(preset: KindsPreset): ResourceKind[] {
  if (preset === 'pipeline') return ['pipeline']
  if (preset === 'spec-template') return ['spec', 'template']
  return [...ALL_RESOURCE_KINDS]
}

export function nextKindsPreset(current: KindsPreset): KindsPreset {
  if (current === 'all') return 'pipeline'
  if (current === 'pipeline') return 'spec-template'
  return 'all'
}

export function kindsPresetLabel(preset: KindsPreset): string {
  if (preset === 'pipeline') return 'Kinds: Pipelines (WorkX)'
  if (preset === 'spec-template') return 'Kinds: Specs + Templates (SpecX)'
  return 'Kinds: All'
}
