**Goal:** Create the Next.js App Router tree, the pinned manifest, and the conditional Dockerfile and Drizzle files.

**Scope:** This task writes directories, toolchain config, and the manifest for the approved database and run mode. It must not implement the page, Route Handlers, or tests, and it must not install or build.

**Verification / Definition of Done:**
- [ ] `status` was `approved` and `name`, `targetDir`, `database`, `runMode`, `toolchain`, and `overwrite` were present, or the task stopped `blocked` and named the missing string.
- [ ] `package.json` copies the Context specifiers for this database, including `next` `16.3.7` and `tailwindcss` `3.4.19`, and does not include `tailwindcss` 4.
- [ ] `next.config.mjs` has no `output: 'export'`. `output: 'standalone'` is present only for `decide-later` and `long-running`.
- [ ] `Dockerfile` exists only for those two run modes and contains `node:22-alpine` and `USER node`.
- [ ] `lib/db/`, `drizzle.config.ts`, and `drizzle/` exist only for `sqlite` or `postgresql`.
- [ ] A pre-existing planned path was replaced only when `overwrite` was `granted`. No install or build was run.

**Instructions:**

1. Set state to `scaffolding`. Reload `status`, `name`, `targetDir`, `database`, `runMode`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask.
2. Re-read Context and Topology in "App Builder Next.js Full-Stack Contract" for the approved tokens. Also read Topology & Directory Structure in "App Builder Web Standards" for the App Router directories. Do not open another standard.
3. Write only inside the resolved `targetDir`. Create it when it is missing. Do not follow a path that escapes it. Do not treat the imported collection as a destination. Do not deploy, push, tag, merge, or run `docker build`. Replace a pre-existing planned path only when `overwrite` is `granted`. Do not delete any other existing file. If `overwrite` is `not-needed` and a planned path already exists, stop `failed` and do not ask. Do not install a missing toolchain.
4. Create the Topology directories that match the tokens. Skip `lib/db/`, `drizzle.config.ts`, and `drizzle/` when `database` is `none`. Skip `Dockerfile` when `runMode` is `serverless`. There is no `frontend/` or `backend/` split.
5. Write `package.json`. The package `name` is the display name stored as `name`, lowercased, with spaces turned into hyphens. Scripts are `dev` = `next dev`, `build` = `next build`, `start` = `next start`, `lint` = `eslint .`, and `test` = `vitest run`. Copy only the Context rows this database needs. Copy each specifier exactly, including `next` `16.3.7` and `tailwindcss` `3.4.19`. Do not write `latest`. Do not install `tailwindcss` 4.
6. `tsconfig.json` sets `strict` true, `moduleResolution` `bundler`, and paths `{ "@/*": ["./*"] }`. `next.config.mjs` sets `output: 'standalone'` only for `decide-later` and `long-running`. `serverless` omits `output`. Never write `output: 'export'`.
7. `tailwind.config.ts` content includes `./app/**/*.{ts,tsx}` and `./components/**/*.{ts,tsx}`. `postcss.config.mjs` uses `tailwindcss` and `autoprefixer`. Create `app/globals.css` and leave the Tailwind directives for Wire Pages and Routes. `eslint.config.mjs` uses `FlatCompat` from `@eslint/eslintrc` to extend `next/core-web-vitals` and `next/typescript`. Do not write an `.eslintrc` file. `vitest.config.ts` sets `environment: 'node'` and `include: ['tests/**/*.test.ts']`.
8. `.gitignore` covers `node_modules`, `.next`, `data/`, and `.env`. `.env.example` always sets `APP_NAME` to the display name. `sqlite` adds `SQLITE_PATH` default `./data/app.db`. `postgresql` adds a `DATABASE_URL` placeholder only. `.github/workflows/ci.yml` uses Node 22 and runs `npm ci`, `npm test`, and `npm run build`. Do not start PostgreSQL or Docker in that workflow.
9. For `decide-later` and `long-running`, the Dockerfile is multi-stage `node:22-alpine`. It runs `npm ci` and `npm run build`, copies the standalone output, sets `USER node`, exposes `3000`, and runs `node server.js` from the standalone folder. When a database is selected, `drizzle/0000_init.sql` creates `_scaffold_meta` (`key` text primary key, `value` text) and `drizzle.config.ts` matches that dialect.
10. Do not implement page JSX, Route Handlers, or tests. Do not run `npm install` or `npm run build`.
