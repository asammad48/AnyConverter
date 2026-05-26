# AnyConverter — Tools Specification

## Tool Priority Order (build in this order)
1. JSON Formatter
2. Image Converter
3. PDF Merge
4. PDF Compress
5. Base64 Encoder/Decoder
6. XML Formatter
7. CSV to SQL
8. URL Encoder/Decoder
9. PDF Split
10. Regex Tester
11. Hash Generator
12. Timestamp Converter
13. CSV Query Tool
14. Markdown to HTML
15. Color Converter

---

## 1. JSON Formatter
**URL:** `/json-formatter/`
**JS file:** `/assets/js/tools/json-formatter.js`
**CDN needed:** highlight.js

### UI Layout
```
[Textarea input — monospace, 300px min-height, placeholder: "Paste JSON here..."]

[Action bar]
  Left:  [Format ↵] [Minify] [Validate]
  Right: [Clear] [Copy Input] [Upload .json]

[Output panel — dark code block with line numbers]
  Top-right: [Copy Output] [Download .json]

[Status bar below output]
  Shows: "✓ Valid JSON — 42 keys, 156 lines" OR "✗ Error at line 12: Unexpected token"
```

### Behavior
- Format button: pretty-print with 2-space indent
- Minify button: remove all whitespace
- Validate button: show green success or red error with exact position
- Auto-validate on input change (debounced 500ms) — show inline error underlines
- Syntax highlighting via highlight.js (json language)
- Line numbers shown in output gutter
- Copy Output: copies formatted JSON, shows toast "Copied!"
- Download: saves as `formatted.json`
- Upload: accepts `.json` files, loads into input textarea
- Stats bar: key count, line count, file size estimate

### SEO Content on Page
- H1: "JSON Formatter & Validator Online — Free"
- Description paragraph: explain what JSON formatting is, why needed
- H2 "How to Format JSON": 3 steps (paste, click format, copy)
- H2 "Features": bullet list — fast, private, browser-only
- H2 "FAQ": 5 questions about JSON formatting

---

## 2. XML Formatter
**URL:** `/xml-formatter/`
**JS file:** `/assets/js/tools/xml-formatter.js`
**CDN needed:** highlight.js

### UI Layout
```
[Textarea input — 300px, placeholder: "Paste XML here..."]

[Action bar]
  Left:  [Format] [Minify] [Validate]
  Right: [Clear] [Copy] [Upload .xml]

[Output panel — dark code block]
  [Copy Output] [Download .xml]

[Status: "✓ Valid XML" or "✗ Error: line X — message"]
```

### Behavior
- Format: indent with 2 spaces using DOMParser + XMLSerializer
- Minify: collapse to single line
- Validate: use DOMParser, check for `parsererror`
- Highlight: highlight.js xml language
- Error shows exact line/column

---

## 3. Image Converter
**URL:** `/image-converter/`
**JS file:** `/assets/js/tools/image-converter.js`
**CDN needed:** none (Canvas API)

### UI Layout
```
[Drag & Drop zone — large, centered]
  "Drop image here or click to browse"
  Accepts: PNG, JPG, JPEG, WebP, BMP, GIF, AVIF
  Shows preview thumbnail after selection

[Settings panel — shows after file selected]
  ┌──────────────────────────────────────────────┐
  │  Output Format:  [PNG ▼] [JPG ▼] [WebP ▼]   │
  │                  [BMP]   [AVIF]               │
  │                                               │
  │  Quality:  ━━━━━━●━━━━━  85%                 │
  │  (shown only for JPG and WebP)                │
  │                                               │
  │  Resize:   Width [____px]  Height [____px]   │
  │            ☑ Keep aspect ratio               │
  │            [Reset to original]                │
  │                                               │
  │  [Convert & Download ↓]                       │
  └──────────────────────────────────────────────┘

[Preview: side-by-side original vs converted]
  Original: name, size, dimensions
  Converted: estimated size, dimensions
```

### Behavior
- Format selector: segmented button group (visual toggle, not dropdown)
- Quality slider: only enabled for JPG/WebP, hidden for PNG/BMP
- Aspect ratio lock: changing width recalculates height and vice versa
- Preview: draw to canvas → toBlob() → display
- Convert: canvas.toBlob() → download link
- Multiple files: allow batch, show list, convert all as ZIP
- AVIF: attempt via canvas, fallback message if browser unsupported

---

## 4. PDF Merge
**URL:** `/pdf-merge/`
**JS file:** `/assets/js/tools/pdf-merge.js`
**CDN needed:** `https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js`

