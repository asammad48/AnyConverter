/**
 * AnyConverter.io — Progressive Web App (PWA) Manager
 *
 * Implements:
 * 1. Scoped service worker registration with graceful fallback.
 * 2. Deferred, non-intrusive install prompt (never on initial landing).
 * 3. Contextual triggering after tool interaction / calculation.
 * 4. 14-day dismissal rate-limiting via localStorage['ac:pwa-dismissed-ts'].
 * 5. Full WCAG 2.2 AA accessibility and multilingual strings (EN, ES, DA).
 * 6. Telemetry integration via window.ACAnalytics (pwa_prompt_shown, pwa_installed, pwa_dismissed).
 */

(function (root) {
  'use strict';

  var DISMISS_KEY = 'ac:pwa-dismissed-ts';
  var INSTALLED_KEY = 'ac:pwa-installed';
  var INTERACTION_KEY = 'ac:tool-interaction-completed';
  var DISMISS_SUPPRESSION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

  var deferredPrompt = null;
  var promptShownThisSession = false;

  var I18N = {
    en: {
      title: 'Install AnyConverter App',
      desc: 'Fast, offline-ready calculators & utilities directly on your desktop or home screen.',
      installBtn: 'Install App',
      dismissBtn: 'Not Now',
      bannerAria: 'Install AnyConverter Application',
      installAria: 'Install AnyConverter application to device',
      dismissAria: 'Dismiss installation prompt for 14 days'
    },
    es: {
      title: 'Instalar AnyConverter',
      desc: 'Calculadoras y utilidades rápidas sin conexión directamente en tu pantalla de inicio.',
      installBtn: 'Instalar app',
      dismissBtn: 'Ahora no',
      bannerAria: 'Instalar aplicación AnyConverter',
      installAria: 'Instalar la aplicación AnyConverter en el dispositivo',
      dismissAria: 'Descartar aviso de instalación por 14 días'
    },
    da: {
      title: 'Installer AnyConverter',
      desc: 'Hurtige lommeregnere og udviklerværktøjer offline direkte på din startskærm.',
      installBtn: 'Installer app',
      dismissBtn: 'Ikke nu',
      bannerAria: 'Installer AnyConverter applikation',
      installAria: 'Installer AnyConverter applikation på enhed',
      dismissAria: 'Afvis installationsmeddelelse i 14 dage'
    }
  };

  function getLocale() {
    if (typeof root.acLang === 'function') {
      return root.acLang();
    }
    if (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang) {
      var l = document.documentElement.lang.toLowerCase();
      if (l.indexOf('es') === 0) return 'es';
      if (l.indexOf('da') === 0) return 'da';
    }
    return 'en';
  }

  function isDismissed() {
    try {
      if (!root.localStorage) return false;
      var ts = root.localStorage.getItem(DISMISS_KEY);
      if (!ts) return false;
      var elapsed = Date.now() - Number(ts);
      return elapsed >= 0 && elapsed < DISMISS_SUPPRESSION_MS;
    } catch (e) {
      return false;
    }
  }

  function isInstalled() {
    try {
      if (root.localStorage && root.localStorage.getItem(INSTALLED_KEY) === 'true') {
        return true;
      }
      if (root.matchMedia && root.matchMedia('(display-mode: standalone)').matches) {
        return true;
      }
      if (root.navigator && root.navigator.standalone === true) {
        return true;
      }
    } catch (e) {}
    return false;
  }

  function hasInteracted() {
    try {
      if (!root.sessionStorage) return false;
      return root.sessionStorage.getItem(INTERACTION_KEY) === 'true';
    } catch (e) {
      return false;
    }
  }

  function setInteracted() {
    try {
      if (root.sessionStorage) {
        root.sessionStorage.setItem(INTERACTION_KEY, 'true');
      }
    } catch (e) {}
  }

  function updateSubtleInstallButton(visible) {
    if (typeof document === 'undefined') return;
    var btn = document.getElementById('btn-footer-pwa-install');
    if (btn) {
      btn.style.display = visible ? 'inline-flex' : 'none';
    }
  }

  function createOrGetBanner() {
    if (typeof document === 'undefined') return null;
    var existing = document.getElementById('pwa-install-banner');
    if (existing) return existing;

    var locale = getLocale();
    var t = I18N[locale] || I18N.en;

    var banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.className = 'pwa-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', t.bannerAria);
    banner.style.display = 'none';

    banner.innerHTML = [
      '<div class="pwa-banner-content">',
      '  <img src="/assets/img/icon-192.png" alt="AnyConverter" class="pwa-banner-icon" width="44" height="44">',
      '  <div class="pwa-banner-text">',
      '    <strong class="pwa-banner-title">' + t.title + '</strong>',
      '    <p class="pwa-banner-desc">' + t.desc + '</p>',
      '  </div>',
      '</div>',
      '<div class="pwa-banner-actions">',
      '  <button id="pwa-dismiss-btn" class="pwa-btn pwa-btn-dismiss" aria-label="' + t.dismissAria + '">' + t.dismissBtn + '</button>',
      '  <button id="pwa-install-btn" class="pwa-btn pwa-btn-install" aria-label="' + t.installAria + '">' + t.installBtn + '</button>',
      '</div>'
    ].join('\n');

    document.body.appendChild(banner);

    // Bind action events
    var dismissBtn = banner.querySelector('#pwa-dismiss-btn');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', handleDismiss);
    }
    var installBtn = banner.querySelector('#pwa-install-btn');
    if (installBtn) {
      installBtn.addEventListener('click', handleInstallClick);
    }

    return banner;
  }

  function showBanner(triggerSource) {
    if (isDismissed() || isInstalled()) {
      return;
    }
    var banner = createOrGetBanner();
    if (!banner) return;

    banner.style.display = 'flex';

    if (!promptShownThisSession) {
      promptShownThisSession = true;
      if (root.ACAnalytics && typeof root.ACAnalytics.trackPwaPromptShown === 'function') {
        root.ACAnalytics.trackPwaPromptShown(triggerSource || 'tool_interaction');
      }
      if (typeof CustomEvent === 'function' && root.dispatchEvent) {
        try {
          root.dispatchEvent(new CustomEvent('ac:pwa-prompt-shown', {
            detail: { trigger_source: triggerSource || 'tool_interaction' }
          }));
        } catch (e) {}
      }
    }
  }

  function hideBanner() {
    if (typeof document === 'undefined') return;
    var banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.style.display = 'none';
    }
  }

  function handleDismiss() {
    try {
      if (root.localStorage) {
        root.localStorage.setItem(DISMISS_KEY, String(Date.now()));
      }
    } catch (e) {}

    hideBanner();

    if (root.ACAnalytics && typeof root.ACAnalytics.trackPwaDismissed === 'function') {
      root.ACAnalytics.trackPwaDismissed('dismiss_button');
    }
    if (typeof CustomEvent === 'function' && root.dispatchEvent) {
      try {
        root.dispatchEvent(new CustomEvent('ac:pwa-dismissed', {
          detail: { action: 'dismiss_button' }
        }));
      } catch (e) {}
    }
  }

  function handleInstallClick() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function (choice) {
        if (choice && choice.outcome === 'accepted') {
          try {
            if (root.localStorage) {
              root.localStorage.setItem(INSTALLED_KEY, 'true');
            }
          } catch (e) {}
          if (root.ACAnalytics && typeof root.ACAnalytics.trackPwaInstalled === 'function') {
            root.ACAnalytics.trackPwaInstalled('accepted');
          }
        } else {
          if (root.ACAnalytics && typeof root.ACAnalytics.trackPwaDismissed === 'function') {
            root.ACAnalytics.trackPwaDismissed('prompt_cancelled');
          }
        }
        deferredPrompt = null;
        hideBanner();
        updateSubtleInstallButton(false);
      }).catch(function () {
        hideBanner();
      });
    } else {
      // Manual fallback or guide if prompt not available
      hideBanner();
    }
  }

  function onToolInteractionSuccess() {
    setInteracted();
    // Only show banner if install prompt was intercepted and user is eligible
    if (deferredPrompt && !isDismissed() && !isInstalled()) {
      showBanner('tool_interaction');
    }
  }

  // Intercept beforeinstallprompt
  if (typeof root.addEventListener === 'function') {
    root.addEventListener('beforeinstallprompt', function (e) {
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
      deferredPrompt = e;
      updateSubtleInstallButton(true);

      // Never show immediately on first-load! Only show if user has already performed an interaction
      if (hasInteracted() && !isDismissed() && !isInstalled()) {
        showBanner('deferred_prompt_ready');
      }
    });

    root.addEventListener('appinstalled', function () {
      deferredPrompt = null;
      try {
        if (root.localStorage) {
          root.localStorage.setItem(INSTALLED_KEY, 'true');
        }
      } catch (e) {}
      hideBanner();
      updateSubtleInstallButton(false);
      if (root.ACAnalytics && typeof root.ACAnalytics.trackPwaInstalled === 'function') {
        root.ACAnalytics.trackPwaInstalled('appinstalled_event');
      }
    });

    // Listen for successful tool actions from analytics adapter or custom events
    root.addEventListener('ac:analytics-event', function (e) {
      if (e && e.detail && e.detail.event) {
        var ev = e.detail.event;
        if (ev === 'tool_completed' || ev === 'result_copied' || ev === 'result_downloaded' || ev === 'share_link_generated') {
          onToolInteractionSuccess();
        }
      }
    });

    root.addEventListener('ac:tool-interaction-success', function () {
      onToolInteractionSuccess();
    });

    // Service Worker registration on load
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      root.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
          .catch(function (err) {
            // Graceful fallback: website continues 100% operational
            if (root.console && root.console.warn) {
              root.console.warn('[PWA] Service Worker registration failed:', err ? err.message : err);
            }
          });
      });
    }
  }

  // Public API for testing and programmatic triggers
  var PwaManager = {
    I18N: I18N,
    getLocale: getLocale,
    isDismissed: isDismissed,
    isInstalled: isInstalled,
    hasInteracted: hasInteracted,
    markInteractionSuccess: onToolInteractionSuccess,
    showBanner: showBanner,
    hideBanner: hideBanner,
    handleDismiss: handleDismiss,
    handleInstallClick: handleInstallClick,
    getDeferredPrompt: function () { return deferredPrompt; },
    setDeferredPrompt: function (p) { deferredPrompt = p; },
    resetStateForTest: function () {
      deferredPrompt = null;
      promptShownThisSession = false;
    }
  };

  root.ACPwa = PwaManager;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PwaManager;
  }
})(typeof window !== 'undefined' ? window : global);
