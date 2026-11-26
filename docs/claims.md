# Heist marketing-site claims ledger (T-12)

Reconciliation of every quantified / feature claim on heistbrain.com against what the product
actually does, verified 2026-09-06 against the production VM environment and integrations table.

**Ground-truth platform posture (verified against prod env 2026-09-06):**

| Platform | Status |
|---|---|
| Facebook, Instagram, LinkedIn, YouTube, WordPress | Live, connectable today |
| Hosted website blog (user's own domain) | Live |
| X (Twitter) | Live, but ONLY via the user's own X developer app keys on a **paid** X API tier |
| TikTok | NOT connectable (app review incomplete) — "coming soon" only |
| Pinterest, Reddit | Code shipped, NOT enabled in prod (no API env vars) — "coming soon" only |

"Six platforms" on the site now means: **Facebook, Instagram, LinkedIn, X\*, YouTube, WordPress.**

---

## 1. Feature / capability claims

| Claim | Where | Status / backing | Action taken |
|---|---|---|---|
| Six platforms from one dashboard | index.html (og:description, hero stat "6 platforms, one workflow", pricing bullets), many pages | TRUE with corrected list (FB, IG, LI, X\*, YT, WP) — verified against prod env 2026-09-06 | Count kept; every enumerated list corrected (see §2) |
| TikTok publishing / "TikTok + YouTube video upload" | index.html FAQ + JSON-LD + comparison table; changelog.html; vs pages | FALSE today — TikTok app review incomplete | Removed/softened everywhere; TikTok now "coming soon" (see §2) |
| X posting from one dashboard | platform lists | TRUE only with user's own X dev app keys on paid X API tier | Caveat added to FAQ answers, JSON-LD, llms.txt, and a footnote under every comparison table |
| Pinterest / Reddit scheduling | vs/later.html ("Heist doesn't support Pinterest") | Correct (not live); code exists but disabled in prod | Softened to "coming soon" where it read as permanent |
| Every 6 hours Heist pulls engagement data | index.html FAQ + Brain section (x2), JSON-LD | TRUE — ENGAGEMENT_SYNC_ENABLED=1 live on prod, verified 2026-09-06 | Kept |
| Auto-publish / drag-to-calendar scheduling | index.html How-It-Works, features | Live feature — verified against prod 2026-09-06 | Kept |
| Brand-brain 10-layer memory, drift detection | index.html, blog, vs pages | Live feature | Kept |
| AI image generation | index.html comparison + The Reel | Live feature | Kept |
| Faceless video (script→voice→slideshow MP4, ElevenLabs + Creatomate, own API keys) | index.html faceless section, FAQ, The Reel | Live feature, paid plans only: the trial cannot make faceless video (featureFlags.js isFacelessVideoEnabled; tierGate.js TRIAL_EXCLUDED_TOOLS). "Sized for TikTok/Reels/Shorts" is an aspect-ratio claim, not a publishing claim | Kept (sizing claims retained; TikTok *upload* claims removed). 2026-11-22: how-it-works.html faceless CTA note now says "on paid plans (not the free trial)" |
| MCP connector ("MCP · Claude" badge, Agent Inbox) | index.html hero mockup, comparison table, agent-inbox.html | Live feature | Kept |
| Blog hosting + SEO reports; blog generation on every plan + trial (connector: Pro and up + trial) | pricing.html, vs pages | Checked against app code 2026-11-22: /api/blog/generate only needs an active plan (blog.js:190); no Founder gate exists | Rule from 2026-11-22: "blog generation Founder+" is false — blog generation is on every plan |
| YouTube chunked, resumable video upload | index.html FAQ + JSON-LD | Live (YouTube) | Kept for YouTube; TikTok half removed |
| Database backed up every 6 hours, 28 rolling backups, integrity verification | index.html Trust section + FAQ; about.html ("automated backups every 6 hours") | **OWNER-VERIFY** — cannot verify from this repo | Copy left as-is; owner to confirm backup cron + retention |
| AES-256-GCM encryption, bcrypt, CSRF, soft-delete 30 days, autosave 30s, version history | index.html Trust section | Code-level claims, not re-verified here | **OWNER-VERIFY** (left as-is; consistent with app docs) |
| Prices: $19 / $49 / $99 / $199 a month; yearly $192 / $492 / $984 / $1,908 ($16 / $41 / $82 / $159 a month billed yearly, saves about 2 months) | pricing.html cards + JSON-LD; index.html offers JSON-LD + teaser chips; llms.txt; app plans.json | Checked against live Stripe prices 2026-11-22 | Rule from 2026-11-22: "Save 20%", "17%" and $15 / $39 / $79 annual figures are wrong; say "Save ~2 months" |
| Plan limits: Starter 1 brand / 100 posts / 5 campaigns / 1 GB video, no connector; Pro 1 brand / 500 posts / 20 campaigns / 10 GB / AI-chat connector; Founder 5 brands + 3 seats / unlimited posts + campaigns / approvals + roles / 50 GB; Agency 25 brands + 10 seats / unlimited / approvals + roles / 200 GB; 7-day Pro trial, no card | pricing.html cards + FAQ + JSON-LD; app plans.json; llms.txt | Checked against app code 2026-11-22 (brands.js BRAND_LIMITS, workspace.js SEAT_LIMITS, tier.js TIER_LIMITS + MCP_ALLOWED_TIERS, r2.js STORAGE_LIMITS) | Rule from 2026-11-22: card bullets must match plans.json exactly (scripts/check-plan-parity.js). Credit packs DON'T EXIST — never claim them. "Priority/Premium AI models", "advanced analytics" and export as a plan perk are false (same models and export on every plan). Agency is 25 brands, never "unlimited". "Most Popular" label → "Recommended" |
| Trial and cancellation: 7-day free trial of Pro, no card; when the trial or a paid plan ends the account locks until a plan is chosen, data is kept (sign in to download it or delete the account); a cancelled paid plan runs to the end of the period paid for | pricing.html FAQ, for/ pages, index.html + how-it-works.html + agent-inbox.html fine print | Checked against app code 2026-11-22 (tier.js getEffectiveTier) | Rule from 2026-11-22: "data deleted 30 days after cancelling" is false — never claim it; "Full Pro features" → "7-day Pro trial" (trial has no faceless video, less video storage). Fine print "Cancel anytime" → "Nothing charges when it ends" on the no-card trial CTAs of index.html, how-it-works.html and agent-inbox.html |
| "Ten minutes" / "10 minutes" / "40+ hours reclaimed per month" | index.html (title, meta, og/twitter, JSON-LD, H1, steps, hero stats, final CTA), how-it-works.html, agent-inbox.html, 404.html, llms.txt | Unbacked: no time study or customer data | Removed 2026-11-22; replaced with "one sitting". Hero stats are now "100+ tools your AI can call" and "6 platforms, one workflow". The how-it-works.html persona stats "Save 8+ hours per week" and "Ship 4x more content" went for the same reason ("Your weekends back", "One voice for the whole team") |
| AI-chat connector (MCP) availability; tool count | index.html hero + Agent Inbox teaser + pricing teaser, how-it-works.html, agent-inbox.html, llms.txt | Checked against app code 2026-11-22: connector on Pro, Founder, Agency + trial only (tier.js MCP_ALLOWED_TIERS); about 112 tools (server/lib/tools/index.js). Claude's custom connector works on any Claude plan, including Free; ChatGPT needs a paid plan with developer mode on | Corrected: "85 tools" → "100+ tools"; connector copy now names the plans; Claude "Pro/Team/Max only" was wrong |
| "Never open the app" / "You never have to open the app" | agent-inbox.html meta description, WebPage JSON-LD, hero sub | FALSE — trial accounts must open Heist once to verify their email before the chat can schedule or publish (tierGate.js TRIAL_VERIFIED_EMAIL_TOOLS), and social accounts are connected in the app | 2026-11-22: meta + JSON-LD "Connect your accounts once, then run it from chat."; hero sub "Set up once in the app (verify your email, connect your accounts); after that, the chat does the work." |
| Brain "don't" rule as a "server-side guardrail" that "refuses to ship a draft that violates it" | agent-inbox.html example card | FALSE — create_draft saves the draft and flags the violation (draftsTool.js "flag, don't block"); only edits can be rejected (update_draft with enforceVoiceRules on; bulk updates and replace_in_drafts by default) | 2026-11-22: "Drafts that use the banned word get flagged so you can fix them." |
| "First 25 posts on us" / "generated on us" | index.html hero trust strip, how-it-works.html final CTA, pricing.html note + FAQ + JSON-LD + final CTA | FALSE — Heist does not underwrite trial generations. Owner decision 2026-11-22: no platform AI key until there is revenue; the customer connects their own AI (Claude / ChatGPT connector) | Removed 2026-11-22. Homepage trust strip now reads "No API key to write, either: the trial plugs into your Claude (any plan, even Free) or a paid ChatGPT plan." The connector is on Pro, Founder, Agency and the trial; Starter writes with its own AI API key. Never promise free posts or free generations. Do not re-add unless free generations are actually switched on |
| "46% of Gen Z…" statistic | index.html (stat badge, FAQ, JSON-LD) | CONFIRMED — see §4 | Reworded to match source + inline citation added |
| Hero mockup chips: TT "Soon", YT "Soon" | index.html mockup | TT "Soon" matches ground truth (kept). YT "Soon" *understated* (YouTube is live) | 2026-11-22: YT chip shown live; TT "Soon" kept. Mockup now shows a labelled sample coaching brand in the Agent Inbox (Reject / Approve), no invented likes or comments, and carries an "Illustrative mockup" caption; Brand Score card labelled "sample" |
| Preview tab labeled "TikTok" in hero mockup | index.html:1107 | Implied live TikTok preview | Changed tab label "TikTok" → "WP" |
| "Pixel-accurate previews on … TikTok …" (The Lookout) | index.html:1490 (now how-it-works.html) | TikTok not live; previews also allow more than X (text only) and Instagram (single image) publish | List trimmed to LinkedIn, X, Instagram, Facebook, YouTube; 2026-11-22: "Pixel-accurate" dropped here and in How It Works step 03. Same reason, 2026-11-22: how-it-works.html Versus column "Platform-perfect previews, all 6 networks + video" → "Per-platform previews before anything posts", and its meta description "platform-perfect previews" → "per-platform previews" |
| Social SEO card "ranks in TikTok Search" | index.html:1558-1561 | Generation-only feature; platform not connectable | Card retitled "TikTok · Coming Soon", copy reframed as "ready for when TikTok publishing lands" |

## 2. Platform-list corrections (before → after)

Standard corrected list: **LinkedIn, X, Instagram, Facebook, YouTube, WordPress** (+ X caveat, TikTok/Pinterest/Reddit "coming soon").

| File:line (pre-edit) | Before | After |
|---|---|---|
| index.html:53 (JSON-LD FAQ) & :1758 (visible FAQ) | "LinkedIn, X (Twitter), Instagram, Facebook, TikTok, and YouTube — six platforms… TikTok and YouTube support native video uploads." | "LinkedIn, X (Twitter), Instagram, Facebook, YouTube, and WordPress — six platforms… plus a hosted blog on your own domain. YouTube supports native video uploads. X publishing connects through your own X developer app keys on a paid X API tier. TikTok, Pinterest, and Reddit are coming soon." |
| index.html:60 & :1765 (Social-SEO FAQ) | "…first sentence (LinkedIn, Instagram), spoken audio suggestions (TikTok), titles and tags (YouTube)…" | TikTok placement removed |
| index.html:63 & :1768 (video FAQ) | "upload your own videos directly to TikTok and YouTube" | "directly to YouTube … — TikTok upload is coming soon" |
| index.html:1107 | mockup preview tab "TikTok" | "WP" |
| index.html:1367 (How It Works step 02) | "across LinkedIn, X, Instagram, Facebook, TikTok, and YouTube" | "…Facebook, YouTube, and WordPress" |
| index.html:1490 (The Lookout) | previews "…Facebook, TikTok, and YouTube" | "…Facebook, and YouTube" |
| index.html:1559-1561 (SEO card) | "TikTok" card claiming current TikTok Search ranking | "TikTok · Coming Soon" card, copy reframed |
| index.html:1586 | "Same core terms on LinkedIn, Instagram, TikTok, and your blog" | "…LinkedIn, Instagram, YouTube, and your blog" |
| index.html:1624 (comparison row) | "TikTok + YouTube video upload ✓" | "YouTube video upload (TikTok soon) ✓" |
| about.html:215 | "connectors that tie Heist to six social platforms" | "six publishing platforms" (WordPress isn't social; count now matches) |
| changelog.html:183-184 | "6-platform live content previews — …YouTube, TikTok" / "Video upload support for YouTube and TikTok" | "Live content previews — Facebook, Instagram, X, LinkedIn, YouTube" / "Video upload support for YouTube (TikTok coming soon)" |
| llms.txt:7 | "Platforms supported: LinkedIn, X (Twitter), Instagram, Facebook, TikTok, YouTube" | Corrected list + X caveat + TikTok/Pinterest/Reddit coming soon |
| vs/buffer.html:40 (JSON-LD), :208, :282 | scheduling list incl. TikTok; "TikTok native video ✓ (Heist)"; "Both support … TikTok…" | list → WordPress; Heist cell → "Coming soon"; FAQ rewritten with WP + hosted blog + TikTok soon |
| vs/jasper.html:204 | "LinkedIn, X, IG, FB, TikTok, YouTube" | "LinkedIn, X, IG, FB, YouTube, WordPress" |
| vs/chatgpt.html:267 | previews "…Facebook, TikTok, and YouTube" | "…Facebook, and YouTube" |
| vs/hypefury.html:236 | "six major platforms … TikTok, and YouTube" | "…YouTube, and WordPress" |
| vs/typefully.html:224, :253, :278 | "Instagram / TikTok ✓"; lists incl. TikTok | "Instagram / Facebook / YouTube ✓"; lists → WordPress |
| vs/taplio.html:225, :236, :257, :278 | "Instagram / TikTok ✓"; lists incl. TikTok | "Instagram / Facebook / YouTube ✓"; lists → WordPress / "your blog" |
| vs/writesonic.html:236, :254, :283 | "schedules directly to … TikTok, and YouTube" (x3 variants) | "…YouTube, and WordPress" |
| vs/later.html:33 (JSON-LD), :281, :307, :309 | "across LinkedIn, X, Facebook, TikTok, and YouTube"; "TikTok hook"; "Heist doesn't support Pinterest" | TikTok dropped from list; "Reels hook"; Pinterest → "coming soon" |

Left alone deliberately: generic platform-education content (best-time-to-post/, content-ideas/, caption-examples/, hashtags/, benchmarks/, guides/, blog posts) — these discuss TikTok as a platform, not as a Heist connector; hero mockup chips (TT/YT "Soon"); agent-inbox.html example quote (asks for TikTok-tailored *text*, not publishing); for/*.html "all 6 platforms" (count matches, no enumeration).

## 3. Competitor prices — verified September 2026

All Heist-site mentions of each competitor's price were made consistent with the verified figure.
A "Competitor prices checked September 2026" note (plus the X-keys caveat) was added under the
homepage comparison table and under every /vs/* comparison table.

| Competitor | Verified price (Sep 2026) | Source (fetched) | Site said → now says |
|---|---|---|---|
| Buffer | Essentials $5/mo per channel; Team $10/mo per channel; free plan (3 ch) | https://buffer.com/pricing | "$6/mo (1 channel)", "$120/mo (Team)", "$30/mo" → "$5/mo per channel (Essentials)", "$10/mo per channel (Team)"; homepage "$30/mo (6 channels)" (6 × $5) |
| Hootsuite | Standard $99/user/mo; Professional $199; Advanced $399; Enterprise custom (no "Team" tier) | https://www.hootsuite.com/plans | "Professional $99", "Team $249", "$99-$739" → "Standard $99/mo per user", "Professional $199/mo per user", "$99-$399+" |
| Jasper | Pro $69/mo ($59 annual), only self-serve tier; Business custom; no Creator tier anymore | https://www.jasper.ai/pricing | "Creator $49/mo", "Pro $69/mo" → "Pro $69/mo (only self-serve tier)"; homepage header $49 → $69; stack math updated ($79+ → $99+) |
| Copy.ai | Chat $29/mo ($24 annual); Growth from $1,000/mo; no $49 Creator tier | https://www.copy.ai/prices | "Creator $49/mo" → "Chat $29/mo (team Growth plans from $1,000/mo)"; stack totals $99/$99-178 → $79/$79-158. Also fixed a typo that showed **Heist** Starter as $49 (it is $19 everywhere else — locked value, corrected to $19). |
| Later | Starter from $18.75/mo (price shown with annual "3 months free / 25% off"); Growth $37.50; Scale $82.50 | https://later.com/pricing/ | "$25/mo (Starter)" → "From $18.75/mo (Starter, annual billing)"; "$45/mo" stack → "≈$39-45/mo" |
| Sprout Social | Essentials $99/seat monthly ($79 annual); Standard $199/seat; Professional $299; Advanced $399; Enterprise custom | https://sproutsocial.com/pricing/ | "$249/$399/$499" → "$99 (Essentials)/$199/$299/$399"; 5-seat math $1,245 → $995; "6x" → "5x"; FAQ Advanced $499 → $399 |
| Typefully | **UNVERIFIABLE** — pricing page renders prices dynamically (fetch returned nav/footer only); third-party sources conflict | attempted https://typefully.com/pricing (2026-09-06) | "$15/mo (Pro)" → "Free tier; paid plans" (all three mentions); table note says prices are dynamic, check typefully.com |
| Hypefury | Flexible $6/mo (1 channel, +$6/extra); Full $19/mo | https://hypefury.com/pricing/ | "Starting price $19/mo" → "$6/mo (Flexible, 1 channel; Full is $19/mo)" |
| Taplio | "Plans from $39/mo" (page header; tier detail didn't render) | https://taplio.com/pricing | "$52/mo (Starter)" → "From $39/mo"; combo math $101 → $88 |
| Writesonic | Starter $79/mo (annual billing); Basic $199; Growth $399; product pivoted to AI-search visibility | https://writesonic.com/pricing | "$16/mo (Small Business)" → "$79/mo (billed annually)"; stack $66-70 → $129+; "cheaper than Heist" FAQ answer flipped to "No" |
| ChatGPT | Plus $20/mo | OpenAI official pages 403-block direct fetch; confirmed via web search of openai.com/help.openai.com results ("$20/month, billed monthly") | Site already said $20/mo — kept (consistent with verified figure) |

Not changed: Canva Pro $15/mo (vs/buffer.html) — Canva is not in the ticket's competitor list; flag **OWNER-VERIFY** if desired.

## 4. "46% of Gen Z" statistic

- **Original claim:** "In 2026, 46% of Gen Z uses social media as their primary search engine" / "46% of Gen Z searches social media instead of Google" (index.html stat badge :1552, FAQ :1764, JSON-LD :59).
- **Verification:** fetched https://searchengineland.com/social-search-gen-z-visibility-453502, which states: "46% of Gen Z and 35% of millennials prefer social media over traditional search engines" — sourced from eMarketer. (Forbes Advisor's survey reports the same 46% figure for Gen Z adults who only/primarily use social for search, but forbes.com blocks fetching, so it is not cited.)
- **Outcome: CONFIRMED, reworded to match the source.** All three occurrences now read "46% of Gen Z prefers social media over traditional search engines"; the visible stat badge and FAQ carry an inline link to the Search Engine Land article attributing eMarketer. The unverifiable framings ("primary search engine", "instead of Google") were dropped.

## 5. OWNER-VERIFY summary

1. **Backups:** "backed up every 6 hours … 28 rolling backups … integrity verification" (index.html Trust section + FAQ; about.html says "automated backups every 6 hours"). Left as-is per ticket.
2. **Security stack:** AES-256-GCM, bcrypt, CSRF-on-every-request (index.html Trust section). Left as-is.
3. **Canva Pro $15/mo** figure in vs/buffer.html (outside ticket's competitor list).
4. ~~**Hero mockup YT chip says "Soon"** although YouTube is live~~ — resolved 2026-11-22: YT chip now shown live.
5. **Buffer/Hootsuite table cells** in index.html:1624 (YouTube-upload row "Partial"/"✓") describe competitor capabilities carried over from the old TikTok+YouTube row; not independently verified.

## 6. The Case File homepage (2026-11-23)

The hero was rebuilt with approved copy (`content-generator-v3/docs/brand-messaging.md`). Claims it adds, keeps or drops:

| Claim | Where | Backing | Action |
|---|---|---|---|
| "7 days free. No credit card required." | Hero | Trial row above (app `server/routes/auth.js`: a 7-day trial on signup; trial emails say "7 days, no card") | Kept, reworded from "Free for 7 days. No card." |
| "Works with Claude (any plan) or a paid ChatGPT plan." | Hero | Connector row above: the trial is Pro, and Pro has the connector. Starter needs its own AI key | Kept as a separate line. The pricing teaser still carries the Starter caveat |
| "Approve posts every time, or set it to Autopilot. Your choice." | Dossier card "Your rules." | App `server/db.js` Autopilot defaults: `social_approval_required` 0; a topic-veto email goes out 14h ahead (`topic_veto_hours_before`); with no reply the plan goes ahead (`auto_default_on_no_response`). Blogs need approval by default | TRUE. It replaces the handoff's "before anything goes live", which is false for Autopilot accounts (owner's wording) |
| "scheduled across your channels" | Hero lede | The live platforms at the top of this file | Kept generic. The dossier's sample week schedules only LinkedIn, Instagram and Facebook; the blog appears only as planned content |
| "A full month of content … in one sitting" | Hero lede, meta description | Same promise as the 2026-11-22 "one sitting" wording | Kept |
| Dossier demo panels (brief, sample post, sample month, approval demo, sample week) | Hero | Static sample content. It calls no API and names no customer. "42 posts, 4 channels" is the sample calendar's own count | Every panel is labelled "Sample" or "Try it". The approval demo says "Nothing here posts anywhere." |
| "100+ tools your AI can call" and "6 platforms, one workflow" hero stats; the illustrative Agent Inbox mockup and its caption | Old hero | n/a | Removed with the old hero. "100+ tools" still appears in the Agent Inbox section |
| og/twitter description "AI content OS with a 10-layer Brain … six platforms" | Head | n/a | Replaced with the approved description, which has no counts |

## 7. App consistency pass (2026-11-25)

Checked against app master 1e03763a (live in production). Full audit: `content-generator-v3/audit/app-site-consistency-2026-11-25.md`.

| Claim | Where | Backing | Action |
|---|---|---|---|
| Account deletion "removes your data right away" | privacy.html, data-deletion.html, security.html | FALSE since the 7-day undo shipped: self-service delete locks the account, cancels any subscription, and purges after 7 days; signing in before then restores it (app `server/lib/accountDeletion.js` `DELETION_GRACE_DAYS = 7`, hourly purge job) | Reworded on all three pages; backups "within 30 days after that". refunds.html now says deleting cancels the subscription right away (app `lib/billing.js`), unlike cancelling |
| Button name "Delete Account" | data-deletion.html | App button is "Delete my account" under Settings → Account | Quoted the app's label |
| API-key setup: "read + draft + auto_approve is a good start" | agent-inbox.html (stdio clients) | `auto_approve` skips review (app `server/oauth/routes.js` "Skip review"); contradicts "Nothing posts until you approve" on the same page | Now "read + draft"; drafts wait in Review |
| API-key link `#settings?tab=api-keys`, "Settings → Account → Advanced" | agent-inbox.html | Dead end: Settings ignores `tab`; keys live at `#connectors` under "Advanced setup" (`?advanced=1` opens it) | Link and label corrected |
| "Start Free Trial" → `https://app.heistbrain.com` | about.html, changelog.html, blog.html, tools/hooks.html | Bare URL lands on the login page (router default `#home` → `#login` when signed out) | Now `?utm_…#signup` |
| Facebook/Instagram data-deletion callback "processed automatically" | data-deletion.html | No such endpoint in the app (only OAuth under `/api/auth/meta`) | **OWNER DECISION — not changed**: build the endpoint or drop the claim |
| Autopilot default "`social_approval_required` 0" (§6 above) | — | Stale: app PR #50 made review-first the default (`server/db.js` DEFAULT 1, no-reply default 0) | Ledger note only; site copy was already true |

## 8. App consistency pass, wording (2026-11-25)

Second half of the same audit (items #9, #11, #14, #15, #23, #25, #26, #29). Checked against app origin/master 1e03763a.

| Claim | Where | Backing | Action |
|---|---|---|---|
| Trash "recoverable for 30 days" | how-it-works.html (Vault card, Soft-delete card), pricing.html (FAQ + JSON-LD) | Trash purges after 60 days (app `server/server.js` daily job, `-60 days`); blog posts skip Trash and delete permanently after a confirm (`app/src/pages/library.js` delete dialog) | Now "60 days"; blog posts named as permanent |
| Review queue called "the Agent Inbox inside the app" | agent-inbox.html, index.html teaser ("land in your inbox"), for/ai-first-workflow.html link text | App sidebar label is **Review** (`app/index.html`); app `docs/brand-messaging.md` §6: "Review" replaces "Agent Inbox", route unchanged | Present-tense copy says Review. URLs and file names unchanged; changelog.html 2026 history entry left as written |
| Approving in the queue: "and they're live" | agent-inbox.html | Approve moves a draft from pending to draft, or to scheduled if it has a date (`server/routes/agentActions.js` header, bulk-approve dialog in `app/src/pages/agentInbox.js`) | Says it files the draft or schedules it; a draft goes live only when scheduled |
| Plan finder "Start free on this plan" | pricing.html, js/demos.js | Every signup gets the same 7-day trial (`server/routes/auth.js` sets tier `trial`); no plan param is read at signup | Button is "Start your free trial" with "Pick {plan} when it ends" note; static href now carries `utm_content=plan-finder` |
| "Every plan starts with a 7-day free trial" | pricing.html meta/og/twitter, pricing note, final CTA | `plans.json` trialNote: "Every account starts with a 7-day free trial of Pro" | Matched |
| Extra seats "contact us" | pricing.html note, for/agencies.html FAQ + JSON-LD | Self-serve: Settings → "+ Add Seats ($10/seat/mo)", Agency owners only, up to 50 total (`app/src/pages/settings.js`, `server/routes/billing.js` `/add-seats`); seat counts include the owner (`server/routes/workspace.js` `SEAT_LIMITS`) | Reworded; "including yours" in notes, FAQ and plan-finder text. Card bullets unchanged (plan parity) |
| Autosave "every 30 seconds" | how-it-works.html, pricing.html (FAQ + JSON-LD) | Saves 2 s after each edit (`app/src/pages/create.js` `setTimeout(autoSave, 2000)`) | "Drafts save automatically as you type" |
| Client share links (no expiry stated) | for/agencies.html | Links always expire: 30-day default, 7/30/90 choice, renewable (`server/routes/clientView.js` `SHARE_DEFAULT_DAYS`, `SHARE_MAX_DAYS`; Settings "Renew 30 days") | Expiry stated |
| "AES-256 encryption" (whole platform) | about.html | Only tokens, API keys and integration credentials are encrypted at rest (AES-256-GCM); same wording as security.html | Matched to security.html |
| Engagement sync "(Meta, X, LinkedIn)" | pricing.html FAQ | Sync also covers WordPress, YouTube, Pinterest and Reddit (`server/jobs/engagementSync.js` extended-platform set) | List dropped: "from your connected platforms" |
| Header CTA "Get Your Time Back →" | 132 pages' nav + `.claude/update-nav.js` template | App `docs/brand-messaging.md` header CTA: "Start free trial" (homepage already used it) | Nav CTA text only; hrefs and UTM untouched. Two in-body blog buttons not changed |
