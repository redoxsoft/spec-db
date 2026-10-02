# Spec DB collections as workspace folders

**Status:** Draft  
**Date:** 2026-09-22  
**Product intent:** Importing a collection creates the workspace folders **needed for the files this host actually imports**, and places those files there. Tags filter; collections place.

Related: `docs/embed.md` (current identity-only import), `docs/multi-import-plan.md` (current per-item batch), `redoxsoft-common-be/folders-design.md` (workspace folder tree).

---

## 1. Requirements

### 1.1 Problem

Spec DB today is a flat, tag-heavy catalog. Collections are optional free-form chips (`collections: string[]`, max 2, no registry). Import is identity-only (`kind` + `slug`). Hosts create resources at workspace root (`folderId: null`).

Workspaces now have a real folder tree (owned by `redoxsoft-common-be`). SpecX documents, SpecX local templates, and WorkX pipelines can sit in the same tree. The catalog does not map onto that tree, so “import this pack” does not produce a pack-shaped workspace.

### 1.2 Goals

1. A Spec DB **collection** is a **folder**. A **sub-collection** is a **child folder**. One level of nesting only.
2. **Importable-content tree** (not a full structural replica). Import creates only the folders required for files this host actually imports. Do not create empty child folders for kinds the embed dropped, or for an empty selection. Unified Explore can still recreate the full mixed tree because both backends import.
3. Users can still find a single file (Library) without adopting a whole pack.
4. Importing **one** resource that belongs to a collection still creates the folder hierarchy and places that resource in it.
5. The importing **frontend does not** list/create folders and then import item-by-item. Each product backend **ensures** the path and imports in one API call.
6. Tags stay for Library filters and search. They are not folders.

### 1.3 Non-goals

- More than two folder levels from the catalog (collection → optional sub-collection). Host users may nest further by hand; catalog import never creates depth > 2.
- A resource in two collections (not a tag). Folder membership is exclusive.
- Folder ACLs, cross-workspace moves, or changing workspace membership.
- `ai-studio-fe` (retired). The only importing frontend is `spec-edit-fe`.
- common-be becoming a catalog. It still does not store specs, templates, or pipelines.
- Inferring sub-collections from Domain / Use Case tags.
- Relocating an already-imported resource if the user later moved it. Sync overwrites body, not placement.
- A separate `folderName` field, or `catalogOrigin` metadata on workspace folders (v1 is path-based find-or-create by immutable `displayName`).
- Distributed atomicity across SpecX / WorkX / common-be. Collection import is **best-effort**.
- A new idempotency lock table, catalog revision checksums, or `packageVersion: "2"`.

### 1.4 Catalog membership (folder semantics)

Each resource has **at most one** collection and **at most one** sub-collection, both optional.

| `collection` | `subcollection` | Workspace placement after import |
|---|---|---|
| omitted | omitted | Workspace root (`folderId: null`) |
| set | omitted | Direct child of the collection folder |
| set | set | Direct child of the sub-collection folder |
| omitted | set | **Invalid** — rejected at `npm run check` |

Rules:

- `collection` must be a **top-level** id in the collections registry (`parentId` null).
- `subcollection` must be a **child** of that collection (`parentId === collection`).
- A resource cannot list two collections or two sub-collections.
- Replacing today’s `collections: string[]` (max 2, no registry).

### 1.5 Collections registry

Collections are no longer free-form. Spec DB owns a registry (same spirit as `tags/tags.json`):

- Stable kebab-case `id` — immutable catalog identity.
- `displayName` — catalog label **and** workspace folder name. **Immutable after first merge to `main`.** Rename is a defined migration (new id, or a one-off content+docs change), not a casual copy edit. No second `folderName` field.
- `description` — collection page copy (editable).
- `parentId` — omitted/null for a top-level collection; required for a sub-collection and must point at a top-level collection
- `order` — sidebar / sub-folder sort (editable)
- `status` — `active` \| `deprecated` (new resources may only reference `active`)

Constraints (enforced by `npm run check`):

- Hierarchy depth **2** (top-level → child). No grandchild collections.
- Ids unique in the registry.
- **Case-insensitive sibling `displayName` uniqueness** among children of the same parent, and among top-level collections. Same label under **different** parents is allowed (`AI-SDLC / Planning` and `Builder / Planning`).
- New collection needed by a resource: add it in the **same** PR.

### 1.6 Browse UX (Spec DB)

Dual mode. Controls must not fight.

**Library (a la carte)**

- Sidebar: All / Templates / Specs / Pipelines (single-select, as today).
- Domain and Use Case filters live in the **page header**, not the sidebar. They apply only in Library.
- Grid is a flat list of matching resources, regardless of folder.
- Card import = that one resource. If it has collection metadata, the backend still files it in that folder.

**Collections (set menu)**

- Sidebar heading is **Collections** (not “Collections Folders”). Folder icons are for hierarchy, not the section title.
- Sidebar lists top-level collections (`AI-SDLC`, `Product Prism`, `Builder`, …).
- Opening a collection leaves Library. Library filters do not apply.
- Page: title + description, primary import CTA, then every resource in the collection, sub-collection files included.
- **By folder** (default) shows collection-root cards under “Top level”, then one section per sub-collection in registry `order`. Each section heading is a link to `?collection=…&subcollection=…` and shows that child’s description and **direct importable-file count** (host-allowlisted). The scoped page shows and imports only that child. **Hide** a section when that count is 0 (same rule as a disabled collection CTA).
- **All** shows the same cards in one list, grouped by kind. The By folder / All switch appears only when the collection has a non-empty sub-collection. A scoped sub-collection page has no switch.
- Local kind tabs (All / Templates / Specs / Pipelines) change **what you see**, not **what you import**. Persistent helper next to the CTA, e.g. “Imports all 16 SpecX files in AI-SDLC, not only the Templates tab.”

**Two different counts. Do not mix them up:**

| Surface | Count |
|---|---|
| Collection hero CTA | **Descendant-inclusive** — collection-root files **plus** every sub-collection file, host-allowlisted. Matches exactly what the CTA imports (§1.9) |
| Sub-collection section heading | **Direct only** — that child's own files, host-allowlisted |
| Scoped sub-collection page CTA | That child only (its direct count) |

