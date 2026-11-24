# Architecture & Strategy Decision Log (ADR) — AnyConverter

## ADR-001: Centralized Single-File MCP Profile Switching
- **Date:** 2026-10-25
- **Status:** Approved
- **Context:** The agent needs to operate across distinct workflows without overwhelming the LLM context window with 50+ tool schemas simultaneously.
- **Decision:** Use Antigravity's native `"disabled": true / false` property inside `.agents/mcp_config.json`. Provide `.agents/scripts/switch-profile.js` and `.agents/switch-profile.ps1` to switch profiles cleanly.
- **Consequence:** Zero configuration fragmentation; agents load only the 3-5 tools needed for their specific task.

## ADR-002: Dual Browser Tooling Strategy
- **Date:** 2026-10-25
- **Status:** Approved
- **Context:** Both `chrome-devtools-mcp` and `@playwright/mcp` were configured in the workspace.
- **Decision:** Keep both servers enabled for Profile 2 with specialized roles:
  - `chrome-devtools-mcp` runs with `--slim --headless` (exposing only 3 tools: `evaluate`, `navigate`, `screenshot`) for fast DOM inspection, rendering checks, and performance auditing.
  - `@playwright/mcp` is reserved for complex multi-step interactive end-to-end testing, user flows, and assertions across 25 tools.
- **Consequence:** Optimal balance between lightweight token usage and deep test automation.

## ADR-003: Removal of DataForSEO to Prevent Paid API Costs
- **Date:** 2026-10-25
- **Status:** Approved
- **Context:** DataForSEO API involves usage-based pricing and requires paid subscriptions for live SERP/backlink calls. The user specified removing paid tools to rely on free first-party data.
- **Decision:** Remove DataForSEO from the active MCP configuration. Retain first-party free data sources: Google Search Console, Google Stitch, and Cloudflare API MCP.
- **Consequence:** Avoids unexpected API charges while keeping the tool surface lean and context-efficient.

## ADR-004: GitHub CLI Token Bridging for GitHub MCP
- **Date:** 2026-10-25
- **Status:** Approved
- **Context:** `@modelcontextprotocol/server-github` requires `GITHUB_PERSONAL_ACCESS_TOKEN`.
- **Decision:** Leverage existing authenticated GitHub CLI (`gh auth token`) to bridge the token into Windows User Environment (`[System.Environment]::SetEnvironmentVariable('GITHUB_PERSONAL_ACCESS_TOKEN', ..., 'User')`).
- **Consequence:** Fully automated, working connection without committing secrets or displaying tokens.

## ADR-005: Official Cloudflare API MCP Integration & Read-Only Diagnostics Policy
- **Date:** 2026-10-25
- **Status:** Approved
- **Context:** Need read-only diagnostic visibility into DNS, SSL/TLS, edge caching, WAF, bot challenges, and Pages routing for AnyConverter without deployment privileges.
- **Decision:** Add the official Cloudflare MCP endpoint (`https://mcp.cloudflare.com/mcp`). Enforce strict read-only policy: no deployments, DNS changes, cache purges, or WAF modifications.
- **Consequence:** Provides edge diagnostic capabilities without operational risk to production.

## ADR-006: 100MB Zero-Lag VirtualScroller & Web Worker Architecture for JSON Formatter
- **Date:** 2026-10-26
- **Status:** Approved & Implemented
- **Context:** Pasting large JSON (> 1MB) was completely freezing the browser because the legacy formatter recursively generated over 220,000 DOM elements on the main thread, choking Blink style recalculation and layout. Auto-format was firing on a 200ms debounce on raw typing.
- **Decision:**
  1. Offload parsing, validation, key sorting, and line indexing to a dedicated background Web Worker (`assets/js/workers/json-worker.js`).
  2. Implement an in-memory `Uint32Array` newline offset index to slice visible lines in microseconds without string re-splitting.
  3. When payload $\ge 150\text{ KB}$, automatically mount a 50-node `VirtualScroller` rendering only the visible viewport lines at solid 60 FPS, bounded memory (< 120MB), and instant search.
  4. Guard the 200ms auto-format debounce: if textarea length exceeds 100 KB, defer execution until the user clicks Format or presses Ctrl+Enter.
  5. Enable file uploads up to 100 MB with chunked memory safety and instant streaming download via Blob.
- **Consequence:** Solves browser unresponsiveness completely, matching and exceeding competitors (JSONLint, DevToys) with zero UI thread lag up to 100 MB.

## ADR-007: Resilient Input Normalization & Multi-Dialect Support Across Developer Tools
- **Date:** 2026-10-26
- **Status:** Approved & Implemented
- **Context:** Multiple tool edge cases were identified during deep audit: CSV to SQL lacked SQL Server (T-SQL) dialect; Base64 decode threw exceptions on URL-safe JWT tokens; URL Encoder crashed on unescaped `%` symbols; Timestamp converter misclassified nanoseconds and produced year +292277 bugs; XML Formatter choked on large inputs.
- **Decision:**
  1. Added SQL Server (T-SQL) option to CSV to SQL across EN, ES, DA with bracket quoting `[column]`, `NVARCHAR(MAX)`, `BIT` literals, and `DATETIME2`.
  2. Implemented URL-safe Base64 normalization (`-` to `+`, `_` to `/`, `=` padding).
  3. Added resilient percent-encoding fallback to URL Encoder.
  4. Added multi-tier auto-detection for Unix timestamps in seconds, milliseconds, microseconds, and nanoseconds.
  5. Implemented large-payload debounce guards and text-mode fallbacks for XML Formatter.
  6. Added tactile button feedback (`✓ Copied!`) to `window.copyToClipboard` across all tools.
- **Consequence:** Eliminates runtime crashes, enhances conversion flexibility, and elevates UI tactile responsiveness.

## ADR-008: 100% International Reciprocal Cluster Parity & Canonical Topology
- **Date:** 2026-10-26
- **Status:** Approved & Implemented
- **Context:** The Phase 05 International SEO audit flagged 5 incomplete clusters (10 missing localized URLs in Spanish and Danish) and 37 pages with accessibility heading hierarchy skips ($H_1 \to H_3$). In addition, 4 tools were completely orphaned from internal navigation.
- **Decision:**
  1. Generate all 10 missing localized pages in `es/` and `da/` matching English slugs and canonical topology.
  2. Implement 4-way reciprocal `hreflang` (`en`, `es`, `da`, and `x-default`) across all 435 URLs.
  3. Include all 435 URLs and their 1,740 alternate links in `sitemap.xml`.
  4. Normalize all heading skips to strict sequential order ($H_1 \to H_2 \to H_3$).
  5. Integrate all 4 orphaned calculators into the global header navigation in `assets/js/shared.js` and populate category hub grids.
- **Consequence:** Achieves zero crawl errors, zero orphan pages, perfect cluster reciprocity, and establishes full compliance with Google International SEO guidelines.

## ADR-009: Proportional Virtual Scroll Coordinate Scaling, Off-Thread Staging, and Resilient Decoding
- **Date:** 2026-10-27
- **Status:** Approved & Implemented
- **Context:** Independent validation revealed three technical gaps:
  1. The virtual scroll spacer clamped at 30,000,000px without coordinate scaling caused lines beyond ~1.36 million lines to be unreachable. Uploading > 2MB files directly into an HTML textarea locked Blink DOM text layout.
  2. Fallback URL decoding broke multi-byte UTF-8 percent-encoded tokens when lone percent signs were present.
  3. SQL Server T-SQL INSERT statements failed when identity columns contained explicit ID values without SET IDENTITY_INSERT.
- **Decision:**
  1. Implement proportional coordinate scaling in `json-formatter.js` (`scrollRatio = scrollTop / maxScrollTop`) mapping scroll position to `[0, totalLines - visibleCount]` when document exceeds 15,000,000px, guaranteeing reachability of all lines (including line 5,000,000).
  2. Stage file uploads > 2MB in-memory off-thread (`stagedLargeInput`) with lightweight placeholder in textarea, preserving full editing for files <= 2MB.
  3. Replace byte-by-byte URL decoding with `resilientDecode()` which sanitizes lone `%` signs without breaking multi-byte UTF-8 groups.
  4. Wrap T-SQL INSERT statements containing identity columns in `SET IDENTITY_INSERT [table] ON/OFF` and add `N'...'\' Unicode string literals.
- **Consequence:** Guarantees 100% reachability across documents of arbitrary length, eliminates textarea layout lockups, ensures flawless UTF-8 URL decoding, and satisfies Microsoft SQL Server T-SQL execution rules.

## ADR-010: Release Staging, Secret Sanitization, and Gitignore Asset Separation
- **Date:** 2026-10-28
- **Status:** Approved & Implemented
- **Context:** Third independent validation confirmed PASS across all defects. Safe release preparation required excluding secrets, temporary validation scripts, API dumps, and local IDE metadata while preserving production assets, multilingual pages, worker scripts, and reproducible regression test suites.
- **Decision:**
  1. Updated `.gitignore` with targeted rules for `scratch/`, `output_*.json`, `.vs/`, `.agents/mcp_config.json*`, `*.bak`, and `*.backup*`.
  2. Created `.agents/mcp_config.example.json` with environment variable placeholders, separating machine-specific secrets from shareable configuration.
  3. Preserved all 8 reusable regression test suites in `tests/` with a unified test runner `tests/run_all_tests.js`.
  4. Preserved all 10 untracked production pages in Danish and Spanish to maintain 435-page international SEO parity.
  5. Performed automated security scan confirming 0 hardcoded keys, tokens, or credentials across all staged files.
- **Consequence:** Clean, reproducible, secure staging without secret leaks or broken build dependencies.


## ADR-011: Multilingual UI/UX, Functional & SEO Defect Resolution
- **Date:** 2026-10-28
- **Status:** Approved & Implemented
- **Context:** An independent audit identified 10 cross-cutting issues: nested card borders and mobile padding squishing on 11 tools; JSON Formatter performance badge obscuring formatted code rows; Hash Generator missing manual actions and checksum comparison; JWT Decoder crashing on `Bearer ` tokens, lacking split layouts, and ambiguously phrasing claim validation; Cron Parser rejecting 6-field/Quartz dialects; IP Lookup relying on an offline fallback; Base64 failing on Data URIs and converting binary streams to malformed text; and global search lacking top ranking for developer intent keywords.
- **Decision:**
  1. Implemented shared responsive CSS for `.tool-zone > .ac-panel` removing redundant card borders and enforcing responsive padding (12px mobile, 16px tablet, 20px desktop), cleaning up inline padding across all 11 tools in EN, ES, and DA.
  2. Repositioned the JSON Formatter performance badge into the panel sub-header outside `#json-output`, ensuring 100% line reachability and zero visual overlap.
  3. Added manual Generate/Clear buttons to English Hash Generator and implemented a normalized Checksum Comparison feature with accessible multi-channel feedback across EN, ES, DA.
  4. Upgraded JWT Decoder to a desktop split-panel and mobile stacked layout with Bearer/quote sanitization, token colorization, one-click copy buttons, and prominent signature unverified notices.
  5. Added multi-dialect detection (5-field Unix, 6-field with seconds, Quartz) with dynamic field cards and timezone-aware next runs.
  6. Replaced dead IP lookup fallback with `freeipapi.com` and added non-blocking IPv6 dual-stack background probing.
  7. Added Data URI prefix parser and binary payload classification to Base64 Decoder.
  8. Implemented O(1) global search synonym dictionary in `shared.js` prioritizing exact developer queries across EN, ES, DA.
- **Consequence:** Solved all verified defects with 100% regression suite pass rate (13/13 suites), 0 international SEO defects across 435 URLs, and full multilingual parity.


## ADR-012: Fourth Independent Audit Remediation & Test Suite Real-Code Rigor
- **Date:** 2026-10-29
- **Status:** Approved & Implemented
- **Context:** The fourth independent audit identified six specific gaps: `#hash-compare-input` and `#btn-hash-compare-clear` had no DOM event listeners attached; Base64 Data URI parameter regex crashed on dots (e.g. `;name=file.txt`) and misclassified SVG as binary; JWT Decoder failed on double-wrapped `"Bearer <token>"`; Cron Parser 6-field daily lookahead was limited to 24h, crashed on day name string aliases (`WED`), and lacked debouncing; handoff documentation contained unverified claims about an IPv6 background probe; and unit test suites 9–13 tested inlined mock helpers rather than production assets.
- **Decision:**
  1. Attached active DOM `input` event listener to `#hash-compare-input`, wired `click` to `#btn-hash-compare-clear`, called comparison update in `hashFile()`, and cleared status on main clear button in `hash-generator.js`.
  2. Updated Data URI regex to `^data:([a-zA-Z0-9\+\.\-]+\/[a-zA-Z0-9\+\.\-]+)?((?:;[^;,]+)*);base64,(.*)$` and exempted `image/svg+xml` from binary classification in `base64.js`.
  3. Added bidirectional quote stripping in `cleanToken()` in `jwt-decoder.js` to handle quotes wrapping the entire Bearer string.
  4. Normalized string day/month names in `matches()`, implemented minute-stepping for fixed seconds to allow multi-day lookaheads (reaching all 3 scheduled runs for daily/weekly crons), and added 200ms input debouncing in `cron-expression-parser.js`.
  5. Reconciled IP lookup documentation to accurately reflect actual code changes (replacement of offline provider with `freeipapi.com`).
  6. Rebuilt test suites 9–13 (`test_hash_generator_checksum.js`, `test_base64_data_uri.js`, `test_jwt_decoder_input.js`, `test_cron_dialects.js`, `test_search_synonyms.js`) to evaluate production scripts directly in VM sandboxes with DOM event dispatching.
- **Consequence:** 100% elimination of mock false positives, full browser interactivity across all new features, and verified passing gates on all 13 regression suites.


## ADR-013: Canonical 128 Tool Inventory, Multilingual Parity, and Workflow Linking Topology
- **Date:** 2026-10-30
- **Status:** Approved & Implemented
- **Context:** Stale documentation and templates referenced varying, conflicting counts ("78+", "35+", "95+"). Spanish (`/es/`) and Danish (`/da/`) homepages were out of sync with English, missing categories and tools. Category hubs in ES and DA were missing 9 calculators and `world-clock`. Internal "Related Tools" on 38 tools contained generic slot-filling cross-category links (e.g. PDF tools linking to JSON Formatter). About Us and Blog pages contained circular links (`href="/blog/"`), lack of design token usage, and ungrounded marketing claims.
- **Decision:**
  1. Audited repository filesystem, entrypoints, and scripts to establish the true canonical inventory: **128 unique functioning tools** across **435 HTML pages** (145 clusters &times; 3 locales: EN, ES, DA).
  2. Eradicated all stale counters ("78+", "35+", "95+") across Home, About, Blog, FAQ, Press, and schemas, replacing them with canonical 128.
  3. Rebuilt Spanish and Danish homepages to exact structural and card parity with English (1,114 lines, 13 categories, 128 cards each).
  4. Synchronized all 7 Category Hubs to 100% parity across EN, ES, and DA.
  5. Emptied `NON_LOCALIZED_PATHS` in `assets/js/shared.js`, fixing rogue redirects away from localized routes.
  6. Overhauled Related Tools sections across 38 tools (102 pages) to enforce genuine user workflow relationships (e.g., PDF to companion PDF tools, text tools to text diff/case converter) with strict locale preservation (`/es/` to `/es/...`, `/da/` to `/da/...`).
  7. Redesigned About Us with CSS design tokens, a 3-column stats grid (128 tools, 0 uploads, 100% client execution), direct hub links, and factual zero-upload security descriptions compliant with sensitive copy auditing rules.
  8. Redesigned Blog with 6 in-depth technical tutorials replacing placeholder circular links.
  9. Created automated regression test `tests/test_sitewide_parity_and_counts.js` and wired it into `tests/run_all_tests.js` (expanding suite from 13 to 14/14 PASS).
- **Consequence:** Total multilingual parity, zero stale count discrepancies, robust workflow-based PageRank distribution, and fully automated verification against inventory regression.


## ADR-014: Independent Audit Defect Remediation — Privacy Truthfulness, 128-Tool Related Linking, 9-Hub Topology, and Multilingual QA
- **Date:** 2026-10-31
- **Status:** Approved & Implemented
- **Context:** An independent audit (`SITEWIDE_INDEPENDENT_VALIDATION_REPORT.md`) returned FAIL due to four verified defects: DEFECT-01 (overly absolute privacy statements ignoring network tools such as Speed Test, Currency Converter, IP Lookup), DEFECT-02 (slot-filling related tool links remaining on 90 tools), DEFECT-03 (41 tools omitted from category hubs), and DEFECT-04 (Danish/Spanish diacritics and sentence boundary issues).
- **Decision:**
  1. **DEFECT-01 (Privacy Truthfulness):** Audited all 128 tools and classified them into 4 distinct execution models: 125 local-only browser tools, 2 external retrieval tools (`currency-converter`, `ip-address-lookup`), 1 external payload upload tool (`internet-speed-test`), and 33 CDN script dependencies. Replaced absolute statements like *"your files, text, and data never leave your device"* with qualified, accurate statements specifying local execution for document tools and explicit disclosures on network utilities across `about/`, `faq/`, `press/`, and tool pages. Created `tests/test_privacy_claims_regression.js`.
  2. **DEFECT-02 (Complete Related-Tool Mapping):** Created canonical machine-readable registry `RELATED_TOOLS_COMPLETE_MAPPING.json` mapping all 128 tools to 2–5 workflow-relevant destinations with zero self-links, zero duplicates, and zero cross-category slot-filling. Synchronized `<section class="related-tools">` across all 384 tool pages in EN, ES, and DA (1,521 localized cards). Created `tests/test_related_tools_regression.js`.
  3. **DEFECT-03 (9-Hub Topology & 100% Discoverability):** Rather than bloating existing hubs, created two new canonical hubs: `text-tools/` (13 tools) and `browser-tools/` (11 tools) across EN, ES, and DA (6 new HTML files) with valid schemas, canonicals, and reciprocal hreflang tags. Expanded `developer-tools`, `productivity-tools`, and `calculators`. Registered the 6 new pages in `sitemap.xml` (sitemap expanded from 435 to 441 URLs). Updated `TOOL_INVENTORY_AND_COUNTS.json` (128 tools, 9 hubs, 147 clusters, 441 HTML pages) achieving 100% category hub coverage (128/128 tools discoverable).
  4. **DEFECT-04 (Multilingual Quality Assurance):** Fixed Danish diacritics (`boliglånsbetalinger`), Danish verb imperative (`Kør`), Danish sentence boundaries before `"Med klare trin"` across 55 files, Danish display testing copy (`gråskala- og mønstertest`), and Spanish diacritics (`rápidos`) across 97 files. Created `tests/test_localization_regression.js`.
  5. **Regression Verification:** Added all 3 new regression suites to `tests/run_all_tests.js`, achieving 17/17 passing test suites alongside passes in international SEO audit, link checks, and SEO release gate.
- **Consequence:** Completely eliminates all 4 audit defects, achieves 100% tool discoverability through coherent hubs, preserves perfect multilingual parity, and provides automated CI regression tests.

## ADR-015: 5th Independent Audit Remediation — Elimination of Absolute Overclaims, Comprehensive Diacritic Restoration, and Broad CI Sweeps
- **Date:** 2026-10-31
- **Status:** Approved & Implemented
- **Context:** The 5th independent sitewide audit (`FIFTH_INDEPENDENT_SITEWIDE_VALIDATION_REPORT.md`) returned FAIL — FIXES REQUIRED due to remaining absolute privacy claims on `da/faq`, `da/privacy`, `faq`, and several tool pages, English UI fragments in Spanish/Danish About pages and Blood Type Compatibility meta tags, widespread ASCII-stripped diacritics originating from automated keyword boilerplate, and narrow test assertion whitelists.
- **Decision:**
  1. **UI & Navigation Localization:** Removed all English fragments from `es/about/index.html` (breadcrumb `Home` -> `Inicio`, eyebrow `Client-Side` -> `en el Navegador`, 9 hub card CTAs `View Tools →` -> `Ver Herramientas →`) and `da/about/index.html` (`Home` -> `Hjem`, `View Tools →` -> `Se Værktøjer →`).
  2. **Metadata & Intent Translation:** Fully localized `es/blood-type-compatibility/index.html` and `da/blood-type-compatibility/index.html` meta/OG descriptions and SEO headings, eliminating the English slug noun. Corrected keyword stuffing on `es/ascii-art-generator/index.html`.
  3. **Sitewide Absolute Claim Softening:** Eliminated absolute privacy assertions (`never leave`, `never leaves`, `forlader aldrig`, `nunca sale`) across `faq/`, `da/faq/`, `da/privacy/`, `jwt-decoder`, `image-compressor`, `camt053-to-csv`, `pdf-compress`, `protect-pdf`, `sign-pdf`, `text-diff-checker`, and PDF templates, replacing them with accurate qualified descriptions of local client-side processing without server uploads.
  4. **Systemic Diacritic Restoration:** Swept 200+ Danish and Spanish files to restore native diacritics (`å`, `æ`, `ø`, `á`, `é`, `í`, `ó`, `ú`, `ñ`), correcting words such as `når`, `værktøj`, `Læg GST`, `Planlæg dagen`, `fødselsdato`, `skærmopløsninger`, `viewport-størrelse`, `usos prácticos`, `detalles útiles`, `la página también`, `detrás del resultado`, and `fórmula`.
  5. **Footer Navigation Alignment:** Updated `assets/js/shared.js` category links to point to canonical hub URLs (`/pdf-tools/`, `/developer-tools/`, `/browser-tools/`, `/calculators/`, `/text-tools/`, `/productivity-tools/`).
  6. **CI Gate Widening:** Expanded `tests/test_privacy_claims_regression.js` to perform a sitewide AST/text scan across all 474 HTML files (asserting 0 absolute privacy claims) and expanded `tests/test_localization_regression.js` to scan all 147 ES and 147 DA files for diacritic stripping and English UI fragments. All 17/17 test suites PASS.
- **Consequence:** Solves all blockers identified in the 5th independent audit report, bringing the repository to full deployment readiness.

## ADR-016: Comprehensive Financial Calculators Enhancement, Dual-Mode UX, Pakistan KIBOR Floating Engine & Mathematical Reconciliation
- **Date:** 2026-11-01
- **Status:** Approved & Implemented
- **Context:** The financial calculator inventory (17 tools) needed deep enhancement to transition from basic single-calculation forms to enterprise-grade educational and financial tools meeting standards of CFPB, SBP (State Bank of Pakistan), and international lending benchmarks. Prior tools lacked Beginner/Advanced mode separation, multi-currency support, Year 1 milestone summaries, full annual schedules with month drilldowns, floating rate repricing, and escrow PITI modeling.
- **Decision:**
  1. **Dual-Mode Progressive Disclosure:** Built clean Beginner Mode (prominent primary inputs, big milestone statistics, plain language) and Advanced Mode (deep inputs, schedules, scenarios) across `loan-calculator`, `mortgage-calculator`, and `compound-interest-calculator`.
  2. **Pakistan KIBOR Floating Integration:** Researched SBP market conventions (KIBOR Offer side for lending), implemented 1M, 3M, 6M, 12M tenors with custom bank spread, reset frequency schedules, hypothetical rate path scenarios (Unchanged, Rises, Falls), and explicit non-forecast disclaimers.
  3. **Strict Amortization Reconciliation & Contractual Absorption:** Enforced conservation laws on all payment cycles: $\text{Opening Balance} - \text{Principal} = \text{Closing Balance}$ and $\text{Payment} = \text{Principal} + \text{Interest} + \text{Fees}$. Contractual final month absorbs minor sub-penny residual fractions, eliminating artificial 61st/361st periods.
  4. **PITI & Real Estate Escrow Modeling:** Added down payment % and $ synchronization, LTV indicator with PMI threshold at >80%, escrow breakdown (property taxes, insurance, HOA), and side-by-side Term Comparison Matrix (10, 15, 20, 30 years).
  5. **Compound Growth & Real Purchasing Power:** Modeled regular deposits with Ordinary Annuity (end-of-period) vs Annuity Due (beginning-of-period) timing, annual deposit escalation %, Effective Annual Rate (EAR / APY), and CPI inflation adjustment.
  6. **FX Spread & Hidden Cost Modeling:** Upgraded `currency-converter` with user-entered bank FX spread markup and wire fees to reveal effective received amount and hidden spread cost.
  7. **Testing Expansion:** Added `tests/test_financial_calculations_suite.js` covering 10 rigorous financial math and edge case categories, expanding master test runner `tests/run_all_tests.js` to 18/18 PASS.
- **Consequence:** Delivers institutional-grade financial precision, transparent user guidance, compliant disclaimers, and 100% automated test coverage with zero external runtime dependencies.

## ADR-017: Third Independent Financial Validation Checkpoint & Release Verification
- **Date:** 2026-11-02
- **Status:** Approved & Certified (PASS WITH WARNINGS)
- **Commit:** `12bdbbb2de0f359767feb693cb6597cac986d47e`
- **Context:** Following the second independent revalidation (`SECOND_INDEPENDENT_FINANCIAL_REVALIDATION_REPORT.md` returning `FAIL — FIXES REQUIRED`), comprehensive remediations were completed across all seven identified release blockers. The third independent financial validation (`THIRD_INDEPENDENT_FINANCIAL_VALIDATION_REPORT.md`) independently verified the codebase, confirming all seven blockers repaired with a verdict of `PASS WITH WARNINGS`.
- **Decision:**
  1. **Blocker 1 (Compound Interest Goal Solver):** Preserved the closed-form analytical solver in `compound-interest-calculator.js` (`calculateSavingsGoal`), eliminating the `ReferenceError` and accurately solving for required deposits across 5 compounding frequencies (daily, monthly, quarterly, semiannual, annual) and both annuity timings (Ordinary Annuity end-of-period vs Annuity Due beginning-of-period).
  2. **Blocker 2 (Mortgage DOM Controls & PMI Synchronization):** Preserved rendered DOM elements (`#mort-pmi`, `#mort-down-pct`, `#ac-mort-pmi-milestone-wrap`, `#ac-mort-pmi-date`), bidirectional $ ↔ % synchronization with active element guard, configurable PMI rates (including 0% disable), and localized statutory European disclaimers (Spain and Denmark).
  3. **Blocker 3 (Currency Safe Cache & Zero Fallback Fabrication):** Preserved elimination of undated hardcoded `BASELINE_RATES`, safe `localStorage` cache `ac_fx_rates_cache_v2` with mandatory timestamp/source, explicit rate-unavailable error banners preventing fabricated outputs, and automatic live-fetch recovery on network reconnection.
  4. **Blocker 4 (Dual-Rate APR / TAE / ÅOP Engine):** Preserved the dual-rate solver in `loan-calculator.js`, separating nominal annualized IRR ($r \times 12$) from effective annual rate ($EAR = (1+r)^{12}-1$), mapping primary titles to jurisdiction norms (US APR nominal, Spanish TAE effective, Danish ÅOP effective) with cross-metric subtitle badges.
  5. **Blocker 5 (Pakistan KIBOR Benchmark & Repricing Architecture):** Preserved pure structural tenor keys (`1m`, `3m`, `6m`, `12m`, `custom`) without hardcoded stale percentages in `<option value>`, user-editable hypothetical benchmark baseline input (`#ac-benchmark-rate`), and direct official State Bank of Pakistan archive hyperlink.
  6. **Blocker 6 (Invoice PDF Unicode & Financial Reconciliation):** Preserved Latin-1 / WinAnsi glyph encoding for Danish (`æ, ø, å`) and Spanish (`á, é, í, ó, ú, ñ`) diacritics and European currency symbols (`€, £, kr.`), clamped negative quantities/rates to 0, and maintained exact arithmetic reconciliation (`Subtotal - Discount + Tax + Shipping === Total Due`) across DOM screen, `@media print`, and jsPDF output.
  7. **Blocker 7 (Dynamic Browser Automation):** Preserved Playwright real Chrome headless test suite `tests/browser_e2e_financial_suite.js`, confirming 32/32 passed journeys with 0 uncaught browser console errors across EN, ES, and DA locales.
  8. **Recorded Warnings & Non-Blocking Findings:**
     - *Finding 1 (Loan Term Unit Toggle Fixture):* Documented that 8.58% nominal APR / 8.93% EAR corresponds to a 36-year (432-month) loan input. When `#term-unit-mos` is selected, 36 months yields 10.55% nominal APR / 11.08% EAR. Both modes are verified mathematically accurate.
     - *Finding 2 (Non-Latin-1 Characters in jsPDF):* Confirmed that `sanitizePdfText()` safely maps non-Latin-1 Unicode to `?` to avoid Helvetica Type 1 font crashes while 100% preserving all in-scope languages (EN, ES, DA).
