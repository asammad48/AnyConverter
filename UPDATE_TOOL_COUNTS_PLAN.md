# Implementation Plan: Update Search Placeholder & Tool Counts to Canonical 128 Tools

## Goal Description
Direct user directive:
> "Where there is 80+ tools in search please update that text to original count , also where there is wrong tool count please update"

The repository has an established canonical count of **128 unique functioning tools** (verified in ADR-013 and `tests/test_sitewide_parity_and_counts.js`).
In `assets/js/shared.js` (line 391), the search modal input template contains:
`placeholder="Search 80+ tools…"`
This plan replaces the stale `80+ tools` count with the accurate canonical count of **128 tools** (`Search 128 tools…`), introduces localized placeholders for Spanish (`Buscar entre 128 herramientas…`) and Danish (`Søg i 128 værktøjer…`), and adds automated regression guards to guarantee no stale tool count returns.

---

## User Review Required

> [!NOTE]
> **Canonical Tool Count:**
> The site's verified inventory is **128 tools** (represented in the `TOOLS` search array, homepage category badges totaling `8 + 26 + 9 + 12 + 10 + 7 + 6 + 3 + 1 + 9 + 15 + 13 + 9 = 128`, and the hero pill `🛠 128 Tools`).
> 
> The search input placeholder will be set to:
> - **English:** `Search 128 tools…`
> - **Spanish:** `Buscar entre 128 herramientas…`
> - **Danish:** `Søg i 128 værktøjer…`

---

## Proposed Changes

```
assets/
└── js/
    └── shared.js                       # Update template to 128 tools & add locale placeholder handling
tests/
    ├── test_sitewide_parity_and_counts.js # Add guard against "80+ tools" in shared.js and pages
    └── test_dropdown_and_favorites.js   # Verify search modal input placeholder contains canonical 128
```

---

### Component 1: Search Modal HTML & Localization

#### [MODIFY] `assets/js/shared.js`
1. **Update `headerHTML` Search Modal Input Template (line 391):**
   ```html
   <!-- Before: -->
   <input type="search" id="search-input" class="search-modal-input" placeholder="Search 80+ tools…" autocomplete="off" spellcheck="false" aria-label="Search tools" aria-controls="search-results" aria-autocomplete="list">

   <!-- After: -->
   <input type="search" id="search-input" class="search-modal-input" placeholder="Search 128 tools…" autocomplete="off" spellcheck="false" aria-label="Search tools" aria-controls="search-results" aria-autocomplete="list">
   ```

2. **Multilingual Placeholder Setting in `initSearch()`:**
   On search initialization, set the placeholder dynamically based on `currentPageLang()`:
   ```javascript
   var lang = currentPageLang();
   if (input) {
     if (lang === 'es') {
       input.placeholder = 'Buscar entre 128 herramientas…';
       input.setAttribute('aria-label', 'Buscar herramientas');
     } else if (lang === 'da') {
       input.placeholder = 'Søg i 128 værktøjer…';
       input.setAttribute('aria-label', 'Søg værktøjer');
     } else {
       input.placeholder = 'Search 128 tools…';
       input.setAttribute('aria-label', 'Search tools');
     }
   }
   ```

3. **Multilingual Header Search Button Label:**
   In `renderHeader()`, ensure `.search-btn-label` reflects:
   - English: `Search tools…`
   - Spanish: `Buscar herramientas…`
   - Danish: `Søg værktøjer…`

---

### Component 2: Automated Regression Guards

#### [MODIFY] `tests/test_sitewide_parity_and_counts.js`
Add automated check ensuring `80+` or `80` tools does not appear in `assets/js/shared.js` or any HTML pages:
```javascript
assert.ok(!/\b80\+\s*tools/i.test(sharedJsContent), 'Found stale "80+ tools" in shared.js');
```

#### [MODIFY] `tests/test_dropdown_and_favorites.js`
Add assertion verifying `placeholder` in `shared.js` explicitly includes `128 tools`.

---

## Verification Plan

### Automated Tests
1. Run `node tests/test_dropdown_and_favorites.js` to verify search placeholder assertion.
2. Run `node tests/test_sitewide_parity_and_counts.js` to ensure all 0 stale counter checks pass.
3. Run `node tests/run_all_tests.js` (all 20 test suites).

### Manual Verification
1. Open `http://localhost:5000/` in browser.
2. Click Search or press `Ctrl+K`. Verify input placeholder displays `Search 128 tools…`.
3. Navigate to `http://localhost:5000/es/` -> press `Ctrl+K` -> verify placeholder displays `Buscar entre 128 herramientas…`.
4. Navigate to `http://localhost:5000/da/` -> press `Ctrl+K` -> verify placeholder displays `Søg i 128 værktøjer…`.