### UI Layout
```
[Drag & Drop zone — accepts multiple PDFs]
  "Drop PDF files here or click to browse"
  After files added, shows file list:

[File list — drag to reorder]
  ┌─────────────────────────────────────────┐
  │ ⠿  📄 document1.pdf    234 KB   [✕]    │
  │ ⠿  📄 report.pdf       1.2 MB   [✕]    │
  │ ⠿  📄 invoice.pdf      56 KB    [✕]    │
  └─────────────────────────────────────────┘
  ⠿ = drag handle (grippy dots icon)
  [+ Add more files]

[Options]
  Output filename: [merged.pdf________]

[Merge button — primary, full width on mobile]
  [Merge PDFs →]

[Progress bar during merge]
[Download link appears after merge]
```

### Behavior
- Drag-to-reorder: HTML5 draggable or mouse events on list items
- Drag handle: only dragging from ⠿ icon initiates reorder
- Remove (✕): removes file from list
- Add more: opens file picker, appends to list
- Merge: pdf-lib PDFDocument.create() → copyPages() from each doc → save()
- Progress: update per file processed
- Output filename: editable, defaults to "merged.pdf"
- File size preview: show total estimated size before merging

---

## 5. PDF Compress
**URL:** `/pdf-compress/`
**JS file:** `/assets/js/tools/pdf-compress.js`
**CDN needed:** pdf-lib

### UI Layout
```
[Drop zone — single PDF]

[After file loaded]
  Original size: 2.4 MB
  
  Compression level:
  ○ Low     — minimal compression, best quality
  ● Medium  — balanced (recommended)
  ○ High    — maximum compression, smaller file

[Compress button]

[Result]
  ✓ Compressed!
  Original:   2.4 MB
  Compressed: 1.1 MB
  Saved:      54%  ████████░░ (visual bar)
  [Download compressed.pdf ↓]
```

### Behavior
- pdf-lib: load document, removeTrailerInfo(), strip metadata
- Medium: also set compression on streams
- High: additionally downsample images (attempt via pdf-lib)
- Show real before/after byte counts
- If compressed is LARGER than original, show warning and offer original

---

## 6. Base64 Encoder/Decoder
**URL:** `/base64-encoder/`
**JS file:** `/assets/js/tools/base64.js`
**CDN needed:** none

### UI Layout
```
[Tab bar: [Text Mode] [File Mode]]

Text Mode:
  ┌─────────────────┬──────────────────┐
  │ Input           │ Output           │
  │ [Textarea]      │ [Textarea readonly│
  │                 │  monospace]      │
  └─────────────────┴──────────────────┘
  [Encode →]  [← Decode]  [Swap ⇄]  [Clear]
  [Copy Output]

File Mode:
  [Drop zone]
  After file:
    File: photo.jpg (245 KB)
    [Encode to Base64]
    
    Output:
    [Textarea showing Base64 string, readonly]
    [Copy] [Download as .txt]
    
    Data URL:
    [data:image/jpeg;base64,/9j/4AA...]
    [Copy Data URL]
    (if image: shows preview using data URL as src)
```

### Behavior
- Text encode: btoa(unescape(encodeURIComponent(input))) — handles Unicode
- Text decode: decodeURIComponent(escape(atob(input)))
- Auto-detect on input: if input looks like base64 → suggest decode
- File encode: FileReader.readAsDataURL → split off data: prefix for raw base64
- Swap: moves output to input for chaining operations

---

## 7. CSV to SQL
**URL:** `/csv-to-sql/`
**JS file:** `/assets/js/tools/csv-to-sql.js`
**CDN needed:** PapaParse `https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js`

### UI Layout
```
STEP 1 — Input
  [Tab: Paste CSV] [Tab: Upload CSV]
  
  Paste tab: [Textarea — monospace, 200px]
  Upload tab: [Drop zone for .csv files]
  
  CSV Options:
    Delimiter: [Auto ▼] (comma, semicolon, tab, pipe)
    ☑ First row is header

STEP 2 — Preview & Column Types (shows after parsing)
  "Detected 5 columns, 1,234 rows"
  
  Preview table (first 5 rows, scrollable horizontally):
  ┌──────────────┬──────────────┬──────────────┐
  │ id           │ name         │ created_at   │
  ├──────────────┼──────────────┼──────────────┤
  │ 1            │ Alice        │ 2024-01-15   │
  │ 2            │ Bob          │ 2024-01-16   │
  └──────────────┴──────────────┴──────────────┘
  
  Column Type Configuration:
  ┌─────────────────┬─────────────────┬─────────────────┐
  │ id              │ name            │ created_at       │
  │ [INT ▼]         │ [VARCHAR(255)▼] │ [DATE ▼]        │
  │ ☑ Primary Key   │                 │                  │
  └─────────────────┴─────────────────┴─────────────────┘
  [Auto-detect types] [Reset all to VARCHAR]

STEP 3 — SQL Options
  Table name: [my_table___________]
  
  Generate:
  ☑ CREATE TABLE statement
  ☑ INSERT statements  
  ☐ DROP TABLE IF EXISTS
  ☐ Batch INSERT (500 rows per statement)
  
  SQL Dialect: [MySQL ▼] [PostgreSQL] [SQLite]

STEP 4 — Output
  [Generate SQL button — primary]
  
  [Output code block with syntax highlighting]
  [Copy SQL] [Download .sql]
  
  Stats: "Generated 1,234 INSERT statements (42 KB)"
```

