"""
Build GROWTH_TRACKING.xlsx — multi-sheet tracker companion to COMBINED_GROWTH_MASTER_PLAN.md
Run: python _build_tracking_xlsx.py
"""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.table import Table, TableStyleInfo

OUT = "GROWTH_TRACKING.xlsx"

HEADER_FILL = PatternFill("solid", fgColor="1F4E78")
HEADER_FONT = Font(bold=True, color="FFFFFF", size=11)
TITLE_FONT = Font(bold=True, size=14, color="1F4E78")
WRAP = Alignment(wrap_text=True, vertical="top")
THIN = Side(border_style="thin", color="BFBFBF")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

def add_sheet(wb, title, headers, rows, widths=None, title_text=None):
    ws = wb.create_sheet(title=title)
    r = 1
    if title_text:
        ws.cell(row=r, column=1, value=title_text).font = TITLE_FONT
        ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=len(headers))
        r += 2
    header_row = r
    for c, h in enumerate(headers, 1):
        cell = ws.cell(row=r, column=c, value=h)
        cell.font = HEADER_FONT
        cell.fill = HEADER_FILL
        cell.alignment = Alignment(wrap_text=True, vertical="center", horizontal="left")
        cell.border = BORDER
    r += 1
    for row in rows:
        for c, v in enumerate(row, 1):
            cell = ws.cell(row=r, column=c, value=v)
            cell.alignment = WRAP
            cell.border = BORDER
        r += 1
    if widths:
        for i, w in enumerate(widths, 1):
            ws.column_dimensions[get_column_letter(i)].width = w
    ws.freeze_panes = ws.cell(row=header_row + 1, column=1)
    ws.row_dimensions[header_row].height = 28
    return ws

wb = Workbook()
wb.remove(wb.active)

# ---------- 1. OVERVIEW ----------
ws = wb.create_sheet("Overview")
ws["A1"] = "AnyConverter.io — Growth Engine Tracker"
ws["A1"].font = Font(bold=True, size=18, color="1F4E78")
ws.merge_cells("A1:F1")
ws["A3"] = "Companion to docs/growth/COMBINED_GROWTH_MASTER_PLAN.md"
ws["A3"].font = Font(italic=True, color="595959")
ws.merge_cells("A3:F3")

overview_rows = [
    ("North-star metric", "Weekly Successful Tool Completions (WSTC)"),
    ("Scope", "Growth beyond SEO: retention, localization, extension, embeds, partners, OSS, PR"),
    ("Stack", "Static HTML + CSS + Vanilla JS on Cloudflare Pages (no frameworks, no build)"),
    ("Current locales", "EN / ES / DA"),
    ("Tool count (homepage)", "128"),
    ("Tool count (FAQ/press)", "78+ — reconcile via single source of truth"),
    ("Hard rules", "No fabricated data. No autonomous outreach/posting. Draft-only. Privacy-first. Preserve existing tools/URLs. No framework. Owner approves all external/irreversible actions."),
    ("Approval classes", "Read-only (auto) / Internal write (auto+audit) / Reversible external (tool-level) / Irreversible public (explicit human approval)"),
    ("Prepared", "2026-11-17"),
]
r = 5
for k, v in overview_rows:
    ws.cell(row=r, column=1, value=k).font = Font(bold=True)
    ws.cell(row=r, column=2, value=v).alignment = WRAP
    ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=6)
    r += 1

ws.cell(row=r+1, column=1, value="Sheets in this workbook").font = Font(bold=True, size=12, color="1F4E78")
sheets_desc = [
    ("Overview", "This page."),
    ("Phases", "Phase 0 through Phase 8 — scope, outcome, gate, status."),
    ("Backlog", "GROW-001 through GROW-030 — unified backlog with priority, effort, status."),
    ("Roadmap_90d", "Days 1-15 / 16-30 / 31-60 / 61-90 deliverables."),
    ("MCP_Connections", "Integration status matrix — GSC, GA4, Ahrefs, Apollo, Cloudflare, GitHub, Gmail."),
    ("KPIs", "North star + supporting metrics + 90-day targets."),
    ("Events", "Event dictionary — allowed metadata, forbidden metadata."),
    ("Experiments", "EXP-001..005 registry schema."),
    ("Locales", "Candidate market scoring: pt-BR / id / tr / vi / pl / ar / hi / th / bn."),
    ("Prospects", "Verified resource-page + directory + community prospects."),
    ("Agents", "Agent roster: cadence, inputs, outputs, side-effect class."),
    ("Approvals", "Owner approval queue."),
    ("Gates", "Release-gate matrix."),
    ("Deliverables", "docs/growth/ file tree + status."),
    ("Templates", "Outreach template library."),
    ("Risks", "Risk/dependency register."),
]
r += 2
for s, d in sheets_desc:
    ws.cell(row=r, column=1, value=s).font = Font(bold=True)
    ws.cell(row=r, column=2, value=d).alignment = WRAP
    ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=6)
    r += 1

ws.column_dimensions["A"].width = 26
for col in "BCDEF":
    ws.column_dimensions[col].width = 22

# ---------- 2. PHASES ----------
phases_headers = ["Phase", "Name", "Outcome", "Key tasks", "Gate", "Priority", "Status", "Owner", "Target end", "Notes"]
phases_rows = [
    ("Phase 0", "Repo/MCP/Product reality audit", "Precise starting point; no premature code changes.",
     "0.1 Source+workflow · 0.2 MCP availability · 0.3 Live site verification across widths/locales",
     "PASS/FAIL/BLOCKED/NOT TESTED distinguished; critical blockers surfaced", "P0", "Not started", "", "", "Produces 00..05 docs"),
    ("Phase 1", "Analytics + experimentation foundation", "Trustworthy baseline + privacy-safe tracking + experiment registry.",
     "1.1 Real baseline (GSC/GA4) · 1.2 Event adapter + dictionary · 1.3 experiments.csv + protocol",
     "Prod analytics changes gated by privacy review + owner approval", "P0", "Not started", "", "", "No PII in events"),
    ("Phase 2", "Language & market expansion research", "Evidence-based pilot locale selection OR defer.",
     "2.1 Native keyword map · 2.2 Competitor teardown · 2.3 Weighted market scoring · 2.4 Pilot spec",
     "No prod publish / sitemap change until evidence + native QA + regression pass + approval", "P1", "Not started", "", "", "pt-BR vs id vs ES/DA required"),
    ("Phase 3", "Retention & product-led growth", "Repeat usage without registration obstacles.",
     "3.1 Favorites/recents audit · 3.2 Shareable calculator state · 3.3 PWA feasibility · 3.4 Tool-to-tool flows",
     "No success-rate regression; no forced signup; no unbounded storage", "P1", "Not started", "", "", "Explicit opt-in for sensitive presets"),
    ("Phase 4", "Chrome/Edge extension distribution", "Functional JSON Toolkit MVP (not URL launcher).",
     "MV3 minimal perms · test vectors · store listing · privacy policy · submission checklist",
     "Browser perm/security review + 100% core test-case pass", "P1", "Not started", "", "", "Chrome Web Store single-purpose compliant"),
    ("Phase 5", "Embeddable tools + B2B/B2EDU distribution", "Secure, useful embeds + partner guide.",
     "Percentage + Date-Diff pilots · /embed/ route · frame/CSP policy · EMBED_PARTNER_GUIDE",
     "One pilot partner sandbox test + secure frame policy", "P1", "Not started", "", "", "No forced keyword-rich backlink"),
    ("Phase 6", "Partnerships, communities & content distribution", "Qualified prospect DB + draft-only outreach + rule-aware community map + 12-week calendar + ethical PR.",
     "6.1 Prospect CSV · 6.2 Outreach drafts · 6.3 Community research · 6.4 Video calendar · 6.5 Earned coverage",
     "Nothing sent/posted without explicit owner approval; no scraped contacts", "P1-P2", "Not started", "", "", "Suppression list enforced globally"),
    ("Phase 7", "Developer distribution: npm/CLI/MCP", "Validation-first optional stream.",
     "Evaluate A/B/C · RFC + tests + README + license + maintenance budget",
     "No publish without approval; no unauthorized license change", "P2", "Not started", "", "", "Pick one only after demand evidence"),
    ("Phase 8", "Monetization without destroying trust", "Research-first; no live payment integration without approval.",
     "Ad placement UX · sponsored · B2B · premium batch · pro convenience · ethical affiliate",
     "No new ad slots/paywalls/registration walls/popups/affiliate without UX+privacy review", "P3", "Not started", "", "", "Audience + policy compliance first"),
]
add_sheet(wb, "Phases", phases_headers, phases_rows,
          widths=[10, 36, 36, 50, 46, 10, 14, 14, 14, 36], title_text="Phases 0–8")

