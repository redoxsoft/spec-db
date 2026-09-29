# Collections as workspace folders — milestone plan

**Plan mode:** implementation-level  
**Source:** `folder-spec.md` (do not restate it; section numbers below point there)  
**Status vocabulary:** Planned | In Progress | Blocked | Done  
**Owner:** Unassigned on every milestone. Do not invent one.

## Delivery outcome

Importing a Spec DB collection creates only the workspace folders this host's files need, and places those files there. A single file from that collection lands in the same place. Tags still filter; they do not place.

## How to read this

Each milestone is shippable on its own and depends only on earlier ones. Two rules from the spec override any urge to go faster:

1. **Consumers first.** Both importing backends must accept optional `collection` / `subcollection` in production before Spec DB emits those keys. Host parsers are `.strict()`.
2. **Add, then drop.** Registry columns gain `collection` / `subcollection` without dropping `collections[]`. The drop is the last milestone, after a full production pull cycle.

`ai-studio-fe` is not in any milestone.

## Verification policy

Applies to every milestone. Do not add a milestone-specific test list.

- **Do not add test cases.** No new test files, fixtures, assertions, or UI tests.
- **The only verification is a clean build** of each repo the milestone touches. `npm run build` must exit 0 with no errors and no warnings. Commands:
  - `redoxsoft-common-be`: `npm run build` (`tsc -p tsconfig.json`)
  - `spec-edit-be`: `npm run build` (`tsc -p tsconfig.json`)
  - `ai-studio-be`: `npm run build` (`tsc`)
  - `spec-db`: `npm run build` (validate, index, `tsc -b`, Vite, Pagefind)
  - `spec-edit-fe`: `npm run build` (`tsc -b` and Vite)
- **If existing tests fail because of the change, fix them.** Update a test when it still describes the old contract and the new contract is what the spec requires. Fix the implementation when the test still describes required behavior. Do not delete a failing test to go green, and do not add tests to replace one.
- **Manual behavior checks are out of this plan.** The acceptance checks in `folder-spec.md` §7 are for a later manual pass. A milestone is done when its builds are clean and any existing tests it broke are fixed. It is not done when those manual checks pass.

---

## Services can ensure a folder path by name

- **Status:** Done
- **Depends on:** none
- **Repo:** `redoxsoft-common-be`
- **Spec:** §1.10, §3.7, §4.2

**Goal.** Product backends can find-or-create a catalog folder path without a user session. Two callers racing the same path get the same folder ids.

**In scope**

- Internal `POST /apis/v1/internal/workspaces/:workspaceId/folders/ensure`.
- Body is `{ createdByUserId, path: string[] }`. `path` length 1–2 for catalog use; reject above the existing depth cap of 8.
- Resolve one segment at a time. Never insert a child before the parent id is known.
- Reuse public create's name normalization, length, and empty-name rules. Reject a path that repeats the same normalized name.
- `createdByUserId` must be a workspace member in the same call, else `403 WORKSPACE_ACCESS_DENIED`.
- On unique-index race (`23505`), re-read and return the winner. That is success.
- Return `{ items: Folder[] }` in path order.

**Out of scope**

- A public ensure endpoint. Users keep explicit create.
- Delete, move, or ACL changes.
- Storing catalog origin on the folder.
- Any product-backend or Spec DB work.
- New tests.

**Verification.** `npm run build` in `redoxsoft-common-be`, per the verification policy.

**Done when** that build is clean, and any existing test this milestone broke is fixed.

---

## Import backends tolerate placement without using it

- **Status:** Done
- **Depends on:** none. Runs in parallel with the ensure milestone.
- **Repos:** `spec-edit-be`, `ai-studio-be` (land together)
- **Spec:** §3.4 rollout steps 1–2, §4.3 Package Zod, §4.4, §5 step 2

**Goal.** A package or `catalog-lite` row that carries the new fields parses. Nothing is placed in a folder yet. This is the deploy gate that lets Spec DB start emitting.

**In scope**

