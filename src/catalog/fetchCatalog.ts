import { catalogLiteUrl, resourceDetailUrl, tagsUrl } from './urls'
import type { CatalogLiteItem, ResourceDetail, TagsRegistry } from './types'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to load ${url} (${response.status})`)
  }
  return (await response.json()) as T
}

export function fetchCatalogLite(): Promise<CatalogLiteItem[]> {
  return fetchJson<CatalogLiteItem[]>(catalogLiteUrl())
}

export function fetchTagsRegistry(): Promise<TagsRegistry> {
  return fetchJson<TagsRegistry>(tagsUrl())
}

export function fetchResourceDetail(slug: string): Promise<ResourceDetail> {
  return fetchJson<ResourceDetail>(resourceDetailUrl(slug))
}
