# Implementation Plan: Navbar Dropdown Defect Repairs & Dynamic Favorites / Quick Access System

## Goal Description
Resolve critical navbar dropdown usability defects and implement the dynamic favorites/quick access architecture requested:
1. **Prevent Dual Dropdown Display:** Fix the issue where two navbar dropdowns (e.g. Developer and Browser) appear simultaneously because click-state (`aria-expanded="true"`) and CSS `:hover` conflict without mutual exclusion.
2. **Prevent Dropdown Disappearing on Mouse Movement:** Fix the issue where hovering over a navbar item and moving down towards an item in the menu causes the dropdown list to abruptly vanish due to a 6px dead hit-test gap (`top: calc(100% + 6px)`).
3. **Interactive "Add to Favorites" Toggle:** Fix tool-page favorite buttons so they properly inspect current favorite status on page load, toggle between active/inactive (`★ In Favorites` / `☆ Add to Favorites`), update UI styling (`.is-favorited`), and support removing tools from favorites.
4. **Dynamic Favorites vs Quick Access in Search Modal:** When the search modal opens or search query is empty: if user has saved favorites, display **Favorite Tools** (`★ Favorite tools`); if no favorites exist, display curated **Quick Access** (`⚡ Quick Access`).
5. **Dynamic Favorites vs Quick Access on Dashboard (Homepage):** In the homepage "Quick Access" section (`.dash-quick-grid`): if user has saved favorites, change section header to **Favorite Tools** and render user's favorited tool cards; if no favorites exist, retain default curated Quick Access tools.

---

## User Review Required

> [!IMPORTANT]
> **Data Format & Backward Compatibility:**
> Favorites will be keyed in `localStorage['ac:fav']` as canonical path objects: `{ u: '/json-formatter/', name: 'JSON Formatter', icon: '/assets/img/icon-json.svg', cat: 'Developer', ts: Date.now() }`.
> Any legacy entries stored with full URLs (`https://anyconverter.io/...`) will be automatically migrated and normalized to canonical slugs so existing user favorites are never lost across environments (localhost / production) or language prefixes (`/es/`, `/da/`).

> [!NOTE]
> **Curated Quick Access Baseline:**
> When a user has 0 favorites, default search and homepage quick access show the platform's top curated tools:
> - **JSON Formatter** (`/json-formatter/`)
> - **PDF Merge** (`/pdf-merge/`)
> - **Image Compressor** (`/image-compressor/`)
> - **QR Code Generator** (`/qr-code-generator/`)
> - **Word Counter** (`/word-counter/`)
> - **Password Generator** (`/password-generator/`)
> - **Currency Converter** (`/currency-converter/`)
> - **Age Calculator** (`/age-calculator/`)

---

## Root Cause Analysis

### 1. Dual Dropdown Defect (Screenshot Evidence)
- **Root Cause:** In `assets/css/style.css`, dropdown visibility is governed by two concurrent rules:
  ```css
  .nav-dropdown:hover .dropdown-menu,
  .nav-more[aria-expanded="true"] + .dropdown-menu { display: block; }
  ```
- When a user clicks "Developer", `btn.setAttribute('aria-expanded', 'true')` keeps Developer visible. If the user then hovers "Browser", `:hover` activates on Browser. Because Developer's `aria-expanded` was never cleared on hovering another nav item, **both dropdowns render simultaneously**.

### 2. Dropdown Disappearing on Mouse Movement
- **Root Cause:** In `assets/css/style.css`, `.dropdown-menu` has `top: calc(100% + 6px);`.
- There is a 6-pixel physical gap between the bottom of `.nav-dropdown` / button and the top of `.dropdown-menu`.
- When the mouse cursor leaves the button and moves across those 6 pixels, the pointer is hovering `<header>` / `<nav>`, not `.nav-dropdown`. Hover state is immediately dropped before the pointer reaches the menu, causing the dropdown to instantly collapse and disappear.

