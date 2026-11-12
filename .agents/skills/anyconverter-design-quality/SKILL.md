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

Every agent and developer working on AnyConverter must strictly enforce these 7 core rules:

1. **Never duplicate functionally identical search interfaces in the same visible workspace without a justified reason.**
   - If search controls already exist in the active sidebar or toolbar, do not render a second search bar inside normal mode editor panels.
   - Fullscreen mode may display a dedicated search toolbar because sidebars are hidden in fullscreen.

2. **Fullscreen utility toolbars must use compact horizontal layouts on desktop.**
   - All fullscreen search and control components must occupy exactly ONE horizontal row on desktop/laptop screens (`[Search...] [Scope ▼] [0 / 0] [Prev] [Next] [Clear]`).
   - Never allow controls to wrap into 2 or 3 rows on desktop screens.

3. **Inputs and dropdowns should not expand to full width without functional justification.**
   - Desktop search inputs must be constrained (220px–260px wide).
   - Scope select dropdowns must be constrained (140px–170px wide) and must override global `select { width: 100% }` defaults.
   - Navigation and action buttons must maintain ergonomic fixed dimensions (36 × 36px).

4. **The editor must receive priority over controls and decoration.**
   - Toolbars and headers must remain compact (height 36px–52px) to maximize available viewport canvas for code, data, and document viewing.

5. **Sidebar sections must follow the specified information hierarchy.**
   - Required standard sidebar hierarchy:
     1. Advertisement
     2. Search
     3. Options
     4. Bookmarks / Secondary features
     5. Stats / Diagnostics

6. **Verify final rendered appearance, not merely CSS class presence.**
   - Do not claim PASS based solely on HTML presence or class attributes.
   - Visually inspect rendered screenshots to verify layout, alignment, and lack of visual collisions.

7. **Test actual component bounding rectangles, computed styles, and visual spacing.**
   - Verify that bounding boxes (`getBoundingClientRect()`) match layout specifications.
   - Assert single-row baseline alignment (`Math.round(rect.y)`) and verify that controls never overlap or horizontally overflow.
