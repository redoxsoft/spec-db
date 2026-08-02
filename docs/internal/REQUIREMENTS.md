# Spec DB — Requirements

**Internal only** — not linked from public contributor docs. Authoring for outsiders lives in [CONTRIBUTING.md](../../CONTRIBUTING.md), [tags/README.md](../../tags/README.md), and `schemas/`.

**Status:** Draft  
**Last updated:** 2026-08-01  
**Related products:** SpecX (`spec-edit-be` / SpecX FE), WorkX (`ai-studio-be` / AI Studio FE)  
**Stack assumption:** Node.js / React / TypeScript; recommended tooling in §18  
**MVP posture:** Lightweight catalog, low contributor volume, full editorial control, **&lt;50 resources**, speed over enterprise overhead

---

## 1. Purpose

Spec DB promotes **spec-driven development without constraining or locking teams to any single AI agent**. It is an open-source, self-contained web catalog of **specs**, **templates** (rules/context), and **pipelines** (orchestration) — a public library of best practices and ready-to-use resources that humans and any compatible agent can consume.

It is a **git-backed community gallery**: resources live as readable files in this repository. Contributors propose resources via PRs. The site makes those resources **searchable**, **browsable by tags**, and **importable** into SpecX/WorkX via deep links (and usable with other agents via published portable formats).

The product framing follows Redoxsoft’s AI-native SDLC: structured specifications (what to build), shared rules/context (how to build), and process orchestration (how work moves from request to completion). See [../ai-native-sdlc-whitepaper.md](../ai-native-sdlc-whitepaper.md). Spec DB is the open catalog layer of that vision — agent-agnostic by design.

Spec DB must work as a **standalone website** and as an **embeddable surface** inside SpecX/WorkX (frame/iframe), so hosts can expose the catalog without rebuilding browse/search UX.

Spec DB does **not** implement SpecX/WorkX authentication, workspace selection, or the actual copy into a workspace. Import hands off to those host apps, which **fetch Spec DB JSON and map it into their own models inside SpecX/WorkX** (see §8, §9.3). Spec DB publishes **external formats** (Zod + JSON Schema + docs), not a host mapping library and not a proprietary agent runtime.

There is **no runtime Spec DB backend** (no Node API server, no database, no Elasticsearch/Algolia). Validation, indexing, and “static API” JSON generation happen at **build time**; browse/search run in the **browser** against static artifacts.

---

## 2. Goals

1. **Agent-agnostic spec-driven practice** — Promote structured specs, rules, and orchestration as the durable context for delivery, without requiring a specific coding agent or locking content to one vendor runtime.
2. **Library of ready-to-use resources** — Grow a curated collection of best-practice specs, templates/rules, and pipelines that teams can import and use directly with any agent (or with SpecX/WorkX).
3. **Readable source of truth** — Each resource is human-editable content (markdown for prose) plus JSON metadata, optimized for external contribution, not for dumping product-internal schemas.
4. **Mappable to products** — Shapes are rich enough that SpecX/WorkX (and other hosts) can transform them into internal structures and fill missing system fields at import time.
5. **Controlled taxonomy** — Tags are centrally defined; resources may only reference existing tags.
6. **Build-time quality** — npm scripts validate resources, enforce the tag registry, and produce search/browse indexes during CI/build.
7. **Zero runtime backend** — Catalog is served as a static site; heavy lifting is SSG + client-side indexing/filtering.
8. **Browse/search UI** — Users can find resources by text search and by tags (including category/folder-style presentation where tags are configured for that).
9. **First-class embeddability** — The same UI (or well-defined parts of it) works standalone and when embedded in SpecX/WorkX via iframe/frame.
10. **Import affordance** — Detail pages expose Import into SpecX (specs, templates) and WorkX (pipelines), with embed-aware handoff.
11. **Self-contained** — Base catalog data ships in this repo; no runtime dependency on SpecX/WorkX backends to render the catalog.

---

## 3. Non-goals (out of scope for this project)

1. SpecX/WorkX authentication, workspace listing, or copying a resource into a workspace.
2. Storing or requiring product-internal JSON schemas (`SpecDocument`, private template forks, Mongo pipeline docs with workspace IDs, etc.) as the catalog format.
3. Runtime CMS / admin UI for publishing without git/PRs (v1 assumes PR-based contribution).
4. A runtime Spec DB API server, database, or hosted search cluster (Elasticsearch, Algolia, etc.).
5. Executing pipelines or editing specs/templates inside Spec DB.
6. Multi-tenant hosting of private/org-only catalogs (v1 is a public open-source catalog).
7. Ratings, comments, or user accounts on Spec DB itself (may be reconsidered later).
8. Guaranteeing round-trip fidelity with every SpecX/WorkX internal feature (e.g. section references, nested pipeline steps) unless explicitly supported by the external schema.
9. Implementing the host-side iframe chrome, auth bridge, or workspace picker (Spec DB only needs to be embed-safe and communicate via an agreed contract).
10. MDX (or other React-coupled content formats) for resource bodies — content must remain a portable data format.
11. First-class **bundle** resource kind (use tags + prose links instead).
12. **Unstructured** specs/templates (v1 requires heading/section conventions for reliable import).
13. Export tooling from SpecX/WorkX into Spec DB (manual PR authoring for v1).
14. Per-resource SemVer, host compatibility matrices, or i18n.
15. Nested pipeline steps in catalog content.
16. Binary/media in resources (local files or external image/URL embeds).
17. **`@redoxsoft/spec-db-mapper` (or any npm package that maps Spec DB → SpecX/WorkX IR)** — **DO NOT implement.** Hosts own import adapters; Spec DB owns external schemas only (`src/mapper/` + `schemas/` + CONTRIBUTING).