### 3. Add to Favorites Inactivity
- **Root Cause:**
  1. On page load, `initToolPageActions()` does not check `localStorage['ac:fav']`, so the button always displays `☆ Add to Favorites` even if the tool is already favorited.
  2. Clicking does not toggle: if already present, it shows a toast ("Already in favorites.") but does not allow removal, nor does it update button appearance.
  3. Search modal `showPopular()` was completely static (`POPULAR` array) and never read `ac:fav`.
  4. Homepage `.dash-quick-grid` was hardcoded HTML and never read `ac:fav`.

---

## Proposed Changes

```
assets/
├── css/
│   └── style.css           # Add ::before bridge to .dropdown-menu, style .is-favorited
└── js/
    └── shared.js           # Mutual exclusion on nav hover, favorite toggle, search & dashboard dynamic rendering
tests/
    └── test_dropdown_and_favorites.js # Automated verification test suite
```

---

### Component 1: Navbar Dropdown Architecture & Styling

#### [MODIFY] `assets/css/style.css`
1. **Add invisible hit-test bridge to `.dropdown-menu`:**
   ```css
   .dropdown-menu::before {
     content: '';
     position: absolute;
     top: -10px;
     left: 0;
     right: 0;
     height: 10px;
     background: transparent;
   }
   ```
   *Effect:* The 6px gap is covered by this hit-testing pseudo-element, preventing `:hover` loss during cursor movement.
2. **Style Favorited State for Tool Action Buttons:**
   ```css
   .tool-page-action-btn[data-action="favorite"].is-favorited {
     background: var(--color-primary-light);
     border-color: var(--color-primary);
     color: var(--color-primary);
   }
   .tool-page-action-btn[data-action="favorite"].is-favorited span[aria-hidden="true"] {
     color: #EAB308;
   }
   ```

#### [MODIFY] `assets/js/shared.js`
1. **Mutual Dropdown Hover & Click Exclusion in `initHeader()`:**
   - Listen for `mouseenter` on every `.nav-dropdown`:
     When mouse enters a dropdown, immediately close all other open dropdowns (`aria-expanded="false"`) and close the language dropdown.
   - When any dropdown is clicked, close all other dropdowns.
   - When mouse leaves the entire `.main-nav`, ensure hover states cleanly settle.

---

### Component 2: Favorites Storage & Tool Page Toggle

#### [MODIFY] `assets/js/shared.js`
1. **Helper Functions:**
   - `getFavoritesList()`: Reads `localStorage.getItem('ac:fav')`, handles legacy schema migrations, cross-references `TOOLS` by canonical slug `u`, returns structured tool list with localized labels and icons.
   - `isFavorite(canonicalPath)`: Returns boolean whether tool canonical path is saved.
   - `toggleFavorite(canonicalPath, toolName)`: Toggles favorite status in `localStorage`, returns `{ isFav, tool }`.
2. **Tool Page Action Button (`initToolPageActions()`):**
   - On initialization:
     Inspect current tool's canonical path: `englishPathFor(window.location.pathname)`.
     If favorited: set `is-favorited` class, icon `★`, and text `t.favorited` ("Favorited" / "En favoritos" / "Favorit").
     If not favorited: remove `is-favorited` class, icon `☆`, and text `t.favorite` ("Add to Favorites").
   - On click:
     Toggle favorite status.
     Update button state and icon immediately.
     Show toast: `t.added` ("Added to favorites.") or `t.removed` ("Removed from favorites.").
     Dispatch custom window event `'ac:favorites-updated'` so open views (dashboard, search) re-render immediately.

---

### Component 3: Dynamic Search Modal (Favorites vs Quick Access)

#### [MODIFY] `assets/js/shared.js`
1. **Update `showPopular()` to `showDefaultList()` in `initSearch()`:**
   - When search input is empty (on modal open or after clearing input):
     - Read `getFavoritesList()`.
     - **If favorites exist (`favs.length > 0`)**:
       Render favorite items using `renderList(favs, t.favHeader || '★ Favorite tools', null)`.
     - **If no favorites (`favs.length === 0`)**:
       Render curated `POPULAR` items using `renderList(quickTools, t.quickHeader || '⚡ Quick Access', null)`.
   - Internationalized section headers:
     - EN: `★ Favorite tools` vs `⚡ Quick Access`
     - ES: `★ Herramientas favoritas` vs `⚡ Acceso Rápido`
     - DA: `★ Favoritværktøjer` vs `⚡ Hurtig Adgang`

