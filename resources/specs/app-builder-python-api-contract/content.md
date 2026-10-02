# App Builder Python API Contract

## Context <!-- key: context -->

A runnable Python HTTP API only. One root route plus health probes. No authentication, business resources, or cloud deploy.

Toolchain: Python 3.11 or newer, stdlib `venv`, pip, and a pinned `requirements.txt`. Do not use uv, Poetry, or pipenv. Dev tools (`pytest`, `ruff`, `mypy`) live in the same `requirements.txt`.

Write these exact specifiers. Do not leave names unpinned.

| Package | Specifier | Include when |
| :--- | :--- | :--- |
| `fastapi` | `fastapi==0.142.1` | `httpFramework=fastapi` |
| `uvicorn` | `uvicorn==0.54.0` | `httpFramework=fastapi` |
| `httpx` | `httpx==0.28.1` | `httpFramework=fastapi` |
| `flask` | `flask==3.1.3` | `httpFramework=flask` |
| `gunicorn` | `gunicorn==26.2.0` | `httpFramework=flask` |
| `pydantic` | `pydantic==2.13.5` | always |
| `pydantic-settings` | `pydantic-settings==2.15.0` | always |
| `pytest` | `pytest==9.1.1` | always |
| `ruff` | `ruff==0.16.9` | always |
| `mypy` | `mypy==2.3.1` | always |
| `sqlalchemy` | `sqlalchemy==2.1.1` | `database` is `sqlite` or `postgresql` |
| `alembic` | `alembic==1.20.0` | `database` is `sqlite` or `postgresql` |
| `psycopg` | `psycopg[binary]==3.3.6` | `database=postgresql` |

Apply App Builder API Standards, section Topology & Directory Structure, for the Python package layout and mandatory repo files. Apply section Data Flow & State Lifecycle for unidirectional flow, OpenAPI, and the SQLite versus PostgreSQL invariant. Apply section Resilience, Errors & Diagnostics for the JSON error envelope and `/health/live` plus `/health/ready`. Apply section Quality Baseline & Verification for Pydantic, the non-root Dockerfile, and pytest on health probes.

## Choice Tokens <!-- key: choice-tokens -->

- `httpFramework`: `fastapi` or `flask`.
- `database`: `none`, `sqlite`, or `postgresql`.
- `runMode`: `decide-later`, `long-running`, or `serverless`.
- `sqlite` together with `serverless` is not a legal pair.

## Topology <!-- key: topology -->

Create only the rows that match the selected database and run mode. Every package directory needs `__init__.py`.

```text
├── app/
│   ├── core/config.py
│   ├── db/session.py             # sqlite or postgresql only
│   ├── db/models.py              # sqlite or postgresql only
│   ├── api/health.py
│   ├── api/root.py
│   ├── controllers/health.py
│   ├── controllers/root.py
│   ├── services/health.py
│   ├── repositories/health.py    # sqlite or postgresql only
│   ├── schemas/health.py
│   ├── main.py                   # create_app(); no listen
│   ├── server.py                 # decide-later or long-running only
│   └── local_preview.py          # serverless only
├── alembic.ini                   # sqlite or postgresql only
├── alembic/env.py                # sqlite or postgresql only
├── alembic/versions/0001_init_scaffold_meta.py
├── tests/test_health.py
├── requirements.txt
├── pytest.ini
├── ruff.toml
├── mypy.ini
├── Dockerfile                    # decide-later or long-running only
├── README.md
├── .gitignore
├── .env.example
└── .github/workflows/ci.yml
```

From the project directory, after the venv exists, the starter supports:

- `python3 -m venv .venv`
- `.venv/bin/pip install -r requirements.txt`
- `.venv/bin/python -m compileall app`
- `.venv/bin/ruff check app tests`
- `.venv/bin/mypy app`
- `.venv/bin/pytest`
- Dev server: `.venv/bin/python -m app.server` for `decide-later` and `long-running`; `.venv/bin/python -m app.local_preview` for serverless.

`mypy.ini`: `python_version = 3.11`, `disallow_untyped_defs = False`, `ignore_missing_imports = True`, files limited to `app`. `ruff.toml`: `target-version = "py311"`, lint select `E` and `F`. `pytest.ini`: `testpaths = tests`.

Environment keys: always `PORT` default `8000` and `APP_NAME`. `sqlite` adds `SQLITE_PATH` default `./data/app.db`. `postgresql` adds `DATABASE_URL` as a placeholder only. Do not put a real secret in the file.

