# AnyConverter — Project README

## What This Is
A free, static, multi-language online tools website with 15+ converter and formatter tools.
Deployable to Cloudflare Pages (free hosting, unlimited bandwidth).

**Live URL:** https://anyconverter.io  
**Tech Stack:** Pure HTML + CSS + Vanilla JS — no frameworks, no build step  
**Languages:** English, Spanish (Español), Danish (Dansk)

---

## Quick Start (for Claude Code)

Open your terminal in the project folder and run:
```bash
# Install Claude Code if not already installed
npm install -g @anthropic-ai/claude-code

# Start Claude Code
claude

# Then tell Claude:
# "Read all .md files in this folder and build the complete AnyConverter website"
```

Claude Code will automatically read `CLAUDE.md` and all spec files, then generate every file.

---

## Files in This Folder (give all to Claude Code)

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Claude Code auto-reads this — project rules & constraints |
| `DESIGN_SYSTEM.md` | Colors, typography, components, all CSS variables |
| `TOOLS_SPEC.md` | UI layout & behavior spec for every tool |
| `SEO_SPEC.md` | Page titles, meta descriptions, schema.org, hreflang |
| `FILE_STRUCTURE.md` | Exact folder tree + HTML page template |
| `TOPBAR_AND_SHARED.md` | Header, footer, nav, language switcher specs |
| `PERFORMANCE.md` | Core Web Vitals, script loading, CLS prevention |

---

## Tools Being Built

### Frontend-only (pure browser, zero server)
| Tool | URL | Library Used |
|------|-----|-------------|
| JSON Formatter | /json-formatter/ | highlight.js |
| XML Formatter | /xml-formatter/ | DOMParser (built-in) |
| Image Converter | /image-converter/ | Canvas API (built-in) |
| Base64 Encoder | /base64-encoder/ | btoa/atob (built-in) |
| URL Encoder | /url-encoder/ | encodeURIComponent (built-in) |
| CSV to SQL | /csv-to-sql/ | PapaParse |
| CSV Query | /csv-query/ | SQL.js (WASM) |
| Regex Tester | /regex-tester/ | RegExp (built-in) |
| Hash Generator | /hash-generator/ | Web Crypto API |
| Timestamp Converter | /timestamp-converter/ | Date API (built-in) |
| Markdown to HTML | /markdown-html/ | marked.js |
| Color Converter | /color-converter/ | Pure JS math |

### Frontend PDF tools (pdf-lib, browser WASM)
| Tool | URL | Library Used |
|------|-----|-------------|
| PDF Merge | /pdf-merge/ | pdf-lib |
| PDF Compress | /pdf-compress/ | pdf-lib |
| PDF Split | /pdf-split/ | pdf-lib |

---

## Deploy to Cloudflare Pages

### Option A: Drag & Drop (easiest)
1. Build the site (Claude Code generates all files)
2. Go to https://pages.cloudflare.com
3. Click "Create a project" → "Direct upload"
4. Drag the entire project folder
5. Done — live in seconds!

### Option B: GitHub (recommended for updates)
1. Push to a GitHub repository
2. Connect repo to Cloudflare Pages
3. Build command: (none — static)
4. Output directory: `/` (root)
5. Every push auto-deploys

---

## Adding Your AdSense

After Google approves your AdSense account:

1. Find and replace all instances of `ca-pub-XXXXXXXXXX` with your publisher ID
2. Find and replace all instances of `data-ad-slot="XXXXXXXXXX"` with your slot IDs
3. You'll need 3 different slot IDs (sidebar, leaderboard, rectangle)

**Search command to find all placeholders:**
```bash
grep -r "ca-pub-XXXXXXXXXX" . --include="*.html"
```

---

## Adding More Languages

To add a new language (e.g., French `/fr/`):
1. Copy the `/es/` folder to `/fr/`
2. Translate all HTML content inside `/fr/` files
3. Update hreflang tags on all existing pages to include `hreflang="fr"`
4. Add French link to language switcher in `shared.js`
5. Add `/fr/` URLs to `sitemap.xml`

---

## Design Principles

- **Clean & Fast:** Users have a task — don't get in their way
- **Privacy first:** All processing in browser, nothing uploaded
- **No clutter:** Tool is prominent, ads are respectful
- **Mobile-first:** Works perfectly on phone
- **Dark mode:** Automatic via CSS prefers-color-scheme

---

## SEO Notes

- Every page has unique title, description, canonical URL
- All 3 language versions linked via hreflang on every page
- Schema.org WebApplication markup on every tool
- FAQPage schema on all FAQ sections
- Sitemap includes all language variants
- robots.txt allows all crawlers

---

## Performance Targets

| Metric | Target | How achieved |
|--------|--------|-------------|
| LCP | < 1.5s | Critical CSS inlined, text-only hero |
| CLS | < 0.05 | Explicit image dimensions, ad slot min-heights |
| INP | < 100ms | Deferred scripts, async heavy ops |
| PageSpeed | > 95 | No render-blocking, system font fallbacks |

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Chrome & Safari

---

## License

Free to use and modify. Tools are open source.
AdSense publisher ID must be replaced with your own before going live.
