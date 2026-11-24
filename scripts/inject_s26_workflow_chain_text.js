#!/usr/bin/env node
'use strict';

/**
 * Script: scripts/inject_s26_workflow_chain_text.js
 * Injects the semantic #workflow-chain-text component and script tag into all 12 target text tool pages.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const TOOLS = [
  'word-counter',
  'text-case-converter',
  'text-diff-checker',
  'character-counter'
];

const LOCALES = ['en', 'es', 'da'];

const COPY = {
  en: {
    badge: 'Next Step',
    heading: 'Next Step: Continue Your Text Workflow',
    sub: 'Your text is ready. Continue directly with the next tool in the pipeline:',
    dismissAria: 'Dismiss workflow suggestions',
    cards: {
      'word-counter': {
        icon: '/assets/img/icon-wordcount.svg',
        alt: 'Word Counter icon',
        title: 'Word Counter',
        desc: 'Count words, sentences, paragraphs, and reading time',
        action: 'Count Words →'
      },
      'text-case-converter': {
        icon: '/assets/img/icon-textcase.svg',
        alt: 'Text Case Converter icon',
        title: 'Text Case Converter',
        desc: 'Convert to uppercase, lowercase, title case, camelCase, and more',
        action: 'Convert Case →'
      },
      'text-diff-checker': {
        icon: '/assets/img/icon-diff.svg',
        alt: 'Text Diff Checker icon',
        title: 'Text Diff Checker',
        desc: 'Compare two text versions side-by-side with line highlights',
        action: 'Compare Text →'
      },
      'character-counter': {
        icon: '/assets/img/icon-charcount.svg',
        alt: 'Character Counter icon',
        title: 'Character Counter',
        desc: 'Count characters with platform limits for X, LinkedIn, and SMS',
        action: 'Count Characters →'
      }
    }
  },
  es: {
    badge: 'Siguiente paso',
    heading: 'Siguiente paso: Continúa tu flujo de trabajo de texto',
    sub: 'Tu texto está listo. Continúa directamente con la siguiente herramienta del flujo:',
    dismissAria: 'Descartar sugerencias de flujo de trabajo',
    cards: {
      'word-counter': {
        icon: '/assets/img/icon-wordcount.svg',
        alt: 'Icono de Contador de palabras',
        title: 'Contador de palabras',
        desc: 'Cuenta palabras, oraciones, párrafos y tiempo de lectura',
        action: 'Contar palabras →'
      },
      'text-case-converter': {
        icon: '/assets/img/icon-textcase.svg',
        alt: 'Icono de Convertidor de mayúsculas y minúsculas',
        title: 'Convertidor de mayúsculas y minúsculas',
        desc: 'Convierte a mayúsculas, minúsculas, título, camelCase y más',
        action: 'Convertir texto →'
      },
      'text-diff-checker': {
        icon: '/assets/img/icon-diff.svg',
        alt: 'Icono de Comparador de texto',
        title: 'Comparador de texto',
        desc: 'Compara dos versiones de texto línea por línea',
        action: 'Comparar texto →'
      },
      'character-counter': {
        icon: '/assets/img/icon-charcount.svg',
        alt: 'Icono de Contador de caracteres',
        title: 'Contador de caracteres',
        desc: 'Cuenta caracteres con límites para X, LinkedIn y SMS',
        action: 'Contar caracteres →'
      }
    }
  },
  da: {
    badge: 'Næste trin',
    heading: 'Næste trin: Fortsæt dit tekst-workflow',
    sub: 'Din tekst er klar. Fortsæt direkte i det næste værktøj i pipelinen:',
    dismissAria: 'Afvis workflowforslag',
    cards: {
      'word-counter': {
        icon: '/assets/img/icon-wordcount.svg',
        alt: 'Ordoptæller ikon',
        title: 'Ordoptæller',
        desc: 'Tæl ord, sætninger, afsnit og estimeret læsetid',
        action: 'Tæl ord →'
      },
      'text-case-converter': {
        icon: '/assets/img/icon-textcase.svg',
        alt: 'Konvertering af store/små bogstaver ikon',
        title: 'Konvertering af store/små bogstaver',
        desc: 'Konvertér til store/små bogstaver, title case, camelCase og mere',
        action: 'Konvertér tekst →'
      },
      'text-diff-checker': {
        icon: '/assets/img/icon-diff.svg',
        alt: 'Tekstsammenligning ikon',
        title: 'Tekstsammenligning',
        desc: 'Sammenlign to tekstversioner side om side med linjefremhævelse',
        action: 'Sammenlign tekst →'
      },
      'character-counter': {
        icon: '/assets/img/icon-charcount.svg',
        alt: 'Tegntæller ikon',
        title: 'Tegntæller',
        desc: 'Tæl tegn med platformgrænser for X, LinkedIn og SMS',
        action: 'Tæl tegn →'
      }
    }
  }
};

function getCardKeysForTool(slug) {
  if (slug === 'word-counter') return ['text-case-converter', 'text-diff-checker', 'character-counter'];
  if (slug === 'text-case-converter') return ['word-counter', 'text-diff-checker', 'character-counter'];
  if (slug === 'text-diff-checker') return ['word-counter', 'text-case-converter', 'character-counter'];
  if (slug === 'character-counter') return ['word-counter', 'text-case-converter', 'text-diff-checker'];
  return ['word-counter', 'text-case-converter', 'text-diff-checker'];
}

function buildHtmlComponent(toolSlug, locale) {
  const c = COPY[locale];
  const keys = getCardKeysForTool(toolSlug);
  const pfx = locale === 'en' ? '/' : `/${locale}/`;

  let cardsHtml = '';
  keys.forEach((targetKey) => {
    const cardInfo = c.cards[targetKey];
    const targetUrl = `${pfx}${targetKey}/`;
    const stepId = `chain-step-${targetKey.replace(/^(text-|word-|character-)/, '')}`;
    cardsHtml += `        <a href="${targetUrl}" class="workflow-chain-card" id="${stepId}" data-target="${targetUrl}">
          <div class="workflow-chain-card-icon">
            <img src="${cardInfo.icon}" alt="${cardInfo.alt}" width="28" height="28" loading="lazy">
          </div>
          <div class="workflow-chain-card-content">
            <span class="workflow-chain-card-title">${cardInfo.title}</span>
            <span class="workflow-chain-card-desc">${cardInfo.desc}</span>
          </div>
          <span class="workflow-chain-card-action">${cardInfo.action}</span>
        </a>\n`;
  });

  return `    <!-- Contextual Workflow Chain: Next Step (Sprint S26) -->
    <section class="workflow-chain-section" id="workflow-chain-text" aria-labelledby="workflow-chain-heading" style="display:none;">
      <div class="workflow-chain-header">
        <div class="workflow-chain-badge">
          <span aria-hidden="true">⚡</span>
          <span>${c.badge}</span>
        </div>
        <h2 class="workflow-chain-title" id="workflow-chain-heading">${c.heading}</h2>
        <p class="workflow-chain-sub">${c.sub}</p>
        <button type="button" class="workflow-chain-dismiss" id="btn-chain-dismiss" aria-label="${c.dismissAria}">✕</button>
      </div>
      <div class="workflow-chain-grid">
${cardsHtml}      </div>
    </section>\n`;
}

let modified = 0;

LOCALES.forEach(locale => {
  TOOLS.forEach(tool => {
    const filePath = locale === 'en'
      ? path.join(ROOT, tool, 'index.html')
      : path.join(ROOT, locale, tool, 'index.html');

    if (!fs.existsSync(filePath)) {
      console.error(`File does not exist: ${filePath}`);
      return;
    }

    let html = fs.readFileSync(filePath, 'utf8');

    // Remove existing #workflow-chain-text if already present
    html = html.replace(/<!-- Contextual Workflow Chain: Next Step \(Sprint S26\) -->[\s\S]*?<\/section>\s*/g, '');

    const componentHtml = buildHtmlComponent(tool, locale);

    // Place component directly beneath the main tool interface (after </div> of tool-wrapper)
    const targetStr = '<div class="ad-slot ad-slot--leaderboard">';
    if (html.includes(targetStr)) {
      html = html.replace(targetStr, `${componentHtml}\n    ${targetStr}`);
    } else if (html.includes('<section class="how-to-use">')) {
      html = html.replace('<section class="how-to-use">', `${componentHtml}\n    <section class="how-to-use">`);
    } else {
      html = html.replace('<section class="related-tools">', `${componentHtml}\n    <section class="related-tools">`);
    }

    // Add script tag if not present
    const scriptTag = '<script src="/assets/js/tools/text-workflow-chain.js?v=20261124" defer></script>';
    if (!html.includes('text-workflow-chain.js')) {
      html = html.replace('</body>', `  ${scriptTag}\n</body>`);
    }

    fs.writeFileSync(filePath, html, 'utf8');
    modified++;
    console.log(`Updated [${locale}] ${tool}`);
  });
});

console.log(`\nSuccessfully updated ${modified} files.`);
