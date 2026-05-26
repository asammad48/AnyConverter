# AnyConverter — Claude Code Instructions

## Project
Static multi-language online tools website. Deploys to Cloudflare Pages.
No frameworks. No build step. Pure HTML + CSS + Vanilla JS.

## Stack
- HTML5 (semantic, SEO-optimized)
- CSS3 (custom properties, no frameworks)
- Vanilla JavaScript ES6+ (defer loaded, tool-specific files)
- CDN libs: pdf-lib, highlight.js, PapaParse, SQL.js (loaded only on pages that need them)

## Commands
- Preview locally: `npx serve . -p 3000`
- Validate HTML: `npx html-validate "**/*.html"`
- Check links: `npx linkinator . --recurse`

## File Structure Rules
- EVERY tool gets its own folder: `/tool-name/index.html`
- Languages: `/es/tool-name/index.html` and `/da/tool-name/index.html`
- Shared CSS: `/assets/css/style.css` — single file, no imports
- Tool JS: `/assets/js/tools/[tool-name].js` — one file per tool
- Shared JS: `/assets/js/shared.js` — nav, footer, lang switcher only
- Images: `/assets/img/` — SVG icons only, no raster images in UI

## NEVER DO
- Never use React, Vue, Angular, or any JS framework
- Never use CSS frameworks (Bootstrap, Tailwind)
- Never use `document.write()`
- Never block rendering — all scripts use `defer`
- Never hardcode the AdSense publisher ID — always use `ca-pub-XXXXXXXXXX`
- Never create files outside the defined structure above
- Never add `console.log` in production code
- Never use `!important` in CSS except for utility overrides

## SEO — MUST on every HTML file
1. `<html lang="en">` (or es/da)
2. Unique `<title>` — format: `[Tool Name] Online Free | AnyConverter`
3. Unique `<meta name="description">` — 140-160 chars with primary keyword
4. `<link rel="canonical">` — absolute URL
5. All 3 hreflang alternate links (en/es/da + x-default)
6. Open Graph: og:title, og:description, og:url, og:type
7. Schema.org WebApplication JSON-LD on every tool page
8. ONE `<h1>` per page containing primary keyword
9. `<meta name="robots" content="index, follow">`
10. Preconnect to Google Fonts

## Performance — non-negotiable
- Inline critical CSS (above-fold styles) in every `<head>`
- All `<script>` tags: `defer` attribute, placed before `</body>`
- Google Fonts: preconnect + `font-display: swap`
- All `<img>`: explicit `width` + `height` + `loading="lazy"`
- No render-blocking resources whatsoever

## AdSense — 3 slots per tool page
- Slot 1: Right sidebar `300x600` (sticky)
- Slot 2: Below tool output `728x90` leaderboard (responsive on mobile)
- Slot 3: Above FAQ section `336x280` rectangle
- Load script: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" data-ad-client="ca-pub-XXXXXXXXXX">`
- Replace instructions comment must appear near every `XXXXXXXXXX`

## When compacting
Always preserve: full file list, tool implementations, SEO tag values, AdSense slot positions.
