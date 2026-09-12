# Phase 01: Foundation Baseline

Timeline from report: Week 1, starting 2026-09-07

## Objective

Replace guesswork with verified data. This phase answers whether Google can crawl, index, and understand the intended URLs, and whether any P0 product/security issue blocks SEO trust.

## Source Basis

Drawn from these report sections:

- Executive summary
- Technical SEO, performance and authority diagnosis
- Prioritised backlog and weekly release system
- Search Console checklist
- Twelve-week roadmap, experiments and KPIs

## Required Work

1. Connect or verify the Google Search Console domain property.
2. Submit and validate `https://anyconverter.io/sitemap.xml`.
3. Verify `https://anyconverter.io/robots.txt`.
4. Inspect at least 10 representative URLs in GSC.
5. Validate canonical tags on representative indexable HTML pages.
6. Validate all hostname variants redirect to one canonical hostname in one hop:
   - `http://anyconverter.io`
   - `http://www.anyconverter.io`
   - `https://www.anyconverter.io`
   - `https://anyconverter.io`
7. Security-test PDF Redact before promoting it as safe redaction.
8. Build or run an automated broken-link crawl.
9. Record the Week 1 SEO baseline.

## Representative URLs To Inspect

Use a mixed set from the main clusters:

- Homepage
- PDF Merge
- PDF Compress
- PDF Redact
- Image Converter
- JSON Formatter
- Word Counter
- Typing Speed Test
- World Clock
- Spanish homepage or one Spanish tool page

## PDF Redact Security Test

The report marks this as P0 because visually covering content with black rectangles may not securely remove the underlying PDF content.

Test steps:

1. Create a PDF with a known unique sentence.
2. Redact that sentence.
3. Save/export the result.
4. Try selecting and copying the redacted text.
5. Extract text programmatically.
6. Inspect PDF objects.
7. Try removing or altering the overlay.
8. Search the saved PDF for the original sentence.

If the original data survives, either implement true removal/rasterization or rename the feature to `Blackout PDF` with an explicit warning.

## Checks

- `robots.txt` returns 200 and allows intended crawling.
- `robots.txt` references the sitemap.
- Sitemap returns 200, parses successfully, and contains only intended canonical URLs.
- Sitemap excludes redirects, 404s, noindex pages, and duplicate parameter URLs.
- Canonicals are self-referential for unique pages.
- Language versions use self-canonicals, not canonical links back to English.
- GSC shows whether pages are indexed, crawled-not-indexed, discovered-not-indexed, duplicate, or soft 404.
- No accidental `noindex` exists on priority pages.
- Redact PDF behavior matches its security claim.
- Baseline records organic clicks, impressions, CTR, average position, indexed URL count, and priority query/page data.

## Deliverables

- GSC domain property verified.
- Sitemap submitted and validated.
- Week 1 baseline spreadsheet or markdown summary.
- Redact PDF security result.
- Broken-link crawl result.
- List of technical blockers ranked P0/P1/P2.

## Exit Criteria

Move to Phase 02 only when:

- GSC is available or a clear access blocker is documented.
- Sitemap, robots, canonical, and redirect status are known.
- Redact PDF is either confirmed safe or queued as a P0 product fix.
- The team has a baseline to compare future releases against.
