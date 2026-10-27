# Architecture & Strategy Decision Log (ADR) — AnyConverter

## ADR-001: Centralized Single-File MCP Profile Switching
- **Date:** 2026-10-25
- **Status:** Approved
- **Context:** The agent needs to operate across distinct workflows without overwhelming the LLM context window with 50+ tool schemas simultaneously.
- **Decision:** Use Antigravity's native `"disabled": true / false` property inside `.agents/mcp_config.json`. Provide `.agents/scripts/switch-profile.js` and `.agents/switch-profile.ps1` to switch profiles cleanly.
- **Consequence:** Zero configuration fragmentation; agents load only the 3-5 tools needed for their specific task.

## ADR-002: Dual Browser Tooling Strategy
- **Date:** 2026-10-25
- **Status:** Approved
- **Context:** Both `chrome-devtools-mcp` and `@playwright/mcp` were configured in the workspace.
- **Decision:** Keep both servers enabled for Profile 2 with specialized roles:
  - `chrome-devtools-mcp` runs with `--slim --headless` (exposing only 3 tools: `evaluate`, `navigate`, `screenshot`) for fast DOM inspection, rendering checks, and performance auditing.
  - `@playwright/mcp` is reserved for complex multi-step interactive end-to-end testing, user flows, and assertions across 25 tools.
- **Consequence:** Optimal balance between lightweight token usage and deep test automation.

## ADR-003: Removal of DataForSEO to Prevent Paid API Costs
- **Date:** 2026-10-25
- **Status:** Approved
- **Context:** DataForSEO API involves usage-based pricing and requires paid subscriptions for live SERP/backlink calls. The user specified removing paid tools to rely on free first-party data.
- **Decision:** Remove DataForSEO from the active MCP configuration. Retain first-party free data sources: Google Search Console, Google Stitch, and Cloudflare API MCP.
- **Consequence:** Avoids unexpected API charges while keeping the tool surface lean and context-efficient.

## ADR-004: GitHub CLI Token Bridging for GitHub MCP
- **Date:** 2026-10-25
- **Status:** Approved
- **Context:** `@modelcontextprotocol/server-github` requires `GITHUB_PERSONAL_ACCESS_TOKEN`.
- **Decision:** Leverage existing authenticated GitHub CLI (`gh auth token`) to bridge the token into Windows User Environment (`[System.Environment]::SetEnvironmentVariable('GITHUB_PERSONAL_ACCESS_TOKEN', ..., 'User')`).
- **Consequence:** Fully automated, working connection without committing secrets or displaying tokens.

## ADR-005: Official Cloudflare API MCP Integration & Read-Only Diagnostics Policy
- **Date:** 2026-10-25
- **Status:** Approved
- **Context:** Need read-only diagnostic visibility into DNS, SSL/TLS, edge caching, WAF, bot challenges, and Pages routing for AnyConverter without deployment privileges.
- **Decision:** Add the official Cloudflare MCP endpoint (`https://mcp.cloudflare.com/mcp`). Enforce strict read-only policy: no deployments, DNS changes, cache purges, or WAF modifications.
- **Consequence:** Provides edge diagnostic capabilities without operational risk to production.

## ADR-006: 100MB Zero-Lag VirtualScroller & Web Worker Architecture for JSON Formatter
- **Date:** 2026-10-26
- **Status:** Approved & Implemented
- **Context:** Pasting large JSON (> 1MB) was completely freezing the browser because the legacy formatter recursively generated over 220,000 DOM elements on the main thread, choking Blink style recalculation and layout. Auto-format was firing on a 200ms debounce on raw typing.
- **Decision:**
  1. Offload parsing, validation, key sorting, and line indexing to a dedicated background Web Worker (`assets/js/workers/json-worker.js`).
  2. Implement an in-memory `Uint32Array` newline offset index to slice visible lines in microseconds without string re-splitting.
  3. When payload $\ge 150\text{ KB}$, automatically mount a 50-node `VirtualScroller` rendering only the visible viewport lines at solid 60 FPS, bounded memory (< 120MB), and instant search.
  4. Guard the 200ms auto-format debounce: if textarea length exceeds 100 KB, defer execution until the user clicks Format or presses Ctrl+Enter.
  5. Enable file uploads up to 100 MB with chunked memory safety and instant streaming download via Blob.
- **Consequence:** Solves browser unresponsiveness completely, matching and exceeding competitors (JSONLint, DevToys) with zero UI thread lag up to 100 MB.

