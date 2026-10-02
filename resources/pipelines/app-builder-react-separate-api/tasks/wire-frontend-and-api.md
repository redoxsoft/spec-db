**Goal:** Connect the Vite page to the API health route and implement CORS plus the health tests.

**Scope:** This task fills the page, proxy, health routes, and tests for the approved tokens. It must not change pins, install dependencies, start the dev servers, or add auth.

**Verification / Definition of Done:**
- [ ] Approved strings were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] The Vite proxy strips `/api` and targets port 3000 for Node or 8000 for Python. The page fetches `/api/health/live` and its `h1` is the display name.
- [ ] The frontend test asserts the `h1` and mocks `fetch`. The API test expects live status 200 and, when there is no database, ready `not_configured`.
- [ ] CORS allows `http://localhost:5173`. The app factory does not listen.
- [ ] SQL stays in a repository. The serverless README includes: "PostgreSQL must be an external managed database. Do not use SQLite on serverless."

**Instructions:**

1. Set state to `wiring`. Reload `status`, `name`, `targetDir`, `apiRuntime`, `database`, `runMode`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask. Do not reread the Context pin tables and do not change a specifier.
2. Re-read Topology, Output Contract, and Design System in "App Builder React Separate API Contract". Also read Resilience, Errors & Diagnostics in "App Builder API Standards" for the health probes. Do not open another standard.
3. Write only inside the resolved `targetDir`. Do not follow a path that escapes it. Replace a pre-existing planned path only when `overwrite` is `granted`. Do not delete any other existing file. If `overwrite` is `not-needed` and a planned path already exists, stop `failed` and do not ask.
4. `frontend/vite.config.ts` proxies `/api` to `http://localhost:3000` for Node or `http://localhost:8000` for Python, strips `/api`, and uses port `5173`. `src/index.css` uses the three `@tailwind` directives. `src/App.tsx` renders an `h1` of the display name stored as `name`, a card, and `fetch("/api/health/live")` with the status text on the page. Use `bg-slate-50`, heading `text-3xl font-bold text-slate-900`, muted `text-slate-500`, card `bg-white rounded-xl border border-slate-200 p-6`, accent `text-indigo-600`, and width `max-w-3xl mx-auto p-8`. `src/__tests__/App.test.tsx` asserts the `h1` and mocks `fetch` so the test does not need a running API.
5. Implement `GET /health/live` as 200 `{ "status": "alive" }` and `GET /health/ready` as 200 `{ "status": "ready", "checks": { "database": "ok" or "not_configured" } }`, or 503 when a configured ping fails. CORS origin is `http://localhost:5173`. When `database` is `none`, ready reports `not_configured` with status 200 and there is no database driver and no repository file. When a database is selected, `SELECT 1` lives in `backend/src/repositories/health-repository.ts` (Node) or `backend/app/repositories/health.py` (Python). Routes and services do not import the driver. Do not add a controller layer. PostgreSQL must not crash import when the server is down.
6. Node tests use Fastify `inject`. Python tests use `TestClient`. Always expect live status 200. When `database` is `none`, also expect ready `database` to be `not_configured`.
7. For `decide-later` and `long-running`, listen in `src/server.ts` on port 3000 or `app/server.py` on port 8000. For `serverless`, listen only in `src/local-preview.ts` or `app/local_preview.py`. `buildApp` does not call `listen`. `create_app` does not call `uvicorn.run`.
8. Finish `README.md` with root `npm install`, `npm run dev`, frontend URL `http://localhost:5173`, and the API port. When `runMode` is `serverless`, include this sentence: "PostgreSQL must be an external managed database. Do not use SQLite on serverless." Do not install dependencies or start the servers. Do not deploy, push, tag, merge, or run `docker build`. Run git only when the user explicitly asks in this run.
