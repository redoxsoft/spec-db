# Node.js Application Development Standards

## Goal <!-- key: goal -->

This document is the binding standard for projects created by the pipeline **Node Boilerplate Generator**. Agents resolve it by this exact title. If it is missing, the pipeline stops and names the title. Do not reconstruct these rules from memory. Do not invent a different stack.

The generated application is a **hello-world scaffold**, not a product. No authentication, no business workflow, no extra routes.

Apply named sections. Do not paraphrase this document into a second ruleset.

**Run-protocol band** (how the pipeline runs): `identity`, `workspace`, `lock-file`, `prerequisites`, `verification`, `user-output`.

**Project-standards band** (what the project must be): `file-manifest`, `repository`, `dependencies`, `commands`, `configuration`, `frontend`, `backend`, `persistence`, `quality`, `containers`, `documentation`, `security`.

`change-control` and `known-friction` apply to both bands.

## Change control <!-- key: change-control -->

Section keys are **append-only**. After this document is published, do not rename, reuse, or delete a key. Tasks cite keys; a rename breaks those citations. Add a new key when a new concern appears.

## User output <!-- key: user-output -->

**Chat output — once for the whole run.** The console may contain only the templates in this section, and only when a task says to print one. Do not print thoughts, plans, recap, status prose, or commentary before, between, or after those templates. Tool use and file writes are silent. A clean prerequisite pass prints nothing.

Every user-visible template must be printed as **one Markdown fenced block** with the info string `text`. Open with three backticks and `text`, then the template lines, then three backticks. That fence is required. Chat UIs join single newlines into a paragraph; only a fence keeps the lines stacked.

Do not print the same text outside the fence. Do not wrap the fence in a paragraph or extra prose. One field per line inside the fence. A real newline after each line.

Ask **one input per wait**. Do not ask for name and location on the same turn. The line that names the field is a question (ends with `?`).

`ok`, `yes`, `use default`, and `looks good` accept the default on that question. A typed value is the answer. `cancel` stops without `BLOCKED`. When there are several actions, number them (`1.`, `2.`, `3.`) and ask `Choice?`. Also accept the words.

A `WAITING FOR USER` block means the pipeline is **waiting**, not blocked and not failed. Do not print `stopped` or `failed` on a wait.

### Wait banner <!-- key: user-output-wait -->

Print one of these as a single `text` fence and nothing else, then stop. Never combine them. Keep the opening and closing fence marks.

**Project name** (first). Default is the current workspace folder name.

```text
WAITING FOR USER
Project name? (default: <display name>)
Type ok to use the default, or type a new name.
```

A new name is the answer. Do not ask for a second confirm. Reserved or empty slug: say why in one sentence and ask `Project name?` again. Do not offer a default that is reserved.

**Location** (second). Default is the parent of the current workspace with the slug appended.

```text
WAITING FOR USER
Location? (default: <absolute path>)
Type ok to use the default, or type a new path.
```

A new path is the answer. If the user gives a parent directory, append the slug. Occupied path, relative path, or filesystem rejection: say why in one sentence and ask `Location?` again. Do not invent a path. Do not offer `ok` when that default is unusable — omit `(default: …)` and write `Type a new path.`

### Resume banner <!-- key: user-output-resume -->

When `boilerplate-lock.md` exists at the path about to be used, print this as a single `text` fence and nothing else. Do not ask for name or location on this turn. Keep the opening and closing fence marks.

```text
WAITING FOR USER
A previous run exists at <absolute path> (status: <lock status>).
1. Resume
2. Restart
3. Use a new path
Choice? (1, 2, or 3)
```

`1` or `resume` continues at the first incomplete progress box. `2` or `restart` rewrites the lock and regenerates. `3` or a new path switches to the location question.

### Node wait banner <!-- key: user-output-node -->

When Node 22 cannot be selected but a Node major greater than 22 is already on PATH, print this as a single `text` fence and nothing else. Keep the opening and closing fence marks.

```text
WAITING FOR USER
Recommended Node 22 is not available. Continue with <detected-version>?
Type ok to continue, or cancel.
```

`ok` / `yes` / `continue` records the override. `cancel` / `no` stops without `BLOCKED`.

### Working line <!-- key: user-output-working -->

Before work starts on a long box, print this as a single `text` fence:

```text
WORKING ON <box-name>
```

Allowed working names: `repository`, `npm install`, `applications`, `tests`, `containers-and-docs`, `verify`. Do not print this line when skipping an already-checked box. Do not print it for `lock-initialized`.

### Progress line <!-- key: user-output-progress -->

When a lock progress box is checked, print this as a single `text` fence:

```text
PROGRESS <box-name> done
```

Allowed box names: `lock-initialized`, `repository`, `npm install`, `applications`, `tests`, `containers-and-docs`, `verify`.

### Blocked stop <!-- key: user-output-blocked -->

