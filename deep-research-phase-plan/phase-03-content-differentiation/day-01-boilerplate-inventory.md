# Phase 03 Day 01 Boilerplate Inventory

Observation date: 2026-09-09T20:52:34Z
Branch / commit: `feat/deep_search_phase_plan` / `c96472f87ef10df76541377535ee141d95eec9d1`
Scope: English priority PDF and developer/data pages named in `day-01.md`.

## Summary

The repeated body-copy pattern is concentrated in each page's `<section class="seo-content" data-seo-keyword-plan="2026-08-21">`. Shared tool UI, breadcrumb, ad slots, related-tool cards, and common page scaffolding are not counted as weak body copy unless the text makes a tool-specific claim.

Observed boilerplate patterns:

| Pattern ID | Quote | Affected locations | Interpretation |
|---|---|---|---|
| BP-001 | `Use [tool] for free in your browser. Get instant results, practical examples, related tools, and no signup.` | `meta name="description"` on all inspected pages except `/redact-pdf/` | Repeated meta-description template with only the tool token swapped. |
| BP-002 | `[Tool]: practical uses` | `.seo-content h2` on every inspected page | Repeated section heading formula; useful as a selector but weak as differentiated copy. |
| BP-003 | `when you need a fast, clear, private result without creating an account` | `.seo-content > p:first-of-type` on all inspected pages except `/redact-pdf/` | Repeated promise-style intro; privacy language needs implementation/network evidence before stronger claims. |
| BP-004 | `Combining, editing, converting, or protecting documents without installing desktop PDF software.` | PDF candidate `.seo-content li` under `When it helps` | Identical PDF-cluster "Best for" text, even on OCR, image conversion, security, and blackout pages. |
| BP-005 | `Check file order, page range, output quality, and browser privacy before downloading the finished PDF.` | PDF candidate `.seo-content li` under `When it helps` | Identical PDF-cluster "Helpful details" text; references page ranges/order even where not central. |
| BP-006 | `Move to another PDF action when you need compression, splitting, images, signatures, forms, or page cleanup.` | PDF candidate `.seo-content li` under `When it helps` | Identical PDF-cluster "Next step" text; can become workflow links after M2 link map is available. |
| BP-007 | `Pasting code, structured data, tokens, hashes, or encoded text and getting a readable result quickly.` | Developer/data candidate `.seo-content li` under `When it helps` | Identical developer-cluster "Best for" text; too broad for CSV query, cron parsing, URL encoding, and hashing. |
| BP-008 | `Use the examples, validation messages, copy actions, and formatting options to catch mistakes before you ship.` | Developer/data candidate `.seo-content li` under `When it helps` | Identical developer-cluster "Helpful details" text; claims examples even when the page lacks a concrete input-output example. |
| BP-009 | `Open a related formatter, validator, encoder, parser, or converter when your workflow moves to another format.` | Developer/data candidate `.seo-content li` under `When it helps` | Identical developer-cluster "Next step" text; should be replaced with workflow-specific edges after M2 link map is located. |
| BP-010 | `For the next step, try ...` | Final paragraph in `.seo-content` on every inspected page | Templated related-tool lead-in; anchors differ, but most destination sets repeat within each cluster. |

## Page Locations

