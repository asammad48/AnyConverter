# AnyConverter.io — 60-Day Aggressive Execution Plan

**Version:** 1.0
**Prepared:** 2026-11-18
**Replaces (operational layer):** the 90-day roadmap in
`COMBINED_GROWTH_MASTER_PLAN.md` §15. The 90-day plan remains the
strategic reference; this document is the **operational sprint cadence**.
**Cadence:** 30 sprints × 2 days = 60 calendar days. **Every sprint
ships something to production** (after passing the pre-deploy SEO
verification gate and owner approval).
**Two parallel tracks:**
- **Track A — Product & SEO** (user engagement + organic ranking).
- **Track B — Backlinks & Distribution** (authority + referral traffic).

**Guardrails that do not relax under time pressure:**
- No deploy without `anyconverter-pre-deploy-seo-verification` PASS and owner approval.
- No fabricated keyword volumes, rankings, outreach replies, or revenue.
- No autonomous email/Reddit/Quora/HN posting. Draft → review → human send.
- No paid API spend (Ahrefs, DataForSEO, Apollo paid tier) without owner approval.
- No scaled machine translation. ES/DA fixes stay in current scope.
- No forced signups, cookie walls, or aggressive popups to inflate engagement.

---

## 1. Success contract (what "aggressive" means here)

| Dimension | Baseline | 60-day target | Hard floor |
|---|---|---|---|
| Weekly Successful Tool Completions (WSTC) | TBD (GSC/GA4 enable required — Sprint S01) | **+40% over week-1 baseline** | +15% |
| Non-brand organic clicks (GSC) | TBD | **+25–45%** vs baseline 28-day window | +10% |
| Striking-distance queries (pos 8–20) climbing to pos ≤5 | TBD | **≥ 25 queries promoted** | ≥ 10 |
| Return-visitor tool completion rate | TBD | **+30%** | +10% |
| Shareable calculator state usage | 0 | **≥ 1,500 generated share links / week** | ≥ 300 |
| PWA install prompt accept rate | 0 | **≥ 2.5%** of eligible sessions | ≥ 1% |
| Editorial referring domains won | 0 | **≥ 12** | ≥ 4 |
| `.edu` / institutional links won | 0 | **≥ 3** | ≥ 1 |
| Embedded calculator partners live | 0 | **≥ 4** | ≥ 2 |
| Prod ship reliability | — | **30/30 sprints shipped on time** | 27/30 |
| Rollback incidents | 0 | **≤ 1** | ≤ 2 |

The **hard floor** is the stop-loss. If after Sprint S10 we are below the
hard floor on two or more metrics, we re-plan — we do not keep pushing
output for its own sake.

---

## 2. How we find low-competition, high-volume keywords
(method, not invented numbers)

Execute **in this order**. Each step produces real evidence or an
explicit `UNKNOWN` label. No invented volumes.

### Step 1 — First-party GSC mining (free, already our data)
1. Pull last complete 28-day GSC export: `query × page × country × device`.
2. Filter: `impressions ≥ P75 AND avg_position BETWEEN 8 AND 25 AND CTR < category_median`.
3. Flag `striking_distance_true` candidates. These are **already
   validated demand** — we know people search them and we already show up.
4. Cluster by tool. Pick top 3 per tool = our first sprint targets.

### Step 2 — Long-tail SERP capture (free)
For each striking-distance query, inspect top-10:
- Who ranks? Tool pages, articles, both?
- What SERP features? (AI Overview, PAA, snippet, images)
- What specific long-tail variants appear in PAA / "related searches"?

Record `evidence_url` + `snapshot_date`. Treat PAA items as **free
long-tail intelligence**.

### Step 3 — Modifier expansion (free)
Append high-intent, low-competition modifiers that competitors generally
ignore:

```
{keyword} + online
{keyword} + free
{keyword} + no signup
{keyword} + browser
{keyword} + privacy
{keyword} + example
{keyword} + api
{keyword} + step by step
how to {keyword}
{keyword} for {role: developer | student | accountant | writer}
{tool-A} vs {tool-B}
{keyword} without {friction: upload | account | install}
why does my {thing} {error}
```