Every hard stop prints this as a single `text` fence:

```text
BLOCKED
Where: <task key>
Problem: <one line>
Do this: <exact next action>
Then: after you finish that, rerun Node Boilerplate Generator
```

`Do this` is for the human. The agent must not install Node or other tools, and must not change the machine. Omit `Log` when no command ran.

When a required command or Compose check failed, insert this block after `Problem` and before `Do this`, then tear down:

```text
Log:
<up to the last 50 lines of the failed command or Compose logs>
```

Examples of **Do this**:

- Install the spec titled `Node.js Application Development Standards` into this workspace.
- Install Node 22, or any Node 22 or newer, so `node -v` works. The agent will not install Node.
- Install npm, or install both PostgreSQL (or `psql`) and Docker Compose.

### Close-out report <!-- key: user-output-report -->

The last task prints only these headings, in this order, as a single `text` fence, with no extra narrative:

```text
Made
- path: <absolute project root>
- name: <display name>
- slug: <package slug>
- tree: apps/frontend, apps/backend, migrations, package.json

Run
cd <absolute project root> && npm run dev
then http://localhost:5173 (or the port Vite printed if 5173 was busy)

Health
GET /health is 503 until .env has real DB_* or DATABASE_URL. Compose uses the documented placeholders and does not need that edit.

Checks
- <id>: pass | skipped | not-configured — <one-line why>
```

If the lock records `node: <version> (override)`, add one Checks line: verify ran on that Node; the project still pins 22.

Print **Next** only when status is `blocked`:

```text
Next
- failed: <lock field or task key>
- command: <literal command that failed>
- do this: <likely fix>
- then: resume Node Boilerplate Generator
```

## Identity <!-- key: identity -->

Collect a **display name** from the user (prompts call this the project name). Keep the user's spelling in the README title and the Hello page heading. The lock field stays `display_name`.

Derive **package name** and **folder name** as one slug:

1. Lowercase.
2. Replace spaces and underscores with `-`.
3. Strip every character that is not `a-z`, `0-9`, or `-`.
4. Collapse consecutive hyphens.
5. Trim leading and trailing hyphens.

Example: `My First App` becomes `my-first-app`.

The slug must be a single path segment, non-empty, and not reserved. Reserved names: `node_modules`, `test`, `tests`, `dist`, `build`, `coverage`, `src`, `app`, `package`, `packages`.

Default display name is the current workspace folder name. Default location is the parent of the current workspace, with the slug appended.

**One wait per turn.** Ask project name first, then location. Use the templates in `user-output`. Do not ask both on one turn.

- `ok`, `yes`, `use default`, or `looks good` accepts the default on that question.
- A typed name or path is the answer. Do not ask for a second confirm.
- Occupied path: keep the display name. Ask `Location?` again with one sentence of why. Do not invent a path. Do not append a suffix. Do not offer `ok` for an unusable default.
- Reserved or empty slug: ask `Project name?` again with one sentence of why.
- Relative path: ask `Location?` again and require an absolute path.

Do not create the project directory until name and location are both answered.

## Workspace <!-- key: workspace -->

The project root must be an **absolute** filesystem path.

If the user gives a parent directory, append the slug as the last segment.

Classify the path:

- **Empty** — no files. Safe to use.
- **Git-only** — only `.git`, optional `.gitignore`, and optional `boilerplate-lock.md`. Safe to use.
- **Occupied** — anything else. During intake, ask `Location?` again with one sentence of why. After both answers, print `BLOCKED` if the path is still occupied. Do not overwrite an existing application. Do not invent a different root.

Do not use a relative path. If the filesystem rejects the path, ask `Location?` again. Keep the display name unchanged.

## Lock file <!-- key: lock-file -->

Path: `boilerplate-lock.md` at the project root.

This file is **gitignored**. Do not commit it.

Create it immediately after confirm, before generating application code. Later tasks update it. A missing lock after intake is a stop: print the `BLOCKED` template from `user-output` and tell the user to rerun intake.

Required body:

```markdown
# Boilerplate lock

- spec: Node.js Application Development Standards
- pipeline: Node Boilerplate Generator
- status: prerequisites | intake | generating | verifying | complete | blocked

## Identity
- display_name:
- package_name:
- project_root:

## Prerequisites
- spec: ok
- node: <version> | <version> (override)
- npm:
- postgres_installed:
- docker:
- postgres_credentials: placeholder | configured | connected

## Progress
- [ ] lock-initialized
- [ ] repository
- [ ] dependencies
- [ ] applications
- [ ] tests
- [ ] containers-and-docs
- [ ] verify

## Verification
- install: pending | pass | fail
- lint: pending | pass | fail
- build: pending | pass | fail
- test-unit: pending | pass | fail
- backend-boot: pending | pass | fail
- dev-boot: pending | pass | fail
- health-local: pending | pass | fail | skipped | not-configured
- frontend-http: pending | pass | fail | skipped
- compose: pending | pass | fail | skipped
- compose-health: pending | pass | fail | skipped

## Resolved versions
- (package@version lines written after npm install)

## Blockers
- (empty or last failure and task key)
```

