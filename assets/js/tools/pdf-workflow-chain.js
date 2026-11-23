/**
 * AnyConverter — Contextual PDF Workflow Chain (Sprint S25)
 *
 * Implements non-interruptive "Next Step" chaining across the primary PDF group:
 * - /pdf-merge/, /pdf-split/, /pdf-compress/, /pdf-to-jpg/, /jpg-to-pdf/, /edit-pdf/
 * - Supports EN, ES, DA with complete diacritics and cross-locale link routing.
 * - Ephemeral client-side handoff via sessionStorage (ac:chain-pdf-blob / ac:chain-pdf-name / ac:chain-pdf-source).
 * - Strict zero-persistence guarantee: clears storage keys immediately upon ingestion; 0 server upload.
 * - WCAG 2.2 AA keyboard accessible (tabbing, Space/Enter, Esc dismiss).
 * - Full telemetry integration with window.ACAnalytics.
 */
(function (root) {
  'use strict';

  var STORAGE_KEY_BLOB = 'ac:chain-pdf-blob';
  var STORAGE_KEY_NAME = 'ac:chain-pdf-name';
  var STORAGE_KEY_SOURCE = 'ac:chain-pdf-source';
  var STORAGE_KEY_DISMISSED = 'ac:chain-pdf-dismissed';

  var currentStagedBlob = null;
  var currentStagedName = null;

  function getActiveLocale() {
    if (typeof window === 'undefined' || !window.location) return 'en';
    var p = window.location.pathname || '';
    if (p.indexOf('/es/') === 0 || p === '/es') return 'es';
    if (p.indexOf('/da/') === 0 || p === '/da') return 'da';
    return 'en';
  }

  function getCurrentToolSlug() {
    if (typeof window === 'undefined' || !window.location) return 'pdf-merge';
    var p = (window.location.pathname || '').replace(/^\/(es|da)\//, '/').replace(/^\/|\/$/g, '');
    return p || 'pdf-merge';
  }

  function dataUrlToFile(dataUrl, filename) {
    var parts = dataUrl.split(',');
    var mimeMatch = parts[0].match(/:(.*?);/);
    var mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
    var bstr = atob(parts[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    try {
      return new File([u8arr], filename, { type: mime });
    } catch (_e) {
      var blob = new Blob([u8arr], { type: mime });
      blob.name = filename;
      return blob;
    }
  }

  function getToastMessage(sourceSlug, targetSlug, locale) {
    var isMerge = sourceSlug === 'pdf-merge';
    if (locale === 'es') {
      if (isMerge && targetSlug === 'pdf-compress') return 'PDF unido cargado y listo para comprimir';
      if (isMerge && targetSlug === 'pdf-split') return 'PDF unido cargado y listo para dividir páginas';
      if (isMerge && targetSlug === 'pdf-to-jpg') return 'PDF unido cargado y listo para convertir a JPG';
      return 'PDF cargado y listo para continuar';
    }
    if (locale === 'da') {
      if (isMerge && targetSlug === 'pdf-compress') return 'Samlet PDF indlæst og klar til komprimering';
      if (isMerge && targetSlug === 'pdf-split') return 'Samlet PDF indlæst og klar til opdeling';
      if (isMerge && targetSlug === 'pdf-to-jpg') return 'Samlet PDF indlæst og klar til konvertering til JPG';
      return 'PDF indlæst og klar til behandling';
    }
    // Default EN
    if (isMerge && targetSlug === 'pdf-compress') return 'Merged PDF loaded and ready to compress';
    if (isMerge && targetSlug === 'pdf-split') return 'Merged PDF loaded and ready to split';
    if (isMerge && targetSlug === 'pdf-to-jpg') return 'Merged PDF loaded and ready to convert to JPG';
    return 'PDF loaded and ready for next step';
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
    }, 6000);
  }

  function feedFileToActiveTool(file) {
    if (typeof window === 'undefined') return;

    function tryInject() {
      if (window._acCurrentToolComponent && typeof window._acCurrentToolComponent.addPdfs === 'function') {
        window._acCurrentToolComponent.addPdfs([file]);
        return true;
      }
      if (typeof window._acLoadPdfFile === 'function') {
        window._acLoadPdfFile(file);
        return true;
      }
      var edInput = document.getElementById('ed-file');
      if (edInput) {
        try {
          var dt = new DataTransfer();
          dt.items.add(file);
          edInput.files = dt.files;
          edInput.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        } catch (_e) {}
      }
      return false;
    }

    if (tryInject()) return;

    var attempts = 0;
    var timer = setInterval(function () {
      attempts++;
      if (tryInject() || attempts >= 30) {
        clearInterval(timer);
      }
    }, 100);

    window.addEventListener('ac:tool-mounted', function onMount() {
      window.removeEventListener('ac:tool-mounted', onMount);
      clearInterval(timer);
      tryInject();
    });
  }

  var ACWorkflowChainPDF = {
    init: function () {
      if (typeof document === 'undefined') return;

      var chainSection = document.getElementById('workflow-chain-pdf');
      if (!chainSection) return;

      var dismissBtn = document.getElementById('btn-chain-dismiss');
      if (dismissBtn) {
        dismissBtn.addEventListener('click', function (e) {
          e.preventDefault();
          ACWorkflowChainPDF.hideWorkflowChain();
          try {
            sessionStorage.setItem(STORAGE_KEY_DISMISSED, 'true');
          } catch (_e) {}

          if (window.ACAnalytics) {
            if (typeof window.ACAnalytics.trackWorkflowChainDismissed === 'function') {
              window.ACAnalytics.trackWorkflowChainDismissed(getCurrentToolSlug(), 'pdf');
            } else if (typeof window.ACAnalytics.track === 'function') {
              window.ACAnalytics.track('workflow_chain_dismissed', {
                tool_slug: getCurrentToolSlug(),
                group: 'pdf'
              });
            }
          }
        });
      }

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
          var el = document.getElementById('workflow-chain-pdf');
          if (el && el.style.display !== 'none') {
            ACWorkflowChainPDF.hideWorkflowChain();
            try {
              sessionStorage.setItem(STORAGE_KEY_DISMISSED, 'true');
            } catch (_err) {}
            if (window.ACAnalytics) {
              if (typeof window.ACAnalytics.trackWorkflowChainDismissed === 'function') {
                window.ACAnalytics.trackWorkflowChainDismissed(getCurrentToolSlug(), 'pdf');
              } else if (typeof window.ACAnalytics.track === 'function') {
                window.ACAnalytics.track('workflow_chain_dismissed', {
                  tool_slug: getCurrentToolSlug(),
                  group: 'pdf'
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

          if (window.ACAnalytics && typeof window.ACAnalytics.trackRelatedToolClicked === 'function') {
            window.ACAnalytics.trackRelatedToolClicked(sourceSlug, targetSlug, 'workflow_chain');
          }

          if (currentStagedBlob && (!sessionStorage.getItem(STORAGE_KEY_BLOB))) {
            try {
              sessionStorage.setItem(STORAGE_KEY_NAME, currentStagedName || 'document.pdf');
              sessionStorage.setItem(STORAGE_KEY_SOURCE, sourceSlug);
            } catch (_err) {}
          }
        });
      });

      ACWorkflowChainPDF.checkIncomingHandoff();
    },

    showWorkflowChain: function (blob, filename) {
      if (typeof document === 'undefined') return;

      try {
        if (sessionStorage.getItem(STORAGE_KEY_DISMISSED) === 'true') {
          return;
        }
      } catch (_e) {}

      var chainSection = document.getElementById('workflow-chain-pdf');
      if (!chainSection) return;

      currentStagedBlob = blob;
      currentStagedName = filename || 'document.pdf';
      var sourceSlug = getCurrentToolSlug();

      if (blob && blob.size <= 8 * 1024 * 1024) {
        try {
          var reader = new FileReader();
          reader.onloadend = function () {
            try {
              sessionStorage.setItem(STORAGE_KEY_BLOB, reader.result);
              sessionStorage.setItem(STORAGE_KEY_NAME, currentStagedName);
              sessionStorage.setItem(STORAGE_KEY_SOURCE, sourceSlug);
            } catch (_e) {}
          };
          reader.readAsDataURL(blob);
        } catch (_err) {}
      }

      chainSection.style.display = 'block';

      if (window.ACAnalytics) {
        if (typeof window.ACAnalytics.trackWorkflowChainShown === 'function') {
          window.ACAnalytics.trackWorkflowChainShown(sourceSlug, 'pdf');
        } else if (typeof window.ACAnalytics.track === 'function') {
          window.ACAnalytics.track('workflow_chain_shown', {
            tool_slug: sourceSlug,
            group: 'pdf'
          });
        }
      }
    },

    hideWorkflowChain: function () {
      if (typeof document === 'undefined') return;
      var chainSection = document.getElementById('workflow-chain-pdf');
      if (chainSection) {
        chainSection.style.display = 'none';
      }
    },

    checkIncomingHandoff: function () {
      if (typeof window === 'undefined' || !window.sessionStorage) return;

      var blobData = null;
      var fileName = 'document.pdf';
      var sourceSlug = 'pdf-merge';

      try {
        blobData = sessionStorage.getItem(STORAGE_KEY_BLOB);
        fileName = sessionStorage.getItem(STORAGE_KEY_NAME) || 'document.pdf';
        sourceSlug = sessionStorage.getItem(STORAGE_KEY_SOURCE) || 'pdf-merge';

        if (blobData || sessionStorage.getItem(STORAGE_KEY_NAME)) {
          sessionStorage.removeItem(STORAGE_KEY_BLOB);
          sessionStorage.removeItem(STORAGE_KEY_NAME);
          sessionStorage.removeItem(STORAGE_KEY_SOURCE);
        }
      } catch (_e) {
        return;
      }

      if (!blobData || !blobData.startsWith('data:')) return;

      var file = dataUrlToFile(blobData, fileName);
      feedFileToActiveTool(file);

      var locale = getActiveLocale();
      var targetSlug = getCurrentToolSlug();
      var toastMsg = getToastMessage(sourceSlug, targetSlug, locale);
      showToastBanner(toastMsg);
    }
  };

  root.ACWorkflowChainPDF = ACWorkflowChainPDF;

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', ACWorkflowChainPDF.init);
    } else {
      ACWorkflowChainPDF.init();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ACWorkflowChainPDF;
  }
})(typeof window !== 'undefined' ? window : this);
