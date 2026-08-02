# Resources

Git-backed catalog entries. **Community contributions are limited to these three kinds** — see [CONTRIBUTING.md](../CONTRIBUTING.md).

| Kind | Files |
|------|--------|
| Spec | `metadata.json` + `content.md` |
| Template | `metadata.json` + `content.json` (template `guidance`, outline + cardinality + per-node `guidance`) |
| Pipeline | `metadata.json` + `content.json` (steps, `inputVarDefinitions`, `iteratorFields`) + `tasks/<key>.md` |

Before opening a PR, run **`npm run check`** (contract validation). Full rules: [CONTRIBUTING.md](../CONTRIBUTING.md).

After edits, run `npm run index` so the UI picks up changes from `public/generated/`:

| Generated path | Purpose |
|----------------|---------|
| `resources/<slug>.json` | Preview-oriented detail for the Spec DB UI |
| `packages/{kind}/{slug}.json` | Host import packages (templates, specs, pipelines) |
