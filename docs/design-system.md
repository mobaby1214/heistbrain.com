# Heist marketing site — design system and brand standards

The homepage and its interactive Case File dossier are the visual north star.
Every public page extends that identity; nothing returns to the retired violet
theme or a generic SaaS look. This file is the permanent reference for anyone
styling a page in this repository. Copy rules live alongside it in the app
repo's brand material; the locked lines are repeated here so this repo is
self-sufficient.

## Tokens: the one source of colour, type, space and motion

- `css/tokens.css` is a generated copy of the app's `app/styles/tokens.css`
  (synced by `scripts/sync-tokens.js`). **Never edit it by hand, never fork a
  value.** Every colour on the site resolves to a token role.
- `css/case-file.css` is the site's shared chrome for every page except
  `index.html` (which carries the equivalent rules inline). It aliases the
  pages' legacy variable names (`--bg`, `--accent-hi`, `--text2`, …) onto token
  roles, declared on `:root, [data-theme]` so each themed subtree recomputes
  them.

## Theme scoping: parchment over the Night Job

Every page is `<body data-theme="dark">` (The Night Job: near-black burgundy
ground, parchment type, soft-rose accents) with the nav wrapped in
`<header role="banner" data-theme="light">` (The Case File: parchment, ink,
burgundy). The homepage adds light `data-theme="light"` islands for its hero
and how-strip. Use token roles inside each scope; they resolve per theme.

## Type

- One family: Schibsted Grotesk (400–900 variable). JetBrains Mono for real
  code only (`pre, code, kbd, samp` via `--font-mono`).
- Headings are heavy and tight: weight 800, tracking −0.03 to −0.035em,
  `text-wrap: balance`. The shared page-title scale is `clamp(32px, 5vw, 52px)`.
- Body copy ≥14px, line-height ~1.55–1.8, measure ≤ ~70ch. Never shrink body
  copy to fit a decorative layout. 11px is the absolute floor (labels only).

## The page hero signature

One hero per page, centred:

1. optional breadcrumb, then an eyebrow/section label (small caps, accent);
2. a single `<h1>` in the heavy style with **one emphasis phrase** in italic
   soft rose — `<span class="highlight">` or `<em>` coloured `var(--accent-hi)`;
3. a muted subtitle (`--text2`), centred, max-width ~540–620px.

Never stack a second big headline above or below the hero. The statement *is*
the title.

## Actions

- Primary: solid burgundy — `#7A1F1F` fill, white label, radius 6px, the
  parchment ring + soft shadow from `case-file.css`. Hover darkens to
  `#5E1616` and lifts 2px; active presses 1px. No gradients, no glows.
- In the light header the CTA uses `--accent-fill` / `--on-accent`.
- Secondary: text links in `--accent-hi` (dark scope) with underline on hover.
- One primary action per screen.

## Navigation and access

- Shared chrome: parchment fixed nav (`--surface-header`), wordmark at
  weight 900 with the burgundy full stop, dropdowns as raised parchment cards.
- Dropdowns open on hover **and** `:focus-within` (keyboard), with the mobile
  drawer pattern under 768px.
- Every page starts with `<a href="#main-content" class="skip-nav">` and an
  anchor after the header. Focus is always visible: `--focus-ring-color`,
  2px, offset 3px.

## Motion

Paper, folders, tabs and stamps — not floating widgets. Durations from the
tokens (150–250ms micro, 250–450ms transitions), `--ease-enter` curves, hover
lifts of 2px (cards 4–8px max), tilt ≤3°. One authored moment per page, no
scroll-jacking, no loops, and everything rests under
`prefers-reduced-motion` (enforced globally in `case-file.css`).

## Locked copy and naming (do not rewrite without owner approval)

- Hero H1 (homepage): "Your content calendar / just became one less thing to
  worry about. / Steal your time back." — one semantic H1, three visual
  groups, third group burgundy.
- Tagline is always **"Steal your time back."** — never "Steal back your time."
- Fixed lines: "Your brand. Your voice. Your rules." · "A full month of
  on-brand content in one sitting."
- Public naming: **Heist + your AI** (marketing label for the MCP/agent
  surface; the in-app screen is the review queue — explain the mapping, don't
  rename routes). **The Brain** = the brand profile. Review-first is the
  default story; Autopilot is explicit opt-in.
- Voice: short plain sentences, sentence case, contractions welcome, no
  exclamation marks, headings ≤8 words, buttons ≤4 words, no fake urgency or
  invented numbers. Heist language sparingly; never imply compromised accounts.

## Product-truth rules

- Competitor claims carry a checked date and must match current vendor
  documentation (last full re-check: November 2026 — Buffer has an MCP server
  and an AI assistant; Jasper has Brand Voice + Knowledge Base; Hootsuite has
  OwlyWriter/OwlyGPT). Prefer "Assist", "Static", "Partial" cells over a
  false ✕.
- Trial: 7 days of Pro, no card, no free in-app AI generation. The customer's
  own AI (Claude any plan, eligible paid ChatGPT, or their own API key) does
  the writing. Keep the disclosure near every trial CTA.
- External AI creates **drafts**; review-first examples never show
  auto-scheduling or auto-publishing. Free tools make no authorship-proof or
  guaranteed-outcome claims.

## Quality bar (checked before every ship)

Contrast 4.5:1 body / 3:1 large text and UI borders in both theme scopes; no
horizontal scroll at 390 (and 320); keyboard path through nav, skip link and
dropdowns; `node scripts/check-homepage.js` all green whenever `index.html`
is touched; screenshots at 1440 and 390 for changed templates.
