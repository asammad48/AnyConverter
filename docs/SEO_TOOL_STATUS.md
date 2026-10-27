# SEO & Diagnostic Tool Registry — AnyConverter

Last updated: 2026-10-25

## Tool Status Matrix

| Tool | Installed | Connected | Authenticated | Read Test | Cost | Purpose | Status | Notes |
|---|---|---|---|---|---|---|---|---|
| **Chrome DevTools** | Yes | Yes | N/A | PASS | Free | Fast DOM inspection, console logs, Core Web Vitals, responsive audits | READY - READ ONLY | Uses `chrome-devtools-mcp@latest` with `--slim --headless` (3 tools) |
| **Playwright** | Yes | Yes | N/A | PASS | Free | Multi-step interactive E2E testing, form submission, full-page snapshots, assertions | READY | Uses `@playwright/mcp@latest` with 25 automated testing tools |
| **Google Stitch** | Yes | Yes | Yes | PASS | Free | UI/UX design generation, design-token extraction, component specifications | READY | Connected to `https://stitch.googleapis.com/mcp` with `X-Goog-Api-Key` |
| **Google Search Console** | Yes | Yes | Yes | PASS | Free | Organic search analytics (clicks, impressions, CTR, position), URL inspection, sitemaps | READY - READ ONLY | Uses `mcp-gsc@latest` with service account; verified `sc-domain:anyconverter.io` (`siteFullUser`) |
| **GitHub** | Yes | Yes | Yes | PASS | Free | Read repo files, inspect branches, review diffs, prepare PRs | READY | Uses `@modelcontextprotocol/server-github`; token securely bridged from `gh` CLI |
| **Bing Webmaster** | Direct API | Yes | Yes | PASS | Free | Bing search performance, crawl stats, sitemap status, URL verification | READY - READ ONLY | API key verified; `https://anyconverter.io/` verified (`IsVerified: true`) |
| **Microsoft Clarity** | Direct API | Yes | Yes | PASS | Free | Behavioral analytics, dead clicks, rage clicks, scroll depth, session metrics | READY - READ ONLY | Data Export API verified with JWT token; Project ID `3563938639732118` |
| **Cloudflare API MCP** | Yes | Yes | Yes | PASS | Free | Diagnostic read-only inspection of DNS, SSL/TLS, edge caching, WAF, bot protection, and Pages | READY - READ ONLY | Connected to `https://mcp.cloudflare.com/mcp` with Bearer token; verified `whoami`, `docs`, `search`, `execute` |
| **PageSpeed Insights** | Direct API | Yes | No | PASS (Endpoint active) | Free (within quota) | Core Web Vitals audits (FCP, LCP, CLS, TBT, Speed Index) and SEO scores | AUTHENTICATION REQUIRED | Direct query returned HTTP 429 daily quota error for anonymous calls; requires a Google API key |
| **CrUX** | Direct API | Yes | Yes | PASS (Key Valid) | Free (within quota) | Real-user field performance metrics (28-day Chrome UX Report dataset) | READY - MONITORING | API key verified (HTTP 200 on control); AnyConverter returns 404 (domain currently below Google's 28-day public traffic threshold) |
| **Screaming Frog** | No | No | No | N/A | Free (500 URLs) | Deep technical crawling, redirect chains, canonical auditing, orphan page detection | NOT INSTALLED | SEO Spider 24.3+ not detected on system; local Node script `check-links.js` covers 69 internal pages |
| **Google Analytics 4** | Yes | Yes | Yes | PASS (Read-Only) | Free | Traffic reporting, landing page engagement, conversion event analysis | READY - VERIFIED | Property `398367431` verified via `run_report` (Last 7d: 2 users, 2 sessions, 11 page views); kept disabled (`disabled: true`) in config to preserve context |
| **DataForSEO** | Cached locally | Removed | No | PASS (Docs) | Paid API | Keyword search volume, SERP rankings, competitor backlinks | DISABLED | Disabled and removed from active MCP configuration to prevent unwanted paid API charges |
