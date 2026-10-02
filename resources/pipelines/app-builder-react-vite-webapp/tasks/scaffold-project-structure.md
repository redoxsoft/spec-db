**Goal:** Create the React and Vite directory tree, manifest, and toolchain config.

**Scope:** This task writes directories, `package.json`, Vite, TypeScript, Tailwind, ESLint, and `index.html`. It must not author `App.tsx`, `main.tsx`, routes, styles, or tests, and it must not install or build.

**Verification / Definition of Done:**
- [ ] `status` was `approved` and `name`, `targetDir`, `toolchain`, and `overwrite` were present, or the task stopped `blocked` and named the missing string.
- [ ] The Topology directories exist, along with `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `tailwind.config.ts`, `postcss.config.mjs`, `eslint.config.js`, `index.html`, and `.gitignore`.
- [ ] `package.json` scripts are `dev`, `build`, `preview`, `test`, and `lint`.
- [ ] `index.html` contains `<div id="root">` and a module script for `/src/main.tsx`.
- [ ] A pre-existing planned path was replaced only when `overwrite` was `granted`. No install or build was run.

**Instructions:**

1. Set state to `scaffolding`. Reload `status`, `name`, `targetDir`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask, and do not re-ask overwrite permission.
2. Re-read Topology and Context in "App Builder React Vite Web App Contract". Also read Topology & Directory Structure in "App Builder Web Standards" for the React and Vite SPA layout. Copy every Context specifier exactly. Do not write `latest`. Do not invent a specifier. Do not open another standard.
3. Write only inside the resolved `targetDir`. Create it when it is missing. Do not follow a path that escapes it. Do not treat the imported collection as a destination. Do not deploy, push, tag, merge, or run `docker build`. Replace a pre-existing planned path only when `overwrite` is `granted`. Do not delete any other existing file. If `overwrite` is `not-needed` and a planned path already exists, stop `failed` and do not ask. Do not install a missing toolchain.
4. Create `src/assets/`, `src/components/ui/`, `src/components/layout/`, `src/features/`, `src/hooks/`, `src/lib/`, `src/routes/`, and `src/__tests__/`.
5. Write `package.json`. The `name` is the display name stored as `name`, lowercased, with spaces turned into hyphens. Scripts: `dev` is `vite`, `build` is `tsc && vite build`, `preview` is `vite preview`, `test` is `vitest run`, and `lint` is `eslint .`. Copy every Context row. Do not write `latest`.
6. `vite.config.ts` uses `@vitejs/plugin-react`, aliases `@` to `./src`, and sets `test` to `globals: true`, `environment: 'jsdom'`, and `setupFiles: './src/__tests__/setup.ts'`. `tsconfig.json` sets `"strict": true`, `"moduleResolution": "bundler"`, `"jsx": "react-jsx"`, `"paths": { "@/*": ["./src/*"] }`, `"include": ["src"]`, and `"noEmit": true`. Write an independent `tsconfig.node.json` with `"include": ["vite.config.ts"]` and `"noEmit": true`; neither config has project `references`. `tailwind.config.ts` content is `./index.html` and `./src/**/*.{js,ts,jsx,tsx}`. `postcss.config.mjs` uses `tailwindcss` and `autoprefixer`. `eslint.config.js` is flat config using `@eslint/js` recommended and `typescript-eslint` recommended. Do not write an `.eslintrc` file.
7. `index.html` contains `<div id="root"></div>` and `<script type="module" src="/src/main.tsx">`. `.gitignore` covers `node_modules`, `dist`, and `.env*`, with `!.env.example` so the example remains visible.
8. Do not create `src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/routes/index.tsx`, or the test files in this step. Do not run `npm install`, `npm run build`, or `npm test`. Do not add a backend, database, or auth.
