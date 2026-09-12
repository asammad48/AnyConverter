# Phase 04 Deepsearch Release Gate Packet

Generated: 2026-09-12

## Executive Summary

Phase 04 has been implemented for the priority release gate surface. The local release gates now cover static SEO checks, browser/product smoke checks, third-party dependency inventory, Lighthouse desktop lab budgets, privacy claim tightening, and release/rollback decision rules.

The seven priority URLs now pass the local static SEO gate and the local browser gate. Desktop Lighthouse lab evidence passes the numeric Core Web Vitals-style budgets used in this phase: LCP <= 2.5s, CLS <= 0.1, and TBT <= 200ms as an INP lab proxy. Google states that Lighthouse cannot measure INP directly in lab conditions and recommends TBT as a proxy; field INP remains an external-data requirement. [1]

## Sources Used

1. web.dev, "Web Vitals" (last updated 2024-10-31): Core Web Vitals are LCP, INP, and CLS; good thresholds are LCP within 2.5s, INP 200ms or less, and CLS 0.1 or less at the 75th percentile. It also states that Lighthouse uses TBT as a lab proxy for INP. https://web.dev/articles/vitals
2. Google Search Central, "Understanding Core Web Vitals and Google search results": Google Search documentation for Core Web Vitals and page experience. https://developers.google.com/search/docs/appearance/core-web-vitals
3. Google Search Central, "Robots.txt Introduction and Guide": robots.txt controls crawler access and is not a page-removal/index-prevention mechanism. https://developers.google.com/search/docs/crawling-indexing/robots/intro
4. Google Search Central, "What Is a Sitemap": sitemaps help Google discover and crawl URLs, but do not guarantee indexing. https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
5. Google Search Central, "How to Specify a Canonical with rel=canonical and Other Methods": canonicalization guidance used for release-gate checks. https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
6. Google Search Central, "Block Search Indexing with noindex": noindex behavior used for release-gate checks. https://developers.google.com/search/docs/crawling-indexing/block-indexing
7. Lighthouse CI, "Configuration": assertion keys can target Lighthouse audit IDs and categories. https://googlechrome.github.io/lighthouse-ci/docs/configuration.html

## Implemented Fixes

- Tightened public privacy/security claims in `index.html`, `privacy/index.html`, and `security/index.html`.
- Removed unsupported SRI wording from the security page.
- Updated `privacy/index.html` and `security/index.html` dates to September 12, 2026.
- Updated `README.md` and `PERFORMANCE.md` to align targets with Phase 04 budgets.
- Added `_headers` cache rules for `/sitemap.xml` and `/robots.txt`.
- Removed Google Fonts from the seven Phase 04 priority pages to remove first-render third-party font dependency.
- Lazy-loaded `pdf-lib` on `/pdf-merge/` and `/pdf-compress/` after PDF selection instead of during initial page load.
- Improved stale generic metadata/content on `/image-converter/`, `/word-counter/`, and `/typing-speed-test/`.
- Added `lighthouserc.cjs` for Lighthouse CI-style budgets.
- Added `tools/phase04-seo-release-gate.js`.
- Added `tools/phase04-browser-gate-runner.js`.
- Added `tools/phase04-third-party-inventory.js`.
- Added `output/playwright/phase04-release-browser-gate.js`.

## Measurement Protocol

Local lab environment:

- Server: `node server.js` on `http://localhost:5000`.
- Browser gate: bundled Codex Playwright runtime with Chromium 151.0.7922.34.
- Lighthouse: `npx --yes lighthouse`, desktop preset, headless Chrome.
- Viewports for browser gate: desktop 1366x900 and mobile 390x844.
- Lighthouse artifacts: `output/lighthouse/phase04-desktop-*.json`.
- Tooling caveat: Lighthouse wrote valid JSON reports but its Chrome launcher cleanup step returned Windows `EPERM` temp-directory removal errors. Treat that as a local tooling cleanup defect, not a page failure.

Field/prod evidence still pending:

- Current Google Search Console access.
- Analytics access.
- Field CWV / CrUX or PageSpeed Insights origin/page data.
- Google-selected canonical evidence.

## Desktop Lighthouse Lab Results

