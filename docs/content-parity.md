# Content parity — local prototype vs davidzakharov.com

Checked **2026-08-07** against live [davidzakharov.com](https://www.davidzakharov.com/) via Chrome DevTools MCP (`navigate_page` + `take_snapshot` / text extract on Home, Team, Publications, Contact, Service) and the local shell at `http://localhost:4173/` (same tools + Playwright screenshots/keyboard log).

Verdict: **core prose, rates, research themes, updates, and publication DOIs are present**. Gaps below are IA/status/media differences, not wholesale missing body copy.

## Matched (no action for handoff)

| Area | Live | Local |
|------|------|-------|
| About intro + “What do geochemists do?” | Home | `#about` from `content/about.md` |
| Lab Updates diary (36 entries, NSF/PRF/DOI/seminar links) | Home | `#updates` aside: desktop side feed (internal scroll); mobile compact Show more |
| Four research themes + bullets/figures captions | `/research` | `#research` |
| Stable isotope lab + Raman instrument copy + STEM link | `/stable-isotope-lab`, `/raman-microscopy` | `#labs` |
| Service rates ($50 / $20 / $30) + deliverables | `/service-work` | `#services` |
| Join Us copy + Kalamazoo blurb + MLive link | `/contact` | `#join` |
| Publication list (22 items) + DOI/URL links | `/publications` | `#publications` |
| PI bio links (WMU, SwissSIMS, Marin-Carbonne, Bindeman, МГРИ) | `/team` | `#team` |

## Gaps / intentional divergences

### Information architecture

| Gap | Live | Local | Notes |
|-----|------|-------|-------|
| Nav labels | About, Team, Research, **Stable isotope lab**, **Raman microscopy**, Service work, Publications, **Join Us/Contact** | About, Research, Team, **Lab**, **Gallery**, Service, Publications, **Join** | Single-page anchors; labs merged; gallery is new |
| Multi-page vs one page | Separate Squarespace routes | One `index.html` with `#` sections | Expected for scaffold |
| Embedded map on Contact | Google Map (WMU address) | **Missing** | Re-add in Astro if desired |
| Real photographs | Squarespace CDN images | SVG placeholders (`docs/assets-todo.md`) | Explicit; captions/alt preserved |

### Team roster

| Gap | Detail |
|-----|--------|
| **Andy Smith** | In local `content/team.json` (from Aug 2025 update) but **not** listed on live `/team` |
| Live typo | Live heading **“ALMUNI”**; local uses **Alumni** |

Confirm with PI before treating Andy as public roster.

### Publications status

| Item | Live `/publications` | Local `content/publications.json` |
|------|----------------------|-----------------------------------|
| Sheik et al. (2026) Geitafell / JVGR | Text ends **“In revision.”** — **no DOI link** on that page | `status: "published"` + DOI `10.1016/j.jvolgeores.2026.108622` |

Live **Home** Lab Updates (2026 Apr) already advertises that DOI as published. Local follows the update, not the stale pubs-page status. Reconcile with PI before launch.

### Copy fixes (local ≠ live typo)

| Live | Local |
|------|-------|
| “Lake Michigan shore at **South Heaven**” | “**South Haven**” (corrected) |

### Presentation-only (not content loss)

- Live underlines lab-member names in citations; local uses asterisk note for student authors.
- Local section titles/ledes are redesign chrome (eyebrows, short ledes) — body text still from source collections.
- Hero headline/support are scaffold marketing lines; live home leads with About H3s rather than a separate hero slogan.
- ORCID on PI is `null` in `content/site.json` (not shown on live either in a prominent way).

## Link checklist (spot-checked)

- NSF award, DOIs in updates, EES seminar, Midwest Geobiology, SIMS UCLA, KBS, Dive2Ivrea, IsotopeNet, de Obeso, Blatchford, Smith Lecture, Iowa seminar, NAGT early career — present in local updates.
- Publication DOIs (19 with `doi.org` / `dx.doi.org`) + 2 non-DOI URLs (Pacific Geology PDF, Razvedka i Ohrana Nedr) — present.
- `mailto:david.zakharov@wmich.edu`, WMU geology directory, footer phone/address — present.

## Responsive screenshots

Playwright captures under `docs/screenshots/{375,768,1280}/`:

- `00-full.png` — full page
- `01-home` … `09-join` — one PNG per main section
- `375/10-mobile-menu.png` — nav dialog open

## Keyboard QA (local)

| Flow | Result |
|------|--------|
| First Tab | Lands on **Skip to content** → `#main` |
| Desktop Tab | Brand → About…Join nav → hero CTAs → in-page links |
| Show more (mobile Updates) | Focusable; Enter expands earlier updates in page flow; label → “Show less”. Desktop uses the side-feed scrollport (no toggle). |
| Show more (Publications) | Focusable on all viewports; Enter expands earlier pubs (newest 2 stay visible; rest `hidden` / `until-found`); label → “Show less”. |
| Lightbox | Gallery thumb Enter opens dialog; focus moves to Close; Escape closes and returns to thumb |
| Mobile menu (375) | Menu button Enter opens dialog; Tab walks mobile nav links; Escape closes |
| DOI links | Focusable (`a.pub-doi`); hrefs point at `doi.org` / `dx.doi.org` |

Minor: with the mobile dialog open, Tab can leave the dialog to `body` before cycling back (no hard focus trap). Acceptable for prototype; tighten in Astro if needed.

Raw machine log: `docs/qa-keyboard.json`.

## Console / images (local)

**Console:** no errors or warnings after load.  
**Images:** content images are intentional placeholders (`hero-placeholder.svg` / `media-placeholder.svg`); no broken fetches. Closed lightbox `<img id="lightbox-image">` has empty `src` by design (not painted until open).
