**Goal:** Author the App Router page, layout, styles, and repo files for the approved run mode.

**Scope:** This task fills the hello-world UI and the README. It must not install dependencies, run the production build, or add a database, auth, or CMS.

**Verification / Definition of Done:**
- [ ] Approved strings were reloaded, or the task stopped `blocked` and named the missing string.
- [ ] `app/layout.tsx`, `app/page.tsx`, `app/not-found.tsx`, `app/globals.css`, `lib/site.ts`, and `tests/site.test.ts` exist.
- [ ] The layout metadata title and the page `h1` use the display name. The page is a Server Component.
- [ ] The README documents `npm run dev` and `npm run build`, plus `out/` for static export or `npm start` for the server.
- [ ] `.env.example` and `.github/workflows/ci.yml` exist. No production build was run.

**Instructions:**

1. Set state to `wiring`. Reload `status`, `name`, `targetDir`, `runMode`, `toolchain`, and `overwrite`. If `status` is not `approved` or a required string is missing, stop `blocked` and name it. Do not ask.
2. Re-read Topology in "App Builder Next.js Website Contract" for the paths this step may edit. Read Output Contract and Design System in that spec. Read Topology & Directory Structure and Layering & Design Patterns in "App Builder Web Standards" for the App Router shell, Server Components, and Tailwind. Do not open another standard.
3. Write only inside the resolved `targetDir`. Do not follow a path that escapes it. Replace a pre-existing planned path only when `overwrite` is `granted`. Do not delete any other existing file. If `overwrite` is `not-needed` and a planned path already exists, stop `failed` and do not ask. Do not change the packages declared in Scaffold Project Structure. Do not install a missing toolchain.
4. `app/globals.css` starts with `@tailwind base;`, `@tailwind components;`, and `@tailwind utilities;`, and sets the body to the neutral scale in Design System. `app/layout.tsx` is a Server Component, exports metadata `title` and `description` from the display name stored as `name`, imports `./globals.css`, and renders `html` and `body`. Use body classes `min-h-screen bg-slate-50 text-slate-900 antialiased`.
5. `app/page.tsx` is a Server Component. Its `h1` is the display name, with a tagline and an introductory section inside `max-w-4xl` or `max-w-5xl`, centered. Use the accent and type scale from Design System. Import `siteName` from `lib/site.ts`. `app/not-found.tsx` is a 404 page with a link back to `/`. `lib/site.ts` exports `siteName` as the display name stored as `name`. `tests/site.test.ts` imports that export and expects it to equal the display name. The test does not start Next.js.
6. `README.md` states Node.js `^20.19.0` or `>=22.12.0` and npm, plus `npm run dev`, `npm run lint`, `npm test`, and `npm run build`. For `static-export`, say the build writes `out/` and can be previewed with `npx serve out`. For `server`, say production starts with `npm start`. Add `.env.example` with placeholder keys and `.github/workflows/ci.yml` that runs lint, test, typecheck, and build. Do not run `npm install` or `npm run build`. Do not deploy, push, tag, merge, or run `docker build`. Run git only when the user explicitly asks in this run.
