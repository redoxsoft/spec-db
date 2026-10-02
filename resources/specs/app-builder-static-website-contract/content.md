# App Builder Static Website Contract

## Context <!-- key: context -->

Minimal runnable static site only. No CMS, auth, analytics, or business features.

- `vite`: Vite + TypeScript + Tailwind CSS + an npm lockfile.
- `plain`: HTML, CSS, and JavaScript with no Node build step.

Write these specifiers for `vite` only. Do not use `latest`. Do not install `tailwindcss@4`. Do not add Zod.

| Package | Specifier | Include when |
| :--- | :--- | :--- |
| `vite` | `8.3.1` | `buildTool=vite` (dev) |
| `typescript` | `5.9.3` | `buildTool=vite` (dev) |
| `tailwindcss` | `3.4.19` | `buildTool=vite` (dev) |
| `postcss` | `8.5.28` | `buildTool=vite` (dev) |
| `autoprefixer` | `10.6.1` | `buildTool=vite` (dev) |
| `eslint` | `9.39.5` | `buildTool=vite` (dev) |
| `@eslint/js` | `9.39.5` | `buildTool=vite` (dev) |
| `typescript-eslint` | `8.71.0` | `buildTool=vite` (dev) |
| `vitest` | `5.0.2` | `buildTool=vite` (dev) |

Apply App Builder Web Standards, section Scaffolding Baseline (Day 0), for mandatory repo artifacts, Vite TypeScript, lockfile, lint, one Vitest smoke test, and a green `npm run build`. Apply section Topology & Directory Structure where it fits this tree. Plain HTML skips the toolchain bar.

## Choice Tokens <!-- key: choice-tokens -->

- `buildTool`: `vite` or `plain`.

## Topology <!-- key: topology -->

### Vite layout (`buildTool=vite`)

```text
├── index.html
├── package.json          # scripts: dev, build, preview, lint, test; lockfile committed
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json         # strict: true
├── eslint.config.js      # flat config
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.ts
│   ├── site.ts           # exports siteName
│   ├── style.css         # Tailwind directives
│   ├── assets/
│   └── __tests__/
│       └── site.test.ts  # asserts siteName
├── public/
├── README.md
├── .gitignore
├── .env.example          # empty placeholders only if any env keys exist
└── .github/workflows/ci.yml   # lint, test, typecheck, build
```

One hello-world page shows `siteName`. TypeScript is strict and a lockfile is committed. Styles enter through `src/style.css` and Tailwind. This layout does not include the plain files. Do not add Zod.

Scripts: `dev` = `vite`, `build` = `tsc && vite build`, `preview` = `vite preview`, `lint` = `eslint .`, `test` = `vitest run`.

### Plain layout (`buildTool=plain`)

```text
├── index.html            # title = siteName; links css/js
├── css/styles.css
├── js/main.js
├── assets/
├── README.md             # how to open locally (no build)
└── .gitignore            # OS/editor junk only
```

No `package.json`, bundler, Tailwind, lint, or test. `index.html` references the local CSS and JS files. This layout does not include Vite.

## Output Contract <!-- key: output-contract -->

- One root `index.html` with a visible heading and document title equal to `siteName`.
- Landmark zones: document title, primary heading (`h1`), and a short supporting line.
- Fixed: the topology for the selected `buildTool`, hello-world scope, Vite pins and scripts when `buildTool=vite`, a README, and no business features.
- Free: wording of the supporting line, modest styling inside the Design System section, and an optional favicon or placeholder under `assets/` or `public/`.
- Text on background meets WCAG AA intent for body text. Relative asset links resolve.
- Vite: `npm run lint`, `npm test`, and `npm run build` exit 0. TypeScript `strict` is true. ESLint is flat config.
- Plain: the site opens without Node and has no package manager.

## Design System <!-- key: design-system -->

- Neutral page background, high-contrast text, and one accent for the heading or a single optional link. Avoid a purple-on-white default when inventing an accent.
- System-ui or a similar readable stack. Clear `h1` versus body. Body line-height about 1.5.
- Centered single column, generous vertical padding, 8px spacing rhythm.
- No component library. A link or button uses native styles and a visible focus outline.

## Verification Checks <!-- key: verification-checks -->

- [ ] `siteName` appears in the document title and primary heading.
- [ ] The selected `buildTool` layout from Topology exists under `targetDir`.
- [ ] Styles are linked and apply. Vite uses Tailwind directives. Plain uses `css/styles.css`.
- [ ] Vite: `package.json` pins the Context table and defines `dev`, `build`, `preview`, `lint`, and `test`. `eslint.config.js` exists. There is no `.eslintrc` file.
- [ ] Vite: `src/__tests__/site.test.ts` asserts `siteName`. `npm run lint`, `npm test`, and `npm run build` exit 0. A lockfile is committed.
- [ ] Vite: `.github/workflows/ci.yml` runs lint, test, and build.
- [ ] Plain: no `package.json`.
- [ ] README documents how to run the Vite site or how to open the plain site.
