# Assets todo — photographs

Content photographs from [davidzakharov.com](https://www.davidzakharov.com/) are stored locally under `public/assets/img/`. Inventory: [`docs/image-manifest.json`](image-manifest.json). Import report: [`docs/images-import-report.md`](images-import-report.md).

Hero LCP uses `/assets/img/hero-thin-section.jpg` with `fetchpriority="high"`. All other media use `loading="lazy"` only (no `fetchpriority="low"`).

## Status

| Filename | Alt / caption | Status |
|----------|---------------|--------|
| `hero-thin-section.jpg` | Petrographic thin-section / altered basalt fabric | **on disk** |
| `isabelle-h-isotopes.jpg` | Isabelle Boyer preparing samples for H-isotopes by EA Isolink OH | **on disk** |
| `afrid-fluorination.jpg` | Stable isotope lab at WMU 2024. PhD student Afrid Sheik is fluorinating silicates | **on disk** |
| `team-kwings-2024.jpg` | K Wings Game, Jan 2024 | **on disk** |
| `research-kola-zircons.jpg` | Low-δ¹⁸O zircons from the Kola Craton | **on disk** |
| `research-vetreny-pillows.jpg` | Pillow basalts, Vetreny Belt | **on disk** |
| `research-axial-jason.jpg` | ROV Jason / Axial Seamount (Credit: W. Chadwick, OSU, NSF, WHOI. 2020.) | **on disk** |
| `research-chert-thin-section.jpg` | Chert thin section + SIMS / microprobe maps | **on disk** |
| `lab-overview-2024.jpg` | Lab overview photo (Jan 2024) | **on disk** |
| `lab-delta-v-analyzer.jpg` | Analyzer of our Delta V Plus; CONFLO IV above the MS | **on disk** |
| `lab-brf5-transfer.jpg` | Transfer and distillation of fluorinating agent | **on disk** |
| `lab-fluorination-line.jpg` | Fluorination line at work with vent snorkel | **on disk** |
| `lab-haenicke-hall.jpg` | Beautiful Haenicke Hall | **on disk** |
| `lab-chlorine-byproduct.jpg` | Chlorine in solid form — fluorination byproduct | **on disk** |
| `lab-sample-chamber.jpg` | Sample chamber with Ni-sample holder | **on disk** |
| `lab-machine-shop.jpg` | Machine shop supporting stable isotope work | **on disk** |
| `lab-fluorination-quartz-process.jpg` | Laser fluorination of quartz grains (process sequence) | **on disk** |
| `lab-fluorination-uwg2-garnet.jpg` | Fluorination progress for UWG-2 garnet | **on disk** |
| `raman-invia.jpg` | Renishaw InVia Raman microscope (532 nm) | **on disk** |

### Extra content photos (beyond original todo)

| Filename | Notes | Status |
|----------|-------|--------|
| `raman-invia-side.jpg` | Second InVia angle from Raman page | **on disk** |
| `raman-lab-bench.jpg` | Raman lab workspace | **on disk** |
| `lake-michigan.jpg` | Contact / Join Us section background | **on disk** |
| `contact-field-outcrop.jpg` | Contact page content photo | **on disk** |

### Not downloaded (UI / non-content)

- Individual team headshots on `/team` (portraits next to bios) — optional future gallery/roster wiring
- Publications page section background (`SIMS_princpale2.jpg`) — decorative section chrome
- Research page decorative sidebar field photo (`IMG_20220613_135931.jpg`) — not mapped to a theme figure
- Squarespace favicons, fonts, map tiles, tracking pixels

## Wiring notes

- `content/gallery.json` `src` fields point at `/assets/img/…`
- `content/site.json` hero → `hero-thin-section.jpg`
- `content/research.json` figures → research-* files
- `content/team.json` `groupPhoto.src` → `team-kwings-2024.jpg`
- Keep hero as the only `fetchpriority="high"` image; below-fold photos stay `loading="lazy"`.
- After editing `content/`, run `npm run sync`.
