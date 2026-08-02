import type { TagsRegistry } from './types'

export function getTagLabel(tags: TagsRegistry, tagId: string): string {
  for (const group of Object.values(tags)) {
    const found = group.find((tag) => tag.id === tagId)
    if (found) return found.label
  }
  return tagId
}
