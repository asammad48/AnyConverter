# Phase 07 All-Days Execution And Handoff Packet

Generated: 2026-09-12T10:06:03Z
Scope: Phase 07 Measurement, Experiments And Quarter Review, Days 01-14
Evidence log: `deep-research-phase-plan/phase-07-measurement-experiments-quarter-review/phase-07-evidence-log.md`
Local snapshot: `deep-research-phase-plan/phase-07-measurement-experiments-quarter-review/phase-07-local-measurement-snapshot.json`

## Executive Summary

Phase 07 is complete as a measurement and governance package. No production URLs, canonicals, redirects, or page copy were changed.

The repo now has:

- A versioned KPI dictionary.
- A reusable weekly KPI log template.
- A governed experiment register.
- A local measurement snapshot tool and generated JSON snapshot.
- A Week 12 crawl/indexation and cannibalization review protocol.
- A next-quarter recommendation that is evidence-linked and does not make ranking promises.

Current GSC, analytics, CrUX/field CWV, referring-domain, native-review, and outreach outcome evidence remains unavailable. Those values are marked `unknown` or `pending`, not zero.

## Day Outcomes

| Day | Outcome |
|---|---|
| Day 01 | KPI dictionary defined with formulas, sources, dimensions, windows, and unavailable-data behavior |
| Day 02 | Weekly KPI log template created with explicit source/export references |
| Day 03 | GSC weekly review runbook specified |
| Day 04 | Product analytics review runbook specified using the Phase 04 privacy-safe event dictionary |
| Day 05 | CWV/crawl review procedure specified without conflating field data and lab diagnostics |
| Day 06 | Experiment register created |
| Day 07 | Experiment queue ranked, with low-data experiments held |
| Day 08 | Privacy-title experiment protocol defined and held pending evidence/review |
| Day 09 | Example/troubleshooting content-block protocol defined and held pending evidence |
| Day 10 | Contextual internal-link experiment protocol defined and held pending evidence |
| Day 11 | Week 12 regression crawl configuration and artifact convention prepared |
| Day 12 | Cannibalization/opportunity review method prepared |
| Day 13 | Quarter decision meeting packet rehearsed with available evidence and explicit unknowns |
| Day 14 | Next-quarter handoff published |

## Local Measurement Snapshot

Command:

```powershell
node tools\phase07-local-measurement-snapshot.js --json deep-research-phase-plan\phase-07-measurement-experiments-quarter-review\phase-07-local-measurement-snapshot.json
```

Observed local repository state:

| Metric | Value |
|---|---:|
| Sitemap URLs | 342 |
| Sitemap parseable | true |
| Sitemap has `xmlns:xhtml` | true |
| Sitemap alternates | 1356 |
| Local HTML pages | 342 |
| Intended canonical pages | 342 |
| Local `noindex` pages | 0 |
| Local canonical mismatches | 0 |
| Self-canonical pages missing from sitemap | 0 |

Boundary: this is local repository evidence only. It does not prove production indexing, deployed redirects, Google-selected canonical, or crawl status.

Historical GSC artifact observed:

- Directory: `reports/gsc-2026-08-20/anyconverter.io-Performance-on-Search-2026-08-20`
- Export date in path: 2026-08-20
- Filters: Search type Web, Date Last 3 months
- Query rows in export: 1003

Boundary: this dated export is useful for rehearsing calculations. It is not the current baseline for September 12, 2026.

## KPI And Weekly Reporting

Primary artifact:

- `phase-07-kpi-dictionary.md`

Weekly log template:

- `phase-07-weekly-kpi-log-template.csv`

Monday reporting sequence:

1. Run the local snapshot command and attach the JSON.
2. Export GSC Page Indexing and sitemap status.
3. Export GSC Search results Performance for the agreed 28-day window, grouped separately by query, page, country, device, and search appearance when needed.
4. Export analytics events for organic sessions and Phase 04 event names.
5. Export GSC CWV or CrUX field data by page/origin and device.
6. Export or update referring-domain and outreach/contact logs.
7. Populate the weekly KPI log. Use `unknown` when a source was unavailable and `pending` when collection is scheduled but not done.

