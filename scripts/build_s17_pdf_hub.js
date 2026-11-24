'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Subsections definition with tool slugs
const SUBSECTIONS = [
  {
    id: 'organize-manage-pages',
    tools: ['pdf-merge', 'pdf-split', 'rotate-pdf', 'organize-pdf', 'extract-pdf-pages', 'remove-pdf-pages']
  },
  {
    id: 'compression-optimization',
    tools: ['pdf-compress', 'optimize-pdf']
  },
  {
    id: 'conversion-formatting',
    tools: ['pdf-to-jpg', 'pdf-to-word', 'jpg-to-pdf', 'html-to-pdf', 'scan-to-pdf']
  },
  {
    id: 'security-privacy',
    tools: ['protect-pdf', 'unlock-pdf', 'redact-pdf', 'pdf-metadata-remover', 'pdf-security']
  },
  {
    id: 'editing-signing-utilities',
    tools: ['edit-pdf', 'sign-pdf', 'pdf-forms', 'add-page-numbers', 'add-watermark', 'compare-pdf', 'ocr-pdf', 'crop-pdf']
  }
];

const LOCALES = {
  en: {
    lang: 'en',
    filePath: 'pdf-tools/index.html',
    canonical: 'https://anyconverter.io/pdf-tools/',
    title: 'Free Online PDF Tools | Merge, Split & Edit | AnyConverter',
    metaDesc: 'Free online PDF tools to merge, split, compress, edit, convert, and sign documents directly in your browser. Fast, private, and zero installation required.',
    ogTitle: 'Free Online PDF Tools | Merge, Split & Edit | AnyConverter',
    ogDesc: 'Free online PDF tools to merge, split, compress, edit, convert, and sign documents directly in your browser. Fast, private, and zero installation required.',
    twitterTitle: 'Free Online PDF Tools | Merge, Split & Edit | AnyConverter',
    twitterDesc: 'Free online PDF tools to merge, split, compress, edit, convert, and sign documents directly in your browser. Fast, private, and zero installation required.',
    breadcrumb: {
      homeName: 'Home',
      homeUrl: '/',
      hubName: 'PDF Tools',
      hubUrl: '/pdf-tools/',
      ariaLabel: 'Breadcrumb'
    },
    hero: {
      h1: 'Free Online PDF Tools',
      desc: 'Process PDF documents directly in your browser with complete privacy. Merge, split, compress, organize, convert, edit, sign, and protect your PDF files instantly without desktop software installation.'
    },
    subsections: [
      {
        title: 'Organize & Manage Pages',
        desc: 'Managing multi-page PDF documents often requires precise structural adjustments before sharing or archiving in daily office workflows. When assembling contracts, reports, or research portfolios from multiple sources, start with Merge PDF to combine disparate chapters into a single cohesive file in your preferred sequence. If you receive bulky archives containing irrelevant content, Split PDF and Remove Pages allow you to isolate vital sections and discard blank or unnecessary sheets with pinpoint accuracy. For documents scanned upside down or sideways, Rotate PDF corrects page orientation permanently across individual sheets or the entire document without degrading rendering fidelity. When compiling executive packets or academic submissions, Organize PDF provides an interactive visual grid to drag, drop, and rearrange page sequences dynamically, while Extract Pages lets you export specific single or non-consecutive sheets into standalone files. Because all page manipulations execute directly inside your browser using client-side JavaScript, your proprietary records, personal identifiers, and financial statements never traverse external servers or cloud queues, ensuring instant processing speed and absolute data confidentiality.'
      },
      {
        title: 'Compression & Optimization',
        desc: 'Oversized PDF documents create stubborn delivery barriers across email attachments, online job application portals, and corporate document management systems. Our specialized compression and optimization utilities resolve bandwidth constraints by stripping redundant font descriptors, unreferenced object streams, and excess metadata while downsampling heavy raster imagery to optimal screen or print DPI. Choose Compress PDF when your primary objective is reducing raw file size to slip beneath strict email gateway limits (such as 10 MB or 25 MB) without sacrificing visual text legibility or vector diagram crispness. When preparing complex architectural portfolios, annual financial reviews, or digital eBooks for rapid web delivery, deploy Optimize PDF to re-linearize object tables for progressive rendering and streamline internal PDF structures. Because optimization calculations run entirely within your client device\'s browser memory, you avoid lengthy server upload waiting times and eliminate the security vulnerability of exposing proprietary figures or sensitive corporate communications to third-party cloud infrastructure.'
      },
      {
        title: 'Conversion & Formatting',
        desc: 'Document workflows frequently require seamless transitions between portable PDF formats, editable office documents, and web-ready image assets. Our versatile conversion suite handles bi-directional transformations with high fidelity and zero software dependencies. When you need to turn multi-page agreements or scanned archives into fully editable text for revisions, PDF to Word reconstructs paragraphs, headings, and tabulations into clean DOCX format. Conversely, JPG to PDF and Scan to PDF allow you to transform smartphone snapshots, receipts, invoices, or visual portfolios into standardized, publication-ready PDF documents with customizable page margins and orientations. To extract presentation graphics or share document excerpts on web platforms without requiring a PDF reader, PDF to JPG renders high-resolution raster images from individual pages. Developers and technical writers can leverage HTML to PDF to convert responsive web pages, transactional invoices, and styled documentation directly into portable documents. All file parsing, font rasterization, and formatting calculations occur entirely client-side, guaranteeing maximum speed and privacy.'
      },
      {
        title: 'Security & Privacy',
        desc: 'Protecting sensitive commercial intelligence, employee personal data, and confidential client communications is essential in modern digital environments. Our browser-based security utilities give you granular control over file access, permissions, and hidden tracking footprints without exposing documents to third-party cloud vulnerabilities. Use Protect PDF to apply robust password encryption and restrict unauthorized printing, copying, or form editing before dispatching critical contracts. When you legitimately hold access credentials for an encrypted file and need to remove administrative restrictions for simplified archiving or team collaboration, Unlock PDF strips security barriers safely. For legal filings, medical records, or sensitive disclosures, Blackout & Redact PDF enables irreversible permanent redaction of names, social security numbers, and financial details directly from vector and raster layers. Additionally, PDF Metadata Remover sanitizes invisible document properties such as author names, software revisions, creation timestamps, and GPS coordinates, while PDF Security audits existing encryption standards. Your data remains strictly on your device at all times.'
      },
      {
        title: 'Editing, Signing & Utilities',
        desc: 'Finalizing professional documents requires versatile editing, annotation, and verification tools to prepare files for signing, publication, or legal review. Rather than launching cumbersome desktop suites, our client-side utilities streamline everyday modifications in seconds. Use Edit PDF to insert annotations, type notes, highlight key passages, and overlay geometric markers across existing pages. When agreements, contracts, or tax declarations require formal authorization, Sign PDF empowers you to draw, type, or upload customized digital signatures directly onto designated approval lines without paper printing. Interactive forms can be completed and submitted cleanly using Fill PDF Forms. To maintain corporate numbering compliance across extensive legal submissions, Add Page Numbers inserts customized pagination, while Add Watermark applies security banners or corporate branding logos. For meticulous proofreading between revisions, Compare PDF presents side-by-side visual diffs highlighting text shifts and structural alterations. Scanned files can be made fully searchable through OCR PDF, and Crop PDF trims excess margins to standardize display boundaries.'
      }
    ],
    faqsHeading: 'Frequently Asked Questions',
    faqs: [
      {
        q: 'Are these PDF tools completely free to use without limits?',
        a: 'Yes, all PDF tools on AnyConverter are 100% free with no hidden paywalls, account registration requirements, or artificial daily page limits. You can merge, split, compress, edit, convert, and sign documents directly in your browser as often as needed.'
      },
      {
        q: 'Are my documents and sensitive data kept private and secure?',
        a: 'Yes, your privacy is strictly protected. Unlike traditional cloud services that upload files to remote servers, our PDF tools process your files directly inside your browser using client-side JavaScript. Your documents and sensitive personal information remain private on your local device without upload to AnyConverter processing servers.'
      },
      {
        q: 'Do I need to install software, browser extensions, or plugins?',
        a: 'No, you do not need to install software, browser extensions, or third-party plugins. All tools run directly in any standard, modern web browser including Chrome, Firefox, Safari, and Edge across Windows, macOS, Linux, and mobile operating systems.'
      },
      {
        q: 'Can I use these PDF tools on mobile phones and tablets?',
        a: 'Yes, the PDF tools are fully responsive and work seamlessly on iOS and Android smartphones and tablets. You can capture documents with your mobile camera to scan to PDF, fill forms, or sign agreements on touchscreens with your finger or stylus on the go.'
      },
      {
        q: 'How does client-side PDF processing differ from traditional cloud upload services?',
        a: 'Traditional cloud converters require uploading your entire PDF to an external server where it is placed in a processing queue, introducing latency and privacy risks. Client-side processing executes the math and file manipulation directly on your local device CPU, ensuring immediate execution with zero data transmission over the network.'
      }
    ],
    tools: {
      'pdf-merge': { name: 'Merge PDF', desc: 'Combine multiple PDF files into one document.', linkText: 'Use tool' },
      'pdf-split': { name: 'Split PDF', desc: 'Extract pages or split a PDF into separate files.', linkText: 'Use tool' },
      'pdf-compress': { name: 'Compress PDF', desc: 'Reduce PDF file size for sharing and storage.', linkText: 'Use tool' },
      'rotate-pdf': { name: 'Rotate PDF', desc: 'Rotate pages and download the corrected PDF.', linkText: 'Use tool' },
      'organize-pdf': { name: 'Organize PDF', desc: 'Reorder, remove and arrange PDF pages visually.', linkText: 'Use tool' },
      'extract-pdf-pages': { name: 'Extract PDF Pages', desc: 'Save selected pages from a PDF as a new file.', linkText: 'Use tool' },
      'pdf-to-jpg': { name: 'PDF to JPG', desc: 'Convert PDF pages into JPG images.', linkText: 'Use tool' },
      'pdf-to-word': { name: 'PDF to Word', desc: 'Turn a PDF into an editable Word document.', linkText: 'Use tool' },
      'jpg-to-pdf': { name: 'JPG to PDF', desc: 'Turn image files into a clean PDF document.', linkText: 'Use tool' },
      'edit-pdf': { name: 'Edit PDF', desc: 'Add text, shapes and annotations to PDF pages.', linkText: 'Use tool' },
      'sign-pdf': { name: 'Sign PDF', desc: 'Add a signature to a PDF document online.', linkText: 'Use tool' },
      'protect-pdf': { name: 'Protect PDF', desc: 'Add password protection to a PDF file.', linkText: 'Use tool' },
      'pdf-metadata-remover': { name: 'PDF Metadata Remover', desc: 'Inspect and clear common PDF document properties.', linkText: 'Use tool' },
      'compare-pdf': { name: 'Compare PDF', desc: 'View two PDFs side by side in the browser.', linkText: 'Use tool' },
      'crop-pdf': { name: 'Crop PDF', desc: 'Trim margins and adjust visible PDF boundaries.', linkText: 'Use tool' },
      'add-page-numbers': { name: 'Add Page Numbers', desc: 'Insert sequential numbers with custom positioning.', linkText: 'Use tool' },
      'add-watermark': { name: 'Add Watermark', desc: 'Overlay text or logo watermarks across PDF pages.', linkText: 'Use tool' },
      'unlock-pdf': { name: 'Unlock PDF', desc: 'Remove passwords and permissions from unlocked files.', linkText: 'Use tool' },
      'ocr-pdf': { name: 'OCR PDF', desc: 'Extract searchable text from scanned PDF documents.', linkText: 'Use tool' },
      'html-to-pdf': { name: 'HTML to PDF', desc: 'Convert web pages and HTML documents into clean PDFs.', linkText: 'Use tool' },
      'scan-to-pdf': { name: 'Scan to PDF', desc: 'Capture document scans from your camera into PDF format.', linkText: 'Use tool' },
      'redact-pdf': { name: 'Blackout & Redact PDF', desc: 'Permanently black out sensitive text and data from PDFs.', linkText: 'Use tool' },
      'remove-pdf-pages': { name: 'Remove Pages', desc: 'Delete unwanted pages from any PDF document.', linkText: 'Use tool' },
      'optimize-pdf': { name: 'Optimize PDF', desc: 'Streamline PDF structure for fast web viewing.', linkText: 'Use tool' },
      'pdf-forms': { name: 'Fill PDF Forms', desc: 'Complete interactive form fields and save filled documents.', linkText: 'Use tool' },
      'pdf-security': { name: 'PDF Security', desc: 'Inspect encryption, permissions, and security settings.', linkText: 'Use tool' }
    }
  },
  es: {
    lang: 'es',
    filePath: 'es/pdf-tools/index.html',
    canonical: 'https://anyconverter.io/es/pdf-tools/',
    title: 'Herramientas PDF Online | Unir y Editar | AnyConverter',
    metaDesc: 'Herramientas PDF online gratis para unir, dividir, comprimir, editar y firmar documentos en tu navegador. Máxima privacidad, sin instalación y al instante.',
    ogTitle: 'Herramientas PDF Online | Unir y Editar | AnyConverter',
    ogDesc: 'Herramientas PDF online gratis para unir, dividir, comprimir, editar y firmar documentos en tu navegador. Máxima privacidad, sin instalación y al instante.',
    twitterTitle: 'Herramientas PDF Online | Unir y Editar | AnyConverter',
    twitterDesc: 'Herramientas PDF online gratis para unir, dividir, comprimir, editar y firmar documentos en tu navegador. Máxima privacidad, sin instalación y al instante.',
    breadcrumb: {
      homeName: 'Inicio',
      homeUrl: '/es/',
      hubName: 'Herramientas PDF',
      hubUrl: '/es/pdf-tools/',
      ariaLabel: 'Miga de pan'
    },
    hero: {
      h1: 'Herramientas PDF Online Gratis',
      desc: 'Trabaja con documentos PDF directamente en tu navegador con total privacidad. Une, divide, comprime, rota, organiza, edita, firma, protege y convierte PDFs al instante sin instalar programas en tu equipo.'
    },
    subsections: [
      {
        title: 'Organizar y Administrar Páginas',
        desc: 'La gestión eficiente de documentos PDF extensos requiere ajustes estructurales precisos antes de compartirlos, imprimirlos o archivarlos en el trabajo diario. Al recopilar contratos, informes financieros o expedientes procedentes de múltiples fuentes, comienza utilizando Unir PDF para integrar diferentes archivos en un único documento continuo con el orden deseado. Cuando trabajas con expedientes voluminosos que contienen información irrelevante, Dividir PDF y Eliminar Páginas te permiten aislar secciones esenciales y suprimir hojas en blanco o duplicadas con total exactitud. Si has recibido documentos escaneados con orientación incorrecta, Rotar PDF corrige la posición de páginas individuales o de todo el archivo de forma permanente sin perder nitidez. Para preparar presentaciones ejecutivas o trámites oficiales, Organizar PDF ofrece una cuadrícula visual intuitiva para reordenar páginas arrastrando y soltando elementos, mientras que Extraer Páginas genera nuevos archivos independientes a partir de hojas seleccionadas. Dado que todas las operaciones se procesan directamente en tu navegador web mediante tecnologías seguras, tus documentos confidenciales nunca viajan a servidores externos ni colas remotas, garantizando máxima velocidad y privacidad absoluta.'
      },
      {
        title: 'Compresión y Optimización',
        desc: 'Los archivos PDF de gran tamaño suelen generar bloqueos habituales al enviarse por correo electrónico, cargarse en portales de empleo o subirse a plataformas de gestión documental. Nuestras herramientas de compresión y optimización eliminan restricciones de ancho de banda al depurar descriptores tipográficos redundantes, flujos de objetos huérfanos y metadatos innecesarios, reescalando además imágenes pesadas a resoluciones ideales para pantalla o impresión. Utiliza Comprimir PDF cuando tu objetivo principal sea reducir drásticamente el tamaño en megabytes para superar límites estrictos de envío sin comprometer la legibilidad tipográfica ni la claridad de gráficos vectoriales. Si vas a publicar folletos técnicos, memorias anuales o libros electrónicos en internet, emplea Optimizar PDF para reestructurar y linearizar la jerarquía interna de objetos, permitiendo una apertura web ultrarrápida. Al ejecutarse todos los procesos de compresión directamente en la memoria de tu navegador, ahorras tiempos de espera en transferencias remotas y proteges información comercial confidencial frente a riesgos derivados del almacenamiento en la nube.'
      },
      {
        title: 'Conversión y Formato',
        desc: 'Los flujos de trabajo profesionales exigen a menudo una interoperabilidad fluida entre formatos PDF, documentos de oficina editables y archivos de imagen optimizados para la web. Nuestra gama de conversión resuelve transformaciones bidireccionales con fidelidad absoluta y sin depender de programas de escritorio. Cuando requieras modificar contratos cerrados o extractos escaneados, PDF a Word reconstruye párrafos, tablas y encabezados en documentos DOCX totalmente editables. De forma complementaria, JPG a PDF y Escanear a PDF permiten convertir capturas móviles, facturas y recibos en documentos PDF estandarizados con márgenes y orientación adaptados a tus necesidades. Para extraer ilustraciones clave o compartir fragmentos en canales digitales sin obligar a descargar visores PDF, PDF a JPG genera imágenes nítidas de alta resolución de cada página. Asimismo, redactores técnicos y programadores pueden emplear HTML a PDF para transformar páginas web y facturas dinámicas en archivos portátiles. Todo el procesamiento se realiza localmente en tu equipo, garantizando rapidez y absoluta reserva de datos.'
      },
      {
        title: 'Seguridad y Privacidad',
        desc: 'Garantizar la protección de información comercial reservada, datos personales de clientes y documentos corporativos sensibles resulta imprescindible en entornos profesionales modernos. Nuestras herramientas de seguridad en el navegador proporcionan control exhaustivo sobre accesos, permisos y rastros digitales ocultos sin exponer tus archivos a servidores de terceros. Utiliza Proteger PDF para aplicar cifrado robusto mediante contraseña y restringir la impresión o copia no autorizada antes de remitir contratos clave. Cuando dispongas de las credenciales de un archivo protegido y desees eliminar restricciones para facilitar su archivado o colaboración interna, Desbloquear PDF retira las barreras con total seguridad. Para trámites judiciales, expedientes médicos o auditorías, Tachar y Ocultar PDF permite una supresión visual e irreversible de datos fiscales, nombres y cifras confidenciales en capas vectoriales. Asimismo, Eliminar Metadatos PDF purga información invisible como autoría, versión de software, fechas y geolocalización, mientras que Seguridad PDF audita los certificados existentes, manteniéndose todo bajo tu control local.'
      },
      {
        title: 'Edición, Firma y Utilidades',
        desc: 'La preparación final de documentos profesionales exige herramientas ágiles de edición, marcado y verificación para garantizar su validez antes de la firma o publicación oficial. En lugar de recurrir a costosos programas de escritorio, nuestras utilidades web permiten aplicar modificaciones cotidianas en cuestión de segundos. Utiliza Editar PDF para incorporar notas de texto, resaltar pasajes clave, trazar figuras o insertar comentarios aclaratorios sobre páginas existentes. Cuando necesites formalizar acuerdos comerciales, convenios laborales o declaraciones tributarias, Firmar PDF te permite dibujar, escribir o cargar tu firma manuscrita digital sobre las casillas correspondientes sin necesidad de imprimir papel. Asimismo, Rellenar Formularios PDF agiliza la cumplimentación de campos interactivos oficiales. Para homologar expedientes extensos, Numerar Páginas añade foliado correlativo personalizado y Marca de Agua PDF estampa avisos de confidencialidad o logotipos corporativos. Para comparar distintas versiones de un mismo proyecto, Comparar PDF resalta discrepancias visuales, mientras que OCR PDF digitaliza textos escaneados y Recortar PDF ajusta márgenes.'
      }
    ],
    faqsHeading: 'Preguntas Frecuentes',
    faqs: [
      {
        q: '¿Estas herramientas de PDF son totalmente gratuitas y sin límites?',
        a: 'Sí, todas las herramientas de PDF en AnyConverter son 100% gratuitas, sin costes ocultos, sin necesidad de crear una cuenta y sin límites artificiales de páginas o conversiones diarias. Puedes unir, dividir, comprimir, editar y firmar documentos en tu navegador las veces que lo necesites.'
      },
      {
        q: '¿Mis documentos e información confidencial permanecen seguros y privados?',
        a: 'Sí, tu privacidad está estrictamente protegida. A diferencia de los servicios convencionales en la nube que suben tus archivos a servidores remotos, nuestras herramientas procesan los documentos directamente en tu navegador mediante JavaScript local. Tus documentos y datos privados se procesan localmente en tu equipo sin subirse a servidores de procesamiento de AnyConverter.'
      },
      {
        q: '¿Necesito instalar programas, extensiones de navegador o complementos?',
        a: 'No, no necesitas instalar ningún software de escritorio, extensión de navegador ni complemento adicional. Todas las herramientas funcionan de forma nativa en cualquier navegador web moderno, como Chrome, Firefox, Safari o Edge, tanto en ordenadores como en dispositivos móviles.'
      },
      {
        q: '¿Puedo utilizar estas herramientas de PDF en teléfonos móviles y tabletas?',
        a: 'Sí, todas las herramientas están optimizadas para pantallas táctiles y funcionan a la perfección en dispositivos iOS y Android. Puedes escanear documentos con la cámara de tu teléfono móvil, rellenar formularios o firmar contratos directamente con tu dedo o lápiz táctil.'
      },
      {
        q: '¿En qué se diferencia el procesamiento local en el navegador de los servicios en la nube?',
        a: 'Los convertidores en la nube convencionales obligan a transferir tu archivo PDF completo a un servidor externo sujeto a colas de espera y riesgos de privacidad. El procesamiento local ejecuta las modificaciones directamente en el procesador de tu equipo, ofreciendo resultados instantáneos sin transmitir datos por la red.'
      }
    ],
    tools: {
      'pdf-merge': { name: 'Unir PDF', desc: 'Combina múltiples archivos PDF en un solo documento.', linkText: 'Usar herramienta' },
      'pdf-split': { name: 'Dividir PDF', desc: 'Extrae páginas o separa un PDF en varios archivos.', linkText: 'Usar herramienta' },
      'pdf-compress': { name: 'Comprimir PDF', desc: 'Reduce el tamaño del archivo PDF manteniendo la calidad.', linkText: 'Usar herramienta' },
      'rotate-pdf': { name: 'Rotar PDF', desc: 'Gira páginas individuales o todo el documento PDF.', linkText: 'Usar herramienta' },
      'organize-pdf': { name: 'Organizar PDF', desc: 'Reordena, elimina y organiza páginas visualmente.', linkText: 'Usar herramienta' },
      'extract-pdf-pages': { name: 'Extraer Páginas', desc: 'Guarda páginas seleccionadas en un nuevo archivo.', linkText: 'Usar herramienta' },
      'pdf-to-jpg': { name: 'PDF a JPG', desc: 'Convierte páginas PDF a imágenes JPG de alta calidad.', linkText: 'Usar herramienta' },
      'pdf-to-word': { name: 'PDF a Word', desc: 'Transforma documentos PDF en archivos Word editables.', linkText: 'Usar herramienta' },
      'jpg-to-pdf': { name: 'JPG a PDF', desc: 'Convierte imágenes a un documento PDF organizado.', linkText: 'Usar herramienta' },
      'edit-pdf': { name: 'Editar PDF', desc: 'Agrega texto, formas y anotaciones a páginas PDF.', linkText: 'Usar herramienta' },
      'sign-pdf': { name: 'Firmar PDF', desc: 'Agrega tu firma manuscrita a documentos PDF.', linkText: 'Usar herramienta' },
      'protect-pdf': { name: 'Proteger PDF', desc: 'Protege tu archivo PDF con contraseña segura.', linkText: 'Usar herramienta' },
      'pdf-metadata-remover': { name: 'Eliminar Metadatos PDF', desc: 'Inspecciona y limpia propiedades ocultas del documento.', linkText: 'Usar herramienta' },
      'compare-pdf': { name: 'Comparar PDF', desc: 'Compara dos PDFs lado a lado en el navegador.', linkText: 'Usar herramienta' },
      'crop-pdf': { name: 'Recortar PDF', desc: 'Ajusta márgenes y recorta bordes en páginas PDF.', linkText: 'Usar herramienta' },
      'add-page-numbers': { name: 'Numerar Páginas', desc: 'Inserta numeración de páginas con posición personalizada.', linkText: 'Usar herramienta' },
      'add-watermark': { name: 'Marca de Agua PDF', desc: 'Añade texto o imágenes de marca de agua en PDFs.', linkText: 'Usar herramienta' },
      'unlock-pdf': { name: 'Desbloquear PDF', desc: 'Elimina contraseñas y restricciones de tus PDFs.', linkText: 'Usar herramienta' },
      'ocr-pdf': { name: 'OCR PDF', desc: 'Extrae texto editable de documentos PDF escaneados.', linkText: 'Usar herramienta' },
      'html-to-pdf': { name: 'HTML a PDF', desc: 'Convierte páginas web y código HTML a PDF limpio.', linkText: 'Usar herramienta' },
      'scan-to-pdf': { name: 'Escanear a PDF', desc: 'Captura fotos o escaneos y crea un documento PDF.', linkText: 'Usar herramienta' },
      'redact-pdf': { name: 'Tachar y Ocultar PDF', desc: 'Oculta visualmente información privada en PDFs.', linkText: 'Usar herramienta' },
      'remove-pdf-pages': { name: 'Eliminar Páginas PDF', desc: 'Borra páginas innecesarias de cualquier archivo PDF.', linkText: 'Usar herramienta' },
      'optimize-pdf': { name: 'Optimizar PDF', desc: 'Acelera la visualización y limpia estructuras PDF.', linkText: 'Usar herramienta' },
      'pdf-forms': { name: 'Rellenar Formularios PDF', desc: 'Completa campos interactivos en formularios PDF.', linkText: 'Usar herramienta' },
      'pdf-security': { name: 'Seguridad PDF', desc: 'Inspecciona cifrado y permisos de visualización.', linkText: 'Usar herramienta' }
    }
  },
  da: {
    lang: 'da',
    filePath: 'da/pdf-tools/index.html',
    canonical: 'https://anyconverter.io/da/pdf-tools/',
    title: 'Gratis PDF-værktøjer | Flet, Opdel & Rediger | AnyConverter',
    metaDesc: 'Gratis online PDF-værktøjer til at flette, opdele, komprimere, redigere og underskrive dokumenter i browseren. Hurtigt, privat og uden installation.',
    ogTitle: 'Gratis PDF-værktøjer | Flet, Opdel & Rediger | AnyConverter',
    ogDesc: 'Gratis online PDF-værktøjer til at flette, opdele, komprimere, redigere og underskrive dokumenter i browseren. Hurtigt, privat og uden installation.',
    twitterTitle: 'Gratis PDF-værktøjer | Flet, Opdel & Rediger | AnyConverter',
    twitterDesc: 'Gratis online PDF-værktøjer til at flette, opdele, komprimere, redigere og underskrive dokumenter i browseren. Hurtigt, privat og uden installation.',
    breadcrumb: {
      homeName: 'Hjem',
      homeUrl: '/da/',
      hubName: 'PDF-værktøjer',
      hubUrl: '/da/pdf-tools/',
      ariaLabel: 'Brødkrumme'
    },
    hero: {
      h1: 'Gratis Online PDF-værktøjer',
      desc: 'Behandl PDF-dokumenter direkte i browseren med fuld datasikkerhed. Flet, opdel, komprimer, organiser, konverter, rediger, underskriv og beskyt dine PDF-filer øjeblikkeligt uden installation af programmer.'
    },
    subsections: [
      {
        title: 'Organiser og Håndter Sider',
        desc: 'Effektiv administration af flersidede PDF-dokumenter kræver præcise strukturændringer, før filer deles, arkiveres eller udskrives i det daglige arbejde. Når du samler kontrakter, rapporter eller projektbilag fra forskellige kilder, er Flet PDF det ideelle udgangspunkt til at kombinere separate kapitler til ét samlet, velstruktureret dokument. Hvis du modtager store dokumentsamlinger med overflødigt indhold, giver Opdel PDF og Fjern PDF-sider dig mulighed for at isolere relevante afsnit og slette tomme eller uvedkommende sider med millimeterpræcision. Hvis indscannede dokumenter vender forkert, retter Rotér PDF sideorienteringen permanent for enkelte sider eller hele dokumentet uden forringelse af tekstkvaliteten. Til officielle rapporter, præsentationer eller administrative ansøgninger tilbyder Organiser PDF et visuelt overblik, hvor du frit kan omarrangere sider via træk-og-slip, mens Udtræk Sider lader dig eksportere udvalgte enkeltsider til nye, selvstændige PDF-filer. Eftersom al sidebehandling foregår lokalt i din webbrowser via moderne klientsideteknologi, sendes dine fortrolige data og personoplysninger aldrig til eksterne servere eller ventelister i skyen, hvilket sikrer lynhurtig eksekvering og fuld databeskyttelse i overensstemmelse med strenge privatlivsstandarder.'
      },
      {
        title: 'Komprimering og Optimering',
        desc: 'Overdimensionerede PDF-filer skaber ofte frustrerende barrierer ved e-mailforsendelse, upload til offentlige ansøgningsportaler eller arkivering i administrative systemer. Vores dedikerede værktøjer til komprimering og optimering fjerner unødvendigt pladsforbrug ved at rydde op i overflødige skrifttypeindlejringer, ubrugte datastrømme og skjulte metadata, samtidig med at tunge billeder optimeres til skærm eller tryk. Vælg Komprimer PDF, når dit primære formål er at reducere filstørrelsen markant, så dokumentet holder sig under strenge grænser for e-mailvedhæftninger som 10 MB eller 25 MB uden tab af læsbarhed eller skarphed i illustrationer og skrifttyper. Når du forbereder tekniske manualer, omfattende årsrapporter eller e-bøger til distribution på nettet, hjælper Optimer PDF med at linearisere dokumentstrukturen til hurtig onlinevisning og strømlinet sideindlæsning i browseren. Da alle optimeringsberegninger udføres direkte i din lokale browsers hukommelse uden eksterne afhængigheder, slipper du for langsomme serveroverførsler og undgår enhver risiko for, at fortrolige forretningsdokumenter, regnskabstal eller kundeoplysninger gemmes hos tredjepartsudbydere i skyen. Dette giver maksimal ydeevne og ro i sindet under hele processen.'
      },
      {
        title: 'Konvertering og Formatering',
        desc: 'Moderne arbejdsgange stiller ofte krav om ubesværet skift mellem PDF-filer, redigerbare kontordokumenter og webvenlige billedformater. Vores alsidige konverteringsværktøjer håndterer tovejskonverteringer med høj typografisk præcision helt uden krav om ekstern softwareinstallation på din maskine. Når du har behov for at revidere eksisterende aftaler eller rapporter, genskaber PDF til Word afsnit, tabeller og overskrifter i et rent DOCX-format, der er klar til øjeblikkelig redigering i tekstbehandlingsprogrammer. Omvendt lader JPG til PDF og Scan til PDF dig omdanne kvitteringer, fotos og dokumentscanninger fra mobilen eller skrivebordet til standardiserede PDF-filer med skræddersyede sidemargener og retninger. Til brug i visuelle præsentationer eller på hjemmesider, hvor modtageren ikke har en PDF-fremviser, udtrækker PDF til JPG skarpe billeder i høj opløsning fra individuelle sider. Endelig giver HTML til PDF udviklere og indholdsskabere mulighed for at omdanne websider, fakturaer og dokumentationssider direkte til printklare dokumenter. Al gengivelse og formatering sker direkte i din browser med maksimal hastighed og kompromisløs datasikkerhed, så dine data altid forbliver beskyttet lokalt.'
      },
      {
        title: 'Sikkerhed og Privatliv',
        desc: 'Beskyttelse af fortrolige forretningsoplysninger, persondata og juridiske dokumenter er afgørende i ethvert digitalt arbejdsmiljø. Vores browsersikkerhedsværktøjer giver dig fuld kontrol over adgangstilladelser, kryptering og skjulte digitale spor uden at udsætte følsomme filer for eksterne cloudservere. Anvend Beskyt PDF til at tilføje stærk adgangskodekryptering og begrænse uautoriseret udskrivning, kopiering eller ændring af vigtige kontrakter og aftaler før afsendelse til eksterne parter. Hvis du lovligt ejer adgangskoden til et låst dokument og ønsker at fjerne begrænsningerne for at lette samarbejde eller langsigtet arkivering, fjerner Lås PDF Op adgangsspærren hurtigt og sikkert. Til juridiske sager, personaleoplysninger eller helbredsdata gør Blackout & Redaktér PDF det muligt at slette personnumre, adresser og finansielle oplysninger permanent og irreversibelt fra dokumentlagene. Desuden fjerner Fjern PDF-metadata skjulte oplysninger om forfatter, programversioner, oprettelsestidspunkter og GPS-data, mens PDF-sikkerhed analyserer det aktuelle krypteringsniveau. Al behandling forbliver fuldstændig lokal på din computer med uovertruffen fortrolighed og tryghed, uden at en eneste byte uploades til eksterne systemer.'
      },
      {
        title: 'Redigering, Underskrift og Værktøjer',
        desc: 'Færdiggørelse af officielle dokumenter kræver alsidige redigerings-, underskrifts- og korrekturlæsningsværktøjer for at sikre professionel kvalitet før endelig deling eller arkivering. I stedet for tunge og dyre skrivebordsprogrammer leverer vores browserbaserede værktøjer alle nødvendige funktioner direkte på skærmen på få sekunder. Brug Rediger PDF til at tilføje tekstfelter, fremhæve nøgleafsnit, indsætte bemærkninger og tegne figurer direkte på dokumentsiderne. Når kontrakter, lejeaftaler eller administrative formularer skal godkendes formelt, giver Underskriv PDF dig mulighed for at tegne, skrive eller uploade din personlige underskrift direkte i dokumentet helt uden udskrivning på papir. Udfyld PDF-formularer håndterer interaktive formularfelter problemfrit til officielle formål. For at overholde dokumentstandarder indsætter Tilføj Sidetal overskuelig paginering, mens Tilføj Vandmærke placerer diskrete sikkerhedsmærker eller firmalogoer på alle sider. Sammenlign PDF gør det let at spotte tekstforskelle mellem to versioner side om side, mens OCR PDF udtrækker søgbar tekst fra scanninger, og Beskær PDF fjerner unødige margener præcist. Hele arbejdsgangen udføres lynhurtigt i browseren med komplet kontrol over dine dokumenter.'
      }
    ],
    faqsHeading: 'Ofte Stillede Spørgsmål',
    faqs: [
      {
        q: 'Er disse PDF-værktøjer helt gratis at bruge uden begrænsninger?',
        a: 'Ja, alle PDF-værktøjer på AnyConverter er 100% gratis uden skjulte betalingsmure, krav om brugerregistrering eller kunstige daglige begrænsninger på sideantal. Du kan frit flette, opdele, komprimere, redigere, konvertere og underskrive dokumenter direkte i browseren efter behov.'
      },
      {
        q: 'Bliver mine dokumenter og personlige data holdt private og sikre?',
        a: 'Ja, dit privatliv er strengt beskyttet. I modsætning til traditionelle cloud-tjenester, som uploader filer til eksterne servere, behandler vores værktøjer dine filer lokalt i browseren ved hjælp af klientside-JavaScript. Dine dokumenter og personlige data behandles udelukkende lokalt i din browser uden upload til AnyConverters behandlingsservere.'
      },
      {
        q: 'Skal jeg installere software, browserudvidelser eller plugins?',
        a: 'Nej, du behøver ikke installere software, udvidelser eller eksterne plugins. Alle værktøjer kører direkte i enhver moderne webbrowser som Chrome, Firefox, Safari og Edge på tværs af computere, tablets og smartphones uden besvær.'
      },
      {
        q: 'Kan jeg bruge disse PDF-værktøjer på mobiltelefoner og tablets?',
        a: 'Ja, alle PDF-værktøjerne er fuldt responsive og fungerer gnidningsfrit på iOS- og Android-enheder. Du kan nemt scanne dokumenter via dit mobilkamera, udfylde formularer eller underskrive kontrakter direkte på berøringsskærmen med fingeren eller en digital pen.'
      },
      {
        q: 'Hvordan adskiller lokal browserbehandling sig fra traditionelle cloud-tjenester?',
        a: 'Traditionelle konverteringstjenester kræver, at hele PDF-filen overføres til en ekstern server i en behandlingskø, hvilket skaber ventetid og sikkerhedsrisici. Lokal klientsidebehandling udfører alle beregninger direkte via computerens processor, hvilket giver øjeblikkelige resultater helt uden netværkstransmission.'
      }
    ],
    tools: {
      'pdf-merge': { name: 'Flet PDF', desc: 'Kombiner flere PDF-filer til ét samlet dokument.', linkText: 'Brug værktøj' },
      'pdf-split': { name: 'Opdel PDF', desc: 'Udtræk sider eller del et PDF-dokument op.', linkText: 'Brug værktøj' },
      'pdf-compress': { name: 'Komprimer PDF', desc: 'Reducer PDF-filstørrelse for hurtig deling.', linkText: 'Brug værktøj' },
      'rotate-pdf': { name: 'Rotér PDF', desc: 'Rotér sider og download den rettede PDF-fil.', linkText: 'Brug værktøj' },
      'organize-pdf': { name: 'Organiser PDF', desc: 'Omarranger, slet og organiser PDF-sider visuelt.', linkText: 'Brug værktøj' },
      'extract-pdf-pages': { name: 'Udtræk Sider', desc: 'Gem udvalgte sider som et nyt PDF-dokument.', linkText: 'Brug værktøj' },
      'pdf-to-jpg': { name: 'PDF til JPG', desc: 'Konverter PDF-sider til skarpe JPG-billeder.', linkText: 'Brug værktøj' },
      'pdf-to-word': { name: 'PDF til Word', desc: 'Gør et PDF-dokument til en redigerbar Word-fil.', linkText: 'Brug værktøj' },
      'jpg-to-pdf': { name: 'JPG til PDF', desc: 'Gør billedfiler til et rent PDF-dokument.', linkText: 'Brug værktøj' },
      'edit-pdf': { name: 'Rediger PDF', desc: 'Tilføj tekst, figurer og noter til PDF-sider.', linkText: 'Brug værktøj' },
      'sign-pdf': { name: 'Underskriv PDF', desc: 'Tilføj en digital håndskreven underskrift på PDF.', linkText: 'Brug værktøj' },
      'protect-pdf': { name: 'Beskyt PDF', desc: 'Tilføj adgangskodebeskyttelse til en PDF-fil.', linkText: 'Brug værktøj' },
      'pdf-metadata-remover': { name: 'Fjern PDF-metadata', desc: 'Inspicér og ryd op i skjulte dokumentegenskaber.', linkText: 'Brug værktøj' },
      'compare-pdf': { name: 'Sammenlign PDF', desc: 'Se to PDF-dokumenter side om side i browseren.', linkText: 'Brug værktøj' },
      'crop-pdf': { name: 'Beskær PDF', desc: 'Tilpas margener og beskæringsfelter på sider.', linkText: 'Brug værktøj' },
      'add-page-numbers': { name: 'Tilføj Sidetal', desc: 'Indsæt sidetal med brugerdefineret placering.', linkText: 'Brug værktøj' },
      'add-watermark': { name: 'Tilføj Vandmærke', desc: 'Placer tekst- eller logo-vandmærker på sider.', linkText: 'Brug værktøj' },
      'unlock-pdf': { name: 'Lås PDF Op', desc: 'Fjern adgangskoder og begrænsninger fra filer.', linkText: 'Brug værktøj' },
      'ocr-pdf': { name: 'OCR PDF', desc: 'Udtræk søgbar tekst fra scannede PDF-filer.', linkText: 'Brug værktøj' },
      'html-to-pdf': { name: 'HTML til PDF', desc: 'Konverter websider og HTML-kode til pæn PDF.', linkText: 'Brug værktøj' },
      'scan-to-pdf': { name: 'Scan til PDF', desc: 'Optag dokumentscanninger fra kamera til PDF.', linkText: 'Brug værktøj' },
      'redact-pdf': { name: 'Blackout & Redaktér PDF', desc: 'Tildæk følsomme oplysninger permanent i PDF.', linkText: 'Brug værktøj' },
      'remove-pdf-pages': { name: 'Fjern PDF-sider', desc: 'Slet uønskede sider fra ethvert PDF-dokument.', linkText: 'Brug værktøj' },
      'optimize-pdf': { name: 'Optimer PDF', desc: 'Strømlin PDF-struktur til hurtig webvisning.', linkText: 'Brug værktøj' },
      'pdf-forms': { name: 'Udfyld PDF-formularer', desc: 'Udfyld interaktive formularfelter og gem.', linkText: 'Brug værktøj' },
      'pdf-security': { name: 'PDF-sikkerhed', desc: 'Inspicér kryptering, tilladelser og indstillinger.', linkText: 'Brug værktøj' }
    }
  }
};