---

## 4. Architecture (static site / no runtime backend)

### 4.1 Principle

The catalog is **read-heavy** and **git-backed**. CI/CD acts as the “static backend”: Node.js scripts process `resources/` at build time; the React app is a static SPA that loads precomputed JSON (and a client-side or chunked static search index). This fits standalone hosting and iframe embed without backend cold starts.

### 4.2 End-to-end flow

1. **Authoring** — Contributor merges a PR with `metadata.json` + content (`content.md`, and/or `content.json` + `tasks/*.md`).
2. **CI/Build** — `validate` checks tags/schemas/markdown conventions; `index` extracts plain text, emits static JSON APIs and the search index; Vite (or equivalent) builds the React app.
3. **Deployment** — App + `public/generated/**` deploy to a static host (e.g. Cloudflare Pages, GitHub Pages).
4. **Client UX** — User opens standalone site or host iframe; app fetches lite catalog / tag tree; filters in memory; search uses **Pagefind** (chunked static index); Import uses `postMessage` (embed) or host deep link (standalone).

### 4.3 Build-time processing (“static backend”)

Node scripts (`validate`, `index`) are the only place that walks the full resource tree:

| Step | Responsibility |
|------|----------------|
| Parse & validate | Validate `metadata.json` with **zod** in `src/mapper/`; enforce central `tags/` registry (incl. max hierarchy depth, no deprecated tags); parse markdown via **AST** (not regex); extract headings, section keys, and plain text for search; **Shiki** highlight code → static HTML |
| Emit browse APIs | Write precomputed JSON under `public/generated/` (see §4.4), including sanitized + highlighted preview HTML |
| Emit search artifacts | After app build, run **Pagefind** as a postbuild step over `dist` (chunked static index) |
| App build | Bundle React UI that consumes those static artifacts |

**Markdown parsing (decided):** use an AST pipeline (`unified` + `remark` / `rehype`) during `validate`/`index`. Do **not** extract `<!-- key: … -->` or strip prose with ad-hoc regex — regex breaks on comments inside code fences and multiline edge cases.

**Validation stack:** **zod** in `src/mapper/` is the source of truth; emit JSON Schema via `npm run schema:json` → `schemas/` for non-TypeScript contributors.

### 4.4 Generated static APIs (browse)

Emitted into `public/generated/` (names illustrative; paths stable once frozen):

| Artifact | Purpose |
|----------|---------|
| `catalog-lite.json` | Array of all resources **without** heavy bodies: `slug`, `title`, `summary`, `tags`, `kind` (and other card fields). Powers home/browse with a single small fetch |
| `tags.json` | Resolved tag registry / tree for UI |
| `by-tag/<tagId>.json` | Pre-filtered resource lists (lite records) per tag |
| `resources/<slug>.json` | Full detail payload for one resource: metadata + parsed/canonical content suitable for preview **and** for host import (`contentUrl`) |
| Pagefind index | Chunked static search index under the deployed site (postbuild) |

**Do not commit** generated indexes or `public/generated/**` to git — **CI-only generation** before deploy (avoids bloat and merge conflicts).

### 4.5 Search (Pagefind — decided)

**v1 search engine is Pagefind.** It indexes built output at postbuild (`npx pagefind --site dist` or equivalent) and downloads only tiny index fragments matching the user’s query. That avoids loading a full in-memory MiniSearch/FlexSearch index on first paint — especially important in **narrow embed** views.

Search corpus includes title, summary, tag labels/descriptions, and plain text extracted from markdown (and task prompts) via the AST pipeline.

MiniSearch/FlexSearch remain a documented fallback only if Pagefind integration proves unblockable; they are not the v1 default.

### 4.6 Browse (instant client filtering)

1. On Browse, fetch `catalog-lite.json` + `tags.json` (cache aggressively; immutable deploy URLs or short cache with deploy busting).
2. Filter/intersect in browser memory by `kind` and tags (e.g. `domain.engineering` ∩ `use-case.prd`) with no round-trips.
3. Optional: use `by-tag/<tagId>.json` for deep links into a single tag when the full lite catalog is undesirable to download (usually unnecessary if lite catalog stays small).
4. Detail pages fetch `resources/<slug>.json` (or route-level code-split equivalent).

This keeps the **embed iframe** fast: static host + JSON + `postMessage`, no Spec DB server.

### 4.7 Repo shape (single package)

**No monorepo / no pnpm workspaces / no Turborepo.** One root `package.json`: Vite app, `scripts/` (validate/index), and Zod schemas in `src/mapper/` live in the same project.

**Do not** publish `@redoxsoft/spec-db-mapper` or any Spec DB → host IR mapping package. Contributors and hosts consume **documented external formats** (Zod, `schemas/*.schema.json`, CONTRIBUTING). SpecX/WorkX implement their own import adapters so host field renames stay in those apps. Deploy the site on a **distinct origin** (e.g. `specdb.redoxsoft.com`), decoupled from host app release cycles.