### Behavior
- PapaParse for CSV parsing (handles quotes, escaping, various delimiters)
- Auto-detect column types from first 50 rows of data
- Primary key checkbox only on INT/BIGINT columns
- MySQL: backtick quoting, AUTO_INCREMENT
- PostgreSQL: double-quote, SERIAL for auto-increment
- SQLite: no type enforcement, INTEGER PRIMARY KEY AUTOINCREMENT
- Large files (>10k rows): process in chunks, show progress
- Values are properly escaped (replace ' with '')
- NULL handling: empty cells → NULL in SQL

---

## 8. URL Encoder/Decoder
**URL:** `/url-encoder/`
**JS file:** `/assets/js/tools/url-encoder.js`
**CDN needed:** none

### UI Layout
```
[Mode toggle: [Encode Component] [Encode Full URL] [Decode]]

┌─────────────────────────────────────────────────────┐
│ Input                                               │
│ [Textarea — large, placeholder varies by mode]      │
└─────────────────────────────────────────────────────┘
                    [↕ Convert]
┌─────────────────────────────────────────────────────┐
│ Output                                              │
│ [Textarea — readonly, monospace]                    │
└─────────────────────────────────────────────────────┘
[Copy Output]  [Swap ⇄]  [Clear]

Below: Diff view showing what changed (highlighted chars)
```

### Behavior
- Encode component: encodeURIComponent()
- Encode full URL: encode only non-URL characters, preserve ://&=?#
- Decode: decodeURIComponent()
- Live conversion: updates output on input change (debounced 300ms)
- Diff highlight: changed characters highlighted in output

---

## 9. PDF Split
**URL:** `/pdf-split/`
**JS file:** `/assets/js/tools/pdf-split.js`
**CDN needed:** pdf-lib

### UI Layout
```
[Drop zone — single PDF]

After file loaded: "document.pdf — 24 pages"

Split mode:
  ○ Extract specific pages   e.g. 1,3,5-8,12
  ○ Split every N pages      N: [2___]
  ○ Split into equal parts   Parts: [3___]
  ○ Extract each page as separate PDF

[Page range input — shown for first option]
  [1,3,5-8,12_______________]
  "Use commas for individual pages, dashes for ranges"

[Preview: which pages will be in each output file]
  File 1: pages 1, 3
  File 2: pages 5, 6, 7, 8
  File 3: page 12

[Split button]
[Download as ZIP (when multiple files)]
```

---

## 10. Regex Tester
**URL:** `/regex-tester/`
**JS file:** `/assets/js/tools/regex-tester.js`
**CDN needed:** none

### UI Layout
```
Pattern input:
┌─────────────────────────────────────┬──────────────┐
│ /  [pattern input]                / │ [g][i][m][s] │
└─────────────────────────────────────┴──────────────┘
  Flags: toggle buttons (g=global, i=case insensitive, m=multiline, s=dotAll)
  Right of pattern: "✓ Valid" / "✗ Invalid regex" badge

Test string:
┌────────────────────────────────────────────────────┐
│ [Textarea with highlighted matches inline]          │
│ The [quick] [brown] fox...  ← matches highlighted  │
└────────────────────────────────────────────────────┘

Match results:
  4 matches found
  ┌─────────────────────────────────────────────────┐
  │ Match 1: "quick"  at index 4-8                  │
  │   Group 1: "qui"                                │
  │   Group 2: "ck"                                 │
  ├─────────────────────────────────────────────────┤
  │ Match 2: "brown"  at index 10-14                │
  └─────────────────────────────────────────────────┘

[Cheat sheet toggle — show/hide regex reference]
```

### Behavior
- Live matching: re-runs on every keystroke (debounced 200ms)
- Highlight matches in textarea using a positioned overlay div
- Named groups shown with group name
- Cheat sheet: collapsible reference (anchors, quantifiers, groups, etc.)
- If no global flag: highlight just first match

---

## 11. Hash Generator
**URL:** `/hash-generator/`
**JS file:** `/assets/js/tools/hash-generator.js`
**CDN needed:** none (Web Crypto API)

### UI Layout
```
[Tab: Text Input] [Tab: File Input]

Text tab:
  [Textarea — "Enter text to hash..."]

File tab:
  [Drop zone]
  Large files: shows progress bar while hashing

[Generate Hashes button] (or auto-generates on type for text)

Results:
┌──────────────────────────────────────────────────────────┐
│ MD5       [d41d8cd98f00b204e9800998ecf8427e]  [Copy]     │
│ SHA-1     [da39a3ee5e6b4b0d3255bfef95601890] [Copy]      │
│ SHA-256   [e3b0c44298fc1c149afbf4c8996fb924...] [Copy]   │
│ SHA-512   [cf83e1357eefb8bdf1542850d66d8007...] [Copy]   │
└──────────────────────────────────────────────────────────┘
Note: MD5 not in Web Crypto — use pure-JS fallback for MD5 only
```

### Behavior
- SHA-1/256/512: SubtleCrypto API (crypto.subtle.digest)
- MD5: small pure-JS implementation (no CDN needed, ~2KB)
- Auto-generate on text input (debounced 400ms)
- File: read as ArrayBuffer, hash, show progress for large files
- All hashes shown simultaneously
- Each row: algorithm name, hex output (monospace), copy button

---

## 12. Timestamp Converter
**URL:** `/timestamp-converter/`
**JS file:** `/assets/js/tools/timestamp.js`
**CDN needed:** none

### UI Layout
```
[Unix Timestamp input]   ↔   [Human Date/Time]
[1716278400__________]       [2024-05-21 12:00:00 UTC]

[Now button — fills with current timestamp]
[Timezone selector: UTC, Local, or IANA timezone list]

Conversions shown:
  Unix (seconds):         1716278400
  Unix (milliseconds):    1716278400000
  ISO 8601:               2024-05-21T12:00:00.000Z
  RFC 2822:               Tue, 21 May 2024 12:00:00 +0000
  Relative:               "5 days ago" / "in 3 hours"
  
[Copy each value individually]
```

---

## 13. Markdown to HTML
**URL:** `/markdown-html/`
**JS file:** `/assets/js/tools/markdown.js`
**CDN needed:** marked.js `https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.6/marked.min.js`

### UI Layout
```
[Two-panel layout, side by side on desktop]

Left panel: [Textarea — Markdown input]
Right panel: [Rendered HTML preview — live]

Below:
[View: Rendered Preview] [View: HTML Source]

HTML source view: code block with highlight.js HTML highlighting
[Copy HTML] [Download .html]
```

---

## 14. Color Converter
**URL:** `/color-converter/`
**JS file:** `/assets/js/tools/color-converter.js`
**CDN needed:** none

### UI Layout
```
[Large color preview swatch — 200px tall, full width]
[Color picker input — native <input type="color">]

Formats:
  HEX:   [#5B5BD6________________] [Copy]
  RGB:   [rgb(91, 91, 214)_______] [Copy]
  HSL:   [hsl(240, 57%, 60%)_____] [Copy]
  CMYK:  [cmyk(57%, 57%, 0%, 16%)] [Copy]
  HSB:   [hsb(240, 57%, 84%)_____] [Copy]

Any field: edit value → others update live

[Color name if recognizable: "Medium Slate Blue"]

Palette: [5 lighter shades] [base] [5 darker shades]
Each shade: swatch + hex + copy on click
```

---

## Shared: CSV Query Tool
**URL:** `/csv-query/`
**JS file:** `/assets/js/tools/csv-query.js`
**CDN needed:** SQL.js (WASM) — load from CDN

### UI Layout
```
[Drop zone / paste for CSV file]

After load: "Loaded: data.csv — 1,234 rows, 8 columns"

[SQL Query textarea — monospace]
  Default query: SELECT * FROM data LIMIT 10

[Run Query button] [Format SQL button]

Results table:
  Paginated (50 rows per page)
  Sortable columns (click header)
  [Export results as CSV] [Export as JSON]

Query history: last 5 queries, clickable to restore
```

---

## Performance Rules for All Tool JS Files

```javascript
// Pattern for every tool JS file:

// 1. Wait for DOM
document.addEventListener('DOMContentLoaded', () => {

  // 2. Get elements once, store in variables
  const input = document.getElementById('input');
  const output = document.getElementById('output');

  // 3. Debounce for live-update inputs
  let debounceTimer;
  function debounce(fn, ms = 400) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fn, ms);
  }

  // 4. Show toast notifications
  function toast(message, type = 'success') {
    // use shared toast function from shared.js
    window.showToast(message, type);
  }

  // 5. Copy to clipboard helper
  async function copyToClipboard(text) {
    await navigator.clipboard.writeText(text);
    toast('Copied to clipboard!');
  }

  // 6. Init
  bindEvents();
});
```
