**Goal:** Create the Python API package tree, pinned requirements, and tool config for the approved tokens.

**Scope:** This task writes packages, `requirements.txt`, and config. It must not implement routes or `create_app`, create a virtualenv, or run pip, pytest, ruff, or mypy.

**Verification / Definition of Done:**
- [ ] Approved strings were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] `requirements.txt` copies the Context specifiers for this framework and database, including `pytest`, `ruff`, and `mypy` in that same file.
- [ ] `pytest.ini`, `ruff.toml`, and `mypy.ini` match Topology. Every package directory has `__init__.py`.
- [ ] `Dockerfile` exists only for `decide-later` and `long-running` and contains `USER nonroot`. Alembic files exist only for `sqlite` or `postgresql`.
- [ ] A pre-existing planned path was replaced only when `overwrite` was `granted`. No virtualenv was created.

**Instructions:**

1. Set state to `scaffolding`. Reload `status`, `name`, `targetDir`, `httpFramework`, `database`, `runMode`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask.
2. Re-read Context and Topology in "App Builder Python API Contract". Also read Topology & Directory Structure in "App Builder API Standards" for the Python layout and mandatory repo files. Do not open another standard.
3. Write only inside the resolved `targetDir`. Create it when it is missing. Do not follow a path that escapes it. Do not treat the imported collection as a destination. Do not deploy, push, tag, merge, or run `docker build`. Replace a pre-existing planned path only when `overwrite` is `granted`. Do not delete any other existing file. If `overwrite` is `not-needed` and a planned path already exists, stop `failed` and do not ask. Do not install a missing toolchain.
4. Create the Topology packages and files that match the tokens, with `__init__.py` in every package. Skip `app/db/`, `alembic.ini`, and `alembic/` when `database` is `none`. Skip `Dockerfile` and `app/server.py` when `runMode` is `serverless`. Skip `app/local_preview.py` otherwise. Leave route modules empty for Wire Routes and Health.
5. Write `requirements.txt` with only the Context rows this framework and database need. Copy each specifier exactly, including the `package==version` text in that table. Keep `pytest`, `ruff`, and `mypy` in the same file. Do not leave a name unpinned. Do not use uv, Poetry, or pipenv.
6. `mypy.ini` sets `python_version = 3.11`, `disallow_untyped_defs = False`, `ignore_missing_imports = True`, and limits files to `app`. `ruff.toml` sets `target-version = "py311"` and lint select `E` and `F`. `pytest.ini` sets `testpaths = tests`.
7. `.gitignore` covers `.venv`, `__pycache__`, `.mypy_cache`, `.ruff_cache`, `.env`, and `data/`. `.env.example` sets `PORT` default `8000` and `APP_NAME` to the display name stored as `name`. `sqlite` adds `SQLITE_PATH` default `./data/app.db`. `postgresql` adds a `DATABASE_URL` placeholder only. `.github/workflows/ci.yml` uses Python 3.12 and runs `pip install -r requirements.txt`, `ruff check app tests`, `mypy app`, `python -m compileall app`, and `pytest`. Do not start PostgreSQL or Docker in that workflow.
8. For `decide-later` and `long-running`, the Dockerfile is multi-stage `python:3.12-slim`. It installs `requirements.txt`, copies `app`, creates a system user named `nonroot`, ends with `USER nonroot`, and exposes `8000`. FastAPI runs `uvicorn app.main:app --host 0.0.0.0 --port 8000`. Flask runs `gunicorn -b 0.0.0.0:8000 app.main:app`. When a database is selected, `alembic.ini`, `alembic/env.py`, and `alembic/versions/0001_init_scaffold_meta.py` create `_scaffold_meta` in `upgrade()`. Point the URL at `SQLITE_PATH` or `DATABASE_URL`. Do not call `create_all`. Do not create `.venv`.
