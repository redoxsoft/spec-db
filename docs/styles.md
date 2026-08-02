# Styling Rules — Spec DB

Ground UI work against [`internal/prototype.html`](internal/prototype.html). Keep the catalog dense, calm, and iframe-friendly.

## Principle

**Tokens in Tailwind config → utilities in components.** No parallel CSS architecture.

## Stack

- **Tailwind only** for layout and visuals.
- **`@tailwindcss/typography`** (`prose`) for resource preview HTML only.
- **Lucide React** for icons (same set as the prototype).
- **No** CSS Modules, styled-components, or inline `style={{ }}` (exceptions: CSS variables set once for theme, e.g. on `<html>`).

## Tokens (mandatory)

Define in Tailwind theme (names can match the prototype):

| Token | Role | Prototype cue |
|-------|------|----------------|
| `brand.50/100/500/600/700` | Accents, selected filters, primary CTA | blue scale |
| `ui.border` / `ui.bg` / `ui.card` | Chrome, page, cards | `#e5e7eb` / `#f9fafb` / `#ffffff` |
| `shadow-card` / `shadow-card-hover` | Resource cards | soft elevation |
| `font-sans` | UI text | Inter (or project default once chosen) |

**Kind accents** (template / spec / pipeline): small fixed maps in one module (e.g. `src/lib/kindStyles.ts`) — indigo / blue / emerald as in the prototype. Do not invent new kind palettes per screen.

**Forbidden in JSX:** raw hex, one-off `bg-[#…]`, arbitrary layout math unless truly dynamic.

## Global CSS (`src/styles/globals.css`) — only

- Tailwind directives
- Thin scrollbar (prototype-style; embed-friendly)
- Detail panel slide-in (`.detail-panel`)
- Theme vars for light/dark if needed (`?theme=` / `prefers-color-scheme`)

No component-level CSS files.

## Layout (catalog chrome)

Mirror the prototype structure; do not invent dashboards.

```text
[optional demo bar — dev only]
[header — hidden in embed]
[sidebar | main scroll]
[detail panel overlay]
```

Rules:

- App shell owns **height**: `h-dvh`, `overflow-hidden` on outer; **scroll inside** main (and detail panel body / mobile filter drawer). Never grow the document for iframe thrash.
- Sidebar: fixed width (~`w-64`), border-right, stacks Search → Resource Type → Tags.
- Main: soft `ui.bg`, contained grid (`max-w-6xl`-ish), cards `rounded-2xl` + `shadow-card`.
- Detail (`DetailModal`): **desktop** — right slide-over (`md+`, ~`max-w-xl` / `lg:max-w-2xl`, full height); **mobile** — fullscreen dialog. Header / scrollable body / footer actions; backdrop dismiss + Escape.
- **Detail stack (pipelines):** overview lists steps (step fan-out hint) + readonly Inputs (definitions + pipeline fan-out); nested task panel shows instructions **and** task-scoped variables (step/pipeline fan-out badges). Prefer stack over accordion when prompts are long. Escape closes the topmost layer first.
- **Embed mode:** hide standalone header (and demo bar); keep sidebar + main; no extra marketing chrome. Host `kinds=` allowlist scopes which Resource Type options appear — single-kind embeds should not show a redundant “All” chooser.
- Children stay fluid: parents use `gap-*`; avoid margin-based positioning on leaf components.

## Components

- Prefer small presentational pieces: `ResourceCard`, `KindFilter`, `TagFilter`, `DetailModal`, `AppHeader`, `CatalogSidebar`, `CatalogFiltersPanel`, `MobileFiltersDrawer`, pipeline `TaskDetailPanel` / inputs list.
- Variants: plain Tailwind + thin helpers (`clsx` / `tailwind-merge`). **CVA optional** — use only if a control truly has several variants (e.g. button). Do **not** pull in shadcn/Radix unless a milestone explicitly needs it.
- Cards are click targets; kind icon tile + title + summary + footer meta (stats / updated).
- Preview pane: `prose prose-sm` on sanitized HTML from the build — do not restyle markdown with one-off utilities per block type.

## Motion

- Prefer CSS `transition-*` for hover/focus (cards, filters, modal opacity).
- **No Framer Motion requirement.** Skip animation libraries until a milestone asks.
- Respect `prefers-reduced-motion`.

## Responsive

- **Desktop-first** (sidebar + multi-column grid), then `md`/`lg` prefixes.
- Below `md`: hide the persistent sidebar; expose the same filter panels via a **Filters** control in the main column that opens a left drawer (`MobileFiltersDrawer` + shared `CatalogFiltersPanel`). Grid → 1 column.
- Touch targets ≥ 44px where controls are tappable on small screens.
- Outer shell: `h-dvh` + `overflow-hidden`; scroll stays in main / detail panel / drawer.

## Do / Don't

| Do | Don't |
|----|--------|
| Match prototype spacing and card radius | Purple glow / glassmorphism / dashboard widget soup |
| Use kind color map consistently | Different card chrome per feature folder |
| Keep embed layout scroll-contained | `position: fixed` headers that fight the host iframe |
| One `DetailModal` pattern (panel / fullscreen + nested task layer) | Separate full-page detail route *and* a divergent modal in v1; accordion-as-primary for pageful tasks |

## Mental model

```text
prototype.html look
  → Tailwind tokens
    → shell layout
      → cards / filters / detail panel
        → prose preview (generated HTML)
```