AnyConverter's genuine privacy / no-signup / browser-side story makes
the `+ privacy / + no signup / + browser / + without upload` modifiers
**differentiated** — not just hopeful.

### Step 4 — Google Trends disambiguation (free)
Use 0–100 index to spot rising vs declining — **never** label the index
"search volume". Favor rising trends with real GSC signal over flat
curves with Ahrefs-only promise.

### Step 5 — Native-language cross-check for existing ES/DA
Repeat Steps 1–3 inside `country=ES, country=MX, country=DK` filters.
Many ES/DA queries are already ranking but under-optimized. These are
the fastest wins in the first 30 days.

### Step 6 — Paid APIs — only if approved and only to supplement
Ahrefs / DataForSEO used **after** steps 1–5 to confirm volumes on the
shortlist. Never used to brainstorm from scratch at this stage.

### Step 7 — Selection rubric
Promote a candidate into the sprint only if:
- Striking-distance or clear intent match **and**
- Credible native modifier **and**
- Existing AnyConverter page (or a 1-sprint build) can genuinely serve
  the intent **and**
- No jurisdiction-specific legal / medical / financial accuracy risk.

---

## 3. 2-day sprint template (applies to every sprint)

**Day 1 (Build day)**
- Pull the sprint card, read `anyconverter-technical-seo` +
  `anyconverter-internal-linking` + relevant upstream skill.
- Implement in a feature branch: `feat/s{NN}-{slug}`.
- Local tests: `node tests/run_all_tests.js` + `npx html-validate` +
  `npx linkinator` on changed pages.
- Draft release notes + rollback plan.

**Day 2 (Ship day)**
- Run `anyconverter-pre-deploy-seo-verification` — all 15 gates.
- Capture evidence in `docs/growth/91-TEST-EVIDENCE-AND-RELEASE-GATES.md`.
- Request owner approval with: branch, SHA, gate report, rollback plan.
- On approval: merge → Cloudflare Pages promotes → smoke test in prod →
  announce in internal channel.
- Any `FAIL`/`BLOCKED` gate = ship is deferred; the sprint becomes a fix
  sprint, and the next sprint absorbs the delay. We do not ship under failing gates.

Sprints are deliberately small so that **"skip and rollback"** is always
cheaper than "push broken."

---

## 4. Track A — Product & SEO: 30 sprints, 60 days

Legend: 🟢 = engagement lever · 🔵 = SEO ranking lever · 🟣 = both.
"KW" = targets a specific cluster of striking-distance keywords from §2 Step 1.

### Week 1 (S01–S03) — Instrumentation + source-of-truth

**S01 · Days 1–2 · 🟣 Enable analytics, fix tool-count inconsistency**
- Ship: enable `google-search-console` + `google-analytics` MCPs; flip
  `"disabled": false`; verify credential paths resolve; capture the
  baseline 28-day GSC + GA4 snapshot into `docs/growth/00-EXECUTIVE-BASELINE.md`.
- Ship: single source-of-truth for tool count. One manifest regenerates
  homepage + FAQ + press count.
- Prod change: regenerated pages with consistent `128+` (or the actual
  number from `TOOL-INVENTORY.json`) everywhere.
- KPI: baseline frozen.

**S02 · Days 3–4 · 🟢🔵 Event adapter + first instrumented tools**
- Ship: shared analytics adapter (`assets/js/shared/analytics.js`) with
  the 16-event dictionary from `anyconverter-pre-deploy-seo-verification`.
- Instrument homepage + top 10 tools by current GSC impressions.
- Privacy gate: no PII, no filenames, no document content.
- KPI: first real `tool_started` + `tool_completed` events flowing to GA4.

**S03 · Days 5–6 · 🔵 GitHub repo metadata + README polish**
- Ship (repo, not site): GitHub "About" + topics + README overhaul.
  Topics: `developer-tools pdf-tools calculators javascript browser-tools
  privacy static-site online-tools`.
- Side effect: discoverability for devs searching GitHub.
- KPI: GitHub repo appears in topic listings.

### Week 2 (S04–S06) — ES/DA quality floor

