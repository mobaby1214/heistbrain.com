# Directory and roundup listing drafts

**Status:** drafts only. Nothing has been submitted, emailed or posted. The owner reviews and sends.
**Requirements checked:** 27 November 2026, on the sources linked in each section.
**Heist facts:** kept within `docs/claims.md`. No platform list appears here: only Facebook and LinkedIn personal publishing were re-verified end to end in the 2026-11-26 social audit, so platform lists wait until publishing is re-verified.

## Plan eligibility (use this wording in every listing, doc page and note)

> Heist + your AI (the MCP connector) is included on Pro, Founder and Agency, and in the 7-day free trial. Starter writes with your own AI API key instead. In Claude it works on any Claude plan, including Free. In ChatGPT it needs a paid plan with developer mode on. Your AI provider's plans and charges apply. Heist adds no separate fee for writing from your chat.

Short form (for fields with tight limits): *Connector on Heist Pro, Founder, Agency and the trial (Starter uses an API key). Claude: any plan. ChatGPT: paid plan with developer mode. Provider plans and charges apply.*

**Owner check before sending anything about ChatGPT:** OpenAI's help article "Developer mode, apps and full MCP connectors in ChatGPT" (https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt), as read on 2026-11-27, says full MCP with write actions is for Business, Enterprise and Edu, that Pro gets read/fetch only, and it doesn't mention Plus. The site and this file say "a paid plan with developer mode". Test the Heist connector's write tools (create a draft, schedule a draft) on a Plus and a Pro account. If writes fail there, change the wording here and on the site to "ChatGPT Business, Enterprise or Edu (other paid plans: read-only)" or whatever the test shows.

## Readiness gaps found while drafting (fix before submitting to either directory)

