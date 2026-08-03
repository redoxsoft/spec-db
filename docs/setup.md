# Architecture & Setup — Spec DB

Single-package, zero-runtime catalog. UI must follow [`styles.md`](styles.md). Process notes for maintainers live under [`internal/`](internal/).

## Tech stack

| Layer | Choice |
|-------|--------|
| UI | React + TypeScript (strict), Vite |
| Style | Tailwind + typography plugin, Lucide |
| Routing | React Router (or equivalent) — keep routes few |
| Data (runtime) | `fetch` static JSON under `/generated/` — **no API server** |
| Schemas | Zod in `src/mapper/` + `npm run schema:json` → `schemas/` (**no** `@redoxsoft/spec-db-mapper`) |
| Build scripts | Node CLIs: `npm run validate`, `npm run index` |
| Search | Pagefind (`npm run pagefind` / postbuild on `dist`; lazy-load on search focus) |
| Package layout | **One** root `package.json` — **no** monorepo / workspaces / Turborepo |
| Deploy | Static `dist/` via Cloudflare Worker (GitHub-linked); CI validates only; CSP via `public/_headers` |

**Explicitly out:** MobX, Redux, React Query, Axios layers, Firebase, shadcn-by-default, Framer Motion-by-default, runtime CMS.

## Architectural principles

### Static-first data flow

```text
resources/ + tags/  →  validate / index (CI)  →  public/generated/*.json
                                                      ↓
                                              React app (fetch)
                                                      ↓
                                         filter / Pagefind / modal
                                                      ↓
                              Import: postMessage (embed) or host URL (standalone)
```

- **UI never reads `resources/` directly** — only `public/generated/` artifacts via `fetch`.
- **No Repository → API → DB chain.** A thin `src/catalog` module that `fetch`es JSON is enough.
- **Zod schemas** live in `src/mapper/` for validate/index; hosts own Spec DB → product import adapters.

### State (keep it boring)

- Local React state / URL search params: `embed`, host allowlist `kinds`, user filters (`kind` within allowlist, tags, `q`).
- One small catalog hook/context: load lite catalog + tags once; derive filtered list (apply `kinds` before user filters).
- Detail: fetch `resources/<slug>.json` when modal opens (cache in memory if you want).
- Loading/error: handle next to the fetch; no global error bus required for v1.

### Components

- Presentational by default; catalog hook supplies data.
- **No** direct `fs` or Node imports from UI code.
- Feature folders over deep abstract “core” frameworks.

## Folder structure

```text
/
├── docs/                 # public docs; internal/ for phased-plan + prototype
├── resources/            # git-backed catalog (specs|templates|pipelines)/<slug>/
├── tags/                 # tags.json registry
├── schemas/              # emitted JSON Schema (npm run schema:json)
├── scripts/              # validate.ts, index.ts, emit-json-schema.ts (Node)
├── public/generated/     # CI output — gitignored
├── src/
│   ├── main.tsx
│   ├── app/              # shell, router, embed/theme bootstrap
│   ├── features/
│   │   ├── catalog/      # grid, filters, cards, empty state
│   │   ├── detail/       # modal, preview, import button
│   │   └── search/       # Pagefind client (lazy import)
│   ├── mapper/           # zod schemas + validate helpers (in-repo only; hosts own import mappers)
│   ├── catalog/          # fetch helpers + UI types for generated JSON
│   ├── lib/              # kindStyles, cn(), paths
│   └── styles/globals.css
└── package.json
```

Adjust names if needed, but **do not** introduce `packages/*` workspaces.

## Coding constraints

- **Breadth-first:** Prefer finishing the current phased-plan milestone over deepening unrelated layers.
- **Prototype-driven UI:** New screens should look like `docs/internal/prototype.html`, not a generic admin template.
- **Type safety:** Zod at the boundary (generated JSON / metadata). Avoid `any`.
- **Embed-safe:** Assume iframe + fixed host height; scroll internally; Import uses feature detection (`embed` → `postMessage` with `kind` + `slug`, or batch identities).
- **Content rules:** No media in resources; flat pipelines; tags max depth 2; template outline SpecX invariants — enforce in `validate`, don’t special-case in UI.
- **Tests:** Skip automated tests for MVP unless a milestone explicitly adds them. Rely on `validate` + manual click-through.
- **Dependencies:** Add a library only when a milestone needs it (avoid speculative installs).

## Import handoff (do not overbuild)

Implemented in `src/lib/importHandoff.ts`, detail `ImportButton`, and embed `BatchImportBar`. See [embed.md](embed.md).

```ts
// embed detail Import (?embed=true)
parent.postMessage(
  { type: 'spec-db:import:requested', kind, slug },
  targetOrigin // ancestorOrigins or referrer; avoid '*' in prod
)

// embed multi-select Import (N)
parent.postMessage(
  { type: 'spec-db:import:batch-requested', batchId, items: [{ kind, slug }, ...] },
  targetOrigin
)

// standalone (single item only)
window.open(hostImportUrl, '_blank') // SpecX/WorkX base + kind, slug
```

Local host stand-in: `public/host-mock.html` → `/host-mock.html` (logs single + batch). Spec DB does not implement auth or workspace pickers, and does not yet listen for host progress/completed.

## Mental model

| Concept | Meaning |
|---------|---------|
| Resource | One catalog entry (spec / template / pipeline) on disk |
| Generated JSON | What the UI and hosts actually consume |
| Shell | Header + sidebar + main + modal (prototype) |
| Embed mode | Same app, less chrome, postMessage Import |
| Milestone | Thin vertical slice — see phased-plan |

## Agent checklist (every change)

1. Which **milestone** does this serve?
2. Does UI still match **styles.md** / prototype?
3. Are we still **single-package** and **static** (no new backend)?
4. Mocks vs generated: **generated** (`public/generated/` via `npm run index`); authoring lives in `resources/` + `tags/`.