---

## 5. Resource types

### 5.1 Common concepts

| Concept | Meaning |
|--------|---------|
| **Resource** | One catalog entry: a spec, template, or pipeline |
| **Content** | Human-oriented body (`content.md`, and/or JSON + `tasks/*.md`) |
| **Metadata** | Catalog-facing fields in `metadata.json` |
| **Kind** | Discriminator: `spec` \| `template` \| `pipeline` |
| **Slug** | Canonical resource identity; matches directory name |

Resources are **content-oriented**: titles, outlines, section text, task prompts, input variable *hints*, etc. They omit product bookkeeping such as workspace IDs, private template forks, document versions, run state, Firebase UIDs.

**Identity:** **slug-only**. No separate UUID in Spec DB. The directory name / `metadata.slug` is the stable key for routing (`/specs/my-cool-spec`) and import targets. Renaming a slug is a breaking change.

At import time, hosts are expected to:

- Assign new product IDs
- Bind to a chosen workspace
- Create private template snapshots where SpecX requires them
- Provision referenced tasks for pipelines
- Apply product defaults for fields absent from Spec DB

### 5.2 Spec

A **spec** is a filled-in (or starter) document: hierarchical sections with human content, suitable for importing as a SpecX document.

**Authoring (decided):** default body is **`content.md`** using **GFM + GitHub-style alert blockquotes** (e.g. `> [!NOTE]`). **No MDX.**

- Headings map to the section tree
- GFM tables, lists, fenced code
- Optional template alignment via HTML comments on headings:  
  `## Project Goals <!-- key: goals -->`  
  Build-time parser extracts `key` without polluting rendered output
- Optional soft reference to a Spec DB template slug in metadata

**Not required in Spec DB:** SpecX `nodesById` UUIDs, `templateId` of a private fork, `version`, workspace fields, writing-style IDs.

**Import target (host):** SpecX document create/update (or dedicated import API): fetch `resources/<slug>.json` and map with a **host-owned** adapter.

**v1 constraints:** Specs must use standard markdown headings/sections (no unstructured freeform bodies). **No images or other media** — neither repo binaries nor external `![](url)` / media embeds.

### 5.3 Template

A **template** defines structure and authoring guidance for new specs: outline, descriptions, cardinality-like constraints, document mode if needed.

**Authoring (decided):** **JSON structure in `content.json`.** Unstructured templates are **out of scope** for v1.

| Field | Level | Meaning |
|-------|-------|---------|
| `guidance` | Template (`content.json` root) | Longer importable instructions → SpecX `Template.guidance` (required). Distinct from short `metadata.summary` used on cards. |
| `outline[]` | Template | Tree of nodes |
| `outline[].key` | Node | Stable machine key; **unique tree-wide** |
| `outline[].title` | Node | Display title |
| `outline[].guidance` | Node | Per-section authoring hint (markdown-capable string). Spec DB name stays **`guidance`**; mapper → SpecX outline `description`. |
| `outline[].cardinality` | Node | `{ min, max }` with `max` nullable (= unbounded). **Omitted → `{ min: 1, max: 1 }`**. Reject when `max !== null && max < min`. |
| `outline[].children` | Node | Nested outline (optional). **No max-depth cap in v1** (SpecX allows deeper trees; revisit After MVP if imports break). |

**Not required:** SpecX `kind` (`global`/`local`/`private`), `sourceTemplateId`, workspace ownership; catalog UI badges for cardinality (schema/validate first — see phased-plan **M7.1**).

### 5.4 Pipeline

A **pipeline** is an ordered workflow of tasks with human-readable prompts and input-variable documentation.

**Authoring (decided):**

- **`content.json`** — **flat** steps (task key refs only; no nested pipeline steps), pipeline-level `iteratorFields`, `inputVarDefinitions`, and per-step `iteratorFields` where needed
- **`tasks/<task-key>.md`** — task prompt/instructions (narrative markdown; build compiles into the detail JSON)

Align field names with WorkX (`ai-studio-be` / `ai-studio-fe`):

| Field | Level | Meaning |
|-------|-------|---------|
| `inputVarDefinitions[]` | Pipeline | `{ key, description?, suggestedDefault? }` — caller-supplied hints |
| `iteratorFields[]` | Pipeline | Keys that fan out **full pipeline runs** (one run per array value) |
| `steps[].iteratorFields[]` | Step | Keys that fan out **this step** (one execution per index; multi-key zipped) |
| `tasks/<key>.md` | Task file | Source of `${var}` placeholders (tasks have **no** separate definitions object) |

**Do not** store pageful task prompts inside JSON. Long, readable bodies live in markdown files (same spirit as specs’ `content.md`). JSON holds structure and input metadata only.

**There is no `iterable: boolean` on definitions** — iterability is membership in `iteratorFields` (pipeline and/or step), matching WorkX.

**Input variables (decided — stricter than WorkX on coverage):**

