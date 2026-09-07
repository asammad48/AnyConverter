# Phase 02: Architecture And Internal Linking

Timeline from report: Weeks 2-3

## Objective

Turn AnyConverter from a broad pile of tools into a clearer set of topical products. The report recommends three primary silos: Private PDF Tools, Developer/Data Tools, and Browser/Device Tools.

## Source Basis

Drawn from these report sections:

- What Google and users can see today
- Crawl and tool inventory
- On-page SEO
- Prioritised backlog
- Twelve-week roadmap

## Required Work

1. Build canonical category hubs for:
   - PDF tools
   - Developer/Data tools
   - Browser/Device tools
2. Add breadcrumbs for priority pages.
3. Add contextual internal links between related tools.
4. Update homepage and hub positioning toward privacy/local processing.
5. Keep existing ranking URLs unless Search Console data justifies a migration.
6. Map secondary clusters without over-promoting them:
   - Text tools
   - Calculators
   - Productivity utilities
   - Random tools

## Recommended Architecture

Use hubs and breadcrumbs around current URLs first:

```text
/
+-- /pdf-tools/
+-- /developer-tools/
+-- /browser-tools/
+-- secondary clusters
    +-- text
    +-- calculators
    +-- productivity
```

Do not force all existing URLs into new paths unless there is a strong migration reason.

## Homepage Positioning

The report suggests shifting away from generic "free online tools" language and toward privacy/local processing.

Candidate title direction:

```text
AnyConverter - Private PDF, Image & Developer Tools | No Upload
```

Candidate H1 direction:

```text
Private Online Tools That Run in Your Browser
```

Use these as planning direction, not mandatory final copy.

## Checks

- Each main hub has crawlable links to its important child tools.
- Each priority tool links back to its hub.
- Breadcrumbs match the user's actual path and the intended topical relationship.
- Related-tool links are workflow-based, not random.
- Existing canonical URLs are preserved.
- Redirects are avoided unless a URL migration is explicitly approved.
- Secondary clusters do not dilute the three main products.
- Internal links help users complete adjacent tasks.

## Deliverables

- Category hub plan for PDF, Developer/Data, and Browser/Device.
- Internal linking map for priority tools.
- Breadcrumb implementation checklist.
- Homepage positioning update proposal.
- List of pages that should not move.

## Exit Criteria

Move to Phase 03 when:

- Main topical hubs are planned or implemented.
- Priority pages have a clear hub and related-tool path.
- No unnecessary URL migration is required.
- The site architecture communicates topical focus better than a flat directory of tools.