| Gap | Affects | What it means |
|---|---|---|
| No tool annotations. The app's MCP tools set no `readOnlyHint`, `destructiveHint` or `openWorldHint` (a `git grep` of app `origin/master` 10b825e8 finds none) | Claude and ChatGPT | Both directories require them on every tool. Anthropic's review criteria also need a `title` on each tool and errors that say what went wrong |
| AI image, video and audio tools (`generate_image`, `generate_video`, `generate_faceless_video`, `generate_voiceover`, `compose_video` and similar) | Claude | Anthropic's directory does not accept connectors that "generate images, video, or audio through AI models" (review criteria; Software Directory Policy §4B). Postiz's listing leaves those tools out (https://postiz.com/claude). Option: serve a directory tool set without media generation, for example a separate server path or a scope the directory listing uses |
| Domain verification token at `/.well-known/openai-apps-challenge` on the MCP host | ChatGPT | Required for plugin submission. The app serves OAuth `.well-known` routes today but not this one |
| Verified OpenAI organization or individual | ChatGPT | Done in the OpenAI Platform dashboard by the owner |
| Reviewer test account with sample data, no MFA | Both | A demo brand with a filled Brand Brain and a few drafts. Send credentials only through each portal's own form, never in listing text |
| Public documentation page | Both | `https://heistbrain.com/agent-inbox.html` covers setup. Add a short "What the connector can do" list of verified tasks and a troubleshooting section before submitting |

---

## (a) Claude connector directory listing

**Where:** https://claude.ai/directory/manage → Submit new → MCP connector (needs a paid Claude plan; on Team or Enterprise an Owner submits). Questions: mcp-review@anthropic.com.
**Requirements read:** https://claude.com/docs/connectors/building/submission.md · https://claude.com/docs/connectors/building/review-criteria.md · https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy · https://claude.com/docs/directory/publish.md
**Eligibility:** **not eligible yet.** Two blockers: the missing tool annotations, and the AI media tools (see the gaps table). Heist meets the rest: remote HTTPS server, OAuth 2.0, first-party API on Heist's own domain, separate read and write tools, privacy policy, support contact.

| Field (limit) | Draft |
|---|---|
| Name (100) | Heist: Content Planner & Social Media Scheduler |
| One-liner (200) | Plan a month of social posts from Claude. Heist keeps your brand voice on file, drafts land in Heist for your review, and approved posts go on your calendar. |
| Categories (1–5) | Sales & marketing · Productivity · Communication |
| Connector URL | `https://app.heistbrain.com/mcp` |
| Documentation | https://heistbrain.com/agent-inbox.html |
| Privacy policy | https://heistbrain.com/privacy |
| Support | support@heistbrain.com |
| Reads, writes or both | Both. Reads your brand profile, calendar and drafts; creates and edits drafts; schedules drafts you approve |
| Before connecting | A Heist account on Pro, Founder, Agency or the 7-day trial. Open Heist once to verify your email and connect your social accounts |

**Description (2,000):**

> Heist is a content planner and social media scheduler for small businesses, consultants and creators. It keeps your brand voice on file (your audience, offers, tone rules, example posts and the words you never use) so Claude writes from it every time instead of starting from a blank chat.
>
> With Heist connected, you can plan and draft from Claude: ask for a month of posts around a launch, a week of LinkedIn posts from one idea, or a rewrite of a draft that came out off-brand. Drafts land in Heist's Review queue. Nothing posts until you approve it or schedule it. You can also check what's on the calendar, move posts, and see how published posts performed.
>
> Sign-in uses OAuth. On the consent screen you choose which Heist brands Claude can use, and you can revoke access in Heist at any time. Every change the AI makes is logged in Heist.
>
> Plans: Heist + your AI (this connector) is included on Pro, Founder and Agency, and in the 7-day free trial. Starter writes with your own AI API key instead. It works on any Claude plan, including Free. Claude's own plans and limits apply; Heist adds no separate fee for writing from your chat.
>
> Setup: in Heist, verify your email and connect your social accounts once. Then add the connector in Claude and sign in.

**Example prompts (at least 3):**
1. "Using Heist, plan next month's posts for my coaching brand around the spring cohort launch, two posts a week, and save them as drafts."
2. "Look at my Heist calendar for next week and tell me which days have nothing scheduled."
3. "Rewrite the Tuesday LinkedIn draft in Heist so it follows my brand's never-list, and keep it under 1,300 characters."
4. "Which of my last ten published posts got the most engagement, and what did they have in common?"

**Compliance acknowledgments to expect:** no financial transactions (true: the connector doesn't take payment); AI media generation (false today, see blockers); conversation data (Heist stores only the drafts and actions the AI creates, per the privacy policy).

---

## (b) ChatGPT plugin listing (formerly the ChatGPT app directory)

**Where:** https://platform.openai.com/plugins → Upload new or existing plugin. OpenAI moved apps to the Plugin directory on 9 July 2026 (help.openai.com/en/articles/11487775).
**Requirements read:** https://developers.openai.com/apps-sdk/app-submission-guidelines · https://developers.openai.com/apps-sdk/deploy/submission · https://developers.openai.com/apps-sdk/app-developer-guidelines · https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt

**Eligibility: eligible in principle, not ready to submit.** A tools-only MCP server with OAuth looks eligible (the UI rules apply only to plugins with a UI; the docs imply but don't state this). Before submitting, Heist needs: a verified OpenAI organization or individual; tool annotations (`readOnlyHint`, `destructiveHint`, `openWorldHint`) on every tool; the domain verification token; a no-MFA test account with sample data; five positive and three negative test cases; a demo video. Policy limits that shape the listing text:
- No pricing, trial or discount claims in the short or long description, and no plan display or upgrade prompts inside the plugin. So the plan-eligibility wording goes on the documentation page and in the reviewer notes, not in the listing text.
- No "MCP" or "Plugin" added to the name.
- Commerce only for physical goods: the plugin must not sell or link to Heist subscriptions. It doesn't today.
- No trial or demo plugins: the plugin must be the full product connection, which it is.

`plugin.json` draft:

```json
{
  "displayName": "Heist",
  "shortDescription": "Plan and schedule social posts",
  "longDescription": "Heist is a content planner and social media scheduler that keeps your brand voice on file. Connect it to plan and draft posts from ChatGPT: ask for a month of posts around a launch, turn one idea into a week of LinkedIn posts, or rewrite a draft so it follows your brand's rules. Drafts land in Heist's Review queue, and nothing posts until you approve or schedule it. You can also check your content calendar, move posts, and see how published posts performed. Sign-in uses OAuth: you choose which Heist brands ChatGPT can use, and you can revoke access in Heist at any time. Requires a Heist account with Heist + your AI; see the setup page for which accounts include it.",
  "developerName": "Heist",
  "category": "Productivity",
  "logo": "https://heistbrain.com/icon-512.png",
  "website": "https://heistbrain.com",
  "support": "https://heistbrain.com/agent-inbox.html",
  "privacyPolicy": "https://heistbrain.com/privacy",
  "termsOfService": "https://heistbrain.com/terms"
}
```

(`displayName` 5/30, `shortDescription` 30/30. Check the logo path once PR #12's icon set is live, and use a square PNG of at least 48px.)

**Reviewer notes (not shown to users), with plan eligibility:**
> Heist + your AI is included on Heist Pro, Founder and Agency, and in the 7-day free trial; Starter accounts use their own AI API key instead and can't connect. The test account is on Pro with one demo brand, a filled Brand Brain and sample drafts. Write tools create drafts in Heist's Review queue and never publish without an approval or a schedule. ChatGPT eligibility per OpenAI: custom MCP connections with write actions need a paid plan with developer mode (owner: confirm against the help article above before sending). AI provider plans and charges apply; Heist adds no fee for writing from chat.

**Test cases (draft):** positive: plan a month of drafts; list next week's calendar; rewrite a draft against the never-list; schedule an approved draft; summarise recent post performance. Negative: "post this now without review" (expected: creates a draft and says it needs approval); a request for a brand the user didn't grant (expected: clear access error); "buy the Agency plan" (expected: no purchase, points to heistbrain.com).

---

## (c) Roundup and directory inclusion notes

One short note per site, to send only through the route listed. Each states plan eligibility. **No platform list**: if a site's table needs one, the owner fills it in after publishing is re-verified.

### socialync.io

- **Pages:** https://socialync.io/blog/best-social-media-mcp-servers-2026 (15 tools, updated 27 Nov 2026) and https://www.socialync.io/mcp-server (14 schedulers). Socialync is itself a scheduler and ranks itself first.
- **Route:** none found (only /help and /about). Use a contact address from /about if one appears; otherwise skip.
- **Note:**
  > Hi, a correction-style suggestion for your MCP server roundup. Heist (heistbrain.com) is a content planner and social media scheduler with a remote MCP server at https://app.heistbrain.com/mcp (OAuth). It keeps a brand profile on file, saves AI drafts to a review queue, and schedules what you approve. Clients: Claude (any plan, including Free) and ChatGPT (paid plan with developer mode). The connector is on Heist Pro ($49/mo), Founder and Agency, and in the 7-day free trial with no card; Starter ($19/mo) uses your own AI API key instead. Your AI provider's plans and charges apply. Setup docs: https://heistbrain.com/agent-inbox.html. Happy to answer questions.

### sociality.io

- **Page:** https://sociality.io/blog/claude-connectors-marketers/ (12 marketing connectors, none that publish posts; updated 22 Nov 2026). Nothing on the site ranks for "MCP social media scheduler".
- **Route:** none found (footer links only to /legal). Low fit: the article covers analytics and research connectors. Skip unless a contact turns up.
- **Note (if a route appears):**
  > Your Claude connectors roundup has no tool for planning and scheduling posts. Heist (heistbrain.com) is a content planner and social media scheduler that connects to Claude as a custom connector (https://app.heistbrain.com/mcp, OAuth) on any Claude plan, including Free. Claude drafts from the brand voice Heist keeps on file; drafts wait in Heist for approval before anything is scheduled. The connector is on Heist Pro, Founder, Agency and the 7-day trial; Starter uses an API key. Claude's own plans and limits apply.

### smartpoststudio.com

- **Page:** https://smartpoststudio.com/blog/social-media-schedulers-with-mcp-2026 (20 tools, re-checked quarterly, updated 10 Nov 2026). Smart Post Studio is itself a scheduler.
- **Route:** support@smartpoststudio.com (the page says corrections sent there are "noted"). No formal inclusion process.
- **Note:**
  > Hello, for your next quarterly check of "Social media schedulers with MCP": Heist (heistbrain.com) has a remote MCP server. Facts for your table: MCP status: live, remote, https://app.heistbrain.com/mcp, OAuth 2.0. Read/write: both (reads brand profile, calendar and drafts; creates and edits drafts; schedules approved drafts). AI clients: Claude (any plan) and ChatGPT (paid plan with developer mode). Pricing: plans from $19/mo; the connector is on Pro ($49/mo), Founder ($99/mo), Agency ($199/mo) and the 7-day free trial (no card); Starter uses your own AI API key. AI provider plans and charges apply. Docs: https://heistbrain.com/agent-inbox.html. Thanks.

### mcpmarket.com

- **Listing format:** per server: author, categories, features, use cases, GitHub link, remote URL, install options, pricing note, platforms, AI clients. Category "Social Media Management". Example: https://mcpmarket.com/server/pallyy
- **Route:** https://mcpmarket.com/submit, which asks for a GitHub repository URL (type options include "Remote MCP"). A paid $29 option promises listing in 24 hours; whether free submission still works is unclear. **Heist has no public repository**, so this needs an owner decision: publish a small public repo with the connector README (setup, tools, auth, plan eligibility) or skip. Don't pay without deciding.
- **Listing text (for the README or form):**
  > **Heist** is a content planner and social media scheduler with a remote MCP server. Remote URL: `https://app.heistbrain.com/mcp` (OAuth 2.0; API keys for local stdio clients). Use cases: plan a month of posts, draft from a saved brand voice, review drafts before they post, check and change the content calendar. AI clients: Claude (any plan, including Free), ChatGPT (paid plan with developer mode), and other MCP clients by API key. Pricing: the connector is on Heist Pro, Founder, Agency and the 7-day free trial; Starter uses your own AI API key. AI provider plans and charges apply. Docs: https://heistbrain.com/agent-inbox.html

---

## Sources checked for this file (27 November 2026)

- Anthropic: https://claude.com/docs/connectors/directory.md · https://claude.com/docs/directory/publish.md · https://claude.com/docs/connectors/building/submission.md · https://claude.com/docs/connectors/building/review-criteria.md · https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy · example listing https://claude.com/connectors/typefully
- OpenAI: https://developers.openai.com/apps-sdk/app-submission-guidelines · https://developers.openai.com/apps-sdk/deploy/submission · https://developers.openai.com/apps-sdk/app-developer-guidelines · https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt · https://help.openai.com/en/articles/11487775
- Roundups: the page links in section (c); third-party tally of social schedulers in the Claude directory: https://www.blotato.com/blog/best-claude-connectors-social-media (Typefully and Metricool verified; Buffer, Postiz and others community)
