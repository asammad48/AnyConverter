---
name: anyconverter-technical-seo
description: "Technical SEO rules enforced on AnyConverter.io — static HTML + vanilla JS + Cloudflare Pages. Use when auditing meta tags, canonical URLs, robots.txt, sitemap.xml, HTTP headers, structured data, Core Web Vitals, crawlability, or indexing issues on any /tool-name/ or /es/tool-name/ or /da/tool-name/ page. Trigger phrases: technical SEO, canonical, robots, sitemap, schema, JSON-LD, Core Web Vitals, LCP, CLS, INP, crawl, index, 404, redirect."
metadata:
  version: 1.0.0
  stack: "static-html+vanilla-js+cloudflare-pages"
---

# AnyConverter — Technical SEO

Scope: enforce `CLAUDE.md` SEO mandates across every `/tool-name/index.html`,
`/es/tool-name/index.html`, `/da/tool-name/index.html`, category hub, and root
page. Related skills: `seo-audit` (framework), `schema` (structured data patterns),
`seo-sitemap` (sitemap discipline), `anyconverter-multilingual-seo` (hreflang).

## 1. Non-negotiable per-page requirements

Every HTML file must contain, in order of priority:

1. `<html lang="en|es|da">` matching the file's locale directory.
2. Unique `<title>` — format `[Tool Name] Online Free | AnyConverter` (EN)
   or the localized equivalent. ≤60 visible characters.
3. Unique `<meta name="description">` — 140–160 characters, primary keyword
   near the start, no duplicate across tools.
4. `<link rel="canonical" href="https://anyconverter.io/{locale-prefix}{tool-slug}/">`
   — absolute URL, self-referencing, trailing slash matches production.
5. Reciprocal hreflang set (EN + ES + DA + `x-default`) **only for pages that
   actually exist**; see `anyconverter-multilingual-seo`.
6. Open Graph: `og:title`, `og:description`, `og:url`, `og:type` (`website` for
   tool pages, `WebApplication` schema still required).
7. Twitter card (`summary_large_image`) where applicable.
8. Schema.org `WebApplication` JSON-LD with `applicationCategory`,
   `offers.price=0`, `operatingSystem="Any"`, and `inLanguage` matching the
   `<html lang>`.
9. Exactly one `<h1>` containing the primary keyword.
10. `<meta name="robots" content="index, follow">` (never `noindex` unless a
    page is deliberately excluded and also removed from the sitemap).
11. Preconnect to Google Fonts (`https://fonts.googleapis.com` and
    `https://fonts.gstatic.com crossorigin`) before any font `<link>`.
12. Favicon + `theme-color` consistent across locales.

Reject the audit as `FAIL` if any of these are missing.

## 2. Canonical & redirect rules

- Host canonical: `https://anyconverter.io` (apex, HTTPS). Any non-canonical
  variant (`www.`, `http://`, trailing-slash mismatch, uppercased path) must
  301 to the canonical form via Cloudflare Pages redirects, not JS.
- Canonical never points cross-locale. `/es/tool/` canonicals to `/es/tool/`,
  never to `/tool/`.
- Canonical appears in the page's own hreflang set — if not, Google ignores
  the entire hreflang cluster.
- No canonical to a URL that 404s, 301s, or is `noindex`ed.
- One trailing-slash convention site-wide. Mixed `/tool` and `/tool/` triggers
  duplicate-content loss.

## 3. Robots.txt

- Must reference the sitemap: `Sitemap: https://anyconverter.io/sitemap.xml`.
- Allow all tool directories. The only `Disallow:` entries permitted are
  utility routes (admin, test fixtures, draft previews). Never block
  `/assets/css/` or `/assets/js/` — Google needs them to render.
- Ad bots: respect Google AdSense documentation; do not add aggressive
  `Disallow: /` for any user-agent that would starve indexing.

## 4. Sitemap.xml

- Must be generated from a single source of truth (same manifest that
  generates tool pages). No hand-maintained duplicates.
- Only indexable, canonical, 200-status URLs. No parameterized duplicates.
- Each tool entry ships `<xhtml:link>` alternates for every locale that
  exists for that tool, plus `x-default`.
- `lastmod` reflects actual file modification, not build time.
- Split by content type if >50MB or >50K URLs; AnyConverter is nowhere near
  that today but build the generator to split cleanly.
- See `seo-sitemap` and `anyconverter-multilingual-seo` for details.

## 5. Structured data

