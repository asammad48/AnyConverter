# Handover prompt for ChatGPT

Copy everything below the line into ChatGPT (or Codex) together with access to this
repository. Fill in the **Your task** section first, or leave it as is to let the
agent pick up the suggested next steps.

---

You are taking over development of **AnyConverter** (https://anyconverter.io), a static,
multi-language website of free online tools (EN / ES / DA). Another AI agent did the
work so far. Read this whole brief before you change anything.

## 1. Repository and branches

- Repo: `asammad48/AnyConverter`. Default branch: `main`.
- Open pull request **#14** (`ccr-efb25701-7k5f2l` → `main`) has all recent work and is
  not merged yet. This branch, `chatgpt-handover`, starts from that PR's head, so you
  have everything in it.
- Create your own branch from `chatgpt-handover` (or from `main` once #14 is merged).
  Don't push to `ccr-efb25701-7k5f2l` or `main` unless the owner asks you to.
- Write commit messages in plain English that say what changed and why.

## 2. Project rules (non-negotiable — from `CLAUDE.md`, read it in full)

- Static site on Cloudflare Pages. **No frameworks, no build step at runtime**: plain
  HTML + CSS + vanilla JS (ES6+). No React/Vue/Angular, no Bootstrap/Tailwind,
  no `document.write()`, no `console.log` in production code.
- One folder per tool: `/tool-name/index.html`, `/es/tool-name/index.html`,
  `/da/tool-name/index.html`. **Spanish and Danish URLs use the same English slug**
  (e.g. `/es/pdf-merge/`, not `/es/unir-pdf/`). The owner decided this; don't change it.
- Shared CSS lives in one file: `/assets/css/style.css`. Each tool has one script,
  `/assets/js/tools/<tool-name>.js`. `/assets/js/shared.js` handles nav, footer, language
  switcher and search.
- Every `<script>` uses `defer` and sits before `</body>`. Nothing may block rendering.
  Inline critical CSS in `<head>`.
- Libraries come only from CDNs that the CSP in `_headers` allows (cdn.jsdelivr.net,
  unpkg.com, cdnjs). **The CSP forbids inline scripts.** JSON in
  `<script type="application/json">` is fine. Images may be `data:`, `blob:` or https.
- Every page needs: correct `<html lang>`, a unique title, a 140–160 character meta
  description, an absolute canonical, hreflang for en/es/da plus x-default, Open Graph
  tags, WebApplication JSON-LD (plus FAQPage/BreadcrumbList where relevant), exactly
  one `<h1>`, `robots index, follow`, and a Google Fonts preconnect.
- AdSense: 3 slots per tool page (sidebar 300×250/300×600, a leaderboard 728×90 below the
  tool, a 336×280 rectangle above the FAQ). Never hardcode a publisher ID; use
  `ca-pub-XXXXXXXXXX`.
- Static assets are cached as immutable for one year. **When you change a CSS/JS file,
  bump its `?v=` query string** everywhere it is referenced. Current versions:
  `shared.js?v=20261012`, PDF pages `style.css?v=20261012`, generated calculator pages
  `style.css?v=20261008`.
- Copy must sound natural and human, not like marketing filler. Each language is
  written natively, not machine-translated word for word.

## 3. How the site is built

Most pages are hand-written HTML. Two **dev-time generators** (plain Node, no
dependencies) write static HTML that is committed. If you edit their output by hand,
the next run overwrites it, so change the sources and re-run the generator.

### 3a. Calculator / fun tool generator — `tools/tool-pages/`
- `registry.js`: tools, hubs, slugs, related links. `content/<id>.js`: localized copy
  for each tool (H1, intro, how-to, FAQ, meta, schema). `lib/ui.js`: shared markup.
- `node tools/tool-pages/build.js` writes 63 pages (tools + 4 hubs: calculators,
  numerology-astrology, fun-relationships, date-time), the sitemap block and the slug
  map in `shared.js`. `--check` only reports SEO length warnings.
- `node tools/tool-pages/check-links.js` checks links, language mixing, canonical,
  hreflang reciprocity, JSON-LD and sitemap coverage. **It must pass before you commit.**
- Tool scripts: `assets/js/tools/<name>.js` plus shared helpers `calc-kit.js`,
  `numerology-core.js` and `astro-core.js`, and `assets/js/vendor/astronomy.browser.min.js`
  (real lunar ephemeris for the moon and rising sign tools).

### 3b. PDF tool pages from the design system — `tools/pdf-pages/`
These 11 tools × 3 languages (33 pages) copy the owner's design comps exactly:
`pdf-to-word`, `pdf-merge`, `pdf-split`, `pdf-compress`, `pdf-to-jpg`, `organize-pdf`,
`remove-pdf-pages`, `extract-pdf-pages`, `rotate-pdf`, `jpg-to-pdf`, `add-page-numbers`.

- `tools/pdf-pages/source/<slug>/` holds what was imported from the design files:
  `{en,es,da}.template.html` (markup with `{{ path }}`, `<sc-if value>`, `<sc-for list as>`
  and `onClick="{{ fn }}"`-style events), `{en,es,da}.head.json` (title, description,
  JSON-LD), `{en,es,da}.consts.js` (the PX/L/T/LOC copy objects) and `logic.js` (the
  component class; identical in every language). `pdf-to-word/extra.js` adds the real
  converter.
- `node tools/pdf-pages/build.js` writes the 33 pages and
  `assets/js/tools/<slug>.js`. The build pre-renders the template to static HTML for
  SEO. It also fixes the design's links to point at real URLs, adds the two extra ad
  slots, tidies markup for the validator (th scope, button type, boolean attributes)
  and keeps each page's existing site header, footer and **Related Tools** section.
- `node tools/pdf-pages/build.js import "<dir with .dc.html files>"` re-imports
  design files. Don't run it unless you have new design files; it overwrites `source/`.
- `assets/js/tools/dc-runtime.js` is a small vanilla renderer. It runs in Node at build
  time and in the browser. It re-renders the template to a string, morphs the live DOM
  and delegates events. Layout values that differ between desktop and mobile
  (`padX`, `h1Size`, `heroPad`, `gridCols`, `stepCols`, `featCols`, `relCols`) become CSS
  variables (`--dc-*`, switching at 759px), so phones get the right layout before JS runs.
- In `style.css`, the `.dc-root` rules undo site-wide element defaults inside the design
  area. The design area always stays light, even in dark mode. A global mobile rule
  `[style*="display:flex"][style*="gap"]` is excluded from it with `:not(.dc-root *)`.
- The tools use pdf-lib 1.17.1, pdfjs-dist 3.11.174 and JSZip 3.10.1 from jsdelivr.
  **PDF to Word** reads text with pdf.js and rebuilds headings, lists and tables
  (aligned columns become Word tables). It has an "exact layout" mode with positioned
  frames, page ranges, a password prompt, and OCR for scanned pages via
  tesseract.js 4.1.2 (loaded from unpkg on demand; language data from
  tessdata.projectnaptha.com). The .docx is written by hand with JSZip.

### 3c. Other places to update when you add a page
- `assets/js/shared.js`: desktop PDF menu, mobile menu, the search `TOOLS` list.
- Homepages `index.html`, `es/index.html`, `da/index.html`; the hub `pdf-tools/index.html`.
- `sitemap.xml`: one `<url>` per language with all 4 hreflang links.

## 4. How to check your work

1. Serve locally: `npx serve . -p 3000`.
2. Validate: `npx html-validate "**/*.html"` (or just the files you touched). The 33 PDF
   pages are clean. The homepages already have 7 errors (raw `&` in a meta tag,
   `role=list` divs) that were there before.
3. Run `node tools/tool-pages/check-links.js`; it must print `OK`.
4. In a real browser, test each tool you touch on desktop and at 390px and 320px:
   - Click "Try a sample PDF" (ES "Probar con un PDF de ejemplo", DA "Prøv med en
     eksempel-PDF"), run the main action and confirm the download opens.
   - Check there's no horizontal scroll and no console errors.
   - Apply the CSP from `_headers` while testing; an inline script will break in
     production.
5. Re-check that the SEO tags are unique and in the right language.

## 5. Known gaps and ideas for next steps

Ordered by value; confirm with the owner before starting anything big.

1. **Bring the remaining PDF tools onto the new design** so the PDF section looks
   consistent: crop-pdf, add-watermark, protect-pdf, unlock-pdf, ocr-pdf, html-to-pdf,
   scan-to-pdf, sign-pdf, edit-pdf, redact-pdf, compare-pdf, pdf-forms, optimize-pdf,
   pdf-security, pdf-metadata-remover. Ideally the owner supplies design files and you
   import them with `tools/pdf-pages/build.js import`. Otherwise, write new
   `source/<slug>/` folders by hand following the same structure and add the slug to
   `TOOLS` in `build.js`. Keep the live URLs.
2. **Google Analytics is blocked by the CSP.** `shared.js` loads
   `googletagmanager.com/gtag/js`, but `script-src` in `_headers` doesn't allow it. This
   was already the case before. Add the GA hosts to `script-src`/`connect-src` if the
   owner wants analytics.
3. The AdSense loader script isn't on the pages; the slots are placeholders
   (`<div class="adsbygoogle">`). This matches the rest of the site. Wire it up when the
   owner has a publisher ID (keep `ca-pub-XXXXXXXXXX` in the repo).
4. **PDF to Word limitations:** no images or text colours in the output. Tables are found
   only from aligned text columns, not ruled lines. The Auto-detect OCR language uses
   English plus the page language. Real-world PDFs with multiple columns are worth
   testing.
5. PDF page titles follow the design (e.g. "Merge PDF Files – Combine PDFs & Pick Pages,
   No Upload"), not the "[Tool] Online Free | AnyConverter" pattern in `CLAUDE.md`. Ask
   the owner which format they want before changing them.
6. The design area (`.dc-root`) has no dark mode. Add one only if the owner asks.
7. The `es` PDF to Word meta description is 169 characters, a little over the 160 limit
   (`tools/pdf-pages/source/pdf-to-word/es.head.json`).

## 6. Your task

<!-- Replace this with what you want done next, e.g.
"Convert crop-pdf, add-watermark and protect-pdf to the new design in EN/ES/DA" -->

If nothing is written here, start with item 7 from section 5 (a quick fix). Then
propose a plan for item 1 and wait for approval.

When you finish:
- run the checks in section 4;
- commit to your own branch and push it;
- summarise what changed, what you tested (with real output), and anything you could
  not verify.
