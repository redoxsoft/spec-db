**Goal:** Collect the project name, directory, HTTP framework, database, and run mode for a Python API.

**Scope:** This task accepts a short intent and asks those five questions, one at a time. It must not open a spec, ask about uv, Poetry, or a Python version, create a virtualenv, or write files.

**Verification / Definition of Done:**
- [ ] The display name, directory, framework, database, and run mode were each answered.
- [ ] Framework offered FastAPI first, then Flask. Database offered None first. Run mode offered Decide later first.
- [ ] The stored spellings are `fastapi` or `flask`; `none`, `sqlite`, or `postgresql`; and `decide-later`, `long-running`, or `serverless`.
- [ ] Pipeline context holds `status` `collected`, `name`, `targetDir`, `httpFramework`, `database`, and `runMode`, each a short string.
- [ ] No project file was written and no spec was opened.

**Instructions:**

1. Set state to `asking`. Accept a short intent for a standalone HTTP API. Do not open a spec. Legal tokens are `httpFramework`: `fastapi` or `flask`; `database`: `none`, `sqlite`, or `postgresql`; `runMode`: `decide-later`, `long-running`, or `serverless`.
2. Ask for the project name. When the user is unsure, suggest `my-python-api`. Store the confirmed display name as `name`.
3. Ask for the directory. When the user is unsure, suggest `./my-python-api`. Store it as `targetDir`.
4. Ask "HTTP framework?" `1` is recommended: FastAPI, stored as `fastapi`. `2` is Flask, stored as `flask`. Ask again when the answer is neither.
5. Ask "Database?" `1` is recommended: None, stored as `none`. `2` is SQLite, stored as `sqlite`. `3` is PostgreSQL, stored as `postgresql`.
6. Ask "How should it run?" `1` is recommended: Decide later (Dockerfile), stored as `decide-later`. `2` is a long-running server or container, stored as `long-running`. `3` is Serverless, stored as `serverless`.
7. Recap the name, directory, framework, database, and run mode. If the user corrects one, update that value and recap again. This recap is not the write approval. Do not resolve SQLite together with serverless here.
8. Write pipeline context: `status` = `collected`, `name`, `targetDir`, `httpFramework`, `database`, and `runMode`. Do not store file contents, a path list, or a toolchain result. Do not write files.
