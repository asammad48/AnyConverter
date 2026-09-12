# Phase 03 Day 05 - Merge PDF And Split PDF Briefs

Generated: 2026-09-10

## Objective

Produce implementation-ready rewrite briefs for `/pdf-merge/` and `/pdf-split/`.

## `/pdf-merge/` Brief

Current observed page:

- Title/meta follow the repeated "free in your browser" template.
- H1: Merge PDF Online.
- Local script: `assets/js/tools/pdf-merge.js`.

Search intent:

- Combine multiple PDFs into one file.
- Control file order before download.
- Avoid desktop PDF software for simple merges.

Verified tool facts:

- Requires at least two PDF files.
- Accepts files with `application/pdf` MIME or `.pdf` extension.
- Uses `pdf-lib` in the browser to copy pages into a new PDF.
- Supports drag/drop ordering, remove file, alphabetical sort, and optional blank separator page between documents.
- Download uses a Blob and defaults to `merged.pdf`.
- No explicit file size or page count limit is coded; browser memory is the practical limit.

Recommended intro:

`Use Merge PDF to combine two or more PDF files into one document. Add files, drag them into the order you want, optionally sort by name or add blank separator pages, then download the merged PDF from your browser.`

Practical example:

`Example: Upload a cover sheet, a signed agreement, and three appendix PDFs. Drag the cover sheet to the top, keep the appendices in order, turn on blank separators if you need section breaks, and download `merged.pdf`.`

How-it-works block:

`The page reads each selected PDF in the browser, copies every page into a new PDF document, and saves the result as a downloadable file. If a PDF is encrypted, malformed, or too large for browser memory, the merge can fail before the download is created.`

Limits block:

- At least two PDFs are required.
- Password-protected or damaged PDFs may not load.
- The tool merges whole PDFs; it does not pick page ranges from each file.
- Large sets of PDFs can be constrained by browser memory.

Related-link guidance:

- Link to `/pdf-split/` for extracting pages after or before merge.
- Link to `/organize-pdf/` for page-level reordering inside one PDF.
- Link to `/pdf-compress/` or `/optimize-pdf/` only as optional cleanup after merge.

Acceptance checks:

- No compression ratio promise.
- No "unlimited" claim unless reframed as "no explicit coded limit".
- No URL movement.

## `/pdf-split/` Brief

Current observed page:

- Title/meta follow the repeated "free in your browser" template.
- H1: Split PDF Online.
- Local script: `assets/js/tools/pdf-split.js`.

Search intent:

- Extract page ranges from one PDF.
- Create one PDF per page or per interval.
- Download several split files, optionally as a ZIP.

Verified tool facts:

- Loads one PDF and detects page count.
- Uses `pdf-lib` to copy selected pages into new PDF files.
- Range parsing supports comma-separated pages and page ranges.
- Valid pages are sorted and deduplicated for page-range mode.
- Other modes create files every N pages or one file per page.
- Optional ZIP download is supported by local ZIP writer.
- Default file prefix is `part`.

Recommended intro:

`Use Split PDF to turn one PDF into smaller files by page range, by every N pages, or by individual page. Enter ranges like `1-3, 7, 10-12`, choose whether to download separate files or a ZIP, and save the results from your browser.`

Practical example:

`Example: Upload a 30-page packet and enter `1-2, 9-14` to extract the cover and one section. Use a clear prefix such as `contract-section` so the downloaded files are easy to identify.`

How-it-works block:

`The page loads the source PDF in the browser, copies the requested pages into new PDF documents, and creates downloadable files. Page numbers outside the detected page count are ignored or rejected by the range parser.`

Limits block:

- One source PDF at a time.
- The page-range parser keeps valid page numbers and removes duplicates.
- Encrypted or malformed PDFs may fail to load.
- Browser memory limits apply for very large PDFs.

Related-link guidance:

- Link to `/pdf-merge/` for recombining split files.
- Link to `/organize-pdf/` for custom page order in one output.
- Link to `/pdf-to-jpg/` if the user needs page images instead of PDF pages.

Acceptance checks:

- Range examples must match the parser.
- ZIP copy should say optional, not default.
- Do not claim server-side storage deletion because no server upload is evidenced.

## Day 05 Handoff

Both pages are ready for Phase 04 copy implementation after selector compatibility from Day 13 is applied.
