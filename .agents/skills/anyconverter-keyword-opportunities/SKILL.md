---
name: anyconverter-keyword-opportunities
description: "Find and score keyword opportunities for AnyConverter.io tools. Use when asked to identify new tool ideas, native-language query gaps, low-CTR high-impression pages, SERP gaps, long-tail expansion, or market-specific tool opportunities across EN/ES/DA (and research markets pt-BR, id, tr, vi, pl, ar, hi-IN, th, bn-BD). Trigger phrases: keyword research, SERP gap, content gap, opportunity, search volume, long-tail, native keywords."
metadata:
  version: 1.0.0
---

# AnyConverter — Keyword Opportunity Research

Scope: identify and rank keyword / tool opportunities **for AnyConverter**
without fabricating numbers. Aligned with `COMBINED_GROWTH_MASTER_PLAN.md`
§5 (Phase 2) and the evidence standard in §22.

Related skills: `seo-audit`, `ai-seo`, `programmatic-seo`, upstream
`seo-dataforseo` / `seo-ahrefs` (**paid — approval required**).

## 1. Inputs

The agent must gather, in this order, before producing recommendations:

1. **GSC export** for the last complete 28-day and 90-day windows:
   `query × page × country × device × clicks × impressions × CTR × avg position`.
   If GSC MCP is disabled, say so and stop — do not invent numbers.
2. **Current tool inventory** from `TOOL-INVENTORY.json` (canonical slug,
   category, EN/ES/DA availability).
3. **Category hubs** currently shipped (`calculators`, `developer-tools`,
   `pdf-tools`, `productivity-tools`, `numerology-astrology`,
   `fun-relationships`, `date-time`, `text-tools`, `browser-tools`).
4. **Deep-research prospect universe** (`docs/growth/GROWTH_TRACKING.xlsx`
   → `Prospects` sheet) for linkable-asset alignment.
5. **Candidate market shortlist** (ES/DA improvement vs pt-BR, id, tr,
   vi, pl, ar, hi-IN, th, bn-BD) with explicit confidence per data point.

## 2. Opportunity taxonomy

Classify every candidate as one of:

| Type | Signal | Primary action |
|---|---|---|
| High-impression low-CTR | GSC impressions ≥ P75 and CTR < category median | Rewrite title + description; verify intent alignment; no new page |
| Striking-distance | avg position 8–20 with non-zero clicks | On-page strengthening (content depth, schema, internal links) |
| Native-keyword gap | Volume in native language > 0 and no AnyConverter page targets it | Score for locale pilot; never auto-create |
| Related-tool extension | Existing tool + strong co-occurring query | New tool only if workflow clearly distinct |
| SERP feature gap | AI Overview / featured snippet shown; AnyConverter absent | `ai-seo` content pattern (concise fact + structured answer) |
| Localization gap | Tool exists in EN only, native demand confirmed in ES/DA | Localization task, not new tool |
| Hub gap | Related-tool mapping fragmented | `anyconverter-internal-linking` hub improvement |
| Lifestyle/regulated | Numerology/BMI/calorie/financial jurisdiction-specific | Default reject unless a compliance/validation plan exists |

## 3. Scoring rubric (deterministic — do not freelance weights)

Score 1–5 per factor. If a factor is `UNKNOWN`, mark it unknown and lower
confidence accordingly — never guess.

| Factor | Weight |
|---|---:|
| Verified tool-specific demand (volume + intent fit) | 25% |
| Achievable SERP / competitor gap | 20% |
| Product fit + localization effort | 15% |
| Repeat usage potential | 15% |
| Non-SEO distribution channel fit (embed, partner, dev) | 10% |
| Commercial sustainability (RPM realistic for geo/category) | 10% |
| Technical + legal risk | 5% |

Output a weighted 1–5 score plus a **confidence grade** (`high | medium |
low | unknown`) and the evidence URL(s) used.

Sensitivity analysis: list the top-5 and bottom-5 shifts if the weights are
rebalanced ±10 points between demand and distribution — stakeholders need
to see which rankings are robust vs which flip under small weight changes.

## 4. SERP intent validation

Before recommending a new tool or page, verify intent by inspecting the
current top-10 for the primary query:

- Tool pages? Informational articles? Both?
- SERP features: AI Overview, featured snippet, People Also Ask, video,
  images, local pack.
- Competitor onboarding friction, mobile support, ads density, privacy
  claims.
- Do incumbents actually solve the task, or just talk about it?

If incumbents solve it well with minimal friction, a new AnyConverter page
is unlikely to rank without a clear differentiation (speed, privacy,
multi-step workflow, embed, locale).

## 5. Data sources and permitted methodology

| Source | What it gives | Guardrail |
|---|---|---|
| GSC (own property) | Real queries, pages, CTR, position, country, device | Preferred source for first-party signals |
| GA4 | Behavior after landing; completion; retention | Never equate direct = loyalty |
| Google Trends | Relative interest, seasonality | **Never** call the 0–100 index "search volume" |
| Ahrefs / DataForSEO / Semrush | Volume, difficulty, SERP snapshot | **Paid — requires approval**; cite provider + date; disclose methodology |
| W3Techs language share | Share of sites in a language | **Not** keyword difficulty; **not** reachable audience |
| Country internet users | Market sizing baseline | **Not** tool demand |
| Public SERP | Intent, competitors, SERP features | Record date; respect ToS; no scraping behind auth |

## 6. Output format (one row per opportunity)

```yaml
opportunity_id: KW-2026-11-0001
query_primary: "pdf merger online"
query_variants: ["unir pdf", "merge pdf browser"]
locale: en
intent_class: transactional-tool
current_url: /pdf-merger/
current_position: 11.4
current_clicks: 142
current_impressions: 18_730
current_ctr: 0.76%
serp_features: ["AI Overview", "People Also Ask"]
competitor_snapshot_date: 2026-11-18
primary_competitors: [smallpdf.com, ilovepdf.com, pdf24.org]
proposed_action: title_rewrite + faq_schema_fix + internal_link_from_pdf_hub
score_demand: 5
score_serp_gap: 3
score_product_fit: 5
score_repeat_usage: 4
score_distribution: 3
score_sustainability: 3
score_risk: 1
weighted_score: 4.0
confidence: high
evidence_urls: ["https://search.google.com/search-console/..."]
notes: "Striking-distance; no new page needed"
```

Save batches to `docs/growth/21-NATIVE-KEYWORD-RESEARCH.csv` (flatten
YAML → CSV) with provenance per row.

## 7. Forbidden

- Do not invent search volumes or difficulties.
- Do not pitch new pages before the striking-distance / on-page lift
  options are exhausted on existing URLs.
- Do not recommend scaling into a new locale from keyword data alone —
  the Phase-2 gate requires demand + SERP + product fit + native QA plan.
- Do not propose lifestyle / medical / jurisdiction-specific financial
  calculators without an explicit validation plan.
- Do not run paid keyword APIs without user approval and an explicit
  rate / cost cap.
- Do not include personal or sensitive query strings from GSC in outputs.
- Do not conflate ranking opportunities with completion / retention wins
  — WSTC is the north-star metric, not impressions.
