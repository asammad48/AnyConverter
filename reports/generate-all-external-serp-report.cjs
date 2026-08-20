const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const reportDir = path.join(root, 'reports');
const sitemapPath = path.join(root, 'sitemap.xml');
const priorCsvPath = path.join(reportDir, 'all-page-keyword-recommendations-2026-08-21.csv');
const outCsvPath = path.join(reportDir, 'all-canonical-pages-external-serp-keywords-2026-08-21.csv');
const outMdPath = path.join(reportDir, 'all-canonical-pages-external-serp-keywords-2026-08-21.md');

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function parseCsvLine(line) {
  const cells = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      cells.push(cell);
      cell = '';
    } else {
      cell += ch;
    }
  }
  cells.push(cell);
  return cells;
}

function readCsvByUrl(filePath) {
  if (!fs.existsSync(filePath)) return new Map();
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines.shift());
  const rows = new Map();
  for (const line of lines) {
    const values = parseCsvLine(line);
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
    if (row.url) rows.set(row.url, row);
  }
  return rows;
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractPageSignals(filePath) {
  if (!fs.existsSync(filePath)) return { title: '', h1: '', wordCount: 0 };
  const html = fs.readFileSync(filePath, 'utf8');
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() ?? '';
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() ?? '';
  const wordCount = stripTags(html).split(/\s+/).filter(Boolean).length;
  return { title, h1, wordCount };
}

function urlToFile(url) {
  const { pathname } = new URL(url);
  const clean = pathname.replace(/^\/|\/$/g, '');
  return clean ? path.join(root, clean, 'index.html') : path.join(root, 'index.html');
}

function languageFor(url) {
  const first = new URL(url).pathname.split('/').filter(Boolean)[0];
  return ['es', 'da'].includes(first) ? first : 'en';
}

function slugFor(url) {
  const parts = new URL(url).pathname.split('/').filter(Boolean);
  if (parts.length === 0) return 'home';
  if (['es', 'da'].includes(parts[0])) return parts[1] ?? 'home';
  return parts[0];
}

