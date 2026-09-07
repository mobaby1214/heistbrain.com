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
| Faceless video (script→voice→slideshow MP4, ElevenLabs + Creatomate, own API keys) | index.html faceless section, FAQ, The Reel | Live feature. "Sized for TikTok/Reels/Shorts" is an aspect-ratio claim, not a publishing claim | Kept (sizing claims retained; TikTok *upload* claims removed) |
| MCP connector ("MCP · Claude" badge, Agent Inbox) | index.html hero mockup, comparison table, agent-inbox.html | Live feature | Kept |
| Blog hosting + SEO reports; blog generation on Founder+ | index.html, vs pages | Live feature | Kept |
| YouTube chunked, resumable video upload | index.html FAQ + JSON-LD | Live (YouTube) | Kept for YouTube; TikTok half removed |
| Database backed up every 6 hours, 28 rolling backups, integrity verification | index.html Trust section + FAQ; about.html ("automated backups every 6 hours") | **OWNER-VERIFY** — cannot verify from this repo | Copy left as-is; owner to confirm backup cron + retention |
| AES-256-GCM encryption, bcrypt, CSRF, soft-delete 30 days, autosave 30s, version history | index.html Trust section | Code-level claims, not re-verified here | **OWNER-VERIFY** (left as-is; consistent with app docs) |
| 25 Brand Brains / 10 team seats (Agency), 100/500/unlimited posts, credit packs $9/50 posts, 7-day trial, first 25 posts free | index.html pricing/FAQ | Heist's own pricing & plan features — LOCKED per ticket | Untouched |
| "46% of Gen Z…" statistic | index.html (stat badge, FAQ, JSON-LD) | CONFIRMED — see §4 | Reworded to match source + inline citation added |
| Hero mockup chips: TT "Soon", YT "Soon" | index.html mockup | TT "Soon" matches ground truth (kept). YT "Soon" *understates* (YouTube is live) but chips were to be left alone per ticket | Left as-is except preview tab (below) |
| Preview tab labeled "TikTok" in hero mockup | index.html:1107 | Implied live TikTok preview | Changed tab label "TikTok" → "WP" |
| "Pixel-accurate previews on … TikTok …" (The Lookout) | index.html:1490 | TikTok not live | List trimmed to LinkedIn, X, Instagram, Facebook, YouTube |
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
4. **Hero mockup YT chip says "Soon"** although YouTube is live — chips left alone per ticket; owner may want to un-"Soon" it.
5. **Buffer/Hootsuite table cells** in index.html:1624 (YouTube-upload row "Partial"/"✓") describe competitor capabilities carried over from the old TikTok+YouTube row; not independently verified.
