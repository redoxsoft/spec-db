# App Builder Next.js Full-Stack Contract

## Context <!-- key: context -->

One Next.js project. A dashboard page, `GET /api/hello`, and health Route Handlers. No auth, CMS, or business features. The App Router shell matches the Next.js website starter: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, Tailwind v3, and strict TypeScript. This starter adds Route Handlers and optional Drizzle. It does not add a second UI stack or a separate backend project.

Write these specifiers. Do not use `latest`. Do not install `tailwindcss@4`. Registry latest is v4 and it does not use `tailwind.config.ts` or `@tailwind` directives. `tailwindcss` must be `3.4.19`.

| Package | Specifier | Include when |
| :--- | :--- | :--- |
| `next` | `16.3.7` | always |
| `react` | `19.3.0` | always |
| `react-dom` | `19.3.0` | always |
| `typescript` | `5.9.3` | always (dev) |
| `@types/react` | `19.3.0` | always (dev) |
| `@types/react-dom` | `19.3.0` | always (dev) |
| `@types/node` | `22.20.4` | always (dev) |
| `tailwindcss` | `3.4.19` | always (dev) |
| `postcss` | `8.5.28` | always (dev) |
| `autoprefixer` | `10.6.1` | always (dev) |
| `eslint` | `9.39.5` | always (dev) |
| `eslint-config-next` | `16.3.7` | always (dev) |
| `@eslint/eslintrc` | `3.3.7` | always (dev) |
| `clsx` | `2.1.1` | always |
| `tailwind-merge` | `3.7.0` | always |
| `zod` | `4.6.5` | always |
| `vitest` | `5.0.2` | always (dev) |
| `drizzle-orm` | `0.45.3` | `database` is `sqlite` or `postgresql` |
| `drizzle-kit` | `0.31.11` | `database` is `sqlite` or `postgresql` (dev) |
| `better-sqlite3` | `12.11.1` | `database=sqlite` |
| `@types/better-sqlite3` | `7.6.13` | `database=sqlite` (dev) |
| `pg` | `8.23.0` | `database=postgresql` |
| `@types/pg` | `8.23.1` | `database=postgresql` (dev) |

Apply App Builder Web Standards, section Topology & Directory Structure, for the App Router directories. Apply section Layering & Design Patterns for Tailwind utilities and `cn()`. Apply App Builder API Standards, section Resilience, Errors & Diagnostics, for the error envelope and health probes. Apply section Data Flow & State Lifecycle for keeping SQL out of route handlers.

## Choice Tokens <!-- key: choice-tokens -->

- `database`: `none`, `sqlite`, or `postgresql`.
- `runMode`: `decide-later`, `long-running`, or `serverless`.
- `sqlite` together with `serverless` is not a legal pair.

## Topology <!-- key: topology -->

All files live in one Next.js app. There is no `frontend/` or `backend/` split. Never set `output: 'export'`. Route Handlers need a server.

```text
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── not-found.tsx
│   └── api/
│       ├── hello/route.ts
│       └── health/
│           ├── live/route.ts
│           └── ready/route.ts
├── components/ui/card.tsx
├── lib/utils.ts                  # cn()
├── lib/health.ts                 # live and ready response bodies
├── lib/db/client.ts              # sqlite or postgresql only
├── lib/db/schema.ts              # sqlite or postgresql only
├── drizzle.config.ts             # sqlite or postgresql only
├── drizzle/0000_init.sql         # sqlite or postgresql only
├── tests/health.test.ts
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── vitest.config.ts
├── Dockerfile                    # decide-later or long-running only
├── README.md
├── .gitignore
├── .env.example
└── .github/workflows/ci.yml
```

Scripts: `dev` = `next dev`, `build` = `next build`, `start` = `next start`, `lint` = `eslint .`, `test` = `vitest run`.

`decide-later` and `long-running` set `output: 'standalone'` and include `Dockerfile`. `serverless` omits `output` and has no Dockerfile. Never `output: 'export'`.

`tailwind.config.ts` `content` includes `./app/**/*.{ts,tsx}` and `./components/**/*.{ts,tsx}`. `postcss.config.mjs` uses `tailwindcss` and `autoprefixer`. `app/globals.css` starts with `@tailwind base;`, `@tailwind components;`, and `@tailwind utilities;`.

`tsconfig.json`: `strict` true, `moduleResolution` `bundler`, paths `{ "@/*": ["./*"] }`.

Environment keys: always `APP_NAME` set to `projectName`. `sqlite` adds `SQLITE_PATH` default `./data/app.db`. `postgresql` adds `DATABASE_URL` as a placeholder only.

