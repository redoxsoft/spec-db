**Goal:** Implement the dashboard page, Route Handlers, health helper, and smoke test for the approved tokens.

**Scope:** This task fills the page, routes, health helper, and `tests/health.test.ts`. It must not change pinned versions, install dependencies, run the build, or add auth or extra pages.

**Verification / Definition of Done:**
- [ ] Approved strings were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] `app/page.tsx` has an `h1` of the display name and one card using the Design System classes.
- [ ] Live, ready, and hello routes exist, and health JSON is built only in `lib/health.ts`.
- [ ] `tests/health.test.ts` expects `liveBody().status` to be `alive`, plus the ready assertion for this database, and it does not open a database.
- [ ] Route handlers do not import `lib/db/client.ts`. `database` `none` has no database client.
- [ ] The serverless README includes: "PostgreSQL must be an external managed database. Do not use SQLite on serverless."

**Instructions:**

1. Set state to `wiring`. Reload `status`, `name`, `targetDir`, `database`, `runMode`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask. Do not reread the Context pin table and do not change a specifier.
2. Re-read Topology, Output Contract, and Design System in "App Builder Next.js Full-Stack Contract". Also read Resilience, Errors & Diagnostics in "App Builder API Standards" for the error envelope and health probes. Do not open another standard.
3. Write only inside the resolved `targetDir`. Do not follow a path that escapes it. Replace a pre-existing planned path only when `overwrite` is `granted`. Do not delete any other existing file. If `overwrite` is `not-needed` and a planned path already exists, stop `failed` and do not ask. Do not install a missing toolchain.
4. `app/globals.css` starts with `@tailwind base;`, `@tailwind components;`, and `@tailwind utilities;`. `lib/utils.ts` exports `cn` using `clsx` and `tailwind-merge`. `app/layout.tsx` wraps `children` in `html` and `body` and imports `globals.css`. `app/page.tsx` renders an `h1` of the display name stored as `name`, a tagline, and one card. Use page background `slate-50`, card `bg-white` with `border-slate-200` and `rounded-xl shadow-sm`, heading `text-3xl font-bold text-slate-900`, tagline `text-lg text-slate-500`, accent `indigo-600`, padding `p-8` and `p-6`, gap `gap-4`, and width `max-w-6xl mx-auto`.
5. `lib/health.ts` `liveBody()` returns `{ "status": "alive" }`. `readyBody` accepts `not_configured`, `ok`, or `down` and returns `{ "status": "ready", "checks": { "database": "<value>" } }` for the first two. Route modules call these functions and return `NextResponse.json`. `/api/health/ready` returns 503 for `down`. `GET /api/hello` returns `{ "name": "<projectName>", "status": "ok" }` using the display name. An error path returns `{ "error": { "code": "INTERNAL_ERROR", "message": "Something went wrong", "details": [], "requestId": "req_..." } }`, using header `x-request-id` or a generated id. `app/not-found.tsx` links back to `/`.
6. When a database is selected, implement `lib/db/client.ts`, `lib/db/schema.ts` with `_scaffold_meta`, and a repository whose ping runs `SELECT 1`. The ready route calls the repository and does not import the client. PostgreSQL must not throw during import when the server is down; a failed ping returns 503. When `database` is `none`, the ready route calls `readyBody("not_configured")` with status 200 and there is no `lib/db/`.
7. `tests/health.test.ts` imports `lib/health.ts` only. Always expect `liveBody().status` to be `alive`. When `database` is `none`, also expect `readyBody("not_configured").checks.database` to be `not_configured`. When `database` is `sqlite`, also expect `readyBody("ok").checks.database` to be `ok`. Do not open a database in the test.
8. `README.md` documents `npm run dev`, `npm test`, and `npm run build`. When `runMode` is `serverless`, include this sentence: "PostgreSQL must be an external managed database. Do not use SQLite on serverless." Do not run `npm install`, `npm test`, or `npm run build`. Do not deploy, push, tag, merge, or run `docker build`. Run git only when the user explicitly asks in this run.
