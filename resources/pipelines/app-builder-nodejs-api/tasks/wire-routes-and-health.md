**Goal:** Implement the app factory, health probes, root route, error envelope, and the smoke test.

**Scope:** This task fills the source files for the approved framework, database, and run mode. It must not change pins, install dependencies, or call `listen` from `src/app.ts`.

**Verification / Definition of Done:**
- [ ] Approved strings were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] `buildApp` exists and does not call `listen`. Live, ready, and root responses match Topology.
- [ ] `GET /openapi.json` exists. Fastify also serves `/docs`.
- [ ] Database access stays in the repository. `src/__tests__/health.test.ts` expects `/health/live` to return 200.
- [ ] `README.md` documents dev, test, and build for this selection.

**Instructions:**

1. Set state to `wiring`. Reload `status`, `name`, `targetDir`, `httpFramework`, `database`, `runMode`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask. Do not reread the Context pin table and do not change a specifier.
2. Re-read Topology and Output Contract in "App Builder Node.js API Contract". Also read Resilience, Errors & Diagnostics in "App Builder API Standards" for the error envelope and health probes. Do not open another standard.
3. Write only inside the resolved `targetDir`. Do not follow a path that escapes it. Replace a pre-existing planned path only when `overwrite` is `granted`. Do not delete any other existing file. If `overwrite` is `not-needed` and a planned path already exists, stop `failed` and do not ask. Relative TypeScript imports use a `.js` suffix.
4. `src/config/env.ts` uses Zod for the keys in `.env.example`. Do not log `DATABASE_URL` or other secrets. When a database is selected, implement `src/db/client.ts`, `src/db/schema.ts` with `_scaffold_meta`, `src/db/migrate.ts`, and `src/repositories/health-repository.ts`. `ping()` runs `SELECT 1`. SQLite applies `drizzle/0000_init.sql` on startup. PostgreSQL applies it only after a successful connection and does not throw when the connection is refused.
5. Controllers call services. Services call the repository. Controllers and routes do not import the database client. `GET /health/live` returns 200 `{ "status": "alive" }`. `GET /health/ready` returns 200 with `not_configured` when `database` is `none`, 200 with `ok` after a successful ping, and 503 when a configured ping fails. `GET /` returns 200 `{ "name": "<projectName>", "status": "ok" }` using the display name stored as `name`.
6. `src/errors/error-handler.ts` returns only `{ "error": { "code": "INTERNAL_ERROR", "message": "Something went wrong", "details": [], "requestId": "req_..." } }`. The request id comes from `x-request-id` or a generated id. Unknown routes use that envelope with 404. No SQL, stack traces, hostnames, or file paths in the body.
7. `src/app.ts` exports `buildApp` and does not call `listen`. Fastify registers `@fastify/swagger` and `@fastify/swagger-ui` at `/docs`, and `GET /openapi.json` returns `app.swagger()`. Express serves `GET /openapi.json` and a `/docs` HTML page that links to it. For `decide-later` or `long-running`, `src/server.ts` listens on `PORT`, default 3000, and shuts down on `SIGINT`. For `serverless`, `src/local-preview.ts` is the only local listener, and a comment states that deploy imports `buildApp` from `src/app.ts`.
8. `src/__tests__/health.test.ts` expects `/health/live` to return 200. Fastify uses `buildApp()` and `inject`. Express uses `supertest` without binding a port. Also expect `/health/ready` to return 200 when `database` is `none` or `sqlite`. For `postgresql`, do not require a live server.
9. `README.md` documents the selected stack, `npm run dev`, `npm test`, `npm run build`, and the env keys. When serverless, state that `src/app.ts` does not listen. Do not run install, build, or test. Do not deploy, push, tag, merge, or run `docker build`. Run git only when the user explicitly asks in this run.
