# AnyConverter — Topbar, Footer & Shared Components

## Header (Topbar) — Full Spec

### Structure
```html
<header id="site-header" class="site-header">
  <div class="header-inner">

    <!-- Logo -->
    <a href="/" class="logo" aria-label="AnyConverter Home">
      <img src="/assets/img/logo.svg" alt="AnyConverter" width="32" height="32">
      <span class="logo-text">AnyConverter</span>
    </a>

    <!-- Desktop Navigation -->
    <nav class="main-nav" aria-label="Main navigation">
      <ul>
        <li><a href="/json-formatter/" class="nav-link">JSON</a></li>
        <li><a href="/xml-formatter/" class="nav-link">XML</a></li>
        <li><a href="/image-converter/" class="nav-link">Images</a></li>
        <li><a href="/pdf-merge/" class="nav-link">PDF</a></li>
        <li class="nav-dropdown">
          <button class="nav-link nav-more" aria-expanded="false" aria-haspopup="true">
            More Tools <span aria-hidden="true">▾</span>
          </button>
          <ul class="dropdown-menu" role="menu">
            <li><a href="/base64-encoder/">Base64 Encoder</a></li>
            <li><a href="/url-encoder/">URL Encoder</a></li>
            <li><a href="/csv-to-sql/">CSV to SQL</a></li>
            <li><a href="/csv-query/">CSV Query</a></li>
            <li><a href="/regex-tester/">Regex Tester</a></li>
            <li><a href="/hash-generator/">Hash Generator</a></li>
            <li><a href="/timestamp-converter/">Timestamp</a></li>
            <li><a href="/markdown-html/">Markdown</a></li>
            <li><a href="/color-converter/">Color Converter</a></li>
            <li><a href="/pdf-compress/">PDF Compress</a></li>
            <li><a href="/pdf-split/">PDF Split</a></li>
          </ul>
        </li>
      </ul>
    </nav>

    <!-- Right controls -->
    <div class="header-controls">
      <!-- Language Switcher -->
      <div class="lang-switcher" id="lang-switcher">
        <button class="lang-btn" aria-expanded="false" aria-haspopup="listbox" aria-label="Select language">
          <span id="lang-flag">🇺🇸</span>
          <span id="lang-code">EN</span>
          <span aria-hidden="true">▾</span>
        </button>
        <ul class="lang-dropdown" role="listbox" aria-label="Language options">
          <li role="option" data-lang="en" data-flag="🇺🇸" data-path="">
            🇺🇸 English
          </li>
          <li role="option" data-lang="es" data-flag="🇪🇸" data-path="es">
            🇪🇸 Español
          </li>
          <li role="option" data-lang="da" data-flag="🇩🇰" data-path="da">
            🇩🇰 Dansk
          </li>
        </ul>
      </div>

      <!-- Mobile hamburger -->
      <button class="hamburger" id="mobile-menu-btn"
              aria-expanded="false" aria-label="Open menu"
              aria-controls="mobile-menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>

  <!-- Mobile menu overlay -->
  <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
    <nav aria-label="Mobile navigation">
      <ul>
        <li><a href="/">🏠 All Tools</a></li>
        <li><a href="/json-formatter/">JSON Formatter</a></li>
        <li><a href="/xml-formatter/">XML Formatter</a></li>
        <li><a href="/image-converter/">Image Converter</a></li>
        <li><a href="/pdf-merge/">PDF Merge</a></li>
        <li><a href="/pdf-compress/">PDF Compress</a></li>
        <li><a href="/pdf-split/">PDF Split</a></li>
        <li><a href="/base64-encoder/">Base64 Encoder</a></li>
        <li><a href="/url-encoder/">URL Encoder</a></li>
        <li><a href="/csv-to-sql/">CSV to SQL</a></li>
        <li><a href="/csv-query/">CSV Query</a></li>
        <li><a href="/regex-tester/">Regex Tester</a></li>
        <li><a href="/hash-generator/">Hash Generator</a></li>
        <li><a href="/timestamp-converter/">Timestamp Converter</a></li>
        <li><a href="/markdown-html/">Markdown to HTML</a></li>
        <li><a href="/color-converter/">Color Converter</a></li>
      </ul>
      <!-- Language switcher repeated in mobile menu -->
      <div class="mobile-lang">
        <a href="[current-en-url]">🇺🇸 English</a>
        <a href="[current-es-url]">🇪🇸 Español</a>
        <a href="[current-da-url]">🇩🇰 Dansk</a>
      </div>
    </nav>
  </div>
</header>
```

