# AnyConverter — File Structure

Claude Code MUST create every file listed here. No exceptions.

## Complete File Tree

```
anyconverter/
│
├── CLAUDE.md                          ← Claude Code reads this automatically
│
├── index.html                         ← Homepage EN
├── robots.txt
├── sitemap.xml
├── _redirects                         ← Cloudflare Pages redirects
├── _headers                           ← Cloudflare Pages security headers
│
├── json-formatter/
│   └── index.html
├── xml-formatter/
│   └── index.html
├── image-converter/
│   └── index.html
├── pdf-merge/
│   └── index.html
├── pdf-compress/
│   └── index.html
├── pdf-split/
│   └── index.html
├── base64-encoder/
│   └── index.html
├── url-encoder/
│   └── index.html
├── csv-to-sql/
│   └── index.html
├── csv-query/
│   └── index.html
├── regex-tester/
│   └── index.html
├── hash-generator/
│   └── index.html
├── timestamp-converter/
│   └── index.html
├── markdown-html/
│   └── index.html
├── color-converter/
│   └── index.html
│
├── es/                                ← Spanish
│   ├── index.html
│   ├── json-formatter/index.html
│   ├── xml-formatter/index.html
│   ├── image-converter/index.html
│   ├── pdf-merge/index.html
│   ├── pdf-compress/index.html
│   ├── base64-encoder/index.html
│   ├── url-encoder/index.html
│   ├── csv-to-sql/index.html
│   ├── regex-tester/index.html
│   └── hash-generator/index.html
│
├── da/                                ← Danish
│   ├── index.html
│   ├── json-formatter/index.html
│   ├── xml-formatter/index.html
│   ├── image-converter/index.html
│   ├── pdf-merge/index.html
│   ├── pdf-compress/index.html
│   ├── base64-encoder/index.html
│   ├── url-encoder/index.html
│   ├── csv-to-sql/index.html
│   ├── regex-tester/index.html
│   └── hash-generator/index.html
│
└── assets/
    ├── css/
    │   └── style.css                  ← SINGLE shared stylesheet, all styles
    │
    ├── js/
    │   ├── shared.js                  ← Nav, footer, toast, lang switcher
    │   └── tools/
    │       ├── json-formatter.js
    │       ├── xml-formatter.js
    │       ├── image-converter.js
    │       ├── pdf-merge.js
    │       ├── pdf-compress.js
    │       ├── pdf-split.js
    │       ├── base64.js
    │       ├── url-encoder.js
    │       ├── csv-to-sql.js
    │       ├── csv-query.js
    │       ├── regex-tester.js
    │       ├── hash-generator.js
    │       ├── timestamp.js
    │       ├── markdown.js
    │       └── color-converter.js
    │
    └── img/
        ├── logo.svg                   ← Site logo
        ├── favicon.svg                ← Favicon (SVG)
        ├── icon-json.svg
        ├── icon-xml.svg
        ├── icon-image.svg
        ├── icon-pdf.svg
        ├── icon-base64.svg
        ├── icon-url.svg
        ├── icon-csv.svg
        ├── icon-regex.svg
        ├── icon-hash.svg
        ├── icon-clock.svg
        ├── icon-markdown.svg
        └── icon-color.svg
```

---

## Build Order for Claude Code

Generate files in this exact order to avoid missing dependencies:

1. `assets/css/style.css` — complete stylesheet
2. `assets/js/shared.js` — nav, footer, language switcher, toast
3. `assets/img/logo.svg` — logo SVG
4. `assets/img/favicon.svg` — favicon
5. All tool icon SVGs in `assets/img/`
6. `index.html` — homepage
7. `json-formatter/index.html` + `assets/js/tools/json-formatter.js`
8. `xml-formatter/index.html` + `assets/js/tools/xml-formatter.js`
9. `image-converter/index.html` + `assets/js/tools/image-converter.js`
10. `pdf-merge/index.html` + `assets/js/tools/pdf-merge.js`
11. `pdf-compress/index.html` + `assets/js/tools/pdf-compress.js`
12. `pdf-split/index.html` + `assets/js/tools/pdf-split.js`
13. `base64-encoder/index.html` + `assets/js/tools/base64.js`
14. `url-encoder/index.html` + `assets/js/tools/url-encoder.js`
15. `csv-to-sql/index.html` + `assets/js/tools/csv-to-sql.js`
16. `csv-query/index.html` + `assets/js/tools/csv-query.js`
17. `regex-tester/index.html` + `assets/js/tools/regex-tester.js`
18. `hash-generator/index.html` + `assets/js/tools/hash-generator.js`
19. `timestamp-converter/index.html` + `assets/js/tools/timestamp.js`
20. `markdown-html/index.html` + `assets/js/tools/markdown.js`
21. `color-converter/index.html` + `assets/js/tools/color-converter.js`
22. Spanish pages: `es/index.html` + all es tool pages
23. Danish pages: `da/index.html` + all da tool pages
24. `sitemap.xml`
25. `robots.txt`
26. `_redirects`
27. `_headers`

---

## _redirects (Cloudflare Pages)