Allowed `status` values: `prerequisites`, `intake`, `generating`, `verifying`, `complete`, `blocked`.

Resume: skip completed progress items; continue at the first incomplete one. Restart: rewrite the lock and regenerate. Do not create a second project beside an existing lock unless the user chose a new path.

After the lock exists, no task asks for name or path again. Read them from this file.

## Prerequisites <!-- key: prerequisites -->

Resolve this spec by the exact title **Node.js Application Development Standards**. If it cannot be found, print the `BLOCKED` template from `user-output` (install that exact title into this workspace) and stop.

Then check tools. On a clean pass (spec present, Node 22 selected, npm present, PostgreSQL or Docker present), print nothing.

Do not install tools or create cloud resources, **except** selecting an already-installed Node 22 for this shell. Do not change the user's default Node alias.

**Node version** — apply in this order:

1. If `node -v` major is 22, use it.
2. Else if Node 22 is already installed and selectable in this shell, **use it without asking**. Look for `nvm`, `fnm`, `volta`, `asdf`, and Homebrew `node@22` (for example `$(brew --prefix node@22)/bin`). Put that 22 on PATH or run the manager's `use` for this shell only. Recheck `node -v`. If it is not major 22, continue to step 3.
3. Else if `node -v` major is **greater than 22**, print the Node wait banner from `user-output-node`. `ok` records `node: <detected> (override)` for the lock; generated `.nvmrc` and `engines.node` stay `22` / `22.x`. `cancel` stops without `BLOCKED`.
4. Else print `BLOCKED` (Node missing, or major below 22 and no Node 22 installed).

| Check | Required | If missing |
|---|---|---|
| This spec | yes | Fail. Name the title. Stop. |
| Node.js 22 selected, or user accepted a 22+ override | yes | Fail only after the Node version rules above. |
| npm (`npm -v`) | yes | Fail. Stop. |
| PostgreSQL (server or `psql` on PATH) **or** Docker and Docker Compose | at least one | If both missing, fail. If only PostgreSQL is missing, record `postgres_installed: missing` and skip local-database checks. If only Docker is missing, record `docker: missing` and skip container verification. Still generate Docker files. |

Placeholder database credentials are expected on a first run. Do not wait for the user to type a username, password, or `DATABASE_URL`.

## Verification <!-- key: verification -->

Run checks cheapest-first. Record each outcome in the lock as it happens. Do not wait for the user to edit `.env`. Tear down every process and container this task starts.

| Id | Command | Required | Skip when | Lock field |
|---|---|---|---|---|
| `install` | `npm install` | yes | never (already done in install step; re-run if lock says fail) | `install` |
| `lint` | `npm run lint` | yes | never | `lint` |
| `build` | `npm run build` | yes | never | `build` |
| `test-unit` | `npm run test:unit` | yes | never | `test-unit` |
| `dev-boot` | `npm run dev` from the project root with the generated `.env`; Vite and the API stay up | yes | never | `dev-boot` |
| `backend-boot` | API child of `npm run dev` is listening on `PORT` (3000) | yes | never | `backend-boot` |
| `health-local` | `GET` `http://localhost:3000/health` | no | Docker-only machine, or placeholder credentials that refuse the connection | `health-local` (`not-configured` when placeholders fail) |
| `frontend-http` | HTTP GET the Vite origin that actually bound; body contains `data-section="hero"` through `data-section="next"` and the display name; the Vite-served env module does not throw | yes when Vite bound a port | Vite could not start | `frontend-http` |
| `compose` | `docker compose up --build -d` | yes when Docker is present **and** the daemon, ports, and pull succeed | Docker missing, daemon stopped, occupied host port, blocked image pull | `compose` (`skipped` plus reason for environment failures) |
| `compose-health` | `GET` backend `/health` on the Compose network or published backend port; expect 200 | yes when `compose` is `pass` | `compose` is not `pass` | `compose-health` |

`health-local` 200 is not a pipeline gate. 503 `database_unavailable` with placeholders is `not-configured`.

`dev-boot` is the first-run contract. Spawn `npm run dev` from the project root. Do not substitute `vite preview` or `serve`. Port **3000** is required: if the API exits with `EADDRINUSE`, `dev-boot` and `backend-boot` **fail**. Port **5173** is not required: Vite may bind the next free port (`strictPort: false`). Read that port from Vite's log and use it for `frontend-http`.

`compose` fails the run only when generated wiring is broken (bad Dockerfile, wrong service name, app crash). Environment failures are skips (including an occupied Compose **frontend** host port). An occupied host port **3000** still fails `dev-boot`.

