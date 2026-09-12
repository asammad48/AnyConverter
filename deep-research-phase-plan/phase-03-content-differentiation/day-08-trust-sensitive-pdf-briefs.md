# Phase 03 Day 08 - OCR, Blackout, And PDF Security Briefs

Generated: 2026-09-10

## Objective

Create trust-sensitive rewrite briefs for `/ocr-pdf/`, `/redact-pdf/`, and `/pdf-security/`.

## `/ocr-pdf/` Brief

Verified tool facts:

- Accepts PDF or image input.
- Uses PDF.js to render PDF pages to canvas.
- Uses Tesseract OCR on rendered canvas or image canvas.
- Appends page markers for PDF OCR output.
- Language is selected from the UI.
- No explicit file size/page limit is coded.

Recommended intro:

`Use OCR PDF to recognize text from a PDF or image in your browser. The page renders each PDF page, runs OCR with the selected language, and returns extracted text you can review and copy.`

Trust wording:

- Say OCR output needs review.
- Do not promise perfect recognition.
- Do not claim searchable PDF output unless implemented.
- Mention large scans may take time.

Network/privacy blocker:

- Tesseract worker/language asset loading needs a browser network trace before stronger "no external requests" wording.

## `/redact-pdf/` Brief

Current safer page facts:

- Title: Blackout PDF Online Free.
- Meta says visual blackout, not secure redaction or permanent text removal.
- Hero says underlying PDF text or objects are not securely removed.
- Local script draws black rectangles with `page.drawRectangle`.

Required positioning:

`Blackout PDF` is the product label. Avoid "Redact PDF" as the primary promise unless paired with an immediate warning.

Recommended intro:

`Use Blackout PDF to cover non-sensitive PDF areas with solid black rectangles. This is visual blackout only: it does not securely remove underlying PDF text, images, or objects from the file.`

Practical example:

`Example: For a draft screenshot-style PDF, enter the page number and rectangle coordinates to cover a visible note before sharing an informal copy. Do not use this output for legal, compliance, confidential, or irreversible redaction needs.`

Required warning block:

`Important: This tool draws black rectangles over page areas. Underlying PDF content can remain recoverable. Use specialist redaction software when the hidden content must be permanently removed.`

Limits:

- Requires manual page coordinates.
- Coordinates use PDF points with origin at bottom-left.
- Requires at least one blackout area.
- Not suitable for confidential redaction.

## `/pdf-security/` Brief

Verified tool facts:

- Loads one PDF and copies pages into a new document.
- Requires an owner password.
- Optional user password.
- Permissions include printing, modifying, copying, annotating, forms, accessibility, and document assembly settings.
- Saves through `pdf-lib` with owner/user passwords and permissions.
- Download default: `secured.pdf`.

Recommended intro:

`Use PDF Security to save a PDF with an owner password, optional user password, and viewer permissions for printing, copying, editing, annotation, and forms. PDF permission behavior can depend on the app used to open the file, so test the secured PDF in the viewers your audience uses.`

Practical example:

`Example: Upload a draft PDF, enter an owner password, choose whether viewers can print or copy content, and download `secured.pdf`. Open it in your target PDF viewer to confirm the permissions behave as expected.`

Limits:

- Owner password is required.
- Permissions depend on viewer enforcement.
- Do not promise legal, compliance, DRM, or anti-tamper protection.
- This does not remove sensitive content; pair with Blackout PDF warning if users are trying to hide information.

## Day 08 Handoff

These pages require the strictest review in Phase 04. `/redact-pdf/` and `/pdf-security/` should receive legal/security-sensitive copy review before release.
