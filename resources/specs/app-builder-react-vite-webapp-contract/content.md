# App Builder React Vite Web App Contract

## Context <!-- key: context -->

Minimal runnable React + Vite SPA for dashboards, internal tools, and interactive portals. No backend, database, authentication, or business features.

Write these specifiers. Do not use `latest`. Do not install `tailwindcss@4`. `tailwindcss` must be `3.4.19`.

| Package | Specifier | Include when |
| :--- | :--- | :--- |
| `react` / `react-dom` | `19.3.0` | always |
| `react-router-dom` | `7.18.4` | always |
| `vite` | `8.3.1` | always (dev) |
| `@vitejs/plugin-react` | `6.1.1` | always (dev) |
| `typescript` | `5.9.3` | always (dev) |
| `@types/react` / `@types/react-dom` | `19.3.0` | always (dev) |
| `tailwindcss` | `3.4.19` | always (dev) |
| `postcss` | `8.5.28` | always (dev) |
| `autoprefixer` | `10.6.1` | always (dev) |
| `vitest` | `5.0.2` | always (dev) |
| `@testing-library/react` | `16.3.3` | always (dev) |
| `@testing-library/jest-dom` | `6.9.1` | always (dev) |
| `jsdom` | `30.1.1` | always (dev) |
| `eslint` / `@eslint/js` | `9.39.5` | always (dev) |
| `typescript-eslint` | `8.71.0` | always (dev) |
| `clsx` | `2.1.1` | always |
| `tailwind-merge` | `3.7.0` | always |

Apply App Builder Web Standards, section Scaffolding Baseline (Day 0), for mandatory repo artifacts, the lockfile, lint, one Vitest smoke test, and `npm run build`. Apply section Topology & Directory Structure for the SPA directories. Apply section Layering & Design Patterns for Tailwind, `cn()`, and the container/presenter boundary.

## Choice Tokens <!-- key: choice-tokens -->

This starter has no stack choice tokens. The stack in Context is fixed.

## Topology <!-- key: topology -->

```text
├── src/
│   ├── assets/                   # Static images, fonts
│   ├── components/
│   │   ├── ui/                   # Base primitives (Button, Card)
│   │   └── layout/               # App shell (Header, Sidebar placeholder)
│   ├── features/                 # Feature modules (initially empty placeholder)
│   ├── hooks/                    # Global custom hooks
│   ├── lib/
│   │   └── utils.ts              # cn() class merger (clsx + tailwind-merge)
│   ├── routes/
│   │   └── index.tsx             # React Router route configuration
│   ├── App.tsx                   # Root component with Router and providers
│   ├── main.tsx                  # Application entry (ReactDOM.createRoot)
│   └── index.css                 # Tailwind CSS directives + base styles
├── src/__tests__/
│   └── App.test.tsx              # Vitest smoke test: root renders without crash
├── index.html                    # Vite entry HTML
├── package.json                  # scripts: dev, build, preview, test, lint
├── vite.config.ts                # Vite config with React plugin and test config
├── tsconfig.json                 # strict: true, paths: {"@/*": ["./src/*"]}
├── tsconfig.node.json            # Node toolchain TypeScript config
├── tailwind.config.ts            # Tailwind: content covers src/**/*
├── postcss.config.mjs            # PostCSS with tailwindcss + autoprefixer
├── eslint.config.js              # ESLint flat config
├── README.md                     # Setup, dev, build, test, lint commands
├── .gitignore                    # node_modules, dist, .env* except .env.example
├── .env.example                  # Placeholder environment keys
└── .github/workflows/ci.yml      # CI: typecheck, lint, test, build
```

Scripts: `dev` = `vite`, `build` = `tsc && vite build`, `preview` = `vite preview`, `test` = `vitest run`, `lint` = `eslint .`.

`tsconfig.json` and `tsconfig.node.json` are independent, with no project `references`. The app config includes `src`, the Node toolchain config includes `vite.config.ts`, and both use `noEmit: true`. The `.gitignore` may ignore `.env*` only when it also unignores `.env.example`.

`eslint.config.js` is flat config using `@eslint/js` recommended and `typescript-eslint` recommended. Do not write an `.eslintrc` file.

## Output Contract <!-- key: output-contract -->

- `src/App.tsx` renders an `h1` equal to `projectName`, a tagline, and at least one card or section, inside React Router `BrowserRouter`.
- `src/main.tsx` mounts `App` with `ReactDOM.createRoot`.
- `src/__tests__/App.test.tsx` asserts `App` renders without throwing, using `@testing-library/react`.
- `index.html` contains `<div id="root">` and a script pointing at `src/main.tsx`.
- `vite.config.ts` configures `@vitejs/plugin-react` and a Vitest `test` block.
- Fixed: this topology, the Context pin table, the smoke test, `projectName` in the `h1`, TypeScript strict mode, Tailwind v3, and flat ESLint.
- Free: tagline copy, card layout and colors inside the Design System section, and the placeholder sidebar or header.
- `npm run lint` exits 0. `npm run build` exits 0. `npm test` exits 0 with at least one test. `package-lock.json` is present after install.

## Design System <!-- key: design-system -->

- Background `slate-50`, cards `white`, sidebar or header `indigo-600` to `indigo-700`.
- Primary text `slate-900`, muted text `slate-500`, highlight `indigo-500`. Body text meets WCAG AA (4.5:1).
- Heading `text-3xl font-bold text-slate-900`. Tagline `text-lg text-slate-500`. Body `text-base text-slate-700`.
- Spacing `p-4`, `p-6`, `p-8`, `gap-4`, `gap-6`. Shell is `min-h-screen flex`, with an optional narrow sidebar. Content is `max-w-6xl mx-auto px-4`.
- Cards: `bg-white rounded-xl shadow-sm border border-slate-200 p-6`.
- Primary button: `bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors`.

## Verification Checks <!-- key: verification-checks -->

- [ ] `src/App.tsx` exists and renders an `h1` containing `projectName`.
- [ ] `src/main.tsx` exists and uses `ReactDOM.createRoot`.
- [ ] `src/__tests__/App.test.tsx` exists and is a Vitest smoke test.
- [ ] `index.html` exists and contains `<div id="root">`.
- [ ] `vite.config.ts` includes `@vitejs/plugin-react` and a `test` block.
- [ ] `tsconfig.json` has `"strict": true`, `@/*` pointing at `./src/*`, and no project `references`; `tsconfig.node.json` is independent.
- [ ] `tailwind.config.ts` covers `./src/**/*` and `postcss.config.mjs` exists.
- [ ] `eslint.config.js` exists. There is no `.eslintrc` file.
- [ ] `README.md`, `.gitignore`, `.env.example`, and `.github/workflows/ci.yml` exist; `.env.example` is not ignored.
- [ ] `package.json` pins the Context table and scripts include `dev`, `build`, `preview`, `test`, and `lint`.
- [ ] `npm run lint` exits 0.
- [ ] `npm run build` exits 0.
- [ ] `npm test` exits 0 with at least one passing test.
- [ ] `package-lock.json` is present.
