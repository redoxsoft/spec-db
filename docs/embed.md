# Embedding Spec DB (hosts)

Spec DB is a static SPA on its own origin (e.g. `https://specdb.redoxsoft.com`). SpecX / WorkX embed it in a **fixed-height iframe**; Spec DB scrolls internally.

## iframe `src` examples

| Host | Example `src` |
|------|----------------|
| WorkX (pipelines only) | `https://specdb.example/?embed=true&kinds=pipeline` |
| SpecX (specs + templates) | `https://specdb.example/?embed=true&kinds=spec,template` |
| Unscoped embed | `https://specdb.example/?embed=true` |

Local mock (dev server or preview):

- WorkX-style: [http://localhost:7876/host-mock.html](http://localhost:7876/host-mock.html) (default preset)
- Or open `/?embed=true&kinds=pipeline` directly

`kinds` is a **host allowlist** (comma-separated). It is distinct from the user browse filter `kind`.

## Import contract

Source of truth for TypeScript shapes: [`src/lib/importHandoff.ts`](../src/lib/importHandoff.ts). Identity only — no bodies, no `contentUrl`, no workspace/auth, no host policy fields.

### Spec DB → host: single item (compat)

When the user clicks **Import** in the detail modal with `embed=true`, Spec DB posts to `window.parent`:

```json
{
  "type": "spec-db:import:requested",
  "kind": "template",
  "slug": "feature-spec-lite"
}
```

Hosts may treat this as a one-item batch (`batchId` generated on the host if needed).

### Spec DB → host: batch (embed-only)

With `embed=true`, the catalog supports multi-select + **Import (N)**. Spec DB posts one message:

```json
{
  "type": "spec-db:import:batch-requested",
  "batchId": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    { "kind": "pipeline", "slug": "project-discovery" },
    { "kind": "pipeline", "slug": "milestone-builder" }
  ]
}
```

Rules:

- `items.length >= 1`; order is the import order.
- `batchId` is Spec DB–generated; hosts echo it in progress/completed.
- Host kind allowlist still wins (WorkX: `pipeline`; SpecX: `spec` \| `template`).
- Batch multi-select is **embed-only**. Standalone keeps detail-modal / deep-link **single** import (`kind` + `slug`).

### Host → Spec DB: progress + completed (recommended)

Hosts should emit these while running a batch so Spec DB can later clear selection / show per-item status. Spec DB UI does **not** consume them yet (fire-and-forget after Import (N)).

```ts
type SpecDbImportBatchProgress = {
  type: 'spec-db:import:batch-progress'
  batchId: string
  index: number // 0-based
  total: number
  item: { kind: 'pipeline' | 'spec' | 'template'; slug: string }
  status: 'started' | 'succeeded' | 'failed' | 'skipped'
  attempt?: number // 1-based; optional
  error?: { code?: string; message: string }
}

type SpecDbImportBatchCompleted = {
  type: 'spec-db:import:batch-completed'
  batchId: string
  results: Array<{
    item: { kind: 'pipeline' | 'spec' | 'template'; slug: string }
    status: 'succeeded' | 'failed' | 'skipped'
    error?: { code?: string; message: string }
  }>
}
```

Do not put host resource ids (pipeline id, document id) in these messages. Spec DB validates parent origin when it starts listening.

### Host responsibilities

1. Listen for `message` and check `event.origin` against the Spec DB origin allowlist.
2. Accept `batch-requested` and/or legacy `import:requested`.
3. Call the host backend **one item at a time** with `{ kind, slug }` (never a client-supplied content URL).
4. Backend builds the package URL from a trusted Spec DB base env, e.g.  
   `{SPEC_DB_BASE_URL}/generated/packages/{kind}/{slug}.json`, then fetches, validates, maps, and creates.
5. Continue auth / workspace / create inside SpecX or WorkX.
6. Optionally `postMessage` progress/completed back to the Spec DB iframe (`event.source`).

Spec DB does **not** send full document bodies over `postMessage`. Hosts must not fetch arbitrary client-supplied URLs.

### Host policy conventions (not in the message)

| Policy | Suggested default |
|--------|-------------------|
| Execution | Sequential — one BE call at a time |
| Continue on failure | `true` — record failure, import next |
| Retries | Retry transient errors; no retry on kind/validation failures |
| Idempotency | One `clientRequestId` per item; **reuse across retries** of that item |
| Concurrent batches | Ignore or queue; never parallelize items in a batch |
| Standalone `/import` | Batch is **embed-only**; deep link stays single `kind` + `slug` |

### Package URL shape (host BE)

```text
{SPEC_DB_BASE_URL}/generated/packages/{kind}/{slug}.json
```

Examples:

- `/generated/packages/template/feature-spec-lite.json`
- `/generated/packages/spec/corporate-ramayana.json`
- `/generated/packages/pipeline/my-pipeline.json`

Preview UI JSON remains at `/generated/resources/<slug>.json` (not the import artifact).

Package body shapes (v1):

- **template** — `template.guidance` + full `template.outline[]` (`key`, `title`, `guidance`, `cardinality`, `children`; omitted authoring cardinality → `{1,1}`; `children` always an array).
- **pipeline** — `pipeline.inputVarDefinitions`, `pipeline.iteratorFields` (default `[]`), `pipeline.steps[]` with `key`, `name`, `instructions` (from `tasks/<key>.md`), `iteratorFields` (default `[]`). Flat steps only; no WorkX `type` / `referenceId`.
- **spec** — `spec.sections[]` tree from markdown at package time (`key`, `title`, `blocks`, `children`). Block types: `paragraph`, `bullet_list`, `numbered_list`, `code_block`, `callout`, `table`, `divider`. Unsupported constructs degrade to `paragraph` (hard structural errors still fail `npm run check`).

JSON Schema mirrors: [`schemas/template-package.schema.json`](../schemas/template-package.schema.json), [`schemas/pipeline-package.schema.json`](../schemas/pipeline-package.schema.json), [`schemas/spec-package.schema.json`](../schemas/spec-package.schema.json).

### Standalone (no iframe)

Without `embed=true`, Import opens a host deep link in a new tab (single item only):

- Specs / templates → `VITE_SPECX_IMPORT_BASE` (default `https://specx.redoxsoft.com/import`)
- Pipelines → `VITE_WORKX_IMPORT_BASE` (default `https://workx.redoxsoft.com/import`)

Query params: `kind`, `slug` only. No multi-slug batch deep link.

## Origins & framing

| Concern | Guidance |
|---------|----------|
| Spec DB deploy origin | Distinct host, e.g. `specdb.redoxsoft.com` |
| Spec DB CSP | `public/_headers` → `frame-ancestors 'self' https://*.redoxsoft.com http://localhost:* http://127.0.0.1:*` |
| Host CSP | Allow Spec DB origin in `frame-src` / `child-src` |
| `postMessage` target | Spec DB uses `ancestorOrigins` / `document.referrer` (host parent) — not `*` in production if avoidable |
| Host receive check | Validate `event.origin` is the Spec DB site |
| Spec DB receive check | Validate `event.origin` is the embedding parent (when listening for progress/completed) |

## View Source

Detail **View Source** links to the git-backed authoring tree:

`https://github.com/redoxsoft/spec-db/tree/main/resources/{specs\|templates\|pipelines}/<slug>`

Override with `VITE_GITHUB_TREE_BASE`.

## Env knobs

See [`.env.example`](../.env.example).
