# Phase 03 Day 06 - Compress/Optimize And Organize PDF Briefs

Generated: 2026-09-10

## Objective

Create rewrite briefs for `/pdf-compress/`, `/optimize-pdf/`, and `/organize-pdf/` without unmeasured compression or quality claims.

## `/pdf-compress/` Brief

Verified tool facts:

- Loads one PDF.
- Uses `pdf-lib` save options with object streams.
- Provides low, medium, and high UI levels, but implementation does not downsample images.
- Reports original and output sizes.
- If output is not smaller, status says no reduction and download can fall back to original bytes.
- Download default: `compressed.pdf`.

Recommended intro:

`Use Compress PDF to rebuild a PDF in your browser and compare the original size with the saved result. Pick a compression level, run the tool, and use the measured before/after sizes to decide whether the PDF actually became smaller.`

Practical example:

`Example: Upload a proposal PDF before emailing it. Run medium compression and compare the displayed sizes. If the page reports no reduction, the source file is probably already optimized for this browser-based method.`

Limits:

- Do not promise a percentage reduction.
- Do not claim image downsampling.
- Say "may reduce file size", not "will reduce file size".
- Large PDFs depend on browser memory.

## `/optimize-pdf/` Brief

Verified tool facts:

- Loads one PDF with `ignoreEncryption: true`.
- Copies all pages into a new PDF.
- Optional metadata clearing is available.
- Saves with object streams and reports measured size difference.
- Download default: `optimized.pdf`.

Recommended intro:

`Use Optimize PDF to rebuild a PDF with browser-side PDF settings and optional metadata clearing. The page shows the original and optimized sizes so you can verify whether the rebuilt file is smaller.`

Practical example:

`Example: Upload a PDF that has been edited many times. Turn on metadata cleanup if you do not need document title, author, subject, or keyword fields, then compare the measured output size before downloading.`

Limits:

- Optimization is not the same as guaranteed compression.
- Metadata clearing should be described as document metadata fields, not hidden content removal.
- Do not imply secure sanitization.

## `/organize-pdf/` Brief

Verified tool facts:

- Loads one PDF and detects page count.
- User enters page numbers in a sequence.
- Copies selected pages into a new document.
- Duplicate page numbers are preserved by the current parser.
- Missing page numbers are omitted from output.
- Download default: `organized.pdf`.

Recommended intro:

`Use Organize PDF to create a new PDF from pages in the order you type. Enter page numbers such as `3, 1, 2, 2, 5` to reorder, duplicate, or omit pages before downloading `organized.pdf`.`

Practical example:

`Example: Upload a scanned packet where page 3 should become the cover. Enter `3, 1, 2, 4, 5` and download a new PDF with that page order.`

Limits:

- One source PDF at a time.
- At least one valid page number is required.
- Page numbers outside the detected range are ignored.
- Does not edit text or images inside pages.

Related-link guidance:

- `/pdf-split/` for extracting ranges.
- `/pdf-merge/` for combining multiple PDFs.
- `/pdf-compress/` or `/optimize-pdf/` for measured file-size cleanup after page changes.

## Day 06 Handoff

Phase 04 can use these briefs directly. Keep `/pdf-compress/` and `/optimize-pdf/` distinct in copy so they do not cannibalize each other with identical "make smaller" language.
