# Patriot's Plumbing — Design Brief & Visual System

**Client:** Patriot's Plumbing (thepatriotsplumber.com) — Master Plumber, veteran family,
serving the I-81 corridor of Southwest Virginia (Abingdon, Bristol, Emory, Meadowview,
Glade Spring, Damascus, Saltville, Marion, Atkins, Wytheville + surrounding communities).

**The page's single job:** turn a visitor with a plumbing problem into a lead in under a
minute — either a phone call or a photo-backed service request. Secondary job: earn trust
(Master Plumber, guaranteed work, local, veteran family).

## Direction: "Dispatch-first"

Most contractor sites are brochures with a buried contact page. This site behaves like a
service desk: the hero's primary object is the request panel itself. Describe the problem,
add photos, leave a name and number — done. The brand story (eagle, stripes, the owner's
story) wraps around that transaction instead of replacing it.

Rejected approaches: (1) classic template hero + 3 columns — reads templated;
(2) editorial "craft" site — beautiful but buries the lead-gen job.

## Tokens

### Color
| Token | Hex | Use |
|---|---|---|
| `--navy-950` | `#0A1428` | dark section base |
| `--navy-900` | `#0F1D3A` | dark panels |
| `--navy` | `#14294A` | brand navy (from logo) |
| `--navy-700` | `#1E3A66` | hover/borders on dark |
| `--red` | `#C02D40` | brand red — CTAs only |
| `--red-700` | `#A82234` | CTA hover |
| `--gold` | `#F5C236` | star accents only (from talons) |
| `--steel` | `#B9C4CD` | metal details, muted text on dark |
| `--porcelain` | `#F4F7FB` | light page base (cold porcelain, not cream) |
| `--ink` | `#101B31` | text on light |

Porcelain white was chosen deliberately: it's the material of the trade (tile, fixtures)
and avoids the warm-cream default. Gold is rationed to star glyphs.

### Type
- **Display:** Barlow Condensed 600/700 — American signage/shop-sign energy, tall caps.
- **Body/UI:** Barlow 400/500/600 — same superfamily, built to pair.
- Labels/eyebrows: Barlow 600, 12–13px, +8% tracking, uppercase.

### Signature element — the service stripes
A red/white stripe ribbon derived from the eagle's wing feathers. Used exactly three ways:
1. Angled stripe band as the section divider between light sections,
2. The top edge of the lead-form card ("service ticket" feel),
3. The chat launcher/panel header.
Star bullets (★, gold on navy / navy on light) replace generic list dots — content-true
to the flag identity.

### Motion
One orchestrated hero entrance (headline rise + form card lift, ~450ms, staggered),
scroll-reveals on section headers only, chat panel slide. `prefers-reduced-motion`
collapses all of it to opacity.

## Voice
Plain, confident, veteran-owned pride without kitsch. No exclamation marks except the
logo's own tagline. No invented claims: no "24/7", no fabricated reviews, no license
numbers we can't verify. The chat assistant identifies itself as a virtual assistant,
never quotes prices, and treats gas/sewage/burst-pipe questions as safety triage first.

## Information architecture (single page)
Header (logo, phone, nav, Request Service) → Dispatch hero (headline + trust chips +
lead form card) → Emergency strip → Services (6) → Why Patriot's (their real pillars) →
Our Work (3 real projects) → About (the owner's real story) + service area →
Financing (Hearth) → Footer (NAP, Facebook, email).
Chat: bottom-right "Ask a plumber" launcher.

## Lead form (the centerpiece)
3 steps, 2 required fields total (name + phone):
1. What's going on? — six tappable chips + optional detail text
2. Photos (optional, ≤6, client-side compressed to ~1600px JPEG)
3. Name + phone (+ optional address, timing chips)
Honeypot + minimum-fill-time anti-spam. Success state sets callback expectation and
repeats the phone number as fallback.

## System architecture
- **Site:** static, hand-written HTML/CSS/JS on GitHub Pages (this repo).
- **API:** Node/Express on Render (separate repo `patriots-plumbing-api`):
  `POST /api/chat` (SSE stream, claude-sonnet-5), `POST /api/lead` (multipart → Postgres),
  `GET /leads` (key-protected dashboard for the plumber), `GET /api/health` (warm-up ping).
- **DB:** Render Postgres; photos stored as bytea (small volume, zero extra services).
- Free-tier note: Render free instances sleep; the site pings `/api/health` on load to
  warm it. Production upgrade path: Render Starter ($7/mo) = always-on.
