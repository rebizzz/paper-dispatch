# Design System — Paper Dispatch

Living reference for the visual language and motion system. Update this file whenever a
new pattern, token, or animation primitive is introduced.

## 1. Palette

Paper Dispatch runs on two calibrated "paper" surfaces, swapped via `data-theme`/`.dark`
on `<html>`. All colors are CSS custom properties in `src/app/globals.css` and exposed to
Tailwind as `paper-*` utilities (`tailwind.config.ts`).

| Token | Light | Dark | Use |
|---|---|---|---|
| `paper-bg` | `#f2f0e3` | `#19191d` | page background |
| `paper-ink` | `#242426` | `#d8d4c5` | primary text |
| `paper-card` / `paper-cardHover` | `#e8e5d6` / `#dfdbca` | `#202025` / `#26262c` | surfaces |
| `paper-border` / `paper-borderHover` | translucent black | translucent white | hairlines |
| `paper-textSubtle` | `#6c6961` | `#989489` | secondary text |
| `paper-coral` (accent) | `#f76f53` | same | links, CTAs, highlights |
| `paper-blue` / `paper-green` / `paper-amber` / `paper-purple` | fixed | fixed | category/tag accents |

Accent is swappable via `themeConfig.accent` in `site.config.ts` (coral / blue / green /
amber / purple) — never hardcode a hex when `paper-coral` (or the active accent) is meant.

## 2. Typography

- **Sans / UI** — Bricolage Grotesque (400–700). Body default weight is **500**, not 400 —
  this matters for font-loading checks (see §5).
- **Serif accent** — Junicode / Junicode-Italic, local WOFF2 subset, used only for `em`
  inside headings and hero copy (`<em class="font-serif">`).
- **Mono / code** — Iosevka first, JetBrains Mono and Fira Code as fallbacks, ligatures on
  (`font-feature-settings: 'calt' 1, 'liga' 1'`).

## 3. Motion system

Two motion layers coexist; keep them separated so effort scales with importance:

1. **CSS keyframes** (`tailwind.config.ts` `keyframes`, `globals.css`) for cheap, always-on
   micro-transitions: fades, scale-ins, shimmer, hover states. Prefer these for anything
   that doesn't need JS orchestration.
2. **Anime.js v4** (`animejs`, imported directly — no wrapper lib) for anything sequenced,
   spring-physics, or scroll-driven: hero reveal timeline, kinetic logo, floating reading
   dock, card hover lift, `ScrollReveal` (see below).

All motion must respect `prefers-reduced-motion`. Use `usePrefersReducedMotion()` /
`isReducedMotion()` from `src/lib/motion.ts` before starting a non-essential animejs
timeline; CSS keyframes are covered globally by the `@media (prefers-reduced-motion)`
block in `globals.css`.

### `ScrollReveal` (new)

`src/components/animations/ScrollReveal.tsx` — a thin `IntersectionObserver` wrapper that
fades/lifts children into place the first time they cross the viewport, with a spring
ease via anime.js. Use it to wrap any section, sidebar card, or list on a page that isn't
already animated by `Hero` or `AnimeStaggerList`. Do not wrap something already covered by
another entrance animation — one entrance effect per element.

```tsx
<ScrollReveal><YourSection /></ScrollReveal>
<ScrollReveal delay={80}><SidebarCard /></ScrollReveal>
```

## 4. Surface treatment (cards, nav, code)

- **Cards** (`PostCard`, sidebar widgets) get a cursor-tracked radial "spotlight" (CSS
  variables `--spot-x`/`--spot-y` set on `pointermove`, drawn with a `::before` radial
  gradient) layered under the existing spring hover-lift. Subtle — a hint of light
  following the cursor, not a glow effect.
- **Navbar** intensifies its blur/shadow past `scrollY > 8px` (`Navbar.tsx`), driven by a
  scroll listener, not per-frame animation — keep it cheap.
- **Code blocks** (`CodeBlock.tsx`) get a 1px animated gradient hairline across the top of
  the header bar on hover (`.code-block-wrapper` `::before`), reinforcing the "editor
  canvas" framing without changing layout.

## 5. Known non-bugs (do not "fix" these again)

- `document.fonts.check('14px "Iosevka"')` reports weight **400** as never loaded. This is
  correct: `body` sets `font-weight: 500`, and nothing in the codebase renders text at
  Iosevka 400, so the browser never fetches that face. Weights 500/600 (the ones actually
  used) do load. Importing 400 is harmless dead weight, not a rendering defect.
- Static-export HTML for post pages contains **zero `<pre>` tags** — expected, since
  `MDXComponents.pre` replaces every `<pre>` with `<CodeBlock>`'s `<div>` root. Language
  detection instead reads `data-language` off the inner `<code>` (confirmed present and
  correct in both dev and `output: export` builds).
- `net::ERR_ABORTED` on `<video>`/`<audio>` `src` in automated headless runs is Chromium
  aborting an in-flight media fetch when the test tab closes/navigates away mid-preload —
  not reproducible as a user-facing failure; unrelated to MDX/code rendering.

## 6. Verification

`scripts/verify-media-and-code.mjs` drives a real headless Chromium (nix-provided,
`puppeteer-core`) against the production build and asserts on rendered DOM, computed
styles, and interaction (copy-button click). Re-run after any change to `CodeBlock`,
`ZoomableImage`, `VideoPlayer`, or `AudioPlayer`:

```bash
nix develop -c bun run build && nix develop -c bun run scripts/verify-media-and-code.mjs
```

`scripts/take-screenshots.mjs` captures full-page screenshots into `docs/screenshots/` for
visual diffing — run it before/after any broad styling pass.