# ---------- 3. BACKLOG ----------
backlog_headers = ["ID", "Priority", "Action", "Output", "Done when", "Effort (S/M/L/XL)", "Status", "Owner", "PR/Branch", "Blockers", "Next step"]
backlog_rows = [
    ("GROW-001", "P0", "Repo + MCP audit", "Evidence-backed report", "Source state + access verified", "S", "Not started", "", "", "", ""),
    ("GROW-002", "P0", "GSC/GA4 baseline (28/90-day)", "Baseline doc or documented blockers", "Sources/windows/limits disclosed", "M", "Not started", "", "", "", ""),
    ("GROW-003", "P0", "UX release blockers triage", "Repro + test matrix + focused fixes", "Critical journeys pass", "M", "Not started", "", "", "", ""),
    ("GROW-004", "P0", "Event dictionary + instrumentation", "Shared adapter + tests", "Tool successes measured without PII", "M", "Not started", "", "", "", ""),
    ("GROW-005", "P1", "Local-language market research", "Native keyword + SERP dataset", "Ranked with evidence + unknowns", "L", "Not started", "", "", "", ""),
    ("GROW-006", "P1", "One-locale 10-20 tool pilot", "Branch + localized pages + tests", "Native QA, parity, URLs verified", "L", "Not started", "", "", "", ""),
    ("GROW-007", "P1", "Favorites/recents audit", "Improvement spec or no-change memo", "No regression to localized favorites", "S", "Not started", "", "", "", ""),
    ("GROW-008", "P1", "Shareable low-risk calculator state", "Working controlled link flow", "Rehydrates correctly; no private values", "M", "Not started", "", "", "", ""),
    ("GROW-009", "P1", "JSON extension MVP (MV3)", "Unpacked MV3 package", "Local JSON format; narrow permissions", "L", "Not started", "", "", "", ""),
    ("GROW-010", "P1", "Two calculator embeds", "Embeddable /embed/ routes + snippets", "Securely works on sample partner page", "M", "Not started", "", "", "", ""),
    ("GROW-011", "P1", "Partner prospect database", "Verified use-case-matched prospects", "Sources valid; no nonpublic data", "L", "Not started", "", "", "", ""),
    ("GROW-012", "P1", "Outreach draft pack (5 templates × segments)", "Localized tailored drafts", "Owner has unsent reviewable drafts", "M", "Not started", "", "", "", ""),
    ("GROW-013", "P2", "Community research (rules + fit)", "Rule-aware opportunity map", "No autonomous posts; drafts only", "M", "Not started", "", "", "", ""),
    ("GROW-014", "P2", "12-week video calendar", "Scripts + UTM plan", "Exact tool/demo + measurement for each", "M", "Not started", "", "", "", ""),
    ("GROW-015", "P2", "PWA feasibility", "Tested prototype OR rejection memo", "Cache/update risk documented", "M", "Not started", "", "", "", ""),
    ("GROW-016", "P2", "JS package / CLI / MCP RFC (pick 1)", "Prioritized prototype RFC", "Demand + maintenance + security evidenced", "L", "Not started", "", "", "", ""),
    ("GROW-017", "P2", "Monetization research", "Revenue/UX risk assessment", "No live ads/payments changed", "S", "Not started", "", "", "", ""),
    ("GROW-018", "P0", "Independent release-gate evidence", "Per-feature test evidence pack", "No unsupported 'verified' claims", "M", "Not started", "", "", "", ""),
    ("GROW-019", "P1", "Post-launch experiment decisions", "Keep/iterate/kill dashboard", "Decisions based on real data", "S", "Not started", "", "", "", ""),
    ("GROW-020", "P0", "Fix 128 vs 78 tool-count inconsistency", "Single source-of-truth generator", "Homepage / FAQ / press synchronized", "S", "Not started", "", "", "", "From deep-research"),
    ("GROW-021", "P0", "ES/DA translation QA (accents + idioms)", "Fixed native copy + native reviewer sign-off", "No 'practicos / utiles / nar / daekker / vaelge'-style errors", "M", "Not started", "", "", "", "From deep-research"),
    ("GROW-022", "P0", "GitHub repo About + topics + README", "Discoverable repo metadata", "About filled, topics set, README polished", "S", "Not started", "", "", "", "Suggested topics: developer-tools pdf-tools calculators ..."),
    ("GROW-023", "P0", "Remove node_modules from source control", "Clean repo + .gitignore + deterministic manifest", "Verified clean history/ignore", "S", "Not started", "", "", "", "Unless deliberately vendored"),
    ("GROW-024", "P1", "Opportunity DB + CRM schema", "Running DB + dedupe + audit log", "Schema deployed; agents write audited", "L", "Not started", "", "", "", "Dedupe: domain+contact+tool+type"),
    ("GROW-025", "P1", "Approval gateway + content-hash tokens + suppression list", "Service + UI + never_contact table", "Every irreversible action gated", "L", "Not started", "", "", "", "sha256 of content; expiry"),
    ("GROW-026", "P1", "Agent orchestrator + scheduler", "Running runtime", "Cron jobs for read-only agents live", "L", "Not started", "", "", "", "No external side effects by default"),
    ("GROW-027", "P1", "Flagship linkable assets (3)", "Dev JSON pack + Finance teaching pack + PDF privacy page", "Published + indexed", "L", "Not started", "", "", "", "Days 16-30 priority"),
    ("GROW-028", "P1", "First 20 resource-page outreach batch", "Reviewed, approved, manually sent", "Replies tracked in CRM", "M", "Not started", "", "", "", "Must be explicitly approved"),
    ("GROW-029", "P2", "Backlink-gap weekly job", "Report with scored opportunities", "4 weekly runs completed", "M", "Not started", "", "", "", "Needs Ahrefs read-only"),
    ("GROW-030", "P2", "Product Hunt / DevHunt platform launch", "Launch page + founder profile", "Launched with real metrics tracked", "M", "Not started", "", "", "", "Approval required"),
]
add_sheet(wb, "Backlog", backlog_headers, backlog_rows,
          widths=[11, 9, 40, 40, 44, 11, 14, 14, 18, 24, 30], title_text="Unified Backlog (GROW-001..030)")

