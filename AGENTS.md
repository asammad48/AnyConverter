# AGENTS.md — AnyConverter AI Agent Operating System

Welcome to AnyConverter. This document defines the permanent operating principles, MCP tooling policies, workflow definitions, and persistent memory protocol for all AI agents working on this codebase.

---

## 1. Project Overview & Objectives

**Repository:** `https://github.com/asammad48/AnyConverter`  
**Purpose:** High-performance, client-side web utility platform with dozens of conversion, calculation, and document tools.  
**Strategic Objectives:**
1. **Autonomous SEO Auditing:** Technical SEO health checks, schema compliance, metadata audits, crawlability, and indexing validation.
2. **Keyword & Competitor Research:** Search volume analysis, keyword difficulty, search intent alignment, and SERP competitive gap analysis.
3. **Intelligent Website Redesign:** Design-token consistency, responsive UI/UX refinement, visual hierarchy enhancement, and performance preservation.
4. **Functional Testing & Verification:** End-to-end browser automation, DOM regression checks, accessibility validation, and cross-viewport testing.
5. **Authority Research & Backlink Preparation:** Referring domain discovery, link-gap analysis, anchor profile auditing, and high-quality, compliant outreach drafting.

---

## 2. MCP Server Configuration & Profile Management

Context window efficiency is strictly enforced. **Do not run all MCP servers simultaneously.**

MCP configuration is defined in [`.agents/mcp_config.json`](file:///D:/SynergyRepo/AnyConverter/AnyConverter/.agents/mcp_config.json). Antigravity toggles servers via `"disabled": true / false`.

### The Three Operational Profiles

| Profile | Focus | Enabled Servers | Commands |
|---|---|---|---|
| **PROFILE 1: SEO RESEARCH** | Search performance, keywords, traffic | `google-search-console`, `dataforseo`, `google-analytics` | `node .agents/scripts/switch-profile.js seo` |
| **PROFILE 2: DESIGN & TESTING** | UI/UX inspection, testing, git PRs | `chrome-devtools`, `playwright`, `stitch`, `github` | `node .agents/scripts/switch-profile.js design` |
| **PROFILE 3: BACKLINK RESEARCH** | Competitor links, referring domains, outreach | `dataforseo` (optional: `ahrefs`, `gmail`) | `node .agents/scripts/switch-profile.js backlinks` |

To inspect active status:
```bash
node .agents/scripts/switch-profile.js status
```

### Browser Tooling Specialization
- **Chrome DevTools MCP (`chrome-devtools-mcp`):** Use for lightweight, fast DOM inspection, console error logs, Core Web Vitals, and responsive viewport checks (3 slim tools: `evaluate`, `navigate`, `screenshot`).
- **Playwright MCP (`@playwright/mcp`):** Use for multi-step interactive end-to-end functional testing, form submissions, complex user flows, and assertions across 25 tools.

---

## 3. Persistent Memory Protocol

Agents must never rely on chat history as the single source of truth. Before and after every session, follow this protocol:

### Step 1: Pre-Task Discovery
Before touching code or executing tasks:
1. Read [`.ai-memory/STATE.json`](file:///D:/SynergyRepo/AnyConverter/AnyConverter/.ai-memory/STATE.json) to load current active workflows, task states, blockers, and next steps.
2. Review the relevant memory file:
   - Architecture & Tooling: [`.ai-memory/ARCHITECTURE.md`](file:///D:/SynergyRepo/AnyConverter/AnyConverter/.ai-memory/ARCHITECTURE.md)
   - Visual System & UI: [`.ai-memory/DESIGN.md`](file:///D:/SynergyRepo/AnyConverter/AnyConverter/.ai-memory/DESIGN.md)
   - Business & Strategy: [`.ai-memory/PROJECT.md`](file:///D:/SynergyRepo/AnyConverter/AnyConverter/.ai-memory/PROJECT.md)
   - Past Architectural Decisions: [`.ai-memory/DECISIONS.md`](file:///D:/SynergyRepo/AnyConverter/AnyConverter/.ai-memory/DECISIONS.md)

### Step 2: In-Task Execution
- Always isolate code changes in feature branches (`codex/...` or `feat/...`).
- Never push directly to `main`.
- Store large research results, audit reports, and scraped datasets in dedicated workspace markdown or JSON files under `.ai-memory/` or `output/`, keeping conversation output compact.

### Step 3: Post-Task Memory Persistence
At the conclusion of each task:
1. Update [`.ai-memory/STATE.json`](file:///D:/SynergyRepo/AnyConverter/AnyConverter/.ai-memory/STATE.json) with updated phase progress, verification status, and timestamp.
2. Record any design or architectural choices in [`.ai-memory/DECISIONS.md`](file:///D:/SynergyRepo/AnyConverter/AnyConverter/.ai-memory/DECISIONS.md).
3. Update [`.ai-memory/HANDOFF.md`](file:///D:/SynergyRepo/AnyConverter/AnyConverter/.ai-memory/HANDOFF.md) with a clear, concise handoff for the next session.

---

## 4. Workflows

### Workflow 1: SEO-REDESIGN
- **Goal:** Audit on-page SEO, analyze Google Search Console and GA4 data, identify high-opportunity pages, redesign layouts with Google Stitch / UI-UX guidelines, and verify with Chrome DevTools and Playwright.
- **Rules:**
  - Preserve all existing tool functional logic and mathematical formulas.
  - Maintain URL canonical structure and schema markup.
  - Never break client-side performance or zero-dependency nature of tools.
  - Test responsive layouts at 375px (mobile), 768px (tablet), and 1280px (desktop).

### Workflow 2: BACKLINK-RESEARCH
- **Goal:** Research authority benchmarks, discover high-relevance referring domains, identify competitor backlink gaps, and prepare quality outreach target lists.
- **Rules:**
  - Strictly avoid spam, mass automated submissions, link networks, or black-hat outreach.
  - Paid API endpoints (DataForSEO, Ahrefs) require user cost approval before execution.
  - Outreach emails must only be prepared as drafts (never auto-sent).

---

## 5. Security & Credential Rules

1. **Zero Secret Leaks:** Never hardcode API keys, OAuth tokens, passwords, or secrets in tracked git files.
2. **Local Protected Storage:** Use Windows User environment variables (`HKCU\Environment`), Google Application Default Credentials (`gcloud auth application-default login`), or local untracked `.env` files.
3. **Audit Before Commit:** Always verify `git status` and `git diff` before committing.
