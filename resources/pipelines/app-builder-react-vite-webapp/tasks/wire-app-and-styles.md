**Goal:** Author the React app shell, hello-world screen, smoke test, and repo files.

**Scope:** This task fills the UI, routing, Tailwind styles, and the Vitest smoke test. It must not install dependencies, run the build or tests, or add a backend, database, or auth.

**Verification / Definition of Done:**
- [ ] Approved strings were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/lib/utils.ts`, and `src/routes/index.tsx` exist.
- [ ] `src/App.tsx` renders an `h1` of the display name, a tagline, and one card. `src/main.tsx` mounts it with `ReactDOM.createRoot` inside `BrowserRouter`.
- [ ] `src/__tests__/setup.ts` and `src/__tests__/App.test.tsx` exist. The test renders `App` inside `MemoryRouter` and expects the heading.
- [ ] `README.md`, `.env.example`, and `.github/workflows/ci.yml` exist. No build or test was run.

**Instructions:**

1. Set state to `wiring`. Reload `status`, `name`, `targetDir`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask.
2. Re-read Topology in "App Builder React Vite Web App Contract" for the paths this step may edit. Read Output Contract and Design System in that spec. Read Layering & Design Patterns in "App Builder Web Standards" for Tailwind utilities and `cn()`. Do not open another standard.
3. Write only inside the resolved `targetDir`. Do not follow a path that escapes it. Replace a pre-existing planned path only when `overwrite` is `granted`. Do not delete any other existing file. If `overwrite` is `not-needed` and a planned path already exists, stop `failed` and do not ask. Do not change the packages declared in Scaffold Project Structure. Do not install a missing toolchain.
4. `src/index.css` starts with `@tailwind base;`, `@tailwind components;`, and `@tailwind utilities;`, and applies `bg-slate-50 text-slate-900 antialiased` on `body`. `src/lib/utils.ts` exports `cn` using `clsx` and `tailwind-merge`.
5. `src/App.tsx` is a function component. Its `h1` is the display name stored as `name`, with a tagline and one card. Use the Design System classes: shell `min-h-screen flex`, content `max-w-6xl mx-auto px-4`, card `bg-white rounded-xl shadow-sm border border-slate-200 p-6`, heading `text-3xl font-bold text-slate-900`, tagline `text-lg text-slate-500`. An optional narrow sidebar may use `indigo-600` to `indigo-700`. `src/routes/index.tsx` maps `/` to that view. `src/main.tsx` imports `./index.css`, wraps `App` in `BrowserRouter`, and mounts it with `ReactDOM.createRoot`.
6. `src/__tests__/setup.ts` imports `@testing-library/jest-dom/vitest`. `src/__tests__/App.test.tsx` renders `App` inside `MemoryRouter` and asserts that the `h1` containing the display name is present.
7. `README.md` states Node.js `^20.19.0` or `>=22.12.0` and npm, plus `npm run dev`, `npm run build`, `npm test`, and `npm run lint`. Add `.env.example` with placeholder keys. `.github/workflows/ci.yml` runs `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm test`, and `npm run build`. Do not run those commands in this step. Do not deploy, push, tag, merge, or run `docker build`. Run git only when the user explicitly asks in this run.