- Zod: optional `collection` / `subcollection` objects (`id`, `displayName`) on packages. Reject `subcollection` without `collection`.
- `catalog-lite` rows: accept optional `collection` / `subcollection` strings and still tolerate leftover `collections[]`.
- Migration, phase 1 only: add nullable `collection` and `subcollection` columns. Backfill `collection` from `collections[0]` when present. Keep writing `collections[]`. Do not drop the jsonb column.
- Pullers read the new fields when present and keep reading `collections[]` when they are not.

**Out of scope**

- Calling ensure, setting `folderId`, or adding the collection import route.
- MCP input changes (`collections: string[]` stays valid through this milestone).
- Pulling `collections.json` (nothing emits it yet).
- Any Spec DB or frontend change.
- New tests. A hand-written package used as a one-off parse check during implementation is not a test to commit.

**Verification.** `npm run build` in `spec-edit-be` and in `ai-studio-be`, per the verification policy.

**Done when** both builds are clean, any existing test this milestone broke is fixed, and `collections[]` is still on the registry tables.

---

## The catalog publishes collections as folder names

- **Status:** Done
- **Depends on:** tolerance milestone deployed in the pulling environments. Do not ship generated JSON before that.
- **Repo:** `spec-db`
- **Spec:** §1.4, §1.5, §3.1–§3.4, §4.1 authoring + generated APIs (not the catalog UI), §6

**Goal.** Every resource has at most one collection and one sub-collection, both registry-backed, and published packages carry the folder names a host will ensure.

**In scope**

- `collections/collections.json`, `schemas/collections-registry.schema.json`, `collections/README.md`.
- Metadata: remove `collections[]`; add optional `collection` and `subcollection`. Sub-collection requires collection; collection is top-level; sub-collection's `parentId` is that collection; both ids exist and are `active`.
- `npm run check`: unknown, deprecated, or wrong-parent ids fail. Case-insensitive sibling `displayName` collisions fail.
- Content migration is one-to-one. 38 resources, each with exactly one id, four ids total: `ai-sdlc`, `builder`, `onboarding`, `product-prism`. No tie-break logic. Do not invent sub-collections.
- `displayName` is the folder name and is immutable after this merge. No second `folderName` field.
- `scripts/index.ts`: emit `generated/collections.json`; put `collection` / `subcollection` on lite and detail; stop emitting `collections[]`.
- Packages (`buildPackage.ts`, `packageSchemas.ts`, JSON Schema mirrors): `collection` / `subcollection` objects with `id` + `displayName`. Keep `packageVersion: "1"`.
- `CONTRIBUTING.md`: replace the "max 2; no registry; chips" rule.

**Out of scope**

- Catalog UI, sidebar, collection page, or the collection postMessage (later milestone).
- Pagefind collection records (ships with the browse UI, which is the only consumer).
- Sub-collection content. Plumbing allows it; a content PR adds it later.
- Host puller or import changes.
- New tests, including schema fixtures whose only purpose is to prove `npm run check` fails.

**Verification.** `npm run build` in `spec-db`, per the verification policy. That build already runs validate and index, so a migrated tree that fails `check` fails the build.

**Done when** that build is clean and any existing test this milestone broke is fixed. Do not start until the tolerance milestone is deployed in the pulling environments.

---

## Imports file resources into catalog folders

- **Status:** Done
- **Depends on:** ensure milestone, tolerance milestone, and catalog milestone (published, then pulled).
- **Repos:** `spec-edit-be`, `ai-studio-be` (land together)
- **Spec:** §1.7–§1.11, §1.14, §3.6, §4.3 Import + pull, §4.4

**Goal.** One HTTP call per product backend imports a collection, ensures only the paths those files need, and places new rows there. Importing one slug does the same for that file alone.

**In scope**