Important measurement rule: GSC property/page/query/device/country exports can have different aggregation rules. Do not force totals to reconcile across dimensions.

## GSC Review Runbook

Required weekly GSC views/exports:

| Area | Export or observation | Notes |
|---|---|---|
| Page Indexing | Indexed, crawled-not-indexed, discovered-not-indexed, duplicate without selected canonical, alternate with proper canonical, soft 404 | Export current state and date |
| Sitemaps | `https://anyconverter.io/sitemap.xml` status and submitted/discovered URL counts | Do not infer indexing from sitemap alone |
| URL Inspection | Homepage, `/pdf-merge/`, `/pdf-compress/`, `/image-converter/`, `/json-formatter/`, `/word-counter/`, `/typing-speed-test/`, `/redact-pdf/`, `/pdf-metadata-remover/`, one `/es/` page, one `/da/` page | Record Google-selected canonical only from URL Inspection |
| Performance - queries | Query, clicks, impressions, CTR, position | Apply branded filter separately |
| Performance - pages | Page, clicks, impressions, CTR, position | Use for weak CTR and page opportunity review |
| Performance - countries | Country, clicks, impressions, CTR, position | Use for language/country signals |
| Performance - devices | Device, clicks, impressions, CTR, position | Keep device split separate |
| Crawl stats | Host status, crawl requests, response codes, file types | Record anomalies, not ranking conclusions |

## Product Analytics Runbook

Use the Phase 04 event dictionary only after consent/provider review. Required safe events:

- `tool_open`
- `input_added`
- `conversion_started`
- `conversion_success`
- `conversion_error`
- `download_started`
- `copy_result`
- `related_tool_clicked`
- `language_changed`

Required properties:

- `tool_name`
- `tool_category`
- `page_language`
- `device_class`

Prohibited payloads:

- File names
- File bytes
- Pasted text
- Raw URLs containing user content
- JWTs, passwords, tokens, or raw exception text that may contain user input

Until analytics is implemented and exported, all product success KPIs remain `unknown`.

## CWV And Crawl Review

Field sources:

- GSC Core Web Vitals report.
- CrUX API or PageSpeed Insights field data.

Lab sources:

- Lighthouse from Phase 04 gates.
- Browser smoke/regression gates.

Rules:

- Field CWV uses real-user LCP, INP, and CLS.
- Lighthouse TBT can remain a lab proxy for responsiveness diagnostics, but it is not field INP.
- Report p75 field values with source, collection period, URL/origin, and device.
- Use lab results to debug, not to claim field CWV.

Week 12 local crawl configuration:

- Serve local site with `node server.js`.
- Run `node tools\phase04-seo-release-gate.js`.
- Run `node tools\phase05-international-seo-audit.js`.
- Run `node tools\phase07-local-measurement-snapshot.js --json ...`.
- Run browser gate with bundled Playwright `NODE_PATH`.
- Store artifacts under `deep-research-phase-plan/phase-07-measurement-experiments-quarter-review/week-12/` when the actual review happens.

## Experiment Governance

Register:

- `phase-07-experiment-register.csv`

Current status:

| Experiment | Status | Reason |
|---|---|---|
| Privacy title | Hold | Needs current impressions/CTR and privacy claim review |
| Intro copy specificity | Hold | Needs analytics tool-start events |
| Example block | Hold | Needs eligible pages with enough impressions and start-rate baseline |
| Contextual workflow links | Hold | Needs analytics click events and crawl baseline |
| Troubleshooting content | Hold | Needs sanitized error taxonomy and analytics |
| Native locale copy | Hold | Needs GSC locale evidence and native ES/DA review |

Minimum interpretation window:

- SEO experiments: 28 days after deployment and recrawl, longer for low-impression pages.
- Product behavior experiments: at least 2 full weeks and enough starts to avoid anecdotal decisions.
- Do not judge an SEO change after 7 days.