The hero number is descendant-inclusive, so it can exceed the cards visible on the page when a kind tab or search narrows them. Show the breakdown so the arithmetic is legible to the user, e.g. “Import 16 SpecX files — 6 here, 10 in sub-folders.” Never render a hero count that silently disagrees with what the button does.

- CTA count and copy are host-aware: “Import 16 SpecX files” / “Import 8 pipelines”. Never a generic `resourcesCount` that includes dropped kinds. Never “exact folder replica.”
- **Canonical CTA label** (single wording across spec, prototype, and UI): `Import {n} {host} files` — “Import 16 SpecX files”, “Import 8 pipelines”. Retire “Import Entire Folder” and “Import folder into SpecX”; the label must carry the host-aware count, which a fixed string cannot.
- If the allowlist leaves **zero** importable files: hide/disable the CTA; do not postMessage; backends must not create folders.
- **Standalone (non-embed) Spec DB has no collection CTA.** The collection page renders normally — hero, description, folder sections, cards — and each card keeps its `/import?kind=&slug=` deep link, but the pack-level CTA is **hidden**, not disabled-with-a-tooltip. Multi-item handoff has no standalone transport (§4.1) and a dead button on the primary affordance is worse than its absence. A standalone `/import?collection=` deep link is a deliberate non-goal for v1; revisit only if standalone traffic matters.
- Card import inside a collection still imports that one file and still creates the hierarchy needed for **that** file.

**Search**

- Pagefind stays global: titles, summaries, bodies, tag labels, **collection and sub-collection display names**.
- Hits show a kind badge (`Collection` / `Template` / `Spec` / `Pipeline`). A collection hit opens the collection page.

### 1.7 Import UX and ownership

One frontend: **`spec-edit-fe`**. It already embeds Spec DB and routes:

- `spec` / `template` → `spec-edit-be`
- `pipeline` → `ai-studio-be`

Kinds stay split. “No to-and-fro” means: **no per-item folder create + per-item import**. The frontend makes **at most two** HTTP calls for a collection import (one per backend that has matching kinds), and **one** call for a single-resource import.

Each backend:

1. Resolves slugs for this request from the pulled registry (membership).
2. Fetches each package from the trusted Spec DB origin. **Package placement is authoritative** for the folder path. If the package’s `collection` / `subcollection` does not match the requested collection (and sub-collection, if set), fail that item with `PACKAGE_PLACEMENT_MISMATCH` — do not invent a catalog revision protocol.
3. Ensures only the paths required by items that will actually be created/overwritten (skip already-imported before ensure when possible; never ensure for an empty work list).
4. Creates/overwrites those resources with the resolved `folderId`.
5. Returns a per-item result list.

The frontend must not:

- `GET` folders, `POST` folders, then `POST` import per slug.
- Send `folderId` UUIDs it invented.
- Fetch Spec DB package bodies.

### 1.8 Single-resource import still creates folders

`POST …/spec-db/imports` `{ kind, slug }` remains valid.

