# Phase 03 Day 02 - Accuracy Fact Sheet

Generated: 2026-09-10

## Objective

Create a factual baseline for the Phase 03 PDF and Developer/Data page rewrites. This sheet separates local-code facts from pending external claims so future copy can be more specific without overpromising.

## Evidence Basis

- Local scripts in `assets/js/tools/*.js`.
- Priority page HTML in each tool directory.
- Day 01 boilerplate inventory in `day-01-boilerplate-inventory.md`.
- Missing Phase 02 CSV artifacts remain a blocker for final ownership/link/breadcrumb decisions.

## Global Rules For Copy

- Do not move URLs.
- Do not claim current GSC, analytics, rankings, field CWV, or Google-selected canonical facts.
- Do not claim secure redaction for `/redact-pdf/`. Use "Blackout PDF", "visual blackout", and "cover with black rectangles".
- Do not make native-quality claims for ES/DA pages until native review is complete.
- Browser/device hub copy may reference `/browser-tools/` only after that URL exists.
- Privacy copy can say processing happens in the browser only when the specific tool implementation supports that and third-party library loading is not confused with file upload.

## PDF Tool Fact Matrix

| URL | Formats accepted | Output | Processing observed in code | Hard limits observed | Network/library behavior | Copy-safe notes |
|---|---|---|---|---|---|---|
| `/pdf-merge/` | PDF files by MIME or `.pdf` extension | One PDF, default `merged.pdf` | Uses `pdf-lib` in browser, copies all pages from each input in chosen order | Minimum 2 PDFs; no explicit size/page cap | Loads `pdf-lib` from page script | Mention drag/drop reorder, alphabetical sort, optional blank separator pages, browser memory limits |
| `/pdf-split/` | One PDF | Individual PDFs or ZIP if selected | Uses `pdf-lib` in browser, parses ranges, copies selected pages | Needs valid pages/ranges; no explicit size cap | Loads `pdf-lib`; custom ZIP writer in local script | Mention ranges, every-N pages, per-page output, sorted unique page ranges |
| `/pdf-compress/` | One PDF | PDF, default `compressed.pdf` | Re-saves PDF with object streams through `pdf-lib` | No explicit size cap; result may not shrink | Loads `pdf-lib` | Avoid ratio claims; say actual before/after size is shown and already-optimized PDFs may not reduce |
| `/organize-pdf/` | One PDF | PDF, default `organized.pdf` | Loads source PDF, copies pages in user-entered sequence | Requires at least one valid page number | Loads `pdf-lib` | Mention reorder, duplicate, omit pages by entering page numbers |
| `/optimize-pdf/` | One PDF | PDF, default `optimized.pdf` | Copies all pages into new PDF, optionally clears metadata, saves with object streams | No explicit size cap | Loads `pdf-lib` | Separate from compress copy; avoid unmeasured savings |
| `/jpg-to-pdf/` | JPEG/JPG and PNG are supported by conversion code | PDF, default `images.pdf` | Embeds images into `pdf-lib` document | No explicit file count or size cap | Loads `pdf-lib` | Mention JPEG/PNG, A4/original/fill layout, margin setting; avoid "all images" unless code is expanded |
| `/pdf-to-jpg/` | One PDF | Per-page image downloads; JPEG or PNG based on selected format | Uses PDF.js render to canvas then browser image export | No explicit size/page cap | Loads PDF.js from CDN and worker from cdnjs | Mention scale, quality for JPEG, preview thumbnails, sequential downloads |
| `/ocr-pdf/` | PDF or image files | Extracted text in page output area | Uses PDF.js rendering plus Tesseract OCR in browser | No explicit size/page cap; OCR may be slow | Loads PDF.js, Tesseract, and likely worker/language assets | Mention OCR is recognition, not guaranteed perfect; language selected by UI |
| `/redact-pdf/` | One PDF | PDF, default `blackout.pdf` | Draws black rectangles on pages using `pdf-lib` | Requires at least one rectangle; no explicit size cap | Loads `pdf-lib` | Must say visual blackout only; underlying content may remain recoverable |
| `/pdf-security/` | One PDF | PDF, default `secured.pdf` | Copies pages and saves with owner/user password and permissions through `pdf-lib` | Owner password required; no explicit size cap | Loads `pdf-lib` | Mention permissions depend on viewer enforcement; avoid compliance-grade security claims |