- Task markdown may use `${var}` placeholders for caller-supplied values.
- Every discoverable `${var}` across a pipeline’s `tasks/*.md` **must** have a matching `inputVarDefinitions` entry, or `validate` **fails**. (WorkX treats definitions as optional runtime hints; Spec DB requires documented inputs for catalog quality.)
- Exclude implied/system keys from the coverage check — same denylist as WorkX: `WORKSPACE.TITLE`, `WORKSPACE.DESCRIPTION`, `WORKER.INSTRUCTIONS`, `SPEC.DOCUMENT_TITLE`, `SPEC.DOCUMENT_VERSION`, `SPEC.TARGET_TITLE`, `SPEC.TARGET_SUMMARY`, `SPEC.CONTEXT_MARKDOWN`, `SPEC.CONTEXT_JSON`. Well-known caller keys `SPEC.DOCUMENT_ID` / `SPEC.SECTION_ID` **are** documentable.
- Keys listed in pipeline or step `iteratorFields` must also appear in `inputVarDefinitions` (and be referenced from prompts unless system-excluded).
- Orphan definitions (declared but never referenced) **fail** CI (keep catalogs tidy).
- Catalog UI shows inputs **readonly** at **pipeline** level (all definitions + pipeline fan-out badges) and **task** level (placeholders used in that task + step fan-out badges). Spec DB does not collect run values.

**Nested pipeline steps (`type: "pipeline"`) are forbidden in v1** — keeps the WorkX mapper and UI simple.

**Not required:** WorkX `workspaceId`, `createdByUserId`, Mongo `_id`, `isGlobal`, `templateInternalId`, archived flags, run/iterator runtime state.

### 5.5 Relationships between resources

| Relationship | Example | Notes |
|--------------|---------|--------|
| Spec → Template | Spec authored from a catalog template | `templateSlug` in metadata; must resolve or CI fails |
| Related resources | “Used with” curated links | Manual `relatedSlugs[]` in metadata; must resolve or CI fails |
| Pipeline → Spec/Template | Pipeline expects a SpecX document/section | Documented via `inputVarDefinitions`, not hard coupling |
| Pack / suite | “PRD pack” = template + sample spec + pipeline | **No bundle kind** — use a tag (e.g. `pack.prd-suite`) + prose / `relatedSlugs` |

---

## 6. Repository layout

### 6.1 Proposed structure

```text
docs/                          # Project docs (this file, contributing, mapping)
tags/
  tags.json                    # canonical tag definitions
resources/
  specs/
    <slug>/
      metadata.json            # required — catalog metadata + tags
      content.md               # required for specs — GFM body
      README.md                # optional contributor notes (not imported)
  templates/
    <slug>/
      metadata.json
      content.json             # outline tree, keys, cardinality, inline guidance strings
  pipelines/
    <slug>/
      metadata.json
      content.json             # flat steps, vars, references to tasks
      tasks/
        <task-key>.md          # task prompts
src/                           # React/Vite app + mapper schemas/utils (single package)
scripts/                       # validate, index CLIs
public/generated/              # CI-emitted static APIs + search index (gitignored)
```

Requirements:

1. One directory per resource; **directory name = slug**.
2. **`metadata.json` only** for catalog machine fields — **no markdown front matter** (avoids drift and split sources of truth).
3. Central tag definitions outside individual resources.
4. Schemas (Zod + emitted JSON Schema under `schemas/`) used by `validate` and documented for contributors — **not** an npm mapping package.
5. Generated artifacts under `public/generated/` are **build outputs**, not hand-edited source.
6. No binary media under `resources/` (and no media embeds in markdown).

### 6.2 Metadata (required fields — draft)

| Field | Description |
|-------|-------------|
| `slug` | Canonical id; must match directory name; unique across catalog |
| `kind` | `spec` \| `template` \| `pipeline` |
| `title` | Display title |
| `summary` | Short description for cards/search snippets |
| `tags` | Array of tag ids from the central registry only |
| `authors` | Optional contributor credits |
| `license` | Optional; default catalog license if omitted |
| `createdAt` / `updatedAt` | Optional ISO dates for display/sort (no per-resource SemVer) |
| `schemaVersion` | Spec DB content-schema version this resource conforms to |
| `featured` | Optional boolean; editorial “featured” flag lives here (not a separate config file) |
| `templateSlug` | Optional (specs): related Spec DB template slug — must exist if set |
| `relatedSlugs` | Optional curated related resource slugs — each must exist if set |

Content file presence is by convention (`content.md`, `content.json`, `tasks/*.md`) rather than duplicated in front matter. Catalog versioning is via **git/release tags** (and optional `updatedAt`), not SemVer per resource.

### 6.3 Metadata (optional / UI helpers)

- `icon` (optional; no image assets — prefer emoji/icon name if used)
- `changelog` or pointer to CHANGELOG in the resource folder

### 6.4 Content authoring rules (decided)

| Kind | Body | Notes |
|------|------|-------|
| Spec | `content.md` | GFM + alerts; section keys via `<!-- key: ... -->`; **no media**; structured headings required |
| Pipeline | `content.json` + `tasks/*.md` | **Flat** task graph only; prompts in markdown |
| Template | `content.json` | Structure/cardinality + **inline `guidance` strings** on nodes |
| All | `metadata.json` | **Front matter forbidden** |