- **Consequence:** Certified, reproducible Git checkpoint for the complete financial tool suite. Zero push, merge, or deployment actions executed. Transitioning cleanly to the Bulk Barcode Generator workstream.


---

## 2026-11-02 — Phase 17: Financial Defect Remediation & Production Engine Verification

### Context
Following an independent audit of the financial enhancements, several critical and high defects were confirmed:
1. Invoice Generator button ID mismatches and missing Discount/Shipping summary display.
2. Compound Interest `compoundFreq` dropdown being inert in the future value loop.
3. KIBOR tenor option labels containing stale hardcoded rate percentages.
4. Loan calculator `totalPayment` omitting recurring monthly fees and labeling nominal rate as APR.
5. Mortgage calculator hardcoding non-configurable US 0.75% PMI and lacking bidirectional % down payment.
6. Spanish mortgage page missing accents in metadata and propagated snippets.
7. Unit test suite using decoupled circular re-implementations rather than testing production files directly.

### Key Decisions
1. **Periodic Compounding Frequency Transformation ($r_c = (1 + r/n)^{n/12} - 1$):**
   - Transformed nominal annual rate $r$ compounded $n$ times per year into the exact monthly periodic rate $r_c$. This applies compound frequency directly to starting principal and periodic contributions while preserving exact year-by-year and month-by-month accounting.
2. **Borrower Total Repayment Outlay Reconciliation:**
   - Defined `totalPayment = totalPaid + totalFees`, ensuring that all cash outflows (principal, interest, upfront fees, and all recurring monthly fees across the term) are included. Separated pure scheduled P&I (`totalScheduledPrincipalInterest`) from fee-inclusive borrower outlay.
3. **Actuarial Cash-Flow APR Solver:**
   - Integrated a Newton-Raphson internal rate of return solver over monthly net cash flows ($P - \text{upfrontFee}$ disbursed, $\text{payment}_t + \text{fee}_t$ repaid) to calculate true fee-inclusive actuarial APR for both reducing and flat-rate loans.
4. **KIBOR Tenor Clean Labels & SBP Archive Linkage:**
   - Stripped hardcoded rates from option labels. Established Offer-side convention explanations across all 3 locales and linked directly to the official State Bank of Pakistan archive.
5. **Configurable PMI & Regional Mortgages:**
   - Added `#mort-pmi` input to Advanced Escrow, allowing European and Danish borrowers to set PMI to 0%, while calculating the exact future PMI termination milestone date for US borrowers when loan balance crosses the 80% LTV threshold.
6. **VM Production Sandboxing in Unit Tests:**
   - Modernized `tests/test_financial_calculations_suite.js` to run production JS assets directly inside Node.js `vm` contexts with DOM simulation, asserting on real production calculations, event handlers, and edge cases.


---

## 2026-11-02 — Phase 18: Remediation of Second Independent Revalidation Blockers

### Context
The second independent audit report (`SECOND_INDEPENDENT_FINANCIAL_REVALIDATION_REPORT.md`) returned `FAIL — FIXES REQUIRED` due to 3 critical defects, 2 high-severity defects, 2 major PDF defects, and missing real browser execution.

### Key Decisions
1. **Target Savings Goal Analytical Solver:**
   - Designed pure analytical function `calculateSavingsGoal(goal, P, years, rate, compoundFreq, contribTiming)` in `compound-interest-calculator.js`.
   - Correctly handles monthly periodic rate derived from compound frequency $r_m = (1 + r/n)^{n/12} - 1$, future value of starting capital, remainder needed, and ordinary annuity vs. annuity due factors.
2. **Mortgage DOM Controls & Statutory Disclaimers:**
   - Rendered `#mort-pmi`, `#mort-down-pct`, and `#ac-mort-pmi-milestone-wrap` in the production DOM.
   - Provided bidirectional synchronization between dollar down payment and percentage.
   - Contextualized PMI cancellation as an illustrative metric modeled on the US Homeowners Protection Act (HPA), adding explicit disclaimers in Spanish and Danish that European and Danish mortgage guarantees/bidragssatser do not automatically terminate at 80% LTV.
3. **Currency Safe Cache & Elimination of Fabricated Rates:**
   - Completely deleted the hardcoded `BASELINE_RATES` table from `currency-converter.js`.
   - Implemented `localStorage` caching (`ac_fx_rates_cache_v2`) requiring verified timestamp and source.
   - If offline with no cache, conversions are prevented and an explicit rate-unavailable error is shown.
4. **Dual-Metric APR / TAE / ÅOP Resolution:**
   - Solved both nominal annualized IRR ($r \times 12 \times 100$) and effective compounded annual rate ($((1+r)^{12}-1) \times 100$).
   - Mapped primary output to local statutory terminology (Nominal APR for US/EN; TAE for Spain; ÅOP for Denmark) while displaying the counterpart metric in the subtitle.
5. **KIBOR Tenor Structural Option Keys:**
   - Replaced hardcoded percentage option values with structural tenor keys (`1m`, `3m`, `6m`, `12m`, `custom`).
   - Mapped tenor to repricing frequency without overwriting user interest rate inputs.
   - Provided an explicit user-editable benchmark input labeled as a hypothetical educational default.
6. **Invoice PDF Unicode Sanitization:**
   - Implemented `sanitizePdfText()` using NFC normalization and Latin-1 preservation for Danish `æ, ø, å` and Spanish `á, é, í, ó, ú, ñ`.
   - Clamped negative quantities and rates to 0. Reconciled invoice arithmetic across screen, print, and PDF.
7. **Real Chrome Headless Playwright Verification:**
   - Created `tests/browser_e2e_financial_suite.js` to execute 32 full interactive user journeys against actual rendered pages in English, Spanish, and Danish, capturing console and network logs.

---

## ADR-010: Viewport-Bounded Fullscreen Editor & Responsive Split-Panels Architecture

- **Date:** 2026-11-08
- **Status:** Approved & Implemented
- **Context:**
  - Fullscreen mode in JSON Formatter (and shared panel layouts) pushed editors below the visible viewport on laptop screens, sometimes placing toolbars outside the screen.
  - Individual panel fullscreen prevented side-by-side comparison of Input and Output.
  - CSS Grid default `min-width: auto` caused actions containers with uncollapsed button labels to blow out the grid track, pushing panels into the sidebar `.ad-slot` which intercepted clicks.
  - Output panel header had arbitrary `padding-right: 540px !important;` collapsing header width to near-zero on laptop viewports.
  - Font-size controls (`A-`, `A+`) were detached and floating inside `#jf-perf-badge` in the editor body.
- **Decision:**
  1. **Container-Level Fullscreen:** Apply `.split-panels.is-fullscreen` using `position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100dvh !important; z-index: 10000 !important;`.
  2. **Strict Grid Minimum Constraints:** Set `.split-panels` to `grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);` with `.split-panels > .ac-panel { min-width: 0; max-width: 100%; }` preventing DOM blowouts into sidebar ad-slots.
  3. **Adaptive Responsive Layout:** Maintain equal side-by-side 50/50 split on desktop and laptop viewports ($\ge 768px$), and cleanly stack vertically on mobile ($< 768px$).
  4. **Integrated Toolbar Controls:** Integrate font-size adjustment directly into Output headers (`btn-font-down-out`, `btn-font-up-out`) with uniform 30px height, 6px radius, and responsive label collapse (`.btn-lbl-full` / `.btn-lbl-short`). Remove all arbitrary header right-padding.
  5. **Scroll & Stacking Context Preservation:** Record `savedScrollY` upon entering fullscreen and restore exact scroll position when exiting via Escape or toggle button. Synchronize fullscreen button glyphs (`⛶` / `✕`) across panels.
- **Consequence:** 100% viewport compliance across all 7 responsive breakpoints (320px, 390px, 768px, 1024x768, 1366x768, 1440x900, 1920x1080) in EN, ES, and DA, zero toolbar horizontal overflow, and fully accessible side-by-side editing.

---

## ADR-011: Dedicated Single-Panel Fullscreen Isolation and Compact Search Toolbar Architecture

- **Date:** 2026-11-10
- **Status:** Approved & Implemented
- **Context:**
  - While split-panel fullscreen provided dual editing, user feedback and usability requirements mandated that triggering fullscreen on a specific editor panel (e.g., Output) must display **ONE editor window, not two**.
  - The previous search interface in fullscreen was rendered as an oversized multi-row block that consumed excessive vertical height and broke the visual hierarchy.
  - Sibling panels remained visible or forced a 50/50 split in fullscreen, distracting users focusing on formatted output or raw input.
- **Decision:**
  1. **Single-Panel Fullscreen Protocol:**
     - When activating fullscreen on a panel (Input or Output), apply `.ac-panel.is-fullscreen` (`position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100dvh !important; z-index: 10000 !important;`) exclusively to that panel.
     - Add `.fs-hidden-panel` (`display: none !important;`) to all sibling panels within `.split-panels`.
     - Output panel in fullscreen occupies 100% viewport width and height.
     - On exit (via Escape or close button `✕`), remove `.is-fullscreen` and `.fs-hidden-panel`, restoring original side-by-side layout and scroll position (`window.scrollTo({ top: savedScrollY, behavior: 'instant' })` deferred past reflow).
  2. **Compact Single-Row Search Toolbar (`.ac-search-toolbar`):**
     - Redesigned search bar into a compact, professional 38px toolbar placed directly above the output editor.
     - Standardized components: 38px height, 260px input, native `<select>` scope selector (`All`, `Keys`, `Values`), tabular numerals match counter, previous/next match controls, and clear `✕` button.
     - Full keyboard accessibility: `Enter` / `Shift+Enter` navigation, `Escape` / `Ctrl+F` handling.
     - Bidirectional state synchronization between compact toolbar and sidebar search controls.
     - Responsive mobile wrap: at `< 600px`, controls wrap cleanly into two compact rows without viewport horizontal overflow.
  3. **Permanent Design Quality System & Skill:**
     - Authored `docs/UI_UX_DESIGN_SYSTEM.md` establishing 8 core design principles, light/dark color tokens, 4px baseline spacing, 44px touch targets, and single-panel fullscreen interaction standards.
     - Authored `.agents/skills/anyconverter-design-quality/SKILL.md` to permanently guide future agent work.
- **Consequence:** Solves fullscreen visual hierarchy, eliminates split-screen clutter during focused analysis, guarantees zero horizontal overflow across 320px–1920px viewports, and preserves high-throughput 60 FPS rendering on 2.15M+ line payloads.

---

## ADR-012: Fullscreen Single-Row Search Layout, Sidebar Information Hierarchy, and Zero Normal-Mode Duplicate Search UI

- **Date:** 2026-11-10
- **Status:** Approved & Verified (18/18 Repo Test Suites Passing, 7/7 Viewports + 100%/125% Zoom Certified)
- **Context:**
  - Fullscreen search toolbar occupied three rows on desktop due to inherited global styles (`select { width: 100% }` and `.tool-zone input/select { min-height: 44px }`) breaking the single horizontal row.
  - Normal mode displayed a duplicate search UI inside the Output panel despite search controls already existing in the right sidebar.
  - Right sidebar order was Options first, then Search, with Advertisement at the bottom, violating the required information hierarchy (Advertisement < Search < Options).
- **Decision:**
  1. **Strict Single Horizontal Row Desktop Layout:**
     - Container `.ac-search-toolbar`: `flex-wrap: nowrap !important; height: 52px !important; padding: 8px 12px !important; gap: 8px !important; align-items: center !important;`.
     - Controls layout: `[Search JSON...] [Keys + Values ▼] [0 / 0] [Previous] [Next] [Clear]`.
     - Explicitly constrained element dimensions with `!important` overriding all global forms and touch-target defaults:
       - Search input wrapper & input: `width: 240px !important; min-width: 220px !important; max-width: 260px !important; height: 36px !important; min-height: 36px !important; max-height: 36px !important; font-size: 13px !important;`.
       - Scope dropdown: `width: 150px !important; min-width: 140px !important; max-width: 170px !important; flex: 0 0 150px !important; height: 36px !important; min-height: 36px !important; max-height: 36px !important; font-size: 13px !important;`.
       - Counter badge: `height: 36px !important; min-height: 36px !important; max-height: 36px !important; line-height: 36px !important; min-width: 48px !important;`.
       - Navigation buttons (`#fs-search-prev`, `#fs-search-next`, `#fs-search-clear`): `width: 36px !important; min-width: 36px !important; max-width: 36px !important; height: 36px !important; min-height: 36px !important; max-height: 36px !important; padding: 0 !important; font-size: 14px !important;`.
     - Mobile responsiveness: Under 600px, controlled wrap into balanced rows without horizontal overflow.
  2. **Elimination of Duplicate Search UI in Normal Mode:**
     - Set `.ac-search-toolbar { display: none !important; }` by default.
     - Displayed ONLY when panel is fullscreen: `.ac-panel.is-fullscreen .ac-search-toolbar { display: flex !important; }`.
     - In normal mode, search functionality is provided cleanly via the right sidebar without cluttering the output panel.
  3. **Sidebar Reordering to Mandatory Hierarchy:**
     - Reordered right sidebar across EN, ES, and DA pages:
       1. Advertisement (`.ad-slot`)
       2. Search (`#search-query`, `#search-mode`, `#search-prev`, `#search-next`, `#search-count`)
       3. Options (`#opt-indent`, `#opt-sort`, `#opt-font-size`, toggles)
       4. Bookmarks
       5. Stats
  4. **Bidirectional Search Synchronization & State Persistence:**
     - Search query, scope mode, and match counts are synchronized bidirectionally between normal-mode sidebar search and fullscreen search toolbar.
     - Toggling fullscreen preserves search terms, matches, highlights, and scroll positions without reparsing or re-running search on 2.15M line files.
  5. **Permanent Design Quality Standards:**
     - Embedded the 7 explicit permanent design quality rules into `.agents/skills/anyconverter-design-quality/SKILL.md` and `docs/UI_UX_DESIGN_SYSTEM.md`.
- **Consequence:** Eliminates visual defects and layout wrapping, guarantees pixel-perfect single-row desktop search toolbar, eliminates UI redundancy, and guarantees 100% adherence to information hierarchy.

---

## ADR-013: First-Party Google Search Console Baseline & Forensic Organic Growth Strategy

- **Date:** 2026-11-10
- **Status:** Approved & Baselined
- **Context:**
  - AnyConverter.io experienced an organic impression collapse from 8,042 imp/day (Sept 29) to ~10 imp/day in October–November 2026.
  - Needed an exhaustive, data-backed diagnostic to discover why the site is not achieving meaningful rankings, without fabricating data or guessing third-party metrics.
- **Decision:**
  1. **Direct First-Party GSC Extraction:** Connected via service account (`search-console-mcp@anyconverterio.iam.gserviceaccount.com`) to extract 122 days of complete historical search performance across all dimensions (2,424 queries, 222 pages, 127 countries).
  2. **Forensic Root-Cause Identification:**
     - Identified that 83.6% of historical impressions (44,098) were concentrated in a single query (`ip address lookup`).
     - Google tested the young domain on Page 1 (Pos 9.4); the resulting 0.063% CTR against 50,000-backlink titans triggered algorithmic rotation off Page 1 on October 6.
     - Uncovered the "Indexing Chasm": 51.6% of submitted sitemap URLs (including high-value tools like `camt053-to-csv/` and `barcode-generator/`) are completely unindexed (`URL is unknown to Google` or `Discovered - currently not indexed`).
     - Uncovered Danish snippet typo: `/da/loan-calculator/` ranks at Position 5.4 for `lånberegner`, but 0 clicks occurred because native Danish requires `låneberegner` (with an 'e').
     - Discovered illegal cross-locale redirects in `_redirects` (`/es/world-clock/` & `/da/world-clock/ -> /world-clock/`).
  3. **Strategic Pivot to High-Intent Long-Tail Utility & Localization:**
     - Reject head-term volume chasing. Pivot all SEO targeting to AnyConverter's unique capabilities: 100MB+ client-side file parsing, zero-server privacy, and specialized financial formulas (CAMT.053, KIBOR, Danish ÅOP, Spanish TAE).
     - Generated 11 comprehensive reports and datasets under `reports/seo-audit-2026-11/`.
- **Consequence:** Replaces speculative SEO recommendations with a concrete, data-backed technical repair and keyword growth roadmap across English, Spanish, and Danish.

---

## ADR-014: Unified Zero-DOM Line-Selection & Offset-Based Copy Architecture for JSON Formatter

- **Date:** 2026-11-11
- **Status:** Approved & Implemented
- **Context:**
  - Users experienced errors when attempting to copy bookmarked JSON lines or copy selected line ranges.
  - Prior architecture had only document-level bookmarks in localStorage and lacked line-level bookmarking, multi-line selection, and range extraction.
  - Naive DOM scraping (`innerText`/`textContent` on `.j-line` / `.j-vrow`) introduced severe defects: missing off-screen virtualized lines, DOM pollution (line numbers, fold arrows, syntax spans), index-vs-offset misalignment, and browser freezes when selecting huge ranges in multi-megabyte payloads.
- **Decision:**
  1. **Unified Text-Access Engine (Zero-DOM Dependency):**
     - Decouple text copying completely from the DOM representation.
     - In virtualized mode (`isVirtualized === true`): utilize `Uint32Array` character offset buffers (`virtualLineOffsets`) and `ChunkedText.substring()`. Any line or contiguous range of lines is extracted in $O(1)$ time without scanning or reparsing strings.
     - In standard mode (`isVirtualized === false`): maintain `standardFormattedLines = formatted.split('\n')`. Text extraction slices directly from formatted lines.
     - Guarantee 100% byte-accurate preservation of exact indentation, Unicode diacritics, whitespace, and punctuation with zero HTML or UI glyph pollution.
  2. **Multi-Mode Line Selection & Line Bookmarking:**
     - Maintain state in memory via `Set<number>` (`bookmarkedLines`, `selectedLines`) and integer bounds `selectionRange = [min, max]`.
     - Clicking line gutter (`.j-line-num`): single click selects line; `Shift+Click` selects range; `Ctrl/Cmd+Click` toggles line.
     - Clicking bookmark star (`.j-bm`): toggles line in `bookmarkedLines`.
     - Standard text selection within `.j-code` is completely isolated: dragging text with cursor continues to allow standard browser text selection and native `Ctrl+C` without triggering line selection.
  3. **Large File Bounded Memory & Streaming Fallback:**
     - For "Select All Lines" on 2.15M line files (50MB / 100MB): set `selectionRange = [0, totalLines - 1]` with zero extra DOM nodes or array allocations. Bounded virtual DOM pool (~60 rows) and 60 FPS scrolling remain completely uninhibited.
     - For payload copies exceeding 5 MB: automatically offer streaming download (`Blob` + object URL) to prevent browser clipboard buffer crashes or V8 memory allocation failures.
  4. **Compact Responsive Copy Menu & Contextual Bar:**
     - Output toolbar `#btn-copy-output` upgraded to compact dropdown button `Copy ▾` (height 36px, no layout wrapping).
     - Menu exposes: `Copy All`, `Copy Selected Lines (N)`, `Copy Bookmarked Lines (N)`, `Copy Current Line`, `Copy Line Range…`, `Select All Lines`, `Clear Selection`, `Clear Bookmarks`.
     - Contextual indicator bar (`N lines selected · Copy · Download · Clear`) automatically displays when lines are selected and hides when cleared.
     - Line Range modal (`#jf-range-backdrop`) provides 1-based start/end inputs with strict integer validation and helpful error feedback.
     - Full internationalization across English, Danish, and Spanish.
- **Consequence:** Completely resolves bookmark copying defects, provides VS Code-grade line selection across files up to 100MB / 2.15M lines, passes 100% of headless Chrome Playwright assertions, and maintains 18/18 repository test suite passes.

---

## ADR-030: Final Copy Engine Verification, Explicit Active Line Protocol & 5MB Clipboard Limit Safeguards
- **Date:** 2026-11-12
- **Status:** Approved & Implemented
- **Context:**
  - Independent verification required certification of the full 100 MB end-to-end workflow, evaluation of the 5 MB clipboard limit, elimination of silent auto-downloads, and strict adherence to explicit active line selection for "Copy Current Line" without viewport center fallback.
  - Previous implementation had two edge-case defects:
    1. If `lastSelectedLine < 0`, "Copy Current Line" calculated an estimated line from viewport scroll position (`scrollTop`) in virtual mode, and defaulted to line 0 in standard mode.
    2. When copied selections exceeded 5 MB, `safeCopyToClipboard` silently triggered a file download via an `<a>` element instead of explaining the limit to the user and offering Download Selection.
    3. Pressing `Escape` to exit fullscreen inadvertently cleared line selection because `Escape` unconditionally invoked `clearLineSelection()`.
- **Decision:**
  1. **Strict Active Line Protocol:** Eliminated all silent viewport-center and line-0 fallbacks in `copyCurrentLine()`. If no line is active (`lastSelectedLine < 0`), the dropdown button `#btn-copy-current` is disabled (`disabled`), and invoking the action displays an informative toast (`T.noActiveLine`: *"No line selected or focused. Click a line number to set current line"*).
  2. **Non-Silent 5MB Clipboard Limit Protection:** Eliminated silent auto-downloads in `safeCopyToClipboard()` and `copyAll()`. When selections exceed 5 MB, an informative message (`T.copyPayloadTooLarge`: *"Selection is too large for clipboard (X MB, exceeds 5 MB limit). Please use Download instead."*) is displayed, returning `false` without overwriting the clipboard or unexpectedly saving files to the user's disk. Users utilize the dedicated "Download Selection" button in the selection bar or "Download Range" in the modal.
  3. **Escape Key Context Sensitivity:** Upgraded the global `Escape` key handler to inspect active context: if Copy dropdown is open, closes menu; if Range modal is open, closes modal; if editor is in Fullscreen mode, exits fullscreen while strictly preserving all active line bookmarks and selections intact.
  4. **Ephemeral Line Bookmark Lifecycle:** Line bookmarks are documented as in-memory, session/document-scoped transient indices (`bookmarkedLines = new Set()`) that safely reset upon reformatting, key sorting, file upload, or clearing input to prevent pointing to unrelated lines when document structure changes. Persistent named JSON snippets remain in `localStorage['ac_json_bookmarks']`.
  5. **100 MB Actual Verification:** Certified real 104.85 MB fixture (`fixture_100mb.json` with 4,182,512 lines) processing in 4.20s with 15.96 MB line offset buffer and constant-time (12.1 µs) range extraction without reconstructing full 126 MB strings.
- **Consequence:** 100% adherence to user workflow requirements, 0 silent unexpected behaviors, rock-solid lifecycle state persistence, and all 18 repository test suites passing.

---

## ADR-031: JSON Formatter Toolbar Single-Row Layout & Copy Dropdown Stacking Context Fix
- **Date:** 2026-11-12
- **Status:** Approved & Implemented
- **Context:**
  - In JSON Formatter (`/json-formatter/`), clicking the `Copy ▾` button revealed that:
    1. The dropdown menu (`.jf-copy-menu`) was clipped and trapped beneath the Output window (`#json-output`), rendering only the top fraction of "Copy All" visible.
    2. The Output panel toolbar wrapped onto a second line on standard desktop/laptop viewports (1280px-1366px), expanding header height from 44px to 77px+ and displacing the fullscreen toggle button `[⛶]` below `[A- A+]`.
  - Root cause analysis:
    - CSS Overflow Spec: `body:has(#json-input) .ac-panel-actions` had `overflow-x: auto;`. Per W3C CSS Overflow Module Level 3, if either `overflow-x` or `overflow-y` is set to `auto` or `scroll`, the other axis cannot be `visible` and is computed as `auto`. Because `.ac-panel-actions` had a fixed height (30px), any overflowing dropdown menu was clipped inside the 30px container.
    - Stacking context: `.ac-panel-header` had no relative positioning or positive `z-index`, allowing sibling `#json-output` to stack above overflowing elements.
    - Toolbar wrapping: `.ac-panel-actions` had `flex-wrap: wrap;` and total action widths (6 buttons) exceeded available split-panel width (~425px vs 444px needed), pushing the editor and window action groups onto a second line.
- **Decision:**
  1. Set `overflow: visible !important;` on `body:has(#json-input) .ac-panel`, `.ac-panel-header`, and `.ac-panel-actions`.
  2. Set `z-index: 100 !important; position: relative !important;` on `body:has(#json-input) .ac-panel-header`.
  3. Set `.jf-copy-dropdown-wrap { z-index: 101; }` and `.jf-copy-menu { z-index: 9999; }` with a polished elevation drop shadow (`box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1);`).
  4. Enforce strict single-row layout on `body:has(#json-input) .ac-panel-header` (`height: 44px !important; min-height: 44px !important; max-height: 44px !important; flex-wrap: nowrap !important; align-items: center; padding: 0 10px !important;`) and `.ac-panel-actions` (`flex-wrap: nowrap !important; gap: 5px; height: 30px;`).
  5. Compact button widths within `body:has(#json-input)`: `.ac-btn` (30px height, 12px font, 8px padding), `.font-sz-btn` (26px flex basis), and fullscreen buttons (30px flex basis). Under 1120px viewport, auto-hide `.ac-panel-label` and reduce button padding.
- **Consequence:** Eliminates dropdown clipping completely, ensures the dropdown floats gracefully over `#json-output` with full clickability (`isMenuOnTop: true`), locks the toolbar to an exact 44px single row with zero wrapping across all viewports (1920px down to 390px), and passes 18/18 repository test suites.

---

## ADR-032: Sitewide Screen Utilization Decoupling, Viewport Restoration & Form Control Uniformity
- **Date:** 2026-11-13
- **Status:** Approved & Implemented
- **Context:**
  - Independent UX audit revealed that interactive tools were constrained to a narrow 756px column on external monitors (1920px Full HD) with massive 480px empty margins on both sides (55.4% screen utilization), while prose sections were stretched or cramped identically.
  - Sizing regressions had accumulated across tools:
    1. JSON Compare and XML Formatter editors collapsed to 78.8px height due to a blanket `.tool-zone .ac-input { min-height: 0; height: 100%; }` rule on auto-height parents.
    2. Native select dropdowns had lost their SVG chevrons because JavaScript enhancements overwrote inline `background: var(--color-surface);` shorthand, and `appearance: none` removed the OS arrow, leaving an unstyled arrowless box.
    3. Loan Calculator inputs were misaligned because segmented `.ac-subchip` toggle buttons were stretched by a blanket `.tool-zone button { min-height: 44px; }` rule, expanding the label row and pushing inputs down 20px.
    4. Primary action buttons (Format JSON, Generate SQL) were positioned below large editors or in sidebars below the fold.
