# App Builder playbook

Maintain **`app-builder`** as a catalog of nine independent hello-world generators, one selector that starts a generator, three day-0 standards, one draft guide for later work, and one contract spec per generator. Generator pipelines ask, check, write, and verify. The selector asks, confirms, and starts a generator. Contracts hold trees, pins, and checks. Standards hold shared architecture. The collection has no templates.

The product charter is [app-builder-goals.md](app-builder-goals.md) and wins over this playbook. Authoring rules for the repository itself are [CONTRIBUTING.md](../CONTRIBUTING.md); everything here is additional.

Execution order is [app-builder-milestones.md](app-builder-milestones.md). This document is the contract those milestones are checked against. Resources outside the `app-builder-*` namespace are out of scope.

Historical source, read-only while authoring: `/Users/dhaundiyal/src/pipeline-generator/collections/app-builder`. Open the named source file when writing a resource. Do not reconstruct pins, trees, or toolchain floors from memory.

---

## 1. Product shape

```text
Intent -> numbered choices -> one preview -> starter directory -> observed checks -> handoff
```

Each generator is one pipeline. The nine generators do not launch another pipeline. The React + separate API generator writes `frontend/` and `backend/` itself. App Builder App Selector is the exception: after confirmation it starts one generator by that generator’s exact catalog title. It does not write a starter.

Day-0 standards are web, API, and mobile. A generator reads only the standards its source pipeline lists. The Project Development Guide is offered at handoff for later work and is not loaded during generation. There are no templates. App Builder App Selector sits at the collection root as the place to start. Each generator sits in a subcollection with its contract. Mobile standards sit with the mobile generators, its only users. Web standards, API standards, and the Project Development Guide serve several folders and sit in Standards.

`catalog.md` in the source is an index. It does not become a resource. `websites/static-website-generator-old/` is an obsolete copy and is not imported.

---

## 2. Registry

Add to `collections/collections.json` and `tags/tags.json` in the same change as the first resources.

| id | displayName | parentId | Holds |
|---|---|---|---|
| `app-builder` | App Builder | — | The pack. Only App Builder App Selector sits at the root. |
| `app-builder-websites` | Websites | `app-builder` | Static site and Next.js website pipelines and their contracts. |
| `app-builder-frontend` | Frontend Web Apps | `app-builder` | The React + Vite pipeline and its contract. |
| `app-builder-fullstack` | Full-Stack Web Apps | `app-builder` | Next.js full-stack and React + separate API pipelines and their contracts. |
| `app-builder-backends` | Backends and APIs | `app-builder` | Node.js API and Python API pipelines and their contracts. |
| `app-builder-mobile` | Mobile Apps | `app-builder` | Expo and Flutter pipelines, their contracts, and mobile standards. |
| `app-builder-standards` | Standards | `app-builder` | Web standards, API standards, and the Project Development Guide. |

Collection `order` is `2`. Subcollection `order` follows the table from 1 to 6. Description: "Opinionated hello-world starters for websites, web apps, APIs, and mobile apps."

New tag, appended under parent `use-case`:

```json
{
  "id": "app-builder",
  "displayName": "App Builder",
  "description": "Pipelines and standards for opinionated hello-world application starters.",
  "applicableKinds": ["spec", "pipeline"],
  "ui": "facet",
  "parentId": "use-case",
  "order": 7,
  "status": "active"
}
```

> [!IMPORTANT]
> The canonical collection display name is `App Builder`, and the canonical tag id is `app-builder`. Treat both as stable public identifiers. `displayName` is the workspace folder name and is immutable after merge.

---

## 3. Naming and shared metadata

- Slug: `app-builder-<name>`, lowercase kebab-case, equal to the folder name.
- Title: starts with `App Builder `.
- Every resource carries tag `app-builder` plus `domain.engineering` and `use-case.execution`. No other tags.
- There are no templates and no `templateSlug`.

Shared `metadata.json` fields:

| Field | Value |
|---|---|
| `schemaVersion` | `"1"` |
| `sourceVersion` | `"1.0"` |
| `license` | `"CC-BY-4.0"` |
| `collection` | `"app-builder"` |
| `subcollection` | Every resource except App Builder App Selector. Section 6 gives each resource's value. |
| `createdAt` / `updatedAt` | The date the resource is written, `YYYY-MM-DD`. |
| `inputVarDefinitions` | `[]` on every pipeline. |
| `iteratorFields` | `[]` on every pipeline. |

`relatedSlugs` is omitted until the wiring step in section 8. From that step on, every entry resolves to an existing `app-builder-*` resource.

Summaries are one or two sentences from the source catalog description. They do not contain a filesystem path, a `spec:` reference, or an instruction to open a markdown file.

### Where files go

The starter is written only under the approved `targetDir`.

- Refuse a directory that lies inside the imported App Builder collection. Membership comes from imported-resource metadata and folder ancestry, not from a folder happening to be named App Builder.
- Resolve `targetDir` before the preview. Refuse it when that path, or a planned path under it, resolves outside the directory through a symlink or another link.
- The preview lists planned paths from the contract topology for the approved tokens. No planned path exists: write beside any unrelated files and do not ask. Any planned path exists: the same preview asks once for blanket overwrite of those paths, or a different directory. Cancel finishes `done`, writes nothing, and the handoff says no starter was produced.
- Flutter does not use that path list. `flutter create` may write files the contract does not name, so any existing file in the directory requires the same single blanket permission for the directory. An empty Flutter directory does not.
- Later tasks re-read the contract tree. They replace an existing planned path only when pipeline context says `overwrite` is `granted`, and they may edit files this run created. They leave every other existing file alone and they do not ask. If `overwrite` is `not-needed` and a planned path already exists, stop `failed` and do not open a new approval.
- Project writes stay inside the resolved directory. Contract commands may use normal tool caches and temporary storage. They do not install a missing or global toolchain, change host configuration, or write into an unrelated project.
- The pipeline creates no SpecX document and no report file beside the starter. Pipeline context is internal run memory.

---

## 4. Cross-cutting authoring rules

**R1 — Tasks are self-sufficient.** A `tasks/<key>.md` states its whole procedure: what to ask, what to check, what to write, when to stop, and what the handoff contains. A task may tell the agent to read a named spec section for a tree, a pin table, or a checklist. It must not tell the agent to go find the procedure in a spec.

**R2 — Specs are knowledge.** Standards contain architecture. Day-0 sentences are binding for the hello-world tree. Later sentences are not implemented and must not stop a run. Contracts contain legal tokens, pins, topology, output landmarks, design tokens, and verification checks. If a sentence says which question to ask next, when to show the preview, or how to repair a failure, it belongs in a task.

**R3 — No counters.** No retry counts, attempt limits, execution budgets, or “at most one fix.” The source error-handling sections use a one-fix cap. Replace that cap with the repair rule in the goals: continue while a concrete in-boundary change can address the failure; stop when no such change remains, the same failure returns with no new evidence, or the next change would break the boundary. Stopping is a condition, not a tally.

**R4 — Four outcomes.** `done`, `failed`, `needs_input`, `blocked`, each with a one-line reason. Meanings are in the goals. Nothing else.

**R5 — One approval.** On the nine generators, Task 1 asks one question at a time and does not write files. Task 2 checks the toolchain, the unsupported SQLite + serverless cell, write access, the imported-collection boundary, and path escape. It reads the contract topology for the approved tokens and compares those paths with the directory. Flutter compares the directory itself, not a partial tree. It then shows one preview and waits for one confirmation. The preview includes name, directory, tokens, derived values, toolchain result, and, only when a planned path already exists, one blanket overwrite-or-other-directory line. Tasks 3 through 5 do not ask. A new preview is required only when the directory, the tokens, or the overwrite grant changes before any write. App Builder App Selector has no write preview.