| URL | Performance | SEO | Best Practices | LCP ms | CLS | TBT ms | Result |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `/` | 99 | 100 | 100 | 831 | 0.00 | 56 | Pass |
| `/pdf-merge/` | 100 | 100 | 100 | 630 | 0.03 | 27 | Pass |
| `/pdf-compress/` | 100 | 100 | 100 | 648 | 0.03 | 34 | Pass |
| `/image-converter/` | 100 | 100 | 100 | 662 | 0.03 | 38 | Pass |
| `/json-formatter/` | 100 | 100 | 100 | 640 | 0.03 | 17 | Pass |
| `/word-counter/` | 100 | 100 | 100 | 605 | 0.03 | 56 | Pass |
| `/typing-speed-test/` | 100 | 100 | 100 | 586 | 0.03 | 51 | Pass |

Decision: Local desktop lab budgets pass. This is not a field CWV claim.

## Static SEO Gate

Command:

```powershell
node tools\phase04-seo-release-gate.js
```

Result:

- Status: pass.
- Failures: 0.
- Warnings: 0.

Checks covered:

- `robots.txt` exists and declares production sitemap.
- No site-wide `Disallow: /`.
- `sitemap.xml` exists.
- Priority page title and meta description.
- Canonical equals expected production URL.
- Canonical URL appears in sitemap.
- No priority-page `noindex`.
- `hreflang` entries for `en`, `es`, `da`, and `x-default`.
- JSON-LD parses.
- Script tags with `src` use `defer` or `async`.
- Local links resolve to local files.

## Browser/Product Gate

Command:

```powershell
$env:NODE_PATH='C:\Users\Abdul Sammad\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
& 'C:\Users\Abdul Sammad\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' tools\phase04-browser-gate-runner.js
```

Result:

- Status: pass.
- Desktop and mobile rows: 14.
- Missing selectors: 0.
- Invalid JSON-LD: 0.
- Horizontal overflow: false for every row.
- Console errors: 0.
- Page errors: 0.
- Workflows exercised:
  - `/pdf-merge/`: simulated two PDF file selections; `pdf-lib` lazy-loaded after selection.
  - `/pdf-compress/`: simulated one PDF selection; `pdf-lib` lazy-loaded after selection.
  - `/image-converter/`: simulated PNG image selection.
  - `/json-formatter/`: formatted sample JSON.
  - `/word-counter/`: counted sample text.
  - `/typing-speed-test/`: started test and typed sample input.

## Heavy Library Loading Matrix

| Page | Heavy dependency | First-load status after fixes | Trigger | Action |
| --- | --- | --- | --- | --- |
| `/` | None | Not loaded | N/A | Pass |
| `/pdf-merge/` | `pdf-lib@1.17.1` from `unpkg.com` | Not in HTML first load | PDF selection | Lazy-loaded |
| `/pdf-compress/` | `pdf-lib@1.17.1` from `unpkg.com` | Not in HTML first load | PDF selection | Lazy-loaded |
| `/image-converter/` | None | Not loaded | Browser Canvas API | Pass |
| `/json-formatter/` | None | Not loaded | Built-in JSON APIs | Pass |
| `/word-counter/` | None | Not loaded | Local JS | Pass |
| `/typing-speed-test/` | None | Not loaded | Local JS | Pass |
| `/ocr-pdf/` | PDF.js and Tesseract.js | Still first-load on carryover page | OCR workflow | Phase 05/engineering review recommended |
| `/csv-query/` | PapaParse and SQL.js WASM | Still first-load on carryover page | CSV query workflow | Phase 05/engineering review recommended |
| `/csv-to-sql/` | PapaParse and highlight.js | Still first-load on carryover page | CSV conversion workflow | Phase 05/engineering review recommended |
| `/cron-expression-parser/` | cronstrue | Still first-load on carryover page | Cron parse workflow | Review if this becomes a performance priority |

## Third-Party Request Inventory

Command:

```powershell
node tools\phase04-third-party-inventory.js
```

Key findings after fixes:

- Priority first-load HTML no longer includes Google Fonts.
- `/pdf-merge/` and `/pdf-compress/` load `unpkg.com/pdf-lib@1.17.1` only after file selection in the browser gate.
- Carryover pages still using Google Fonts and/or heavy CDN libraries include `/organize-pdf/`, `/jpg-to-pdf/`, `/pdf-to-jpg/`, `/ocr-pdf/`, `/redact-pdf/`, `/pdf-security/`, `/csv-to-sql/`, `/csv-query/`, `/jwt-decoder/`, `/regex-tester/`, `/hash-generator/`, `/base64-encoder/`, `/url-encoder/`, and `/cron-expression-parser/`.
- Privacy page includes external policy/help links to Google and Cloudflare; those are normal outbound links, not tool-processing uploads.

## Privacy Claim Matrix

