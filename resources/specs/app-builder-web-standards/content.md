# App Builder Web Standards

## Scaffolding Baseline (Day 0) <!-- key: scaffold-baseline -->

Binding hygiene for every scaffolded web project. Hello-world tasks implement this section. Later sections in this standard are non-binding unless a contract names them.

- **Mandatory Repository Artifacts**:
  - `README.md`: Setup commands, local dev instructions (`npm run dev`), build commands, and environment variable documentation.
  - `.env.example`: Template listing all required environment variable keys with empty or placeholder values; secrets must never be committed.
  - `.gitignore`: Standard ignores (`node_modules`, `.next`, `dist`, `out`, `.env*` except `.env.example`).
  - `.github/workflows/ci.yml`: Baseline CI running lint, one test, type-checking when TypeScript is present, and production build.
- **Dependency & Lockfile Integrity**:
  - Dependencies must be locked with a committed lockfile (`package-lock.json`).
  - Copy specifiers from the generator contract. Do not write `latest`.
  - Do not install heavy external libraries when native browser APIs or small utilities suffice.
- **Type Safety**: TypeScript in strict mode (`"strict": true`). JavaScript starters use ESLint flat config (`eslint.config.js` or `eslint.config.mjs`). They do not write a new `.eslintrc` file.
- **Lint, Test, and Build**:
  - `npm run lint` exits 0.
  - `npm test` exits 0 with at least one Vitest smoke test.
  - `npm run build` compiles with zero errors and exits 0.
- **Entry Landmarks**:
  - Root entry must display a visible primary heading (`h1`) matching the site/project name, clean responsive container, and basic design tokens.

Plain HTML static sites have no package manager. File checks replace lint, test, and build for that token only.

## Topology & Directory Structure <!-- key: topology -->

Day-0 trees keep routing, a small UI primitive folder, and `lib/utils.ts` for `cn()` when Tailwind is present. Feature modules, auth route groups, and a typed API client are later.

### Next.js App Router Structure

Day-0 files: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `components/ui/` as needed, `lib/utils.ts` when Tailwind is present.

Later (do not create in hello-world unless the contract names them): `(auth)/`, `error.tsx`, `loading.tsx`, `features/`, `lib/api-client.ts`.

```text
├── app/                      # Route segments, pages, layouts, and route handlers
│   ├── layout.tsx            # Root layout (HTML, body, global providers)
│   ├── page.tsx              # Root index page
│   └── api/                  # Route handlers (if co-located)
├── components/
│   ├── ui/                   # Primitive UI components
│   └── layout/               # Global shell components
├── lib/
│   └── utils.ts              # cn() class merger
└── types/                    # Shared TypeScript declarations
```

### React + Vite SPA Structure

Day-0 files: `src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/lib/utils.ts`, `src/routes/` when React Router is in the contract, `src/components/ui/` as needed.

Later (empty placeholder only when the contract lists it): `src/features/`, a typed HTTP client, global hooks.

```text
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   └── layout/
│   ├── lib/
│   │   └── utils.ts
│   ├── routes/
│   ├── App.tsx
│   └── main.tsx
```

### Physical Boundaries

- `components/ui/` must NEVER import from `features/` or call data-fetching hooks.
- Routing pages (`app/**/page.tsx` or `routes/**`) must act as coordinators and delegate visual rendering to components.

## Data Flow & State Lifecycle <!-- key: data-flow -->

### Day 0

- Hello-world pages may use local `useState` for UI-only interactions.
- A hello-world page that shows a health status may fetch that one URL. Do not add an API client, query library, or global store to do it.

### Later (non-binding)

Do not implement these in the hello-world tree. Do not stop a run because they are absent.

- **UI Components Never Call Raw `fetch()`** in a feature-complete app: network access flows through a centralized, typed client (`lib/api-client.ts`) or dedicated feature query hooks.
- **Server State**: Next.js Server Components for initial data fetching; TanStack Query or Server Actions for client-side queries and mutations. Never duplicate server cache data into client stores (Zustand) merely to make it globally accessible.
- **URL State**: Filter, tab, search, and pagination in URL query parameters.
- **Global Client State**: Zustand only for genuinely cross-cutting UI state.
- **Forms**: idle, submitting, success, and error states; preserve input on recoverable errors; revalidate caches after mutation.

## Layering & Design Patterns <!-- key: design-patterns -->

Day-0:

- **Server vs. Client Components (Next.js)**: Components are Server Components by default. Push `"use client"` to the furthest leaves. Never wrap an entire page or layout in `"use client"` unless the entire tree requires browser-only APIs.
- **Server Secrets Protection**: Never reference server-only secrets inside Client Components.
- **Styling**: **Tailwind CSS** utilities and the `cn()` helper (`clsx` + `tailwind-merge`) when the contract includes Tailwind. Inline `style={{ ... }}` only for runtime-calculated values.

Later (non-binding): container/presenter split for data-fetching screens; composition over prop drilling for deep configuration.

## Resilience, Errors & Diagnostics <!-- key: resilience -->

Day-0:

- Interactive elements are keyboard-accessible with a visible `:focus-visible` ring.
- Color is not the sole indicator of status on the hello-world page.

Later (non-binding). Do not add these unless the contract names them:

- Next.js `error.tsx` with `reset()`, Vite `ErrorBoundary` around every route, `loading.tsx` skeletons, empty states, a typed `AppError` envelope, and form `aria-invalid` wiring.

## Testing & Quality Baseline <!-- key: quality-baseline -->

Day-0 quality is in Scaffolding Baseline: strict TypeScript, lockfile, lint, one Vitest smoke test, CI, and `npm run build`.

Later (non-binding):

- Schema validation at external boundaries with **Zod**.
- Do not add Zod because this section mentions it. Add it when a contract requires request or form validation.
