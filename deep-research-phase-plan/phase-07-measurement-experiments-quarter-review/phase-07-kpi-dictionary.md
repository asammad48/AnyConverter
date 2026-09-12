# Phase 07 KPI Dictionary

Version: 2026-09-12
Owner: pending - search/analytics owner needed
Scope: AnyConverter organic search, product usage, field performance, authority, and locale signals.

## Source Rules

- Do not mix incompatible windows. GSC, analytics, CrUX, crawl, and outreach logs each keep their own source and date range.
- Do not treat unavailable data as zero.
- Use the same branded-query filter every week: queries matching `anyconverter`, `any converter`, `any convertor`, or close obvious brand variants are branded.
- Current GSC, analytics, field CWV, referring-domain, and outreach values require fresh exports. The local repository can only prove local files, sitemap, canonical tags, and synthetic browser behavior.
- Historical exports in `reports/gsc-2026-08-20/` are dated historical artifacts, not current values.

## KPI Definitions

| KPI ID | KPI | Formula | Authoritative source | Required dimensions | Window | Unavailable-data behavior |
|---|---|---|---|---|---|---|
| KPI-01 | Intended canonical pages | Count of local HTML pages that self-canonical, are indexable locally, and are intended SEO URLs | Local crawl or `tools/phase07-local-measurement-snapshot.js` | URL, locale, cluster | Snapshot date | `pending` if crawl unavailable |
| KPI-02 | Indexed canonical pages | Count of intended canonical URLs reported indexed | GSC Page Indexing export | URL, indexing state | Weekly Monday export | `unknown` without GSC |
| KPI-03 | Indexed/submitted ratio | Indexed canonical pages / submitted canonical URLs | GSC Page Indexing plus sitemap export | URL, sitemap status | Weekly | `unknown` without GSC |
| KPI-04 | Crawled, currently not indexed | Count of intended URLs in that GSC state | GSC Page Indexing export | URL, state | Weekly | `unknown` without GSC |
| KPI-05 | Discovered, currently not indexed | Count of intended URLs in that GSC state | GSC Page Indexing export | URL, state | Weekly | `unknown` without GSC |
| KPI-06 | Duplicate without selected canonical | Count of intended URLs in that GSC state | GSC Page Indexing export | URL, state | Weekly | `unknown` without GSC |
| KPI-07 | Soft 404s | Count of intended URLs in soft 404 state | GSC Page Indexing export and crawl | URL, state | Weekly | `unknown` without GSC/crawl |
| KPI-08 | Non-branded impressions | Sum impressions for non-branded queries | GSC Performance Search results | Query, page, country, device, language/page prefix | 28 days and week-over-week | `unknown` without GSC |
| KPI-09 | Non-branded clicks | Sum clicks for non-branded queries | GSC Performance Search results | Query, page, country, device | 28 days and week-over-week | `unknown` without GSC |
| KPI-10 | Unique queries with impressions | Count unique queries with impressions greater than 0 | GSC query export | Query, branded flag | 28 days | `unknown` without GSC |
| KPI-11 | Queries in positions 1-10 | Count unique queries with average position 1.00-10.00 | GSC query export | Query, page optional | 28 days | `unknown` without GSC |
| KPI-12 | Queries in positions 11-20 | Count unique queries with average position 10.01-20.00 | GSC query export | Query, page optional | 28 days | `unknown` without GSC |
| KPI-13 | Median CTR by position band | Median CTR for rows grouped by position bands 1-3, 4-10, 11-20, 21+ | GSC query or page export | Query/page, position band | 28 days | `unknown` without GSC |
| KPI-14 | Organic tool starts | Count of privacy-safe `conversion_started` events from organic sessions | Analytics provider using Phase 04 dictionary | Tool, category, language, device, landing page | Weekly and 28 days | `unknown` without analytics |
| KPI-15 | Tool completion rate | `conversion_success` / `conversion_started` | Analytics provider | Tool, category, language, device | Weekly and 28 days | `unknown`; never assume 100% |
| KPI-16 | Tool error rate | `conversion_error` / `conversion_started` | Analytics provider | Tool, sanitized error class | Weekly and 28 days | `unknown`; errors require sanitized classes |
| KPI-17 | Organic to download/copy rate | (`download_started` + `copy_result`) / organic sessions or starts, consistently chosen | Analytics provider | Tool, output action, channel | Weekly and 28 days | `unknown` without analytics |
| KPI-18 | Good CWV URL percentage | Good URLs / URLs with field data | GSC CWV report or CrUX | URL group, device | 28-day field window | `unknown` without field data |
| KPI-19 | LCP p75 | 75th percentile LCP | CrUX API, PageSpeed Insights field data, or GSC CWV | URL/origin, device, collection period | CrUX collection period | `unknown` without field data |
| KPI-20 | INP p75 | 75th percentile INP | CrUX API, PageSpeed Insights field data, or GSC CWV | URL/origin, device, collection period | CrUX collection period | `unknown` without field data |
| KPI-21 | CLS p75 | 75th percentile CLS | CrUX API, PageSpeed Insights field data, or GSC CWV | URL/origin, device, collection period | CrUX collection period | `unknown` without field data |
| KPI-22 | Referring domains | Count of unique legitimate referring domains | Link index or verified referral/export | Domain, target URL, link type | Monthly | `unknown` without link export |
| KPI-23 | Editorial links earned | Count of manually qualified editorial links | Outreach/contact log plus link verification | Prospect, source URL, target URL | Monthly | `unknown`; outreach not sent means `pending`, not zero unless log proves none |
| KPI-24 | Spanish/non-English impressions | Sum impressions for `/es/`, `/da/`, and other non-English URLs | GSC Pages/Countries/Queries | Locale prefix, country, query, page | 28 days | `unknown` without GSC |
| KPI-25 | Returning users | Returning users or returning sessions, depending on analytics definition | Analytics provider | Channel, landing page, device | Weekly and 28 days | `unknown` without analytics |
| KPI-26 | Branded search impressions | Sum impressions for branded queries | GSC query export with branded filter | Query, country, device | 28 days | `unknown` without GSC |

## Official Measurement Notes

- Search Console performance data can be aggregated by property or by page, and those totals differ by design. Keep exported dimension totals separate.
- Search Console exports may omit low-volume or sensitive queries and store top rows rather than all rows.
- PageSpeed Insights and CrUX field data are historical real-user datasets; lab Lighthouse data is a simulated diagnostic and must not be reported as field CWV.
- Core Web Vitals thresholds used here: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1.

References:

- https://support.google.com/webmasters/answer/17011364
- https://support.google.com/webmasters/answer/96568
- https://developers.google.com/speed/docs/insights/v5/about
- https://developer.chrome.com/docs/crux/api/
- https://developers.google.com/search/docs/appearance/core-web-vitals
