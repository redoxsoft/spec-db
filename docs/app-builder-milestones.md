# App Builder milestones

Execute these in order, one at a time. **Stop at the end of each milestone. Do not start the next until its verification passes.**

Names, tokens, task rules, and pipeline-context keys live in [app-builder-playbook.md](app-builder-playbook.md). The product charter is [app-builder-goals.md](app-builder-goals.md) and wins on conflict. Repository authoring rules are [CONTRIBUTING.md](../CONTRIBUTING.md).

`npm run check` is necessary and is not proof that a starter builds. Building a starter is a later pipeline run, outside this repository.

## Standing constraints

These hold for every milestone.

- **Source is read-only.** Open the file named in the playbook under `/Users/dhaundiyal/src/pipeline-generator/collections/app-builder`. Do not modify that tree. Do not reconstruct pins, trees, or toolchain floors from memory.
- **Ignore** `websites/static-website-generator-old/` and `catalog.md`. They are not resources.
- `relatedSlugs` is omitted through Milestone 8. Milestone 9 adds the edges in playbook R15 and section 6.3.
- If a milestone's verification fails, fix it inside that milestone. Do not carry a known failure forward.
- Do not add templates.

### Reusable checks

Run these from the repository root once any `app-builder-*` resource exists. `rg` is ripgrep. Each command must print nothing.

```bash
rg -n 'pipeline-generator|scaffold-rules|spec:|file://|static-website-generator-old|agent memory|Progress: \[Step' resources/*/app-builder-*
rg -n '\$\{' resources/pipelines/app-builder-*/tasks/
rg -n '"type"\s*:\s*"pipeline"' resources/pipelines/app-builder-*/content.json
rg -ni 'at most one|attempt limit|retry counter|execution budget' resources/*/app-builder-*
```

---

## Milestone 1 — Registry

**Status: done.** Do not redo it. Re-run the checks only if the registry is edited.

**Done when:** the pack can be referenced and no App Builder resource exists yet.

**Verify**

- [x] `collections/collections.json` has `app-builder` plus `app-builder-websites`, `app-builder-frontend`, `app-builder-fullstack`, `app-builder-backends`, and `app-builder-mobile`. Children use `parentId: "app-builder"`. Display names match playbook section 2. All are `"status": "active"`.
- [x] The collection description is `Opinionated hello-world starters for websites, web apps, APIs, and mobile apps.`
- [x] `tags/tags.json` has `app-builder` under `use-case`, active, applicable to `spec` and `pipeline`, order 7.
- [x] No `resources/**/app-builder-*` directory exists.
- [x] `npm run check` prints `validate: ok`.

## Milestone 2 — Standards

**Status: done.**

**Done when:** the three standards in playbook section 6.1 exist, and they contain architecture only.

Open each source file named there. Keep the prose, trees, and tables. Remove sentences that tell an agent which step to run or which question to ask. Renumber the web standard’s headings onto the keys in section 6.1. `relatedSlugs` is omitted.

**Verify**

- [x] Exactly these specs exist, and no other App Builder spec or pipeline: `app-builder-web-standards`, `app-builder-api-standards`, `app-builder-mobile-standards`.
- [x] Each H1 equals `metadata.title`. Sections start at H2 with `<!-- key: ... -->`. Keys match playbook section 6.1. No body before the first H2.
- [x] No standard names a pipeline step, an outcome, or an interview question.
- [x] `relatedSlugs` is omitted. Collection is `app-builder`. Subcollection is omitted.
- [x] The reusable checks print nothing. `npm run check` prints `validate: ok`.

## Milestone 3 — Contracts

**Status: done.**

**Done when:** the nine contracts in playbook section 6.2 exist.

Open each source `scaffold-rules.md`. Map sections onto the keys in section 6.2. Leave interview order, the approval gate, directory-safety procedure, and repair procedure for the task files. `choice-tokens` lists legal spellings only. Omit `design-system` when the source section has no tokens. Copy version tables as written.

**Verify**

- [x] Exactly twelve App Builder specs exist: the three standards plus the nine contract slugs in playbook section 6.2. No App Builder pipeline exists.
- [x] Each contract uses only the keys in section 6.2, with the same heading rules as Milestone 2.
- [x] No contract says “Task 1”, “Task 5”, or tells the agent when to ask, approve, or repair.
- [x] Version specifiers match the source tables. `relatedSlugs` is omitted.
- [x] The reusable checks print nothing. `npm run check` prints `validate: ok`.

## Milestones 4–8 — Pipelines