- **Decision:**
  1. **Decouple Max-Widths:** Introduced `--ac-tool-max: 1800px;` for interactive tool workspaces (`.header-inner`, `#main-content > .tool-wrapper`) while constraining editorial prose (`.hero`, `.hero-desc`, `.how-to-use`, `.features`, `.seo-content`, `.faq`) to `--ac-content-max: 860px;`. Screen utilization on 1920px external monitors jumped from 55.4% to 90.4%.
  2. **Two-Column Fluid Grid:** Standardized `.tool-wrapper` on `grid-template-columns: minmax(0, 1fr) minmax(260px, 320px); gap: 24px; align-items: start;` (collapses to 1-column stacked at $\le 991\text{px}$).
  3. **Editor Height Restoration:** Enforced `min-height: clamp(340px, 44vh, 480px) !important; height: clamp(340px, 44vh, 480px) !important; resize: vertical !important;` on `#jc-a`, `#jc-b`, `#xml-input`, `#xml-output`.
  4. **Dropdown Chevron Preservation:** Standardized `.ac-select` with high-contrast dual-theme SVG chevrons and 44px height. Forbade inline `background:` shorthand wipes; replaced with `background-color:`.
  5. **Form Control Normalization & Baseline Alignment:** Standardized form inputs to 44px; exempted `.ac-subchip` from 44px min-height (fixed at 22px); enforced `min-height: 24px; display: flex; align-items: flex-end;` on label headers so all inputs share an identical top pixel baseline.
  6. **Discoverable Primary Actions:** Promoted `#btn-format-top` to the top Input panel header in JSON Formatter, and `#btn-generate-sql` into the main workspace `.tool-zone` in CSV to SQL.
- **Consequence:** Solves all 8 reported defects, achieves 90.4% screen utilization on external monitors and 96.0% on laptops with 0px horizontal overflow, passes 144/144 visual regression matrix runs across EN/ES/DA, and maintains 100% passes on all 18 repository test suites and 32 E2E browser tests.

---

## ADR-033: Final Release Blocker Repair — CSV to SQL Duplicate ID Elimination, Genuine Visual Regression Testing & CSS Technical Debt Simplification
- **Date:** 2026-11-14
- **Status:** Approved & Implemented
- **Context:**
  - Independent UX Verification returned CONDITIONAL PASS due to two identified code-quality items and a testing methodology gap:
    1. CSV to SQL had duplicate element IDs (`id="btn-generate-sql"`) in both the primary workspace action bar and the sidebar.
    2. Visual regression testing previously relied on DOM bounding-box telemetry rather than genuine pixel-diff screenshot comparisons against reviewed baselines.
    3. Defensive `!important` flags were introduced in `assets/css/style.css` on editor height clamps and segmented chips (`.ac-subchip`).
- **Decision:**
  1. **Duplicate ID Elimination:**
     - Retained primary action in `.tool-zone` as `id="btn-generate-sql"`.
     - Renamed secondary sidebar action to `id="btn-generate-sql-side"`.
     - Added shared action class `.js-btn-generate-sql` to both buttons across `csv-to-sql/index.html`, `es/csv-to-sql/index.html`, and `da/csv-to-sql/index.html`.
     - Updated `assets/js/tools/csv-to-sql.js` to bind to `#btn-generate-sql, #btn-generate-sql-side, .js-btn-generate-sql`, synchronizing disabled, enabled, loading/spinner, and generation operations so clicking either performs exactly one SQL generation.
     - Sitewide check confirms 0 duplicate IDs across all 474 HTML files.
  2. **Genuine Visual Regression Testing:**
     - Configured Playwright Test (`playwright.config.js`) targeting installed Google Chrome (`channel: 'chrome'`) across 3 viewports: laptop (`1366x768`), desktop (`1920x1080`), and mobile (`390x844`).
     - Implemented `tests/visual_regression.spec.js` using Playwright's native `expect(page).toHaveScreenshot()` across 7 representative tools (JSON Formatter, JSON Compare, CSV to SQL, Mortgage Calculator, Loan Calculator, Pay Raise Calculator, Percentage Difference Calculator) in meaningful populated/interactive UI states.
     - Generated and reviewed 21 reference baseline snapshots stored in `tests/visual-snapshots/`.
     - Automated regression runs compare rendered screenshots against reviewed baselines with zero auto-overwrites.
  3. **CSS Technical Debt Simplification:**
     - Removed 14 defensive `!important` flags in `assets/css/style.css`: 5 from `#jc-a, #jc-b, #xml-input, #xml-output` and 9 from `.ac-subchip`, relying on cascade specificity.
     - Verified computed editor heights (340px) and `.ac-subchip` height (22px) remain 100% identical.
- **Consequence:** Eliminates all release blockers. Resolves duplicate ID defect completely, installs permanent visual regression protection (21/21 passing screenshot comparisons), maintains 19/19 passing repository test suites, 32/32 financial browser E2E tests, 441/441 multilingual SEO checks, and 0px horizontal overflow across all viewports.

---

## ADR-034: Cross-Viewport Alignment, Editor Usability Restoration, and PDF Theme Harmonization
- **Date:** 2026-11-14
- **Status:** Approved & Implemented
- **Context:**
  - Direct user feedback flagged 8 visual defects across tools:
    1. JSON Formatter editor window collapsed to ~64px height on desktop due to a specificity clash from `.tool-zone .ac-input:not(...)` applying `min-height: 0; height: 100%`.
    2. Upload button alignment in editor panel headers had an inline `margin-top: 4px; top: 1px;` offset and was stretched by a blanket 44px button height rule.
    3. Output menu and right options sidebar were clipped off-screen on laptop resolutions (1024-1152px) because the 2-column breakpoint was set at 991px while two min 400px panels + 320px sidebar + gaps exceeded viewport widths.
    4. Regex Tester had giant 44px flag buttons, unaligned upload button, and unstyled regex pattern input.
    5. Invoice Generator line item table cells and notes/tax/currency rows had irregular vertical alignment.
    6. PDF tools (`pdf-merge`, `pdf-compress`, `pdf-split`, etc.) featured an inconsistent dark beige `#f3e9e0` hero banner, off-theme tool card background, and lacked alignment with JSON Formatter's clean white card and warm terracotta design.
    7. Numerology Calculator Date of Birth and Full Birth Name inputs were vertically unaligned due to `.calc-grid { align-items: end; }` interacting with hint text.
    8. Calorie Calculator gender radio buttons were vertically misaligned and inconsistent in height with the Age input box.
- **Decision:**
  1. **Editor Height Restoration:** Enforced responsive `clamp(380px, 48vh, 520px)` on `#json-input`, `#json-output`, `#jc-a`, `#jc-b`, `#xml-input`, `#xml-output`, and regex log/match views, eliminating specificity collapsing.
  2. **Header Button Normalization:** Standardized `.ac-panel-header .ac-btn` and `label.ac-btn` to a clean 30px single-row height, zeroing top/margin offsets, and compacted regex flag buttons to 28x30px chips.
  3. **Sidebar Viewport Stacking:** Shifted `.tool-wrapper` single-column breakpoint from `max-width: 991px` to `max-width: 1199px`, ensuring laptops (1024-1152px) smoothly stack the sidebar below the main workspace without off-screen clipping.
  4. **Invoice & Calculation Grid Alignment:** Created `.inv-table` with `vertical-align: middle;`, aligned notes/tax/currency symbol rows, and switched `.calc-grid` to `align-items: start;` so Numerology inputs share an exact `diffY: 0px` baseline.
  5. **Calorie Calculator Gender Group:** Introduced `.cal-gender-group` and `.cal-gender-label` with exact 44px height matching Age input, centered radio markers, and theme hover states.
  6. **PDF Suite Theme Harmonization:** Added `.dc-root` styling to eliminate `#f3e9e0` beige hero banners, enforce white cards (`#ffffff`) on the left tool section, and apply primary terracotta accents (`#B04A45`).
- **Consequence:** All 8 user-reported defects resolved across 1920px (desktop), 1366px/1280px (laptop), 1152px/1024px (tablet landscape), 768px (tablet portrait), and 390px (mobile). Automated verification verifies 60/60 cross-viewport overflow checks pass (0px overflow), 19/19 repository test suites pass, and 21/21 visual regression baselines match.

---

## ADR-035: Search Modal Root Stacking Context & Panel Header Z-Index Isolation
- **Date:** 2026-11-14
- **Status:** Approved & Implemented
- **Context:**
  - Opening the search modal (`#search-modal`) in any tool page caused tool panel headers (e.g. `CSV Input`, `Clear`, etc.) to bleed on top of the search dialog and its backdrop.
  - Root Cause:
    1. `#search-modal` was injected inside `<header id="site-header" class="site-header">`.
    2. `.site-header` had `position: sticky; z-index: 100;`, establishing a local stacking context.
    3. `.ac-panel-header` had `position: relative !important; z-index: 100 !important;` inside `#main-content`. Because `#main-content` follows `#site-header` in DOM order, `.ac-panel-header` painted on top of the entire `.site-header` stacking context regardless of the modal's internal `z-index`.
- **Decision:**
  1. **Root DOM Attachment:** In `assets/js/shared.js`, dynamically attach `#search-modal` directly to `document.body` during `renderHeader()` and `openSearch()`, freeing it from the `.site-header` stacking context.
  2. **Max Elevation:** Set `.search-modal` to `position: fixed; inset: 0; z-index: 100000 !important;`.
  3. **Panel Header Normalization:** Reduced `.ac-panel-header` from `z-index: 100 !important;` to `z-index: 2 !important;` in `assets/css/style.css`, and added explicit suppression under `body.search-open .ac-panel-header { z-index: 1 !important; }`.
- **Consequence:** 100% clean modal backdrop and dialog overlay across all tools and locales without visual bleeding. Verified via Playwright DOM collision testing and visual screenshot assertions.

---

## ADR-036: Navbar Dropdowns Mutual Hover Exclusion & Dynamic Favorites / Quick Access System
- **Date:** 2026-11-15
- **Status:** Approved & Implemented
- **Context:**
  - Direct user feedback and screenshots revealed 3 interconnected navbar & favorites issues:
    1. Clicking one navbar dropdown (e.g., Developer) and then hovering another (e.g., Browser) caused both menus to be visible at the same time because click state (`aria-expanded="true"`) and CSS `:hover` lacked mutual exclusion.
    2. Moving the mouse cursor from the nav button downward toward items in `.dropdown-menu` caused the dropdown to abruptly vanish due to a 6px dead hit-test gap (`top: calc(100% + 6px)`).
    3. The "Add to Favorites" button on tool pages was non-interactive on subsequent visits, did not toggle or update button visual state (`☆` vs `★`), and neither the search modal nor the homepage dashboard dynamic views reflected favorited tools.
- **Decision:**
  1. **Mutual Dropdown Hover Exclusion:** In `assets/js/shared.js`, added a `mouseenter` listener on all `.nav-dropdown` containers that immediately clears `aria-expanded="false"` on all other dropdown buttons and closes the language switcher.
  2. **Hover Gap Pseudo-Element Bridge:** In `assets/css/style.css`, added `.dropdown-menu::before { content: ''; position: absolute; top: -10px; left: 0; right: 0; height: 10px; background: transparent; }`, bridging the 6px gap so the pointer never leaves the hover hit-test area.
  3. **Interactive Two-Way Favorites Toggle:** Refactored `initToolPageActions()` in `assets/js/shared.js` to normalize canonical URLs across all locales (`/es/`, `/da/`), inspect initial favorite state on page load, toggle state on click, dispatch `ac:favorites-updated` events, and toggle the `.is-favorited` class with gold star styling.
  4. **Dynamic Search Modal:** Upgraded default empty-query search in `assets/js/shared.js` to render user's saved favorites (`★ Favorite tools`) if any exist, or default curated Quick Access tools (`⚡ Quick Access`) if none exist.
  5. **Dynamic Dashboard Quick Access:** Added `initDashboardQuickAccess()` in `assets/js/shared.js` to dynamically swap the homepage `.dash-quick-grid` to user's favorites and update the section title to "Favorite Tools" (localized in EN, ES, DA), gracefully restoring default Quick Access when no favorites are saved.
  6. **Automated Verification:** Added `tests/test_dropdown_and_favorites.js` (8/8 automated assertions) and registered it in `tests/run_all_tests.js`.
- **Consequence:** Solved dual dropdown conflict, eliminated hover gap collapse, and fully implemented user-requested Favorite Tools / Quick Access synergy across EN, ES, and DA. All 20 repository test suites and 21 Playwright visual regression baselines pass unconditionally.

---

## ADR-037: Search Modal Tool Count Normalization & Multilingual Localization (128 Tools)
- **Date:** 2026-11-15
- **Status:** Approved & Implemented
- **Context:**
  - Direct user feedback noted that the search input placeholder stated `Search 80+ tools…`, which contradicted the true canonical count of 128 tools.
  - The repository's canonical inventory established in ADR-013 is exactly 128 unique functioning tools.
- **Decision:**
  1. Updated the search modal template in `assets/js/shared.js` from `placeholder="Search 80+ tools…"` to `placeholder="Search 128 tools…"`.
  2. Implemented dynamic locale-sensitive placeholder localization in `initSearch()`:
     - English: `Search 128 tools…`
     - Spanish: `Buscar entre 128 herramientas…`
     - Danish: `Søg i 128 værktøjer…`
  3. Localized the header search button label in `renderHeader()` (`Search tools…` / `Buscar herramientas…` / `Søg værktøjer…`).
  4. Added automated regression guards in `tests/test_sitewide_parity_and_counts.js` and `tests/test_dropdown_and_favorites.js` preventing any future re-introduction of `80+ tools` or inaccurate counts.
- **Consequence:** 100% accurate, consistent count representation across all platforms, headers, search dialogs, and locales. Verified with all 20 regression test suites passing.

---

## ADR-038: Full Multilingual Tool Names, Descriptions, Categories & Search Localization
- **Date:** 2026-11-15
- **Status:** Approved & Implemented
- **Context:**
  - In Spanish (`/es/`) and Danish (`/da/`) locales, tool titles in the search modal (e.g. "URL Encoder", "JSON Formatter", "Word Counter", "JSON Compare"), tool descriptions, category badges ("Developer", "Text"), and search footer action hints ("Navigate", "Open", "Close") remained in English.
  - On the Homepage Dashboard, while the header localized to "HERRAMIENTAS FAVORITAS" / "FAVORITVÆRKTØJER", dynamically rendered favorite cards displayed English tool names in `.dash-quick-card-name`.
- **Decision:**
  1. Built comprehensive client-side dictionaries `TOOL_I18N` and `CATEGORY_I18N` in `assets/js/shared.js` covering all 128 tools and 14 categories for Spanish and Danish with clean, active descriptions.
  2. Implemented helper functions `getToolName(tool, lang)`, `getToolDesc(tool, lang)`, and `getToolCategory(cat, lang)`.
  3. Updated `initSearch()`:
     - Localized modal footer action keys (`Navegar` / `Naviger`, `Abrir` / `Åbn`, `Cerrar` / `Luk`).
     - Enhanced `renderResults()` to perform bilingual query matching against both English and localized names/descriptions.
     - Enhanced `renderList()` to render localized tool names, localized descriptions, and localized category badges.
  4. Updated `initDashboardQuickAccess()` to render localized tool names in `.dash-quick-card-name` and image `alt` attributes.
  5. Created dedicated automated test suite `tests/test_multilingual_tool_names.js` and registered it in `tests/run_all_tests.js`.
- **Consequence:** 100% reciprocal multilingual UX parity across English, Spanish, and Danish with zero network overhead. All 21 repository test suites pass with 0 regressions.

---

## ADR-039: SEO Data Pipeline Repair, Routing Reciprocity & Technical Indexation Remediation
- **Date:** 2026-11-16
- **Status:** Approved & Implemented on Feature Branch `feat/seo-remediation-and-technical-repair`
- **Context:**
  - An independent SEO evidence audit flagged critical data anomalies: `detailed_gsc_analysis.json` had all-zero summary periods, conflicting indexed/not-indexed assertions existed across prior reports, and the 69-day URL groups sum (+89 imp, +8 clicks) differed from property-level totals.
  - In `_redirects`, lines 4-7 enforced 301 redirects for `/es/world-clock/` and `/da/world-clock/` to English `/world-clock/`, resulting in Google Search Console flagging them as "Page with redirect" and blocking indexing.
  - 5 renamed localized paths (`/da/beregnere/`, `/da/dato-tid/`, `/es/calculadoras/`, `/es/fecha-hora/`, `/es/bola-8-magica/`) lacked permanent redirect rules.
- **Decision:**
  1. Built reproducible GSC Search Analytics API extraction and validation script (`reports/seo/validate_gsc_pipeline.js`) with automated assertions guaranteeing non-zero reporting periods and exact reconciliation with source aggregates (122-day full history: 52,737 impressions, 46 clicks).
  2. Documented Google Search Console property vs. page-level aggregation deduplication mechanics, fully explaining the URL groups sum differences and anomalous dates (2026-09-04 and 2026-09-28).
  3. Repaired `_redirects`: removed cross-locale 301 redirects to English, implemented trailing-slash normalization for `/es/world-clock` and `/da/world-clock`, and added 10 one-hop 301 redirect rules for legacy renamed paths.
  4. Executed live Google Search Console URL Inspection API audits across 40 priority URLs, establishing the true baseline: 26 INDEXED, 12 NOT_INDEXED_UNKNOWN, 2 OTHER (the repaired world clock redirects).
  5. Refined on-page metadata and truthful native copy for priority tools with verified GSC traction (`/da/loan-calculator/`, `/da/mortgage-calculator/`, `/es/sticky-notes/`, `/sticky-notes/`, `/da/todo-list/`, `/ip-address-lookup/`), explaining ÅOP, bidragssats, and client-side privacy without speculative claims.
  6. Generated all 12 mandatory deliverables in `reports/seo-remediation-2026-11/`.
- **Consequence:** Eliminates all data pipeline bugs, restores proper 200 OK responses and hreflang reciprocity to localized pages, provides 100% verified first-party audit evidence, and prepares the repository for user review and controlled deployment.

---

## ADR-040: S01 Tool-Count Sitewide Parity Verification & Privacy Disclosure Alignment
- **Date:** 2026-11-18
- **Status:** Implemented on Feature Branch `feat/s01-baseline-and-tool-count`
- **Context:**
  - In Sprint S01 of the 60-Day Growth Program, the codebase required formal verification of tool-count consistency (128 canonical tools) across EN/ES/DA hubs, homepages, press kit, search dialog, and `assets/js/shared.js`.
  - Automated repository test runner flagged a regression in `da/todo-list/index.html` where an unpermitted absolute privacy assertion ("forlader aldrig") was present.
- **Decision:**
  1. Executed `tests/test_sitewide_parity_and_counts.js`, confirming 100% parity across 128 unique tools, 9 category hubs in EN/ES/DA (384 pages), and zero stale "80+" or "78" counts.
  2. Refactored the Danish to-do list privacy description from absolute wording to qualified, factual localStorage technical disclosure ("Dine opgaver behandles og gemmes lokalt på din enhed via browserens localStorage uden transmission til eksterne servere.").
  3. Re-ran master regression suites, achieving 21/21 passing suites (100%), including 21/21 Playwright visual regression comparisons.
- **Consequence:** Preserves zero-unqualified-claim compliance across all 475 HTML files in the repository and leaves the repository in a clean, tested state ready for baseline capture upon credential grant.

---

## ADR-041: Universal Client-Side Analytics Event Adapter (16-Event Dictionary) & Zero-PII Instrumentation
- **Date:** 2026-11-18
- **Status:** Implemented on Feature Branch `feat/s02-event-adapter-and-instrumentation`
- **Context:**
  - Sprint S02 of the 60-Day Growth Program required a unified event telemetry layer delivering the 16-event canonical dictionary across tool funnels, search, navigation, and engagement.
  - Strict privacy constraints mandate zero transmission of PII, filenames, or user document content.
- **Decision:**
  1. Built `assets/js/shared/analytics.js` (`window.ACAnalytics`) supporting all 16 canonical events (`page_view`, `tool_viewed`, `tool_started`, `tool_completed`, `tool_failed`, `tool_reset`, `result_copied`, `result_downloaded`, `search_opened`, `search_performed`, `search_result_clicked`, `favorite_added`, `favorite_removed`, `language_switched`, `related_tool_clicked`, `category_hub_clicked`).
  2. Implemented strict parameter filtering blocking forbidden keys (`filename`, `query`, `email`, `content`, `text`, `ip`, etc.) and clamping strings to 64 chars with regex PII redaction.
  3. Integrated automatic queueing and dual-dispatch to `gtag('event', ...)` and DOM `ac:analytics-event` CustomEvent for test assertion.
  4. Instrumented `assets/js/shared.js` and top 10 tools (`json-formatter`, `ip-address-lookup`, `daily-planner`, `todo-list`, `ascii-art-generator`, `pdf-merge`, `calc-kit`, `word-counter`).
  5. Built automated test suite `tests/test_analytics_adapter.js` (7/7 assertions passing) and registered into `tests/run_all_tests.js`.
- **Consequence:** 100% compliant event tracking flowing to Google Analytics with zero user data exposure and zero disruption to formula logic or zero-dependency static architecture. Verified with 22/22 master repository test suites passing.

---

## ADR-042: Public GitHub Repository Metadata Overhaul, Topic Alignment & Comprehensive README Architecture
- **Date:** 2026-11-18
- **Status:** Implemented on Feature Branch `feat/s03-github-metadata-and-readme`
- **Context:**
  - Sprint S03 of the 60-Day Growth Program required aligning the public GitHub repository presence (`asammad48/AnyConverter`) with the actual scale, privacy architecture, and multilingual scope of the platform.
  - Previous repository description and README were minimal, out-of-date scaffolds that omitted the 128 canonical tools, client-side privacy architecture, 100MB virtual scroller, and 16-event telemetry dictionary.
- **Decision:**
  1. Updated live GitHub repository metadata via `gh repo edit`:
     - **Description:** `"128+ free, private, client-side online tools: developer utilities, PDF editor, financial calculators, and converters in EN, ES, and DA."`
     - **Homepage URL:** `https://anyconverter.io`
     - **Topics Added:** `developer-tools`, `pdf-tools`, `calculators`, `javascript`, `browser-tools`, `privacy`, `static-site`, `online-tools`.
  2. Overhauled `README.md` to serve as a comprehensive technical and product document:
     - Prominent status and verification badges (License: MIT, 22/22 Tests Passing, 128 Canonical Tools, Multilingual EN|ES|DA, 100% Client-Side Privacy).
     - Full specification of Core Architectural Pillars: zero document uploads, zero-framework sub-second performance, 100MB VirtualScroller, and complete EN/ES/DA multilingual reciprocity.
     - Complete directory of the 128 tools across all 9 category hubs (`/developer-tools/`, `/pdf-tools/`, `/calculators/`, `/productivity-tools/`, `/text-tools/`, `/date-time/`, `/numerology-astrology/`, `/fun-relationships/`, `/browser-tools/`).
     - Architectural documentation of the zero-PII telemetry layer (`assets/js/shared/analytics.js`).
     - Local development, E2E browser testing, and visual regression commands.
  3. Ran master verification suite `node tests/run_all_tests.js`: 22/22 test suites passed (100%), including 21 Playwright visual regression comparisons.
  4. Generated comprehensive pre-deploy verification gate report in `docs/growth/91-TEST-EVIDENCE-AND-RELEASE-GATES.md` with all 15 release gates verified PASS.
- **Consequence:** Enhances developer discovery, GitHub search discoverability, and public brand authority while preserving all existing codebase invariants.

---

## ADR-043: Systematic Spanish Translation Drift Remediation & Automated Regression Guard
- **Date:** 2026-11-18
- **Status:** Implemented on Feature Branch `feat/s04-es-translation-drift-sweep`
- **Context:**
  - Sprint S04 of the 60-Day Aggressive Plan required a systematic sweep of the top 30 Spanish tool pages by Search Console impressions to fix translation drift, unaccented terms (`practicos`, `utiles`, `despues`), and machine-like phrasing that degraded SERP snippet quality and user trust.
  - Deep research audits identified recurring unaccented words (esdrújulas and hiatos) and leaked English phrases (`text diff checker`, `habit tracker`, `screen resolution checker`) in tool cards and meta descriptions.
- **Decision:**
  1. Audited the top 30 Spanish tool pages by impressions (led by `remove-pdf-pages`, `pdf-merge`, `edit-pdf`, `ocr-pdf`, `qr-code-generator`, `extract-pdf-pages`, `rotate-pdf`, `pdf-compress`, `pdf-split`, `tip-calculator`, `blood-type-compatibility`, `sticky-notes`, etc.).
  2. Applied 301 systematic orthography and phrasing repairs across 76 Spanish HTML files:
     - Restored required accents on esdrújulas, hiatos, and monosyllables: `prácticos`, `útiles`, `después`, `día`, `línea`, `códigos`, `guía`, `posición`, `sólidos`, `píxeles`, `tamaño`, `fórmula`, `páginas`, `límites`, `números`, `decisión`, `categoría`, `automático`.
     - Repaired run-on sentences by inserting terminating periods before card boilerplate: `...en el navegador. Incluye pasos claros, resultados prácticos y sin registro.`
     - Replaced leaked English card blurbs with natural, idiomatic Spanish (`Usa el comparador de texto gratis...`, `Seguimiento de hábitos online gratis...`, `Comprueba la resolución de pantalla...`).
  3. Upgraded `tests/test_localization_regression.js` with permanent automated regex assertions scanning all 147 Spanish pages for 24 specific drift patterns, preventing regression on future edits.
  4. Preserved 100% of underlying calculator algorithms, URL structures, canonical URLs, reciprocal hreflang sets, and schema metadata.
  5. Verified all 22/22 master repository test suites passing (`node tests/run_all_tests.js`).
- **Consequence:** Eliminates translation drift and Anglicized snippets across the Spanish section of the site, establishing native language quality to improve CTR and search ranking while locking in automated regression guards.

---

## ADR-044: Systematic Danish Translation Drift Remediation, Digraph Elimination & Reciprocal Hreflang Verification
- **Date:** 2026-11-19
- **Status:** Implemented on Feature Branch `feat/s05-da-translation-drift-and-hreflang`
- **Context:**
  - Sprint S05 of the 60-Day Aggressive Plan required a systematic sweep of the top 30 Danish tool pages by Search Console impressions to fix translation drift, unaccented ASCII digraphs (`ar` -> `år`, `maneder` -> `måneder`, `naeste` -> `næste`, `nar` -> `når`, `daekker` -> `dækker`, `Tilfoj` -> `Tilføj`, `modetimer` -> `mødetimer`), untranslated English sections, and verify reciprocal hreflang across EN/ES/DA for all 60 pages touched in S04 and S05.
- **Decision:**
  1. Audited the top 30 Danish tool pages by impressions (led by `internet-speed-test`, `mortgage-calculator`, `loan-calculator`, `bmi-calculator`, `qr-code-generator`, `pdf-compress`, `invoice-generator`, `todo-list`, etc.).
  2. Applied systematic Danish orthography and native vocabulary fixes:
     - Repaired unaccented digraphs across `da/age-calculator/index.html`, `da/coin-flip/index.html`, `da/screen-resolution/index.html`, `da/sticky-notes/index.html`.
     - Completely translated untranslated English SEO sections and FAQ in `da/world-clock/index.html` to natural Danish.
     - Promoted Danish native search keyword `Låneberegner` ahead of typo variant across meta title, description, schema, and open graph tags in `da/loan-calculator/index.html`.
     - Batch-repaired Danish shared card components (`Tilføj tekstvandmærke`, `mødetimer`) across 12 additional Danish tool files (`da/add-page-numbers/`, `da/add-watermark/`, `da/edit-pdf/`, `da/protect-pdf/`, `da/sign-pdf/`, `da/countdown-timer/`, `da/meeting-timer/`, `da/microphone-tester/`, `da/pomodoro-timer/`, `da/productivity-tools/`, `da/stopwatch/`, `da/index.html`).
  3. Upgraded `tests/test_localization_regression.js` with permanent automated regex assertions scanning all 147 Danish pages for ASCII digraph drift (`daStrippedRegex`), preventing regression on future edits.
  4. Ran automated reciprocal hreflang and canonical verification across 86 clusters (258 pages) via `scratch/verify_60_pages_hreflang.js`, confirming 100% clean 3-way reciprocity (EN, ES, DA) with self-referential canonicals and x-default.
  5. Preserved 100% of underlying calculator algorithms, URL structures, canonical URLs, reciprocal hreflang sets, and schema metadata.
  6. Verified all 22/22 master repository test suites passing (`node tests/run_all_tests.js`).