### Header Behavior (shared.js)
```javascript
// Active nav link: add class "active" to link matching current URL path
// Sticky: header stays at top on scroll
// Scroll shadow: add class "scrolled" to header after 10px scroll
//   → adds box-shadow to header
// Dropdown: toggle aria-expanded + show/hide dropdown on click
//   → close on Escape key, close on click outside
// Mobile menu: toggle aria-expanded + aria-hidden on overlay
//   → close on Escape, trap focus inside when open
// Language switcher:
//   Read current URL path
//   EN: remove /es/ or /da/ prefix
//   ES: add /es/ prefix (or replace /da/ with /es/)
//   DA: add /da/ prefix (or replace /es/ with /da/)
//   Store preference: localStorage.setItem('ac_lang', 'es')
```

### Header CSS
```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  transition: box-shadow 0.2s;
}
.site-header.scrolled {
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 32px;
}
/* Logo */
.logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
.logo-text { font-size: 18px; font-weight: 700; color: var(--color-text); }

/* Nav */
.main-nav { flex: 1; display: none; }  /* hidden on mobile */
@media (min-width: 1024px) { .main-nav { display: block; } }
.main-nav ul { display: flex; list-style: none; margin: 0; padding: 0; gap: 4px; }
.nav-link {
  padding: 8px 12px;
  border-radius: var(--radius-md);
  color: var(--color-text-2);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.15s, background 0.15s;
  background: none; border: none; cursor: pointer;
}
.nav-link:hover { color: var(--color-text); background: var(--color-surface-2); }
.nav-link.active { color: var(--color-primary); background: var(--color-primary-light); }

/* Dropdown */
.nav-dropdown { position: relative; }
.dropdown-menu {
  display: none; position: absolute; top: calc(100% + 8px); left: 0;
  background: var(--color-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);
  min-width: 200px; list-style: none; padding: 8px; margin: 0;
  z-index: 200;
}
.nav-dropdown:hover .dropdown-menu,
.nav-dropdown .nav-more[aria-expanded="true"] + .dropdown-menu { display: block; }
.dropdown-menu a {
  display: block; padding: 8px 12px; color: var(--color-text-2);
  text-decoration: none; font-size: 14px; border-radius: var(--radius-md);
}
.dropdown-menu a:hover { background: var(--color-surface-2); color: var(--color-text); }

/* Lang switcher */
.lang-switcher { position: relative; }
.lang-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; background: var(--color-surface-2);
  border: 1px solid var(--color-border); border-radius: var(--radius-full);
  cursor: pointer; font-size: 14px; color: var(--color-text);
}
.lang-dropdown {
  display: none; position: absolute; right: 0; top: calc(100% + 8px);
  background: var(--color-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);
  list-style: none; padding: 8px; min-width: 150px;
}
.lang-dropdown li {
  padding: 8px 12px; cursor: pointer; border-radius: var(--radius-md);
  font-size: 14px; color: var(--color-text-2);
}
.lang-dropdown li:hover { background: var(--color-surface-2); color: var(--color-text); }

/* Hamburger */
.hamburger {
  display: flex; flex-direction: column; gap: 5px;
  padding: 8px; background: none; border: none; cursor: pointer;
}
.hamburger span { width: 22px; height: 2px; background: var(--color-text); border-radius: 2px; transition: all 0.2s; }
.hamburger[aria-expanded="true"] span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.hamburger[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
.hamburger[aria-expanded="true"] span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
@media (min-width: 1024px) { .hamburger { display: none; } }

/* Mobile menu */
.mobile-menu {
  display: none; position: fixed; inset: 64px 0 0 0;
  background: var(--color-surface); z-index: 99;
  overflow-y: auto; padding: 24px;
}
.mobile-menu[aria-hidden="false"] { display: block; }
.mobile-menu ul { list-style: none; padding: 0; margin: 0; }
.mobile-menu a { display: block; padding: 12px 0; font-size: 16px; color: var(--color-text); text-decoration: none; border-bottom: 1px solid var(--color-border); }
```

