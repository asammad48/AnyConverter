# AnyConverter.io — Combined Growth Master Plan

**Version:** 1.0 (Combined)
**Prepared:** 2026-11-17
**Sources merged:**
- `ANYCONVERTER_GROWTH_ENGINE_CLAUDE_MASTER_TASK.md` (Claude Code / MCP master execution brief)
- `deep-research-report.md` (Autonomous MCP-Based SEO, Backlink & Outreach Operating System)

**Target:** https://anyconverter.io/
**Repo:** https://github.com/asammad48/AnyConverter
**Stack reality:** Static HTML + CSS + Vanilla JS on Cloudflare Pages. No framework. No build step. Browser-side processing. EN/ES/DA trees. 128 tools (homepage) / 78+ (FAQ/press — needs reconciliation).
**Companion tracker:** `docs/growth/GROWTH_TRACKING.xlsx`

---

## 0. Assignment summary — what this combined plan commits to

You are acting simultaneously as: principal growth strategist, product manager, analytics engineer, localization lead, senior vanilla-JS engineer, independent QA lead, **and** SEO/backlink/outreach operator.

**Objective:** Grow AnyConverter into a globally useful, repeatedly visited utility platform via:

1. Increased **successful tool completions** and **return visits** (not raw pageviews).
2. **Evidence-based** language/market expansion (not wholesale translation).
3. **Functional** browser-extension distribution (not a URL-launcher stub).
4. **Embeddable calculators / dev utilities** partners actually want.
5. **Partner, educator, creator, developer, community** distribution independent of Google search.
6. **Installability** where useful (PWA, favorites, presets, recents, shortcuts).
7. Credible, verifiable **privacy-first positioning**.
8. Validated **open-source packages / CLI / MCP** only after demand.
9. Reliable **analytics, experiments, measurement**.
10. Sustainable monetization that does not harm UX.
11. **Agent-assisted distribution + digital-PR system** (resource pages, embeds, dev examples, datasets, OSS, educational packs) rather than mass directory submission or mass AI content.

### Hard rules (never violate)

- Discover before editing. Read `AGENTS.md`, `CLAUDE.md`, `.ai-memory/*`, existing audits, `MULTILINGUAL_TOOL_NAMES_PLAN.md`, `UX_SITEWIDE_DEFECT_REGISTER.md`, `TOOL-INVENTORY.json`, `RELATED_TOOLS_COMPLETE_MAPPING.json`, `robots.txt`, `sitemap.xml`.
- Protect other agents' work. Never reset/clean/force-push/overwrite unrelated changes.
- Verify MCP connectivity. A referenced MCP is **not** proof it is connected.
- Preserve EN/ES/DA tools, URLs, canonical/hreflang, structured data.
- Use real evidence. No fabricated volumes, DR/DA, CTR, outreach stats, revenue.
- **No** mass growth spam, automated Reddit/Quora posting, bulk unsolicited email, fake reviews, link exchanges, scraping behind auth, fake testimonials.
- **Draft-only** outreach; never send/publish/submit without explicit owner approval.
- Privacy-by-default: never log JSON contents, document names, file inputs, form entries, URLs with sensitive values, or financial inputs as analytics.
- A plan is not a feature. A prototype is not production. A draft is not an email. A visit is not a completion.

### Critical correction baked into every phase

More languages, more tools, more indexed pages are **hypotheses, not success metrics**. DR/DA are diagnostic only, not business objectives. Google explicitly classifies automated link-building, keyword-rich widget links, mass directories, link-exchanges, and manipulative forum campaigns as link spam.

---

## 1. North-star metric & supporting KPIs

**North-star: Weekly Successful Tool Completions (WSTC)** — weekly count of intentional tool operations producing a usable result, defined per tool category.

### Supporting metrics

| Metric | Definition | Why |
|---|---|---|
| Tool-start rate | `tool_started` sessions / eligible tool-page sessions | Activation UX |
| Completion rate | `tool_completed` / `tool_started` | Detect abandonment |
| Tool failure rate | `tool_failed` / (`tool_failed` + `tool_completed`) | Product trust |
| 7-day / 30-day return rate | Returning cohort within consent limits | Retention |
| Direct/typed/bookmarked | GA4 direct + PWA/extension tags | Brand/distribution |
| Partner-referral users | Visits tagged with approved `utm_*` | Non-search growth |
| Embed engagement | Distinct host domains + events (consented) | Distributed usage |
| Extension usage | Aggregate local ops (consent-respecting) | Repeat distribution |
| RPM (revenue / 1k sessions) | Verified ad revenue / sessions × 1000 | Commercial |
| Return visitor completion | Completions from return cohort | Stickiness |
| Locale ROI | Incremental completions ÷ (build + maintenance cost) | Expansion decision |
| Defect density | Confirmed UX/functional defects / 100 journeys | Reliability |

**Measurement rules:** Keep sessions / users / events / completions distinct. Consistent timezone, filter, consent, attribution. GA4 "direct" ≠ loyalty. Cross-device anonymous tracking is not reliable.

### Deep-research KPI layer (authority & distribution)

| Outcome | Primary KPI | Secondary KPI |
|---|---|---|
| Search growth | Non-brand organic clicks + qualified LP sessions | Impressions, avg position, indexed tool pages |
| Authority acquisition | Relevant **editorial** referring domains | DR/DA trend (diagnostic only) |
| Distribution | Referral users who **use** a tool | Mentions, community engagement |
| Partnership growth | Embedded/integrated tools + recurring partners | Outreach reply/placement rates |

---

## 2. Growth pillars & tentative allocation

1. **P0 — Product reliability + tracking** (fix regressions, measure completions, trustworthy baseline).
2. **P1 — Repeat usage** (favorites/recents upgrades, shareable non-sensitive state, installability, shortcuts).
3. **P1 — Selective localization** (validated country-language-tool opportunities).
4. **P1 — Distributed products** (1 high-value extension + 2 useful embeds).
5. **P1 — Partner acquisition** (educators, publishers, developer docs, SMBs, niche SaaS).
6. **P2 — Creator / community marketing** (genuine demos & answers, no spam).
7. **P2 — Developer integrations** (narrow package / CLI / MCP after real demand).
8. **P3 — Monetization experiments** (audience-respecting, policy-compliant).

**Tentative split (revise after baseline):** Reliability+retention 30% · Localization R&D + pilot 25% · Extensions+embeds+partners 25% · Measurement+experiments 15% · New misc tools 5%.

---

## 3. Phase 0 — Repo, connector & product reality audit

**Outcome:** precise starting point, zero premature code changes.

### Task 0.1 — Source & workflow inspection
- Read all project rules, memory files, defect registers, inventories.
- Record branch/SHA, uncommitted work, deploy instructions, test commands, shared assets.
- Count unique canonical tools, locale variants, categories, indexable URLs **from source**.
- Inventory search, favorites, recents, local storage, theme, full-screen editing, copy/download, analytics, cookie/consent, PWA assets.
- Reproduce every unresolved defect in current checkout + production.
- Map tools to categories (dev/data, PDF/document, image/media, finance/calc, education/productivity, lifestyle/fun).
- Flag which tools are fully client-side vs third-party dependent — update privacy claims accordingly.
- List in-flight branches/experiments/extensions/widgets to avoid duplication.

### Task 0.2 — MCP & external data availability audit