Frontend visual confirmation is **not** a pipeline gate. Assert the `data-section` markers over HTTP. Also GET the Vite-served `apps/frontend/config/env.ts` module and fail `frontend-http` if it throws or the body is `Missing VITE_API_BASE_URL`. Unit tests lock status copy and section order. The close-out **Run** line tells the user to open the URL Vite printed.

Print `WORKING ON verify` before the matrix. After checks, run `docker compose down` if this task started Compose. Kill any backend, Vite, or `serve` process this task started. Print `PROGRESS verify done` only when required checks passed.

On required-check failure: copy up to the last 50 lines of the failed command or Compose logs into the `BLOCKED` `Log` slot, print `BLOCKED`, then tear down. Do not tell the user to inspect containers this task already removed. Leave the tree recoverable. Do not report success.

## File manifest <!-- key: file-manifest -->

The pipeline writes **only** the paths listed below (plus empty directories named in `repository`). Stop if any other application file is already present at the project root.

### Root and tooling files <!-- key: file-manifest-root -->

| Path | Purpose |
|---|---|
| `package.json` | Single root manifest and scripts |
| `package-lock.json` | npm lockfile, written at install |
| `.nvmrc` | `22` |
| `.gitignore` | Includes `boilerplate-lock.md` |
| `.dockerignore` | Excludes secrets and junk |
| `.env.example` | Placeholder env names |
| `.env` | Local copy of the example; gitignored |
| `boilerplate-lock.md` | Run state; gitignored |
| `tsconfig.json` | Solution-style references |
| `tsconfig.frontend.json` | Frontend TypeScript |
| `tsconfig.backend.json` | Backend TypeScript |
| `eslint.config.js` | ESLint 9 flat config |
| `jest.config.cjs` | Jest unit tests only |
| `.mocharc.cjs` | Mocha integration tests only |
| `vite.config.ts` | Vite frontend bundler |
| `Dockerfile` | Multi-stage `frontend` and `backend` targets |
| `docker-compose.yml` | `frontend`, `backend`, `postgres` |
| `README.md` | Setup and commands |

### Application and test files <!-- key: file-manifest-app -->

| Path | Purpose |
|---|---|
| `apps/frontend/index.html` | Vite HTML entry |
| `apps/frontend/main.tsx` | React mount |
| `apps/frontend/styles.css` | Plain CSS |
| `apps/frontend/vite-env.d.ts` | Vite client types |
| `apps/frontend/config/env.ts` | Reads `VITE_*` only |
| `apps/frontend/pages/Home.tsx` | Hello page |
| `apps/frontend/services/health.ts` | Health fetch |
| `apps/frontend/types/health.ts` | Status mapper types |
| `apps/frontend/utils/healthStatus.ts` | Maps API result to page text |
| `apps/backend/main.ts` | Process entry |
| `apps/backend/config/env.ts` | Reads `process.env` only here |
| `apps/backend/config/logger.ts` | Pino logger |
| `apps/backend/routes/index.ts` | Route table |
| `apps/backend/controllers/rootController.ts` | `GET /` |
| `apps/backend/controllers/healthController.ts` | `GET /health` |
| `apps/backend/services/healthService.ts` | Health orchestration |
| `apps/backend/data/db.ts` | `pg` pool and `SELECT 1` |
| `apps/backend/middleware/errorHandler.ts` | Safe JSON errors |
| `migrations/001_init.cjs` | No-op or `SELECT 1` migration |
| `tests/unit/healthService.test.ts` | Jest: mocked data layer |
| `tests/unit/healthStatus.test.ts` | Jest: three status strings |
| `tests/unit/Home.test.tsx` | Jest + jsdom: `data-section` order |
| `tests/integration/health.test.ts` | Mocha: live or skipped DB |

`apps/frontend/components/`, extra files under `apps/frontend/utils/` besides `healthStatus.ts`, `apps/backend/models/`, and `apps/backend/utils/` may exist as empty directories with a `.gitkeep` so the tree matches `repository`.

## Repository <!-- key: repository -->

One git repository. One root `package.json`. One root `package-lock.json`. Centralized dependencies and scripts. **No nested `package.json`.** `apps/frontend` and `apps/backend` are directories, not packages.

No `packages/` directory, no `apps/mobile`, no `.github/`, no `turbo.json`, no `pnpm-workspace.yaml`.

Root `package.json` fields:

- `name`: the slug from `identity`
- `private`: `true`
- `type`: `module`
- `engines.node`: `22.x`

`.nvmrc` contains exactly `22`.

TypeScript `strict` is true in every tsconfig. Do not use `any`.

Root `tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.frontend.json" },
    { "path": "./tsconfig.backend.json" }
  ]
}
```

`tsconfig.frontend.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "noEmit": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "types": ["vite/client"]
  },
  "include": [
    "apps/frontend/**/*.ts",
    "apps/frontend/**/*.tsx",
    "tests/unit/Home.test.tsx",
    "vite.config.ts"
  ]
}
```

