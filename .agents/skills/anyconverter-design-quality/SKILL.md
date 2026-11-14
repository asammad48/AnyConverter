---
name: anyconverter-design-quality
description: "AnyConverter UI/UX design quality standards, one-panel fullscreen protocol, compact search toolbar architecture, responsive layout rules, and accessibility standards for all tools."
---

# AnyConverter Design Quality & UI/UX Standards

This skill defines the permanent design quality standards, layout rules, component architectures, and visual verification criteria for all tools on **AnyConverter.io**.

## 1. When to Apply This Skill

Activate this skill whenever you are:
- Building, modifying, or reviewing tool user interfaces on AnyConverter.
- Implementing or modifying fullscreen interactions on any editor, calculator, or viewer panel.
- Adding or refactoring search toolbars, action buttons, panel headers, or status bars.
- Auditing responsive layouts across mobile (320px–390px), tablet (768px), laptop (1024px–1440px), and desktop (1920px).
- Verifying WCAG 2.2 AA accessibility, keyboard navigation, or touch target sizing.
- Adding multilingual support or reviewing Spanish (`es`) and Danish (`da`) tool templates.

---

## 2. Core Architectural Mandates

### Mandate 1: Dedicated One-Panel Fullscreen
- **Rule:** Fullscreen must NEVER show a 50/50 split of Input and Output simultaneously.
- When Output Fullscreen is activated, the Input panel must be hidden (`.fs-hidden-panel` with `display: none !important;`).
- When Input Fullscreen is activated, the Output panel must be hidden.
- The active panel must occupy the entire viewport: `position: fixed; inset: 0; width: 100vw; height: 100dvh; z-index: 10000;`.
- **Scroll Position:** Always capture `window.scrollY` before entering fullscreen, and restore it via `window.scrollTo({ top: savedScrollY, behavior: 'instant' })` upon exiting.
- **Escape Key:** Fullscreen must safely exit on `Escape` keypress or when clicking the `✕` close button.

### Mandate 2: Compact Professional Search Toolbar
- **Desktop Layout:** One single horizontal row. Never separate controls into multi-row dropdowns or large empty navigation bars.
  - Search icon (SVG 16×16px)
  - Compact search input (`height: 38px`, `width: 240px–320px` desktop)
  - Clear query button (`✕`) inside input wrapper
  - Scope dropdown (`height: 38px`, auto-width, `Keys + Values`, `Keys`, `Values`, `Regex`, `Path`)
  - Match counter badge (`tabular-nums`, `1 of 24` or `No matches`)
  - Previous (`‹`) and Next (`›`) buttons (`height: 38px`, min width `38px`)
- **Responsive Behavior:** Wrap gracefully into 2 balanced rows on screens $<600\text{px}$ without horizontal overflow.

### Mandate 3: Strict Toolbar Action Hierarchy
Organize panel headers into 3 semantic action groups:
1. `.ac-group-primary`: High-frequency tasks (`Copy`, `Download`)
2. `.ac-group-editor`: Content inspection (`Collapse All`, `Expand All`, `A−`, `A+`)
3. `.ac-group-window`: Pinned right (`margin-left: auto`), containing the fullscreen toggle (`⛶` / `✕`)

### Mandate 4: Responsive Safety Across 7 Mandatory Viewports
Layouts must pass visual and functional verification on all 7 target viewports:
- `320 × 568` (Small Mobile / iPhone SE)
- `390 × 844` (Standard Mobile / iPhone 14/15)
- `768 × 1024` (Tablet / iPad Mini)
- `1024 × 768` (Small Laptop)
- `1366 × 768` (Standard Laptop)
- `1440 × 900` (Modern Laptop)
- `1920 × 1080` (Full HD Desktop)

Rule: `0px` horizontal overflow on all viewports (`document.documentElement.scrollWidth <= window.innerWidth`).

### Mandate 5: Multilingual Safety (EN, ES, DA)
All shared components must support English, Spanish, and Danish copy without clipping, truncation, or broken button wrapping.

---

## 3. Design Tokens Reference

```css
/* Color Palette */
--color-primary:        #B04A45;
--color-primary-hover:  #963B37;
--color-primary-light:  #F3E7E4;
--color-bg:             #F7F6F3;
--color-surface:        #FFFFFF;
--color-surface-2:      #F5F1EE;
--color-border:         #DDD8D0;
--color-border-focus:   #B04A45;
--color-text:           #151515;
--color-text-2:         #3F3A36;
--color-text-3:         #7C7169;

/* Dark Mode Tokens */
:root.dark {
  --color-primary:        #C85A54;
  --color-primary-hover:  #A94640;
  --color-bg:             #11100E;
  --color-surface:        #1A1815;
  --color-surface-2:      #24211D;
  --color-border:         #403A33;
  --color-text:           #F7F3ED;
  --color-text-2:         #D9D1C7;
  --color-text-3:         #A89D92;
}

/* Controls */
--shadow-focus: 0 0 0 3px rgba(176, 74, 69, 0.2);
--radius-md:    8px;
```

---

## 4. Verification Workflow