**S04 · Days 7–8 · 🔵 ES translation drift sweep (batch 1 of 2)**
- Ship: fix `practicos`, `utiles` and similar unaccented / machine-like
  phrases on top-30 ES tool pages by impressions.
- Native reviewer sign-off (contracted / in-house) required before
  merge — **no AI-only localization** even now.
- KPI: ES pages pass `anyconverter-multilingual-seo` audit.

**S05 · Days 9–10 · 🔵 DA translation drift sweep + hreflang repair**
- Ship: fix `nar`, `daekker`, `vaelge` and partners on top-30 DA pages.
- Repair hreflang reciprocity across EN/ES/DA for the 60 pages touched
  in S04+S05. All sets include self + `x-default`.
- KPI: 0 hreflang errors on changed pages (GSC International Targeting
  gone; use URL Inspection).

**S06 · Days 11–12 · 🔵 Sitemap rebuild from manifest**
- Ship: sitemap generator that emits `<xhtml:link>` alternates for
  every tool × every locale that actually exists. No dangling URLs.
- Submit regenerated sitemap to GSC (owner-approved).
- KPI: GSC Sitemap report shows 100% discovered URLs 200-OK, none
  excluded by `noindex`/duplicate.

### Week 3 (S07–S09) — Striking-distance wins (fastest ranking lift)

**S07 · Days 13–14 · 🔵 KW: Top 10 striking-distance title+description rewrites (EN)**
- Ship: title + meta description rewrites for the 10 highest-impression
  `pos 8–20, CTR < median` pages. Use SERP PAA + top-ranking patterns.
- Rule: preserve `[Tool Name] Online Free | AnyConverter` format; refine
  the tool name / modifier on the left side.
- KPI target over 2–4 weeks: ≥ 4 of 10 pages improve by ≥ 3 positions.

**S08 · Days 15–16 · 🟣 KW: FAQ expansion on the same 10 pages**
- Ship: add 4–6 real FAQ Q&A per page using actual PAA queries. Visible
  text + `FAQPage` JSON-LD with verbatim parity.
- Engagement: FAQ expands users' understanding, reduces bounce.
- KPI: SERP eligibility for FAQ-rich results (Rich Results Test green).

**S09 · Days 17–18 · 🔵 KW: Striking-distance for ES + DA**
- Ship: title + description + FAQ pattern applied to the top-10
  striking-distance pages in each of ES and DA.
- Rule: native copy; no translated-from-EN boilerplate.
- KPI: non-brand clicks from `country=ES` + `country=DK` trending up in GSC.

### Week 4 (S10–S12) — Engagement: favorites, recents, workflow chains

**S10 · Days 19–20 · 🟢 Favorites UX upgrade + cross-locale persistence**
- Ship: favorites that survive language switch (key by canonical tool
  slug, not URL); accessible focus states; keyboard support.
- KPI: `favorite_added` + `favorite_removed` events; ≥ 15% of return
  visitors add ≥ 1 favorite within 60 days.

**S11 · Days 21–22 · 🟢 Recents carousel on homepage**
- Ship: "Recently used" row on homepage, localStorage-backed, ring buffer
  of last 8. Accessible, keyboard navigable, works across locales.
- KPI: ≥ 25% of return sessions click a recents tile.

**S12 · Days 23–24 · 🟢🔵 Tool-to-tool workflow chain: JSON group**
- Ship: contextual "Next step" prompt at the end of JSON Formatter:
  → JSON Compare → JSON→CSV → JSON→YAML. Non-interruptive — appears
  only after a successful operation.
- SEO benefit: reinforces the JSON hub; internal linking density up.
- KPI: ≥ 8% of successful JSON Formatter sessions chain into a second tool.

### Week 5 (S13–S15) — Shareable state + install

**S13 · Days 25–26 · 🟢🔵 Shareable calculator state — Percentage Calculator (EN only)**
- Ship: `/percentage-calculator/?v=1&a=…&b=…` with signed, versioned,
  **non-sensitive** params + explicit Share button. No autoshare.
- SEO: canonical remains `/percentage-calculator/`; parameterized URL
  is `noindex` via `robots` meta on the parameterized state.
- KPI: ≥ 300 share links generated / week by end of month 1.