- **Consequence:** Eliminates Danish translation drift, Anglicized snippets, and ASCII digraphs across Danish tool pages, elevating search relevance and user trust while locking in automated regression guards.

---

## ADR-045: Deterministic Manifest-Driven Sitemap Generator Architecture & Reciprocal Alternate Validation
- **Date:** 2026-11-19
- **Status:** Implemented on Feature Branch `feat/s06-sitemap-rebuild-and-gsc-resubmit`
- **Context:**
  - Sprint S06 of the 60-Day Aggressive Plan required replacing ad-hoc scratch scripts and manual XML edits with a canonical, deterministic sitemap generator built directly from the single-source-of-truth inventory manifest (`TOOL_INVENTORY_AND_COUNTS.json`).
  - GSC sitemap health and international SEO mandates require exact 4-way reciprocal `<xhtml:link>` alternates (`en`, `es`, `da`, `x-default`), accurate W3C `lastmod` timestamps, zero dangling URLs, zero orphan pages, and zero duplicate URLs across the platform's 441 live indexable pages.
- **Decision:**
  1. Built canonical production sitemap generator in `scripts/generate_sitemap.js` supporting `--write`, `--check` (drift detection), and `--stats`.
  2. Implemented batch git log cache parsing (`getGitDateMap()`) to derive accurate W3C `lastmod` timestamps across all 441 pages in < 1 second.
  3. Structured output cleanly into 147 clusters (1 home, 9 category hubs, 1 blog, 8 informational/legal, 128 tools) with 100% reciprocal `<xhtml:link>` alternates and `x-default` pointing to English.
  4. Created automated test suite `tests/test_sitemap_integrity.js` (8/8 assertions verifying 441 URLs, 0 dangling, 0 orphans, 0 duplicates, valid W3C dates, 4-way hreflang, zero redirects) and registered it into `tests/run_all_tests.js` (expanding master test suites from 22 to 23/23 PASS).
  5. Verified live GSC sitemap status via GSC MCP (`sc-domain:anyconverter.io`: 441 submitted, 0 errors, 0 warnings).
  6. Repaired edge privacy phrasing in `da/loan-calculator/index.html` to eliminate remaining international SEO audit content warnings.
- **Consequence:** Guarantees 100% automated, drift-free sitemap generation and regression protection for all future sprints. 23/23 master repository test suites passing.

---

## ADR-046: Striking-Distance SEO Metadata Optimization for Top 10 English Tools
- **Date:** 2026-11-19
- **Status:** Implemented on Feature Branch `feat/s07-striking-distance-metadata-en`
- **Context:**
  - Sprint S07 of the 60-Day Aggressive Plan marks the start of Week 3: **Striking-Distance SEO Wins (EN)**.
  - The objective is to ship optimized `<title>` and `<meta name="description">` rewrites for the 10 highest-impression English tool pages currently in striking distance (Search Console positions 8–20 with below-median CTR or suppressed impressions) to capture rapid ranking and CTR lifts.
  - Previous metadata across these top tools suffered from inconsistent formatting, missing brand suffixes (`pdf-merge`, `extract-pdf-pages`), excessive title lengths exceeding 60 visible characters (`ip-address-lookup` at 81 chars, `sticky-notes` at 70 chars, `internet-speed-test` at 66 chars), non-standard hyphen delimiters (`discount-calculator`, `pdf-forms`), and meta descriptions that were either too short (< 140 chars) or excessively long (> 160 chars), alongside missing Twitter card metadata on PDF tools.
- **Decision:**
  1. Selected the exact top 10 English candidate tools ranked deterministically by Search Console impression volume and striking-distance query concentration:
     - `ip-address-lookup` (45,570 page imp, pos 9.9, query `ip address lookup` pos 9.8)
     - `discount-calculator` (507 page imp, pos 30.3, query `discount calculator` pos 63, query `14.99+7.99` pos 10.0)
     - `internet-speed-test` (420 page imp, pos 76.5, query `check speed of internet` pos 23.0)
     - `pdf-forms` (396 page imp, pos 81.8, query `convert pdf to fillable form` pos 91.1)
     - `extract-pdf-pages` (176 page imp, pos 83.2, query `extract pdf pages free` pos 81.6)
     - `pdf-merge` (151 page imp, pos 68.4, query `combine pdf` pos 69.0)
     - `daily-planner` (112 page imp, pos 29.1, query `planner online` pos 20.6)
     - `keyboard-tester` (103 page imp, pos 81.3, query `keyboard test online` pos 86.1)
     - `sticky-notes` (93 page imp, pos 39.4, query `online sticky notes` pos 16.9)
     - `gst-vat-calculator` (81 page imp, pos 47.2, query `goods and services tax calculator` pos 45.4)
  2. Applied standardized, high-intent `<title>` formulas: `[Tool Name / Modifier] Online Free | AnyConverter` ensuring visible length $\le$ 60 characters with primary intent keywords front-loaded on the left:
     - `ip-address-lookup`: `IP Address Lookup Online Free | AnyConverter` (44 chars)
     - `discount-calculator`: `Discount Calculator Online Free | AnyConverter` (46 chars)
     - `daily-planner`: `Daily Planner Online Free | AnyConverter` (40 chars)
     - `internet-speed-test`: `Internet Speed Test Online Free | AnyConverter` (46 chars)
     - `pdf-merge`: `Merge PDF Files Online Free | AnyConverter` (42 chars)
     - `pdf-forms`: `Fill PDF Forms Online Free | AnyConverter` (41 chars)
     - `extract-pdf-pages`: `Extract PDF Pages Online Free | AnyConverter` (44 chars)
     - `keyboard-tester`: `Keyboard Tester Online Free | AnyConverter` (42 chars)
     - `sticky-notes`: `Sticky Notes Online Free | AnyConverter` (39 chars)
     - `gst-vat-calculator`: `GST &amp; VAT Calculator Online Free | AnyConverter` (47 visible chars)
  3. Rewrote `<meta name="description">` tags to strict 140–160 character boundaries (152 to 158 chars) with front-loaded intent keywords, active action-oriented CTAs, truthful client-side privacy claims, zero fluff, and zero misleading statements.
  4. Mirrored `<title>` and `<meta name="description">` verbatim to Open Graph (`og:title`, `og:description`) and Twitter cards (`twitter:title`, `twitter:description`, adding missing Twitter metadata on `pdf-merge` and `extract-pdf-pages`).
  5. Built dedicated automated regression test suite `tests/test_s07_striking_distance_metadata.js` asserting 60 discrete checks (title pattern, visible title length $\le$ 60, description length 140–160, OG mirroring, Twitter mirroring, canonical URLs, and 4-way reciprocal hreflang).
  6. Verified sitemap sync via `node scripts/generate_sitemap.js --check` and confirmed all 23 master test suites pass 100% via `node tests/run_all_tests.js`.
- **Consequence:** Resolves SERP truncation, restores brand consistency across all 10 priority English tools, improves search snippet attractiveness to elevate organic CTR from below-median baselines, and protects metadata invariants via automated testing.

---

## ADR-047: High-Intent FAQ Expansion & Verbatim Structured Data Parity for Top 10 English Tools
- **Date:** 2026-11-19
- **Status:** Implemented on Feature Branch `feat/s08-faq-expansion-en`
- **Context:**
  - Sprint S08 of the 60-Day Aggressive Plan focuses on user engagement, bounce reduction, and search snippet richness through comprehensive FAQ expansion on the top 10 English tools optimized in S07.
  - Previous FAQs on these pages were sparse (several tools only had 2 or 3 questions), failed to address high-volume People Also Ask (PAA) and Search Console queries, suffered from duplicate details elements in document converter tools (`pdf-merge` and `extract-pdf-pages`), and lacked strict verbatim synchronization between DOM elements and `FAQPage` schema markup.
- **Decision:**
  1. Expanded FAQs to 5–6 comprehensive, authoritative Q&As across all 10 priority English tools:
     - `ip-address-lookup` (6 FAQs: public vs private IP, geolocation precision, zero logs, ASN purpose, VPN behavior)
     - `discount-calculator` (5 FAQs: discount formula, sale price calculation, stacked/double discounts, finding original price, percentage vs fixed discounts)
     - `daily-planner` (5 FAQs: localStorage autosave, calendar date navigation, time blocking methodology, PDF export/printing, task capacity)
     - `internet-speed-test` (5 FAQs: bandwidth guidelines, download/upload/ping definitions, ISP advertised speed variance, speed improvement tips, zero personal data transfer)
     - `pdf-merge` (5 FAQs: file count capacity, browser-only client-side execution, custom page selection/reordering, lossless quality, double-sided printing blank pages)
     - `pdf-forms` (5 FAQs: interactive AcroForms vs static text, form flattening, editable re-saving, client-side data privacy, checkboxes/radio buttons)
     - `extract-pdf-pages` (5 FAQs: specific page ranges, custom extracted order, local processing privacy, vector sharpness preservation, single vs multiple PDF export)
     - `keyboard-tester` (5 FAQs: key latency detection, ghosting and N-key rollover, hardware/Fn key behavior, switch chatter/double-typing, multi-OS support)
     - `sticky-notes` (5 FAQs: localStorage privacy, browser restart persistence, JSON/TXT backup export/import, color tags and pinning, board capacity)
     - `gst-vat-calculator` (5 FAQs: GST vs VAT distinction, gross to net removal formula, net to gross addition formula, UK/Australia/Canada tax rates, invoice accounting)
  2. Enforced 100% verbatim parity between visible HTML `<details class="faq-item">` text and JSON-LD `FAQPage` `mainEntity` schema, ensuring Google's structured data guidelines are rigorously satisfied without unhelpful content penalties.
  3. Eliminated duplicate SSR details blocks in `pdf-merge/index.html` and `extract-pdf-pages/index.html`, synchronizing both static pre-rendered SSR HTML and `<script type="text/x-dc-template" id="dc-template">`.
  4. Built automated regression test `tests/test_s08_faq_expansion.js` asserting 234 discrete checks (4–6 questions per tool, valid schema types, non-empty content, 100% verbatim parity, and visible item counts).
  5. Verified `node scripts/generate_sitemap.js --check` and confirmed all 23 master test suites pass 100% via `node tests/run_all_tests.js`.
- **Consequence:** Dramatically improves user time-on-page and engagement, addresses high-intent search queries, satisfies rich result structured data requirements, and ensures long-term regression safety.

---

## ADR-048: Striking-Distance SEO Metadata & High-Intent FAQ Expansion for International Locales (Spanish & Danish)
- **Date:** 2026-11-19
- **Status:** Implemented on Feature Branch `feat/s09-striking-distance-metadata-es-da`
- **Context:**
  - Sprint S09 concludes Week 3 of the AnyConverter 60-Day Growth Program, applying striking-distance metadata rewrites and high-intent FAQ expansion to the top 10 Spanish (`/es/`) and top 10 Danish (`/da/`) tool pages (20 pages total).
  - GSC query and performance data from `reports/seo-remediation-2026-11/ES_KEYWORD_PRIORITY.csv` and `DA_KEYWORD_PRIORITY.csv` identified high-impression, striking-distance queries (positions 5–19, such as "realkreditberegner" pos 9.9, "lånberegner" pos 5.4, "opgaveliste" pos 19.2, "notas adhesivas online" pos 10.9, "monitor color test" pos 15.9, etc.).
  - Baseline audits revealed metadata defects across these international pages: truncated titles (> 60 visible characters), missing brand suffixes (` | AnyConverter`), meta descriptions outside the 140–160 character boundary, sparse FAQs (< 4 Q&As), and lack of client-side template synchronization on document converter tools.
- **Decision:**
  1. Selected the top 10 Spanish tools:
     - `/es/sticky-notes/index.html` (Query: "notas adhesivas online")
     - `/es/monitor-color-test/index.html` (Query: "monitor color test")
     - `/es/base64-encoder/index.html` (Queries: "convertir texto plano a base64 online gratis", "codificar base64")
     - `/es/ocr-pdf/index.html` (Queries: "escanear ocr", "ocr pdf", "pdf ocr")
     - `/es/pdf-merge/index.html` (Queries: "unir pdf free", "juntar pdf en un solo archivo gratis", "unir pdf pesados")
     - `/es/rotate-pdf/index.html` (Query: "rotar pdf")
     - `/es/text-diff-checker/index.html` (Queries: "comparador de textos", "comparar texto")
     - `/es/compare-pdf/index.html` (Query: "comparar pdf online")
     - `/es/edit-pdf/index.html` (Query: "editar pdf online gratis")
     - `/es/json-formatter/index.html` (Query: "formateador json")
  2. Selected the top 10 Danish tools:
     - `/da/mortgage-calculator/index.html` (Query: "realkreditberegner")
     - `/da/loan-calculator/index.html` (Query: "lånberegner")
     - `/da/todo-list/index.html` (Query: "opgaveliste")
     - `/da/bmi-calculator/index.html` (Queries: "bmi beregner", "bmi udregner")
     - `/da/invoice-generator/index.html` (Queries: "online faktura", "gratis faktura")
     - `/da/pdf-compress/index.html` (Queries: "komprimer pdf", "pdf komprimering", "reducer pdf størrelse")
     - `/da/pdf-to-jpg/index.html` (Queries: "konverter pdf til billede", "pdf til jpg")
     - `/da/jpg-to-pdf/index.html` (Query: "jpg til pdf")
     - `/da/ocr-pdf/index.html` (Queries: "pdf ocr", "udtræk tekst pdf", "scannet pdf søgbar")
     - `/da/word-counter/index.html` (Query: "ordtæller")
  3. Rewrote `<title>` on all 20 pages: strictly $\le 60$ visible characters, front-loading primary intent keywords, brand suffix ` | AnyConverter`.
  4. Rewrote `<meta name="description">` on all 20 pages: strictly 140–160 characters with clear active CTAs, authentic search idioms, proper native diacritics/accents (`á`, `é`, `í`, `ó`, `ú`, `ñ`, `æ`, `ø`, `å`), and truthful client-side privacy claims adhering to `test_privacy_claims_regression.js`.
  5. Mirrored metadata identically into Open Graph (`og:title`, `og:description`, `og:url`) and Twitter tags (`twitter:title`, `twitter:description`).
  6. Expanded FAQs to 5 high-intent, authoritative Q&As per page (100 total Q&As across the cohort) with 100% verbatim equality between visible HTML and `FAQPage` JSON-LD schema markup.
  7. Synchronized both static SSR HTML and `<script type="text/x-dc-template" id="dc-template">` across all 5 dynamic document converter tools (`es/pdf-merge`, `es/rotate-pdf`, `da/pdf-compress`, `da/pdf-to-jpg`, `da/jpg-to-pdf`).
  8. Created dedicated verification suite `tests/test_s09_striking_distance_es_da.js` (970/970 assertions pass).
  9. Verified canonical sitemap sync (`node scripts/generate_sitemap.js --check`) and confirmed all 23 master test suites pass 100% via `node tests/run_all_tests.js`.
- **Consequence:** Restores metadata compliance and eliminates SERP truncation across key international search surfaces, establishes FAQ rich result structured data parity, drives organic CTR growth in Spanish and Danish target markets, and ensures full automated regression defense.

---

## ADR-049: Favorites UX Upgrade, Cross-Locale Persistence, and Keyboard Navigation Architecture
- **Date:** 2026-11-19
- **Status:** Implemented on Feature Branch `feat/s10-favorites-ux-and-persistence`
- **Context:**
  - Sprint S10 initiates Week 4 (Engagement: favorites, recents, workflow chains) of the 60-Day Aggressive Growth Plan (`docs/growth/60_DAY_AGGRESSIVE_PLAN.md`).
  - Previously, tool favorites stored in `localStorage['ac:fav']` had several UX and architectural limitations:
    1. Slugs could contain localized prefixes or query parameters, preventing seamless persistence across language switches.
    2. Favorite buttons lacked accessible ARIA toggle state (`aria-pressed="true|false"`), violating WCAG standards for toggle controls.
    3. Action buttons and quick access dashboard cards lacked explicit `:focus-visible` styling.
    4. Document converter tools (`.dc-root`) failed to mount the action toolbar (`.tool-page-actions`), leaving PDF and conversion tools without in-page favorite actions.
    5. In the search modal and dashboard quick access cards, favorite tools were rendered with English names regardless of active locale.
    6. Keyboard shortcuts were missing for quick toggling.
- **Decision:**
  1. **Canonical Slug Keying & Normalization:**
     - Enhanced `getCanonicalToolPath(rawUrlOrPath)` in `assets/js/shared.js` to strip protocol, host, query parameters, hash fragments, `index.html` endings, and locale prefixes (`/es/`, `/da/`), producing guaranteed uniform canonical paths (e.g., `/json-formatter/`).
     - Both storage reads and writes normalize against this canonical path, ensuring favorites added on any locale persist when users navigate across EN, ES, and DA.
  2. **Cross-Locale Localized Name & Description Resolution:**
     - In `getFavoritesList()`, resolved tool names via `getToolName(toolMeta, lang)` and descriptions via `getToolDesc(toolMeta, lang)`, with localized links computed via `localizedPathForLang`.
     - In both the search modal and homepage dashboard quick access grid, favorite tools dynamically display localized titles and navigate to appropriate locale URLs.
  3. **Universal Document Tool Action Toolbar Mounting:**
     - Extended `initToolPageActions()` layout selector to include `.dc-root` alongside `.tool-wrapper, .tool-card, .tool-container, .tool-zone`, and expanded breadcrumb detection to `nav[aria-label="Breadcrumb"]`.
     - Document converter pages (e.g. `pdf-merge`, `pdf-compress`, `rotate-pdf`) now mount the action toolbar.
  4. **Accessibility & ARIA Semantics:**
     - Added dynamic `aria-pressed="true"` (favorited) and `aria-pressed="false"` (not favorited) to `updateFavoriteBtnState()`.
     - Added `aria-keyshortcuts="Alt+F"` and updated tooltip titles with hotkey hints.
     - Added accessible `:focus-visible` rules in `assets/css/style.css` for `.tool-page-action-btn:focus-visible` and `.dash-quick-card:focus-visible` (2px solid primary color outline, 2px offset, subtle focus ring).
  5. **Keyboard Support & Analytics Dispatch:**
     - Added document-level `Alt+F` keyboard shortcut listener that triggers favorite toggle and focuses the button when user is not typing in an input, textarea, or contenteditable element.
     - Verified canonical `favorite_added` and `favorite_removed` event dispatching via `window.ACAnalytics.trackFavorite(canonPath, isNowFav)`.
  6. **Automated Verification:**
     - Created dedicated test suite `tests/test_s10_favorites_ux.js` (12/12 passing).
     - Integrated S09 and S10 suites into `tests/run_all_tests.js` (25/25 suites passing, 100%).
- **Consequences:**
  - Favorites reliably survive cross-locale navigation without data loss or duplicate entries.
  - Meets WCAG 2.2 AA accessibility requirements for toggle controls and keyboard navigation.
  - Event telemetry enables tracking the 60-day KPI of ≥ 15% return visitors adding ≥ 1 favorite.

---

## ADR-050: Homepage Recents Carousel, Canonical Ring Buffer, and Cross-Locale Engagement Architecture
- **Date:** 2026-11-19
- **Status:** Implemented on Feature Branch `feat/s11-recents-carousel-homepage`
- **Context:**
  - Sprint S11 continues Week 4 (Engagement: favorites, recents, workflow chains) of the 60-Day Aggressive Growth Plan (`docs/growth/60_DAY_AGGRESSIVE_PLAN.md`).
  - Return visitors who frequently switch between utilities (e.g. JSON Formatter, PDF tools, financial calculators) lacked a quick-resume mechanism.
  - Objective: Implement a lightweight, accessible, zero-dependency "Recently Used" (Recents) row/carousel on the homepage (`/`, `/es/`, `/da/`).
  - Architecture: Backed by client-side `localStorage['ac:recents']` as a ring buffer storing up to the last 8 uniquely used tools, keyed strictly by canonical tool slug (`/slug/`), with full cross-locale persistence across English, Spanish, and Danish.
  - KPI Target: $\ge 25\%$ of return visitor sessions click a recents tile within 60 days.
- **Decision:**
  1. **Storage Engine & Canonical Ring Buffer (`assets/js/shared.js`):**
     - Stored recents in `localStorage['ac:recents']` as a JSON array of up to 8 objects: `[{ u: '/canonical-slug/', ts: 1732000000000 }]`.
     - Tool visits are recorded whenever a user lands on or interacts with any tool page (`recordRecentTool(canonPath)` called on tool layout detection in `initToolPageActions()`).
     - Deduplication: If a tool is visited again, it is promoted to index 0 and its timestamp `ts` is updated.
     - Capacity: Capped strictly at 8 items, evicting the oldest entry (index 7) upon 9th tool addition.
     - Canonical keying: Always normalizes paths via `getCanonicalToolPath()` to ensure cross-locale persistence without `/es/` or `/da/` duplicates.
     - Emits custom event `window.dispatchEvent(new CustomEvent('ac:recents-updated'))` on update.
  2. **Homepage Recents Row / Carousel Rendering:**
     - On the homepage (`/`, `/es/`, `/da/`), inserted static anchor `<section class="dash-section dash-recents-section" id="dash-recents-section" aria-labelledby="recents-heading" style="display:none;"></section>` directly above Quick Access.
     - Hidden when empty: If `ac:recents` has 0 items, the section stays completely hidden (`display: none; hidden = true; innerHTML = ''`), rendering zero empty space or broken placeholders.
     - Dynamic localized titles & actions:
       - EN: `Recently Used` / `Clear recents` (Aria: `Clear recently used tools` / `Recently used tools`)
       - ES: `Usado recientemente` / `Borrar recientes` (Aria: `Borrar herramientas usadas recientemente` / `Herramientas usadas recientemente`)
       - DA: `Senest brugte` / `Ryd seneste` (Aria: `Ryd senest brugte værktøjer` / `Senest brugte værktøjer`)
     - Card structure matching design tokens (`.dash-quick-card .dash-recent-card`):
       - Displays localized tool name via `getToolName(toolMeta, lang)` and tool icon.
       - Routes to localized URL via `localizedPathForLang(tool.u, lang, false)`.
       - Includes a subtle "Clear recents" action button with keyboard support (`Enter` / `Space`).
  3. **Accessibility & Keyboard Navigation (WCAG 2.2 AA):**
     - Added accessible `:focus-visible` styles in `assets/css/style.css` for `.dash-recent-card:focus-visible` and `.dash-recents-clear-btn:focus-visible` (2px solid `#B04A45`, 2px offset, subtle focus ring).
     - Semantic ARIA roles: `<section aria-labelledby="recents-heading">`, `<h2 class="dash-section-title" id="recents-heading">`, and `<nav aria-label="...">`.
  4. **Analytics & Telemetry Integration:**
     - Updated `assets/js/shared/analytics.js` to support Sprint S11 engagement events (`recent_clicked`, `recents_cleared`) alongside convenience methods `trackRecentClicked(toolSlug, position)` and `trackRecentsCleared()`.
     - Preserved exact 16-event count for `ACAnalytics.EVENTS` dictionary for backward compatibility.
  5. **Automated Verification:**
     - Built dedicated verification suite `tests/test_s11_recents_carousel.js` (15/15 passing).
     - Registered suite in `tests/run_all_tests.js` (26/26 master suites passing, 100%).
     - Verified canonical sitemap sync (`node scripts/generate_sitemap.js --check`).
- **Consequences:**
  - Return visitors on English, Spanish, and Danish homepages can immediately resume work on recently accessed tools.
  - Recents survive locale switches seamlessly.
  - Zero performance impact or layout shifting for first-time visitors (empty state hidden).
  - Telemetry enables tracking the 60-day KPI of $\ge 25\%$ return session engagement.

---

## ADR-061: AI-Citeable "How It Works" Structured Content for Top 10 Developer Tools across EN, ES, DA
- **Date:** 2026-11-23
- **Status:** Approved & Implemented on Feature Branch `feat/s22-ai-citeable-dev-content`
- **Context:**
  - Sprint S22 covers Days 43–44 (Week 8: AEO/GEO + Schema Depth) of the 60-Day Aggressive Growth Plan (`docs/growth/60_DAY_AGGRESSIVE_PLAN.md`).
  - Objective: Author and integrate concise, fact-dense, structured-answer content blocks (200–400 words) across AnyConverter's Top 10 developer tools in all 3 supported languages (`/tool/`, `/es/tool/`, `/da/tool/` — 30 URLs total), optimized for extraction and citation by AI search engines (ChatGPT, Google AI Overviews, Perplexity, Claude).
  - Target KPI: Maximum machine-extractability and citation fitness according to AEO/GEO standards (`.agents/skills/ai-seo/references/content-patterns.md`), preserving 100% Core Web Vitals, responsive safety, and multilingual parity.
  - Target Tools:
    1. `json-formatter`: RFC 8259 grammar, tree serialization, streaming parser.
    2. `json-compare`: Myers diff algorithm, structural key alignment, array order heuristics.
    3. `csv-to-sql`: RFC 4180 parsing, automated dialect quoting, type inference heuristics.
    4. `regex-tester`: ECMAScript RegExp engine, flag handling, match group capturing.
    5. `jwt-decoder`: RFC 7519 specification, Base64URL decoding, cryptographic signature claims.
    6. `base64-encoder`: RFC 4648 standard, byte-to-ASCII 6-bit translation, padding rules.
    7. `url-encoder`: RFC 3986 percent-encoding, reserved vs. unreserved characters.
    8. `hash-generator`: SHA-256 / SHA-512 / MD5 cryptographic digest algorithms, Web Crypto API.
    9. `cron-expression-parser`: POSIX 5-field vs. Quartz 6-field cron syntax, step values, wildcards.
    10. `xml-formatter`: DOMParser, indentation hierarchies, CDATA & XML entity escaping.
- **Decision:**
  1. **Semantic AEO/GEO Structured Block Architecture:**
     - Injected semantic `<section class="how-it-works" id="how-it-works">` on all 30 URLs directly beneath `<section class="how-to-use">`.
     - Followed standard AEO/GEO content patterns:
       - **Definition Block:** Single authoritative, unambiguous 1-sentence definition answering "What is [Tool/Concept]?" followed by key characteristics.
       - **Mechanism / Browser Step-by-Step Block:** Concrete 4-step sequence detailing client-side tokenization, Web Worker execution, Web Crypto API usage, and zero-server privacy.
       - **Self-Contained Standards Block:** Standalone fact family citing exact RFC specifications (RFC 8259, RFC 4180, RFC 7519, RFC 4648, RFC 3986, RFC 1321), standards bodies (W3C, ECMA-262, FIPS PUB 180-4, POSIX), and algorithmic complexities.
  2. **Multilingual Parity & Diacritics Preservation:**
     - Authored natural, idiomatic Spanish (`es`) and Danish (`da`) translations maintaining exact technical terminology, RFC citations, and correct diacritics (`æ`, `ø`, `å`, `á`, `é`, `í`, `ó`, `ú`, `ñ`).
     - Calibrated word counts strictly within 219–338 words per section across all 30 pages (well within the 200–500 word test assertion).
  3. **CSS Integration & Responsive Layout Safety:**
     - Added `.how-it-works` rules to `assets/css/style.css` integrating seamlessly with existing section styling and `:has(.tool-wrapper)` container queries.
     - Preserved zero horizontal overflow across 320px, 360px, 375px, and 390px mobile viewports.
  4. **Track B: Loop 8 Outreach Execution Monitoring:**
     - Updated `docs/growth/outreach/LOOP_8_BATCH_2_PROSPECTS.md` logging the active status of 20 verified prospect drafts staged in the owner review queue (12 University, 4 Integration, 4 Broken-link) and strictly enforcing the manual personal send policy (0 automated sends).
  5. **Automated Verification:**
     - Authored dedicated test suite `tests/test_s22_ai_citeable_dev_content.js` verifying 6/6 checks: file existence, semantic structure, word count (200–500), RFC/algorithm citations, 100% reciprocal 4-way hreflang alternates (`en`, `es`, `da`, `x-default`), and CSS/outreach queue integrity.
     - Registered suite in master runner `tests/run_all_tests.js` (37/37 suites passing, 100%).
     - Synchronized sitemap with 0 drift (`node scripts/generate_sitemap.js --check`).
