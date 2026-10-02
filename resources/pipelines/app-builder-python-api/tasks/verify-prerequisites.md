**Goal:** Reject SQLite on serverless, check Python, venv, and pip, then get one approval before any file is written.

**Scope:** This task reloads the collected intake, resolves an illegal database and run-mode pair, checks write access and the Python floor, and compares the contract tree for those tokens with the directory. It must not open a standard, store the path list, install Python, create a virtualenv, or write a project file.

**Verification / Definition of Done:**
- [ ] `status`, `name`, `targetDir`, `httpFramework`, `database`, and `runMode` were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] SQLite together with serverless was replaced with a legal pair before the preview, and no file was written while that pair stood.
- [ ] A directory inside the imported App Builder collection, or a path that resolves outside the directory, stopped as `needs_input` with no files written.
- [ ] Python was 3.11 or newer, and venv and pip were present, or the task stopped `blocked` without installing them and without a write approval.
- [ ] Only the planned paths for the approved framework, database, and run mode were compared. Unrelated files did not add a question.
- [ ] One preview showed the name, directory, framework, database, run mode, and toolchain, plus one overwrite-or-other-directory line only when a planned path already exists.
- [ ] Approval wrote `status` `approved`, `toolchain`, and `overwrite` as `not-needed` or `granted`. Cancellation finished `done` and said that no starter was produced.

**Instructions:**

1. Set state to `checking`. Reload `status`, `name`, `targetDir`, `httpFramework`, `database`, and `runMode`. If any is missing, or `status` is not `collected`, stop `blocked`, name the missing string, and write nothing.
2. Refuse `targetDir` when it lies inside the imported App Builder collection. Membership comes from imported-resource metadata and folder ancestry, not from a folder happening to be named App Builder. Stop `needs_input` and ask for a different directory. Write nothing there.
3. Resolve `targetDir`. Refuse it when that path, or a planned path under it, resolves outside the directory through a symlink or another link. Stop `needs_input` and ask for a different directory.
4. If `database` is `sqlite` and `runMode` is `serverless`, the outcome is `needs_input` until the pair changes. Tell the user SQLite cannot hold persistent state on serverless. Ask them to change the database to `none` or `postgresql`, or the run mode to `decide-later` or `long-running`. Ask one question at a time. Do not write files. When the pair is legal, update those token strings and continue this task at the next step. Do not re-ask the name, the directory, or a choice that did not change. Do not end the task after the pair becomes legal.
5. If the parent is not writable, stop `blocked`, name write access, and write nothing. Do not create the project directory in this task.
6. Run `python3 -c "import sys; raise SystemExit(0 if sys.version_info >= (3, 11) else 1)"`, `python3 -c "import venv"`, and `python3 -m pip --version`. If Python is older than 3.11, or venv or pip is missing, stop `blocked` and name the missing tool. Do not install it. Do not use uv, Poetry, or pipenv. Do not show a write approval.
7. Read only the Topology section of "App Builder Python API Contract" for the approved tokens. Skip `app/db/`, `alembic.ini`, and `alembic/` when `database` is `none`. Skip `Dockerfile` and `app/server.py` when `runMode` is `serverless`. Skip `app/local_preview.py` otherwise. Compare the remaining planned paths with the directory. Do not read a standard. Unrelated files do not count. Discard the path list. Do not store it.
8. Set state to `waiting`. Show one preview: display name, directory, FastAPI or Flask, database, run mode, and the observed toolchain, for example `python 3.12.0`. When no planned path exists, the confirmation is proceed or cancel. When any planned path exists, the same preview asks once to overwrite the files this starter needs, or to choose a different directory, and cancel remains available.
9. Proceed with no collision: set `overwrite` to `not-needed`. Proceed with blanket overwrite: set `overwrite` to `granted`. Keep the intake strings. Set `status` to `approved` and `toolchain` to the short observed version string. Write no project files.
10. A different directory, or a changed framework, database, or run mode before any write, returns to step 2. That change discards the previous overwrite grant. Show one new preview, and set `overwrite` only from that preview. Later tasks do not ask again. Cancel finishes `done`, writes nothing, and the handoff says that no starter was produced. It does not expose internal field names.
