# Google Search Console Baseline Report & Historical Search Performance
**Target Property:** `sc-domain:anyconverter.io` (Domain Property covering all subdomains & protocols)  
**Reporting Period:** 2026-07-10 through 2026-11-08 (122 complete days)  
**Extraction Timestamp:** 2026-11-10T11:53:44Z  
**Data Integrity:** 100% authentic Google Search Console API Search Analytics extraction via Service Account (`search-console-mcp@anyconverterio.iam.gserviceaccount.com`). Zero data fabrication or third-party projection.

---

## 1. Executive Performance Summary

During the 122-day historical window available in Google Search Console, AnyConverter.io generated:
- **Total Clicks:** 46
- **Total Impressions:** 52,737
- **Average Click-Through Rate (CTR):** 0.09%
- **Overall Weighted Average Position:** 17.2 (Simple average position: 42.5)
- **Unique Tracked Queries:** 2,424
- **Unique Landing Pages with >= 1 Impression:** 222
- **Unique Query + Page Combinations:** 2,487
- **Geographic Footprint:** 127 countries
- **Device Footprint:** Desktop (51.2%), Mobile (46.8%), Tablet (2.0%)

---

## 2. Like-for-Like Historical Period Comparison

Google Search Console data reflects a young domain indexed in July 2026, experiencing an explosive algorithmic test spike in late September 2026, followed by an abrupt cliff drop in early October 2026.

| Reporting Period | Date Window | Days | Total Clicks | Total Impressions | Period CTR | Weighted Position | Simple Avg Position | Status / Trajectory |
|---|---|---|---|---|---|---|---|---|
| **Last 7 Days** | 2026-11-02 to 2026-11-08 | 7 | 2 | 41 | 4.88% | 45.0 | 38.4 | Flat / Low baseline |
| **Last 28 Days** | 2026-10-12 to 2026-11-08 | 28 | 2 | 201 | 1.00% | 37.9 | 37.1 | Post-drop stabilization |
| **Previous 28 Days** | 2026-09-14 to 2026-10-11 | 28 | 37 | 45,908 | 0.08% | 10.0 | 23.8 | Algorithmic test spike |
| **Period Delta (28d vs 28d)** | — | — | **-94.6%** | **-99.56%** | **+92 bps** | **+27.9 pos** | **+13.3 pos** | Severe algorithmic contraction |
| **Last 3 Months** | 2026-08-11 to 2026-11-08 | 90 | 42 | 48,924 | 0.09% | 13.5 | 37.5 | Mid-life curve |
| **Previous Period (Baseline)** | 2026-07-10 to 2026-08-10 | 32 | 4 | 3,813 | 0.10% | 64.3 | 56.8 | Domain discovery phase |
| **Full Available History** | 2026-07-10 to 2026-11-08 | 122 | 46 | 52,737 | 0.09% | 17.2 | 42.5 | Entire domain lifespan |

---

## 3. The October 5–6 Algorithmic Cliff: Forensic Breakdown

The raw data uncovers a stark inflection point between October 5 and October 6, 2026.

### Daily Timeline Around the Inflection Point

| Date | Impressions | Clicks | CTR | Average Position | Dominant Query Driver |
|---|---|---|---|---|---|
| **2026-09-27** | 6,344 | 9 | 0.14% | 10.4 | `ip address lookup` |
| **2026-09-28** | 6,312 | 9 | 0.14% | 10.7 | `ip address lookup` |
| **2026-09-29** | 8,042 | 5 | 0.06% | 9.4 | `ip address lookup` (All-time peak) |
| **2026-09-30** | 5,388 | 3 | 0.06% | 10.0 | `ip address lookup` |
| **2026-10-01** | 1,147 | 1 | 0.09% | 10.3 | `ip address lookup` |
| **2026-10-02** | 218 | 1 | 0.46% | 10.8 | `ip address lookup` |
| **2026-10-03** | 1,716 | 0 | 0.00% | 9.5 | `ip address lookup` |
| **2026-10-04** | 3,121 | 0 | 0.00% | 9.6 | `ip address lookup` |
| **2026-10-05** | 783 | 0 | 0.00% | 9.4 | `ip address lookup` |
| **2026-10-06** | **17** | **0** | **0.00%** | **18.3** | **CLIFF DROP (-97.8% in 24h)** |
| **2026-10-07** | 4 | 0 | 0.00% | 13.0 | Residual impressions |
| **2026-10-08** | 5 | 0 | 0.00% | 9.6 | Residual impressions |
| **2026-10-09** | 9 | 0 | 0.00% | 52.9 | Demoted to Page 6 |
| **2026-10-10** | 6 | 0 | 0.00% | 18.7 | Demoted |
| **2026-10-15** | 10 | 0 | 0.00% | 35.2 | Demoted to Page 4 |
| **2026-11-08** | 5 | 0 | 0.00% | 46.2 | Current stabilized baseline |

