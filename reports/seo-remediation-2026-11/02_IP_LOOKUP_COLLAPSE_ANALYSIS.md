# 02_IP_LOOKUP_COLLAPSE_ANALYSIS — Observed Facts vs. Hypotheses

**Target Page:** `https://anyconverter.io/ip-address-lookup/`  
**Core Query:** `ip address lookup`  
**Investigation Period:** September 1, 2026 – November 8, 2026  
**Primary Country:** United States (USA)

---

## 1. Chronology of Observed Facts

From daily GSC extractions, the trajectory of `/ip-address-lookup/` is established with exact daily data:

| Date | Property Impressions | IP Lookup Impressions | IP Lookup Clicks | Average Position | Notes |
|---|---:|---:|---:|---:|---|
| **2026-09-01** | 24 | 0 | 0 | 45.1 | Baseline quiet period |
| **2026-09-15** | 352 | 338 | 0 | 12.4 | Initial visibility surge |
| **2026-09-22** | 1,840 | 1,819 | 1 | 9.8 | Entry to lower Page 1 |
| **2026-09-25** | 5,405 | 5,368 | 5 | 9.6 | Peak exposure window |
| **2026-09-29** | 8,042 | 8,017 | 6 | 9.7 | All-time highest volume |
| **2026-10-01** | 1,147 | 1,133 | 0 | 10.4 | Initial rank softening |
| **2026-10-05** | 783 | 771 | 1 | 11.2 | Slipping past position 10 |
| **2026-10-06** | 17 | 4 | 0 | 16.5 | Rank drop to Page 2 |
| **2026-10-07** | 4 | 0 | 0 | 28.0 | Complete cliff drop |
| **2026-11-03** | 8 | 0 | 0 | 45.0 | Live crawl re-verified indexed |

---

## 2. Technical Status of `/ip-address-lookup/` (First-Party Verification)

On 16 November 2026, a live query to the GSC URL Inspection API verified:
- **Verdict:** `PASS`
- **Coverage State:** `Submitted and indexed`
- **Robots.txt State:** `ALLOWED`
- **Indexing State:** `INDEXING_ALLOWED`
- **Page Fetch State:** `SUCCESSFUL` (HTTP 200)
- **Google-Selected Canonical:** `https://anyconverter.io/ip-address-lookup/`
- **User Canonical:** `https://anyconverter.io/ip-address-lookup/`
- **Last Crawl:** `2026-11-03T03:58:57Z` via Googlebot Smartphone (Mobile)
- **Manual Actions:** None present on property.

**Conclusion:** The page was never removed from Google's index, was never blocked by robots.txt or noindex directives, and suffered no crawl or rendering failures.

---

## 3. Dissecting Hypotheses vs. Verifiable Evidence

### ❌ Hypothesis 1: "A Sitewide Google Penalty Hit the Domain" (DISPROVED)
- **Evidence:** The rest of the domain (calculators, PDF tools, text utilities) did not drop on October 6. In fact, rest-of-site impressions remained consistent (averaging 10–25 impressions/day before and after October 6).
- **Finding:** The collapse was 100% query- and URL-specific to `ip address lookup`.

### ❌ Hypothesis 2: "Confirmed Google Algorithm Test Bucket" (UNVERIFIABLE SPECULATION)
- **Evidence:** While SEO practitioners colloquially describe short-lived ranking spikes as "test buckets," search engines do not publish internal ranking test logs to Search Console.
- **Finding:** Labeling this as a "confirmed test bucket" is speculative. The only factual statement is that Google temporarily ranked the URL near position ~9.6 in US results, after which rankings fell to position 16+.

### ⚠️ Hypothesis 3: "Low CTR Triggered Algorithmic Demotion" (PLAUSIBLE HYPOTHESIS, NOT FACT)
- **Evidence:** During the peak surge (Sep 25 – Sep 29), `/ip-address-lookup/` received 24,000+ impressions and ~17 clicks, yielding a CTR of **~0.07%**.
- **Context:** For the head query `"ip address lookup"`, Google displays a prominent Instant Answer Box answering the user's IP directly on the SERP, depressing organic CTR for all standard listings.
- **Finding:** While a 0.07% CTR indicates that few users clicked beyond the SERP box, Search Console data cannot prove whether demotion was triggered by click feedback, SERP feature reconfiguration, or competitor relevance updates.

---

## 4. Root Cause Summary

The decline was caused by **a ranking transition from the bottom of Page 1 (positions 9.2–9.8) to Page 2 (positions 16–28)** for the head query `"ip address lookup"` in the United States. In high-volume search queries, moving from position 9 to position 16 routinely results in a >99% reduction in impressions due to pagination drop-off. The page remains healthy, indexed, and fully functional.
