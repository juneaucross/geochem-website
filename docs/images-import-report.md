# Images import report

Date: 2026-08-07  
Source: https://www.davidzakharov.com/  
Local: http://localhost:4173/

## Summary

| Metric | Value |
|--------|------:|
| Manifest entries | 23 |
| Downloaded | 23 |
| Missing from live site (assets-todo) | 0 |
| Wired in `content/` | yes |
| `npm run sync` | done |

All content photographs from the live Squarespace site that map to `docs/assets-todo.md` are stored under `public/assets/img/*.jpg`. No Squarespace CDN URLs remain in the rendered page.

## Inventory method (chrome-devtools)

For each live page (`/`, `/team`, `/research`, `/stable-isotope-lab`, `/raman-microscopy`, `/service-work`, `/publications`, `/contact`):

1. `navigate_page`
2. `list_network_requests` (image) + `evaluate_script` content-image harvest
3. Caption matching via adjacent Squarespace text blocks (and `docs/audit-data/*.html`)

`/service-work` has no content photos. Publications section background (`SIMS_princpale2.jpg`) skipped as decorative chrome.

## Downloads

CDN returned WebP when `curl` negotiated Accept; files were converted to JPEG with `sips` so `.jpg` paths match content. Dimensions refreshed after conversion.

Full mapping: [`docs/image-manifest.json`](image-manifest.json).

## Wiring

| Target | Change |
|--------|--------|
| `content/site.json` | `hero.image.src` → `/assets/img/hero-thin-section.jpg` |
| `content/gallery.json` | 22 items with local `src` (original 8 + lab/raman/contact extras) |
| `content/research.json` | all four `figures[].src` set |
| `content/team.json` | `groupPhoto.src` → `team-kwings-2024.jpg` |
| `public/index.html` | preload + hero `<img>` → thin-section JPEG |
| `public/assets/js/main.js` | labs stable/raman figures use real photos; width/height from content |

## Local verification (chrome-devtools + `npm start`)

| Check | Result |
|-------|--------|
| Image network hosts | **only** `localhost:4173/assets/img/…` (23 JPGs) |
| Squarespace CDN in page | **none** |
| Hero not placeholder | `/assets/img/hero-thin-section.jpg`, natural **2080×1544** |
| `fetchpriority=high` | **only** hero |
| Broken imgs (`naturalWidth === 0`) after load | **0** (excl. empty src oddity) |
| Placeholders in DOM | **0** |
| Gallery lightbox | opens Isabelle photo, `naturalWidth` 1187, caption preserved |

Screenshots: [`docs/screenshots/images-import/`](screenshots/images-import/) (`01-hero.png`, section crops, `full-page.png`).

## Gaps / deferred

- Individual `/team` headshots (David, students, alumni) — not in original assets-todo; optional roster photos later
- Research page sidebar field photo `IMG_20220613_135931.jpg` — not mapped to a theme figure
- Publications decorative SIMS background — skipped
- About section still text-only; Isabelle/Afrid appear in gallery (and were historically home media)

## Files on disk

```text
public/assets/img/afrid-fluorination.jpg
public/assets/img/contact-field-outcrop.jpg
public/assets/img/hero-thin-section.jpg
public/assets/img/isabelle-h-isotopes.jpg
public/assets/img/lab-brf5-transfer.jpg
public/assets/img/lab-chlorine-byproduct.jpg
public/assets/img/lab-delta-v-analyzer.jpg
public/assets/img/lab-fluorination-line.jpg
public/assets/img/lab-fluorination-quartz-process.jpg
public/assets/img/lab-fluorination-uwg2-garnet.jpg
public/assets/img/lab-haenicke-hall.jpg
public/assets/img/lab-machine-shop.jpg
public/assets/img/lab-overview-2024.jpg
public/assets/img/lab-sample-chamber.jpg
public/assets/img/lake-michigan.jpg
public/assets/img/raman-invia-side.jpg
public/assets/img/raman-invia.jpg
public/assets/img/raman-lab-bench.jpg
public/assets/img/research-axial-jason.jpg
public/assets/img/research-chert-thin-section.jpg
public/assets/img/research-kola-zircons.jpg
public/assets/img/research-vetreny-pillows.jpg
public/assets/img/team-kwings-2024.jpg
```

SVG fallbacks `hero-placeholder.svg` / `media-placeholder.svg` remain only for missing `src` in `main.js`.