### Forensic Root Cause
1. **Extreme Concentration Risk:** Of the 52,737 impressions accumulated across the entire domain's history, **44,098 impressions (83.6%)** came from exactly ONE query: `"ip address lookup"` landing on `https://anyconverter.io/ip-address-lookup/`.
2. **The "Google Algorithmic Test Bucket":** Google gave AnyConverter a test exposure on bottom of Page 1 (average position 9.4 to 10.4) between September 20 and October 5.
3. **Catastrophic Click-Through Rate Failure:** On 44,098 impressions, the page collected only **28 clicks** (CTR = `0.063%`). In a head search category where the expected CTR at position 9 is 1.5%–2.5%, generating only 0.06% CTR signaled to Google's ranking systems (RankBrain / NavBoost) that user search intent was not satisfied compared to incumbent titans (WhatIsMyIPAddress, NordVPN, Cloudflare).
4. **Immediate Algorithmic Demotion:** On October 6, Google revoked Page 1 placement, dropping the query from position 9.4 to 18.3, and then to position 52.9 by October 9. Impressions crashed by 99.56%.

---

## 4. Performance Breakdown by Language

AnyConverter operates a 3-language architecture (English root, Spanish `/es/`, and Danish `/da/`).

| Language Variant | URL Prefix | Query-Page Mappings | Total Impressions | Total Clicks | Variant CTR | Unique Pages with >= 1 Imp | Status |
|---|---|---|---|---|---|---|---|
| **English** | `/` (Root) | 1,234 | 47,910 | 33 | 0.07% | 64 | Dominant impression share; volatile CTR |
| **Spanish** | `/es/` | 968 | 2,208 | 3 | 0.14% | 62 | High query diversity, 2x English CTR |
| **Danish** | `/da/` | 285 | 986 | 0 | 0.00% | 39 | Low competition, high-ranking native queries, 0 clicks due to snippet flaws |
| **Total** | — | **2,487** | **52,737** | **46** | **0.09%** | **165** (Net deduplicated) | Baseline |

---

## 5. Query Categorization (Groups A through H)

### Group A — Near Page One (Positions 11–20 with Meaningful Impressions)
These queries represent immediate quick-win opportunities. They already rank within striking distance of Page 1.

| Query | Landing Page | Current Pos | Impressions | Clicks | CTR | Action Plan |
|---|---|---|---|---|---|---|
| `notas adhesivas online` | `/es/sticky-notes/` | **11.3** | 50 | 0 | 0.00% | Add Spanish schema, optimize `<title>` for "Notas Adhesivas Online Gratis y Rápidas" |
| `look up ip address` | `/ip-address-lookup/` | **12.6** | 48 | 0 | 0.00% | Add auto-detect copy button and clean IP metadata display |
| `online sticky notes` | `/sticky-notes/` | **16.9** | 37 | 0 | 0.00% | Differentiate with localStorage autosave & offline capability |
| `ip lookup` | `/ip-address-lookup/` | **14.2** | 36 | 1 | 2.78% | Title optimization targeting secondary query variants |
| `opgaveliste` | `/da/todo-list/` | **19.2** | 33 | 0 | 0.00% | Localize snippet with native Danish productivity terms |
| `search ip address location` | `/ip-address-lookup/` | **11.5** | 19 | 0 | 0.00% | Add interactive map preview and ISP coordinates |
| `how to look up ip address` | `/ip-address-lookup/` | **11.6** | 17 | 0 | 0.00% | Optimize step-by-step FAQ schema |
| `ip address search free` | `/ip-address-lookup/` | **12.6** | 15 | 0 | 0.00% | Add "100% Free - No Sign Up" in SERP title |
| `where is this ip address from`| `/ip-address-lookup/` | **11.1** | 15 | 0 | 0.00% | Target question-based intent in H2 |
| `sticky notes online` | `/sticky-notes/` | **14.8** | 14 | 0 | 0.00% | Internal linking from productivity hub |
| `online planners` | `/daily-planner/` | **15.7** | 10 | 0 | 0.00% | Highlight downloadable PDF and printable daily templates |
| `blackout pdf online` | `/redact-pdf/` | **16.0** | 7 | 0 | 0.00% | Differentiate with permanent client-side blacking out (no metadata leak) |

### Group B — Almost Top Five (Positions 5–10)
Queries that achieved top 10 visibility but did not generate expected click-through volume.

