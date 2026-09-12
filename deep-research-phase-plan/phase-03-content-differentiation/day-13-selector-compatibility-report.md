# Phase 03 Day 13 - Selector Compatibility Report

Generated: 2026-09-10

## Objective

Check where Phase 04 copy can be inserted without breaking existing page structure or scripts.

## Target Selectors

| Selector/area | Observed role | Compatibility |
|---|---|---|
| `<title>` | Search/browser title | Safe for copy edits |
| `<meta name="description">` | Search snippet candidate | Safe for copy edits |
| `<script type="application/ld+json">` | Structured data | Edit only after claim review; keep valid JSON |
| `.breadcrumb` | Breadcrumb trail | Do not change destinations until Phase 02 map is restored |
| `.hero-desc` | Primary page explanation | Safe for concise tool-specific copy |
| `.how-to-use` | Existing workflow steps | Safe for tool-specific examples if selector retained |
| `.features` / `.features-list` | Feature bullets | Safe for claim-safe feature edits |
| `.seo-content` | Current boilerplate-heavy SEO content | Primary replacement area for Phase 04 |
| `.faq-item` | FAQ sections | Safe for specific FAQ edits; trust warnings should not live only here |
| Tool form IDs | JavaScript hooks | Do not rename IDs without script changes |
| `<script src=...>` includes | Library loading | Do not remove or reorder without functional test |

## Page-Level Compatibility Notes

| URL | Primary Phase 04 edit areas | Preserve |
|---|---|---|
| `/pdf-merge/` | title, meta, hero, `.seo-content`, FAQ | `pdf-*`/`merge-*` IDs, `pdf-lib` script |
| `/pdf-split/` | title, meta, hero, `.seo-content`, FAQ | `split-*` IDs, mode buttons, ZIP toggle |
| `/pdf-compress/` | title, meta, hero, `.seo-content`, FAQ | compression level tabs and size bars |
| `/organize-pdf/` | title, meta, hero, `.seo-content`, FAQ | `op-*` IDs and page sequence input |
| `/jpg-to-pdf/` | title, meta, hero, `.seo-content`, FAQ | `j2p-*` IDs and fit/margin controls |
| `/pdf-to-jpg/` | title, meta, hero, `.seo-content`, FAQ | `p2j-*` IDs, scale/format/quality controls |
| `/ocr-pdf/` | title, meta, hero, `.seo-content`, FAQ | PDF.js/Tesseract scripts and `ocr-*` IDs |
| `/redact-pdf/` | keep current safer title/meta; refine SEO/FAQ | `rd-*` IDs and warnings |
| `/pdf-security/` | title, meta, hero, `.seo-content`, FAQ | password/permission controls |
| `/json-formatter/` | title, meta, hero, `.seo-content`, FAQ | JSON input/output IDs and buttons |
| `/csv-to-sql/` | title, meta, hero, `.seo-content`, FAQ | PapaParse/highlight scripts and SQL option IDs |
| `/csv-query/` | title, meta, hero, `.seo-content` H2 mismatch | SQL.js/PapaParse scripts, `data` table expectation in copy |
| `/jwt-decoder/` | title, meta, hero, `.seo-content`, FAQ | decode input/output IDs |
| `/regex-tester/` | title, meta, hero, `.seo-content`, FAQ | `regex-*`, `log-*`, export buttons |
| `/hash-generator/` | title, meta, hero, `.seo-content`, FAQ | hash option IDs and Web Crypto behavior |
| `/base64-encoder/` | title, meta, hero, `.seo-content`, FAQ | Base64 text/file controls |
| `/url-encoder/` | title, meta, hero, `.seo-content`, FAQ | mode toggles and plus-space/live toggles |
| `/cron-expression-parser/` | title, meta, hero, `.seo-content`, FAQ | five field display IDs and preset buttons |

## Static Validation Findings

- Priority pages use stable `index.html` files with tool-specific scripts.
- `.seo-content` exists on the inspected priority pages and is the lowest-risk target for Phase 04 content differentiation.
- Hero copy is short enough to edit without changing form controls.
- Tool JavaScript depends heavily on fixed IDs. Copy work should not rename controls, inputs, toggles, or result containers.
- Structured data is present on several pages. JSON-LD edits must be validated as JSON after copy changes.

## Browser Validation Status

Completed in Day 01:

- `/pdf-merge/` desktop and 360px local smoke check: no console errors/warnings and no horizontal overflow.
- `/csv-query/` desktop and 360px local smoke check: no console errors/warnings and no horizontal overflow.

Pending:

- Full desktop/mobile browser walkthrough for every Phase 03 URL.
- Screenshot artifact capture. The previous screenshot command failed with a selector parsing error, so screenshot capture should be retried in Phase 04 QA.

## Acceptance Rules For Phase 04

- After editing a page, test the page at desktop and 360px width.
- Confirm no horizontal overflow.
- Confirm no console errors.
- Confirm each edited JSON-LD script parses.
- Confirm tool controls still initialize.
- Run `git diff --check`.

## Day 13 Handoff

Phase 04 can safely focus on copy regions, especially `.seo-content`, while preserving tool IDs and library scripts. Full browser screenshots remain a QA blocker before release.