## Cannibalization And Opportunity Review

Required input:

- Current GSC query export.
- Current GSC page export.
- Query-page export when available.
- Canonical inventory from local snapshot.

Method:

1. Normalize query text.
2. Flag queries with more than one intended canonical page receiving impressions.
3. Separate expected sitelinks/multi-page coverage from true overlap.
4. Flag pages with impressions and weak CTR by position band.
5. Flag queries/pages in average positions 11-20.
6. Review intent manually before recommending copy, title, or internal-link changes.
7. Do not declare cannibalization from page titles alone.

Outputs:

- Competing URL candidates.
- Weak CTR opportunities.
- Position 11-20 opportunities.
- Hold list where data volume is too low.
- Recommended owner and next action.

## Week 12 Decision Packet

The Week 12 meeting should answer:

1. Are intended canonical URLs represented in sitemap and local crawl?
2. Which intended pages are indexed, not indexed, duplicate, or soft 404 in GSC?
3. Did non-branded impressions/clicks grow from the approved Week 1 baseline?
4. Which pages have impressions but weak CTR?
5. Which pages/queries sit in positions 11-20?
6. Do tool starts, completions, errors, downloads, and copies support the SEO roadmap?
7. Are ES/DA pages earning evidence that justifies more locale investment?
8. Did authority work produce legitimate referring domains or editorial links?
9. Which experiments have sufficient evidence to win, lose, or remain inconclusive?
10. What should the next quarter stop, start, and continue?

## Next-Quarter Recommendation

Recommended state today: **measurement-ready, experiment-launch blocked**.

Start:

- Assign owners for GSC, analytics, performance, localization, and authority logs.
- Implement or confirm the Phase 04 privacy-safe analytics dictionary.
- Collect a current Week 1 baseline after the current roadmap work is deployed.
- Use the Phase 07 KPI template every Monday.
- Run Week 12 crawl/indexation/cannibalization review after enough observation time.

Continue:

- Technical release gates from Phase 04.
- International technical audit from Phase 05.
- Phase 06 PDF/privacy product and authority work, with cautious claims.

Hold:

- CTR/title experiments until current GSC impressions are available.
- Product-start/completion experiments until analytics events exist.
- ES/DA release-quality claims until native review exists.
- New language expansion until GSC country/language evidence supports it.
- Secure-redaction or secure-sanitization claims unless engineering/security evidence proves them.

## Validation

Passed:

- `node --check tools\phase07-local-measurement-snapshot.js`
- `node tools\phase07-local-measurement-snapshot.js --json deep-research-phase-plan\phase-07-measurement-experiments-quarter-review\phase-07-local-measurement-snapshot.json`
- `node tools\phase04-seo-release-gate.js`
- `node tools\phase05-international-seo-audit.js`
- `$env:NODE_PATH='C:\Users\Abdul Sammad\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'; node tools\phase04-browser-gate-runner.js`
- `git diff --check`

Notes:

- The browser gate initially failed because no local server was running on `http://localhost:5000/`; it passed after serving the static repository on port 5000.
- `git diff --check` reported only LF/CRLF working-copy warnings.
- Phase 05 international audit passed technical and sitemap checks; its ES/DA content findings remain open inventory items, not release-quality localization signoff.
- Lighthouse was not rerun because Phase 07 made no production page, layout, script, or priority-page performance changes.

Future release-gate commands after any production-affecting change:

```powershell
node tools\phase04-seo-release-gate.js
$env:NODE_PATH='C:\Users\Abdul Sammad\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
node tools\phase04-browser-gate-runner.js
node tools\phase05-international-seo-audit.js
node tools\phase07-local-measurement-snapshot.js --json deep-research-phase-plan\phase-07-measurement-experiments-quarter-review\phase-07-local-measurement-snapshot.json
git diff --check
```

## Handoff

State: partially unblocked.

The next owner can collect current exports and populate the KPI template immediately. Experiments and next-quarter decisions should remain held until current GSC/analytics/field/link evidence exists.
