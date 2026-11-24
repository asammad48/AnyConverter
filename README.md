# AnyConverter — 128+ Free, Private, Client-Side Online Web Utilities

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Test Suites](https://img.shields.io/badge/Tests-22%2F22%20Passing-brightgreen.svg)](tests/)
[![Tools](https://img.shields.io/badge/Tools-128%20Canonical-orange.svg)](https://anyconverter.io)
[![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20ES%20%7C%20DA-informational.svg)](https://anyconverter.io)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Client--Side-success.svg)](https://anyconverter.io/privacy/)

**Live Platform:** [https://anyconverter.io](https://anyconverter.io)  
**Spanish:** [https://anyconverter.io/es/](https://anyconverter.io/es/)  
**Danish:** [https://anyconverter.io/da/](https://anyconverter.io/da/)

AnyConverter is a high-performance web utility platform containing **128 browser-side tools** across 9 major categories. Designed for developers, accountants, students, and everyday users who demand speed, simplicity, and complete data privacy.

---

## ⚡ Core Architectural Pillars

### 1. 100% Client-Side Privacy (Zero Document Uploads)
Unlike conventional online converters, AnyConverter processes documents, files, and calculations directly in your browser tab:
- **PDF Suite:** Merges, splits, rotates, and compresses files in-memory via `pdf-lib` and WebAssembly.
- **Developer Utilities:** Format JSON, test Regex, parse JWTs, and query CSVs using Web Workers and local memory.
- **Privacy Guarantee:** Your sensitive documents, customer spreadsheets, and private keys never leave your machine.

### 2. Zero-Framework Architecture (Instant Load & Zero Lag)
- **Vanilla Modern JS & CSS:** Zero frontend framework overhead (no React, Vue, or heavy runtimes).
- **Sub-Second Performance:** First Contentful Paint < 0.8s, Cumulative Layout Shift < 0.05.
- **100MB VirtualScroller:** Custom Web Worker and coordinate-scaled virtual DOM scroller handles 100MB JSON/log files at solid 60 FPS without UI freezes.

### 3. Full Multilingual Reciprocity (EN, ES, DA)
Every one of the 128 tools is localized across three language directories with complete feature parity, dynamic category translation, and reciprocal `hreflang` / canonical topologies:
- **English:** Default root (`/`)
- **Spanish (Español):** `/es/`
- **Danish (Dansk):** `/da/`

---

## 🛠️ The 128 Tool Ecosystem (9 Category Hubs)

### 1. Developer Utilities (26 Tools) — [/developer-tools/](https://anyconverter.io/developer-tools/)
High-throughput tools engineered for engineers, sysadmins, and data analysts:
- **JSON Formatter & Validator:** 100MB zero-lag virtual scroller, sorting, tree folding, minify, CSV/YAML export.
- **JSON Compare:** Side-by-side diffing with inline semantic change highlights.
- **Regex Tester:** Live regular expression testing with capture groups, substitution, and pattern chips.
- **CSV to SQL Converter:** Generates MySQL, PostgreSQL, SQLite, and Microsoft SQL Server (T-SQL) DDL/INSERT statements.
- **CSV Query Engine:** In-browser SQL engine running SQLite via WebAssembly (`sql.js`).
- **JWT Decoder:** Inspects header and payload claims, expirations, and JSON formatting with zero token leakage.
- **Hash Generator & Checksum:** Computes MD5, SHA-1, SHA-256, and SHA-512 with HMAC and file hashing.
- **Base64 Encoder/Decoder:** Text and binary file encoding with URL-safe RFC 4648 support.
- **Cron Expression Parser:** Explains standard, Quartz, and Jenkins cron schedules with upcoming execution dates.
- **URL Encoder/Decoder:** Percent-encodes/decodes query strings with RFC 3986 compliance.
- **XML Formatter, Color Converter, UUID Generator, HTML Entity Encoder, Markdown to HTML, and more.**

### 2. PDF Suite (26 Tools) — [/pdf-tools/](https://anyconverter.io/pdf-tools/)
Client-side document editing powered by in-memory WASM and `pdf-lib`:
- **PDF Merge:** Reorder, exclude specific pages, and merge multiple documents into one tidy PDF.
- **PDF Split:** Extract page ranges or burst single pages into separate downloads.
- **PDF Compress:** Reduces file footprint locally for email limits.
- **PDF to JPG / JPG to PDF:** Convert documents to high-resolution raster images or compile photos to PDF.
- **Add Page Numbers, Watermark PDF, Rotate PDF, Protect/Unlock PDF, Crop PDF, and more.**

### 3. Financial & Math Calculators (32 Tools) — [/calculators/](https://anyconverter.io/calculators/)
Banking-grade formulas with interactive amortization schedules and SVG comparison charts:
- **Loan Calculator:** Standard nominal APR, EAR, and monthly amortization breakdowns.
- **Mortgage Calculator:** Principal, interest, property taxes, insurance, and extra payment accelerators.
- **Compound Interest Calculator:** Monthly contributions, compounding frequency, and balance projections.
- **Percentage Calculator:** Three-way percentage math (what is X% of Y, percentage increase/decrease).
- **Auto Loan Calculator, Investment Calculator, Tip Calculator, Discount Stacking, and more.**

### 4. Productivity & Task Management (22 Tools) — [/productivity-tools/](https://anyconverter.io/productivity-tools/)
Fast, distraction-free productivity tools backed by private browser `localStorage`:
- **Sticky Notes:** Color-coded drag-and-drop board with auto-save, search, and JSON export.
- **Daily Planner:** Time-blocked scheduling with conflict detection and `.ics` calendar export.
- **To-Do List:** Clean checklist with active/completed filters and local persistence.
- **Pomodoro Timer:** Focused work intervals, short/long break timers, and audio chimes.
- **Typing Speed Test, Meeting Timer, Habit Tracker, Kanban Board, and more.**

### 5. Text & Content Utilities (13 Tools) — [/text-tools/](https://anyconverter.io/text-tools/)
- **Word & Character Counter:** Live words, characters (with/without spaces), sentences, paragraphs, and reading time.
- **Text Diff Checker:** Side-by-side textual diffing with character-level accuracy.
- **Case Converter:** UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case.
- **Text Repeater, Lorem Ipsum Generator, ASCII Art Generator, and more.**

### 6. Browser & Network Diagnostics (11 Tools) — [/browser-tools/](https://anyconverter.io/browser-tools/)
- **IP Address Lookup:** Geolocation, ISP, organization, ASN, and timezone lookup.
- **Internet Speed Test:** Low-latency bandwidth testing via Cloudflare edge endpoints.
- **Browser Info & Viewport Size:** Live viewport resolution, user-agent details, and display DPI.
- **Screen Resolution Tester, Webcam Tester, Microphone Tester, Dead Pixel Checker.**

### 7. Date & Time Tools (8 Tools) — [/date-time/](https://anyconverter.io/date-time/)
- **Unix Timestamp Converter:** Epoch seconds, milliseconds, microseconds, and ISO 8601 conversions.
- **Age Calculator & Date Difference:** Exact year, month, day, and hour calculations between dates.
- **World Clock:** Multi-city synchronized timezone viewer with daylight saving support.

### 8. Fun & Decision Makers (7 Tools) — [/fun-relationships/](https://anyconverter.io/fun-relationships/)
- **Coin Flip, Dice Roller, Spin the Wheel, Decision Maker, Random Team Picker, and more.**

### 9. Numerology & Astrology (6 Tools) — [/numerology-astrology/](https://anyconverter.io/numerology-astrology/)
- **Numerology Calculator:** Pythagorean and Chaldean name and life-path number calculations.
- **Rising Sign & Tarot Birth Card Calculators.**

---

## 🔒 Privacy & Zero-PII Telemetry

AnyConverter enforces a strict zero-PII privacy guarantee:
- **No Document Storage:** Document files and tool input texts are never sent to AnyConverter servers.
- **Anonymous Telemetry:** The platform uses a centralized client-side analytics adapter ([`assets/js/shared/analytics.js`](assets/js/shared/analytics.js)) operating on an exact **16-event canonical dictionary**.
- **Privacy Sanitization Filter:** Automatically strips parameter keys containing file names, query texts, email addresses, or document contents before dispatching anonymized usage metrics.

---

## 🧪 Testing & Verification

AnyConverter maintains a comprehensive automated testing suite:

```bash
# Run all 22 master test suites (unit, integration, parity, and SEO gates)
node tests/run_all_tests.js

# Run pixel-perfect visual regression tests across 21 baselines
node tests/run_visual_regression.js

# Verify sitewide 128-tool inventory parity across EN, ES, DA
node tests/test_sitewide_parity_and_counts.js

# Validate analytics adapter and privacy sanitization
node tests/test_analytics_adapter.js
```

### Verified Test Gates:
- **22 / 22 Test Suites Passing (100%)**
- **441 / 441 Localized Pages** with reciprocal canonical and hreflang validation
- **0px Horizontal Scroll Overflow** across Mobile (375px), Tablet (768px), and Desktop (1280px+)

---

## 🚀 Local Development

No build step, compilers, or package bundling required:

```bash
# 1. Clone the repository
git clone https://github.com/asammad48/AnyConverter.git
cd AnyConverter

# 2. Start any local static server
npx serve . -p 3000
# or
python -m http.server 3000

# 3. Open in your browser
http://localhost:3000
```

Deployable to [Cloudflare Pages](https://pages.cloudflare.com) via standard static output (`/`).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
