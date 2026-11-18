---
name: anyconverter-multilingual-seo
description: "Multilingual SEO rules for AnyConverter.io — EN (default), ES, DA, with planned pt-BR / id / tr / vi / pl expansion gated by evidence. Use when touching hreflang, canonical, /es/ or /da/ trees, translation quality, native-content parity, locale URL structure, x-default, or language switcher. Trigger phrases: hreflang, multilingual SEO, internationalization, i18n, locale, translation QA, x-default, Spanish SEO, Danish SEO."
metadata:
  version: 1.0.0
  locales_current: ["en", "es", "da"]
  locales_planned_research: ["pt-BR", "id", "tr", "vi", "pl", "ar", "hi-IN", "th", "bn-BD"]
---

# AnyConverter — Multilingual SEO

Scope: enforce correct hreflang, canonical, and translation discipline across
the EN root, `/es/*`, `/da/*` trees, and any future locale (pilot only after
evidence per `docs/growth/COMBINED_GROWTH_MASTER_PLAN.md`, Section 5 and Phase 2).

Related skills: `seo-hreflang` (upstream deep reference), `seo-sitemap`,
`anyconverter-technical-seo`, `seo-audit`'s international-seo reference.

## 1. The three current locales

| Locale | Path convention | `<html lang>` | Status |
|---|---|---|---|
| English (default) | `/tool/index.html` | `en` | Primary |
| Spanish | `/es/tool/index.html` | `es` | Live; translation drift flagged in deep research |
| Danish | `/da/tool/index.html` | `da` | Live; translation drift flagged in deep research |

Known quality defects (deep-research 2026-11-18 snapshot): unaccented or
machine-like phrases such as `practicos`, `utiles`, `nar`, `daekker`, `vaelge`
have appeared on indexed ES/DA pages. These must be fixed before **any**
additional locale ships.

## 2. Hreflang — the five hard rules

1. **Self-referencing entry required on every page.** `/es/tool/` must list
   `hreflang="es"` pointing to itself, plus `en`, `da`, `x-default`.
2. **Reciprocal.** If A links to B with hreflang, B must link back to A. A
   one-way reference causes Google to drop the whole cluster.
3. **Only for pages that exist.** Never emit hreflang to a URL that 404s,
   301s to another locale, is canonical to a different URL, or is `noindex`.
4. **Canonical must appear in the hreflang set.** If a page canonicals to a
   URL not present in its own hreflang list, hreflang is silently ignored.
5. **Valid codes only.** `en`, `es`, `da`, `pt-BR`, `id` — ISO 639-1
   language + optional ISO 3166-1 Alpha-2 region. Never `en-UK` (use
   `en-GB`), never made-up composites.

`x-default` is mandatory and points to the EN version (or a neutral language
picker if ever introduced). Do not point `x-default` to `/es/` or `/da/`.

## 3. Canonical rules for multilingual pages

- Each locale page self-canonicals. `/da/pdf-merger/` → canonical
  `https://anyconverter.io/da/pdf-merger/`.
- Never cross-locale canonical. Pointing `/es/*` to `/* ` suppresses the ES
  locale entirely from the index.
- Trailing-slash + case consistency across canonical, hreflang, and sitemap.
- Protocol/host must match across all three signals. A mix of `www.` vs
  apex or `http` vs `https` breaks the cluster.

## 4. Sitemap-level hreflang

If using `<xhtml:link>` alternates in `sitemap.xml` (recommended for scale):

- Add `xmlns:xhtml="http://www.w3.org/1999/xhtml"` to `<urlset>`.
- Every `<url>` includes `<xhtml:link rel="alternate" hreflang=… href=…>`
  for **every** locale that exists for that tool, including itself and
  `x-default`.
- All URLs absolute (full protocol + domain).
- Do not also emit conflicting `<link rel="alternate" hreflang>` in HTML
  for the same pair. If both are present and they disagree, Google drops
  the pair.
- Split sitemaps by content type (tools vs blog vs hubs), not by locale.

## 5. Translation quality discipline

Google's 2025–2026 position: AI-translated content is not inherently spam,
but scaled low-value translations can trigger scaled-content abuse policy.
To stay safely on the right side of that line:

- **Translate the full visible content**, not just chrome. Title,
  description, every heading, every paragraph, every tooltip, every button
  label, FAQ questions + answers, breadcrumbs, related-tool blurbs, search
  placeholder, error messages.
- **Localize examples**: dates, currencies, number formatting
  (`1.234,56` for ES/DA vs `1,234.56` for EN), units, cultural references.
- **Numeric calculations must stay identical** across locales even when
  separators differ. The underlying formula does not change.
- **Never ship `/es/tool/` with EN body text.** This creates a duplicate
  the way Google sees it and risks "Duplicate, Google chose different
  canonical" in GSC.
- Native-speaker review required before publication of any new locale.
  Store review sign-off in `docs/growth/23-LOCALIZATION-PILOT-SPEC.md`.
- See `seo-hreflang/references/machine-translation-qa.md` and
  `seo-hreflang/references/content-parity.md` for detailed checks.

## 6. Locale URL structure

AnyConverter uses subdirectories: `/es/`, `/da/`. Keep this.

- Do not add `?lang=` parameters.
- Do not auto-redirect visitors by IP or `Accept-Language`. Googlebot
  crawls from US IPs with no `Accept-Language` header; aggressive
  geo-redirects can hide locales from indexing.
- Provide an explicit, visible language switcher that preserves the current
  tool path when switching (`/es/pdf-merger/` ↔ `/pdf-merger/` ↔
  `/da/pdf-merger/`).
- The root path `/` is the EN page. If there is ever ambiguity, serve
  content and canonical to EN.

## 7. Expansion research gate (new locale)

Before adding pt-BR / id / tr / vi / pl / ar / hi / th / bn or any other
locale, the plan (`COMBINED_GROWTH_MASTER_PLAN.md` §5, Phase 2) requires:

1. Native keyword map with volume/difficulty or explicit `UNKNOWN`.
2. 3–5 competitor teardown per tool cluster in that market.
3. Weighted market scoring (25% verified demand / 20% SERP gap /
   15% product fit / 15% repeat usage / 10% non-SEO distribution /
   10% commercial sustainability / 5% technical+legal risk).
4. Comparison against ES/DA improvement ROI. A valid outcome is
   **"no new locale yet"**.
5. Pilot limited to 10–20 tools, chosen for low jurisdiction-specific risk.
6. Native reviewer sign-off before publication.
7. `Gate 2` pass before sitemap submission or indexable rollout.

Translating hundreds of pages up-front without this gate is **explicitly
prohibited**.

## 8. Audit checklist (per locale tree)

For the locale being audited:

- [ ] `<html lang>` matches the directory everywhere.
- [ ] Every page self-canonicals within the locale.
- [ ] Every page's hreflang set is reciprocal + includes self + `x-default`.
- [ ] All hreflang targets return 200, are canonical, indexable.
- [ ] No cross-locale canonical anywhere.
- [ ] All visible UI translated — no fallback to EN in body copy.
- [ ] Numeric and currency formats correct for the locale.
- [ ] Language switcher preserves tool path and locale pair.
- [ ] Sitemap includes `<xhtml:link>` alternates covering every locale
      that exists for each tool.
- [ ] No partial hreflang (listing a locale whose page is missing).
- [ ] No duplicate titles/descriptions vs the EN equivalent (they must be
      translated, not copied).

## 9. Common failures to check for first

- `/es/tool/` canonical points to `/tool/` (kills ES indexing).
- Partial translation: UI chrome translated, body EN.
- `x-default` points to a locale instead of EN.
- Missing self entry in hreflang.
- Hreflang list contains a locale that does not actually have a page
  (dangling entries invalidate the cluster).
- Numeric separators broken a calculator (shipped `1,25` where the parser
  expected `1.25`).
- Language switcher resets to homepage instead of preserving the tool.

## 10. Do not

- Do not expand locales without the evidence gate.
- Do not "fix" bad ES/DA pages by redirecting them to EN — fix the content.
- Do not use `noindex` to hide a thin locale page; delete or finish it.
- Do not change hreflang on one page without updating every sibling.