# ---------- 4. ROADMAP ----------
roadmap_headers = ["Window", "Research", "Build", "QA", "Outreach / Distribution", "Output artifacts", "Gate", "Status"]
roadmap_rows = [
    ("Days 1-15 — Truth & foundation",
     "Repo/MCP audit · GSC+GA4 baseline · tool completion metrics · UX blockers · language shortlist",
     "Event adapter + initial instrumentation (consent) · fix 128-vs-78 · GitHub About/topics/docs · ES/DA translation QA · canonical/hreflang/sitemap validation",
     "Current UX + tool baseline · measurable release gates defined",
     "— (no outreach yet)",
     "Baseline docs · KPI dictionary · defect backlog · experiment registry · phase plan",
     "No new locale at scale · no outreach publish · no site rebuild",
     "Not started"),
    ("Days 16-30 — Validate intl + flagship assets",
     "Candidate-market native keyword map · SERP competitors · locale economics · ES/DA comparison",
     "Localized pilot branch (post-selection) · one shareable low-risk calculator · 3 flagship assets (dev JSON pack, finance teaching pack, PDF privacy page)",
     "Native copy + function · canonical/hreflang · mobile perf · query/state safety",
     "Manually pitch first 20 resource-page prospects (approved)",
     "Market scorecard · 10-20 tool pilot · native review checklist · decision memo",
     "Publish only after evidence + approval",
     "Not started"),
    ("Days 31-60 — Distributed product + scaffolding",
     "Qualified prospects · host compatibility · niche community rules",
     "JSON Formatter extension MVP · two embed pilots · optional PWA feasibility prototype",
     "Extension security · embed frame/CSP · privacy · responsive · regression",
     "Apollo in prospecting read-only mode · email drafts queued (Gmail send DISABLED) · weekly competitor backlink-gap jobs · Product Hunt / DevHunt platform launch",
     "Unpacked extension · integration demo · outreach drafts · tracking instructions · 12-week video calendar",
     "No external publication / sends without explicit approval",
     "Not started"),
    ("Days 61-90 — Measure, iterate, controlled sending",
     "First conversion/completion data · optional npm/CLI/MCP RFC on signals",
     "Validated fixes · improvements",
     "Approved release regression · deliverability",
     "Enable Gmail sending only after deliverability+compliance+quality proven · approval-batched outreach (12 university / 8 dev / 5 editor / 5 integration) · max 1-2 follow-ups · stop on opt-out · PR around original data/benchmarks",
     "Experiment results · updated strategy · next-quarter allocation · revised dashboard + backlog",
     "No invented success claims · no scaling without data",
     "Not started"),
]
add_sheet(wb, "Roadmap_90d", roadmap_headers, roadmap_rows,
          widths=[26, 36, 46, 32, 46, 40, 36, 12], title_text="90-Day Roadmap")

# ---------- 5. MCP CONNECTIONS ----------
mcp_headers = ["System", "Purpose", "Default permission", "Endpoint / notes", "Priority", "Current status", "Owner approval to connect?", "Next action"]
mcp_rows = [
    ("Public web / search", "Prospect research, policy checks, discovery", "Public read", "—", "Required", "Verified accessible", "No", "—"),
    ("GitHub public repo", "Architecture, content, SEO source inspection", "Public read", "github.com/asammad48/AnyConverter", "Required", "Verified public", "No", "—"),
    ("GitHub app/MCP", "Branches, issues, draft PRs, repo intelligence", "Repo read; PR creation later", "Reported connected (not callable in deep-research run)", "High", "Verify in this session", "No (read); Yes (PR)", "Confirm callable; load schemas"),
    ("Google Search Console", "Query/page/indexing performance, URL inspection", "Read-only (Search Analytics + URL Inspection)", "Official API; community MCP exists", "Critical", "Not connected", "Yes (OAuth consent)", "Set up OAuth read-only scope"),
    ("Google Analytics 4", "Channel, engagement, retention, conversions", "Read-only first", "—", "Critical", "Not verified", "Yes", "Grant read-only property access"),
    ("Ahrefs MCP", "Backlink gap, lost links, competitor domains, keyword gaps", "Read-only API", "Official hosted MCP", "Critical", "Not connected", "Yes (paid subscription)", "Approve subscription + connect"),
    ("Apollo.io MCP", "Company/contact discovery (research only)", "Search/read contacts only initially", "https://mcp.apollo.io/mcp", "High", "Not connected", "Yes (paid)", "Approve + connect read-only"),
    ("Cloudflare MCP", "Analytics, deployment diagnostics, security", "Analytics/read only", "https://mcp.cloudflare.com/mcp", "Medium", "Not accessible", "Yes", "Connect read-only"),
    ("Gmail", "Approved outreach sending + replies", "Drafts/read; send requires approval", "—", "High (later)", "Not used without approval", "Yes (explicit, 2-stage)", "Draft-only first; send after workflow proven"),
    ("CRM / opportunity DB", "Canonical prospect/action ledger", "DB CRUD; agent writes audited", "Build internal", "Critical", "Missing", "No", "Implement schema (see Agents sheet)"),
    ("Chrome DevTools / Playwright", "Rendered-page validation, link checks, forms", "Read / navigate; no submit by default", "Local/staging", "High", "Not exposed", "No (local)", "Use locally"),
    ("DataForSEO / Semrush", "Keyword / SERP / competition", "Read-only; approve before paid calls", "—", "Medium", "Not connected", "Yes (paid)", "Only if Ahrefs insufficient"),
    ("Google Trends", "Relative interest only", "Public read", "—", "Low", "Public", "No", "Never call index = volume"),
    ("Scheduler / orchestrator", "Daily/weekly agent jobs", "Trigger workflows; no external side effects", "Build internal", "Critical", "Missing", "No", "Implement runtime"),
    ("Slack / Teams / Telegram", "Approvals + incident alerts", "Post approval cards only", "—", "Recommended", "Missing", "Yes", "Choose channel + bot"),
    ("Browser-store accounts (Chrome, Edge)", "Extension distribution", "No submit without approval", "—", "High (Phase 4)", "N/A", "Yes", "Only after Gate 4 pass"),
    ("YouTube / creator channels", "Planned content distribution", "No publish without approval", "—", "Medium (Phase 6)", "N/A", "Yes", "Draft calendar only"),
]
add_sheet(wb, "MCP_Connections", mcp_headers, mcp_rows,
          widths=[26, 36, 32, 40, 12, 20, 22, 36], title_text="MCP / External Data Connection Matrix")

# ---------- 6. KPIs ----------
kpi_headers = ["Metric", "Definition", "Why it matters", "Baseline", "90-day target", "Owner", "Source", "Notes"]
kpi_rows = [
    ("WSTC (North Star)", "Weekly Successful Tool Completions — per-category definition", "Measures whether users solved a problem", "TBD", "TBD after baseline", "", "GA4 / adapter", "Define per tool category"),
    ("Tool-start rate", "tool_started sessions / eligible tool-page sessions", "Activation UX", "TBD", "TBD", "", "GA4", ""),
    ("Completion rate", "tool_completed / tool_started", "Detect abandonment", "TBD", "TBD", "", "GA4", ""),
    ("Tool failure rate", "tool_failed / (tool_failed + tool_completed)", "Product trust", "TBD", "TBD", "", "GA4", "Generic error_code only"),
    ("7-day return rate", "Returning cohort within 7 days (consented)", "Retention", "TBD", "TBD", "", "GA4", ""),
    ("30-day return rate", "Returning cohort within 30 days (consented)", "Retention", "TBD", "TBD", "", "GA4", ""),
    ("Partner-referral users", "Visits tagged with approved utm_*", "Non-search growth", "0", "TBD", "", "GA4 UTM", ""),
    ("Embed engagement", "Distinct host domains + events (consent)", "Distributed usage", "0", "TBD", "", "Adapter (embed)", "Embed op ≠ visit"),
    ("Extension active ops", "Aggregate local ops per week (consent)", "Repeat distribution", "0", "TBD", "", "Extension telemetry", "No JSON content logged"),
    ("RPM", "Revenue / 1k sessions", "Commercial quality", "TBD", "TBD", "", "AdSense + GA4", ""),
    ("Return visitor completion", "Completions from return cohort / return cohort", "Stickiness", "TBD", "TBD", "", "GA4", ""),
    ("Locale ROI", "Incremental completions / (build + maintenance cost)", "Expansion decision", "N/A", "Post-pilot measurable", "", "Finance + GA4", ""),
    ("Defect density", "Confirmed UX/functional defects / 100 journeys", "Reliability", "TBD", "↓", "", "QA register", ""),
    ("Non-brand organic clicks", "Non-brand clicks from GSC", "Search growth", "TBD", "+20-50% from baseline (contingent)", "", "GSC", ""),
    ("Impressions", "GSC impressions on non-brand queries", "Visibility", "TBD", "↑", "", "GSC", ""),
    ("Indexed tool pages", "Pages indexed by Google", "Reach", "TBD", "↑ with validated locale", "", "GSC", ""),
    ("Editorial referring domains", "Relevant editorial links", "Authority", "TBD", "10-30 new", "", "Ahrefs + CRM", "Diagnostic only"),
    ("DR / DA trend", "3rd-party authority score", "Diagnostic", "TBD", "↑", "", "Ahrefs / Moz", "NOT a Google ranking factor"),
    ("Qualified prospects researched", "Entries in CRM prospects table", "Pipeline", "0", "500-1,000", "", "CRM", ""),
    ("Manually approved outreach contacts", "contacts with approval token", "Pipeline health", "0", "100-200", "", "CRM", ""),
    ("High-quality personalised emails", "Emails sent after QA approval", "Output", "0", "80-150", "", "CRM", "Only after Gmail send approved"),
    ("Positive/relevant replies", "Reply outcome = positive", "Effectiveness", "0", "8-20%", "", "CRM", ""),
    ("Editorial/resource links won", "Placements classified editorial", "Primary outcome", "0", "10-30", "", "Validator agent", ""),
    (".edu/institutional links won", "Placements on .edu / institutional", "Quality", "0", "2-8", "", "Validator agent", ""),
    ("Partnerships / embeds", "Live embed partners + integrations", "Distribution", "0", "3-10", "", "CRM + embed telemetry", ""),
    ("New referring domains", "Ahrefs new RD / month", "Link velocity", "TBD", "20-50", "", "Ahrefs", ""),
    ("Referral sessions from won placements", "GA4 referral visits attributable", "Real-world impact", "0", "Rising MoM", "", "GA4", ""),
    ("Spam / community violations", "Reports / strikes received", "Compliance", "0", "0", "", "Audit log", "ZERO tolerance"),
    ("Opt-outs ignored", "Suppression-list violations", "Compliance", "0", "0", "", "Audit log", "ZERO tolerance"),
]
add_sheet(wb, "KPIs", kpi_headers, kpi_rows,
          widths=[28, 44, 28, 14, 24, 14, 18, 26], title_text="North Star + Supporting KPIs")