| URL | Repo path | Meta line | SEO section lines | Repeated patterns | Page-specific notes |
|---|---|---:|---:|---|---|
| `https://anyconverter.io/pdf-merge/` | `pdf-merge/index.html` | 7 | 142-151 | BP-001, BP-002, BP-003, BP-004, BP-005, BP-006, BP-010 | Hero line 59 is more specific and should be preserved as raw capability evidence. |
| `https://anyconverter.io/pdf-split/` | `pdf-split/index.html` | 7 | 149-158 | BP-001, BP-002, BP-003, BP-004, BP-005, BP-006, BP-010 | Hero line 59 contains useful split-mode and ZIP archive detail. |
| `https://anyconverter.io/pdf-compress/` | `pdf-compress/index.html` | 7 | 144-153 | BP-001, BP-002, BP-003, BP-004, BP-005, BP-006, BP-010 | Hero line 59 claims browser processing with pdf-lib; verify against runtime/CDN behavior before reusing. |
| `https://anyconverter.io/organize-pdf/` | `organize-pdf/index.html` | 6 | 86-95 | BP-001, BP-002, BP-003, BP-004, BP-005, BP-006, BP-010 | Hero line 53 gives the concrete reorder syntax example `3, 1, 2`. |
| `https://anyconverter.io/jpg-to-pdf/` | `jpg-to-pdf/index.html` | 6 | 97-106 | BP-001, BP-002, BP-003, BP-004, BP-005, BP-006, BP-010 | FAQ line 110 limits inputs to JPG/JPEG and PNG; this is stronger than the generic PDF bullets. |
| `https://anyconverter.io/pdf-to-jpg/` | `pdf-to-jpg/index.html` | 6 | 112-121 | BP-001, BP-002, BP-003, BP-004, BP-005, BP-006, BP-010 | Hero line 53 describes JPEG/PNG output, resolution scale, quality, thumbnails, and image downloads. |
| `https://anyconverter.io/ocr-pdf/` | `ocr-pdf/index.html` | 6 | 99-108 | BP-001, BP-002, BP-003, BP-004, BP-005, BP-006, BP-010 | Hero line 53 claims local OCR; runtime network dependency needs validation because the page loads pdf.js and Tesseract from CDNs. |
| `https://anyconverter.io/redact-pdf/` | `redact-pdf/index.html` | 6 | 108-117 | BP-002, BP-004, BP-005, BP-006, BP-010 | Meta, hero, features, and FAQ use safer `Blackout PDF` / visual blackout language; keep this constraint. |
| `https://anyconverter.io/pdf-security/` | `pdf-security/index.html` | 6 | 101-110 | BP-001, BP-002, BP-003, BP-004, BP-005, BP-006, BP-010 | Hero line 53 names permission restrictions and owner-password requirement; generic bullets do not. |
| `https://anyconverter.io/json-formatter/` | `json-formatter/index.html` | 8 | 264-273 | BP-001, BP-002, BP-003, BP-007, BP-008, BP-009, BP-010 | Hero line 80 contains useful differentiators: collapsible nodes and syntax highlighting. |
| `https://anyconverter.io/csv-to-sql/` | `csv-to-sql/index.html` | 7 | 239-248 | BP-001, BP-002, BP-003, BP-007, BP-008, BP-009, BP-010 | Hero line 58 describes chunked processing, column types, dialects, and CREATE TABLE + INSERT output. |
| `https://anyconverter.io/csv-query/` | `csv-query/index.html` | 7 | 171-180 | BP-001, BP-002, BP-003, BP-007, BP-008, BP-009, BP-010 | Mismatch: H1 is `CSV Query Tool — Run SQL on CSV Files`, but SEO heading line 172 is `Csv to sql: practical uses`. |
| `https://anyconverter.io/jwt-decoder/` | `jwt-decoder/index.html` | 7 | 120-129 | BP-001, BP-002, BP-003, BP-007, BP-008, BP-009, BP-010 | Hero line 57 mentions header, payload, signature, and expiration checks. |
| `https://anyconverter.io/regex-tester/` | `regex-tester/index.html` | 7 | 209-218 | BP-001, BP-002, BP-003, BP-007, BP-008, BP-009, BP-010 | Hero line 57 mentions log text, capture groups, pattern library, and CSV/JSON export. |
| `https://anyconverter.io/hash-generator/` | `hash-generator/index.html` | 7 | 137-146 | BP-001, BP-002, BP-003, BP-007, BP-008, BP-009, BP-010 | Hero line 57 names MD5, SHA-1, SHA-256, SHA-512, and Web Crypto API. |
| `https://anyconverter.io/base64-encoder/` | `base64-encoder/index.html` | 7 | 169-178 | BP-001, BP-002, BP-003, BP-007, BP-008, BP-009, BP-010 | Hero line 57 names text/file mode, Unicode, all file types, and image data URLs. |
| `https://anyconverter.io/url-encoder/` | `url-encoder/index.html` | 7 | 127-136 | BP-001, BP-002, BP-003, BP-007, BP-008, BP-009, BP-010 | Hero line 57 names URL components, full URLs, percent-encoding, and decode behavior. |
| `https://anyconverter.io/cron-expression-parser/` | `cron-expression-parser/index.html` | 7 | 132-141 | BP-001, BP-002, BP-003, BP-007, BP-008, BP-009, BP-010 | Hero line 57 names minute/hour/day/month/weekday explanation and presets. |