**Milestones 4–8: done.** The boxes below were re-checked after the mobile row.

**Done when:** that subcollection’s pipelines from playbook section 6.3 exist, each with `content.json` and five task files, and no later subcollection has been started.

Do them in this order. Stop after each one.

| Milestone | Subcollection | Slugs |
|---|---|---|
| 4 | `app-builder-websites` | `app-builder-static-website`, `app-builder-nextjs-website` |
| 5 | `app-builder-frontend` | `app-builder-react-vite-webapp` |
| 6 | `app-builder-fullstack` | `app-builder-nextjs-fullstack`, `app-builder-react-separate-api` |
| 7 | `app-builder-backends` | `app-builder-nodejs-api`, `app-builder-python-api` |
| 8 | `app-builder-mobile` | `app-builder-expo-react-native`, `app-builder-flutter-app` |

For each pipeline, open its source `pipeline.md` and `task-00N-*.md`. Step keys and names match playbook sections 5 and 6.3. Task files use the four-block shape in playbook section 4. Choices, toolchain floors, and conditional files are copied from the source. Pipeline-context keys are exactly section 5: short strings only, no path list, no file contents, no logs. `inputVarDefinitions` and `iteratorFields` are `[]`. `relatedSlugs` stays omitted.

**Verify** after each milestone

- [x] The slugs in that row exist, and no App Builder pipeline outside the completed rows exists.
- [x] Each pipeline has five tasks, the keys in sections 5 and 6.3, and no orphan task file.
- [x] Discover writes the collected-intake strings and does not open a spec. Prerequisites write `status`, `toolchain`, and `overwrite`, read topology only, and do not store the path list. Later tasks reload those strings and re-read the contract for paths.
- [x] A missing required toolchain is `blocked` with no files written and no install. SQLite plus serverless is resolved before the preview on the generators that offer both.
- [x] `overwrite` is `not-needed` or `granted`. Flutter treats any existing file in the directory as the collision.
- [x] The reusable checks print nothing. `npm run check` prints `validate: ok`.

## Milestone 9 — Wiring

**Status: done.**

**Done when:** every `relatedSlugs` entry matches playbook R15 and section 6.3, and the inventory is complete.

**Verify**

- [x] Each generator pipeline links to its contract and the standards in section 6.3. Each contract links only to the standards it defers to. Standards list nothing. App Builder App Selector links to the nine generator slugs only.
- [x] Every entry resolves to an existing `app-builder-*` slug.
- [x] Counts are 13 specs, 10 pipelines, 47 task files, and no template:

```bash
test "$(printf '%s\n' resources/specs/app-builder-* | wc -l | tr -d ' ')" = 13
test "$(printf '%s\n' resources/pipelines/app-builder-* | wc -l | tr -d ' ')" = 10
test "$(printf '%s\n' resources/pipelines/app-builder-*/tasks/*.md | wc -l | tr -d ' ')" = 47
test -z "$(find resources/templates -name 'app-builder-*' -print -quit)"
```

- [x] The reusable checks print nothing. `npm run check` prints `validate: ok`.

## Milestone 10 — Charter pass

**Status: done.**

**Done when:** the eighteen convergence tests in the goals hold against the resources.

Read the tasks and specs. Do not treat this document or the playbook as a substitute for missing pins, trees, or commands. Fix gaps in the resources. Do not weaken a test to match a shortcut. The intake-agreement test compares each discover task with its contract `choice-tokens` section.

**Verify**

- [x] Goals tests 1 through 18 pass by reading the resources, including collision handling, path escape, stalled repair, a changed approval, and a cancellation that says no starter was produced.
- [x] Discover questions and defaults match each contract’s `choice-tokens` section.
- [x] `npm run check` prints `validate: ok`.

## Milestone 11 — App Selector

**Status: done.**

**Done when:** App Builder App Selector exists, sits on the collection with no subcollection, and starts one generator by exact catalog title.

**Verify**

- [x] `resources/pipelines/app-builder-app-selector/` has `metadata.json`, `content.json`, and two tasks: `choose-starter`, `start-selected-pipeline`.
- [x] Collection is `app-builder`. Subcollection is omitted. `relatedSlugs` is the nine generator slugs. There is no contract.
- [x] `content.json` has no `type: "pipeline"` step. `inputVarDefinitions` and `iteratorFields` are `[]`.
- [x] Counts are 13 specs, 10 pipelines, 47 task files, and no template.
- [x] The reusable checks print nothing. `npm run check` prints `validate: ok`.

