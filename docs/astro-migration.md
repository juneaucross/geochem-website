# Astro migration (content collections + Vue islands)

Working branch: **`astro`**. Vanilla baseline remains on **`main`**.

## Stage status

| Stage | Status |
|-------|--------|
| A1 scaffold (Astro + Vue + CSS/img) | **DONE** |
| A2 content collections | **DONE** |
| A3 static section components | **DONE** |
| A4 Vue islands (nav, lightbox, show-more, scroll-spy) | **DONE** |
| **A5 cleanup + QA** | **DONE** |

## Canon: Astro content layer

Sources live under **`src/content/`**. Collections are declared in **`src/content.config.ts`** (Astro 5+ content layer; this project is on Astro 7).

| Choice | Why |
|--------|-----|
| `src/content/*` (not repo-root `content/`) | Matches Astro’s usual layout; loaders point at `./src/content` |
| `glob()` per file | Each JSON/MD document is one entry (`id` = filename stem) |
| Zod via `astro/zod` | Strict image paths, DOI URLs, and explicit `null`s |
| Build-time `getEntry` / `getCollection` | No `fetch('/assets/data/site.json')`, no `scripts/sync-content.mjs` |

Images stay in **`public/assets/img/`** → URLs `/assets/img/...` (unchanged). Schema validates those paths; Astro `<Image />` can come later.

## A4: Vue islands (dynamics only)

Static sections stay Astro (Hero, About prose, Research, Team, Labs, Gallery markup, Publications, Join, Footer, JsonLd). Vue is limited to interactive chrome. No Vue Router.

| Island | File | Directive | Why that directive |
|--------|------|-----------|--------------------|
| Site header | `src/components/vue/SiteHeader.vue` | **`client:load`** | Above-the-fold: solid-on-scroll, mobile `<dialog>` menu, scroll-spy, close-on-anchor. Must hydrate before early scroll / first Menu tap. |
| Lightbox | `src/components/vue/Lightbox.vue` | **`client:load`** | Triggers are scattered (Research / Team / Labs / Gallery) via `data-lightbox-*`. Document-delegated open must be ready before mid-page figures; island is tiny (one dialog). |
| Updates list | `src/components/vue/UpdatesList.vue` | **`client:visible`** | Below the fold in `#about`. Hydrate when the list nears the viewport; no need on first paint. |
| Publications list | `src/components/vue/PublicationsList.vue` | **`client:visible`** | Below the fold in `#publications`. Same PE as Updates, but Show more on **all** viewports (no nested scrollport). |

### Progressive enhancement

| Surface | Without JS | With JS |
|---------|------------|---------|
| Updates | SSR lists **all** diary entries; no toggle | **Desktop (≥56rem):** all entries in `#updates` aside scrollport (no Show more). **Mobile:** after hydrate, newest 2 (first clamped to 2 lines) + rest collapsed + Show more / less; `hidden="until-found"` + `beforematch` when supported, else plain `hidden` |
| Publications | SSR lists **all** pubs by year; no toggle | After hydrate (all viewports): newest 2 + rest collapsed + Show more / less; `hidden="until-found"` + `beforematch` when supported, else plain `hidden` |
| Gallery / figures | Thumbs and captions visible; zoom is a no-op button | Lightbox opens via native `<dialog showModal()>` |
| Nav | Desktop links work; Menu button inert without hydrate | Modal menu (`showModal` focus trap), Invoker Commands + fallbacks |

### Dialog / a11y patterns (modern-web-guidance)

- Open modals with **`showModal()`** (native focus trap + Esc). Prefer this over custom traps.
- **`closedby="any"`** for light-dismiss; Safari fallback via click-outside geometry (`src/lib/dialog.ts`).
- Invoker Commands (`command` / `commandfor`) where supported; click handlers when missing.
- Do **not** restyle `[hidden=until-found]` with `display` / `visibility` (breaks Find-in-page). Vue sets `hidden` / `until-found` via `setAttribute` (Vue’s boolean `hidden` binding would collapse the token). Collapse must not depend on until-found support — unsupported browsers use plain `hidden`.
- Respect existing `prefers-reduced-motion` rules in CSS tokens / layout.