When verifying UI changes:
1. Run `node tests/run_all_tests.js` to ensure zero regressions in repository test gates.
2. Launch Chrome via Playwright across the 7 mandatory viewports.
3. Test fullscreen entry and exit:
   - Verify Output panel fills `[0, 0, vp.w, vp.h]`.
   - Verify Input panel is completely hidden (`fs-hidden-panel`).
   - Verify scroll position is perfectly restored on `Escape` or `✕ Close`.
4. Test search functionality:
   - Type search query, verify count updates accurately.
   - Verify prev/next jump between matches.
   - Verify clear button resets state.
5. Stress-test virtualized renderer with multi-megabyte payloads up to 100 MB / 4M+ lines.

---

## 5. Permanent Design Quality Rules (Mandatory Quality Gates)

Every agent and developer working on AnyConverter must strictly enforce these 12 Mandatory Design Engineering Standards:

1. **Shared Form Controls Must Have Consistent Dimensions:**
   - Standard inputs (`.calc-input`, `input[type="number"]`, `input[type="text"]`, `input[type="month"]`) and `<select class="ac-select">` must have uniform `height: 44px; min-height: 44px; box-sizing: border-box;`.
   - Small toggle chips (`.ac-subchip`) must have fixed `height: 22px; font-size: 11px; padding: 2px 8px;`.
   - Blanket rules like `.tool-zone button { min-height: 44px; }` must explicitly exempt `.ac-subchip`, `.font-sz-btn`, and `.ac-btn-fs`.

2. **Related Controls Must Be Visually Grouped & Baseline-Aligned:**
   - Multi-column calculator inputs must have uniform label heights (`min-height: 24px; display: flex; align-items: flex-end; margin-bottom: 6px;`).
   - Group paired fields logically (e.g. Down Payment amount $ and percentage %).

3. **Primary Actions Must Be Discoverable Immediately:**
   - Format JSON, Generate SQL, Compare, and Calculate buttons must be positioned in the main workspace above or adjacent to the primary input canvas.
   - Users must NEVER be forced to scroll past a multi-hundred-pixel editor to find the action button.

4. **Tool Workspaces Take Priority Over Prose & Decoration:**
   - Decouple workspace max-width (`--ac-tool-max: 1800px;`) from article/prose max-width (`--ac-content-max: 860px;`).
   - Editors must have sensible minimum heights: clamp(340px, 44vh, 480px) for dual-pane diff/format editors. Never let `min-height: 0` collapse code editors into 80px slots.

5. **Dropdowns Must Be Recognizable and Accessible:**
   - Custom styled selects must always feature a visible SVG chevron icon with `padding-right: 36px`.
   - High-contrast chevrons must adapt automatically to Light and Dark modes.
   - NEVER overwrite `background:` shorthand in JavaScript or CSS because it destroys the SVG chevron image. Use `background-color:` instead.

6. **Responsive Layouts Must Use Available Space Appropriately:**
   - Desktop and laptop screens: `grid-template-columns: minmax(0, 1fr) minmax(260px, 320px);` ensuring workspace expansion while capping ad sidebar width.
   - Screen utilization must achieve $\ge 70\%$ on desktop monitors (1440px–1920px).

7. **Shared CSS Changes Must Be Tested on All Affected Tools:**
   - Any modification to `style.css` must be tested against JSON Compare, Mortgage Calculator, Loan Calculator, JSON Formatter, and CSV to SQL.

8. **Multilingual Parity (EN, ES, DA) Must Be Verified:**
   - German, Danish, and Spanish compound terms must not wrap awkwardly, overflow buttons, or displace sister controls.

9. **No Arbitrary Negative-Margin Fixes:**
   - Never use `margin-top: -15px` or similar hacks to correct layout misalignments. Fix the container flex/grid alignment or header box-model at the root.

10. **No Excessive `!important` Patches Without Documented Justification:**
    - Specificity bugs must be solved structurally by correcting class hierarchy, not by peppering global styles with `!important`.

11. **No Direct Manipulation of Unrelated Components to Fix a Local Defect:**
    - Fixing a calculator label must not alter global `.hero` or `.tool-wrapper` styling without assessing global blast radius.

12. **No Claiming Success Based Solely on Zero-Overflow Measurements:**
    - A page that centers in a narrow 600px column on a 1920px screen has zero overflow but is a severe layout failure. Always inspect workspace utilization, editor height, and element bounding boxes.

---

## 6. Mandatory Failure Conditions (Visual QA Gate)

Mark a layout test **FAIL** when any of the following occur:
- Interactive elements overlap, clip, or become inaccessible.
- Primary actions (`Format`, `Calculate`, `Generate SQL`) are unexpectedly hidden below the fold.
- Form fields in the same row have visibly mismatched heights ($>2\text{px}$ difference) or misaligned tops.
- Select dropdowns display without a recognizable chevron arrow.
- Editor workspace collapses below 300px or becomes cramped while surrounding viewport space is wasted.
- Horizontal screen utilization on 1920px screens drops below 60%.
- Content jumps unexpectedly between rows or produces orphaned single fields on desktop.
- Mobile touch targets measure $< 40\text{px}$ in height.
- Shared CSS creates visual regressions on other tool pages.
- Browser zoom at 125% or 150% clips text or causes inaccessible controls.
