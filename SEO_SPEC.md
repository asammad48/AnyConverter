# AnyConverter — SEO Specification

## Page Title Formula
`[Tool Action] Online — Free & Fast | AnyConverter`

## All Page Titles & Meta Descriptions

### Homepage
- **Title:** `Free Online Converter Tools — JSON, PDF, Image & More | AnyConverter`
- **Description:** `AnyConverter offers 15+ free online tools. Format JSON, convert images, merge PDFs, encode Base64 and more. No signup, 100% private, works in your browser.`
- **H1:** `Free Online Converter & Formatter Tools`

### /json-formatter/
- **Title:** `JSON Formatter & Validator Online — Free | AnyConverter`
- **Description:** `Format, beautify and validate JSON instantly. Free online JSON formatter with syntax highlighting. Runs in your browser — your data never leaves your device.`
- **H1:** `JSON Formatter & Validator`
- **Primary keyword:** json formatter online
- **Secondary:** json beautifier, json validator, format json

### /xml-formatter/
- **Title:** `XML Formatter & Validator Online — Free | AnyConverter`
- **Description:** `Format and validate XML online for free. Instantly beautify or minify XML with error detection. No upload required — 100% client-side processing.`
- **H1:** `XML Formatter & Validator`
- **Primary keyword:** xml formatter online

### /image-converter/
- **Title:** `Image Converter Online — PNG JPG WebP AVIF Free | AnyConverter`
- **Description:** `Convert images between PNG, JPG, WebP, AVIF, BMP and GIF online. Free image converter with resize and quality options. No upload to server — instant conversion.`
- **H1:** `Free Online Image Converter`
- **Primary keyword:** image converter online free

### /pdf-merge/
- **Title:** `Merge PDF Files Online — Free PDF Combiner | AnyConverter`
- **Description:** `Combine multiple PDF files into one online for free. Drag, reorder and merge PDFs in seconds. No registration required. Secure — files processed in your browser.`
- **H1:** `Merge PDF Files Online`
- **Primary keyword:** merge pdf online free

### /pdf-compress/
- **Title:** `Compress PDF Online — Reduce PDF File Size Free | AnyConverter`
- **Description:** `Compress PDF files online and reduce file size without losing quality. Free PDF compressor. Choose compression level — low, medium or high. 100% secure.`
- **H1:** `Compress PDF Online — Reduce File Size`
- **Primary keyword:** compress pdf online free

### /pdf-split/
- **Title:** `Split PDF Online — Extract Pages Free | AnyConverter`
- **Description:** `Split a PDF into multiple files or extract specific pages online for free. No software needed. Choose page ranges or split every N pages. Secure browser processing.`
- **H1:** `Split PDF — Extract Pages Online`
- **Primary keyword:** split pdf online free

### /base64-encoder/
- **Title:** `Base64 Encoder & Decoder Online — Free | AnyConverter`
- **Description:** `Encode and decode Base64 online. Convert text or files to Base64 and back. Free, instant, no server upload. Supports Unicode text and all file types.`
- **H1:** `Base64 Encoder & Decoder`
- **Primary keyword:** base64 encoder decoder online

### /url-encoder/
- **Title:** `URL Encoder & Decoder Online — Free | AnyConverter`
- **Description:** `Encode or decode URLs and query parameters online. Free URL encoder with percent-encoding. Encode components or full URLs instantly in your browser.`
- **H1:** `URL Encoder & Decoder`
- **Primary keyword:** url encoder decoder online

### /csv-to-sql/
- **Title:** `CSV to SQL Converter Online — Free INSERT Generator | AnyConverter`
- **Description:** `Convert CSV files to SQL INSERT statements online for free. Auto-detect column types, choose MySQL/PostgreSQL/SQLite dialect. Generate CREATE TABLE + INSERT queries instantly.`
- **H1:** `CSV to SQL Converter`
- **Primary keyword:** csv to sql converter online

