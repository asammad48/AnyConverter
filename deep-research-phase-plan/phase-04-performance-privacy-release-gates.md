# Phase 04: Performance, Privacy And Release Gates

Timeline from report: Weeks 4-5, then every release

## Objective

Prevent weekly releases from creating technical SEO, performance, or privacy regressions. The report says weekly releases are fine, but each release must be measurable and monitored.

## Source Basis

Drawn from these report sections:

- HTTPS and hosting
- Core Web Vitals and page speed
- Analytics events
- Your Friday-night release cadence
- Week-by-week outputs

## Required Work

1. Establish a Lighthouse/Core Web Vitals release budget.
2. Lazy-load or code-split heavy libraries.
3. Confirm PDF/OCR/image libraries are not loaded on unrelated pages.
4. Audit every third-party network request.
5. Tighten privacy wording for tools that inherently use networking.
6. Add release checks for SEO-critical files and page states.
7. Prefer Thursday or Friday daytime releases when monitoring is possible.

## Performance Budget

Use the report's thresholds:

| Metric | Good Target |
|---|---:|
| Largest Contentful Paint | <= 2.5 s |
| Interaction to Next Paint | < 200 ms |
| Cumulative Layout Shift | < 0.1 |

Priority URLs for measurement:

- Homepage
- PDF Merge
- PDF Compress
- Image Converter
- JSON Formatter
- Word Counter
- Typing Speed Test

## Privacy Review

The report recommends making privacy claims precise.

Safer direction:

```text
Files remain on your device.
```

Use caution with absolute claims like:

```text
Your data never leaves your device.
```

This matters for tools such as IP Address Lookup and Internet Speed Test, where networking is inherent.

## Checks

Before release:

- Build succeeds.
- Homepage returns 200.
- Every intended page returns 200.
- No accidental `noindex`.
- `robots.txt` is reachable.
- `sitemap.xml` is reachable and parseable.
- Canonical tags are present and valid.
- Hreflang is reciprocal where language pages exist.
- No broken internal links.
- No critical JavaScript console errors.
- Core tool task completes.
- Mobile viewport passes.
- Lighthouse budget is not regressed.
- Redirect rules are unchanged unless intentionally updated.

## Analytics Events

Track privacy-preserving product events:

- `tool_open`
- `input_added`
- `conversion_started`
- `conversion_success`
- `conversion_error`
- `download_started`
- `copy_result`
- `related_tool_clicked`
- `language_changed`

Allowed event properties:

- `tool_name`
- `tool_category`
- `page_language`
- `device_class`

Do not send file names, file contents, pasted text, IP addresses, passwords, JWT contents, or PDF contents.

## Deliverables

- Release gate checklist in CI or release docs.
- Lighthouse/CWV baseline for priority pages.
- Heavy-library loading audit.
- Third-party request inventory.
- Privacy wording review by tool.

## Exit Criteria

Move to Phase 05 when:

- Performance and SEO release gates are defined.
- Privacy claims match actual tool behavior.
- Heavy libraries are not globally loaded without need.
- Weekly releases can be checked without relying on manual memory.
