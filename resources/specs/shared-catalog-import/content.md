# Shared Catalog Import

## Overview <!-- key: overview -->

### The Problem <!-- key: the-problem -->

Teams need a single catalog of templates, specs, and pipelines that SpecX and WorkX can import without trusting client-supplied hosts.

Hosts receive only `kind` and `slug`, then fetch a packaged JSON artifact from a trusted Spec DB base URL.

### Success Metrics <!-- key: success-metrics -->

- Import creates a local template or filled document without an AI first-draft run.
- Package URL is built server-side from env + slug (no `contentUrl` from the client).
- Preview JSON and import packages remain separate artifacts.

## Scenarios <!-- key: scenarios -->

### Happy path embed import <!-- key: happy-path-embed-import -->

1. User opens Spec DB in a SpecX iframe.
2. User clicks **Import** on a template.
3. Spec DB posts `{ type, kind, slug }` to the parent.
4. SpecX BE fetches `/generated/packages/{kind}/{slug}.json` and creates a local template.

### Standalone deep link <!-- key: standalone-deep-link -->

- User clicks Import outside an iframe.
- Browser opens `/import?kind=template&slug=feature-spec-lite`.
- Host session supplies workspace; BE uses the same package path.

## Edge Cases <!-- key: edge-cases -->

Unsupported markdown constructs degrade to paragraphs during packaging. Hard errors still fail CI:

| Case | Result |
| --- | --- |
| Empty `content.md` | Fail validate |
| Content before first H2 | Fail validate |
| Table wider than 6 columns | Fail validate |

> [!NOTE]
> Callouts in the package use tones `info`, `warning`, or `decision`.

```json
{
  "type": "spec-db:import:requested",
  "kind": "spec",
  "slug": "shared-catalog-import"
}
```

---

Pipeline packages use the same envelope and path pattern; WorkX accepts `kind: "pipeline"` and SpecX rejects it.
