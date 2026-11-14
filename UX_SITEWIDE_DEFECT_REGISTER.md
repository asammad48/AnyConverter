# AnyConverter — Sitewide UX & Layout Defect Register
**Document Status:** Verified Baseline & Remediation Tracking  
**Date:** November 12, 2026  
**Auditor:** Principal Frontend Engineer, Senior UI/UX Designer & QA Engineer

---

## 1. Verified Defect Matrix

| ID | Category | Severity | Affected Tools | Defect Description | Exact Recommended Fix |
|---|---|---|---|---|---|
| **DEF-001** | Screen Utilization | **Critical** | Sitewide (All Tools) | Fixed container cap `--ac-max: 1440px` causes 480px (1920px Full HD) to 1120px (2560px QHD) dead whitespace. Interactive tools are artificially constrained. | Decouple tool workspace max-width to `--ac-tool-max: 1800px` (or 96vw on ultra-wide), while keeping text/article content capped at 85ch for readability. |
| **DEF-002** | Editor Layout | **Critical** | `json-compare`, `xml-formatter` | Editor height collapses to 78.8px (`json-compare`) and 94px (`xml-formatter`) because line 1820 in `style.css` sets `min-height: 0; height: 100%` on auto-height grid parents. | Enforce responsive viewport-aware editor height: `min-height: clamp(340px, 42vh, 480px); height: clamp(340px, 42vh, 480px);` on `#jc-a`, `#jc-b`, `#xml-input`, `#xml-output`. |
| **DEF-003** | Action Placement | **High** | `json-formatter` (EN, ES, DA) | Primary "Format" action (`#btn-format`) is placed below 700px-tall split panels. Laptop users must scroll down off-screen to format JSON manually. | Introduce primary Format button in top Input panel header toolbar next to Upload/Paste, keeping bottom bar for scrolled convenience. |
| **DEF-004** | Action Placement | **High** | `csv-to-sql` (EN, ES, DA) | "Generate SQL" action is buried inside the sidebar `<aside class="tool-side">`. On mobile/tablet or narrow laptop views, users cannot find the action without scrolling into the ad sidebar. | Add a prominent, full-featured primary `Generate SQL` button directly in the main workspace above/below schema options. |
| **DEF-005** | Form Control / Visual | **High** | `mortgage-calculator`, `compound-interest-calculator`, `loan-calculator` | Dropdown `<select>` elements (`#ac-mort-currency-select`, `#mort-term`, `#ac-ci-currency-select`, `#ci-freq`) have NO visible chevron arrow. | Remove destructive inline `background: ...` shorthand in JS templates that wipes out `background-image` SVG chevron while `appearance: none` is active. Standardize `.ac-select` styling with high-contrast chevron. |
| **DEF-006** | Alignment & Spacing | **Medium** | `mortgage-calculator` (EN, ES, DA) | Down Payment dollar and percentage fields wrap unpredictably in `repeat(auto-fit, minmax(180px, 1fr))`, causing label baseline misalignment and uneven row heights. | Group Home Price, Down Payment ($ and %), Interest Rate, and Loan Term in a structured 4-column responsive grid with aligned label baselines and compound currency/percent input units. |
| **DEF-007** | Alignment & Spacing | **Medium** | `loan-calculator` (EN, ES, DA) | Loan Term header contains Years/Months segmented toggle, pushing the input box down by ~8px relative to adjacent Loan Amount, Rate, and Date inputs. | Fix label wrapper height to `min-height: 24px; display: flex; align-items: flex-end;` across all 4 columns, preserving baseline alignment. |
| **DEF-008** | Control Ergonomics | **Medium** | `pay-rise-calculator` (EN, ES, DA) | Pay Period select uses oversized `.calc-input--lg` (52px) while adjacent controls use 44px. Dropdown lacks standard chevron icon. Mode switching creates abrupt row jumping. | Normalize select and input heights to 44px, add chevron SVG styling to `.calc-input select`, and ensure clean grid transitions when switching raise modes. |
| **DEF-009** | Usability / Microcopy | **Medium** | `percentage-difference-calculator` (EN, ES, DA) | "Value A" and "Value B" labels are ambiguous. Users frequently confuse symmetric percentage difference with directional percentage change. | Change labels to `First value (A)` and `Second value (B)` across EN, ES, and DA. Add explanatory clarification badge distinguishing symmetric difference from directional change. |
| **DEF-010** | Layout Responsiveness | **Medium** | Sitewide Tool Layout | `.tool-wrapper` uses flex wrapping with `flex: 999 1 620px` and `flex: 1 1 300px`, causing sudden, jarring sidebar drops on medium screens. | Implement CSS Grid `grid-template-columns: minmax(0, 1fr) minmax(260px, 320px)` on viewports $\ge 992\text{px}$, transitioning smoothly to 1 column below 992px. |

---

## 2. Suspected / Monitored Sitewide Conditions

| ID | Area | Status | Investigation Note | Action |
|---|---|---|---|---|
| **SUS-001** | Category Hub Grids | Monitored | Hub grids use `repeat(auto-fill, minmax(185px, 1fr))`. On wide monitors, card counts per row increase gracefully. | Keep under review; verified acceptable visually. |
| **SUS-002** | Dark Mode Dropdown Contrast | Verified Defect | Dark mode select chevron SVG uses hardcoded `#5f564f`, which has poor contrast (< 2.5:1) against dark surface `#1A1815`. | Provide high-contrast SVG chevron for dark mode (`:root.dark select`) with `#A89D92` stroke. |
| **SUS-003** | Breadcrumb Wrap on Mobile | Monitored | On 320px screens, long tool titles in breadcrumbs may wrap to 2 lines. | Verified ellipsis and wrapping rules in `style.css`. |

---

## 3. Scope of Remediation
All 10 verified defects (DEF-001 through DEF-010) are scheduled for immediate remediation across Phases 2 and 3, followed by visual regression testing in Phase 5–7.