**S14 · Days 27–28 · 🟢 Shareable state — Date Difference Calculator (EN + ES + DA)**
- Ship: same pattern applied to date-diff; locale-aware formatting.
- KPI: share generation in each locale.

**S15 · Days 29–30 · 🟢🔵 PWA manifest + install prompt (homepage + top 5 tools)**
- Ship: web app manifest, required icons, `theme-color`, scoped service
  worker (homepage + 5 tools only — no blanket cache). Install prompt
  appears once per user, deferred until after first successful completion.
- Rule: full site still works without SW; no stale HTML risk.
- KPI: ≥ 2.5% install-prompt accept rate on eligible sessions.

### Week 6 (S16–S18) — Internal linking, hubs, orphans

**S16 · Days 31–32 · 🔵 Orphan fix pass + related-tools reciprocity**
- Ship: scan against `RELATED_TOOLS_COMPLETE_MAPPING.json`; fix every
  tool reachable from < 2 paths. Add reciprocal related-tool entries.
- KPI: 0 orphan tools; every related-tool link reciprocal.

**S17 · Days 33–34 · 🔵 Category hub depth upgrade — PDF**
- Ship: 150-250 words original intro per subsection (merge, split,
  compress, convert). `CollectionPage` + `ItemList` JSON-LD listing
  all PDF tools. Breadcrumbs with `BreadcrumbList`.
- KPI: hub ranks for `pdf tools online` / `free pdf tools` cluster.

**S18 · Days 35–36 · 🔵 Category hub depth upgrade — Developer tools + Calculators**
- Ship: same pattern for `/developer-tools/` and `/calculators/`.
- KPI: hub rankings up, hub → tool click-through up.

### Week 7 (S19–S21) — Core Web Vitals + a11y pass

**S19 · Days 37–38 · 🔵 CWV pass on top 20 tools**
- Ship: inline critical CSS where missing, `font-display: swap` where
  missing, explicit `width`/`height` on images, defer every script,
  prune per-tool CDN libs that leaked into `shared.js`.
- KPI: LCP < 2.5s, INP < 200ms, CLS < 0.1 on all 20.

**S20 · Days 39–40 · 🟢 Accessibility sweep — keyboard + ARIA**
- Ship: tab order, focus visible, ARIA labels for icon buttons, error
  announcements, contrast ≥ 4.5:1 on all affected components.
- KPI: no WCAG 2.2 AA blockers on changed pages.

**S21 · Days 41–42 · 🟣 Mobile gesture + viewport pass (320–390 px)**
- Ship: fix any horizontal overflow, clipped menus, invisible action
  buttons flagged in `UX_SITEWIDE_DEFECT_REGISTER.md`.
- KPI: 0 critical mobile defects on top 30 tools.

### Week 8 (S22–S24) — AEO/GEO + schema depth

**S22 · Days 43–44 · 🔵 AI-citeable "How it works" content (dev tools)**
- Ship: 200–400 word concise fact + structured-answer blocks on top 10
  developer tools (JSON Formatter, Compare, CSV→SQL, Regex, etc.),
  following `ai-seo/references/content-patterns.md`.
- KPI: appearance in AI Overviews / ChatGPT / Perplexity citations (manual
  check weekly; cannot be automated at scale).

**S23 · Days 45–46 · 🔵 FAQ schema expansion to top 30 pages**
- Ship: FAQ visible + `FAQPage` JSON-LD on 30 pages; parity audit in gate G12.
- KPI: more rich-result eligibility.

**S24 · Days 47–48 · 🔵 BreadcrumbList schema sitewide + robots/_headers audit**
- Ship: BreadcrumbList on every tool; verify `_headers`, `_redirects`,
  HSTS, CSP compatible with AdSense + CDN libs.
- KPI: 0 header-policy regressions.

### Week 9 (S25–S27) — Workflow chains + engagement push

**S25 · Days 49–50 · 🟢 Workflow chain: PDF group**
- Ship: PDF Merge → Split → Compress → Convert with preserved file
  context across tools where technically safe (session-scoped,
  memory-only; never persisted).
- KPI: ≥ 8% of successful PDF Merge sessions chain into a second PDF tool.

