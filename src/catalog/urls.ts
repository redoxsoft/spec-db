const GENERATED_BASE = '/generated'

export function catalogLiteUrl(): string {
  return `${GENERATED_BASE}/catalog-lite.json`
}

export function tagsUrl(): string {
  return `${GENERATED_BASE}/tags.json`
}

export function resourceDetailUrl(slug: string): string {
  return `${GENERATED_BASE}/resources/${encodeURIComponent(slug)}.json`
}