- Every tool page: `WebApplication` JSON-LD with `name`, `url`,
  `applicationCategory` (`UtilityApplication`, `DeveloperApplication`,
  `FinanceApplication`, `MultimediaApplication`, etc.), `operatingSystem`,
  `inLanguage`, `offers.price=0`, `offers.priceCurrency="USD"`.
- Category hubs: `CollectionPage` with `ItemList` of tool items.
- FAQ pages / FAQ sections: `FAQPage` with real `Question`/`Answer` nodes
  matching visible text verbatim. **Never** ship FAQ schema whose answers
  do not appear visibly on the page — Google treats this as a quality
  violation (unhelpful content).
- See `schema/references/schema-examples.md`.

Reminder from `seo-audit`: `web_fetch` and `curl` strip `<script>` tags, so
JSON-LD will not appear in their output. Validate via the Rich Results Test
or by reading the file with the `Read` tool directly — never claim "no schema
found" based only on a `curl` of the page.

## 6. Core Web Vitals (per CLAUDE.md — non-negotiable)

Targets measured on the Cloudflare Pages production host:

- LCP < 2.5s on a 4G Moto-G class profile.
- INP < 200ms.
- CLS < 0.1.

Rules enforced in code review:

- Inline critical above-the-fold CSS in `<head>`. No render-blocking
  external stylesheets for first paint.
- Every `<script>` has `defer`; placed before `</body>`.
- Google Fonts: `preconnect` + `font-display: swap`.
- Every `<img>`: explicit `width`, `height`, `loading="lazy"` unless the
  image is the LCP element (which should be optimized separately).
- No `<img>` raster assets in the UI chrome — SVG only (per CLAUDE.md).
- CDN libraries (pdf-lib, highlight.js, PapaParse, SQL.js) load **only** on
  pages that use them. Never put them in `shared.js`.
- No synchronous `document.write` or large blocking JS in the critical path.

## 7. Cloudflare Pages specifics

- Headers configured via `_headers` at project root (if present). Enforce:
  - `Content-Security-Policy` compatible with AdSense + CDN libs.
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
  - `X-Content-Type-Options: nosniff`.
  - `Referrer-Policy: strict-origin-when-cross-origin`.
  - `Permissions-Policy` restricting unused sensors.
- Redirects via `_redirects` — one source of truth, not duplicated in JS.
- Cache headers: static assets `max-age=31536000, immutable`; HTML
  `no-cache` or short TTL to allow fast content fixes.

## 8. Mandatory audit checklist (per changed page)

Run this before approving any PR that touches an HTML file:

- [ ] `<html lang>` matches directory locale.
- [ ] Title unique, ≤60 chars visible, matches `[Tool] Online Free | AnyConverter` pattern (or localized).
- [ ] Description 140–160 chars, unique, keyword early.
- [ ] Canonical absolute + self-referencing + trailing-slash consistent.
- [ ] Hreflang set complete OR entirely absent (never partial).
- [ ] Exactly one `<h1>` containing primary keyword.
- [ ] `robots` meta = `index, follow`.
- [ ] `WebApplication` JSON-LD present + valid.
- [ ] FAQ JSON-LD content ↔ visible text parity (if FAQ schema used).
- [ ] All `<img>` have `width`+`height`+`loading`.
- [ ] All `<script>` have `defer`.
- [ ] Only tool-specific CDN libs loaded on this page.
- [ ] No `console.log` in the shipped JS.
- [ ] No `!important` except utility overrides.
- [ ] Preconnect to fonts.

Pair with `anyconverter-pre-deploy-seo-verification` for the automated gate.

## 9. What to do when an issue is found

1. Record file path + line number in `docs/growth/03-LIVE-UX-RELEASE-GATE.md`.
2. Classify: `FAIL` (indexability), `WARN` (performance / trust), `INFO`
   (cosmetic). Only `FAIL` blocks merge.
3. Fix in a scoped PR; never bundle unrelated cleanups.
4. Re-run the checklist on both the tool page and its EN/ES/DA siblings
   even if only one locale changed — shared includes can propagate drift.
5. Preserve existing tool algorithms, formulas, outputs, URLs, and schema
   semantics while fixing SEO metadata.

## 10. Do not

- Do not fabricate CTR, impression, or ranking numbers from `curl` or memory.
  All analytics claims must come from GSC / GA4 with explicit date ranges.
- Do not add `noindex` as a "fix" for an indexing problem. Fix the root cause.
- Do not change canonical, redirect, or hreflang structure without updating
  `sitemap.xml` and `_redirects` in the same commit.
- Do not deploy or push to production. Technical SEO changes go through PR
  review + the pre-deploy verification gate.
