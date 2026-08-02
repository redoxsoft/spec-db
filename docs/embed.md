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

## Import contract (Spec DB → host)

When the user clicks **Import** with `embed=true`, Spec DB posts to `window.parent`:

```json
{
  "type": "spec-db:import:requested",
  "kind": "template",
  "slug": "feature-spec-lite"
}
```

Host responsibilities (same for SpecX and WorkX):

1. Listen for `message` and check `event.origin` against the Spec DB origin allowlist.
2. Call the host backend with `{ kind, slug }` (never a client-supplied content URL).
3. Backend builds the package URL from a trusted Spec DB base env, e.g.  
   `{SPEC_DB_BASE_URL}/generated/packages/{kind}/{slug}.json`, then fetches, validates, maps, and creates.
4. Continue auth / workspace / create inside SpecX or WorkX.

Spec DB does **not** send full document bodies over `postMessage`. Hosts must not fetch arbitrary client-supplied URLs.

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

Without `embed=true`, Import opens a host deep link in a new tab:

- Specs / templates → `VITE_SPECX_IMPORT_BASE` (default `https://specx.redoxsoft.com/import`)
- Pipelines → `VITE_WORKX_IMPORT_BASE` (default `https://workx.redoxsoft.com/import`)

Query params: `kind`, `slug` only.

## Origins & framing

| Concern | Guidance |
|---------|----------|
| Spec DB deploy origin | Distinct host, e.g. `specdb.redoxsoft.com` |
| Spec DB CSP | `public/_headers` → `frame-ancestors 'self' https://*.redoxsoft.com http://localhost:* http://127.0.0.1:*` |
| Host CSP | Allow Spec DB origin in `frame-src` / `child-src` |
| `postMessage` target | Spec DB uses `ancestorOrigins` / `document.referrer` (host parent) — not `*` in production if avoidable |
| Host receive check | Validate `event.origin` is the Spec DB site |

## View Source

Detail **View Source** links to the git-backed authoring tree:

`https://github.com/redoxsoft/spec-db/tree/main/resources/{specs\|templates\|pipelines}/<slug>`

Override with `VITE_GITHUB_TREE_BASE`.

## Env knobs

See [`.env.example`](../.env.example).