| System | Purpose | Guard | Current status (from deep-research) |
|---|---|---|---|
| Google Search Console | Queries, pages, geo, device trends | Read-only | **Critical; not callable in research run** |
| GA4 / analytics | Channel, engagement, retention, conversions | Read-only | Not verified |
| Cloudflare Analytics | Perf, web analytics, anomalies | Read-only | Hosted MCP exists: `https://mcp.cloudflare.com/mcp` |
| GitHub | Repo, PRs, issues, history | Branch only | Public web verified; MCP not callable in research run |
| Chrome DevTools / Playwright | Real user-journey tests | Local/staging | Not exposed |
| DataForSEO / Ahrefs / Semrush | Keyword/SERP/competition | **Approve before paid calls** | Ahrefs hosted MCP available |
| Google Trends | Relative interest only | Never call it volume | Public web |
| Gmail / outreach | Drafts, approvals, replies | Draft-only | Not to be used without approval |
| YouTube / creator | Content distribution | No publish w/o approval | N/A |
| Browser-store accounts | Extension distribution | No submit w/o approval | N/A |
| Apollo.io | Contact/company research | Search/read only initially | Hosted MCP: `https://mcp.apollo.io/mcp` |
| CRM / opportunity DB | Canonical prospect/action ledger | Audited writes | **Missing — build it** |
| Scheduler / orchestrator | Daily/weekly jobs | No external side effects | **Missing — build it** |
| Slack/Teams/Telegram | Approvals + alerts | Post approval cards only | Recommended |

Check `.agents/mcp_config.json` and `node .agents/scripts/switch-profile.js status` if present. Follow repo's profile mechanism; do not enable every MCP at once. **Never print tokens, OAuth secrets, private analytics, or customer data.**

### Task 0.3 — Live site verification
- EN/ES/DA representative pages at widths: **320, 360, 375, 390, 768, 1024, 1280, 1440, 1920, 2560 px**.
- Engines: Chromium primary; Firefox/WebKit where tooling allows.
- Test dark/light, mobile touch, keyboard-only, menus, operation, errors.
- Tools: JSON Formatter, JSON Compare, CSV→SQL, Regex Tester, Invoice, Loan/Percentage calculator, PDF compress/split/merge, Numerology/lifestyle, Search/Favorites.
- Network: 200 responses, no broken assets, no redirect chains, canonical consistency.
- Priority defects: editor height, upload alignment, side overflow, tool output menus, calculator checkbox alignment, PDF workspace consistency, action-button visibility, large-screen whitespace.

### Phase 0 artifacts (prefer `docs/growth/`)
- `00-EXECUTIVE-BASELINE.md`
- `01-REPOSITORY-AND-MCP-AUDIT.md`
- `02-TOOL-AND-LOCALE-INVENTORY.csv`
- `03-LIVE-UX-RELEASE-GATE.md`
- `04-BASELINE-DATA-GAPS.md`
- `05-RISKS-DEPENDENCIES-AND-APPROVALS.md`

**Gate 0:** Clearly distinguish `PASS`, `FAIL`, `BLOCKED`, `NOT TESTED`. Proceed only on features not dependent on unresolved critical failures.

---

## 4. Phase 1 — Analytics & experimentation foundation

### Task 1.1 — Real baseline extraction
Windows: most recent complete **28-day** and **90-day** with comparison periods. If GSC/GA4 unavailable, record exactly which connection is missing. **Do not invent figures.**

**GSC dimensions:** URL + cluster, query + landing page, country/device/search appearance, clicks/impressions/CTR/avg position (with API limits), locale prefix, branded vs non-branded. Prioritize high-impression/low-CTR; CTR fixes ≠ growth program.

**GA4 dimensions:** sessions, users, new/returning (where supported), events, engagement; channel/source/medium/campaign; tool LP, locale, device, country, referral host; top entry pages; existing conversions; instrumentation duplication / bot symptoms.

**Report:** raw extraction date, comparison period, source, masked property ID, methodology. Data gap matrix columns: `metric, source, is_available, reason, required_connection, next_action`. Never expose individual users or sensitive tool inputs.

### Task 1.2 — Privacy-safe event tracking

Shared adapter; no heavy deps. Event vocabulary:

```
tool_viewed          # optional, only if not duplicating page_view
tool_started
tool_completed
tool_failed
result_copied
result_downloaded
result_shared
favorite_added
favorite_removed
preset_saved
pwa_install_prompt_shown
pwa_install_accepted
extension_opened     # where measurable + permissible
embed_loaded
embed_operation_completed
outbound_partner_click
```

**Allowed metadata:** stable `tool_id`, `tool_category`, `locale`, `interaction_type`, `result_type`, generic `error_code`, `surface` (`web|pwa|embed|extension`), experiment ID, applicable UTMs.

**Forbidden metadata:** input JSON, document contents, uploaded file names, customer names, pasted text, financial values, health info, raw exception payloads with user data, full URLs with sensitive query strings, hashed equivalents meant to reidentify.

**Implementation requirements:** dedupe repeated clicks/retries; define batch counting (per action / per file) clearly; app works when GA4 blocked/unconsented; EU/UK cookie compliance; single shared adapter + per-tool integration; measure success **after** real operation, not clicks; protect against test/preview/bot events; verify in safe test config.

### Task 1.3 — Experiment registry

`experiments.csv` schema:
```csv
id,hypothesis,audience,locale,primary_metric,guardrail_metric,baseline,start_date,end_date,decision,status,owner,evidence
```

Protocol per experiment: problem+hypothesis · audience/segmentation · 1 primary + 1-3 guardrails · baseline + expected direction (no invented effect size) · min duration/sample · privacy approval · launch/rollback plan · post-test decision (keep/iterate/stop/insufficient).

**Gate 1:** Production analytics changes need privacy review + owner approval. Test in staging first.

---

## 5. Phase 2 — Language & market expansion research

### Critical question
Where can a browser-side tools site acquire useful, affordable, recurring traffic from a large underserved audience? Answer is **not** "the language with the fewest websites."

### Candidate markets (research, not predetermined winners)

| Locale | Market | Initial hypothesis | Risk |
|---|---|---|---|
| `pt-BR` | Brazil | Calculators, invoices, PDF, utilities | Competitive; finance complexity |
| `id` | Indonesia | Mobile audience; documents, education, text | Mobile perf; price-sensitivity |
| `tr` | Türkiye | Finance, text, business, calc | Local finance assumptions |
| `vi` | Vietnam | Documents, education, image, office | Native terminology, mobile |
| `pl` | Poland | Professional finance, docs, dev utilities | Smaller audience, incumbents |
| `ar` | MENA | Utilities, students | RTL + dialect diversity |
| `hi-IN` | India | Education/consumer | Hinglish; language ≠ population |
| `th` | Thailand | Localized utilities | Typography, search ecosystem |
| `bn-BD` | Bangladesh | Education/office calculators | Monetization validation |

**Also:** evaluate whether more ES/DA investment beats a new locale.

### Task 2.1 — Native keyword map
10–20 representative tools per market across dev/data, PDF/doc, finance/math, utility/productivity, (optional) lifestyle. Capture: native spellings + colloquial terms (not literal EN translations) · intent variants · verified volume or `UNKNOWN` · provider-specific difficulty w/ methodology · top 10 SERP on defined date · competitor quality/speed/ads/mobile/localization · SERP features · recurring vs one-time task · monetization context (no country stereotypes) · AnyConverter advantage · confidence grade + evidence URL.

### Task 2.2 — Competitor teardown
3–5 competitors per priority cluster. Scope checklist · onboarding/friction · mobile · writing quality · verified on-device claims · export/share · ads/paywalls · trust/privacy · partnerships/extensions/embeds · actual gaps. **No fabricated complaints.** Link + date for every claim.

### Task 2.3 — Market scoring (weighted)

| Factor | Weight |
|---|---:|
| Verified tool-specific demand | 25% |
| Achievable SERP/competitor gap | 20% |
| Product fit / localization effort | 15% |
| Repeat usage potential | 15% |
| Non-SEO distribution channels | 10% |
| Commercial sustainability | 10% |
| Technical/legal risk | 5% |