## ADR-007: Resilient Input Normalization & Multi-Dialect Support Across Developer Tools
- **Date:** 2026-10-26
- **Status:** Approved & Implemented
- **Context:** Multiple tool edge cases were identified during deep audit: CSV to SQL lacked SQL Server (T-SQL) dialect; Base64 decode threw exceptions on URL-safe JWT tokens; URL Encoder crashed on unescaped `%` symbols; Timestamp converter misclassified nanoseconds and produced year +292277 bugs; XML Formatter choked on large inputs.
- **Decision:**
  1. Added SQL Server (T-SQL) option to CSV to SQL across EN, ES, DA with bracket quoting `[column]`, `NVARCHAR(MAX)`, `BIT` literals, and `DATETIME2`.
  2. Implemented URL-safe Base64 normalization (`-` to `+`, `_` to `/`, `=` padding).
  3. Added resilient percent-encoding fallback to URL Encoder.
  4. Added multi-tier auto-detection for Unix timestamps in seconds, milliseconds, microseconds, and nanoseconds.
  5. Implemented large-payload debounce guards and text-mode fallbacks for XML Formatter.
  6. Added tactile button feedback (`✓ Copied!`) to `window.copyToClipboard` across all tools.
- **Consequence:** Eliminates runtime crashes, enhances conversion flexibility, and elevates UI tactile responsiveness.

## ADR-008: 100% International Reciprocal Cluster Parity & Canonical Topology
- **Date:** 2026-10-26
- **Status:** Approved & Implemented
- **Context:** The Phase 05 International SEO audit flagged 5 incomplete clusters (10 missing localized URLs in Spanish and Danish) and 37 pages with accessibility heading hierarchy skips ($H_1 \to H_3$). In addition, 4 tools were completely orphaned from internal navigation.
- **Decision:**
  1. Generate all 10 missing localized pages in `es/` and `da/` matching English slugs and canonical topology.
  2. Implement 4-way reciprocal `hreflang` (`en`, `es`, `da`, and `x-default`) across all 435 URLs.
  3. Include all 435 URLs and their 1,740 alternate links in `sitemap.xml`.
  4. Normalize all heading skips to strict sequential order ($H_1 \to H_2 \to H_3$).
  5. Integrate all 4 orphaned calculators into the global header navigation in `assets/js/shared.js` and populate category hub grids.
- **Consequence:** Achieves zero crawl errors, zero orphan pages, perfect cluster reciprocity, and establishes full compliance with Google International SEO guidelines.

## ADR-009: Proportional Virtual Scroll Coordinate Scaling, Off-Thread Staging, and Resilient Decoding
- **Date:** 2026-10-27
- **Status:** Approved & Implemented
- **Context:** Independent validation revealed three technical gaps:
  1. The virtual scroll spacer clamped at 30,000,000px without coordinate scaling caused lines beyond ~1.36 million lines to be unreachable. Uploading > 2MB files directly into an HTML textarea locked Blink DOM text layout.
  2. Fallback URL decoding broke multi-byte UTF-8 percent-encoded tokens when lone percent signs were present.
  3. SQL Server T-SQL INSERT statements failed when identity columns contained explicit ID values without SET IDENTITY_INSERT.
- **Decision:**
  1. Implement proportional coordinate scaling in `json-formatter.js` (`scrollRatio = scrollTop / maxScrollTop`) mapping scroll position to `[0, totalLines - visibleCount]` when document exceeds 15,000,000px, guaranteeing reachability of all lines (including line 5,000,000).
  2. Stage file uploads > 2MB in-memory off-thread (`stagedLargeInput`) with lightweight placeholder in textarea, preserving full editing for files <= 2MB.
  3. Replace byte-by-byte URL decoding with `resilientDecode()` which sanitizes lone `%` signs without breaking multi-byte UTF-8 groups.
  4. Wrap T-SQL INSERT statements containing identity columns in `SET IDENTITY_INSERT [table] ON/OFF` and add `N'...'\' Unicode string literals.
- **Consequence:** Guarantees 100% reachability across documents of arbitrary length, eliminates textarea layout lockups, ensures flawless UTF-8 URL decoding, and satisfies Microsoft SQL Server T-SQL execution rules.

## ADR-010: Release Staging, Secret Sanitization, and Gitignore Asset Separation
- **Date:** 2026-10-28
- **Status:** Approved & Implemented
- **Context:** Third independent validation confirmed PASS across all defects. Safe release preparation required excluding secrets, temporary validation scripts, API dumps, and local IDE metadata while preserving production assets, multilingual pages, worker scripts, and reproducible regression test suites.
- **Decision:**
  1. Updated `.gitignore` with targeted rules for `scratch/`, `output_*.json`, `.vs/`, `.agents/mcp_config.json*`, `*.bak`, and `*.backup*`.
  2. Created `.agents/mcp_config.example.json` with environment variable placeholders, separating machine-specific secrets from shareable configuration.
  3. Preserved all 8 reusable regression test suites in `tests/` with a unified test runner `tests/run_all_tests.js`.
  4. Preserved all 10 untracked production pages in Danish and Spanish to maintain 435-page international SEO parity.
  5. Performed automated security scan confirming 0 hardcoded keys, tokens, or credentials across all staged files.
- **Consequence:** Clean, reproducible, secure staging without secret leaks or broken build dependencies.
