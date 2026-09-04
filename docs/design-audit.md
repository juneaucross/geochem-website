# Design audit: David Zakharov / Near-surface Alteration & Geochemistry Group

**Purpose:** Inform a redesign inspired by Jim Watkins’ lab site (rhythm, hierarchy, one-page academic IA) without copying its Namari/template DNA.  
**Scope:** Audit + design tokens + one-page IA only — no production CSS/HTML.  
**Date:** 2026-08-07  
**Sources:** Live inspection via Chrome DevTools MCP; modern-web-guidance searches/retrieves; WMU brand color reference for affiliation (not as primary identity).

---

## Method

### Sites & pages inspected

| Site | URLs |
|------|------|
| Inspiration | https://jwatkins529.github.io/ (single-page anchors: `#banner`, `#about`, `#testimonials`, `#clients`, `#services`, `#pricing`) |
| Current David | https://www.davidzakharov.com/ + `/team`, `/research`, `/stable-isotope-lab`, `/raman-microscopy`, `/service-work`, `/publications`, `/contact` |

Viewport used for measurements: **1440×900**. Screenshots captured for hero/about/team (Watkins) and all major David routes.

### modern-web-guidance (mandatory)

Searched, then retrieved:

| Query theme | Guide IDs used |
|-------------|----------------|
| Landing / hero / LCP | `optimize-image-priority`, `performance` |
| Sticky / shrinking nav | `shrinking-header-on-scroll` |
| Scroll motion | `parallax-scroll-effects` |
| Lightbox / modal | `light-dismiss-a-dialog` |
| Responsive type | `fluid-scaling`, `visually-stable-font-fallbacks` |

**Implementation implications for the future build (not coded here):**

- Hero LCP image: `fetchpriority="high"`, never `loading="lazy"`; at most 1–2 high-priority images.
- Below-fold gallery thumbs: `loading="lazy"` only; do not also force `fetchpriority="low"` on ordinary lazy images.
- Sticky / shrinking header: prefer CSS scroll-driven animations with `@supports ((animation-timeline: scroll()) and (animation-range: 0% 100%))`; respect `prefers-reduced-motion`; animate compositor-friendly properties when possible.
- Parallax / scrollytelling: decorative only with reduced-motion opt-out; feature-detect scroll timelines.
- Gallery lightbox: native `<dialog>` + light-dismiss (`closedby="any"` where supported, click-outside fallback otherwise) — not Featherlight/jQuery Lightbox.
- Type scale: `clamp()` with container or viewport units; max ≤ 2.5× min for a11y; `font-size-adjust: from-font` on body text.
- Fluid section padding via `clamp()` / container query units rather than hard desktop-only px.

> Note: local modern-web-guidance skill version `2026_05_16-c5e7870` reports a newer patch (`…c5e78707`). Worth updating the plugin skill before implementation.

---

## 1) Inspiration to take (Watkins → David)

Borrow **structure and editorial rhythm**, not chrome.

### Rhythm

- **One continuous scroll story** with clear section beats, not eight peer “website pages” competing for attention.
- **Alternating ground planes:** white content ↔ soft secondary band (`rgb(245,245,245)` on Watkins) to mark Team / Join / location blocks.
- **Section padding ~75px** vertical inside content rows — generous academic breathing room without dashboard density.
- **Eyebrow → title → short rule → body** as a repeating section opener (e.g. `ABOUT` → “What do experimental geochemists do?”).
- **Hero as full-viewport visual plane** with brand-scale title + one supporting sentence + one primary CTA (prospective students / contact).

### Hierarchy

| Role | Watkins measured (1440×900) | Takeaway for David |
|------|-----------------------------|--------------------|
| Brand / hero H1 | Open Sans 62px / 800, ~60px line-height, `#111` | Hero must carry **lab identity** at display size (not only nav text) |
| Hero support | H2 18px / 300 | One short mission line under brand |
| Section eyebrow | H3 14px / 700, letter-spacing 2px, `#ccc` | Quiet caps labels for IA anchors |
| Section title | H2 34px / 700 | Question- or noun-led titles (“What do geochemists do?”) |
| Body / muted | ~16px / 300, muted `#9c9c9c` for intros | Separate “lede” from dense research bullets |
| Nav | 14px caps, active state as accent underline | Compact sticky nav; active = section in view |

### Section pattern (editorial, not visual clone)

1. **Hero** — field/lab photograph, group identity, CTA.  
2. **About / research pillars** — short lede + 4–6 topical tiles (icons optional; prefer real micrographs over stock glyphs).  
3. **Team** — photo grid, PI first, roles as secondary line.  
4. **Work / publications** — scannable list with PDF/DOI affordance.  
5. **Join / place** — grad recruitment + “why here” (Davis → Kalamazoo).  
6. **Gallery** — life of the lab (field + instrument + people), lightbox.

