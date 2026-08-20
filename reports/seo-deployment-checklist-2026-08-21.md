# SEO Deployment Checklist

Date: 2026-08-21

This checklist covers actions that require the hosting dashboard, Google Search Console, or outreach work outside the local codebase.

## Before Deployment

- Commit and deploy the current local SEO changes.
- Confirm the deployed site includes:
  - `og:image` and Twitter card metadata.
  - FAQPage schema on tool pages with FAQs.
  - Updated `_headers` with HSTS.
  - Updated `_redirects` aliases.
  - Updated sitemap `lastmod` values for changed priority pages.

## Cloudflare

- Turn on **Always Use HTTPS** in Cloudflare.
- Keep SSL/TLS mode enabled.
- After deployment, test:
  - `http://anyconverter.io/`
  - `http://anyconverter.io/csv-query/`
  - `http://anyconverter.io/es/morse-code-converter/`
- Expected result: each HTTP URL should return `301` to the matching HTTPS URL.

Note: Cloudflare Pages `_redirects` supports path redirects, but protocol-level HTTP-to-HTTPS is controlled by Cloudflare SSL/TLS settings.

## Google Search Console

- Submit sitemap: `https://anyconverter.io/sitemap.xml`
- Use URL Inspection and request indexing for:
  - `https://anyconverter.io/discount-calculator/`
  - `https://anyconverter.io/tip-calculator/`
  - `https://anyconverter.io/es/tip-calculator/`
  - `https://anyconverter.io/es/sticky-notes/`
  - `https://anyconverter.io/da/todo-list/`
  - `https://anyconverter.io/da/mortgage-calculator/`
  - `https://anyconverter.io/da/age-calculator/`
  - `https://anyconverter.io/da/countdown-timer/`
  - `https://anyconverter.io/da/coin-flip/`
  - `https://anyconverter.io/roman-numeral-converter/`
  - `https://anyconverter.io/habit-tracker/`
- Export example URLs from these reports:
  - Alternative page with proper canonical tag
  - Not found (404)
  - Discovered - currently not indexed
  - Crawled - currently not indexed
- Fix or redirect exact example URLs, then click **Validate Fix**.

## Backlink and Authority Work

- Submit AnyConverter to relevant tool directories.
- Publish launch/update posts for privacy-first browser tools.
- Create shareable examples for PDF, calculator, developer, and productivity tools.
- Pitch pages with the clearest differentiator: tools run locally in the browser with no upload required.
- Prioritize links to pages already getting impressions, especially calculator and Spanish/Danish productivity pages.

## Weekly Measurement

Track these Search Console metrics every week:

- Indexed pages.
- Not indexed pages by reason.
- Clicks.
- Impressions.
- CTR.
- Average position.
- Top queries for pages ranking between positions 10 and 40.