### Wiring

- `Header.astro` mounts `SiteHeader` + `Lightbox` islands only.
- Gallery / `MediaFigure` stay Astro; they emit `data-lightbox-src|alt|caption` for the lightbox island.
- `About.astro` keeps mission/methods as static HTML; only the diary is `UpdatesList`.
- `Publications.astro` keeps eyebrow/title/lede/note as static HTML; the year list is `PublicationsList`.

## A3: static components

Section anchors match vanilla: `#home`, `#about`, `#research`, `#team`, `#labs`, `#gallery`, `#services`, `#publications`, `#join`.

| Component | Role |
|-----------|------|
| `Header.astro` | Mounts SiteHeader + Lightbox islands |
| `Hero.astro` | Full-bleed LCP image (`fetchpriority="high"`, no lazy) |
| `About.astro` | Mission + methods (static) + UpdatesList island |
| `Research.astro` / `Team.astro` / `Labs.astro` / `Gallery.astro` / `Services.astro` / `Join.astro` | Section markup from collections |
| `Publications.astro` | Section chrome (static) + PublicationsList island |
| `Footer.astro` | Affiliation + contact |
| `JsonLd.astro` | ResearchOrganization + Person + ScholarlyArticle list — SSR in `<head>` |
| `MediaFigure.astro` | Lazy figures; zoom attrs for Lightbox island |

Markdown: collection `render()` for labs; about/join body fragments via Astro’s markdown helpers (`src/lib/markdown.ts`).

LCP: `BaseLayout` preloads hero with `fetchpriority="high"`; all other images `loading="lazy"`. Long lists use `content-visibility: auto` on `.pub-item` and `.timeline__item`.

## Folder structure (current)

```
davey/
├── astro.config.mjs
├── src/
│   ├── content.config.ts
│   ├── content/
│   ├── components/
│   │   ├── *.astro            # static sections
│   │   └── vue/               # SiteHeader, Lightbox, UpdatesList, PublicationsList
│   ├── lib/                   # markdown, doi, site, dialog helpers
│   ├── layouts/BaseLayout.astro
│   ├── pages/index.astro
│   └── styles/
├── public/assets/img/
├── docs/astro-migration.md
└── package.json
```

## A5: removed vanilla garbage

| Removed | Notes |
|---------|--------|
| `public/index.html` | Old shell; Astro emits HTML from `src/pages/` |
| `public/assets/js/main.js` | Imperative render, `el()`, `mdToHtml`, `fetch(site.json)` |
| `public/assets/js/` | Directory removed |
| `public/assets/data/site.json` | Replaced by content collections; do not regenerate |
| `scripts/sync-content.mjs` | No longer needed |
| `npm run sync` / `prestart` / `start` (`serve`) | Replaced by `dev` / `build` / `preview` |
| Repo-root `content/` | Canonical copy is `src/content/` only |
| `public/assets/css/` | Moved to `src/styles/` (tokens, base, layout) |
| `hero-placeholder.svg` | All content `src` values are real photos |
| Unused npm deps / `serve` | Package is Astro + Vue only |

**Kept:** `docs/` (audit, parity, image-manifest), photographs under `public/assets/img/`, design tokens in `src/styles/`, `.tool-versions`, and one SVG fallback (`media-placeholder.svg`) for lightbox if a trigger omits `src`.

## Scripts

| Script | Role |
|--------|------|
| `npm run dev` | Astro dev server |
| `npm run build` | Static build → `dist/` (gitignored) |
| `npm run preview` | Preview `dist/` |

## Verify

```sh
npm run build && npm run preview
# Network: no squarespace-cdn, no /assets/data/site.json
# hero: one img[fetchpriority=high] + link[rel=preload]
# view-source: application/ld+json in <head>
# keyboard: Menu dialog Tab cycle; lightbox Esc returns focus; Show more toggles until-found panel
```

A5 QA screenshots: `docs/screenshots/astro/` (375 / 768 / 1280). A4 captures remain under `docs/screenshots/a4/`.

## Deferred (post-A5)

- Astro `<Image />` / responsive `srcset`
- GitHub Pages `base` / `site` config