| Claim Type | Previous Risk | Phase 04 Status | Approved Wording Pattern |
| --- | --- | --- | --- |
| `100% private` | Too absolute across CDN-backed pages | Replaced on homepage/security and priority touched pages | "Tools are designed to process file and text content in the browser." |
| `never leaves your device` | Requires workflow-level network proof | Replaced on public policy/security surfaces | "The current site architecture does not send selected content to an AnyConverter back-end processing server." |
| `we cannot see your files` | Too absolute; depends on runtime, browser, third parties, and logs | Replaced | "No AnyConverter content-processing upload API." |
| SRI protection | HTML did not include integrity attributes for current CDN scripts | Removed from security page | "CDN resources should be pinned by version and tracked in the dependency inventory." |
| Secure redaction | Known unsupported for `/redact-pdf/` | Not introduced | Use "Blackout PDF" and "visual blackout." |

## Analytics Dictionary

Allowed events:

| Event | Purpose | Required Properties | Prohibited Payload |
| --- | --- | --- | --- |
| `tool_open` | Tool page viewed | `tool_name`, `tool_category`, `page_language`, `device_class` | URL query contents, file names, raw input |
| `input_added` | User supplied file/text | Same four properties | File name, file bytes, pasted text, token/JWT/password/content |
| `conversion_started` | Processing began | Same four properties | Source data, output data |
| `conversion_success` | Processing completed | Same four properties | File name/content/output |
| `conversion_error` | Processing failed | Same four properties plus sanitized error class only if approved | Raw exception text if it may contain user input |
| `download_started` | User requested output download | Same four properties | Output filename/content |
| `copy_result` | User copied output | Same four properties | Copied text |
| `related_tool_clicked` | Internal navigation | Same four properties | Full referrer query/user input |
| `language_changed` | Language switch | Same four properties | User-entered content |

Decision: Do not add analytics instrumentation until consent/provider configuration is reviewed. The dictionary is ready for implementation.

## Release Gate Thresholds

Block release if any of these occur:

- Static SEO gate exits non-zero.
- Browser gate exits non-zero.
- Lighthouse desktop LCP exceeds 2500ms for a priority URL.
- Lighthouse desktop CLS exceeds 0.1 for a priority URL.
- Lighthouse desktop TBT exceeds 200ms for a priority URL unless explicitly accepted as a lab proxy warning.
- Changed privacy/security copy contains unsupported absolute claims.
- `/redact-pdf/` claims secure redaction or permanent removal.
- A URL move, redirect change, canonical change, or sitemap removal is proposed without checking the protected URL register.

Warn and require owner sign-off:

- Lighthouse performance category score below 0.9 while numeric budgets pass.
- New third-party host.
- New first-load heavy library on a non-tool page.
- Changed ES/DA copy without native review.

## Release And Rollback Runbook

Preferred release window:

- Thursday or Friday daytime in the site owner's main operating timezone.
- Avoid late-night or weekend releases unless urgent.

Pre-release:

- Run the static SEO gate.
- Run the browser/product gate.
- Run Lighthouse desktop for seven priority URLs.
- Review third-party inventory diff.
- Review privacy/security claim diff.
- Confirm no URL moves.

Post-release observation window:

- First 30 minutes: verify homepage and priority tool pages load.
- First 2 hours: watch errors, analytics if available, and Search Console coverage if available.
- First 24 hours: watch field performance and indexing signals when external access exists.

Rollback triggers:

- Priority page 4xx/5xx or broken asset paths.
- Missing canonical/sitemap/robots regression.
- Browser gate workflow failure.
- Unsupported privacy/security claim shipped.
- Performance regression above block thresholds.

Rollback action:

- Revert the release commit or redeploy last known good static artifact.
- Re-run static and browser gates after rollback.
- Log the failed check and owner.

## Dry-Run Result

Dry-run status: pass with one tooling caveat.

Passing:

- Static SEO gate.
- Browser/product gate.
- Desktop Lighthouse numeric budgets.
- Desktop Lighthouse scores after fixes.
- Priority first-load third-party request reduction.

Caveat:

- Lighthouse CLI on this Windows host reports `EPERM` when deleting temporary Chrome directories after writing JSON reports. Reports are valid and parseable. This should be fixed or worked around before CI adoption.

## Open Blockers For Phase 05

- GSC access remains required for Google-selected canonical and indexing evidence.
- Analytics access remains required for production event evidence.
- Field CWV remains required before making production/page-experience claims.
- Native ES/DA review remains required before localized release-quality claims.
- OCR/PDF.js/Tesseract and CSV SQL.js pages should be considered for lazy-loading if they become performance priorities.
- SRI or self-hosting policy for CDN libraries remains an engineering/security decision.