# ---------- 7. EVENTS ----------
event_headers = ["Event", "When fired", "Allowed metadata", "Forbidden metadata", "Dedupe rule", "Surfaces", "Notes"]
event_rows = [
    ("tool_viewed", "On tool page view (optional)", "tool_id, tool_category, locale, surface", "URL query strings with sensitive values", "Suppress if duplicates page_view", "web, pwa", "Skip if redundant"),
    ("tool_started", "First meaningful interaction (file selected, text entered)", "tool_id, tool_category, locale, interaction_type", "input contents, filenames, pasted text", "First per tool session", "web, pwa, extension", ""),
    ("tool_completed", "After successful operation producing usable result", "tool_id, result_type, locale", "result payload, filenames, financial values", "One per success", "web, pwa, embed, extension", "Measure AFTER actual success, not click"),
    ("tool_failed", "Operation fails / aborts", "tool_id, generic error_code, locale", "stack traces with user data, raw payloads", "Throttle to 1/min/type", "web, pwa, embed, extension", "Generic error_code only"),
    ("result_copied", "User copies result", "tool_id, result_type", "copied content", "One per copy action", "web, pwa", ""),
    ("result_downloaded", "Download finalized", "tool_id, result_type, file_size_bucket", "filenames, contents", "One per download", "web, pwa", "Bucket size, don't log exact"),
    ("result_shared", "Explicit share clicked", "tool_id, share_target", "URL fragments with sensitive params", "One per share action", "web, pwa", "Never auto-share"),
    ("favorite_added", "User favorites a tool", "tool_id, locale", "—", "One per add", "web, pwa", ""),
    ("favorite_removed", "User removes favorite", "tool_id, locale", "—", "One per remove", "web, pwa", ""),
    ("preset_saved", "User saves a preset (opt-in)", "tool_id, preset_schema_version", "preset values with sensitive inputs", "One per save", "web, pwa", "Opt-in explicit"),
    ("pwa_install_prompt_shown", "Install prompt displayed", "surface, locale", "—", "One per session", "pwa", ""),
    ("pwa_install_accepted", "User accepts install", "surface, locale", "—", "One per install", "pwa", ""),
    ("extension_opened", "Extension popup opened", "surface, locale", "page URL, page contents", "Session-throttled", "extension", "Only if measurable without invasive tracking"),
    ("embed_loaded", "Embed iframe loads on host", "tool_id, host_domain_hash (if consented), locale", "full host URL, query strings", "One per iframe load", "embed", "Respect consent"),
    ("embed_operation_completed", "Embed tool completes op", "tool_id, result_type, locale", "operation payload", "One per success", "embed", ""),
    ("outbound_partner_click", "Click on tracked partner link", "partner_id, utm_*", "URL query strings beyond UTM", "One per click", "web, pwa", ""),
]
add_sheet(wb, "Events", event_headers, event_rows,
          widths=[26, 34, 38, 36, 24, 20, 28], title_text="Event Dictionary (Privacy-Safe)")

# ---------- 8. EXPERIMENTS ----------
exp_headers = ["id", "hypothesis", "audience", "locale", "primary_metric", "guardrail_metric", "baseline", "start_date", "end_date", "decision", "status", "owner", "evidence"]
exp_rows = [
    ("EXP-001", "Clearer favorites/recents affordance increases repeat tool starts", "Consented returning visitors", "EN/ES/DA", "Tool starts per return visit", "Completion rate; CLS; support complaints", "TBD", "", "", "", "Planned", "", ""),
    ("EXP-002", "Small native-language cluster beats comparable ES/DA investment on cost per successful completion", "Pilot locale cohort", "TBD (pt-BR or id)", "Cost per successful completion", "Maintenance burden; completion rate", "TBD", "", "", "", "Planned", "", ""),
    ("EXP-003", "Selected publishers generate incremental embed operations + qualified referrals", "Partner-site visitors", "EN", "Verified embed ops OR qualified referrals (chosen in advance)", "Host usability; privacy; support; frame issues", "0", "", "", "", "Planned", "", ""),
    ("EXP-004", "Narrow JSON extension delivers recurring developer usage more efficiently than new tool", "Chrome/Edge users", "EN", "Weekly active extension operations (consent-respecting)", "Uninstalls; permission clarity; error rate", "0", "", "", "", "Planned", "", ""),
    ("EXP-005", "Problem-specific demos > generic brand promo", "Social/YouTube audience", "EN (initial)", "Completions per measurable campaign session", "Production effort; audience mismatch; retention", "0", "", "", "", "Planned", "", ""),
]
add_sheet(wb, "Experiments", exp_headers, exp_rows,
          widths=[10, 42, 24, 18, 28, 28, 12, 14, 14, 14, 12, 14, 24], title_text="Experiment Registry")

# ---------- 9. LOCALES ----------
loc_headers = ["Locale", "Market", "Initial hypothesis", "Risk",
               "Verified demand (25%)", "SERP gap (20%)", "Product fit / effort (15%)", "Repeat usage (15%)",
               "Non-SEO distribution (10%)", "Commercial sustainability (10%)", "Technical/legal risk (5%)",
               "Weighted score /5", "Confidence", "Recommendation"]
loc_rows = [
    ("pt-BR", "Brazil", "Calculators, invoices, PDF, utilities", "Highly competitive generics; finance complexity", "", "", "", "", "", "", "", "", "", ""),
    ("id", "Indonesia", "Mobile audience; documents, education, text, productivity", "Price sensitivity; mobile perf", "", "", "", "", "", "", "", "", "", ""),
    ("tr", "Türkiye", "Finance, text, business, calculators", "Local financial assumptions; terminology change", "", "", "", "", "", "", "", "", "", ""),
    ("vi", "Vietnam", "Documents, education, image, office workflows", "Native terminology; mobile", "", "", "", "", "", "", "", "", "", ""),
    ("pl", "Poland", "Professional finance, docs, dev utilities", "Smaller audience; strong incumbents", "", "", "", "", "", "", "", "", "", ""),
    ("ar", "MENA (country-specific)", "Utilities, students", "RTL + dialect/market differences", "", "", "", "", "", "", "", "", "", ""),
    ("hi-IN", "India", "Educational/consumer", "Bilingual/Hinglish; language ≠ population", "", "", "", "", "", "", "", "", "", ""),
    ("th", "Thailand", "Localized utilities", "Typography, search ecosystem", "", "", "", "", "", "", "", "", "", ""),
    ("bn-BD", "Bangladesh", "Educational/office calculators", "Monetization + localization validation needed", "", "", "", "", "", "", "", "", "", ""),
    ("es (existing, improve)", "Spain / LatAm", "Translation QA + content depth", "Drift already observed", "", "", "", "", "", "", "", "", "", ""),
    ("da (existing, improve)", "Denmark", "Translation QA + content depth", "Drift already observed", "", "", "", "", "", "", "", "", "", ""),
]
add_sheet(wb, "Locales", loc_headers, loc_rows,
          widths=[12, 20, 36, 32, 16, 14, 18, 16, 20, 20, 18, 14, 12, 24], title_text="Market Scoring (fill after research)")