Score 1–5 with confidence. Mark unknown as unknown. Include sensitivity analysis. **Required comparison:** pt-BR vs id vs best-performing ES/DA before recommending pilot. Acceptable outcome: **no new locale yet**.

### Task 2.4 — Pilot spec (if evidence supports)
One locale initially · 10–20 tools (not full-site parity) · low-risk math/text/data tools first · durable URLs (`/pt-br/.../` or `/id/.../`) after slug strategy agreed · human native review required · localize all visible UI (title, desc, instructions, buttons, placeholders, errors, labels, FAQ, breadcrumbs, related tools, hubs, search, favorites, language nav) · validate Unicode / accents / expansion / diacritics / numeric parsing / decimal-group separators / dates / currency / keyboard / mobile / copy-export · distinguish formatting from country-specific tax/loan logic (verify source+date; no legal claims without evidence) · **no auto-redirect** · explicit switcher · per-page self-canonical + reciprocal hreflang **only for existing equivalents** + `x-default` · no missing-page links · unique native content, not thin MT clones · preserve EN/ES/DA.

### Localization automated QA
Correct `html[lang]`, localized main content + search labels · one primary H1 · valid canonical · consistent hreflang + HTTP 200 · relative asset/internal link resolution · sitemap only if approved · tool-operation parity vs EN golden vectors · native number formats don't change calc values · no untranslated shared UI or invisible action buttons · responsive + keyboard a11y.

**Gate 2:** No production publication / sitemap submission / mass indexable rollout until evidence + native QA + regression pass + owner approves.

---

## 6. Phase 3 — Retention & product-led growth

### Task 3.1 — Audit existing favorites/recents (MULTILINGUAL_TOOL_NAMES_PLAN already describes this)
Enhancements only if needed: quick access preserving choice · cross-locale favorites · optional non-sensitive presets (no raw doc storage) · local storage versioning/migration/corruption handling + reset · a11y focus/keyboard · no forced signup · no backend for client-side needs. **Default presets never silently persist sensitive data; explicit opt-in + clear device-storage explanation.**

### Task 3.2 — Shareable calculator state (one low-risk tool)
Pilot: Percentage or Date-Difference. Link contains minimal **non-sensitive** params only on explicit Share action · compact versioned validated params · no auto-sharing / cross-site transmission · invalid/old links fail safely with reset · copy-link + preview + keyboard + mobile + back/fwd work · canonical URLs don't proliferate · identical calculations original ↔ restored.

### Task 3.3 — PWA feasibility
Inspect manifest, icons, routing, cache headers, SW. Only if it improves repeat usage. Prototype installable homepage + **approved** offline-capable tools (not blanket cache + third-party scripts). Avoid stale HTML, broken tool JS, cross-origin cache surprises, storage bloat, offline-claim-with-CDN-dependency. SW cache versioning + update notification/rollback + offline tests. Full site must work without SW. No intrusive/misleading install prompts. Verify installability in supported browsers + safe staging.

### Task 3.4 — Tool-to-tool workflows (non-interruptive)
Examples: JSON Formatter → JSON Compare → JSON→CSV · CSV→SQL → conversion → download · PDF Merge → Split/Compress on user choice. Contextual next actions only. Track **voluntary** adoption.

**Gate 3:** Existing success rate can't degrade; no forced account creation / cookie-wall for essential tools / unbounded local storage.

---

## 7. Phase 4 — Chrome/Edge extension distribution

### Pilot product: **AnyConverter JSON Toolkit**
Narrow, single-purpose: format, validate, pretty-print JSON **locally** from popup/explicit action. **A one-click launcher is not acceptable.** Must comply with Chrome Web Store single-purpose + minimum-functionality policy.

### MVP capabilities
Paste/type JSON → format/minify/validate locally · explicit user-initiated formatting of selected JSON (no broad page scraping) · concise error messages with line/column · copy formatted/minified · keyboard a11y, small responsive popup · light/dark · UI language based on evidence · optional link to web tool as additional workflow, not primary.

### Security & privacy
Manifest V3 · minimal permissions · **no `host_permissions` by default** · no "read all websites" for a popup formatter · no covert clipboard/history/page reads · no remote hosted executable JS · no analytics containing user JSON · no background JSON exfiltration · transparent privacy policy + understandable permission rationale.

### QA deliverables
Architecture decision (self-contained vs separate repo) · unpacked MV3 package · test vectors (valid/invalid/nested/Unicode/large/oversized/empty/HTML injection/special chars) · clean console + CSP compliance + no superfluous perms · store listing copy, screenshots plan, icon/license inventory, privacy disclosures, submission checklist · attribution plan without fabricated store analytics.

**Do not submit to Chrome Web Store / Edge Add-ons without explicit owner approval.**

Later (do **not** build now): Regex Tester, PDF helper, case tools, CSV preview. Next product chosen on install/use data.

**Gate 4:** Browser perm/security review + 100% core test-case pass before store-submission recommendation.

---

## 8. Phase 5 — Embeddable tools & B2B/B2EDU distribution

### Pilot embeds
1. **Percentage Calculator** (education, blogs, pricing tutorials).
2. **Date Difference Calculator** (or similar low-risk, selected via product fit + baseline).

Jurisdiction-specific financial tools wait for independent math/legal review.

### Embed build requirements
Compare iframe vs lightweight script; document choice. Secure iframe + separate `/embed/...` route is reasonable first option.
- Iframe: isolated HTML/CSS, `title`, correct viewport, responsive width, fixed or safely-communicated height with strict `origin` checks on postMessage.
- No forced popups, hidden tracking pixels, third-party cookies, surprise redirects.
- Clear "Powered by AnyConverter" attribution **only where partner agrees**. **Never** require a keyword-rich followed backlink (Google explicitly flags widget keyword links as link spam).
- Copy/paste snippet, width/theme/locale options, basic docs.
- Respect frame/CSP policy; Cloudflare permits only intended embed endpoints to frame; do not relax protection elsewhere.
- Validate URL inputs; defaults safe; nothing sensitive in share links.
- Small mobile footprint; prevent CLS in host.
- Host pages work with analytics disabled.
- No arbitrary parent DOM access; no unsafe postMessage handlers.
- A11y: keyboard, SR labels, error announcements, contrast, focus.

Example neutral embed:
```html
<iframe
  src="https://anyconverter.io/embed/compound-interest-calculator/"
  title="Compound Interest Calculator"
  loading="lazy"></iframe>
```

### Developer package
`EMBED_PARTNER_GUIDE.md` (two snippets + usage policy) · example partner HTML · host compatibility matrix (HTML, WordPress, common CMS) · localization/RTL feasibility · metrics definition + limitation (embed ops ≠ referral visits) · brand disclosure + privacy + **do not promise SLA you don't operate**.

### Partner offer
Specific value proposition, e.g. *"Add an accessible responsive percentage calculator to your education article at no cost. Readers calculate inside your page; no account needed."* **Avoid** generic "please backlink". Partners receive utility; referral traffic is an earned byproduct.

**Gate 5:** One pilot partner sandbox test + secure frame policy before distribution.

---

## 9. Phase 6 — Partnerships, communities & content distribution

### Task 6.1 — Qualified prospect database
Segments: educational publishers / schools / teacher blogs · programming tutorials / dev communities / docs sites · business/finance bloggers + SMB knowledge centers · spreadsheet/data pros + productivity communities · WordPress/CMS creators · regional-language forums + creator channels · niche SaaS with conversion/calculator need.

**CSV schema:**
```csv
prospect_id,organization,website,country,language,segment,matched_tool,
actual_use_case,contact_source,public_contact_url,verified_email_if_public,
confidence,relationship_status,personalization_notes,proposed_value,
permission_status,last_checked_date
```

