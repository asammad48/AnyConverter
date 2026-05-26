# AnyConverter — Design System

## Design Philosophy
Clean, fast, trustworthy. Users arrive with a task — get out of their way.
Inspired by: Linear, Vercel, tools.pdf24.org
Feel: Professional dev tool with warm approachable edges.
NOT: Startup splash page. NOT: Dashboard complexity.

---

## Color Palette

### Primary Colors (CSS custom properties)
```css
:root {
  /* Brand */
  --color-primary:        #5B5BD6;  /* Indigo — main CTAs, links, active states */
  --color-primary-hover:  #4747C2;  /* Darker indigo on hover */
  --color-primary-light:  #EEEEFF;  /* Indigo tint — badges, highlights */

  /* Surface */
  --color-bg:             #F8F8FC;  /* Page background — barely-there lavender */
  --color-surface:        #FFFFFF;  /* Cards, tool panels */
  --color-surface-2:      #F2F2F8;  /* Input backgrounds, secondary surfaces */
  --color-border:         #E4E4EF;  /* Borders, dividers */
  --color-border-focus:   #5B5BD6;  /* Focus rings */

  /* Text */
  --color-text:           #1C1C2E;  /* Primary text — near black, slightly blue */
  --color-text-2:         #5C5C7A;  /* Secondary text — muted */
  --color-text-3:         #9898B2;  /* Placeholder, hint text */

  /* Semantic */
  --color-success:        #16A34A;
  --color-success-bg:     #DCFCE7;
  --color-error:          #DC2626;
  --color-error-bg:       #FEE2E2;
  --color-warning:        #D97706;
  --color-warning-bg:     #FEF3C7;

  /* Accents (tool category colors — used in tool card icons) */
  --color-json:           #F59E0B;  /* Amber — data tools */
  --color-pdf:            #EF4444;  /* Red — PDF tools */
  --color-image:          #8B5CF6;  /* Purple — image tools */
  --color-convert:        #06B6D4;  /* Cyan — converters */
  --color-text-tool:      #10B981;  /* Emerald — text tools */
  --color-code:           #3B82F6;  /* Blue — developer tools */
}
```

### Dark Mode
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary:        #7B7BF0;
    --color-primary-hover:  #9090F5;
    --color-primary-light:  #1E1E3A;
    --color-bg:             #0F0F1A;
    --color-surface:        #18182A;
    --color-surface-2:      #22223A;
    --color-border:         #2E2E48;
    --color-border-focus:   #7B7BF0;
    --color-text:           #EDEDF8;
    --color-text-2:         #9898C0;
    --color-text-3:         #5C5C80;
    --color-success-bg:     #052E16;
    --color-error-bg:       #450A0A;
    --color-warning-bg:     #451A03;
  }
}
```

---

## Typography

```css
/* Font stack */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;

/* Scale */
--text-xs:   0.75rem;   /* 12px — labels, badges */
--text-sm:   0.875rem;  /* 14px — secondary text, captions */
--text-base: 1rem;      /* 16px — body */
--text-lg:   1.125rem;  /* 18px — lead text */
--text-xl:   1.25rem;   /* 20px — card titles */
--text-2xl:  1.5rem;    /* 24px — H3, section titles */
--text-3xl:  1.875rem;  /* 30px — H2 */
--text-4xl:  2.25rem;   /* 36px — H1 tool pages */
--text-5xl:  3rem;      /* 48px — Homepage H1 */

/* Weight */
--weight-normal: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;

/* Line height */
--leading-tight:  1.25;
--leading-snug:   1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose:  2;
```

### Google Fonts Load (in every `<head>`)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
```

---

## Spacing

```css
--space-1:  0.25rem;   /* 4px */
--space-2:  0.5rem;    /* 8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-5:  1.25rem;   /* 20px */
--space-6:  1.5rem;    /* 24px */
--space-8:  2rem;      /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
```

---

## Border Radius

```css
--radius-sm:   4px;
--radius-md:   8px;
--radius-lg:   12px;
--radius-xl:   16px;
--radius-2xl:  24px;
--radius-full: 9999px;
```

---

## Shadows

```css
--shadow-sm:  0 1px 2px rgba(0,0,0,0.05);
--shadow-md:  0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04);
--shadow-lg:  0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.03);
--shadow-focus: 0 0 0 3px rgba(91,91,214,0.25);
```

---

## Layout