const groups = {
  pdf: {
    slugs: [
      'add-page-numbers', 'add-watermark', 'compare-pdf', 'crop-pdf', 'edit-pdf', 'extract-pdf-pages',
      'html-to-pdf', 'jpg-to-pdf', 'ocr-pdf', 'optimize-pdf', 'organize-pdf', 'pdf-compress',
      'pdf-forms', 'pdf-merge', 'pdf-security', 'pdf-split', 'pdf-to-jpg', 'protect-pdf',
      'redact-pdf', 'remove-pdf-pages', 'rotate-pdf', 'scan-to-pdf', 'sign-pdf', 'unlock-pdf',
    ],
    pattern: 'Top PDF SERPs lead with the exact task, privacy/free/browser language, clear upload controls, adjacent PDF actions, and short step-by-step copy.',
    competitors: 'Adobe Acrobat, iLovePDF, Smallpdf, PDF24, Sejda, PDF2Go, PDFChef, FreeConvert, PDFgear',
    sources: [
      'https://www.adobe.com/acrobat/online.html',
      'https://www.ilovepdf.com/',
      'https://smallpdf.com/pdf-tools',
      'https://tools.pdf24.org/en/',
      'https://www.sejda.com/',
      'https://www.pdf2go.com/',
      'https://www.freeconvert.com/pdf-tools',
    ],
  },
  dev: {
    slugs: [
      'base64-encoder', 'color-converter', 'cron-expression-parser', 'css-gradient-generator',
      'css-shadow-generator', 'csv-query', 'csv-to-sql', 'hash-generator', 'html-beautifier',
      'json-formatter', 'json-to-yaml', 'jwt-decoder', 'markdown-html', 'morse-code-converter',
      'px-to-rem', 'regex-tester', 'timestamp-converter', 'url-encoder', 'uuid-generator', 'xml-formatter',
    ],
    pattern: 'Developer-tool SERPs favor exact utility names, example input/output, validation/error states, copy/download buttons, and "formatter/validator/converter/parser" modifiers.',
    competitors: 'JSONFormatter.org, CodeBeautify, JSONLint, regex101, RegExr, Base64Decode.org, emn178, KeyCDN, MD5file',
    sources: [
      'https://jsonformatter.org/',
      'https://codebeautify.org/',
      'https://jsonlint.com/',
      'https://regex101.com/',
      'https://regexr.com/',
      'https://www.base64decode.org/',
      'https://emn178.github.io/online-tools/',
      'https://tools.keycdn.com/',
    ],
  },
  text: {
    slugs: [
      'ascii-art-generator', 'character-counter', 'fancy-text-generator', 'lorem-ipsum-generator',
      'number-to-words', 'roman-numeral-converter', 'text-case-converter', 'text-diff-checker',
      'text-repeater', 'word-counter',
    ],
    pattern: 'Text-tool SERPs rank pages that show the input box immediately, explain accepted formats, include examples, and use "counter/converter/generator/checker" intent words.',
    competitors: 'WordCounter.net, CharacterCountTool, Grammarly, WordCounter.io, ConvertCase, TitleCaseConverter, Diffchecker, Text-Compare',
    sources: [
      'https://wordcounter.net/',
      'https://charactercounttool.com/',
      'https://www.grammarly.com/character-counter',
      'https://convertcase.net/',
      'https://titlecaseconverter.com/',
      'https://www.diffchecker.com/text-compare/',
      'https://www.text-compare.com/',
    ],
  },
  image: {
    slugs: ['image-compressor', 'image-converter', 'qr-code-generator'],
    pattern: 'Image/QR SERPs favor exact task pages with compression/conversion settings, supported formats, file-size expectations, and device-friendly download/share actions.',
    competitors: 'TinyPNG, ImageCompressor.com, iLoveIMG, FreeConvert, Img2Go, toWebP.io, CloudConvert, Picflow, QR Code Generator',
    sources: [
      'https://tinypng.com/',
      'https://imagecompressor.com/',
      'https://www.iloveimg.com/',
      'https://www.freeconvert.com/image-converter',
      'https://www.img2go.com/',
      'https://towebp.io/',
      'https://cloudconvert.com/',
      'https://www.qr-code-generator.com/',
    ],
  },
  calculator: {
    slugs: [
      'age-calculator', 'aspect-ratio-calculator', 'blood-type-compatibility', 'bmi-calculator',
      'calorie-calculator', 'compound-interest-calculator', 'currency-converter', 'discount-calculator',
      'gst-vat-calculator', 'loan-calculator', 'mortgage-calculator',
      'percentage-calculator', 'sleep-calculator', 'tip-calculator',
    ],
    pattern: 'Calculator SERPs reward pages with visible formulas, worked examples, definitions, country/unit variations, and trustworthy explanations around the calculator.',
    competitors: 'Calculator.net, Omni Calculator, Mayo Clinic, CDC/NHLBI, Bankrate, Investor.gov, Wise, Zoho, Moneysmart, Nordea',
    sources: [
      'https://www.calculator.net/',
      'https://www.omnicalculator.com/',
      'https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/calorie-calculator/itt-20402304',
      'https://www.cdc.gov/bmi/adult-calculator/index.html',
      'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator',
      'https://www.bankrate.com/calculators.aspx',
      'https://wise.com/us/currency-converter/',
      'https://www.zoho.com/books/gst-calculator/',
      'https://moneysmart.gov.au/budgeting/compound-interest-calculator',
    ],
  },
  business: {
    slugs: ['invoice-generator', 'privacy-policy-generator'],
    pattern: 'Business-generator SERPs emphasize fast form completion, template quality, compliance/trust notes, export formats, and practical examples for common business types.',
    competitors: 'Zoho, Canva, Invoice Simple, Shopify, Termly, PrivacyPolicies.com, iubenda',
    sources: [
      'https://www.zoho.com/us/invoice/free-invoice-generator.html',
      'https://www.canva.com/invoice/',
      'https://www.shopify.com/tools/policy-generator',
      'https://termly.io/products/privacy-policy-generator/',
      'https://www.privacypolicies.com/privacy-policy-generator/',
      'https://www.iubenda.com/en/blog/shopify-privacy-policy-generator-why-you-should-use-one/',
    ],
  },
  random: {
    slugs: ['coin-flip', 'decision-maker', 'dice-roller', 'random-number-generator', 'random-picker', 'spin-the-wheel', 'team-picker'],
    pattern: 'Randomizer SERPs favor playful but instant tools with probability/fairness notes, shareable results, list import/export, and task-specific variants.',
    competitors: 'Random.org, Calculator.net, Picker Wheel, Wheel of Names, Roll a Die, FlipSimu, AppSorteos, DnD Dice Roller',
    sources: [
      'https://www.random.org/',
      'https://www.calculator.net/random-number-generator.html',
      'https://pickerwheel.com/',
      'https://wheelofnames.com/',
      'https://rolladie.net/',
      'https://flipsimu.com/',
      'https://app-sorteos.com/en',
    ],
  },
  productivity: {
    slugs: ['countdown-timer', 'daily-planner', 'habit-tracker', 'meeting-timer', 'pomodoro-timer', 'sticky-notes', 'stopwatch', 'todo-list', 'world-clock'],
    pattern: 'Productivity SERPs emphasize immediate use, saved state, focus/timer workflows, templates, reminders, and low-friction task capture.',
    competitors: 'Pomofocus, PomodoroTimer.online, TomatoTimers, vClock, Online Stopwatch, Habi, HabitBox, Structured, Canva, Any.do, Microsoft To Do, Todoist',
    sources: [
      'https://pomofocus.io/',
      'https://www.pomodorotimer.online/',
      'https://www.tomatotimers.com/',
      'https://vclock.com/timer/',
      'https://vclock.com/stopwatch/',
      'https://www.online-stopwatch.com/',
      'https://habi.app/',
      'https://habitbox.app/',
      'https://structured.app/daily-planner',
      'https://www.canva.com/planners/templates/daily/',
      'https://todoist.com/',
      'https://to-do.office.com/tasks/',
    ],
  },
  device: {
    slugs: [
      'browser-info', 'dead-pixel-checker', 'internet-speed-test', 'ip-address-lookup', 'keyboard-tester',
      'microphone-tester', 'monitor-color-test', 'mouse-tester', 'password-generator',
      'password-strength-checker', 'screen-resolution', 'typing-speed-test', 'viewport-size', 'webcam-tester',
    ],
    pattern: 'Device/test SERPs rank tools that run checks instantly, explain permissions/privacy, show clear pass/fail states, and include troubleshooting guidance.',
    competitors: 'OnlineMicTest, WebcamMicTest, Loom, EIZO, DeadPixelTest.org, WhatIsMyViewport, mdigi, Typing.com, TypingTest.com, LiveChat',
    sources: [
      'https://www.onlinemictest.com/',
      'https://webcammictest.com/',
      'https://www.loom.com/webcam-test',
      'https://www.eizo.be/monitor-test/',
      'https://deadpixeltest.org/',
      'https://whatismyviewport.com/',
      'https://typing.com/student/typing-test',
      'https://www.typingtest.com/',
      'https://www.livechat.com/typing-speed-test/',
    ],
  },
  support: {
    slugs: ['about', 'blog', 'contact', 'cookies', 'faq', 'press', 'privacy', 'security', 'terms', 'home'],
    pattern: 'Trust/support pages should reinforce crawl clarity, brand trust, privacy, and internal links to high-value tools rather than target competitive tool keywords.',
    competitors: 'Google Search Central guidance, high-performing tool directories, SaaS trust/legal pages',
    sources: [
      'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
      'https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview',
      'https://developers.google.com/search/docs/appearance/title-link',
      'https://developers.google.com/search/docs/appearance/snippet',
    ],
  },
};

