# AnyConverter — UI/UX Specification (Updated)

## Core Layout Philosophy

Split-panel: LEFT = input/tool (flex:1), RIGHT = sidebar options (fixed 300px).
Output panel appears IMMEDIATELY beside input — no scrolling to see result.
White blocks (`background: #FFFFFF`) for all panels — clean separation from
the `#F8F8FC` page background. Every panel has a subtle `1px solid #E4E4EF` border.

---

## Color System

```css
:root {
  /* Brand */
  --ac-primary:        #5B5BD6;
  --ac-primary-hover:  #4747C2;
  --ac-primary-light:  #EEEDFE;
  --ac-primary-text:   #3C3489;

  /* Page & surfaces */
  --ac-page-bg:        #F8F8FC;   /* ← page background */
  --ac-white:          #FFFFFF;   /* ← panel/card backgrounds — WHITE BLOCKS */
  --ac-surface:        #F4F4F9;   /* panel headers, action bars, sidebars */
  --ac-border:         #E4E4EF;   /* all borders */
  --ac-border-focus:   #5B5BD6;

  /* Text */
  --ac-text:           #1C1C2E;
  --ac-text-2:         #5C5C7A;
  --ac-text-3:         #9898B2;

  /* Code editor — always dark */
  --ac-code-bg:        #0F0F1A;
  --ac-code-text:      #E2E8F0;
  --ac-code-key:       #86EFAC;   /* JSON keys */
  --ac-code-string:    #7DD3FC;   /* string values */
  --ac-code-number:    #FB923C;   /* numbers */
  --ac-code-bool:      #C084FC;   /* booleans */
  --ac-code-null:      #94A3B8;   /* null */
  --ac-code-bracket:   #E2E8F0;   /* brackets, punctuation */
  --ac-code-collapse:  #4A5568;   /* collapse toggle arrows */
  --ac-code-linenum:   #334155;   /* line numbers */

  /* Semantic */
  --ac-success:        #16A34A;
  --ac-success-bg:     #DCFCE7;
  --ac-error:          #DC2626;
  --ac-error-bg:       #FEE2E2;
  --ac-warning:        #D97706;
  --ac-warning-bg:     #FEF3C7;
  --ac-info:           #0369A1;
  --ac-info-bg:        #E0F2FE;

  /* Spacing */
  --ac-gap:            12px;
  --ac-panel-pad:      16px;
}

/* Dark mode — auto */
@media (prefers-color-scheme: dark) {
  :root {
    --ac-primary:        #7B7BF0;
    --ac-primary-light:  #1E1E3A;
    --ac-primary-text:   #CECBF6;
    --ac-page-bg:        #0F0F1A;
    --ac-white:          #18182A;
    --ac-surface:        #22223A;
    --ac-border:         #2E2E48;
    --ac-text:           #EDEDF8;
    --ac-text-2:         #9898C0;
    --ac-text-3:         #5C5C80;
  }
}
```

---

## Topbar — Sticky, Always Visible

```
Height: 56px | Background: --ac-white | Border-bottom: 1px --ac-border
Position: sticky top:0, z-index:200

[Logo]  [Nav pills: JSON | XML | CSV→SQL | Regex/Logs | Image | PDF | More▾]  [Lang▾] [🌙]

Logo: bolt icon (--ac-primary) + "AnyConverter" (16px, weight 600, --ac-text)
Nav pills: 13px, padding 6px 12px, border-radius 8px
  Default: color --ac-text-2
  Active/hover: background --ac-primary-light, color --ac-primary-text
  "More▾" opens a full dropdown grid of all tools

Scroll behavior:
  On scroll > 10px: add box-shadow: 0 1px 0 --ac-border
  Active tool pill stays highlighted at all times

Mobile: hamburger replaces nav pills (shows as overlay menu)
```

---

## Tool Page Layout — 3 Zones