### Page Grid
```
Max width: 1280px, centered, 24px side padding on mobile, 40px on desktop

Tool page layout (desktop):
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (sticky, 64px tall)                                      │
├─────────────────────────────────────────────────────────────────┤
│ HERO (H1 + description, 120px padding top/bottom)               │
├───────────────────────────────┬─────────────────────────────────┤
│ TOOL PANEL (flex: 1)          │ SIDEBAR AD (300px fixed)        │
│                               │ [AdSense 300x600 sticky]        │
│  [Input area]                 │                                 │
│  [Action buttons]             │                                 │
│  [Output area]                │                                 │
│                               │                                 │
├───────────────────────────────┴─────────────────────────────────┤
│ AD SLOT 2 (full width, 728x90 centered)                         │
├─────────────────────────────────────────────────────────────────┤
│ HOW TO USE (3 steps)                                            │
├─────────────────────────────────────────────────────────────────┤
│ AD SLOT 3 (336x280 centered)                                    │
├─────────────────────────────────────────────────────────────────┤
│ FAQ (5 questions, accordion)                                    │
├─────────────────────────────────────────────────────────────────┤
│ RELATED TOOLS (6 cards)                                         │
├─────────────────────────────────────────────────────────────────┤
│ FOOTER                                                          │
└─────────────────────────────────────────────────────────────────┘

Mobile: sidebar ad moves below tool output. Single column.
```

---

## Header Component

```
Height: 64px, sticky top, background: var(--color-surface),
border-bottom: 1px solid var(--color-border),
backdrop-filter: blur(8px) on scroll

Left:  Logo (SVG icon + "AnyConverter" wordmark, 24px semibold)
Center: Nav links — JSON | XML | Images | PDF | More ▼  (hidden on mobile)
Right: Language switcher dropdown + optional dark mode toggle

Logo colors: icon in --color-primary, wordmark in --color-text

Nav link style:
- Default: var(--color-text-2), no underline
- Hover: var(--color-text), slight bg highlight
- Active/current page: var(--color-primary), colored left border

Language switcher:
- Button shows flag emoji + code: "🇺🇸 EN"
- Dropdown: EN / ES / DA with flag
- Stores choice in localStorage key "ac_lang"
- Links to equivalent page in chosen language

Mobile header:
- Logo left, hamburger right
- Full-screen overlay menu on open
- Language switcher inside mobile menu
```

---

## Tool Card (Homepage Grid)

```
Card size: min 200px, responsive grid (auto-fill)
Padding: 20px
Border: 1px solid var(--color-border)
Border-radius: var(--radius-lg)
Background: var(--color-surface)
Shadow: var(--shadow-sm)
Hover: shadow-md, border-color var(--color-primary), translateY(-2px)
Transition: all 0.15s ease

Structure:
┌─────────────────────────┐
│  [Icon 40x40]           │
│                         │
│  Tool Name (16px 600)   │
│  Short desc (14px muted)│
│                         │
│  [Try it →]             │
└─────────────────────────┘

Icon: SVG, colored with tool category color (--color-json, etc)
"Try it →" link: var(--color-primary), appears on hover
```

---

## Drag & Drop Zone

```
Default state:
  Border: 2px dashed var(--color-border)
  Border-radius: var(--radius-xl)
  Background: var(--color-surface-2)
  Padding: 48px 24px
  Text: "Drop files here or click to browse"
  Icon: Upload SVG (48px, var(--color-text-3))

Hover/dragover state:
  Border: 2px dashed var(--color-primary)
  Background: var(--color-primary-light)
  Icon color: var(--color-primary)
  Scale: 1.01 transform

Active/file loaded state:
  Border: 2px solid var(--color-success)
  Background: var(--color-success-bg)
  Show: filename, file size, remove (×) button

Multiple files:
  Show file list below drop zone
  Each file: icon + name + size + ✕ remove button
  Drag handles on left for reordering (PDF merge)
```

---

## Button Styles

```css
/* Primary */
.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}
.btn-primary:hover  { background: var(--color-primary-hover); }
.btn-primary:active { transform: scale(0.98); }

/* Secondary */
.btn-secondary {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  /* same padding/radius as primary */
}
.btn-secondary:hover { background: var(--color-surface-2); border-color: var(--color-text-3); }

/* Icon button (Copy, Download) */
.btn-icon {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 13px;
}

/* Danger */
.btn-danger { background: var(--color-error); color: white; }

/* Disabled */
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
```

---

## Input / Textarea

```css
input, textarea, select {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  font-family: var(--font-sans);
  font-size: 15px;
  color: var(--color-text);
  transition: border-color 0.15s, box-shadow 0.15s;
  width: 100%;
}
input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: var(--shadow-focus);
}
textarea { font-family: var(--font-mono); font-size: 14px; resize: vertical; min-height: 200px; }
```