# ---------- 10. PROSPECTS ----------
pros_headers = ["#", "Prospect", "Category", "Country/Lang", "Why it fits", "Suggested asset / action", "Confidence", "Opportunity type", "Status", "Owner", "Contact source (public)", "Approval status", "Notes"]
pros_rows = [
    (1, "Stockton University financial-literacy", "University / finance", "US / EN", "Curates external financial calculators", "Pitch ad-free percentage/compound/loan + methodology page", "High", "Resource page", "Prospect", "", "", "Pending", ""),
    (2, "University of Cincinnati Finance LibGuide", "University / finance", "US / EN", "Links external financial calculator sites", "Pitch calculator hub as additional free resource", "High", "Resource page", "Prospect", "", "", "Pending", ""),
    (3, "UTSA Finance & Investment LibGuide", "University / finance", "US / EN", "Lists external calculator resources", "Pitch finance-calculator hub", "High", "Resource page", "Prospect", "", "", "Pending", ""),
    (4, "Youngstown State maths resources", "University / maths", "US / EN", "Explicit 'Online Calculators' section", "Pitch slope/percentage/math tools", "High", "Resource page", "Prospect", "", "", "Pending", ""),
    (5, "Unity Environmental University", "University / calculators", "US / EN", "Curated online calculator page", "Pitch targeted calculator subset", "High", "Resource page", "Prospect", "", "", "Pending", ""),
    (6, "University of New Hampshire ref guide", "University / converters", "US / EN", "Section 'Calculators, Converters & Statistics'", "Pitch conversion/calculator hub", "High", "Resource page", "Prospect", "", "", "Pending", ""),
    (7, "SIUE file-conversion resources", "University / PDF/convert", "US / EN", "Recommends free external conversion tools", "Pitch browser-side PDF conversion tools", "High", "Resource page", "Prospect", "", "", "Pending", ""),
    (8, "SIUE free-PDF-tools article", "University / PDF", "US / EN", "Already recommends a third-party free PDF service", "Strongest PDF resource-replacement prospect", "Very High", "Resource page", "Prospect", "", "", "Pending", ""),
    (9, "Duke CS resources", "University / dev", "US / EN", "Lists JSON formatter resources; invites useful tools", "Pitch JSON formatter/compare/JWT/Base64 + OSS link", "Very High", "Resource page", "Prospect", "", "", "Pending", ""),
    (10, "Johns Hopkins SE resources", "University / dev", "US / EN", "References a JSON formatter among dev tooling", "Pitch dev-tools hub only if materially stronger", "Medium", "Resource page", "Prospect", "", "", "Pending", ""),
    (11, "UW CSE course resources", "University / dev", "US / EN", "Historical course pages list JSON formatter", "Pitch current privacy-first JSON tool to course owner", "Medium", "Resource page", "Prospect", "", "", "Pending", ""),
    (12, "Binghamton financial self-service", "University / finance", "US / EN", "Publishes external calculator resources", "Pitch finance-calculator collection", "High", "Resource page", "Prospect", "", "", "Pending", ""),
    (13, "UCSD financial resources", "University / finance", "US / EN", "Maintains calculator/planning links", "Pitch finance tools selectively", "High", "Resource page", "Prospect", "", "", "Pending", ""),
    (14, "University of North Georgia financial wellness", "University / finance", "US / EN", "External calculator section", "Pitch student-friendly finance calculators", "High", "Resource page", "Prospect", "", "", "Pending", ""),
    (15, "Sullivan University personal-finance LibGuide", "University / finance", "US / EN", "Specifically curates calculator websites", "Strong calculator-directory outreach", "Very High", "Resource page", "Prospect", "", "", "Pending", ""),
    (16, "Product Hunt", "Launch platform", "Global / EN", "Permanent product page + active product launch ecosystem", "Launch AnyConverter as PLATFORM (not 128 individual submissions)", "High", "Directory / launch", "Prospect", "", "", "Pending", ""),
    (17, "DevHunt", "Launch platform (dev)", "Global / EN", "Developer-tool focused", "Launch dev-tool suite or distinct dev product", "High", "Directory / launch", "Prospect", "", "", "Pending", ""),
    (18, "SaaSHub", "Software directory", "Global / EN", "Software/product discovery; explicit no-AI-automation rule", "Manual founder submission", "Medium", "Directory", "Prospect", "", "", "Pending", ""),
    (19, "AlternativeTo", "Alternatives directory", "Global / EN", "Software alternative directory", "Platform-wide listing if editorial rules allow", "Medium", "Directory", "Prospect", "", "", "Pending", ""),
    (20, "Uneed", "Launch platform", "Global / EN", "Product launch/discovery", "Submit platform; respect launch rules", "Medium", "Directory / launch", "Prospect", "", "", "Pending", ""),
    (21, "Peerlist Launchpad", "Launch (dev/maker)", "Global / EN", "Developer/maker audience", "Launch dev-facing subset + founder profile", "Medium", "Directory / launch", "Prospect", "", "", "Pending", ""),
    (22, "Hacker News (Show HN)", "Community", "Global / EN", "Qualified technical referral traffic", "Only genuinely interesting technical story; never promotion-first", "Medium", "Community", "Prospect", "", "", "Pending", ""),
    (23, "GitHub repo (AnyConverter)", "Self-asset", "Global / EN", "Direct developer discovery + trust", "Improve About/topics/README/examples/CONTRIBUTING", "Very High", "Self-asset", "In progress (GROW-022)", "", "github.com/asammad48/AnyConverter", "N/A", ""),
    (24, "Stanford IFDM calculators", "University / finance", "US / EN", "Benchmark + collaboration potential", "Benchmark + non-generic collaboration pitch", "Medium", "Resource page", "Prospect", "", "", "Pending", ""),
    (25, "Stanford Mind Over Money", "University / finance", "US / EN", "Finance education", "Partnership / resource inspiration", "Medium", "Resource page", "Prospect", "", "", "Pending", ""),
    (26, "U.Penn financial wellness", "University / finance", "US / EN", "Finance education", "Resource-page prospect", "Medium", "Resource page", "Prospect", "", "", "Pending", ""),
    (27, "U.Wisconsin resources", "University / finance", "US / EN", "Finance education", "Tool-resource prospect", "Medium", "Resource page", "Prospect", "", "", "Pending", ""),
    (28, "Washtenaw CC financial literacy LibGuide", "Community college / finance", "US / EN", "Calculator prospect", "Calculator prospect", "Medium", "Resource page", "Prospect", "", "", "Pending", ""),
    (29, "U.Houston calculator resources", "University / maths", "US / EN", "Maths/calculator prospect", "Maths/calculator pitch", "Medium", "Resource page", "Prospect", "", "", "Pending", ""),
    (30, "U.Michigan SOCR resources", "University / statistics", "US / EN", "Future statistics-tool collaboration", "Future collab (needs stats tool)", "Low", "Resource page", "Prospect", "", "", "Pending", ""),
    (31, "UC Davis biostats resources", "University / statistics", "US / EN", "Only relevant if AnyConverter adds rigorous stats tools", "Future opportunity", "Low", "Resource page", "Prospect", "", "", "Pending", ""),
    (32, "Ohio University maths", "University / maths", "US / EN", "Resource-page prospect", "Maths pitch", "Medium", "Resource page", "Prospect", "", "", "Pending", ""),
    (33, "Lamar State College math", "College / maths", "US / EN", "Resource-page outreach", "Maths pitch", "Medium", "Resource page", "Prospect", "", "", "Pending", ""),
    (34, "U.Montana learning resources", "University / student maths", "US / EN", "Calculator-resource outreach", "Student calc pitch", "Medium", "Resource page", "Prospect", "", "", "Pending", ""),
    (35, "Emory clinical resources", "University / medical", "US / EN", "Medical calculators — DO NOT pitch BMI/calorie as clinical without validation", "Hold — needs medical validation", "Low (risk)", "Resource page", "Blocked", "", "", "N/A", "Risk-flagged"),
    (36, "University of Illinois OCR guide", "University / OCR/PDF", "US / EN", "Potential OCR fit after accuracy benchmarking", "After OCR benchmark", "Medium", "Resource page", "Prospect", "", "", "Pending", ""),
    (37, "University of Michigan accessibility", "University / PDF a11y", "US / EN", "Only after adding PDF-a11y tools", "Future (after tool build)", "Low", "Resource page", "Prospect", "", "", "Pending", ""),
    (38, "Cornell-hosted BentoPDF", "University / PDF OSS", "US / EN", "Competitor / technical collaboration", "Benchmark; not generic pitch", "Medium", "Benchmark", "Prospect", "", "", "Pending", ""),
    (39, "Georgia Southern PDF edu content", "University / PDF", "US / EN", "Content-collaboration prospect", "Content collab", "Medium", "Resource page", "Prospect", "", "", "Pending", ""),
    (40, "Citrus College maths LibGuide", "Community college / maths", "US / EN", "Calculator-resource prospect", "Maths calc pitch", "Medium", "Resource page", "Prospect", "", "", "Pending", ""),
    (41, "BetaList", "Launch", "Global / EN", "Startup launch", "Platform launch if criteria fit", "Medium", "Directory / launch", "Prospect", "", "", "Pending", ""),
    (42, "Launching Next", "Launch", "Global / EN", "Startup directory", "Platform submission", "Low", "Directory", "Prospect", "", "", "Pending", ""),
    (43, "Stack Overflow", "Community", "Global / EN", "Answer-first; disclosure required", "No promotional campaign; answer-only", "Medium", "Community", "Prospect", "", "", "Pending", "No autonomous posts"),
    (44, "Quora", "Community", "Global", "Answer-first; self-promo must support answer", "Answer-only contributions", "Low", "Community", "Prospect", "", "", "Pending", "No autonomous posts"),
    (45, "Reddit", "Community", "Global / multilingual", "Organic participation only; sitewide spam rules", "Rule-aware map; no posting without approval", "Low", "Community", "Prospect", "", "", "Pending", "No autonomous posts"),
    (46, "Cloudflare Community", "Developer community", "Global / EN", "Relevant if publishing CF implementation details", "Technical contributions only", "Low", "Community", "Prospect", "", "", "Pending", ""),
    (47, "AnyConverter press kit", "Self-asset (digital PR)", "Multilingual", "Update facts before journalist outreach", "Fix tool-count inconsistency first", "N/A", "Self-asset", "Blocked", "", "", "N/A", "Links to GROW-020"),
    (48, "AnyConverter README", "Self-asset", "Global / EN", "Linkable developer asset", "Turn into excellent project docs", "N/A", "Self-asset", "In progress (GROW-022)", "", "", "N/A", ""),
    (49, "AnyConverter dev-tools hub", "Self-asset (link destination)", "Multilingual", "Outreach target URL for dev audiences", "Use in dev outreach", "N/A", "Self-asset", "Live", "", "", "N/A", ""),
    (50, "AnyConverter PDF-tools hub", "Self-asset (link destination)", "Multilingual", "PDF-resource outreach asset", "Use in PDF outreach", "N/A", "Self-asset", "Live", "", "", "N/A", ""),
    (51, "AnyConverter calculators hub", "Self-asset (link destination)", "Multilingual", "Education/resource outreach asset", "Use in finance/edu outreach", "N/A", "Self-asset", "Live", "", "", "N/A", ""),
    (52, "AnyConverter Spanish site", "Self-asset (multilingual)", "ES", "Spanish resource/blog outreach", "Post QA pass", "N/A", "Self-asset", "In progress (GROW-021)", "", "", "N/A", ""),
    (53, "AnyConverter Danish site", "Self-asset (multilingual)", "DA", "Danish resource outreach after copy QA", "Post QA pass", "N/A", "Self-asset", "In progress (GROW-021)", "", "", "N/A", ""),
]
add_sheet(wb, "Prospects", pros_headers, pros_rows,
          widths=[5, 38, 26, 18, 36, 40, 14, 20, 20, 14, 28, 16, 24], title_text="Verified Prospect Universe")