**Never** collect contacts from nonpublic sources, bypass access controls, or infer emails at scale. Keep lawful/ethical basis + opt-out handling.

### High-priority verified resource-page prospects (from deep research)

These are pages whose **editorial intent already is to recommend calculators, converters, or developer tools** — exactly the relevance Google's link-spam guidance does not prohibit.

| # | Prospect | Fit | Suggested asset |
|---|---|---|---|
| 1 | Stockton University financial-literacy | finance calculators | ad-free percentage/compound/loan + methodology |
| 2 | University of Cincinnati Finance LibGuide | finance | calculators hub |
| 3 | UTSA Finance & Investment LibGuide | finance | finance-calculator hub |
| 4 | Youngstown State maths | maths | slope/percentage/math tools |
| 5 | Unity Environmental University | maths | targeted calculator subset |
| 6 | University of New Hampshire | converters + stats | conversion/calculator hub |
| 7 | SIUE file-conversion | PDF/conversion | browser-side PDF conversion |
| 8 | SIUE free-PDF-tools article | PDF | strongest PDF-replacement prospect |
| 9 | Duke CS resources | dev | JSON formatter/compare/JWT/Base64 + OSS link |
| 10 | Johns Hopkins SE resources | dev | dev-tools hub (only if materially stronger) |
| 11 | UW CSE historical course pages | dev | current privacy-first JSON tool (to course owner) |
| 12 | Binghamton financial self-service | finance | finance-calculator collection |
| 13 | UCSD financial resources | finance | finance tools selectively |
| 14 | UNG financial wellness | finance | student-friendly finance calculators |
| 15 | Sullivan University personal-finance | finance | calculator-directory prospect |
| 16 | Product Hunt | launch | platform launch (not 128 individual) |
| 17 | DevHunt | dev launch | dev-tool suite / distinct dev product |
| 18 | SaaSHub | directory | **manual** founder submission |
| 19 | AlternativeTo | directory | platform listing if editorial rules allow |
| 20 | Uneed | launch | overall platform |
| 21 | Peerlist Launchpad | dev launch | dev-facing + founder profile |
| 22 | Hacker News / Show HN | dev community | only genuinely interesting technical stories |
| 23 | AnyConverter GitHub repo | discovery | improve About/topics/docs/examples/contrib story |

**Extended prospect universe** (see `docs/growth/60-PARTNER-PROSPECTS.csv` + tracker sheet `Prospects`): Stanford IFDM, Stanford Mind Over Money, U.Penn financial wellness, U.Wisconsin, Washtenaw CC, U.Houston, U.Michigan SOCR, UC Davis biostats, Ohio U., Lamar State, U.Montana, Emory clinical (**do not** pitch BMI/calorie as clinical without medical validation), U.Illinois OCR, U.Michigan accessibility (only after PDF-a11y tools), Cornell-hosted BentoPDF (competitor benchmark), Georgia Southern PDF, Citrus College maths, BetaList, Launching Next, Product Hunt Discussions, SaaSHub community, Stack Overflow (answer-first, disclosure), Quora (answer-first), Reddit (organic only, no spam), GitHub (topics/releases/examples/issues), Cloudflare Community (if publishing CF implementation details).

### Task 6.2 — Draft-only outreach packages
Five targeted drafts: teacher/edu embed · dev blogger JSON integration · productivity publisher interactive tool · OSS maintainer useful component · regional partner native-lang collaboration. Each references a **verified** page/use case. Native-language drafts reviewed by native speakers.

**Workflow:** Research → qualified prospect → proposed offer → draft → owner review → manual/approved send → reply tracking. **Never send without explicit approval of recipients + content.** Stop on opt-out. No automated mass messaging.

#### Outreach templates (ready to adapt)

**University/resource editor**
> Subject: Free browser-based calculator resource for your students
>
> Hi {{Name}},
>
> I found your {{specific resource page}} while researching educational resources for {{topic}}. You currently recommend {{relevant existing resource}}, so I thought this might be useful rather than sending a generic website pitch.
>
> We maintain a free {{calculator/tool}} at AnyConverter that runs without signup and includes {{specific educational feature/formula/example}}.
>
> If it genuinely improves the resource list, here is the page: {{tool URL}}. If not, no problem — I don't want you to add something solely because I emailed.
>
> Regards, {{Name}}

**Developer educator**
> Subject: Possible JSON/API utility for {{course/resource page}}
>
> Hi {{Name}}, your {{course/page}} recommends {{existing formatter/resource}} for inspecting JSON. I maintain an open browser-side JSON formatter/validator with {{specific differentiator}} and public source code.
>
> If you are updating the resource list, I can send a short technical comparison or test cases so you can decide whether it is worth including. No sponsorship or reciprocal link is involved.
>
> {{Name}}

**Integration partner**
> Subject: Free embedded {{calculator}} for {{Company}}
>
> {{Company page}} explains {{specific user problem}}. We have a browser-side {{tool}} that addresses the calculation step, and we're building a lightweight embeddable version.
>
> I think it could remove the need for visitors to calculate {{task}} manually. If that is useful, I can provide the embed and documentation. Attribution can remain simple and branded; there is no requirement for an SEO link.
>
> {{Name}}

**Broken resource page**
> Subject: Broken {{resource name}} link on {{page}}
>
> While using your {{page}}, I noticed the {{resource}} link now {{404s/redirects/no longer provides the stated tool}}.
>
> I maintain a free alternative covering {{exact function}}. If you are updating the page, it may be a suitable replacement: {{URL}}. Either way, I wanted to flag the broken resource.
>
> {{Name}}

### Task 6.3 — Community contribution strategy
Research rules + culture of Reddit, Stack Overflow/Exchange, Quora, GitHub Discussions, Hacker News, local-language forums, specialty groups. Per community record: URL, topical fit, public posting rules, self-promotion limits, genuine questions existing tools answer, non-promotional answer outlines, whether a tool link is *necessary* (often it is not), human review + manual publication plan.

**Explicit prohibition:** no autonomous posting, manufactured conversations, sockpuppets, fake recommendations, repetitive replies, link-dropping. **No answer should exist solely to insert a backlink.**

### Task 6.4 — 12-week creator/video calendar
2–3 short demos per week (if capacity). One exact problem per video. Show inputs/actions/results clearly. 30–90s short demos; longer only if warranted. Prioritize high-usage tools + creator-relevant problems. Publish in audience language w/ native subtitles or reviewed voiceover. Link to exact tool + UTM. Keep AnyConverter demos distinct from broad channels unless cross-promo genuinely fits. **No clickbait financial certainty / unsupported privacy claims.**

Example concepts: "Compare two JSON responses safely" · "Convert CSV rows into SQL INSERT statements" · "Split selected PDF pages in your browser" · "Calculate percentage change correctly" · "Quickly count words in a long text".

Calendar CSV: `topic, audience, locale, target_tool, hook, demo_steps, platform, CTA, UTM, cost, owner, approval, publication_status, measured_result`.

### Task 6.5 — Earned coverage / PR
Non-spam opportunities: public useful tool benchmarks · small transparent data studies of aggregated non-sensitive tool usage · educational worksheet companions / calculator explainers · localized conversion cheat sheets / practical templates · developer sample repos w/ valid OSS license. **No manufactured statistics / fabricated case studies.** Legal/privacy review before publishing any dataset.

---

## 10. Phase 7 — Developer distribution: npm / CLI / GitHub / MCP (validation-first)

Evaluate three narrow proposals:
- **A. Headless JS conversion package** reusing tested pure functions (deterministic CSV/JSON helpers).
- **B. CLI** wrapping (A) for local files; no uploads to hosted service.
- **C. Local MCP server** exposing small safe tool subset (validate/format JSON, text transform).