**S26 · Days 51–52 · 🟢 Workflow chain: Text group (Word Count → Case → Diff)**
- Ship: same contextual "next step" pattern for text tools.
- KPI: adoption; no distraction from primary task.

**S27 · Days 53–54 · 🟢🔵 Dark/light persistence + keyboard shortcuts**
- Ship: theme persisted across sessions; shortcuts (`?` opens help, `/`
  focuses search, `Esc` exits fullscreen). Shortcut discovery in a
  modal reached from `?`.
- KPI: ≥ 10% of return sessions use at least one shortcut.

### Week 10 (S28–S30) — Content depth + consolidation

**S28 · Days 55–56 · 🔵 KW: expansion into `+ privacy / + browser / + no signup` modifiers**
- Ship: add dedicated "Privacy" section to top 10 tools whose SERP has
  privacy-conscious intent (document, file, OCR, invoice tools).
  Technically verifiable claims only (no exaggeration).
- KPI: ranking for `{tool} + privacy` / `{tool} + no signup` modifiers.

**S29 · Days 57–58 · 🔵 Internal link audit sitewide + sitemap refresh**
- Ship: internal link graph export; fix any broken, misdirected, or
  stale link introduced during the 60 days. Regenerate sitemap.
- KPI: 0 broken internal links.

**S30 · Days 59–60 · 🟣 60-day retrospective ship: dashboard + decisions**
- Ship: `docs/growth/99-FINAL-EXECUTION-REPORT-60D.md` with the
  measured delta per metric from §1, plus a "keep / iterate / kill"
  decision per sprint's lever, plus next-60 plan.
- Prod change: only validated winners stay enabled; losers reverted or
  gated behind a feature flag off.

---

## 5. Track B — Backlinks & Distribution: 60 days (runs in parallel)

Backlinks move at a slower natural cadence than product ships. We
operate in **5-day loops** instead of 2-day sprints: research → verify
→ draft → approve → send/post. Each loop ends with 0–N placements won
and a measured reply rate.

### Non-negotiable rules
- **Draft-only outreach until Day 31.** Days 1–30 build the pipeline;
  Days 31–60 do approved sending.
- **One channel per prospect.** No parallel email + LinkedIn + Twitter
  pressure — reads as spam.
- Suppression list (`never_contact`) checked on every proposed send.
- Zero autonomous Reddit / Quora / HN / GitHub-issue posts. Ever.
- Zero paid-link purchases. Google's spam policy explicitly flags
  paid ranking-credit links.
- All university / resource-page pitches must reference the
  **specific existing page** we want to be added to — not a generic
  "please link to us".

### Loop 1 · Days 1–5 · Foundation (no outreach yet)
- Fix tool-count inconsistency (also S01) so press kit + outreach are credible.
- Update GitHub About + topics + README (also S03) — the dev community
  looks at the repo before clicking a pitch.
- Stand up the CRM (opportunity DB) with the schema from
  `COMBINED_GROWTH_MASTER_PLAN.md` §12. Local SQLite is fine.
- Load the 23 priority prospects from
  `docs/growth/GROWTH_TRACKING.xlsx::Prospects` as `relationship_status=Prospect`.

### Loop 2 · Days 6–10 · Flagship linkable asset #1 — Developer JSON/API resource pack
- Build and ship a public page/section `/resources/json-toolkit/` with:
  - Tested, realistic JSON test fixtures (small, medium, large,
    malformed, Unicode, deeply-nested, oversized).
  - Side-by-side demo links to JSON Formatter / Compare / JWT /
    YAML converter.
  - A permissively-licensed CodeSandbox / Replit embed showing programmatic
    use of the fixtures.
- Why: Duke CS, Johns Hopkins SE, UW CSE prospects already recommend a
  JSON formatter — this asset is what we pitch them to replace or add.

### Loop 3 · Days 11–15 · Flagship linkable asset #2 — Finance teaching pack
- Build `/resources/percentage-and-compound-interest-teaching-pack/`:
  - Printable worksheet + answer key (PDF, under 500 KB).
  - Interactive explainer with the embedded calculators (from S13).
  - Bibliography of methodology references.
- Why: university financial-literacy prospects (Stockton, UC, UCSD,
  Sullivan, UNG) want shareable teacher-ready resources.