# ---------- 11. AGENTS ----------
ag_headers = ["Agent", "Cadence", "Inputs", "Output", "Side-effect class", "Approval required?", "Status"]
ag_rows = [
    ("Site auditor", "Daily", "Sitemap, rendered pages, GSC", "Crawl/indexability issues", "Read-only", "No", "Planned"),
    ("Content-gap", "Weekly", "GSC, Ahrefs, competitors", "Content/tool opportunity cards", "Read-only", "No", "Planned"),
    ("Backlink-gap", "Weekly", "Ahrefs + web", "Referring domains competitors have", "Read-only", "No", "Planned"),
    ("Resource-page hunter", "Daily", "Web queries", "Candidate educational/resource pages", "Read-only", "No", "Planned"),
    ("Broken-link hunter", "Weekly", "Candidate pages", "Dead/redirected competitor resources", "Read-only", "No", "Planned"),
    ("Community listener", "Daily", "Reddit/Quora/HN/web", "Relevant questions/discussions", "Read-only", "No", "Planned"),
    ("Prospect verifier", "Continuous", "URLs", "Topical match, owner, policy, link type", "Read-only", "No", "Planned"),
    ("Contact researcher", "Approved batch", "Apollo / public sites", "Business contact candidates", "Internal write", "Batch approval", "Planned"),
    ("Personalisation", "Approved batch", "Prospect evidence", "First-draft outreach", "Internal write", "Batch approval", "Planned"),
    ("Outreach QA", "Every draft", "Legal/policy + draft", "Approve/reject/rewrite recommendation", "Internal write", "No (automated check)", "Planned"),
    ("Email sender", "Approval only", "Approved draft", "Sent message", "Irreversible public", "YES — per send", "Blocked until Phase 6"),
    ("Community publisher", "Approval only", "Approved answer/post", "Published contribution", "Irreversible public", "YES — per post", "Blocked until Phase 6"),
    ("Link validator", "Weekly", "Won placements", "Current link/rel/indexability", "Read-only", "No", "Planned"),
    ("Reputation monitor", "Daily", "Mentions/search", "Complaints, removals, spam signals", "Read-only", "No", "Planned"),
    ("SEO reporter", "Weekly/Monthly", "GSC/Ahrefs/CRM", "KPI report", "Read-only", "No", "Planned"),
]
add_sheet(wb, "Agents", ag_headers, ag_rows,
          widths=[24, 16, 28, 36, 20, 20, 16], title_text="Agent Roster")

