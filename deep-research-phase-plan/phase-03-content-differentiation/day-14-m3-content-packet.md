# Phase 03 Day 14 - M3 Content Differentiation Packet

Generated: 2026-09-10

## Objective

Deliver a prioritized, fact-checked Phase 3 packet for Phase 04 content implementation.

## Phase 3 Completion Summary

Completed artifacts:

- Day 01 boilerplate inventory, evidence log, and handoff.
- Day 02 accuracy fact sheet.
- Day 03 evidence-ranked rewrite queue.
- Day 04 reusable content component spec.
- Day 05 Merge PDF and Split PDF briefs.
- Day 06 Compress/Optimize PDF and Organize PDF briefs.
- Day 07 JPG/PDF conversion briefs.
- Day 08 OCR, Blackout PDF, and PDF Security briefs.
- Day 09 JSON and CSV briefs.
- Day 10 JWT, Regex, Base64, and URL briefs.
- Day 11 Hash and Cron briefs.
- Day 12 claim review log.
- Day 13 selector compatibility report.

## Highest Priority Phase 04 Pages

| Rank | URL | Why first |
|---:|---|---|
| 1 | `/redact-pdf/` | Trust-sensitive; must preserve Blackout/visual-only framing |
| 2 | `/pdf-security/` | Password/permission behavior can be overclaimed |
| 3 | `/jwt-decoder/` | Must state decoder does not verify signatures |
| 4 | `/csv-query/` | SEO H2 mismatch with CSV-to-SQL intent |
| 5 | `/pdf-compress/` | Must avoid guaranteed compression claims |
| 6 | `/ocr-pdf/` | OCR accuracy and network wording need qualifiers |
| 7 | `/csv-to-sql/` | Strong differentiation available from local code |
| 8 | `/regex-tester/` | Must specify JavaScript regex flavor |
| 9 | `/json-formatter/` | High-utility page with many specific controls |
| 10 | `/organize-pdf/` | Distinctive page-sequence behavior can replace boilerplate |

## Phase 04 Implementation Recipe

For each target page:

1. Read the matching Day 05-11 brief.
2. Check Day 12 before adding claims.
3. Preserve URLs, breadcrumbs, canonical tags, tool IDs, and script includes unless a later approved task changes them.
4. Replace generic `.seo-content` with:
   - one specific intro paragraph,
   - one practical example,
   - one how-it-works paragraph,
   - one limits/trust block,
   - specific related-tool links.
5. Update title/meta only when the new title/meta can stay within the verified facts.
6. Validate HTML/JSON-LD syntax and run desktop/mobile browser smoke tests.

## Acceptance Tests

Required before release:

- `git diff --check`
- HTML parser check for edited `index.html` files.
- JSON-LD parse check for edited pages.
- Local browser smoke test at desktop width.
- Local browser smoke test at 360px width.
- Console error check.
- No horizontal overflow.
- Manual check that tool controls still initialize and primary action buttons remain wired.

Trust-sensitive page checks:

- `/redact-pdf/`: Search rendered page for "secure redaction" and "permanent removal"; only warning/negative contexts are allowed.
- `/pdf-security/`: Confirm permission copy includes viewer-enforcement qualifier.
- `/jwt-decoder/`: Confirm signature verification warning is near the main workflow.
- `/base64-encoder/`: Confirm Base64 is not called encryption.
- `/hash-generator/`: Confirm MD5 is not recommended for security-sensitive checks.

## Open Blockers

| Blocker | Impact | Next step |
|---|---|---|
| Phase 02 CSV artifacts not present | Ownership, breadcrumb, and internal-link decisions cannot be final | Restore `page-cluster-inventory.csv`, `internal-link-map.csv`, `breadcrumb-map.csv`, `protected-url-register.csv`, and `blockers.csv` |
| GSC/analytics unavailable | Priority queue cannot use current search demand | Add authorized exports before final prioritization |
| Field CWV unavailable | Cannot claim live performance improvement | Add authorized CWV/PageSpeed/CrUX evidence |
| Google-selected canonical unavailable | Cannot confirm declared canonical is selected | Add GSC URL Inspection evidence |
| Native ES/DA review pending | Localized pages cannot be release-claimed | Assign native review |
| Full browser screenshots pending | Visual QA incomplete | Retry Playwright screenshots in Phase 04 QA |
| OCR network trace pending | Privacy wording must stay qualified | Capture network requests during OCR run |
| Hash fixture pending | File MD5 copy must stay cautious | Add known text/file hash fixtures |

## Final Phase 03 Recommendation

Proceed to Phase 04 with copy implementation, starting on the P0/P1 pages above. Keep edits scoped to content regions first, and defer URL moves, hub references, and claims requiring external data until the listed blockers are resolved.
