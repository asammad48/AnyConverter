const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const inputCsv = path.join(__dirname, 'all-canonical-pages-external-serp-keywords-2026-08-21.csv');
const sitemapPath = path.join(root, 'sitemap.xml');
const marker = 'SEO keyword implementation: 2026-08-21';

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

function readCsv(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines.shift());
  return lines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function decodeHtml(value) {
  return String(value ?? '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function cleanText(value) {
  return decodeHtml(value)
    .replace(/\s*\|\s*AnyConverter\s*$/i, '')
    .replace(/\bOnline Free\b/i, 'Online')
    .replace(/\s+[\u2014-]\s*.*$/u, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function capitalize(value) {
  const text = cleanText(value);
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

function secondaryTerms(row) {
  return row.secondary_keywords
    .split(';')
    .map((term) => cleanText(term))
    .filter(Boolean)
    .filter((term, index, arr) => arr.findIndex((item) => item.toLowerCase() === term.toLowerCase()) === index)
    .slice(0, 3);
}

function pathnameFor(url) {
  return new URL(url).pathname;
}

function slugFor(url) {
  const parts = pathnameFor(url).split('/').filter(Boolean);
  if (!parts.length) return 'home';
  return ['es', 'da'].includes(parts[0]) ? parts[1] ?? 'home' : parts[0];
}

function localePrefix(lang) {
  return lang === 'en' ? '' : `/${lang}`;
}

function localUrlFor(slug, lang, urlSet) {
  if (slug === 'home') {
    const localizedHome = `https://anyconverter.io${localePrefix(lang)}/`;
    return urlSet.has(localizedHome) ? localizedHome : 'https://anyconverter.io/';
  }
  const localized = `https://anyconverter.io${localePrefix(lang)}/${slug}/`;
  if (urlSet.has(localized)) return localized;
  const english = `https://anyconverter.io/${slug}/`;
  return urlSet.has(english) ? english : '';
}

function fileForUrl(url) {
  const clean = pathnameFor(url).replace(/^\/|\/$/g, '');
  return path.join(root, clean || '', 'index.html');
}

function labelForUrl(url) {
  const filePath = fileForUrl(url);
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
    const label = cleanText((h1 ?? title ?? '').replace(/<[^>]+>/g, ''));
    if (label) return label;
  }
  const slug = slugFor(url);
  return slug === 'home'
    ? 'AnyConverter'
    : slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

const familyLinks = {
  pdf: ['pdf-merge', 'pdf-split', 'pdf-compress', 'edit-pdf', 'pdf-to-jpg', 'remove-pdf-pages'],
  dev: ['json-formatter', 'regex-tester', 'base64-encoder', 'hash-generator', 'timestamp-converter', 'url-encoder'],
  text: ['word-counter', 'character-counter', 'text-case-converter', 'text-diff-checker', 'roman-numeral-converter'],
  image: ['image-compressor', 'image-converter', 'qr-code-generator', 'pdf-to-jpg'],
  calculator: ['percentage-calculator', 'discount-calculator', 'tip-calculator', 'bmi-calculator', 'loan-calculator', 'age-calculator'],
  random: ['random-number-generator', 'random-picker', 'dice-roller', 'coin-flip', 'spin-the-wheel'],
  productivity: ['pomodoro-timer', 'todo-list', 'daily-planner', 'habit-tracker', 'countdown-timer', 'stopwatch'],
  device: ['internet-speed-test', 'webcam-tester', 'microphone-tester', 'keyboard-tester', 'screen-resolution', 'dead-pixel-checker'],
  business: ['invoice-generator', 'privacy-policy-generator', 'pdf-forms', 'sign-pdf'],
  support: ['about', 'faq', 'privacy', 'security', 'contact'],
};

const familyCopy = {
  en: {
    pdf: {
      best: 'Combining, editing, converting, or protecting documents without installing desktop PDF software.',
      details: 'Check file order, page range, output quality, and browser privacy before downloading the finished PDF.',
      next: 'Move to another PDF action when you need compression, splitting, images, signatures, forms, or page cleanup.',
    },
    dev: {
      best: 'Pasting code, structured data, tokens, hashes, or encoded text and getting a readable result quickly.',
      details: 'Use the examples, validation messages, copy actions, and formatting options to catch mistakes before you ship.',
      next: 'Open a related formatter, validator, encoder, parser, or converter when your workflow moves to another format.',
    },
    text: {
      best: 'Cleaning, comparing, counting, converting, or generating text for writing, documentation, and publishing.',
      details: 'Use plain input, clear output, and practical examples so the result is easy to copy into your next draft.',
      next: 'Pair it with another text utility when you need counts, case changes, comparisons, placeholder text, or format conversion.',
    },
    image: {
      best: 'Preparing images or QR codes for websites, documents, downloads, and quick sharing.',
      details: 'Review format, quality, size, and download options so the final file matches the place where you will use it.',
      next: 'Use a related image or PDF tool when you need compression, conversion, QR creation, or document export.',
    },
    calculator: {
      best: 'Getting a quick answer while still seeing the formula, assumptions, and examples behind the number.',
      details: 'Enter realistic values, compare scenarios, and use the explanation to understand what changed the final result.',
      next: 'Try a related calculator when the same decision needs percentages, prices, loans, tax, tips, age, or health estimates.',
    },
    random: {
      best: 'Making fair picks, simple draws, team choices, dice rolls, coin flips, and quick random decisions.',
      details: 'Use clear inputs and visible results so the outcome is easy to explain, repeat, or share with a group.',
      next: 'Open another randomizer when you need numbers, names, teams, wheels, dice, or a quick yes-or-no choice.',
    },
    productivity: {
      best: 'Running a focused task, timer, plan, note, checklist, or habit flow directly in the browser.',
      details: 'Keep the page open while you work, use the saved or live state where available, and reset when the session changes.',
      next: 'Move to another planning or timing tool when you need a timer, list, notes, daily plan, or habit tracker.',
    },
    device: {
      best: 'Checking your browser, device, network, screen, microphone, camera, keyboard, or password strength quickly.',
      details: 'Review permission prompts carefully, then use the result and troubleshooting notes to narrow down the issue.',
      next: 'Use another diagnostic when the problem involves connection speed, display size, input devices, pixels, or browser data.',
    },
    business: {
      best: 'Creating practical business documents and policy drafts without starting from a blank page.',
      details: 'Review every field, customize the language for your business, and export or copy the result when it is ready.',
      next: 'Use related PDF and signing tools when the document needs forms, signatures, protection, or page cleanup.',
    },
    support: {
      best: 'Understanding AnyConverter, its privacy approach, policies, security posture, and available tool categories.',
      details: 'Use these pages to verify how the site works, where data is processed, and how to contact the team.',
      next: 'Return to the tool directory when you are ready to use PDF tools, calculators, converters, or browser utilities.',
    },
  },
  es: {
    pdf: {
      best: 'Editar, unir, dividir, convertir o proteger documentos PDF sin instalar software de escritorio.',
      details: 'Revisa el orden de archivos, rangos de paginas, calidad de salida y privacidad antes de descargar el PDF final.',
      next: 'Abre otra accion PDF cuando necesites comprimir, dividir, convertir imagenes, firmar, crear formularios o limpiar paginas.',
    },
    dev: {
      best: 'Pegar codigo, datos estructurados, tokens, hashes o texto codificado y obtener un resultado claro al instante.',
      details: 'Usa ejemplos, mensajes de validacion, acciones de copia y opciones de formato para detectar errores antes de publicar.',
      next: 'Continua con otro formateador, validador, codificador, parser o convertidor cuando cambie el formato de trabajo.',
    },
    text: {
      best: 'Limpiar, comparar, contar, convertir o generar texto para escritura, documentacion y publicacion.',
      details: 'Trabaja con entrada simple, salida clara y ejemplos practicos para copiar el resultado en tu siguiente borrador.',
      next: 'Combinalo con otra utilidad de texto cuando necesites conteos, cambios de mayusculas, comparaciones o texto de prueba.',
    },
    image: {
      best: 'Preparar imagenes o codigos QR para sitios web, documentos, descargas y uso compartido.',
      details: 'Revisa formato, calidad, tamano y opciones de descarga para que el archivo final encaje con su destino.',
      next: 'Usa una herramienta relacionada si necesitas comprimir, convertir, crear QR o exportar a documento.',
    },
    calculator: {
      best: 'Obtener una respuesta rapida y entender la formula, supuestos y ejemplos detras del resultado.',
      details: 'Introduce valores realistas, compara escenarios y usa la explicacion para saber que cambia el numero final.',
      next: 'Prueba otra calculadora si la misma decision requiere porcentajes, precios, prestamos, impuestos, propinas o edad.',
    },
    random: {
      best: 'Hacer sorteos justos, elecciones simples, equipos, dados, moneda al aire y decisiones rapidas.',
      details: 'Usa entradas claras y resultados visibles para que la decision sea facil de explicar, repetir o compartir.',
      next: 'Abre otro generador aleatorio si necesitas numeros, nombres, equipos, ruletas, dados o una decision si/no.',
    },
    productivity: {
      best: 'Organizar una tarea, temporizador, plan, nota, lista o habito directamente en el navegador.',
      details: 'Mantén la pagina abierta mientras trabajas, usa el estado guardado o en vivo cuando exista, y reinicia al cambiar de sesion.',
      next: 'Pasa a otra herramienta de planificacion o tiempo si necesitas temporizador, lista, notas, plan diario o habitos.',
    },
    device: {
      best: 'Comprobar navegador, dispositivo, red, pantalla, microfono, camara, teclado o fortaleza de contrasenas rapidamente.',
      details: 'Revisa los permisos del navegador con cuidado y usa el resultado para acotar el problema.',
      next: 'Usa otro diagnostico si el problema afecta velocidad, pantalla, dispositivos de entrada, pixeles o datos del navegador.',
    },
    business: {
      best: 'Crear documentos de negocio y borradores de politicas sin empezar desde cero.',
      details: 'Revisa cada campo, adapta el texto a tu empresa y exporta o copia el resultado cuando este listo.',
      next: 'Usa herramientas PDF relacionadas si el documento necesita formularios, firmas, proteccion o limpieza de paginas.',
    },
    support: {
      best: 'Entender AnyConverter, su enfoque de privacidad, politicas, seguridad y categorias de herramientas.',
      details: 'Usa estas paginas para confirmar como funciona el sitio, donde se procesan los datos y como contactar al equipo.',
      next: 'Vuelve al directorio de herramientas cuando quieras usar PDF, calculadoras, convertidores o utilidades del navegador.',
    },
  },
  da: {
    pdf: {
      best: 'Redigere, flette, opdele, konvertere eller beskytte PDF-dokumenter uden desktopsoftware.',
      details: 'Tjek filraekkefolge, sideintervaller, outputkvalitet og privatliv, for du downloader den faerdige PDF.',
      next: 'Ga videre til et andet PDF-vaerktoj, nar du skal komprimere, opdele, konvertere billeder, underskrive eller rydde sider op.',
    },
    dev: {
      best: 'Indsaette kode, strukturerede data, tokens, hashes eller kodet tekst og fa et laesbart resultat hurtigt.',
      details: 'Brug eksempler, valideringsbeskeder, kopieringshandlinger og formatering til at fange fejl tidligt.',
      next: 'Aben en relateret formatter, validator, encoder, parser eller konverter, nar arbejdsgangen skifter format.',
    },
    text: {
      best: 'Rense, sammenligne, taelle, konvertere eller generere tekst til skrivning, dokumentation og publicering.',
      details: 'Brug enkel input, klar output og praktiske eksempler, sa resultatet er let at kopiere videre.',
      next: 'Kombiner med et andet tekstvaerktoj, nar du skal bruge taellinger, store/sma bogstaver, sammenligning eller eksempeltekst.',
    },
    image: {
      best: 'Forberede billeder eller QR-koder til websites, dokumenter, downloads og hurtig deling.',
      details: 'Tjek format, kvalitet, storrelse og downloadmuligheder, sa filen passer til det sted, hvor den skal bruges.',
      next: 'Brug et relateret billed- eller PDF-vaerktoj, nar du skal komprimere, konvertere, lave QR-koder eller eksportere.',
    },
    calculator: {
      best: 'Fa et hurtigt svar og samtidig se formler, antagelser og eksempler bag tallet.',
      details: 'Indtast realistiske vaerdier, sammenlign scenarier og brug forklaringen til at forsta det endelige resultat.',
      next: 'Prov en relateret beregner, nar beslutningen ogsa kraever procent, priser, lan, skat, drikkepenge eller alder.',
    },
    random: {
      best: 'Lave fair valg, lodtraekninger, holdvalg, terningkast, montkast og hurtige beslutninger.',
      details: 'Brug tydelige inputs og synlige resultater, sa udfaldet er nemt at forklare, gentage eller dele.',
      next: 'Aben en anden randomizer, nar du skal bruge tal, navne, hold, hjul, terninger eller et hurtigt ja/nej-valg.',
    },
    productivity: {
      best: 'Koere en fokuseret opgave, timer, plan, note, tjekliste eller vane direkte i browseren.',
      details: 'Hold siden aben mens du arbejder, brug gemt eller live tilstand hvor det findes, og nulstil nar sessionen skifter.',
      next: 'Ga til et andet planlaegnings- eller tidsvaerktoj, nar du skal bruge timer, liste, noter, dagsplan eller vaner.',
    },
    device: {
      best: 'Tjekke browser, enhed, netvaerk, skaerm, mikrofon, kamera, tastatur eller adgangskodestyrke hurtigt.',
      details: 'Laes tilladelserne i browseren omhyggeligt, og brug resultatet til at indkredse problemet.',
      next: 'Brug et andet diagnostisk vaerktoj, nar problemet handler om hastighed, skaerm, inputenheder, pixels eller browserdata.',
    },
    business: {
      best: 'Oprette praktiske forretningsdokumenter og politikudkast uden at starte fra en tom side.',
      details: 'Gennemga hvert felt, tilpas teksten til din virksomhed, og eksporter eller kopier resultatet, nar det er klar.',
      next: 'Brug relaterede PDF- og signeringsvaerktojer, nar dokumentet skal have formularer, signatur, beskyttelse eller sideoprydning.',
    },
    support: {
      best: 'Forsta AnyConverter, privatliv, politikker, sikkerhed og de tilgaengelige vaerktojskategorier.',
      details: 'Brug disse sider til at se, hvordan sitet fungerer, hvor data behandles, og hvordan du kontakter teamet.',
      next: 'Vend tilbage til vaerktojsoversigten, nar du vil bruge PDF-vaerktojer, beregnere, konvertere eller browsernytte.',
    },
  },
};

function metaDescription(row, primary) {
  const supportText = row.language === 'es'
    ? `Consulta ${primary} en AnyConverter. Informacion clara sobre privacidad, seguridad, politicas y herramientas online gratis.`
    : row.language === 'da'
      ? `Laes om ${primary} pa AnyConverter. Klar information om privatliv, sikkerhed, politikker og gratis online vaerktojer.`
      : `Learn about ${primary} on AnyConverter. Clear information about privacy, security, policies, and free online tools.`;
  const toolText = row.language === 'es'
    ? `Usa ${primary} gratis en el navegador. Incluye ejemplos, usos comunes, herramientas relacionadas y resultados rapidos.`
    : row.language === 'da'
      ? `Brug ${primary} gratis i browseren. Fa eksempler, praktiske tips, relaterede vaerktojer og hurtige resultater.`
      : `Use ${primary} for free in your browser. Get instant results, practical examples, related tools, and no signup.`;
  const text = row.page_family === 'support' ? supportText : toolText;
  return text.length <= 158 ? text : `${text.slice(0, 154).replace(/\s+\S*$/, '')}...`;
}

function relativeHref(url) {
  if (!url) return '';
  const parsed = new URL(url);
  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

function linkList(row, urlSet) {
  const currentSlug = slugFor(row.url);
  const slugs = familyLinks[row.page_family] ?? familyLinks.support;
  const links = slugs
    .filter((slug) => slug !== currentSlug)
    .map((slug) => localUrlFor(slug, row.language, urlSet))
    .filter(Boolean)
    .filter((url, index, arr) => arr.indexOf(url) === index)
    .slice(0, 4);
  return links.map((url) => {
    const label = labelForUrl(url);
    return `<a href="${escapeHtml(relativeHref(url))}">${escapeHtml(label)}</a>`;
  });
}

function buildSection(row, urlSet) {
  const primary = cleanText(row.primary_keyword);
  const primaryHtml = escapeHtml(primary);
  const secondary = secondaryTerms(row);
  const copy = familyCopy[row.language]?.[row.page_family] ?? familyCopy.en[row.page_family] ?? familyCopy.en.support;
  const links = linkList(row, urlSet);
  const heading = row.language === 'es'
    ? `${capitalize(primary)}: usos practicos`
    : row.language === 'da'
      ? `${capitalize(primary)}: praktisk brug`
      : `${capitalize(primary)}: practical uses`;
  const intro = row.language === 'es'
    ? `Usa ${primaryHtml} cuando necesites una respuesta rapida, clara y privada sin crear una cuenta. La pagina tambien cubre variantes relacionadas como ${secondary.map(escapeHtml).join(', ') || primaryHtml} para que puedas elegir el flujo correcto.`
    : row.language === 'da'
      ? `Brug ${primaryHtml}, nar du har brug for et hurtigt, klart og privat resultat uden at oprette en konto. Siden daekker ogsa relaterede behov som ${secondary.map(escapeHtml).join(', ') || primaryHtml}, sa du kan vaelge den rigtige arbejdsgang.`
      : `Use ${primaryHtml} when you need a fast, clear, private result without creating an account. This page also supports related needs like ${secondary.map(escapeHtml).join(', ') || primaryHtml} so you can choose the right workflow.`;
  const h3 = row.language === 'es' ? 'Cuándo usarlo' : row.language === 'da' ? 'Hvornar det er nyttigt' : 'When it helps';
  const relatedLead = row.language === 'es'
    ? 'Para continuar, prueba tambien '
    : row.language === 'da'
      ? 'Fortsæt eventuelt med '
      : 'For the next step, try ';
  const related = links.length ? `${relatedLead}${links.join(', ')}.` : '';

  return `    <!-- ${marker} -->\n` +
    `    <section class="seo-content" data-seo-keyword-plan="2026-08-21">\n` +
    `      <h2>${escapeHtml(heading)}</h2>\n` +
    `      <p>${intro}</p>\n` +
    `      <h3>${escapeHtml(h3)}</h3>\n` +
    `      <ul>\n` +
    `        <li><strong>${row.language === 'es' ? 'Ideal para' : row.language === 'da' ? 'Bedst til' : 'Best for'}:</strong> ${escapeHtml(copy.best)}</li>\n` +
    `        <li><strong>${row.language === 'es' ? 'Detalles utiles' : row.language === 'da' ? 'Nyttige detaljer' : 'Helpful details'}:</strong> ${escapeHtml(copy.details)}</li>\n` +
    `        <li><strong>${row.language === 'es' ? 'Siguiente paso' : row.language === 'da' ? 'Naeste trin' : 'Next step'}:</strong> ${escapeHtml(copy.next)}</li>\n` +
    `      </ul>\n` +
    (related ? `      <p>${related}</p>\n` : '') +
    `    </section>\n`;
}

function updateMeta(html, row) {
  const primary = cleanText(row.primary_keyword);
  const description = escapeHtml(metaDescription(row, primary));
  const replacements = [
    [/(\s*<meta name="description" content=")[^"]*(">\s*)/i, `$1${description}$2`],
    [/(\s*<meta property="og:description" content=")[^"]*(">\s*)/i, `$1${description}$2`],
    [/(\s*<meta name="twitter:description" content=")[^"]*(">\s*)/i, `$1${description}$2`],
  ];
  let out = html;
  for (const [pattern, replacement] of replacements) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

function updateHtml(html, row, urlSet) {
  const section = buildSection(row, urlSet);
  const markedSection = new RegExp(`\\n\\s*<!-- ${marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} -->\\s*\\n\\s*<section class="seo-content" data-seo-keyword-plan="2026-08-21">[\\s\\S]*?\\n\\s*</section>\\s*\\n`, 'g');
  let out = html.replace(markedSection, '\n');
  const insertionTargets = [
    /\n    <div class="ad-slot ad-slot--rectangle"/,
    /\n    <section class="faq"/,
    /\n    <section class="related-tools"/,
    /\n  <\/main>/,
  ];
  const target = insertionTargets.find((pattern) => pattern.test(out));
  if (!target) throw new Error(`No insertion target found for ${row.file}`);
  out = out.replace(target, `\n${section}$&`);
  return updateMeta(out, row);
}

const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const urlSet = new Set([...sitemap.matchAll(/<loc>(https:\/\/anyconverter\.io\/[^<]*)<\/loc>/g)].map((match) => match[1]));
const rows = readCsv(inputCsv);
let changed = 0;
const missing = [];

for (const row of rows) {
  const filePath = path.join(root, row.file.replace(/[\\/]/g, path.sep));
  if (!fs.existsSync(filePath)) {
    missing.push(row.file);
    continue;
  }
  const before = fs.readFileSync(filePath, 'utf8');
  const after = updateHtml(before, row, urlSet);
  if (after !== before) {
    fs.writeFileSync(filePath, after);
    changed += 1;
  }
}

console.log(`Processed ${rows.length} keyword rows`);
console.log(`Changed ${changed} HTML files`);
if (missing.length) {
  console.log(`Missing files: ${missing.join(', ')}`);
  process.exitCode = 1;
}