- `common-client.ensureFolderPath(workspaceId, createdByUserId, names: string[])` in each product backend, calling the internal ensure route.
- `specdb:pull` / `sync-registry`: pull `generated/collections.json`; write `collection` / `subcollection` on registry rows; still read leftover `collections[]` during this phase.
- Single import `POST …/spec-db/imports`: no `folderId` in the body. Placement comes only from the fetched package's `displayName`s. Registry rows are not a placement source.
- Wire `folderId` through `importTemplate` / `importSpec`, and replace the hard-coded `folderId: null` in `importPipelineFromPackage`.
- `POST …/spec-db/imports/collection` on both backends (§3.6). `slugs` optional; omit means every in-scope row of this backend's kinds. Top-level scope includes sub-collection items. Sub-collection scope does not include collection-root items.
- Unknown or wrong-collection slug → per-item `SLUG_NOT_IN_COLLECTION`, not a 400.
- Out-of-scope kind → per-item `failed` / `UNSUPPORTED_KIND`, not a 400.
- Package placement disagrees with the request → per-item `PACKAGE_PLACEMENT_MISMATCH`.
- Empty work list → HTTP 200, `results: []`, `folders: []`, no ensure.
- Group by distinct path, ensure each path once, then import sequentially, continue-on-failure.
- Stamped copy without `force` → skip, do not move. With `force` → overwrite body, leave `folderId`. `TITLE_COLLISION` stays per-item.
- `clientRequestId` is logged and not branched on. No collection replay, no `IDEMPOTENCY_CONFLICT` on this route.
- Ensure down → `FOLDER_VALIDATION_UNAVAILABLE`, abort, no rows. Depth or cap exceeded → existing folder error codes, abort.
- Global/system pipelines stay unfolderable. Catalog imports are never global.

**Out of scope**

- Changing single-import stamped-copy behavior. Clicking Import twice on one card still creates two copies (§1.11). Do not add a spec lookup to "fix" it here.
- MCP selector changes (next milestone). This milestone only has to leave `copy`'s ensure path reusable.
- Frontend, catalog UI, dropping `collections[]`.
- New tests.

**Verification.** `npm run build` in `spec-edit-be` and in `ai-studio-be`, per the verification policy.

**Done when** both builds are clean, any existing test this milestone broke is fixed, and `collections[]` is still on the tables.

---

## Agents install a collection with the existing registry tools

- **Status:** Done
- **Depends on:** imports milestone (ensure path and pulled `collections.json` exist).
- **Repos:** `spec-edit-be` (`template_registry`, `document_registry`), `ai-studio-be` (`pipeline_registry`)
- **Spec:** §1.16, §8

**Goal.** An agent can discover collection ids and install or update a pack with `list`, `tags`, `copy`, and `sync`. No new tool.

**In scope**

- `tags` returns Domain / Use Case as `tags` and a separate `collections` array (`id`, `displayName`, `description`, `parentId`, `status`, `count`). Top-level `count` includes this kind's rows in child sub-collections. A child count is that child only.
- Replace `collections: string[]` on `list` / `copy` / `sync` with `collection?` and `subcollection?`. `subcollection` requires `collection`. Selectors intersect. One-element `collections: ["ai-sdlc"]` still means `collection` for one release. Two collection ids are rejected.
- `list` output carries `collection` / `subcollection` ids.
- `copy` with `collection` ensures paths the same way HTTP import does, skips already-imported rows, and does not abort the pack. Slug-only `copy` keeps today's all-or-nothing `ALREADY_EXISTS`.
- Tag-only `copy` files each row into its own collection path (or root).
- `sync` does not install missing rows and does not move. `force` overwrites even when `sourceVersion` matches and still does not move.
- Created rows include catalog `collection` / `subcollection` ids or display names.
- Tool description on all three registries states the multi-tool rule and that `document_registry` results use `kind: "document"` for catalog specs.
- Pull upserts the collection vocab so `tags` can return labels. Without `collections.json`, labels cannot be populated — fail that sync visibly rather than returning ids with blank names.

**Out of scope**

- A `copy_collection` tool or a fourth registry.
- Workspace `folderPath` in the response.
- HTTP or UI changes.
- New tests.

