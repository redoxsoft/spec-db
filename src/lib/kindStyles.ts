import { Box, FileText, Layout, Workflow, type LucideIcon } from 'lucide-react'
import type { ResourceKind } from '../catalog'

export type KindStyles = {
  icon: LucideIcon
  color: string
  bg: string
  border: string
  badge: string
  importTarget: string
  label: string
}

const KIND_STYLES: Record<ResourceKind, KindStyles> = {
  template: {
    icon: Layout,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    badge: 'bg-amber-100 text-amber-800',
    importTarget: 'SpecX',
    label: 'Template',
  },
  spec: {
    icon: FileText,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    badge: 'bg-sky-100 text-sky-700',
    importTarget: 'SpecX',
    label: 'Spec',
  },
  pipeline: {
    icon: Workflow,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    badge: 'bg-emerald-100 text-emerald-700',
    importTarget: 'WorkX',
    label: 'Pipeline',
  },
}

const FALLBACK: KindStyles = {
  icon: Box,
  color: 'text-gray-600',
  bg: 'bg-gray-50',
  border: 'border-gray-100',
  badge: 'bg-gray-100 text-gray-700',
  importTarget: 'Workspace',
  label: 'Resource',
}

export function getKindStyles(kind: ResourceKind | string): KindStyles {
  if (kind in KIND_STYLES) return KIND_STYLES[kind as ResourceKind]
  return FALLBACK
}