**R6 — Pipeline context.** On the nine generators, Task 1 writes the collected intake into pipeline context. Task 2 writes the approved strings only after confirmation. Every value is one short string. Do not store file contents, command logs, pins, or the planned path list. Later tasks reload the strings in section 5 and stop `blocked` when a required one is missing. `inputVarDefinitions` stays empty. App Builder App Selector uses the selector strings in section 5.1.

**R7 — Branch on tokens.** Scaffold and wire tasks create only the files the approved tokens select. They must not mix stacks: plain with Vite, Fastify with Express, FastAPI with Flask, or a Dockerfile onto a serverless selection when the contract omits it.

**R8 — Pins stay put.** Copy version specifiers from the contract table into the manifest. Do not write `latest`. Do not invent a specifier the table omits. Do not upgrade a major to make a tool succeed. If a pin fails as written, the outcome is `failed` after in-boundary repair that does not change the pin. A generator that installs packages must have a complete table.

**R9 — Hello-world scope.** The starter implements the contract’s landmarks only. Do not add authentication, a CMS, analytics, billing, business resources, or a cloud deploy because a standard mentions them as later architecture.

**R10 — Side effects.** Do not deploy, publish, submit to a store, run `docker build`, push, tag, or merge. Run git only when the user explicitly asks in the current run. Handoffs must not claim `committed`, `deployed`, or `submitted`.

**R11 — Invariants in the writing tasks.** Restate these in every task that creates files: write only inside the resolved `targetDir`; do not follow a path that escapes it; replace a pre-existing planned path only when `overwrite` is `granted`; do not delete any other existing file; do not treat the imported collection as a destination; copy pins from the contract; do not install a missing toolchain; do not claim a pass without an observed result.

**R12 — Mechanical form.** `inputVarDefinitions` is `[]`, `iteratorFields` is `[]`, no `${...}` in any task file, no `type: "pipeline"`, flat steps only. Every `steps[].key` has a matching `tasks/<key>.md` and there are no orphan task files.

**R13 — No source mechanics in resources.** No file under `resources/**/app-builder-*` may contain a `pipeline-generator` path, `scaffold-rules`, `spec:`, a `file://` link, `static-website-generator-old`, “agent memory,” or `Progress: [Step`. Cite a spec by its exact title and a heading by its heading text.

**R14 — Legible state and handoff.** On a generator, state is one of: asking, checking, waiting, scaffolding, wiring, verifying, blocked. The final handoff states outcome, directory, stack written, checks and exit statuses, user commands, limitations, and next action. On success it offers the draft Project Development Guide for later work and may point to the optional Agile bootstrap when that collection is installed; it does not load the guide or start that pipeline. A `done` cancellation says that no starter was produced. The handoff does not expose internal field names. App Builder App Selector state is asking or blocked. Its handoff names the starter that was started and that name, directory, and remaining stack choices are asked there.

**R15 — Exact wiring.** A generator pipeline’s `relatedSlugs` lists its contract, the day-0 standards it reads, and the Project Development Guide it offers at handoff. A contract’s `relatedSlugs` lists only the standards it defers to. Standards and the guide list nothing. App Builder App Selector’s `relatedSlugs` lists the nine generator slugs only. Every edge resolves. Deleting one generator pipeline and its contract must leave every remaining generator edge valid. That inventory change updates the selector’s `relatedSlugs` in the same change.

### Task file shape

Every task file uses these four blocks, in this order, and nothing above them:

```text
**Goal:** one sentence.

**Scope:** what this task covers, then what it must not do.

**Verification / Definition of Done:**
- [ ] checkable statements

**Instructions:**
numbered steps
```

---

## 5. Handoff and the five steps

### Collected intake (end of discover)

Write only these pipeline-context strings:

| Key | Value |
|---|---|
| `status` | `collected` |
| `name` | The display name the user confirmed. |
| `targetDir` | The directory the user confirmed. |
| One key per choice in section 6.4 | The token spelling, and only for a choice that generator asks. |
| `packageName` | Flutter only. The derived package name. |

