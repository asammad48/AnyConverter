#!/usr/bin/env node
'use strict';

/**
 * Script: scripts/inject_s25_workflow_chain_pdf.js
 * Injects the semantic #workflow-chain-pdf component and script tag into all 18 target PDF pages.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const TOOLS = [
  'pdf-merge',
  'pdf-split',
  'pdf-compress',
  'pdf-to-jpg',
  'jpg-to-pdf',
  'edit-pdf'
];

const LOCALES = ['en', 'es', 'da'];

const COPY = {
  en: {
    badge: 'Next Step',
    heading: 'Next Step: Continue Your PDF Workflow',
    sub: 'Your document is ready. Continue with the next step in your workflow:',
    dismissAria: 'Dismiss workflow suggestions',
    cards: {
      'pdf-compress': {
        icon: '/assets/img/icon-pdf-compress.svg',
        alt: 'Compress PDF icon',
        title: 'Compress PDF',
        desc: 'Reduce file size for easier sharing and email attachments',
        action: 'Compress PDF →'
      },
      'pdf-split': {
        icon: '/assets/img/icon-pdf-split.svg',
        alt: 'Split PDF icon',
        title: 'Split Pages',
        desc: 'Extract specific pages or break into separate documents',
        action: 'Split PDF →'
      },
      'pdf-to-jpg': {
        icon: '/assets/img/icon-pdf-to-jpg.svg',
        alt: 'Convert to JPG icon',
        title: 'Convert to JPG',
        desc: 'Extract pages as high-resolution JPG images',
        action: 'Convert to JPG →'
      },
      'pdf-merge': {
        icon: '/assets/img/icon-pdf-merge.svg',
        alt: 'Merge PDF icon',
        title: 'Merge PDF',
        desc: 'Combine multiple documents into one single file',
        action: 'Merge PDF →'
      }
    }
  },
  es: {
    badge: 'Siguiente paso',
    heading: 'Siguiente paso: Continúa tu flujo de trabajo con PDF',
    sub: 'Tu documento está listo. Continúa con el siguiente paso en tu flujo de trabajo:',
    dismissAria: 'Descartar sugerencias de flujo de trabajo',
    cards: {
      'pdf-compress': {
        icon: '/assets/img/icon-pdf-compress.svg',
        alt: 'Icono de Comprimir PDF',
        title: 'Comprimir PDF',
        desc: 'Reduce el tamaño del archivo para compartirlo o enviarlo por correo',
        action: 'Comprimir PDF →'
      },
      'pdf-split': {
        icon: '/assets/img/icon-pdf-split.svg',
        alt: 'Icono de Dividir PDF',
        title: 'Dividir páginas',
        desc: 'Extrae páginas específicas o divide en documentos individuales',
        action: 'Dividir páginas →'
      },
      'pdf-to-jpg': {
        icon: '/assets/img/icon-pdf-to-jpg.svg',
        alt: 'Icono de Convertir a JPG',
        title: 'Convertir a JPG',
        desc: 'Convierte cada página en imágenes JPG de alta resolución',
        action: 'Convertir a JPG →'
      },
      'pdf-merge': {
        icon: '/assets/img/icon-pdf-merge.svg',
        alt: 'Icono de Unir PDF',
        title: 'Unir PDF',
        desc: 'Combina múltiples documentos en un solo archivo',
        action: 'Unir PDF →'
      }
    }
  },
  da: {
    badge: 'Næste trin',
    heading: 'Næste trin: Fortsæt dit PDF-workflow',
    sub: 'Dit dokument er klar. Fortsæt direkte med det næste trin i dit workflow:',
    dismissAria: 'Afvis workflowforslag',
    cards: {
      'pdf-compress': {
        icon: '/assets/img/icon-pdf-compress.svg',
        alt: 'Komprimér PDF ikon',
        title: 'Komprimér PDF',
        desc: 'Reducer filstørrelsen for nemmere deling og e-mailvedhæftninger',
        action: 'Komprimér PDF →'
      },
      'pdf-split': {
        icon: '/assets/img/icon-pdf-split.svg',
        alt: 'Opdel sider ikon',
        title: 'Opdel sider',
        desc: 'Udtræk specifikke sider eller opdel i separate dokumenter',
        action: 'Opdel sider →'
      },
      'pdf-to-jpg': {
        icon: '/assets/img/icon-pdf-to-jpg.svg',
        alt: 'Konvertér til JPG ikon',
        title: 'Konvertér til JPG',
        desc: 'Konvertér hver side til JPG-billeder i høj opløsning',
        action: 'Konvertér til JPG →'
      },
      'pdf-merge': {
        icon: '/assets/img/icon-pdf-merge.svg',
        alt: 'Saml PDF ikon',
        title: 'Saml PDF',
        desc: 'Kombiner flere dokumenter til én enkelt fil',
        action: 'Saml PDF →'
      }
    }
  }
};

function getCardKeysForTool(slug) {
  if (slug === 'pdf-merge') return ['pdf-compress', 'pdf-split', 'pdf-to-jpg'];
  if (slug === 'pdf-split') return ['pdf-compress', 'pdf-merge', 'pdf-to-jpg'];
  if (slug === 'pdf-compress') return ['pdf-split', 'pdf-merge', 'pdf-to-jpg'];
  if (slug === 'pdf-to-jpg') return ['pdf-compress', 'pdf-split', 'pdf-merge'];
  if (slug === 'jpg-to-pdf') return ['pdf-compress', 'pdf-split', 'pdf-to-jpg'];
  if (slug === 'edit-pdf') return ['pdf-compress', 'pdf-split', 'pdf-to-jpg'];
  return ['pdf-compress', 'pdf-split', 'pdf-to-jpg'];
}

function buildHtmlComponent(toolSlug, locale) {
  const c = COPY[locale];
  const keys = getCardKeysForTool(toolSlug);
  const pfx = locale === 'en' ? '/' : `/${locale}/`;

  let cardsHtml = '';
  keys.forEach((targetKey, idx) => {
    const cardInfo = c.cards[targetKey];
    const targetUrl = `${pfx}${targetKey}/`;
    const stepId = `chain-step-${targetKey.replace(/^pdf-/, '')}`;
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

  return `    <!-- Contextual Workflow Chain: Next Step (Sprint S25) -->
    <section class="workflow-chain-section" id="workflow-chain-pdf" aria-labelledby="workflow-chain-heading" style="display:none;">
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

    // Remove existing #workflow-chain-pdf if already present
    html = html.replace(/<!-- Contextual Workflow Chain: Next Step \(Sprint S25\) -->[\s\S]*?<\/section>\s*/g, '');

    const componentHtml = buildHtmlComponent(tool, locale);

    // Place component directly beneath the main tool interface
    // In edit-pdf: after <div class="tool-wrapper"> ... </div>
    // In dc-root tools: after <div class="dc-root" id="dc-root" ...> ... </div>
    if (tool === 'edit-pdf') {
      const targetStr = '<section class="how-to-use">';
      if (html.includes(targetStr)) {
        html = html.replace(targetStr, `${componentHtml}\n    ${targetStr}`);
      } else {
        html = html.replace('<section class="related-tools">', `${componentHtml}\n    <section class="related-tools">`);
      }
    } else {
      const targetStr = '<section class="related-tools">';
      if (html.includes(targetStr)) {
        html = html.replace(targetStr, `${componentHtml}\n    ${targetStr}`);
      } else {
        html = html.replace('</main>', `${componentHtml}\n  </main>`);
      }
    }

    // Add script tag if not present
    const scriptTag = '<script src="/assets/js/tools/pdf-workflow-chain.js?v=20261124" defer></script>';
    if (!html.includes('pdf-workflow-chain.js')) {
      html = html.replace('</body>', `  ${scriptTag}\n</body>`);
    }

    fs.writeFileSync(filePath, html, 'utf8');
    modified++;
    console.log(`Updated [${locale}] ${tool}`);
  });
});

console.log(`\nSuccessfully updated ${modified} files.`);
