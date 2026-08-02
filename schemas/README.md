# External JSON Schemas

Generated from Zod in `src/mapper/` via:

```bash
npm run schema:json
```

## Authoring (git-backed)

| File | Validates |
|------|-----------|
| `metadata.schema.json` | `resources/**/metadata.json` |
| `tags-registry.schema.json` | `tags/tags.json` |
| `template-content.schema.json` | `resources/templates/*/content.json` |
| `pipeline-content.schema.json` | `resources/pipelines/*/content.json` |

Specs use `content.md` (not JSON Schema here). Authoring guide: [CONTRIBUTING.md](../CONTRIBUTING.md).

## Import packages (generated)

Emitted at `public/generated/packages/{kind}/{slug}.json` by `npm run index`. Hosts fetch these (not preview `resources/*.json`).

| File | Validates |
|------|-----------|
| `import-package.schema.json` | Discriminated union of all package kinds |
| `template-package.schema.json` | `kind: "template"` packages |
| `pipeline-package.schema.json` | `kind: "pipeline"` packages |
| `spec-package.schema.json` | `kind: "spec"` packages (markdown → sections/blocks) |