**Verification.** `npm run build` in `spec-edit-be` and in `ai-studio-be`, per the verification policy.

**Done when** both builds are clean and any existing test this milestone broke is fixed.

---

## Explore imports a collection as one result

- **Status:** Done
- **Depends on:** imports milestone. May proceed in parallel with the agent milestone.
- **Repo:** `spec-edit-fe`
- **Spec:** §1.12, §1.13, §3.5 host rules, §4.5

**Goal.** The host handles `spec-db:import:collection-requested` with at most two backend calls, settles them independently, and shows one toast.

**In scope**

- Parse the collection message. Split `items` into spec/template vs pipeline.
- One collection POST to SpecX when any spec/template slug is present; one to WorkX when any pipeline slug is present. Send `collectionId`, optional `subcollectionId`, and the split `slugs`.
- `Promise.allSettled`. A rejection is that side failed.
- Thread `AbortSignal.timeout` through `fetchSpecApi` (it accepts no signal today). One timeout constant for both calls. Abort maps to that side failed with a "took too long" message.
- Map `results[]` onto iframe progress: `started` / `succeeded` / `failed` / `skipped`. `PACKAGE_PLACEMENT_MISMATCH`, `UNSUPPORTED_KIND`, and `SLUG_NOT_IN_COLLECTION` are `failed` plus their code. Do not add status enum values.
- HTTP 200 with `results: []` is not an error. Both sides empty → "Nothing to import".
- One aggregated toast (§1.13). One side failed and the other created rows → partial, and the toast names the failed side.
- Invalidate the folder list and the three resource lists after success.
- Keep single-item and Library batch listeners. Batch stays per-item import. Single card stays `POST …/spec-db/imports`.

**Out of scope**

- A folder sidebar. Lists that omit `folderId` / `unfiled` must keep returning the new items, which they already do.
- Collapsing a Library batch into the collection API.
- Calling common-be from the browser.
- Emitting the collection message (the catalog does that).
- `ai-studio-fe`.
- New tests.

**Verification.** `npm run build` in `spec-edit-fe`, per the verification policy.

**Done when** that build is clean and any existing test this milestone broke is fixed.

---

## The catalog browses a collection as the pack it imports

- **Status:** Done
- **Depends on:** catalog milestone for data. Done requires the Explore milestone, so the CTA has a host. UI work may start once the catalog milestone is deployed.
- **Repo:** `spec-db`
- **Spec:** §1.6, §1.12, §1.15, §3.5, §4.1 Catalog UI + docs

**Goal.** Opening a collection shows that pack — description, sub-folders, files — and its import button sends exactly the files this host can take, including files inside sub-collections.

**In scope**

- Dual-mode sidebar. Library keeps single-select kind. Domain and Use Case move to the Library page header and do not apply while a collection is open.
- Sidebar heading is **Collections**. Entries are the top-level registry. Deprecated collections are hidden.
- Collection page: title, description, sub-collection tiles, local kind tabs, cards without collection chips.
- Tile count is the child's **direct** host-allowlisted file count. Hide the tile at 0.
- Hero CTA count is **descendant-inclusive** and host-allowlisted. Render the breakdown, e.g. "Import 16 SpecX files — 6 here, 10 in sub-folders."
- Canonical label: `Import {n} {host} files`. No "Import Entire Folder".
- Helper text: the CTA imports the whole allowlisted pack, not the active kind tab.
- Local kind tabs filter the grid only. They must not shrink `items`.
- Zero allowlisted files → no CTA and no message.
- Standalone (no embed) renders the page and card deep links, and renders **no** pack CTA.
- Embed posts `spec-db:import:collection-requested` with `items` = membership ∩ `kinds=`.
- URL: `?collection=` opens the folder; optional `?subcollection=`. A deprecated or unknown id shows an unavailable state.
- Pagefind indexes collection and sub-collection display names and collection records. A collection hit opens the collection page.
- Update `docs/embed.md` and `docs/multi-import-plan.md`: hosts call the collection APIs, not per-item folder CRUD.

**Out of scope**