const groupBySlug = new Map();
for (const [name, group] of Object.entries(groups)) {
  for (const slug of group.slugs) groupBySlug.set(slug, name);
}

const localizedOverrides = {
  en: {
    home: ['free online tools', 'PDF tools; calculators; converters; browser tools'],
    'pdf-merge': ['merge PDF online', 'combine PDF files; free PDF merger; merge PDFs in browser'],
    'pdf-split': ['split PDF online', 'extract PDF pages; separate PDF pages; split PDF file'],
    'pdf-compress': ['compress PDF online', 'reduce PDF size; PDF compressor; compress PDF free'],
    'pdf-forms': ['fill PDF forms online', 'PDF form filler; create fillable PDF; free PDF forms'],
    'pdf-to-jpg': ['PDF to JPG converter', 'convert PDF pages to images; PDF to image; PDF to PNG'],
    'remove-pdf-pages': ['remove pages from PDF', 'delete PDF pages; remove PDF page online; PDF page remover'],
    'rotate-pdf': ['rotate PDF online', 'rotate PDF pages; change PDF orientation; PDF rotator'],
    'edit-pdf': ['edit PDF online', 'free PDF editor; annotate PDF; add text to PDF'],
    'discount-calculator': ['discount calculator', 'sale price calculator; percent off calculator; price after discount'],
    'tip-calculator': ['tip calculator', 'gratuity calculator; split bill calculator; restaurant tip calculator'],
    'internet-speed-test': ['internet speed test', 'WiFi speed test; broadband speed test; test download speed'],
    'json-formatter': ['JSON formatter', 'JSON beautifier; JSON validator; format JSON online'],
    'regex-tester': ['regex tester', 'regular expression tester; regex validator; test regex online'],
    'word-counter': ['word counter', 'character counter; count words online; word count checker'],
    'text-diff-checker': ['text diff checker', 'compare text online; text comparison; diff checker'],
    'password-generator': ['password generator', 'random password generator; strong password generator; secure password'],
    'qr-code-generator': ['QR code generator', 'free QR code generator; create QR code; QR code maker'],
    'roman-numeral-converter': ['roman numeral converter', 'convert roman numerals; roman numbers converter; roman numeral calculator'],
    'invoice-generator': ['invoice generator', 'free invoice maker; invoice template; create invoice online'],
    'privacy-policy-generator': ['privacy policy generator', 'free privacy policy template; GDPR privacy policy generator; website privacy policy'],
    press: ['AnyConverter press kit', 'AnyConverter media resources; AnyConverter brand assets; AnyConverter news'],
    security: ['AnyConverter security', 'privacy-first online tools; browser-based file processing; secure PDF tools'],
    about: ['AnyConverter', 'free online tools; PDF converters; calculators and utilities'],
    faq: ['AnyConverter FAQ', 'online tools questions; PDF tools help; browser tool support'],
  },
  es: {
    home: ['herramientas online gratis', 'herramientas PDF; calculadoras; convertidores; utilidades online'],
    'pdf-merge': ['unir PDF online', 'combinar PDF; juntar PDF; unir archivos PDF'],
    'pdf-split': ['dividir PDF online', 'separar PDF; extraer paginas PDF; cortar PDF'],
    'pdf-compress': ['comprimir PDF online', 'reducir tamano PDF; compresor PDF; comprimir PDF gratis'],
    'remove-pdf-pages': ['eliminar paginas de PDF', 'borrar paginas PDF; quitar paginas PDF; eliminar hojas PDF'],
    'tip-calculator': ['calculadora de propinas', 'calcular propina; calculadora propina restaurante; dividir cuenta'],
    'sticky-notes': ['notas adhesivas online', 'post it online; notas virtuales; notas rapidas online'],
    'discount-calculator': ['calculadora de descuentos', 'calcular descuento; porcentaje de descuento; precio con descuento'],
    'json-formatter': ['formateador JSON', 'embellecer JSON; validar JSON; formato JSON online'],
    'word-counter': ['contador de palabras', 'contador de caracteres; contar palabras online; contar texto'],
    'invoice-generator': ['generador de facturas', 'crear factura online; plantilla de factura; factura PDF'],
    'privacy-policy-generator': ['generador de politica de privacidad', 'plantilla politica privacidad; RGPD; politica de privacidad web'],
    press: ['kit de prensa de AnyConverter', 'recursos de prensa; activos de marca; noticias de AnyConverter'],
    security: ['seguridad de AnyConverter', 'herramientas privadas; procesamiento en el navegador; herramientas PDF seguras'],
  },
  da: {
    home: ['gratis online vaerktojer', 'PDF vaerktojer; beregnere; konvertere; browser vaerktojer'],
    'mortgage-calculator': ['boliglan beregner', 'realkredit beregner; laneberegner bolig; beregn boliglan'],
    'todo-list': ['to do liste online', 'opgaveliste online; gratis to do liste; online opgavestyring'],
    'countdown-timer': ['nedtaelling online', 'timer online; stopur online; nedtaellingsur'],
    'age-calculator': ['alder beregner', 'beregn alder; hvor gammel er jeg; fodselsdato beregner'],
    'coin-flip': ['plat eller krone online', 'kast en mont; coin flip; tilfaeldig montkast'],
    'pdf-merge': ['flet PDF online', 'kombiner PDF; samle PDF filer; PDF merger'],
    'json-formatter': ['JSON formatter', 'JSON validering; format JSON online; JSON beautifier'],
    'invoice-generator': ['faktura generator', 'lav faktura online; faktura skabelon; faktura PDF'],
    'privacy-policy-generator': ['privatlivspolitik generator', 'privatlivspolitik skabelon; GDPR privatlivspolitik; hjemmeside privatlivspolitik'],
    press: ['AnyConverter pressekit', 'AnyConverter medieressourcer; brand aktiver; AnyConverter nyheder'],
    security: ['AnyConverter sikkerhed', 'private online vaerktojer; browserbaseret behandling; sikre PDF vaerktojer'],
  },
};

