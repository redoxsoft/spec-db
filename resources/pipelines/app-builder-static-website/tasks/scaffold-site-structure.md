**Goal:** Create the directory tree and config for the approved build tool.

**Scope:** This task writes the Vite or plain layout, including a minimal page whose title and heading are the display name. It must not install dependencies, run a build, polish the visual design, or add a second stack.

**Verification / Definition of Done:**
- [ ] `status` was `approved` and `name`, `targetDir`, `buildTool`, `toolchain`, and `overwrite` were present, or the task stopped `blocked` and named the missing string.
- [ ] Only the layout for the approved `buildTool` was created. Vite and plain files were not mixed.
- [ ] The document title and `h1` use the display name.
- [ ] A pre-existing planned path was replaced only when `overwrite` was `granted`. Every other existing file was left in place.
- [ ] No install, build, or test was run.

**Instructions:**

1. Set state to `scaffolding`. Reload `status`, `name`, `targetDir`, `buildTool`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask.
2. Re-read the Topology section of "App Builder Static Website Contract" for the approved `buildTool`. Also read Context and Output Contract in that spec, and the Topology & Directory Structure section of "App Builder Web Standards". For `vite`, copy every Context specifier exactly. Do not write `latest`. Do not invent a specifier. Do not open another standard.
3. Write only inside the resolved `targetDir`. Create it when it is missing. Do not follow a path that escapes it. Do not treat the imported collection as a destination. Do not deploy, push, tag, merge, or run `docker build`. Replace a pre-existing planned path only when `overwrite` is `granted`. Do not delete any other existing file. If `overwrite` is `not-needed` and a planned path already exists, stop `failed` and do not ask.
4. For `vite`, create `index.html`, `package.json` with scripts `dev`, `build`, `preview`, `lint` (`eslint .`), and `test` (`vitest run`), `vite.config.ts`, `vitest.config.ts` with `environment: 'node'` and `include: ['src/__tests__/**/*.test.ts']`, strict `tsconfig.json`, `eslint.config.js` as flat config using `@eslint/js` recommended and `typescript-eslint` recommended, `tailwind.config.js`, `postcss.config.js`, `src/main.ts`, `src/site.ts` exporting `siteName` as the display name, `src/style.css`, `src/assets/`, `src/__tests__/site.test.ts` asserting that export, `public/`, `README.md`, `.gitignore`, and `.github/workflows/ci.yml` running lint, test, and build. `index.html` loads `/src/main.ts` as a module script and does not reference `css/styles.css` or `js/main.js`. Do not create those plain-layout files. Add `.env.example` only when the page has env keys. Copy every Context row. Do not write `latest`. Do not write an `.eslintrc` file. Do not add Zod.
5. For `plain`, create `index.html`, `css/styles.css`, `js/main.js`, `assets/`, `README.md` with how to open the site without a build, and `.gitignore` for OS and editor junk. Do not add `package.json`, a bundler, or Tailwind.
6. Set the document title and the `h1` to the display name stored as `name`. Leave visual polish to Wire Styles and Assets. Do not add a CMS, router, or API.