### Nav behavior to emulate (conceptually)

- Single sticky top bar with in-page anchors.  
- Utility icons for CV / email / Scholar (David: ORCID, email, dept).  
- Scroll-spy active section (Watkins uses stickyNavbar + waypoints; rebuild with Intersection Observer or scroll-driven state, not jQuery).

---

## 2) What NOT to copy

Explicit anti-clone list from Watkins live stack:

| Watkins artifact | Evidence | Why avoid |
|------------------|----------|-----------|
| **Namari template** | `css/namari-color.css`, footer “Modified from a template made by ShapingRain” | Instantly recognizable third-party look; confuses brand ownership |
| **`.page-border` frame** | Fixed top/right/bottom/left borders, `#ccc`, z-index 9999 | Dated “boxed brochure”; fights full-bleed hero and mobile |
| **Open Sans only** | Google Fonts Open Sans 300–800 sitewide | Generic academic default; Watkins fingerprint |
| **Accent `#d2b356` / `rgb(210,179,86)`** | Links, active nav, gold rules, icons | Namari signature gold — do not reuse |
| **jQuery plugin stack** | jquery 1.8.3, stickyNavbar, waypoints, enllax, featherlight, lightbox, wow, scrollUp, easing, images-loaded | Legacy, heavy, inaccessible defaults; replace with platform primitives |
| **WOW / animate.css entrance spam** | `wow fadeIn*` on borders and blocks | Motion noise; prefer intentional 2–3 scroll-linked motions |
| **Leftover Namari IA labels** | Anchors still named `#testimonials`, `#clients`, `#pricing` for Team / Pubs / Gallery | Semantic debt — name anchors for content |
| **Circular headshots + gold hairline under every card** | Team grid pattern | Fine as *idea* of portrait grid; not as identical motif |
| **UC Davis logo lockup treatment** | Left logo mark + caps nav | David needs WMU/lab identity, not a Davis clone |

David’s **current** Squarespace site is already different (Poppins, multi-page, beige content boxes `rgb(224,224,219)`, absolute non-sticky header). Do not “Namari-fy” it; use Watkins only as IA/rhythm reference.

---

## 3) Content inventory — David Zakharov (current site)

**Platform today:** Squarespace. **Type:** Poppins (300 body, 500 headings). **Header:** `position: absolute`, ~125px, transparent over heroes; **not sticky** after scroll. **Accent boxes:** `rgb(224,224,219)` / theme `hsla(60,7.5%,87%,1)`. Hero thin-section image already uses `fetchpriority="high"` + `loading="eager"` (good LCP habit to keep).

**Global nav (all pages):**  
About · Team · Research · Stable isotope lab · Raman microscopy · Service work · Publications · Join Us/Contact  

**Global footer:** Department of Geological and Environmental Sciences · WMU · Kalamazoo MI 49008-5241 · (269) 387-5486 · https://wmich.edu/geology/

### `/` — About (home)