## Repository Implementation Observations

| Observation | Evidence |
|---|---|
| The inspected pages exist locally and are in `sitemap.xml`; `robots.txt` allows `/` and names `https://anyconverter.io/sitemap.xml`. | `rg --files`; `rg -n "https://anyconverter.io/(...)" sitemap.xml`; `rg -n "anyconverter.io|Sitemap|Disallow|Allow" robots.txt`. |
| The keyword recommendation report marks every inspected candidate as thin visible content and recommends added use cases, examples, limitations, FAQs, and related links. | `reports/all-page-keyword-recommendations-2026-08-21.csv` lines 75, 93, 95, 121, 162, 181, 197, 199, 205, 301, 304, 305, 307, 310, 311, 312, 313, 320. |
| PDF pages load external runtime libraries on several pages: pdf-lib from unpkg, pdf.js/Tesseract from cdnjs/unpkg, and Google Fonts. | `rg -n "cdnjs|unpkg|pdf-lib|pdf.js|tesseract|fonts.googleapis" ...`. |
| CSV Query has an additional runtime dependency path for SQL.js WASM from cdnjs. | `assets/js/tools/csv-query.js` lines 28-31. |
| No `fetch(`, `XMLHttpRequest`, `sendBeacon`, `localStorage`, `sessionStorage`, or `indexedDB` usage was found in the inspected tool JS files by the local search pattern. | `rg -n -e "fetch\\(" -e "XMLHttpRequest" -e "sendBeacon" -e "localStorage" -e "sessionStorage" -e "indexedDB" ...`. |
| Redact PDF implementation draws black rectangles and downloads `blackout.pdf`; local code does not prove secure redaction. | `assets/js/tools/redact-pdf.js` lines 61-73 and `redact-pdf/index.html` lines 53, 106, 110, 122. |

## Browser Sample

| URL | Viewport | Visible result | Console | Network observation | Boundary |
|---|---:|---|---|---|---|
| `http://localhost:5000/pdf-merge/` | 1280px | H1 `Merge PDF Files Online`; SEO heading `Merge PDF online: practical uses`; upload prompt visible; no horizontal overflow. | 0 errors, 0 warnings. | CLI reported only static requests hidden by default. | Local sample only; does not prove production behavior. |
| `http://localhost:5000/pdf-merge/` | 360px | Same H1 and SEO heading; upload prompt visible; no horizontal overflow. | 0 errors, 0 warnings. | Not expanded with `--static`. | Local sample only; no file-upload task performed. |
| `http://localhost:5000/csv-query/` | 1280px | H1 `CSV Query Tool — Run SQL on CSV Files`; SEO heading `Csv to sql: practical uses`; input visible; no horizontal overflow. | 0 errors, 0 warnings. | CLI reported only static requests hidden by default. | Local sample only; demonstrates visible copy mismatch. |
| `http://localhost:5000/csv-query/` | 360px | Same H1 and SEO heading; input visible; no horizontal overflow. | 0 errors, 0 warnings. | Not expanded with `--static`. | Local sample only; no CSV fixture query performed. |

## Rewrite Inputs For Day 02

Preserve the more specific hero/FAQ/tool UI facts above, then replace the SEO section boilerplate with tool-specific examples, limits, failure guidance, and next-step links. Do not move URLs. Do not claim secure redaction. Treat "private," "local," and "never uploaded" wording as pending until a page-specific network/runtime check is recorded for the exact page and workflow.