---

## Code Output Area

```
Font: JetBrains Mono, 13px
Background: #0F0F1A (always dark, even in light mode)
Color: #E2E8F0
Border-radius: var(--radius-lg)
Padding: 20px
Overflow: auto
Max-height: 500px (scrollable)
Line-numbers: shown in left gutter, color #4A5568

Top-right corner buttons (absolute positioned):
  [Copy] [Download] [Expand]
  Small icon buttons, semi-transparent background

Syntax colors (highlight.js theme — custom):
  String:   #7DD3FC  (sky blue)
  Number:   #FB923C  (orange)
  Boolean:  #C084FC  (purple)
  Null:     #94A3B8  (slate)
  Key/prop: #86EFAC  (green)
  Bracket:  #E2E8F0  (white)
  Error:    #FCA5A5  (red underline)
```

---

## Tool Action Bar

```
Sits between input and output, full width
Background: var(--color-surface-2)
Border-top/bottom: 1px solid var(--color-border)
Padding: 12px 16px
Display: flex, wrap, gap: 8px

Left side: action buttons (Format, Minify, Validate, etc.)
Right side: utility buttons (Clear, Copy, Download)

On mobile: scrolls horizontally, buttons don't wrap
```

---

## FAQ Accordion

```html
<details class="faq-item">
  <summary class="faq-question">
    <!-- question text -->
    <span class="faq-icon">+</span>
  </summary>
  <div class="faq-answer">
    <!-- answer text -->
  </div>
</details>
```

```
summary: padding 16px, font-weight 500, cursor pointer
  border-bottom: 1px solid var(--color-border)
  list-style: none (hide default triangle)
  [open] summary: color var(--color-primary)
faq-icon: rotates 45deg when open (CSS transition)
faq-answer: padding 16px, color var(--color-text-2), line-height 1.6
```

---

## Tab Switcher (used in Base64: Text/File mode)

```
Tabs bar: border-bottom 2px solid var(--color-border)
Tab button:
  Default: color var(--color-text-2), no border, padding 10px 20px
  Active: color var(--color-primary),
          border-bottom: 2px solid var(--color-primary),
          margin-bottom: -2px (overlap the bar border)
Tab panels: only active panel visible (display:none / display:block)
```

---

## Status / Toast Notifications

```
Position: fixed bottom-right, 24px from edges
Width: 320px max
Padding: 14px 16px
Border-radius: var(--radius-lg)
Shadow: var(--shadow-lg)
Display: flex, align-items: center, gap: 12px

Types:
  Success: bg var(--color-success-bg), left border 3px var(--color-success)
  Error:   bg var(--color-error-bg),   left border 3px var(--color-error)
  Info:    bg var(--color-primary-light), left border 3px var(--color-primary)

Behavior:
  Slides in from bottom-right (transform translateX animation)
  Auto-dismisses after 3 seconds
  Has × close button
  Stacks if multiple toasts
```

---

## Responsive Breakpoints

```css
--bp-sm:  640px;   /* Mobile landscape */
--bp-md:  768px;   /* Tablet */
--bp-lg:  1024px;  /* Desktop */
--bp-xl:  1280px;  /* Wide desktop */

/* Mobile-first: write base styles for mobile, override up */
@media (min-width: 768px)  { /* tablet+ */ }
@media (min-width: 1024px) { /* desktop+ */ }
```

---

## Column Type Selector (CSV to SQL specific)

```
Below CSV preview table, above SQL output.
One dropdown per column detected from CSV headers.

Layout:
  Grid: repeat(auto-fill, minmax(180px, 1fr)), gap 12px
  Each item:
    Label: column name (monospace, 13px, truncated with ellipsis)
    Below label: <select> with SQL types:

    SQL types in dropdown:
      VARCHAR(255)  — default for text
      INT
      BIGINT
      DECIMAL(10,2)
      BOOLEAN
      DATE
      DATETIME
      TEXT
      FLOAT
      AUTO INCREMENT (marks as primary key)

    Type is auto-detected from CSV data sample:
      All digits → INT suggestion
      Decimal numbers → DECIMAL suggestion
      true/false/0/1 → BOOLEAN suggestion
      Date patterns → DATE suggestion
      Long text → TEXT suggestion
      Default → VARCHAR(255)

  "Auto-detect all" button resets all to detected types
  "Reset all" button resets all to VARCHAR(255)
```

---

## Scrollbar Style

```css
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-text-3); }
```