- **Brand:** Near-surface Alteration & Geochemistry Group  
- **Page title treatment:** “About” over petrographic thin-section hero  
- **Geochemistry at WMU:** mission on fluid–rock reaction, hydrosphere–lithosphere link; crustal fluids, seawater–basalt, ancient hydrological cycle, hydrothermal systems, seawater evolution, diagenesis  
- **Meta:** Lab established ~January 2023, PI David Zakharov  
- **Media:** lab photos (Isabelle Boyer / H-isotopes; Afrid Sheik fluorinating silicates)  
- **What do geochemists do?** Archean→Holocene samples; petrography, mineralogy, field, modeling  
- **Lab Updates:** long diary (2023–2026) — grants (NSF OCE #2617725; ACS PRF), papers, AGU, seminars, student milestones  

### `/team`

- Group photo caption: “K Wings Game, Jan 2024”  
- **David Zakharov** — address; Assistant Professor (2023–); Postdoc UNIL/SwissSIMS (Marin-Carbonne); PhD Oregon (Bindeman); B.S./Diploma МГРИ-РГГРУ  
- **Afrid Abdaly Sheik** — PhD since Fall 2023; Jadavpur; hydrothermal basalts / triple O  
- **Isabelle Boyer** — MS Fall 2025; Pitt–Johnstown; serpentinites  
- **Zack Stevens** — MS thesis Ingalls Ophiolite fluids (alumni framing)  
- **Rhys Campbell** — undergrad 2024–2025  
- **Tom Howe** — Senior Specialist; Hydrogeology Field Course; technical support  
- **Evan Angeski** — undergrad summer 2023  
- *(Lab updates also mention Andy Smith MS co-supervised with Steve Kaczmarek — confirm for redesigned roster.)*

### `/research`

- Heading: “Current research and lab activities”  
- **Kola Craton Neoarchean magmatic-hydrothermal / low-δ¹⁸O** (meteoric reconstruction, zircon CA-ID-TIMS 2673.5±0.3 Ma) + figures  
- **Paleoproterozoic Snowball Earth** via triple-O of altered rocks; seawater from altered basalts  
- **Modern water–rock / Iceland & Axial Seamount** δ¹⁸O–Δ¹⁷O; ROV Jason imagery  
- **Cherts & ocean temperature** SIMS + bulk δ¹⁸O–Δ¹⁷O; seafloor-drilled cherts  
- Supporting captions: zircon SIMS maps, pillow basalts Vetreny Belt, chert thin sections  

### `/stable-isotope-lab`

- Two rooms, Haenicke Hall; **Delta V Plus**  
- Conflo IV · Isolink-OH (δD, δ¹⁸O, H₂O wt.%; USGS57/58) · Costech 4010 (CNS, dormant)  
- Dual inlet **laser fluorination** (Teledyne CO₂ laser, BrF₅, cryogenic purification) for high-precision δ¹⁷O–δ¹⁸O  
- Process / facility photos and captions live in Gallery (not on Labs copy)  

### `/raman-microscopy`

- **Renishaw InVia**, 532 nm 50 mW, motorized XY, 1800 l/mm; mineral ID/mapping in thin sections  
- STEM Workforce Collaboratory funding; campus access via REU / CURE-style projects  

### `/service-work`

- Contact: david.zakharov@wmich.edu  
- **Stable isotopes:** laser fluorination O isotopes **$50/sample**; H isotopes + H₂O wt.% Isolink-OH **$20/sample**; deliverable spreadsheet (sample#, water, δD, δ¹⁷O, δ¹⁸O ±)  
- **Raman:** mineral ID **$30/hr**; PowerPoint + spectra + marked optics; mapping up to 100×100 µm  

### `/publications`

- Note: lab members underlined; student authors `*`  
- Numbered citation list with DOIs (~20+ entries spanning 2012–2026, Nature/Geology/EPSL/Chem Geol/etc.)  

### `/contact`

- **Join Us!** undergrad/grad invitation; email David  
- Project seeds: isotope effects in alteration/diagenesis/silicification; Archean paleoclimate; surface recycling in magmas; Michigan basin / UP geology  
- **Living and working in Kalamazoo:** population, colleges, Chicago/Detroit ~2.5 h, Amtrak Wolverine, cost of living note, Lake Michigan / South Haven  
- Embedded map  

---

## 4) Proposed design tokens (unique to WMU near-surface geochem lab)

**Direction:** “Thin-section daylight” — cool petrographic neutrals + hydrothermal verdigris, with hematite used sparingly for CTA. Echo WMU brown only in affiliation chrome. **Do not** use Namari `#d2b356` or sports-bright WMU `#F1C500` as the site’s primary accent.

### Color

```text
--color-ink:            #1c2428;   /* basalt text */
--color-ink-muted:      #5c6a72;   /* secondary copy */
--color-paper:          #f3f5f4;   /* page ground (cool, not cream template) */
--color-surface:        #ffffff;   /* primary reading surface */
--color-band:           #e6ebec;   /* alternating section band */
--color-line:           #c5ced1;   /* hairlines / rules */

--color-accent:         #2a6b66;   /* verdigris — primary interactive */
--color-accent-hover:   #1f524e;
--color-accent-soft:    #d8eeeb;   /* chips, focus wash */

--color-signal:         #a84b32;   /* hematite — CTA only */
--color-signal-hover:   #8a3c28;

--color-wmu-brown:      #532e1f;   /* affiliation mark / footer only */
--color-focus:          #0b57d0;   /* a11y focus ring if needed */

--color-overlay:        rgba(28, 36, 40, 0.45); /* hero scrim for white type */
```

### Typography

Avoid Open Sans, Poppins, Inter, Roboto, Arial, system UI stacks.

```text
--font-display: "Sora", "Avenir Next", "Segoe UI", sans-serif;     /* brand / hero */
--font-body:    "Source Serif 4", "Iowan Old Style", Georgia, serif; /* long academic prose */
--font-ui:      "IBM Plex Sans", "Helvetica Neue", sans-serif;      /* nav, labels, meta */
--font-data:    "IBM Plex Mono", ui-monospace, monospace;           /* δ¹⁸O, prices, DOIs */

--font-adjust:  from-font;  /* apply via font-size-adjust on text containers */
```

### Type scale (fluid)

```text
--text-hero:    clamp(2.25rem, 1.2rem + 4vw, 3.75rem);   /* ≤2.5× min */
--text-h2:      clamp(1.5rem, 1.1rem + 1.6vw, 2.125rem);
--text-h3:      clamp(1.125rem, 1rem + 0.5vw, 1.375rem);
--text-body:    clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
--text-small:   clamp(0.8125rem, 0.8rem + 0.15vw, 0.875rem);
--text-eyebrow: 0.75rem;  /* UI caps; tracking ~0.08em — not #ccc-on-white low contrast; use --color-ink-muted */
--leading-body: 1.65;
--leading-display: 1.05;
--measure:      38rem;    /* prose column */
--measure-wide: 68rem;    /* section shell */
```

### Space & layout

```text
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 1rem;
--space-4: 1.5rem;
--space-5: 2.5rem;
--space-6: clamp(3.5rem, 3rem + 2vw, 5rem);   /* section block padding ≈ Watkins 75px spirit */
--space-hero: min(100svh, 56rem);

--nav-height: 4rem;
--nav-height-compact: 3.25rem;               /* optional shrink-on-scroll */

--radius-none: 0;     /* default: avoid cardification */
--radius-media: 0;    /* full-bleed / flush media preferred */
--radius-control: 0.25rem; /* buttons/inputs only */
```

### Motion (intentional budget: 2–3)

1. Sticky nav compact + hairline shadow over first ~120px scroll (scroll-driven, reduced-motion → static compact).  
2. Section eyebrow/title fade-up once via view timeline (or none if reduced-motion).  
3. Gallery: dialog open/close opacity only — no parallax on LCP hero.

### Imagery rules (CWV)

- One full-bleed hero `<img>` (or CSS `image-set`) with `fetchpriority="high"`, explicit width/height.  
- Thin-section / instrument photos as real visual anchors (already strong on David).  
- Gallery thumbs lazy; lightbox full-res on demand.  
- No decorative gradient substituting for photography.

---

## 5) One-page IA map

Collapse the eight Squarespace routes into **one scrolling lab site** with deep links. Keep multi-page URLs as redirects to anchors if SEO/bookmarks matter.

```text
#top / #home          Hero
#about                Mission + “what geochemists do”
#research             Research themes (Kola, Snowball, modern vents, cherts, Michigan)
#labs                 Stable isotope lab + Raman (tabs or stacked subsections)
#services             Rates / deliverables (compact)
#team                 People (+ alumni)
#publications         Citation list (filter by year optional later)
#updates              Lab diary (collapsible / “latest 5” + archive)
#gallery              Field · lab · life
#join                 Recruit + Kalamazoo + contact
```

### Suggested first viewport (composition rules)

- Brand name at hero scale (not only nav).  
- One headline, one supporting sentence, one CTA group (“Join the lab” / “Lab services”).  
- One dominant full-bleed image (thin section, Haenicke instruments, or field).  
- No stats strip, no card grid, no floating badges on the hero.

### Anchor ↔ current content mapping

| New section | Absorbs from |
|-------------|--------------|
| `#about` | `/` Geochemistry at WMU + methods blurb |
| `#research` | `/research` themes + key figures |
| `#labs` | `/stable-isotope-lab` + `/raman-microscopy` |
| `#services` | `/service-work` |
| `#team` | `/team` |
| `#publications` | `/publications` |
| `#updates` | `/` Lab Updates |
| `#gallery` | curated from lab/field photos across pages |
| `#join` | `/contact` |

### Nav labels (proposed)

`About` · `Research` · `Lab` · `Team` · `Publications` · `Join`  
(Services can live under Labs; Updates under About or footer.)

---

## 6) Gap summary (current David vs target)

| Dimension | Current David | Watkins inspiration | Redesign target |
|-----------|---------------|---------------------|-----------------|
| IA | Multi-page Squarespace | One-page anchors | One-page with redirects |
| Brand in hero | Site title in nav; “About” as page word | Huge group identity H1 | Brand-first hero |
| Nav | Absolute, wraps to 2 rows, not sticky | Sticky caps + icons | Sticky single row + compact mobile |
| Accent | Near-monochrome + beige boxes | Namari gold | Verdigris/hematite tokens above |
| Type | Poppins only | Open Sans only | Display + serif body + UI sans |
| Motion | Minimal | WOW + parallax plugins | 2–3 modern scroll/dialog motions |
| Gallery | Scattered images | Featherlight gallery | Native dialog lightbox |
| Services/labs | Strong unique content | N/A | Keep & elevate — differentiator vs Watkins |

---

## 7) Out of scope (explicit)

- Production HTML/CSS/JS for the site  
- Squarespace theme edits  
- Copy rewriting (inventory only; diary may need editorial trim later)  
- Implementing WMU logo lockups beyond token nod to `#532e1f`

---

*Measurements file companion: `docs/audit-data/david-content-inventory.json` (HTML parses). Live computed styles recorded during MCP sessions 2026-08-07.*
