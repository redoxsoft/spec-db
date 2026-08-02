# Contributing to Spec DB

Community PRs are open for **catalog content only**:

| Kind | What you add |
|------|----------------|
| **Template** | Structure + guidance for authoring specs (rules/context) |
| **Spec** | A filled-in document body |
| **Pipeline** | Orchestration: ordered tasks + prompts |

Everything else — app/UI changes, architecture, new resource kinds, tooling, docs beyond catalog authoring — should be filed as a **[GitHub enhancement / issue](https://github.com/redoxsoft/spec-db/issues/new)**, not a PR.

Catalog content is [CC BY 4.0](LICENSE-CONTENT). App code is [MIT](LICENSE).

---

## Before you start

1. Pick **one** kind (template, spec, or pipeline).
2. Copy an existing folder under `resources/<kind>/` as a starting point when possible.
3. Use only tags that already exist in [`tags/tags.json`](tags/tags.json) with `"status": "active"` and the right `applicableKinds`. If you need a new tag for your resource, include it in the **same** PR (keep hierarchy depth ≤ 2).
4. Run the contract check locally (see [Verify before opening a PR](#verify-before-opening-a-pr)).

JSON Schema mirrors: [`schemas/`](schemas/). Tags: [`tags/README.md`](tags/README.md).

---

## Repository layout

```text
tags/tags.json
resources/
  templates/<slug>/metadata.json + content.json
  specs/<slug>/metadata.json + content.md
  pipelines/<slug>/metadata.json + content.json + tasks/<step-key>.md
```

- Directory name **must** equal `metadata.slug` (lowercase kebab-case).
- `metadata.kind` **must** match the parent folder (`template` / `spec` / `pipeline`).
- No binary/media files under `resources/` (no images, PDFs, etc.).

---

## Shared: `metadata.json`

Every resource needs a `metadata.json`. Validate against [`schemas/metadata.schema.json`](schemas/metadata.schema.json).

```json
{
  "slug": "my-resource-slug",
  "kind": "template",
  "title": "Human title",
  "summary": "One or two sentences for catalog cards.",
  "tags": ["domain.product", "use-case.specification"],
  "createdAt": "2026-08-02",
  "updatedAt": "2026-08-02",
  "schemaVersion": "1",
  "authors": ["Your Name"],
  "license": "CC-BY-4.0"
}
```

| Field | Notes |
|-------|--------|
| `slug` | Lowercase kebab-case; matches folder name |
| `kind` | `"template"` \| `"spec"` \| `"pipeline"` |
| `summary` | Required; short card blurb |
| `tags` | Must exist in `tags/tags.json`, active, applicable to this kind |
| `schemaVersion` | Always `"1"` |
| `templateSlug` | Specs only; must point at an existing template |
| `relatedSlugs` | Optional; each must resolve to a catalog slug |

---

## Templates

**Files:** `resources/templates/<slug>/metadata.json` + `content.json`

`content.json` must match [`schemas/template-content.schema.json`](schemas/template-content.schema.json).

```json
{
  "schemaVersion": "1",
  "guidance": "Importable AI/authoring instructions for the whole template.",
  "outline": [
    {
      "key": "overview",
      "title": "Overview",
      "guidance": "Per-section authoring hint.",
      "children": [
        {
          "key": "the-problem",
          "title": "The Problem",
          "guidance": "State the core user pain in 2–4 sentences."
        }
      ]
    },
    {
      "key": "scenario",
      "title": "Scenario",
      "guidance": "Title each instance with the user goal.",
      "cardinality": { "min": 1, "max": null },
      "children": []
    }
  ]
}
```

**Rules**

- Root `guidance` is required (longer importable instructions). Keep `metadata.summary` short for cards.
- Outline `key` values must be **unique tree-wide**.
- Omit `cardinality` for fixed sections (defaults to `{ "min": 1, "max": 1 }`). Use `"max": null` for unbounded repeats.
- Outline must pass **SpecX-aligned structure invariants** (below). `npm run check` fails otherwise.
- See `resources/templates/feature-spec-lite/` for hierarchy + optional leaf; `team-retrospective` for optional list (Pattern B).

### Template outline invariants (required)

These match SpecX import rules. Hosts reject outlines that violate them.

1. **Top-level nodes are always fixed:** `{ "min": 1, "max": 1 }`. Never put `min: 0` or `max: null` on a root outline node.
2. **Optional ancestors force optional descendants:** If any ancestor has `min === 0`, every descendant must also have `min === 0`. You cannot place a required (`min >= 1`) node under an optional node.
3. **Max depth 4** (root = depth 1).
4. **Keys unique** tree-wide.
5. **Preferred shape:** fixed wrapper → repeatable instance → fixed (or optional **leaf**) children.
6. **Repeatable titles:** In `guidance`, tell authors/AI to title instances concretely (e.g. “Title each instance with the scenario name, not `Scenario`”).

Cardinality cheat sheet:

| Intent | cardinality | Typical use |
|--------|-------------|-------------|
| Fixed | omit or `{1,1}` | Wrappers and required leaves |
| Optional leaf / section | `{0,1}` | Omitting one subsection |
| Required list | `{1,null}` | Scenarios, steps, components |
| Optional list | `{0,null}` | Zero or more extras |

### Legal patterns for optional content

**Pattern A — Optional leaf under a fixed parent** (omitable unit has no child sections):

```json
{
  "key": "environment",
  "title": "Environment",
  "guidance": "Where the bug was observed.",
  "children": [
    { "key": "context", "title": "Context", "guidance": "Browser/OS/device." },
    {
      "key": "evidence",
      "title": "Evidence",
      "guidance": "Optional links or log snippets.",
      "cardinality": { "min": 0, "max": 1 }
    }
  ]
}
```

**Pattern B — Fixed wrapper + optional list of leaves** (group always in TOC; zero items allowed; content in instance body):

```json
{
  "key": "kudos",
  "title": "Kudos",
  "guidance": "Wrapper always present; may contain zero shout-outs.",
  "children": [
    {
      "key": "shout-out",
      "title": "Shout-out",
      "guidance": "Title with person/team name. Write recognition in this section body.",
      "cardinality": { "min": 0, "max": null },
      "children": []
    }
  ]
}
```

**Pattern C — Fixed wrapper + optional list + optional children only** (nested fields under optional instances; every descendant `min: 0`):

```json
{
  "key": "troubleshooting",
  "title": "Troubleshooting",
  "guidance": "Fixed wrapper for common issues.",
  "children": [
    {
      "key": "common-issue",
      "title": "Common Issue",
      "guidance": "Title with the symptom.",
      "cardinality": { "min": 0, "max": null },
      "children": [
        {
          "key": "the-problem",
          "title": "The Problem",
          "guidance": "What the user sees.",
          "cardinality": { "min": 0, "max": 1 }
        },
        {
          "key": "the-solution",
          "title": "The Solution",
          "guidance": "How to fix it.",
          "cardinality": { "min": 0, "max": 1 }
        }
      ]
    }
  ]
}
```

Illegal: top-level optional section; optional wrapper/list with required (`min≥1`) children; required list under an optional ancestor.

### Validation error codes

| Error | Meaning | Fix |
|-------|---------|-----|
| `TOP_LEVEL_MUST_BE_FIXED` | Root node has `min≠1` or `max≠1` | Nest under a fixed wrapper or make root fixed |
| `REQUIRED_UNDER_OPTIONAL` | `min≥1` node under ancestor with `min===0` | Make descendant `min: 0`, or make ancestor fixed and use optional list of leaves |
| `OUTLINE_DEPTH_EXCEEDED` | Depth > 4 | Flatten / merge levels |
| `DUPLICATE_OUTLINE_KEY` | Key reused | Rename key |

---

## Specs

**Files:** `resources/specs/<slug>/metadata.json` + `content.md`

Body is GFM markdown (no MDX, no images/media embeds).

```markdown
# My Spec Title

## Overview <!-- key: overview -->

Prose for this section…

## User Scenarios <!-- key: user-scenarios -->

…
```

**Rules**

- Optional H1 must **exactly** match `metadata.title` (document title only — not a section).
- Start sections at **H2**; nest with H3–H5 (max section depth 4). No body content before the first H2.
- Prefer section keys via `<!-- key: … -->` on headings for stable import packages.
- Optional `metadata.templateSlug` must reference an existing template.
- No `![](…)` or other media embeds.
- Import packaging converts markdown to typed blocks (`paragraph`, lists, `code_block`, `callout`, `table`, `divider`). Unsupported constructs degrade to paragraph; structural errors fail `npm run check`.
- See `resources/specs/shared-catalog-import/` for a package-friendly example.

---

## Pipelines

**Files:** `resources/pipelines/<slug>/metadata.json` + `content.json` + `tasks/<step-key>.md`

`content.json` must match [`schemas/pipeline-content.schema.json`](schemas/pipeline-content.schema.json).

```json
{
  "schemaVersion": "1",
  "inputVarDefinitions": [
    {
      "key": "REPO_URL",
      "description": "Git remote to analyze",
      "suggestedDefault": ""
    }
  ],
  "iteratorFields": [],
  "steps": [
    { "key": "analyze", "name": "Analyze repository" },
    { "key": "summarize", "name": "Write summary" }
  ]
}
```

Plus task prompts:

```text
tasks/analyze.md
tasks/summarize.md
```

**Rules**

- Prompts live in `tasks/<key>.md`, **not** inside JSON.
- Every `steps[].key` needs a matching `tasks/<key>.md`; no orphan task files.
- Flat steps only — do not set `type: "pipeline"` (nested pipelines are forbidden).
- Every `${var}` in task markdown must appear in `inputVarDefinitions` (orphans and undeclared vars fail the check).
- Keys in `iteratorFields` (pipeline or step) must also be defined and referenced in prompts.

---

## Verify before opening a PR

After `npm install`, run the **contract check** (validates tags + every resource against Zod schemas and authoring rules):

```bash
npm run check
```

You should see `validate: ok`. Fix any reported paths before submitting.

Optional local preview of the catalog UI:

```bash
npm run index   # refresh public/generated/ (preview + import packages)
npm run dev
```

`npm run index` also emits host import packages at `public/generated/packages/{kind}/{slug}.json` (templates, specs, pipelines). See [docs/embed.md](docs/embed.md).

You do **not** need a full `npm run build` for catalog-only PRs. CI still runs build + dist smoke on every PR.

---

## Pull request checklist

In your PR description, confirm:

- [ ] Change is **only** catalog content (template, spec, and/or pipeline) — or a tag needed by that content
- [ ] Folder name matches `metadata.slug`; `kind` matches `resources/<kind>/`
- [ ] Format matches this guide / `schemas/*.schema.json`
- [ ] **`npm run check` passed locally** before submission

CI will re-run validation as part of `npm run build`. PRs that fail `check` (or CI) will not merge.

---

## Host import mapping (reference)

Handoff is `{ kind, slug }` only (embed `postMessage` or standalone query). Hosts fetch import packages from:

`{SPEC_DB_BASE_URL}/generated/packages/{kind}/{slug}.json`

Spec DB publishes external package formats only. SpecX/WorkX own import adapters:

| Spec DB | Host |
|---------|------|
| `metadata.slug` | Stable external id; host allocates its own UUID |
| Template `content.guidance` | SpecX `Template.guidance` |
| Outline node `guidance` | SpecX outline `description` |
| Outline `cardinality` | SpecX `{ min, max \| null }` (omit → `{1,1}`) |
| `tasks/<key>.md` | WorkX task `instructions` |
| `inputVarDefinitions` / `iteratorFields` | WorkX equivalents |

See [docs/embed.md](docs/embed.md) for the full embed/import contract.