const genericNouns = {
  en: {
    pdf: ['online', 'free', 'browser-based'],
    dev: ['online', 'validator', 'formatter'],
    text: ['online', 'free', 'generator'],
    image: ['online', 'free', 'converter'],
    calculator: ['online', 'formula', 'example'],
    random: ['online', 'random picker', 'fair results'],
    productivity: ['online', 'free', 'planner'],
    business: ['online', 'template', 'PDF'],
    device: ['online', 'test', 'checker'],
    support: ['AnyConverter', 'free tools', 'privacy-first tools'],
  },
  es: {
    pdf: ['online', 'gratis', 'en el navegador'],
    dev: ['online', 'validador', 'formateador'],
    text: ['online', 'gratis', 'generador'],
    image: ['online', 'gratis', 'convertidor'],
    calculator: ['online', 'formula', 'ejemplo'],
    random: ['online', 'aleatorio', 'resultado justo'],
    productivity: ['online', 'gratis', 'planificador'],
    business: ['online', 'plantilla', 'PDF'],
    device: ['online', 'prueba', 'verificador'],
    support: ['AnyConverter', 'herramientas gratis', 'privacidad'],
  },
  da: {
    pdf: ['online', 'gratis', 'i browseren'],
    dev: ['online', 'validator', 'formatter'],
    text: ['online', 'gratis', 'generator'],
    image: ['online', 'gratis', 'konverter'],
    calculator: ['online', 'formel', 'eksempel'],
    random: ['online', 'tilfaeldig', 'retfaerdigt resultat'],
    productivity: ['online', 'gratis', 'planlaegger'],
    business: ['online', 'skabelon', 'PDF'],
    device: ['online', 'test', 'tjekker'],
    support: ['AnyConverter', 'gratis vaerktojer', 'privatliv'],
  },
};

