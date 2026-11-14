# Multilingual Tool Names & Search Localization Plan

## 1. Problem Statement & User Request
When navigating the site in Spanish (`/es/`) or Danish (`/da/`):
1. **Search Modal**:
   - Tool titles displayed in English (e.g., "URL Encoder", "JSON Formatter", "Word Counter", "JSON Compare") instead of localized names ("Codificador URL", "Formateador JSON", "Contador de Palabras", "Comparar JSON").
   - Tool descriptions displayed in English instead of localized Spanish/Danish descriptions.
   - Category badges displayed in English ("Developer", "Text", "PDF", etc.) instead of localized Spanish/Danish category names ("Desarrollador", "Texto", "PDF", etc.).
   - Search modal footer displayed in English ("Navigate", "Open", "Close") instead of localized equivalents ("Navegar" / "Naviger", "Abrir" / "Åbn", "Cerrar" / "Luk").
2. **Homepage Dashboard Quick Access / Favorites**:
   - Header is localized ("HERRAMIENTAS FAVORITAS" / "FAVORITVÆRKTØJER"), but the card names in `.dash-quick-card-name` remain in English.

---

## 2. Proposed Architecture & Solution Design

### A. Localization Dictionaries in `assets/js/shared.js`
We will introduce compact lookup tables inside `assets/js/shared.js` with 100% parity across all 128 canonical tools:
- `TOOL_I18N = { es: { names: { ... }, descs: { ... } }, da: { names: { ... }, descs: { ... } } }`:
  - Contains exact, concise tool titles verified from Spanish & Danish hub and page titles.
  - Contains crisp, active descriptions without boilerplate ("Usa..." / "Incluye ejemplos...").
- `CATEGORY_I18N`:
  - `Developer`: ES `Desarrollador`, DA `Udvikler`
  - `Text`: ES `Texto`, DA `Tekst`
  - `PDF`: ES `PDF`, DA `PDF`
  - `Productivity`: ES `Productividad`, DA `Produktivitet`
  - `Calculator`: ES `Calculadora`, DA `Beregner`
  - `Browser`: ES `Navegador`, DA `Browser`
  - `Data`: ES `Datos`, DA `Data`
  - `Media`: ES `Medios`, DA `Medier`
  - `Tools`: ES `Herramientas`, DA `Værktøjer`
  - `Fun`: ES `Entretenimiento`, DA `Underholdning`
  - `Finance`: ES `Finanzas`, DA `Finans`
  - `Numerology`: ES `Numerología`, DA `Numerologi`
  - `Astrology`: ES `Astrología`, DA `Astrologi`
  - `Date & Time`: ES `Fecha y Hora`, DA `Dato og Tid`
- Helper functions:
  - `getToolName(tool, lang)`: returns `TOOL_I18N[lang]?.names[tool.u] || tool.n`
  - `getToolDesc(tool, lang)`: returns `TOOL_I18N[lang]?.descs[tool.u] || tool.d`
  - `getToolCategory(category, lang)`: returns `CATEGORY_I18N[lang]?.[category] || category`

### B. Search Modal Footer Localization
In `initSearch()`:
- Locate `.search-footer` element inside modal.
- If `lang === 'es'`: `<span><kbd>↑↓</kbd> Navegar</span><span><kbd>↵</kbd> Abrir</span><span><kbd>Esc</kbd> Cerrar</span>`
- If `lang === 'da'`: `<span><kbd>↑↓</kbd> Naviger</span><span><kbd>↵</kbd> Åbn</span><span><kbd>Esc</kbd> Luk</span>`

### C. Search Modal Results & Matching Enhancement
- In `renderList(tools, label, q)`:
  - Tool name rendered with `getToolName(tool, lang)`.
  - Tool description rendered with `getToolDesc(tool, lang)`.
  - Category badge rendered with `getToolCategory(tool.c, lang)`.
  - Highlight helper `hlMatch` highlights matched terms in the localized name.
- In `renderResults(q)`:
  - Search query matches against both English and localized name: `t.n.toLowerCase().indexOf(ql) !== -1 || getToolName(t, lang).toLowerCase().indexOf(ql) !== -1`.
  - Matches against localized description and category in addition to English fallback.

### D. Dashboard Quick Access / Favorites Card Localization
In `initDashboardQuickAccess()`:
- When rendering favorite cards or quick access cards:
  - Card text: `escapeHtml(getToolName(tool, lang))`
  - Card icon alt: `escapeHtml(getToolName(tool, lang)) + ' icon'`

---

## 3. Implementation Steps

1. **Build Validated Dictionary Script (`scratch/generate_i18n_dictionaries.js`)**:
   - Merge `clean_tool_names.json` (all 128 verified names) and clean non-boilerplate descriptions.
   - Format cleanly into JavaScript structures for insertion into `assets/js/shared.js`.
2. **Update `assets/js/shared.js`**:
   - Insert `TOOL_I18N` and `CATEGORY_I18N`.
   - Add `getToolName()`, `getToolDesc()`, `getToolCategory()`.
   - Update `initSearch()` (footer localization, `renderList()`, `renderResults()`).
   - Update `initDashboardQuickAccess()` to use `getToolName()`.
3. **Write Automated Regression Tests (`tests/test_multilingual_tool_names.js`)**:
   - Test 1: Verify all 128 tools have ES and DA translations in `TOOL_I18N`.
   - Test 2: Verify `getToolName()` returns Spanish names on `/es/` and Danish names on `/da/`.
   - Test 3: Verify Search Modal renders Spanish tool names, descriptions, and category badges on `/es/`.
   - Test 4: Verify Search Modal footer is translated to Spanish and Danish.
   - Test 5: Verify Homepage Dashboard favorite cards render localized names on `es/index.html` and `da/index.html`.
   - Test 6: Verify search query matches Spanish queries (e.g. "Contador", "Codificador", "Unir").
4. **Register Test in `tests/run_all_tests.js` & Run Full Suite**:
   - Run `node tests/run_all_tests.js` to ensure all 21 test suites pass with 0 failures.
5. **Update Persistent Memory**:
   - Update `.ai-memory/STATE.json`, `DECISIONS.md`, and `HANDOFF.md`.

---

## 4. Verification & Validation Checklist
- [ ] No regression on English tools or default English views.
- [ ] No network dependencies or external API calls (100% zero-dependency client-side).
- [ ] Clean visual rendering in search dropdown and homepage dashboard.
- [ ] Full reciprocal parity across EN, ES, DA.
