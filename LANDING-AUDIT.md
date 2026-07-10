# Landing Page Funnel Audit — 2026-07-10

Session C of the post-B1 conversion work. Scope: audit + wire the heistbrain.com → app.heistbrain.com funnel (no redesign). App-side context: the app ships GA4 funnel events on the **same** property (`G-C4JK66ZQ43`) — `signup_completed`, per-route `page_view`, `draft_batch_generated` — so landing and app now stitch into one funnel.

---

## 1. UTM-tagged signup CTAs (CHANGED — index.html)

All **12** links to `app.heistbrain.com/#signup` on index.html now carry
`?utm_source=landing&utm_medium=cta&utm_content=<cta-id>` **before** the `#signup` fragment, plus a `data-cta` attribute:

| cta-id | Location | CTA text |
|---|---|---|
| `nav` | Sticky nav | Get Your Time Back → |
| `hero` | Hero | Generate Your First Month Free → |
| `brain-section` | 10-layer Brain section | Set Up Your Brain Free |
| `faceless-video` | Faceless video spotlight | Make your first video free |
| `comparison-table` | Versus/comparison table | Start Your Free Trial |
| `pricing-starter` | Pricing — Starter card | Start Free Trial |
| `pricing-pro` | Pricing — Pro card | Start Free Trial |
| `pricing-founder` | Pricing — Founder card | Start Free Trial |
| `pricing-agency` | Pricing — Agency card | Start Free Trial |
| `final-cta` | Final CTA section | Get Started Free |
| `exit-popup` | Exit-intent popup | Get Started Free |
| `mobile-sticky` | Mobile sticky bar | Try Heist Free |

The existing `sign_up_started` click handler now also sends **`cta_id`** (from `data-cta`, falling back to the old `cta_location` heuristic on pages without the attribute).

**Router verification (done, live):** the app's hash router (`app/src/router.js:59`) reads only `location.hash` and even strips `?` inside the hash. Tested live: `https://app.heistbrain.com/?utm_source=landing&utm_medium=cta&utm_content=test#signup` mounts the signup page with `location.search` fully intact — GA4 on the app side picks up the UTM params for session attribution. Query-before-hash order verified on all 12 links (query after `#` would have been swallowed by the fragment).

**Local click test (done):** clicking the hero CTA on the served page pushed
`sign_up_started { cta_text, cta_id: "hero", cta_location: "hero", page_path: "/", destination: "signup" }` to the dataLayer. No console errors.

**Left untagged (intentional):** the 3 `#login` links (returning users, not signup funnel), and app links on the other 136 pages (blog/tools/vs — see follow-ups).

## 2. Email capture / Formspree (NO CHANGE NEEDED — report)

- **index.html has no email-capture form at all.** The "FINAL CTA + EMAIL CAPTURE" section (`#cta-form-wrap`) contains only a direct signup CTA — the Formspree form DEPLOY-GUIDE.md references was already removed at some point. Nothing is silently broken.
- **DEPLOY-GUIDE.md is stale**: steps 18–28 and the checklist items about replacing `YOUR_FORM_ID` in index.html no longer apply. Left as-is (docs cleanup, not funnel).
- **blog.html newsletter form is live** with a real Formspree endpoint (`https://formspree.io/f/xwvragzl`) — not a placeholder.

## 3. GA4 coverage (CHANGED — 5 pages)

Grep for `G-C4JK66ZQ43` across all HTML pages:

- **Before: 132 / 137** pages
- **After: 137 / 137** pages

The exact deferred-load snippet from index.html was added to the 5 missing pages:
`blog/closed-loop.html`, `blog/heist-brain-setup-guide.html`, `privacy.html`, `terms.html`, `data-deletion.html`. The two blog posts are real organic entry points (the setup guide especially); the legal pages matter for referral-path completeness. Verified locally: `gtag` defined, dataLayer populating, no console errors.