`tsconfig.backend.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "jsx": "react-jsx",
    "outDir": "dist/backend",
    "rootDir": ".",
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": [
    "apps/backend/**/*.ts",
    "tests/unit/**/*.ts",
    "tests/integration/**/*.ts"
  ]
}
```

## Dependencies <!-- key: dependencies -->

Write the complete set in `package.json` during repository generation. Do not add packages later unless `known-friction` requires a listed extra. Use exact versions (no star ranges). At install time, take the latest stable release of each named library that supports Node 22. Record `name@version` lines in the lock file `Resolved versions` section after `npm install`. A resumed run reuses those versions.

Do not add Prettier, Tailwind, Prisma, Knex, Next.js, or a UI kit.

### Runtime packages <!-- key: dependencies-runtime -->

| Package | Role |
|---|---|
| `express` | HTTP server (Express 5) |
| `pg` | PostgreSQL client |
| `pino` | Structured logs |
| `zod` | Backend request validation |
| `cors` | CORS for the frontend origin |
| `dotenv` | Load `.env` in the backend config module only |

### Development packages <!-- key: dependencies-dev -->

| Package | Role |
|---|---|
| `typescript` | TypeScript 5 |
| `@types/node` | Node types |
| `@types/express` | Express types |
| `@types/cors` | CORS types |
| `@types/pg` | `pg` types |
| `tsx` | Backend runner and Mocha loader |
| `concurrently` | Root `dev` script |
| `vite` | Frontend bundler |
| `@vitejs/plugin-react` | React plugin |
| `react` | React 19 |
| `react-dom` | React DOM 19 |
| `@types/react` | React types |
| `@types/react-dom` | React DOM types |
| `eslint` | ESLint 9 |
| `typescript-eslint` | TypeScript ESLint |
| `jest` | Unit tests |
| `ts-jest` | Jest TypeScript transform |
| `@types/jest` | Jest types |
| `mocha` | Integration tests |
| `@types/mocha` | Mocha types |
| `node-pg-migrate` | Migrations |
| `serve` | Static serve of Vite `dist` |
| `@testing-library/react` | Render `Home` in unit tests |
| `@testing-library/jest-dom` | DOM matchers for the page test |
| `jest-environment-jsdom` | jsdom for `Home.test.tsx` only |

## Commands <!-- key: commands -->

Root `package.json` `scripts` must be these literal strings (the slug does not appear in the commands):

```json
{
  "dev": "concurrently -n web,api -c cyan,magenta \"vite\" \"tsx apps/backend/main.ts\"",
  "build": "tsc --build && vite build",
  "lint": "eslint apps tests",
  "test": "npm run test:unit && npm run test:integration",
  "test:unit": "NODE_OPTIONS=--experimental-vm-modules jest --config jest.config.cjs",
  "test:integration": "mocha --config .mocharc.cjs",
  "migrate": "node-pg-migrate up --esm"
}
```

No globally installed npm package is required to install, build, test, or run.

## Configuration <!-- key: configuration -->

`.env` is gitignored and dockerignored. `.env.example` is committed with names and placeholders only.

On generate, if `.env` does not exist, copy `.env.example` to `.env`.

`.env.example` contents:

```text
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app
DB_USER=app
DB_PASSWORD=changeme
DATABASE_URL=postgresql://app:changeme@localhost:5432/app
VITE_API_BASE_URL=http://localhost:3000
```

All npm scripts run from the project root. Both processes load the **same** root `.env`.

Backend reads environment variables **only** in `apps/backend/config/env.ts`. That module calls `dotenv.config({ path: path.resolve(process.cwd(), '.env') })`, validates required keys with Zod, and exits non-zero if a key is missing. The error names the key and never prints the value.

Frontend reads `VITE_*` **only** in `apps/frontend/config/env.ts`. Vite injects those keys because `vite.config.ts` sets `envDir` to `process.cwd()` (the project root), not `apps/frontend`.

`apps/frontend/config/env.ts` (copy verbatim):

```ts
const raw = import.meta.env.VITE_API_BASE_URL;

export const env = {
  VITE_API_BASE_URL: typeof raw === 'string' ? raw : ''
};
```

Do not throw at import time. An empty value makes the health fetch fail and the status banner show `API unreachable`. The Hello page must still paint.

Startup does **not** fail if the database refuses the placeholder password. A missing **backend** key fails the API process. A refused connection does not.

`.gitignore` must include:

```text
node_modules/
.env
.env.*
!.env.example
dist/
build/
coverage/
logs/
*.log
boilerplate-lock.md
```

## Frontend <!-- key: frontend -->

Vite + React 19 + HTML + the verbatim CSS below. No Tailwind, no component library, no router, no client store, no auth.

`vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'apps/frontend',
  envDir: process.cwd(),
  server: {
    port: 5173,
    strictPort: false
  },
  preview: {
    port: 5173,
    strictPort: false
  },
  build: {
    outDir: '../../dist/frontend',
    emptyOutDir: true
  }
});
```

