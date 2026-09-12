# Phase 03 Day 12 - Claim Review Log

Generated: 2026-09-10

## Objective

Resolve or block factual and trust-sensitive claims before Phase 04 implementation.

## Claim Status Key

- Approved: Supported by local code or current page source.
- Conditional: Usable only with the listed qualifier.
- Blocked: Needs external data, stakeholder review, or engineering change.
- Reject: Do not use.

## Approved Claims

| Claim | Status | Evidence |
|---|---|---|
| Merge PDF combines two or more PDFs into one PDF | Approved | `assets/js/tools/pdf-merge.js` requires at least 2 files and copies pages |
| Split PDF supports page ranges | Approved | `parsePageRanges` in `assets/js/tools/pdf-split.js` |
| Organize PDF can reorder and duplicate pages by sequence | Approved | `assets/js/tools/organize-pdf.js` copies entered page sequence |
| PDF to JPG renders PDF pages as images | Approved | `assets/js/tools/pdf-to-jpg.js` renders PDF.js pages to canvas |
| JPG to PDF supports JPEG and PNG in conversion code | Approved | `assets/js/tools/jpg-to-pdf.js` uses `embedPng` or `embedJpg` |
| CSV to SQL supports MySQL/PostgreSQL/SQLite quoting choices | Approved | `quote(name, dialect)` in `assets/js/tools/csv-to-sql.js` |
| CSV Query loads CSV into table named `data` | Approved | `assets/js/tools/csv-query.js` |
| JWT Decoder does not verify signatures | Approved | Local decode logic only parses segments |
| Regex Tester uses JavaScript regular expressions | Approved | `new RegExp(...)` in `assets/js/tools/regex-tester.js` |
| Cron parser expects five fields | Approved | `parseCron` in `assets/js/tools/cron-expression-parser.js` |

## Conditional Claims

| Claim | Allowed wording | Required qualifier |
|---|---|---|
| Browser-based processing | "The page processes the selected input in your browser tab" | Do not imply no network requests when CDN libraries/workers load |
| PDF compression | "May reduce size" or "shows measured before/after size" | No percentage or guaranteed reduction |
| PDF optimization | "Rebuilds the PDF and can clear metadata fields" | Do not imply secure sanitization |
| PDF Security restricts printing/copying/editing | "Sets PDF passwords and permissions" | Add "behavior can depend on viewer enforcement" |
| OCR extracts text | "Recognizes text for review" | Do not claim perfect accuracy or searchable PDF output |
| Hashes verify files | "Compare hashes to detect changes" | Do not frame MD5 as security-safe |

## Blocked Claims

| Claim | Reason blocked | Required next step |
|---|---|---|
| Current rankings or traffic opportunity | GSC/analytics unavailable | Import authorized GSC/analytics export |
| Field Core Web Vitals | No current field data | Run authorized CWV/PageSpeed/CrUX pull |
| Google-selected canonical matches declared canonical | GSC URL Inspection unavailable | Check in GSC |
| Native ES/DA copy is release-ready | Native review unavailable | Native-language review |
| Input never leaves device for every tool | Need network traces, especially OCR and SQL.js/WASM | Browser network audit |
| Secure redaction | Local code only draws rectangles | Engineering implementation or keep Blackout warning |
| File MD5 matches standard binary MD5 | Needs fixture validation | Add known-fixture test |

## Rejected Claims

| Claim | Reason |
|---|---|
| "Secure redaction" for `/redact-pdf/` | False for current implementation |
| "Permanent text removal" for `/redact-pdf/` | False for current implementation |
| "Guaranteed PDF compression" | Not supported by code |
| "Lossless image compression" for `/pdf-compress/` | Image downsampling/compression not evidenced |
| "Base64 encryption" | Base64 is encoding, not encryption |
| "JWT verification" | Decoder does not verify signatures |
| "Cron scheduler" | Parser explains expressions only |

## Day 12 Handoff

Phase 04 should treat this file as the claim gate. Any new marketing, SEO, FAQ, or schema claim must be added here before publishing.
