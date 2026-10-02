# App Builder Next.js Website Contract

## Context <!-- key: context -->

Minimal runnable Next.js App Router website. Public content sites, marketing pages, blogs, and portfolios. No CMS, authentication, backend database, or business features.

Write these specifiers. Do not use `latest`. Do not install `tailwindcss@4`. Registry latest is v4 and it does not use `tailwind.config.ts` or `@tailwind` directives. `tailwindcss` must be `3.4.19`.

| Package | Specifier | Include when |
| :--- | :--- | :--- |
| `next` | `16.3.7` | always |
| `react` | `19.3.0` | always |
| `react-dom` | `19.3.0` | always |
| `typescript` | `5.9.3` | always (dev) |
| `@types/react` | `19.3.0` | always (dev) |
| `@types/react-dom` | `19.3.0` | always (dev) |
| `@types/node` | `22.20.4` | always (dev) |
| `tailwindcss` | `3.4.19` | always (dev) |
| `postcss` | `8.5.28` | always (dev) |
| `autoprefixer` | `10.6.1` | always (dev) |
| `eslint` | `9.39.5` | always (dev) |
| `eslint-config-next` | `16.3.7` | always (dev) |
| `@eslint/eslintrc` | `3.3.7` | always (dev) |
| `vitest` | `5.0.2` | always (dev) |

Apply App Builder Web Standards, section Scaffolding Baseline (Day 0), for mandatory repository artifacts, locked dependencies, lint, one Vitest smoke test, and build verification. Apply section Topology & Directory Structure for App Router directories. Apply section Layering & Design Patterns for Server Components by default and Tailwind CSS.

## Choice Tokens <!-- key: choice-tokens -->

- `runMode`: `static-export` or `server`.

## Topology <!-- key: topology -->

```text
├── app/
│   ├── layout.tsx            # Root layout with html/body, metadata, and globals.css
│   ├── page.tsx              # Root index page displaying siteName
│   ├── not-found.tsx         # User-friendly 404 page
│   └── globals.css           # Tailwind CSS directives and base styles
├── lib/
│   └── site.ts               # exports siteName
├── tests/
│   └── site.test.ts          # Vitest smoke test; does not start a server
├── public/                   # Static assets (favicon, icons, illustrations)
├── next.config.mjs           # Next.js config (with output: 'export' if static-export)
├── package.json              # scripts: dev, build, start, lint, test
├── tsconfig.json             # strict: true, paths: {"@/*": ["./*"]}
├── tailwind.config.ts        # Tailwind configuration covering app directory
├── postcss.config.mjs        # PostCSS configuration for Tailwind
├── eslint.config.mjs         # flat config via FlatCompat
├── vitest.config.ts
├── README.md                 # Setup, dev, build, preview/serve commands per runMode
├── .gitignore                # node_modules, .next, out, .env*
├── .env.example              # Placeholder environment keys
└── .github/workflows/ci.yml  # lint, test, typecheck, build
```

`static-export` sets `output: 'export'` in `next.config.mjs`. If `next/image` is referenced, set `images: { unoptimized: true }`. The README documents static hosting. `server` omits `output: 'export'` and the README documents `npm start`.

Scripts: `dev` = `next dev`, `build` = `next build`, `start` = `next start`, `lint` = `eslint .`, `test` = `vitest run`.

`eslint.config.mjs` uses `FlatCompat` from `@eslint/eslintrc` to extend `next/core-web-vitals` and `next/typescript`. Do not write an `.eslintrc` file. `vitest.config.ts` sets `environment: 'node'` and `include: ['tests/**/*.test.ts']`.

## Output Contract <!-- key: output-contract -->

- `app/page.tsx` is a Server Component with an `h1` matching `siteName`, a tagline, and an introductory section.
- `app/layout.tsx` sets metadata `title` and `description`, renders the HTML and body shell, and imports `@/app/globals.css`.
- `lib/site.ts` exports `siteName`. `tests/site.test.ts` asserts that value. The test does not start Next.js.
- `next.config.mjs` follows the selected `runMode`.
- Fixed: App Router topology, Context pins, TypeScript strict mode, Tailwind, scripts `dev`, `build`, `start`, `lint`, and `test`, mandatory repo files, and hello-world scope.
- Free: tagline and introductory copy, spacing and palette inside the Design System section, and an optional brand SVG in `public/`.
- `npm run lint`, `npm test`, and `npm run build` exit 0. `static-export` writes `out/`. `server` writes the production bundle under `.next/`.

## Design System <!-- key: design-system -->

- Neutral scale: Tailwind `slate` or `zinc` (50–950) for surfaces, cards, and type.
- Accent: Tailwind `indigo` or `blue` (500–700) for interactive elements.
- Body text meets WCAG AA (4.5:1).
- System font stack or Inter (`font-sans`). Primary heading `text-4xl` or `text-5xl` and bold. Tagline `text-lg` or `text-xl`. Body `text-base`.
- Spacing uses a 4/8 rhythm (`p-4`, `p-8`, `gap-6`). Container is `max-w-4xl` or `max-w-5xl`, centered, with `mx-auto px-4`.
- Primary buttons use `rounded-lg`, bold text, a solid accent background, a hover transition, and `focus:ring-2 focus:ring-offset-2`.

## Verification Checks <!-- key: verification-checks -->

- [ ] `app/page.tsx` exists and its `h1` renders `siteName`.
- [ ] `app/layout.tsx` exists, defines metadata, and imports `globals.css`.
- [ ] `next.config.mjs` sets `output: 'export'` when `runMode` is `static-export`, and omits it when `runMode` is `server`.
- [ ] `package.json` pins the Context table and contains `dev`, `build`, `start`, `lint`, and `test`.
- [ ] `tsconfig.json` sets `"strict": true` and the `@/*` path alias.
- [ ] `tailwind.config.ts` and `postcss.config.mjs` exist and Tailwind content includes `app/`.
- [ ] `eslint.config.mjs` exists. There is no `.eslintrc` file.
- [ ] `tests/site.test.ts` asserts `siteName` without starting a server.
- [ ] `README.md`, `.gitignore`, `.env.example`, and `.github/workflows/ci.yml` exist. CI runs lint, test, and build.
- [ ] `npm run lint` exits 0.
- [ ] `npm test` exits 0.
- [ ] `npm run build` exits 0.