Build/validate parses markdown via **unified/remark AST**, sanitizes, and runs **Shiki at build time** so `resources/<slug>.json` (or sibling HTML) carries highlighted code with zero client Shiki bundle. IR need not be committed.

**Title drift (decided):** if `content.md` has an H1, it **must exactly match** `metadata.title` or CI fails.

---

## 7. Tag system

### 7.1 Principles

1. Tags are **not arbitrary**. A resource’s `tags[]` may only contain ids defined in the central registry.
2. Adding a new tag requires a PR that **defines the tag first** (or in the same PR before use), with purpose and applicability.
3. Validation fails the build if a resource references an unknown tag, a tag not allowed for its `kind`, or a **deprecated** tag. **No grace period** — when deprecating a tag, update all affected resources in the same PR (&lt;50 items makes this cheap).
4. **Max hierarchy depth is 2** (e.g. Category → Subcategory). `validate` rejects `parentId` chains deeper than two levels. Deeper trees degrade quickly in narrow embedded sidebars.

### 7.2 Tag definition fields (draft)

| Field | Description |
|-------|-------------|
| `id` | Stable machine id (e.g. `domain.engineering`, `use-case.prd`) |
| `displayName` | Human label |
| `description` | Purpose of the tag; when to use it |
| `applicableKinds` | Subset of `spec` \| `template` \| `pipeline` |
| `ui` | How to present: e.g. `facet`, `category`, `folder`, `badge`, `hidden` |
| `parentId` | Optional parent for hierarchical browse |
| `order` | Optional sort weight for category/folder UIs |
| `aliases` | Optional deprecated ids that map to this tag during migration |
| `status` | `active` \| `deprecated` |

### 7.3 Tag usage cases

| Case | Behavior |
|------|----------|
| Browse by category | Tags with `ui: category` or `folder` drive nav |
| Multi-facet filter | Client-side intersection over `catalog-lite.json` |
| Search boost | Tag display names/descriptions included in search index |
| Kind restriction | e.g. tag only on pipelines — rejected on specs |
| Hierarchy | At most two levels; child tags nest under parent in UI |
| Rename | Change `displayName`; keep `id` stable |
| Retire | Set `status: deprecated`; forbid new uses; optional migration via `aliases` |

### 7.4 Anti-cases

- Free-text tags on resources
- Using directory nesting as the only taxonomy without registry entries
- Overloaded tags with unclear purpose
- Tag trees deeper than two levels

---

## 8. Content schemas (external shapes)

### 8.1 Requirements

1. Publish schemas/conventions for:
   - `metadata.json` (all kinds)
   - JSON content files where used
   - Markdown authoring conventions (heading levels, GitHub alerts, `<!-- key: -->`, `tasks/*.md` naming)
2. Formats optimize for **author clarity** and a **stable external contract**, not 1:1 parity with SpecX/WorkX DB models.
3. Spec DB publishes **external shapes only** (`src/mapper/` Zod, `schemas/*.schema.json`, CONTRIBUTING field-mapping notes). **Host apps own** Spec DB → SpecX/WorkX IR adapters. **`@redoxsoft/spec-db-mapper` is out of scope — DO NOT implement.**
4. Version schemas (`schemaVersion`); breaking changes require migration notes and validate-script support for N and N-1 if practical. No host product compatibility matrix in v1.
5. Validate/index scripts compile markdown (+ metadata) via AST into canonical IR → `resources/<slug>.json`.
6. Preview HTML is produced with `rehype-sanitize` + **build-time Shiki** (static highlighted HTML; no client Shiki bundle).

### 8.2 Content model cases to cover

**Specs**

- Empty starter vs fully written sample
- Structured (keys in HTML comments, AST-extracted) vs freeform
- GFM tables, lists, code, `> [!NOTE]` / `> [!WARNING]` / `> [!TIP]` / `> [!CAUTION]` / `> [!IMPORTANT]`
- Specs that reference another Spec DB template via `templateSlug`
- Keys must not be taken from HTML comments that appear only inside fenced code blocks

**Templates**

- JSON outline with nested nodes, unique keys, cardinality (`min`/`max`, default fixed 1/1), per-node `guidance` strings
- Required template-level `content.guidance` plus short `metadata.summary`
- No unstructured templates in v1; no outline depth cap in v1
- Field rename on import: node `guidance` → SpecX `description`

**Pipelines**

- Single-task and multi-task **flat** pipelines
- Fan-out via `iteratorFields`
- Nested pipeline steps — **forbidden** in v1 (`validate` fails)
- Compilation of `tasks/*.md` into detail JSON (per-task preview HTML)
- `${var}` in tasks must match `inputVarDefinitions` (see §5.4); orphan definitions fail
- Variable naming conventions for SpecX-oriented vars

**Cross-cutting**

- English-only (no i18n)
- Binary/media — **forbidden** (repo files and external URLs)
- Secrets — forbid; validate should reject obvious secret patterns where feasible
- Sanitization + build-time Shiki for preview HTML

---

## 9. Embeddability (first-class)

### 9.1 Principle

Embeddability is not a polish item: **architecture, routing, chrome, and Import behavior** must assume two runtimes from day one:

1. **Standalone** — full Spec DB site (own origin, own shell/nav).
2. **Embedded** — Spec DB (or a subset of routes) loaded inside SpecX/WorkX as a **frame/iframe**.

