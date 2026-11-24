/**
 * AnyConverter — Contextual Text Workflow Chain (Sprint S26)
 *
 * Implements non-interruptive "Next Step" chaining across the primary Text group:
 * - /word-counter/, /text-case-converter/, /text-diff-checker/, /character-counter/
 * - Supports EN, ES, DA with complete diacritics and cross-locale link routing.
 * - Ephemeral client-side text handoff via sessionStorage (ac:chain-text / ac:chain-text-source).
 * - Strict zero-persistence guarantee: clears storage keys immediately upon ingestion; 0 server upload.
 * - WCAG 2.2 AA keyboard accessible (tabbing, Space/Enter, Esc dismiss).
 * - Full telemetry integration with window.ACAnalytics.
 */
(function (root) {
  'use strict';

  var STORAGE_KEY_TEXT = 'ac:chain-text';
  var STORAGE_KEY_SOURCE = 'ac:chain-text-source';
  var STORAGE_KEY_DISMISSED = 'ac:chain-text-dismissed';

  function getActiveLocale() {
    if (typeof window === 'undefined' || !window.location) return 'en';
    var p = window.location.pathname || '';
    if (p.indexOf('/es/') === 0 || p === '/es') return 'es';
    if (p.indexOf('/da/') === 0 || p === '/da') return 'da';
    return 'en';
  }

  function getCurrentToolSlug() {
    if (typeof window === 'undefined' || !window.location) return 'word-counter';
    var p = (window.location.pathname || '').replace(/^\/(es|da)\//, '/').replace(/^\/|\/$/g, '');
    return p || 'word-counter';
  }

  function getActiveTextPayload() {
    if (typeof document === 'undefined') return '';

    // Word counter
    var wc = document.getElementById('wc-input');
    if (wc && wc.value) return wc.value.trim();

    // Text case converter (prefer transformed output, fallback to input)
    var tccOut = document.getElementById('tcc-output');
    if (tccOut && tccOut.value) return tccOut.value.trim();
    var tccIn = document.getElementById('tcc-input');
    if (tccIn && tccIn.value) return tccIn.value.trim();

    // Text diff checker
    var diffOrig = document.getElementById('diff-orig');
    if (diffOrig && diffOrig.value) return diffOrig.value.trim();
    var diffNew = document.getElementById('diff-new');
    if (diffNew && diffNew.value) return diffNew.value.trim();

    // Character counter
    var cc = document.getElementById('cc-text');
    if (cc && cc.value) return cc.value.trim();

    return '';
  }

  function getToastMessage(locale) {
    if (locale === 'es') return 'Texto cargado y listo para continuar';
    if (locale === 'da') return 'Tekst indlæst og klar til næste trin';
    return 'Text loaded and ready for next step';
  }

  function showToastBanner(msg) {
    if (typeof document === 'undefined') return;
    var existing = document.getElementById('workflow-chain-toast');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    var toast = document.createElement('div');
    toast.id = 'workflow-chain-toast';
    toast.className = 'workflow-chain-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    var textSpan = document.createElement('span');
    textSpan.className = 'workflow-chain-toast-msg';
    textSpan.textContent = msg;

    var dismissBtn = document.createElement('button');
    dismissBtn.type = 'button';
    dismissBtn.className = 'workflow-chain-toast-dismiss';
    dismissBtn.setAttribute('aria-label', 'Dismiss notification');
    dismissBtn.textContent = '✕';
    dismissBtn.addEventListener('click', function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    });

    toast.appendChild(textSpan);
    toast.appendChild(dismissBtn);
    document.body.appendChild(toast);

    setTimeout(function () {
      if (toast && toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(function () {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
      }
    }, 5000);
  }

  function feedTextToActiveTool(text) {
    if (typeof document === 'undefined') return;

    var wc = document.getElementById('wc-input');
    if (wc) {
      wc.value = text;
      wc.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }

    var tcc = document.getElementById('tcc-input');
    if (tcc) {
      tcc.value = text;
      tcc.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }

    var diffOrig = document.getElementById('diff-orig');
    if (diffOrig) {
      diffOrig.value = text;
      return;
    }

    var cc = document.getElementById('cc-text');
    if (cc) {
      cc.value = text;
      cc.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }
  }

  var ACTextWorkflowChain = {
    init: function () {
      if (typeof document === 'undefined') return;

      var chainSection = document.getElementById('workflow-chain-text');
      if (!chainSection) return;

      var dismissBtn = document.getElementById('btn-chain-dismiss');
      if (dismissBtn) {
        dismissBtn.addEventListener('click', function (e) {
          e.preventDefault();
          ACTextWorkflowChain.hideWorkflowChain();
          try {
            sessionStorage.setItem(STORAGE_KEY_DISMISSED, 'true');
          } catch (_e) {}

          if (window.ACAnalytics) {
            if (typeof window.ACAnalytics.trackWorkflowChainDismissed === 'function') {
              window.ACAnalytics.trackWorkflowChainDismissed(getCurrentToolSlug(), 'text');
            } else if (typeof window.ACAnalytics.track === 'function') {
              window.ACAnalytics.track('workflow_chain_dismissed', {
                tool_slug: getCurrentToolSlug(),
                group: 'text'
              });
            }
          }
        });
      }

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
          var el = document.getElementById('workflow-chain-text');
          if (el && el.style.display !== 'none') {
            ACTextWorkflowChain.hideWorkflowChain();
            try {
              sessionStorage.setItem(STORAGE_KEY_DISMISSED, 'true');
            } catch (_err) {}
            if (window.ACAnalytics) {
              if (typeof window.ACAnalytics.trackWorkflowChainDismissed === 'function') {
                window.ACAnalytics.trackWorkflowChainDismissed(getCurrentToolSlug(), 'text');
              } else if (typeof window.ACAnalytics.track === 'function') {
                window.ACAnalytics.track('workflow_chain_dismissed', {
                  tool_slug: getCurrentToolSlug(),
                  group: 'text'
                });
              }
            }
          }
        }
      });

      var cards = chainSection.querySelectorAll('.workflow-chain-card');
      cards.forEach(function (card) {
        card.addEventListener('click', function () {
          var targetSlug = card.getAttribute('data-target') || card.getAttribute('href');
          var sourceSlug = getCurrentToolSlug();
          var payload = getActiveTextPayload();

          if (payload && payload.length <= 500000) {
            try {
              sessionStorage.setItem(STORAGE_KEY_TEXT, payload);
              sessionStorage.setItem(STORAGE_KEY_SOURCE, sourceSlug);
            } catch (_err) {}
          }

          if (window.ACAnalytics && typeof window.ACAnalytics.trackRelatedToolClicked === 'function') {
            window.ACAnalytics.trackRelatedToolClicked(sourceSlug, targetSlug, 'workflow_chain');
          }
        });
      });

      ACTextWorkflowChain.checkIncomingHandoff();
    },

    showWorkflowChain: function () {
      if (typeof document === 'undefined') return;

      try {
        if (sessionStorage.getItem(STORAGE_KEY_DISMISSED) === 'true') {
          return;
        }
      } catch (_e) {}

      var chainSection = document.getElementById('workflow-chain-text');
      if (!chainSection) return;

      var sourceSlug = getCurrentToolSlug();
      chainSection.style.display = 'block';

      if (window.ACAnalytics) {
        if (typeof window.ACAnalytics.trackWorkflowChainShown === 'function') {
          window.ACAnalytics.trackWorkflowChainShown(sourceSlug, 'text');
        } else if (typeof window.ACAnalytics.track === 'function') {
          window.ACAnalytics.track('workflow_chain_shown', {
            tool_slug: sourceSlug,
            group: 'text'
          });
        }
      }
    },

    hideWorkflowChain: function () {
      if (typeof document === 'undefined') return;
      var chainSection = document.getElementById('workflow-chain-text');
      if (chainSection) {
        chainSection.style.display = 'none';
      }
    },

    checkIncomingHandoff: function () {
      if (typeof window === 'undefined' || !window.sessionStorage) return;

      var incomingText = null;

      try {
        incomingText = sessionStorage.getItem(STORAGE_KEY_TEXT);

        if (incomingText) {
          sessionStorage.removeItem(STORAGE_KEY_TEXT);
          sessionStorage.removeItem(STORAGE_KEY_SOURCE);
        }
      } catch (_e) {
        return;
      }

      if (!incomingText) return;

      feedTextToActiveTool(incomingText);

      var locale = getActiveLocale();
      var toastMsg = getToastMessage(locale);
      showToastBanner(toastMsg);
    }
  };

  root.ACTextWorkflowChain = ACTextWorkflowChain;

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', ACTextWorkflowChain.init);
    } else {
      ACTextWorkflowChain.init();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ACTextWorkflowChain;
  }
})(typeof window !== 'undefined' ? window : this);