**The package is the only source of placement.** If the fetched package has `collection` / `subcollection`, the backend ensures that path (using the package's `displayName`s) and places the new resource there. If both are omitted, placement is root. The pulled host registry is used for **membership resolution only** (which slugs belong to a collection); it stores ids, not display names, so it can never drive `ensure` on its own.

Standalone deep link (`/import?kind=&slug=`) uses the same backend path. No extra query params required.

### 1.9 Collection import API

Each product backend exposes a **collection import** endpoint.

Input (logical):

- `collectionId` (required) — top-level collection.
- `subcollectionId` (optional) — if set, only items in that child. If omitted, the work list is **every** item with `collection === collectionId`, **including** items that have a `subcollection`. Top-level “Import collection” is the whole pack, not only files sitting on the collection root.
- `slugs` (optional) — explicit subset. Every slug must belong to the scoped collection (and sub-collection if set) and be a kind this backend owns. **Omit = all matching catalog rows of this backend’s kinds.** The embed always sends `slugs` (its host-allowlisted roster from §3.5); MCP and direct API callers may omit it.
- `force` (optional) — same meaning as today’s MCP `copy` force (overwrite stamped catalog copies).
- `clientRequestId` (optional) — log correlation only, not a replay key (§1.14).

Behavior:

- Resolve the work list (registry membership ∩ requested slugs ∩ this backend’s kinds). Top-level membership = `collection === collectionId` regardless of `subcollection`.
- A requested slug the pulled registry does not know, or knows under a different collection, is a **per-item** `SLUG_NOT_IN_COLLECTION` failure. It must not fail the call. The host registry is a build-time snapshot and always lags a Spec DB deploy, so one newly published resource must never break the whole pack.
- If the work list resolves to empty: **HTTP 200** with `results: []` and no folder ensure. This is a normal outcome for a valid collection that has nothing for this backend, and matches the MCP contract (§8.1). Reserve 4xx for an unknown/deprecated collection or a malformed body.
- Group remaining items by target path (`[collection displayName]` or `[collection, subcollection]`). `ensure` each **distinct** path once; map each item to that path’s leaf `folderId`.
- Import sequentially, continue-on-failure (same policy as today’s batch).
- Kind allowlist is inherent: the SpecX backend never imports pipelines, the WorkX backend never imports specs or templates. When such a slug is explicitly requested it is a **per-item** `UNSUPPORTED_KIND` failure (§3.6), not a whole-call rejection.

A mixed pack (`AI-SDLC` = templates + specs + pipelines) therefore becomes:

1. `spec-edit-fe` → `spec-edit-be` collection import (specs + templates).
2. `spec-edit-fe` → `ai-studio-be` collection import (pipelines).

Both backends find-or-create the **same** folder names. They share the tree in common-be. A user sees one `AI-SDLC` folder containing mixed kinds.

### 1.10 Find-or-create folders (backend)

common-be today can **validate** a folder id. It cannot create folders for a service. Product backends must not call the public user folder API with a spoofed user session.

Add an **internal** ensure-by-name API. Match existing sibling uniqueness: `(workspaceId, parentFolderId, lower(name))`.

- Resolve **one path segment at a time** (parent, then child). Never insert a child until the parent id is known.
- If a sibling with that name exists → return it.
- Else create it (`createdByUserId` = importing user).
- On unique-index race (`23505`), re-read and return the winner. That is success, not a 500. Two parallel ensures of `["AI-SDLC", "Planning"]` must converge on the same ids.
- Never create `AI-SDLC (2)`.
- Do not require advisory locks or an extra locking protocol. The unique index plus per-segment retry is the concurrency contract.

Catalog import creates at most two levels. Depth 8 and the 500-folder workspace cap still apply; if ensure would exceed them, fail the import with the existing folder error codes.

**Reuse is path-based, not exclusive catalog ownership.** A user-created folder whose name matches `displayName` (case-insensitive sibling match) is reused. That is an explicit v1 choice: we do not stamp folders with `catalogOrigin`. Say so in product copy if needed; do not promise a private pack container.

### 1.11 Idempotency and existing copies

| Situation | Collection import (new) | Single import (existing endpoint) |
|---|---|---|
| No workspace copy | Create in the catalog folder path | Create in the catalog folder path |
| Stamped Spec DB copy (same slug+kind), `force` false | Skip (`alreadyImported`). **Do not move** it if the user filed it elsewhere | **Unchanged: creates a second copy** (see below) |
| Stamped copy, `force` true | Overwrite body/version. **Leave `folderId` unchanged** | n/a (no `force` on this endpoint) |
| Same title, not a catalog stamp | Per-item `TITLE_COLLISION`; continue other items | Unchanged |
| Same `clientRequestId` + same body | n/a — no collection-level replay (§1.14) | Replay the previous result (existing mechanism) |
| Same `clientRequestId` + different body | n/a | `409 IDEMPOTENCY_CONFLICT` (already exists) |
| User-created folder already named `AI-SDLC` | Reuse it (path-based; §1.10) | Reuse it (path-based; §1.10) |

**Deferred, stated honestly:** single import does **not** skip stamped copies today. `SpecDbImportService.importResource` does a `clientRequestId` replay and then creates unconditionally, so clicking Import twice on a card yields two copies. This spec does **not** change that — de-duplicating the single endpoint is a separate behavior change with its own query work (`templateRepository.findLocalByImportSlug` exists; specs have no equivalent lookup and the registry service detects stamps by list-and-match). Consequence to accept in v1: importing a collection and then clicking a card inside it can produce a duplicate of that one file. Fix it in a follow-up if users hit it.

### 1.12 Host kind allowlist (embed)

Unchanged:

- SpecX embed (`kinds=spec,template`): the collection CTA sends only specs + templates to `spec-edit-be`. Pipelines in that collection are not imported.
- WorkX-style embed (`kinds=pipeline`): only pipelines go to `ai-studio-be`.
- Unified `spec-edit-fe` Explore (all kinds): both backends, as in §1.9.

Copy on the collection page must say what will land in **this** host, e.g. “Import 16 SpecX files” vs “Import 8 pipelines”, not a fake “24” when the embed cannot take all 24.

### 1.13 Best-effort collection import

SpecX, WorkX, and common-be are not one transaction. Formalize that:

| Outcome | Meaning |
|---|---|
| **Complete** | Every requested importable item is `created`, `overwritten`, or `skipped` (already present) |
| **Nothing to do** | Every call made returned 200 with empty `results` (valid collection, no rows for this host). Not a failure; toast says so plainly |
| **Partial** | At least one item created/overwritten **and** at least one failed, **or** one of the two backend calls failed while the other succeeded |
| **Failed** | Nothing imported because a call errored (ensure down, both backends down, invalid or deprecated collection). An empty work list is **not** failure |

Empty folders after a failed-all-items-after-ensure are acceptable; do not add a compensating delete.

`spec-edit-fe` aggregates **both** backend responses into **one** summary toast, for example:

- “Imported 12 files; 3 were already present; 1 failed.”
- “Specs and templates imported. Pipelines could not be imported (WorkX unavailable).”
- “Nothing was imported: folder service unavailable.”

No independent per-backend success toasts for a collection import.

### 1.14 Idempotency (no replay for collection import)

Do not add a lock table, a request-log table, `IMPORT_IN_PROGRESS`, or a retention SLA.

**Single import keeps its existing replay.** It works because the result is reconstructed from the one row the request created: `findLocalByImportClientRequestId` / `findByImportClientRequestId` read `importProvenance.requestFingerprint` off that row.

**Collection import has no replay, by design.** That mechanism does not generalize: a collection response contains `skipped` items (created by an *earlier* request, carrying a different `clientRequestId`) and `failed` items (no row at all), so `results[]` cannot be reconstructed from row provenance. Storing it would require exactly the request-log table this spec rules out.

What makes retry safe instead is **per-item stamped-skip** (§1.11), which is the guarantee users actually care about: re-running the same collection import creates no duplicates and no second folder.

- `clientRequestId` on the collection endpoint is accepted and logged for correlation. It does **not** trigger replay and does **not** raise `IDEMPOTENCY_CONFLICT`.
- Concurrent duplicate clicks: the frontend already ignores a second batch while one is in flight, and folder `ensure` converges on one id (§1.10). Worst case is wasted work, not duplicate rows.

### 1.15 Deprecated and removed collections

- `npm run check` rejects new/updated resources that reference `deprecated` ids.
- Hosts still import a **package** that carries placement objects: use those `displayName`s.
- Collection endpoint: if the pulled registry marks the id deprecated or missing, reject the **collection** call (`COLLECTION_NOT_FOUND` / `COLLECTION_DEPRECATED`). Single-slug import still works from the package.
- Do not keep serving the collection CTA for a deprecated collection in the UI (hide it from the sidebar). Deep links to `?collection=` show an empty/unavailable state.

### 1.16 MCP

Registry tools stay the install path for agents. See **§8**. No new MCP tool. `copy` / `sync` place new rows with the same ensure path as HTTP collection import. Agents must not create folders first.

---

## 2. Current state (what this replaces)

| Layer | Today |
|---|---|
| Spec DB metadata | `collections?: string[]` max 2, no registry, chips on cards |
| Spec DB UI | Sidebar Domain / Use Case facets; collection chips filter `?collection=` |
| Spec DB packages | No collection fields (`src/mapper/packageSchemas.ts`) |
| Embed contract | `spec-db:import:requested` / `batch-requested` — `{ kind, slug }` only |
| `spec-edit-fe` | Sequential per-item POST to SpecX or WorkX BE (`runSpecDbImportBatch`). No folder APIs |
| `spec-edit-be` / `ai-studio-be` | `POST /workspaces/:id/spec-db/imports` `{ kind, slug }`. Creates at `folderId: null` |
| Host registries | `collections: string[]` on pulled `catalog-lite` rows |
| common-be | Folder CRUD + internal GET/validate by **id**. No find-or-create by **name** |
| `ai-studio-fe` | Retired — do not change |

---

## 3. Cross-repo contracts

### 3.1 Resource metadata (Spec DB authoring)

Replace `collections` with:

```json
{
  "collection": "ai-sdlc",
  "subcollection": "ai-sdlc-planning"
}
```

Both fields optional; `subcollection` requires `collection`.

### 3.2 Collections registry file

`collections/collections.json` (authoritative). Indexed to `public/generated/collections.json` for the UI and host pulls.

```json
{
  "schemaVersion": "1",
  "collections": [
    {
      "id": "ai-sdlc",
      "displayName": "AI-SDLC",
      "description": "End-to-end specs, templates, and pipelines for agent-driven delivery.",
      "order": 1,
      "status": "active"
    },
    {
      "id": "ai-sdlc-planning",
      "displayName": "Planning",
      "description": "PRD, design, and milestone planning.",
      "parentId": "ai-sdlc",
      "order": 1,
      "status": "active"
    }
  ]
}
```

Workspace folder names **are** `displayName` values (“AI-SDLC”, “Planning”), not ids. After first merge to `main`, do not change `displayName` without a migration. `npm run check` enforces case-insensitive sibling uniqueness.

### 3.3 Catalog lite + detail

Each lite/detail record:

```ts
{
  slug: string
  kind: 'template' | 'spec' | 'pipeline'
  title: string
  summary: string
  tags: string[]
  collection?: string       // top-level id
  subcollection?: string    // child id
  // …existing fields
}
```

Drop `collections: string[]`.

`generated/collections.json` is the resolved registry (active entries + labels) for the sidebar and folder pages.

### 3.4 Import package envelope

Keep `packageVersion: "1"`. New keys are optional. Host parsers are `.strict()`, so this is a **coordinated compatibility exception**, not a silent additive change.

**Rollout (consumers first):**

1. Both importing backends (and registry pullers) accept optional `collection` / `subcollection` on packages **and** optional `collection` / `subcollection` on `catalog-lite` (tolerate leftover `collections[]` for one pull).
2. Verify both backends in the environments that pull Spec DB.
3. Spec DB starts emitting the new fields.
4. Remove the `collections[]` tolerance after one successful pull cycle.

Do not bump to `"2"` unless a later breaking change needs it.

```ts
{
  packageVersion: '1'
  slug: string
  kind: 'template' | 'spec' | 'pipeline'
  title: string
  summary: string
  tags?: string[]
  sourceVersion: string
  collection?: { id: string; displayName: string }
  subcollection?: { id: string; displayName: string }
  // kind-specific body unchanged
}
```

`subcollection` without `collection` is invalid. Hosts use `displayName` for ensure; they do not guess names from ids.

### 3.5 Embed postMessage

Keep existing single and batch messages for Library multi-select and one-off cards.

Add collection import:

```ts
type SpecDbImportCollectionRequested = {
  type: 'spec-db:import:collection-requested'
  batchId: string
  collectionId: string
  subcollectionId?: string
  /** Present so the host can render progress without a catalog fetch. */
  items: Array<{ kind: ResourceKind; slug: string }>
}
```

Rules:

- `items` is the **importable membership** of that collection (or sub-collection) for this embed: catalog membership ∩ `kinds=`. Not the locally filtered kind-tab view.
- If that set is empty, Spec DB does not post the message.
- Hosts **do not** import from `items` one-by-one. They split by kind and call each backend’s collection API with `collectionId` + `slugs` derived from that split. `items` is the allowlist/progress roster, not a license to skip the collection endpoint.
- Progress/completed messages stay per logical item (`kind` + `slug`) so the iframe can update cards.

Legacy `import:requested` / `batch-requested` stay valid. Hosts treat them as today, except the **backend** now files by package metadata.

### 3.6 Product backend APIs

**Single (existing, extended behavior)**

```
POST /apis/v1/workspaces/:workspaceId/spec-db/imports
{ "kind": "template", "slug": "ai-sdlc-prd-template", "clientRequestId": "…" }
```

No `folderId`. Placement comes from the package.

**Collection (new)**

```
POST /apis/v1/workspaces/:workspaceId/spec-db/imports/collection
{
  "collectionId": "ai-sdlc",
  "subcollectionId": "ai-sdlc-planning",
  "slugs": ["ai-sdlc-prd-template", "ai-sdlc-design-spec-template"],
  "force": false,
  "clientRequestId": "…"
}
```

`slugs` is optional (§1.9). `clientRequestId` is correlation only — no replay (§1.14).

Out-of-scope kinds are a **per-item `failed` result**, never a whole-call rejection — the frontend needs one deterministic mapping, so “reject or skip” is not a choice left to the implementer:

- `spec-edit-be`: a pipeline slug → `{ status: 'failed', error: { code: 'UNSUPPORTED_KIND' } }`.
- `ai-studio-be`: a spec or template slug → same shape.
- Either backend: a slug the pulled registry does not place in this collection → `{ status: 'failed', error: { code: 'SLUG_NOT_IN_COLLECTION' } }`.

Response (both):

```ts
{
  collectionId: string
  folders: Array<{ id: string; name: string; parentFolderId: string | null }>
  results: Array<{
    kind: 'spec' | 'template' | 'pipeline'
    slug: string
    status: 'created' | 'overwritten' | 'skipped' | 'failed'
    id?: string
    title?: string
    folderId?: string | null
    error?: { code: string; message: string }
  }>
}
```

Status code rules:

- **200** if the request was well-formed, even when some or all items failed (continue-on-failure).
- **200 with `results: []` and `folders: []`** when the work list resolves to empty. A valid collection with nothing for this backend is a normal answer, not an error (§1.9, §1.13). Do not ensure folders in this case.
- **4xx/5xx** only for request/auth failures, an unknown or deprecated `collectionId`, or a folder-ensure failure that aborts the whole call.

### 3.7 common-be internal ensure

```
POST /apis/v1/internal/workspaces/:workspaceId/folders/ensure
X-Redox-Service-Key: …

{
  "createdByUserId": "firebase-uid",
  "path": ["AI-SDLC", "Planning"]
}
```

- `path` is a **string array**, matching `common-client.ensureFolderPath(workspaceId, createdByUserId, names: string[])` (§4.3). A per-segment object wrapper buys nothing at depth 2 and only invites drift between the HTTP body and the client signature.
- `path` length 1–2 for catalog use; allow up to existing max depth 8 for reuse.
- Same name normalization, length, and empty-name rules as public `POST …/folders`. Reject a path that repeats the same normalized name twice.
- Returns the resolved nodes in path order: `{ items: Folder[] }`.
- `createdByUserId` required. Verify that user is a workspace member in the same service call → else `403 WORKSPACE_ACCESS_DENIED`.

Existing internal GET/validate-by-id stay for user-driven moves.

---

## 4. Planned changes by repo

### 4.1 `spec-db` (this repo)

**Authoring / validation**

- Add `collections/collections.json` + `schemas/collections-registry.schema.json` + `collections/README.md`.
- `metadataSchema`: remove `collections[]`. Add optional `collection`, `subcollection` (kebab-case). Refine: subcollection implies collection; both must exist and be active; collection is top-level; subcollection’s `parentId` is that collection.
- `npm run check`: enforce the above; fail unknown / deprecated / wrong-parent ids; fail case-insensitive sibling `displayName` collisions.
- Migrate every `resources/**/metadata.json` from `"collections": ["ai-sdlc"]` → `"collection": "ai-sdlc"`. Seed the registry with today’s ids: `ai-sdlc`, `builder`, `onboarding`, `product-prism`. **Do not invent sub-collections in the migration** unless a follow-up content PR adds them explicitly.
- **The migration is mechanical — verified against current content.** 38 resources carry `collections`, every one has exactly **one** entry, and there are only those four distinct ids. The schema permits 2, but no resource uses 2, so there is **no tie-break case**. Do not write defensive “which of the two wins” logic; a one-to-one rewrite is complete and `npm run check` will catch any resource added before the migration lands.
- `CONTRIBUTING.md`: document the two fields and the registry. Remove “max 2; no registry; chips”.

**Generated APIs**

- `scripts/index.ts`: emit `generated/collections.json`; put `collection` / `subcollection` on lite + detail; stop emitting `collections[]`.
- Packages: include `collection` / `subcollection` objects with `id` + `displayName` (`src/mapper/buildPackage.ts`, `packageSchemas.ts`, JSON Schema mirrors).
- Pagefind: index collection and sub-collection display names; include collection records so search can hit a folder.

**Catalog UI**

- Dual-mode sidebar: Library (kinds) + **Collections** (top-level registry entries). Remove Domain / Use Case from the sidebar.
- Library page: Domain + Use Case dropdowns in the header (Library only).
- Collection page: hero (title, description, host-aware CTA + helper text), local kind tabs, a By folder / All switch, and every descendant card without collection chips. By folder puts cards under clickable sub-collection headings (direct importable-file count).
- URL: `?collection=ai-sdlc` opens folder view; optional `?subcollection=`; Library `kind` + `tag` params do not apply while a collection is selected.
- CTA → `spec-db:import:collection-requested` (embed) only when importable count > 0. **Standalone renders no pack CTA at all** (§1.6): multi-item handoff has no standalone transport, so hide the button rather than shipping a dead control. Single-card Import stays `import:requested` / deep link in both modes.
- Hero CTA count is descendant-inclusive; sub-collection heading counts are direct-only; render the breakdown (§1.6).
- Local kind tabs must not shrink the collection message `items`.
- Host `kinds=` slices `items` and the CTA count. Zero importable → no CTA.

**Docs**

- Update `docs/embed.md` and `docs/multi-import-plan.md` with the collection message and the “hosts call collection APIs, not per-item folder CRUD” rule.

**Tests / check**

- Schema fixtures for valid/invalid membership and case-only sibling `displayName` collisions.
- UI: Library tags do not apply in collection mode; collection import roster ignores local kind tab; CTA uses allowlisted count; empty allowlist hides CTA.

### 4.2 `redoxsoft-common-be`

**Why this repo:** only common-be can create folders safely for two product backends at once.

- Internal `POST /workspaces/:workspaceId/folders/ensure` as in §3.7.
- Implement find-or-create in `folder.service.ts` using the existing unique indexes; retry on `23505`.
- Reuse public create’s name normalization. Membership check on `createdByUserId` in the same call.
- No public “ensure” (users keep explicit create). No change to delete/move semantics.
- Unit/manual: concurrent ensure of the same path from two service keys returns the same ids; second path segment parents to the first.

### 4.3 `spec-edit-be`

**Import**

- Extend `CreateSpecDbImportBody` — still no `folderId`. After fetch, read package `collection` / `subcollection`, `ensure` path, pass `folderId` into `createLocalTemplate` / `createSpec`.
- Add `POST /workspaces/:workspaceId/spec-db/imports/collection` (§3.6). Resolve membership from the pulled registry (not from the client’s word alone). `slugs` is optional; omitted means every spec/template row in scope.
- A requested slug that is absent from the pulled registry or placed in a different collection is a **per-item** `SLUG_NOT_IN_COLLECTION` failure, **not** a 400. The registry is a build-time snapshot that lags Spec DB, so whole-call validation on `slugs` would make every content release break in-flight imports.
- Collection import: work list is all spec/template rows with that `collection` (and that `subcollection` only if requested). Group by distinct folder path, `ensure` each path once, then import sequentially.
- Wire `folderId` through `SpecDbImportService.importTemplate` / `importSpec`.
- `force` / stamped skip / title collision: same codes as `specdbRegistryService.copy`.
- **No idempotency fingerprint or replay on the collection endpoint** (§1.14). Accept `clientRequestId`, log it, do not branch on it. Do not extend `requestFingerprint` for this path. Safety comes from stamped-skip, which the reused `specdbRegistryService.copy` logic already provides.

**Registry pull / MCP**

- `specdb:pull` / `sync-registry`: read `collection` + `subcollection` from `catalog-lite`; also pull `collections.json`.
- Registry columns are **two deploys**: (1) add nullable `collection` / `subcollection`, backfill from `collections[0]` if present, write both shapes; (2) **later** release, after pullers and Spec DB no longer emit `collections[]`, drop the jsonb column. Do not drop in the same release as the add.
- Filter `copy` / `list` by `collection` / `subcollection` instead of `collections.includes`.
- MCP `copy` of new rows must `ensure` + set `folderId`. `sync` / `force` overwrite does not move.
- `common-client`: add `ensureFolderPath(workspaceId, createdByUserId, names: string[])`.

**Package Zod**

- Accept optional `collection` / `subcollection` on Spec DB packages (`spec-db-import.schema.ts`) **before** Spec DB emits them. Reject `subcollection` without `collection`.
- Collection import: if a fetched package’s placement does not match the requested collection/sub-collection, that item is `PACKAGE_PLACEMENT_MISMATCH` (no silent re-home).

**Errors**

- `FOLDER_VALIDATION_UNAVAILABLE` if ensure fails closed (common-be down) — abort the collection call.
- `FOLDER_LIMIT_REACHED` / `FOLDER_DEPTH_EXCEEDED` — abort.
- Per-item package errors stay per-item.

### 4.4 `ai-studio-be`

Mirror §4.3 for pipelines only.

- `importPipelineFromPackage` today hard-codes `folderId: null`. Ensure path from package, then insert with that id.
- New `POST /workspaces/:workspaceId/spec-db/imports/collection`.
- Registry pull / `collections` column → `collection` + `subcollection`.
- MCP pipeline `copy` places new pipelines; `sync` does not move.
- `common-client.ensureFolderPath` (same contract as spec-edit-be).
- Global/system pipelines remain unfolderable; catalog imports are never global.

### 4.5 `spec-edit-fe`

**Import runner**

- Parse `spec-db:import:collection-requested`.
- Split `items` into spec/template vs pipeline.
- One `POST …/spec-db/imports/collection` to SpecX BE if any spec/template slugs.
- One `POST …/spec-db/imports/collection` to WorkX BE if any pipeline slugs.
- Run those two calls **in parallel** and settle each independently with `Promise.allSettled`. A rejection on one side is that side **failed**; never block the toast or the iframe `completed` message on the slower call.
- **A timeout must be added — there is none to inherit.** `fetchSpecApi` is a plain `fetch` wrapper with no `AbortController`, and `timeout` appears nowhere in `spec-edit-fe/src` except an unrelated `"generation_timeout"` string. So “a hang is that side failed” is unreachable with today’s client: a wedged backend leaves the user on an indefinite spinner with no toast, ever. Pass an explicit `AbortSignal.timeout(ms)` per collection call (thread a `signal` through `fetchSpecApi`, which does not accept one today). Pick one constant in the import module and reuse it for both calls; an aborted call maps to that side **failed** with a “took too long” message. This is required work, not an optional nicety.
- Map backend `results[]` onto iframe progress/completed (synthesize `started`/`succeeded`/`failed`/`skipped` per item). `PACKAGE_PLACEMENT_MISMATCH`, `UNSUPPORTED_KIND`, and `SLUG_NOT_IN_COLLECTION` are all `failed` plus their error code — do not add status enum values for them.
- A 200 with `results: []` is **not** an error. If both sides come back empty, toast “Nothing to import” (§1.13 *Nothing to do*), not a failure.
- One aggregated toast from both responses (§1.13). Treat one-backend failure as **partial** if the other created anything.
- Keep legacy single + batch listeners. Batch of Library selections can stay per-item **import** calls (no folder CRUD). Optional later: if every item shares one collection, collapse to collection API — not required for v1.
- Single-card / standalone `/import` stays `POST …/spec-db/imports` `{ kind, slug }`. Backend creates folders.

**After import**

- Invalidate/refetch workspace folder list and the three resource lists so the new tree appears.
- There is **no folder UI in spec-edit-fe yet**. This spec does not invent a full folder sidebar. It only requires: import APIs, cache refresh hooks, and navigation that still works when `folderId` is set (lists that ignore folder filters must keep returning the new items, which they already do when `folderId`/`unfiled` are omitted).
- Single-item success may still deep-link to the document/template/pipeline. Collection success stays on Explore (same as multi-import today) and toasts a summary.

**Copy**

- Collection page CTA uses the canonical `Import {n} {host} files` label from §1.6 (“Import 16 SpecX files” / “Import 8 pipelines”). Do not claim files this host will drop, and do not reintroduce a fixed label that omits the count.

**Do not**

- Call common-be folder create from the browser for catalog import.
- Restore `ai-studio-fe`.

### 4.6 `ai-studio-fe`

No work. Retired.

---

## 5. Suggested implementation order

1. **common-be ensure** — unblocks both product backends; independent of catalog JSON shape.
2. **Backend tolerance only (additive, shippable now)** — both backends accept optional `collection` / `subcollection` on packages and lite rows; add nullable `collection` / `subcollection` columns **without dropping** `collections[]`. This is the step that must ship **before** Spec DB emits the new keys, and it is verifiable on its own: parse a hand-written package fixture that carries placement.
3. **spec-db data model** — registry, metadata migration, `check` / `index`, packages with placement.
4. **Backend collection endpoint + single-import placement** — build here, **not** in step 2. Membership resolution reads the new `collection` column, so there is nothing real to resolve until step 3 has published a catalog and the host has pulled it. Ordering this after step 3 is what makes end-to-end verification possible; attempting it in step 2 yields an endpoint that can only be unit-tested against mocks.
5. **spec-edit-fe** — collection postMessage, two parallel collection API calls with an explicit abort timeout, one aggregated toast.
6. **spec-db UI** — dual-mode browse + host-aware CTA. Prototype copy must match importable-content semantics.
7. **Later cleanup** — drop `collections[]` on host registry tables only after production pullers have written the new columns for a full cycle.

Do not deploy Spec DB generated JSON with the new keys until both BEs accept them. Registry pullers must tolerate old `collections[]` for one cycle.

---

## 6. Migration notes

- Existing workspace resources stay at `folderId: null` until someone re-imports or a user files them. No backfill job.
- Re-import without `force` skips stamped copies (they stay where the user put them).
- Host registry sync after the Spec DB deploy: pull new `catalog-lite` + `collections.json`. Old `collections: ["ai-sdlc"]` rows should be read as `collection: "ai-sdlc"` during the additive-column phase. Drop the jsonb column only in the cleanup release (§5, step 7).
- Content: today’s four collection ids become top-level registry entries. Sub-collections are a later catalog content change, not a blocker for the plumbing.

---

## 7. Acceptance checks

- A resource cannot validate with two collections, a sub-collection and no collection, or a sub-collection under the wrong parent.
- Two sibling collections whose `displayName`s differ only by case fail `check`.
- Library → import one AI-SDLC template → workspace has folder `AI-SDLC` (and sub-folder if set) and that template inside. No other AI-SDLC files created.
- Collection page, kind tab “Templates”, Import in full Explore → SpecX gets **all** specs+templates in that collection, **including** those in sub-collections; WorkX gets all pipelines; local tab did not shrink the payload; CTA count is allowlisted, not total.
- Top-level import ensures both `[AI-SDLC]` and `[AI-SDLC, Planning]` when the work list has root and child items; a scoped Planning import does not import collection-root files.
- SpecX-only embed of a collection that has a pipelines-only child → that child folder is **not** created; CTA omits pipelines.
- Zero importable kinds → no CTA, no ensure, no folders.
- Collection hero count is **descendant-inclusive** and equals the number of items the CTA actually sends; each sub-collection heading shows its **direct** count only; the page states the breakdown so the two numbers reconcile on screen.
- Standalone (non-embed) collection page → no pack CTA at all (not a disabled one); cards still deep-link to `/import?kind=&slug=`.
- Collection import whose work list resolves to empty → **HTTP 200**, `results: []`, `folders: []`, no folders created, and the toast reads “nothing to import” rather than a failure.
- A requested slug missing from the pulled host registry → that item alone fails `SLUG_NOT_IN_COLLECTION`; every other item in the pack still imports.
- A pipeline slug sent to `spec-edit-be` → per-item `failed` / `UNSUPPORTED_KIND`, never a 400 for the whole call.
- One backend wedged past the abort timeout → that side settles as **failed**, the other side's results still land, and the aggregated toast appears (no indefinite spinner).
- Repeating a collection import with the same `clientRequestId` → no replay branch, no `IDEMPOTENCY_CONFLICT`; safety comes from stamped-skip alone.
- Second import of the same collection without `force` → folders reused, items skipped as already imported, no duplicates, no moves.
- Two backends importing the same pack concurrently → one `AI-SDLC` folder id, mixed contents.
- One backend down after the other succeeded → **partial**; one toast explains which side failed.
- common-be down → **failed**; no folders, no resources.
- User-renamed/moved stamped copy + catalog `sync`/`force` → content updates, `folderId` unchanged.
- Package placement disagrees with the collection request → that item `PACKAGE_PLACEMENT_MISMATCH`.
- `ai-studio-fe` is not modified.
- MCP `copy` with `collection: "ai-sdlc"` on SpecX installs that pack’s templates **and** (via `document_registry`) specs into the AI-SDLC folder tree; pipelines are not installed on that connection.
- MCP `copy` with `collection` when this kind has zero rows returns `ok` and empty `created` (the other SpecX tool may still import).
- MCP `copy` with `collection` skips already-imported rows instead of aborting the whole pack.
- MCP `copy` with `collection` + `subcollection` does not install collection-root files.
- MCP `copy` with `tags` only may create resources under more than one collection path.
- MCP `sync` with `collection` does not install missing items.
- MCP `tags` returns collections separately from Domain / Use Case tags; top-level `count` includes children of this kind.
- `specdb:pull` without `collections.json` cannot populate those labels after Spec DB ships the registry.

---

## 8. MCP plan

The user talks to an agent. The agent uses the **existing** registry tools. Do not add `copy_collection` or a fourth registry tool.

| Tool | Host | Kind |
|---|---|---|
| `template_registry` | spec-edit-be | templates |
| `document_registry` | spec-edit-be | specs (`kind` in results is `"document"`) |
| `pipeline_registry` | ai-studio-be | pipelines |

Commands stay `list`, `tags`, `copy`, `sync`. Search (`list` / `tags`) never writes. `copy` / `sync` run only when the user asked to install or update. `copy` still requires a selector — not a free-text `query`.

### 8.1 Multi-tool orchestration (tool prose, required)

The three tools stay separate. A mixed pack is **not** one call. Put this in every registry description:

> Collections are catalog folder paths for **this registry’s kind only**. Use `tags` to discover ids and hierarchy, `list` to inspect. `copy` installs those resources into their catalog folders; do not create folders or invent ids. For a SpecX pack, call both `template_registry` and `document_registry`. For pipelines, `pipeline_registry` only. Ask before `copy`, `sync`, or `force`.

| User context | Required calls | Honest claim |
|---|---|---|
| SpecX: “Import AI-SDLC” | `template_registry.copy(collection)` **and** `document_registry.copy(collection)` | “Imported the AI-SDLC templates and documents available to SpecX.” |
| WorkX: “Import AI-SDLC” | `pipeline_registry.copy(collection)` | “Imported the AI-SDLC pipelines available to WorkX.” |
| SpecX: “Update AI-SDLC” | both `sync(collection)` | “Updated installed AI-SDLC templates and documents; folder placement was preserved.” |
| WorkX: “Update AI-SDLC” | `pipeline_registry.sync(collection)` | “Updated installed AI-SDLC pipelines; folder placement was preserved.” |

Call each tool independently. Aggregate outcomes. An empty work list on **one** of the two SpecX tools is **not** overall failure (`ok` + empty `created`, same as no templates in the pack). `document_registry` installs catalog **specs** (results may keep `kind: "document"`; say that mapping in the tool description — do not add a second kind field on every row).

### 8.2 Contract changes

**`tags`** — keep Domain / Use Case in `tags`. Return collections in a **separate** `collections` array (do not mix folder ids into tag ids):

```ts
{
  id: string
  displayName: string
  description?: string
  parentId: string | null
  status: 'active' | 'deprecated'
  count: number
}
```

`count` = active catalog rows of **this kind** that this selector would import. Top-level includes child sub-collections. A child count is that child only. Not pipelines on a SpecX tool. Not deprecated. Installed-vs-not is `list` + `workspaceId`, not this number.

**`list` / `copy` / `sync` input** — replace `collections: string[]` with:

- `collection?: string` — `row.collection === id`, **including** rows with a `subcollection`.
- `subcollection?: string` — requires `collection`; that child only.

Provided selectors **intersect** (same as today’s filter). `copy({ collection: "ai-sdlc", tags: ["use-case.planning"] })` means AI-SDLC items that also have that tag. `query` / `cursor` / `limit` are `list` only. `copy`/`sync` need at least one of `slugs`, `collection`, `tags`. Additive phase: one-element `collections: ["ai-sdlc"]` still means `collection`. Reject two collection ids.

**`list` output** — `collection` / `subcollection` ids, not `collections[]`.

**`copy`** — this kind only; same path ensure as HTTP collection import. Agent does not create folders.

- `copy` + `collection`: already-imported rows are **skipped**, not a fatal `ALREADY_EXISTS` for the whole call (pack import must not abort because some files were already there). `TITLE_COLLISION` stays per-item / conflict.
- `copy` + only `slugs`: keep today’s all-or-nothing conflict behavior.
- Tag-selected `copy` is **not** a pack: tags pick resources; each lands in **its own** collection path (or root). Do not promise a shared “Planning” folder.
- Created rows should include enough placement to say where they landed (catalog `collection` / `subcollection` ids or display names). No workspace `folderPath` API required.

**`sync`** — does **not** install missing items (`skippedNotInstalled`, as today). Updates stamped copies only; does not move. `force` overwrites even when `sourceVersion` matches; still never relocates.

**`copy` / `sync` / `force`**

| Command | Not in workspace | Stamped catalog copy | Local same title, not a stamp |
|---|---|---|---|
| `copy` | Create | Collection selector: skip. Slug-only: `ALREADY_EXISTS` | `TITLE_COLLISION` |
| `copy` + `force` | Create | Overwrite body; keep `folderId` | `TITLE_COLLISION` |
| `sync` | Skip (`skippedNotInstalled`) | Update if version differs; keep `folderId` | Skip (`skippedNotFromSpecDb`) |
| `sync` + `force` | Skip (still not an install) | Overwrite even if version matches; keep `folderId` | Skip |

Install = `copy`. Update installed = `sync`.

### 8.3 `specdb:pull` / `specdb:sync`

Today pull downloads `catalog-lite.json` + `tags.json`. `tags.json` is the Domain / Use Case **label** vocab. Lite rows only have ids.

Also pull `generated/collections.json` (the folder vocab: id, displayName, parentId, description, order, status). Sync:

- writes `collection` / `subcollection` on each registry item (phase 1: still read leftover `collections[]`);
- upserts collection vocab so `tags` can return labels and parents.

Without this file, the agent can filter by id from lite rows but cannot resolve “AI-SDLC” / “Planning” or ensure folders by `displayName`.

### 8.4 Intended usage

**Search / browse (read-only)**

| User might say | Agent typically does |
|---|---|
| “What collections / packs are there?” | `tags` — collection names, parents, descriptions, this-kind counts |
| “What tags can I filter by?” | `tags` — Domain / Use Case ids |
| “Show me engineering templates” | `list` + `tags: ["domain.engineering"]` |
| “Find a PRD template” / “bug spec” | `list` + `query: "prd"` (title / summary / slug) |
| “What’s in AI-SDLC?” | `list` + `collection: "ai-sdlc"` (includes Planning children) |
| “What’s in AI-SDLC Planning?” | `list` + `collection` + `subcollection` |
| “List all catalog pipelines” | `list` and page with `cursor` until `hasMore` is false |

`list` may take `workspaceId` so rows are annotated `installed` / version. That is still the catalog, not `template_list` / `document_list` / `pipeline_list`.

**Copy / import (writes)**

| User might say | Agent typically does |
|---|---|
| “Import this collection” / “install AI-SDLC” | SpecX: both `copy` tools with `collection`. WorkX: `pipeline_registry.copy`. Skip already-installed files; do not claim the whole pack failed. |
| “Import only Planning from AI-SDLC” | `copy` + `collection` + `subcollection` |
| “Import the PRD template” | `list`/`query` to get the slug, then `copy` + `slugs: ["…"]`. That file still gets its folder path if it has one |
| “Import all planning-tagged specs” | `copy` + `tags: ["use-case.planning"]` — each spec files to **its** collection path, not a shared Planning folder |
| “Update my catalog copies” / “sync AI-SDLC” | `sync` + the same selector. Does not install missing items. Does not move folders. |

Already-installed handling depends on the selector (§8.2), and the two are not interchangeable:

- **Slug-only `copy`** of an installed resource → `ALREADY_EXISTS` unless the user asked to overwrite. The user named one file, so telling them it is already there is the useful answer.
- **`collection` (or `tags`) `copy`** → installed rows are **skipped** and reported as skipped. A pack import must not abort because some of its files were already present.

Title clash with a local non-catalog file is `TITLE_COLLISION` in both cases — the agent asks; it does not rename on its own.

**What one sentence cannot do**

- SpecX MCP: “import AI-SDLC” → `template_registry` **and** `document_registry`. Pipelines are not installed.
- WorkX MCP: the same sentence → `pipeline_registry` only.
- Do not invent slugs, `copy` from `query` alone, or create folders first.