Static hosting + client-side catalog makes embed especially suitable: no Spec DB backend cold starts; parent uses `postMessage`.

### 9.2 Functional requirements

| Requirement | Detail |
|-------------|--------|
| Same catalog | Embedded and standalone consume the same build artifacts |
| Embeddable surfaces | Browse, search, resource detail (home optional) |
| Chrome modes | Standalone shows Spec DB shell; embed (`?embed=true` or equivalent) hides redundant chrome |
| Kind scope | Hosts pass `kinds=` allowlist so only relevant resource kinds appear (e.g. WorkX → pipelines only) |
| Deep links | Stable entry URLs e.g. `/pipelines?tag=…`, `/specs/<slug>` |
| Import in embed | `postMessage` to parent with `{ kind, slug, contentUrl }` — iframe stays presentational |
| Import standalone | Feature-detect non-embed: open host import route (`target="_blank"`) with slug/query |
| Auth | Spec DB does not auth inside the iframe; host handles auth after Import |
| Layout | Host provides **fixed-height** iframe; Spec DB **scrolls internally** (no continuous height `postMessage` — avoids thrash) |
| Performance | Lite JSON + chunked/static search; usable in narrow iframe widths |

### 9.3 Import / embed payload (decided)

When the user clicks **Import** in embed mode, Spec DB posts to the parent, e.g.:

```json
{
  "type": "spec-db:import:requested",
  "kind": "spec",
  "slug": "my-cool-spec",
  "contentUrl": "https://<spec-db-host>/generated/resources/my-cool-spec.json"
}
```

The host fetches `contentUrl`, runs its **own** Spec DB → product mapper, then continues auth/workspace/create. Spec DB does not push full document bodies through `postMessage` by default (keeps messages small and cacheable via HTTP).

Standalone fallback: navigate/open SpecX or WorkX import URL including `slug` (and optionally `contentUrl`) so the host can fetch the same static JSON.

### 9.4 Technical constraints & cases

1. **Framing headers** — Allow approved hosts via `Content-Security-Policy: frame-ancestors` (not `X-Frame-Options: DENY`).
2. **frame-ancestors (decided):** flexible in dev, strict in production — e.g.  
   `frame-ancestors 'self' https://*.redoxsoft.com http://localhost:*`  
   (via static-host headers such as Cloudflare Pages `_headers`).
3. **No cookie dependence** for browse/search.
4. **Distinct origin (decided):** host via e.g. `specdb.redoxsoft.com`; hosts embed with a standard `<iframe src=…>`. No subpath reverse-proxy requirement for v1.
5. **Theme** — Light only for v1 (align with SpecX/WorkX). Dark / `?theme=` deferred.
6. **Escape hatch** — “Open in Spec DB” for full standalone.
7. **CSP of hosts** — Document required `frame-src` / `child-src` pointing at the Spec DB origin.
8. **`postMessage` origin checks** — Validate `event.origin` against allowlist.
9. **Kind allowlist** — Hosts scope the catalog with `kinds=` (see §9.5). Distinct from user browse filter `kind`.

### 9.5 Embed communication contract

| Direction | Examples |
|-----------|----------|
| Host → Spec DB | `?embed=true`, optional `kinds=pipeline` or `kinds=spec,template`, optional locale |
| Spec DB → Host | `spec-db:import:requested` `{ kind, slug, contentUrl }`; optional `resource:selected` |
| Fallback | Non-embed: `target="_blank"` to host import route |

**Height protocol (decided):** fixed iframe height + internal scroll. Do **not** continuously post document height to the parent.

**Theme (decided for v1):** Light only — matches SpecX/WorkX. No host stylesheet injection. Dark / `?theme=` deferred.

**Kind allowlist (decided):**

| Param | Role |
|-------|------|
| `kinds` | Host allowlist — comma-separated subset of `spec`, `template`, `pipeline`. Omitted → all kinds. |
| `kind` | User browse filter **within** the allowlist only |

- WorkX embed: `?embed=true&kinds=pipeline`
- SpecX embed: `?embed=true&kinds=spec,template` (adjust if product needs only one)
- Grid, search, Resource Type UI, and Import only expose allowlisted kinds
- Single-kind allowlist: do not show a redundant “All resources” kind chooser
- Invalid or out-of-allowlist `kind=` values are ignored/coerced

### 9.6 Non-requirements for embed (v1)

- Microfrontend without iframe (Module Federation, etc.)
- Embedding arbitrary third parties beyond SpecX/WorkX
- Spec DB calling host workspace APIs from the iframe

---

## 10. Build pipeline (npm scripts)

### 10.1 Required capabilities

| Script / stage | Responsibility |
|----------------|----------------|
| `validate` | Zod-validate metadata/tags/content JSON; AST-parse markdown; enforce tag registry + **max depth 2** + **no deprecated tags**; unique slugs; **fail on broken `relatedSlugs`/`templateSlug`**; H1↔title match; reject media/nested pipelines; **pipeline `${var}` ↔ `inputVarDefinitions`** (see §5.4) |
| `index` | Emit `catalog-lite.json`, `by-tag/*`, `resources/<slug>.json`, tag tree; extract plain text / section keys; **sanitize + Shiki → static preview HTML** |
| `build` | `validate` → `index` → Vite build React app → **Pagefind postbuild** on `dist` |
| CI deploy | Run build on merge; publish static artifacts to distinct Spec DB origin; **do not commit** generated indexes |

