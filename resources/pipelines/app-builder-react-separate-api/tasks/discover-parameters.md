**Goal:** Collect the project name, directory, API runtime, database, and run mode for a React app with a separate API.

**Scope:** This task accepts a short intent and asks those five questions, one at a time. It must not open a spec, ask Express versus Fastify or Flask versus FastAPI, check toolchains, or write files.

**Verification / Definition of Done:**
- [ ] The display name, directory, API runtime, database, and run mode were each answered.
- [ ] Runtime offered Node.js first, then Python. Database offered None first. Run mode offered Decide later first.
- [ ] The stored spellings are `node` or `python`; `none`, `sqlite`, or `postgresql`; and `decide-later`, `long-running`, or `serverless`.
- [ ] Pipeline context holds `status` `collected`, `name`, `targetDir`, `apiRuntime`, `database`, and `runMode`, each a short string.
- [ ] No project file was written and no spec was opened.

**Instructions:**

1. Set state to `asking`. Accept a short intent for a Vite frontend and a separate API. Do not open a spec. Node means Fastify. Python means FastAPI. Express and Flask are not choices. Legal tokens are `apiRuntime`: `node` or `python`; `database`: `none`, `sqlite`, or `postgresql`; `runMode`: `decide-later`, `long-running`, or `serverless`.
2. Ask for the project name. When the user is unsure, suggest `my-split-app`. Store the confirmed display name as `name`.
3. Ask for the directory. When the user is unsure, suggest `./my-split-app`. Store it as `targetDir`.
4. Ask "API runtime?" `1` is recommended: Node.js, stored as `node`. `2` is Python, stored as `python`. Ask again when the answer is neither.
5. Ask "Database?" `1` is recommended: None, stored as `none`. `2` is SQLite, stored as `sqlite`. `3` is PostgreSQL, stored as `postgresql`.
6. Ask "How should the API run?" `1` is recommended: Decide later (Dockerfile), stored as `decide-later`. `2` is a long-running server or container, stored as `long-running`. `3` is Serverless, stored as `serverless`.
7. Recap the name, directory, runtime, database, and run mode. If the user corrects one, update that value and recap again. This recap is not the write approval. Do not resolve SQLite together with serverless here.
8. Write pipeline context: `status` = `collected`, `name`, `targetDir`, `apiRuntime`, `database`, and `runMode`. Do not store file contents, a path list, or a toolchain result. Do not write files.