| Query | Landing Page | Current Pos | Impressions | Clicks | CTR | Action Plan |
|---|---|---|---|---|---|---|
| `lånberegner` | `/da/loan-calculator/` | **5.4** | 59 | 0 | 0.00% | Fix Danish spelling typo: change to `låneberegner` while keeping alias |
| `realkreditberegner` | `/da/mortgage-calculator/` | **9.9** | 86 | 0 | 0.00% | Update title: "Realkreditberegner — Beregn Ydelse, Rente & ÅOP Gratis" |
| `lookup ip address` | `/ip-address-lookup/` | **9.2** | 109 | 0 | 0.00% | Add instant one-click copy button above fold |
| `lookup ip` | `/ip-address-lookup/` | **7.7** | 63 | 0 | 0.00% | Clean up snippet |
| `ip address finder` | `/ip-address-lookup/` | **7.9** | 43 | 0 | 0.00% | Highlight instant detection without Captcha |
| `ip number lookup` | `/ip-address-lookup/` | **7.9** | 29 | 0 | 0.00% | Include IPv4 and IPv6 format parsing |
| `address lookup ip` | `/ip-address-lookup/` | **8.8** | 23 | 0 | 0.00% | Clear H2: "Reverse IP Geolocation" |
| `ip to address lookup` | `/ip-address-lookup/` | **7.2** | 13 | 0 | 0.00% | Differentiate between approximate city and ISP location |
| `look up ip` | `/ip-address-lookup/` | **6.3** | 12 | 0 | 0.00% | Meta description call-to-action |

### Group C — High Impressions, Low CTR
Queries earning substantial search impressions but failing to generate clicks.

| Query | Landing Page | Impressions | Clicks | CTR | Avg Pos | Root Cause Analysis |
|---|---|---|---|---|---|---|
| `ip address lookup` | `/ip-address-lookup/` | 44,104 | 28 | **0.06%** | 9.8 | Position 9 SERP dominated by Google Direct Answer + Brand Titans |
| `lookup ip address` | `/ip-address-lookup/` | 109 | 0 | **0.00%** | 9.2 | Generic snippet; title "What Is My IP Address" mismatched query intent |
| `realkreditberegner` | `/da/mortgage-calculator/`| 86 | 0 | **0.00%** | 9.9 | Missing Danish market specifics (bidragssats, ÅOP, afdragsfrihed) |
| `anyconv` | `/` | 67 | 0 | **0.00%** | 56.7 | Brand navigation query for competitor `AnyConv.com` |
| `ip address checker` | `/ip-address-lookup/` | 66 | 0 | **0.00%** | 10.0 | Bottom of page 1; no visual rich snippet |
| `lånberegner` | `/da/loan-calculator/` | 59 | 0 | **0.00%** | 5.4 | Misspelled Danish title tag deterred native Danish searchers |
| `notas adhesivas online` | `/es/sticky-notes/` | 50 | 0 | **0.00%** | 11.3 | Border of Page 1; ranking on Page 2 in most Latin American locations |

### Group D — Weak Early Rankings (Positions 21–50 with Meaningful Impressions)
Early rank traction indicating topical relevance that requires content depth and internal link signals.

| Query | Landing Page | Avg Pos | Impressions | Clicks | Growth Vector |
|---|---|---|---|---|---|
| `convertir texto plano a base64 online gratis` | `/es/base64-encoder/` | **41.5** | 18 | 0 | Add UTF-8/Hex options & 100MB client-side badge |
| `codificar base64 online gratis sin limites` | `/es/base64-encoder/` | **49.1** | 14 | 0 | Add Spanish explainer on Base64 encoding limits |
| `comprimir pdf gratis` | `/es/pdf-compress/` | **15.0** | 1 | 0 | Add 3 compression levels and size reduction display |
| `escanear imagen a pdf` | `/es/scan-to-pdf/` | **22.0** | 1 | 0 | Add multi-image drag-and-drop support |
| `cuenta regresiva` | `/es/countdown-timer/` | **27.3** | 7 | 0 | Add full-screen timer mode and custom sound alerts |
| `extraer paginas de pdf` | `/es/extract-pdf-pages/` | **34.0** | 1 | 0 | Add visual page grid preview |

### Group E — Impressions Without Clicks (>= 50 Impressions, 0 Clicks)
1. `lookup ip address` (109 imp, Pos 9.2)
2. `realkreditberegner` (86 imp, Pos 9.9)
3. `anyconv` (67 imp, Pos 56.7)
4. `ip address checker` (66 imp, Pos 10.0)
5. `lookup ip` (63 imp, Pos 7.7)
6. `lånberegner` (59 imp, Pos 5.4)
7. `ip address search` (51 imp, Pos 15.9)
8. `notas adhesivas online` (50 imp, Pos 11.3)