# ---------- 12. APPROVALS ----------
ap_headers = ["Action", "Autonomous?", "Owner approval?", "Scope of approval", "Notes"]
ap_rows = [
    ("Read repository files + public site", "Yes", "No", "—", ""),
    ("Local tests, screenshots, perf checks", "Yes", "No", "—", ""),
    ("Query approved read-only analytics", "Yes (within access)", "No further unless perms need", "—", ""),
    ("Free public keyword research (ToS-respecting)", "Yes", "No", "—", ""),
    ("Fee-based keyword APIs", "No", "YES before cost", "Per subscription + rate cap", ""),
    ("Create local branch + propose PR", "Yes (if policy permits)", "YES before merge/deploy", "Per PR", ""),
    ("Modify analytics/consent in production", "No", "YES", "Per change", ""),
    ("Publish new language pages / sitemap change", "No", "YES", "Per release", ""),
    ("Submit extension to Chrome/Edge store", "No", "YES", "Per submission", ""),
    ("Launch public embed / third-party integration", "Stage locally first", "YES", "Per launch", ""),
    ("Send outreach emails (individual or bulk)", "Draft-only", "YES — exact recipients + copy", "Per send; content-hash token", "Hash invalidates on edit"),
    ("Post to Reddit/Quora/GitHub Discussions/HN", "Draft-only", "YES — human post", "Per post", "No autonomous posting"),
    ("Publish videos / social posts", "Draft-only", "YES", "Per publish", ""),
    ("Purchase domains / services / tools", "No", "YES", "Per purchase", ""),
    ("Change live ads / add payment integration", "No", "YES", "Per change", ""),
    ("Force-push, reset, delete branches, discard work", "No", "DO NOT PERFORM", "Never", ""),
    ("Claim successful rollout / revenue improvement", "Only after measured evidence", "Must be evidence-supported", "N/A", ""),
]
add_sheet(wb, "Approvals", ap_headers, ap_rows,
          widths=[46, 20, 24, 28, 26], title_text="Owner Approval Matrix")

# ---------- 13. GATES ----------
g_headers = ["Gate", "Minimum evidence", "Pass condition", "Current status", "Last run date", "Notes"]
g_rows = [
    ("Repository safety", "git status, diff review, branch/SHA", "No unrelated work lost", "Not run", "", ""),
    ("Existing tests", "Repo-defined test runner; suite count noted", "All previously-passing tests still pass", "Not run", "", ""),
    ("HTML / link integrity", "HTML validator + linkinator", "No new broken links / critical validation failures", "Not run", "", ""),
    ("Functional E2E", "Key actions for all affected tools", "Correct result / errors / copy / download / reset", "Not run", "", ""),
    ("Multilingual regression", "EN/ES/DA + pilot locale (if relevant)", "Correct text / links / calculations", "Not run", "", ""),
    ("Responsive UI", "320-2560 px representative set", "No clipped menus / horizontal overflow / unusable actions", "Not run", "", ""),
    ("Accessibility", "Keyboard + SR semantics + contrast", "No introduced critical a11y issue", "Not run", "", ""),
    ("Privacy / security", "Event payload inspection + secrets scan", "No sensitive data transmitted or committed", "Not run", "", ""),
    ("Performance", "Same-test pre/post benchmarks", "No material regression unless justified", "Not run", "", ""),
    ("SEO routes", "Canonical / hreflang / sitemap check", "Correct URLs and indexable pages only", "Not run", "", ""),
    ("Rollback", "Revert/deploy plan", "Reversible safe release", "Not run", "", ""),
    ("Gate 0 (audit)", "Phase-0 docs 00..05 complete + PASS/FAIL/BLOCKED distinguished", "Critical blockers surfaced, not hidden", "Not run", "", ""),
    ("Gate 1 (analytics)", "Privacy review + staging event validation", "Prod changes approved", "Not run", "", ""),
    ("Gate 2 (localization)", "Evidence + native QA + regression + approval", "Only approved locale pages publish", "Not run", "", ""),
    ("Gate 3 (retention)", "No success-rate regression; no forced signup; no unbounded storage", "Explicit opt-in verified", "Not run", "", ""),
    ("Gate 4 (extension)", "Browser perm/security review + 100% core test-case pass", "Store-submission recommendation justified", "Not run", "", ""),
    ("Gate 5 (embed)", "Pilot partner sandbox test + secure frame policy", "Distribution recommendation justified", "Not run", "", ""),
]
add_sheet(wb, "Gates", g_headers, g_rows,
          widths=[26, 42, 42, 16, 14, 24], title_text="Release-Gate Matrix")

# ---------- 14. DELIVERABLES ----------
dv_headers = ["File", "Purpose", "Phase", "Status", "Owner", "Notes"]
dv_rows = [
    ("docs/growth/COMBINED_GROWTH_MASTER_PLAN.md", "Combined plan (this document companion)", "All", "Done", "", "Created 2026-11-17"),
    ("docs/growth/GROWTH_TRACKING.xlsx", "This tracker", "All", "Done", "", "Created 2026-11-17"),
    ("docs/growth/README.md", "Index", "All", "Not started", "", ""),
    ("docs/growth/00-EXECUTIVE-BASELINE.md", "Exec baseline summary", "Phase 0", "Not started", "", ""),
    ("docs/growth/01-REPOSITORY-AND-MCP-AUDIT.md", "Repo + MCP audit", "Phase 0", "Not started", "", ""),
    ("docs/growth/02-TOOL-AND-LOCALE-INVENTORY.csv", "Tool + locale inventory", "Phase 0", "Not started", "", ""),
    ("docs/growth/03-LIVE-UX-RELEASE-GATE.md", "Live UX release gate", "Phase 0", "Not started", "", ""),
    ("docs/growth/04-BASELINE-DATA-GAPS.md", "Baseline data gaps", "Phase 0", "Not started", "", ""),
    ("docs/growth/05-RISKS-DEPENDENCIES-AND-APPROVALS.md", "Risks + dependencies + approvals", "Phase 0", "Not started", "", ""),
    ("docs/growth/10-ANALYTICS-TRACKING-PLAN.md", "Analytics plan", "Phase 1", "Not started", "", ""),
    ("docs/growth/11-EVENT-DICTIONARY.csv", "Events (allowed/forbidden metadata)", "Phase 1", "Not started", "", "See Events sheet"),
    ("docs/growth/12-EXPERIMENT-REGISTRY.csv", "Experiments", "Phase 1", "Not started", "", "See Experiments sheet"),
    ("docs/growth/20-LANGUAGE-MARKET-SCORECARD.csv", "Market scoring", "Phase 2", "Not started", "", "See Locales sheet"),
    ("docs/growth/21-NATIVE-KEYWORD-RESEARCH.csv", "Native keyword map", "Phase 2", "Not started", "", ""),
    ("docs/growth/22-COMPETITOR-OPPORTUNITIES.csv", "Competitor teardown", "Phase 2", "Not started", "", ""),
    ("docs/growth/23-LOCALIZATION-PILOT-SPEC.md", "Pilot locale spec", "Phase 2", "Not started", "", ""),
    ("docs/growth/30-RETENTION-AND-SHARING-SPEC.md", "Retention + sharing spec", "Phase 3", "Not started", "", ""),
    ("docs/growth/40-JSON-EXTENSION-RFC.md", "JSON extension RFC", "Phase 4", "Not started", "", ""),
    ("docs/growth/41-EXTENSION-SECURITY-AND-STORE-CHECKLIST.md", "Extension security + store checklist", "Phase 4", "Not started", "", ""),
    ("docs/growth/50-EMBED-SPEC.md", "Embed spec", "Phase 5", "Not started", "", ""),
    ("docs/growth/51-EMBED-PARTNER-GUIDE.md", "Embed partner guide", "Phase 5", "Not started", "", ""),
    ("docs/growth/60-PARTNER-PROSPECTS.csv", "Partner prospects", "Phase 6", "Not started", "", "See Prospects sheet"),
    ("docs/growth/61-OUTREACH-DRAFTS.md", "Outreach drafts", "Phase 6", "Not started", "", "See Templates sheet"),
    ("docs/growth/62-COMMUNITY-DISTRIBUTION-MAP.csv", "Community map (rules + fit)", "Phase 6", "Not started", "", ""),
    ("docs/growth/63-VIDEO-CONTENT-CALENDAR.csv", "12-week video calendar", "Phase 6", "Not started", "", ""),
    ("docs/growth/70-PWA-FEASIBILITY.md", "PWA feasibility", "Phase 3", "Not started", "", ""),
    ("docs/growth/71-DEVELOPER-INTEGRATION-RFC.md", "Developer integration RFC", "Phase 7", "Not started", "", ""),
    ("docs/growth/80-MONETIZATION-OPTIONS.md", "Monetization options", "Phase 8", "Not started", "", ""),
    ("docs/growth/90-ROADMAP-AND-PRIORITY-BACKLOG.md", "Roadmap + backlog", "All", "Not started", "", "See Roadmap_90d + Backlog sheets"),
    ("docs/growth/91-TEST-EVIDENCE-AND-RELEASE-GATES.md", "Test evidence + gates", "All", "Not started", "", "See Gates sheet"),
    ("docs/growth/92-OWNER-APPROVAL-QUEUE.md", "Owner approval queue", "All", "Not started", "", "See Approvals sheet"),
    ("docs/growth/99-FINAL-EXECUTION-REPORT.md", "Final execution report", "End", "Not started", "", "Main deliverable"),
]
add_sheet(wb, "Deliverables", dv_headers, dv_rows,
          widths=[52, 32, 10, 14, 14, 30], title_text="Deliverable File Tree")