Discover does not open a spec. The questions and token spellings in the task are a projection of the contract `choice-tokens` section. Authoring checks that the options, defaults, and spellings agree. Recommended defaults match the source catalog: the first numbered choice.

### Approved scaffold (end of prerequisites)

Keep the collected strings. Set:

| Key | Value |
|---|---|
| `status` | `approved` |
| `toolchain` | A short observed version, such as `node 20.19.0`, or `not-required` when this selection needs no toolchain. |
| `overwrite` | `not-needed` when no planned path exists. `granted` when the user approved blanket overwrite. |

Do not write the path list into pipeline context. The preview compares paths, then discards the list. Later tasks rebuild it by reading the contract topology.

Unsupported SQLite + serverless is resolved here, before the preview, on the four generators that offer both. The task asks for a legal pair and does not write files. A missing toolchain is `blocked` and does not show an approval for a write. A directory inside the imported collection, or a path that resolves outside the directory, is `needs_input` for a different path.

### Steps

All nine generators use five flat steps. Keys and names:

| Order | Key | Name | Writes files |
|---|---|---|---|
| 1 | `discover-parameters` | Discover Parameters | No |
| 2 | `verify-prerequisites` | Verify Prerequisites | No |
| 3 | per section 6 | per section 6 | Tree, manifests, toolchain config |
| 4 | per section 6 | per section 6 | Application source that fills the tree |
| 5 | `verify-and-handoff` | Verify and Hand Off | Repairs and the README when the source puts the README here |

Step 2 reads the contract topology only, to compare planned paths with the directory, and stores the result as `overwrite`. Step 3 reads the contract sections for context, pins, and topology, plus the standard topology section the source cites. Step 4 reads the contract sections for the output contract and design system, plus the standard sections the source cites for wiring. It does not reread the pin table. Step 5 reads the contract’s verification checks, runs them, and may repair. It does not reread topology. Steps 3 through 5 reload `overwrite` from pipeline context and re-read the contract tree for paths. They do not rebuild the approval.

Copy conditional-file rules and command lines from the source task and contract while authoring. Do not summarize a version table as “current stable.”

### 5.1 App Builder App Selector

Write only these pipeline-context strings at the end of `choose-starter`:

| Key | Value |
|---|---|
| `status` | `selected` |
| `selectedSlug` | The accepted generator slug. |
| `selectedTitle` | The accepted generator catalog title. |
| `carriedApiRuntime` | `python` only when a free-text answer already chose a new Python backend for React + Separate API. Omit the key otherwise. |

Two flat steps. No contract. No project files.

| Order | Key | Name | Writes files |
|---|---|---|---|
| 1 | `choose-starter` | Choose Starter | No |
| 2 | `start-selected-pipeline` | Start Selected Pipeline | No |

`start-selected-pipeline` reloads those strings, stops `blocked` when `selectedSlug` or `selectedTitle` is missing, and starts the pipeline whose exact title is `selectedTitle`. When `carriedApiRuntime` is `python`, that React + Separate API run answers Python for API runtime.

---

## 6. Target inventory

Twenty-three resources: 3 day-0 standards, 1 later-work guide, 9 contracts, 10 pipelines, 47 task files. No templates.

### 6.1 Standards and guide — 4

`resources/specs/<slug>/metadata.json` + `content.md`. Collection `app-builder`. Mobile standards use subcollection `app-builder-mobile`; the other three use `app-builder-standards`. H1 exactly equals `metadata.title`. Sections start at H2 and carry `<!-- key: ... -->`. No body before the first H2.

Port the prose, trees, and tables. Drop sentences that say every pipeline must run a procedure. A standard may say what a generated project includes.

Web standards in the source number two sections as “2” and skip “5.” Renumber headings to the keys below. Keep the words.

