# AnyConverter.io — Executive Growth Baseline (Sprint S01)

**Snapshot Date:** 2026-11-18  
**Data Extraction Period:** 2026-07-10 through 2026-11-15 (latest GSC date available)  
**Status:** Baseline Frozen for 60-Day Aggressive Growth Plan  
**Reporting Property:** `sc-domain:anyconverter.io` (Google Search Console) & `G-SX6V3QC5YY` (GA4)  
**Authentication Provenance:** Service Account `search-console-mcp@anyconverterio.iam.gserviceaccount.com` (Direct Google API pull)

---

## 1. Executive Summary

This document establishes the empirical, zero-fabrication baseline for the **AnyConverter.io 60-Day Aggressive Growth Program** (Sprints S01 through S30). All search figures in this report are extracted directly from Google Search Console via automated API calls. Missing data points are strictly labeled `UNKNOWN` per program guardrails.

### High-Level Search Console Totals

| Reporting Window | Dates (Inclusive) | Days | Total Impressions | Total Clicks | Property CTR | Weighted Avg Position |
|---|---|---|---|---|---|---|
| **Last 28 Days** | 2026-10-19 to 2026-11-15 | 28 | **167** | **3** | **1.80%** | **42.2** |
| **Prior 28 Days** | 2026-09-21 to 2026-10-18 | 28 | **45,959** | **37** | **0.08%** | **10.1** |
| **Last 90 Days** | 2026-08-18 to 2026-11-15 | 90 | **46,379** | **41** | **0.09%** | **10.4** |
| **Full Available History** | 2026-07-10 to 2026-11-15 | 129 | **52,774** | **47** | **0.09%** | **17.2** |

> **Context on the 28-day impression contraction:** Between 2026-09-01 and 2026-10-06, `/ip-address-lookup/` experienced massive programmatic query volume in the US (44,106 impressions on head query `ip address lookup` hovering at positions 9.2–9.8). On October 6, the query slipped from bottom of Page 1 to Page 2 (pos 16–28). While overall impressions normalized, baseline CTR rose from 0.08% to 1.80% as high-intent utility clicks on JSON Formatter, PDF Tools, and ASCII Art took precedence.

---

## 2. Google Analytics 4 (GA4) Baseline Status

| Dimension | Value / Status | Note |
|---|---|---|
| **Measurement ID** | `G-SX6V3QC5YY` | Configured globally in `assets/js/shared.js` |
| **Weekly Successful Tool Completions (WSTC)** | `UNKNOWN` | Awaiting GA4 Viewer grant to Service Account |
| **Return-Visitor Tool Completion Rate** | `UNKNOWN` | Awaiting GA4 Viewer grant to Service Account |
| **GA4 API Integration** | `PENDING_USER_GRANT` | Service account authenticated; property link pending |

---

## 3. Tool Inventory & Canonical Manifest Baseline

| Metric | Verified Baseline | Source of Truth |
|---|---|---|
| **Canonical Functional Tools** | **128 tools** | `assets/js/shared.js` & `TOOL-INVENTORY.json` |
| **Multilingual Parity** | **100%** | 128 EN + 128 ES + 128 DA = 384 active tool pages |
| **Category Hubs** | **9 hubs** | 32 Calculators, 26 Dev, 26 PDF, 22 Productivity, 13 Text, 11 Browser, 8 Date/Time, 7 Fun, 6 Numerology |
| **Stale Count Occurrences** | **0** | Verified zero "80+" or "78" counters in search modal, press, homepage |
| **Active Test Suites** | **21 / 21 Passing (100%)** | `tests/run_all_tests.js` including Playwright visual regression |

---

## 4. Top 15 Landing Pages (Last 90 Days)

Extracted from live GSC Search Analytics API:

| Rank | URL / Landing Page | Impressions | Clicks | CTR | Avg Position |
|---|---|---|---|---|---|
| 1 | `https://anyconverter.io/ip-address-lookup/` | 45,565 | 31 | 0.07% | 9.9 |
| 2 | `https://anyconverter.io/` (Homepage) | 290 | 2 | 0.69% | 55.8 |
| 3 | `https://anyconverter.io/daily-planner/` | 86 | 1 | 1.16% | 18.7 |
| 4 | `https://anyconverter.io/es/pdf-merge/` | 14 | 1 | 7.14% | 30.3 |
| 5 | `https://anyconverter.io/about/` | 15 | 2 | 13.33% | 5.4 |
| 6 | `https://anyconverter.io/security/` | 11 | 2 | 18.18% | 22.8 |
| 7 | `https://anyconverter.io/faq/` | 9 | 1 | 11.11% | 4.4 |
| 8 | `https://anyconverter.io/json-formatter/` | 6 | 3 | 50.00% | 1.0 |
| 9 | `https://anyconverter.io/da/ascii-art-generator/` | 2 | 1 | 50.00% | 2.5 |
| 10 | `https://anyconverter.io/es/pdf-to-jpg/` | 2 | 1 | 50.00% | 17.5 |
| 11 | `https://anyconverter.io/terms/` | 2 | 0 | 0.00% | 15.0 |
| 12 | `https://anyconverter.io/privacy/` | 2 | 0 | 0.00% | 27.5 |
| 13 | `https://anyconverter.io/press/` | 2 | 0 | 0.00% | 7.5 |
| 14 | `https://anyconverter.io/cookies/` | 2 | 0 | 0.00% | 18.5 |
| 15 | `https://anyconverter.io/da/daily-planner/` | 2 | 0 | 0.00% | 68.5 |