### 10.2 Failure cases

- Unknown tag → fail
- Deprecated tag on any resource in the PR → fail (no grace period)
- Duplicate slug → fail
- Tag hierarchy deeper than 2 → fail
- Invalid metadata / markdown convention → fail
- Missing `tasks/<key>.md` referenced from pipeline → fail
- Discoverable `${var}` in task markdown without `inputVarDefinitions` entry → **fail**
- `inputVarDefinitions` entry never referenced by any task → **fail**
- Broken `relatedSlugs` / `templateSlug` → **fail**
- `content.md` H1 present and ≠ `metadata.title` → **fail**
- Nested pipeline steps → **fail**
- Media / image embeds in markdown or binary assets under resource → **fail**

---

## 11. Web UI

### 11.1 Primary flows

1. **Home** — Featured / recently updated / kind entry points (standalone; optional in embed)
2. **Browse** — Load `catalog-lite.json` + tags; filter by kind and tag facets in memory
3. **Search** — Pagefind over built static output (chunked index fetches)
4. **Detail** — Load `resources/<slug>.json`; show **built GFM HTML** (`@tailwindcss/typography` + pre-highlighted code); Import CTA; curated `relatedSlugs`; link to GitHub source. Chrome: right slide-over (desktop) / fullscreen (mobile) — see `docs/styles.md`.
5. **Pipeline task drill-in** — Pipeline overview lists steps (with step fan-out hints) + readonly **Inputs** (definitions + pipeline fan-out). Opening a step uses a **nested/stacked panel** for the full task body **and** variables used in that task (step/pipeline fan-out badges). Prefer stack over accordion when prompts are long. No in-catalog run form.
6. **Contribute** — Link to contributing docs (compact/hidden in embed)
7. **Embed mode** — Reduced chrome; Import via `postMessage`; theme via query/system preference

### 11.2 Import button

- Specs & templates → SpecX handoff
- Pipelines → WorkX handoff
- **Embed:** `postMessage` with `{ kind, slug, contentUrl }`
- **Standalone:** feature detection → `target="_blank"` host import URL
- Copy: “Continues in SpecX/WorkX”
- No multi-resource “bundle import” — packs are informational (tags + related links)

### 11.3 UI non-requirements (v1)

- In-app editing (including editing input-var definitions or task markdown)
- Client-side markdown engine / Shiki as the primary catalog preview (build-time HTML only)
- Collecting pipeline run `inputVars` (readonly documentation only)
- Logged-in user library
- Block-model / SpecX editor-equivalent preview (GFM typography preview only)
- Automatic “used with” graph (manual `relatedSlugs` only)

### 11.4 Accessibility & platform

- Desktop, mobile, narrow iframe
- Static hosting (Cloudflare Pages / GitHub Pages)
- Keyboard accessible
- `prefers-reduced-motion`

---

## 12. Contribution model

1. Fork / branch → add or update `resources/<kind>/<slug>/` → PR (manual authoring; no product→catalog export tooling in v1).
2. Specs: edit `content.md`; templates: edit `content.json` (inline `guidance`); pipelines: edit `content.json` + `tasks/*.md`; always update `metadata.json` for tags/title/summary/`featured`/`relatedSlugs`.
3. New or deprecated tags: update central registry and **all** affected resources in the same PR.
4. CI runs `validate` + full static build (including generated indexes, gitignored).
5. Moderation: **standard GitHub PR approval** by the repo owner (no multi-tier CODEOWNERS for v1).

---

## 13. Security & licensing

1. All catalog content assumed **public**.
2. **Licenses (decided):** **MIT** for code (`src/`, `scripts/`, tooling); **CC-BY-4.0** for catalog content (`resources/`).
3. No credentials or private workspace data in resources.
4. Import `postMessage` payloads carry URLs/slugs, not secrets.
5. Pin build dependencies; generate indexes only on trusted CI from validated sources.
6. **Embed:** production `frame-ancestors` for `'self'`, `https://*.redoxsoft.com`, and localhost in dev; validate `postMessage` origins; document host CSP.
7. **Sanitize** + build-time Shiki via the unified pipeline; detail pages serve static safe HTML (no client highlighter bundle).

---

## 14. Alignment with sister products (informational)

| Product | Internal concepts | Catalog kinds |
|---------|-------------------|---------------|
| SpecX | Document (spec), Template (`global`/`local`/`private`), Gallery | `spec`, `template` |
| WorkX | Pipeline, Task, code-defined pipeline templates, copy-to-workspace | `pipeline` |

Spec DB is the **open, external, statically hosted** complement (distinct origin) and may be **embedded** into product gallery/import entry points. Hosts fetch `contentUrl` and map with **host-owned** adapters; Spec DB stays presentational. Host apps are assumed current — no per-resource compatibility matrix in v1.

---

## 15. Assumptions