## Developer/Data Tool Fact Matrix

| URL | Input | Output | Processing observed in code | Limits observed | Network/library behavior | Copy-safe notes |
|---|---|---|---|---|---|---|
| `/json-formatter/` | Pasted JSON or `.json` upload | Formatted/minified JSON, YAML text, CSV when shape allows | Uses `JSON.parse`, `JSON.stringify`, local tree rendering and converters | CSV export requires object or array of objects | Local script; no upload behavior found | Mention validation errors, sorting, indentation, tree view, stats |
| `/csv-to-sql/` | Pasted CSV or uploaded CSV | SQL text/download `data.sql` | Uses PapaParse; creates DROP/CREATE/INSERT options; SQL escaping doubles quotes | File chunks are 5 MB; type detection samples first 50 rows; batch INSERT size 500 | Loads PapaParse/highlight.js from page | Mention MySQL/PostgreSQL/SQLite quoting, editable column types |
| `/csv-query/` | Uploaded CSV | Query results table, CSV/JSON export | Uses PapaParse with headers, SQL.js in browser, table named `data`, all columns TEXT | No explicit size cap; browser memory/WASM limits apply | SQL.js `locateFile` pulls WASM from cdnjs | Mention default query, pagination, sorting, export, in-memory DB |
| `/jwt-decoder/` | JWT string with 3 dot-separated parts | Header/payload/signature display and exp status | Base64url decodes header/payload and parses JSON | Requires exactly 3 segments | Local browser decoding | Must state decoder only; does not verify signature |
| `/regex-tester/` | Pattern and text/log input; optional uploaded log | Highlighted matches, groups, CSV/JSON export | Uses JavaScript `RegExp`; caps match collection at 5000; displays up to 200 in detailed list | Upload warns when file is over 10 MB, but still processes | Local script | Mention JS regex flavor and flags; avoid PCRE/server log parser claims |
| `/hash-generator/` | Text or file | Hash strings | SHA-1/SHA-256/SHA-512 use Web Crypto; MD5 uses local JS | No explicit file size cap | Local browser APIs | Mark file MD5 correctness as engineering review pending before copy promises |
| `/base64-encoder/` | Text or file | Base64 text/file output | Text uses browser Base64 functions with UTF-8 wrapping; file mode uses FileReader data URL | No explicit file size cap | Local script | Mention URL-safe option and line wrapping |
| `/url-encoder/` | URL/text | Encoded or decoded string | Uses `encodeURIComponent`, `encodeURI`, `decodeURIComponent`; optional plus for spaces | Decode can error on malformed escapes | Local script | Mention component vs full URL mode and plus-space handling |
| `/cron-expression-parser/` | Cron expression | Plain English and field breakdown | Requires exactly 5 fields, uses `cronstrue.toString` if library is loaded | 5 fields only: minute hour day month weekday | Loads cronstrue from jsdelivr | Do not claim Quartz seconds/year support |

## Pending Facts

| Pending fact | Why blocked | Action owner |
|---|---|---|
| Current GSC query/page data | No authorized console export in workspace | Search/analytics owner |
| Field Core Web Vitals | No CrUX/GSC/PageSpeed pull authorized for this phase | Performance owner |
| Google-selected canonical | Needs current URL Inspection or GSC export | Search/analytics owner |
| Phase 02 ownership/link/breadcrumb CSVs | Named artifacts are not present under the workspace | Phase 02 owner |
| Native ES/DA copy quality | Requires native-language reviewer | Localization owner |
| Secure redaction status | Local code shows visual rectangles only | Engineering/product owner |

## Day 02 Handoff

Use this fact sheet as the claim source for Days 03-14. Any rewrite brief that goes beyond these facts must add a new evidence row or mark the claim as pending.