When a database is selected, `app/db/models.py` defines `_scaffold_meta` (`key` primary key, `value` string). `alembic/versions/0001_init_scaffold_meta.py` creates that table. Do not call `metadata.create_all` at import time. SQLite tests and startup run `alembic upgrade head` against the sqlite URL. PostgreSQL applies migrations only after a successful connection and must not crash the process when the server is down. `database=none` has no `app/db/` package and no `alembic/`.

`app/main.py` defines `create_app()` and a module-level `app = create_app()`. It must not call `uvicorn.run` or `Flask.run`. `app/server.py` is the only production listener, and only for `decide-later` and `long-running`. `Dockerfile` exists only for those two run modes. Serverless has no Dockerfile.

The non-serverless Dockerfile is multi-stage `python:3.12-slim`. It installs `requirements.txt`, copies `app`, creates a system user named `nonroot`, and ends with `USER nonroot`. It exposes `8000`. FastAPI command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`. Flask command: `gunicorn -b 0.0.0.0:8000 app.main:app`.

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
- FastAPI serves built-in `/openapi.json` and `/docs`.
- Flask: `GET /openapi.json` returns a small OpenAPI object, and `GET /docs` returns HTML that links to `/openapi.json`. Both are required.
- Controllers call services. Services call the repository. Controllers and route modules do not import the database session.

## Output Contract <!-- key: output-contract -->

- Layered files in Topology exist for the active `httpFramework`, `database`, and `runMode`.
- `app/main.py` exports `create_app` and does not start a server.
- `app/server.py` listens only for `decide-later` and `long-running`.
- Health, root, and error JSON match Topology.
- Pydantic settings validate `PORT` and, when present, `DATABASE_URL` or `SQLITE_PATH`.
- Status codes: 200 live, 200 or 503 ready, 404 unknown routes via the error envelope, 500 unhandled errors via the same envelope.
- The request id comes from header `x-request-id` or a generated id. Do not log `DATABASE_URL` or other secrets.
- Fixed: choice tokens, the version table, package paths, health JSON, the error envelope, the illegal `sqlite` + `serverless` pair, and the Dockerfile rule.
- Free: log line wording, OpenAPI summary text, and README phrasing. When `runMode` is `serverless`, the README includes this sentence: "PostgreSQL must be an external managed database. Do not use SQLite on serverless."
- `.venv/bin/python -m compileall app` exits 0. `.venv/bin/pytest` exits 0 and covers `GET /health/live`. `.venv/bin/ruff check app tests` and `.venv/bin/mypy app` exit 0.

## Verification Checks <!-- key: verification-checks -->

- [ ] `requirements.txt` exists and its specifiers match the Context table for the selected framework and database.
- [ ] `pytest.ini`, `ruff.toml`, and `mypy.ini` exist with the settings in Topology.
- [ ] `app/main.py` defines `create_app` and does not call `uvicorn.run` or `Flask.run`.
- [ ] `GET /health/live` and `GET /health/ready` use the JSON shapes in Topology.
- [ ] `GET /` returns `projectName`.
- [ ] FastAPI serves `/openapi.json` and `/docs`.
- [ ] Flask serves `/openapi.json` and a `/docs` HTML page that links to `/openapi.json`.
- [ ] Error handlers return the envelope in Topology.
- [ ] `database=none` has no `app/db/` package and no `alembic/`.
- [ ] `database=sqlite` or `postgresql` has `app/db/session.py`, `app/db/models.py`, `alembic.ini`, `alembic/env.py`, and `alembic/versions/0001_init_scaffold_meta.py`.
- [ ] `runMode=serverless` has no `Dockerfile` and no listen call inside `app/main.py`.
- [ ] `runMode=decide-later` or `long-running` has `Dockerfile` containing `USER nonroot` and `app/server.py`.
- [ ] Repo files exist: `README.md`, `.gitignore`, `.env.example`, `.github/workflows/ci.yml`.
- [ ] `.venv/bin/python -m compileall app` exits 0.
- [ ] `.venv/bin/ruff check app tests` exits 0.
- [ ] `.venv/bin/mypy app` exits 0.
- [ ] `.venv/bin/pytest` exits 0 and the `/health/live` assertion passes.
- [ ] When PostgreSQL is unreachable, the process still boots and `/health/ready` returns 503. That is still a pass when `/health/live`, compileall, ruff, and mypy exit 0.