## 4. Conversion copy audit (REPORT ONLY — no rewrites made)

Compared against the actual day-0 experience: until the trial-free-generations flag flips on (`TRIAL_FREE_GENERATIONS_ENABLED`, ~25 free generations via OpenRouter free models, being built in Session A), a trial user without their own API key gets **no real generations** (batch generation errors/stubs).

**Mismatches, worst first:**

1. **Hero: "Generate Your First Month Free →"** — the single biggest promise on the page, and it is *false today* for a keyless trial user. Becomes true (bounded at ~25 posts) once free generations ship. Highest-traffic CTA (`cta_id=hero` will now measure it).
2. **Hero H1 + final CTA: "A month of content. Ten minutes." / "Schedule your month of content in 10 minutes"** — same dependency; day-0 keyless users can complete Brain setup in ~10 min but cannot produce the month of content.
3. **FAQ "Can I try it before I pay?": "7-day free trial with full Pro features"** — full Pro *features* are accessible, but the core feature (generation) produces nothing real without a key today. Also repeated in the pricing note ("All plans include a 7-day free trial of Pro").
4. **FAQ "What happens after my trial ends?": "You'll be moved to the Starter plan. No surprise charges."** — the app's router (router.js:96-108) hard-locks expired trials without Stripe to the `#upgrade` page. Users are not moved to a working Starter plan; they're locked out until they pay. This one is app-behavior vs. copy, not free-generations-dependent — worth fixing regardless.
5. **Faceless video: "Make your first video free"** — video generation requires the user's own ElevenLabs + Creatomate keys (disclosed in small text beside the CTA, and in the FAQ). "Free" here means "no Heist charge," not "works out of the box." Not covered by the OpenRouter free-generations work (text only).
6. **Minor:** "Smart Onboarding — Scan your URL, AI fills all 7 profile fields" also depends on an AI provider being available day-0; verify it rides the free-generation path once Session A lands.

**Recommended alignment pass (one pass, two states):**

- **Now (before the flag flips):** soften generation promises to what setup delivers — hero CTA "Start Your Free Trial →", keep "Set Up Your Brain Free" (true today) as the supporting promise. Fix FAQ #4's trial-end answer to match the actual upgrade-lockout behavior (or change the app behavior).
- **After the flag flips (preferred — hold the copy pass until then if it's days away):** keep "Generate Your First Month Free" and make it concrete/credible: back it with the real number ("Your first 25 posts are on us — no card, no API key"), and add the same free-generation proof point to the pricing note and trial FAQ. Reword the faceless-video CTA to "Make your first video — bring your own voice keys" or move the BYO-keys disclosure into the button's subtext.

## 5. Follow-ups (out of scope here)

- **Verify the stitch in GA4 DebugView after deploy:** landing `sign_up_started` (with `cta_id`) → app `page_view (signup)` → `signup_completed`, and session attribution showing `utm_source=landing` / `utm_content=<cta-id>`. Needs the deployed site; couldn't be exercised from local.
- Register `cta_id` (and `cta_location`) as custom dimensions in GA4 admin so they're usable in funnel reports, not just DebugView.
- UTM-tag the app CTAs on the other 136 pages (blog posts, tools, vs, for) — they already fire `sign_up_started` with a `cta_location` heuristic but carry no UTMs; a `utm_content=<page>-<location>` scheme would extend CTA-level attribution to the SEO surface.
- DEPLOY-GUIDE.md cleanup: remove the stale Formspree/index.html instructions.

## Changes in this commit

- `index.html` — 12 signup CTAs UTM-tagged + `data-cta`; `sign_up_started` handler sends `cta_id`.
- `blog/closed-loop.html`, `blog/heist-brain-setup-guide.html`, `privacy.html`, `terms.html`, `data-deletion.html` — standard GA4 snippet added (137/137 coverage).
- `LANDING-AUDIT.md` — this report.
