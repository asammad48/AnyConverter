---
name: anyconverter-internal-linking
description: "Internal linking strategy for AnyConverter.io — connect 128 tools, EN/ES/DA, category hubs (calculators, developer-tools, pdf-tools, productivity-tools, numerology-astrology, fun-relationships, date-time, text-tools, browser-tools) via related-tool blocks, breadcrumbs, hub pages, and in-content links without breaking the related-tool mapping or canonical/hreflang integrity. Trigger phrases: internal linking, related tools, hub pages, breadcrumbs, anchor text, link equity, orphan page, site architecture."
metadata:
  version: 1.0.0
---

# AnyConverter — Internal Linking

Scope: enforce internal-link discipline across tool pages, category hubs,
locale trees, and blog/press content. Related skills: `site-architecture`,
`seo-audit`, `anyconverter-multilingual-seo`. Primary data source:
`RELATED_TOOLS_COMPLETE_MAPPING.json` and `TOOL-INVENTORY.json`.

## 1. Architecture (current, as inventoried)

```
anyconverter.io/
├── /                           ← EN homepage (hub of hubs)
├── /{tool}/                    ← EN tool page
├── /es/                        ← ES homepage
├── /es/{tool}/                 ← ES tool page
├── /da/                        ← DA homepage
├── /da/{tool}/                 ← DA tool page
└── /{category}/                ← category hubs:
    calculators, developer-tools, pdf-tools, productivity-tools,
    numerology-astrology, fun-relationships, date-time, text-tools,
    browser-tools
```

A tool page is reachable from:

1. Homepage (featured / search / favorites).
2. Its category hub (always).
3. Related-tool block on sibling tool pages.
4. Breadcrumbs from the hub.
5. In-body contextual links in blog / FAQ / press content.

Any tool reachable from fewer than 2 of those paths is treated as an
**orphan risk** and must be fixed.

## 2. Hard rules

- Every tool page must appear on exactly one category hub. No tool lives
  on two hubs (dilutes signal); if truly multi-category, pick the strongest
  and link from the others in-body.
- Category hubs link to every tool they own with descriptive anchor text —
  never generic "click here" or bare URLs.
- Related-tool blocks render **only** tools that exist in the current
  locale. Never link `/es/tool-A/` to `/tool-B/` just because the ES version
  is missing — either link the EN sibling with a clear locale label or omit.
- Breadcrumbs: `Home > Category > Tool` with schema.org `BreadcrumbList`
  JSON-LD matching the visible text exactly.
- Within-locale links first: `/es/A/` → `/es/B/`. Cross-locale links only
  via the language switcher.
- Trailing-slash + case consistency on every internal link.
- No `rel="nofollow"` on internal links; reserve `nofollow` for untrusted
  outbound.
- No `target="_blank"` on internal navigation.

## 3. Related-tool mapping maintenance

Source of truth: `RELATED_TOOLS_COMPLETE_MAPPING.json`. Rules:

- Edit the mapping, not individual HTML pages. Pages are generated /
  regenerated from the mapping.
- Each tool has 3–6 related tools chosen by **workflow adjacency**, not
  category membership alone. Example: JSON Formatter → JSON Compare →
  JSON→CSV (workflow), not JSON Formatter → Random Password Generator
  (same category but unrelated task).
- Reciprocal entries required where the workflow is bidirectional.
- Mapping is locale-aware: if the related tool is missing in ES, the ES
  related-block omits it rather than linking EN.

## 4. Anchor text

- Descriptive, keyword-aligned, concise (2–5 words).
- Match the target tool's primary H1 or title where natural.
- Vary the exact anchor form — do not use the same literal string every
  time (reads as over-optimization). Example variants for the same target:
  "PDF merger", "merge PDFs online", "combine PDF files".
- Localize anchors per locale tree. ES links should use ES anchors.
- Never keyword-stuff. Google's 2024–2026 guidance treats keyword-rich
  anchors in exchange-oriented widgets as link spam; the same principle
  applies to over-optimized internal anchors.

## 5. Hub-page requirements

Each category hub must:

- Have a unique `<h1>` naming the category + primary benefit.
- Describe the category with 100–250 words of genuinely useful original
  text — not just a list of links.
- Group tools into subsections where useful (e.g. PDF → Merge/Split/
  Compress/Convert).
- Include `CollectionPage` + `ItemList` JSON-LD listing every linked tool.
- Link to the two or three next-most-relevant hubs at the bottom.
- Localize to every locale the underlying tools exist in.

## 6. Contextual in-body linking (blog, FAQ, press)

- Link to tool pages from relevant words, not generic "learn more".
- No more than ~1 internal link per 150 words unless the article is
  explicitly a resource list / hub.
- Avoid linking the same anchor twice in one page.
- For localized tools, link to the matching locale of the article — never
  dump EN links in an ES post.

## 7. Orphan detection

An orphan is any tool page not linked from:

- its category hub, **and**
- at least one related-tool block on another live tool.

Detect orphans by comparing `TOOL-INVENTORY.json` against the generated
sitemap and link graph. Run before any release. Fix by:

1. Adding the tool to its correct hub.
2. Adding at least 2 reciprocal related-tool entries in
   `RELATED_TOOLS_COMPLETE_MAPPING.json`.
3. Rebuilding the affected pages.

## 8. Audit output

Produce `docs/growth/internal-linking-audit.md` with:

```
tool: /pdf-merger/
hubs_linking_in:    [/pdf-tools/]
related_linking_in: [/pdf-split/, /pdf-compress/, /pdf-convert/]
outbound_related:   [/pdf-split/, /pdf-compress/, /pdf-to-jpg/]
breadcrumb:         Home > PDF Tools > PDF Merger
locale_parity:      en:ok, es:ok, da:missing_related_pdf-to-jpg
status:             PASS | WARN | FAIL
```

## 9. Do not

- Do not "boost" a page by adding dozens of links — Google treats excessive
  internal linking as a quality signal in the wrong direction.
- Do not use JS-rendered `<a>` injection for primary navigation — crawlers
  need static HTML links.
- Do not change the related-tool mapping and the canonical URL of a tool
  in the same PR — separate concerns, easier to revert.
- Do not create new category hubs without a plan: at least 6 real tools
  and a genuine information need. Empty hubs are quality liabilities.
