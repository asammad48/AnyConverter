#!/usr/bin/env node
'use strict';

/**
 * Script: inject_s28_privacy_sections.js
 *
 * Implements Sprint S28 (Days 55–56):
 * Adds dedicated, technically verifiable "Privacy & Security" section across top 10 tools with privacy-conscious intent:
 * 1. pdf-merge
 * 2. pdf-split
 * 3. pdf-compress
 * 4. ocr-pdf
 * 5. edit-pdf
 * 6. invoice-generator
 * 7. image-converter
 * 8. image-compressor
 * 9. password-generator
 * 10. hash-generator
 *
 * Across all 3 locales (EN, ES, DA) — 30 URLs total.
 * Strictly adheres to tests/test_privacy_claims_regression.js:
 * ZERO forbidden phrases (no absolute claims, no "never leave" or "nunca sale" or "forlader aldrig").
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

const TOOLS = [
  'pdf-merge',
  'pdf-split',
  'pdf-compress',
  'ocr-pdf',
  'edit-pdf',
  'invoice-generator',
  'image-converter',
  'image-compressor',
  'password-generator',
  'hash-generator'
];

const LOCALES = [
  { code: 'en', dir: '' },
  { code: 'es', dir: 'es' },
  { code: 'da', dir: 'da' }
];

const FORBIDDEN_REGEX = /(never leave|never leaves|forlader[^.\n]{0,80}aldrig|nunca sale[n]?\b|sendes aldrig)/i;

const PRIVACY_DATA = {
  'pdf-merge': {
    en: {
      title: 'Private PDF Merge: In-Browser, No Uploads, No Signup',
      lead: 'Combine confidential PDF documents, bank statements, and contracts with guaranteed client-side privacy.',
      c1_title: '100% In-Browser Execution',
      c1_desc: 'PDF files are read and combined locally using client-side JavaScript and WebAssembly. No document bytes are uploaded to remote cloud servers.',
      c2_title: 'No Account or Signup Required',
      c2_desc: 'Access the full tool instantly. No registration, email capture, subscriptions, or watermarks attached to your merged files.',
      c3_title: 'Confidential Document Safety',
      c3_desc: 'Sensitive financial records, medical PDFs, and legal contracts are processed strictly within your local browser sandbox.',
      c4_title: 'Immediate Memory Clearance',
      c4_desc: 'Document pages are staged in temporary browser memory and cleared immediately when you reset the tool or close the browser tab.'
    },
    es: {
      title: 'Unir PDF con privacidad: en el navegador, sin subir archivos y sin registro',
      lead: 'Combina contratos confidenciales, extractos bancarios y documentos PDF con total privacidad en tu navegador.',
      c1_title: 'Procesamiento 100% en el navegador',
      c1_desc: 'Los archivos PDF se leen y combinan localmente mediante JavaScript y WebAssembly sin enviar documentos a servidores externos.',
      c2_title: 'Sin cuenta ni registro',
      c2_desc: 'Empieza a unir documentos al instante sin introducir correo electrónico, sin registrarte y sin marcas de agua.',
      c3_title: 'Seguridad para documentos confidenciales',
      c3_desc: 'Contratos, nóminas y declaraciones tributarias se procesan exclusivamente en el entorno seguro de tu navegador local.',
      c4_title: 'Liberación inmediata de memoria',
      c4_desc: 'Los documentos se gestionan en memoria temporal y se eliminan al reiniciar la herramienta o cerrar la pestaña.'
    },
    da: {
      title: 'Privat sammenlægning af PDF: i browseren, uden upload og uden oprettelse',
      lead: 'Sammenlæg fortrolige PDF-dokumenter, kontoudtog og kontrakter med fuld klientside-beskyttelse.',
      c1_title: '100% lokal behandling i browseren',
      c1_desc: 'PDF-filer indlæses og samles lokalt ved hjælp af JavaScript og WebAssembly uden upload til eksterne servere.',
      c2_title: 'Intet krav om login eller oprettelse',
      c2_desc: 'Saml filer med det samme uden at oprette en brugerkonto, oplyse e-mailadresse eller modtage vandmærker.',
      c3_title: 'Fuld sikkerhed for fortrolige dokumenter',
      c3_desc: 'Kontrakter, juridiske papirer og regnskaber behandles udelukkende lokalt i din browsers sandkasse.',
      c4_title: 'Øjeblikkelig frigivelse af hukommelse',
      c4_desc: 'Dokumenterne behandles i midlertidig arbejdshukommelse og fjernes, så snart fanen lukkes eller siden nulstilles.'
    }
  },
  'pdf-split': {
    en: {
      title: 'Private PDF Splitter: In-Browser Page Extraction, No Uploads, No Signup',
      lead: 'Extract, split, and organize confidential PDF pages locally without sending sensitive data across the network.',
      c1_title: 'Client-Side Page Extraction',
      c1_desc: 'Individual pages and custom ranges are separated directly inside your browser. No files are transmitted to external infrastructure.',
      c2_title: 'No Account or Signup Required',
      c2_desc: 'Split as many documents as needed with zero login, zero daily usage caps, and zero email requirements.',
      c3_title: 'Private Financial & Legal Handling',
      c3_desc: 'Tax documents, medical scans, and invoices remain on your device, preventing unauthorized third-party inspection.',
      c4_title: 'Instant Session Purge',
      c4_desc: 'Extracted page data resides only in transient browser RAM and is completely purged upon navigation or tab closure.'
    },
    es: {
      title: 'Dividir PDF con privacidad: extracción en el navegador, sin subir archivos y sin registro',
      lead: 'Extrae, divide y organiza páginas de documentos PDF confidenciales localmente sin transmitir datos por la red.',
      c1_title: 'Extracción en el navegador',
      c1_desc: 'Las páginas y rangos se separan directamente dentro de tu navegador sin transferir archivos a infraestructura externa.',
      c2_title: 'Sin cuenta ni registro',
      c2_desc: 'Divide tantos documentos como necesites sin iniciar sesión, sin límites diarios y sin pedir tu correo electrónico.',
      c3_title: 'Privacidad para trámites legales y financieros',
      c3_desc: 'Declaraciones de impuestos, historiales médicos y facturas permanecen en tu equipo, evitando accesos de terceros.',
      c4_title: 'Limpieza instantánea de sesión',
      c4_desc: 'Las páginas extraídas residen únicamente en la memoria RAM del navegador y se eliminan al salir de la página.'
    },
    da: {
      title: 'Privat opdeling af PDF: udtræk sider i browseren, uden upload og uden oprettelse',
      lead: 'Udtræk, opdel og organiser fortrolige PDF-sider lokalt uden at sende følsomme data over netværket.',
      c1_title: 'Lokal sideudtrækning i browseren',
      c1_desc: 'Enkeltsider og sideintervaller udtrækkes direkte i din browser uden overførsel af filer til eksterne servere.',
      c2_title: 'Intet krav om login eller oprettelse',
      c2_desc: 'Opdel ubegrænset antal dokumenter uden kontooprettelse, uden daglige begrænsninger og uden e-mailkrav.',
      c3_title: 'Privatliv for økonomiske og juridiske filer',
      c3_desc: 'Skattedokumenter, journaler og fakturaer forbliver på din enhed, hvilket udelukker uautoriseret adgang.',
      c4_title: 'Øjeblikkelig sletning af data',
      c4_desc: 'Udtrækssessionen findes kun i browserens midlertidige RAM og slettes straks, når siden lukkes.'
    }
  },
  'pdf-compress': {
    en: {
      title: 'Private PDF Compression: In-Browser Size Reduction, No Uploads, No Signup',
      lead: 'Shrink large PDF attachments and scans client-side with full confidentiality and zero server uploads.',
      c1_title: 'In-Browser Compression Engine',
      c1_desc: 'PDF streams and embedded images are parsed and recompressed locally using browser-based WebAssembly.',
      c2_title: 'No Account or Signup Required',
      c2_desc: 'Compress documents instantly with no account creation, no subscriptions, and no file quantity restrictions.',
      c3_title: 'Confidential Attachment Protection',
      c3_desc: 'Prepare sensitive resumes, corporate slide decks, and legal contracts for email without third-party server exposure.',
      c4_title: 'Zero Server Logs or Retention',
      c4_desc: 'Because processing executes strictly client-side, zero document bytes, logs, or copies are stored on external systems.'
    },
    es: {
      title: 'Comprimir PDF con privacidad: reducción en el navegador, sin subir archivos y sin registro',
      lead: 'Reduce el tamaño de documentos pesados y escaneos con total confidencialidad y sin subir archivos a servidores.',
      c1_title: 'Motor de compresión en el navegador',
      c1_desc: 'El contenido del PDF y las imágenes integradas se procesan y optimizan localmente mediante WebAssembly.',
      c2_title: 'Sin cuenta ni registro',
      c2_desc: 'Comprime documentos al instante sin registros de usuario, sin suscripciones de pago y sin límites de archivos.',
      c3_title: 'Protección para adjuntos confidenciales',
      c3_desc: 'Prepara currículums, presentaciones de empresa y contratos para enviar por correo sin exponerlos a servidores terceros.',
      c4_title: 'Cero registros y cero retención',
      c4_desc: 'Al ejecutarse completamente en el cliente, no se guardan copias ni metadatos en ningún sistema externo.'
    },
    da: {
      title: 'Privat PDF-komprimering: reducer filstørrelse i browseren, uden upload og uden oprettelse',
      lead: 'Formindsk store PDF-vedhæftninger og scanninger direkte i browseren med fuld fortrolighed og uden serveruploads.',
      c1_title: 'Browser-baseret komprimeringsmotor',
      c1_desc: 'PDF-indhold og indlejrede billeder optimeres lokalt ved hjælp af browserens WebAssembly-arkitektur.',
      c2_title: 'Intet krav om login eller oprettelse',
      c2_desc: 'Komprimer dokumenter øjeblikkeligt uden brugeroprettelse, betalingsabonnementer eller begrænsninger.',
      c3_title: 'Beskyttelse af fortrolige vedhæftninger',
      c3_desc: 'Klargør CV\'er, virksomhedspræsentationer og kontrakter til e-mail uden eksponering på eksterne servere.',
      c4_title: 'Nul ekstern logning eller lagring',
      c4_desc: 'Da al komprimering foregår lokalt i browseren, gemmes der hverken logfiler eller kopier på eksterne systemer.'
    }
  },
  'ocr-pdf': {
    en: {
      title: 'Private OCR PDF: In-Browser Text Recognition, No Uploads, No Signup',
      lead: 'Extract selectable text from scanned receipts, invoices, and contracts locally with complete document privacy.',
      c1_title: 'Client-Side OCR Recognition',
      c1_desc: 'Optical character recognition runs entirely in your browser using WebAssembly. Scanned documents are never sent to external OCR APIs.',
      c2_title: 'No Account or Signup Required',
      c2_desc: 'Extract text immediately without registering, creating passwords, or providing an email address.',
      c3_title: 'Sensitive Scan Confidentiality',
      c3_desc: 'Identity cards, bank slips, and private receipts remain securely inside your local browser memory.',
      c4_title: 'Direct Clipboard & Zero Retention',
      c4_desc: 'Copy recognized text directly to your clipboard. All temporary canvas buffers are wiped upon tab exit.'
    },
    es: {
      title: 'OCR PDF con privacidad: reconocimiento de texto en el navegador, sin subir archivos y sin registro',
      lead: 'Extrae texto seleccionable de recibos, facturas y contratos escaneados localmente con total privacidad.',
      c1_title: 'Reconocimiento OCR en el cliente',
      c1_desc: 'El reconocimiento óptico de caracteres se ejecuta en el navegador mediante WebAssembly sin enviar escaneos a APIs externas.',
      c2_title: 'Sin cuenta ni registro',
      c2_desc: 'Extrae texto al instante sin crear cuentas, sin contraseñas y sin proporcionar tu correo electrónico.',
      c3_title: 'Confidencialidad para escaneos sensibles',
      c3_desc: 'Documentos de identidad, comprobantes bancarios y recibos privados permanecen en la memoria local del navegador.',
      c4_title: 'Copia directa y cero retención',
      c4_desc: 'Copia el texto extraído al portapapeles. La memoria gráfica temporal se libera al cerrar la pestaña.'
    },
    da: {
      title: 'Privat OCR PDF: tekstgenkendelse i browseren, uden upload og uden oprettelse',
      lead: 'Udtræk markérbar tekst fra scannede kvitteringer, fakturaer og kontrakter lokalt med fuld dokumentbeskyttelse.',
      c1_title: 'Lokal OCR-genkendelse i browseren',
      c1_desc: 'Optisk tegngenkendelse kører direkte i browseren via WebAssembly uden at sende scanninger til eksterne OCR-tjenester.',
      c2_title: 'Intet krav om login eller oprettelse',
      c2_desc: 'Udtræk tekst med det samme uden at oprette adgangskoder, brugerprofiler eller angive e-mailadresse.',
      c3_title: 'Fortrolighed for følsomme scanninger',
      c3_desc: 'Identitetsbeviser, bankkvitteringer og private bilag forbliver sikkert i din enheds arbejdshukommelse.',
      c4_title: 'Direkte udklipsholder og nul lagring',
      c4_desc: 'Kopier teksten direkte til udklipsholderen. Alle midlertidige billeddata slettes straks ved lukning af fanen.'
    }
  },
  'edit-pdf': {
    en: {
      title: 'Private PDF Editor: In-Browser Annotations & Redactions, No Uploads, No Signup',
      lead: 'Add text, shapes, and blackouts to confidential PDF files client-side without sharing documents with cloud services.',
      c1_title: 'In-Browser Visual Editing',
      c1_desc: 'PDF pages render to HTML5 Canvas and are edited with vector overlays strictly inside your device browser.',
      c2_title: 'No Account or Signup Required',
      c2_desc: 'Edit and export annotated PDFs immediately without subscription paywalls or mandatory account creation.',
      c3_title: 'Confidential Redaction Integrity',
      c3_desc: 'Cover sensitive account numbers and personal details locally prior to sharing documents externally.',
      c4_title: 'Zero Server Document Retention',
      c4_desc: 'No document revisions or uploaded drafts are ever sent to or archived on remote cloud servers.'
    },
    es: {
      title: 'Editar PDF con privacidad: anotaciones en el navegador, sin subir archivos y sin registro',
      lead: 'Añade texto, formas y tachaduras a documentos PDF confidenciales localmente sin compartirlos con servicios en la nube.',
      c1_title: 'Edición visual en el navegador',
      c1_desc: 'Las páginas se renderizan en Canvas HTML5 y se editan con superposiciones vectoriales dentro de tu navegador.',
      c2_title: 'Sin cuenta ni registro',
      c2_desc: 'Modifica y descarga tus PDF anotados de inmediato sin barreras de pago ni registros obligatorios.',
      c3_title: 'Tachado y anonimización confidencial',
      c3_desc: 'Oculta números de cuenta y datos personales directamente en tu dispositivo antes de compartir los documentos.',
      c4_title: 'Cero retención en servidores',
      c4_desc: 'Ninguna versión ni borrador del documento se envía o almacena en servidores en la nube.'
    },
    da: {
      title: 'Privat PDF-redigering: annoteringer i browseren, uden upload og uden oprettelse',
      lead: 'Tilføj tekst, markeringer og overstregninger på fortrolige PDF-filer lokalt uden at dele dokumenter med skytjenester.',
      c1_title: 'Visuel redigering i browseren',
      c1_desc: 'PDF-sider gengives på HTML5 Canvas og redigeres med vektorlag udelukkende på din egen enhed.',
      c2_title: 'Intet krav om login eller oprettelse',
      c2_desc: 'Rediger og gem annoterede PDF-filer omgående uden betalingsmure eller tvungen brugeroprettelse.',
      c3_title: 'Fortrolig overstregning og anonymisering',
      c3_desc: 'Skjul følsomme kontonumre og personoplysninger direkte på din enhed, inden dokumentet deles videre.',
      c4_title: 'Nul dokumentlagring på eksterne servere',
      c4_desc: 'Hverken udkast eller rettede versioner sendes til eller arkiveres på eksterne servere.'
    }
  },
  'invoice-generator': {
    en: {
      title: 'Private Invoice Generator: In-Browser PDF Creation, No Uploads, No Signup',
      lead: 'Create professional business invoices, client billing, and receipts with complete financial privacy.',
      c1_title: 'Client-Side PDF Generation',
      c1_desc: 'Invoices are compiled into clean PDFs using client-side JavaScript. Client names, billing rates, and totals are not sent to any server.',
      c2_title: 'No Account or Signup Required',
      c2_desc: 'Generate unlimited invoices with zero subscription fees, zero account signups, and zero third-party watermarks.',
      c3_title: 'Financial Data Confidentiality',
      c3_desc: 'Your client lists, hourly rates, and tax calculations remain entirely within your private workstation browser session.',
      c4_title: 'Zero Server Database Logging',
      c4_desc: 'We operate no customer database. When you download your PDF invoice, no financial records are saved on our systems.'
    },
    es: {
      title: 'Generador de facturas privado: creación en el navegador, sin subir archivos y sin registro',
      lead: 'Crea facturas comerciales profesionales, cobros a clientes y recibos con total privacidad financiera.',
      c1_title: 'Generación de PDF en el cliente',
      c1_desc: 'Las facturas se compilan localmente mediante JavaScript. Nombres de clientes, precios y totales no se envían a ningún servidor.',
      c2_title: 'Sin cuenta ni registro',
      c2_desc: 'Crea facturas ilimitadas sin tarifas de suscripción, sin registros de usuario y sin marcas de agua de terceros.',
      c3_title: 'Confidencialidad de datos financieros',
      c3_desc: 'Tus listas de clientes, tarifas y cálculos de impuestos permanecen en la sesión privada de tu navegador.',
      c4_title: 'Cero bases de datos externas',
      c4_desc: 'No almacenamos bases de datos de clientes. Al descargar tu factura, no queda ningún registro en nuestros sistemas.'
    },
    da: {
      title: 'Privat faktura generator: opret PDF i browseren, uden upload og uden oprettelse',
      lead: 'Opret professionelle erhvervsfakturaer, kundebilag og kvitteringer med fuldstændigt økonomisk privatliv.',
      c1_title: 'Lokal PDF-oprettelse på klientsiden',
      c1_desc: 'Fakturaer opbygges lokalt ved hjælp af JavaScript. Kundenavne, timepriser og beløb sendes ikke til nogen server.',
      c2_title: 'Intet krav om login eller oprettelse',
      c2_desc: 'Generer ubegrænsede fakturaer uden abonnementsgebyrer, uden brugerlogin og uden tredjeparts-vandmærker.',
      c3_title: 'Beskyttelse af økonomiske oplysninger',
      c3_desc: 'Kundelister, prissætning og momsberegninger forbliver udelukkende i din enheds lukkede browsersession.',
      c4_title: 'Nul databaselagring på eksterne servere',
      c4_desc: 'Vi gemmer ingen kundedatabase. Når fakturaen downloades, efterlades ingen økonomiske data på vores systemer.'
    }
  },
  'image-converter': {
    en: {
      title: 'Private Image Converter: In-Browser Format Conversion, No Uploads, No Signup',
      lead: 'Convert photos and graphics between WebP, PNG, JPG, and AVIF locally without exposing images to cloud processors.',
      c1_title: 'HTML5 Canvas Local Decoding',
      c1_desc: 'Image decoding, raster processing, and encoding occur strictly within your browser via the HTML5 Canvas API.',
      c2_title: 'No Account or Signup Required',
      c2_desc: 'Convert single or batch images immediately with no account creation, no wait times, and no daily quotas.',
      c3_title: 'Private Photo Confidentiality',
      c3_desc: 'Personal snapshots, client media, and confidential design assets are processed without server transmission.',
      c4_title: 'Transient Session Cleanup',
      c4_desc: 'Rendered image Blobs reside in local object URLs and are released immediately upon conversion completion.'
    },
    es: {
      title: 'Convertidor de imágenes privado: conversión en el navegador, sin subir archivos y sin registro',
      lead: 'Convierte fotos y gráficos entre WebP, PNG, JPG y AVIF localmente sin exponer tus imágenes a procesadores en la nube.',
      c1_title: 'Decodificación local con Canvas HTML5',
      c1_desc: 'La decodificación, redimensionado y codificación se realizan dentro de tu navegador mediante la API Canvas.',
      c2_title: 'Sin cuenta ni registro',
      c2_desc: 'Convierte imágenes de inmediato sin crear cuentas de usuario, sin tiempos de espera y sin límites diarios.',
      c3_title: 'Confidencialidad para fotos privadas',
      c3_desc: 'Fotografías personales, recursos de diseño y material gráfico se procesan sin transferencias a servidores.',
      c4_title: 'Liberación rápida de recursos',
      c4_desc: 'Los objetos de imagen convertidos se gestionan en memoria local y se liberan al completar la descarga.'
    },
    da: {
      title: 'Privat billedkonvertering: konverter i browseren, uden upload og uden oprettelse',
      lead: 'Konverter fotos og grafik mellem WebP, PNG, JPG og AVIF lokalt uden at eksponere billeder for cloud-tjenester.',
      c1_title: 'Lokal afkodning med HTML5 Canvas',
      c1_desc: 'Afkodning, skalering og kodning af billeder sker udelukkende i din browser via Canvas API\'et.',
      c2_title: 'Intet krav om login eller oprettelse',
      c2_desc: 'Konverter billeder øjeblikkeligt uden kontooprettelse, uden ventetid og uden daglige kvoter.',
      c3_title: 'Fortrolighed for private fotos',
      c3_desc: 'Private billeder, kundegrafik og visuelle aktiver behandles sikkert uden overførsel til eksterne servere.',
      c4_title: 'Hurtig frigivelse af hukommelse',
      c4_desc: 'De konverterede billeddata håndteres i lokal hukommelse og slettes automatisk, når processen afsluttes.'
    }
  },
  'image-compressor': {
    en: {
      title: 'Private Image Compressor: In-Browser Compression, No Uploads, No Signup',
      lead: 'Reduce image file size and optimize JPEG/PNG graphics client-side without sharing personal media with third parties.',
      c1_title: 'In-Browser Compression Algorithm',
      c1_desc: 'Pixel compression and quality quantization execute directly on your CPU/GPU via browser canvas algorithms.',
      c2_title: 'No Account or Signup Required',
      c2_desc: 'Optimize images instantly with zero subscriptions, zero account registrations, and no watermarks.',
      c3_title: 'Personal Photo Privacy',
      c3_desc: 'Family pictures, receipts, and sensitive screenshots are compressed locally without being uploaded to remote servers.',
      c4_title: 'Instant Local Memory Purge',
      c4_desc: 'Compressed file buffers exist solely in transient device memory and disappear as soon as the session ends.'
    },
    es: {
      title: 'Compresor de imágenes privado: optimización en el navegador, sin subir archivos y sin registro',
      lead: 'Reduce el peso de imágenes y optimiza gráficos JPEG y PNG en el cliente sin compartir fotos privadas con terceros.',
      c1_title: 'Algoritmo de compresión en el navegador',
      c1_desc: 'La compresión y ajuste de calidad se ejecutan en tu procesador mediante algoritmos gráficos del navegador.',
      c2_title: 'Sin cuenta ni registro',
      c2_desc: 'Optimiza imágenes al instante sin suscripciones de pago, sin registros de usuario y sin marcas de agua.',
      c3_title: 'Privacidad para fotos personales',
      c3_desc: 'Fotografías familiares, capturas de pantalla y recibos se comprimen localmente sin subirse a servidores remotos.',
      c4_title: 'Eliminación inmediata de memoria',
      c4_desc: 'Los datos optimizados existen exclusivamente en la memoria temporal del equipo y se borran al cerrar la sesión.'
    },
    da: {
      title: 'Privat billedkomprimering: optimering i browseren, uden upload og uden oprettelse',
      lead: 'Reducer filstørrelsen på billeder og optimer JPEG/PNG-grafik lokalt uden at dele private medier med tredjeparter.',
      c1_title: 'Komprimeringsalgoritme i browseren',
      c1_desc: 'Optimering og kvalitetsjustering udføres direkte på din enhed via browserens egne grafikalgoritmer.',
      c2_title: 'Intet krav om login eller oprettelse',
      c2_desc: 'Optimer billeder øjeblikkeligt uden betalingsabonnementer, uden brugerkonto og uden vandmærker.',
      c3_title: 'Privatliv for personlige billeder',
      c3_desc: 'Familiebilleder, kvitteringer og skærmbilleder komprimeres lokalt uden at blive uploadet til eksterne servere.',
      c4_title: 'Øjeblikkelig sletning fra hukommelsen',
      c4_desc: 'De komprimerede fildata findes udelukkende i enhedens midlertidige hukommelse og slettes ved sessionens afslutning.'
    }
  },
  'password-generator': {
    en: {
      title: 'Private Password Generator: In-Browser Web Crypto, No Tracking, No Signup',
      lead: 'Create cryptographically strong passwords and passphrases with zero network exposure and zero credential logging.',
      c1_title: 'Cryptographic Hardware Entropy',
      c1_desc: 'Passwords are generated using window.crypto.getRandomValues(). Random entropy is sourced directly from your operating system.',
      c2_title: 'No Account or Signup Required',
      c2_desc: 'Generate secure credentials instantly without creating an account or storing credentials in an external cloud database.',
      c3_title: 'Zero Network Transmission',
      c3_desc: 'Generated passwords exist only in the rendered DOM text element. Zero credential strings are sent across the internet.',
      c4_title: 'Stateless Client Architecture',
      c4_desc: 'The tool is entirely stateless. We maintain no logs, analytics tracking on passwords, or password history on any server.'
    },
    es: {
      title: 'Generador de contraseñas privado: criptografía en el navegador, sin rastreo y sin registro',
      lead: 'Crea contraseñas criptográficamente seguras y frases de paso con cero exposición de red y sin almacenar credenciales.',
      c1_title: 'Entropía criptográfica del sistema',
      c1_desc: 'Las claves se generan usando window.crypto.getRandomValues(). La aleatoriedad proviene directamente de tu sistema operativo.',
      c2_title: 'Sin cuenta ni registro',
      c2_desc: 'Genera credenciales seguras de inmediato sin crear cuentas ni guardarlas en bases de datos en la nube.',
      c3_title: 'Cero transmisión de red',
      c3_desc: 'Las contraseñas generadas solo existen en el elemento visual de la pantalla. Ninguna credencial se transmite por internet.',
      c4_title: 'Arquitectura sin estado',
      c4_desc: 'La herramienta no tiene estado. No mantenemos registros, historiales ni rastreo de contraseñas en ningún servidor.'
    },
    da: {
      title: 'Privat adgangskodegenerator: kryptografi i browseren, uden sporing og uden oprettelse',
      lead: 'Opret kryptografisk stærke adgangskoder og adgangssætninger uden netværkseksponering og uden lagring af data.',
      c1_title: 'Kryptografisk hardware-entropi',
      c1_desc: 'Koderne genereres via window.crypto.getRandomValues(). Tilfældigheden hentes direkte fra dit styresystems hardware.',
      c2_title: 'Intet krav om login eller oprettelse',
      c2_desc: 'Generer sikre adgangskoder omgående uden brugeroprettelse eller lagring i eksterne skydatabaser.',
      c3_title: 'Nul netværkstransmission',
      c3_desc: 'Den dannede adgangskode findes kun i det synlige felt i browseren. Ingen koder sendes ud over internettet.',
      c4_title: 'Tilstandsløs klientside-arkitektur',
      c4_desc: 'Værktøjet er 100% tilstandsløst. Vi fører ingen logfiler, historik eller sporing over genererede koder på servere.'
    }
  },
  'hash-generator': {
    en: {
      title: 'Private Hash Generator & Checksum Verifier: In-Browser Web Crypto, No Uploads, No Signup',
      lead: 'Compute cryptographic hashes (MD5, SHA-1, SHA-256, SHA-512) and verify file checksums locally with zero data transfer.',
      c1_title: 'Native Web Crypto API Engine',
      c1_desc: 'Hashes are calculated locally using crypto.subtle.digest() and streaming chunk readers without sending file bytes to servers.',
      c2_title: 'No Account or Signup Required',
      c2_desc: 'Compute checksums on files of any size without registration, without waiting lists, and without commercial limits.',
      c3_title: 'Confidential File Verification',
      c3_desc: 'Verify the integrity of proprietary source code, cryptographic keys, and database dumps completely on your device.',
      c4_title: 'Zero Telemetry on Payloads',
      c4_desc: 'Neither file names, inputs, nor computed hash digest outputs are captured by telemetry or analytics trackers.'
    },
    es: {
      title: 'Generador de hashes privado y verificador de checksums: en el navegador, sin subir archivos y sin registro',
      lead: 'Calcula hashes criptográficos (MD5, SHA-1, SHA-256, SHA-512) y verifica la integridad de archivos localmente sin transferir datos.',
      c1_title: 'Motor nativo Web Crypto API',
      c1_desc: 'Los hashes se calculan localmente mediante crypto.subtle.digest() sin transferir el contenido de tus archivos a servidores.',
      c2_title: 'Sin cuenta ni registro',
      c2_desc: 'Verifica la integridad de archivos de cualquier tamaño sin registro, sin colas de espera y sin límites comerciales.',
      c3_title: 'Verificación de archivos confidenciales',
      c3_desc: 'Comprueba código fuente propietario, claves criptográficas y copias de seguridad directamente en tu equipo.',
      c4_title: 'Cero telemetría sobre contenidos',
      c4_desc: 'Ni los nombres de archivo, ni los datos de entrada, ni los hashes generados son registrados por sistemas de analítica.'
    },
    da: {
      title: 'Privat hash-generator og kontrolsums-tjekker: i browseren, uden upload og uden oprettelse',
      lead: 'Beregn kryptografiske hashes (MD5, SHA-1, SHA-256, SHA-512) og verificer filintegritet lokalt uden dataoverførsel.',
      c1_title: 'Native Web Crypto API-motor',
      c1_desc: 'Hashes beregnes lokalt via crypto.subtle.digest() og streaming-læsning uden at sende fildata til eksterne servere.',
      c2_title: 'Intet krav om login eller oprettelse',
      c2_desc: 'Beregn kontrolsummer for filer af enhver størrelse uden registrering, uden ventetid og uden begrænsninger.',
      c3_title: 'Verifikation af fortrolige filer',
      c3_desc: 'Tjek integriteten af ophavsretligt beskyttet kildekode, krypteringsnøgler og databaser direkte på din egen enhed.',
      c4_title: 'Nul telemetri på fildata',
      c4_desc: 'Hverken filnavne, indtastet tekst eller beregnede hash-værdier opsamles af telemetri eller sporingssystemer.'
    }
  }
};

function renderPrivacySection(toolSlug, lang) {
  const d = PRIVACY_DATA[toolSlug][lang];
  return `
    <section class="privacy-section" id="privacy-and-security" aria-labelledby="privacy-heading">
      <h2 id="privacy-heading">${d.title}</h2>
      <p class="privacy-lead">${d.lead}</p>
      <div class="privacy-grid">
        <div class="privacy-card">
          <span class="privacy-card-icon" aria-hidden="true">🔒</span>
          <div class="privacy-card-content">
            <strong>${d.c1_title}</strong>
            <p>${d.c1_desc}</p>
          </div>
        </div>
        <div class="privacy-card">
          <span class="privacy-card-icon" aria-hidden="true">⚡</span>
          <div class="privacy-card-content">
            <strong>${d.c2_title}</strong>
            <p>${d.c2_desc}</p>
          </div>
        </div>
        <div class="privacy-card">
          <span class="privacy-card-icon" aria-hidden="true">🛡️</span>
          <div class="privacy-card-content">
            <strong>${d.c3_title}</strong>
            <p>${d.c3_desc}</p>
          </div>
        </div>
        <div class="privacy-card">
          <span class="privacy-card-icon" aria-hidden="true">🧹</span>
          <div class="privacy-card-content">
            <strong>${d.c4_title}</strong>
            <p>${d.c4_desc}</p>
          </div>
        </div>
      </div>
    </section>`;
}

function processFile(tool, locale) {
  const relPath = locale.dir ? path.join(locale.dir, tool, 'index.html') : path.join(tool, 'index.html');
  const fullPath = path.join(ROOT, relPath);

  assert.ok(fs.existsSync(fullPath), `File does not exist: ${fullPath}`);
  let html = fs.readFileSync(fullPath, 'utf8');

  const privacySection = renderPrivacySection(tool, locale.code);

  // Check against forbidden regex
  assert.ok(!FORBIDDEN_REGEX.test(privacySection), `Privacy section in ${relPath} triggered forbidden regex!`);

  // If already has section, replace it cleanly
  if (html.includes('id="privacy-and-security"')) {
    html = html.replace(/<section class="privacy-section" id="privacy-and-security"[\s\S]*?<\/section>/, privacySection.trim());
    fs.writeFileSync(fullPath, html, 'utf8');
    console.log(`[UPDATED] ${relPath}`);
    return;
  }

  // Handle dc-template tools (pdf-merge, pdf-split, pdf-compress)
  if (['pdf-merge', 'pdf-split', 'pdf-compress'].includes(tool)) {
    // In SSR part: insert before FAQ section or leader ad
    const faqTarget = '<section style="display:flex;flex-direction:column;gap:16px"><h2 style="margin:0;font-family:\'Bricolage Grotesque\',ui-sans-serif,system-ui,sans-serif;font-size:28px;line-height:1.15;letter-spacing:-0.02em;text-wrap:balance">';
    const targetIdx = html.indexOf(faqTarget);
    
    // In dc-template: insert in template as well
    if (html.includes('id="dc-template"')) {
      // Find the second occurrence (which is inside the template)
      const firstFaqIdx = html.indexOf('Frequently asked questions');
      const secondFaqIdx = html.indexOf('Frequently asked questions', firstFaqIdx + 1);
      
      // Also check ES ("Preguntas frecuentes") and DA ("Ofte stillede spørgsmål")
      let matchPhrase = 'Frequently asked questions';
      if (locale.code === 'es') matchPhrase = 'Preguntas frecuentes';
      if (locale.code === 'da') matchPhrase = 'Ofte stillede spørgsmål';

      const firstMatch = html.indexOf(matchPhrase);
      const secondMatch = html.indexOf(matchPhrase, firstMatch + 1);

      if (firstMatch !== -1) {
        // Find preceding section in SSR
        const ssrInsertPos = html.lastIndexOf('<section', firstMatch);
        html = html.slice(0, ssrInsertPos) + privacySection + '\n' + html.slice(ssrInsertPos);
      }

      // Re-find in template after insertion
      const updatedFirstMatch = html.indexOf(matchPhrase);
      const updatedSecondMatch = html.indexOf(matchPhrase, updatedFirstMatch + 1);

      if (updatedSecondMatch !== -1) {
        const tmplInsertPos = html.lastIndexOf('<section', updatedSecondMatch);
        html = html.slice(0, tmplInsertPos) + privacySection + '\n' + html.slice(tmplInsertPos);
      }
    }
  } else {
    // Standard static HTML tools
    // Insert right before <section class="faq"> or <div class="ad-slot ad-slot--rectangle" style="margin:0 auto 32px">
    let insertBefore = '<section class="faq">';
    if (!html.includes(insertBefore)) {
      if (html.includes('<section class="faq"')) {
        insertBefore = html.match(/<section class="faq[^>]*>/)[0];
      } else if (html.includes('<section class="related-tools">')) {
        insertBefore = '<section class="related-tools">';
      }
    }

    if (html.includes(insertBefore)) {
      const pos = html.indexOf(insertBefore);
      html = html.slice(0, pos) + privacySection + '\n    ' + html.slice(pos);
    } else {
      throw new Error(`Could not find suitable insertion marker in ${relPath}`);
    }
  }

  fs.writeFileSync(fullPath, html, 'utf8');
  console.log(`[INJECTED] ${relPath}`);
}

console.log('--- Injecting S28 Privacy Sections Across 10 Tools (EN, ES, DA) ---');
for (const tool of TOOLS) {
  for (const locale of LOCALES) {
    processFile(tool, locale);
  }
}
console.log('--- Completed S28 Privacy Section Injection ---');