### Loop 4 · Days 16–20 · Flagship linkable asset #3 — Browser-side privacy technical page
- Build `/how-it-works/browser-side-processing/`:
  - What leaves the device, what does not, per tool category.
  - Network behavior (CDN list, exceptions like FX / IP lookup).
  - CSP, extension vs web-tool, limits.
  - **Technically verifiable** — we're happy to be audited.
- Why: SIUE PDF-tools article, dev prospects, and PR journalists value
  this story more than any "we have 128 tools" brag.

### Loop 5 · Days 21–25 · Approved outreach batch #1 (universities — 20 prospects)
- 15 university resource-page pitches using Template `T-UNI-01` from the
  tracker's Templates sheet. Each references a specific existing
  resource page we found.
- 5 developer-educator pitches using `T-DEV-01` (Duke CS, Johns Hopkins
  SE, UW CSE, Cornell BentoPDF, one open candidate).
- **Send mode:** owner reviews every email + recipient; manual send via
  a personal mailbox (not bulk sender) to preserve deliverability.
- Expected: 2–4 editorial resource links won by end of Loop 6.

### Loop 6 · Days 26–30 · Product Hunt + DevHunt launch prep + Peerlist
- Prepare the platform launch kit: taglines, GIF demo (≤ 10 s), hero
  image at 240×240 PNG, maker comment, Q&A pre-drafts.
- Prepare the DevHunt dev-tools subset page.
- Register Peerlist Launchpad founder profile.
- **Do not launch yet.** We want the flagship assets + striking-distance
  SEO wins visible when launch traffic hits.

### Loop 7 · Days 31–35 · Platform launch
- **Product Hunt launch** on a Tuesday–Thursday (best engagement window).
- **DevHunt launch** 48h later to avoid same-day cannibalization.
- **Peerlist launch** same week as Product Hunt.
- Announce in dev / maker communities **where our account is already a
  genuine participant** (if we have none, we skip this channel — do not
  manufacture presence).
- Expected: 300–800 qualified visits; 1–3 new referring domains organically.

### Loop 8 · Days 36–40 · Approved outreach batch #2 (more universities + integration partners)
- 12 more university resource-page pitches (next priority 12 from the
  tracker).
- 4 integration-partner pitches using `T-INT-01` — target blogs with
  explain-first-then-calculate structure (education publishers,
  retail-pricing tutorial sites).
- 4 broken-link pitches using `T-BRK-01` — only where we found a real
  broken link via the broken-link hunter agent (or manual scan).
- Follow-up pass on Batch #1 non-responders — **max one follow-up**,
  seven days after the first email, polite subject line, stop on no reply.

### Loop 9 · Days 41–45 · Original benchmark study publication + PR
- Publish `/resources/browser-pdf-compression-benchmark/` with public
  methodology + test corpus. Report quality vs speed tradeoffs across
  devices / file types.
- Pitch to 10 publications / newsletters that cover web-dev / PDF /
  productivity. Journalist outreach only, draft-only sending, one email
  per outlet.
- Expected: 1–3 editorial mentions; blog chatter; backlinks naturally.

### Loop 10 · Days 46–50 · Embed partner pilots
- Live embeds on 2–4 publisher sites using the `/embed/` route built in
  Track A S13–S14. Attribution: subtle brand only, no forced
  keyword-rich link.
- Record `embed_loaded` + `embed_operation_completed` per partner host
  (consent-respecting).
- KPI: ≥ 2 partners show weekly operation activity.

### Loop 11 · Days 51–55 · Open-source micro-library seed
- Extract 1–2 tested pure functions (percentage math, slope conversion,
  CSV parsing helpers) into a small MIT-licensed npm package
  `@anyconverter/{utility-name}` **with the owner's approval**.
- Publish a minimal README + test suite + example. Link back from the
  web tool, not the other way around (the package stands on its own).
- Expected: GitHub stars, slow but durable dev-community discovery.

### Loop 12 · Days 56–60 · Measure + plan next 60
- Export CRM: prospects pitched, replies, placements, link-attribute,
  indexed status (via link-validator agent).
