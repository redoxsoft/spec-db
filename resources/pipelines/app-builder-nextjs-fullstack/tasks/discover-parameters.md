**Goal:** Collect the project name, directory, database, and run mode for one Next.js full-stack app.

**Scope:** This task accepts a short intent and asks those four questions, one at a time. It must not open a spec, ask for a UI framework or package manager, offer static export, check Node, or write files.

**Verification / Definition of Done:**
- [ ] The display name, directory, database, and run mode were each answered.
- [ ] Database offered None first, then SQLite, then PostgreSQL. Run mode offered Decide later first, then a long-running server, then serverless.
- [ ] The stored spellings are `none`, `sqlite`, or `postgresql`, and `decide-later`, `long-running`, or `serverless`.
- [ ] Pipeline context holds `status` `collected`, `name`, `targetDir`, `database`, and `runMode`, each a short string.
- [ ] No project file was written and no spec was opened.

**Instructions:**

1. Set state to `asking`. Accept a short intent for one Next.js app with a dashboard and Route Handlers. Do not open a spec. Legal tokens are `database`: `none`, `sqlite`, or `postgresql`; `runMode`: `decide-later`, `long-running`, or `serverless`. There is no static-export choice.
2. Ask for the project name. When the user is unsure, suggest `my-next-app`. Store the confirmed display name as `name`.
3. Ask for the directory. When the user is unsure, suggest `./my-next-app`. Store it as `targetDir`.
4. Ask "Database?" `1` is recommended: None, stored as `none`. `2` is SQLite, stored as `sqlite`. `3` is PostgreSQL, stored as `postgresql`. Ask again when the answer is none of these.
5. Ask "How should the server run?" `1` is recommended: Decide later (Dockerfile), stored as `decide-later`. `2` is a long-running Node.js server or container, stored as `long-running`. `3` is Serverless, stored as `serverless`. Ask again when the answer is none of these. Do not offer static export.
6. Recap the name, directory, database, and run mode. If the user corrects one, update that value and recap again. This recap is not the write approval. Do not resolve SQLite together with serverless here.
7. Write pipeline context: `status` = `collected`, `name`, `targetDir`, `database`, and `runMode`. Do not store file contents, a path list, or a toolchain result. Do not write files.