function titleCaseFromSlug(slug) {
  if (slug === 'home') return 'Free Online Tools';
  return slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function fallbackKeyword(slug, lang, signals) {
  const h1 = signals.h1
    .replace(/\s*\|\s*AnyConverter\s*$/i, '')
    .replace(/\s+[\u2014-]\s*.*$/u, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (h1) return h1;
  const title = signals.title
    .replace(/\s*\|\s*AnyConverter\s*$/i, '')
    .replace(/\bOnline Free\b/i, 'Online')
    .replace(/\s+[\u2014-]\s*.*$/u, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (title) return title;
  return titleCaseFromSlug(slug);
}

function usefulGscKeyword(keyword, slug) {
  if (!keyword) return false;
  const normalized = keyword.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, ' ').replace(/\s+/g, ' ').trim();
  const generic = new Set(['converter online', 'online converter', 'free online', 'online tool', 'generator online']);
  if (generic.has(normalized)) return false;
  const slugWords = slug.split('-').filter((word) => word.length > 2);
  if (!slugWords.length) return normalized.includes('anyconverter');
  return slugWords.some((word) => normalized.includes(word));
}

function cleanKeyword(keyword) {
  return String(keyword ?? '')
    .replace(/\s*\|\s*AnyConverter\s*$/i, '')
    .replace(/\bOnline Free\b/i, 'Online')
    .replace(/\s+[\u2014-]\s*.*$/u, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function variants(primary, modifiers) {
  const terms = [];
  for (const modifier of modifiers) {
    const lowerPrimary = primary.toLowerCase();
    const lowerModifier = modifier.toLowerCase();
    terms.push(lowerPrimary.includes(lowerModifier) ? primary : `${primary} ${modifier}`);
  }
  return [...new Set(terms)].slice(0, 3).join('; ');
}

function recommendationFor(groupName, lang, primary, slug, prior) {
  const first = genericNouns[lang]?.[groupName] ?? genericNouns.en[groupName] ?? ['online', 'free'];
  const translated = lang === 'es'
    ? 'Create a localized SEO block with intent-specific examples, common use cases, limitations, and links to closely related tools. Keep the tool UI unchanged, but align title/H1/meta copy with the primary keyword.'
    : lang === 'da'
      ? 'Create a localized SEO block with examples, common use cases, limitations, and links to related tools. Keep the tool UI unchanged, but align title/H1/meta copy with the primary keyword.'
      : 'Create a concise SEO block with examples, use cases, limitations, FAQs, and related-tool links. Keep the tool UI unchanged, but align title/H1/meta copy with the primary keyword.';
  const gscNote = Number(prior?.gsc_impressions || 0) > 0
    ? ` GSC already shows impressions, so prioritize CTR testing and request indexing after deployment.`
    : ` This page needs stronger relevance signals because GSC has little or no query data yet.`;
  const thinNote = Number(prior?.word_count || 0) > 0 && Number(prior.word_count) < 650
    ? ` Current visible content is thin for a competitive ${groupName} query.`
    : '';
  const sampleVariants = variants(primary, first).split('; ').slice(0, 2);
  return `${translated}${thinNote}${gscNote} Add variants such as "${sampleVariants[0]}" and "${sampleVariants[1] ?? primary}" only where natural.`;
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemap.matchAll(/<loc>(https:\/\/anyconverter\.io\/[^<]*)<\/loc>/g)].map((match) => match[1]);
const priorRows = readCsvByUrl(priorCsvPath);

const rows = urls.map((url) => {
  const lang = languageFor(url);
  const slug = slugFor(url);
  const groupName = groupBySlug.get(slug) ?? 'support';
  const group = groups[groupName];
  const filePath = urlToFile(url);
  const relFile = path.relative(root, filePath).replace(/\//g, '\\');
  const signals = extractPageSignals(filePath);
  const prior = priorRows.get(url);
  const override = localizedOverrides[lang]?.[slug] ?? localizedOverrides.en[slug];
  const fallback = fallbackKeyword(slug, lang, signals);
  const primary = cleanKeyword(override?.[0] ?? (usefulGscKeyword(prior?.primary_keyword, slug) ? prior.primary_keyword : fallback));
  const modifiers = genericNouns[lang]?.[groupName] ?? genericNouns.en[groupName] ?? ['online', 'free', 'tool'];
  const secondary = override?.[1] ?? variants(primary, modifiers);
  const priority = prior?.priority ?? (Number(prior?.gsc_impressions || 0) > 0 ? 'P2' : 'P3');
  return {
    priority,
    url,
    file: relFile,
    language: lang,
    page_family: groupName,
    gsc_clicks: prior?.gsc_clicks ?? '0',
    gsc_impressions: prior?.gsc_impressions ?? '0',
    gsc_position: prior?.gsc_position ?? '',
    current_title: signals.title,
    current_h1: signals.h1,
    word_count: signals.wordCount,
    primary_keyword: primary,
    secondary_keywords: secondary,
    serp_pattern_found: group.pattern,
    example_competitors: group.competitors,
    online_sources_used: group.sources.join(' | '),
    recommended_change: recommendationFor(groupName, lang, primary, slug, prior),
  };
});

rows.sort((a, b) => {
  const priority = a.priority.localeCompare(b.priority);
  if (priority !== 0) return priority;
  return Number(b.gsc_impressions || 0) - Number(a.gsc_impressions || 0) || a.url.localeCompare(b.url);
});

const headers = [
  'priority', 'url', 'file', 'language', 'page_family', 'gsc_clicks', 'gsc_impressions', 'gsc_position',
  'current_title', 'current_h1', 'word_count', 'primary_keyword', 'secondary_keywords',
  'serp_pattern_found', 'example_competitors', 'online_sources_used', 'recommended_change',
];
const csv = [
  headers.join(','),
  ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
].join('\n') + '\n';
fs.writeFileSync(outCsvPath, csv);

const byGroup = rows.reduce((acc, row) => {
  acc[row.page_family] = (acc[row.page_family] ?? 0) + 1;
  return acc;
}, {});
const byLang = rows.reduce((acc, row) => {
  acc[row.language] = (acc[row.language] ?? 0) + 1;
  return acc;
}, {});
const p1 = rows.filter((row) => row.priority === 'P1').slice(0, 25);

const md = `# All Canonical Pages External SERP Keyword Recommendations

Generated: 2026-08-21

## Scope

- Covered ${rows.length} canonical sitemap URLs from \`sitemap.xml\`.
- Languages: ${Object.entries(byLang).map(([key, count]) => `${key} ${count}`).join(', ')}.
- This extends the earlier GSC-only 347-row page report with external SERP/competitor patterns for every canonical page.
- The Google coverage export reports 354 total page states, but it does not include a URL-level export for those additional aggregate rows. The exact page-level coverage here is the canonical sitemap.

## Important Caveat

This is not a paid keyword-volume database export. It combines your Google Search Console query/page data with live manual SERP competitor pattern research. The result is a practical page-by-page keyword map and implementation brief, not exact monthly search volume.

## Counts By Page Family

${Object.entries(byGroup).sort((a, b) => b[1] - a[1]).map(([key, count]) => `- ${key}: ${count}`).join('\n')}

## Highest Priority URLs

${p1.map((row) => `- ${row.url} -> ${row.primary_keyword} (${row.gsc_impressions} impressions, avg position ${row.gsc_position || 'n/a'})`).join('\n')}

## How To Use The CSV

Open \`${path.relative(root, outCsvPath).replace(/\\/g, '/')}\`. For each page, use:

- \`primary_keyword\` as the title/H1/meta/content anchor.
- \`secondary_keywords\` as natural supporting phrases, not forced repetitions.
- \`serp_pattern_found\` and \`example_competitors\` to decide what content block or UX proof is missing.
- \`recommended_change\` as the implementation note.

## Online Sources Used By Cluster

${Object.entries(groups).map(([name, group]) => `### ${name}
Pattern: ${group.pattern}

Competitors/sources: ${group.sources.join(', ')}
`).join('\n')}
`;
fs.writeFileSync(outMdPath, md);

console.log(`Wrote ${rows.length} rows`);
console.log(outCsvPath);
console.log(outMdPath);