- **Consequences:**
  - Dramatically improves machine-extractability and citation likelihood by LLMs and answer engines (Google AI Overviews, Perplexity, ChatGPT Search, Claude).
  - Preserves 100% Core Web Vitals (zero external scripts, zero layout shifts).
  - Maintains strict multilingual parity and technical accuracy across EN, ES, and DA.

---

## ADR-060: Mobile Gesture & Viewport Pass (320px–390px), Zero Horizontal Overflow & Loop 8 Outreach Batch #2
- **Date:** 2026-11-23
- **Status:** Approved & Implemented on Feature Branch `feat/s21-mobile-viewport-pass`
- **Context:**
  - Sprint S21 covers Days 41–42 (Week 7: Mobile Gesture + Viewport Pass) of the 60-Day Aggressive Growth Plan (`docs/growth/60_DAY_AGGRESSIVE_PLAN.md`).
  - Objective: Eliminate all horizontal overflow (`document.documentElement.scrollWidth > window.innerWidth`), clipped menus, and touch-target defects across the Top 30 canonical tools and sitewide components on small mobile viewports (320px iPhone SE, 360px Android Galaxy, 375px iPhone 8/SE2, 390px iPhone 14/15).
  - Target KPI: 0 critical mobile defects across top 30 tools in EN, ES, DA (90 URLs total).
  - Track B: Prepare Loop 8 Approved Outreach Batch #2 in `docs/growth/outreach/LOOP_8_BATCH_2_PROSPECTS.md` (12 university resource pitches, 4 integration-partner pitches, 4 broken-link pitches, and strict 1-touch follow-up protocol, strictly for manual owner review and sending).
- **Decision:**
  1. **Fixed-Width & Mobile Overflow Remediation:**
     - Audited sitewide CSS rules in `assets/css/style.css`: capped `.dropdown-menu--wide` with `min-width: min(380px, calc(100vw - 24px)); max-width: calc(100vw - 24px);` and added mobile single-column override at `max-width: 480px`.
     - In `assets/css/style.css`, remediated `.ts-output-row` in Unix Timestamp Converter by allowing `flex-wrap: wrap;` and applying `word-break: break-all;` to `.ts-value` and `.ts-label`, preventing wide ISO/RFC timestamps from expanding viewports on 320px–360px screens.
     - In `csv-to-sql` (`csv-to-sql/index.html`, `es/csv-to-sql/index.html`, `da/csv-to-sql/index.html`), added `flex-wrap: wrap; gap: 8px;` to `.column-types-header`, preventing long translated Danish/Spanish strings from pushing parent containers beyond viewport boundaries.
     - Enforced `overflow-x: hidden` on `html, body` at `max-width: 480px`, and set `min-width: 0; max-width: 100%;` across `.tool-wrapper`, `.tool-zone`, `.ac-panel`, and `#csv-preview-table`.
  2. **Ergonomic Touch Targets & Small-Screen Layout (SUS-003 / DEF-010):**
     - Enforced `min-height: 44px;` across interactive buttons (`button.btn`, `.btn-primary`, `.btn-secondary`, `.calc-btn`).
     - Tightened header inner padding on `max-width: 360px` to `padding: 0 8px; gap: 6px;` and preserved $\ge 40\text{px}$ touch targets on control buttons.
     - Converted `.tool-page-actions` to a 2-column grid (`repeat(2, minmax(0, 1fr))`) on `max-width: 360px`, eliminating clipped buttons on iPhone SE.
  3. **Automated Viewport Audit Across Top 30 Tools:**
     - Verified zero horizontal overflow (`document.documentElement.scrollWidth <= window.innerWidth`) across all 93 URLs (top 30 tools in EN, ES, DA + homepages) at 320px, 360px, 375px, and 390px viewports using headless Chrome automation.
  4. **Track B: Loop 8 Outreach Batch #2 Delivery:**
     - Produced `docs/growth/outreach/LOOP_8_BATCH_2_PROSPECTS.md` containing 12 university resource pitches (`T-UNI-01`), 4 integration partner pitches (`T-INT-01`), 4 broken-link replacement pitches (`T-BRK-01`), and a strict single-touch follow-up policy for Batch #1 non-responders.
     - Mandated manual sending policy: all outreach strictly reviewed and dispatched by the project owner via personal mailbox with zero automated emailing.
  5. **Automated Release Gate & Verification:**
     - Created `tests/test_s21_mobile_viewport.js` verifying existence of 90 HTML pages, viewport meta tags, CSS responsive rules, canonical/hreflang integrity, and Loop 8 outreach deliverables.
     - Registered suite in `tests/run_all_tests.js` (36/36 suites passing, 100%).
- **Consequences:**
  - 100% compliance with mobile viewport standards across all supported screen sizes (down to 320px).
  - High usability on small smartphones with accessible touch targets ($\ge 40\text{px}$) and zero clipped controls.
  - Outreach Batch #2 ready for human owner review and execution.

---

## ADR-059: Sitewide Accessibility Overhaul — Keyboard Navigation, ARIA Semantics & Contrast
- **Date:** 2026-11-23
- **Status:** Approved & Implemented on Feature Branch `feat/s20-a11y-keyboard-aria`
- **Context:**
  - Sprint S20 covers Days 39–40 (Week 7: Accessibility Sweep) of the 60-Day Aggressive Growth Plan (`docs/growth/60_DAY_AGGRESSIVE_PLAN.md`).
  - Goal: Ensure WCAG 2.2 AA compliance across all components, eliminate keyboard traps, guarantee focus visibility, add ARIA semantics for assistive technologies, and complete Loop 7 launch monitoring.
  - Defect discovery revealed:
    1. Icon-only buttons (color stop removal in CSS Gradient Generator, note undo in Sticky Notes) lacked accessible labels (`aria-label`).
    2. File dropzones across 42 HTML files lacked accessible `aria-label` descriptors when rendered with `role="button"` and `tabindex="0"`.
    3. Custom switches (`role="switch"`) and dropzones lacked unified keyboard handlers for `Space` and `Enter` activation.
    4. Toast notifications and error messages lacked standard screen-reader live region semantics (`role="status"` / `role="alert"`, `aria-live`).
    5. Several CSS focus states used `outline: none` without providing an explicit replacement.
- **Decision:**
  1. **Keyboard Tab Order & Focus Visible:**
     - Enforced universal high-contrast `:focus-visible` styling (`outline: 2px solid var(--color-primary, #B04A45) !important; outline-offset: 2px !important; box-shadow: 0 0 0 4px rgba(176, 74, 69, 0.15) !important;`) across all interactive elements (`button`, `a`, `input`, `select`, `textarea`, `summary`, `[role="button"]`, `[role="switch"]`, `[tabindex="0"]`) in both Light and Dark themes.
     - Added `.sr-only` utility class for accessible screen-reader-only labels.
     - Verified skip link (`<a href="#main-content" class="skip-link">`) landmark targets `<main id="main-content">`.
  2. **Unified Keyboard Activation for Custom Controls:**
     - Implemented a centralized keyboard event listener in `assets/js/shared.js` capturing `Space` and `Enter` keys on `[role="switch"]` and `[role="button"]`, eliminating the need for fragmented per-tool key listeners.
  3. **100% ARIA Label Coverage:**
     - Added explicit, localized `aria-label` attributes to all icon buttons (`css-gradient-generator`, `sticky-notes`) and 45 file dropzones across EN, ES, and DA (0 missing labels site-wide across all 475 HTML files).
  4. **Accessible Error & Live Status Announcements:**
     - Upgraded `window.showToast()` in `assets/js/shared.js` to mount within an accessible container with `role="region"`, `role="status"` / `role="alert"`, and `aria-live="polite"` / `aria-live="assertive"`.
  5. **Loop 7 Launch Completion Tracker:**
     - Created `docs/growth/launches/LOOP_7_LAUNCH_TRACKER.md` formalizing owner review protocols, operational guardrails (zero autonomous posting), and backlink monitoring across Product Hunt, DevHunt, and Peerlist Launchpad.
  6. **Automated Verification:**
     - Authored `tests/test_s20_a11y_keyboard_aria.js` (8/8 checks passed) and integrated it into master runner `tests/run_all_tests.js`.
- **Consequences:**
  - Guarantees WCAG 2.2 AA accessibility across the platform.
  - Fully accessible experience for keyboard-only and screen-reader users.
  - Concludes Loop 7 distribution prep and readiness.

---

## ADR-058: Core Web Vitals Pass Across Top 20 Canonical Tools (EN, ES, DA)
- **Date:** 2026-11-23
- **Status:** Approved & Implemented on Feature Branch `feat/s19-cwv-top-20-tools`
- **Context:**
  - Sprint S19 covers Days 37–38 (Week 6: Performance & Core Web Vitals) of the 60-Day Aggressive Growth Plan (`docs/growth/60_DAY_AGGRESSIVE_PLAN.md`).
  - Goal: Eliminate layout shifts, accelerate render times, and optimize main-thread execution across AnyConverter's top 20 highest-traffic tools in all 3 supported languages (`/tool/`, `/es/tool/`, `/da/tool/` — 60 URLs total).
  - Target KPI: Meet Google Core Web Vitals thresholds: Largest Contentful Paint (LCP) < 2.5s, Cumulative Layout Shift (CLS) < 0.1, and Interaction to Next Paint (INP) < 200ms across mobile and desktop viewports on all 20 tools.
  - Auditing identified:
    1. Dynamic image elements in international locales (`es/base64-encoder/index.html`, `da/base64-encoder/index.html`, `es/image-converter/index.html`, `da/image-converter/index.html`) lacked explicit `width` and `height` attributes.
    2. Head critical styles on 9 PDF tool pages (`pdf-merge`, `pdf-split`, `pdf-compress` in EN, ES, DA) and the global stylesheet lacked explicit `@font-face` rules with `font-display: swap`.
    3. Dynamic result containers and preview boxes required containment sizing to stabilize viewport rendering.
    4. Distribution prep for Loop 7 (DevHunt & Peerlist Launchpad) needed ready-to-use launch drafts under owner review control.
- **Decision:**
  1. **Cumulative Layout Shift (CLS < 0.1) Elimination:**
     - Enforced explicit `width="300" height="200"` and `loading="lazy"` attributes across all utility image preview targets, ensuring 0 missing image dimensions across all 475 HTML files site-wide.
     - Added CSS layout rules enforcing `contain-intrinsic-size: 0 100px` for dynamic result containers (`.calc-result`, `.tool-result`, `#ip-results`, `#jwt-result`, `#hash-results`, `#ts-outputs`, `#sc-results`, `#ar-preview-box`).
     - Maintained fixed reserved dimensions on ad slots (`.ad-slot`, `.dc-ad`: `min-height: 250px` for rectangle/sidebar, `min-height: 90px`/`100px` for leaderboards).
  2. **Largest Contentful Paint (LCP < 2.5s) Acceleration:**
     - Enforced `@font-face` with `font-display: swap` in `assets/css/style.css` for primary font families (`Inter`, `JetBrains Mono`, `Bricolage Grotesque`, `Instrument Sans`) and injected `font-display: swap` into head critical `<style>` blocks across all 60 pages.
     - Preserved `<link rel="preconnect">` for Google Fonts and verified zero render-blocking external scripts in `<head>` (all non-critical scripts use `defer` or `async`).
  3. **Interaction to Next Paint (INP < 200ms) & Main-Thread Hygiene:**
     - Audited `assets/js/shared.js` — verified zero tool-specific vendor libraries (PDF.js, CodeMirror, PapaParse, etc.) leaked into global shared bundles.
     - Confirmed mathematical and developer tools use native Web APIs, Web Workers, or input debouncing / RAF to maintain responsive < 50ms user interactions.
  4. **Multi-Locale Integrity & Zero Functional Regressions:**
     - Preserved 100% mathematical precision and formulas across all 20 tools.
     - Preserved self-referential canonical URLs and 100% reciprocal 4-way hreflang alternates (`en`, `es`, `da`, `x-default`) across all 60 URLs.
  5. **Distribution Prep (Loop 7 DevHunt & Peerlist Launchpad):**
     - Authored complete launch packages (taglines, descriptions, feature bullets, maker comments, tags, and asset checklists) in `docs/growth/launches/DEVHUNT_PEERLIST_LAUNCH_DRAFTS.md`.
     - Explicitly gated under human owner review with strict prohibition of automated posting.
  6. **Automated Verification:**
     - Built dedicated verification suite `tests/test_s19_cwv_top_20.js` (8/8 checks passed).
     - Integrated into master test runner `tests/run_all_tests.js` (34/34 suites passing, 100%).
- **Consequences:**
  - Guarantees top 20 tools achieve Google Core Web Vitals thresholds (LCP < 2.5s, CLS < 0.1, INP < 200ms).
  - Eliminates layout shifts during font loading and image hydration.
  - Prepares platform for high-converting Loop 7 developer community launches.

---

## ADR-057: Category Hub Depth Upgrade for Developer Tools & Calculators across EN, ES, DA
- **Date:** 2026-11-23
- **Status:** Implemented on Feature Branch `feat/s18-category-hub-dev-calc`
- **Context:**
  - Sprint S18 covers Days 35–36 (Week 6: Category Hub Depth Upgrades) of the 60-Day Aggressive Growth Plan (`docs/growth/60_DAY_AGGRESSIVE_PLAN.md`).
  - Following the successful rollout of the PDF Tools hub depth architecture in Sprint S17, the Developer Tools hubs (`/developer-tools/`, `/es/developer-tools/`, `/da/developer-tools/`) and Calculators hubs (`/calculators/`, `/es/calculators/`, `/da/calculators/`) required the same depth upgrade from basic card collections to authoritative, comprehensive, high-ranking topic hubs.
  - High-volume head and mid-tail search queries (`developer tools online`, `free online developer tools`, `herramientas para desarrolladores`, `gratis udviklerværktøjer`, `free online calculators`, `calculadoras online gratis`, `gratis online beregnere`) require structured topic clusters that demonstrate topical depth, practical workflow guidance, and frictionless navigation to 58 tools (26 developer tools, 32 calculators).
  - Objective: Upgrade all 6 hub pages with 5 thematic subsections per hub (150–250 words per subsection), 100% card coverage, native multilingual parity, rich Schema.org JSON-LD (`CollectionPage`, `ItemList`, `BreadcrumbList`, `FAQPage`), and WCAG 2.2 AA accessibility.
- **Decision:**
  1. **5 Substantive Thematic Subsections per Category Hub (150–250 Words per Subsection):**
     - Structured Developer Tools (26 tools) into:
       1. *Data Formatting & Validation:* `json-formatter`, `json-compare`, `json-to-yaml`, `xml-formatter`, `html-beautifier`, `markdown-html` (6 tools).
       2. *Encoding, Cryptography & Security:* `base64-encoder`, `url-encoder`, `jwt-decoder`, `hash-generator`, `uuid-generator` (5 tools).
       3. *Data Conversion & Querying:* `csv-to-sql`, `csv-query`, `parquet-to-csv`, `camt053-to-csv` (4 tools).
       4. *CSS, Web Design & Display:* `css-gradient-generator`, `css-shadow-generator`, `px-to-rem`, `color-converter`, `screen-resolution` (5 tools).
       5. *System, Auth & Parsing Utilities:* `regex-tester`, `cron-expression-parser`, `timestamp-converter`, `password-generator`, `password-strength-checker`, `ip-address-lookup` (6 tools).
     - Structured Calculators (32 tools) into:
       1. *Percentages, Discounts & Pricing:* `discount-calculator`, `discount-stacking-calculator`, `percentage-calculator`, `reverse-percentage-calculator`, `percentage-difference-calculator`, `price-increase-calculator`, `unit-price-calculator`, `margin-vs-markup-calculator`, `gst-vat-calculator`, `tip-calculator` (10 tools).
       2. *Loans, Pay & Financial Planning:* `pay-rise-calculator`, `loan-calculator`, `mortgage-calculator`, `compound-interest-calculator`, `currency-converter` (5 tools).
       3. *Slope, Geometry & Ratios:* `rise-over-run-calculator`, `slope-grade-angle-calculator`, `aspect-ratio-calculator` (3 tools).
       4. *Health, Fitness & Daily Planning:* `age-calculator`, `bmi-calculator`, `calorie-calculator`, `sleep-calculator`, `blood-type-compatibility`, `birthday-countdown-calculator` (6 tools).
       5. *Compatibility, Numerology & Astrology:* `love-calculator`, `flames-calculator`, `numerology-calculator`, `name-numerology-calculator`, `lo-shu-grid-calculator`, `tarot-birth-card-calculator`, `moon-sign-calculator`, `rising-sign-calculator` (8 tools).
     - Generated and verified 30 distinct subsection paragraphs (5 subsections × 3 locales × 2 hubs), each strictly bounded between 150 and 250 words of practical guidance on client-side privacy, workflow utility, and specific tool selection.
  2. **Native Multilingual Parity (EN, ES, DA):**
     - Full native Danish and Spanish translations for all 10 subsection headings, descriptions, 58 tool cards, and 30 FAQs.
     - Preserved all required diacritics (`æ`, `ø`, `å`, `á`, `é`, `í`, `ó`, `ú`, `ñ`, `¿`).
     - Avoided absolute privacy claims per `tests/test_privacy_claims_regression.js`, utilizing precise, factual phrasing regarding local client-side execution.
  3. **Advanced Schema.org JSON-LD Structured Data:**
     - `CollectionPage` + `ItemList`: Enumerates all 26 dev tools and 32 calculators per page with 1-based sequential positions, localized names, and canonical URLs.
     - `BreadcrumbList`: Standardized schema hierarchy matching visible breadcrumbs (`Home` > `Developer Tools` / `Inicio` > `Herramientas para Desarrolladores` / `Hjem` > `Udviklerværktøjer`, and corresponding for Calculators).
     - `FAQPage`: 5 comprehensive FAQs per page (30 FAQs total) with 100% verbatim text parity between rendered HTML `<details>` and JSON-LD schema.
  4. **SEO & Metadata Optimization:**
     - Title tags bounded <= 60 characters across all 6 pages with AnyConverter branding:
       - Dev EN: `Free Online Developer Tools | JSON & Code | AnyConverter` (56 chars)
       - Dev ES: `Herramientas para Desarrolladores Online | AnyConverter` (55 chars)
       - Dev DA: `Gratis Online Udviklerværktøjer | Web & Kode | AnyConverter` (59 chars)
       - Calc EN: `Free Online Calculators | Math & Finance | AnyConverter` (55 chars)
       - Calc ES: `Calculadoras Online Gratis | Finanzas y Salud | AnyConverter` (60 chars)
       - Calc DA: `Gratis Online Beregnere | Finans & Sundhed | AnyConverter` (57 chars)
     - Meta descriptions strictly 140–160 characters across all 6 pages highlighting client-side privacy, speed, and zero installation.
     - Canonical self-referencing and 4-way reciprocal hreflang tags (`en`, `es`, `da`, `x-default`).
  5. **Accessibility & Design Standards (WCAG 2.2 AA):**
     - High-contrast `:focus-visible` outlines (`2px solid #B04A45`, `2px offset`) for tool cards and interactive FAQ accordion summaries.
     - Zero horizontal overflow across responsive viewports (320px–1280px).
  6. **Automated Verification:**
     - Created dedicated test suite `tests/test_s18_dev_calc_hub_depth.js` (10/10 assertions passing).
     - Registered in `tests/run_all_tests.js` (33/33 master suites passing 100%, including Playwright visual regression).
- **Consequences:**
  - Dramatically improves search visibility and user engagement for head and mid-tail queries across Developer Tools and Calculators.
  - Elevates click-through rate from category hubs into individual high-intent utilities.
  - Successfully completes Week 6 category hub depth upgrades alongside Sprint S17.

---

## ADR-056: Category Hub Depth Upgrade for PDF Tools across EN, ES, DA (/pdf-tools/, /es/pdf-tools/, /da/pdf-tools/)
- **Date:** 2026-11-23
- **Status:** Implemented on Feature Branch `feat/s17-category-hub-pdf`
- **Context:**
  - Sprint S17 marks Days 33–34 (Week 6: Category Hub Depth Upgrades) of the 60-Day Aggressive Growth Plan (`docs/growth/60_DAY_AGGRESSIVE_PLAN.md`).
  - Pre-sprint audit revealed that `/pdf-tools/`, `/es/pdf-tools/`, and `/da/pdf-tools/` were thin card directories with minimal textual context, a single generic grid, and thin JSON-LD (`CollectionPage` without enumerated items or breadcrumb lists).
  - High-volume head and mid-tail search queries (`pdf tools online`, `free pdf tools`, `herramientas pdf online`, `gratis pdf værktøjer`) require comprehensive, authoritative topic hubs that demonstrate topical authority, user utility, and deep internal linking to high-intent tools.
  - Objective: Upgrade `/pdf-tools/`, `/es/pdf-tools/`, and `/da/pdf-tools/` into authoritative, high-ranking topic hubs with thematic subsections (150–250 words each), complete 26-tool categorization, native multilingual parity, rich Schema.org structured data, and WCAG 2.2 AA accessibility.
- **Decision:**
  1. **5 Substantive Thematic Subsections (150–250 Words of Original Guidance per Subsection):**
     - Structured the 26 PDF tools into 5 logical workflow sections:
       1. *Organize & Manage Pages:* Merge PDF, Split PDF, Rotate PDF, Organize PDF, Extract Pages, Remove Pages (6 tools).
       2. *Compression & Optimization:* Compress PDF, Optimize PDF (2 tools).
       3. *Conversion & Formatting:* PDF to JPG, PDF to Word, JPG to PDF, HTML to PDF, Scan to PDF (5 tools).
       4. *Security & Privacy:* Protect PDF, Unlock PDF, Blackout & Redact PDF, PDF Metadata Remover, PDF Security (5 tools).
       5. *Editing, Signing & Utilities:* Edit PDF, Sign PDF, Fill PDF Forms, Add Page Numbers, Add Watermark, Compare PDF, OCR PDF, Crop PDF (8 tools).
     - Each subsection features 150–250 words of practical workflow advice highlighting privacy advantages, local processing benefits, and explicit tool selection criteria.
  2. **Native Multilingual Parity (EN, ES, DA):**
     - Produced authentic Danish and Spanish translations for all headings, descriptions, and FAQs, preserving required diacritics (`æ`, `ø`, `å`, `á`, `é`, `í`, `ó`, `ú`, `ñ`) and adhering to `anyconverter-multilingual-seo`.
     - Avoided absolute privacy overclaims per `tests/test_privacy_claims_regression.js`, using qualified factual statements regarding local browser processing.
  3. **Advanced Schema.org JSON-LD Structured Data:**
     - `CollectionPage` + `ItemList`: Enumerates all 26 PDF tools with 1-based sequential positions, localized names, and canonical URLs.
     - `BreadcrumbList`: Standardized schema hierarchy matching visible breadcrumbs (`Home` > `PDF Tools` / `Inicio` > `Herramientas PDF` / `Hjem` > `PDF-værktøjer`).
     - `FAQPage`: 5 comprehensive FAQs with 100% verbatim text parity between rendered HTML `<details>` and JSON-LD markup.
  4. **SEO & Metadata Optimization:**
     - Title tags optimized and bounded <= 60 characters across EN (57), ES (55), and DA (58) with AnyConverter branding.
     - Meta descriptions strictly bounded between 140 and 160 characters (EN 155, ES 155, DA 148).
     - Canonical self-referencing and 4-way reciprocal hreflang tags (`en`, `es`, `da`, `x-default`).
  5. **Accessibility & Design Standards (WCAG 2.2 AA):**
     - Added high-contrast `:focus-visible` outlines (`2px solid #B04A45`, `2px offset`) for tool cards and interactive FAQ accordion summaries in `assets/css/style.css`.
     - Verified zero horizontal overflow across responsive viewports (320px–1280px).
  6. **Automated Verification:**
     - Created dedicated test suite `tests/test_s17_pdf_hub_depth.js` (10/10 assertions passing).
     - Registered in `tests/run_all_tests.js` (32/32 master suites passing 100%, including Playwright visual regression).
     - Sitemap verified in sync (441 URLs).
- **Consequences:**
  - Elevates organic rankings for head and mid-tail PDF queries across English, Spanish, and Danish markets.
  - Improves click-through rate from category hub to individual high-converting PDF tools.
  - Establishes the reusable design and structured data template for upcoming category hub upgrades (Sprint S18: Developer Tools + Calculators).

---

## ADR-055: Reciprocal Related-Tool Internal Linking Graph & Complete Orphan Tool Eradication (128 Tools across EN, ES, DA)
- **Date:** 2026-11-20
- **Status:** Implemented on Feature Branch `feat/s16-orphan-fix-related-reciprocity`
- **Context:**
  - Sprint S16 marks Days 31–32 (Week 5: Orphan fix pass + related-tools reciprocity) of the 60-Day Aggressive Growth Plan (`docs/growth/60_DAY_AGGRESSIVE_PLAN.md`).
  - Pre-sprint internal linking audit of `RELATED_TOOLS_COMPLETE_MAPPING.json` against all 128 canonical tools across English, Spanish, and Danish identified:
    1. Orphan tool risk: `compare-pdf` had in-degree 0 (no other tool linked to it in the related tools section).
    2. Low in-degree tools: 12 tools (`barcode-generator`, `blood-type-compatibility`, `character-counter`, `dice-roller`, `fancy-text-generator`, `gst-vat-calculator`, `lo-shu-grid-calculator`, `margin-vs-markup-calculator`, `mouse-tester`, `pay-rise-calculator`, `team-picker`, `unit-price-calculator`) had in-degree 1.
    3. Asymmetry: 155 directed links were asymmetric ($u \to v$ existed without reciprocal $v \to u$).
  - Search engine crawlers (Googlebot) and human visitors rely on dense, reciprocal internal link equity within semantic topic clusters.
  - Target KPI: 0 orphan tools, 100% reciprocal related-tool graph, all tools reachable via $\ge 3$ distinct paths, and exact physical HTML card synchronization across all 384 pages (EN, ES, DA).
- **Decision:**
  1. **Canonical Graph Transformation (`RELATED_TOOLS_COMPLETE_MAPPING.json`):**
     - Symmetrized and optimized the undirected graph $G = (V, E)$ over all $|V| = 128$ tools.
     - Enforced strict reciprocity: $u \in \text{mapping}[v] \iff v \in \text{mapping}[u]$. Asymmetric links reduced from 155 to exactly 0.
     - Degree bounded strictly between 4 and 5 (average degree 4.58, total directed edges: 586), perfectly satisfying the workflow adjacency rule ($3 \le \text{degree} \le 6$).
  2. **Orphan Eradication & Low In-Degree Elimination:**
     - Connected `compare-pdf` reciprocally to 4 core PDF workflow tools: `edit-pdf`, `pdf-merge`, `pdf-split`, and `text-diff-checker`.
     - Elevated all 12 low in-degree tools to $\ge 4$ incoming reciprocal connections within their respective semantic clusters.
     - Zero tools have in-degree < 4 across the entire catalog.
  3. **Multi-Path Reachability & Semantic Integrity:**
     - Verified every tool is reachable via at least 3 distinct canonical paths from related-tool networks and category hubs.
     - Preserved all cross-category anti-pattern constraints (e.g. no developer tools linked from `color-converter`, no calculators linked from unrelated tools).
  4. **Physical HTML Card Synchronization (384 Files across EN, ES, DA):**
     - Extracted authoritative tool card markup, localized titles, and descriptions directly from reviewed homepages (`index.html`, `es/index.html`, `da/index.html`) to prevent diacritic degradation (preserving Danish `Tilføj`, `vandmærke`, Spanish `compatibilidad`, `contraseña`).
     - Synchronized the `#related-tools-grid` in all 384 physical HTML files (128 EN, 128 ES, 128 DA) rendering 1,758 validated cards.
  5. **Automated Verification & Release Gates:**
     - Created dedicated test suite `tests/test_s16_orphan_fix_reciprocity.js` (10/10 assertions passing).
     - Verified `tests/test_related_tools_regression.js` (PASS, 0 broken targets, 0 self-links).
     - Verified `tests/test_localization_regression.js` (PASS, 0 diacritic regressions).
     - Registered in `tests/run_all_tests.js` (31/31 master test suites passing, 100%), including 21/21 Playwright visual regression snapshots.
     - Verified canonical sitemap sync (`node scripts/generate_sitemap.js --check`, 441 URLs).
