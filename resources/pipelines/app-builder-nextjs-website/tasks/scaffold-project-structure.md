**Goal:** Create the Next.js App Router tree, package manifest, and toolchain config for the approved run mode.

**Scope:** This task writes directories and config only. It must not author the page, layout, or styles, install dependencies, or run a build.

**Verification / Definition of Done:**
- [ ] `status` was `approved` and `name`, `targetDir`, `runMode`, `toolchain`, and `overwrite` were present, or the task stopped `blocked` and named the missing string.
- [ ] `app/` and `public/` exist, along with `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, and `.gitignore`.
- [ ] `static-export` sets `output: 'export'` and `images: { unoptimized: true }`. `server` omits `output: 'export'`.
- [ ] `tsconfig.json` has `"strict": true` and `@/*` pointing at `./*`.
- [ ] A pre-existing planned path was replaced only when `overwrite` was `granted`. No install or build was run.

**Instructions:**

1. Set state to `scaffolding`. Reload `status`, `name`, `targetDir`, `runMode`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask.
2. Re-read Topology and Context in "App Builder Next.js Website Contract". Also read Topology & Directory Structure in "App Builder Web Standards". Copy every Context specifier exactly. Do not write `latest`. Do not invent a specifier. Do not open another standard.
3. Write only inside the resolved `targetDir`. Create it when it is missing. Do not follow a path that escapes it. Do not treat the imported collection as a destination. Do not deploy, push, tag, merge, or run `docker build`. Replace a pre-existing planned path only when `overwrite` is `granted`. Do not delete any other existing file. If `overwrite` is `not-needed` and a planned path already exists, stop `failed` and do not ask. Do not install a missing toolchain.
4. Create `app/`, `lib/`, `tests/`, and `public/`. Write `package.json` with scripts `dev` (`next dev`), `build` (`next build`), `start` (`next start`), `lint` (`eslint .`), and `test` (`vitest run`). Copy every Context row into the manifest. Derive the package name from the display name stored as `name`. Do not write `latest`.
5. For `static-export`, `next.config.mjs` sets `output: 'export'` and `images: { unoptimized: true }`. For `server`, omit `output: 'export'`.
6. `tsconfig.json` sets `"strict": true`, `"moduleResolution": "bundler"`, and `"paths": { "@/*": ["./*"] }`. `tailwind.config.ts` covers `./app/**/*.{js,ts,jsx,tsx,mdx}`. `postcss.config.mjs` uses `tailwindcss` and `autoprefixer`. `eslint.config.mjs` uses `FlatCompat` from `@eslint/eslintrc` to extend `next/core-web-vitals` and `next/typescript`. Do not write an `.eslintrc` file. `vitest.config.ts` sets `environment: 'node'` and `include: ['tests/**/*.test.ts']`. `.gitignore` covers `node_modules/`, `.next/`, `out/`, `.env*` except `.env.example`, and build logs.
7. Do not create `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `app/not-found.tsx`, `lib/site.ts`, or `tests/site.test.ts` in this step. Do not run `npm install` or `npm run build`. Do not add a database, auth, or CMS.