```
# Trailing slash enforcement
/json-formatter    /json-formatter/    301
/xml-formatter     /xml-formatter/     301
/image-converter   /image-converter/   301
/pdf-merge         /pdf-merge/         301
/pdf-compress      /pdf-compress/      301
/pdf-split         /pdf-split/         301
/base64-encoder    /base64-encoder/    301
/url-encoder       /url-encoder/       301
/csv-to-sql        /csv-to-sql/        301
/csv-query         /csv-query/         301
/regex-tester      /regex-tester/      301
/hash-generator    /hash-generator/    301
/timestamp-converter /timestamp-converter/ 301
/markdown-html     /markdown-html/     301
/color-converter   /color-converter/   301
```

---

## _headers (Cloudflare Pages — security headers)

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://cdnjs.cloudflare.com https://unpkg.com https://cdn.jsdelivr.net https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-src https://googleads.g.doubleclick.net;

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

---

## HTML Page Template (use for every tool page)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO -->
  <title>[Page Title] | AnyConverter</title>
  <meta name="description" content="[description 140-160 chars]">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://anyconverter.io/[slug]/">

  <!-- hreflang -->
  <link rel="alternate" hreflang="en"        href="https://anyconverter.io/[slug]/">
  <link rel="alternate" hreflang="es"        href="https://anyconverter.io/es/[slug]/">
  <link rel="alternate" hreflang="da"        href="https://anyconverter.io/da/[slug]/">
  <link rel="alternate" hreflang="x-default" href="https://anyconverter.io/[slug]/">

  <!-- Open Graph -->
  <meta property="og:type"        content="website">
  <meta property="og:title"       content="[title]">
  <meta property="og:description" content="[description]">
  <meta property="og:url"         content="https://anyconverter.io/[slug]/">
  <meta property="og:site_name"   content="AnyConverter">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

  <!-- AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
    data-ad-client="ca-pub-XXXXXXXXXX" crossorigin="anonymous"></script>
  <!-- Replace ca-pub-XXXXXXXXXX with your real AdSense publisher ID -->

  <!-- Schema.org -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "[Tool Name]",
    "url": "https://anyconverter.io/[slug]/",
    "description": "[description]",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "provider": { "@type": "Organization", "name": "AnyConverter", "url": "https://anyconverter.io" }
  }
  </script>

  <!-- Favicon -->
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">

  <!-- Critical CSS inline -->
  <style>
    /* INLINE: header, hero, above-fold layout only */
    /* Full styles loaded from stylesheet below */
  </style>

  <!-- Stylesheet -->
  <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>

  <!-- Header (rendered by shared.js) -->
  <header id="site-header"></header>

  <!-- Main content -->
  <main>
    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        <li aria-current="page">[Tool Name]</li>
      </ol>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <h1>[Primary Keyword H1]</h1>
      <p class="hero-desc">[120-word SEO description paragraph]</p>
    </section>

    <!-- Tool + Sidebar layout -->
    <div class="tool-layout">
      <div class="tool-panel">
        <!-- TOOL UI HERE -->
      </div>

      <aside class="tool-sidebar">
        <!-- AdSense Slot 1: Sidebar 300x600 -->
        <!-- Replace XXXXXXXXXX with your slot ID -->
        <div class="ad-slot ad-slot--sidebar">
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-XXXXXXXXXX"
               data-ad-slot="XXXXXXXXXX"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>
      </aside>
    </div>

    <!-- AdSense Slot 2: Below tool 728x90 -->
    <div class="ad-slot ad-slot--leaderboard">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-XXXXXXXXXX"
           data-ad-slot="XXXXXXXXXX"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>

    <!-- How to use -->
    <section class="how-to-use">
      <h2>How to Use [Tool Name]</h2>
      <ol class="steps">
        <li><strong>Step 1</strong> — [description]</li>
        <li><strong>Step 2</strong> — [description]</li>
        <li><strong>Step 3</strong> — [description]</li>
      </ol>
    </section>

    <!-- Features -->
    <section class="features">
      <h2>Features</h2>
      <ul class="features-list">
        <li>[Feature 1]</li>
        <li>[Feature 2]</li>
        <li>[Feature 3]</li>
      </ul>
    </section>

    <!-- AdSense Slot 3: Rectangle above FAQ -->
    <div class="ad-slot ad-slot--rectangle">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-XXXXXXXXXX"
           data-ad-slot="XXXXXXXXXX"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>

    <!-- FAQ -->
    <section class="faq">
      <h2>Frequently Asked Questions</h2>
      <!-- 5 <details><summary> FAQ items -->
    </section>

    <!-- Related tools -->
    <section class="related-tools">
      <h2>Related Tools</h2>
      <div class="tool-grid">
        <!-- 6 tool cards -->
      </div>
    </section>
  </main>

  <!-- Footer (rendered by shared.js) -->
  <footer id="site-footer"></footer>

  <!-- Shared JS -->
  <script src="/assets/js/shared.js" defer></script>
  <!-- Tool-specific JS -->
  <script src="/assets/js/tools/[tool-name].js" defer></script>
  <!-- Tool CDN deps (only on pages that need them) -->
</body>
</html>
```
