/* AnyConverter — Shared JS: header, footer, nav, toast, language switcher */

(function () {
  'use strict';

  window.AC_GA_MEASUREMENT_ID = window.AC_GA_MEASUREMENT_ID || 'G-SX6V3QC5YY';

  /* ===== TOOL STRING LOCALISATION =====
     Tool scripts that build UI at runtime use these so injected controls
     follow <html lang> instead of defaulting to English. */
  function acLang() {
    var l = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
    if (l.indexOf('es') === 0) return 'es';
    if (l.indexOf('da') === 0) return 'da';
    return 'en';
  }
  function acT(map) {
    if (!map) return '';
    var l = acLang();
    return map[l] != null ? map[l] : (map.en != null ? map.en : '');
  }
  window.acLang = acLang;
  window.acT = acT;

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
          <li><a href="/developer-tools/" role="menuitem">All Developer Tools</a></li>
          <li><a href="/json-formatter/" role="menuitem">JSON Formatter</a></li>
          <li><a href="/json-compare/" role="menuitem">JSON Compare</a></li>
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
          <li><a href="/pdf-tools/" role="menuitem">All PDF Tools</a></li>
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
          <li><a href="/pdf-to-word/" role="menuitem">PDF to Word</a></li>
          <li><a href="/html-to-pdf/" role="menuitem">HTML to PDF</a></li>
          <li><a href="/scan-to-pdf/" role="menuitem">Scan to PDF</a></li>
          <li><a href="/sign-pdf/" role="menuitem">Sign PDF</a></li>
          <li><a href="/edit-pdf/" role="menuitem">Edit PDF</a></li>
          <li><a href="/redact-pdf/" role="menuitem">Blackout PDF</a></li>
          <li><a href="/pdf-metadata-remover/" role="menuitem">PDF Metadata Remover</a></li>
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
          <li><a href="/text-tools/" role="menuitem">All Text Tools</a></li>
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
          <li><a href="/camt053-to-csv/" role="menuitem">CAMT.053 to CSV</a></li>
          <li><a href="/parquet-to-csv/" role="menuitem">Parquet to CSV</a></li>
          <li><a href="/image-converter/" role="menuitem">Image Converter</a></li>
          <li><a href="/image-compressor/" role="menuitem">Image Compressor</a></li>
          <li><a href="/qr-code-generator/" role="menuitem">QR Code Generator</a></li>
          <li><a href="/barcode-generator/" role="menuitem">Barcode Generator</a></li>
        </ul>
      </li>

      <!-- Productivity & Utility -->
      <li class="nav-dropdown">
        <button class="nav-link nav-more" aria-expanded="false" aria-haspopup="true">Productivity ▾</button>
        <ul class="dropdown-menu" role="menu">
          <li><a href="/productivity-tools/" role="menuitem">All Productivity Tools</a></li>
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
          <li><a href="/numerology-astrology/" role="menuitem">Numerology &amp; Astrology</a></li>
          <li><a href="/fun-relationships/" role="menuitem">Fun &amp; Relationships</a></li>
          <li><a href="/date-time/" role="menuitem">Date &amp; Time</a></li>
        </ul>
      </li>

      <!-- General & Finance -->
      <li class="nav-dropdown">
        <button class="nav-link nav-more" aria-expanded="false" aria-haspopup="true">Calculators ▾</button>
        <ul class="dropdown-menu dropdown-menu--wide" role="menu">
          <li><a href="/calculators/" role="menuitem">All Calculators</a></li>
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
          <li><a href="/reverse-percentage-calculator/" role="menuitem">Reverse Percentage Calculator</a></li>
          <li><a href="/discount-stacking-calculator/" role="menuitem">Discount Stacking Calculator</a></li>
          <li><a href="/percentage-difference-calculator/" role="menuitem">Percentage Difference</a></li>
          <li><a href="/price-increase-calculator/" role="menuitem">Price Increase Calculator</a></li>
          <li><a href="/pay-rise-calculator/" role="menuitem">Pay Rise Calculator</a></li>
          <li><a href="/margin-vs-markup-calculator/" role="menuitem">Margin vs Markup</a></li>
          <li><a href="/unit-price-calculator/" role="menuitem">Unit Price Calculator</a></li>
          <li><a href="/rise-over-run-calculator/" role="menuitem">Rise Over Run</a></li>
          <li><a href="/slope-grade-angle-calculator/" role="menuitem">Slope, Grade &amp; Angle</a></li>
          <li><a href="/tip-calculator/" role="menuitem">Tip Calculator</a></li>
          <li><a href="/love-calculator/" role="menuitem">Love Calculator</a></li>
          <li><a href="/flames-calculator/" role="menuitem">FLAMES Calculator</a></li>
          <li><a href="/numerology-calculator/" role="menuitem">Numerology Calculator</a></li>
          <li><a href="/name-numerology-calculator/" role="menuitem">Name Numerology</a></li>
          <li><a href="/lo-shu-grid-calculator/" role="menuitem">Lo Shu Grid Calculator</a></li>
          <li><a href="/tarot-birth-card-calculator/" role="menuitem">Tarot Birth Card</a></li>
          <li><a href="/moon-sign-calculator/" role="menuitem">Moon Sign Calculator</a></li>
          <li><a href="/rising-sign-calculator/" role="menuitem">Rising Sign Calculator</a></li>
          <li><a href="/birthday-countdown-calculator/" role="menuitem">Birthday Countdown</a></li>
        </ul>
      </li>

      <!-- Browser Tools -->
      <li class="nav-dropdown">
        <button class="nav-link nav-more" aria-expanded="false" aria-haspopup="true">Browser ▾</button>
        <ul class="dropdown-menu" role="menu">
          <li><a href="/browser-tools/" role="menuitem">All Browser Tools</a></li>
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
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--color-text-3,#7C7169);pointer-events:none">Developer</li>
      <li><a href="/json-formatter/">JSON Formatter</a></li>
      <li><a href="/json-compare/">JSON Compare</a></li>
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
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--color-text-3,#7C7169);pointer-events:none">Text &amp; Writing</li>
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
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--color-text-3,#7C7169);pointer-events:none">Data &amp; Conversion</li>
      <li><a href="/csv-to-sql/">CSV to SQL</a></li>
      <li><a href="/camt053-to-csv/">CAMT.053 to CSV</a></li>
      <li><a href="/parquet-to-csv/">Parquet to CSV</a></li>
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
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--color-text-3,#7C7169);pointer-events:none">PDF Tools</li>
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
      <li><a href="/pdf-to-word/">PDF to Word</a></li>
      <li><a href="/html-to-pdf/">HTML to PDF</a></li>
      <li><a href="/pdf-forms/">Fill PDF Forms</a></li>
      <li><a href="/sign-pdf/">Sign PDF</a></li>
      <li><a href="/edit-pdf/">Edit PDF</a></li>
      <li><a href="/redact-pdf/">Blackout PDF</a></li>
      <li><a href="/pdf-metadata-remover/">PDF Metadata Remover</a></li>
      <li><a href="/compare-pdf/">Compare PDF</a></li>
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--color-text-3,#7C7169);pointer-events:none">Productivity &amp; Utility</li>
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
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--color-text-3,#7C7169);pointer-events:none">General Public</li>
      <li><a href="/age-calculator/">Age Calculator</a></li>
      <li><a href="/bmi-calculator/">BMI Calculator</a></li>
      <li><a href="/calorie-calculator/">Calorie Calculator</a></li>
      <li><a href="/qr-code-generator/">QR Code Generator</a></li>
      <li><a href="/barcode-generator/">Barcode Generator</a></li>
      <li><a href="/typing-speed-test/">Typing Speed Test</a></li>
      <li><a href="/pomodoro-timer/">Pomodoro Timer</a></li>
      <li><a href="/invoice-generator/">Invoice Generator</a></li>
      <li><a href="/world-clock/">World Clock</a></li>
      <li><a href="/sleep-calculator/">Sleep Calculator</a></li>
      <li><a href="/blood-type-compatibility/">Blood Type Compatibility</a></li>
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--color-text-3,#7C7169);pointer-events:none">Finance</li>
      <li><a href="/currency-converter/">Currency Converter</a></li>
      <li><a href="/compound-interest-calculator/">Compound Interest</a></li>
      <li><a href="/loan-calculator/">Loan Calculator</a></li>
      <li><a href="/mortgage-calculator/">Mortgage Calculator</a></li>
      <li><a href="/discount-calculator/">Discount Calculator</a></li>
      <li><a href="/percentage-calculator/">Percentage Calculator</a></li>
      <li><a href="/gst-vat-calculator/">GST / VAT Calculator</a></li>
      <li><a href="/reverse-percentage-calculator/">Reverse Percentage Calculator</a></li>
      <li><a href="/discount-stacking-calculator/">Discount Stacking Calculator</a></li>
      <li><a href="/percentage-difference-calculator/">Percentage Difference</a></li>
      <li><a href="/price-increase-calculator/">Price Increase Calculator</a></li>
      <li><a href="/pay-rise-calculator/">Pay Rise Calculator</a></li>
      <li><a href="/margin-vs-markup-calculator/">Margin vs Markup</a></li>
      <li><a href="/unit-price-calculator/">Unit Price Calculator</a></li>
      <li><a href="/rise-over-run-calculator/">Rise Over Run</a></li>
      <li><a href="/slope-grade-angle-calculator/">Slope, Grade &amp; Angle</a></li>
      <li><a href="/tip-calculator/">Tip Calculator</a></li>
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--color-text-3,#7C7169);pointer-events:none">Numerology, Fun &amp; Dates</li>
      <li><a href="/numerology-astrology/">Numerology &amp; Astrology</a></li>
      <li><a href="/numerology-calculator/">Numerology Calculator</a></li>
      <li><a href="/moon-sign-calculator/">Moon Sign Calculator</a></li>
      <li><a href="/rising-sign-calculator/">Rising Sign Calculator</a></li>
      <li><a href="/fun-relationships/">Fun &amp; Relationships</a></li>
      <li><a href="/love-calculator/">Love Calculator</a></li>
      <li><a href="/magic-8-ball/">Magic 8 Ball</a></li>
      <li><a href="/date-time/">Date &amp; Time</a></li>
      <li><a href="/birthday-countdown-calculator/">Birthday Countdown</a></li>
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--color-text-3,#7C7169);pointer-events:none">CSS &amp; Design</li>
      <li><a href="/css-gradient-generator/">CSS Gradient Generator</a></li>
      <li><a href="/css-shadow-generator/">CSS Shadow Generator</a></li>
      <li><a href="/px-to-rem/">PX to REM</a></li>
      <li><a href="/aspect-ratio-calculator/">Aspect Ratio Calculator</a></li>
      <li><a href="/privacy-policy-generator/">Privacy Policy Generator</a></li>
      <li><a href="/random-number-generator/">Random Number Generator</a></li>
      <li style="padding:6px 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--color-text-3,#7C7169);pointer-events:none">Browser Tools</li>
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
      <input type="search" id="search-input" class="search-modal-input" placeholder="Search 128 tools…" autocomplete="off" spellcheck="false" aria-label="Search tools" aria-controls="search-results" aria-autocomplete="list">
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

  /* ===== FOOTER TRANSLATIONS ===== */
  var FOOTER_I18N = {
    en: {
      tagline: 'Free online tools for developers, students, and everyone. No signup. No data uploaded to servers.',
      col1: 'Product',
      home: 'Home', allTools: 'All Tools', pdfTools: 'PDF Tools', devTools: 'Developer Tools',
      browserTools: 'Browser Tools', calculators: 'Calculators', textTools: 'Text Tools', productivity: 'Productivity',
      col2: 'Features',
      imageConverter: 'Image Converter', qrCode: 'QR Code Generator', cssGenerator: 'CSS Generator',
      currency: 'Currency Converter', password: 'Password Generator', invoice: 'Invoice Generator',
      pomodoro: 'Pomodoro Timer', typingTest: 'Typing Speed Test',
      col3: 'Legal',
      privacy: 'Privacy Policy', terms: 'Terms of Service', cookies: 'Cookie Policy', security: 'Security',
      col4: 'Company',
      about: 'About Us', contact: 'Contact Us', blog: 'Blog', press: 'Press', faq: 'FAQ',
      rights: '© 2026 AnyConverter. All rights reserved.',
      noData: 'Free online tools — no data uploaded to servers'
    },
    es: {
      tagline: 'Herramientas online gratuitas para desarrolladores, estudiantes y todos. Sin registro. Sin subida de datos a servidores.',
      col1: 'Producto',
      home: 'Inicio', allTools: 'Todas las Herramientas', pdfTools: 'Herramientas PDF', devTools: 'Herramientas para Desarrolladores',
      browserTools: 'Herramientas de Navegador', calculators: 'Calculadoras', textTools: 'Herramientas de Texto', productivity: 'Productividad',
      col2: 'Características',
      imageConverter: 'Conversor de Imágenes', qrCode: 'Generador de Códigos QR', cssGenerator: 'Generador CSS',
      currency: 'Conversor de Divisas', password: 'Generador de Contraseñas', invoice: 'Generador de Facturas',
      pomodoro: 'Temporizador Pomodoro', typingTest: 'Test de Velocidad de Escritura',
      col3: 'Legal',
      privacy: 'Política de Privacidad', terms: 'Términos de Servicio', cookies: 'Política de Cookies', security: 'Seguridad',
      col4: 'Empresa',
      about: 'Sobre Nosotros', contact: 'Contáctanos', blog: 'Blog', press: 'Prensa', faq: 'Preguntas Frecuentes',
      rights: '© 2026 AnyConverter. Todos los derechos reservados.',
      noData: 'Herramientas online gratuitas — sin subida de datos a servidores'
    },
    da: {
      tagline: 'Gratis online værktøjer til udviklere, studerende og alle andre. Ingen tilmelding. Ingen data uploades til servere.',
      col1: 'Produkt',
      home: 'Hjem', allTools: 'Alle Værktøjer', pdfTools: 'PDF Værktøjer', devTools: 'Udviklerværktøjer',
      browserTools: 'Browserværktøjer', calculators: 'Beregnere', textTools: 'Tekstværktøjer', productivity: 'Produktivitet',
      col2: 'Funktioner',
      imageConverter: 'Billedkonverter', qrCode: 'QR-kode Generator', cssGenerator: 'CSS Generator',
      currency: 'Valutaomregner', password: 'Adgangskodegenerator', invoice: 'Fakturagenerator',
      pomodoro: 'Pomodoro-timer', typingTest: 'Skrivehastighedstest',
      col3: 'Juridisk',
      privacy: 'Privatlivspolitik', terms: 'Servicevilkår', cookies: 'Cookiepolitik', security: 'Sikkerhed',
      col4: 'Virksomhed',
      about: 'Om Os', contact: 'Kontakt Os', blog: 'Blog', press: 'Presse', faq: 'Ofte Stillede Spørgsmål',
      rights: '© 2026 AnyConverter. Alle rettigheder forbeholdes.',
      noData: 'Gratis online værktøjer — ingen data uploades til servere'
    }
  };

  /* ===== SEARCH DATA ===== */
  var TOOLS = [
    // Developer Tools
    {n:'JSON Formatter',          u:'/json-formatter/',              d:'Format, validate and beautify JSON',                i:'/assets/img/icon-json.svg',              c:'Developer',    k:'pretty print validate parse indent'},
    {n:'JSON Compare',            u:'/json-compare/',                d:'Find real differences between two JSON files',      i:'/assets/img/icon-json.svg',              c:'Developer',    k:'json compare diff json diff two files array match key ignore order'},
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
    {n:'PDF to Word',             u:'/pdf-to-word/',                 d:'Convert a PDF into an editable Word document',      i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'pdf to word docx doc convert editable ocr'},
    {n:'HTML to PDF',             u:'/html-to-pdf/',                 d:'Convert HTML web pages to PDF',                     i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'convert html webpage to pdf render'},
    {n:'Scan to PDF',             u:'/scan-to-pdf/',                 d:'Convert scanned documents to PDF',                  i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'scan document convert digitize image'},
    {n:'Sign PDF',                u:'/sign-pdf/',                    d:'Add a digital signature to a PDF',                  i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'sign signature digital electronic'},
    {n:'Edit PDF',                u:'/edit-pdf/',                    d:'Edit text and images in a PDF',                     i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'edit modify change text images annotate'},
    {n:'Blackout PDF',            u:'/redact-pdf/',                  d:'Cover PDF content with black rectangles',           i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'redact remove hide sensitive privacy blackout'},
    {n:'PDF Metadata Remover',    u:'/pdf-metadata-remover/',        d:'Inspect and clear common PDF document properties',  i:'/assets/img/icon-pdf.svg',               c:'PDF',          k:'metadata remove author title keywords creator producer privacy document properties'},
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
    {n:'CAMT.053 to CSV',         u:'/camt053-to-csv/',              d:'Convert ISO 20022 bank statements to CSV',          i:'/assets/img/icon-csv.svg',               c:'Data',         k:'camt053 camt.053 iso 20022 bank statement to csv excel mt940'},
    {n:'Parquet to CSV',          u:'/parquet-to-csv/',              d:'Convert Parquet files to CSV in your browser',      i:'/assets/img/icon-csv.svg',               c:'Data',         k:'parquet to csv convert parquet viewer schema snappy'},
    {n:'CSV Query',               u:'/csv-query/',                   d:'Run SQL queries on CSV files in your browser',      i:'/assets/img/icon-csv-query.svg',         c:'Data',         k:'csv sql query filter select database'},
    {n:'Image Converter',         u:'/image-converter/',             d:'Convert images between different formats',          i:'/assets/img/icon-text.svg',              c:'Media',        k:'image convert jpg png webp gif bmp format'},
    {n:'Image Compressor',        u:'/image-compressor/',            d:'Compress images without quality loss',              i:'/assets/img/icon-text.svg',              c:'Media',        k:'image compress reduce size optimize jpg png'},
    {n:'QR Code Generator',       u:'/qr-code-generator/',           d:'Generate QR codes for any URL or text',             i:'/assets/img/icon-text.svg',              c:'Tools',        k:'qr code generate scan url link barcode'},
    {n:'Barcode Generator',       u:'/barcode-generator/',           d:'Create Code 128, EAN-13, UPC-A and Code 39 barcodes', i:'/assets/img/icon-text.svg',            c:'Tools',        k:'barcode generator code128 ean13 upc code39 create scan check digit'},
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
    {n:'Reverse Percentage Calculator',u:'/reverse-percentage-calculator/',d:'Find the original value before a % increase, discount, or VAT', i:'/assets/img/icon-calculator.svg', c:'Finance',    k:'reverse percentage calculator find original price remove vat margin markup'},
    {n:'Discount Stacking Calculator', u:'/discount-stacking-calculator/', d:'See what stacked percent, coupon and multi-buy discounts really cost', i:'/assets/img/icon-calculator.svg', c:'Finance', k:'discount stacking calculator stacked coupons multi buy cashback 20 percent 10 percent'},
    {n:'Percentage Difference Calculator', u:'/percentage-difference-calculator/', d:'Compare two values: % difference, % change and points', i:'/assets/img/icon-calculator.svg', c:'Calculator', k:'percentage difference percent change percentage points compare two numbers'},
    {n:'Price Increase Calculator', u:'/price-increase-calculator/', d:'New price after a % increase, or the % between two prices', i:'/assets/img/icon-calculator.svg', c:'Finance', k:'price increase percent rise new price shrinkflation inflation'},
    {n:'Pay Rise Calculator',     u:'/pay-rise-calculator/',         d:'New salary after a raise, and the real raise after inflation', i:'/assets/img/icon-calculator.svg', c:'Finance', k:'pay rise salary raise increase wage inflation hourly monthly'},
    {n:'Margin vs Markup Calculator', u:'/margin-vs-markup-calculator/', d:'Margin and markup from cost and price, or the price needed', i:'/assets/img/icon-calculator.svg', c:'Finance', k:'margin markup profit gross margin selling price cost avance recargo'},
    {n:'Unit Price Calculator',   u:'/unit-price-calculator/',       d:'Compare pack sizes by price per kg, litre or item', i:'/assets/img/icon-calculator.svg', c:'Finance', k:'unit price per kg per litre compare pack size cheapest grocery'},
    {n:'Rise Over Run Calculator', u:'/rise-over-run-calculator/',   d:'Slope from rise and run or two points', i:'/assets/img/icon-calculator.svg', c:'Calculator', k:'rise over run slope two points gradient line equation'},
    {n:'Slope, Grade & Angle Calculator', u:'/slope-grade-angle-calculator/', d:'Convert slope ratio, percent grade and degrees', i:'/assets/img/icon-calculator.svg', c:'Calculator', k:'slope grade angle degrees percent ratio roof pitch ramp'},
    {n:'Name Numerology Calculator', u:'/name-numerology-calculator/', d:'Destiny, Soul Urge and Personality numbers from your name', i:'/assets/img/icon-calculator.svg', c:'Numerology', k:'name numerology destiny expression soul urge personality pythagorean chaldean'},
    {n:'Numerology Calculator',   u:'/numerology-calculator/',       d:'Life Path, Birthday, Personal Year and name numbers', i:'/assets/img/icon-calculator.svg', c:'Numerology', k:'numerology life path birthday number personal year'},
    {n:'Lo Shu Grid Calculator',  u:'/lo-shu-grid-calculator/',      d:'Build your Lo Shu Grid with missing and repeated numbers', i:'/assets/img/icon-calculator.svg', c:'Numerology', k:'lo shu grid magic square numerology driver destiny'},
    {n:'Moon Sign Calculator',    u:'/moon-sign-calculator/',        d:'Your Moon sign from birth date, time and place', i:'/assets/img/icon-calculator.svg', c:'Astrology', k:'moon sign lunar zodiac astrology birth chart'},
    {n:'Rising Sign Calculator',  u:'/rising-sign-calculator/',      d:'Ascendant sign and degree from your birth time and place', i:'/assets/img/icon-calculator.svg', c:'Astrology', k:'rising sign ascendant astrology big three birth time'},
    {n:'Tarot Birth Card Calculator', u:'/tarot-birth-card-calculator/', d:'Your Tarot birth cards from your birth date', i:'/assets/img/icon-calculator.svg', c:'Numerology', k:'tarot birth card major arcana personality soul card'},
    {n:'Love Calculator',         u:'/love-calculator/',             d:'A fun love percentage from two names', i:'/assets/img/icon-calculator.svg', c:'Fun', k:'love calculator names compatibility crush test'},
    {n:'FLAMES Calculator',       u:'/flames-calculator/',           d:'Play the classic FLAMES name game', i:'/assets/img/icon-calculator.svg', c:'Fun', k:'flames game friends love affection marriage enemies siblings'},
    {n:'Magic 8 Ball',            u:'/magic-8-ball/',                d:'Ask a yes-or-no question and shake the ball', i:'/assets/img/icon-calculator.svg', c:'Fun', k:'magic 8 ball eight ball yes no answer'},
    {n:'Birthday Countdown Calculator', u:'/birthday-countdown-calculator/', d:'Days, hours and minutes until your next birthday', i:'/assets/img/icon-timer.svg', c:'Date & Time', k:'birthday countdown days until birthday age next birthday'},
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

  /* ===== MULTILINGUAL SEARCH & DASHBOARD DATA ===== */
  var CATEGORY_I18N = {
  "es": {
    "Developer": "Desarrollador",
    "PDF": "PDF",
    "Text": "Texto",
    "Data": "Datos",
    "Media": "Medios",
    "Tools": "Herramientas",
    "Browser": "Navegador",
    "Productivity": "Productividad",
    "Fun": "Entretenimiento",
    "Calculator": "Calculadora",
    "Finance": "Finanzas",
    "Numerology": "Numerología",
    "Astrology": "Astrología",
    "Date & Time": "Fecha y Hora"
  },
  "da": {
    "Developer": "Udvikler",
    "PDF": "PDF",
    "Text": "Tekst",
    "Data": "Data",
    "Media": "Medier",
    "Tools": "Værktøjer",
    "Browser": "Browser",
    "Productivity": "Produktivitet",
    "Fun": "Underholdning",
    "Calculator": "Beregner",
    "Finance": "Finans",
    "Numerology": "Numerologi",
    "Astrology": "Astrologi",
    "Date & Time": "Dato og Tid"
  }
};

  var TOOL_I18N = {
  "es": {
    "names": {
      "/json-formatter/": "Formateador JSON",
      "/json-compare/": "Comparar JSON",
      "/xml-formatter/": "Formateador XML",
      "/regex-tester/": "Probador de Expresiones Regulares",
      "/base64-encoder/": "Codificador Base64",
      "/url-encoder/": "Codificador URL",
      "/hash-generator/": "Generador de Hash",
      "/jwt-decoder/": "Decodificador JWT",
      "/uuid-generator/": "Generador de UUID",
      "/password-generator/": "Generador de Contraseñas",
      "/password-strength-checker/": "Comprobador de Fortaleza de Contraseña",
      "/ip-address-lookup/": "Búsqueda de Dirección IP",
      "/html-beautifier/": "Embellecedor y Minificador HTML",
      "/json-to-yaml/": "Convertidor JSON a YAML",
      "/cron-expression-parser/": "Analizador de Expresiones Cron",
      "/css-gradient-generator/": "Generador de Gradientes CSS",
      "/css-shadow-generator/": "Generador de Sombras CSS",
      "/px-to-rem/": "Convertidor de PX a REM",
      "/aspect-ratio-calculator/": "Calculadora de Relación de Aspecto",
      "/pdf-merge/": "Unir PDFs",
      "/pdf-split/": "Dividir PDF",
      "/pdf-compress/": "Comprimir PDF",
      "/rotate-pdf/": "Girar PDF",
      "/organize-pdf/": "Organizar PDF",
      "/remove-pdf-pages/": "Eliminar Páginas de PDF",
      "/extract-pdf-pages/": "Extraer Páginas de PDF",
      "/crop-pdf/": "Recortar Páginas PDF",
      "/add-page-numbers/": "Numerar Páginas PDF",
      "/add-watermark/": "Añadir Marca de Agua a PDF",
      "/protect-pdf/": "Proteger PDF con Contraseña",
      "/unlock-pdf/": "Desbloquear PDF",
      "/jpg-to-pdf/": "JPG a PDF",
      "/pdf-to-jpg/": "PDF a JPG",
      "/ocr-pdf/": "OCR PDF",
      "/pdf-to-word/": "Convertir PDF a Word",
      "/html-to-pdf/": "Convertir HTML a PDF",
      "/scan-to-pdf/": "Escanear a PDF",
      "/sign-pdf/": "Firmar PDF",
      "/edit-pdf/": "Editar PDF",
      "/redact-pdf/": "Blackout PDF",
      "/pdf-metadata-remover/": "Eliminar Metadatos PDF",
      "/compare-pdf/": "Comparar PDF",
      "/pdf-forms/": "Rellenar Formularios PDF",
      "/pdf-security/": "Seguridad PDF",
      "/optimize-pdf/": "Optimizar y Comprimir PDF",
      "/word-counter/": "Contador de Palabras",
      "/character-counter/": "Contador de Caracteres",
      "/text-case-converter/": "Conversor de Mayúsculas y Minúsculas",
      "/text-diff-checker/": "Comparador de Texto",
      "/lorem-ipsum-generator/": "Generador de Lorem Ipsum",
      "/fancy-text-generator/": "Generador de Texto Elegante",
      "/ascii-art-generator/": "Generador de Arte ASCII",
      "/morse-code-converter/": "Convertidor de Código Morse",
      "/text-repeater/": "Repetidor de Texto",
      "/number-to-words/": "Convertidor de Números a Palabras",
      "/roman-numeral-converter/": "Convertidor de Números Romanos",
      "/markdown-html/": "Conversor de Markdown a HTML",
      "/csv-to-sql/": "Conversor CSV a SQL",
      "/camt053-to-csv/": "Convertir CAMT.053 a CSV",
      "/parquet-to-csv/": "Convertir Parquet a CSV",
      "/csv-query/": "Herramienta de Consulta CSV",
      "/image-converter/": "Convertidor de Imágenes",
      "/image-compressor/": "Compresor de Imágenes",
      "/qr-code-generator/": "Generador de Código QR",
      "/barcode-generator/": "Generador de Códigos de Barras",
      "/timestamp-converter/": "Convertidor de Timestamp Unix",
      "/color-converter/": "Conversor de Colores",
      "/screen-resolution/": "Comprobador de Resolución de Pantalla",
      "/stopwatch/": "Cronómetro",
      "/countdown-timer/": "Temporizador de Cuenta Regresiva",
      "/todo-list/": "Lista de Tareas",
      "/sticky-notes/": "Notas Adhesivas",
      "/habit-tracker/": "Seguimiento de Hábitos",
      "/daily-planner/": "Planificador Diario",
      "/meeting-timer/": "Temporizador de Reuniones",
      "/pomodoro-timer/": "Temporizador Pomodoro",
      "/world-clock/": "Reloj Mundial",
      "/spin-the-wheel/": "Girar la Ruleta",
      "/coin-flip/": "Lanzar Moneda",
      "/dice-roller/": "Lanzador de Dados",
      "/random-picker/": "Selector Aleatorio",
      "/decision-maker/": "Tomador de Decisiones",
      "/team-picker/": "Selector de Equipos",
      "/age-calculator/": "Calculadora de Edad",
      "/bmi-calculator/": "Calculadora de IMC",
      "/calorie-calculator/": "Calculadora de Calorías",
      "/sleep-calculator/": "Calculadora de Sueño",
      "/typing-speed-test/": "Prueba de Velocidad de Escritura",
      "/currency-converter/": "Conversor de Moneda",
      "/compound-interest-calculator/": "Calculadora de Interés Compuesto",
      "/loan-calculator/": "Calculadora de Préstamos y EMI",
      "/mortgage-calculator/": "Calculadora de Hipoteca",
      "/invoice-generator/": "Generador de Facturas",
      "/discount-calculator/": "Calculadora de Descuentos",
      "/percentage-calculator/": "Calculadora de Porcentajes",
      "/gst-vat-calculator/": "Calculadora de IVA / GST",
      "/reverse-percentage-calculator/": "Calculadora de Porcentaje Inverso",
      "/discount-stacking-calculator/": "Calculadora de Descuentos Acumulados",
      "/percentage-difference-calculator/": "Calculadora de Diferencia Porcentual",
      "/price-increase-calculator/": "Calculadora de Aumento de Precio",
      "/pay-rise-calculator/": "Calculadora de Aumento Salarial",
      "/margin-vs-markup-calculator/": "Calculadora de Margen y Recargo",
      "/unit-price-calculator/": "Calculadora de Precio Unitario",
      "/rise-over-run-calculator/": "Calculadora de Pendiente",
      "/slope-grade-angle-calculator/": "Calculadora de Pendiente, Porcentaje y Ángulo",
      "/name-numerology-calculator/": "Calculadora de Numerología del Nombre",
      "/numerology-calculator/": "Calculadora de Numerología",
      "/lo-shu-grid-calculator/": "Calculadora de Cuadrícula Lo Shu",
      "/moon-sign-calculator/": "Calculadora de Signo Lunar",
      "/rising-sign-calculator/": "Calculadora de Ascendente",
      "/tarot-birth-card-calculator/": "Calculadora de Cartas de Nacimiento del Tarot",
      "/love-calculator/": "Calculadora del Amor por Nombres",
      "/flames-calculator/": "Calculadora FLAMES",
      "/magic-8-ball/": "Bola 8 Mágica",
      "/birthday-countdown-calculator/": "Cuenta Regresiva para tu Cumpleaños",
      "/tip-calculator/": "Calculadora de Propinas",
      "/random-number-generator/": "Generador de Números Aleatorios",
      "/blood-type-compatibility/": "Comprobador de Compatibilidad de Grupos Sanguíneos",
      "/privacy-policy-generator/": "Generador de Política de Privacidad",
      "/internet-speed-test/": "Prueba de Velocidad de Internet",
      "/keyboard-tester/": "Probador de Teclado",
      "/mouse-tester/": "Probador de Ratón",
      "/webcam-tester/": "Probador de Webcam",
      "/microphone-tester/": "Probador de Micrófono",
      "/dead-pixel-checker/": "Comprobador de Píxeles Muertos",
      "/monitor-color-test/": "Prueba de Color del Monitor",
      "/browser-info/": "Visor de Información del Navegador",
      "/viewport-size/": "Comprobador de Tamaño de Ventana"
    },
    "descs": {
      "/json-formatter/": "Valida, formatea, minifica e inspecciona JSON con control de sangría y una vista de árb…",
      "/json-compare/": "Pega el original en A y la nueva versión en B",
      "/xml-formatter/": "Formatea y valida XML online gratis",
      "/regex-tester/": "Prueba y depura expresiones regulares online en tiempo real",
      "/base64-encoder/": "Codifica y decodifica Base64 online de forma gratuita",
      "/url-encoder/": "Codifica o decodifica URLs y parámetros de consulta online de forma gratuita",
      "/hash-generator/": "Genera hashes criptográficos MD5, SHA-1, SHA-256 y SHA-512 online de forma gratuita",
      "/jwt-decoder/": "Decodifica e inspecciona cualquier token JWT al instante",
      "/uuid-generator/": "Genera identificadores UUID v4 criptográficamente seguros al instante",
      "/password-generator/": "Crea contraseñas aleatorias y seguras usando mayúsculas, minúsculas, números y símbolos",
      "/password-strength-checker/": "Comprueba la fortaleza de tu contraseña en tiempo real",
      "/ip-address-lookup/": "Busca la geolocalización, ISP, zona horaria y detalles de red de cualquier dirección IP…",
      "/html-beautifier/": "Formatea HTML desordenado en código limpio y sangrado, o comprímelo en una sola línea",
      "/json-to-yaml/": "Convierte entre JSON y YAML al instante",
      "/cron-expression-parser/": "Decodifica cualquier expresión cron en texto legible al instante",
      "/css-gradient-generator/": "Diseña gradientes CSS lineales y radiales visualmente",
      "/css-shadow-generator/": "Diseña efectos de box-shadow y text-shadow visualmente con controles deslizantes y una …",
      "/px-to-rem/": "Convierte valores de píxeles a unidades REM y REM de vuelta a píxeles",
      "/aspect-ratio-calculator/": "Calcula al instante la relación de aspecto a partir de cualquier ancho y alto",
      "/pdf-merge/": "Une varios PDF en uno desde tu navegador",
      "/pdf-split/": "Divide un PDF en varios archivos desde tu navegador",
      "/pdf-compress/": "Reduce el tamaño de un PDF desde tu navegador",
      "/rotate-pdf/": "Gira páginas de un PDF en tu navegador y guarda el cambio",
      "/organize-pdf/": "Reordena las páginas de un PDF en tu navegador",
      "/remove-pdf-pages/": "Borra páginas de un PDF en tu navegador",
      "/extract-pdf-pages/": "Elige páginas de un PDF y guárdalas como archivo nuevo en tu navegador",
      "/crop-pdf/": "Recorta los márgenes o bordes de cada página PDF introduciendo valores de recorte en pu…",
      "/add-page-numbers/": "Numera las páginas de un PDF en tu navegador",
      "/add-watermark/": "Estampa una marca de agua de texto personalizada en cada página de tu PDF",
      "/protect-pdf/": "Protege tu PDF con una contraseña para que solo los usuarios autorizados puedan abrirlo",
      "/unlock-pdf/": "Elimina la contraseña de un PDF protegido que sea tuyo",
      "/jpg-to-pdf/": "Junta imágenes JPG, PNG y WebP en un PDF desde tu navegador",
      "/pdf-to-jpg/": "Convierte páginas de un PDF en imágenes JPG, PNG o WebP desde tu navegador",
      "/ocr-pdf/": "Convierte PDF escaneados en texto editable desde el navegador",
      "/pdf-to-word/": "Convierte un PDF en un documento de Word editable",
      "/html-to-pdf/": "Pega código HTML en el editor, previsualízalo en vivo",
      "/scan-to-pdf/": "Combina múltiples fotos o imágenes escaneadas en un solo documento PDF",
      "/sign-pdf/": "Dibuja tu firma manuscrita en un lienzo e incrústala en tu PDF",
      "/edit-pdf/": "Superpone texto, rectángulos con borde o resaltados amarillos en cualquier página de un PDF",
      "/redact-pdf/": "Cubre texto o imagenes en tu PDF con rectangulos negros solidos",
      "/pdf-metadata-remover/": "Inspecciona las propiedades de tus documentos PDF, elige qué campos limpiar y descarga …",
      "/compare-pdf/": "Carga dos documentos PDF y visualiza sus páginas lado a lado",
      "/pdf-forms/": "Sube un PDF rellenable, completa los campos del formulario directamente en tu navegador…",
      "/pdf-security/": "Aplica restricciones de permisos detalladas a un PDF: controla la impresión, copia, edi…",
      "/optimize-pdf/": "Reduce el tamaño de tu PDF eliminando objetos sin referencias y, opcionalmente, borrand…",
      "/word-counter/": "Pega o escribe tu texto y al instante ve el recuento de palabras, caracteres, frases, p…",
      "/character-counter/": "Cuenta caracteres, palabras, líneas y bytes en tu texto al instante",
      "/text-case-converter/": "Convierte tu texto entre 10 formatos distintos al instante",
      "/text-diff-checker/": "Pega dos versiones de tu texto y ve al instante qué cambió",
      "/lorem-ipsum-generator/": "Genera texto de relleno Lorem Ipsum en segundos",
      "/fancy-text-generator/": "Transforma tu texto en 11 estilos Unicode elegantes — negrita, cursiva, script, doble t…",
      "/ascii-art-generator/": "Convierte cualquier texto en arte ASCII de letras de bloque grandes al instante",
      "/morse-code-converter/": "Convierte texto a código Morse y viceversa al instante",
      "/text-repeater/": "Repite cualquier palabra, frase u oración cualquier número de veces con un separador pe…",
      "/number-to-words/": "Convierte cualquier número en su equivalente en palabras inglesas al instante",
      "/roman-numeral-converter/": "Convierte cualquier entero (1–3",
      "/markdown-html/": "Convierte Markdown a HTML con vista previa en vivo",
      "/csv-to-sql/": "Convierte datos CSV a sentencias SQL INSERT al instante",
      "/camt053-to-csv/": "🔒 Los datos bancarios se procesan localmente en tu navegador",
      "/parquet-to-csv/": "🔒 Funciona en tu navegador — no se sube nada",
      "/csv-query/": "Sube un archivo CSV y consúltalo con SQL directamente en tu navegador",
      "/image-converter/": "Convierte imágenes entre PNG, JPG, WebP, BMP y más formatos online",
      "/image-compressor/": "Reduce el tamaño de archivos de imágenes PNG, JPG y WebP directamente en tu navegador",
      "/qr-code-generator/": "Genera códigos QR para URL, texto, WiFi, email y teléfono con vista previa en vivo",
      "/barcode-generator/": "Genera códigos Code 128, EAN-13, UPC-A o Code 39 gratis",
      "/timestamp-converter/": "Convierte timestamps Unix a fechas y horas legibles, o convierte fechas de vuelta a tim…",
      "/color-converter/": "Convierte colores entre los formatos HEX, RGB, HSL, CMYK y HSB al instante",
      "/screen-resolution/": "Detecta al instante tu resolución de pantalla actual, dimensiones del viewport, ratio d…",
      "/stopwatch/": "Cronómetro de precisión con temporizador de vueltas",
      "/countdown-timer/": "Configura cualquier cuenta regresiva desde segundos hasta horas",
      "/todo-list/": "Una lista de tareas sencilla y persistente que se guarda automáticamente en tu navegador",
      "/sticky-notes/": "Crea notas adhesivas digitales en tu navegador",
      "/habit-tracker/": "Crea y mantén hábitos diarios con una cuadrícula semanal visual",
      "/daily-planner/": "Organiza tu día con entradas de tareas basadas en el tiempo",
      "/meeting-timer/": "Crea una agenda cronometrada para tu reunión",
      "/pomodoro-timer/": "Mejora tu concentración con la técnica Pomodoro",
      "/world-clock/": "See the live current time in major cities across every time zone",
      "/spin-the-wheel/": "Introduce tus opciones (una por línea), gira la ruleta y deja que el azar decida",
      "/coin-flip/": "Lanza una moneda virtual para decidir entre cara o cruz",
      "/dice-roller/": "Lanza cualquier combinación de dados poliédricos — d4, d6, d8, d10, d12 o d20",
      "/random-picker/": "Pega una lista de elementos y selecciona aleatoriamente el número que quieras",
      "/decision-maker/": "¿No puedes elegir? Ingresa tus opciones y pulsa Decidir",
      "/team-picker/": "Divide cualquier grupo de personas en equipos aleatorios equilibrados",
      "/age-calculator/": "Encuentra tu edad exacta en años, meses y días a partir de tu fecha de nacimiento",
      "/bmi-calculator/": "Calcula tu Índice de Masa Corporal al instante con soporte para unidades métricas (kg/c…",
      "/calorie-calculator/": "Descubre exactamente cuántas calorías necesitas cada día",
      "/sleep-calculator/": "Despiértate descansado",
      "/typing-speed-test/": "Mide qué tan rápido puedes escribir con nuestra prueba de velocidad de escritura gratuita",
      "/currency-converter/": "Convierte entre más de 150 divisas con tipos de cambio actualizados al instante desde l…",
      "/compound-interest-calculator/": "Calcula cómo crece tu dinero con el interés compuesto",
      "/loan-calculator/": "Calcula tu cuota mensual EMI (Cuota Mensual Equivalente), el interés total pagado y el …",
      "/mortgage-calculator/": "Calcula tu cuota mensual de hipoteca con el desglose completo de capital e intereses",
      "/invoice-generator/": "Crea facturas PDF profesionales en segundos",
      "/discount-calculator/": "Calcula rápidamente el precio después de un descuento o trabaja hacia atrás para encont…",
      "/percentage-calculator/": "Resuelve cualquier problema de porcentaje al instante con cuatro modos de cálculo",
      "/gst-vat-calculator/": "Calcula el IVA/GST añadiendo o extrayendo impuestos de cualquier importe",
      "/reverse-percentage-calculator/": "Calcula el valor original antes de una subida, un descuento o el IVA",
      "/discount-stacking-calculator/": "Un 20 % de descuento más un 10 % no es un 30 % — es un 28 %, porque el segundo descuent…",
      "/percentage-difference-calculator/": "Compara dos números con la fórmula de diferencia porcentual, que trata ambos valores por igual",
      "/price-increase-calculator/": "Calcula el precio nuevo tras una subida porcentual, cuánto ha subido un precio en porce…",
      "/pay-rise-calculator/": "Introduce tu sueldo actual y el aumento como porcentaje, como importe o como nuevo salario",
      "/margin-vs-markup-calculator/": "Introduce un coste y un precio de venta para ver el beneficio, el margen bruto y el rec…",
      "/unit-price-calculator/": "Compara productos y formatos por lo que cuestan de verdad por kilo, litro o unidad",
      "/rise-over-run-calculator/": "Introduce la elevación y el recorrido, o dos puntos de una recta, para obtener la pendi…",
      "/slope-grade-angle-calculator/": "Convierte cualquier forma de expresar una pendiente en todas las demás: proporción 1:n,…",
      "/name-numerology-calculator/": "Descubre los números de destino, alma y personalidad de tu nombre",
      "/numerology-calculator/": "Introduce tu fecha de nacimiento y, si quieres, tu nombre para obtener tu camino de vid…",
      "/lo-shu-grid-calculator/": "Introduce tu fecha de nacimiento para crear tu cuadrícula Lo Shu",
      "/moon-sign-calculator/": "Descubre tu signo lunar con tu fecha, hora y lugar de nacimiento",
      "/rising-sign-calculator/": "Calcula tu ascendente y su grado exacto con tu fecha, hora exacta y lugar de nacimiento",
      "/tarot-birth-card-calculator/": "Introduce tu fecha de nacimiento para descubrir tus arcanos",
      "/love-calculator/": "Escribe dos nombres para ver vuestro porcentaje de amor",
      "/flames-calculator/": "Introduce dos nombres y juega al clásico FLAMES",
      "/magic-8-ball/": "Piensa una pregunta de sí o no y toca o agita la bola",
      "/birthday-countdown-calculator/": "Mira exactamente cuánto falta para el próximo cumpleaños, en vivo al segundo",
      "/tip-calculator/": "Calcula la propina exacta para cualquier importe y divídela entre varias personas",
      "/random-number-generator/": "Genera números verdaderamente aleatorios al instante usando valores criptográficamente …",
      "/blood-type-compatibility/": "Selecciona tu grupo sanguíneo para ver al instante a qué tipos puedes donar y de cuáles…",
      "/privacy-policy-generator/": "Genera al instante una política de privacidad personalizada para tu sitio web o aplicación",
      "/internet-speed-test/": "Mide la velocidad de descarga, subida y latencia de ping de tu conexión a internet dire…",
      "/keyboard-tester/": "Presiona cualquier tecla para verla iluminarse en el teclado visual",
      "/mouse-tester/": "Prueba cada botón y movimiento de tu ratón",
      "/webcam-tester/": "Prueba tu webcam con una vista previa en vivo directamente en tu navegador",
      "/microphone-tester/": "Prueba tu micrófono con un medidor de nivel de audio en tiempo real",
      "/dead-pixel-checker/": "Detecta píxeles muertos o atascados en tu monitor pasando por 8 pruebas de pantalla com…",
      "/monitor-color-test/": "Evalúa la precisión de color, suavidad de degradados, nitidez y uniformidad de tu monit…",
      "/browser-info/": "Ve todo sobre tu navegador, sistema operativo, pantalla y hardware en un solo lugar — n…",
      "/viewport-size/": "Ve las dimensiones actuales de tu ventana del navegador, resolución de pantalla, relaci…"
    }
  },
  "da": {
    "names": {
      "/json-formatter/": "JSON Formatter",
      "/json-compare/": "Sammenlign JSON",
      "/xml-formatter/": "XML Formatter",
      "/regex-tester/": "Regex Tester",
      "/base64-encoder/": "Base64 Encoder og Decoder",
      "/url-encoder/": "URL Encoder og Decoder",
      "/hash-generator/": "Hash Generator",
      "/jwt-decoder/": "JWT Dekoder",
      "/uuid-generator/": "UUID Generator",
      "/password-generator/": "Adgangskode Generator",
      "/password-strength-checker/": "Adgangskode Styrke Tjekker",
      "/ip-address-lookup/": "IP-adresse Opslag",
      "/html-beautifier/": "HTML Formaterer & Minifier",
      "/json-to-yaml/": "JSON til YAML Konverter",
      "/cron-expression-parser/": "Cron Udtryks Parser",
      "/css-gradient-generator/": "CSS Gradient Generator",
      "/css-shadow-generator/": "CSS Skygge Generator",
      "/px-to-rem/": "PX til REM Konverter",
      "/aspect-ratio-calculator/": "Billedforholdsberegner",
      "/pdf-merge/": "PDF Sammenføjning",
      "/pdf-split/": "Opdel PDF",
      "/pdf-compress/": "Komprimér PDF",
      "/rotate-pdf/": "Rotér PDF",
      "/organize-pdf/": "Organiser PDF",
      "/remove-pdf-pages/": "Slet Sider i PDF",
      "/extract-pdf-pages/": "Udtræk Sider fra PDF",
      "/crop-pdf/": "Beskær PDF-sider",
      "/add-page-numbers/": "Sidetal i PDF",
      "/add-watermark/": "Tilføj Vandmærke til PDF",
      "/protect-pdf/": "Beskyt PDF med Adgangskode",
      "/unlock-pdf/": "Lås PDF Op",
      "/jpg-to-pdf/": "JPG til PDF",
      "/pdf-to-jpg/": "PDF til JPG",
      "/ocr-pdf/": "OCR PDF",
      "/pdf-to-word/": "PDF til Word",
      "/html-to-pdf/": "Konverter HTML til PDF",
      "/scan-to-pdf/": "Scan til PDF",
      "/sign-pdf/": "Underskriv PDF",
      "/edit-pdf/": "Tildæk PDF",
      "/redact-pdf/": "Tildæk PDF",
      "/pdf-metadata-remover/": "Fjern PDF-metadata",
      "/compare-pdf/": "Sammenlign to PDF'er Side om Side",
      "/pdf-forms/": "Udfyld PDF-formularer",
      "/pdf-security/": "PDF-sikkerhed",
      "/optimize-pdf/": "Optimer og Komprimer PDF",
      "/word-counter/": "Ordtæller",
      "/character-counter/": "Tegntæller",
      "/text-case-converter/": "Tekst Store/Små Bogstaver Konverter",
      "/text-diff-checker/": "Tekst Forskels Checker",
      "/lorem-ipsum-generator/": "Lorem Ipsum Generator",
      "/fancy-text-generator/": "Fancy Tekst Generator",
      "/ascii-art-generator/": "ASCII Kunst Generator",
      "/morse-code-converter/": "Morsekode Konverter",
      "/text-repeater/": "Tekstgentagelse",
      "/number-to-words/": "Tal til Ord Konverter",
      "/roman-numeral-converter/": "Romertal Konverter",
      "/markdown-html/": "Markdown til HTML Konverter",
      "/csv-to-sql/": "CSV til SQL Konverter",
      "/camt053-to-csv/": "CAMT.053 til CSV",
      "/parquet-to-csv/": "Parquet til CSV",
      "/csv-query/": "CSV-forespørgselsværktøj",
      "/image-converter/": "Billedkonverter",
      "/image-compressor/": "Billedkomprimering",
      "/qr-code-generator/": "QR-kode Generator",
      "/barcode-generator/": "Stregkode Generator",
      "/timestamp-converter/": "Unix Timestamp Konverter",
      "/color-converter/": "Farvekonverter",
      "/screen-resolution/": "Skærmopløsning Checker",
      "/stopwatch/": "Stopur",
      "/countdown-timer/": "Nedtæller",
      "/todo-list/": "Opgaveliste",
      "/sticky-notes/": "Sticky Notes",
      "/habit-tracker/": "Vanetracker",
      "/daily-planner/": "Daglig Planlægger",
      "/meeting-timer/": "Mødetimer",
      "/pomodoro-timer/": "Pomodoro Timer",
      "/world-clock/": "Verdensur",
      "/spin-the-wheel/": "Drej Hjulet",
      "/coin-flip/": "Møntskast",
      "/dice-roller/": "Terningkaster",
      "/random-picker/": "Tilfældig Vælger",
      "/decision-maker/": "Beslutningstageren",
      "/team-picker/": "Holdvælger",
      "/age-calculator/": "Aldersberegner",
      "/bmi-calculator/": "BMI Beregner",
      "/calorie-calculator/": "Kaloriebehov Beregner",
      "/sleep-calculator/": "Søvnberegner",
      "/typing-speed-test/": "Skrivetestigheds Test",
      "/currency-converter/": "Valutaomregner",
      "/compound-interest-calculator/": "Renters Rente Beregner",
      "/loan-calculator/": "Lånberegner",
      "/mortgage-calculator/": "Realkreditberegner",
      "/invoice-generator/": "Faktura Generator",
      "/discount-calculator/": "Rabatberegner",
      "/percentage-calculator/": "Procentberegner",
      "/gst-vat-calculator/": "Moms / GST Beregner",
      "/reverse-percentage-calculator/": "Omvendt Procentberegner",
      "/discount-stacking-calculator/": "Rabatberegner",
      "/percentage-difference-calculator/": "Procentforskelberegner",
      "/price-increase-calculator/": "Prisforhøjelsesberegner",
      "/pay-rise-calculator/": "Lønstigningsberegner",
      "/margin-vs-markup-calculator/": "Margin",
      "/unit-price-calculator/": "Enhedsprisberegner",
      "/rise-over-run-calculator/": "Hældningsberegner",
      "/slope-grade-angle-calculator/": "Hældning, Stigningsprocent og Vinkel Beregner",
      "/name-numerology-calculator/": "Navnenumerologi",
      "/numerology-calculator/": "Numerologi-beregner",
      "/lo-shu-grid-calculator/": "Lo Shu-gitterberegner",
      "/moon-sign-calculator/": "Månetegnsberegner",
      "/rising-sign-calculator/": "Ascendantberegner",
      "/tarot-birth-card-calculator/": "Tarot",
      "/love-calculator/": "Kærlighedsberegner med navne",
      "/flames-calculator/": "FLAMES-beregner",
      "/magic-8-ball/": "Magic 8 Ball",
      "/birthday-countdown-calculator/": "Fødselsdagsnedtælling",
      "/tip-calculator/": "Drikkepenge Beregner",
      "/random-number-generator/": "Tilfældig Tal Generator",
      "/blood-type-compatibility/": "Blodtypekompatibilitetstjekker",
      "/privacy-policy-generator/": "Generator til Privatlivspolitik",
      "/internet-speed-test/": "Internethastighed Test",
      "/keyboard-tester/": "Tastaturtest",
      "/mouse-tester/": "Musetest",
      "/webcam-tester/": "Webkameratest",
      "/microphone-tester/": "Mikrofon Test",
      "/dead-pixel-checker/": "Dødpixel Tjekker",
      "/monitor-color-test/": "Skærm Farvetest",
      "/browser-info/": "Browser Info Fremviser",
      "/viewport-size/": "Viewport Størrelse Tjekker"
    },
    "descs": {
      "/json-formatter/": "Validér, formatér, minificér og undersøg JSON med indrykningskontrol og en sammenklappe…",
      "/json-compare/": "Indsæt den oprindelige i A og den nye version i B",
      "/xml-formatter/": "Formater og valider XML online gratis",
      "/regex-tester/": "Test og fejlret regulære udtryk online i realtid",
      "/base64-encoder/": "Kodér og dekodér Base64 online gratis",
      "/url-encoder/": "Kodér eller dekodér URL'er og forespørgselsparametre online gratis",
      "/hash-generator/": "Generer kryptografiske hashes MD5, SHA-1, SHA-256 og SHA-512 online gratis",
      "/jwt-decoder/": "Dekod og inspicér ethvert JWT-token øjeblikkeligt",
      "/uuid-generator/": "Generer kryptografisk sikre UUID v4 identifikatorer øjeblikkeligt",
      "/password-generator/": "Opret stærke, tilfældige adgangskoder med store bogstaver, små bogstaver, tal og symboler",
      "/password-strength-checker/": "Tjek din adgangskodes styrke i realtid",
      "/ip-address-lookup/": "Slå geolokalisering, ISP, tidszone og netværksdetaljer for enhver IP-adresse op øjeblikkeligt",
      "/html-beautifier/": "Formater rodet HTML til ren, indenteret kode eller komprimer den til én linje",
      "/json-to-yaml/": "Konverter mellem JSON og YAML øjeblikkeligt",
      "/cron-expression-parser/": "Afkod ethvert cron-udtryk til læsbar tekst øjeblikkeligt",
      "/css-gradient-generator/": "Design lineære og radiale CSS-gradienter visuelt",
      "/css-shadow-generator/": "Design box-shadow og text-shadow effekter visuelt med skydelister og live forhåndsvisning",
      "/px-to-rem/": "Konverter pixelværdier til REM-enheder og REM tilbage til pixels",
      "/aspect-ratio-calculator/": "Beregn øjeblikkeligt billedforholdet ud fra enhver bredde og højde",
      "/pdf-merge/": "Saml flere PDF-filer til én i din browser",
      "/pdf-split/": "Opdel en PDF i flere filer i din browser",
      "/pdf-compress/": "Gør en PDF mindre i din browser",
      "/rotate-pdf/": "Rotér PDF-sider i din browser, og gem ændringen",
      "/organize-pdf/": "Omarrangér siderne i en PDF i din browser",
      "/remove-pdf-pages/": "Slet sider fra en PDF i din browser",
      "/extract-pdf-pages/": "Vælg sider fra en PDF, og gem dem som en ny fil i din browser",
      "/crop-pdf/": "Trim margener eller rammer fra alle PDF-sider ved at indtaste beskæringsværdier i PDF-p…",
      "/add-page-numbers/": "Sæt sidetal på en PDF i din browser",
      "/add-watermark/": "Stempel et brugerdefineret tekstvandmærke på hver side af din PDF",
      "/protect-pdf/": "Sikr din PDF med en adgangskode så kun autoriserede brugere kan åbne den",
      "/unlock-pdf/": "Fjern adgangskoden fra en beskyttet PDF du ejer",
      "/jpg-to-pdf/": "Saml JPG-, PNG- og WebP-billeder i én PDF i din browser",
      "/pdf-to-jpg/": "Lav PDF-sider om til JPG-, PNG- eller WebP-billeder i din browser",
      "/ocr-pdf/": "Brug Optisk Tegngenkendelse (OCR) til at udtrække tekst fra scannede PDF-filer eller billeder",
      "/pdf-to-word/": "Konvertér PDF til et redigerbart Word-dokument",
      "/html-to-pdf/": "Indsæt HTML-kode i editoren, se live forhåndsvisning",
      "/scan-to-pdf/": "Kombiner flere scannede fotos eller billeder til ét PDF-dokument",
      "/sign-pdf/": "Tegn din håndskrevne underskrift på et lærred og integrer den i din PDF",
      "/edit-pdf/": "Læg tekst, kantede rektangler eller gule fremhævninger oven på enhver PDF-side",
      "/redact-pdf/": "Dæk tekst eller billeder i din PDF med solide sorte rektangler",
      "/pdf-metadata-remover/": "Inspicér almindelige PDF-dokumentegenskaber, vælg hvilke felter der skal ryddes, og dow…",
      "/compare-pdf/": "Indlæs to PDF-dokumenter og se siderne side om side",
      "/pdf-forms/": "Upload en udfyldbar PDF, udfyld formularfelterne direkte i din browser — tekstfelter, a…",
      "/pdf-security/": "Anvend detaljerede tilladelsesrestriktioner på en PDF: kontrollér udskrivning, kopierin…",
      "/optimize-pdf/": "Reducer din PDF ved at fjerne objekter uden referencer og eventuelt slette metadata",
      "/word-counter/": "Tæl ord, tegn, sætninger, afsnit og unikke ord i din tekst øjeblikkeligt",
      "/character-counter/": "Tæl tegn, ord, linjer og bytes i din tekst øjeblikkeligt",
      "/text-case-converter/": "Konverter din tekst til ethvert format øjeblikkeligt — store bogstaver, små bogstaver, …",
      "/text-diff-checker/": "Sammenlign to blokke af tekst og se forskelle fremhævet øjeblikkeligt",
      "/lorem-ipsum-generator/": "Generer Lorem Ipsum pladsholdertekst på sekunder",
      "/fancy-text-generator/": "Transformer din tekst til 11 smarte Unicode-stilarter — fed, kursiv, script, dobbelt st…",
      "/ascii-art-generator/": "Konverter enhver tekst til store blokbogstav ASCII-kunst øjeblikkeligt",
      "/morse-code-converter/": "Konverter tekst til morsekode og tilbage øjeblikkeligt",
      "/text-repeater/": "Gentag et vilkårligt ord, sætning eller tekststykke et valgfrit antal gange med en brug…",
      "/number-to-words/": "Konverter ethvert tal til dets engelske ordækvivalent øjeblikkeligt",
      "/roman-numeral-converter/": "Konverter et vilkårligt heltal (1–3",
      "/markdown-html/": "Konverter Markdown til HTML med live forhåndsvisning",
      "/csv-to-sql/": "Konverter CSV-data til SQL INSERT-sætninger øjeblikkeligt",
      "/camt053-to-csv/": "🔒 Bankdata behandles lokalt i din browser",
      "/parquet-to-csv/": "🔒 Kører i din browser — intet uploades",
      "/csv-query/": "Upload en CSV-fil og forespørg den med SQL direkte i din browser",
      "/image-converter/": "Konverter billeder mellem PNG, JPG, WebP, BMP og andre formater online",
      "/image-compressor/": "Reducer billedfilstørrelser direkte i din browser",
      "/qr-code-generator/": "Opret QR-koder øjeblikkeligt til enhver tekst, URL, e-mailadresse eller telefonnummer",
      "/barcode-generator/": "Lav Code 128-, EAN-13-, UPC-A- eller Code 39-stregkoder gratis",
      "/timestamp-converter/": "Konvertér Unix-tidsstempler til læsbare datoer og tidspunkter, eller konvertér datoer t…",
      "/color-converter/": "Konverter farver mellem HEX, RGB, HSL, CMYK og HSB-formater øjeblikkeligt",
      "/screen-resolution/": "Registrer øjeblikkeligt din nuværende skærmopløsning, viewport-dimensioner, enhedspixel…",
      "/stopwatch/": "Præcisionsstopur med rundetimer",
      "/countdown-timer/": "Indstil en nedtælling fra sekunder til timer",
      "/todo-list/": "En enkel, vedvarende opgaveliste der gemmes automatisk i din browser",
      "/sticky-notes/": "Opret digitale sticky notes i din browser",
      "/habit-tracker/": "Opbyg og vedligehold daglige vaner med et visuelt ugentligt gitter",
      "/daily-planner/": "Planlæg din dag med tidsbaserede opgaveindtastninger",
      "/meeting-timer/": "Opret en tidsstyret dagsorden til dit møde",
      "/pomodoro-timer/": "Boost dit fokus med Pomodoro-teknikken",
      "/world-clock/": "See the live current time in major cities across every time zone",
      "/spin-the-wheel/": "Indtast dine muligheder (én pr",
      "/coin-flip/": "Kast en virtuel mønt for at afgøre mellem plat eller krone",
      "/dice-roller/": "Kast enhver kombination af polyedriske terninger — d4, d6, d8, d10, d12 eller d20",
      "/random-picker/": "Indsæt en liste med elementer og vælg tilfældigt det antal du ønsker",
      "/decision-maker/": "Kan du ikke vælge? Indtast dine muligheder og tryk på Beslut",
      "/team-picker/": "Del en hvilken som helst gruppe op i balancerede tilfældige hold",
      "/age-calculator/": "Find din nøjagtige alder i år, måneder og dage fra din fødselsdato",
      "/bmi-calculator/": "Beregn BMI med det samme og se kategori, sundt vægtinterval og en tydelig forklaring på…",
      "/calorie-calculator/": "Beregn dit daglige kaloriebehov baseret på din alder, vægt, højde og aktivitetsniveau",
      "/sleep-calculator/": "Vågn op udhvilet. Søvnberegneren bruger 90-minutters søvncyklusser til at foreslå ideel…",
      "/typing-speed-test/": "Mål din skrivetestighed i ord per minut (WPM) og nøjagtighed",
      "/currency-converter/": "Omregn mellem over 150 valutaer med øjeblikkeligt opdaterede valutakurser fra open",
      "/compound-interest-calculator/": "Beregn hvordan dine penge vokser med renters rente",
      "/loan-calculator/": "Beregn din månedlige lånebetaling med komplet opdeling af afdrag og renter",
      "/mortgage-calculator/": "Beregn boliglån med live-resultater for månedlig ydelse, renter og samlet betaling",
      "/invoice-generator/": "Opret professionelle PDF-fakturaer på sekunder",
      "/discount-calculator/": "Beregn hurtigt prisen efter en rabat, eller arbejd baglæns for at finde rabatprocenten",
      "/percentage-calculator/": "Beregn hvad procent et tal er af et andet, find procentvise stigninger og fald, og løs …",
      "/gst-vat-calculator/": "Beregn moms/GST ved at tilføje eller fratrække skat fra ethvert beløb",
      "/reverse-percentage-calculator/": "Find den oprindelige værdi før en procentstigning, en rabat eller moms blev lagt på",
      "/discount-stacking-calculator/": "20 % rabat plus 10 % er ikke 30 % — det er 28 %, fordi den anden rabat beregnes af den …",
      "/percentage-difference-calculator/": "Sammenlign to tal med formlen for procentforskel, som behandler begge værdier ens",
      "/price-increase-calculator/": "Beregn den nye pris efter en procentvis stigning, hvor mange procent en pris er steget,…",
      "/pay-rise-calculator/": "Indtast din nuværende løn og lønstigningen som procent, som beløb eller som ny løn",
      "/margin-vs-markup-calculator/": "Indtast kostpris og salgspris for at få fortjeneste, margin (dækningsgrad) og avance på…",
      "/unit-price-calculator/": "Sammenlign varer og pakkestørrelser på det, de reelt koster pr",
      "/rise-over-run-calculator/": "Indtast stigningen og den vandrette afstand, eller to punkter på en linje, og få hældni…",
      "/slope-grade-angle-calculator/": "Omregn en hældning fra én skrivemåde til alle de andre: forhold 1:n, decimaltal, procen…",
      "/name-numerology-calculator/": "Find skæbnetal, sjælstal og personlighedstal i dit navn",
      "/numerology-calculator/": "Indtast din fødselsdato og eventuelt dit navn, og få livstal, fødselsdagstal, personlig…",
      "/lo-shu-grid-calculator/": "Indtast din fødselsdato for at lave dit Lo Shu-gitter",
      "/moon-sign-calculator/": "Find dit månetegn ud fra fødselsdato, tidspunkt og sted",
      "/rising-sign-calculator/": "Beregn din ascendant og præcise grad ud fra fødselsdato, nøjagtigt tidspunkt og fødested",
      "/tarot-birth-card-calculator/": "Indtast din fødselsdato for at finde dine tarot-fødselskort",
      "/love-calculator/": "Skriv to navne for at få jeres kærlighedsprocent",
      "/flames-calculator/": "Indtast to navne og spil den klassiske FLAMES-leg",
      "/magic-8-ball/": "Tænk på et ja/nej-spørgsmål, og tryk på eller ryst kuglen",
      "/birthday-countdown-calculator/": "Se præcis hvor længe der er til næste fødselsdag, live på sekundet",
      "/tip-calculator/": "Beregn det nøjagtige drikkepenge beløb for enhver regning og del det mellem flere personer",
      "/random-number-generator/": "Generer kryptografisk sikre tilfældige tal inden for ethvert interval",
      "/blood-type-compatibility/": "Vælg din blodtype for øjeblikkeligt at se, hvilke blodtyper du kan donere til og modtage fra",
      "/privacy-policy-generator/": "Generér øjeblikkeligt en tilpasset privatlivspolitik til dit websted eller din app",
      "/internet-speed-test/": "Test din internetforbindelse med tydelige faser for ping, download og upload",
      "/keyboard-tester/": "Tryk på en tast for at se den lyse op på det visuelle tastatur nedenfor",
      "/mouse-tester/": "Test alle knapper og bevægelser på din mus",
      "/webcam-tester/": "Test dit webkamera med en live-visning direkte i din browser",
      "/microphone-tester/": "Test din mikrofon med en realtids lydnivåmåler",
      "/dead-pixel-checker/": "Registrer døde eller fastsiddende pixels på din skærm ved at gennemgå 8 fuld-skærms tes…",
      "/monitor-color-test/": "Evaluer din skærms farvenøjagtighed, gradientglathed, skarphed og ensartethed med 8 pro…",
      "/browser-info/": "Se alt om din browser, operativsystem, skærm og hardware ét sted — browsernavn, version…",
      "/viewport-size/": "Se dine aktuelle browser-viewport-dimensioner, skærmopløsning, enhedspixelforhold, orie…"
    }
  }
};

  function getToolName(tool, lang) {
    if (!tool) return '';
    var l = lang || currentPageLang();
    if (TOOL_I18N[l] && TOOL_I18N[l].names && TOOL_I18N[l].names[tool.u]) {
      return TOOL_I18N[l].names[tool.u];
    }
    return tool.n || '';
  }

  function getToolDesc(tool, lang) {
    if (!tool) return '';
    var l = lang || currentPageLang();
    if (TOOL_I18N[l] && TOOL_I18N[l].descs && TOOL_I18N[l].descs[tool.u]) {
      return TOOL_I18N[l].descs[tool.u];
    }
    return tool.d || '';
  }

  function getToolCategory(cat, lang) {
    if (!cat) return '';
    var l = lang || currentPageLang();
    if (CATEGORY_I18N[l] && CATEGORY_I18N[l][cat]) {
      return CATEGORY_I18N[l][cat];
    }
    return cat;
  }


  var POPULAR = [
    '/json-formatter/', '/pdf-merge/', '/image-compressor/',
    '/qr-code-generator/', '/word-counter/', '/password-generator/',
    '/currency-converter/', '/age-calculator/'
  ];

  var NON_LOCALIZED_PATHS = {};

  /* BEGIN generated: localized slugs (tools/tool-pages/build.js) */
  var LOCALIZED_SLUGS = {
    "/calculators/": {
      "es": "/es/calculators/",
      "da": "/da/calculators/"
    },
    "/numerology-astrology/": {
      "es": "/es/numerology-astrology/",
      "da": "/da/numerology-astrology/"
    },
    "/fun-relationships/": {
      "es": "/es/fun-relationships/",
      "da": "/da/fun-relationships/"
    },
    "/date-time/": {
      "es": "/es/date-time/",
      "da": "/da/date-time/"
    }
  };
  /* END generated: localized slugs */

  function currentPageLang() {
    var path = window.location.pathname;
    if (path.startsWith('/es/') || path === '/es') return 'es';
    if (path.startsWith('/da/') || path === '/da') return 'da';
    return 'en';
  }

  function splitLocalPath(rawPath) {
    var match = String(rawPath || '').match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
    return {
      path: match ? match[1] : rawPath,
      suffix: (match && match[2] ? match[2] : '') + (match && match[3] ? match[3] : '')
    };
  }

  function removeLocalePrefix(path) {
    var cleanPath = path.replace(/^\/(es|da)(\/|$)/, '/');
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
    return cleanPath || '/';
  }

  /* Reverse lookup for pages whose Spanish/Danish URL uses a translated slug. */
  var ENGLISH_PATH_FOR = {};
  Object.keys(LOCALIZED_SLUGS).forEach(function (en) {
    ENGLISH_PATH_FOR[LOCALIZED_SLUGS[en].es] = en;
    ENGLISH_PATH_FOR[LOCALIZED_SLUGS[en].da] = en;
  });

  function englishPathFor(path) {
    var withSlash = path.charAt(path.length - 1) === '/' ? path : path + '/';
    return ENGLISH_PATH_FOR[withSlash] || removeLocalePrefix(path);
  }

  function localizedPathForLang(rawPath, targetLang, fallbackHomeForMissing) {
    if (!rawPath || rawPath.charAt(0) !== '/' || rawPath.startsWith('/assets/')) return rawPath;
    var parts = splitLocalPath(rawPath);
    var cleanPath = englishPathFor(parts.path);

    if (targetLang === 'en') return cleanPath + parts.suffix;
    if (LOCALIZED_SLUGS[cleanPath]) return LOCALIZED_SLUGS[cleanPath][targetLang] + parts.suffix;
    if (NON_LOCALIZED_PATHS[cleanPath]) {
      return (fallbackHomeForMissing ? '/' + targetLang + '/' : cleanPath) + parts.suffix;
    }
    if (cleanPath === '/') return '/' + targetLang + '/' + parts.suffix;
    return '/' + targetLang + cleanPath + parts.suffix;
  }

  function localizeSharedNavigation(container) {
    var lang = currentPageLang();
    if (lang === 'en' || !container) return;
    container.querySelectorAll('a[href^="/"]').forEach(function (link) {
      link.setAttribute('href', localizedPathForLang(link.getAttribute('href'), lang, false));
    });
  }

  /* ===== FAVORITE TOOLS DATA MANAGEMENT ===== */
  function getFavoritesRaw() {
    try {
      var raw = JSON.parse(localStorage.getItem('ac:fav') || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch (_e) {
      return [];
    }
  }

  function getCanonicalToolPath(rawUrlOrPath) {
    if (!rawUrlOrPath || typeof rawUrlOrPath !== 'string') return '';
    try {
      var pathname = rawUrlOrPath.trim();
      if (pathname.indexOf('://') !== -1 || pathname.startsWith('//')) {
        pathname = new URL(pathname, (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : 'https://anyconverter.io').pathname;
      }
      pathname = splitLocalPath(pathname).path;
      pathname = pathname.replace(/index\.html?$/i, '');
      var enPath = englishPathFor(pathname);
      if (enPath.length > 1 && !enPath.endsWith('/')) {
        enPath += '/';
      }
      return enPath;
    } catch (_e) {
      var clean = removeLocalePrefix(rawUrlOrPath);
      clean = splitLocalPath(clean).path.replace(/index\.html?$/i, '');
      if (clean.length > 1 && !clean.endsWith('/')) clean += '/';
      return clean;
    }
  }

  function getFavoritesList() {
    var rawList = getFavoritesRaw();
    var lang = currentPageLang();
    var list = [];
    var seen = {};

    rawList.forEach(function (item) {
      if (!item) return;
      var canon = getCanonicalToolPath(item.u || item.url || item.path);
      if (!canon || seen[canon]) return;
      seen[canon] = true;

      var toolMeta = TOOLS.find(function (t) { return t.u === canon; });
      var toolName = toolMeta ? getToolName(toolMeta, lang) : (item.name || canon.replace(/\//g, ' ').trim());
      var toolDesc = toolMeta ? getToolDesc(toolMeta, lang) : '';
      var toolIcon = toolMeta ? toolMeta.i : (item.icon || '/assets/img/icon-json.svg');
      var toolCat  = toolMeta ? toolMeta.c : (item.cat || 'Tool');
      var localizedUrl = localizedPathForLang(canon, lang, false);

      list.push({
        n: toolName,
        u: canon,
        d: toolDesc,
        i: toolIcon,
        c: toolCat,
        localizedUrl: localizedUrl
      });
    });

    return list;
  }

  function isFavoriteTool(canonPath) {
    if (!canonPath) return false;
    var normTarget = getCanonicalToolPath(canonPath);
    var rawList = getFavoritesRaw();
    return rawList.some(function (item) {
      if (!item) return false;
      var c = getCanonicalToolPath(item.u || item.url || item.path);
      return c === normTarget;
    });
  }

  function toggleFavoriteTool(canonPath, toolName) {
    if (!canonPath) return false;
    var normCanon = getCanonicalToolPath(canonPath);
    if (!normCanon) return false;
    var rawList = getFavoritesRaw();
    var existingIdx = -1;
    for (var i = 0; i < rawList.length; i++) {
      var c = getCanonicalToolPath(rawList[i].u || rawList[i].url || rawList[i].path);
      if (c === normCanon) {
        existingIdx = i;
        break;
      }
    }

    var isNowFav = false;
    if (existingIdx !== -1) {
      rawList.splice(existingIdx, 1);
      isNowFav = false;
    } else {
      var meta = TOOLS.find(function (t) { return t.u === normCanon; });
      rawList.unshift({
        u: normCanon,
        name: toolName || (meta ? getToolName(meta, currentPageLang()) : normCanon),
        icon: meta ? meta.i : '/assets/img/icon-json.svg',
        cat: meta ? meta.c : 'Tool',
        ts: Date.now()
      });
      isNowFav = true;
    }

    try {
      localStorage.setItem('ac:fav', JSON.stringify(rawList));
    } catch (_e) {}

    try {
      window.dispatchEvent(new CustomEvent('ac:favorites-updated', {
        detail: { canonPath: normCanon, isFavorite: isNowFav }
      }));
    } catch (_e) {}

    return isNowFav;
  }

  function updateFavoriteBtnState(btn, isFav, t) {
    if (!btn) return;
    var iconSpan = btn.querySelector('span[aria-hidden="true"]');
    var textSpan = btn.querySelector('span:not([aria-hidden="true"])');
    btn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
    if (isFav) {
      btn.classList.add('is-favorited');
      btn.setAttribute('aria-label', t.removeFavoriteLabel || 'Remove tool from favorites');
      btn.setAttribute('title', (t.removeFavorite || 'Remove from favorites') + ' (Alt+F)');
      if (iconSpan) iconSpan.textContent = '★';
      if (textSpan) textSpan.textContent = t.favorited || 'Favorited';
    } else {
      btn.classList.remove('is-favorited');
      btn.setAttribute('aria-label', t.favoriteLabel || 'Add tool to favorites');
      btn.setAttribute('title', (t.favorite || 'Add to Favorites') + ' (Alt+F)');
      if (iconSpan) iconSpan.textContent = '☆';
      if (textSpan) textSpan.textContent = t.favorite || 'Add to Favorites';
    }
  }

  /* ===== RECENTLY USED TOOLS DATA MANAGEMENT (RING BUFFER) ===== */
  var MAX_RECENTS = 8;

  function getRecentsRaw() {
    try {
      var raw = JSON.parse(localStorage.getItem('ac:recents') || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch (_e) {
      return [];
    }
  }

  function getRecentsList() {
    var rawList = getRecentsRaw();
    var lang = currentPageLang();
    var list = [];
    var seen = {};

    rawList.forEach(function (item) {
      if (!item) return;
      var canon = getCanonicalToolPath(item.u || item.url || item.path);
      if (!canon || seen[canon]) return;
      seen[canon] = true;

      var toolMeta = TOOLS.find(function (t) { return t.u === canon; });
      var toolName = toolMeta ? getToolName(toolMeta, lang) : (item.name || canon.replace(/\//g, ' ').trim());
      var toolDesc = toolMeta ? getToolDesc(toolMeta, lang) : '';
      var toolIcon = toolMeta ? toolMeta.i : (item.icon || '/assets/img/icon-json.svg');
      var toolCat  = toolMeta ? toolMeta.c : (item.cat || 'Tool');
      var localizedUrl = localizedPathForLang(canon, lang, false);

      list.push({
        n: toolName,
        u: canon,
        d: toolDesc,
        i: toolIcon,
        c: toolCat,
        ts: item.ts || 0,
        localizedUrl: localizedUrl
      });
    });

    return list.slice(0, MAX_RECENTS);
  }

  function recordRecentTool(rawPath) {
    if (!rawPath) return;
    var canon = getCanonicalToolPath(rawPath);
    if (!canon || canon === '/' || canon === '') return;

    var isKnownTool = TOOLS.some(function (t) { return t.u === canon; });
    if (!isKnownTool) return;

    var rawList = getRecentsRaw();
    var existingIdx = -1;
    for (var i = 0; i < rawList.length; i++) {
      if (rawList[i]) {
        var c = getCanonicalToolPath(rawList[i].u || rawList[i].url || rawList[i].path);
        if (c === canon) {
          existingIdx = i;
          break;
        }
      }
    }

    if (existingIdx !== -1) {
      rawList.splice(existingIdx, 1);
    }
    rawList.unshift({
      u: canon,
      ts: Date.now()
    });

    if (rawList.length > MAX_RECENTS) {
      rawList = rawList.slice(0, MAX_RECENTS);
    }

    try {
      localStorage.setItem('ac:recents', JSON.stringify(rawList));
    } catch (_e) {}

    try {
      window.dispatchEvent(new CustomEvent('ac:recents-updated', {
        detail: { canonPath: canon, recents: rawList }
      }));
    } catch (_e) {}
  }

  function clearRecents() {
    try {
      localStorage.removeItem('ac:recents');
    } catch (_e) {}

    try {
      window.dispatchEvent(new CustomEvent('ac:recents-updated', {
        detail: { canonPath: null, recents: [] }
      }));
    } catch (_e) {}
  }

  function removeRecentTool(rawPath) {
    if (!rawPath) return;
    var canon = getCanonicalToolPath(rawPath);
    var rawList = getRecentsRaw();
    var filtered = rawList.filter(function (item) {
      if (!item) return false;
      return getCanonicalToolPath(item.u || item.url || item.path) !== canon;
    });

    try {
      localStorage.setItem('ac:recents', JSON.stringify(filtered));
    } catch (_e) {}

    try {
      window.dispatchEvent(new CustomEvent('ac:recents-updated', {
        detail: { canonPath: canon, recents: filtered }
      }));
    } catch (_e) {}
  }

  function initToolPageActions() {
    const hasToolLayout = document.querySelector('.tool-wrapper, .tool-card, .tool-container, .tool-zone, .dc-root');
    if (!hasToolLayout) return;

    if (typeof window !== 'undefined' && window.location) {
      recordRecentTool(window.location.pathname);
    }

    const hero = document.querySelector('.hero');
    const breadcrumb = document.querySelector('.breadcrumb, nav[aria-label="Breadcrumb"], nav[aria-label="breadcrumbs"]');
    const actionHost = breadcrumb || hero;
    if (!actionHost || actionHost.querySelector('.tool-page-actions')) return;

    const actions = document.createElement('div');
    actions.className = 'tool-page-actions';
    const lang = currentPageLang();
    const actionCopy = {
      en: {
        related: 'Related Tools',
        share: 'Share',
        copy: 'Copy Link',
        favorite: 'Add to Favorites',
        favorited: 'Favorited',
        removeFavorite: 'Remove from favorites',
        removeFavoriteLabel: 'Remove tool from favorites',
        relatedLabel: 'Go to related tools section',
        shareLabel: 'Share this tool',
        copyLabel: 'Copy tool link',
        favoriteLabel: 'Add tool to favorites',
        tryText: 'Try {tool} on AnyConverter',
        relatedMissing: 'Related tools section is not available on this page.',
        shareOpened: 'Share dialog opened.',
        shareFallback: 'Share is not available on this device. Link copied instead.',
        shareIncomplete: 'Share was not completed.',
        copied: 'Tool link copied to clipboard.',
        added: 'Added to favorites.',
        removed: 'Removed from favorites.',
        exists: 'Already in favorites.'
      },
      es: {
        related: 'Herramientas relacionadas',
        share: 'Compartir',
        copy: 'Copiar enlace',
        favorite: 'Agregar a favoritos',
        favorited: 'En favoritos',
        removeFavorite: 'Eliminar de favoritos',
        removeFavoriteLabel: 'Eliminar herramienta de favoritos',
        relatedLabel: 'Ir a la seccion de herramientas relacionadas',
        shareLabel: 'Compartir esta herramienta',
        copyLabel: 'Copiar enlace de la herramienta',
        favoriteLabel: 'Agregar herramienta a favoritos',
        tryText: 'Prueba {tool} en AnyConverter',
        relatedMissing: 'La seccion de herramientas relacionadas no esta disponible en esta pagina.',
        shareOpened: 'Dialogo para compartir abierto.',
        shareFallback: 'Compartir no esta disponible en este dispositivo. Se copio el enlace.',
        shareIncomplete: 'No se completo la accion de compartir.',
        copied: 'Enlace de la herramienta copiado.',
        added: 'Agregado a favoritos.',
        removed: 'Eliminado de favoritos.',
        exists: 'Ya esta en favoritos.'
      },
      da: {
        related: 'Relaterede værktøjer',
        share: 'Del',
        copy: 'Kopiér link',
        favorite: 'Føj til favoritter',
        favorited: 'Favorit',
        removeFavorite: 'Fjern fra favoritter',
        removeFavoriteLabel: 'Fjern værktøj fra favoritter',
        relatedLabel: 'Gå til relaterede værktøjer',
        shareLabel: 'Del dette værktøj',
        copyLabel: 'Kopiér værktøjslink',
        favoriteLabel: 'Føj værktøj til favoritter',
        tryText: 'Prøv {tool} på AnyConverter',
        relatedMissing: 'Sektionen med relaterede værktøjer er ikke tilgængelig på denne side.',
        shareOpened: 'Delingsdialog åbnet.',
        shareFallback: 'Deling er ikke tilgængelig på denne enhed. Linket blev kopieret i stedet.',
        shareIncomplete: 'Deling blev ikke gennemført.',
        copied: 'Værktøjslink kopieret.',
        added: 'Føjet til favoritter.',
        removed: 'Fjernet fra favoritter.',
        exists: 'Findes allerede i favoritter.'
      }
    };
    const t = actionCopy[lang] || actionCopy.en;
    actions.innerHTML = `
      <button type="button" class="ac-btn tool-page-action-btn" data-action="related" aria-label="${t.relatedLabel}">
        <span aria-hidden="true">▦</span>
        <span>${t.related}</span>
      </button>
      <button type="button" class="ac-btn tool-page-action-btn" data-action="share" aria-label="${t.shareLabel}">
        <span aria-hidden="true">↗</span>
        <span>${t.share}</span>
      </button>
      <button type="button" class="ac-btn tool-page-action-btn" data-action="copylink" aria-label="${t.copyLabel}">
        <span aria-hidden="true">⌁</span>
        <span>${t.copy}</span>
      </button>
      <button type="button" class="ac-btn tool-page-action-btn" data-action="favorite" aria-pressed="false" aria-keyshortcuts="Alt+F" aria-label="${t.favoriteLabel}">
        <span aria-hidden="true">☆</span>
        <span>${t.favorite}</span>
      </button>
    `;

    const title = (hero && hero.querySelector('h1')) || document.querySelector('main h1, h1');
    const toolName = title ? title.textContent.trim() : document.title;
    const canonPath = getCanonicalToolPath(window.location.pathname);
    const favButton = actions.querySelector('[data-action="favorite"]');

    updateFavoriteBtnState(favButton, isFavoriteTool(canonPath), t);

    window.addEventListener('ac:favorites-updated', function () {
      updateFavoriteBtnState(favButton, isFavoriteTool(canonPath), t);
    });

    document.addEventListener('keydown', function (e) {
      var tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target && e.target.isContentEditable)) return;
      if (e.altKey && !e.ctrlKey && !e.metaKey && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        favButton.click();
        favButton.focus();
      }
    });

    actions.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const url = window.location.href;
      const action = button.getAttribute('data-action');

      if (action === 'related') {
        const relatedSection = document.querySelector('section.related-tools, #related-tools');
        if (relatedSection) {
          relatedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          showToast(t.relatedMissing);
        }
      }

      if (action === 'share') {
        if (navigator.share) {
          try {
            await navigator.share({ title: toolName, text: t.tryText.replace('{tool}', toolName), url });
            showToast(t.shareOpened);
          } catch (err) {
            if (err && err.name !== 'AbortError') showToast(t.shareIncomplete);
          }
        } else {
          await navigator.clipboard.writeText(url);
          showToast(t.shareFallback);
        }
      }

      if (action === 'copylink') {
        await navigator.clipboard.writeText(url);
        showToast(t.copied);
      }

      if (action === 'favorite') {
        const isNowFav = toggleFavoriteTool(canonPath, toolName);
        updateFavoriteBtnState(button, isNowFav, t);
        showToast(isNowFav ? t.added : t.removed, isNowFav ? 'success' : 'info');
        if (window.ACAnalytics) window.ACAnalytics.trackFavorite(canonPath, isNowFav);
      }
    });

    actionHost.appendChild(actions);
  }

  function initToolTrustBadge() {
    const wrapper = document.querySelector('.tool-wrapper');
    const zone = document.querySelector('.tool-zone');
    if (!wrapper || !zone || zone.querySelector('.ac-trust-badge')) return;

    const lang = currentPageLang();
    const path = removeLocalePrefix(window.location.pathname);
    const externalTools = {
      '/ip-address-lookup/': 'ipapi.co',
      '/internet-speed-test/': 'Cloudflare'
    };
    const mixedTools = {
      '/ocr-pdf/': true
    };

    let mode = 'local';
    let service = '';
    if (externalTools[path]) {
      mode = 'external';
      service = externalTools[path];
    } else if (mixedTools[path]) {
      mode = 'mixed';
    }

    const copy = {
      en: {
        local: 'Processed in your browser. Nothing is uploaded to our servers.',
        mixed: 'Your file stays in your browser. OCR language data may download once for recognition.',
        external: 'Uses {service} for this lookup or test. That service may receive your IP address.'
      },
      es: {
        local: 'Procesado en tu navegador. Nada se sube a nuestros servidores.',
        mixed: 'Tu archivo permanece en el navegador. Los datos de idioma para OCR pueden descargarse una vez.',
        external: 'Usa {service} para esta consulta o prueba. Ese servicio puede recibir tu dirección IP.'
      },
      da: {
        local: 'Behandles i din browser. Intet uploades til vores servere.',
        mixed: 'Din fil bliver i browseren. OCR-sprogdata kan blive hentet en enkelt gang.',
        external: 'Bruger {service} til denne opslag eller test. Tjenesten kan modtage din IP-adresse.'
      }
    };

    const text = (copy[lang] || copy.en)[mode].replace('{service}', service);
    const badge = document.createElement('p');
    badge.className = 'ac-trust-badge ac-trust-badge--' + mode;
    badge.setAttribute('data-trust-mode', mode);
    badge.textContent = text;
    zone.appendChild(badge);
  }

  function initToolRailAdOrder() {
    document.querySelectorAll('.tool-side').forEach(function (rail) {
      const adSlot = rail.querySelector('.ad-slot');
      if (!adSlot) return;
      const adBlock = adSlot.closest('div') || adSlot;
      if (rail.firstElementChild !== adBlock) {
        rail.insertBefore(adBlock, rail.firstElementChild);
      }
    });
  }

  function initAnalytics() {
    // Ensure shared analytics adapter is available
    function triggerInitialTelemetry() {
      if (!window.ACAnalytics || window._acInitialTelemetryDispatched) return;
      window._acInitialTelemetryDispatched = true;
      window.ACAnalytics.track('page_view', {});
      if (document.querySelector('.tool-wrapper, .tool-zone, .tool-container')) {
        window.ACAnalytics.trackToolViewed();
      }
    }

    if (!window.ACAnalytics && !document.querySelector('script[data-ac-analytics-adapter]')) {
      const adapterScript = document.createElement('script');
      adapterScript.src = '/assets/js/shared/analytics.js';
      adapterScript.async = false;
      adapterScript.setAttribute('data-ac-analytics-adapter', 'true');
      adapterScript.onload = function () {
        triggerInitialTelemetry();
      };
      document.head.appendChild(adapterScript);
    } else if (window.ACAnalytics) {
      triggerInitialTelemetry();
    }

    const meta = document.querySelector('meta[name="google-analytics-id"]');
    const measurementId = (window.AC_GA_MEASUREMENT_ID || (meta && meta.content) || '').trim();
    if (!/^G-[A-Z0-9]+$/i.test(measurementId)) return;
    if (document.querySelector('script[data-ac-google-analytics]')) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      anonymize_ip: true,
      transport_type: 'beacon'
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    script.setAttribute('data-ac-google-analytics', measurementId);
    document.head.appendChild(script);
  }

  /* ===== INIT ===== */
  applyStoredTheme();
  initAnalytics();
  document.addEventListener('DOMContentLoaded', function () {
    renderHeader();
    renderFooter();
    initToolRailAdOrder();
    initToolPageActions();
    initToolTrustBadge();
    initHeader();
    initThemeToggle();
    initLangSwitcher();
    updateMobileLangLinks();
    initSearch();
    initDashboardQuickAccess();
    initDashboardRecents();
    initFileUploadTriggers();
    initPromptCards();
    initStaticFaqAccordion();
    initContactForm();

    if (window.ACAnalytics && !window._acInitialTelemetryDispatched) {
      window._acInitialTelemetryDispatched = true;
      window.ACAnalytics.track('page_view', {});
      if (document.querySelector('.tool-wrapper, .tool-zone, .tool-container')) {
        window.ACAnalytics.trackToolViewed();
      }
    }

    // Universal navigation & related-tool telemetry
    document.addEventListener('click', function (e) {
      var relLink = e.target.closest('.related-tools a, .tool-card');
      if (relLink && window.ACAnalytics) {
        var targetHref = relLink.getAttribute('href');
        if (targetHref && targetHref.startsWith('/')) {
          var pos = 0;
          var parentCard = relLink.closest('.tool-card');
          if (parentCard && parentCard.parentElement) {
            var cards = Array.prototype.slice.call(parentCard.parentElement.querySelectorAll('.tool-card'));
            pos = cards.indexOf(parentCard);
          }
          if (typeof window.ACAnalytics.trackRelatedToolClicked === 'function') {
            window.ACAnalytics.trackRelatedToolClicked(null, targetHref, pos);
          }
        }
      }
      var catLink = e.target.closest('.main-nav a[href*="-tools/"], .main-nav a[href*="/calculators/"]');
      if (catLink && window.ACAnalytics) {
        window.ACAnalytics.trackCategoryHubClicked(catLink.getAttribute('href'), 'main_nav');
      }
    });
  });

  function initPromptCards() {
    document.querySelectorAll('[data-prompt]').forEach(function(card) {
      function sendCardPrompt() {
        if (typeof window.sendPrompt === 'function') {
          window.sendPrompt(card.getAttribute('data-prompt'));
        }
      }
      card.addEventListener('click', sendCardPrompt);
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          sendCardPrompt();
        }
      });
    });
  }

  function initFileUploadTriggers() {
    document.querySelectorAll('[data-file-target]').forEach(function(trigger) {
      function openFilePicker() {
        var input = document.getElementById(trigger.getAttribute('data-file-target'));
        if (input) input.click();
      }
      trigger.addEventListener('click', openFilePicker);
      trigger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openFilePicker();
        }
      });
    });
  }

  function initStaticFaqAccordion() {
    const questions = document.querySelectorAll('button.faq-question');
    if (!questions.length) return;
    questions.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var item = this.closest('.faq-item');
        if (!item) return;
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(function(el) {
          el.classList.remove('open');
          var question = el.querySelector('.faq-question');
          if (question) question.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          this.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var name = document.getElementById('cf-name').value.trim();
      var email = document.getElementById('cf-email').value.trim();
      var message = document.getElementById('cf-message').value.trim();
      if (!name || !email || !message) {
        alert('Please fill in your name, email, and message.');
        return;
      }
      var subject = document.getElementById('cf-subject').value || 'General Enquiry';
      var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
      window.location.href = 'mailto:hello@anyconverter.io?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var success = document.getElementById('cf-success');
      if (success) success.style.display = 'block';
    });
  }

  function renderHeader() {
    const el = document.getElementById('site-header');
    if (el) {
      el.innerHTML = headerHTML;
      localizeSharedNavigation(el);
      const searchModal = document.getElementById('search-modal');
      if (searchModal && searchModal.parentElement !== document.body) {
        document.body.appendChild(searchModal);
      }
      var lang = currentPageLang();
      if (lang !== 'en') {
        var searchBtnLabel = el.querySelector('.search-btn-label');
        if (searchBtnLabel) {
          searchBtnLabel.textContent = lang === 'es' ? 'Buscar herramientas…' : (lang === 'da' ? 'Søg værktøjer…' : 'Search tools…');
        }
      }
    }
  }

  function renderFooter() {
    const el = document.getElementById('site-footer');
    if (!el) return;
    const path = window.location.pathname;
    var lang = 'en';
    var p = '';
    if (path.startsWith('/es/') || path === '/es') { lang = 'es'; p = '/es'; }
    else if (path.startsWith('/da/') || path === '/da') { lang = 'da'; p = '/da'; }
    var t = FOOTER_I18N[lang];
    el.innerHTML = `
<div class="footer-inner">
  <div class="footer-brand">
    <a href="${p}/" class="logo">
      <img src="/assets/img/logo.svg" alt="AnyConverter" width="28" height="28" loading="lazy">
      <span class="logo-text">AnyConverter</span>
    </a>
    <p>${t.tagline}</p>
    <div class="footer-social">
      <a href="/es/" class="footer-lang-badge" aria-label="Español">🇪🇸 ES</a>
      <a href="/da/" class="footer-lang-badge" aria-label="Dansk">🇩🇰 DA</a>
    </div>
    <button id="btn-footer-pwa-install" class="footer-pwa-btn" style="display:none;" aria-label="Install AnyConverter App">📲 <span class="pwa-install-text">${lang === 'es' ? 'Instalar app' : (lang === 'da' ? 'Installer app' : 'Install App')}</span></button>
  </div>
  <div class="footer-links">
    <div class="footer-col">
      <h3>${t.col1}</h3>
      <ul>
        <li><a href="${p}/">${t.home}</a></li>
        <li><a href="${p}/#tools">${t.allTools}</a></li>
        <li><a href="${p}/pdf-tools/">${t.pdfTools}</a></li>
        <li><a href="${p}/developer-tools/">${t.devTools}</a></li>
        <li><a href="${p}/browser-tools/">${t.browserTools}</a></li>
        <li><a href="${p}/calculators/">${t.calculators}</a></li>
        <li><a href="${p}/text-tools/">${t.textTools}</a></li>
        <li><a href="${p}/productivity-tools/">${t.productivity}</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>${t.col2}</h3>
      <ul>
        <li><a href="${p}/image-converter/">${t.imageConverter}</a></li>
        <li><a href="${p}/qr-code-generator/">${t.qrCode}</a></li>
        <li><a href="${p}/css-gradient-generator/">${t.cssGenerator}</a></li>
        <li><a href="${p}/currency-converter/">${t.currency}</a></li>
        <li><a href="${p}/password-generator/">${t.password}</a></li>
        <li><a href="${p}/invoice-generator/">${t.invoice}</a></li>
        <li><a href="${p}/pomodoro-timer/">${t.pomodoro}</a></li>
        <li><a href="${p}/typing-speed-test/">${t.typingTest}</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>${t.col3}</h3>
      <ul>
        <li><a href="${p}/privacy/">${t.privacy}</a></li>
        <li><a href="${p}/terms/">${t.terms}</a></li>
        <li><a href="${p}/cookies/">${t.cookies}</a></li>
        <li><a href="${p}/security/">${t.security}</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>${t.col4}</h3>
      <ul>
        <li><a href="${p}/about/">${t.about}</a></li>
        <li><a href="${p}/contact/">${t.contact}</a></li>
        <li><a href="${p}/blog/">${t.blog}</a></li>
        <li><a href="${p}/press/">${t.press}</a></li>
        <li><a href="${p}/faq/">${t.faq}</a></li>
      </ul>
    </div>
  </div>
</div>
<div class="footer-bottom">
  <p>${t.rights}</p>
  <p>${t.noData}</p>
</div>`;

    var footerPwaBtn = el.querySelector('#btn-footer-pwa-install');
    if (footerPwaBtn) {
      footerPwaBtn.addEventListener('click', function () {
        if (window.ACPwa && typeof window.ACPwa.handleInstallClick === 'function') {
          window.ACPwa.handleInstallClick();
        }
      });
    }
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
    const navDropdowns = document.querySelectorAll('.nav-dropdown');

    function closeAllNavDropdowns() {
      navDropBtns.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    }

    navDropBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        closeAllNavDropdowns();
        closeLangDropdown();
        if (!isOpen) btn.setAttribute('aria-expanded', 'true');
      });
    });

    // Mutual hover exclusion: entering any dropdown resets other open dropdowns and lang dropdown
    navDropdowns.forEach(function (dd) {
      dd.addEventListener('mouseenter', function () {
        navDropBtns.forEach(function (b) {
          if (b !== dd.querySelector('.nav-more')) {
            b.setAttribute('aria-expanded', 'false');
          }
        });
        closeLangDropdown();
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
        if (window.ACAnalytics) window.ACAnalytics.trackLanguageSwitched(currentLang, targetLang);
        localStorage.setItem('ac_lang', targetLang);
        window.location.href = url;
      });
    });
  }

  function buildLangUrl(targetLang) {
    const alt = document.querySelector('link[rel="alternate"][hreflang="' + targetLang + '"]');
    if (alt) {
      try {
        const u = new URL(alt.getAttribute('href'), window.location.origin);
        if (u.hostname === window.location.hostname || /(^|\.)anyconverter\.io$/.test(u.hostname)) return u.pathname;
      } catch (e) { /* fall back to the path rules below */ }
    }
    const path = window.location.pathname;
    return localizedPathForLang(path, targetLang, true);
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
  window.copyToClipboard = async function (text, triggerEl) {
    let success = false;
    try {
      await navigator.clipboard.writeText(text);
      success = true;
    } catch (_e) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        success = document.execCommand('copy');
        ta.remove();
      } catch (_err) {
        success = false;
      }
    }
    if (success) {
      if (window.ACAnalytics) window.ACAnalytics.trackResultCopied(null, 'clipboard_text');
      window.showToast('Copied to clipboard!', 'success');
      const btn = triggerEl || (document.activeElement && (document.activeElement.tagName === 'BUTTON' || document.activeElement.classList.contains('ac-btn')) ? document.activeElement : null);
      if (btn && !btn.dataset.copying) {
        btn.dataset.copying = 'true';
        const origHtml = btn.innerHTML;
        const origWidth = btn.offsetWidth;
        if (origWidth) btn.style.minWidth = origWidth + 'px';
        btn.classList.add('btn-copied');
        btn.innerHTML = '✓ Copied!';
        setTimeout(function () {
          btn.innerHTML = origHtml;
          btn.classList.remove('btn-copied');
          btn.style.minWidth = '';
          delete btn.dataset.copying;
        }, 1500);
      }
    } else {
      window.showToast('Could not copy to clipboard', 'info');
    }
    return success;
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
    var lang = currentPageLang();
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

    var footerEl = modal.querySelector('.search-footer');
    if (footerEl) {
      if (lang === 'es') {
        footerEl.innerHTML = '<span><kbd>↑↓</kbd> Navegar</span><span><kbd>↵</kbd> Abrir</span><span><kbd>Esc</kbd> Cerrar</span>';
      } else if (lang === 'da') {
        footerEl.innerHTML = '<span><kbd>↑↓</kbd> Naviger</span><span><kbd>↵</kbd> Åbn</span><span><kbd>Esc</kbd> Luk</span>';
      }
    }

    function openSearch(source) {
      if (window.ACAnalytics) window.ACAnalytics.trackSearchOpened(source || 'header_button');
      closeMobileMenu();
      if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
      }
      document.body.classList.add('search-open');
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      input.value = '';
      activeIdx = -1;
      showDefaultList();
      requestAnimationFrame(function () { input.focus(); });
    }

    function closeSearch() {
      document.body.classList.remove('search-open');
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      activeIdx = -1;
    }

    btn.addEventListener('click', function () { openSearch('header_button'); });
    if (backdrop) backdrop.addEventListener('click', closeSearch);

    list.addEventListener('click', function (e) {
      var item = e.target.closest('.search-result-item');
      if (item && window.ACAnalytics) {
        var href = item.getAttribute('href');
        var allItems = Array.prototype.slice.call(list.querySelectorAll('.search-result-item'));
        var rank = allItems.indexOf(item);
        window.ACAnalytics.trackSearchResultClicked(href, rank);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (modal.classList.contains('open')) {
        if (e.key === 'Escape') { e.preventDefault(); closeSearch(); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1); return; }
        if (e.key === 'ArrowUp')   { e.preventDefault(); moveActive(-1); return; }
        if (e.key === 'Enter') {
          var links = list.querySelectorAll('.search-result-item');
          if (activeIdx >= 0 && links[activeIdx]) {
            if (window.ACAnalytics) window.ACAnalytics.trackSearchResultClicked(links[activeIdx].getAttribute('href'), activeIdx);
            window.location.href = links[activeIdx].getAttribute('href');
          } else if (links.length === 1) {
            if (window.ACAnalytics) window.ACAnalytics.trackSearchResultClicked(links[0].getAttribute('href'), 0);
            window.location.href = links[0].getAttribute('href');
          }
          return;
        }
        return;
      }
      // Open shortcuts when modal is closed
      var tag = document.activeElement ? document.activeElement.tagName : '';
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault(); openSearch('keyboard_shortcut');
      } else if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault(); openSearch('slash_key');
      }
    });

    input.addEventListener('input', function () {
      activeIdx = -1;
      var q = input.value.trim();
      if (!q) { showDefaultList(); return; }
      renderResults(q);
      if (window.ACAnalytics) {
        var itemsCount = list.querySelectorAll('.search-result-item').length;
        window.ACAnalytics.trackSearchPerformed(q.length, itemsCount);
      }
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

    function showDefaultList() {
      var favs = getFavoritesList();
      var lang = currentPageLang();
      if (favs && favs.length > 0) {
        var favTitle = lang === 'es' ? '★ Herramientas favoritas' : (lang === 'da' ? '★ Favoritværktøjer' : '★ Favorite tools');
        renderList(favs, favTitle, null);
      } else {
        var pop = TOOLS.filter(function (t) { return POPULAR.indexOf(t.u) !== -1; });
        var quickTitle = lang === 'es' ? '⚡ Acceso Rápido' : (lang === 'da' ? '⚡ Hurtig Adgang' : '⚡ Quick Access');
        renderList(pop, quickTitle, null);
      }
      emptyEl.textContent = '';
      emptyEl.classList.remove('visible');
    }

    window.addEventListener('ac:favorites-updated', function () {
      if (modal.classList.contains('open') && !input.value.trim()) {
        showDefaultList();
      }
    });

        var SYNONYMS = {
      // English / Developer intents (SEO-02)
      'bearer': ['/jwt-decoder/'],
      'jwt': ['/jwt-decoder/'],
      'token': ['/jwt-decoder/'],
      'claims': ['/jwt-decoder/'],
      'jwt decode': ['/jwt-decoder/'],
      'jwt parser': ['/jwt-decoder/'],
      'epoch': ['/timestamp-converter/'],
      'unix time': ['/timestamp-converter/'],
      'posix': ['/timestamp-converter/'],
      'sha256': ['/hash-generator/'],
      'sha-256': ['/hash-generator/'],
      'sha512': ['/hash-generator/'],
      'sha-512': ['/hash-generator/'],
      'md5': ['/hash-generator/'],
      'checksum': ['/hash-generator/'],
      'hash file': ['/hash-generator/'],
      'ipv6': ['/ip-address-lookup/'],
      'ipv4': ['/ip-address-lookup/'],
      'my ip': ['/ip-address-lookup/'],
      'what is my ip': ['/ip-address-lookup/'],
      'public ip': ['/ip-address-lookup/'],
      'crontab': ['/cron-expression-parser/'],
      'cronjob': ['/cron-expression-parser/'],
      'cron': ['/cron-expression-parser/'],
      'cron schedule': ['/cron-expression-parser/'],
      'data uri': ['/base64-encoder/'],
      'datauri': ['/base64-encoder/'],
      'base64 image': ['/base64-encoder/'],
      'yaml': ['/json-to-yaml/'],
      'json to yaml': ['/json-to-yaml/'],
      'yaml to json': ['/json-to-yaml/'],
      'diff json': ['/json-compare/'],
      'json diff': ['/json-compare/'],

      // Spanish intents (es)
      'portador': ['/jwt-decoder/'],
      'marca de tiempo': ['/timestamp-converter/'],
      'tiempo unix': ['/timestamp-converter/'],
      'mi ip': ['/ip-address-lookup/'],
      'cual es mi ip': ['/ip-address-lookup/'],
      'direccion ip': ['/ip-address-lookup/'],
      'suma de comprobacion': ['/hash-generator/'],
      'expresion cron': ['/cron-expression-parser/'],
      'programador de tareas': ['/cron-expression-parser/'],
      'unir pdf': ['/pdf-merge/'],
      'combinar pdf': ['/pdf-merge/'],
      'dividir pdf': ['/pdf-split/'],
      'comprimir pdf': ['/pdf-compress/'],

      // Danish intents (da)
      'tidsstempel': ['/timestamp-converter/'],
      'unixtid': ['/timestamp-converter/'],
      'min ip': ['/ip-address-lookup/'],
      'hvad er min ip': ['/ip-address-lookup/'],
      'ip adresse': ['/ip-address-lookup/'],
      'kontrolsum': ['/hash-generator/'],
      'sammenlaeg pdf': ['/pdf-merge/'],
      'flet pdf': ['/pdf-merge/'],
      'opdel pdf': ['/pdf-split/'],
      'komprimer pdf': ['/pdf-compress/']
    };

    function renderResults(q) {
      var ql = q.toLowerCase().trim();
      var seen = {};
      var synonymHits = [];
      var lang = currentPageLang();

      // Exact or prefix synonym match
      if (SYNONYMS[ql]) {
        SYNONYMS[ql].forEach(function(u) {
          var tool = TOOLS.find(function(t) { return t.u === u; });
          if (tool && !seen[tool.u]) {
            seen[tool.u] = true;
            synonymHits.push(tool);
          }
        });
      }

      var nameHits = TOOLS.filter(function(t) {
        if (seen[t.u]) return false;
        var localizedName = getToolName(t, lang);
        if (t.n.toLowerCase().indexOf(ql) !== -1 || localizedName.toLowerCase().indexOf(ql) !== -1) {
          seen[t.u] = true;
          return true;
        }
        return false;
      });

      var otherHits = TOOLS.filter(function(t) {
        if (seen[t.u]) return false;
        var localizedDesc = getToolDesc(t, lang);
        var localizedCat = getToolCategory(t.c, lang);
        var match = (t.d.toLowerCase().indexOf(ql) !== -1 ||
                     localizedDesc.toLowerCase().indexOf(ql) !== -1 ||
                     t.k.toLowerCase().indexOf(ql) !== -1 ||
                     t.c.toLowerCase().indexOf(ql) !== -1 ||
                     localizedCat.toLowerCase().indexOf(ql) !== -1);
        if (match) seen[t.u] = true;
        return match;
      });

      var matched = synonymHits.concat(nameHits, otherHits).slice(0, 8);
      if (!matched.length) {
        list.innerHTML = '';
        emptyEl.textContent = lang === 'es'
          ? 'No se encontraron herramientas para "' + q + '"'
          : (lang === 'da'
            ? 'Ingen værktøjer fundet for "' + q + '"'
            : 'No tools found for "' + q + '"');
        emptyEl.classList.add('visible');
      } else {
        emptyEl.textContent = '';
        emptyEl.classList.remove('visible');
        renderList(matched, null, q);
      }
    }

    function renderList(tools, label, q) {
      var lang = currentPageLang();
      var html = label ? '<li class="search-section-label">' + escapeHtml(label) + '</li>' : '';
      html += tools.map(function (t) {
        var toolName = getToolName(t, lang);
        var toolDesc = getToolDesc(t, lang);
        var toolCat = getToolCategory(t.c, lang);
        var name = q ? hlMatch(toolName, q) : escapeHtml(toolName);
        var desc = q ? hlMatch(toolDesc, q) : escapeHtml(toolDesc);
        var href = localizedPathForLang(t.u, lang, false);
        return '<li>' +
          '<a href="' + href + '" class="search-result-item">' +
            '<img src="' + t.i + '" alt="" class="search-result-icon" width="36" height="36" loading="lazy">' +
            '<div class="search-result-info">' +
              '<div class="search-result-name">' + name + '</div>' +
              '<div class="search-result-desc">' + desc + '</div>' +
            '</div>' +
            '<span class="search-result-badge">' + escapeHtml(toolCat) + '</span>' +
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

  /* ===== HOMEPAGE DASHBOARD QUICK ACCESS / FAVORITES ===== */
  function initDashboardQuickAccess() {
    var quickGrid = document.querySelector('.dash-quick-grid');
    if (!quickGrid || typeof quickGrid.closest !== 'function') return;
    var section = quickGrid.closest('.dash-section');
    var titleEl = section && typeof section.querySelector === 'function' ? section.querySelector('.dash-section-title') : null;
    var defaultTitle = titleEl ? titleEl.textContent : 'Quick Access';
    var defaultGridHTML = quickGrid.innerHTML;

    function renderDashboardQuick() {
      var favs = getFavoritesList();
      var lang = currentPageLang();

      if (favs && favs.length > 0) {
        if (titleEl) {
          titleEl.textContent = lang === 'es' ? 'Herramientas Favoritas' : (lang === 'da' ? 'Favoritværktøjer' : 'Favorite Tools');
        }
        var html = favs.map(function (tool) {
          var toolName = getToolName(tool, lang);
          var href = localizedPathForLang(tool.u, lang, false);
          return '<a href="' + href + '" class="dash-quick-card">' +
            '<img src="' + tool.i + '" alt="' + escapeHtml(toolName) + ' icon" width="26" height="26" loading="lazy">' +
            '<span class="dash-quick-card-name">' + escapeHtml(toolName) + '</span>' +
          '</a>';
        }).join('');
        quickGrid.innerHTML = html;
      } else {
        if (titleEl) titleEl.textContent = defaultTitle;
        quickGrid.innerHTML = defaultGridHTML;
      }
    }

    renderDashboardQuick();
    window.addEventListener('ac:favorites-updated', renderDashboardQuick);
  }

  /* ===== HOMEPAGE DASHBOARD RECENTLY USED CAROUSEL / ROW ===== */
  var RECENTS_I18N = {
    en: {
      title: 'Recently Used',
      clear: 'Clear recents',
      clearAria: 'Clear recently used tools',
      navAria: 'Recently used tools'
    },
    es: {
      title: 'Usado recientemente',
      clear: 'Borrar recientes',
      clearAria: 'Borrar herramientas usadas recientemente',
      navAria: 'Herramientas usadas recientemente'
    },
    da: {
      title: 'Senest brugte',
      clear: 'Ryd seneste',
      clearAria: 'Ryd senest brugte værktøjer',
      navAria: 'Senest brugte værktøjer'
    }
  };

  function initDashboardRecents() {
    var quickGrid = document.querySelector('.dash-quick-grid');
    var dashMain = document.querySelector('.dash-main');
    if (!quickGrid && !dashMain) return;

    var quickSection = (quickGrid && typeof quickGrid.closest === 'function') ? quickGrid.closest('.dash-section') : null;

    // Locate or create recents container
    var section = document.getElementById('dash-recents-section') || (typeof document.querySelector === 'function' ? document.querySelector('.dash-recents-section') : null);
    if (!section && typeof document.createElement === 'function') {
      section = document.createElement('section');
      section.className = 'dash-section dash-recents-section';
      section.id = 'dash-recents-section';
      section.setAttribute('aria-labelledby', 'recents-heading');
      section.style.display = 'none';

      if (quickSection && quickSection.parentNode) {
        quickSection.parentNode.insertBefore(section, quickSection);
      } else if (dashMain) {
        dashMain.insertBefore(section, dashMain.firstChild);
      }
    }

    function renderDashboardRecents() {
      var recents = getRecentsList();
      if (!recents || recents.length === 0) {
        section.style.display = 'none';
        section.hidden = true;
        section.innerHTML = '';
        return;
      }

      var lang = currentPageLang();
      var i18n = RECENTS_I18N[lang] || RECENTS_I18N.en;

      section.style.display = '';
      section.hidden = false;

      var cardsHtml = recents.map(function (tool) {
        var toolName = getToolName(tool, lang);
        var href = localizedPathForLang(tool.u, lang, false);
        return '<a href="' + href + '" class="dash-quick-card dash-recent-card" data-canon="' + escapeHtml(tool.u) + '">' +
          '<img src="' + tool.i + '" alt="' + escapeHtml(toolName) + ' icon" width="26" height="26" loading="lazy">' +
          '<span class="dash-quick-card-name">' + escapeHtml(toolName) + '</span>' +
        '</a>';
      }).join('');

      section.innerHTML =
        '<div class="dash-section-header">' +
          '<h2 class="dash-section-title" id="recents-heading">' + escapeHtml(i18n.title) + '</h2>' +
          '<button type="button" class="dash-recents-clear-btn" aria-label="' + escapeHtml(i18n.clearAria) + '">' +
            escapeHtml(i18n.clear) +
          '</button>' +
        '</div>' +
        '<nav aria-label="' + escapeHtml(i18n.navAria) + '">' +
          '<div class="dash-quick-grid dash-recents-grid">' +
            cardsHtml +
          '</div>' +
        '</nav>';

      var clearBtn = section.querySelector('.dash-recents-clear-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', function (e) {
          e.preventDefault();
          clearRecents();
          if (window.ACAnalytics) {
            if (typeof window.ACAnalytics.trackRecentsCleared === 'function') {
              window.ACAnalytics.trackRecentsCleared();
            } else if (typeof window.ACAnalytics.track === 'function') {
              window.ACAnalytics.track('recents_cleared', {});
            }
          }
        });
        clearBtn.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            clearBtn.click();
          }
        });
      }

      var grid = section.querySelector('.dash-recents-grid');
      if (grid) {
        grid.addEventListener('click', function (e) {
          var card = e.target.closest('.dash-recent-card, .dash-quick-card');
          if (card) {
            var canon = card.getAttribute('data-canon') || getCanonicalToolPath(card.getAttribute('href'));
            if (window.ACAnalytics) {
              if (typeof window.ACAnalytics.trackRecentClicked === 'function') {
                window.ACAnalytics.trackRecentClicked(canon);
              } else if (typeof window.ACAnalytics.track === 'function') {
                window.ACAnalytics.track('recent_clicked', { tool_slug: canon });
              }
            }
          }
        });
      }
    }

    renderDashboardRecents();
    window.addEventListener('ac:recents-updated', renderDashboardRecents);
  }

  /* ===== MAIN CONTENT ID ===== */
  document.addEventListener('DOMContentLoaded', function () {
    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'main-content';
  });

  /* ============================================================
   * LARGE FILE LOADER + PROGRESS UI + WORKER SAFETY
   * Shared infrastructure for 100 MB-capable tools.
   * ============================================================ */

  function formatBytesShort(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    if (n < 1024 * 1024 * 1024) return (n / 1024 / 1024).toFixed(1) + ' MB';
    return (n / 1024 / 1024 / 1024).toFixed(2) + ' GB';
  }

  /* ===== PROGRESS i18n (en / es / da) ===== */
  var PROG_STRINGS = {
    en: {
      loading: 'Loading', uploading: 'Uploading',
      preparing: 'Preparing editor', formatting: 'Formatting',
      parsing: 'Parsing', building: 'Building database',
      running: 'Running', cancel: 'Cancel',
      cancelled: 'Upload cancelled', failedRead: 'Failed to read file',
      eta: function (s) { return '~' + s + 's left'; },
      exceeds: function (mb, limit) { return 'File size (' + mb + ' MB) exceeds ' + limit + ' MB limit'; },
      loaded: function (n) { return 'Loaded ' + n; }
    },
    es: {
      loading: 'Cargando', uploading: 'Subiendo',
      preparing: 'Preparando editor', formatting: 'Formateando',
      parsing: 'Analizando', building: 'Construyendo base de datos',
      running: 'Ejecutando', cancel: 'Cancelar',
      cancelled: 'Carga cancelada', failedRead: 'No se pudo leer el archivo',
      eta: function (s) { return '~' + s + 's restantes'; },
      exceeds: function (mb, limit) { return 'El tamaño del archivo (' + mb + ' MB) excede el límite de ' + limit + ' MB'; },
      loaded: function (n) { return 'Cargado ' + n; }
    },
    da: {
      loading: 'Indlæser', uploading: 'Uploader',
      preparing: 'Forbereder editor', formatting: 'Formaterer',
      parsing: 'Analyserer', building: 'Opbygger database',
      running: 'Kører', cancel: 'Annuller',
      cancelled: 'Upload annulleret', failedRead: 'Kunne ikke læse filen',
      eta: function (s) { return '~' + s + 's tilbage'; },
      exceeds: function (mb, limit) { return 'Filstørrelse (' + mb + ' MB) overskrider grænsen på ' + limit + ' MB'; },
      loaded: function (n) { return 'Indlæste ' + n; }
    }
  };
  window.progStrings = function () {
    var lang = (document.documentElement.lang || 'en').toLowerCase();
    return PROG_STRINGS[lang] || PROG_STRINGS.en;
  };

  function ensureProgressStyles() {
    if (document.getElementById('ac-progress-styles')) return;
    var s = document.createElement('style');
    s.id = 'ac-progress-styles';
    s.textContent =
      '.ac-progress{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:9999;' +
      'background:#fff;border:1px solid #E5E7EB;border-radius:10px;box-shadow:0 10px 32px rgba(0,0,0,.18);' +
      'padding:18px 22px;min-width:340px;max-width:92vw;font-family:inherit;color:#1F2937}' +
      '.ac-progress__title{font-size:13px;font-weight:600;color:#1F2937;margin-bottom:10px;display:flex;' +
      'justify-content:space-between;align-items:center;gap:12px}' +
      '.ac-progress__phase{font-size:11px;font-weight:500;color:#4A5568;margin:6px 0 4px}' +
      '.ac-progress__bar{height:8px;background:#F3F4F6;border-radius:4px;overflow:hidden;position:relative}' +
      '.ac-progress__fill{height:100%;background:linear-gradient(90deg,#3B82F6,#60A5FA);' +
      'width:0%;transition:width .18s ease;border-radius:4px}' +
      '.ac-progress__fill--indeterminate{width:35%;animation:acProgIndet 1.1s linear infinite}' +
      '.ac-progress__fill--err{background:#DC2626}' +
      '.ac-progress__meta{display:flex;justify-content:space-between;font-size:11px;color:#6B7280;margin-top:6px}' +
      '.ac-progress__cancel{background:none;border:1px solid #E5E7EB;border-radius:6px;padding:4px 10px;' +
      'font-size:11px;color:#4A5568;cursor:pointer}' +
      '.ac-progress__cancel:hover{background:#F9FAFB;color:#1F2937}' +
      '.ac-progress__backdrop{position:fixed;inset:0;background:rgba(15,23,42,.35);z-index:9998}' +
      '@keyframes acProgIndet{0%{margin-left:-35%}100%{margin-left:100%}}';
    document.head.appendChild(s);
  }

  /**
   * Create a progress UI. Returns an API: setPhase, update, done, fail.
   * Example:
   *   var p = window.showProgress('Loading data.json', { cancellable: true, onCancel: fn });
   *   p.setPhase('Uploading'); p.update(42, '42 MB / 100 MB');
   *   p.setPhase('Parsing', { indeterminate: true });
   *   p.done(); // or p.fail('msg')
   */
  window.showProgress = function (title, opts) {
    opts = opts || {};
    ensureProgressStyles();
    var backdrop = document.createElement('div');
    backdrop.className = 'ac-progress__backdrop';
    var box = document.createElement('div');
    box.className = 'ac-progress';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-live', 'polite');
    box.innerHTML =
      '<div class="ac-progress__title">' +
      '<span class="ac-progress__ttl"></span>' +
      (opts.cancellable ? '<button type="button" class="ac-progress__cancel">' + (window.progStrings ? window.progStrings().cancel : 'Cancel') + '</button>' : '') +
      '</div>' +
      '<div class="ac-progress__phase"></div>' +
      '<div class="ac-progress__bar"><div class="ac-progress__fill"></div></div>' +
      '<div class="ac-progress__meta"><span class="ac-progress__left"></span><span class="ac-progress__right"></span></div>';
    box.querySelector('.ac-progress__ttl').textContent = title || 'Working…';
    document.body.appendChild(backdrop);
    document.body.appendChild(box);

    var phaseEl = box.querySelector('.ac-progress__phase');
    var fill    = box.querySelector('.ac-progress__fill');
    var leftEl  = box.querySelector('.ac-progress__left');
    var rightEl = box.querySelector('.ac-progress__right');
    var cancelBtn = box.querySelector('.ac-progress__cancel');
    var destroyed = false;

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      box.remove();
      backdrop.remove();
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        if (typeof opts.onCancel === 'function') opts.onCancel();
        destroy();
      });
    }

    return {
      setPhase: function (label, o) {
        o = o || {};
        phaseEl.textContent = label || '';
        fill.classList.toggle('ac-progress__fill--indeterminate', !!o.indeterminate);
        if (o.indeterminate) fill.style.width = '';
        else fill.style.width = '0%';
        leftEl.textContent = '';
        rightEl.textContent = '';
      },
      update: function (percent, leftText, rightText) {
        if (fill.classList.contains('ac-progress__fill--indeterminate')) {
          fill.classList.remove('ac-progress__fill--indeterminate');
        }
        if (typeof percent === 'number') {
          var p = Math.max(0, Math.min(100, percent));
          fill.style.width = p.toFixed(1) + '%';
        }
        if (typeof leftText === 'string')  leftEl.textContent  = leftText;
        if (typeof rightText === 'string') rightEl.textContent = rightText;
      },
      done: function () { destroy(); },
      fail: function (msg) {
        fill.classList.add('ac-progress__fill--err');
        fill.classList.remove('ac-progress__fill--indeterminate');
        fill.style.width = '100%';
        phaseEl.textContent = msg || 'Failed';
        setTimeout(destroy, 2200);
      }
    };
  };

  /**
   * Read a File as text with streaming chunks + progress callback.
   * Uses modern file.stream() where available, falls back to FileReader.
   * Returns a Promise<string>. Options: { maxBytes, onProgress({loaded,total,percent}), signal }.
   */
  window.readFileChunkedText = function (file, opts) {
    opts = opts || {};
    var maxBytes = opts.maxBytes || Infinity;
    var onProgress = opts.onProgress || function () {};
    var signal = opts.signal;

    if (file.size > maxBytes) {
      return Promise.reject(new Error(
        'File is ' + formatBytesShort(file.size) + '. Max is ' + formatBytesShort(maxBytes) + '.'
      ));
    }

    if (typeof file.stream === 'function' && typeof TextDecoder !== 'undefined') {
      return new Promise(function (resolve, reject) {
        var reader = file.stream().getReader();
        var decoder = new TextDecoder('utf-8');
        var chunks = [];
        var loaded = 0;
        var total = file.size;
        var aborted = false;

        function onAbort() { aborted = true; try { reader.cancel(); } catch (e) {} reject(new Error('aborted')); }
        if (signal) {
          if (signal.aborted) { onAbort(); return; }
          signal.addEventListener('abort', onAbort, { once: true });
        }

        function pump() {
          reader.read().then(function (r) {
            if (aborted) return;
            if (r.done) {
              chunks.push(decoder.decode());
              resolve(chunks.join(''));
              return;
            }
            loaded += r.value.byteLength;
            chunks.push(decoder.decode(r.value, { stream: true }));
            onProgress({ loaded: loaded, total: total, percent: total ? (loaded / total) * 100 : 0 });
            pump();
          }, reject);
        }
        pump();
      });
    }

    // Fallback: FileReader with progress event
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onprogress = function (ev) {
        if (ev.lengthComputable) {
          onProgress({ loaded: ev.loaded, total: ev.total, percent: (ev.loaded / ev.total) * 100 });
        }
      };
      fr.onload  = function () { resolve(fr.result); };
      fr.onerror = function () { reject(new Error('Failed to read file')); };
      fr.onabort = function () { reject(new Error('aborted')); };
      if (signal) {
        if (signal.aborted) { fr.abort(); return; }
        signal.addEventListener('abort', function () { try { fr.abort(); } catch (e) {} }, { once: true });
      }
      fr.readAsText(file);
    });
  };

  /**
   * Read a File as ArrayBuffer with chunked progress.
   */
  window.readFileChunkedBuffer = function (file, opts) {
    opts = opts || {};
    var maxBytes = opts.maxBytes || Infinity;
    var onProgress = opts.onProgress || function () {};
    var signal = opts.signal;
    if (file.size > maxBytes) {
      return Promise.reject(new Error(
        'File is ' + formatBytesShort(file.size) + '. Max is ' + formatBytesShort(maxBytes) + '.'
      ));
    }
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onprogress = function (ev) {
        if (ev.lengthComputable) onProgress({ loaded: ev.loaded, total: ev.total, percent: (ev.loaded / ev.total) * 100 });
      };
      fr.onload  = function () { resolve(fr.result); };
      fr.onerror = function () { reject(new Error('Failed to read file')); };
      fr.onabort = function () { reject(new Error('aborted')); };
      if (signal) {
        if (signal.aborted) { fr.abort(); return; }
        signal.addEventListener('abort', function () { try { fr.abort(); } catch (e) {} }, { once: true });
      }
      fr.readAsArrayBuffer(file);
    });
  };

  /**
   * Safe worker request/response with timeout + proper error propagation.
   * worker.onerror and worker termination both reject the promise (no silent hangs).
   * If payload has `{type:'progress', percent}` messages (not matching the id), they are forwarded to onProgress.
   */
  window.runWorkerAction = function (worker, payload, opts) {
    opts = opts || {};
    var timeoutMs = opts.timeoutMs || 120000;
    var onProgress = opts.onProgress;
    return new Promise(function (resolve, reject) {
      if (!worker) { reject(new Error('Worker unavailable')); return; }
      var id = payload.id;
      var settled = false;
      function clean() {
        worker.removeEventListener('message', onMsg);
        worker.removeEventListener('error', onErr);
        clearTimeout(t);
      }
      function onMsg(e) {
        var m = e.data;
        if (!m) return;
        if (m.type === 'progress' && onProgress) { onProgress(m); return; }
        if (m.id !== id) return;
        if (settled) return;
        settled = true;
        clean();
        if (m.success === false) reject(new Error(m.error || 'Worker error'));
        else resolve(m);
      }
      function onErr(ev) {
        if (settled) return;
        settled = true;
        clean();
        reject(new Error((ev && ev.message) || 'Worker crashed'));
      }
      var t = setTimeout(function () {
        if (settled) return;
        settled = true;
        clean();
        reject(new Error('Operation timed out'));
      }, timeoutMs);
      worker.addEventListener('message', onMsg);
      worker.addEventListener('error', onErr);
      try {
        if (opts.transfer && opts.transfer.length) worker.postMessage(payload, opts.transfer);
        else worker.postMessage(payload);
      } catch (e) {
        if (settled) return;
        settled = true;
        clean();
        reject(e);
      }
    });
  };

  window.formatBytesShort = formatBytesShort;

  /**
   * Add a fullscreen button to a tool panel. When active, the panel fills the
   * viewport and a floating toolbar shows a Close button + font-size +/− that
   * drives a CSS variable `--panel-font-size` on the content element.
   *
   * Opts:
   *   content   : HTMLElement — the element whose font-size we scale (defaults to panel)
   *   extra     : HTML string — extra toolbar items to inject before Close (e.g. search)
   *   onEnter   : function(panel, toolbarEl) — called after FS opens
   *   onExit    : function(panel) — called before FS closes
   *   storageKey: string — localStorage key for persisted font size (default: 'ac:fontsize:<id>')
   */
  window.installPanelFullscreen = function (panel, opts) {
    if (!panel || panel._fsInstalled) return;
    opts = opts || {};
    panel._fsInstalled = true;
    var content = opts.content || panel;
    var storageKey = opts.storageKey || ('ac:fontsize:' + (panel.id || 'panel'));

    // Apply persisted font size on load
    var stored = parseInt(localStorage.getItem(storageKey), 10);
    if (stored && stored >= 10 && stored <= 24) {
      content.style.setProperty('--panel-font-size', stored + 'px');
    }

    // Inject FS button into the panel header
    var header = panel.querySelector('.ac-panel-header, .ac-panel-head, header');
    var fsBtn = document.createElement('button');
    fsBtn.type = 'button';
    fsBtn.className = 'ac-btn ac-fs-toggle';
    fsBtn.title = 'Fullscreen';
    fsBtn.setAttribute('aria-label', 'Fullscreen');
    fsBtn.textContent = '⛶';
    if (header) {
      var actions = header.querySelector('.ac-panel-actions') || header;
      actions.appendChild(fsBtn);
    } else {
      panel.insertBefore(fsBtn, panel.firstChild);
    }

    var savedScrollY = 0;

    function enter() {
      savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      panel.classList.add('is-fullscreen');
      fsBtn.classList.add('fs-active');
      fsBtn.textContent = '✕';
      fsBtn.title = 'Exit fullscreen (Esc)';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      var ov = document.getElementById('fs-overlay');
      if (!ov) {
        ov = document.createElement('div');
        ov.id = 'fs-overlay'; ov.className = 'fs-overlay';
        document.body.appendChild(ov);
      }
      ov.classList.add('active');
      ov.onclick = function () {
        if (panel.classList.contains('is-fullscreen')) exit();
      };

      // Build the floating toolbar
      var bar = document.createElement('div');
      bar.className = 'ac-fs-toolbar';
      bar.style.cssText = 'position:fixed!important;top:8px!important;right:12px!important;z-index:10002!important;display:flex!important;flex-direction:row!important;align-items:center!important;flex-wrap:nowrap!important;gap:6px!important;';
      bar.innerHTML =
        (opts.extra || '') +
        '<button type="button" class="ac-btn ac-fs-btn" data-act="fs-" title="Smaller font" style="height:28px;min-height:28px;padding:0 8px;font-size:12px;flex:0 0 auto">A−</button>' +
        '<button type="button" class="ac-btn ac-fs-btn" data-act="fs+" title="Larger font" style="height:28px;min-height:28px;padding:0 8px;font-size:12px;flex:0 0 auto">A+</button>' +
        '<button type="button" class="ac-btn ac-fs-btn" data-act="close" title="Exit fullscreen (Esc)" style="height:28px;min-height:28px;padding:0 8px;font-size:12px;flex:0 0 auto">✕ Close</button>';
      panel.insertBefore(bar, panel.firstChild);
      panel._fsBar = bar;

      function bump(delta) {
        var cur = parseInt(localStorage.getItem(storageKey), 10) || 13;
        var next = Math.max(10, Math.min(24, cur + delta));
        localStorage.setItem(storageKey, String(next));
        content.style.setProperty('--panel-font-size', next + 'px');
      }
      bar.querySelector('[data-act="fs-"]').addEventListener('click', function () { bump(-1); });
      bar.querySelector('[data-act="fs+"]').addEventListener('click', function () { bump(1); });
      bar.querySelector('[data-act="close"]').addEventListener('click', exit);

      if (typeof opts.onEnter === 'function') opts.onEnter(panel, bar);
    }
    function exit() {
      if (typeof opts.onExit === 'function') opts.onExit(panel);
      panel.classList.remove('is-fullscreen');
      fsBtn.classList.remove('fs-active');
      fsBtn.textContent = '⛶';
      fsBtn.title = 'Fullscreen';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      var ov = document.getElementById('fs-overlay');
      if (ov) {
        ov.classList.remove('active');
        ov.onclick = null;
      }
      if (panel._fsBar) { panel._fsBar.remove(); panel._fsBar = null; }
      window.scrollTo({ top: savedScrollY, behavior: 'instant' });
      if (window.scrollY !== savedScrollY) {
        window.scrollTo(0, savedScrollY);
      }
    }
    fsBtn.addEventListener('click', function () {
      if (panel.classList.contains('is-fullscreen')) exit();
      else enter();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-fullscreen')) { e.preventDefault(); exit(); }
    });
  };

  /**
   * One-shot helper for binary file uploads (PDFs, images, etc.).
   * Drop-in replacement for `await file.arrayBuffer()` that shows a progress bar
   * and enforces a size cap. Returns the ArrayBuffer.
   *
   *   const buf = await window.loadFileWithProgress(file);        // 100 MB default
   *   const buf = await window.loadFileWithProgress(file, 50);    // 50 MB cap
   */
  window.getToolName = getToolName;
  window.getToolDesc = getToolDesc;
  window.getToolCategory = getToolCategory;
  window.TOOL_I18N = TOOL_I18N;
  window.CATEGORY_I18N = CATEGORY_I18N;

  /* Sprint S10/S11 Window APIs */
  window.getCanonicalToolPath = getCanonicalToolPath;
  window.getFavoritesList = getFavoritesList;
  window.isFavoriteTool = isFavoriteTool;
  window.toggleFavoriteTool = toggleFavoriteTool;
  window.getRecentsList = getRecentsList;
  window.getRecentsRaw = getRecentsRaw;
  window.recordRecentTool = recordRecentTool;
  window.clearRecents = clearRecents;
  window.removeRecentTool = removeRecentTool;
  window.initDashboardRecents = initDashboardRecents;

  window.loadFileWithProgress = function (file, maxMB) {
    maxMB = typeof maxMB === 'number' ? maxMB : 100;
    var L = window.progStrings();
    var maxBytes = maxMB * 1024 * 1024;
    if (file.size > maxBytes) {
      var err = new Error(L.exceeds((file.size / 1024 / 1024).toFixed(1), maxMB));
      window.showToast(err.message, 'error');
      return Promise.reject(err);
    }
    var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var prog = window.showProgress(L.loading + ' ' + file.name, {
      cancellable: !!ctrl,
      onCancel: function () { if (ctrl) ctrl.abort(); }
    });
    prog.setPhase(L.uploading);
    var total = formatBytesShort(file.size);
    var startedAt = performance.now();
    return window.readFileChunkedBuffer(file, {
      maxBytes: maxBytes,
      signal: ctrl ? ctrl.signal : undefined,
      onProgress: function (p) {
        var pct = Math.min(99, p.percent);
        var elapsed = (performance.now() - startedAt) / 1000;
        var eta = (p.percent > 2 && p.percent < 99) ? Math.max(0, (elapsed / (p.percent / 100)) - elapsed) : 0;
        prog.update(pct, formatBytesShort(p.loaded) + ' / ' + total, eta > 0 ? L.eta(Math.ceil(eta)) : '');
      }
    }).then(function (buf) {
      prog.done();
      return buf;
    }, function (err) {
      if (err && err.message === 'aborted') { prog.done(); window.showToast(L.cancelled, 'info'); }
      else prog.fail(err && err.message ? err.message : L.failedRead);
      throw err;
    });
  };
})();