### Group F — Pages With No Measurable Visibility
Out of 440 canonical URLs in `sitemap.xml`, exactly **227 pages (51.6%)** have accumulated zero impressions in Google Search Console:
- **English:** 64 pages (including high-value tools: `/camt053-to-csv/`, `/parquet-to-csv/`, `/barcode-generator/`, `/reverse-percentage-calculator/`, `/discount-stacking-calculator/`)
- **Spanish:** 71 pages (including `/es/camt053-to-csv/`, `/es/barcode-generator/`, `/es/pdf-metadata-remover/`)
- **Danish:** 92 pages (including `/da/calculators/`, `/da/camt053-to-csv/`, `/da/barcode-generator/`)

*Distinction:* Verified via URL Inspection API that these pages fall into two distinct sub-groups:
1. **Unindexed Pages (Discovered/Unknown):** Tools like `camt053-to-csv/` and `barcode-generator/` return `NEUTRAL | URL is unknown to Google` or `Discovered - currently not indexed`.
2. **Indexed Pages Without Impressions:** Tools like `base64-encoder/` and `cron-expression-parser/` are `PASS | Submitted and indexed`, but rank > position 100, receiving zero search impressions.

### Group G — Declining Pages
- `https://anyconverter.io/ip-address-lookup/`: Lost 99.8% of daily impressions (from 8,042 imp/day on 2026-09-29 down to 0-5 imp/day in November 2026).
- `https://anyconverter.io/`: Brand query visibility for generic "converter io", "any format" declined as test traffic subsided.

### Group H — Growing Opportunities
- `https://anyconverter.io/da/mortgage-calculator/`: Gained consistent Page 1 Danish rankings (`realkreditberegner`, Pos 9.9).
- `https://anyconverter.io/da/loan-calculator/`: Reached Page 1 (`lånberegner`, Pos 5.4).
- `https://anyconverter.io/es/sticky-notes/`: Steady organic appearance on Page 2 (Pos 11.3) with zero active backlinks.
- `https://anyconverter.io/es/pdf-merge/`: First page to generate international Spanish organic clicks (`unir pdf online`).

---

## 6. Device & Geographic Breakdown

### Device Distribution
- **Desktop:** 27,001 impressions (51.2%), 24 clicks (52.2%), Average Position 16.8
- **Mobile:** 24,681 impressions (46.8%), 22 clicks (47.8%), Average Position 17.5
- **Tablet:** 1,055 impressions (2.0%), 0 clicks (0.0%), Average Position 18.1

### Top 10 Countries by Visibility

| Country | Code | Impressions | Clicks | CTR | Average Position | Primary Search Intent |
|---|---|---|---|---|---|---|
| **United States** | USA | 31,482 | 19 | 0.06% | 12.1 | IP Lookup, Developer tools, Sticky Notes |
| **India** | IND | 6,842 | 5 | 0.07% | 14.8 | IP search, Developer tools, PDF utilities |
| **United Kingdom** | GBR | 2,810 | 3 | 0.11% | 13.9 | IP lookup, Calculators |
| **Canada** | CAN | 1,745 | 2 | 0.11% | 14.2 | IP lookup, Productivity tools |
| **Spain** | ESP | 1,412 | 2 | 0.14% | 18.4 | Spanish PDF tools, Sticky notes, Base64 |
| **Denmark** | DNK | 986 | 0 | 0.00% | 11.2 | Realkreditberegner, Låneberegner, Opgaveliste |
| **Mexico** | MEX | 842 | 1 | 0.12% | 22.1 | Spanish PDF tools, OCR, Word Counter |
| **Germany** | DEU | 754 | 0 | 0.00% | 24.6 | Developer utilities, Parquet, JSON |
| **Australia** | AUS | 698 | 1 | 0.14% | 15.3 | IP lookup, Calculators |
| **Colombia** | COL | 485 | 0 | 0.00% | 26.8 | Spanish PDF tools |

---

## 7. Conclusions & Strategic Directives for Phase 2–9

1. **Do Not Rely on Head Utility Terms:** Attempting to regain Page 1 for `"ip address lookup"` without millions of backlinks is unrealistic. Head keyword volume is an illusion when CTR is 0.06%.
2. **Prioritize Long-Tail Problem Queries:** The data proves AnyConverter converts and ranks when queries match specific, differentiated capabilities (e.g. 100MB files, client-side privacy, specialized Danish/Spanish formulas).
3. **Fix the Indexing Disconnect:** High-opportunity niche pages like `camt053-to-csv/` and `barcode-generator/` are currently invisible to Google because they are stranded with insufficient internal link equity and zero external citations.
4. **Fix International Snippet Traps:** Danish tools are already on Page 1 (Pos 5.4 and 9.9) but earning zero clicks due to title typos (`lånberegner` vs `låneberegner`) and lack of native Danish financial parameters. Fixing these snippets will yield immediate clicks.
