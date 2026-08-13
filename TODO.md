# v2 — what's left

The site is built and live-ready. Everything below is content only — no code work
is blocked on you, but these placeholders should not stay up for long.

Search the codebase for `TODO(Sachin)` to find each one in place.

## Blocking — replace before sharing the link widely

| # | Where | What's needed |
|---|---|---|
| 1 | `index.html` — Projects | Real StaplerLabs products. Right now it shows the old NGO and Eysonic projects. Each needs: name, market, one-line description, stack, live URL, one outcome metric. |
| 2 | `index.html` — Project links | Two links point at `#contact` as placeholders (marked `data-todo`). Real URLs or remove the buttons. |
| 3 | `index.html` — Experience → Director | StaplerLabs founded date, team size, and one public metric. |
| 4 | `index.html` — Hackathons | Two of your three placements are missing. Event, year, result, what you built. |
| 5 | `index.html` — Hackathons | The Paytm event name, date, and whether you mentored or judged. Plus total events mentored. |
| 6 | `index.html` — form `data-endpoint` | Empty. The form currently falls back to opening the visitor's mail client, which works but loses you the lead if they have no mail app configured. Add a Formspree ID or a Vercel function URL. |
| 7 | `asset/Images/og-card.png` | **Does not exist yet.** Referenced by the Open Graph tags. Until it's added, LinkedIn and WhatsApp previews show a broken image. 1200×630. |

## Should fix soon

- **Proof-wall alt text** — I wrote plausible descriptions for all 10 images without having
  seen them. Correct any that are wrong; they're read aloud by screen readers.
- **Samsung R&D** — removed from the site entirely. v1 claimed it in the timeline and meta
  tags with no matching experience entry. If it's real, send details and it goes back in.
- **React** — removed from the meta keywords, since the skills list never supported it.
  Add it back if you actually know it.
- **Booking link** — the 1:1 session booking from v1 is not in v2. It pointed at a malformed
  URL. Send a Cal.com or Calendly link and I'll add the section back.
- **`asset/Images/Website/`** — 3.3 MB, still unreferenced. If these are project screenshots
  they belong in Projects; otherwise they can be deleted.

## Done in this build

- Rebuilt `index.html`, `asset/CSS/main.css`, `asset/JS/main.js` from scratch
- Deleted `reference_style.css` (68 KB, unlinked), old `style.css` and `script.js`
- Removed the Chart.js CDN tag — it was render-blocking and its chart no longer existed
- Fixed the `<div id="bg-canvas">` / `getContext` crash that killed three features on every load
- Compressed images: **6.11 MB saved** (`robingautam.in.png` alone went 4.9 MB → 590 KB)
- Every image now has `loading="lazy"`, `decoding="async"`, explicit dimensions and alt text
- Added Open Graph, Twitter Card, canonical URL and JSON-LD structured data
- Replaced all 30+ emoji and the heavy PNG icons with inline SVG
- Full `prefers-reduced-motion` support; keyboard-accessible throughout; visible focus rings
- Light default with a dark theme that respects OS preference and remembers your choice
