# App Builder Node.js API Contract

## Context <!-- key: context -->

A runnable Node.js HTTP API only. One root route plus health probes. No authentication, business resources, or cloud deploy. The stack is TypeScript 5 (strict), npm, and Zod 4.

Write these specifiers into `package.json`. Do not use `latest`. Do not upgrade TypeScript to 6 or 7, or ESLint to 10. SQLite uses `better-sqlite3` `12.11.1`.

| Package | Specifier | Include when |
| :--- | :--- | :--- |
| `fastify` | `5.12.5` | `httpFramework=fastify` |
| `@fastify/swagger` | `9.9.0` | `httpFramework=fastify` |
| `@fastify/swagger-ui` | `6.1.1` | `httpFramework=fastify` |
| `express` | `5.2.1` | `httpFramework=express` |
| `supertest` | `7.3.0` | `httpFramework=express` (devDependency) |
| `@types/express` | `5.0.6` | `httpFramework=express` (devDependency) |
| `@types/supertest` | `7.2.1` | `httpFramework=express` (devDependency) |
| `typescript` | `5.9.3` | always (devDependency) |
| `zod` | `4.6.5` | always |
| `tsx` | `4.20.5` | always (devDependency) |
| `vitest` | `5.0.2` | always (devDependency) |
| `eslint` | `9.39.5` | always (devDependency) |
| `@eslint/js` | `9.39.5` | always (devDependency) |
| `typescript-eslint` | `8.71.0` | always (devDependency) |
| `@types/node` | `22.20.4` | always (devDependency) |
| `drizzle-orm` | `0.45.3` | `database` is `sqlite` or `postgresql` |
| `drizzle-kit` | `0.31.11` | `database` is `sqlite` or `postgresql` (devDependency) |
| `better-sqlite3` | `12.11.1` | `database=sqlite` |
| `@types/better-sqlite3` | `7.6.13` | `database=sqlite` (devDependency) |
| `pg` | `8.23.0` | `database=postgresql` |
| `@types/pg` | `8.23.1` | `database=postgresql` (devDependency) |

Apply App Builder API Standards, section Topology & Directory Structure, for the Node layered layout and mandatory repo files. Apply section Data Flow & State Lifecycle for unidirectional flow, OpenAPI, and the SQLite versus PostgreSQL invariant. Apply section Resilience, Errors & Diagnostics for the JSON error envelope and `/health/live` plus `/health/ready`. Apply section Quality Baseline & Verification for Zod, the non-root Dockerfile, and `npm test` on health probes.

## Choice Tokens <!-- key: choice-tokens -->

- `httpFramework`: `fastify` or `express`.
- `database`: `none`, `sqlite`, or `postgresql`.
- `runMode`: `decide-later`, `long-running`, or `serverless`.
- `sqlite` together with `serverless` is not a legal pair.

## Topology <!-- key: topology -->

Create only the rows that match the selected database and run mode.

```text
├── src/
│   ├── config/env.ts
│   ├── db/client.ts              # sqlite or postgresql only
│   ├── db/schema.ts              # sqlite or postgresql only
│   ├── db/migrate.ts             # sqlite or postgresql only
│   ├── routes/health.ts
│   ├── routes/root.ts
│   ├── controllers/health-controller.ts
│   ├── controllers/root-controller.ts
│   ├── services/health-service.ts
│   ├── repositories/health-repository.ts   # sqlite or postgresql only
│   ├── errors/error-handler.ts
│   ├── app.ts
│   ├── server.ts                 # decide-later or long-running only
│   ├── local-preview.ts          # serverless only; local listen, not the deploy entry
│   └── __tests__/health.test.ts
├── drizzle/0000_init.sql         # sqlite or postgresql only
├── drizzle.config.ts             # sqlite or postgresql only
├── Dockerfile                    # decide-later or long-running only
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── eslint.config.js
├── README.md
├── .gitignore
├── .env.example
└── .github/workflows/ci.yml
```

`package.json` sets `"type": "module"`. Relative TypeScript imports use a `.js` suffix so `tsc` emits runnable output.

Scripts:

- `dev`: `tsx watch src/server.ts` when a server entry exists; otherwise `tsx watch src/local-preview.ts`.
- `build`: `tsc`.
- `start`: `node dist/server.js` when a server entry exists; otherwise print that serverless mode has no `listen` entry.
- `test`: `vitest run`.
- `lint`: `eslint .`.

`tsconfig.json`: `strict` true, `module` and `moduleResolution` `Node16`, `target` `ES2022`, `outDir` `dist`, `rootDir` `src`, `esModuleInterop` true, `skipLibCheck` true, and `noEmitOnError` true. `include`: `src/**/*.ts` so root tool configs are not compiled. `exclude`: `src/__tests__` and `**/*.test.ts`.