### /regex-tester/
- **Title:** `Regex Tester Online — Live Regular Expression Tester | AnyConverter`
- **Description:** `Test regular expressions online with live match highlighting. Free regex tester supporting all JavaScript regex flags. See matches, groups and indices instantly.`
- **H1:** `Online Regex Tester`
- **Primary keyword:** regex tester online

### /hash-generator/
- **Title:** `Hash Generator Online — MD5 SHA256 SHA512 Free | AnyConverter`
- **Description:** `Generate MD5, SHA-1, SHA-256 and SHA-512 hashes online for free. Hash text or files. Fast, secure, client-side processing — your data never leaves your browser.`
- **H1:** `Hash Generator — MD5, SHA-256, SHA-512`
- **Primary keyword:** hash generator online

### /timestamp-converter/
- **Title:** `Unix Timestamp Converter Online — Free | AnyConverter`
- **Description:** `Convert Unix timestamps to human-readable dates and back. Free timestamp converter supporting UTC, local time and any timezone. Instant conversion.`
- **H1:** `Unix Timestamp Converter`
- **Primary keyword:** unix timestamp converter

### /markdown-html/
- **Title:** `Markdown to HTML Converter Online — Free | AnyConverter`
- **Description:** `Convert Markdown to HTML online for free. Live preview with rendered output and HTML source view. Supports GitHub Flavored Markdown. No signup needed.`
- **H1:** `Markdown to HTML Converter`
- **Primary keyword:** markdown to html converter online

### /color-converter/
- **Title:** `Color Converter Online — HEX RGB HSL CMYK Free | AnyConverter`
- **Description:** `Convert colors between HEX, RGB, HSL, CMYK and HSB online for free. Interactive color picker with shade palette generator. Instant copy to clipboard.`
- **H1:** `Color Converter — HEX, RGB, HSL, CMYK`
- **Primary keyword:** color converter hex rgb hsl

### /csv-query/
- **Title:** `CSV Query Tool Online — Run SQL on CSV Files Free | AnyConverter`
- **Description:** `Query CSV files with SQL online for free. Upload a CSV and run SELECT, WHERE, GROUP BY queries directly in your browser using SQL.js. Export results as CSV or JSON.`
- **H1:** `CSV Query Tool — Run SQL on CSV Files`
- **Primary keyword:** csv query tool online sql

---

## hreflang Template (include on EVERY page)

```html
<link rel="alternate" hreflang="en"       href="https://anyconverter.io/[tool-slug]/">
<link rel="alternate" hreflang="es"       href="https://anyconverter.io/es/[tool-slug]/">
<link rel="alternate" hreflang="da"       href="https://anyconverter.io/da/[tool-slug]/">
<link rel="alternate" hreflang="x-default" href="https://anyconverter.io/[tool-slug]/">
```

---

## Schema.org JSON-LD Template (every tool page)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "[Tool Name]",
  "url": "https://anyconverter.io/[tool-slug]/",
  "description": "[meta description text]",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any",
  "browserRequirements": "Requires JavaScript",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "provider": {
    "@type": "Organization",
    "name": "AnyConverter",
    "url": "https://anyconverter.io"
  }
}
</script>
```

---

## FAQ Schema (add to every tool page FAQ section)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question text]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer text]"
      }
    }
  ]
}
</script>
```

---

## Open Graph Template

```html
<meta property="og:type"        content="website">
<meta property="og:title"       content="[page title]">
<meta property="og:description" content="[meta description]">
<meta property="og:url"         content="https://anyconverter.io/[tool-slug]/">
<meta property="og:site_name"   content="AnyConverter">
<meta property="og:image"       content="https://anyconverter.io/assets/img/og-[tool-slug].png">
<meta name="twitter:card"       content="summary_large_image">
<meta name="twitter:title"      content="[page title]">
<meta name="twitter:description" content="[meta description]">
```

---

## Spanish (es) Title/Description Examples

