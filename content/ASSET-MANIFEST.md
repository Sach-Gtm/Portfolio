# Asset Manifest

Inventory of every file in `asset/`, captured before the v1 → v2 redesign so nothing is lost or accidentally shipped again at full size.

Source commit: `651e96c`. Total `asset/` size: **14 MB**. Images loaded on first paint in v1: **9.17 MB across 59 `<img>` tags**, none lazy-loaded.

---

## Keep — actively used

| File | Size | Used for | Action for v2 |
|---|---|---|---|
| `Images/profile/hero.jpeg` | 114 KB | Hero portrait | Convert to WebP, serve 2 sizes |
| `Images/profile/BANNER.JPEG` | ~30 KB | Light-theme hero background | Re-evaluate in new design |
| `Images/logos/logo.png` | — | Navbar logo + favicon | Export a proper `.ico` + 180px apple-touch |
| `Images/logos/lightmode.png` | — | Theme toggle icon | Replace with inline SVG |
| `Images/Education/mait.png` | 153 KB | MAIT logo | Compress hard — it's a small logo |
| `Images/Education/dseu.png` | ~35 KB | DSEU logo | Compress |
| `Images/Certificates/sql.png` | 320 KB | Cert image | WebP |
| `Images/Certificates/js.png` | 322 KB | Cert image | WebP |
| `Images/Certificates/english.png` | ~90 KB | Cert image | WebP |
| `Images/Certificates/nss.png` | 129 KB | Cert image | WebP |
| `Images/Certificates/Certificates banner.png` | **814 KB** | Cert section banner | Compress + **rename** (space in filename) |
| `Images/Impact/1–10.jpg` | 1.7 MB total | Wall of Proof | WebP + lazy-load + add alt captions |
| `Images/IoT/1.jpg` | 109 KB | IoT banner | WebP |
| `Images/projects/eysonic.jpg` | ~80 KB | Eysonic project | v1 pointed at wrong path (`IoT/eysonic.jpg`) — fix |
| `Images/projects/ngo/dekstop.jpg` | 190 KB | NGO project / Web banner | WebP + **rename** (typo: `dekstop` → `desktop`) |
| `Sachin Resume All.pdf` | 701 KB | Resume download | Compress; consider `resume.pdf` as filename |

## Oversized — must be fixed before v2 ships

| File | Size | Problem |
|---|---|---|
| `Images/session/robingautam.in.png` | **4.9 MB** | Single largest asset on the site, for a banner image. Must go under 150 KB. |
| `Images/Certificates/Certificates banner.png` | 814 KB | Decorative banner |
| `Images/logos/x.png` | **201 KB** | This is a social icon. Should be an inline SVG (~1 KB). |
| `Images/logos/linkedin.png` | **192 KB** | Same — inline SVG. |
| `Images/logos/git.png` | — | Same — inline SVG. |
| `Images/logos/mail.png` | — | Same — inline SVG. |
| `Images/Impact/1.jpg` | 428 KB | Largest impact image |

> Replacing the 4 social PNGs with inline SVGs alone removes ~500 KB and one round of requests.

## Unreferenced — nothing in v1 links to these

Decide per item: reuse in v2, or delete.

| File / folder | Size | Note |
|---|---|---|
| `Images/Website/1–5.jpg` | **3.3 MB** | 5 images, referenced nowhere in HTML, CSS, or JS. Likely intended as web-project screenshots — **confirm before deleting**, these may be the missing project shots. |
| `Images/projects/ngo/mobile.jpg` | ~80 KB | NGO mobile screenshot — good candidate to actually use in v2 |
| `Images/logos/unicorn.png` | — | Unicorn Denmart — should be used on the experience card |
| `Images/logos/darsa.png` | — | Darsa AI — should be used on the experience card |
| `Images/logos/airport.png` | — | AAI — should be used on the experience card |
| `Images/logos/ecell.png` | — | E-Cell — should be used on the achievement card |
| `Images/logos/placement.png` | — | Placement Cell — should be used on the achievement card |
| `Images/logos/magma.png` | — | Unidentified — confirm what this is |
| `Images/logos/consult.png` | — | Unidentified — confirm what this is |
| `Images/logos/darkmode.png` | **MISSING** | Referenced by `script.js:61` but does not exist — light-theme toggle icon breaks |

## Non-asset files to remove in v2

| File | Size | Note |
|---|---|---|
| `reference_style.css` | 68 KB | Compiled Tailwind, committed but linked from nowhere |
| Chart.js CDN tag (`index.html:13`) | ~200 KB | Render-blocking; the chart it powered was removed |

---

## v2 image checklist

- [ ] Convert all photos/screenshots to WebP (AVIF optional), keep JPEG/PNG fallback only if needed
- [ ] Every `<img>` gets `loading="lazy"` (except the hero), `decoding="async"`, and explicit `width`/`height`
- [ ] Replace all social/UI icon PNGs with inline SVG
- [ ] Add meaningful `alt` text to every image — all 20 impact-wall images had none in v1
- [ ] Add an Open Graph share image (1200×630) — v1 had no OG tags at all
- [ ] Rename `Certificates banner.png` (space) and `dekstop.jpg` (typo)
- [ ] Target: **under 1 MB total on first paint** (down from 9.17 MB)