function generateHtml(locKey) {
  const loc = LOCALES[locKey];
  const urlPrefix = locKey === 'en' ? '/' : `/${locKey}/`;

  // Build ItemList array in exact subsection order
  const allToolSlugs = [];
  SUBSECTIONS.forEach(sub => {
    sub.tools.forEach(slug => allToolSlugs.push(slug));
  });

  const itemListElements = allToolSlugs.map((slug, idx) => {
    const t = loc.tools[slug];
    const canonicalToolUrl = `https://anyconverter.io${urlPrefix}${slug}/`;
    return {
      '@type': 'ListItem',
      position: idx + 1,
      name: t.name,
      url: canonicalToolUrl
    };
  });

  // Breadcrumb schema
  const breadcrumbElements = [
    {
      '@type': 'ListItem',
      position: 1,
      name: loc.breadcrumb.homeName,
      item: `https://anyconverter.io${loc.breadcrumb.homeUrl}`
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: loc.breadcrumb.hubName,
      item: loc.canonical
    }
  ];

  // FAQ schema
  const faqElements = loc.faqs.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a
    }
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: loc.title,
        url: loc.canonical,
        description: loc.metaDesc,
        inLanguage: loc.lang,
        publisher: {
          '@type': 'Organization',
          name: 'AnyConverter',
          url: 'https://anyconverter.io'
        },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: allToolSlugs.length,
          itemListElement: itemListElements
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbElements
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqElements
      }
    ]
  };

  // Build subsections HTML
  const subsectionsHtml = SUBSECTIONS.map((sub, sIdx) => {
    const subData = loc.subsections[sIdx];
    const cardsHtml = sub.tools.map(slug => {
      const tool = loc.tools[slug];
      const toolHref = `${urlPrefix}${slug}/`;
      return `        <a href="${toolHref}" class="tool-card"><img src="/assets/img/icon-pdf.svg" alt="${tool.name} icon" class="tool-card-icon" width="40" height="40" loading="lazy"><h3>${tool.name}</h3><p>${tool.desc}</p><span class="tool-card-link">${tool.linkText}</span></a>`;
    }).join('\n');

    return `    <section class="thematic-section" id="${sub.id}">
      <div class="thematic-header">
        <h2>${subData.title}</h2>
        <p class="thematic-desc">${subData.desc}</p>
      </div>
      <div class="tool-grid">
${cardsHtml}
      </div>
    </section>`;
  }).join('\n\n');

  // Build FAQs HTML
  const faqsHtml = loc.faqs.map(faq => {
    return `      <details class="faq-item"><summary class="faq-question">${faq.q} <span class="faq-icon">+</span></summary><div class="faq-answer">${faq.a}</div></details>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="${loc.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${loc.title}</title>
  <meta name="description" content="${loc.metaDesc}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${loc.canonical}">
  <link rel="alternate" hreflang="en" href="https://anyconverter.io/pdf-tools/">
  <link rel="alternate" hreflang="es" href="https://anyconverter.io/es/pdf-tools/">
  <link rel="alternate" hreflang="da" href="https://anyconverter.io/da/pdf-tools/">
  <link rel="alternate" hreflang="x-default" href="https://anyconverter.io/pdf-tools/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${loc.ogTitle}">
  <meta property="og:description" content="${loc.ogDesc}">
  <meta property="og:url" content="${loc.canonical}">
  <meta property="og:site_name" content="AnyConverter">
  <meta property="og:image" content="https://anyconverter.io/assets/img/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${loc.twitterTitle}">
  <meta name="twitter:description" content="${loc.twitterDesc}">
  <meta name="twitter:image" content="https://anyconverter.io/assets/img/og-image.png">
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/css/style.css?v=20261109">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
  <header id="site-header" class="site-header"></header>
  <main id="main-content">
    <nav class="breadcrumb" aria-label="${loc.breadcrumb.ariaLabel}"><ol><li><a href="${loc.breadcrumb.homeUrl}">${loc.breadcrumb.homeName}</a></li><li aria-current="page">${loc.breadcrumb.hubName}</li></ol></nav>
    <section class="hero">
      <h1>${loc.hero.h1}</h1>
      <p class="hero-desc">${loc.hero.desc}</p>
    </section>

${subsectionsHtml}

    <section class="faq">
      <h2>${loc.faqsHeading}</h2>
      <div class="faq-list">
${faqsHtml}
      </div>
    </section>
  </main>
  <footer id="site-footer" class="site-footer"></footer>
  <script src="/assets/js/shared.js?v=20261109" defer></script>
</body>
</html>
`;
}

// Build and write files
for (const locKey of Object.keys(LOCALES)) {
  const loc = LOCALES[locKey];
  const fullPath = path.join(ROOT, loc.filePath);
  const html = generateHtml(locKey);
  fs.writeFileSync(fullPath, html, 'utf8');
  console.log(`Generated ${loc.filePath} (${html.length} bytes)`);
}

console.log('\nAll 3 PDF category hub pages successfully generated!');