# ---------- 15. TEMPLATES ----------
tp_headers = ["Template ID", "Audience", "Subject", "Body", "Required fields", "Notes"]
tp_rows = [
    ("T-UNI-01", "University / resource editor",
     "Free browser-based calculator resource for your students",
     "Hi {{Name}},\n\nI found your {{specific resource page}} while researching educational resources for {{topic}}. You currently recommend {{relevant existing resource}}, so I thought this might be useful rather than sending a generic website pitch.\n\nWe maintain a free {{calculator/tool}} at AnyConverter that runs without signup and includes {{specific educational feature/formula/example}}.\n\nIf it genuinely improves the resource list, here is the page: {{tool URL}}. If not, no problem — I don't want you to add something solely because I emailed.\n\nRegards,\n{{Sender}}",
     "Name, resource_page_URL, topic, existing_resource, tool_name, educational_feature, tool_URL",
     "Must reference specific page"),
    ("T-DEV-01", "Developer educator",
     "Possible JSON/API utility for {{course/resource page}}",
     "Hi {{Name}},\n\nYour {{course/page}} recommends {{existing formatter/resource}} for inspecting JSON. I maintain an open browser-side JSON formatter/validator with {{specific differentiator}} and public source code.\n\nIf you are updating the resource list, I can send a short technical comparison or test cases so you can decide whether it is worth including. No sponsorship or reciprocal link is involved.\n\n{{Sender}}",
     "Name, course_page, existing_resource, differentiator",
     "Dev audience; no reciprocal link"),
    ("T-INT-01", "Integration partner",
     "Free embedded {{calculator}} for {{Company}}",
     "Hi {{Name}},\n\n{{Company page}} explains {{specific user problem}}. We have a browser-side {{tool}} that addresses the calculation step, and we're building a lightweight embeddable version.\n\nI think it could remove the need for visitors to calculate {{task}} manually. If that is useful, I can provide the embed and documentation. Attribution can remain simple and branded; there is no requirement for an SEO link.\n\n{{Sender}}",
     "Name, Company, Company_page, user_problem, tool, task",
     "No required backlink"),
    ("T-BRK-01", "Broken resource page (webmaster/editor)",
     "Broken {{resource name}} link on {{page}}",
     "Hi {{Name}},\n\nWhile using your {{page}}, I noticed the {{resource}} link now {{404s/redirects/no longer provides the stated tool}}.\n\nI maintain a free alternative covering {{exact function}}. If you are updating the page, it may be a suitable replacement: {{URL}}. Either way, I wanted to flag the broken resource.\n\n{{Sender}}",
     "Name, page, resource, failure_mode, exact_function, URL",
     "Lead with the broken link, not the pitch"),
    ("T-OSS-01", "Open-source maintainer",
     "Small {{utility}} you might find useful",
     "Hi {{Name}},\n\nI saw {{specific repo/issue/doc}} where you discuss {{problem}}. I maintain a small, MIT-licensed {{utility}} that handles {{specific function}} without server dependencies.\n\nIf it's useful, the repo is at {{URL}}. Feedback or issues welcome — no reciprocal link needed.\n\n{{Sender}}",
     "Name, repo_or_issue, problem, utility, function, URL",
     "Needs valid OSS license"),
    ("T-REG-01", "Regional partner (native language)",
     "{{Native-language subject}}",
     "{{Native-language body — must be reviewed by native speaker before send}}",
     "Name, locale, native_body_reviewed_by",
     "Native review MANDATORY"),
]
add_sheet(wb, "Templates", tp_headers, tp_rows,
          widths=[12, 32, 50, 72, 40, 28], title_text="Outreach Templates (Drafts Only)")

# ---------- 16. RISKS ----------
rk_headers = ["ID", "Category", "Risk", "Likelihood", "Impact", "Mitigation", "Owner", "Status"]
rk_rows = [
    ("R-01", "Compliance", "Autonomous outreach violates CAN-SPAM / PECR / GDPR", "Med", "High", "Draft-only workflow; approval gateway; suppression list; manual sending initially", "", "Open"),
    ("R-02", "Compliance", "Autonomous community posting violates platform rules (Reddit/Quora/HN/SO)", "High", "High", "Community publisher blocked until Phase 6; no autonomous posts; human review", "", "Open"),
    ("R-03", "SEO", "Scaled machine translation flagged as scaled-content abuse", "Med", "High", "Native QA sign-off; fix ES/DA drift (GROW-021) before expansion; no auto-translate", "", "Open"),
    ("R-04", "SEO", "Widget keyword-rich backlinks classified as link spam", "Med", "High", "Embeds use neutral/optional attribution; no forced keyword-rich links", "", "Open"),
    ("R-05", "Security", "Extension requests broad host_permissions and gets rejected", "Low", "Med", "MV3 minimal perms; explicit-action formatting; no 'read all websites'", "", "Open"),
    ("R-06", "Privacy", "PII leaks via analytics events (JSON contents, filenames, financial values)", "Med", "High", "Event dictionary allowlist; forbidden-metadata enforcement; payload inspection in release gate", "", "Open"),
    ("R-07", "Trust", "Fabricated keyword/volume/DR/CTR in reports", "Low", "High", "Evidence standard (yaml citation); UNKNOWN labels; source links mandatory", "", "Open"),
    ("R-08", "Product", "Favorites/recents regression on language switch", "Med", "Med", "Cross-locale key strategy; regression tests for EN/ES/DA switching", "", "Open"),
    ("R-09", "Product", "Shareable state leaks sensitive inputs", "Med", "High", "Low-risk tool first (percentage/date-diff); minimal param allowlist; explicit Share action", "", "Open"),
    ("R-10", "Operations", "Multiple agents email the same editor", "Med", "Med", "Dedupe on registrable_domain+contact+destination_tool+opportunity_type", "", "Open"),
    ("R-11", "Operations", "node_modules in repo exposes dependency surface / bloats clone", "High", "Med", "GROW-023 removal + deterministic manifest", "", "Open"),
    ("R-12", "Credibility", "Tool count 128 vs 78 inconsistency hurts PR", "High", "Med", "GROW-020 single source of truth; regenerate all surfaces", "", "Open"),
    ("R-13", "Perf", "PWA caches stale HTML or third-party scripts", "Med", "Med", "SW versioning; limited offline scope; staging install tests", "", "Open"),
    ("R-14", "Legal", "Medical/clinical calculator (BMI/calorie) pitched to medical resource pages without validation", "Low", "High", "Explicit do-not-pitch list; Emory flagged in Prospects", "", "Open"),
    ("R-15", "Dependency", "GSC / Ahrefs / Apollo MCP not connected blocks baseline + prospecting", "High", "High", "Phase 0 documents exact missing connections + next action per source", "", "Open"),
    ("R-16", "Deployment", "Unintended push to main / deploy from Claude Code", "Low", "High", "Feature branches only; approval before merge/deploy; no --force", "", "Open"),
]
add_sheet(wb, "Risks", rk_headers, rk_rows,
          widths=[7, 14, 48, 12, 10, 50, 14, 12], title_text="Risk / Dependency Register")

# ---------- SAVE ----------
# Move Overview first
wb.move_sheet("Overview", offset=-wb.sheetnames.index("Overview"))
wb.save(OUT)
print(f"Wrote {OUT}")