1. Spec DB is a **separate open-source repo** from SpecX/WorkX backends, hosted on a **distinct origin**.
2. v1 contribution is **git/PR-based**, low volume, full editorial control, **&lt;50 resources**.
3. Catalog content is a **simplified external format**; hosts fill product-specific fields on import.
4. **Metadata is JSON only** (no front matter); specs default to **`content.md`** (GFM + GitHub alerts).
5. **No runtime Spec DB backend**; CI + static hosting + client-side browse/search.
6. **Slug is the canonical id** (no Spec DB UUID).
7. Generated browse/search artifacts are **CI-only**, not committed.
8. Import in embed uses **`postMessage` + absolute `contentUrl`**; host fetches JSON.
9. Spec DB→host IR mapping lives **in SpecX/WorkX**, not in a Spec DB npm package.
10. Pipeline prompts live in **`tasks/*.md`**; graph in **`content.json`** (flat only).
11. Embed uses **fixed-height iframe + internal scroll**.
12. Import button uses **feature detection**: embed → `postMessage`; standalone → host URL in new tab/window.
13. **English-only** indefinitely for v1+.
14. **Single-package** npm + React/TypeScript/Vite is the recommended toolchain (§18); no monorepo.
15. iframe embed is an acceptable v1 integration; cross-origin + `postMessage` is in scope.
16. **Nested pipelines are forbidden** in the catalog for v1.
17. **Pagefind** is the v1 search engine.
18. Tag hierarchy is at most **two levels**; deprecated tags fail CI with **no grace period**.
19. Templates use **JSON structure + inline `guidance` strings**.
20. Markdown is parsed with an **AST** (`unified`/`remark`), not regex; preview is GFM HTML + build-time Shiki.
21. SpecX/WorkX hosts are assumed up to date — no compatibility matrix.
22. Packs/suites are **tags + `relatedSlugs`/prose**, not a bundle kind.
23. Pipeline task bodies are **`tasks/*.md`**; JSON is structure + `inputVarDefinitions` only.
24. Catalog pipeline UX uses a **nested task panel** (not accordion-as-primary for long prompts); inputs are **readonly**.
25. Every discoverable `${var}` in pipeline tasks must match **`inputVarDefinitions`** or CI fails (stricter than WorkX).
26. Embed hosts scope kinds via **`kinds=`** allowlist; user `kind` filter cannot escape it.
27. Theme is **light only** for v1.

---

## 16. Decisions log

| Date | Decision | Rationale |
|------|----------|-----------|


---

## 17. Open questions

*None outstanding for v1.*

---

## 18. Recommended tech stack

Directional defaults for implementation. Swap only with a short ADR if something fits better.

### Single package (repo root)

| Package / tool | Role |
|----------------|------|
| **npm** (or pnpm as client only — **no workspaces**) | One root `package.json` |
| **react**, **react-dom** | UI |
| **vite** | Static app build |
| **tailwindcss**, **@tailwindcss/typography** | Layout + prose styling for markdown previews |
| **lucide-react** | Icons for a dense catalog UI |
| **clsx**, **tailwind-merge** | Conditional classes |
| **framer-motion** (optional) | Use sparingly; not required for v1 MVP |
| **zod** | Schemas in `src/mapper/`; JSON Schema via `npm run schema:json` (no mapping npm package) |
| **zod-to-json-schema** | Optional JSON Schema emit for non-TS consumers |
| **fast-glob** / **globby** | Crawl `resources/` |
| **cac** or **commander** | CLI for `npm run validate` / `npm run index` |

### Markdown & search

| Package | Role |
|---------|------|
| **unified**, **remark-parse**, **remark-gfm**, **remark-rehype**, **rehype-stringify** | Parse GFM, alerts, extract structure/search text |
| **rehype-sanitize** | Safe HTML for previews |
| **shiki** | **Build-time only** syntax highlighting → static HTML (do not ship client Shiki) |
| **pagefind** | Postbuild static search (`npx pagefind --site dist`) |

---

## 19. Success criteria (v1)

1. Contributor adds a tagged resource via PR; CI validates (tags, refs, H1/title, no media, flat pipelines) and builds static artifacts without committing them.
2. Users browse by kind/tags with client-side filtering over `catalog-lite.json`; featured uses `metadata.featured`.
3. Full-text search works via **Pagefind** without a search server or full in-memory index on embed load.
4. Same build runs standalone and in a host iframe on a **distinct Spec DB origin** (fixed-height scroll, theme via query/system).
5. Import works in both contexts: `postMessage` + `contentUrl` when embedded; host URL fallback when standalone.
6. External formats are documented (Zod + `schemas/` + CONTRIBUTING); hosts implement their own import mappers.
7. Tag registry changes are reviewable; `validate` enforces applicability, **max depth 2**, and **no deprecated tags**.
8. Detail preview is sanitized GFM HTML with **build-time** highlighted code; no media.
9. Templates carry JSON cardinality/constraints, template-level `content.guidance`, and per-node **`guidance`** strings (↔ SpecX `description`).
10. Pipelines use `tasks/*.md` + WorkX-aligned `inputVarDefinitions` / `iteratorFields` (pipeline + step); nested task panel UX; `${var}` coverage enforced by `validate`.
11. MIT (code) / CC-BY-4.0 (resources) license split is documented in the repo.

---

## 20. Suggested next steps

Historical build notes live under `docs/internal/`. Do not start with a monorepo or `@redoxsoft/spec-db-mapper`.