- A standalone `/import?collection=` deep link.
- Authoring new sub-collections.
- Host import logic (previous milestone).
- More than two levels, or a resource in two collections.
- New tests, including UI tests.

**Verification.** `npm run build` in `spec-db`, per the verification policy.

**Done when** that build is clean and any existing test this milestone broke is fixed. The Explore milestone must already be deployed before this one is called done, so the CTA has a host.

---

## Host registries drop the old collections array

- **Status:** Planned
- **Blocked:** not started. The add-column migration is still unreleased in this working tree, and no production pull cycle has written `collection` / `subcollection`. Dropping the column now would run in the same deploy as the add, which §4.3 forbids. Start this only after that cycle.
- **Depends on:** catalog, imports, and agent milestones all in production, plus one full pull cycle that has written `collection` / `subcollection` for every registry row.
- **Repos:** `spec-edit-be`, `ai-studio-be`
- **Spec:** §4.3 two-deploy rule, §5 step 7, §6

**Goal.** The registry has one membership shape. Old rows are not misread, and nothing still writes `collections[]`.

**In scope**

- Confirm production pullers no longer read or write `collections[]`, and Spec DB no longer emits it.
- Backfill any row whose `collection` is null and whose `collections[0]` is set.
- Drop the jsonb column in a release of its own.

**Out of scope**

- Further catalog, UI, or import behavior.
- Rewriting historical workspace `folderId` values. Existing resources stay where they are until re-import or a user move (§6).
- New tests.

**Verification.** `npm run build` in `spec-edit-be` and in `ai-studio-be`, per the verification policy.

**Done when** both builds are clean and any existing test this milestone broke is fixed.

---

## Sequencing

| Order | Milestone | May start when |
|---|---|---|
| 1a | Services can ensure a folder path by name | Immediately |
| 1b | Import backends tolerate placement without using it | Immediately, in parallel with 1a |
| 2 | The catalog publishes collections as folder names | 1b is deployed in every pulling environment |
| 3 | Imports file resources into catalog folders | 1a is deployed, and 2 has been pulled |
| 4a | Agents install a collection with the existing registry tools | 3 is deployed |
| 4b | Explore imports a collection as one result | 3 is deployed, in parallel with 4a |
| 5 | The catalog browses a collection as the pack it imports | 2 is deployed to start; 4b must be deployed to call it done |
| 6 | Host registries drop the old collections array | 2, 3, and 4a have completed a production pull cycle |

Do not reorder 1b ahead of 2. That is the `.strict()` parser gate.

Within milestones 1b, 3, and 4a, `spec-edit-be` and `ai-studio-be` ship together. A mixed pack is wrong if only one backend knows the new shape.

## Shared risks

- **Stale host registry.** A slug published after the last pull fails that item only (`SLUG_NOT_IN_COLLECTION`). Do not "fix" this by 400-ing the pack.
- **Path reuse.** An existing user folder named `AI-SDLC` is reused. v1 does not stamp folders with catalog origin (§1.10).
- **Single-import duplicates.** Collection import skips stamped copies; the single-item endpoint does not. Importing a pack and then clicking one card can duplicate that file. Left for a follow-up on purpose (§1.11).
- **No collection replay.** Retries are safe because of stamped-skip, not because `clientRequestId` is replayed (§1.14).
- **Best-effort across backends.** One of SpecX, WorkX, or common-be can fail mid-pack. Empty folders left behind are acceptable; do not add a compensating delete.
- **Sub-collections have no content yet.** The four migrated ids are top-level only. Milestones must not invent children to make tile UI look populated.

## Explicitly not in this plan

- De-duplicating the single-item import endpoint.
- Standalone `/import?collection=`.
- A folder sidebar in `spec-edit-fe`.
- Collapsing a Library multi-select into the collection API.
- `packageVersion: "2"`, a request-log table, or catalog revision checksums.
- Any change to `ai-studio-fe`.
- New test cases. Manual confirmation of `folder-spec.md` §7 happens later, outside this plan.
