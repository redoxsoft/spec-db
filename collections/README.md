# Collections

Canonical registry: [`collections.json`](./collections.json). A resource has at most one collection and one sub-collection, both optional ids from this file.

`displayName` is the catalog label **and** the workspace folder name hosts create on import. There is no separate folder name. **After this registry is merged, `displayName` is immutable.** Do not rename it in a copy edit. A rename is a migration (a new id, or a one-off content and docs change). `description` and `order` stay editable. `id` is the stable catalog identity and does not change.

## Rules (enforced by `npm run check`)

- Hierarchy depth is **2**: a top-level collection (`parentId` omitted or `null`) and an optional child. No grandchildren.
- Ids are unique kebab-case.
- `displayName` is unique among siblings, compared case-insensitively: among top-level collections, and among children of the same parent. The same label under different parents is allowed.
- `subcollection` requires `collection`.
- `collection` must be a top-level id. `subcollection`'s `parentId` must be that collection.
- New or updated resources may only reference ids with `"status": "active"`. Unknown, deprecated, or wrong-parent ids fail the check.
- A new collection a resource needs is added in the **same** PR. Do not invent sub-collections unless a content change adds them here explicitly.

## Collection fields

| Field | Description |
|-------|-------------|
| `id` | Stable kebab-case id (e.g. `agile-sdlc`) |
| `displayName` | Catalog label and workspace folder name. Immutable after merge |
| `description` | Collection page copy (editable) |
| `parentId` | Omitted or `null` for a top-level collection. A sub-collection points at a top-level id |
| `order` | Sidebar and sub-folder sort (editable) |
| `status` | `active` \| `deprecated` |

Schema: [`schemas/collections-registry.schema.json`](../schemas/collections-registry.schema.json). Resource fields: [CONTRIBUTING.md](../CONTRIBUTING.md).
