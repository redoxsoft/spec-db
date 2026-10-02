**Goal:** Finish the hello-world page so its styles match the approved build tool.

**Scope:** This task applies the design tokens and, for Vite, installs project dependencies so a lockfile exists. It must not change the build tool, add React or another framework, deploy, or run the production build.

**Verification / Definition of Done:**
- [ ] Approved strings were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] Vite styles enter through `src/style.css` and Tailwind. Plain styles enter through `css/styles.css`.
- [ ] The page still shows the display name, and relative asset links resolve.
- [ ] Vite: `npm install` was run inside the directory and a lockfile exists. Plain: no `package.json` was added.
- [ ] Pins were not invented. A pre-existing planned path was replaced only when `overwrite` was `granted`.

**Instructions:**

1. Set state to `wiring`. Reload `status`, `name`, `targetDir`, `buildTool`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask.
2. Re-read Topology in "App Builder Static Website Contract" for the paths this step may edit. Read Output Contract and Design System in that spec. For Vite, also read Scaffolding Baseline (Day 0) in "App Builder Web Standards" for strict TypeScript, the lockfile, lint, and the smoke test. Do not open another standard.
3. Write only inside the resolved `targetDir`. Do not follow a path that escapes it. Replace a pre-existing planned path only when `overwrite` is `granted`. Do not delete any other existing file. If `overwrite` is `not-needed` and a planned path already exists, stop `failed` and do not ask. Do not install a missing toolchain.
4. For `vite`, point Tailwind `content` at `index.html` and `src/**/*`. Put Tailwind directives in `src/style.css`. `postcss.config.js` loads `tailwindcss` and `autoprefixer`. Apply a centered single-column page: neutral background, high-contrast text, one accent, system-ui type, and an 8px spacing rhythm. Keep the `h1` as the display name. From the directory, run `npm install` so `package.json` and the lockfile record the Context pins. Do not write `latest` and do not invent a version the contract does not pin. Do not add any other dependency. Do not add Zod. Do not run `npm run build`.
5. For `plain`, fill `css/styles.css` with the same readable layout. Keep `js/main.js` minimal. Do not add a package manager or Node toolchain.
6. Keep `README.md` matched to the files that exist: Vite `npm run dev`, `npm run lint`, `npm test`, `npm run build`, and `npm run preview`, or how to open the plain page. Do not deploy, push, tag, merge, or run `docker build`. Run git only when the user explicitly asks in this run.
