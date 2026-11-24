# AnyConverter Creative Studio — Evidence Index

**Audit Run ID:** `2026-11-25-audit`  
**Standard:** Immutable verification linking every audit status to genuine disk artifacts, screenshots, and hashes.

---

## Artifact & Evidence Inventory

| Evidence ID | Description | File Path | Format / Size | SHA-256 Checksum |
|---|---|---|:---:|---|
| **`EV-HOME-01`** | Live Homepage Capture on localhost | `screenshots/01_homepage.png` | PNG (1280x800) | `E9901294B1F28DFE32EAE8D338DB60869B00619DE08EE3C06112C24FE825E663` |
| **`EV-404-01`** | HTTP 404 on `/creative-studio/` | `screenshots/03_route__creative-studio_.png` | PNG (1280x800) | `92DF5266368565C2FE43EE1BFE1F692BECACE4CBE309F7CAAFA1D578CF92F67E` |
| **`EV-404-02`** | HTTP 404 on `/creative-studio/index.html` | `screenshots/03_route__creative-studio_index_html.png` | PNG (1280x800) | `92DF5266368565C2FE43EE1BFE1F692BECACE4CBE309F7CAAFA1D578CF92F67E` |
| **`EV-EXIST-01`** | Working Existing Tool (`/json-formatter/`) | `screenshots/04_existing_tool_json_formatter.png` | PNG (1280x800) | `8B269228E47173425EC432A09E0580FF0517FF1EABD0D9F13CD52F17CEE872D9` |
| **`EV-OUTPUT-QR`** | Generated vCard QR SVG (Pseudo-random hash) | `OUTPUTS/test_qr_vcard.svg` | SVG (17.2 KB) | `BE0ED05606A7C555366E67F4470D9166A4FDE2BC4D177A275D4CAC03A77B5CDE` |
| **`EV-ARCHIVE-01`**| Phase 03 Sample Archive Container | `tests/creative-studio/fixtures/sample_project.acstudio` | ZIP / .acstudio (2.8 KB) | `FBCC304EF10DB04741D35B38A3573E7DF1FCF38AC3C8733609F739DF93273D19` |
| **`EV-PROBE-JSON`**| Comprehensive Localhost Probe Output | `initial_live_probe_results.json` | JSON | Dynamic test probe dump |
| **`EV-INSPECT-JSON`**| Deep Module & Prototype Inspection | `deep_module_inspection.json` | JSON | Dynamic module inspection dump |

---

## Evidence Validation Details

1. **`EV-404-01` / `EV-404-02`:** Proves beyond doubt that navigating to `/creative-studio/` or `/creative-studio/index.html` in an actual Chromium browser on localhost serves a 404 page. No UI exists.
2. **`EV-OUTPUT-QR`:** Proves that while an SVG file is output, scanning it with any real smartphone or barcode reader fails because the underlying data matrix algorithm is `(hash ^ (r*13 + c*37)) & 1` rather than ISO/IEC 18004 QR encoding.
3. **`EV-ARCHIVE-01`:** Inspection of the unpacked bytes proves the assets inside the archive are 26–29 byte ASCII mock strings (`FAKE_PNG_HEADER_DATA_12345`), not genuine media.
4. **`EV-EXIST-01`:** Proves that the AnyConverter local server works correctly and existing tools (JSON Formatter) load as expected without regression.