`apps/frontend/vite-env.d.ts` declares `ImportMetaEnv.VITE_API_BASE_URL` as `string`.

`apps/frontend/index.html` mounts `#root` and loads `./main.tsx`.

`apps/frontend/pages/Home.tsx` is the only page. Bake two constants from the lock file at generate time: `DISPLAY_NAME` and `DOCKER_SKIPPED` (true when the lock recorded Docker as missing). Pages do not call `fetch` directly. On load, call `apps/frontend/services/health.ts` and map the result with `healthStatus.ts`.

Required DOM, in this order. Do not add, remove, or reorder sections.

Literals a developer copies (paths, env names, commands, `/health`) are semantic `<code>` elements, not plain text. `textContent` of each section stays the strings below.

1. `header` with `data-section="hero"` and class `hero`: `p.eyebrow` text `Hello world scaffold`; `h1` is `DISPLAY_NAME`; `p.lede` text `A blank fullstack app: React frontend, Express API, and PostgreSQL.`
2. `section` with `data-section="status"` and class `banner banner-ok`, `banner-warn`, or `banner-error` from the status mapper tone. Visible text is exactly one of the three status strings. When that string names `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DATABASE_URL`, or `.env`, wrap each of those tokens in `<code>`.
3. `section` with `data-section="structure"` and class `card`: `h2` text `How it is structured`; a `ul` of four items: `<code>apps/frontend</code> — Vite + React UI`; `<code>apps/backend</code> — Express REST API`; `<code>migrations</code> — database migrations`; `<code>package.json</code> — one root package`.
4. `section` with `data-section="pending"` and class `card`: `h2` text `Pending`; always an Environment paragraph: `<code>.env</code> was copied from <code>.env.example</code>. Set <code>DB_HOST</code>, <code>DB_PORT</code>, <code>DB_NAME</code>, <code>DB_USER</code>, <code>DB_PASSWORD</code> (or <code>DATABASE_URL</code>) for local <code>/health</code> 200.` If `DOCKER_SKIPPED` is true, add a second paragraph: Docker was not found; container verification was skipped. If `DOCKER_SKIPPED` is false and there is no other pending item, add `No other setup pending.`
5. `section` with `data-section="next"` and class `card`: `h2` text `Next`; a direct-child `<code>` with text `npm run dev`; then `UI: <a href="http://localhost:5173">http://localhost:5173</a>` and `API: <a href="http://localhost:3000/health">http://localhost:3000/health</a>`.

`apps/frontend/utils/healthStatus.ts` maps the fetch outcome to plain text and tone. `Home.tsx` wraps the listed tokens in `<code>` when it renders the banner. Do not put HTML in the mapper strings.

| Condition | Page text | Tone class |
|---|---|---|
| Request to the API fails | `API unreachable` | `banner-error` |
| API 503 with reason `database_unavailable` | `Database not connected. Set DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD (or DATABASE_URL) in .env and restart.` | `banner-warn` |
| API 200 | `API reachable` | `banner-ok` |

`apps/frontend/styles.css` (copy verbatim):

```css
:root {
  color-scheme: light;
  --bg: #f4f7fb;
  --ink: #1e293b;
  --muted: #64748b;
  --card: #ffffff;
  --line: #e2e8f0;
  --ok: #047857;
  --ok-bg: #ecfdf5;
  --ok-line: #6ee7b7;
  --warn: #0369a1;
  --warn-bg: #e0f2fe;
  --warn-line: #7dd3fc;
  --err: #b91c1c;
  --err-bg: #fef2f2;
  --err-line: #fca5a5;
  --accent: #2563eb;
  --accent-dark: #1e40af;
  --code-bg: #f1f5f9;
  --code-ink: #334155;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-family: var(--font-sans);
}

* { box-sizing: border-box; }

body {
  margin: 0;
  padding: 2rem 1.5rem;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.page {
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
  padding: 0 0 4rem;
}

.hero { margin-bottom: 2.5rem; }

.eyebrow {
  display: block;
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--accent);
}

.hero h1 {
  margin: 0 0 0.5rem;
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #0f172a;
}

.lede {
  margin: 0;
  font-size: 1.125rem;
  color: var(--muted);
}

.banner {
  padding: 1rem 1.5rem;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
  border: 1px solid var(--line);
  border-left-width: 4px;
  font-size: 0.95rem;
  font-weight: 500;
}

.banner-ok { background: var(--ok-bg); color: var(--ok); border-color: var(--ok-line); border-left-color: var(--ok); }
.banner-warn { background: var(--warn-bg); color: var(--warn); border-color: var(--warn-line); border-left-color: var(--accent); }
.banner-error { background: var(--err-bg); color: var(--err); border-color: var(--err-line); border-left-color: var(--err); }

.card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 1.75rem 2rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card h2 {
  margin: 0 0 1rem;
  padding-bottom: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  border-bottom: 1px solid var(--bg);
}

.card ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.card li {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0 0 0.75rem;
  color: var(--muted);
}

.card li:last-child { margin-bottom: 0; }

.card li::before {
  content: "•";
  color: var(--accent);
  font-weight: 700;
}

.card p {
  margin: 0 0 1rem;
  color: var(--muted);
}

.card p:last-child { margin-bottom: 0; }

code {
  font-family: var(--font-mono);
  background: var(--code-bg);
  color: var(--code-ink);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: 500;
}

[data-section="next"] > code {
  display: block;
  background: #0f172a;
  color: #e2e8f0;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
  overflow-x: auto;
}

a {
  color: var(--accent);
  font-weight: 500;
  text-decoration: none;
}

a:hover {
  color: var(--accent-dark);
  text-decoration: underline;
}

@media (max-width: 600px) {
  .hero h1 { font-size: 2rem; }
  .card { padding: 1.25rem 1.5rem; }
}
```