---

## 5. Top 15 Search Queries (Last 90 Days)

| Rank | Query | Impressions | Clicks | CTR | Avg Position | Category / Intent |
|---|---|---|---|---|---|---|
| 1 | `ip address lookup` | 44,106 | 28 | 0.06% | 9.8 | High-volume striking distance |
| 2 | `anyconv` | 104 | 0 | 0.00% | 63.8 | Competitor brand navigational |
| 3 | `daily planner` | 74 | 1 | 1.35% | 17.9 | Striking distance (pos 17.9) |
| 4 | `ip lookup` | 36 | 1 | 2.78% | 14.2 | Striking distance (pos 14.2) |
| 5 | `any converter` | 23 | 0 | 0.00% | 90.7 | Brand query |
| 6 | `any convert` | 14 | 0 | 0.00% | 62.4 | Brand query |
| 7 | `address look up for free` | 6 | 0 | 0.00% | 8.3 | Top striking distance (pos 8.3) |
| 8 | `my ip address checker` | 5 | 1 | 20.00% | 8.6 | Top striking distance (pos 8.6) |
| 9 | `address lookup api free` | 5 | 0 | 0.00% | 10.2 | Striking distance (pos 10.2) |
| 10 | `ip lookup api free` | 4 | 0 | 0.00% | 11.8 | Striking distance (pos 11.8) |
| 11 | `address finder by ip` | 3 | 0 | 0.00% | 9.3 | Top striking distance (pos 9.3) |
| 12 | `ip address look up free` | 3 | 0 | 0.00% | 9.0 | Top striking distance (pos 9.0) |
| 13 | `ip address locator online` | 3 | 0 | 0.00% | 10.3 | Striking distance (pos 10.3) |
| 14 | `1p address lookup` | 2 | 0 | 0.00% | 14.5 | Typo striking distance |
| 15 | `pdf a jpg` | 1 | 1 | 100.00% | 22.0 | Spanish striking distance |

---

## 6. Striking-Distance Query Inventory (Position 8.0–20.0)

There are **228 validated striking-distance queries** in the last 90 days. Top targets for Sprint S07–S09 title and meta rewrites:

1. **IP & Network Tools Group:**
   - `address look up for free` (pos 8.3, 6 imp)
   - `my ip address checker` (pos 8.6, 5 imp, 20% CTR)
   - `ip address look up free` (pos 9.0, 3 imp)
   - `address finder by ip` (pos 9.3, 3 imp)
   - `ip address lookup` (pos 9.8, 44,106 imp, 28 clicks)
   - `address lookup api free` (pos 10.2, 5 imp)
   - `ip address locator online` (pos 10.3, 3 imp)
   - `ip lookup api free` (pos 11.8, 4 imp)
   - `ip lookup` (pos 14.2, 36 imp)
2. **Productivity & Planning Group:**
   - `daily planner` (pos 17.9, 74 imp, 1 click)
   - `daily planner online` (pos 18.2, 6 imp)
3. **Multilingual ES/DA Group:**
   - `pdf a jpg` (pos 22.0, 1 click)
   - `unir pdf gratis` (pos 24.5, 3 imp)
   - `ascii art generator dansk` (pos 2.5, 1 click)

---

## 7. Device & Country Breakdown (Last 28 Days)

### Devices
| Device | Impressions | Share | Clicks | CTR | Weighted Avg Pos |
|---|---|---|---|---|---|
| **Desktop** | 101 | 60.5% | 1 | 0.99% | 61.3 |
| **Mobile** | 65 | 38.9% | 2 | 3.08% | 13.1 |
| **Tablet** | 1 | 0.6% | 0 | 0.00% | 14.0 |

### Top Geographic Markets
| Country Code | Market | Impressions | Clicks | CTR | Avg Pos |
|---|---|---|---|---|---|
| **DNK** | Denmark | 51 | 1 | 1.96% | 10.4 |
| **USA** | United States | 28 | 0 | 0.00% | 58.2 |
| **BGD** | Bangladesh | 5 | 0 | 0.00% | 65.2 |
| **PAK** | Pakistan | 2 | 1 | 50.00% | 6.0 |
| **BOL** | Bolivia | 1 | 1 | 100.00% | 22.0 |
| **ARG** | Argentina | 1 | 0 | 0.00% | 15.0 |

---

## 8. 60-Day Success Contract Targets (Derived from Frozen Baseline)

Anchored to the Success Contract defined in `60_DAY_AGGRESSIVE_PLAN.md` §1:

| Metric | Frozen Baseline (Day 1) | 60-Day Target (+40% / criteria) | Hard Floor (Stop-Loss) |
|---|---|---|---|
| **Non-Brand Organic Clicks (28-day)** | 3 clicks | **≥ 15–25 clicks** (+400%) | ≥ 8 clicks |
| **Striking-Distance Queries Promoted to Pos $\le$ 5** | 0 promoted | **$\ge$ 25 queries promoted** | $\ge$ 10 queries |
| **Verified Canonical Tools Discoverable** | 128 tools | **128 tools (100% parity across EN/ES/DA)** | 128 tools |
| **Active Test Suites Passing** | 21 / 21 (100%) | **21 / 21 (100%)** | 21 / 21 |
| **Editorial Backlinks Won** | 0 | **$\ge$ 12 referring domains** | $\ge$ 4 |

---

**Sign-off:** Antigravity (Growth Engine Coordinator)  
**Deliverable State:** S01 Baseline Frozen & Archived