| Slug | Title | Source | Section keys |
|---|---|---|---|
| `app-builder-web-standards` | App Builder Web Standards | `standards/web-standards.md` | `scaffold-baseline`, `topology`, `data-flow`, `design-patterns`, `resilience`, `quality-baseline` |
| `app-builder-api-standards` | App Builder API Standards | `standards/api-standards.md` | `topology`, `data-flow`, `design-patterns`, `resilience`, `quality-baseline` |
| `app-builder-mobile-standards` | App Builder Mobile Standards | `standards/mobile-standards.md` | `topology`, `data-flow`, `design-patterns`, `resilience`, `quality-baseline` |
| `app-builder-project-development-guide` | App Builder Project Development Guide | Authored with the Agile guide | `purpose-and-adoption`, plus the applicable code, UI, state, API, data, configuration, and test sections |

### 6.2 Contracts — 9

Same file layout and markdown rules as standards. A contract’s H2 keys are:

| Key | Carries |
|---|---|
| `context` | Hello-world scope, fixed stack, and the version table. |
| `choice-tokens` | Legal token spellings only. No interview script. |
| `topology` | Directory tree and files that exist only for some tokens. |
| `output-contract` | Required landmarks and creative leeway. |
| `design-system` | Visual or theme tokens when the source has them. Omit the heading when the source section has no tokens. |
| `verification-checks` | The checklist. Commands and pass conditions, not the repair script. |

Move source “Core Rules” and “Error Handling & Recovery” into the tasks as section 5 describes. Do not leave “Task 1” or “Task 5” in a spec.

| Slug | Title | Source directory |
|---|---|---|
| `app-builder-static-website-contract` | App Builder Static Website Contract | `websites/static-website-generator` |
| `app-builder-nextjs-website-contract` | App Builder Next.js Website Contract | `websites/nextjs-website-generator` |
| `app-builder-react-vite-webapp-contract` | App Builder React Vite Web App Contract | `frontend-web-apps/react-vite-webapp-generator` |
| `app-builder-nextjs-fullstack-contract` | App Builder Next.js Full-Stack Contract | `fullstack-web-apps/nextjs-fullstack-generator` |
| `app-builder-react-separate-api-contract` | App Builder React Separate API Contract | `fullstack-web-apps/react-separate-api-generator` |
| `app-builder-nodejs-api-contract` | App Builder Node.js API Contract | `backends-and-apis/nodejs-api-generator` |
| `app-builder-python-api-contract` | App Builder Python API Contract | `backends-and-apis/python-api-generator` |
| `app-builder-expo-react-native-contract` | App Builder Expo React Native Contract | `mobile-apps/expo-react-native-generator` |
| `app-builder-flutter-app-contract` | App Builder Flutter App Contract | `mobile-apps/flutter-app-generator` |

Each source directory’s `scaffold-rules.md` is the contract source. Each contract uses the same subcollection as its generator in section 6.3.

### 6.3 Generator pipelines — 9

`resources/pipelines/<slug>/metadata.json` + `content.json` + `tasks/<step-key>.md`.

Steps 1, 2, and 5 always use the keys in section 5. Steps 3 and 4 use the keys below. The `Standards` column names day-0 standards read during generation; the additional guide `relatedSlugs` entry is for the handoff only.