## Backend <!-- key: backend -->

Express 5. REST. JSON only. ESM.

Process entry: `apps/backend/main.ts`. Listens on `PORT` from env (3000). `EADDRINUSE` on that port is a **hard failure**. Do not try another API port.

Layering is mandatory:

- `routes` register paths and delegate to controllers
- `controllers` parse the request and call services
- `services` hold logic
- `data` talks to PostgreSQL

No business logic in route files.

Routes:

- `GET /` → 200 `{"name":"<display name>"}` (display name baked in at generate time)
- `GET /health` → 200 `{"status":"ok"}` after parameterized `SELECT 1`; 503 `{"status":"error","reason":"database_unavailable"}` if the query fails

No other routes.

The process **stays up** if PostgreSQL is unreachable.

CORS in development allows any origin whose host is `localhost` or `127.0.0.1` (Vite may have moved off 5173). In production, allow `http://localhost:5173` only.

`apps/backend/config/logger.ts` creates one Pino logger. Application code does not call `console.log`.

`apps/backend/middleware/errorHandler.ts` returns JSON without stack traces, SQL, file paths, environment values, or connection strings.

## Persistence <!-- key: persistence -->

PostgreSQL 16. Access through `pg` only. Parameterized queries only. No Prisma, Knex, or Sequelize.

`apps/backend/data/db.ts` owns the pool. Health uses parameterized `SELECT 1`.

No product tables.

`migrations/001_init.cjs` is a no-op (empty `up` / `down`, or `SELECT 1`) so `npm run migrate` is wired.

Compose image: `postgres:16-alpine`. Compose credentials match `.env.example` (`app` / `changeme` / `app`).

## Quality <!-- key: quality -->

ESLint 9 flat config. No Prettier.

`eslint.config.js`:

```js
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**']
  },
  ...tseslint.configs.recommended,
  {
    files: ['apps/**/*.ts', 'apps/**/*.tsx', 'tests/**/*.ts', 'vite.config.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error'
    }
  }
);
```

Jest is the unit runner. Mocha is the integration runner. Configs must not overlap.

`jest.config.cjs`:

```js
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/unit'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.tsx$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.frontend.json'
      }
    ],
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.backend.json'
      }
    ]
  }
};
```

`.mocharc.cjs`:

```js
module.exports = {
  spec: 'tests/integration/**/*.test.ts',
  timeout: 10000,
  loader: 'tsx/esm'
};
```

`tests/unit/healthService.test.ts` mocks the data layer. No network, no Docker, no PostgreSQL.

`tests/unit/healthStatus.test.ts` asserts the three frontend status strings and their tone classes.

`tests/unit/Home.test.tsx` starts with `@jest-environment jsdom`. It mocks `health.ts`, renders `Home`, and asserts `data-section` values `hero`, `status`, `structure`, `pending`, `next` in that order, plus the display name in `hero`. It also asserts `<code>` wraps for `apps/frontend`, `.env`, and `DB_HOST`, and that Next's two URLs are `<a href>` links.

`tests/integration/health.test.ts` asserts 200 when a database is available and 503 `database_unavailable` when the data layer reports down. If credentials are placeholders and no live database is reachable, skip the live case; do not fail the suite.

Failed tests exit non-zero. Tests contain no production secrets.

## Containers <!-- key: containers -->

One root `Dockerfile`, multi-stage, targets `frontend` and `backend`. Base image `node:22-bookworm-slim`. Production stages run as a non-root user. Do not copy `.env`.

