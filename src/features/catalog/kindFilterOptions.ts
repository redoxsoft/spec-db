import { Layers, type LucideIcon } from 'lucide-react'
import type { ResourceKind } from '../../catalog'
import { getKindStyles } from '../../lib/kindStyles'
import type { KindFilter } from './filterCatalog'

export type KindFilterOption = {
  id: KindFilter
  label: string
  icon: LucideIcon
  iconClassName: string
}

function kindOption(id: ResourceKind, label: string): KindFilterOption {
  const styles = getKindStyles(id)
  return {
    id,
    label,
    icon: styles.icon,
    iconClassName: styles.color,
  }
}

const KIND_FILTERS: KindFilterOption[] = [
  {
    id: 'all',
    label: 'All Resources',
    icon: Layers,
    iconClassName: 'text-gray-500',
  },
  kindOption('template', 'Templates'),
  kindOption('spec', 'Specs'),
  kindOption('pipeline', 'Pipelines'),
]

export function kindFilterOptions(
  allowedKinds: readonly ResourceKind[],
): KindFilterOption[] {
  return KIND_FILTERS.filter(
    (option) =>
      option.id === 'all' ||
      allowedKinds.includes(option.id as ResourceKind),
  )
}