---

### Component 4: Dynamic Dashboard / Homepage Quick Access

#### [MODIFY] `assets/js/shared.js`
1. **Implement `initDashboardQuickAccess()`:**
   - Look for `.dash-quick-grid` and `.dash-section-title` in `.dash-section`.
   - If not on a homepage with `.dash-quick-grid`, exit safely.
   - Cache default HTML on load (so if all favorites are removed, the default grid is restored without page reload).
   - Read `getFavoritesList()`.
   - **If favorites exist (`favs.length > 0`)**:
     - Change section title to localized "Favorite Tools" (EN: `Favorite Tools`, ES: `Herramientas Favoritas`, DA: `Favoritværktøjer`).
     - Render `.dash-quick-grid` with cards matching the existing design token specification:
       ```html
       <a href="${tool.localizedUrl}" class="dash-quick-card" style="--dash-accent:${tool.accent}">
         <img src="${tool.icon}" alt="${tool.name} icon" width="26" height="26" loading="lazy">
         <span class="dash-quick-card-name">${escapeHtml(tool.name)}</span>
       </a>
       ```
   - **If no favorites (`favs.length === 0`)**:
     - Restore/keep original curated Quick Access cards and title ("Quick Access" / "Acceso Rápido" / "Hurtig Adgang").
   - Listen for `'ac:favorites-updated'` to re-render dynamically.

---

## Verification Plan

### Automated Tests
Create new regression test script: `tests/test_dropdown_and_favorites.js` testing:
1. **CSS Gap Bridge Assertion:** Verify `.dropdown-menu::before` rule exists with bridge height covering the 6px gap.
2. **Dropdown Mutual Exclusion:** JSDOM / Playwright test asserting that triggering click on one nav button and mouseenter on another resets the first button's `aria-expanded` to `'false'`.
3. **Favorites Storage & Toggle Logic:**
   - Empty state returns 0 favorites.
   - Adding tool saves canonical slug and metadata.
   - Calling toggle again removes tool and restores empty state.
   - Multi-locale paths (`/es/json-formatter/`) map to the same canonical key (`/json-formatter/`).
4. **Search Modal Rendering:**
   - Zero favorites -> renders header `'⚡ Quick Access'` with curated tools.
   - Has favorites -> renders header `'★ Favorite tools'` with user's favorites.
5. **Dashboard Rendering:**
   - Zero favorites -> retains default Quick Access cards.
   - Has favorites -> renders user's favorites and updates title to `'Favorite Tools'`.
6. Run full repository suite: `node tests/run_all_tests.js`.

### Manual Verification
1. **Dual Dropdown Test:**
   - Open browser, click "Developer". Menu opens.
   - Move mouse over "Browser". Developer closes immediately, Browser opens alone.
   - Move mouse to "Calculators". Browser closes, Calculators opens alone.
2. **Hover Gap Bridge Test:**
   - Hover over "Browser".
   - Move mouse slowly down into "Browser Info Viewer" or "Internet Speed Test". Dropdown does not flicker or vanish.
3. **Favorites Toggle Test:**
   - Navigate to `/json-formatter/`. Button shows `☆ Add to Favorites`.
   - Click button -> shows toast "Added to favorites", button switches to `★ Favorited` with primary highlight.
   - Refresh page -> button remains `★ Favorited`.
   - Click again -> shows toast "Removed from favorites", button reverts to `☆ Add to Favorites`.
4. **Search Modal Test:**
   - With 0 favorites: Press Ctrl+K. Verify header says `⚡ Quick Access` with curated tools.
   - Add JSON Formatter and Word Counter to favorites.
   - Press Ctrl+K. Verify header says `★ Favorite tools` and displays the 2 favorited tools.
5. **Dashboard Test:**
   - Navigate to `/`. If favorites exist, verify section is titled "Favorite Tools" with favorited cards.
   - Clear favorites or favorite new tools -> verify section title and cards update accordingly.
