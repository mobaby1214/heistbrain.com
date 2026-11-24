# Site refinement — baseline audit and backlog

Baseline established November 24, 2026 against the live site and this
repository, per `HEIST-WEBSITE-REFINEMENT-HANDOFF.md`. The handoff's findings
were written against stale November 23 captures; this records what was already
resolved, what this phase changed, and what remains.

## Route inventory (by template)

| Template | Routes | State |
|---|---|---|
| Homepage | `/` | Locked hero + interactive dossier live (PR #3–#5); Case File light/dark scoping |
| Page hero + sections | `about`, `changelog`, `blog.html` | Case File (PR #6) |
| Statement hero | `how-it-works`, `pricing` | Case File + single signature hero |
| AI integration | `agent-inbox.html` | Case File; public label now "Heist + your AI" |
| Legal | `privacy`, `terms`, `security`, `refunds`, `data-deletion` | Case File, simple nav, wrap-safe at 390 |
| 404 | `404.html` | Case File, recovery links |
| Generated families | `benchmarks/*` (16), `best-time-to-post/*` (7), `caption-examples/*` (7), `content-ideas/*` (7), `for/*` (12), `guides/*` (5), `hashtags/*` (31), `tools/*` (16), `vs/*` (12), `templates/`, `glossary/`, `quiz/`, `resources/` | Case File (PR #6), shared chrome via `css/case-file.css` |
| Blog posts | `blog/*` (10 + 3 redirect stubs) | Case File (PR #6); app-rendered `/blog` handled in the app repo (separate session) |

## Already resolved before this phase (handoff findings vs reality)

- The violet theme is fully retired; all 137 subpages are on the Case File
  tokens with light header / Night Job body scoping (PR #6, Nov 24).
- The locked homepage hero copy, three-group H1, CTAs, trial line,
  compatibility line, dossier copy, stamp and four interactive cards are
  already live — the handoff's "current" screenshots were the Nov 23 baseline.
- "How the job goes down." already uses Give us the brief / Approve the month /
  Walk away.
- Contrast (4.5:1 / 3:1) and 390px overflow were scanned across all 137 pages
  and pass; the homepage guard (`scripts/check-homepage.js`, 174 checks)
  passes.

## Changed in this phase (branch `claude/site-refinement-phase1`)

- **Tagline standardized** site-wide: "Steal your time back." (132 files had
  the reversed form).
- **Homepage manifesto** softened from crime-heavy copy to "You started a
  business. / Not a content factory." (locked hero untouched).
- **"Heist + your AI"** is the public label for the MCP surface (homepage
  section label, agent-inbox title/meta/JSON-LD/H1/intro, cross-page links);
  the in-app Agent Inbox name is explained as the review queue, routes
  unchanged.
- **Competitor truth pass** (vendor docs checked Nov 2026): pricing comparison
  cells corrected — Buffer has an MCP server (✓) and AI assist; Jasper has
  Brand Voice + Knowledge Base ("Static" brand memory, Claude connector);
  Hootsuite has OwlyWriter/OwlyGPT ("Assist", "Voice only", "Chat only") —
  with a legend and re-check date. `vs/jasper` memory paragraph rewritten to
  the honest differentiator (no performance learning) with plan limits.
- **Review-first accuracy**: the one auto-scheduling example ("schedule it for
  Tuesday") now saves a draft; agent-inbox metas no longer promise
  publish-from-chat without review.
- **AI Content Detector** reframed as a style check (no authorship-proof
  claims; score is "AI-style score", verdicts pattern-based; limitation stated;
  URL and SEO keyword kept).
- **Keyboard access**: dropdown menus open on `:focus-within` everywhere
  (including the homepage); every subpage now has a skip-to-content link and
  anchor (135 added).
- **Docs**: `docs/design-system.md` is the permanent design/brand/truth
  standard; DEPLOY-GUIDE points to it.

## Deferred backlog (priority order, from the handoff)

P1 interactive program (each is its own buildable unit, fixtures only):
1. How-it-works four-stage case-file explorer (tabs + layered paper preview).
2. The Brain notebook (voice/audience selector → prewritten side-by-side
   captions).
3. Industry sample calendars on `for/*` (one reusable template, 3–5 posts).
4. "Heist + your AI" conversation-to-calendar demo (preset prompts → staged
   drafts).
5. Pricing plan finder + time-value calculator (needs verified entitlement
   data; formula specified in the handoff).

P2: free-tools shared shell + consent-based result transfer (backend work —
scope separately); resources goal-based filtering; comparisons workflow
explorer; About founder notebook (**needs real founder material from the
owner**); security permission explainer; help-center search.

Owner decisions needed:
- Pricing H1: keep "Pricing this good? It's a steal." or the handoff's
  suggested "More time. Less busywork."
- Annual billing amounts on /pricing vs actual checkout config (audit observed
  $192/$492/$984/$1,908 — needs verification against Stripe before display).
- Real founder bios/photos for About; trial-expiry scheduling behaviour wording
  for pricing FAQ (needs app-side confirmation).