- Compute cost per editorial link; compare to budget scenario.
- Rank channels by qualified referral sessions / editorial link / effort.
- Produce `docs/growth/99-FINAL-EXECUTION-REPORT-60D.md` backlink
  section with explicit keep / iterate / kill per channel.

---

## 6. Side-by-side calendar (all 30 sprints)

| Sprint | Day | Track A — Product/SEO ship | Track B — Backlink activity | Pre-deploy gate |
|---|---|---|---|---|
| S01 | 1–2 | Enable GSC + GA4; tool-count manifest | Loop 1 CRM standup | G1–G11 |
| S02 | 3–4 | Event adapter + 10 tools instrumented | Loop 1 import 23 prospects | G1–G9, G11 |
| S03 | 5–6 | GitHub About + topics + README | Loop 1 complete | — (repo-only) |
| S04 | 7–8 | ES translation drift batch 1 | Loop 2 build Dev JSON pack (dev) | G1–G13 |
| S05 | 9–10 | DA translation drift + hreflang repair | Loop 2 complete | G1–G13 |
| S06 | 11–12 | Sitemap regen + GSC resubmit | Loop 3 build Finance teaching pack (dev) | G1–G12 |
| S07 | 13–14 | KW title/description rewrite ×10 (EN) | Loop 3 continue | G1–G12 |
| S08 | 15–16 | FAQ expansion on same 10 pages | Loop 3 complete | G1–G13 |
| S09 | 17–18 | Striking-distance for ES + DA | Loop 4 build Privacy page (dev) | G1–G13 |
| S10 | 19–20 | Favorites UX upgrade | Loop 4 continue | G1–G13 |
| S11 | 21–22 | Recents carousel | Loop 4 complete | G1–G13 |
| S12 | 23–24 | Workflow chain: JSON | Loop 5 send Batch #1 (owner-approved) | G1–G13 |
| S13 | 25–26 | Shareable Percentage link | Loop 5 reply tracking | G1–G13 |
| S14 | 27–28 | Shareable Date-Diff link | Loop 5 complete | G1–G13 |
| S15 | 29–30 | PWA manifest + install prompt | Loop 6 Product Hunt kit | G1–G14 |
| S16 | 31–32 | Orphan fix + related reciprocity | Loop 6 continue | G1–G13 |
| S17 | 33–34 | Hub depth: PDF | Loop 6 complete | G1–G13 |
| S18 | 35–36 | Hubs: Dev tools + Calculators | **Loop 7 Product Hunt launch** | G1–G13 |
| S19 | 37–38 | CWV pass top 20 | Loop 7 DevHunt + Peerlist | G1–G10, G11 |
| S20 | 39–40 | A11y keyboard + ARIA | Loop 7 complete | G1–G13 |
| S21 | 41–42 | Mobile 320–390 px pass | Loop 8 Batch #2 send | G1–G13 |
| S22 | 43–44 | AI-citeable dev content | Loop 8 continue | G1–G13 |
| S23 | 45–46 | FAQ schema top 30 | Loop 8 complete | G1–G13 |
| S24 | 47–48 | BreadcrumbList + headers audit | Loop 9 benchmark study publish | G1–G13 |
| S25 | 49–50 | PDF workflow chain | Loop 9 PR outreach | G1–G13 |
| S26 | 51–52 | Text workflow chain | Loop 9 complete | G1–G13 |
| S27 | 53–54 | Theme persist + shortcuts | Loop 10 Embed partner 1–2 live | G1–G13 |
| S28 | 55–56 | Modifier expansion `+ privacy / + browser` | Loop 10 Embed partner 3–4 | G1–G13 |
| S29 | 57–58 | Internal link audit + sitemap refresh | Loop 11 NPM seed publish (approved) | G1–G13 |
| S30 | 59–60 | 60-day retro ship + dashboard | Loop 12 measure + next-60 plan | G1–G13 |

---

## 7. Specific keyword-cluster sprints (where ranking wins live)

These are the **types of clusters** each KW-labeled sprint targets.
Actual queries are chosen from GSC in Step 1 of §2 — we will NOT list
invented queries here.