### /es/json-formatter/
- **Title:** `Formateador JSON Online Gratis | AnyConverter`
- **Description:** `Formatea y valida JSON al instante. Herramienta gratuita con resaltado de sintaxis. Todo se procesa en tu navegador — tus datos nunca salen de tu dispositivo.`
- **H1:** `Formateador y Validador de JSON`

### /es/image-converter/
- **Title:** `Convertidor de Imágenes Online Gratis — PNG JPG WebP | AnyConverter`
- **Description:** `Convierte imágenes entre PNG, JPG, WebP, AVIF y más. Gratis, sin registro, sin subir archivos al servidor. Conversión instantánea en el navegador.`
- **H1:** `Convertidor de Imágenes Gratis`

### /es/pdf-merge/
- **Title:** `Unir PDF Online Gratis — Combinar Archivos PDF | AnyConverter`
- **Description:** `Combina varios archivos PDF en uno solo de forma gratuita. Arrastra, reordena y fusiona PDFs en segundos. Sin registro. Procesamiento seguro en tu navegador.`
- **H1:** `Unir Archivos PDF Online`

---

## Danish (da) Title/Description Examples

### /da/json-formatter/
- **Title:** `JSON Formatter Online Gratis | AnyConverter`
- **Description:** `Formater og valider JSON øjeblikkeligt. Gratis online JSON-formatter med syntaksfremhævning. Kører i din browser — dine data forlader aldrig din enhed.`
- **H1:** `JSON Formatter og Validator`

### /da/image-converter/
- **Title:** `Billedkonverter Online Gratis — PNG JPG WebP | AnyConverter`
- **Description:** `Konverter billeder mellem PNG, JPG, WebP, AVIF og BMP online. Gratis, ingen tilmelding påkrævet. Øjeblikkelig konvertering i din browser.`
- **H1:** `Gratis Online Billedkonverter`

### /da/pdf-merge/
- **Title:** `Sammensæt PDF Online Gratis | AnyConverter`
- **Description:** `Kombiner flere PDF-filer til én gratis online. Træk, sorter og flet PDF'er på sekunder. Ingen registrering. Sikker behandling i din browser.`
- **H1:** `Sammensæt PDF-Filer Online`

---

## Sitemap Structure (sitemap.xml)

Include ALL URLs with priority levels:
- Homepage: priority 1.0
- High-demand tool pages (JSON, Image, PDF Merge, PDF Compress): priority 0.9
- Other tool pages: priority 0.8
- Language variants (es/, da/): priority 0.7
- changefreq: monthly for all

---

## Internal Linking Rules

1. Footer: link to ALL tool pages (helps crawlability)
2. Each tool page: "Related Tools" section with 4-6 relevant tool links
3. Homepage tool grid: every card links to tool page
4. Breadcrumb on tool pages: Home > Tool Name (also add BreadcrumbList schema)
5. Language switcher: links to all 3 language variants of current page

---

## Core Web Vitals Checklist

### LCP (Largest Contentful Paint) — target < 2.5s
- [ ] Hero H1 text renders immediately (no JS dependency)
- [ ] No hero image (text-only hero)
- [ ] Critical CSS inlined in `<head>`
- [ ] Google Fonts: preconnect + font-display: swap

### CLS (Cumulative Layout Shift) — target < 0.1
- [ ] All images have explicit width + height
- [ ] AdSense slots have min-height set to prevent layout shift
- [ ] Fonts: font-display: swap with system font fallback same metrics

### INP (Interaction to Next Paint) — target < 200ms
- [ ] All tool JS: defer attribute
- [ ] Heavy operations (PDF processing): use setTimeout to yield to browser
- [ ] No synchronous operations over 50ms on main thread

### AdSense CLS Fix
```html
<!-- Wrap every ad slot in a container with min-height -->
<div class="ad-slot" style="min-height: 90px;">
  <ins class="adsbygoogle" ...></ins>
</div>
```