Environment keys: always `PORT` and `NODE_ENV`. `sqlite` adds `SQLITE_PATH` default `./data/app.db`. `postgresql` adds `DATABASE_URL` as a placeholder only. Do not put a real secret in the file.

When a database is selected, `src/db/schema.ts` defines `_scaffold_meta` (`key` primary key, `value` text). `drizzle/0000_init.sql` creates that table with `IF NOT EXISTS`. SQLite startup runs that file. PostgreSQL startup runs it only when `DATABASE_URL` connects. A refused connection must not crash the process. `database=none` has no `src/db/` files.

`Dockerfile` exists only for `decide-later` and `long-running`. It is multi-stage `node:22-alpine`. Stage 1 runs `npm ci` and `npm run build`. Stage 2 copies `dist` and production `node_modules`, sets `USER node`, exposes `3000`, and runs `node dist/server.js`. `serverless` has no Dockerfile. `src/app.ts` exports `buildApp` and does not call `listen`. `src/server.ts` calls `listen` only for `decide-later` and `long-running`.

Every error response is this JSON and nothing else. No SQL, stack traces, hostnames, or file paths in that body.

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Something went wrong",
    "details": [],
    "requestId": "req_..."
  }
}
```

- `GET /health/live` returns 200 `{ "status": "alive" }`.
- `GET /health/ready` returns 200 `{ "status": "ready", "checks": { "database": "ok" } }` after a successful ping, 200 with `"not_configured"` when `database=none`, and 503 when a configured database ping fails.
- `GET /` returns 200 `{ "name": "<projectName>", "status": "ok" }`.
- Fastify: `buildApp()` registers `@fastify/swagger` and `@fastify/swagger-ui` at `/docs`, plus `GET /openapi.json` returning `app.swagger()`.
- Express: `GET /openapi.json` returns a small OpenAPI object, and `GET /docs` returns HTML that links to `/openapi.json`.
- Controllers call services. Services call the repository. Controllers and routes do not import the database client.

## Output Contract <!-- key: output-contract -->

- Layered files in Topology exist for the active `httpFramework`, `database`, and `runMode`.
- `src/app.ts` exports `buildApp` and does not call `listen`.
- `src/server.ts` calls `listen` only for `decide-later` and `long-running`.
- Health, root, and error JSON match Topology.
- Zod validates `PORT` and, when present, `DATABASE_URL` or `SQLITE_PATH`.
- Status codes: 200 live, 200 or 503 ready, 404 unknown routes via the error envelope, 500 unhandled errors via the same envelope.
- The request id comes from header `x-request-id` or a generated id. Do not log `DATABASE_URL` or other secrets.
- Fixed: choice tokens, the version table, layered paths, health JSON, the error envelope, the illegal `sqlite` + `serverless` pair, and the Dockerfile rule.
- Free: log line wording, OpenAPI summary text, and README phrasing.
- `npm run build` and `npm run lint` exit 0. `npm test` exits 0 and covers `GET /health/live`. `package-lock.json` exists after install.

## Verification Checks <!-- key: verification-checks -->

- [ ] `package.json` exists, `"type"` is `"module"`, and scripts include `dev`, `build`, `start`, `test`, and `lint`.
- [ ] Dependency specifiers match the Context table for the selected framework and database.
- [ ] `tsconfig.json` has `"strict": true`, `"noEmitOnError": true`, includes only `src/**/*.ts`, and excludes `src/__tests__`.
- [ ] `src/app.ts` exports `buildApp` and does not call `listen`.
- [ ] `GET /health/live` and `GET /health/ready` use the JSON shapes in Topology.
- [ ] `GET /` returns `projectName`.
- [ ] `GET /openapi.json` exists. Fastify also serves `/docs`.
- [ ] The error handler returns the envelope in Topology.
- [ ] `database=none` has no `src/db/` files and no Dockerfile dependency on a database.
- [ ] `database=sqlite` or `postgresql` has `src/db/client.ts`, `src/db/schema.ts`, `src/db/migrate.ts`, `drizzle/0000_init.sql`, and `drizzle.config.ts`.
- [ ] `runMode=serverless` has no `Dockerfile` and no `listen` inside `src/app.ts`.
- [ ] `runMode=decide-later` or `long-running` has `Dockerfile` with `USER node` and `src/server.ts`.
- [ ] Repo files exist: `README.md`, `.gitignore`, `.env.example`, `.github/workflows/ci.yml`, `eslint.config.js`.
- [ ] `npm run build` exits 0.
- [ ] `npm run lint` exits 0.
- [ ] `npm test` exits 0 and the `/health/live` assertion passes.
- [ ] `package-lock.json` is present on disk.
- [ ] When PostgreSQL is unreachable, the process still boots and `/health/ready` returns 503. That is still a pass when `/health/live`, build, lint, and test checks pass.
