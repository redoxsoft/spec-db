import type { ResourceKind } from '../catalog'

const KIND_FOLDER: Record<ResourceKind, string> = {
  template: 'templates',
  spec: 'specs',
  pipeline: 'pipelines',
}

/**
 * GitHub tree URL for View Source.
 * Override with VITE_GITHUB_TREE_BASE (…/tree/main, no trailing slash).
 */
export function githubResourceUrl(kind: ResourceKind, slug: string): string {
  const base =
    import.meta.env.VITE_GITHUB_TREE_BASE?.trim() ||
    'https://github.com/redoxsoft/spec-db/tree/main'
  return `${base.replace(/\/$/, '')}/resources/${KIND_FOLDER[kind]}/${slug}`
}