| Slug | Title | Subcollection | Steps 3 and 4 | Standards |
|---|---|---|---|---|
| `app-builder-static-website` | App Builder Static Website | `app-builder-websites` | `scaffold-site-structure` — Scaffold Site Structure; `wire-styles-and-assets` — Wire Styles and Assets | Web |
| `app-builder-nextjs-website` | App Builder Next.js Website | `app-builder-websites` | `scaffold-project-structure` — Scaffold Project Structure; `wire-pages-and-styles` — Wire Pages and Styles | Web |
| `app-builder-react-vite-webapp` | App Builder React Vite Web App | `app-builder-frontend` | `scaffold-project-structure` — Scaffold Project Structure; `wire-app-and-styles` — Wire App and Styles | Web |
| `app-builder-nextjs-fullstack` | App Builder Next.js Full-Stack | `app-builder-fullstack` | `scaffold-project-structure` — Scaffold Project Structure; `wire-pages-and-routes` — Wire Pages and Routes | Web, API |
| `app-builder-react-separate-api` | App Builder React Separate API | `app-builder-fullstack` | `scaffold-project-structure` — Scaffold Project Structure; `wire-frontend-and-api` — Wire Frontend and API | Web, API |
| `app-builder-nodejs-api` | App Builder Node.js API | `app-builder-backends` | `scaffold-project-structure` — Scaffold Project Structure; `wire-routes-and-health` — Wire Routes and Health | API |
| `app-builder-python-api` | App Builder Python API | `app-builder-backends` | `scaffold-project-structure` — Scaffold Project Structure; `wire-routes-and-health` — Wire Routes and Health | API |
| `app-builder-expo-react-native` | App Builder Expo React Native | `app-builder-mobile` | `scaffold-project-structure` — Scaffold Project Structure; `wire-home-screen` — Wire the Home Screen | Mobile |
| `app-builder-flutter-app` | App Builder Flutter App | `app-builder-mobile` | `scaffold-project-structure` — Scaffold Project Structure; `wire-home-screen` — Wire the Home Screen | Mobile |

### 6.4 Choices

Ask these, in this order, one at a time. Store only the token spellings. The first choice is the recommended default. Names are freeform; suggest the example when the user is unsure.

| Pipeline | Name field | Example | Tokens |
|---|---|---|---|
| Static Website | `siteName` | `my-site` | `buildTool`: `vite` \| `plain`. Question: Build tool? `1` Vite (TypeScript + Tailwind CSS). `2` Plain HTML, CSS, and JavaScript. |
| Next.js Website | `siteName` | `my-nextjs-site` | `runMode`: `static-export` \| `server`. Question: How should it run? `1` Static export (`output: 'export'`). `2` Next.js server. |
| React Vite Web App | `projectName` | `my-app` | None. Do not ask a stack question. |
| Next.js Full-Stack | `projectName` | `my-next-app` | `database`: `none` \| `sqlite` \| `postgresql`. `runMode`: `decide-later` \| `long-running` \| `serverless`. |
| React Separate API | `projectName` | `my-split-app` | `apiRuntime`: `node` \| `python`. `database`: `none` \| `sqlite` \| `postgresql`. `runMode`: `decide-later` \| `long-running` \| `serverless`. |
| Node.js API | `projectName` | `my-node-api` | `httpFramework`: `fastify` \| `express`. `database`: `none` \| `sqlite` \| `postgresql`. `runMode`: `decide-later` \| `long-running` \| `serverless`. |
| Python API | `projectName` | `my-python-api` | `httpFramework`: `fastapi` \| `flask`. `database`: `none` \| `sqlite` \| `postgresql`. `runMode`: `decide-later` \| `long-running` \| `serverless`. |
| Expo React Native | `projectName` | `my-expo-app` | None. Do not ask iOS versus Android. |
| Flutter App | `projectName` | `My Flutter App` | None. Derive `packageName` by lowercasing `projectName`, turning spaces and hyphens into underscores, and prefixing a leading digit with `app_`. Show it in the preview. Do not ask iOS versus Android. Suggest directory `./my_flutter_app`. |

Directory examples follow the source task: `./` plus the slug, except Flutter.

SQLite + serverless is refused on Next.js Full-Stack, React Separate API, Node.js API, and Python API.

Every starter that needs Node uses the pack Node check from the goals: `^20.19.0` or `>=22.12.0`. Node 21 is not accepted. Prerequisite tasks that need Node run this exact check, then `npm -v`:

```bash
node -e "const [maj,min]=process.versions.node.split('.').map(Number); const ok=(maj===20&&min>=19)||maj>22||(maj===22&&min>=12); if(!ok){console.error('Node must be ^20.19.0 or >=22.12.0, found '+process.versions.node); process.exit(1)}"
```

Static Website requires Node and npm only when `buildTool=vite`. React Separate API requires Python only when `apiRuntime=python`. Node starters that select SQLite pin `better-sqlite3` `12.11.1`. JavaScript starters write ESLint flat config (`eslint.config.js` or `eslint.config.mjs`). They do not write a new `.eslintrc` file.

