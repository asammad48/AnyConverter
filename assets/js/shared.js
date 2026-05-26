/* AnyConverter — Shared JS: header, footer, nav, toast, language switcher */

(function () {
  'use strict';

  /* ===== HEADER HTML ===== */
  const headerHTML = `
<a href="#main-content" class="skip-link">Skip to content</a>
<div class="header-inner">
  <a href="/" class="logo" aria-label="AnyConverter Home">
    <img src="/assets/img/logo.svg" alt="" width="28" height="28" loading="eager">
    <span class="logo-text">AnyConverter</span>
  </a>
  <nav class="main-nav" aria-label="Main navigation">
    <ul>

      <!-- Developer Tools -->
      <li class="nav-dropdown">
        <button class="nav-link nav-more" aria-expanded="false" aria-haspopup="true">Developer ▾</button>
        <ul class="dropdown-menu" role="menu">
          <li><a href="/json-formatter/" role="menuitem">JSON Formatter</a></li>
          <li><a href="/xml-formatter/" role="menuitem">XML Formatter</a></li>
          <li><a href="/regex-tester/" role="menuitem">Regex Tester</a></li>
          <li><a href="/base64-encoder/" role="menuitem">Base64 Encoder</a></li>
          <li><a href="/url-encoder/" role="menuitem">URL Encoder</a></li>
          <li><a href="/hash-generator/" role="menuitem">Hash Generator</a></li>
          <li><a href="/jwt-decoder/" role="menuitem">JWT Decoder</a></li>
          <li><a href="/uuid-generator/" role="menuitem">UUID Generator</a></li>
          <li><a href="/password-generator/" role="menuitem">Password Generator</a></li>
          <li><a href="/ip-address-lookup/" role="menuitem">IP Address Lookup</a></li>
          <li><a href="/html-beautifier/" role="menuitem">HTML Beautifier</a></li>
          <li><a href="/json-to-yaml/" role="menuitem">JSON ↔ YAML</a></li>
          <li><a href="/cron-expression-parser/" role="menuitem">Cron Expression Parser</a></li>
          <li><a href="/css-gradient-generator/" role="menuitem">CSS Gradient Generator</a></li>
          <li><a href="/px-to-rem/" role="menuitem">PX to REM</a></li>
        </ul>
      </li>

      <!-- PDF Tools (wide 2-col) -->
      <li class="nav-dropdown">
        <button class="nav-link nav-more" aria-expanded="false" aria-haspopup="true">PDF Tools ▾</button>
        <ul class="dropdown-menu dropdown-menu--wide" role="menu">
          <li><a href="/pdf-merge/" role="menuitem">Merge PDF</a></li>
          <li><a href="/pdf-split/" role="menuitem">Split PDF</a></li>
          <li><a href="/pdf-compress/" role="menuitem">Compress PDF</a></li>
          <li><a href="/rotate-pdf/" role="menuitem">Rotate PDF</a></li>
          <li><a href="/organize-pdf/" role="menuitem">Organize PDF</a></li>
          <li><a href="/remove-pdf-pages/" role="menuitem">Remove Pages</a></li>
          <li><a href="/extract-pdf-pages/" role="menuitem">Extract Pages</a></li>
          <li><a href="/crop-pdf/" role="menuitem">Crop PDF</a></li>
          <li><a href="/add-page-numbers/" role="menuitem">Add Page Numbers</a></li>
          <li><a href="/add-watermark/" role="menuitem">Add Watermark</a></li>
          <li><a href="/protect-pdf/" role="menuitem">Protect PDF</a></li>
          <li><a href="/unlock-pdf/" role="menuitem">Unlock PDF</a></li>
          <li><a href="/jpg-to-pdf/" role="menuitem">JPG to PDF</a></li>
          <li><a href="/pdf-to-jpg/" role="menuitem">PDF to JPG</a></li>
          <li><a href="/ocr-pdf/" role="menuitem">OCR PDF</a></li>
          <li><a href="/html-to-pdf/" role="menuitem">HTML to PDF</a></li>
          <li><a href="/scan-to-pdf/" role="menuitem">Scan to PDF</a></li>
          <li><a href="/sign-pdf/" role="menuitem">Sign PDF</a></li>
          <li><a href="/edit-pdf/" role="menuitem">Edit PDF</a></li>
          <li><a href="/redact-pdf/" role="menuitem">Redact PDF</a></li>
          <li><a href="/optimize-pdf/" role="menuitem">Optimize PDF</a></li>
          <li><a href="/pdf-forms/" role="menuitem">Fill PDF Forms</a></li>
          <li><a href="/pdf-security/" role="menuitem">PDF Security</a></li>
          <li><a href="/compare-pdf/" role="menuitem">Compare PDF</a></li>
        </ul>
      </li>

      <!-- Text & Writing -->
      <li class="nav-dropdown">
        <button class="nav-link nav-more" aria-expanded="false" aria-haspopup="true">Text ▾</button>
        <ul class="dropdown-menu" role="menu">
          <li><a href="/word-counter/" role="menuitem">Word Counter</a></li>
          <li><a href="/character-counter/" role="menuitem">Character Counter</a></li>
          <li><a href="/text-case-converter/" role="menuitem">Text Case Converter</a></li>
          <li><a href="/text-diff-checker/" role="menuitem">Text Diff Checker</a></li>
          <li><a href="/lorem-ipsum-generator/" role="menuitem">Lorem Ipsum Generator</a></li>
          <li><a href="/fancy-text-generator/" role="menuitem">Fancy Text Generator</a></li>
          <li><a href="/ascii-art-generator/" role="menuitem">ASCII Art Generator</a></li>
          <li><a href="/morse-code-converter/" role="menuitem">Morse Code Converter</a></li>
          <li><a href="/text-repeater/" role="menuitem">Text Repeater</a></li>
          <li><a href="/number-to-words/" role="menuitem">Number to Words</a></li>
          <li><a href="/roman-numeral-converter/" role="menuitem">Roman Numeral</a></li>
          <li><a href="/markdown-html/" role="menuitem">Markdown to HTML</a></li>
          <li><a href="/csv-to-sql/" role="menuitem">CSV to SQL</a></li>
          <li><a href="/image-converter/" role="menuitem">Image Converter</a></li>
          <li><a href="/image-compressor/" role="menuitem">Image Compressor</a></li>
          <li><a href="/qr-code-generator/" role="menuitem">QR Code Generator</a></li>
        </ul>
      </li>

      <!-- Productivity & Utility -->
      <li class="nav-dropdown">
        <button class="nav-link nav-more" aria-expanded="false" aria-haspopup="true">Productivity ▾</button>
        <ul class="dropdown-menu" role="menu">
          <li><a href="/stopwatch/" role="menuitem">Stopwatch</a></li>
          <li><a href="/countdown-timer/" role="menuitem">Countdown Timer</a></li>
          <li><a href="/todo-list/" role="menuitem">To-do List</a></li>
          <li><a href="/sticky-notes/" role="menuitem">Sticky Notes</a></li>
          <li><a href="/habit-tracker/" role="menuitem">Habit Tracker</a></li>
          <li><a href="/daily-planner/" role="menuitem">Daily Planner</a></li>
          <li><a href="/meeting-timer/" role="menuitem">Meeting Timer</a></li>
          <li><a href="/spin-the-wheel/" role="menuitem">Spin the Wheel</a></li>
          <li><a href="/coin-flip/" role="menuitem">Coin Flip</a></li>
          <li><a href="/dice-roller/" role="menuitem">Dice Roller</a></li>
          <li><a href="/random-picker/" role="menuitem">Random Picker</a></li>
          <li><a href="/decision-maker/" role="menuitem">Decision Maker</a></li>
          <li><a href="/team-picker/" role="menuitem">Team Picker</a></li>
        </ul>
      </li>

      <!-- General & Finance -->
      <li class="nav-dropdown">
        <button class="nav-link nav-more" aria-expanded="false" aria-haspopup="true">Calculators ▾</button>
        <ul class="dropdown-menu dropdown-menu--wide" role="menu">
          <li><a href="/age-calculator/" role="menuitem">Age Calculator</a></li>
          <li><a href="/bmi-calculator/" role="menuitem">BMI Calculator</a></li>
          <li><a href="/calorie-calculator/" role="menuitem">Calorie Calculator</a></li>
          <li><a href="/sleep-calculator/" role="menuitem">Sleep Calculator</a></li>
          <li><a href="/typing-speed-test/" role="menuitem">Typing Speed Test</a></li>
          <li><a href="/pomodoro-timer/" role="menuitem">Pomodoro Timer</a></li>
          <li><a href="/invoice-generator/" role="menuitem">Invoice Generator</a></li>
          <li><a href="/world-clock/" role="menuitem">World Clock</a></li>
          <li><a href="/currency-converter/" role="menuitem">Currency Converter</a></li>
          <li><a href="/compound-interest-calculator/" role="menuitem">Compound Interest</a></li>
          <li><a href="/loan-calculator/" role="menuitem">Loan Calculator</a></li>
          <li><a href="/mortgage-calculator/" role="menuitem">Mortgage Calculator</a></li>
          <li><a href="/discount-calculator/" role="menuitem">Discount Calculator</a></li>
          <li><a href="/percentage-calculator/" role="menuitem">Percentage Calculator</a></li>
          <li><a href="/gst-vat-calculator/" role="menuitem">GST / VAT Calculator</a></li>
          <li><a href="/tip-calculator/" role="menuitem">Tip Calculator</a></li>
        </ul>
      </li>

      <!-- Browser Tools -->
      <li class="nav-dropdown">
        <button class="nav-link nav-more" aria-expanded="false" aria-haspopup="true">Browser ▾</button>
        <ul class="dropdown-menu" role="menu">
          <li><a href="/internet-speed-test/" role="menuitem">Internet Speed Test</a></li>
          <li><a href="/keyboard-tester/" role="menuitem">Keyboard Tester</a></li>
          <li><a href="/mouse-tester/" role="menuitem">Mouse Tester</a></li>
          <li><a href="/webcam-tester/" role="menuitem">Webcam Tester</a></li>
          <li><a href="/microphone-tester/" role="menuitem">Microphone Tester</a></li>
          <li><a href="/dead-pixel-checker/" role="menuitem">Dead Pixel Checker</a></li>
          <li><a href="/monitor-color-test/" role="menuitem">Monitor Color Test</a></li>
          <li><a href="/browser-info/" role="menuitem">Browser Info Viewer</a></li>
          <li><a href="/viewport-size/" role="menuitem">Viewport Size Checker</a></li>
        </ul>
      </li>

    </ul>
  </nav>
  <div class="header-controls">
    <button class="search-btn" id="search-btn" aria-label="Search tools" title="Search tools (Ctrl+K)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7"/>
        <line x1="17.5" y1="17.5" x2="22" y2="22"/>
      </svg>
      <span class="search-btn-label">Search tools…</span>
      <kbd class="search-btn-kbd">Ctrl K</kbd>
    </button>
    <div class="lang-switcher" id="lang-switcher">
      <button class="lang-btn" aria-expanded="false" aria-haspopup="listbox" aria-label="Select language">
        <span id="lang-flag">🇺🇸</span>
        <span id="lang-code">EN</span>
        <span aria-hidden="true">▾</span>
      </button>
      <ul class="lang-dropdown" role="listbox" aria-label="Language options">
        <li role="option" data-lang="en" data-flag="🇺🇸" data-path="">🇺🇸 English</li>
        <li role="option" data-lang="es" data-flag="🇪🇸" data-path="es">🇪🇸 Español</li>
        <li role="option" data-lang="da" data-flag="🇩🇰" data-path="da">🇩🇰 Dansk</li>
      </ul>
    </div>
    <button class="theme-toggle" id="theme-toggle-btn" aria-label="Toggle dark mode" title="Toggle dark mode">🌙</button>
    <button class="hamburger" id="mobile-menu-btn"
            aria-expanded="false" aria-label="Open menu" aria-controls="mobile-menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</div>
<div class="mobile-menu" id="mobile-menu" aria-hidden="true">
  <nav aria-label="Mobile navigation">
    <ul>
      <li><a href="/">🏠 All Tools</a></li>
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#9898C0;pointer-events:none">Developer</li>
      <li><a href="/json-formatter/">JSON Formatter</a></li>
      <li><a href="/xml-formatter/">XML Formatter</a></li>
      <li><a href="/regex-tester/">Regex Tester</a></li>
      <li><a href="/hash-generator/">Hash Generator</a></li>
      <li><a href="/base64-encoder/">Base64 Encoder</a></li>
      <li><a href="/url-encoder/">URL Encoder</a></li>
      <li><a href="/jwt-decoder/">JWT Decoder</a></li>
      <li><a href="/uuid-generator/">UUID Generator</a></li>
      <li><a href="/password-generator/">Password Generator</a></li>
      <li><a href="/password-strength-checker/">Password Strength</a></li>
      <li><a href="/ip-address-lookup/">IP Address Lookup</a></li>
      <li><a href="/screen-resolution/">Screen Resolution</a></li>
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#9898C0;pointer-events:none">Text &amp; Writing</li>
      <li><a href="/word-counter/">Word Counter</a></li>
      <li><a href="/character-counter/">Character Counter</a></li>
      <li><a href="/text-case-converter/">Text Case Converter</a></li>
      <li><a href="/text-diff-checker/">Text Diff Checker</a></li>
      <li><a href="/lorem-ipsum-generator/">Lorem Ipsum Generator</a></li>
      <li><a href="/fancy-text-generator/">Fancy Text Generator</a></li>
      <li><a href="/ascii-art-generator/">ASCII Art Generator</a></li>
      <li><a href="/morse-code-converter/">Morse Code Converter</a></li>
      <li><a href="/text-repeater/">Text Repeater</a></li>
      <li><a href="/number-to-words/">Number to Words</a></li>
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#9898C0;pointer-events:none">Data &amp; Conversion</li>
      <li><a href="/csv-to-sql/">CSV to SQL</a></li>
      <li><a href="/csv-query/">CSV Query</a></li>
      <li><a href="/timestamp-converter/">Timestamp Converter</a></li>
      <li><a href="/markdown-html/">Markdown to HTML</a></li>
      <li><a href="/color-converter/">Color Converter</a></li>
      <li><a href="/json-to-yaml/">JSON ↔ YAML</a></li>
      <li><a href="/html-beautifier/">HTML Beautifier</a></li>
      <li><a href="/cron-expression-parser/">Cron Expression Parser</a></li>
      <li><a href="/roman-numeral-converter/">Roman Numeral</a></li>
      <li><a href="/image-converter/">Image Converter</a></li>
      <li><a href="/image-compressor/">Image Compressor</a></li>
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#9898C0;pointer-events:none">PDF Tools</li>
      <li><a href="/pdf-merge/">PDF Merge</a></li>
      <li><a href="/pdf-split/">PDF Split</a></li>
      <li><a href="/pdf-compress/">PDF Compress</a></li>
      <li><a href="/organize-pdf/">Organize PDF</a></li>
      <li><a href="/remove-pdf-pages/">Remove Pages</a></li>
      <li><a href="/extract-pdf-pages/">Extract Pages</a></li>
      <li><a href="/rotate-pdf/">Rotate PDF</a></li>
      <li><a href="/crop-pdf/">Crop PDF</a></li>
      <li><a href="/add-page-numbers/">Add Page Numbers</a></li>
      <li><a href="/add-watermark/">Add Watermark</a></li>
      <li><a href="/protect-pdf/">Protect PDF</a></li>
      <li><a href="/unlock-pdf/">Unlock PDF</a></li>
      <li><a href="/pdf-security/">PDF Security</a></li>
      <li><a href="/optimize-pdf/">Optimize PDF</a></li>
      <li><a href="/jpg-to-pdf/">JPG to PDF</a></li>
      <li><a href="/pdf-to-jpg/">PDF to JPG</a></li>
      <li><a href="/scan-to-pdf/">Scan to PDF</a></li>
      <li><a href="/ocr-pdf/">OCR PDF</a></li>
      <li><a href="/html-to-pdf/">HTML to PDF</a></li>
      <li><a href="/pdf-forms/">Fill PDF Forms</a></li>
      <li><a href="/sign-pdf/">Sign PDF</a></li>
      <li><a href="/edit-pdf/">Edit PDF</a></li>
      <li><a href="/redact-pdf/">Redact PDF</a></li>
      <li><a href="/compare-pdf/">Compare PDF</a></li>
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#9898C0;pointer-events:none">Productivity &amp; Utility</li>
      <li><a href="/stopwatch/">Stopwatch</a></li>
      <li><a href="/countdown-timer/">Countdown Timer</a></li>
      <li><a href="/todo-list/">To-do List</a></li>
      <li><a href="/sticky-notes/">Sticky Notes</a></li>
      <li><a href="/habit-tracker/">Habit Tracker</a></li>
      <li><a href="/daily-planner/">Daily Planner</a></li>
      <li><a href="/meeting-timer/">Meeting Timer</a></li>
      <li><a href="/spin-the-wheel/">Spin the Wheel</a></li>
      <li><a href="/coin-flip/">Coin Flip</a></li>
      <li><a href="/dice-roller/">Dice Roller</a></li>
      <li><a href="/random-picker/">Random Picker</a></li>
      <li><a href="/decision-maker/">Decision Maker</a></li>
      <li><a href="/team-picker/">Team Picker</a></li>
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#9898C0;pointer-events:none">General Public</li>
      <li><a href="/age-calculator/">Age Calculator</a></li>
      <li><a href="/bmi-calculator/">BMI Calculator</a></li>
      <li><a href="/calorie-calculator/">Calorie Calculator</a></li>
      <li><a href="/qr-code-generator/">QR Code Generator</a></li>
      <li><a href="/typing-speed-test/">Typing Speed Test</a></li>
      <li><a href="/pomodoro-timer/">Pomodoro Timer</a></li>
      <li><a href="/invoice-generator/">Invoice Generator</a></li>
      <li><a href="/world-clock/">World Clock</a></li>
      <li><a href="/sleep-calculator/">Sleep Calculator</a></li>
      <li><a href="/blood-type-compatibility/">Blood Type Compatibility</a></li>
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#9898C0;pointer-events:none">Finance</li>
      <li><a href="/currency-converter/">Currency Converter</a></li>
      <li><a href="/compound-interest-calculator/">Compound Interest</a></li>
      <li><a href="/loan-calculator/">Loan Calculator</a></li>
      <li><a href="/mortgage-calculator/">Mortgage Calculator</a></li>
      <li><a href="/discount-calculator/">Discount Calculator</a></li>
      <li><a href="/percentage-calculator/">Percentage Calculator</a></li>
      <li><a href="/gst-vat-calculator/">GST / VAT Calculator</a></li>
      <li><a href="/tip-calculator/">Tip Calculator</a></li>
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#9898C0;pointer-events:none">CSS &amp; Design</li>
      <li><a href="/css-gradient-generator/">CSS Gradient Generator</a></li>
      <li><a href="/css-shadow-generator/">CSS Shadow Generator</a></li>
      <li><a href="/px-to-rem/">PX to REM</a></li>
      <li><a href="/aspect-ratio-calculator/">Aspect Ratio Calculator</a></li>
      <li><a href="/privacy-policy-generator/">Privacy Policy Generator</a></li>
      <li><a href="/random-number-generator/">Random Number Generator</a></li>
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#9898C0;pointer-events:none">Browser Tools</li>
      <li><a href="/internet-speed-test/">Internet Speed Test</a></li>
      <li><a href="/keyboard-tester/">Keyboard Tester</a></li>
      <li><a href="/mouse-tester/">Mouse Tester</a></li>
      <li><a href="/webcam-tester/">Webcam Tester</a></li>
      <li><a href="/microphone-tester/">Microphone Tester</a></li>
      <li><a href="/dead-pixel-checker/">Dead Pixel Checker</a></li>
      <li><a href="/monitor-color-test/">Monitor Color Test</a></li>
      <li><a href="/browser-info/">Browser Info Viewer</a></li>
      <li><a href="/viewport-size/">Viewport Size Checker</a></li>
    </ul>
    <div class="mobile-lang" id="mobile-lang">
      <a href="#" data-lang-link="en">🇺🇸 English</a>
      <a href="#" data-lang-link="es">🇪🇸 Español</a>
      <a href="#" data-lang-link="da">🇩🇰 Dansk</a>
    </div>
  </nav>
</div>
<div id="search-modal" class="search-modal" role="dialog" aria-modal="true" aria-label="Search tools" aria-hidden="true">
  <div class="search-modal-backdrop" id="search-backdrop"></div>
  <div class="search-modal-box">
    <div class="search-modal-input-wrap">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="search-modal-icon" aria-hidden="true">
        <circle cx="11" cy="11" r="7"/>
        <line x1="17.5" y1="17.5" x2="22" y2="22"/>
      </svg>
      <input type="search" id="search-input" class="search-modal-input" placeholder="Search 80+ tools…" autocomplete="off" spellcheck="false" aria-label="Search tools" aria-controls="search-results" aria-autocomplete="list">
      <kbd class="search-modal-esc-hint">ESC</kbd>
    </div>
    <ul class="search-results" id="search-results" role="listbox" aria-label="Search results"></ul>
    <p class="search-empty" id="search-empty"></p>
    <div class="search-footer">
      <span><kbd>↑↓</kbd> Navigate</span>
      <span><kbd>↵</kbd> Open</span>
      <span><kbd>Esc</kbd> Close</span>
    </div>
  </div>
</div>`;

  /* ===== FOOTER HTML ===== */
  const footerHTML = `
<div class="footer-inner">
  <div class="footer-brand">
    <a href="/" class="logo">
      <img src="/assets/img/logo.svg" alt="AnyConverter" width="28" height="28" loading="lazy">
      <span>AnyConverter</span>
    </a>
    <p>Free online tools for developers, students, and everyone. No signup. No data uploaded to servers.</p>
    <div class="footer-social">
      <a href="/es/" class="footer-lang-badge" aria-label="Español">🇪🇸 ES</a>
      <a href="/da/" class="footer-lang-badge" aria-label="Dansk">🇩🇰 DA</a>
    </div>
  </div>
  <div class="footer-links">

    <!-- PRODUCT -->
    <div class="footer-col">
      <h3>Product</h3>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/#tools">All Tools</a></li>
        <li><a href="/pdf-merge/">PDF Tools</a></li>
        <li><a href="/json-formatter/">Developer Tools</a></li>
        <li><a href="/internet-speed-test/">Browser Tools</a></li>
        <li><a href="/age-calculator/">Calculators</a></li>
        <li><a href="/word-counter/">Text Tools</a></li>
        <li><a href="/stopwatch/">Productivity</a></li>
      </ul>
    </div>

    <!-- FEATURES -->
    <div class="footer-col">
      <h3>Features</h3>
      <ul>
        <li><a href="/image-converter/">Image Converter</a></li>
        <li><a href="/qr-code-generator/">QR Code Generator</a></li>
        <li><a href="/css-gradient-generator/">CSS Generator</a></li>
        <li><a href="/currency-converter/">Currency Converter</a></li>
        <li><a href="/password-generator/">Password Generator</a></li>
        <li><a href="/invoice-generator/">Invoice Generator</a></li>
        <li><a href="/pomodoro-timer/">Pomodoro Timer</a></li>
        <li><a href="/typing-speed-test/">Typing Speed Test</a></li>
      </ul>
    </div>

    <!-- LEGAL -->
    <div class="footer-col">
      <h3>Legal</h3>
      <ul>
        <li><a href="/privacy/">Privacy Policy</a></li>
        <li><a href="/terms/">Terms of Service</a></li>
        <li><a href="/cookies/">Cookie Policy</a></li>
        <li><a href="/security/">Security</a></li>
      </ul>
    </div>

    <!-- COMPANY -->
    <div class="footer-col">
      <h3>Company</h3>
      <ul>
        <li><a href="/about/">About Us</a></li>
        <li><a href="/contact/">Contact Us</a></li>
        <li><a href="/blog/">Blog</a></li>
        <li><a href="/press/">Press</a></li>
        <li><a href="/faq/">FAQ</a></li>
      </ul>
    </div>

  </div>
</div>
<div class="footer-bottom">
  <p>© 2026 AnyConverter. All rights reserved.</p>
  <p>Free online tools — no data uploaded to servers</p>
</div>`;

  /* ===== SEARCH DATA ===== */
  var TOOLS = [
    // Developer Tools
    {n:'JSON Formatter',          u:'/json-formatter/',              d:'Format, validate and beautify JSON',                i:'/assets/img/icon-json.svg',              c:'Developer',    k:'pretty print validate parse indent'},
    {n:'XML Formatter',           u:'/xml-formatter/',               d:'Format and validate XML documents',                 i:'/assets/img/icon-xml.svg',               c:'Developer',    k:'pretty print validate markup parse'},
    {n:'Regex Tester',            u:'/regex-tester/',                d:'Test and debug regular expressions live',           i:'/assets/img/icon-regex.svg',             c:'Developer',    k:'regexp pattern match test debug'},
    {n:'Base64 Encoder',          u:'/base64-encoder/',              d:'Encode and decode Base64 strings',                  i:'/assets/img/icon-base64.svg',            c:'Developer',    k:'encode decode binary string convert'},
    {n:'URL Encoder',             u:'/url-encoder/',                 d:'Encode and decode URLs and URI components',         i:'/assets/img/icon-url.svg',               c:'Developer',    k:'encode decode percent encoding uri'},
    {n:'Hash Generator',          u:'/hash-generator/',              d:'Generate MD5, SHA-256 and other hashes',            i:'/assets/img/icon-hash.svg',              c:'Developer',    k:'md5 sha1 sha256 sha512 checksum digest'},
    {n:'JWT Decoder',             u:'/jwt-decoder/',                 d:'Decode and inspect JWT tokens',                     i:'/assets/img/icon-jwt.svg',               c:'Developer',    k:'token auth bearer decode header payload'},
    {n:'UUID Generator',          u:'/uuid-generator/',              d:'Generate cryptographically secure UUIDs',           i:'/assets/img/icon-uuid.svg',              c:'Developer',    k:'guid unique id v4 random generate'},
    {n:'Password Generator',      u:'/password-generator/',          d:'Generate strong, secure passwords',                 i:'/assets/img/icon-lock.svg',              c:'Developer',    k:'secure random password strong create'},
    {n:'Password Strength Checker',u:'/password-strength-checker/',  d:'Check how strong your password is',                 i:'/assets/img/icon-password-strength.svg', c:'Developer',    k:'strength check weak strong security'},
    {n:'IP Address Lookup',       u:'/ip-address-lookup/',           d:'Look up geolocation for any IP address',            i:'/assets/img/icon-ip-lookup.svg',         c:'Developer',    k:'ip geolocation isp country location'},
    {n:'HTML Beautifier',         u:'/html-beautifier/',             d:'Beautify or minify HTML code',                      i:'/assets/img/icon-html-beautifier.svg',   c:'Developer',    k:'format minify pretty print indent clean'},
    {n:'JSON to YAML Converter',  u:'/json-to-yaml/',                d:'Convert between JSON and YAML formats',             i:'/assets/img/icon-json-yaml.svg',         c:'Developer',    k:'convert json yaml config transform'},
    {n:'Cron Expression Parser',  u:'/cron-expression-parser/',      d:'Decode cron expressions to plain English',          i:'/assets/img/icon-timer.svg',             c:'Developer',    k:'cron schedule job timer recurring'},
    {n:'CSS Gradient Generator',  u:'/css-gradient-generator/',      d:'Design linear and radial CSS gradients visually',   i:'/assets/img/icon-css-gradient.svg',      c:'Developer',    k:'css background gradient linear radial color design'},
    {n:'CSS Shadow Generator',    u:'/css-shadow-generator/',        d:'Generate CSS box-shadow and text-shadow',           i:'/assets/img/icon-css-gradient.svg',      c:'Developer',    k:'css shadow box text design generator'},
    {n:'PX to REM',               u:'/px-to-rem/',                   d:'Convert pixel values to REM units',                 i:'/assets/img/icon-screen.svg',            c:'Developer',    k:'px rem units css convert font size'},
    {n:'Aspect Ratio Calculator', u:'/aspect-ratio-calculator/',     d:'Calculate and convert aspect ratios',               i:'/assets/img/icon-calculator.svg',        c:'Developer',    k:'aspect ratio 16:9 4:3 calculate convert dimensions'},
    // PDF Tools
    {n:'Merge PDF',               u:'/pdf-merge/',                   d:'Combine multiple PDF files into one',               i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'combine join merge multiple files'},
    {n:'Split PDF',               u:'/pdf-split/',                   d:'Split a PDF into multiple separate files',          i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'divide separate extract pages split'},
    {n:'Compress PDF',            u:'/pdf-compress/',                d:'Reduce PDF file size without quality loss',         i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'compress reduce size optimize smaller'},
    {n:'Rotate PDF',              u:'/rotate-pdf/',                  d:'Rotate PDF pages to any orientation',               i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'rotate turn flip pages landscape portrait'},
    {n:'Organize PDF',            u:'/organize-pdf/',                d:'Reorder pages in a PDF document',                   i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'reorder rearrange sort pages organize'},
    {n:'Remove PDF Pages',        u:'/remove-pdf-pages/',            d:'Delete unwanted pages from a PDF',                  i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'remove delete unwanted pages'},
    {n:'Extract PDF Pages',       u:'/extract-pdf-pages/',           d:'Extract specific pages from a PDF',                 i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'extract pull save specific pages'},
    {n:'Crop PDF',                u:'/crop-pdf/',                    d:'Crop the margins of PDF pages',                     i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'crop trim margins whitespace resize'},
    {n:'Add Page Numbers',        u:'/add-page-numbers/',            d:'Stamp page numbers on your PDF',                    i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'page numbers stamp header footer'},
    {n:'Add Watermark',           u:'/add-watermark/',               d:'Add a text or image watermark to PDF',              i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'watermark stamp text logo overlay brand'},
    {n:'Protect PDF',             u:'/protect-pdf/',                 d:'Password protect a PDF document',                   i:'/assets/img/icon-lock.svg',              c:'PDF',          k:'password protect secure encrypt lock'},
    {n:'Unlock PDF',              u:'/unlock-pdf/',                  d:'Remove password from a PDF file',                   i:'/assets/img/icon-lock.svg',              c:'PDF',          k:'unlock remove password decrypt open'},
    {n:'JPG to PDF',              u:'/jpg-to-pdf/',                  d:'Convert JPG images to a PDF document',              i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'convert image jpg jpeg png to pdf'},
    {n:'PDF to JPG',              u:'/pdf-to-jpg/',                  d:'Convert PDF pages to JPG images',                   i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'convert pdf to image jpg jpeg png export'},
    {n:'OCR PDF',                 u:'/ocr-pdf/',                     d:'Extract text from scanned PDF files',               i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'ocr text extract scanned recognize optical'},
    {n:'HTML to PDF',             u:'/html-to-pdf/',                 d:'Convert HTML web pages to PDF',                     i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'convert html webpage to pdf render'},
    {n:'Scan to PDF',             u:'/scan-to-pdf/',                 d:'Convert scanned documents to PDF',                  i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'scan document convert digitize image'},
    {n:'Sign PDF',                u:'/sign-pdf/',                    d:'Add a digital signature to a PDF',                  i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'sign signature digital electronic'},
    {n:'Edit PDF',                u:'/edit-pdf/',                    d:'Edit text and images in a PDF',                     i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'edit modify change text images annotate'},
    {n:'Redact PDF',              u:'/redact-pdf/',                  d:'Permanently remove sensitive content from PDF',     i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'redact remove hide sensitive privacy blackout'},
    {n:'Compare PDF',             u:'/compare-pdf/',                 d:'View two PDF files side by side',                   i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'compare diff differences side by side'},
    {n:'Fill PDF Forms',          u:'/pdf-forms/',                   d:'Fill in PDF form fields online',                    i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'fill form fields online interactive'},
    {n:'PDF Security',            u:'/pdf-security/',                d:'Apply security and permissions to PDF',             i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'security permissions rights encrypt protect'},
    {n:'Optimize PDF',            u:'/optimize-pdf/',                d:'Optimize PDF for web or print',                     i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'optimize web print quality compress'},
    // Text & Writing
    {n:'Word Counter',            u:'/word-counter/',                d:'Count words, characters and sentences',             i:'/assets/img/icon-text.svg',              c:'Text',         k:'words count characters sentences paragraphs'},
    {n:'Character Counter',       u:'/character-counter/',           d:'Count characters with and without spaces',          i:'/assets/img/icon-text.svg',              c:'Text',         k:'characters count length limit twitter sms'},
    {n:'Text Case Converter',     u:'/text-case-converter/',         d:'Convert text to uppercase, lowercase and more',     i:'/assets/img/icon-text.svg',              c:'Text',         k:'uppercase lowercase title camel snake case convert'},
    {n:'Text Diff Checker',       u:'/text-diff-checker/',           d:'Find differences between two blocks of text',       i:'/assets/img/icon-text.svg',              c:'Text',         k:'diff compare difference changes text'},
    {n:'Lorem Ipsum Generator',   u:'/lorem-ipsum-generator/',       d:'Generate placeholder lorem ipsum text',             i:'/assets/img/icon-text.svg',              c:'Text',         k:'lorem ipsum placeholder dummy filler generate'},
    {n:'Fancy Text Generator',    u:'/fancy-text-generator/',        d:'Generate stylish unicode text styles',              i:'/assets/img/icon-text.svg',              c:'Text',         k:'fancy unicode bold italic stylish fonts symbols'},
    {n:'ASCII Art Generator',     u:'/ascii-art-generator/',         d:'Convert text to ASCII art banners',                 i:'/assets/img/icon-text.svg',              c:'Text',         k:'ascii art text banner figlet convert'},
    {n:'Morse Code Converter',    u:'/morse-code-converter/',        d:'Encode and decode Morse code',                      i:'/assets/img/icon-text.svg',              c:'Text',         k:'morse code dots dashes telegraph encode decode'},
    {n:'Text Repeater',           u:'/text-repeater/',               d:'Repeat text any number of times',                   i:'/assets/img/icon-text.svg',              c:'Text',         k:'repeat duplicate multiply text times'},
    {n:'Number to Words',         u:'/number-to-words/',             d:'Convert numbers to English words',                  i:'/assets/img/icon-number-words.svg',      c:'Text',         k:'number words spell out convert english hundred thousand'},
    {n:'Roman Numeral Converter', u:'/roman-numeral-converter/',     d:'Convert between Arabic and Roman numerals',         i:'/assets/img/icon-roman.svg',             c:'Text',         k:'roman numeral convert arabic xiv iv mcm'},
    {n:'Markdown to HTML',        u:'/markdown-html/',               d:'Convert Markdown to HTML instantly',                i:'/assets/img/icon-markdown.svg',          c:'Text',         k:'markdown html convert preview render md'},
    {n:'CSV to SQL',              u:'/csv-to-sql/',                  d:'Convert CSV data to SQL INSERT statements',         i:'/assets/img/icon-csv.svg',               c:'Data',         k:'csv sql insert convert table database'},
    {n:'CSV Query',               u:'/csv-query/',                   d:'Run SQL queries on CSV files in your browser',      i:'/assets/img/icon-csv-query.svg',         c:'Data',         k:'csv sql query filter select database'},
    {n:'Image Converter',         u:'/image-converter/',             d:'Convert images between different formats',          i:'/assets/img/icon-text.svg',              c:'Media',        k:'image convert jpg png webp gif bmp format'},
    {n:'Image Compressor',        u:'/image-compressor/',            d:'Compress images without quality loss',              i:'/assets/img/icon-text.svg',              c:'Media',        k:'image compress reduce size optimize jpg png'},
    {n:'QR Code Generator',       u:'/qr-code-generator/',           d:'Generate QR codes for any URL or text',             i:'/assets/img/icon-text.svg',              c:'Tools',        k:'qr code generate scan url link barcode'},
    // Data & Conversion
    {n:'Timestamp Converter',     u:'/timestamp-converter/',         d:'Convert Unix timestamps to readable dates',         i:'/assets/img/icon-clock.svg',             c:'Data',         k:'timestamp unix epoch date time convert'},
    {n:'Color Converter',         u:'/color-converter/',             d:'Convert colors between HEX, RGB and HSL',           i:'/assets/img/icon-color.svg',             c:'Data',         k:'color hex rgb hsl hsv convert picker'},
    {n:'Screen Resolution',       u:'/screen-resolution/',           d:'Check your screen resolution and DPI',              i:'/assets/img/icon-screen.svg',            c:'Browser',      k:'screen resolution dpi monitor size display'},
    // Productivity
    {n:'Stopwatch',               u:'/stopwatch/',                   d:'Online stopwatch with lap tracking',                i:'/assets/img/icon-timer.svg',             c:'Productivity', k:'stopwatch timer lap split time measure'},
    {n:'Countdown Timer',         u:'/countdown-timer/',             d:'Set a countdown timer online',                      i:'/assets/img/icon-timer.svg',             c:'Productivity', k:'countdown timer alarm clock set alert'},
    {n:'To-do List',              u:'/todo-list/',                   d:'Create and manage your to-do list',                 i:'/assets/img/icon-text.svg',              c:'Productivity', k:'todo task list manage organize checkbox'},
    {n:'Sticky Notes',            u:'/sticky-notes/',                d:'Create colorful sticky notes online',               i:'/assets/img/icon-text.svg',              c:'Productivity', k:'sticky notes memo colorful reminder post-it'},
    {n:'Habit Tracker',           u:'/habit-tracker/',               d:'Track your daily habits and streaks',               i:'/assets/img/icon-text.svg',              c:'Productivity', k:'habit track daily streak routine calendar'},
    {n:'Daily Planner',           u:'/daily-planner/',               d:'Plan your day with a digital planner',              i:'/assets/img/icon-text.svg',              c:'Productivity', k:'planner daily schedule organize day agenda'},
    {n:'Meeting Timer',           u:'/meeting-timer/',               d:'Track time for each meeting participant',           i:'/assets/img/icon-timer.svg',             c:'Productivity', k:'meeting time track participants agenda speaker'},
    {n:'Pomodoro Timer',          u:'/pomodoro-timer/',              d:'Focus timer using the Pomodoro technique',          i:'/assets/img/icon-timer.svg',             c:'Productivity', k:'pomodoro focus work break technique 25 minutes'},
    {n:'World Clock',             u:'/world-clock/',                 d:'View current time in multiple time zones',          i:'/assets/img/icon-clock.svg',             c:'Productivity', k:'world clock time zones cities international'},
    {n:'Spin the Wheel',          u:'/spin-the-wheel/',              d:'Spin a wheel to pick a random option',              i:'/assets/img/icon-text.svg',              c:'Fun',          k:'spin wheel random picker decide choice fortune'},
    {n:'Coin Flip',               u:'/coin-flip/',                   d:'Flip a virtual coin online',                        i:'/assets/img/icon-text.svg',              c:'Fun',          k:'coin flip heads tails random decide'},
    {n:'Dice Roller',             u:'/dice-roller/',                 d:'Roll virtual dice online',                          i:'/assets/img/icon-text.svg',              c:'Fun',          k:'dice roll d6 d20 random number tabletop rpg'},
    {n:'Random Picker',           u:'/random-picker/',               d:'Pick a random item from a list',                    i:'/assets/img/icon-text.svg',              c:'Fun',          k:'random pick list choose item select winner'},
    {n:'Decision Maker',          u:'/decision-maker/',              d:'Let the randomizer make your decision',             i:'/assets/img/icon-text.svg',              c:'Fun',          k:'decision choose random decide option yes no'},
    {n:'Team Picker',             u:'/team-picker/',                 d:'Randomly split people into teams',                  i:'/assets/img/icon-text.svg',              c:'Fun',          k:'team random split divide people groups'},
    // Calculators & Finance
    {n:'Age Calculator',          u:'/age-calculator/',              d:'Calculate your exact age in years, months, days',   i:'/assets/img/icon-calculator.svg',        c:'Calculator',   k:'age calculate birthday years months days'},
    {n:'BMI Calculator',          u:'/bmi-calculator/',              d:'Calculate your Body Mass Index',                    i:'/assets/img/icon-calculator.svg',        c:'Calculator',   k:'bmi body mass index health weight height obesity'},
    {n:'Calorie Calculator',      u:'/calorie-calculator/',          d:'Calculate your daily calorie needs',                i:'/assets/img/icon-calculator.svg',        c:'Calculator',   k:'calorie nutrition daily intake tdee bmr diet'},
    {n:'Sleep Calculator',        u:'/sleep-calculator/',            d:'Find your ideal sleep and wake times',              i:'/assets/img/icon-timer.svg',             c:'Calculator',   k:'sleep wake time cycle rem rest hours bedtime'},
    {n:'Typing Speed Test',       u:'/typing-speed-test/',           d:'Measure your typing speed in WPM',                  i:'/assets/img/icon-text.svg',              c:'Tools',        k:'typing speed wpm words per minute test keyboard'},
    {n:'Currency Converter',      u:'/currency-converter/',          d:'Convert between world currencies live',             i:'/assets/img/icon-calculator.svg',        c:'Finance',      k:'currency convert exchange rate usd eur gbp live'},
    {n:'Compound Interest Calculator',u:'/compound-interest-calculator/',d:'Calculate compound interest growth',           i:'/assets/img/icon-calculator.svg',        c:'Finance',      k:'compound interest investment growth savings'},
    {n:'Loan Calculator',         u:'/loan-calculator/',             d:'Calculate monthly loan payments',                   i:'/assets/img/icon-calculator.svg',        c:'Finance',      k:'loan calculator monthly payment interest emi'},
    {n:'Mortgage Calculator',     u:'/mortgage-calculator/',         d:'Calculate mortgage payments and costs',             i:'/assets/img/icon-calculator.svg',        c:'Finance',      k:'mortgage payment house loan interest amortize'},
    {n:'Invoice Generator',       u:'/invoice-generator/',           d:'Create and download professional invoices',         i:'/assets/img/icon-calculator.svg',        c:'Finance',      k:'invoice bill generate professional download pdf'},
    {n:'Discount Calculator',     u:'/discount-calculator/',         d:'Calculate discounted prices and savings',           i:'/assets/img/icon-calculator.svg',        c:'Finance',      k:'discount percent off sale price savings'},
    {n:'Percentage Calculator',   u:'/percentage-calculator/',       d:'Calculate percentages quickly',                     i:'/assets/img/icon-calculator.svg',        c:'Calculator',   k:'percentage percent calculate ratio proportion math'},
    {n:'GST / VAT Calculator',    u:'/gst-vat-calculator/',          d:'Calculate GST and VAT amounts',                     i:'/assets/img/icon-calculator.svg',        c:'Finance',      k:'gst vat tax calculate inclusive exclusive'},
    {n:'Tip Calculator',          u:'/tip-calculator/',              d:'Calculate tip and split the bill',                  i:'/assets/img/icon-calculator.svg',        c:'Finance',      k:'tip bill split restaurant gratuity'},
    {n:'Random Number Generator', u:'/random-number-generator/',     d:'Generate cryptographically secure random numbers',  i:'/assets/img/icon-calculator.svg',        c:'Calculator',   k:'random number generate range secure crypto'},
    {n:'Blood Type Compatibility',u:'/blood-type-compatibility/',    d:'Check blood type donation compatibility',           i:'/assets/img/icon-calculator.svg',        c:'Calculator',   k:'blood type compatibility donor recipient abo rh'},
    {n:'Privacy Policy Generator',u:'/privacy-policy-generator/',   d:'Generate a privacy policy for your website',        i:'/assets/img/icon-lock.svg',              c:'Tools',        k:'privacy policy generate website gdpr legal terms'},
    // Browser Tools
    {n:'Internet Speed Test',     u:'/internet-speed-test/',         d:'Test your internet download and upload speed',      i:'/assets/img/icon-screen.svg',            c:'Browser',      k:'speed test internet bandwidth download upload ping'},
    {n:'Keyboard Tester',         u:'/keyboard-tester/',             d:'Test every key on your keyboard',                   i:'/assets/img/icon-screen.svg',            c:'Browser',      k:'keyboard test keys check input'},
    {n:'Mouse Tester',            u:'/mouse-tester/',                d:'Test all your mouse buttons and scroll',            i:'/assets/img/icon-screen.svg',            c:'Browser',      k:'mouse test buttons scroll click check'},
    {n:'Webcam Tester',           u:'/webcam-tester/',               d:'Test your webcam online',                           i:'/assets/img/icon-screen.svg',            c:'Browser',      k:'webcam camera test check video streaming'},
    {n:'Microphone Tester',       u:'/microphone-tester/',           d:'Test your microphone online',                       i:'/assets/img/icon-screen.svg',            c:'Browser',      k:'microphone mic audio test check recording'},
    {n:'Dead Pixel Checker',      u:'/dead-pixel-checker/',          d:'Check your screen for dead or stuck pixels',        i:'/assets/img/icon-screen.svg',            c:'Browser',      k:'dead pixel stuck screen monitor check'},
    {n:'Monitor Color Test',      u:'/monitor-color-test/',          d:'Test your monitor display colors',                  i:'/assets/img/icon-color.svg',             c:'Browser',      k:'monitor color test display calibrate check'},
    {n:'Browser Info Viewer',     u:'/browser-info/',                d:'View detailed browser and system information',      i:'/assets/img/icon-screen.svg',            c:'Browser',      k:'browser info user agent version system details'},
    {n:'Viewport Size Checker',   u:'/viewport-size/',               d:'Check your browser viewport dimensions',            i:'/assets/img/icon-screen.svg',            c:'Browser',      k:'viewport size dimensions browser window'}
  ];

  var POPULAR = [
    '/json-formatter/', '/pdf-merge/', '/word-counter/',
    '/base64-encoder/', '/hash-generator/', '/age-calculator/'
  ];

  /* ===== INIT ===== */
  applyStoredTheme();
  document.addEventListener('DOMContentLoaded', function () {
    renderHeader();
    renderFooter();
    initHeader();
    initThemeToggle();
    initLangSwitcher();
    updateMobileLangLinks();
    initSearch();
  });

  function renderHeader() {
    const el = document.getElementById('site-header');
    if (el) el.innerHTML = headerHTML;
  }

  function renderFooter() {
    const el = document.getElementById('site-footer');
    if (el) el.innerHTML = footerHTML;
  }

  /* ===== HEADER BEHAVIOR ===== */
  function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    // Scroll shadow
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    // Active nav link
    const path = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(function (link) {
      if (link.href && link.getAttribute('href') !== '/' && path.startsWith(link.getAttribute('href'))) {
        link.classList.add('active');
      }
    });

    // Category dropdowns — handle all .nav-more buttons
    const navDropBtns = document.querySelectorAll('.nav-more');
    function closeAllNavDropdowns() {
      navDropBtns.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    }
    navDropBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        closeAllNavDropdowns();
        if (!isOpen) btn.setAttribute('aria-expanded', 'true');
      });
    });

    // Close all dropdowns on outside click
    document.addEventListener('click', closeAllNavDropdowns);

    // Escape closes all dropdowns
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeAllNavDropdowns();
        closeMobileMenu();
        closeLangDropdown();
      }
    });

    // Mobile menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
      mobileBtn.addEventListener('click', function () {
        const isOpen = mobileBtn.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
          closeMobileMenu();
        } else {
          mobileBtn.setAttribute('aria-expanded', 'true');
          mobileMenu.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      });
    }
  }

  function closeMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
    if (mobileMenu) mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function closeLangDropdown() {
    const switcher = document.getElementById('lang-switcher');
    if (switcher) {
      switcher.classList.remove('open');
      const btn = switcher.querySelector('.lang-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  }

  /* ===== THEME ===== */
  function applyStoredTheme() {
    const stored = localStorage.getItem('ac_theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (stored === 'light') {
      document.documentElement.classList.remove('dark');
    }
  }

  function initThemeToggle() {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    const isDark = document.documentElement.classList.contains('dark');
    btn.textContent = isDark ? '☀️' : '🌙';
    btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    btn.addEventListener('click', function () {
      const nowDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('ac_theme', nowDark ? 'dark' : 'light');
      btn.textContent = nowDark ? '☀️' : '🌙';
      btn.title = nowDark ? 'Switch to light mode' : 'Switch to dark mode';
    });
  }

  /* ===== LANGUAGE SWITCHER ===== */
  function initLangSwitcher() {
    const switcher = document.getElementById('lang-switcher');
    if (!switcher) return;

    const btn = switcher.querySelector('.lang-btn');
    const options = switcher.querySelectorAll('[data-lang]');
    const flagEl = document.getElementById('lang-flag');
    const codeEl = document.getElementById('lang-code');

    // Detect current lang from URL
    const path = window.location.pathname;
    let currentLang = 'en';
    if (path.startsWith('/es/') || path === '/es') currentLang = 'es';
    else if (path.startsWith('/da/') || path === '/da') currentLang = 'da';

    const langMeta = { en: { flag: '🇺🇸', code: 'EN' }, es: { flag: '🇪🇸', code: 'ES' }, da: { flag: '🇩🇰', code: 'DA' } };
    if (flagEl) flagEl.textContent = langMeta[currentLang].flag;
    if (codeEl) codeEl.textContent = langMeta[currentLang].code;

    // Mark active
    options.forEach(function (opt) {
      if (opt.dataset.lang === currentLang) opt.classList.add('active');
    });

    // Toggle
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = switcher.classList.contains('open');
      if (isOpen) { closeLangDropdown(); } else {
        switcher.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    document.addEventListener('click', function (e) {
      if (!switcher.contains(e.target)) closeLangDropdown();
    });

    // Navigate on selection
    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        const targetLang = opt.dataset.lang;
        const url = buildLangUrl(targetLang);
        localStorage.setItem('ac_lang', targetLang);
        window.location.href = url;
      });
    });
  }

  function buildLangUrl(targetLang) {
    const path = window.location.pathname;
    // Remove existing lang prefix
    let cleanPath = path.replace(/^\/(es|da)(\/|$)/, '/');
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
    if (targetLang === 'en') return cleanPath || '/';
    return '/' + targetLang + cleanPath;
  }

  function updateMobileLangLinks() {
    document.querySelectorAll('[data-lang-link]').forEach(function (link) {
      const lang = link.dataset.langLink;
      link.href = buildLangUrl(lang);
    });
  }

  /* ===== TOAST ===== */
  window.showToast = function (message, type, duration) {
    type = type || 'success';
    duration = duration || 3000;
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    toast.className = 'toast toast--' + type;
    toast.innerHTML =
      '<span class="toast-icon">' + (icons[type] || '✓') + '</span>' +
      '<span class="toast-message">' + escapeHtml(message) + '</span>' +
      '<button class="toast-close" aria-label="Close">×</button>';
    container.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add('toast--visible'); });
    const timer = setTimeout(function () { removeToast(toast); }, duration);
    toast.querySelector('.toast-close').addEventListener('click', function () {
      clearTimeout(timer);
      removeToast(toast);
    });
  };

  function removeToast(toast) {
    toast.classList.remove('toast--visible');
    toast.addEventListener('transitionend', function () { toast.remove(); }, { once: true });
  }

  /* ===== CLIPBOARD ===== */
  window.copyToClipboard = async function (text) {
    try {
      await navigator.clipboard.writeText(text);
      window.showToast('Copied to clipboard!', 'success');
    } catch (_e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      window.showToast('Copied to clipboard!', 'success');
    }
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ===== SEARCH ===== */
  function initSearch() {
    var btn      = document.getElementById('search-btn');
    var modal    = document.getElementById('search-modal');
    var backdrop = document.getElementById('search-backdrop');
    var input    = document.getElementById('search-input');
    var list     = document.getElementById('search-results');
    var emptyEl  = document.getElementById('search-empty');
    if (!btn || !modal || !input) return;

    var activeIdx = -1;

    function openSearch() {
      closeMobileMenu();
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      input.value = '';
      activeIdx = -1;
      showPopular();
      requestAnimationFrame(function () { input.focus(); });
    }

    function closeSearch() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      activeIdx = -1;
    }

    btn.addEventListener('click', openSearch);
    if (backdrop) backdrop.addEventListener('click', closeSearch);

    document.addEventListener('keydown', function (e) {
      if (modal.classList.contains('open')) {
        if (e.key === 'Escape') { e.preventDefault(); closeSearch(); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1); return; }
        if (e.key === 'ArrowUp')   { e.preventDefault(); moveActive(-1); return; }
        if (e.key === 'Enter') {
          var links = list.querySelectorAll('.search-result-item');
          if (activeIdx >= 0 && links[activeIdx]) {
            window.location.href = links[activeIdx].getAttribute('href');
          } else if (links.length === 1) {
            window.location.href = links[0].getAttribute('href');
          }
          return;
        }
        return;
      }
      // Open shortcuts when modal is closed
      var tag = document.activeElement ? document.activeElement.tagName : '';
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault(); openSearch();
      } else if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault(); openSearch();
      }
    });

    input.addEventListener('input', function () {
      activeIdx = -1;
      var q = input.value.trim();
      if (!q) { showPopular(); return; }
      renderResults(q);
    });

    function moveActive(dir) {
      var links = list.querySelectorAll('.search-result-item');
      if (!links.length) return;
      if (activeIdx >= 0) links[activeIdx].classList.remove('is-active');
      activeIdx = Math.max(-1, Math.min(links.length - 1, activeIdx + dir));
      if (activeIdx >= 0) {
        links[activeIdx].classList.add('is-active');
        links[activeIdx].scrollIntoView({ block: 'nearest' });
      }
    }

    function showPopular() {
      var pop = TOOLS.filter(function (t) { return POPULAR.indexOf(t.u) !== -1; });
      renderList(pop, '⚡ Popular tools', null);
      emptyEl.textContent = '';
      emptyEl.classList.remove('visible');
    }

    function renderResults(q) {
      var ql = q.toLowerCase();
      var nameHits  = TOOLS.filter(function (t) { return t.n.toLowerCase().indexOf(ql) !== -1; });
      var otherHits = TOOLS.filter(function (t) {
        return t.n.toLowerCase().indexOf(ql) === -1 &&
          (t.d.toLowerCase().indexOf(ql) !== -1 ||
           t.k.toLowerCase().indexOf(ql) !== -1 ||
           t.c.toLowerCase().indexOf(ql) !== -1);
      });
      var matched = nameHits.concat(otherHits).slice(0, 8);
      if (!matched.length) {
        list.innerHTML = '';
        emptyEl.textContent = 'No tools found for "' + q + '"';
        emptyEl.classList.add('visible');
      } else {
        emptyEl.textContent = '';
        emptyEl.classList.remove('visible');
        renderList(matched, null, q);
      }
    }

    function renderList(tools, label, q) {
      var html = label ? '<li class="search-section-label">' + escapeHtml(label) + '</li>' : '';
      html += tools.map(function (t) {
        var name = q ? hlMatch(t.n, q) : escapeHtml(t.n);
        return '<li>' +
          '<a href="' + t.u + '" class="search-result-item">' +
            '<img src="' + t.i + '" alt="" class="search-result-icon" width="36" height="36" loading="lazy">' +
            '<div class="search-result-info">' +
              '<div class="search-result-name">' + name + '</div>' +
              '<div class="search-result-desc">' + escapeHtml(t.d) + '</div>' +
            '</div>' +
            '<span class="search-result-badge">' + escapeHtml(t.c) + '</span>' +
          '</a>' +
        '</li>';
      }).join('');
      list.innerHTML = html;
    }

    function hlMatch(text, query) {
      var lo = text.toLowerCase(), loq = query.toLowerCase();
      var idx = lo.indexOf(loq);
      if (idx === -1) return escapeHtml(text);
      return escapeHtml(text.slice(0, idx)) +
        '<mark class="search-hl">' + escapeHtml(text.slice(idx, idx + query.length)) + '</mark>' +
        escapeHtml(text.slice(idx + query.length));
    }
  }

  /* ===== MAIN CONTENT ID ===== */
  document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'main-content';
  });
})();