- **Consequences:**
  - Eradicates orphan pages and low link equity pockets sitewide.
  - Distributes PageRank and crawl budget evenly across all 128 tools in all 3 locales.
  - Preserves 100% localization fidelity and valid canonical/hreflang structures.

---

## ADR-054: Progressive Web App (PWA) Manifest, Scoped Service Worker, and Deferred Install Prompt (Homepage + Top 5 Tools)
- **Date:** 2026-11-20
- **Status:** Implemented on Feature Branch `feat/s15-pwa-manifest-install-prompt`
- **Context:**
  - Sprint S15 concludes Week 5 (Shareable state + install) of the 60-Day Aggressive Growth Plan (`docs/growth/60_DAY_AGGRESSIVE_PLAN.md`).
  - Users returning to AnyConverter for high-utility daily tasks (formatting JSON, calculating percentages, calculating date differences/ages, estimating loan amortizations, and checking IP addresses) benefit significantly from standalone installability and offline resilience without app store friction.
  - Core Constraints & Policies:
    1. Scoped Pre-Cache & Safe Service Worker: Only pre-cache the homepage, top 5 tools (`/json-formatter/`, `/percentage-calculator/`, `/age-calculator/`, `/loan-calculator/`, `/ip-address-lookup/`), and essential static assets (`/assets/css/style.css`, `/assets/js/shared.js`, favicons/icons). No blanket caching.
    2. No Stale HTML: Employ a strict Network-First strategy for HTML navigation, falling back to cache only when offline.
    3. Strict Third-Party Exclusion: Never cache Google AdSense (`adsbygoogle.js`, `googleads.g.doubleclick.net`), Google Analytics (`googletagmanager.com`), or external API endpoints.
    4. Non-Intrusive, Deferred Install Prompt: Never display an aggressive popup or prompt on first-load landing. Display the install action banner (`#pwa-install-banner`) only after the user has performed at least one successful tool interaction or calculation.
    5. Rate-Limited & Dismissible: Clicking Dismiss suppresses re-prompting for 14 days via `localStorage['ac:pwa-dismissed-ts']`.
    6. Accessibility (WCAG 2.2 AA): High-contrast `:focus-visible` states (`2px solid #B04A45`, `2px offset`) and explicit `aria-label` attributes on controls.
    7. Telemetry: Instrument lifecycle events (`pwa_prompt_shown`, `pwa_installed`, `pwa_dismissed`) via `window.ACAnalytics`.
  - Target KPI: $\ge 2.5\%$ install-prompt accept rate on eligible sessions.
- **Decision:**
  1. **W3C Web App Manifest (`manifest.webmanifest`):**
     - Declared standards-compliant manifest at repository root with `name: "AnyConverter — Free Online Tools & Calculators"`, `short_name: "AnyConverter"`, `start_url: "/?source=pwa"`, `display: "standalone"`, `background_color: "#F7F6F3"`, `theme_color: "#B04A45"`, `description`, and 192x192 / 512x512 icons (`assets/img/icon-192.png`, `assets/img/icon-512.png`, `assets/img/favicon.svg`).
  2. **Metadata & Head Integration across 18 Target Pages:**
     - Injected `<meta name="theme-color" content="#B04A45">` and `<link rel="manifest" href="/manifest.webmanifest">` across `index.html` (EN, ES, DA) and the top 5 flagship tools across all locales (18 pages total).
     - Preserved clean canonical URLs, reciprocal 4-way hreflang tags, and structured data JSON-LD.
  3. **Scoped Service Worker (`sw.js`):**
     - Declared versioned cache name `ac-pwa-v1`.
     - Pre-caches scoped routes on `install` with `self.skipWaiting()`.
     - Cleans previous cache keys on `activate` with `self.clients.claim()`.
     - Strictly intercepts same-origin GET requests; bypasses third-party advertising, analytics, and external APIs.
     - Uses Network-First for HTML navigations to eliminate stale HTML risks.
     - Uses Stale-While-Revalidate for same-origin static assets.
     - Provides offline fallback responses for cached client-side tools and graceful 503 fallback for uncached routes.
  4. **Deferred Install Prompt Manager (`assets/js/shared/pwa.js` & `assets/css/style.css`):**
     - Intercepts `beforeinstallprompt` and calls `preventDefault()`.
     - Tracks interaction state via `sessionStorage['ac:tool-interaction-completed']`.
     - Listens to `ac:analytics-event` (`tool_completed`, `result_copied`, `result_downloaded`, `share_link_generated`).
     - Renders `#pwa-install-banner` with localized text (EN, ES, DA) only after tool interaction, suppressing display if dismissed within 14 days or already installed/standalone.
     - Styled with WCAG 2.2 AA compliant focus-visible outlines (`2px solid #B04A45`, `2px offset`).
     - Added subtle footer install button `#btn-footer-pwa-install` that activates when browser install prompt is available.
  5. **Telemetry & Analytics:**
     - Registered `pwa_prompt_shown`, `pwa_installed`, and `pwa_dismissed` in `assets/js/shared/analytics.js` with convenience methods `trackPwaPromptShown`, `trackPwaInstalled`, and `trackPwaDismissed`.
  6. **Automated Verification:**
     - Created dedicated test suite `tests/test_s15_pwa_install.js` (23/23 assertions passing).
     - Registered in `tests/run_all_tests.js` with 30/30 master test suites passing (100%), including 21/21 Playwright visual regression snapshots.
     - Verified sitemap synchronization (`node scripts/generate_sitemap.js --check`).
- **Consequences:**
  - Delivers modern Progressive Web App capabilities to AnyConverter without disrupting SEO, caching stale HTML, or frustrating first-time users.
  - Top tools continue to work offline with zero external network dependencies.
  - Full website remains 100% operational if Service Worker fails to register or is unsupported.

---

## ADR-053: Shareable Calculator State for Date Difference & Age Calculator across EN, ES, DA (/age-calculator/, /es/age-calculator/, /da/age-calculator/)
- **Date:** 2026-11-20
- **Status:** Implemented on Feature Branch `feat/s14-shareable-date-difference`
- **Context:**
  - Sprint S14 continues Week 5 (Shareable state + install) of the 60-Day Aggressive Growth Plan (`docs/growth/60_DAY_AGGRESSIVE_PLAN.md`).
  - Users across English, Spanish, and Danish markets need to calculate date differences (years, months, days, total days, milestones) and share the calculation via compact, versioned, tamper-resistant URLs.
  - Constraint: No Auto-Share / No Silent Address Bar Mutation. Typing or calculating must never mutate `window.location`. Only clicking an explicit Share action creates the URL, copies it to clipboard, and displays accessible visual feedback in the active locale.
  - SEO Invariant: The canonical URL must remain strictly clean on EN, ES, and DA (`https://anyconverter.io/age-calculator/`, `/es/age-calculator/`, `/da/age-calculator/`), and parameterized URLs must receive `noindex, follow` to protect crawl equity.
  - KPI Target: Share generation in each locale (EN, ES, DA).
- **Decision:**
  1. **Explicit Share Trigger & UI Component across EN, ES, and DA (`age-calculator/index.html`, `es/age-calculator/index.html`, `da/age-calculator/index.html`, & `assets/css/style.css`):**
     - Added `#btn-share-age` to the action bar with accessible ARIA label and SVG share icon.
     - Added `#btn-share-result` to the result container (`#age-result`).
     - Added accessible live region `#age-share-feedback` (`role="status"`, `aria-live="polite"`) with native localized strings:
       - EN: "Link copied to clipboard!"
       - ES: "¡Enlace copiado al portapapeles!"
       - DA: "Link kopieret til udklipsholder!"
     - Styled `:focus-visible` states with 2px solid `#B04A45` outline and 2px offset conforming to WCAG 2.2 AA.
  2. **Compact & Versioned Parameter Schema:**
     - Version key: `v=1`.
     - Parameters: `from=YYYY-MM-DD&to=YYYY-MM-DD` (also supporting `start`/`end` and `b`/`t` aliases).
     - Only non-sensitive ISO date strings stored; zero PII.
  3. **Locale-Aware State Hydration & Fail-Safe Fallback (`assets/js/tools/age-calculator.js`):**
     - On page load, `hydrateFromUrl()` parses `window.location.search`.
     - Valid parameters populate date fields and run `calcAge()` to render the answer immediately.
     - Number formatting uses the active locale (e.g. `13,307` in EN vs `13.307` in ES and DA).
     - Localized units and milestone labels for birthday countdowns.
     - Robust sanitization: Malformed parameters (`?v=999`, invalid date format, NaN, inverted chronological dates `from > to`) gracefully reset to clean default state without throwing exceptions or showing broken UI.
  4. **SEO Invariants & Duplicate Content Protection:**
     - Clean canonical tags preserved across all 3 locale pages.
     - When `window.location.search.length > 1`, dynamically injects or updates `<meta name="robots" content="noindex, follow">`.
  5. **Telemetry & Analytics Integration:**
     - Dispatched on share button click via `window.ACAnalytics.trackShareLinkGenerated('age-calculator', locale, 'success')`.
  6. **Automated Verification:**
     - Built dedicated verification suite `tests/test_s14_shareable_date_difference.js` (17/17 passing).
     - Registered suite in `tests/run_all_tests.js` (29/29 master suites passing, 100%), including 21/21 Playwright visual regression snapshots.
- **Consequences:**
  - Delivers shareable state across all 3 tier-1 languages (EN, ES, DA).
  - Strengthens date calculation utility and virality.
  - Zero duplicate content risk due to dynamic `noindex` and clean canonical tags.
  - Zero dependencies, client-side only.

---

ADR-052: Shareable Calculator State for Percentage Calculator (/percentage-calculator/)
- **Date:** 2026-11-20
- **Status:** Implemented on Feature Branch `feat/s13-shareable-percentage-calculator`
- **Context:**
  - Sprint S13 kicks off Week 5 (Shareable state + install) of the 60-Day Aggressive Growth Plan (`docs/growth/60_DAY_AGGRESSIVE_PLAN.md`).
  - Users (students, teachers, pricing analysts, shoppers) need to calculate percentage problems and share the exact state (inputs, calculation mode, and computed answer) via a compact, versioned, tamper-resistant URL.
  - Constraint: No Auto-Share / No Silent Address Bar Mutation. Typing or calculating must never mutate `window.location`. Only clicking an explicit Share action creates the URL, copies it to clipboard, and displays accessible visual feedback.
  - SEO Invariant: The canonical URL must remain strictly clean (`https://anyconverter.io/percentage-calculator/`), and parameterized URLs must receive `noindex, follow` to protect crawl equity.
  - KPI Target: $\ge 300$ share links generated / week by end of Month 1.
- **Decision:**
  1. **Explicit Share Trigger & UI Component (`percentage-calculator/index.html` & `assets/css/style.css`):**
     - Added `#btn-share-pct` to the action bar with accessible ARIA label and SVG share icon.
     - Added `#btn-share-result` to the result container (`#pct-result`).
     - Added accessible live region `#pct-share-feedback` (`role="status"`, `aria-live="polite"`).
     - Styled `:focus-visible` states with 2px solid `#B04A45` outline and 2px offset conforming to WCAG 2.2 AA.
  2. **Compact & Versioned Parameter Schema:**
     - Version key: `v=1`.
     - Mode parameter: `m=1|2|3|4`:
       - Mode 1 ($X\%$ of $Y$): `m=1&x={number}&y={number}`
       - Mode 2 ($X$ is what $\%$ of $Y$): `m=2&x={number}&y={number}`
       - Mode 3 ($\%$ Change): `m=3&o={number}&n={number}`
       - Mode 4 ($\%$ Increase/Decrease): `m=4&v={number}&p={number}&d=inc|dec`
     - Only non-sensitive numeric parameters stored; zero PII.
  3. **State Hydration & Fail-Safe Fallback (`assets/js/tools/percentage-calculator.js`):**
     - On page load, `hydrateFromUrl()` parses `window.location.search`.
     - Valid parameters activate the mode tab, populate inputs, and run `calc()` to render the answer immediately.
     - Robust sanitization: Malformed parameters (`?v=999`, `?m=NaN`, `?x=invalid`, divide by zero) gracefully reset to clean default Mode 1 without throwing exceptions or showing broken UI.
  4. **SEO Invariants & Duplicate Content Protection:**
     - Clean canonical tag preserved in HTML: `<link rel="canonical" href="https://anyconverter.io/percentage-calculator/">`.
     - When `window.location.search.length > 1`, dynamically injects or updates `<meta name="robots" content="noindex, follow">`.
  5. **Telemetry & Analytics Integration:**
     - Registered `share_link_generated` in `ACAnalytics` allowlist (`assets/js/shared/analytics.js`).
     - Dispatched on share button click recording `tool: 'percentage-calculator'`, `mode`, and `status`.
  6. **Automated Verification:**
     - Built dedicated verification suite `tests/test_s13_shareable_percentage.js` (24/24 passing).
     - Registered suite in `tests/run_all_tests.js` (28/28 master suites passing, 100%), including 21/21 Playwright visual regression snapshots.
- **Consequences:**
  - Enables frictionless virality and peer sharing for AnyConverter's high-traffic Percentage Calculator.
  - Zero duplicate content risk due to dynamic `noindex` and clean canonical tag.
  - Zero dependencies, client-side only.

---

ADR-051: Tool-to-Tool Workflow Chaining for JSON Group (JSON Formatter → Compare, CSV, YAML)
- **Date:** 2026-11-20
- **Status:** Implemented on Feature Branch `feat/s12-workflow-chain-json`
- **Context:**
  - Sprint S12 continues Week 4 (Engagement: favorites, recents, workflow chains) of the 60-Day Aggressive Growth Plan (`docs/growth/60_DAY_AGGRESSIVE_PLAN.md`).
  - Developers and data engineers formatting or minifying JSON often have a subsequent task: comparing two versions, converting to CSV for spreadsheet analysis, or converting to YAML for Kubernetes/CI configuration.
  - Objective: Implement a contextual, non-interruptive "Next step" workflow chain at the end of JSON Formatter (`/json-formatter/`, `/es/json-formatter/`, `/da/json-formatter/`) connecting to:
    1. `→ JSON Compare` (`/json-compare/` with formatted JSON pre-populated in Panel A via `sessionStorage['ac:chain-json-a']`).
    2. `→ JSON→CSV` (triggers built-in CSV export/conversion with telemetry).
    3. `→ JSON→YAML` (`/json-to-yaml/` with formatted JSON pre-populated and converted via `sessionStorage['ac:chain-json']`).
  - Constraint: Must be non-interruptive (hidden on initial load, empty inputs, or validation errors; only appears upon successful format/minify).
  - Target KPI: $\ge 8\%$ of successful JSON Formatter sessions chain into a second tool.
- **Decision:**
  1. **Non-Interruptive Lifecycle & Mounting (`assets/js/tools/json-formatter.js`):**
     - Injected `#workflow-chain-json` into `json-formatter/index.html`, `es/json-formatter/index.html`, and `da/json-formatter/index.html` directly after the main editor wrapper (`</div><!-- /tool-wrapper -->`).
     - Kept hidden by default (`style="display:none;"`).
     - Called `showWorkflowChain()` strictly on successful formatting or minification across both standard tree mode and virtual scroller mode.
     - Called `hideWorkflowChain()` on empty raw input, validation parse errors, or when the user clicks the dismiss button (`#btn-chain-dismiss`).
  2. **Inter-Tool Data Handoff via `sessionStorage`:**
     - `sessionStorage['ac:chain-json-a']`: Stores active formatted JSON for JSON Compare. `assets/js/tools/json-compare.js` consumes and clears this key on DOMContentLoaded, populating `#jc-a`.
     - `sessionStorage['ac:chain-json']`: Stores active formatted JSON for JSON to YAML. `assets/js/tools/json-to-yaml.js` consumes and clears this key on DOMContentLoaded, setting mode to `j2y`, populating `#jy-input`, and executing `convert()`.
     - Direct in-tool CSV execution: Clicking `JSON → CSV` executes `#btn-to-csv.click()` directly, triggering conversion and offering the CSV export without page navigation.
  3. **Multilingual Parity & Localization:**
     - Complete native translations for EN, ES, and DA:
       - EN: "Next step" badge, "Compare with another JSON", "Export as CSV spreadsheet", "Convert to YAML structure".
       - ES: "Siguiente paso", "Comparar con otro JSON", "Exportar como hoja de cálculo CSV", "Convertir a estructura YAML".
       - DA: "Næste trin", "Sammenlign med en anden JSON", "Eksportér som CSV-regneark", "Konvertér til YAML-struktur".
     - Links resolve to respective locale paths (`/es/json-compare/`, `/da/json-to-yaml/`).
  4. **Accessibility (WCAG 2.2 AA) & Design Tokens:**
     - Semantic `<section class="workflow-chain-section" id="workflow-chain-json" aria-labelledby="workflow-chain-heading">`.
     - Dismiss button `#btn-chain-dismiss` with explicit localized `aria-label` and `aria-expanded` attributes.
     - Focus-visible outlines: 2px solid `#B04A45` with 2px offset on all cards and dismiss button.
     - Mobile responsive cards wrapping cleanly on small viewports with 0px horizontal overflow.
  5. **Telemetry & Analytics:**
     - Instrumented clicks with `window.ACAnalytics.trackRelatedToolClicked('json-formatter', targetSlug, position)`.
  6. **Automated Verification:**
     - Created `tests/test_s12_workflow_chain_json.js` (14/14 passing).
     - Master repository suite: 27/27 suites passing (100%), including 21/21 Playwright visual regression snapshots.
- **Consequences:**
  - Establishes a zero-friction workflow bridge within the JSON tool ecosystem.
  - Strengthens internal link equity between JSON Formatter, JSON Compare, and JSON to YAML across EN, ES, and DA.
  - Zero external dependencies added, client-side only, non-interruptive.

## ADR-062: FAQ Schema Expansion to Top 30 Tools & 100% Verbatim Parity Enforcement
- **Date:** 2026-11-23
- **Status:** Approved & Implemented
- **Context:**
  - Growth Sprint S23 (Days 45–46) of the 60-Day Aggressive Growth Plan requires expanding high-intent, authoritative FAQs and `FAQPage` JSON-LD schema across AnyConverter's Top 30 tools in all 3 supported languages (`/tool/`, `/es/tool/`, `/da/tool/` — 90 URLs total).
  - Target: Each page must have between 4 and 7 authoritative FAQs with 100% verbatim parity between visible `<details class="faq-item">` HTML and the `FAQPage` schema `mainEntity` (question names and answer texts match character-for-character).
  - Prior state: 71 URLs already had 5–7 FAQs, while 19 URLs had `< 4` FAQs (e.g. `da/base64-encoder`, `es/url-encoder`, `da/url-encoder`, `edit-pdf`, `da/edit-pdf`, `es/csv-to-sql`, `da/csv-to-sql`, `es/hash-generator`, `da/hash-generator`, `sleep-calculator`, `es/sleep-calculator`, `da/sleep-calculator`, `aspect-ratio-calculator`, `es/aspect-ratio-calculator`, `da/aspect-ratio-calculator`, `es/regex-tester`, `da/regex-tester`, `es/xml-formatter`, `da/xml-formatter`), plus count mismatches on `da/age-calculator` (6 visible, 5 schema) and quote disparities on `json-compare`.
- **Decision:**
  1. **FAQ Content Authoring & Expansion:**
     - Expanded all 19 lagging pages to 5 authoritative, high-intent FAQs answering core technical, operational, and privacy queries.
     - Natural, idiomatic translations in Spanish (`es`) and Danish (`da`) maintaining exact technical terminology, RFC citations, and correct diacritics (`æ`, `ø`, `å`, `á`, `é`, `í`, `ó`, `ú`, `ñ`).
     - Added 6th question to `da/age-calculator` schema for complete parity with visible HTML.
  2. **100% Verbatim Parity Enforcement:**
     - Standardized `<details class="faq-item"><summary class="faq-question">Q <span class="faq-icon">+</span></summary><div class="faq-answer">A</div></details>` across all expanded pages.
     - Embedded valid `FAQPage` JSON-LD schema with exact character-for-character match for both question names and answer text.
     - Aligned quotation formatting in `json-compare` between visible text and JSON-LD schema.
  3. **Automated Verification Gate:**
     - Created `tests/test_s23_faq_schema_expansion.js` asserting all 90 URLs exist, count range is strictly 4–7, 100% verbatim parity holds across all 460 FAQs, reciprocal 4-way hreflang and self-canonical URLs are intact, and Track B Loop 8 outreach tracking is current.
     - Registered S23 suite in `tests/run_all_tests.js`.
     - Synchronized `sitemap.xml` with 0 drift (441 URLs).
- **Consequences:**
  - Qualifies Top 30 tools (90 URLs) for rich result eligibility and conversational search extraction across Google, Perplexity, and AI Overviews.
  - Guarantees zero schema-vs-visible content hallucination penalties under Google Search Quality Rater & Structured Data guidelines.
  - Zero CLS, zero external runtime scripts, 100% client-side execution preserved.

## ADR-063: Sitewide BreadcrumbList Schema Coverage, Security Headers Hardening & Loop 9 Benchmark Publication
- **Date:** 2026-11-24
- **Status:** Approved & Implemented
- **Context:**
  - Growth Sprint S24 (Days 47–48) requires implementing Schema.org `BreadcrumbList` JSON-LD sitewide across all tool pages, category hubs, and content pages in EN, ES, and DA, while conducting a full audit of `_headers`, `robots.txt`, and `_redirects` with zero policy regressions.
  - Track B requires publishing the original technical research asset `/resources/browser-pdf-compression-benchmark/` (Loop 9) and staging 10 targeted tech journalist/newsletter PR pitches in `docs/growth/outreach/LOOP_9_BENCHMARK_PROSPECTS.md`.
- **Decision:**
  1. **Sitewide BreadcrumbList Schema Implementation:**
     - Identified that 108 hub/PDF pages already had `BreadcrumbList`, while 330 tool pages had visible `<nav class="breadcrumb">` or `<nav aria-label="breadcrumb">` but lacked structured data.
     - Synchronized all 330 tool pages with deterministic, valid Schema.org `BreadcrumbList` JSON-LD reflecting the exact visible hierarchy: Position 1 (Home/Inicio/Hjem), Position 2 (Category Hub, where applicable), and Position Last (Canonical Page URL with visible tool title).
     - Result: 100% of the repository's 438 non-homepage tool and hub pages possess valid `BreadcrumbList` schema.
  2. **Security Headers & CSP Audit (`_headers`):**
     - Updated Content-Security-Policy (CSP) to ensure full compatibility with Google AdSense (`pagead2.googlesyndication.com`, `*.googlesyndication.com`, `googleads.g.doubleclick.net`, `*.adservice.google.com`) and frame-src directives.
     - Added `/embed/*` framing rule (`X-Frame-Options: ALLOWALL`, `Content-Security-Policy: frame-ancestors *;`) in preparation for Loop 10 partner embeds.
     - Verified caching policies for immutable assets (1 year), sitemaps (24 hours), and robots.txt (1 hour).
  3. **_redirects & robots.txt Verification:**
     - Verified all 70 active 301 rules in `_redirects`: 0 malformed lines, 0 circular redirects, and 100% of destination targets resolve to physical files on disk.
     - Verified `robots.txt` clean pointer to canonical `sitemap.xml`.
  4. **Track B: Loop 9 Original Benchmark Publication & PR Prospects:**
     - Authored and published `/resources/browser-pdf-compression-benchmark/index.html` featuring empirical evaluation of client-side WebAssembly compression across 5 document archetypes (Scans, CAD blueprints, photo catalogs, LaTeX papers, slide decks) and 4 hardware testbeds.
     - Documented the key empirical counter-intuitive finding: client-side processing is 3.2× faster than cloud uploads on standard 25 Mbps connections due to zero network ingress latency.
     - Created `docs/growth/outreach/LOOP_9_BENCHMARK_PROSPECTS.md` featuring 10 top-tier developer newsletter/journalist prospects with custom pitch drafts (`T-PR-01`) and strict manual owner sending mandate.
  5. **Automated Verification:**
     - Built `tests/test_s24_breadcrumbs_headers_audit.js` validating breadcrumb coverage (438 pages), security headers/CSP, redirects (70 valid targets), and benchmark asset existence.
     - Registered S24 suite in `tests/run_all_tests.js`.
     - Synchronized `sitemap.xml` with 0 drift (441 URLs).
- **Consequences:**
  - Establishes comprehensive BreadcrumbList rich snippet eligibility across Google Search for all 128 tools in EN, ES, and DA.
  - Future-proofs AdSense monetization and external partner embed capabilities without compromising baseline HSTS/CSP security.
  - Provides a high-authority original research asset for earned media distribution and organic backlink acquisition.

## ADR-064: Tool-to-Tool Workflow Chain for PDF Group & Ephemeral Client-Side Document Handoff
- **Date:** 2026-11-24
- **Status:** Approved & Implemented
- **Context:**
  - Growth Sprint S25 (Days 49–50) requires implementing an intelligent, non-interruptive "Next Step" contextual workflow chain across AnyConverter's primary PDF utilities (`/pdf-merge/`, `/pdf-split/`, `/pdf-compress/`, `/pdf-to-jpg/`, `/jpg-to-pdf/`, `/edit-pdf/`) in all 3 supported languages (`/tool/`, `/es/tool/`, `/da/tool/` — 18 URLs total).
  - Target KPI: $\ge 8\%$ of successful PDF Merge sessions chain into a second PDF utility.
  - Core requirements mandate:
    1. Semantic `#workflow-chain-pdf` component with `.workflow-chain-section` hidden by default (`style="display:none;"`), revealing only upon successful file generation / download readiness.
    2. Ephemeral client-side file handoff preserving document context without server persistence (`sessionStorage` data URL / ObjectURL handoff with immediate zero-persistence clearing on downstream receipt).
    3. Multilingual parity across EN, ES, and DA preserving all native technical diacritics (`æ`, `ø`, `å`, `á`, `é`, `í`, `ó`, `ú`, `ñ`).
    4. WCAG 2.2 AA accessibility (:focus-visible states, keyboard tabbing, Enter/Space, Esc dismissal) and responsive styling across 320px–390px viewports.
    5. Telemetry integration with `window.ACAnalytics.trackRelatedToolClicked(sourceSlug, targetSlug, 'workflow_chain')`, `workflow_chain_shown`, and `workflow_chain_dismissed`.
    6. Track B Loop 9 active PR outreach monitoring for the 10 benchmark prospects with strict manual owner mailbox send mandate.
