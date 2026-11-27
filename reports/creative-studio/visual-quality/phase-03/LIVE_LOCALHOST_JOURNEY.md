# Localhost editor journey

The production EN, ES and DA pages ran on port 3000 with Chromium 156 on Linux. The pinned Phase 02 checkout ran on port 4173 for fresh baseline evidence.

1. Set the title and preset in the production editor. Enter “Turn scattered spreadsheets into clear reports your entire team can share today” and the two authored lines “Bring five sources together.” and “Review the same records in one place.” Add “Review your report” as the CTA.
2. Choose a serif hook, set 1.22 leading and 0.2 tracking, use masked rise with a 30-frame reveal, and start the CTA underline on frame 12.
3. Select 1920 × 1080, 1080 × 1920 and 1080 × 1080 in Composition layout. Use the keyboard scrubber for frames 0, 15 and 30 and export each film with Export Video. Download a clean PNG with Export PNG.
4. Switch direction and author four 120-frame shots in each 16-second variant. The comedy and suspense second shots use blank lines between paragraphs. In the comedy opening, use Bricolage Grotesque at display and caption sizes. Set the first caption start to 8 and stagger to 5 frames.
5. Author Spanish and Danish product versions through the localized routes. Include accented characters, longer sentence copy, `品質` and `👩🏽‍💻` in their portrait captions. Export from each locale.
6. Save projects with Save .acstudio. In fresh isolated browser contexts, select the local archive through the file input, change the selected caption, and export again.

[Production UI screenshot](evidence/editor.png) · [Playwright trace](evidence/browser-trace.zip) · [Workflow script](scripts/browser.js) · [Browser console and request log](evidence/browser-results.json) · [Mobile ES](evidence/mobile-es.png)

A separate localized touch-emulation sweep exercised the 375-pixel inspector and its reading-time guidance. A failed-font test blocked the local faces and checked the visible fallback message. [Browser regressions](evidence/browser-regression.json) · [Fallback canvas](evidence/preview-font-fallback.png)