When a database is selected, `lib/db/schema.ts` defines `_scaffold_meta` (`key` text primary key, `value` text). `drizzle/0000_init.sql` creates that table. Route handlers do not import `lib/db/client.ts`. `lib/health.ts` accepts a ping result; a small repository module performs `SELECT 1`. PostgreSQL must not throw during import when the server is down. `database=none` has no `lib/db/` and no `drizzle/`.

The non-serverless Dockerfile is multi-stage `node:22-alpine`. It runs `npm ci` and `npm run build`, copies the standalone output, sets `USER node`, exposes `3000`, and runs `node server.js` from the standalone folder.

`lib/health.ts` `liveBody()` returns `{ "status": "alive" }`. `readyBody("not_configured" | "ok" | "down")` returns `{ "status": "ready", "checks": { "database": "<value>" } }` for the first two, and the route returns 503 for `"down"`. `GET /api/hello` returns `{ "name": "<projectName>", "status": "ok" }`.

Error JSON:

```json
{ "error": { "code": "INTERNAL_ERROR", "message": "Something went wrong", "details": [], "requestId": "req_..." } }
```

## Output Contract <!-- key: output-contract -->

- `app/layout.tsx` wraps `children` in `<html>` and `<body>` and imports `globals.css`.
- `app/page.tsx` renders an `h1` whose text is `projectName`, a tagline, and one card.
- Route files exist for `/api/hello`, `/api/health/live`, and `/api/health/ready`.
- `lib/health.ts` is the only place that builds health JSON. Routes call it.
- Tailwind classes come from the Design System section. Status codes: 200 live, 200 or 503 ready, 404 via `not-found.tsx`. No `output: 'export'`.
- Fixed: versions, App Router paths, health JSON, Tailwind v3, the illegal `sqlite` + `serverless` pair, and the Dockerfile rule.
- Free: tagline copy and card wording inside the token scale.
- `npm run build` exits 0. `npm test` exits 0. `package-lock.json` exists after install.

## Design System <!-- key: design-system -->

- Page background `slate-50`, card `bg-white` with `border-slate-200`, heading `text-slate-900`, tagline `text-slate-500`, accent `indigo-600`.
- Heading `text-3xl font-bold`, tagline `text-lg`.
- Page padding `p-8`, card padding `p-6`, stack gap `gap-4`. Content width `max-w-6xl mx-auto`.
- Card `rounded-xl shadow-sm`.

## Verification Checks <!-- key: verification-checks -->

- [ ] `package.json` scripts include `dev`, `build`, `start`, `lint`, and `test`.
- [ ] Dependency specifiers match the Context table, including `tailwindcss` `3.4.19` and `next` `16.3.7`.
- [ ] `tailwind.config.ts`, `postcss.config.mjs`, and `app/globals.css` use the Tailwind v3 setup in Topology.
- [ ] `app/page.tsx` contains an `h1` with `projectName` and uses Design System classes.
- [ ] `app/api/health/live/route.ts`, `app/api/health/ready/route.ts`, and `app/api/hello/route.ts` exist and call shared helpers rather than inlining SQL.
- [ ] `tests/health.test.ts` imports `lib/health.ts` and expects `liveBody().status` to be `alive`.
- [ ] When `database=none`, the test also expects `readyBody("not_configured").checks.database` to be `not_configured`.
- [ ] When `database=sqlite`, the test also expects `readyBody("ok").checks.database` to be `ok`.
- [ ] `next.config.mjs` does not contain `output: 'export'`.
- [ ] `decide-later` and `long-running`: `next.config.mjs` contains `output: 'standalone'`, and `Dockerfile` contains `node:22-alpine` and `USER node`.
- [ ] `serverless`: no `Dockerfile`, and `next.config.mjs` does not contain `output: 'standalone'`.
- [ ] `database=none` has no `lib/db/` and no `drizzle/`.
- [ ] `sqlite` or `postgresql` has `lib/db/client.ts`, `lib/db/schema.ts`, `drizzle.config.ts`, and `drizzle/0000_init.sql`.
- [ ] Repo files exist: `README.md`, `.gitignore`, `.env.example`, `.github/workflows/ci.yml`.
- [ ] `npm run build` exits 0.
- [ ] `npm test` exits 0.
- [ ] `package-lock.json` is present on disk.
- [ ] When PostgreSQL is unreachable, `/api/health/ready` returns 503. That is still a pass when `next build` and the health helper test exit 0.
