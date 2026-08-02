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
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    badge: 'bg-indigo-100 text-indigo-700',
    importTarget: 'SpecX',
    label: 'Template',
  },
  spec: {
    icon: FileText,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    badge: 'bg-blue-100 text-blue-700',
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