```
┌─────────────────────────────────────────────────────────┐
│  TOPBAR (sticky 56px)                                    │
├──────────────────────────────────────┬──────────────────┤
│  TOOL ZONE (flex:1, min-width:0)     │  SIDEBAR (300px) │
│  ┌────────────────────────────────┐  │  White block      │
│  │ Sub-tabs (Formatter/Min/Valid) │  │  Options          │
│  ├─────────────────┬──────────────┤  │  toggles          │
│  │  INPUT PANEL    │ OUTPUT PANEL │  │  Stats            │
│  │  (white block)  │ (white block)│  │                   │
│  ├─────────────────┴──────────────┤  │  [AdSense slot]   │
│  │ ACTION BAR                     │  │                   │
│  └────────────────────────────────┘  │                   │
├──────────────────────────────────────┴──────────────────┤
│  [AdSense leaderboard]                                   │
├─────────────────────────────────────────────────────────┤
│  How to use | Features | FAQ                             │
└─────────────────────────────────────────────────────────┘
```

---

## White Block (Panel) — The Core Component

Every panel/card uses this exact style:
```css
.panel {
  background: var(--ac-white);        /* WHITE — not gray */
  border: 1px solid var(--ac-border);
  border-radius: 12px;
  overflow: hidden;
}
.panel-header {
  background: var(--ac-surface);      /* slightly off-white header */
  border-bottom: 1px solid var(--ac-border);
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
}
```

Panel header contains:
- Left: 16px icon + 12px label (--ac-text-2, weight 500)
- Right: action buttons (Upload, Paste, Clear, Copy, Download)

---

## JSON / XML Formatter — Specific UI Rules

### Split layout: INPUT left | OUTPUT right (50/50)
Both panels same height, both scrollable independently.

### Auto-format behavior
- Paste into input → output IMMEDIATELY shows formatted result (no button click needed)
- Debounce: 200ms after last keystroke
- Invalid JSON: output shows error overlay, input shows red border
- Status bar under each panel: "Valid JSON · 42 keys · 6 levels deep" OR "Error at line 3: Unexpected token"

### Collapsible nodes — CRITICAL UX
Every object `{}` and array `[]` in the output must have:
```
▾ "key": {          ← clicking ▾ collapses this node
    "nested": ...
  }

▶ "key": { … }     ← collapsed state — shows "{ … }" hint inline
```

