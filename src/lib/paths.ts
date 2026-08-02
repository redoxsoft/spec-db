import type { ResourceKind } from '../catalog'

const KIND_FOLDER: Record<ResourceKind, string> = {
  template: 'templates',
  spec: 'specs',
  pipeline: 'pipelines',
}

const DEFAULT_GITHUB_TREE_BASE =
  'https://github.com/redoxsoft/spec-db/tree/main'

/**
 * GitHub tree base (…/tree/main).
 * Override with VITE_GITHUB_TREE_BASE (no trailing slash).
 */
export function githubTreeBase(): string {
  return (
    import.meta.env.VITE_GITHUB_TREE_BASE?.trim() || DEFAULT_GITHUB_TREE_BASE
  ).replace(/\/$/, '')
}

/** Repo root URL derived from the tree base. */
export function githubRepoUrl(): string {
  return githubTreeBase().replace(/\/tree\/[^/]+$/, '')
}

/** Path under the GitHub tree (e.g. docs, CONTRIBUTING.md). */
export function githubTreePath(relativePath: string): string {
  const path = relativePath.replace(/^\//, '')
  return `${githubTreeBase()}/${path}`
}

/** GitHub tree URL for View Source on a catalog resource. */
export function githubResourceUrl(kind: ResourceKind, slug: string): string {
  return githubTreePath(`resources/${KIND_FOLDER[kind]}/${slug}`)
}