### 6.5 Summaries

Use these as `metadata.summary`, editing only to stay within one or two sentences.

| Slug | Summary |
|---|---|
| `app-builder-static-website` | Starting point for landing pages, portfolios, or small business sites. Choose Vite with TypeScript and Tailwind, or plain HTML, CSS, and JavaScript. |
| `app-builder-nextjs-website` | Starting point for a multi-page Next.js App Router site. Choose static export or a Next.js server. |
| `app-builder-react-vite-webapp` | Client-side React and Vite starter for dashboards, portals, and interactive tools. TypeScript, Tailwind, Vitest, and npm are fixed. |
| `app-builder-nextjs-fullstack` | One Next.js project with App Router UI and Route Handlers. Choose a database and how the server runs. |
| `app-builder-react-separate-api` | Vite frontend in `frontend/` and an API in `backend/`. Choose the API runtime, database, and how the API runs. |
| `app-builder-nodejs-api` | Standalone Node.js HTTP API. Choose Fastify or Express, a database, and how it runs. |
| `app-builder-python-api` | Standalone Python HTTP API. Choose FastAPI or Flask, a database, and how it runs. |
| `app-builder-expo-react-native` | Cross-platform iOS and Android app using Expo, React Native, Expo Router, and TypeScript. |
| `app-builder-flutter-app` | Cross-platform iOS and Android app using Flutter and Dart. |
| `app-builder-app-selector` | Asks three intent questions and starts one of the nine App Builder generators. Name, directory, and remaining stack choices stay in that generator. |
| Standards | One sentence naming the platforms the standard covers. |
| Contracts | One sentence naming the generator whose tree, pins, and checks the spec defines. |

### 6.6 App Builder App Selector — 1

`resources/pipelines/app-builder-app-selector/`. Collection `app-builder`, no subcollection. No contract. `relatedSlugs` is the nine generator slugs in section 6.3 order. Steps are section 5.1.

Questions 1 and 2 are intent only. They do not show a `**[Recommended]**` marker. Each ends with: reply with a number, or a one-line answer if none fits. A one-line answer maps to the closest legal choice. If it cannot be mapped, ask that question again. Do not invent a tenth starter. Within each Question 2 branch, option 1 is the default when the user is unsure.

| Question 1 | Question 2 | Maps to |
|---|---|---|
| Website | 1 simple site, 3 not sure, or unsure | `app-builder-static-website` |
| Website | 2 content-oriented | `app-builder-nextjs-website` |
| Browser application | 1 single project with UI and backend | `app-builder-nextjs-fullstack` |
| Browser application | 2 two separate projects | `app-builder-react-separate-api` |
| Browser application | 3 just the user interface | `app-builder-react-vite-webapp` |
| Browser application | one-line answer naming a new Python backend | `app-builder-react-separate-api` with `carriedApiRuntime` `python` |
| Phone application | 1 no preference, or 2 React Native | `app-builder-expo-react-native` |
| Phone application | 3 Flutter or Dart | `app-builder-flutter-app` |
| Backend service | 1 no preference, or 2 JavaScript or TypeScript | `app-builder-nodejs-api` |
| Backend service | 3 Python | `app-builder-python-api` |

Question 3 is the only place that marks `**[Recommended]**`. The recommended starter is always item 1. The marker is a prefix at the start of that choice, never a suffix: `1. **[Recommended]** Next.js Full-Stack — …`. The other eight follow in canonical remainder order, with no marker. Yes accepts item 1. A number 1–9 overrides it and clears `carriedApiRuntime` when the override is not React + Separate API.

Canonical remainder order: Next.js Full-Stack, React + Separate API, React + Vite Web App, Static Website, Next.js Website, Node.js API, Python API, Expo + React Native, Flutter.

---

## 7. Required content per step

