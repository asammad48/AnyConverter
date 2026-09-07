# Phase 05: International SEO

Timeline from report: Week 5, then Weeks 9-11 pilots

## Objective

Fix existing international quality before scaling. The report warns not to create six languages across all tools immediately.

## Source Basis

Drawn from these report sections:

- International SEO
- Multilingual keyword strategy
- Which languages to prioritise
- Prioritised backlog
- Twelve-week roadmap

## Language Priority

1. Spanish: improve existing `/es/` quality and parity where justified.
2. German and French: launch small pilots with 10-15 proven tools.
3. Portuguese: prioritize Brazilian phrasing unless data says otherwise.
4. Arabic: only after RTL layout and native copy are ready.
5. Urdu: validate query demand before scaling.

## Required Work

1. Audit current Spanish pages.
2. Compare English tool count and Spanish coverage.
3. Fix hreflang and canonical behavior.
4. Use native search intent, not dictionary translation.
5. Localize examples, date/decimal conventions, and UI labels.
6. Verify RTL support before Arabic or Urdu launches.
7. Choose 10-15 tools per language from Search Console evidence.

## Hreflang Planning Pattern

Use self-canonical localized pages and reciprocal alternates:

```html
<link rel="alternate" hreflang="en" href="https://anyconverter.io/json-formatter/">
<link rel="alternate" hreflang="es" href="https://anyconverter.io/es/json-formatter/">
<link rel="alternate" hreflang="fr" href="https://anyconverter.io/fr/json-formatter/">
<link rel="alternate" hreflang="de" href="https://anyconverter.io/de/json-formatter/">
<link rel="alternate" hreflang="pt" href="https://anyconverter.io/pt/json-formatter/">
<link rel="alternate" hreflang="ar" href="https://anyconverter.io/ar/json-formatter/">
<link rel="alternate" hreflang="ur" href="https://anyconverter.io/ur/json-formatter/">
<link rel="alternate" hreflang="x-default" href="https://anyconverter.io/json-formatter/">
```

## First Tools To Consider Per Language

- PDF Merge
- PDF Compress
- PDF Split
- JPG to PDF
- PDF to JPG
- Image Converter
- JSON Formatter
- Word Counter
- Age Calculator
- Password Generator
- QR Generator
- Keyboard Tester
- Dead Pixel Checker

## Checks

- Localized pages are not canonicalized back to English.
- Hreflang alternates are reciprocal.
- Translation includes UI, examples, headings, and internal anchors.
- Arabic and Urdu layouts support RTL properly.
- Pages use native query phrasing where known.
- Language rollout is tied to GSC impressions/countries.
- No mass-generated shallow international directory is created.

## Deliverables

- Spanish quality audit.
- Hreflang/canonical validation report.
- First 10-15 tool list for each pilot language.
- RTL readiness checklist.
- International rollout decision log based on GSC data.

## Exit Criteria

Move to Phase 06 when:

- Existing Spanish quality issues are understood or fixed.
- Hreflang/canonical implementation is safe.
- International expansion is evidence-driven and limited.
