# Tags

Canonical registry: [`tags.json`](./tags.json). Resources may only use tag ids defined here.

## Rules (enforced by `npm run check`)

- Max hierarchy depth **2** (`parentId` chains).
- Resources may only reference tags with `"status": "active"`.
- Tag must list the resource’s kind in `applicableKinds`.
- New tags needed by a catalog resource: add them in the **same** PR. Deprecating a tag: update all affected resources in that PR (no grace period).

## Tag fields

| Field | Description |
|-------|-------------|
| `id` | Stable machine id (e.g. `domain.engineering`) |
| `displayName` | Human label |
| `description` | When to use it |
| `applicableKinds` | Subset of `spec` \| `template` \| `pipeline` |
| `ui` | Presentation hint: `facet`, `category`, `folder`, `badge`, `hidden` |
| `parentId` | Optional parent (depth ≤ 2) |
| `order` | Optional sort weight |
| `status` | `active` \| `deprecated` |

Schema: [`schemas/tags-registry.schema.json`](../schemas/tags-registry.schema.json). Catalog authoring: [CONTRIBUTING.md](../CONTRIBUTING.md).
