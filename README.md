# Near-surface Alteration & Geochemistry Group

Astro + Vue site for the lab. Live on GitHub Pages:

**https://juneaucross.github.io/davey/**

Content lives under `src/content/` and is loaded at build time via Astro content collections. Interactive chrome (nav, lightbox, updates show-more) is Vue islands.

## Deploy (GitHub Pages)

Deploys automatically via GitHub Actions on every push to **`main`** (workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) — official [`withastro/action`](https://github.com/withastro/action) build + `deploy-pages`).

**One-time repo setup:** Settings → Pages → **Source: GitHub Actions**.

Site config (`astro.config.mjs`):

- `site`: `https://juneaucross.github.io`
- `base`: `/davey/`

Public asset paths use `import.meta.env.BASE_URL` via `src/lib/paths.ts` (`withBase`) so CSS, images, favicons, and the hero preload resolve under `/davey/`.

## View locally

Requirements: **Node.js ≥ 22.12** (see `.tool-versions`).

```bash
npm install
npm run dev       # http://localhost:4321/davey/
npm run build     # → dist/
npm run preview   # preview production build (includes base)
```

## Layout

```text
src/content/           # editable JSON + Markdown (single source of truth)
src/content.config.ts  # Zod schemas + loaders
src/components/        # Astro sections
src/components/vue/    # islands: SiteHeader, Lightbox, UpdatesList
src/pages/index.astro  # composed static page
src/styles/            # design tokens + base + layout
public/assets/img/     # photographs (served as /davey/assets/img/...)
docs/                  # audit, parity, image-manifest, migration
```

Migration notes and `client:*` rationale: [`docs/astro-migration.md`](docs/astro-migration.md).

## Images

Photographs under `public/assets/img/`. Manifest: [`docs/image-manifest.json`](docs/image-manifest.json). Hero is the only `fetchpriority="high"` image (plus preload); others are lazy. One SVG fallback (`media-placeholder.svg`) remains for lightbox if a trigger lacks `src`.

## Branches

| Branch | Role |
|--------|------|
| **`main`** | Current Astro site (deployed to GitHub Pages) |
| **`vanilla`** | Preserved static/vanilla snapshot (do not delete) |
| **`astro`** | Historical working branch for the migration; may lag `main` |

Branching decision: [`docs/git-branching.md`](docs/git-branching.md).

Content parity vs live site: [`docs/content-parity.md`](docs/content-parity.md).
