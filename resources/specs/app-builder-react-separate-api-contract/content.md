# App Builder React Separate API Contract

## Context <!-- key: context -->

`frontend/` is a React + Vite SPA and `backend/` is an HTTP API. The page shows `projectName` and the API live status fetched via the proxy. No auth or business resources. The UI matches the React and Vite web app starter. The Node API is Fastify only. The Python API is FastAPI only. This starter adds a root runner, a Vite proxy, and CORS.

Never use `latest`. Never use Tailwind 4. Frontend `tailwindcss` is `3.4.19` with `tailwind.config.ts` and `@tailwind` directives.

### Root and frontend pins

| Package | Specifier | Where |
| :--- | :--- | :--- |
| `concurrently` | `10.0.5` | root devDependency |
| `react` / `react-dom` | `19.3.0` | frontend |
| `vite` | `8.3.1` | frontend dev |
| `@vitejs/plugin-react` | `6.1.1` | frontend dev |
| `typescript` | `5.9.3` | frontend dev; Node backend dev |
| `tailwindcss` | `3.4.19` | frontend dev |
| `postcss` | `8.5.28` | frontend dev |
| `autoprefixer` | `10.6.1` | frontend dev |
| `vitest` | `5.0.2` | frontend dev; Node backend dev |
| `@testing-library/react` | `16.3.3` | frontend dev |
| `jsdom` | `30.1.1` | frontend dev |
| `@types/react` / `@types/react-dom` | `19.3.0` | frontend dev |
| `eslint` / `@eslint/js` | `9.39.5` | frontend dev |
| `typescript-eslint` | `8.71.0` | frontend dev |
| `clsx` | `2.1.1` | frontend |
| `tailwind-merge` | `3.7.0` | frontend |

### Backend pins

| Package | Specifier | Where |
| :--- | :--- | :--- |
| `fastify` | `5.12.5` | Node backend |
| `zod` | `4.6.5` | Node backend |
| `fastapi` | `0.142.1` | Python backend |
| `uvicorn` | `0.54.0` | Python backend |
| `httpx` | `0.28.1` | Python backend |
| `pydantic` | `2.13.5` | Python backend |
| `pytest` | `9.1.1` | Python backend |
| `drizzle-orm` | `0.45.3` | backend when a database is selected |
| `drizzle-kit` | `0.31.11` | Node backend dev, when a database is selected |
| `better-sqlite3` | `12.11.1` | backend when `database=sqlite` |
| `sqlalchemy` | `2.1.1` | Python backend when a database is selected |
| `alembic` | `1.20.0` | Python backend when a database is selected |
| `pg` | `8.23.0` | Node backend when `database=postgresql` |
| `psycopg[binary]` | `3.3.6` | Python backend when `database=postgresql` |

Apply App Builder Web Standards, section Topology & Directory Structure, for the React + Vite tree, and section Layering & Design Patterns for `cn()` and Tailwind. Apply App Builder API Standards, section Resilience, Errors & Diagnostics, for health and the error envelope, and section Data Flow & State Lifecycle so handlers do not run SQL.

## Choice Tokens <!-- key: choice-tokens -->

- `apiRuntime`: `node` or `python`.
- `database`: `none`, `sqlite`, or `postgresql`.
- `runMode`: `decide-later`, `long-running`, or `serverless`.
- Node means Fastify. Python means FastAPI. Express and Flask are not legal here.
- `sqlite` together with `serverless` is not a legal pair.

## Topology <!-- key: topology -->

Create `frontend/` and `backend/` only. Do not use `client/` or `api/` as directory names.

Root `package.json` depends on `concurrently`. Its `dev` script starts `frontend` (`npm run dev`) and `backend` (Node: `npm run dev`; Python: `.venv/bin/python -m app.server`, or `app.local_preview` when serverless). `README.md` lists both dev URLs and the proxy note. `.gitignore` covers `node_modules`, `frontend/dist`, `backend/dist`, `backend/.venv`, `.env`, and `data/`.

Frontend files: `index.html`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `eslint.config.js` (flat config), `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/lib/utils.ts`, `src/__tests__/App.test.tsx`.

`vite.config.ts` proxies `/api` to `http://localhost:3000` (Node) or `http://localhost:8000` (Python) and rewrites by stripping `/api`. The dev server port is `5173`.

Backend health:

- `GET /health/live` returns 200 `{ "status": "alive" }`.
- `GET /health/ready` returns 200 `{ "status": "ready", "checks": { "database": "ok" | "not_configured" } }`, or 503 when a configured ping fails.
- CORS origin is `http://localhost:5173`.
- Node files: `src/app.ts`, `src/routes/health.ts`, `src/services/health.ts`, `src/repositories/health-repository.ts` when a database is selected, `src/server.ts` or `src/local-preview.ts`, `src/__tests__/health.test.ts` using Fastify `inject`.
- Python files: `app/main.py`, `app/api/health.py`, `app/services/health.py`, `app/repositories/health.py` when a database is selected, `app/server.py` or `app/local_preview.py`, `tests/test_health.py` using `TestClient`, `requirements.txt`.
- Database files exist only when `database` is not `none`, and only under `backend/`. The repository runs `SELECT 1`. Routes and services do not import the driver. There is no extra controller layer. The SQLite file is `backend/data/app.db`. PostgreSQL uses `DATABASE_URL` and must not crash import when the server is down.

Node `backend/src/app.ts` exports `buildApp` and does not call `listen`. Python `backend/app/main.py` exports `create_app` and does not call `uvicorn.run`. Listen only in `server.ts` or `app/server.py` for `decide-later` and `long-running`, or in the local-preview module for `serverless`.

`backend/Dockerfile` exists only for `decide-later` and `long-running`. Serverless has no Dockerfile. The frontend never gets a Dockerfile.

- Node image: `node:22-alpine`, `USER node`, expose `3000`.
- Python image: `python:3.12-slim`, `USER nonroot`, expose `8000`.

## Output Contract <!-- key: output-contract -->

- `frontend/` and `backend/` both exist. Root `package.json` has a `dev` script. The proxy and CORS match Topology.
- `frontend/src/App.tsx` renders an `h1` of `projectName` and fetches `/api/health/live`. Health routes match Topology.
- Tailwind tokens come from the Design System section. No static export. No second framework.
- Fixed: versions, folder names, ports, proxy rewrite, and health JSON. Free: tagline copy inside the tokens.
- Frontend `npm test` and `npm run build` exit 0. Node backend `npm test` and `npm run build` exit 0. Python backend `compileall` and `pytest` exit 0. `package-lock.json` exists for each npm project that was installed.

## Design System <!-- key: design-system -->

- Page `bg-slate-50`, heading `text-3xl font-bold text-slate-900`, muted status `text-slate-500`, card `bg-white rounded-xl border border-slate-200 p-6`, accent `text-indigo-600`.
- Content width `max-w-3xl mx-auto p-8`.

## Verification Checks <!-- key: verification-checks -->

- [ ] `frontend/` and `backend/` exist. There is no `client/` or `api/` project directory.
- [ ] Root `package.json` depends on `concurrently@10.0.5` and defines `dev`.
- [ ] Frontend pins include `vite@8.3.1`, `react@19.3.0`, and `tailwindcss@3.4.19`.
- [ ] `frontend/vite.config.ts` proxies `/api` to port 3000 for Node or 8000 for Python and strips `/api`.
- [ ] `frontend/src/App.tsx` has an `h1` of `projectName` and fetches `/api/health/live`.
- [ ] `frontend/src/__tests__/App.test.tsx` asserts the `h1` renders.
- [ ] Backend exposes `/health/live` and `/health/ready` and allows CORS from `http://localhost:5173`.
- [ ] Backend tests assert `/health/live` returns 200. When `database=none`, they also assert ready `database` is `not_configured`.
- [ ] `sqlite` or `postgresql` keeps the driver inside `backend/` only and includes `backend/src/repositories/health-repository.ts` (Node) or `backend/app/repositories/health.py` (Python).
- [ ] `database=none` has no repository file and no database driver dependency.
- [ ] `decide-later` and `long-running` have `backend/Dockerfile` with `USER node` (Node) or `USER nonroot` (Python) and the base image from Topology.
- [ ] `serverless` has no `backend/Dockerfile`, and the app factory does not listen.
- [ ] Frontend `npm test` and `npm run build` exited 0.
- [ ] Node backend `npm test` and `npm run build` exited 0 when `apiRuntime=node`.
- [ ] Python `compileall` and `pytest` exited 0 when `apiRuntime=python`.
- [ ] Lockfiles exist for the root and frontend, and for the backend when it is Node.
- [ ] When PostgreSQL is down, ready may return 503. That is still a pass when live health and the builds exit 0.