---

## Footer — Full Spec

### Structure
```html
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <a href="/" class="logo">
        <img src="/assets/img/logo.svg" alt="AnyConverter" width="28" height="28">
        <span>AnyConverter</span>
      </a>
      <p>Free online tools for developers and everyday users. No signup, no server uploads.</p>
    </div>

    <div class="footer-links">
      <div class="footer-col">
        <h3>PDF Tools</h3>
        <ul>
          <li><a href="/pdf-merge/">Merge PDF</a></li>
          <li><a href="/pdf-compress/">Compress PDF</a></li>
          <li><a href="/pdf-split/">Split PDF</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h3>Developer Tools</h3>
        <ul>
          <li><a href="/json-formatter/">JSON Formatter</a></li>
          <li><a href="/xml-formatter/">XML Formatter</a></li>
          <li><a href="/base64-encoder/">Base64 Encoder</a></li>
          <li><a href="/url-encoder/">URL Encoder</a></li>
          <li><a href="/regex-tester/">Regex Tester</a></li>
          <li><a href="/hash-generator/">Hash Generator</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h3>Data Tools</h3>
        <ul>
          <li><a href="/csv-to-sql/">CSV to SQL</a></li>
          <li><a href="/csv-query/">CSV Query</a></li>
          <li><a href="/timestamp-converter/">Timestamp Converter</a></li>
          <li><a href="/markdown-html/">Markdown to HTML</a></li>
          <li><a href="/color-converter/">Color Converter</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h3>Image Tools</h3>
        <ul>
          <li><a href="/image-converter/">Image Converter</a></li>
        </ul>
        <h3 style="margin-top:16px">Languages</h3>
        <ul>
          <li><a href="/">🇺🇸 English</a></li>
          <li><a href="/es/">🇪🇸 Español</a></li>
          <li><a href="/da/">🇩🇰 Dansk</a></li>
        </ul>
      </div>
    </div>
  </div>

  <div class="footer-bottom">
    <p>© 2026 AnyConverter. All rights reserved.</p>
    <p>Free online tools — no data uploaded to servers</p>
  </div>
</footer>
```

---

## Toast Notifications (shared.js)

```javascript
// Global toast function available to all tool JS files
window.showToast = function(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toast-container')
    || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Close">×</button>
  `;
  
  container.appendChild(toast);
  
  // Animate in
  requestAnimationFrame(() => toast.classList.add('toast--visible'));
  
  // Auto dismiss
  const timer = setTimeout(() => removeToast(toast), duration);
  
  toast.querySelector('.toast-close').addEventListener('click', () => {
    clearTimeout(timer);
    removeToast(toast);
  });
};

function removeToast(toast) {
  toast.classList.remove('toast--visible');
  toast.addEventListener('transitionend', () => toast.remove(), { once: true });
}

function createToastContainer() {
  const div = document.createElement('div');
  div.id = 'toast-container';
  document.body.appendChild(div);
  return div;
}
```

---

## Shared.js Responsibilities

```javascript
// 1. Render header into #site-header
// 2. Render footer into #site-footer
// 3. Mark active nav link based on current pathname
// 4. Header scroll shadow
// 5. Mobile menu open/close + focus trap
// 6. "More tools" dropdown keyboard navigation
// 7. Language switcher: detect current lang from URL, set active state,
//    navigate to equivalent page in selected language
// 8. Store/read language preference from localStorage
// 9. window.showToast() function
// 10. window.copyToClipboard() helper
// 11. Breadcrumb: read from page's data-breadcrumb attribute or meta
// 12. Scroll to top on page load (for SPA-like feel between pages)
```

---

## Accessibility Requirements

- All interactive elements: visible focus ring (outline: 2px solid var(--color-primary), offset 2px)
- Skip-to-content link: first element in body, visually hidden until focused
- ARIA labels on all icon-only buttons
- Keyboard navigation: Tab through all controls, Enter/Space activate buttons
- Dropdown menus: arrow keys navigate options, Escape closes
- File inputs: describe accepted types in visible label text
- Error messages: associated with inputs via aria-describedby
- Loading states: aria-live="polite" region for dynamic updates
- Color contrast: all text meets WCAG AA (4.5:1 minimum)
- Drag & drop: always provide a click/keyboard alternative
