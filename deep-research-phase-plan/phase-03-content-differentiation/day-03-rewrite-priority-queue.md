# Phase 03 Day 03 - Evidence-Ranked Rewrite Queue

Generated: 2026-09-10

## Objective

Rank up to 10 PDF pages and up to 10 Developer/Data pages for Phase 04 rewrites, using local evidence instead of unavailable GSC or analytics data.

## Ranking Method

Priority score uses the following local factors:

- Boilerplate severity from Day 01 repeated copy.
- Trust sensitivity from safety/privacy/security implications.
- Feature mismatch between page copy and local tool behavior.
- Workflow centrality from visible related-tool links and likely task adjacency.
- Implementation specificity available from Day 02.

GSC clicks, impressions, ranking losses, conversions, and field CWV were not used because they remain unavailable.

## PDF Queue

| Rank | URL | Priority | Evidence | Rewrite direction |
|---:|---|---|---|---|
| 1 | `/redact-pdf/` | P0 | Trust-sensitive; local code only draws black rectangles; current safer copy exists but SEO section still needs precise framing | Keep "Blackout PDF"; lead with non-sensitive visual cover use cases and explicit non-redaction warning |
| 2 | `/pdf-security/` | P0 | Password/permission claims can be misunderstood; code depends on PDF viewer enforcement | Explain owner/user password and permissions plainly; avoid compliance guarantees |
| 3 | `/ocr-pdf/` | P1 | OCR accuracy and network/library behavior need careful language | Explain page rendering plus OCR, language selection, imperfect recognition, slow large files |
| 4 | `/pdf-compress/` | P1 | Common SEO page; code may not reduce size | Replace generic "compress" promises with measured before/after and "already optimized" behavior |
| 5 | `/organize-pdf/` | P1 | Useful distinctive behavior: duplicate, omit, reorder pages | Write around page sequence workflows and browser memory constraints |
| 6 | `/pdf-split/` | P1 | High utility; specific range behavior available | Explain range syntax, per-page/every-N/ZIP options |
| 7 | `/pdf-merge/` | P1 | High utility; repeated boilerplate; strong local feature set | Explain order control, alphabetical sort, blank separator pages |
| 8 | `/pdf-to-jpg/` | P2 | Depends on PDF.js rendering and per-page image export | Explain scale, JPEG/PNG, quality, preview, sequential downloads |
| 9 | `/jpg-to-pdf/` | P2 | Code supports JPEG/PNG only | Narrow copy from generic image promise to JPEG/PNG layout controls |
| 10 | `/optimize-pdf/` | P2 | Adjacent to compress; risk of duplicate positioning | Position around object streams and optional metadata clearing, not compression ratios |

## Developer/Data Queue

| Rank | URL | Priority | Evidence | Rewrite direction |
|---:|---|---|---|---|
| 1 | `/jwt-decoder/` | P0 | Security-sensitive; decoder does not verify signatures | Lead with "inspect, do not trust"; explain header/payload/exp fields |
| 2 | `/csv-query/` | P1 | H1 says CSV Query but SEO H2 says "Csv to sql"; strong unique SQL.js behavior | Correct positioning around querying CSV in an in-memory `data` table |
| 3 | `/csv-to-sql/` | P1 | Detailed implementation supports strong differentiation | Explain dialect quoting, type sampling, batch inserts, editable types |
| 4 | `/regex-tester/` | P1 | Flavor-specific; risk of overclaiming | Say JavaScript regex tester, flags, groups, match caps, export |
| 5 | `/json-formatter/` | P1 | High-utility page with many specific controls | Explain parse/format/minify/sort/tree/YAML/CSV limits |
| 6 | `/hash-generator/` | P1 | Security-sensitive; MD5/file behavior needs validation | Focus on Web Crypto SHA hashes; mark MD5 file claim pending |
| 7 | `/cron-expression-parser/` | P2 | Easy to overclaim; code supports five fields only | Say 5-field cron parser with cronstrue plain English |
| 8 | `/base64-encoder/` | P2 | Specific text/file and URL-safe options | Explain encode/decode, UTF-8, file Data URL behavior |
| 9 | `/url-encoder/` | P2 | Specific component/full/decode modes | Explain exact browser functions and malformed decode errors |
| 10 | `/json-formatter/` related snippets | P3 | Can supply reusable component examples for developer pages | Use as component model; avoid duplicating page brief twice |

## Immediate Rewrite Candidates

If Phase 04 has limited capacity, start with:

1. `/redact-pdf/`
2. `/pdf-security/`
3. `/jwt-decoder/`
4. `/csv-query/`
5. `/pdf-compress/`

These combine trust risk, copy mismatch, and available local evidence.

## Day 03 Handoff

Use this queue to sequence Phase 04 work. Do not promote lower-priority pages ahead of P0/P1 pages unless external GSC/analytics data later changes the risk picture.
