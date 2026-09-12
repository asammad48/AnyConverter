# Phase 03 Day 07 - JPG/PDF Conversion Briefs

Generated: 2026-09-10

## Objective

Create rewrite briefs for `/jpg-to-pdf/` and `/pdf-to-jpg/` using only conversion behavior verified in local scripts.

## `/jpg-to-pdf/` Brief

Verified tool facts:

- Conversion code supports JPEG/JPG and PNG image embedding.
- Uses `pdf-lib` to create a new PDF.
- Fit modes include original, A4, and fill.
- Margin value is read from the UI.
- Download default: `images.pdf`.

Recommended intro:

`Use JPG to PDF to turn JPEG or PNG images into a PDF in your browser. Choose original sizing, A4 pages, or fill mode, adjust the margin, and download the combined image PDF.`

Practical example:

`Example: Select three receipt photos, choose A4 so each image is placed on a standard page, add a small margin, and download `images.pdf` for sharing or archiving.`

Limits:

- Do not say every image format is supported; code embeds PNG explicitly and treats other files as JPEG.
- Very large photos can be limited by browser memory.
- This creates image pages; it does not OCR or make text selectable.

Related-link guidance:

- `/ocr-pdf/` if users need text extraction from image-based PDFs.
- `/pdf-compress/` if the resulting PDF is too large.
- `/pdf-to-jpg/` for the reverse workflow.

## `/pdf-to-jpg/` Brief

Verified tool facts:

- Uses PDF.js to render pages to canvas.
- Output format can be JPEG or PNG based on UI setting.
- JPEG quality and render scale are controlled by UI.
- Produces page previews.
- Download all triggers per-page sequential downloads, not a ZIP archive.
- File names use `page-N.jpg` for JPEG or the selected extension for other formats.

Recommended intro:

`Use PDF to JPG to render each PDF page as an image in your browser. Choose the render scale, pick JPEG or PNG, adjust JPEG quality when needed, preview the pages, and download the images.`

Practical example:

`Example: Upload a two-page flyer, choose JPEG with a higher scale for sharper output, review the previews, then download each rendered page image.`

Limits:

- Rendered images are visual page snapshots, not editable text.
- Higher scale can use more memory and take longer.
- "Download all" starts multiple page downloads; do not describe it as a ZIP unless implementation changes.

Related-link guidance:

- `/jpg-to-pdf/` for recombining image files into a PDF.
- `/ocr-pdf/` for extracting text after rendering or from image-heavy PDFs.
- `/pdf-split/` if only certain PDF pages are needed before converting.

## Day 07 Handoff

Phase 04 should avoid generic "image converter" copy here. The safer distinction is image-to-PDF layout controls for `/jpg-to-pdf/` and page rendering controls for `/pdf-to-jpg/`.