This is what keeps two authoring sessions from producing different pipelines. Generator-specific files and commands still come from that generator’s source tasks and `scaffold-rules.md`.

### 7.1 Discover

Accept a short intent. Ask section 6.4 in order. Propose the example name and directory when the user is unsure. Map each numbered answer to the token spelling. For Flutter, derive `packageName` and include it in the recap. Write the collected-intake strings from section 5 into pipeline context. Do not check Node, Python, or Flutter. Do not write files. Do not open a spec. The questions in this task must match the contract’s `choice-tokens` section; that match is an authoring check.

### 7.2 Prerequisites

Reload the collected-intake strings. Stop `blocked` if one is missing. Compare `targetDir` with the imported collection and refuse that location. Refuse a `targetDir` or planned path that resolves outside the directory. If the SQLite + serverless pair is present, ask for a legal pair and update the token strings before continuing. Check the source toolchain floor for this generator and the approved tokens. A missing toolchain is `blocked`; do not install it. Read the contract topology for the approved tokens and compare those paths with the directory. For Flutter, treat any existing file as a collision. When no planned path exists, set `overwrite` to `not-needed`. When any planned path exists, include one blanket overwrite-or-other-directory line in the preview. On success, show the one preview from R5 and wait. Write `status`, `toolchain`, and `overwrite` as in section 5. Do not store the path list. Write no project files. Do not read a standard.

### 7.3 Scaffold

Reload the approved strings. Stop `blocked` if `status` is not `approved` or a required string is missing. Create only the matching tree and toolchain files. Copy pins from the contract `context` table. Honor conditional files for database, run mode, build tool, and API runtime. Re-read the contract topology for paths. Replace a pre-existing planned path only when `overwrite` is `granted`. If `overwrite` is `not-needed` and a planned path already exists, stop `failed` and do not ask. Flutter may let `flutter create` write the directory only when `overwrite` is `granted` or the directory is empty. Do not implement routes, pages, or screens that step 4 owns. Do not run install, build, or test. Do not ask.

### 7.4 Wire

Reload the approved strings. Fill the source files the contract’s output and design sections require for the approved tokens. Keep the layering the cited standard describes, scoped to the hello-world landmarks. Replace a pre-existing planned path only when `overwrite` is `granted`. Do not change pins. Do not ask. Do not run the final build unless the source task for that generator does so in this step; the default is that step 5 runs it.

### 7.5 Verify and hand off

Reload the approved strings. Run the verification checks that apply to the tokens. Record command and exit status in the user handoff, not as pipeline-context values. Repair inside the boundary from R3, editing files this run created and, when `overwrite` is `granted`, planned paths from the contract tree. Stop when no concrete in-boundary change remains or the same failure returns with no new evidence, and say so. A required failure that remains is `failed`. An inapplicable check is omitted, not failed. When the contract says an unreachable optional database still passes on the live probe, record that limitation and do not fail the run for it. The handoff follows R14. Flutter’s `flutter run`, and any store or deploy command, is text for the user, not a command the task runs. Do not install a missing toolchain. Do not ask.

### 7.6 Choose starter

Ask section 6.6 in order, one question at a time. Questions 1 and 2 have no recommended marker. Question 3 lists all nine starters with `**[Recommended]**` prefixed on item 1. Write the selector strings from section 5.1. Do not ask for a name or directory. Do not check a toolchain. Do not write files. Do not open a spec. Do not start another pipeline.

### 7.7 Start selected pipeline

Reload the selector strings. Stop `blocked` if `status` is not `selected` or `selectedSlug` or `selectedTitle` is missing. Start the pipeline whose exact catalog title is `selectedTitle`. Do not ask for a name or directory. Do not write project files. If `carriedApiRuntime` is `python` and the selected title is App Builder React Separate API, that run answers Python when it asks for API runtime.

---

## 8. Build order

The gated sequence and its checks live in [app-builder-milestones.md](app-builder-milestones.md). Execute one milestone at a time. This playbook stays the authority for names, tokens, task rules, and pipeline-context keys.
