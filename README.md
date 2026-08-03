# Spec DB

Public catalog of SpecX specs/templates and WorkX pipelines. Static Vite + React app; catalog content is git-backed under `resources/` and `tags/`.

**Licenses:** [MIT](LICENSE) (code) · [CC BY 4.0](LICENSE-CONTENT) (catalog under `resources/` / `tags/`)

## Goal

Spec DB exists to **promote spec-driven development without locking teams to any single AI agent**.

AI coding tools are powerful, but delivery only becomes predictable when *what to build*, *how to build it*, and *how work moves from request to done* are explicit and reusable — not buried in one-off prompts. Spec DB is the open library for that practice: community-curated **specs**, **rules/templates**, and **orchestration pipelines** that any agent (or human) can consume.

We aim to build a growing collection of **best practices and ready-to-use resources** — structured specifications, organizational rules/context, and delivery workflows — that teams can import and run with whatever agents they already use. Spec DB is agent-agnostic by design: it publishes portable catalog formats, not a proprietary agent runtime.

This direction sits inside Redoxsoft’s broader AI-native SDLC vision (structured intent, shared rules, and observable process). Background and product framing: [AI-Native SDLC whitepaper](docs/ai-native-sdlc-whitepaper.md).

## Develop

```bash
npm install
npm run dev
```

## Catalog data path

| Layer | Location | Role |
|-------|----------|------|
| **Authoring** | `resources/`, `tags/tags.json` | What contributors edit in PRs |
| **Generated** | `public/generated/` (gitignored) | `npm run index` output |
| **UI** | `fetch('/generated/…')` | Catalog lite + per-slug detail |

The browser does **not** read `resources/` directly.

Authoring: [CONTRIBUTING.md](CONTRIBUTING.md). Pipeline prompts live in `tasks/*.md`, not in JSON.

## Scripts

```bash
npm run check        # contract check (alias of validate) — run before catalog PRs
npm run validate     # Zod + content rules over tags/ + resources/
npm run index        # emit public/generated/* (also runs before dev/build)
npm run pagefind     # Pagefind index → public/pagefind (dev; also before vite)
npm run schema:json  # refresh schemas/*.schema.json for contributors
npm run build        # validate → index → typecheck → Vite → Pagefind on dist
npm run smoke        # assert ship artifacts under dist/ (after build)
```

Search uses Pagefind over generated resource text. `npm run dev` indexes into `public/pagefind/`; production build indexes into `dist/pagefind/` after Vite.

## Import & embed

- **Embed** (`?embed=true`): Import sends `postMessage` `{ type: 'spec-db:import:requested', kind, slug }` to the parent.
- **Standalone**: Import opens SpecX/WorkX import URL with `kind` + `slug` only. Hosts fetch packages from `{base}/generated/packages/{kind}/{slug}.json`.
- **Packages:** templates, specs, and pipelines under `/generated/packages/{kind}/{slug}.json` (samples: `feature-spec-lite`, `discovery-rules`, `project-discovery`).
- **Host mock:** with the dev server running, open [/host-mock.html](http://localhost:7876/host-mock.html) (WorkX / SpecX `kinds=` presets).
- Details: [docs/embed.md](docs/embed.md). Env knobs: [.env.example](.env.example).

## CI & deploy

- **CI** (GitHub Actions): `npm ci` → `npm run build` → `npm run smoke` — no Cloudflare tokens.
- **Deploy:** link this GitHub repo to a Cloudflare Worker; Cloudflare builds `dist/` using [`wrangler.jsonc`](wrangler.jsonc).

CSP `frame-ancestors` ships in `public/_headers` (copied to `dist/`).

## Docs

- [docs/ai-native-sdlc-whitepaper.md](docs/ai-native-sdlc-whitepaper.md) — AI-native SDLC vision (why specs, rules, and orchestration)
- [CONTRIBUTING.md](CONTRIBUTING.md) — catalog PRs (templates, specs, pipelines) + contract check
- [tags/README.md](tags/README.md) — tag registry rules
- [docs/setup.md](docs/setup.md) — architecture constraints
- [docs/styles.md](docs/styles.md) — UI shell
- [docs/embed.md](docs/embed.md) — iframe src, Import contract, origins
