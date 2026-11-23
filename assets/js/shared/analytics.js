/**
 * AnyConverter.io — Shared Analytics Adapter
 *
 * Implements the 16-event canonical dictionary for client-side tool analytics.
 * Strictly adheres to privacy constraints: zero PII, zero filenames, zero user document content.
 * Dispatches to window.gtag and emits 'ac:analytics-event' on window for test verification.
 */
(function (root) {
  'use strict';

  // The 16 canonical event names permitted by the AnyConverter tracking dictionary
  var CANONICAL_EVENTS = {
    PAGE_VIEW: 'page_view',
    TOOL_VIEWED: 'tool_viewed',
    TOOL_STARTED: 'tool_started',
    TOOL_COMPLETED: 'tool_completed',
    TOOL_FAILED: 'tool_failed',
    TOOL_RESET: 'tool_reset',
    RESULT_COPIED: 'result_copied',
    RESULT_DOWNLOADED: 'result_downloaded',
    SEARCH_OPENED: 'search_opened',
    SEARCH_PERFORMED: 'search_performed',
    SEARCH_RESULT_CLICKED: 'search_result_clicked',
    FAVORITE_ADDED: 'favorite_added',
    FAVORITE_REMOVED: 'favorite_removed',
    LANGUAGE_SWITCHED: 'language_switched',
    RELATED_TOOL_CLICKED: 'related_tool_clicked',
    CATEGORY_HUB_CLICKED: 'category_hub_clicked'
  };

  var ALLOWED_EVENTS_SET = {};
  Object.keys(CANONICAL_EVENTS).forEach(function (k) {
    ALLOWED_EVENTS_SET[CANONICAL_EVENTS[k]] = true;
  });

  // Sprint S11 engagement events (Recents row interactions)
  var S11_ENGAGEMENT_EVENTS = {
    RECENT_CLICKED: 'recent_clicked',
    RECENTS_CLEARED: 'recents_cleared'
  };
  Object.keys(S11_ENGAGEMENT_EVENTS).forEach(function (k) {
    ALLOWED_EVENTS_SET[S11_ENGAGEMENT_EVENTS[k]] = true;
  });

  // Sprint S13 shareable state events
  var S13_ENGAGEMENT_EVENTS = {
    SHARE_LINK_GENERATED: 'share_link_generated'
  };
  Object.keys(S13_ENGAGEMENT_EVENTS).forEach(function (k) {
    ALLOWED_EVENTS_SET[S13_ENGAGEMENT_EVENTS[k]] = true;
  });

  // Sprint S15 PWA lifecycle events
  var S15_PWA_EVENTS = {
    PWA_PROMPT_SHOWN: 'pwa_prompt_shown',
    PWA_INSTALLED: 'pwa_installed',
    PWA_DISMISSED: 'pwa_dismissed'
  };
  Object.keys(S15_PWA_EVENTS).forEach(function (k) {
    ALLOWED_EVENTS_SET[S15_PWA_EVENTS[k]] = true;
  });

  // Sprint S25 Workflow Chain events
  var S25_WORKFLOW_EVENTS = {
    WORKFLOW_CHAIN_SHOWN: 'workflow_chain_shown',
    WORKFLOW_CHAIN_DISMISSED: 'workflow_chain_dismissed'
  };
  Object.keys(S25_WORKFLOW_EVENTS).forEach(function (k) {
    ALLOWED_EVENTS_SET[S25_WORKFLOW_EVENTS[k]] = true;
  });

  // Sensitive parameter keys that must NEVER be transmitted (zero PII, zero file content)
  var FORBIDDEN_KEY_REGEX = /^(file|filename|content|text|data|input|query|email|user|pass|password|token|secret|doc|prompt|val|body|ip|address|ssn|card|credit)$/i;
  // Patterns matching emails, IP addresses, credit cards, or external URLs
  var PII_REGEX = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+|\b(?:\d{1,3}\.){3}\d{1,3}\b|\b(?:\d[ -]*?){13,16}\b|https?:\/\/[^\s]+/i;

  var eventQueue = [];
  var toolStartTimers = {};

  /**
   * Determine current active locale from pathname or document element.
   */
  function getCurrentLocale() {
    var path = root.location ? root.location.pathname : '';
    if (/^\/es(\/|$)/i.test(path)) return 'es';
    if (/^\/da(\/|$)/i.test(path)) return 'da';
    if (document && document.documentElement && document.documentElement.lang) {
      var l = document.documentElement.lang.toLowerCase();
      if (l.indexOf('es') === 0) return 'es';
      if (l.indexOf('da') === 0) return 'da';
    }
    return 'en';
  }

  /**
   * Determine current tool slug from path.
   */
  function getCurrentToolSlug() {
    if (!root.location) return 'homepage';
    var p = root.location.pathname.replace(/^\/(es|da)\//, '/').replace(/^\/|\/$/g, '');
    return p || 'homepage';
  }

  /**
   * Sanitize parameters to guarantee zero PII or raw user input leaks.
   */
  function sanitizeParams(params) {
    if (!params || typeof params !== 'object') return {};
    var safe = {};
    for (var key in params) {
      if (!Object.prototype.hasOwnProperty.call(params, key)) continue;

      // Drop any forbidden sensitive parameter names entirely
      if (FORBIDDEN_KEY_REGEX.test(key)) {
        continue;
      }

      var val = params[key];

      if (typeof val === 'string') {
        if (PII_REGEX.test(val)) {
          safe[key] = '[REDACTED]';
        } else {
          // Clamp string length to 64 chars
          safe[key] = val.substring(0, 64);
        }
      } else if (typeof val === 'number') {
        safe[key] = isFinite(val) ? val : 0;
      } else if (typeof val === 'boolean') {
        safe[key] = val;
      }
    }
    return safe;
  }

  /**
   * Core tracking function.
   */
  function track(eventName, params) {
    if (!ALLOWED_EVENTS_SET[eventName]) {
      if (root.console && console.warn) {
        console.warn('[ACAnalytics] Unrecognized event dropped:', eventName);
      }
      return;
    }

    var base = {
      locale: getCurrentLocale(),
      page_path: root.location ? root.location.pathname : '',
      timestamp: Date.now()
    };

    var payload = Object.assign(base, sanitizeParams(params));

    // Emit DOM CustomEvent for local integration & test assertion
    if (typeof CustomEvent === 'function' && root.dispatchEvent) {
      try {
        var ev = new CustomEvent('ac:analytics-event', { detail: { event: eventName, payload: payload } });
        root.dispatchEvent(ev);
      } catch (e) {}
    }

    // Deliver to GA4 gtag
    if (typeof root.gtag === 'function') {
      root.gtag('event', eventName, payload);
    } else {
      eventQueue.push({ event: eventName, payload: payload });
    }
  }

  /**
   * Flush pending queue once gtag becomes available.
   */
  function flushQueue() {
    if (typeof root.gtag !== 'function') return;
    while (eventQueue.length > 0) {
      var item = eventQueue.shift();
      root.gtag('event', item.event, item.payload);
    }
  }

  // Poll lightly or listen for gtag availability
  var flushInterval = setInterval(function () {
    if (typeof root.gtag === 'function') {
      flushQueue();
      clearInterval(flushInterval);
    }
  }, 300);

  // Clear interval after 10s to avoid background leak
  setTimeout(function () { clearInterval(flushInterval); }, 10000);

  /* === Convenience Methods for 16 Canonical Events === */

  var ACAnalytics = {
    EVENTS: CANONICAL_EVENTS,

    track: track,

    flush: flushQueue,

    getQueue: function () {
      return eventQueue.slice();
    },

    // 1. Tool Interaction Funnel
    trackToolViewed: function (toolSlug, category) {
      track(CANONICAL_EVENTS.TOOL_VIEWED, {
        tool_slug: toolSlug || getCurrentToolSlug(),
        category: category || 'Utilities'
      });
    },

    trackToolStarted: function (toolSlug, inputType, extra) {
      var slug = toolSlug || getCurrentToolSlug();
      toolStartTimers[slug] = Date.now();
      var data = Object.assign({
        tool_slug: slug,
        input_type: inputType || 'manual_input'
      }, extra || {});
      track(CANONICAL_EVENTS.TOOL_STARTED, data);
    },

    trackToolCompleted: function (toolSlug, inputType, outputType, extra) {
      var slug = toolSlug || getCurrentToolSlug();
      var start = toolStartTimers[slug];
      var durationMs = start ? Math.max(0, Date.now() - start) : 0;
      delete toolStartTimers[slug];

      var data = Object.assign({
        tool_slug: slug,
        input_type: inputType || 'manual_input',
        output_type: outputType || 'calculated_value',
        duration_ms: durationMs
      }, extra || {});
      track(CANONICAL_EVENTS.TOOL_COMPLETED, data);
    },

    trackToolFailed: function (toolSlug, errorType, extra) {
      var slug = toolSlug || getCurrentToolSlug();
      var start = toolStartTimers[slug];
      var durationMs = start ? Math.max(0, Date.now() - start) : 0;
      delete toolStartTimers[slug];

      var data = Object.assign({
        tool_slug: slug,
        error_type: errorType || 'validation_error',
        duration_ms: durationMs
      }, extra || {});
      track(CANONICAL_EVENTS.TOOL_FAILED, data);
    },

    trackToolReset: function (toolSlug) {
      track(CANONICAL_EVENTS.TOOL_RESET, {
        tool_slug: toolSlug || getCurrentToolSlug()
      });
    },

    trackResultCopied: function (toolSlug, format) {
      track(CANONICAL_EVENTS.RESULT_COPIED, {
        tool_slug: toolSlug || getCurrentToolSlug(),
        format: format || 'text'
      });
    },

    trackResultDownloaded: function (toolSlug, fileExt, sizeBracket) {
      track(CANONICAL_EVENTS.RESULT_DOWNLOADED, {
        tool_slug: toolSlug || getCurrentToolSlug(),
        file_extension: (fileExt || 'txt').toLowerCase().replace(/^\./, ''),
        size_bracket: sizeBracket || 'unknown'
      });
    },

    // 2. Search & Discovery
    trackSearchOpened: function (source) {
      track(CANONICAL_EVENTS.SEARCH_OPENED, {
        source: source || 'header_button'
      });
    },

    trackSearchPerformed: function (queryLength, resultsCount) {
      // NEVER pass query text — strictly query length & results count
      track(CANONICAL_EVENTS.SEARCH_PERFORMED, {
        query_length: typeof queryLength === 'number' ? queryLength : 0,
        results_count: typeof resultsCount === 'number' ? resultsCount : 0
      });
    },

    trackSearchResultClicked: function (toolSlug, rank) {
      track(CANONICAL_EVENTS.SEARCH_RESULT_CLICKED, {
        tool_slug: toolSlug,
        rank: typeof rank === 'number' ? rank : 0
      });
    },

    // 3. User Favorites
    trackFavorite: function (toolSlug, isAdded) {
      var event = isAdded ? CANONICAL_EVENTS.FAVORITE_ADDED : CANONICAL_EVENTS.FAVORITE_REMOVED;
      track(event, {
        tool_slug: toolSlug || getCurrentToolSlug()
      });
    },

    // 4. Navigation & Cross-Linking
    trackLanguageSwitched: function (fromLang, toLang) {
      track(CANONICAL_EVENTS.LANGUAGE_SWITCHED, {
        from_locale: fromLang,
        to_locale: toLang
      });
    },

    trackRelatedToolClicked: function (fromTool, toTool, position) {
      track(CANONICAL_EVENTS.RELATED_TOOL_CLICKED, {
        from_tool: fromTool || getCurrentToolSlug(),
        to_tool: toTool,
        position: position !== undefined ? position : 0
      });
    },

    trackCategoryHubClicked: function (category, source) {
      track(CANONICAL_EVENTS.CATEGORY_HUB_CLICKED, {
        category: category,
        source: source || 'nav'
      });
    },

    // 5. Sprint S11 Recents Telemetry
    trackRecentClicked: function (toolSlug, position) {
      track('recent_clicked', {
        tool_slug: toolSlug || getCurrentToolSlug(),
        position: typeof position === 'number' ? position : 0
      });
    },

    trackRecentsCleared: function () {
      track('recents_cleared', {});
    },

    // 6. Sprint S13 Shareable State Telemetry
    trackShareLinkGenerated: function (toolSlug, mode, status) {
      track('share_link_generated', {
        tool: toolSlug || getCurrentToolSlug(),
        tool_slug: toolSlug || getCurrentToolSlug(),
        mode: mode != null ? String(mode) : '1',
        status: status || 'success'
      });
    },

    // 7. Sprint S15 PWA Lifecycle Telemetry
    trackPwaPromptShown: function (triggerSource) {
      track('pwa_prompt_shown', {
        trigger_source: triggerSource || 'tool_interaction'
      });
    },

    trackPwaInstalled: function (outcome) {
      track('pwa_installed', {
        outcome: outcome || 'accepted'
      });
    },

    trackPwaDismissed: function (action) {
      track('pwa_dismissed', {
        action: action || 'dismiss_button'
      });
    },

    // 8. Sprint S25 Workflow Chain Telemetry
    trackWorkflowChainShown: function (toolSlug, group) {
      track('workflow_chain_shown', {
        tool_slug: toolSlug || getCurrentToolSlug(),
        group: group || 'pdf'
      });
    },

    trackWorkflowChainDismissed: function (toolSlug, group) {
      track('workflow_chain_dismissed', {
        tool_slug: toolSlug || getCurrentToolSlug(),
        group: group || 'pdf'
      });
    }
  };

  root.ACAnalytics = ACAnalytics;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ACAnalytics;
  }
})(typeof window !== 'undefined' ? window : global);