Implementation:
- Small triangle toggle (▾/▶) on the left of every collapsible node
- Toggle is 14x14px, monospace color (#4A5568 dark mode), hover shows slightly lighter
- Click toggles that specific node only
- Keyboard: click on the key name also toggles
- "Collapse all" button in panel header — collapses all nodes
- "Expand all" button — expands all
- State persists while user edits input
- Collapsed nodes show inline summary: `{ 5 keys }` or `[ 3 items ]`

```javascript
// Collapse toggle HTML pattern per line:
`<span class="j-toggle" data-path="user.tags" aria-label="collapse node">▾</span>`

// Collapsed line HTML:
`<span class="j-toggle collapsed" data-path="user">▶</span>
 <span class="j-key">"user"</span>
 <span class="j-bracket">: </span>
 <span class="j-collapsed-hint">{ 5 keys }</span>`
```

### Same collapsible behavior for:
- XML formatter: collapse `<tag>...</tag>` subtrees
- C# class viewer: collapse class bodies, method bodies
- YAML formatter: collapse indented blocks
- All formatters share the same toggle CSS/JS pattern

---

## CSV → SQL — Large File UX (IMPORTANT)

### Upload flow
1. Drop zone shown first (full width of tool area)
2. File selected → DROP ZONE REPLACED by:
   a. Progress bar (immediately)
   b. Processing log (live messages)
   c. Preview table (shows as first chunk arrives)
   d. Column type grid (shows as headers are parsed)
3. "Generate SQL" button is enabled once first chunk parsed
4. User CAN set column types WHILE remaining chunks still load
5. After upload complete → smooth scroll to SQL output section

### Chunk processing spec
```javascript
// Process file in chunks using FileReader + PapaParse streaming
const CHUNK_SIZE = 1024 * 1024 * 5; // 5MB chunks

Papa.parse(file, {
  chunk: function(results, parser) {
    processChunk(results.data);
    updateProgress(parser.streamer._handle.bytesTotal, parser.streamer._handle.bytesLoaded);
    updateLog(`Chunk ${chunkNum++} done — ${totalRows.toLocaleString()} rows processed`);
    // yield to browser between chunks
    return new Promise(resolve => setTimeout(resolve, 0));
  },
  complete: function() {
    updateLog('All chunks processed — ready to generate SQL');
    scrollToSection('sql-output');  // AUTO-SCROLL after done
    enableGenerateButton();
  }
});
```

### Progress bar component
```
[File name] ─────────────────── 67%
████████████████████░░░░░░░░░░ 
Reading chunk 3 of 5 · 201,234 rows processed · ~2s remaining
```

Progress states with messages:
- "Loading file…"
- "Detecting delimiter… found: comma"
- "Parsing headers… 8 columns detected"
- "Processing chunk 1 of 5 (0–20%)…"
- "Auto-detecting column types…"
- "Chunk 2 complete — 246,891 rows loaded"
- "Almost done — finalizing…"
- "Done! 1,234,567 rows ready"
→ then auto-scroll to column type section

### Processing log (always visible while loading)
Dark terminal-style box (--ac-code-bg), monospace 11px, shows:
- Timestamp-prefixed messages
- Color-coded: green=success, yellow=progress, red=error
- Max 20 lines, auto-scrolls to bottom
- Persists after loading (user can review)

### Column type grid
- Appears as headers are detected (before all chunks finish)
- 2-column grid on desktop, 1-column on mobile
- Each cell: column name (monospace, truncated) + type `<select>`
- Auto-detected type pre-selected, badge shows "Auto" vs "Manual"
- Click any select to override
- "Auto-detect all" button resets all to algorithm choice
- Primary key checkbox on INT/BIGINT columns only

### Auto-scroll behavior
When file finishes loading → smooth scroll to column type section:
```javascript
document.getElementById('column-types').scrollIntoView({ behavior: 'smooth', block: 'start' });
```

When "Generate SQL" clicked → smooth scroll to SQL output:
```javascript
document.getElementById('sql-output').scrollIntoView({ behavior: 'smooth', block: 'start' });
```

---

## Log Extractor / Regex Tool

### What it does
- User pastes regex pattern at top
- User pastes log content (or uploads .log file)
- Tool extracts all matches + capture groups
- Highlights matching parts in the log view
- Exports matches as CSV or JSON

### Layout
```
[Pattern bar: / [input] /gm   [Flags: g i m s]   ✓ Valid]
─────────────────────────────────────────────────────────
[Log input panel]  |  [Matches output panel]
  - highlight        - Match 1: Group1, Group2...
    matches inline   - Match 2: ...
    in log text      - [Copy] [→ CSV] [→ JSON]
─────────────────────────────────────────────────────────
Sidebar: Quick patterns library
  - IP address
  - Date YYYY-MM-DD
  - Email address
  - HTTP status (404, 500 etc)
  - Log level [ERROR] [WARN] [INFO]
  - Stack trace line
  - UUID
  - Custom pattern (save your own)
```

### Highlight behavior
In the log input panel, matched text gets highlighted:
```css
.log-match-highlight {
  background: rgba(251, 191, 36, 0.25);  /* amber tint */
  border-radius: 2px;
  outline: 1px solid rgba(251, 191, 36, 0.5);
}
.log-group-1 { background: rgba(134, 239, 172, 0.2); }  /* group 1 = green */
.log-group-2 { background: rgba(125, 211, 252, 0.2); }  /* group 2 = blue */
.log-group-3 { background: rgba(192, 132, 252, 0.2); }  /* group 3 = purple */
```

---

## Sidebar — Right Panel (300px fixed)

Always a white block. Never gray. Contains:

### Structure
```
[Section: Options]
  option rows (label + select OR toggle)

[Section: Stats]
  2x2 stat cards grid (Keys, Depth, Bytes, Errors)

[Section: Processing log] (CSV/log tools only)
  dark terminal box

[AdSense slot — 300x250]
  min-height: 250px to prevent CLS
```

### Toggle component
```html
<div class="toggle-row">
  <span class="tog-label">Auto-format on paste</span>
  <div class="tog tog--on" role="switch" aria-checked="true" tabindex="0"></div>
</div>
```
```css
.tog { width:32px; height:18px; border-radius:99px; cursor:pointer; position:relative; }
.tog--on  { background: var(--ac-primary); }
.tog--off { background: var(--ac-border); }
.tog::after {
  content:''; position:absolute;
  width:14px; height:14px; border-radius:50%; background:#fff;
  top:2px; transition:left 0.15s;
}
.tog--on::after  { left:16px; }
.tog--off::after { left:2px; }
```

---

## Status Bar — Under Every Panel

```
[✓ Valid JSON]  ·  [42 keys]  ·  [3 levels]  ·  [right-aligned: 256 bytes]
```

Color rules:
- Valid / Success: --ac-success (#16A34A) with check icon
- Error: --ac-error (#DC2626) with × icon + "line 3: message"
- Processing: --ac-text-3 with spinner

---

## Toast Notifications

```
Position: bottom-right, 24px inset
Width: 320px
Animation: slide up from bottom (translateY 20px → 0)
Auto-dismiss: 3 seconds
Stack: up to 3 toasts visible

Types:
  ✓ Success: left border 3px --ac-success, bg --ac-success-bg
  ✕ Error:   left border 3px --ac-error,   bg --ac-error-bg
  ℹ Info:    left border 3px --ac-primary,  bg --ac-primary-light

Messages:
  "Copied to clipboard!"
  "Downloaded formatted.json"
  "SQL generated — 1,234 INSERT statements"
  "Error: unexpected token at line 3"
  "Large file detected — processing in chunks"
```

---

## Loading States

### Button loading state
```html
<button class="btn-primary loading" disabled>
  <span class="spinner"></span> Generating…
</button>
```
```css
.spinner {
  width:14px; height:14px; border:2px solid rgba(255,255,255,0.3);
  border-top-color:#fff; border-radius:50%;
  animation: spin 0.6s linear infinite; display:inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

### Panel skeleton loading (while chunk processes)
```css
.skeleton {
  background: var(--ac-surface);
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0%   { opacity: 0.6; }
  50%  { opacity: 1.0; }
  100% { opacity: 0.6; }
}
```

---

## Action Bar (between input/output and page content)

Full-width bar, --ac-surface background, 1px borders top/bottom:
```
[Format] [Minify] [Validate] [→ YAML] [→ CSV] [→ XML]   Auto-format: ON
```

Button order: Primary action first, then secondary, then conversion targets, then settings.
All buttons: 13px, padding 6px 12px, border-radius 8px, border 1px --ac-border.
Primary button (Format/Generate): --ac-primary bg, white text.
Others: transparent bg, --ac-text-2, hover shows --ac-surface bg.

---

## Dashboard / Homepage

```
┌──────────────────────────────────────────────────────┐
│  TOPBAR                                               │
├──────────────────────────────────────────────────────┤
│  HERO (white block, 80px vertical padding)            │
│  H1: "Free Online Converter & Formatter Tools"        │
│  Subtitle: "No signup. No upload. 100% in browser."  │
│  [Search tools input — full width, 48px tall]        │
├──────────────────────────────────────────────────────┤
│  TOOL GRID — 4 category sections                     │
│                                                      │
│  🔷 Developer Tools                                  │
│  [JSON] [XML] [Base64] [URL] [Regex] [Hash] [UUID]   │
│                                                      │
│  📄 PDF Tools                                        │
│  [Merge] [Compress] [Split] [→Word] [→Excel]         │
│                                                      │
│  📊 Data Tools                                       │
│  [CSV→SQL] [CSV Query] [JSON→CSV] [Timestamp]        │
│                                                      │
│  🖼 Image Tools                                      │
│  [Convert] [Compress] [Resize] [Color]               │
├──────────────────────────────────────────────────────┤
│  WHY ANYCONVERTER (3 white blocks side by side)       │
│  [🔒 Private]  [⚡ Fast]  [🆓 Always free]           │
├──────────────────────────────────────────────────────┤
│  FOOTER                                              │
└──────────────────────────────────────────────────────┘
```

### Tool card (homepage grid)
```
White block, 1px border, 12px radius, 16px padding
Hover: border-color --ac-primary, translateY(-2px)

[Icon 32px]  Tool Name (14px 600)
             Short description (12px --ac-text-2)
             "Try it →" link appears on hover
```

### Search behavior
- Search box filters tool cards live as user types
- Non-matching cards fade to 30% opacity + scale 0.98
- No page reload — pure JS filter
- Keyboard: Tab focuses cards, Enter opens tool

---

## C# Class / Code Formatters (future tools)

Same collapsible pattern as JSON formatter.
For C# specifically:
- Collapse class body: `public class User { … }`
- Collapse method body: `public void Save() { … }`
- Collapse namespace
- Color scheme:
  - Keywords (public, class, void, etc.): #C084FC (purple)
  - Type names: #7DD3FC (blue)
  - String literals: #86EFAC (green)
  - Comments: #4A5568 (muted)
  - Numbers: #FB923C (orange)

---

## Error Handling UX

### Invalid JSON/XML
- Red border (2px) on input panel
- Status bar: `✕ Error at line 3, col 14: Unexpected token '}'`
- Output panel: shows error card (not empty)
  ```
  ┌─────────────────────────────────────┐
  │  ✕ Invalid JSON                     │
  │  Line 3, col 14                     │
  │  Unexpected token '}'               │
  │  ... context snippet with ^ pointer │
  └─────────────────────────────────────┘
  ```
- Input textarea: red squiggle underline at error position

### File too large
- Show warning toast: "File is 250MB — using chunked processing"
- Never block or refuse — just process in chunks

### Browser doesn't support feature
- Graceful fallback message, never a crash
- e.g. if AVIF not supported: "Your browser doesn't support AVIF export. Try WebP instead."

---

## Accessibility

- Skip-to-content link: first `<a>` in body, visually hidden until focused
- All toggles: `role="switch"`, `aria-checked`, keyboard Space/Enter
- All icon-only buttons: `aria-label`
- Drag & drop zones: keyboard alternative always present (file input)
- Loading states: `aria-live="polite"` region for progress messages
- Error messages: `aria-describedby` linked to input
- Color contrast: all text ≥ 4.5:1 (WCAG AA)
- Focus rings: `outline: 2px solid var(--ac-primary)`, `outline-offset: 2px`
- Collapsible nodes: `aria-expanded` on toggle button

---

## Responsive Behavior

### Desktop (1024px+)
- Full split layout: input | output side by side
- Sidebar always visible at 300px
- Tool nav in topbar

### Tablet (768–1024px)
- Input above output (stacked), both full width
- Sidebar becomes collapsible panel (toggle button shows/hides)
- Tool nav in topbar (scrollable)

### Mobile (<768px)
- Single column: input → action bar → output → sidebar options
- Sidebar options collapse under an "Options ▾" accordion
- Sticky action bar at bottom of viewport (Format, Copy buttons)
- Font size 14px for code areas

---

## IMPORTANT: Things to Fix from Current Version

1. RIGHT SIDE TOO EMPTY — sidebar must always have:
   - Options/toggles
   - Stats cards
   - Related tool links
   - AdSense slot
   Never leave blank space in sidebar.

2. JSON OUTPUT = ALREADY FORMATTED — output panel shows formatted
   result the moment user pastes, before any button click.

3. COLLAPSE NODES — ▾/▶ toggle on every {} and [] in output.
   "Collapse all" and "Expand all" buttons in output panel header.

4. CSV LARGE FILE — progress bar + log + auto-scroll after done.
   Button click should smoothly scroll to relevant section, not jump.

5. LOG/REGEX TOOL — add to nav as "Regex / Logs" with:
   - Pre-built pattern library on sidebar
   - Group color coding in output
   - Export matches as CSV

6. STATUS BAR — every panel needs one, showing: valid/error + stats.

7. WHITE BLOCKS — all panels use white (#FFFFFF) background, not gray.

8. LOADER MESSAGES — specific, helpful messages per operation:
   "Parsing 87MB file in chunks…" not just "Loading…"