### Decision criteria
Reuse real tested functions (don't copy-paste UI) · no framework/build rearchitecture · explicit license + dep/security review · do not promise all tools exposed to agents · clearly distinguish local vs cloud · limit file access, input size, output, logging · document MCP exposure/security + perm boundaries · assess actual developer adoption demand + maintenance cost.

### Prototype
Pick **one** after evidence. Deliverables: RFC · clean API example · tests · README · version policy · support/maintenance budget · publishing checklist.

**Do not publish npm packages, GitHub releases, GH Actions Marketplace listings, or hosted MCP servers without approval. No unauthorized license changes.**

---

## 11. Phase 8 — Monetization without destroying trust

Research (don't auto-implement payments):
1. Better ad placement/UX + verified policy compliance.
2. Clearly-labeled sponsored placements in relevant contexts.
3. B2B integration/support offerings once usage proves value.
4. Premium batch/productivity features **only if** free utility remains worthwhile.
5. Optional privacy-first pro convenience features requiring real billing capacity.
6. Ethical affiliate links where genuinely relevant + disclosed.

### Required analysis
Verified revenue, traffic mix, ad viewability, CLS/perf tradeoffs · regional revenue variation from actual data (not country stereotypes) · break-even estimates w/ assumptions · compliance cost (tax, VAT/sales tax, privacy, merchant policies) · risk aggressive monetization reduces completion/retention/referral/trust.

**Guardrail:** no new ad slots, tracking scripts, paywalls, registration walls, popups, affiliate links until approved after UX/privacy review.

---

## 12. Autonomous MCP operating architecture (from deep research)

System is built around a **canonical opportunity database**, not independent agents emailing/posting wherever they find something.

```
                        ┌─────────────────────┐
                        │  Scheduler / Events │
                        └──────────┬──────────┘
                                   │
                       ┌───────────▼───────────┐
                       │ Orchestrator / Policy │
                       └──────┬────┬────┬──────┘
                              │    │    │
               ┌──────────────┘    │    └───────────────┐
               ▼                   ▼                    ▼
       ┌────────────────┐ ┌─────────────────┐ ┌────────────────┐
       │ Site/GSC Agent │ │ Backlink Intel  │ │ Prospect Agent │
       │ crawl + SEO    │ │ Ahrefs + web    │ │ Apollo + web   │
       └───────┬────────┘ └────────┬────────┘ └───────┬────────┘
               │                   │                  │
               └───────────┬───────┴───────────────┬──┘
                           ▼                       ▼
                 ┌──────────────────┐     ┌───────────────┐
                 │ Opportunity DB   │     │ Content Agent │
                 │ + evidence store │     │ personalise   │
                 └────────┬─────────┘     └───────┬───────┘
                          │                       │
                          └─────────┬─────────────┘
                                    ▼
                          ┌───────────────────┐
                          │ Approval Gateway  │
                          └─────────┬─────────┘
                                    │
                      approved only │
           ┌──────────────────────┬─┴───────────────────────┐
           ▼                      ▼                         ▼
      Email sender          Community post           GitHub/website PR
      human-approved        human-approved           reviewed merge
           │                      │                         │
           └──────────────────────┼─────────────────────────┘
                                  ▼
                        ┌───────────────────┐
                        │ Validation Agent  │
                        │ link/reply/status │
                        └─────────┬─────────┘
                                  ▼
                        ┌───────────────────┐
                        │ Analytics + Audit │
                        └───────────────────┘
```

### Agent roster

| Agent | Cadence | Inputs | Output | External side effect |
|---|---|---|---|---|
| Site auditor | daily | sitemap, rendered pages, GSC | crawl/indexability issues | none |
| Content-gap | weekly | GSC, Ahrefs, competitors | opportunity cards | none |
| Backlink-gap | weekly | Ahrefs + web | referring domains competitors have | none |
| Resource-page hunter | daily | web queries | candidate educational/resource pages | none |
| Broken-link hunter | weekly | candidate pages | dead/redirected competitor resources | none |
| Community listener | daily | Reddit/Quora/HN/web | relevant Q&A opportunities | none |
| Prospect verifier | continuous | URLs | topical match, owner, policy, link type | none |
| Contact researcher | approved batch | Apollo/public | business contact candidates | none |
| Personalisation | approved batch | prospect evidence | first-draft outreach | none |
| Outreach QA | every draft | policy + draft | approve/reject/rewrite recommendation | none |
| Email sender | **approval only** | approved draft | sent message | **yes** |
| Community publisher | **approval only** | approved answer/post | published contribution | **yes** |
| Link validator | weekly | won placements | current link/rel/indexability | none |
| Reputation monitor | daily | mentions/search | complaints, removals, spam signals | none |
| SEO reporter | weekly/monthly | GSC/Ahrefs/CRM | KPI report | none |

### Universal agent directive

```
Never optimise for the existence of a backlink alone.
Score an opportunity by:
  1. topical relevance
  2. editorial legitimacy
  3. expected qualified referral traffic
  4. likelihood of genuine usefulness
  5. domain/page quality
  6. placement permanence
  7. spam/compliance risk
  8. effort

Do not recommend paid ranking-credit links.
Do not assume a link is followed.
Do not invent contact information.
Do not send, submit, post, comment, publish, or modify
external systems unless the action has an explicit approval token.
```

### Opportunity scoring (100-point)

```
Topical relevance                  25
Real audience / referral potential 20
Editorial/resource-page fit        15
Page quality/indexability          10
Prospect authority                 10
Likelihood of placement            10
Asset differentiation              10
Spam/policy penalty              0 to -50
```

A DR-80 irrelevant directory **loses** to a DR-30 university resource page directly matching the tool.

### CRM schema

```
prospects(id, domain, url, organisation, category, country, language, source_query, discovered_at)

opportunities(prospect_id, destination_tool, opportunity_type, relevance_score, authority_score,
              traffic_score, policy_risk, final_score, evidence_url, evidence_excerpt, verified_at)

contacts(prospect_id, name, role, business_email, source, lawful_basis_note, suppression_status)

outreach(opportunity_id, contact_id, draft_version, subject, body, approval_status,
         sent_at, followup_due, replied_at, outcome)

placements(opportunity_id, source_url, destination_url, anchor_text, rel_attribute,
           first_seen, last_seen, http_status, indexed_status)

audit_log(agent, tool, action, timestamp, input_hash, output_hash, approval_id)
```

Dedupe on `registrable_domain + contact + destination_tool + opportunity_type` so N agents cannot independently email the same editor.

### Approval object

```json
{
  "action_id": "outreach_01874",
  "channel": "email",
  "destination": "editor@example.edu",
  "content_hash": "sha256:...",
  "approved_by": "human-user",
  "approved_at": "2026-11-16T12:00:00+05:00",
  "expires_at": "2026-11-17T12:00:00+05:00"
}
```

Changing content invalidates the hash → approval invalid.

### Permission classes

| Class | Examples | Default |
|---|---|---|
| Read-only | crawl, GSC query, Ahrefs query, public research | autonomous |
| Internal write | add prospect, change score, save draft, update CRM | autonomous + audit log |
| Reversible external | GitHub draft PR, Gmail draft | tool-level permission |
| Irreversible/public | send email, post Reddit/Quora/HN, submit directory, merge/deploy | **explicit human approval** |

### Outreach law
- **US CAN-SPAM:** truthful headers, compliant commercial content, functional opt-out.
- **UK/EU PECR + GDPR:** stricter; depends on recipient, jurisdiction, consent, lawful basis. A public email ≠ consent. Sole traders treated differently from corporate subscribers.
- Apollo = **prospect research only**, not autonomous sequencing.
- Global `never_contact(email, domain, reason, source, timestamp)` suppression table screened on every proposed send.

---

## 13. Linkable-asset strategy (the 6 asset families)

Stop pitching "we have a free calculator." Produce assets editors want.

1. **Embeddable calculators** — official lightweight embed mode. No forced followed keyword-rich link. Attribution optional / naturally branded.
2. **Open-source micro-libraries** — extract tested pieces (percentage math, slope conversion, CSV helpers, viewport detection, PDF client-side utils) into small packages. GitHub becomes real acquisition channel.
3. **Original benchmark studies** — client-side PDF compression quality/speed across devices · JSON formatter perf on large payloads · "20% then 10% off" vs "30% off" retail · browser-side OCR accuracy on public docs.
4. **Teacher / resource packs** — slope, percentage, compound interest, unit price: downloadable classroom exercises + answer keys.
5. **Developer documentation** — every dev tool has practical examples, edge cases, copyable snippets, small test suite → organic citations from tutorials/courses/docs.
6. **Privacy-engineering content** — technically verifiable "how it works" page: network behaviour, deps, what does/does not leave the device, CSP/security assumptions, exceptions (FX, IP lookup).

---

## 14. Site, repo & technical SEO findings (deep-research)

### Working well
Static architecture, per-page titles/descriptions/canonicals, `WebApplication` schema, multilingual hreflang, sitemap inclusion, perf targets. Category hubs (PDF, dev, calculators) give crawl paths + topical clusters.

### Immediate issues
- **Count inconsistency:** homepage says **128 tools**, FAQ + press say **78+**. Fix via one structured source of truth → regenerate/validate every page.
- **Localization quality drift:** ES/DA pages contain unaccented or machine-like phrases ("practicos", "utiles", "nar", "daekker", "vaelge"). **Fix before scaling translations.** Google warns automated/scaled translation offering little incremental value = scaled-content abuse.
- **Weak GitHub metadata:** no description, no website, no topics.
  Suggested About:
  ```
  AnyConverter — 128+ free browser-side PDF, developer,
  calculator, conversion and productivity tools.
  Privacy-first. No account required.
  https://anyconverter.io
  ```
  Suggested topics: `developer-tools pdf-tools online-tools calculators javascript browser-tools privacy open-source static-site`
- **`node_modules` in source control** — normally remove; replace with deterministic manifests unless deliberately vendored.

### Multilingual control plane (do not add more languages until enforced)

```
EN canonical -> EN
ES canonical -> ES
DA canonical -> DA

EN hreflang -> EN + ES + DA + x-default
ES hreflang -> EN + ES + DA + x-default
DA hreflang -> EN + ES + DA + x-default

Every pair must be bidirectional.
Every sitemap URL must return 200.
Every canonical must be indexable.
Every translated tool must contain genuinely translated main content.
```

Generate sitemap from same manifest that defines tools/languages/routes.

---

## 15. 90-day roadmap

### Days 1–15 — Truth & foundation repair
**Research:** Repo/MCP audit, GSC+GA4 baseline, tool-completion metrics, top UX blockers, language shortlist.
**Build:** Event adapter + initial tool instrumentation (after consent/privacy review). Fix the 128-vs-78 count via single source of truth. GitHub About/topics/docs. ES/DA translation QA. Canonical/hreflang/sitemap validation.
**QA:** Current UX + tool baseline; measurable release gates defined.
**Output:** Baseline docs, KPI dictionary, prioritized defect backlog, experiment registry, phase plan.
**Do not:** Release new locale at scale, publish outreach, rebuild site.

### Days 16–30 — Validate international opportunity + first flagship assets
**Research:** Candidate-market native keyword map, SERP competitors, locale economics, ES/DA comparison.
**Build:** Localized pilot in separate branch after market selection. One shareable low-risk calculator state. **Three flagship linkable assets:** dev JSON/API resource pack · finance compound-interest + percentage teaching pack · PDF browser-side privacy/security technical page.
**QA:** Native copy/function, canonical/hreflang, mobile perf, query/state safety.
**Outreach:** Manually pitch first **20 resource-page prospects**.
**Output:** Market scorecard, 10–20-tool pilot, native review checklist, decision memo.
**Gate:** Publish only after evidence + approval.

### Days 31–60 — Distributed product + outreach scaffolding
**Build:** Functional JSON Formatter extension MVP. Two embeddable calculator pilots. Optional PWA feasibility prototype.
**Connect:** Apollo in **read-only prospecting mode**; enable contact enrichment + email drafts; **Gmail send disabled**.
**Automate:** Weekly competitor backlink-gap jobs (split by category: PDF — Smallpdf/iLovePDF/PDF24/PDF Candy · Calculators — Calculator.net/Omni/Dinkytown · Dev tools — CodeBeautify/JSONFormatter/JSONLint · Conversion — Convertio/CloudConvert). Filter by *why* the link exists; ignore scraped directories.
**Launch:** Platform on Product Hunt; dev subset on DevHunt if eligible; manually test other maker directories.
**Research:** Qualified prospects, host compatibility matrix, niche community rules.
**Content:** 12-week demonstration calendar; initial drafts + scripts.
**QA:** Extension security, embed frame/CSP, privacy, responsive, regression.
**Output:** Unpacked extension, integration demo, outreach drafts, tracking instructions.
**Gate:** No external publication/sends without explicit approval.

### Days 61–90 — Measure, iterate, kill weak bets + controlled sending
**Measure:** First conversion/completion + usage data from approved releases.
**Enable:** Gmail sending **only after** deliverability + compliance + draft quality proven. Review in approval batches: 12 university resource pitches · 8 dev-resource pitches · 5 newsletter/editor · 5 integration proposals. **No "spray 500 emails".** Max 1–2 follow-ups. Stop immediately on opt-out/no.
**Decide:** Expand/halt locale pilot; advance/reject extension; scale/revise embed partners.
**Research:** Optional npm/CLI/MCP RFC if dev signals justify.
**PR:** Campaigns around original data/benchmarks, not "we launched 128 tools."
**Output:** Experiment results, updated strategy, next-quarter allocation, revised dashboard + backlog.

### Realistic 90-day KPI targets

| Metric | 90-day target |
|---|---:|
| Qualified prospects researched | 500–1,000 |
| Manually approved outreach contacts | 100–200 |
| High-quality personalised emails | 80–150 |
| Positive/relevant replies | 8–20% |
| Editorial/resource links won | 10–30 |
| Highly relevant `.edu`/institutional links | 2–8 |
| Partnerships/embeds | 3–10 |
| New referring domains | 20–50 |
| Referral sessions from won placements | rising MoM |
| GSC non-brand clicks | +20–50% from baseline (if indexation/content quality healthy) |
| New spam/community violations | **0** |
| Opt-outs ignored | **0** |

These are operating targets, not guarantees. Recalibrate after first month of GSC/Ahrefs baseline data.

### Budget posture
Lean build runs on existing eng + GSC + web research + CRM, adding Ahrefs when budget permits. Operating stack likely needs Ahrefs + optional Apollo credits + orchestration runtime + human editorial/outreach time. **Wrong spend:** "50 DR70 dofollow links" (Google treats paid ranking-credit links as spam).

### Connection order (deliberate)
1. **GSC — read-only**
2. **Ahrefs MCP — read-only**
3. Apollo — prospect/contact search only
4. GitHub action — read + draft PR
5. Cloudflare — read-only analytics
6. Gmail — draft-only
7. Gmail — send (only after approval workflow tested)

Gmail is last. Discovery quality is the hard problem; sending is the easy part — and the easiest to abuse.

---

## 16. Implementation backlog (unified from both docs)

| ID | Pri | Action | Output | Done when |
|---|---|---|---|---|
| GROW-001 | P0 | Repo + MCP audit | Evidence-backed report | Source state + access verified |
| GROW-002 | P0 | GSC/GA4 baseline | 28/90-day or documented blockers | Sources/windows/limits disclosed |
| GROW-003 | P0 | UX release blockers | Repro/test matrix + focused fixes | Critical journeys pass |
| GROW-004 | P0 | Event dictionary + instrumentation | Shared adapter + tests | Tool successes measured w/o PII |
| GROW-005 | P1 | Local-language market research | Native query + SERP dataset | Ranked w/ evidence + unknowns |
| GROW-006 | P1 | One-locale 10–20-tool pilot | Branch + localized pages + tests | Native QA, parity, URLs verified |
| GROW-007 | P1 | Favorites/recents audit | Focused improvement or no-change memo | No regression to localized favorites |
| GROW-008 | P1 | Shareable low-risk calculator | Working controlled link flow | Rehydrates correctly; no private values |
| GROW-009 | P1 | JSON extension MVP | Unpacked MV3 package | Local JSON format; narrow perms |
| GROW-010 | P1 | Two calculator embeds | Embeddable pages/snippets | Securely works on sample partner |
| GROW-011 | P1 | Partner database | Verified use-case-matched prospects | Sources valid; no nonpublic data |
| GROW-012 | P1 | Outreach draft pack | Localized tailored drafts | Owner has unsent reviewable drafts |
| GROW-013 | P2 | Community research | Rule-aware opportunity map | No autonomous posts |
| GROW-014 | P2 | 12-week video calendar | Scripts + UTM plan | Exact tool/demo + measurement for each |
| GROW-015 | P2 | PWA feasibility | Tested offline/install prototype OR rejection memo | Cache/update risk documented |
| GROW-016 | P2 | JS package / CLI / MCP RFC | Single prioritized prototype RFC | Demand + maintenance + security evidenced |
| GROW-017 | P2 | Monetization research | Revenue/UX risk assessment | No live ads/payments changed |
| GROW-018 | P0 | Independent release gate | All affected feature test evidence | No unsupported "verified" claims |
| GROW-019 | P1 | Post-launch experiments | Decision dashboard | Keep/iterate/kill based on real data |
| GROW-020 | P0 | **Fix 128-vs-78 count inconsistency** | Single source of truth generator | Homepage / FAQ / press sync |
| GROW-021 | P0 | **ES/DA translation QA** | Fixed accents + idioms audit | Native reviewer sign-off |
| GROW-022 | P0 | **GitHub repo About + topics + docs** | README/About/topics updated | Discoverable repo metadata |
| GROW-023 | P0 | **Remove `node_modules` from source control** | Clean repo + deterministic manifest | Verified clean history/ignore |
| GROW-024 | P1 | **Opportunity DB + CRM schema** | Running DB + dedupe + audit log | Schema deployed; agents write audited |
| GROW-025 | P1 | **Approval gateway + token hashing** | Service + UI + suppression list | Every irreversible action gated |
| GROW-026 | P1 | **Agent orchestrator + scheduler** | Running runtime | Cron jobs for read-only agents |
| GROW-027 | P1 | **Flagship linkable assets (3)** | Dev JSON pack + Finance teaching pack + PDF privacy page | Published + indexed |
| GROW-028 | P1 | **First 20 resource-page outreach batch** | Reviewed, approved, manually sent | Replies tracked in CRM |
| GROW-029 | P2 | **Backlink-gap weekly job** | Report in CRM w/ scored opportunities | 4 weekly runs completed |
| GROW-030 | P2 | **Product Hunt / DevHunt platform launch** | Launch page + founder profile | Launched with real metrics |

For every item track: `status · files changed · PR/branch · tests · evidence · remaining blockers · owner decision · next step`.

---

## 17. Sample experiments

### EXP-001 — Direct returning usage from homepage quick access
Hypothesis: clearer favorites/recents affordance increases repeat tool starts.
Audience: consented returning EN/ES/DA.
Primary: tool starts per return visit.
Guardrails: completion rate, CLS, support complaints.

### EXP-002 — New locale vs existing-market improvement
Hypothesis: small native-language cluster beats comparable ES/DA improvements on cost per successful completion.
Compare: build/QA cost, qualified acquisition, completion rate, maintenance.
Caution: SEO lag; several channels; avoid 7-day conclusions.

### EXP-003 — Embeddable percentage calculator
Hypothesis: selected publisher partners generate incremental embed operations + qualified referrals.
Primary: verified embed ops OR qualified referrals (chosen in advance).
Guardrails: host usability, privacy, support, frame issues.
Caution: embed op ≠ visit.

### EXP-004 — JSON extension
Hypothesis: narrow extension delivers recurring developer usage more efficiently than generic new tool.
Primary: weekly active extension operations (only if measurable without invasive tracking).
Guardrails: uninstalls/complaints, permission clarity, error rate.

### EXP-005 — Practical videos
Hypothesis: problem-specific demos > generic brand promo.
Primary: completions per measurable campaign session.
Guardrails: production effort, audience mismatch, low retention.

---

## 18. Release-gate matrix

| Gate | Minimum evidence | Pass condition |
|---|---|---|
| Repository safety | git status, diff, branch/SHA | No unrelated work lost |
| Existing tests | Repo test runner + suite count | Previously-passing tests still pass |
| HTML / link integrity | HTML + link validators | No new broken links / critical validation failures |
| Functional E2E | Key actions for all affected tools | Correct result, errors, copy/download, reset |
| Multilingual regression | EN/ES/DA + pilot locale | Correct text/links/calculations |
| Responsive UI | 320–2560 px set | No clipped menus / horizontal overflow / unusable actions |
| Accessibility | Keyboard/SR + contrast | No new critical a11y issue |
| Privacy/security | Event payload inspection + secrets scan | No sensitive data transmitted or committed |
| Performance | Same-test pre/post benchmarks | No material regression unless justified |
| SEO routes | Canonical/hreflang/sitemap check | Correct URLs, indexable pages only |
| Rollback | Revert/deploy plan | Reversible release |

Distinguish `PASS · FAIL · BLOCKED · NOT TESTED`. "Tests pass" = actual recorded run.

---

## 19. Owner approval matrix

| Action | Autonomous? | Owner approval? |
|---|---|---|
| Read repo + public site | Yes | No |
| Local tests/screenshots/perf | Yes | No |
| Approved read-only analytics | Yes (within permitted access) | No further unless perms need |
| Free public keyword research (ToS-respecting) | Yes | No |
| Fee-based keyword APIs | No | **Yes, before cost** |
| Local branch + propose PR | Yes (if repo policy permits) | Yes before merge/deploy |
| Change prod tracking/consent | No | **Yes** |
| Publish new language pages / sitemap change | No | **Yes** |
| Submit extension to store | No | **Yes** |
| Public embed/third-party integration launch | Stage locally first | **Yes** |
| Send individual or bulk outreach | Draft-only | **Yes, exact recipients + copy** |
| Post to Reddit/Quora/GH discussions | Draft-only | **Yes, human post** |
| Publish videos/social | Draft-only | **Yes** |
| Purchase domains/services/tools | No | **Yes** |
| Change live ads / add payments | No | **Yes** |
| Force-push, reset, delete, discard | No | **Do not perform** |
| Claim rollout success / revenue win | Only with measured evidence | Must be evidence-supported |

---

## 20. Feature-branch plan

Suggested streams (rename if branches already exist):
```
feat/growth-baseline-and-tracking
feat/growth-retention-and-sharing
feat/growth-localization-pilot
feat/growth-embed-pilot
feat/growth-json-extension
feat/growth-asset-flagships
feat/growth-crm-and-approval-gateway
feat/growth-count-sources-of-truth
feat/growth-translation-qa-es-da
feat/repo-metadata-and-topics
```

One small scoped PR per independently deployable feature. Include test evidence, screenshot/viewport proof, rollback plan, affected routes. **No merge/deploy without approval.**

---

## 21. Deliverable file tree (suggested — respect `CLAUDE.md`)

```
docs/growth/
  README.md
  COMBINED_GROWTH_MASTER_PLAN.md           ← this file
  GROWTH_TRACKING.xlsx                     ← companion tracker
  00-EXECUTIVE-BASELINE.md
  01-REPOSITORY-AND-MCP-AUDIT.md
  02-TOOL-AND-LOCALE-INVENTORY.csv
  03-LIVE-UX-RELEASE-GATE.md
  04-BASELINE-DATA-GAPS.md
  05-RISKS-DEPENDENCIES-AND-APPROVALS.md
  10-ANALYTICS-TRACKING-PLAN.md
  11-EVENT-DICTIONARY.csv
  12-EXPERIMENT-REGISTRY.csv
  20-LANGUAGE-MARKET-SCORECARD.csv
  21-NATIVE-KEYWORD-RESEARCH.csv
  22-COMPETITOR-OPPORTUNITIES.csv
  23-LOCALIZATION-PILOT-SPEC.md
  30-RETENTION-AND-SHARING-SPEC.md
  40-JSON-EXTENSION-RFC.md
  41-EXTENSION-SECURITY-AND-STORE-CHECKLIST.md
  50-EMBED-SPEC.md
  51-EMBED-PARTNER-GUIDE.md
  60-PARTNER-PROSPECTS.csv
  61-OUTREACH-DRAFTS.md
  62-COMMUNITY-DISTRIBUTION-MAP.csv
  63-VIDEO-CONTENT-CALENDAR.csv
  70-PWA-FEASIBILITY.md
  71-DEVELOPER-INTEGRATION-RFC.md
  80-MONETIZATION-OPTIONS.md
  90-ROADMAP-AND-PRIORITY-BACKLOG.md
  91-TEST-EVIDENCE-AND-RELEASE-GATES.md
  92-OWNER-APPROVAL-QUEUE.md
  99-FINAL-EXECUTION-REPORT.md
```

No empty placeholders marked complete. Blocked sources get explicit `BLOCKED` note + exact next steps. Do not commit private contact lists, sensitive analytics, or credentials to the public repo.

**Main deliverable:** `99-FINAL-EXECUTION-REPORT.md` — actual branch/commit refs, what was implemented, test outputs, data-derived findings, rejected ideas, approval queue, open failures, next actions.

---

## 22. Evidence standard

For every significant external claim:
```yaml
claim: "..."
source_title: "..."
source_url: "https://..."
source_type: "official_documentation | analytics | primary_research | independent_review | other"
source_date: "YYYY-MM-DD or unknown"
accessed_at: "YYYY-MM-DD"
market: "e.g. Brazil"
locale: "pt-BR"
tool_cluster: "percentage-calculators"
methodology: "how measured"
confidence: "high | medium | low"
limits: "sampling / coverage / bias"
```

### Interpretation rules
- W3Techs website-language % is **not** keyword difficulty.
- Country internet-user counts are **not** tool search volume.
- Google Trends 0–100 is **not** absolute volume.
- Ahrefs DR / Moz DA are third-party model scores, **not** Google ranking factors.
- A prominent SERP result is **not** proof of traffic.
- Hearsay user complaints are **not** evidence.
- Translated boilerplate is **not** meaningful localization.
- Post-release traffic jumps do **not** prove causation; report controls + other influences.

---

## 23. Authoritative references

- Google Search Central — Multilingual and multiregional sites
- Google Search Central — Localized versions / hreflang
- Google Search Console API
- Google Analytics 4 — Events
- Google Analytics — Avoid sending PII
- Chrome Web Store — Extension program policies
- Chrome Web Store — Quality guidelines
- Chrome Extensions — Manifest V3 overview
- MDN — Making PWAs installable
- MDN — `postMessage` security considerations
- MDN — Content Security Policy
- Model Context Protocol docs — https://modelcontextprotocol.io/
- W3C WCAG 2.2
- Web.dev Core Web Vitals
- Ahrefs hosted MCP
- Apollo MCP — `https://mcp.apollo.io/mcp`
- Cloudflare MCP — `https://mcp.cloudflare.com/mcp`

---

## 24. Exact execution sequence

### Step A — Orientation
1. Read project rules + memory.
2. Inspect repo + open defects + git status.
3. Check MCP profile + read-only analytics connectivity.
4. Summarize scope + contradictions; respect higher-priority repo rules.

### Step B — Baseline
1. Query GSC first (if connected).
2. Query GA4/analytics (if connected).
3. Establish event gaps + tool-success taxonomy.
4. Run independent critical tool/UX validation.
5. Prioritize foundational defects.

### Step C — Research
1. Test pt-BR / id / tr / vi / pl / other viable + ES/DA.
2. Build native-keyword + competitor datasets.
3. Score opportunities transparently.
4. Choose one pilot (evidence-backed) OR defer.

### Step D — Implement low-risk foundation
1. Tracking adapter + targeted tests (privacy/consent compliant).
2. Improve one retention behavior.
3. Prototype one non-sensitive sharing flow.
4. Build one focused embed pilot locally.
5. Prototype JSON extension (approved placement).
6. Localized pilot branch only when research + quality gates permit.

### Step E — Distribution prep
1. Research qualified actual partners.
2. Produce tailored **drafts** (not sent emails).
3. Build rule-aware community map (no live posts).
4. 12-week video calendar with specific demos.
5. Evaluate npm/CLI/MCP + PWA only on measured evidence.

### Step F — Independent verification
1. Baseline + current test suites.
2. Exact tool interactions + locale variants.
3. Privacy/source integrity/responsiveness/a11y/SEO invariants.
4. Pre/post benchmark comparison.
5. Explicit failures + blockers (no generic success prose).

### Step G — Handoff
1. Update repo memory (`.ai-memory/*`) per `AGENTS.md`.
2. Branch list + files changed + test evidence + status per backlog ID.
3. Concise owner-approval queue for external/risky actions only.
4. Next 2-week sprint with expected cost/impact/confidence + rollback.

---

## 25. Final output format (mandatory per phase close-out)

```
A. EXECUTIVE DECISION
   - Top 3 immediate growth levers + why
   - What NOT to build yet
   - First locale to test if defensible; else why blocked

B. DATA AND EVIDENCE
   - GSC date window / results or blocker
   - GA4 date window / results or blocker
   - Priority competitor / native-keyword findings
   - Source links + collection dates + confidence

C. WORK COMPLETED
   - Branches / commits / PRs actually created
   - Files actually modified
   - Features genuinely functional
   - Reused existing (not falsely counted as new)

D. RELEASE GATES
   - Tests actually run (exact PASS/FAIL/BLOCKED)
   - Responsive screenshots / inspection record
   - Localization, privacy/security, SEO invariant results
   - Deployment status

E. GROWTH BACKLOG
   - Next sprint tasks ranked by impact/effort/risk/confidence
   - 90-day roadmap with decision dependencies

F. OWNER APPROVAL QUEUE
   - Exact approvals needed for external/cost actions
   - No blanket permission for autonomous outreach/posting

G. OPEN ISSUES / BLOCKERS
   - What was not completed, why, reproducible next action
```

**Definition of completion:** A plan is not a feature. A prototype is not a production release. An unpacked extension is not a Chrome Web Store listing. A draft is not an email sent. An indexed page is not a ranking win. A visit is not a tool completion. A translated page is not validated localization.

**Do not label any phase complete unless the relevant independent gate has passed with evidence.**

---

**End of combined master plan. Companion tracker: `docs/growth/GROWTH_TRACKING.xlsx`.**