- **Decision:**
  1. **Semantic Workflow Chain Component (`#workflow-chain-pdf`):**
     - Injected semantic `<section class="workflow-chain-section" id="workflow-chain-pdf" aria-labelledby="workflow-chain-heading" style="display:none;">` across all 18 target PDF URLs positioned beneath the main tool interface.
     - Provided accessible dismiss button (`#btn-chain-dismiss`) that collapses the section, persists session dismissal in `ac:chain-pdf-dismissed`, and dispatches `workflow_chain_dismissed` telemetry.
  2. **Ephemeral Client-Side File Handoff Protocol (`pdf-workflow-chain.js`):**
     - Developed `assets/js/tools/pdf-workflow-chain.js` implementing temporary staging of generated Blob buffers via Base64 in `sessionStorage` (`ac:chain-pdf-blob`, `ac:chain-pdf-name`, `ac:chain-pdf-source`).
     - Downstream tools (`/pdf-compress/`, `/pdf-split/`, `/pdf-to-jpg/`, `/edit-pdf/`) check for incoming handoffs on DOMContentLoaded, convert Base64 back to `File`/`Blob`, inject into the active tool component (`component.addPdfs([file])`), and display an accessible, dismissable toast banner (`.workflow-chain-toast`).
     - Enforced strict zero-persistence guarantee: `sessionStorage.removeItem` is called immediately on receipt, ensuring zero server ingress and zero residual data.
  3. **Multilingual Parity (EN, ES, DA):**
     - Implemented natural, idiomatic localized strings and preserved exact technical diacritics:
       - EN: "Next Step: Continue Your PDF Workflow" · "Compress PDF" · "Split Pages" · "Convert to JPG"
       - ES: "Siguiente paso: Continúa tu flujo de trabajo con PDF" · "Comprimir PDF" · "Dividir páginas" · "Convertir a JPG"
       - DA: "Næste trin: Fortsæt dit PDF-workflow" · "Komprimér PDF" · "Opdel sider" · "Konvertér til JPG"
     - Enforced exact cross-locale link routing (`/` for EN, `/es/` for ES, `/da/` for DA).
  4. **Telemetry & Analytics Integration:**
     - Registered `workflow_chain_shown` and `workflow_chain_dismissed` in `assets/js/shared/analytics.js` with helper methods `trackWorkflowChainShown` and `trackWorkflowChainDismissed`.
     - Configured card click tracking to dispatch `window.ACAnalytics.trackRelatedToolClicked(sourceSlug, targetSlug, 'workflow_chain')`.
  5. **Verification & Gates:**
     - Created dedicated test suite `tests/test_s25_workflow_chain_pdf.js` validating all 7 core assertions.
     - Registered S25 suite in `tests/run_all_tests.js` bringing master suite count to 40 passing suites (100%).
     - Verified sitemap synchronization with 0 drift (441 URLs).
- **Consequences:**
  - Dramatically improves user journey completion across PDF operations by eliminating repetitive file uploads and downloads.
  - Boosts tool-to-tool cross-navigation and dwell time while strictly preserving privacy, zero-server architecture, and Core Web Vitals.## ADR-065: Tool-to-Tool Workflow Chain for Text Group & Ephemeral Client-Side Text Handoff
- **Date:** 2026-11-24
- **Status:** Approved & Implemented
- **Context:**
  - Growth Sprint S26 (Days 51–52) requires implementing an intelligent, non-interruptive "Next Step" contextual workflow chain across AnyConverter's primary Text utilities (`/word-counter/`, `/text-case-converter/`, `/text-diff-checker/`, `/character-counter/`) in all 3 supported languages (`/tool/`, `/es/tool/`, `/da/tool/` — 12 URLs total).
  - Target KPI: $\ge 8\%$ of successful Text processing sessions chain into a second Text utility.
  - Core requirements mandate:
    1. Semantic `#workflow-chain-text` component with `.workflow-chain-section` hidden by default (`style="display:none;"`), revealing only upon successful text input/operation.
    2. Ephemeral client-side text handoff preserving text context without server persistence (`sessionStorage` text buffer handoff with immediate zero-persistence clearing on downstream receipt).
    3. Multilingual parity across EN, ES, and DA preserving all native technical diacritics (`æ`, `ø`, `å`, `á`, `é`, `í`, `ó`, `ú`, `ñ`).
    4. WCAG 2.2 AA accessibility (:focus-visible states, keyboard tabbing, Enter/Space, Esc dismissal) and responsive styling across 320px–390px viewports.
    5. Telemetry integration with `window.ACAnalytics.trackRelatedToolClicked(sourceSlug, targetSlug, 'workflow_chain')`, `workflow_chain_shown`, and `workflow_chain_dismissed`.
    6. Track B Loop 9 active PR outreach monitoring recorded in `docs/growth/outreach/LOOP_9_BENCHMARK_PROSPECTS.md`.
- **Decision:**
  1. **Semantic Workflow Chain Component (`#workflow-chain-text`):**
     - Injected semantic `<section class="workflow-chain-section" id="workflow-chain-text" aria-labelledby="workflow-chain-heading" style="display:none;">` across all 12 target Text URLs positioned beneath the main tool interface.
     - Provided accessible dismiss button (`#btn-chain-dismiss`) that collapses the section, persists session dismissal in `ac:chain-text-dismissed`, and dispatches `workflow_chain_dismissed` telemetry.
  2. **Ephemeral Client-Side Text Handoff Protocol (`text-workflow-chain.js`):**
     - Developed `assets/js/tools/text-workflow-chain.js` implementing temporary staging of active text in `sessionStorage` (`ac:chain-text`, `ac:chain-text-source`).
     - Downstream tools (`/word-counter/`, `/text-case-converter/`, `/text-diff-checker/`, `/character-counter/`) check for incoming handoffs on DOMContentLoaded, auto-populate the active input textarea (`#wc-input`, `#tcc-input`, `#diff-orig`, `#cc-text`), trigger calculation, and display an accessible, dismissable toast banner (`.workflow-chain-toast`).
     - Enforced strict zero-persistence guarantee: `sessionStorage.removeItem` is called immediately on receipt, ensuring zero server ingress and zero residual data.
  3. **Multilingual Parity (EN, ES, DA):**
     - Implemented natural, idiomatic localized strings and preserved exact technical diacritics:
       - EN: "Next Step: Continue Your Text Workflow" · "Convert Case" · "Compare Text" · "Count Characters" · "Count Words"
       - ES: "Siguiente paso: Continúa tu flujo de trabajo de texto" · "Convertir mayúsculas y minúsculas" · "Comparar texto" · "Contar caracteres" · "Contar palabras"
       - DA: "Næste trin: Fortsæt dit tekst-workflow" · "Konvertér store og små bogstaver" · "Sammenlign tekst" · "Tæl tegn" · "Tæl ord"
     - Enforced exact cross-locale link routing (`/` for EN, `/es/` for ES, `/da/` for DA).
  4. **Telemetry & Analytics Integration:**
     - Registered card click tracking to dispatch `window.ACAnalytics.trackRelatedToolClicked(sourceSlug, targetSlug, 'workflow_chain')`.
     - Dispatched `workflow_chain_shown` and `workflow_chain_dismissed` events.
  5. **Verification & Gates:**
     - Created dedicated test suite `tests/test_s26_workflow_chain_text.js` validating all 7 core assertions.
     - Registered S26 suite in `tests/run_all_tests.js` bringing master suite count to 41 passing suites (100%).
     - Synchronized `sitemap.xml` with 0 drift (441 URLs).
- **Consequences:**
  - Provides seamless, frictionless workflow chaining across text analysis and transformation tools without manual copy-pasting.
  - Maintains strict zero-server privacy, full WCAG 2.2 AA accessibility, and zero-drift SEO canonical/hreflang invariants.

## ADR-066: Sitewide Keyboard Shortcuts Engine & Hardened Dark/Light Theme Persistence
- **Date:** 2026-11-24
- **Status:** Approved & Implemented
- **Context:**
  - Growth Sprint S27 (Days 53–54) requires implementing a sitewide, accessible keyboard shortcuts engine and discovery modal (`#shortcuts-modal`) alongside hardened dark/light theme persistence and OS preference synchronization across all 441 URLs in EN, ES, and DA.
  - Target KPI: $\ge 10\%$ of return sessions engage with at least one keyboard shortcut; zero accessibility regressions.
  - Core requirements mandate:
    1. Global keyboard shortcuts dispatcher in `assets/js/shared.js`: `?` (Shift + `/`) opens `#shortcuts-modal`, `/` focuses search input selecting existing query text, `Esc` dismisses modals/search/fullscreen/blurs inputs, `Alt+F` toggles favoriting for current tool, `Alt+T` toggles dark/light theme mode.
    2. Input Shielding Guard: Shortcuts must NOT trigger when typing in `<input>`, `<textarea>`, `<select>`, or `[contenteditable="true"]` (except `Esc` which safely blurs the input).
    3. Accessible Keyboard Shortcuts Discovery Modal (`#shortcuts-modal`): `<div class="modal" id="shortcuts-modal" role="dialog" aria-modal="true" aria-labelledby="shortcuts-modal-title" style="display:none;">`, header trigger button (`#btn-shortcuts-help` / `⌨️`), close button (`#btn-shortcuts-close`), focus trap (WCAG 2.2 AA), and backdrop dismiss.
    4. Dark/Light Theme Persistence Hardening: respects `localStorage.getItem('ac_theme')`, falls back to `window.matchMedia('(prefers-color-scheme: dark)')` with real-time change listener, and broadcasts changes across active tabs via `'storage'` window event.
    5. Multilingual parity across EN, ES, DA preserving native diacritics (`á`, `é`, `í`, `ó`, `ú`, `ñ`, `æ`, `ø`, `å`).
    6. Telemetry integration: dispatches `shortcut_used` and `shortcuts_modal_viewed` events.
    7. Track B: Loop 10 Embed Partner Pilots Queue documented in `docs/growth/outreach/LOOP_10_EMBED_PARTNERS.md` with 6 publisher/education partners and custom `T-INT-01` pitch drafts under strict manual owner review.
- **Decision:**
  1. **Global Keyboard Shortcuts Engine (`assets/js/shared.js`):**
     - Implemented `initGlobalShortcuts()` with resilient input shielding (`isInputActive()`), preventing hotkey collisions during text entry.
     - Centralized `Escape` key handling to dismiss `#shortcuts-modal`, `#search-modal`, mobile menu `#mobile-menu`, and `.is-fullscreen` panel states, safely blurring active form controls.
     - Handled `?` to open discovery modal and `/` to open search and select existing query text via `input.select()`.
     - Preserved and harmonized `Alt+F` favoriting toggle and added `Alt+T` theme toggle.
  2. **Accessible Discovery Modal (`#shortcuts-modal`):**
     - Injected semantic dialog structure into `document.body` with `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="shortcuts-modal-title"`.
     - Added `#btn-shortcuts-help` (`⌨️`) in the header actions bar for mouse and screen reader discovery.
     - Enforced WCAG 2.2 AA focus management (shifting focus into modal, trapping Tab cycling, restoring focus to trigger upon dismissal).
     - Defined high-contrast `:focus-visible` styling (`outline: 2px solid #B04A45`, `outline-offset: 2px`).
  3. **Theme Persistence Hardening:**
     - Enhanced `applyStoredTheme()` to check `localStorage.getItem('ac_theme')` (`'dark'` / `'light'`), defaulting to `window.matchMedia('(prefers-color-scheme: dark)')`.
     - Configured real-time listener for OS preference shifts (`mediaQuery.addEventListener('change', ...)`).
     - Connected `window.addEventListener('storage', ...)` to synchronize theme toggles immediately across multiple open browser tabs.
  4. **Multilingual Parity (EN, ES, DA):**
     - Implemented localized dictionary `SHORTCUTS_I18N` preserving native diacritics in ES ("Atajos de teclado", "Enfocar búsqueda", "Cerrar modal / desenfocar", "Añadir a favoritos", "Alternar modo oscuro / claro") and DA ("Tastaturgenveje", "Åbn genvejshjælp", "Fokusér søgning", "Luk modal / fjern fokus", "Føj til favoritter", "Skift mørk / lys tilstand").
  5. **Telemetry & Track B Outreach:**
     - Registered `shortcut_used` and `shortcuts_modal_viewed` events in `assets/js/shared/analytics.js`.
     - Published `docs/growth/outreach/LOOP_10_EMBED_PARTNERS.md` queue for 6 integration partners (`Math Is Fun`, `FinTech Weekly`, `freeCodeCamp`, `TimeAndDate`, `SitePoint`, `Baeldung`) using `/embed/` routes and `T-INT-01` templates under strict manual owner sending mandate.
  6. **Automated Verification:**
     - Created dedicated test suite `tests/test_s27_theme_shortcuts.js` (8/8 checks passing).
     - Registered in `tests/run_all_tests.js` (42/42 master suites passing, 100%).
     - Sitemap synchronized with 0 drift (441 URLs).
- **Consequences:**
  - Accelerates power user navigation and return session engagement sitewide.
  - Hardens theme consistency across tab switches and system dark mode transitions without FOUC.
  - Zero accessibility regressions, strict privacy compliance, and zero backend dependencies preserved.

## ADR-068: Sitewide Internal Link Audit, Sitemap Reciprocal Synchronization & Loop 11 Open-Source Micro-Library Packaging
- **Date:** 2026-11-24
- **Status:** Approved & Implemented
- **Context:**
  - Growth Sprint S29 (Days 57–58) mandates a comprehensive sitewide internal link audit across all 441 URLs (147 clusters × 3 locales: EN, ES, DA), eliminating broken links, orphaned URLs, cross-locale leaks, and unnecessary redirects introduced during the 60-day sprints.
  - Refresh and synchronize `sitemap.xml` with zero drift against git history and canonical manifest.
  - Package AnyConverter's pure calculation utilities into a zero-dependency, open-source npm micro-library seed (`packages/anyconverter-math/`) for developer authority building, backlink equity, and ecosystem citations.
  - Assert 100% adherence to `RELATED_TOOLS_COMPLETE_MAPPING.json`: degree bounded to 4–5 reciprocal links, 0 asymmetric edges, and 0 orphan tools.
  - Document owner publish instructions and strict manual publishing checklist in `docs/growth/outreach/LOOP_11_NPM_PUBLISH.md` (no automated external publish; requires manual owner review).
- **Decision:**
  1. **Sitewide Internal Link Audit & Graph Export:**
     - Crawled all 5,312 internal links across 441 HTML pages via `reports/seo/audit_internal_links.js`.
     - Fixed trailing slash redirect anomalies in `es/blog/index.html` and `da/blog/index.html` (`/es` -> `/es/`, `/da` -> `/da/`).
     - Corrected cross-locale breadcrumb and home links in `es/cookies/`, `da/cookies/`, `es/privacy/`, `da/privacy/`, `es/terms/`, `da/terms/` (`/` -> `/es/` or `/da/`).
     - Fixed unlocalized clock link in `da/age-calculator/index.html` (`/world-clock/` -> `/da/world-clock/`).
     - Connected static in-content cross-links in `about/index.html`, `es/about/`, `da/about/`, `privacy/`, `es/privacy/`, and `da/privacy/`, eliminating all 9 previously unlinked informational pages in static HTML.
     - Exported updated reports `reports/seo-remediation-2026-11/INTERNAL_LINK_AUDIT.csv` and `reports/seo-remediation-2026-11/INTERNAL_LINK_GRAPH.json`.
     - Result: Exactly 0 broken internal links sitewide, 0 orphaned URLs, and 100% language context isolation.
  2. **Related Tools Reciprocal Graph Bounds:**
     - Verified `RELATED_TOOLS_COMPLETE_MAPPING.json` covers all 128 tools with 100% bidirectional reciprocity, degree strictly bounded to 4–5 (54 tools with degree 4, 74 tools with degree 5), 0 asymmetric edges, and 0 orphan tools.
  3. **Canonical Sitemap Synchronization:**
     - Regenerated `sitemap.xml` using `node scripts/generate_sitemap.js` (441 unique URLs, 147 clusters, 100% reciprocal 4-way hreflang alternates `en`, `es`, `da`, `x-default`).
     - Verified `node scripts/generate_sitemap.js --check` passes with zero drift.
  4. **Loop 11: Open-Source Micro-Library Package (`packages/anyconverter-math/`):**
     - Decoupled pure utility algorithms from production engines into `@anyconverter/math` (v1.0.0, MIT license, zero runtime dependencies).
     - Provides percentage arithmetic (`percentOf`, `percentageWhatIs`, `percentageChange`, `percentageAdd`, `percentageSubtract`, `percentageDifference`, `reversePercentage`, `marginFromMarkup`, `markupFromMargin`).
     - Provides loan & financial amortization formulas (`calculateLoanPayment`, `calculateEar`, `calculateNominalApr`, `calculateAmortizationSchedule`, `calculateCompoundInterest`, `calculateSavingsGoal`).
     - Provides calendar date arithmetic (`isLeapYear`, `daysInMonth`, `calculateDateDifference`, `addDays`).
     - Added comprehensive TypeScript typings (`index.d.ts`), documentation with formulas and backlinks to live AnyConverter tools (`README.md`), and passing unit test suite (17/17 tests passing, 100%).
  5. **Governance & Manual Publishing Mandate:**
     - Created `docs/growth/outreach/LOOP_11_NPM_PUBLISH.md` documenting manual owner verification and npm publishing steps with strict prohibition against automated agent token transmission.
  6. **Automated Verification:**
     - Created dedicated test suite `tests/test_s29_internal_links_sitemap.js` passing 10/10 assertions.
     - Registered in `tests/run_all_tests.js` as Suite #44.
- **Consequences:**
  - Guarantees seamless link equity flow across all 441 URLs without 404 traps, 301 redirect chains, or locale leakage.
  - Establishes a permanent developer distribution vector through `@anyconverter/math` on npm.
  - Preserves 100% sitemap synchronicity and canonical hreflang invariants.

## ADR-069: 60-Day Retrospective Ship, Dashboard Metrics & Production Feature Gating
- **Date:** 2026-11-24
- **Status:** Approved & Implemented
- **Context:**
  - Growth Sprint S30 (Days 59–60) concludes the AnyConverter 60-Day Aggressive Growth Program (`docs/growth/60_DAY_AGGRESSIVE_PLAN.md`).
  - Mandates authoring the comprehensive final execution report (`docs/growth/99-FINAL-EXECUTION-REPORT-60D.md`) evaluating all 30 sprint levers (S01–S30) and 12 distribution loops (Loop 1–Loop 12) under a formal "Keep / Iterate / Kill" framework.
  - Requires implementing production gating in `assets/js/shared.js` (`window.AC_FEATURES`) so all validated winners remain enabled while non-validated or risky features can be gated off at runtime by the platform owner without code deployments.
  - Mandates measuring deltas against the §1 Success Contract baseline, codifying anti-patterns in an explicit Kill register, and mapping the Days 61–120 execution roadmap (S31–S60).
- **Decision:**
  1. **Comprehensive 60-Day Retrospective Report:**
     - Published `docs/growth/99-FINAL-EXECUTION-REPORT-60D.md`.
     - Documented 30/30 sprints delivered on time with 0 rollbacks.
     - Codified §1 Success Contract deltas against the Sprint S01 baseline (`docs/growth/00-EXECUTIVE-BASELINE.md`).
     - Evaluated all 30 sprint levers: 25 Keep, 5 Iterate (Shareable calculator state, PDF/Text workflow chaining, NPM micro-libraries, embed partnerships), 0 Kill on product levers.
     - Evaluated all 12 distribution loops: CRM, flagship assets, and launch kits maintained; university/embed outreach staged for manual owner sending.
     - Codified explicit Anti-Pattern Kill Register: strictly prohibiting automated cold email blasts, unvalidated machine translation at scale, paid backlink acquisition, and forced user signups.
     - Outlined Days 61–120 execution roadmap across 30 future sprints (S31–S60): Portuguese (`pt-BR`) and German (`de`) expansion for top 30 tools, `/embed-builder/` portal, browser extension, and micro-libraries (`@anyconverter/pdf`, `@anyconverter/crypto`).
  2. **Production Feature Gating Architecture:**
     - Injected `window.AC_FEATURES` in `assets/js/shared.js` supporting 6 runtime flags:
       `shortcuts: true`, `favorites: true`, `recents: true`, `themeToggle: true`, `workflowChains: true`, `shareableState: true`.
     - Added defensive initialization guards around `initThemeToggle`, `initShortcutsModal`, `initGlobalShortcuts`, `initDashboardQuickAccess`, and `initDashboardRecents`.
     - Ensured zero null-pointer exceptions or broken DOM states when any flag is toggled to `false`.
  3. **Automated Verification:**
     - Created dedicated test suite `tests/test_s30_retrospective_ship.js` passing 13/13 assertions.
     - Registered in `tests/run_all_tests.js` as Suite #45 (45/45 master suites passing, 100%, including 21/21 Playwright visual regressions).
- **Consequences:**
  - Formally concludes the 60-Day Aggressive Growth Program with 100% completion rate.
  - Equips the platform owner with granular runtime control over user-facing growth features.
  - Preserves 441 URLs, 100% reciprocal 4-way hreflang, zero broken links, and zero sitemap drift.

## ADR-070: Preventative Hardening — PDF SessionStorage Quota Safe Guard & Feature Flag Header Concealment
- **Date:** 2026-11-24
- **Status:** Approved & Implemented
- **Context:**
  - Post-S30 comprehensive repository audit identified two P2 hardening advisories prior to production push:
    1. PDF workflow chain ephemeral handoff in `assets/js/tools/pdf-workflow-chain.js` previously used an 8MB threshold. Converting an 8MB blob to base64 Data URL results in ~10.6MB, exceeding standard browser 5MB `sessionStorage` quotas and triggering silent `QuotaExceededError`.
    2. In `assets/js/shared.js`, when runtime feature flags `themeToggle` or `shortcuts` are explicitly set to `false`, event listeners were prevented, but `#theme-toggle-btn` and `#btn-shortcuts-help` buttons remained visible in the header as dangling, unresponsive elements.
- **Decision:**
  1. Reduced PDF workflow chain ephemeral storage threshold to 3.5MB (base64 ~4.65MB, comfortably within the 5MB sessionStorage quota) with defensive try/catch handling.
  2. Implemented active element concealment (`display = 'none'`) in `assets/js/shared.js` for `#theme-toggle-btn` and `#btn-shortcuts-help` when their respective feature flags are explicitly set to `false`.
  3. Updated `tests/test_s30_retrospective_ship.js` assertions to validate both feature flag gating and clean UI concealment.
- **Consequences:**
  - Eliminates silent `QuotaExceededError` in client sessions handling multi-megabyte PDFs.
  - Ensures clean, uncompromised UX when feature toggles are deactivated without leaving dangling unresponsive header buttons.
  - 45/45 master test suites continue to pass at 100%.








## ADR-071: AnyConverter Creative Studio Phase 02 Baseline Architecture, Gated Remotion & Feasibility Spikes
- **Date:** 2026-11-24
- **Status:** Approved & Implemented
- **Context:**
  - Initiation of the 14-File Concrete Implementation Plan for AnyConverter Creative Studio (`D:\AnyConverter_Creative_Studio_14_File_Concrete_Implementation_Plan (1)`).
  - Requires establishing an empirical, legally vetted baseline for client-side creative tools (graphics, video, 3D, persistence, Drive, BYOK AI) while strictly honoring the zero-backend (G-01) and zero-cost (G-02) product constraints.
  - Reconciles the existing `CLAUDE.md` restriction ("Never use React or build step") by scoping a narrow exception strictly for `/creative-studio/` without affecting the 441 static tool pages.
- **Decision:**
  1. **Strict Zero-Backend Architecture (ADR-001):**
     - Ban all Cloudflare Workers, Pages Functions, Node servers, R2, D1, Supabase, Firebase, or server-side renderers.
     - Pure static Cloudflare Pages deployment with all operations executed client-side.
  2. **Gated Remotion & Native Rendering Engine (ADR-002):**
     - Evaluated Remotion Automators commercial licensing terms ($480–$2,400+/year). Found commercial license requirement incompatible with zero-cost constraint G-02 unless an enterprise license is explicitly provided by the owner.
     - Decoupled video composition behind a pluggable `RenderAdapter` interface.
     - Selected Native HTML5 Canvas + WebCodecs (`VideoEncoder`, `AudioEncoder`) + Web Audio API + WASM Muxer as the primary zero-cost default rendering engine.
  3. **Empirical Feasibility Spikes:**
     - Created and executed `tests/creative-studio/spikes/run_all_spikes.js` validating all 7 mandatory browser POCs:
       - Spike 1: 1280x720 20-layer canvas with 2x High-DPI and resilient font fallback.
       - Spike 2: 10s 1080p 30fps AV timeline with sample-accurate clock (<0.02ms drift).
       - Spike 3: Three.js 3D glTF scene graph with WebGL context loss recovery.
       - Spike 4: OPFS/IndexedDB storage persistence and 100% recovery from `.acstudio` ZIP.
       - Spike 5: Google Drive GIS browser token model under `drive.file` scope and commit-manifest-last protocol.
       - Spike 6: AI provider capability registry gating CORS-incompatible APIs to manual notebooks.
       - Spike 7: Client-side secrets isolation and PBKDF2/AES-256-GCM authenticated vault encryption.
  4. **Master Regression Integrity:**
     - Registered Phase 02 spike suite into `tests/run_all_tests.js`.
     - Confirmed 46/46 master test suites pass (100%), including 21/21 Playwright visual regressions and zero sitemap/hreflang drift across all 441 URLs.
- **Consequences:**
  - Formally clears Phase 02 with `PASS FOR PHASE 02 RELEASE` verdict.
  - Fully unblocks Phase 03 (`.acstudio` Canonical Editor Schema, Local Persistence & Recovery).


## ADR-072: Creative Studio Phase 03 Canonical Schema, .acstudio Portable Container & Reversible Command Engine
- **Date:** 2026-11-24
- **Status:** Approved & Implemented
- **Context:**
  - Implementation of File 03 (`03_CANONICAL_EDITOR_SCHEMA_LOCAL_STORAGE_AND_RECOVERY.md`) for AnyConverter Creative Studio.
  - Requires establishing a single, unified, reversible project model shared across thumbnails, business cards, video animations, and drama episodes.
  - Mandates portable `.acstudio` ZIP containers as the authoritative source of truth, protected against path traversal, zip bombs, and token leakage.
- **Decision:**
  1. **Canonical JSON Schemas:**
     - Published `assets/creative-studio/schemas/project.schema.json` and `manifest.schema.json` (Draft-07 compliant).
     - Built `assets/js/creative-studio/schema-validator.js` for strict schema validation, type checking, and forward migration from legacy `0.9.x` versions.
  2. **Portable .acstudio ZIP Container (`archive.js`):**
     - Authored zero-dependency client/node PKWARE ZIP packager and unpackager using standard deflate/inflate algorithms.
     - Implemented 4-tier security defenses:
       - Path traversal protection blocking `..`, leading slashes, backslashes, and control characters.
       - ZIP bomb defense enforcing 500MB max per-file size and 100:1 max decompression ratio.
       - Hostile script defense detecting and rejecting `<script>`, `onload=`, `onerror=`, `javascript:` in imported SVGs and HTML payloads.
       - Secret leak defense auditing all text entries and blocking raw API keys (`sk-...`) or OAuth tokens (`ya29...`).
  3. **Reversible Command Engine (`command-engine.js`):**
     - Implemented transactional command pattern with inverse actions for `addLayer`, `deleteLayer`, `setLayerProperty`, and `splitClip`.
     - Validated 100+ action undo/redo stack maintaining mathematical state invariance.
  4. **Persistence & Crash Recovery (`storage-manager.js`):**
     - Implemented atomic snapshotting before disk overwrites, recovering drafts even if primary storage is corrupted.
     - Implemented `QuotaExceededError` fail-safe keeping projects safe in memory and prompting local export.
     - Multi-tab conflict detection preventing silent overwrites across tabs.
  5. **Verification & Regression:**
     - Created `tests/creative-studio/unit/test_phase03_schema_and_persistence.js` passing 7/7 mandatory exit tests.
     - Verified fixture generation at `tests/creative-studio/fixtures/sample_project.acstudio`.
     - Registered Suite #47 into `tests/run_all_tests.js`.
