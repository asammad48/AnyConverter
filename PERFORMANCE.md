# AnyConverter — Performance & Rendering Optimization

## Core Web Vitals Targets
- LCP (Largest Contentful Paint): < 2.5s
- CLS (Cumulative Layout Shift): < 0.1
- INP (Interaction to Next Paint): < 200ms

---

## Critical CSS Inline Pattern

Every page MUST inline the above-fold critical CSS in `<head>`.
This prevents render-blocking and achieves LCP under 1s.

### What goes inline (critical):
```css
<style>
/* Critical: header, hero, page bg — visible without scrolling */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-family:'Inter',system-ui,sans-serif;background:#F8F8FC;color:#1C1C2E}
body{min-height:100vh}
.site-header{position:sticky;top:0;z-index:100;height:64px;background:#fff;border-bottom:1px solid #E4E4EF;display:flex;align-items:center}
.header-inner{max-width:1280px;width:100%;margin:0 auto;padding:0 24px;display:flex;align-items:center;gap:32px}
.hero{padding:48px 24px;max-width:1280px;margin:0 auto}
.hero h1{font-size:clamp(1.75rem,4vw,2.25rem);font-weight:700;line-height:1.2;margin-bottom:12px}
.hero-desc{font-size:1.0625rem;color:#5C5C7A;max-width:680px;line-height:1.6}
/* Prevent CLS from fonts */
@font-face{font-family:'Inter';font-display:swap}
</style>
```

### What goes in style.css (non-critical):
Everything else: tool UI, sidebar, footer, dropdowns, etc.

---

## Script Loading Rules

### NEVER do this (blocks rendering):
```html
<script src="/assets/js/tools/json-formatter.js"></script>
```

### ALWAYS do this:
```html
<!-- Before </body>, with defer -->
<script src="/assets/js/shared.js" defer></script>
<script src="/assets/js/tools/json-formatter.js" defer></script>
```

### CDN scripts — async or defer:
```html
<!-- highlight.js — async since it doesn't need DOM -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" defer></script>

<!-- pdf-lib — defer, only on PDF pages -->
<script src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js" defer></script>

<!-- PapaParse — defer, only on CSV pages -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js" defer></script>

<!-- SQL.js — defer, only on CSV Query page -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.js" defer></script>
```

---

## Heavy Operations — Yield to Browser

For operations over 50ms (PDF processing, large CSV parsing):

```javascript
// WRONG — freezes UI
function processLargeFile(data) {
  // 500ms of work
  const result = heavyComputation(data);
  showResult(result);
}

// RIGHT — yields to browser, keeps UI responsive
async function processLargeFile(data) {
  showLoadingState();
  
  // Yield to browser paint
  await new Promise(resolve => setTimeout(resolve, 0));
  
  const result = heavyComputation(data);
  
  // Yield again before updating DOM
  await new Promise(resolve => setTimeout(resolve, 0));
  
  showResult(result);
  hideLoadingState();
}

// For chunk processing:
async function processInChunks(rows, chunkSize = 500) {
  const results = [];
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    results.push(...processChunk(chunk));
    
    // Update progress
    const progress = Math.round((i / rows.length) * 100);
    updateProgressBar(progress);
    
    // Yield every chunk
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  return results;
}
```

---

## Image Optimization

- All UI icons: SVG (no raster, no PNG icons)
- All `<img>` tags: explicit width + height attributes
- All `<img>` tags: `loading="lazy"` except logo in header
- Logo in header: `loading="eager"` (above fold)
- No decorative raster images anywhere

---

## Font Loading Optimization

```html
<!-- In <head>, before stylesheet -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Single request for both fonts -->
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
```

System font fallback (prevents CLS while Inter loads):
```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
               Roboto, Oxygen, Ubuntu, sans-serif;
}
code, pre, textarea.monospace {
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code',
               'Consolas', 'Courier New', monospace;
}
```

---

## AdSense CLS Prevention

AdSense slots MUST have reserved height to prevent CLS:

```html
<!-- Sidebar ad: reserve 600px -->
<div class="ad-slot ad-slot--sidebar" style="min-height:600px;width:300px;">
  <ins class="adsbygoogle" ...></ins>
</div>

<!-- Leaderboard ad: reserve 90px -->
<div class="ad-slot ad-slot--leaderboard" style="min-height:90px;">
  <ins class="adsbygoogle" ...></ins>
</div>

<!-- Rectangle ad: reserve 280px -->
<div class="ad-slot ad-slot--rectangle" style="min-height:280px;max-width:336px;">
  <ins class="adsbygoogle" ...></ins>
</div>
```

---

## Page Load Sequence

Optimal sequence for each page:

```
1. HTML starts parsing
2. Inline critical CSS renders header + hero instantly (0ms)
3. Google Fonts preconnect (parallel with HTML parse)
4. style.css loads (non-blocking thanks to rel=stylesheet after critical)
5. DOM ready
6. deferred scripts run: shared.js → tool JS → CDN libs
7. Tool is interactive (~200-400ms total)
8. AdSense loads last (async, doesn't block anything)
```

---

## Lazy Loading Tool CDN Dependencies

Only load CDN scripts on pages that need them:

```html
<!-- json-formatter/index.html ONLY -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" defer></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">

<!-- pdf-merge/index.html ONLY -->
<script src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js" defer></script>

<!-- csv-to-sql/index.html ONLY -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js" defer></script>

<!-- csv-query/index.html ONLY -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.js" defer></script>

<!-- markdown-html/index.html ONLY -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.6/marked.min.js" defer></script>
```

DO NOT load highlight.js, pdf-lib, PapaParse, etc. on pages that don't use them.

---

## Progress Indicators

For any operation > 500ms, show a progress indicator:

```html
<!-- Progress bar element (hidden by default) -->
<div class="progress-bar" id="progress-bar" role="progressbar"
     aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
     aria-label="Processing..." hidden>
  <div class="progress-fill" id="progress-fill"></div>
  <span class="progress-text" id="progress-text">Processing...</span>
</div>
```

```javascript
function setProgress(percent, message) {
  const bar = document.getElementById('progress-bar');
  const fill = document.getElementById('progress-fill');
  const text = document.getElementById('progress-text');
  
  bar.hidden = false;
  bar.setAttribute('aria-valuenow', percent);
  fill.style.width = percent + '%';
  text.textContent = message || `${percent}%`;
  
  if (percent >= 100) {
    setTimeout(() => { bar.hidden = true; }, 500);
  }
}
```

---

## Cache Headers

Set via `_headers` file for Cloudflare Pages:
- `/assets/*` — `Cache-Control: public, max-age=31536000, immutable`
  (1 year, assets have content-hash in URLs if versioned)
- `/*.html` — `Cache-Control: no-cache` (always fresh)
- `/sitemap.xml` — `Cache-Control: public, max-age=86400`

---

## Checklist Before Each Page is "Done"

- [ ] Critical CSS inlined in `<head>`
- [ ] All scripts have `defer`
- [ ] Only necessary CDN scripts loaded
- [ ] All images have width + height + loading=lazy
- [ ] Google Fonts preconnect present
- [ ] AdSense slots have min-height set
- [ ] No synchronous heavy operations (use async/await + setTimeout yield)
- [ ] Progress bar shown for operations > 500ms
- [ ] Tool is functional without any console errors
- [ ] All 10 SEO requirements met (see CLAUDE.md)