| Cluster | Why low-competition at scale | AnyConverter angle |
|---|---|---|
| `{tool} online` / `{tool} online free` | Mature generic but AnyConverter already ranks adjacent | Title + description nudge + FAQ |
| `{tool} no signup` / `{tool} without signup` | Genuinely under-targeted by incumbents | We actually require no signup; truthful differentiation |
| `{tool} in browser` / `{tool} browser based` | Very intent-rich | Matches our client-side story |
| `{tool} privacy` / `{tool} without upload` | Intent-rich, low overlap with hosted-service incumbents | Verifiable technical claim |
| `how to {task} + {role: developer / student / accountant}` | Long-tail, low difficulty | How-to section + tool link |
| `{tool-A} vs {tool-B}` | Comparison intent, genuinely useful | Only honest comparisons; no fake reviews |
| `{error-term} + {tool}` ("JSON unexpected token", "CSV quote escape") | Debugger intent, near-zero commercial competition | FAQ + How-it-works section |
| Native-language variants of all of the above in ES/DA | ES/DA competitor density far lower than EN | Match native phrasing, not translated-from-EN |
| `{task} + example` ("compound interest example") | Educational intent | Teaching pack (Loop 3) + tool link |
| `{task} + api` (where we expose a utility fn) | Dev intent | npm micro-lib (Loop 11) |

Rule of thumb: **long-tail multi-modifier queries typically have
difficulty 0–10 and still convert**. We will not target generic
single-word queries like "pdf tool" during 60 days.

---

## 8. Hard risks & how we handle them in 60 days

| Risk | Mitigation inside the 60-day plan |
|---|---|
| Deploy failure every 2 days | Small scoped PRs; pre-deploy gate blocks on FAIL; rollback plan on every sprint |
| ES/DA regressions | Native reviewer sign-off (S04, S05); G6 multilingual regression gate |
| PWA stale HTML / cross-origin surprises | Narrow SW scope in S15; versioning + update notification |
| Shareable link leaks sensitive input | Low-risk tools only (S13, S14); versioned signed params; `noindex` on parameterized URLs |
| Outreach deliverability damage | Manual send, personal mailbox, one follow-up max, suppression list |
| Launch-day fire drill | Product Hunt launch at S18 — after hubs, CWV, and translations are clean |
| Platform rule violations (Reddit/Quora/HN) | **Zero autonomous posting** across the full 60 days |
| Metric regression masked by seasonality | Compare to prior 28-day window + previous-year window where GSC supports |
| Owner approval becoming a bottleneck | Batch approval requests (gate report + diff + rollback) once per sprint |
| GSC / GA4 still disabled at S01 | S01 blocks; fallback is file-level audit only; the 60-day metric contract shifts to "+ X since enable date" |

---

## 9. Owner approvals required in the 60 days

- **S01 Day 1:** enable `google-search-console` and `google-analytics`
  MCPs (one-time; read-only).
- **S06 Day 12:** resubmit regenerated sitemap to GSC.
- **S12 Day 24:** send Outreach Batch #1 — Loop 5 (recipients + content).
- **S15 Day 30:** enable PWA install prompt (user-visible change).
- **S18 Day 36:** Product Hunt launch (scheduling + maker account).
- **S19 Day 38:** DevHunt + Peerlist launches.
- **S21 Day 42:** send Outreach Batch #2 — Loop 8.
- **S24 Day 48:** publish benchmark study — Loop 9.
- **S27 Day 54:** go live with embed partner #1 (and #2 later in S27).
- **S29 Day 58:** publish npm package — Loop 11.

Everything else is non-destructive feature-branch work with a gated
merge.

---

## 10. Definition of done for the 60 days

- **30 of 30 sprints shipped** or an explicit go/no-go recorded for each.
- Every ship has a captured pre-deploy gate report with PASS evidence.
- Measured deltas against §1 targets using real GSC / GA4 data windows.
- Decision memo per channel: keep / iterate / kill — grounded in evidence.
- Backlink CRM reflects real prospects, real replies, real placements —
  no fabricated numbers.
- Zero platform-policy violations (Reddit / Quora / HN / Chrome Web Store / email).
- Zero rollbacks that stayed broken for > 60 minutes.

**End of 60-day aggressive plan.**