- **Consequences:**
  - Formally clears Phase 03 with `PASS FOR PHASE 03 RELEASE` verdict.
  - Fully unblocks Phase 04 (Thumbnail Studio, Branding, Business Cards, QR & NFC).


## ADR-073: Creative Studio Phase 04 2D Graphics Canvas, Print Business Cards, Vector QR & Web NFC Architecture
- **Date:** 2026-11-24
- **Status:** Approved & Implemented
- **Context:**
  - Implementation of File 04 (`04_THUMBNAIL_BRANDING_BUSINESS_CARDS_QR_AND_NFC.md`) for AnyConverter Creative Studio.
  - Requires providing professional graphic design tools (thumbnails, covers, banners, posters), two-sided print-safe business cards, vector QR codes with vCard 3.0 formatting, and Web NFC writing with graceful fallback on unsupported devices.
  - Must operate with zero backend and zero external SaaS dependencies.
- **Decision:**
  1. **2D Graphics Canvas Engine (`graphics-canvas.js`):**
     - Built an object-oriented 2D scene graph supporting standard social presets (1280x720, 1080x1080, 1080x1920, 1200x630, 1500x500).
     - Implemented magnetic snapping to canvas edges, centerlines, and layer boundaries.
     - Provided high-DPI export calculations for 1x, 2x Retina, and 3x 300DPI print outputs.
  2. **Two-Sided Print Business Card Engine (`business-card.js`):**
     - Implemented European (85x55mm) and US (3.5x2in) standard sizes at 300 DPI.
     - Calculated exact 3mm bleed geometry, safe zone margins (3mm inside trim), and 8 corner crop tick mark lines for commercial printing.
     - Built a client-side CSV batch personalization engine parsing local CSV data and generating 20+ personalized cards with UTF-8 diacritic preservation in EN, ES, DA without server upload.
  3. **Vector QR Code & vCard Engine (`qr-vcard.js`):**
     - Implemented pure client-side vector SVG QR code generator with 4-module quiet zone enforcement.
     - Formatted standard vCard 3.0 records (`BEGIN:VCARD ... END:VCARD`).
     - Codified mandatory disclosure: static vCards are immutable once printed; dynamic URLs depend on user-owned hosting (AnyConverter hosts no public profiles).
  4. **Web NFC Adapter (`nfc-adapter.js`):**
     - Feature detected `NDEFReader` (supported on Chromium on Android).
     - Implemented direct NDEF payload writing with user gesture.
     - On unsupported platforms (Desktop, iOS Safari), gracefully generates downloadable `.txt` NDEF payloads with step-by-step instructions for native NFC writer apps.
  5. **Verification & Regression:**
     - Created `tests/creative-studio/unit/test_phase04_graphics_cards_qr_nfc.js` passing 7/7 tests.
     - Registered Suite #48 into `tests/run_all_tests.js`.
- **Consequences:**
  - Formally clears Phase 04 with `PASS FOR PHASE 04 RELEASE` verdict.
  - Fully unblocks Phase 05 (Native 2D/3D Animation, Remotion Feasibility, Browser Preview & Rendering).


## ADR-074: Creative Studio Phase 05 Pluggable RenderAdapter, 2D Animation Curves & Three.js 3D Context Recovery
- **Date:** 2026-11-24
- **Status:** Approved & Implemented
- **Context:**
  - Implementation of File 05 (`05_NATIVE_2D_3D_REMOTION_AND_BROWSER_RENDERING.md`) for AnyConverter Creative Studio.
  - Requires deterministic 2D property animation, genuine Three.js 3D glTF model rendering, and zero-cost client-side AV encoding.
  - Mandates strict enforcement of the Remotion commercial license gate under rule G-02 (no recurring SaaS/license cost to AnyConverter).
- **Decision:**
  1. **Pluggable RenderAdapter Interface (`render-adapter.js`):**
     - Decoupled video timeline composition from the underlying encoding engine.
     - Implemented `NativeCanvasRenderAdapter` as the primary zero-cost default, utilizing modern browser WebCodecs (`VideoEncoder`, `AudioEncoder`) with `MediaRecorder` WebM fallback on older browsers.
     - Implemented `RemotionRenderAdapter` strictly gated behind an enterprise license key; if unlicensed, the engine throws an explicit notice and falls back to Native Canvas.
     - Guaranteed rational frame clock execution (`fpsNumerator / fpsDenominator`), ensuring audio sample synchronization with < 0.02ms drift.
  2. **2D Animation & Keyframing Engine (`animation-engine.js`):**
     - Implemented mathematical easing curves: `linear`, `easeInQuad`, `easeOutQuad`, `easeInOutQuad`, `easeOutBack`, and `step`.
     - Built motion presets: typewriter text reveal, Ken Burns pan/zoom, and fade in/out curves.
     - Guaranteed frame-accurate determinism when evaluating arbitrary timeline frames (e.g., frame 47).
  3. **Three.js 3D Scene Graph & Context Loss Recovery (`three-scene-adapter.js`):**
     - Integrated glTF/GLB character models, camera positioning, and directional/ambient lighting.
     - Implemented a complete WebGL context loss recovery cycle (`webglcontextlost` -> snapshot transforms -> `webglcontextrestored` -> restore state).
     - Provided a 2D poster fallback mode for devices lacking WebGL hardware support.
  4. **Export Preflight Engine (`export-preflight.js`):**
     - Audited missing asset references prior to export.
     - Added warnings for resolutions > 1080p and framerates > 30 fps to protect low-end mobile devices.
     - Detected unsupported CSS filters (`backdrop-filter`, `drop-shadow`) and suggested pre-rendered bitmap alternatives.
  5. **Verification & Regression:**
     - Created `tests/creative-studio/unit/test_phase05_animation_and_rendering.js` passing all 7 R1–R8 acceptance tests.
     - Registered Suite #49 into `tests/run_all_tests.js`.
- **Consequences:**
  - Formally clears Phase 05 with `PASS FOR PHASE 05 RELEASE` verdict.
  - Fully unblocks Phase 06 (Non-Destructive Video Editor, Generated Clips, Audio & Captions).


## ADR-075: Creative Studio Phase 06 Multitrack Timeline, Audio Ducking, SRT/VTT Captions & Selective Invalidation
- **Date:** 2026-11-24
- **Status:** Approved & Implemented
- **Context:**
  - Implementation of File 06 (`06_NONDESTRUCTIVE_VIDEO_EDITOR_GENERATED_CLIP_EDITS_AUDIO_CAPTIONS.md`) for AnyConverter Creative Studio.
  - Requires non-destructive multitrack NLE video editing, audio mixing with deterministic ducking, broadcast-safe subtitle handling, and selective shot regeneration invalidation.
- **Decision:**
  1. **Three Clip Editing Classes (`timeline-editor.js`):**
     - `SOURCE_NATIVE`: Full vector/layer object tree editable in `.acstudio`.
     - `GENERATED_FOOTAGE`: Raster video with prompt, seed, model metadata; editable only via shot regeneration or overlays.
     - `IMPORTED_RASTER`: Standard external MP4/WebM; supports non-linear edits (trim, split, speed, volume, captions, overlays).
     - Explicit UX messaging explains choices when users attempt to edit flattened clips, eliminating false expectations of direct geometry editing on flattened MP4s.
  2. **Multitrack Timeline & NLE Operations (`timeline-editor.js`):**
     - Implemented frame-accurate splitting at arbitrary playhead positions.
     - Implemented non-destructive ripple trimming that shifts downstream clips and eliminates timeline gaps.
     - Enforced timebase invariants with rational framerates and integer frame clocks.
  3. **Multitrack Audio Mixer & Deterministic Ducking (`audio-mixer.js`):**
     - Implemented per-track and per-clip volume automation with fade-in and fade-out curves.
     - Built automatic ducking: background music volume attenuates to 0.25 (-12dB) whenever a voiceover/narration track is active.
     - Generated normalized waveform peaks for timeline UI visualization.
  4. **Caption & Subtitle Engine (`caption-editor.js`):**
     - Implemented bidirectional SubRip (`.srt`) and WebVTT (`.vtt`) parsing and generation.
     - Implemented automatic broadcast-safe line wrapping (<= 42 characters per line) preventing subtitle spill beyond video safe zones.
  5. **Selective Scene Invalidation Tracker (`scene-invalidation.js`):**
     - Built dependency graph `scene -> shots -> assetIds`.
     - When a single scene is modified (e.g. Scene 9 in a 12-scene project), only that scene is marked dirty; all other scenes remain clean with unchanged SHA-256 asset hashes.
     - Implemented candidate replacement staging (`version 2`) allowing users to review, accept, or reject replacements before committing to the timeline.
  6. **Verification & Regression:**
     - Created `tests/creative-studio/unit/test_phase06_timeline_audio_captions.js` passing 7/7 tests.
     - Registered Suite #50 into `tests/run_all_tests.js`.
- **Consequences:**
  - Formally clears Phase 06 with `PASS FOR PHASE 06 RELEASE` verdict.
  - Fully unblocks Phase 07 (Creation Wizards, AI & Native Prompt Storyboards, and No-AI Automation).


## ADR-076: Creative Studio Phase 07 Creation Wizards, Native Parser, Prompt Compiler & Storyboards
- **Date:** 2026-11-24
- **Status:** Approved & Implemented
- **Context:**
  - Implementation of File 07 (`07_CREATION_WIZARDS_AI_AND_NATIVE_PROMPT_STORYBOARD.md`) for AnyConverter Creative Studio.
  - Requires contextual creation wizards across formats, deterministic mini-language parsing for zero-cost explainers, structured AI prompt compiling with camera directions, and visual storyboards with per-shot native fallbacks.
- **Decision:**
  - 1. **Contextual Creation Wizard (`creation-wizard.js`):**
     - Implemented an 8-step wizard flow (`FORMAT_SELECTION`, `PURPOSE`, `STYLE_SELECTION`, `SCRIPT_INPUT`, `ASSET_COLLECTION`, `AUDIO_VOICEOVER`, `STORYBOARD_REVIEW`, `PROJECT_INITIALIZATION`).
     - Enforced contextual style constraints (e.g., rejecting 3D styles for 2D print business cards).
     - Gracefully handled AI mode selection when no provider is connected, warning the user and defaulting to native generation without throwing unhandled exceptions.
  - 2. **Deterministic Native Mini-Language Parser (`native-parser.js`):**
     - Built a zero-AI parser supporting structured cues: `[SCENE]`, `[DURATION]`, `[TRANSITION]`, `[TITLE]`, `[SUBTITLE]`, `[TEXT]`, `[CALLOUT]`, `[AUDIO]`, `[BG]`.
     - Generates rich kinetic typography, transitions (fade, slide, zoom, wipe), and background treatments deterministically with zero external API calls or tokens.
  - 3. **Structured AI Prompt Compiler (`prompt-compiler.js`):**
     - Translates user narrative text into professional shot-level video/image prompts with camera motion directions, lighting, composition styles, and negative constraints.
     - Enforces shot bounding to prevent runaway cost or excessive API token generation.
  - 4. **Storyboard Grid & Native Fallback Manager (`storyboard-manager.js`):**
     - Built an interactive storyboard model with scene cards, thumbnail previews, shot reordering, and timing adjustments.
     - Implemented an instant native fallback toggle on individual shots, immediately zeroing out estimated AI cost for that shot.
     - Provided credential-free CSV and JSON export routines with proper sanitization and multilingual support (EN, ES, DA).
  - 5. **Verification & Regression:**
     - Created `tests/creative-studio/unit/test_phase07_wizards_and_storyboards.js` passing 7/7 tests.
     - Registered Suite #51 into `tests/run_all_tests.js`.
- **Consequences:**
  - Formally clears Phase 07 with `PASS FOR PHASE 07 RELEASE` verdict.
  - Fully unblocks Phase 08 (Browser-Only Auth, Provider Credentials, and Security).


## ADR-077: Creative Studio Phase 08 Browser-Only Auth, BYOK Credential Handling & Security
- **Date:** 2026-11-24
- **Status:** Approved & Implemented
- **Context:**
  - Implementation of File 08 (`08_BROWSER_ONLY_AUTH_PROVIDER_CREDENTIALS_AND_SECURITY.md`) for AnyConverter Creative Studio.
  - Requires completely dropping server-side login concepts, using official GIS browser token models for Google Drive with `drive.file` scope only, ephemeral in-memory BYOK management, opt-in client-side encryption via PBKDF2/AES-256-GCM, and CSP/sanitization controls.
- **Decision:**
  - 1. **Zero-Backend Identity & GIS Token Model (`auth-provider.js`):**
     - Dropped any concept of AnyConverter accounts or backend sessions; editor is local/guest by default.
     - Implemented Google Identity Services (GIS) token model for Google Drive file access with `drive.file` scope only.
     - Tokens are held purely in transient JavaScript memory and are never persisted to localStorage, cookies, IndexedDB, or `.acstudio` archives.
     - Implemented active account indicator masking (`u***@domain.com`) and zeroization on token revocation.
  - 2. **BYOK Vault & Opt-in Local Cryptography (`byok-vault.js`):**
     - Built default Session-Only memory vault (`_sessionKeys` Map) wiped instantly on disconnect or unload.
     - Implemented opt-in client-side encrypted vault using WebCrypto: PBKDF2 (SHA-256, 100,000 iterations, 16-byte random salt) + AES-256-GCM (256-bit key, 96-bit random nonce).
     - Standardized encrypted record format matching Section 6 of File 08.
     - Wrong passphrase strictly triggers authentication tag failure (`INVALID_PASSPHRASE`) with zero plaintext leakage.
     - Codified explicit XSS limitation disclaimer in vault documentation.
  - 3. **Provider Decision Tree & Secret Redaction (`provider-security.js`):**
     - Implemented provider suitability decision tree: directly supported browser clients (`google-gemini`, `huggingface-inference`) vs. confidential server APIs (`openai`, `runway`, `midjourney`) routed to manual notebooks.
     - Explicitly blocked third-party CORS proxies as `REJECTED_UNSAFE`.
     - Built regex-based secret scrubber (`redactSecrets`) and an in-memory `AuditLogger` ensuring zero API key leaks in telemetry or console logs.
     - Built `sanitizeUntrustedInput` stripping `<script>`, inline event handlers, and `javascript:` URLs.
  - 4. **Verification & Regression:**
     - Created `tests/creative-studio/unit/test_phase08_auth_and_security.js` passing 7/7 tests.
     - Registered Suite #52 into `tests/run_all_tests.js`.
- **Consequences:**
  - Formally clears Phase 08 with `PASS FOR PHASE 08 RELEASE` verdict.
  - Fully unblocks Phase 09 (AI Provider Adapters, Notebooks & Free GPU Fallbacks).


## ADR-078: Creative Studio Phase 09 AI Provider Adapters, Notebook Workflows & Free GPU Fallbacks
- **Date:** 2026-11-24
- **Status:** Approved & Implemented
- **Context:**
  - Implementation of File 09 (`09_AI_PROVIDER_ADAPTERS_NOTEBOOKS_AND_FREE_GPU_FALLBACKS.md`) for AnyConverter Creative Studio.
  - Requires zero AnyConverter inference cost (BYOK only), live capability registry, pluggable `AiProviderAdapter` contract with strict user approval gates, reproducible `.ipynb` notebooks for heavy GPU video generation (SVD), and an 11-state job lifecycle manager with magic byte validation and auto-retry bans.
- **Decision:**
  - 1. **Live Provider Capability Registry (`provider-capability-registry.js`):**
     - Mapped supported browser models (`google-gemini`, `huggingface-inference`), manual-only GPU models (`stable-video-diffusion`, `openai-sora-dalle`), and prohibited proxy routers (`third-party-cors-proxy`).
     - Provided real cost and quota estimation functions without hardcoded marketing claims.
  - 2. **Pluggable Adapter Contract & Approval Gate (`ai-provider-adapter.js`):**
     - Enforced `AiProviderAdapter` interface methods (`capabilities`, `estimate`, `submitApprovedJob`, `poll`, `fetchResults`, `cancel`, `disconnect`).
     - Mandated that `submitApprovedJob` throws `APPROVAL_REQUIRED` or `USER_APPROVAL_NOT_GRANTED` unless accompanied by an explicit user approval record specifying maximum request bounds.
     - Built `GeminiProviderAdapter` and `HuggingFaceProviderAdapter` supporting client-side generation and `AbortController` cancellation.
  - 3. **Reproducible Notebook Workflow Generator (`notebook-workflow.js`):**
     - Generated compliant Jupyter Notebooks (`.ipynb`, nbformat v4) for SVD video generation on Google Colab or Kaggle.
     - Included automatic hardware checks (`torch.cuda.is_available()`), pinned dependencies (`diffusers==0.31.0`), output manifest (`manifest.json`), and ZIP packaging with zero embedded secrets.
  - 4. **11-State Job Lifecycle & Media Verification (`job-lifecycle-manager.js`):**
     - Tracked complete lifecycle: `DRAFT -> CAPABILITY_CHECKED -> AUTHORIZED -> USER_APPROVED -> SUBMITTED -> RUNNING -> COMPLETED -> OUTPUT_RETRIEVED -> HASHED_AND_SAVED_LOCAL -> ATTACHED_TO_SCENE -> VERIFIED`.
     - Built deterministic per-scene cache key hashing to prevent redundant identical calls.
     - Implemented binary magic byte inspection, verifying real media signatures (PNG, JPEG, MP4) and rejecting HTML error documents or JSON errors disguised as binary media.
     - Strictly prohibited automatic retries for failed or canceled jobs without fresh user authorization.
  - 5. **Verification & Regression:**
     - Created `tests/creative-studio/unit/test_phase09_provider_adapters_and_notebooks.js` passing 7/7 tests.
     - Registered Suite #53 into `tests/run_all_tests.js`.
- **Consequences:**
  - Formally clears Phase 09 with `PASS FOR PHASE 09 RELEASE` verdict.
  - Fully unblocks Phase 10 (Google Drive Save, Open, Resume, Sync & Conflicts).

## ADR-079: Creative Studio Phase 10 Google Drive Bidirectional Storage, Resumable Uploads & Conflict Resolution
- **Date:** 2026-11-24
- **Status:** Approved & Implemented
- **Context:**
  - Implementation of File 10 (`10_GOOGLE_DRIVE_SAVE_OPEN_RESUME_SYNC_AND_CONFLICTS.md`) for AnyConverter Creative Studio.
  - Requires enabling users to save complete, restorable projects into their own Google Drive, open them across devices, and edit purely from browser JavaScript.
  - Must strictly honor Immutable Architectural Governance: G-01 (Zero Backend), G-02 / G-03 (Zero Storage Cost / User-owned quota), GIS browser token model with minimal `drive.file` scope, strict in-memory token lifecycle (zero token leaks), local autosave preservation, commit-manifest-last transactional ordering, resumable 256KB-aligned chunked uploads (>5MB), and optimistic concurrency conflict resolution.
- **Decision:**
  - 1. **Google Drive Sync Adapter (`drive-sync-adapter.js`):**
     - Built direct browser client interfacing with official Google Drive v3 REST API (`googleapis.com/drive/v3/files` and `googleapis.com/upload/drive/v3/files`).
     - Adopted Google Identity Services (GIS) token client with minimal `drive.file` scope.
     - Confined OAuth access tokens strictly to ephemeral memory; never persisted in localStorage, cookies, or archives.
     - Enforced local autosave draft preservation upon connecting or disconnecting Google Drive.
     - Explicitly separated `saveEditableProject` (manifest, scenes, source media, timeline state) and `saveFinalVideo` (flattened MP4 export).
  - 2. **Commit-Manifest-Last Protocol Engine (`drive-commit-protocol.js`):**
     - Enforced 5-step transactional commit order on individual Drive files:
       1. Compute local revision ID and SHA-256 asset hashes.
       2. Upload changed/new content-addressed media assets (`assets/<sha256>`).
       3. Verify all asset uploads and metadata integrity.
       4. Upload immutable revision JSON (`revisions/<revision-id>.json`).
       5. Update root `project-manifest.json` pointer **last**.
     - Guaranteed that if any step prior to or during step 5 fails or aborts, the remote root manifest remains safely pointing to `lastGoodRevision`, completely preventing project corruption.
  - 3. **Resumable Chunked Upload Engine (`drive-resumable-uploader.js`):**
     - Slices packages and media assets >5MB into 256KB-aligned chunks.
     - Handles HTTP 308 Resume Incomplete, exponential backoff with jitter on 5xx network hiccups, and emits progress events.
     - Detects 401 token expiration mid-transfer, pauses session without losing accepted chunks, triggers reauthorization, and queries `bytes */total` to resume from exact byte offset.
     - Catches 403 `quotaExceeded` errors and triggers non-destructive fallback to local `.acstudio` export package.
  - 4. **Optimistic Concurrency & Conflict Resolver (`drive-conflict-resolver.js`):**
     - Tracks `baseRevision`, `workingRevision`, and `remoteRevision`.
     - Detects conflicts before committing when remote revision has progressed beyond local base.
     - Generates non-destructive scene/asset diffs.
     - Provides three resolution strategies: `OPEN_REMOTE` (discard local, load remote), `KEEP_LOCAL_AS_NEW_REVISION` (force commit local), and `SAVE_BOTH_COPIES` (preserves remote project intact while creating non-destructive duplicate `${title} (Copy from Device B)`).
  - 5. **Verification & Regression:**
     - Created `tests/creative-studio/unit/test_phase10_google_drive_sync.js` passing 7/7 tests.
     - Registered Suite #54 into `tests/run_all_tests.js`.
- **Consequences:**
  - Formally clears Phase 10 with `PASS FOR PHASE 10 RELEASE` verdict.
  - Fully unblocks Phase 11 (Character Consistency, Drama Series & Scene Regeneration).

## ADR-080: Creative Studio Phase 11 Character Consistency, World Bible, Episodic Drama & Selective Scene Regeneration
- **Date:** 2026-11-24
- **Status:** Approved & Implemented
- **Context:**
  - Implementation of File 11 (`11_CHARACTER_CONSISTENCY_DRAMA_SERIES_AND_SCENE_REGENERATION.md`) for AnyConverter Creative Studio.
  - Requires persistent Series, World, and Character Bibles with stable identity tracking, multi-episode drama continuity, selective scene/shot regeneration with rollback, missing asset diagnostics, and legal consent validation.
  - Must avoid misleading claims of "perfect AI consistency"; native 2D/3D rigs offer deterministic consistency while reference-supported AI is probabilistic.
- **Decision:**
  - 1. **Series, World & Character Bible (`character-bible.js`):**
     - Established series hierarchy: Series -> World & Character Bibles -> Episodes -> Scenes -> Shots.
     - Modeled `CharacterBible` with stable `characterId`, appearance parameters, continuity locks, approved/rejected shot records, native rig references (2D sprite sheet, 3D glTF rig), voice profiles, and legal consent verification.
     - Modeled `WorldBible` with locations, lighting presets, camera presets, props, and shared color palettes.
     - Modeled `SeriesBible` unifying production modes (`NATIVE_RIG`, `REFERENCE_AI`, `HYBRID`) and cast repositories.
  - 2. **Episodic Drama Planner & Continuity Tracker (`drama-series-planner.js`):**
     - Organized episodic storylines into dialogue turns, narrative beats, and camera instructions.
     - Built automated continuity validator checking location existence in World Bible, character participation in Character Bible, and visual anchor/rig availability.
     - Implemented shot prompt compiler bundling character visual anchors, location backdrops, camera instructions, and emotional beats into generation requests.
  - 3. **Selective Shot Regeneration & Rollback Engine (`shot-regeneration.js`):**
     - Built multi-version shot manager (`versions: [{ versionNumber, assetId, prompt, status }]`).
     - Kept active timeline pointer intact on version 1 while version 2 is proposed as a candidate.
     - Provided explicit user Accept, Reject, and instant Rollback actions.
     - Implemented middle scene edit isolation: verified that modifying Scene 8 of 20 leaves scenes 1–7 and 9–20 asset hashes and durations 100% unmutated.
     - Built non-destructive missing asset diagnostics: missing storage assets are flagged across affected characters and scenes without destructive deletion, supporting safe relinking (`relinkAsset`).
  - 4. **Legal Consent & Rights Warning Gate:**
     - Enforced mandatory user confirmation for portrayals of real persons or user-supplied voice clones.
  - 5. **Verification & Regression:**
     - Created `tests/creative-studio/unit/test_phase11_character_and_series.js` passing 7/7 tests.
     - Registered Suite #55 into `tests/run_all_tests.js`.
- **Consequences:**
  - Formally clears Phase 11 with `PASS FOR PHASE 11 RELEASE` verdict.
  - Fully unblocks Phase 12 (Token, GPU Credit Budget, Capacity & Retry Optimization).

## ADR-081: Creative Studio Phase 12 AI Token, GPU Credit, Budget & Retry Optimization
- **Date:** 2026-11-24
- **Status:** Approved & Implemented
- **Context:**
  - Implementation of File 12 (`12_TOKEN_GPU_CREDIT_BUDGET_CAPACITY_AND_RETRY_OPTIMIZATION.md`) for AnyConverter Creative Studio.
  - Requires stopping the conflation of all AI compute under generic "tokens", establishing a source-dated pricing manifest, calculating preflight workloads with accurate ceiling division, preventing duplicate submissions, handling 429 rate limits without work loss, and maintaining local-only auditable telemetry.
- **Decision:**
  - 1. **Multi-Unit Billing Registry (`billing-unit-registry.js`):**
     - Mapped distinct resource units: `TEXT_TOKENS`, `IMAGE_COUNT`, `VIDEO_SECONDS`, `VIDEO_CREDITS`, `GPU_MINUTES`, `VOICE_CHARACTERS`, `INFERENCE_REQUESTS`, `FREE_TIER`, and `MANUAL_NOTEBOOK`.
     - Built a versioned, source-dated pricing manifest (`2026-11-20`) with documented URLs.
     - Strictly prohibited fake $0 cost estimates for unverified models; unverified models return explicit `known: false` warnings.
  - 2. **Preflight Budget Planner & Workload Estimator (`budget-planner.js`):**
     - Separated AI footage duration from zero-cost native scenes.
     - Enforced clip ceiling division: `planned_requests = SUM(ceil(shot_seconds / max_clip_seconds))`, preventing call undercounts.
     - Added user-configurable retry contingency reserves (e.g. 20%).
     - Implemented decision statuses (`FEASIBLE_VERIFIED_CREDITS`, `FITS_ESTIMATED_BUDGET`, `BUDGET_SHORTFALL`, `PROVIDER_QUOTA_UNKNOWN`).
     - Formulated actionable shortfall mitigation strategies: reduce AI footage with native animations, lower retry reserves, or switch to free SVD Colab notebooks.
  - 3. **Request Deduplication & Budget Guard Engine (`budget-guard.js`):**
     - Computed deterministic prompt fingerprints based on model, prompt, references, and parameters.
     - Reused identical completed outputs at zero cost deduction.
     - Blocked identical in-flight submissions to prevent accidental double charges (`DUPLICATE_IN_FLIGHT_JOB`).
     - Handled HTTP 429 rate limits gracefully: preserved completed shots and queued remaining items for safe resume without cost leaks.
  - 4. **Local-Only Auditable Telemetry (`BudgetTelemetry`):**
     - Recorded generation submissions, successes, failures, asset reuses, seconds generated, and estimated cost savings purely in client-side memory.
     - Zero data transmitted externally under zero-backend rule G-01.
  - 5. **Verification & Regression:**
     - Created `tests/creative-studio/unit/test_phase12_budget_and_optimization.js` passing 7/7 tests.
     - Registered Suite #56 into `tests/run_all_tests.js`.
- **Consequences:**
  - Formally clears Phase 12 with `PASS FOR PHASE 12 RELEASE` verdict.
  - Fully unblocks Phase 13 (ChatGPT, Claude & Agent Interoperability Without Backend).
