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

/** Kind accents — colors come from `@theme` tokens in `styles/globals.css`. */
const KIND_STYLES: Record<ResourceKind, KindStyles> = {
  template: {
    icon: Layout,
    color: 'text-kind-template-500',
    bg: 'bg-kind-template-50',
    border: 'border-kind-template-100',
    badge: 'bg-kind-template-100 text-kind-template-800',
    importTarget: 'SpecX',
    label: 'Template',
  },
  spec: {
    icon: FileText,
    color: 'text-kind-spec-600',
    bg: 'bg-kind-spec-50',
    border: 'border-kind-spec-100',
    badge: 'bg-kind-spec-100 text-kind-spec-700',
    importTarget: 'SpecX',
    label: 'Spec',
  },
  pipeline: {
    icon: Workflow,
    color: 'text-kind-pipeline-600',
    bg: 'bg-kind-pipeline-50',
    border: 'border-kind-pipeline-100',
    badge: 'bg-kind-pipeline-100 text-kind-pipeline-700',
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

/** Collection / folder icon color (`--color-kind-folder-500`). */
export const folderIconClassName = 'text-kind-folder-500'
