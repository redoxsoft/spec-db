**Goal:** Implement the app factory, health probes, root route, error envelope, and the pytest smoke test.

**Scope:** This task fills the source files for the approved framework, database, and run mode. It must not change pins, create a virtualenv, or call `uvicorn.run` or `Flask.run` from `app/main.py`.

**Verification / Definition of Done:**
- [ ] Approved strings were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] `create_app` exists and does not start a server. Live, ready, and root responses match Topology.
- [ ] FastAPI serves `/openapi.json` and `/docs`. Flask serves `/openapi.json` and a `/docs` page that links to it.
- [ ] Database access stays in the repository. `tests/test_health.py` expects `/health/live` to return 200.
- [ ] When `runMode` is `serverless`, the README includes: "PostgreSQL must be an external managed database. Do not use SQLite on serverless."

**Instructions:**

1. Set state to `wiring`. Reload `status`, `name`, `targetDir`, `httpFramework`, `database`, `runMode`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask. Do not reread the Context pin table and do not change a specifier.
2. Re-read Topology and Output Contract in "App Builder Python API Contract". Also read Resilience, Errors & Diagnostics in "App Builder API Standards" for the error envelope and health probes. Do not open another standard.
3. Write only inside the resolved `targetDir`. Do not follow a path that escapes it. Replace a pre-existing planned path only when `overwrite` is `granted`. Do not delete any other existing file. If `overwrite` is `not-needed` and a planned path already exists, stop `failed` and do not ask.
4. `app/core/config.py` uses Pydantic settings for the keys in `.env.example`. Do not log `DATABASE_URL` or other secrets. When a database is selected, implement `app/db/models.py` with `_scaffold_meta`, `app/db/session.py`, and `app/repositories/health.py`. `ping()` runs `SELECT 1`. SQLite runs `alembic upgrade head` before the ping. PostgreSQL pings only when `DATABASE_URL` connects and does not raise when the connection is refused. Do not call `metadata.create_all` at import time.
5. Controllers call services. Services call the repository. Controllers and route modules do not import the database session. `GET /health/live` returns 200 `{ "status": "alive" }`. `GET /health/ready` returns 200 with `not_configured` when `database` is `none`, 200 with `ok` after a successful ping, and 503 when a configured ping fails. `GET /` returns 200 `{ "name": "<projectName>", "status": "ok" }` using the display name stored as `name`.
6. The error handler returns only `{ "error": { "code": "INTERNAL_ERROR", "message": "Something went wrong", "details": [], "requestId": "req_..." } }`. The request id comes from `x-request-id` or a generated id. Unknown routes use that envelope with 404. No SQL, stack traces, hostnames, or file paths in the body.
7. `app/main.py` defines `create_app()` and `app = create_app()`. It must not call `uvicorn.run` or `Flask.run`. FastAPI keeps its built-in `/docs` and `/openapi.json`. Flask adds `GET /openapi.json` and `GET /docs` HTML that links to `/openapi.json`. For `decide-later` or `long-running`, `app/server.py` listens on `PORT`, default 8000. FastAPI uses `uvicorn.run`. Flask uses `app.run`. For `serverless`, `app/local_preview.py` is the only local listener.
8. `tests/test_health.py` calls `create_app()` without binding a port. FastAPI uses `TestClient`. Flask uses `test_client()`. Always expect `/health/live` to return 200. Also expect `/health/ready` to return 200 when `database` is `none` or `sqlite`. For Flask, also expect `/docs` to return 200. For `postgresql`, do not require a live server.
9. `README.md` documents the selected stack, `python3 -m venv .venv`, pip install, pytest, compileall, and the dev command: `.venv/bin/python -m app.server`, or `.venv/bin/python -m app.local_preview` when serverless. When `runMode` is `serverless`, include this sentence: "PostgreSQL must be an external managed database. Do not use SQLite on serverless." Do not create `.venv`. Do not deploy, push, tag, merge, or run `docker build`. Run git only when the user explicitly asks in this run.