```dockerfile
# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
COPY . .
ARG VITE_API_BASE_URL=http://localhost:3000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM node:22-bookworm-slim AS frontend
WORKDIR /app
RUN useradd --user-group --create-home --shell /bin/false appuser
COPY --from=build /app/dist/frontend ./dist/frontend
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
USER appuser
EXPOSE 5173
CMD ["npx", "serve", "-s", "dist/frontend", "-l", "5173"]

FROM node:22-bookworm-slim AS backend
WORKDIR /app
RUN useradd --user-group --create-home --shell /bin/false appuser
COPY --from=build /app/dist/backend ./dist/backend
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
USER appuser
EXPOSE 3000
CMD ["node", "dist/backend/apps/backend/main.js"]
```

Keep `tsconfig.backend.json` `rootDir` as `"."` so this `CMD` path matches emit. Do not change `rootDir`.

`.dockerignore`:

```text
node_modules
.git
.env
.env.*
coverage
logs
*.log
boilerplate-lock.md
```

`docker-compose.yml`:

```yaml
services:
  frontend:
    build:
      context: .
      target: frontend
      args:
        VITE_API_BASE_URL: http://localhost:3000
    ports:
      - "5173:5173"
    depends_on:
      backend:
        condition: service_started
  backend:
    build:
      context: .
      target: backend
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: "3000"
      DB_HOST: postgres
      DB_PORT: "5432"
      DB_NAME: app
      DB_USER: app
      DB_PASSWORD: changeme
      DATABASE_URL: postgresql://app:changeme@postgres:5432/app
    depends_on:
      postgres:
        condition: service_healthy
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: changeme
      POSTGRES_DB: app
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  postgres_data:
```

Do **not** publish the Postgres container port to the host. Backend uses hostname `postgres`, never `localhost`, to reach the database.

Supported commands: `docker compose build`, `docker compose up`, `docker compose down`.

## Documentation <!-- key: documentation -->

Root `README.md` documents, in this order:

1. Display name.
2. One-line description: blank fullstack hello-world.
3. Stack: Node 22, TypeScript, React, Vite, Express, PostgreSQL, npm.
4. Repository tree.
5. Required Node.js version: 22.
6. `npm install`.
7. `.env` is created from `.env.example` and must be edited with real local Postgres credentials before `/health` returns 200 outside Compose.
8. Scripts from `commands`.
9. Compose commands. Compose uses the example user, database, and password and should show reachable.
10. Expected first-run UI: the five `data-section` regions (hero, status, structure, pending, next); status banner until `.env` is fixed, or reachable under Compose.
11. Limitation: this is a scaffold, not a product.

No real secrets in the README.

## Security <!-- key: security -->

Secrets never appear in git, source, comments, logs, API responses, Docker image layers, or Compose files as production credentials (Compose hello-world may use the documented `changeme` placeholders only).

Do not log passwords, hashes, tokens, `Authorization` headers, or private keys.

SQL is parameterized. Do not concatenate untrusted input into queries.

API errors never include stack traces, environment values, file paths, SQL, or connection strings.

`.env` is never committed or copied into an image.

## Known friction <!-- key: known-friction -->

Use these resolutions. Do not invent alternatives.

**Jest + ts-jest + ESM.** `package.json` has `"type": "module"`. Jest config is CommonJS (`jest.config.cjs`) so Jest can load it. Set `extensionsToTreatAsEsm` and `ts-jest` `useESM: true`. The `test:unit` script sets `NODE_OPTIONS=--experimental-vm-modules`. Unit tests import backend modules with the `.js` suffix that NodeNext emit expects; `moduleNameMapper` strips that suffix for ts-jest.

**Mocha + tsx.** Mocha config is `.mocharc.cjs` with `loader: 'tsx/esm'`. Integration files are TypeScript. Do not attach Mocha to the Jest config.

**Express 5 async errors.** Wrap async handlers so rejected promises reach `errorHandler`. Do not leave an unhandled rejection.

**Vite env file.** `vite.config.ts` sets `root` to `apps/frontend` and `envDir` to `process.cwd()` so `VITE_*` comes from the root `.env`. Do not load a second `.env` under `apps/frontend`. `VITE_*` is inlined at `vite build`; Compose passes `VITE_API_BASE_URL` as a build arg, not a runtime env on the `serve` image.

**SPA fallback.** The frontend image uses `serve -s` so unknown paths return `index.html`.

**Unit import path.** `tests/unit` imports from `apps/backend/...`, `apps/frontend/utils/healthStatus.ts`, and `apps/frontend/pages/Home.tsx`. Do not duplicate production logic inside the test.

**Home page test.** `tests/unit/Home.test.tsx` starts with `@jest-environment jsdom`. Jest transforms `*.tsx` with `tsconfig.frontend.json` and `*.ts` with `tsconfig.backend.json`. Mock `apps/frontend/services/health.ts`. Assert the `<code>` and `<a href>` wraps from `frontend`. Do not add Playwright or Cypress.

**Integration database probe.** Before asserting 200, try `SELECT 1` or `GET /health`. If the connection is refused, skip the live-200 case and still assert the 503 mapper or a mocked-down path. Do not fail the suite for placeholder credentials.
