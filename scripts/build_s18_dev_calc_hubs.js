'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const extractedCards = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_cards_s18.json'), 'utf8'));

// ==========================================
// DEVELOPER TOOLS CONFIGURATION
// ==========================================
const DEV_SUBSECTIONS = [
  {
    id: 'data-formatting-validation',
    tools: ['json-formatter', 'json-compare', 'json-to-yaml', 'xml-formatter', 'html-beautifier', 'markdown-html']
  },
  {
    id: 'encoding-cryptography-security',
    tools: ['base64-encoder', 'url-encoder', 'jwt-decoder', 'hash-generator', 'uuid-generator']
  },
  {
    id: 'data-conversion-querying',
    tools: ['csv-to-sql', 'csv-query', 'parquet-to-csv', 'camt053-to-csv']
  },
  {
    id: 'css-web-design-display',
    tools: ['css-gradient-generator', 'css-shadow-generator', 'px-to-rem', 'color-converter', 'screen-resolution']
  },
  {
    id: 'system-auth-parsing',
    tools: ['regex-tester', 'cron-expression-parser', 'timestamp-converter', 'password-generator', 'password-strength-checker', 'ip-address-lookup']
  }
];

const DEV_LOCALES = {
  en: {
    lang: 'en',
    filePath: 'developer-tools/index.html',
    canonical: 'https://anyconverter.io/developer-tools/',
    title: 'Free Online Developer Tools | JSON & Code | AnyConverter',
    metaDesc: 'Free online developer tools for JSON, XML, Base64, cryptography, regex, CSS, and database queries. Fast, client-side, private, and zero installation required.',
    ogTitle: 'Free Online Developer Tools | JSON & Code | AnyConverter',
    ogDesc: 'Free online developer tools for JSON, XML, Base64, cryptography, regex, CSS, and database queries. Fast, client-side, private, and zero installation required.',
    twitterTitle: 'Free Online Developer Tools | JSON & Code | AnyConverter',
    twitterDesc: 'Free online developer tools for JSON, XML, Base64, cryptography, regex, CSS, and database queries. Fast, client-side, private, and zero installation required.',
    breadcrumb: {
      homeName: 'Home',
      homeUrl: '/',
      hubName: 'Developer Tools',
      hubUrl: '/developer-tools/',
      ariaLabel: 'Breadcrumb'
    },
    hero: {
      h1: 'Free Online Developer Tools',
      desc: 'Format, validate, encode, decode, and transform data directly in your browser. Fast, secure client-side utilities for web developers, backend engineers, and DevOps professionals with zero software installation.'
    },
    subsections: [
      {
        title: 'Data Formatting & Validation',
        desc: 'Inspecting, formatting, and validating complex structured data is an essential daily requirement for modern API integration and software engineering. When parsing deeply nested REST or GraphQL responses, deploy JSON Formatter to beautify minified payloads, reveal syntax anomalies, and organize object keys with syntax highlighting. When comparing deployment configurations or debugging unexpected API response mutations between staging and production, JSON Compare isolates precise structural differences side by side. For DevOps workflows transitioning container manifests between microservices, JSON to YAML handles bidirectional schema transformations seamlessly. When maintaining enterprise legacy integrations or SOAP communications, XML Formatter restores indentation and validates tag nesting. Front-end developers can leverage HTML Beautifier to clean up minified DOM markups, while Markdown to HTML generates live web-ready preview renderings. Because all parsing computations run strictly in browser memory, your confidential application payloads, authentication tokens, and user records remain completely private on your local machine.'
      },
      {
        title: 'Encoding, Cryptography & Security',
        desc: 'Web security and data transmission protocols rely continuously on robust encoding standards, token verification routines, and cryptographic hash verification. Use Base64 Encoder to convert binary data assets, image sprites, or authorization headers into clean ASCII representations and decode inbound payloads instantly. When diagnosing malformed redirect paths or query parameter corruption in web requests, URL Encoder applies RFC 3986 percent-encoding to ensure browser transmission safety. Backend developers inspecting OAuth2 or OpenID Connect claims can utilize JWT Decoder to unpack token headers, examine permission payloads, and audit expiration timestamps safely without revealing signing secrets. To verify file download integrity and compare checksum values against upstream vendor releases, Hash Generator computes cryptographic digests across MD5, SHA-1, SHA-256, and SHA-512 algorithms. When provisioning unique primary keys for distributed microservice databases, UUID Generator produces cryptographically random version 4 identifiers with zero risk of collision.'
      },
      {
        title: 'Data Conversion & Querying',
        desc: 'Manipulating tabular datasets and transforming analytical files often requires rapid conversions between spreadsheet records, database schemas, and analytical columnar stores. When seeding relational databases or migrating legacy spreadsheets into production tables, CSV to SQL automatically infers column data types and generates standardized INSERT statements for MySQL, PostgreSQL, SQLite, and SQL Server. For developers needing to interrogate bulky analytical exports without configuring local database instances, CSV Query executes full SQL queries directly over in-memory table structures in your browser. When handling modern cloud analytics workflows and columnar formats, Parquet to CSV decodes compressed Apache Parquet datasets into portable comma-separated text while preserving 64-bit integer precision. Financial engineers and accounting integration teams can deploy CAMT.053 to CSV to transform complex ISO 20022 XML banking statements into reconcilable spreadsheet tables with built-in debit and credit balance verification.'
      },
      {
        title: 'CSS, Web Design & Display',
        desc: 'Crafting responsive user interfaces requires precise control over visual styling properties, scalable typographic scales, and display color definitions. Use CSS Gradient Generator to design multi-stop linear and radial gradient backgrounds with interactive color stops and generate cross-browser CSS code snippets ready for production stylesheets. When designing depth and realistic elevation in design systems, CSS Shadow Generator visualizes layered box-shadow and text-shadow properties with live light-source controls. To maintain accessibility and fluid typography standards across mobile and desktop viewports, PX to REM calculates proportional rem units from custom root font sizes in both directions. Front-end developers converting between design specifications and style rules can utilize Color Converter to translate values between HEX, RGB, HSL, CMYK, and HSB models, while Screen Resolution detects active viewport dimensions, device pixel ratios, and display color depths.'
      },
      {
        title: 'System, Auth & Parsing Utilities',
        desc: 'System maintenance, automated task scheduling, and identity verification depend on specialized parsing engines to eliminate logic errors and security flaws. Deploy Regex Tester to construct and evaluate complex regular expressions against target text with live match highlighting, capture group extraction, and real-time execution feedback. For site reliability engineers setting up scheduled server crons, Cron Expression Parser decodes complex 5-field cron schedules into plain human-readable explanations and projects upcoming execution schedules. When analyzing log files and distributed traces, Timestamp Converter translates between Unix epoch timestamps and human-readable UTC or localized date strings across seconds, milliseconds, and microseconds. To protect sensitive accounts, Password Generator constructs high-entropy credentials with customizable character sets, while Password Strength Checker audits complexity against modern NIST guidelines. For network diagnostics, IP Address Lookup determines geolocation and network routing details.'
      }
    ],
    faqsHeading: 'Frequently Asked Questions',
    faqs: [
      {
        q: 'Are these online developer tools completely free to use without limits?',
        a: 'Yes, all developer tools on AnyConverter are 100% free with no usage caps, premium subscriptions, or mandatory account creation. You can format code, generate hashes, convert datasets, and inspect tokens as frequently as your development workflow requires.'
      },
      {
        q: 'Are my code snippets, API tokens, and confidential data kept secure?',
        a: 'Yes, your proprietary data is strictly protected. All parsing, validation, encoding, and conversion routines execute locally inside your web browser using client-side JavaScript. Your confidential source code, tokens, and payloads are processed in memory without upload to AnyConverter processing servers.'
      },
      {
        q: 'Do any of these developer tools require server-side computation or network APIs?',
        a: 'The vast majority of our developer tools operate 100% client-side within browser memory. Only network-specific utilities, such as IP Address Lookup, query authorized external lookup endpoints to retrieve public routing metadata, which is clearly disclosed on the respective tool page.'
      },
      {
        q: 'Can I use these developer tools offline or install them as a PWA?',
        a: 'Yes, AnyConverter supports Progressive Web App functionality. Once loaded in your browser, core tools can be accessed offline and installed directly onto your desktop or mobile home screen for immediate access during network interruptions.'
      },
      {
        q: 'Which browsers, operating systems, and viewport sizes are supported?',
        a: 'All tools are engineered with modern web standards and run smoothly across all major browsers including Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge on Windows, macOS, Linux, iOS, and Android across desktop, tablet, and mobile displays.'
      }
    ],
    cardsKey: 'dev_en'
  },
  es: {
    lang: 'es',
    filePath: 'es/developer-tools/index.html',
    canonical: 'https://anyconverter.io/es/developer-tools/',
    title: 'Herramientas para Desarrolladores Online | AnyConverter',
    metaDesc: 'Herramientas online para desarrolladores: JSON, XML, Base64, regex, criptografía y CSS en tu navegador. Rápidas, privadas y sin necesidad de instalación.',
    ogTitle: 'Herramientas para Desarrolladores Online | AnyConverter',
    ogDesc: 'Herramientas online para desarrolladores: JSON, XML, Base64, regex, criptografía y CSS en tu navegador. Rápidas, privadas y sin necesidad de instalación.',
    twitterTitle: 'Herramientas para Desarrolladores Online | AnyConverter',
    twitterDesc: 'Herramientas online para desarrolladores: JSON, XML, Base64, regex, criptografía y CSS en tu navegador. Rápidas, privadas y sin necesidad de instalación.',
    breadcrumb: {
      homeName: 'Inicio',
      homeUrl: '/es/',
      hubName: 'Herramientas para Desarrolladores',
      hubUrl: '/es/developer-tools/',
      ariaLabel: 'Miga de pan'
    },
    hero: {
      h1: 'Herramientas Online para Desarrolladores',
      desc: 'Formatea, valida, codifica, descifra y transforma datos directamente en tu navegador con total seguridad. Utilidades locales ultrarrápidas para programadores y administradores de sistemas sin instalar programas.'
    },
    subsections: [
      {
        title: 'Formateo y Validación de Datos',
        desc: 'Inspeccionar, depurar y validar estructuras de datos complejas constituye una tarea imprescindible en el desarrollo web y la integración de servicios API. Cuando interactúes con respuestas voluminosas en arquitecturas REST o GraphQL, recurre a Formateador JSON para embellecer cargas comprimidas, detectar errores sintácticos y ordenar claves jerárquicas con resaltado visual. Si necesitas contrastar ficheros de configuración entre entornos de prueba y producción, Comparar JSON identifica discrepancias estructurales exactas en una vista comparativa simultánea. Para despliegues en contenedores que requieren migrar parámetros entre formatos, Convertidor JSON ↔ YAML automatiza transformaciones bidireccionales con total fidelidad. En sistemas corporativos que gestionan servicios SOAP o esquemas XML antiguos, Formateador XML restaura sangrías y valida etiquetas cerradas. Asimismo, Embellecedor HTML depura código web ofuscado y Markdown a HTML ofrece una previsualización inmediata. Dado que todo el análisis se procesa en tu navegador, tus datos privados permanecen protegidos en tu equipo.'
      },
      {
        title: 'Codificación, Criptografía y Seguridad',
        desc: 'La seguridad de las aplicaciones y la transmisión confiable de datos dependen del uso riguroso de algoritmos criptográficos, estándares de codificación y control de tokens. Utiliza Codificador Base64 para transformar datos binarios, recursos visuales o encabezados de autorización en texto ASCII seguro y decodificar flujos entrantes al instante. Cuando debas diagnosticar redirecciones rotas o errores en variables de consulta web, Codificador URL aplica la codificación porcentual RFC 3986 para garantizar una navegación sin anomalías. Los desarrolladores que auditan credenciales OAuth2 o flujos OpenID Connect pueden emplear Decodificador JWT para inspeccionar encabezados, permisos y fechas de caducidad sin exponer claves privadas de firma. Para comprobar la autenticidad de archivos descargados y validar firmas de distribución oficial, Generador de Hash calcula resúmenes mediante MD5, SHA-1, SHA-256 y SHA-512. Asimismo, Generador de UUID genera identificadores universales versión 4 criptográficamente aleatorios con riesgo nulo de duplicación.'
      },
      {
        title: 'Conversión y Consulta de Datos',
        desc: 'El procesamiento de información tabular y la manipulación de archivos estructurados exige conversiones ágiles entre hojas de cálculo, bases de datos relacionales y almacenes de datos analíticos. Para inicializar esquemas de base de datos o importar registros administrativos a entornos de desarrollo, CSV a SQL detecta automáticamente los tipos de datos de cada columna y genera sentencias INSERT compatibles con MySQL, PostgreSQL, SQLite y SQL Server. Cuando requieras analizar ficheros masivos sin configurar instancias locales, Consultar CSV permite ejecutar sentencias SQL completas directamente sobre los datos cargados en la memoria del navegador. Para proyectos de macrodatos y analítica en la nube, Parquet a CSV convierte registros Apache Parquet a texto delimitado preservando la precisión en números grandes. Además, equipos financieros y contables pueden utilizar CAMT.053 a CSV para transformar extractos bancarios XML bajo el estándar ISO 20022 en tablas organizadas con validación de saldos.'
      },
      {
        title: 'CSS, Diseño Web y Pantalla',
        desc: 'Construir interfaces de usuario modernas y coherentes requiere un control milimétrico sobre propiedades estéticas, escalas tipográficas y modelos de color. Emplea Generador de Degradados CSS para diseñar fondos lineales y radiales con múltiples puntos cromáticos interactivos y copiar el código compatible listo para producción. Cuando busques aportar profundidad visual a componentes dentro de un sistema de diseño, Generador de Sombras CSS te permite ajustar sombras de cajas y textos con control preciso de iluminación y desenfoque. Para asegurar estándares de accesibilidad y tipografía adaptable en cualquier dispositivo, PX a REM calcula equivalencias proporcionales a partir del tamaño base configurado en ambas direcciones. Quienes convierten especificaciones visuales en código pueden utilizar Convertidor de Color para trasladar valores entre HEX, RGB, HSL, CMYK y HSB, mientras que Resolución de Pantalla detecta dimensiones de ventana y proporción de píxeles.'
      },
      {
        title: 'Utilidades de Sistema, Autenticación y Texto',
        desc: 'El mantenimiento de servidores, la programación de procesos automáticos y la validación de identidades requieren herramientas especializadas para prevenir errores lógicos y brechas de seguridad. Utiliza Probador de Regex para diseñar expresiones regulares complejas con comprobación en tiempo real y captura de grupos resaltados. Los ingenieros de sistemas que planifican tareas programadas en servidores pueden recurrir a Analizador de Expresiones Cron para interpretar líneas de comando cron en lenguaje comprensible y verificar próximas ejecuciones programadas. Al revisar registros de auditoría y eventos distribuidos, Convertidor de Marcas de Tiempo traduce marcas Unix a formatos legibles locales o UTC en segundos y milisegundos. Para reforzar la protección de accesos, Generador de Contraseñas crea credenciales robustas y Verificador de Seguridad evalúa la entropía frente a directrices modernas, mientras que Búsqueda de IP consulta rutas y geolocalización de red.'
      }
    ],
    faqsHeading: 'Preguntas Frecuentes',
    faqs: [
      {
        q: '¿Estas herramientas para desarrolladores son completamente gratuitas y sin límites?',
        a: 'Sí, todas las utilidades para desarrolladores en AnyConverter son 100% gratuitas, sin cuotas de suscripción, límites de uso diario ni requisitos de registro. Puedes procesar código, generar contraseñas y consultar datos tantas veces como tu trabajo lo requiera.'
      },
      {
        q: '¿Mi código fuente, tokens de API e información confidencial están seguros?',
        a: 'Sí, tu privacidad está rigurosamente protegida. Todas las funciones de análisis, validación, codificación y conversión se ejecutan localmente en tu navegador mediante JavaScript. Tus datos se procesan en memoria sin subirse a servidores de procesamiento de AnyConverter.'
      },
      {
        q: '¿Alguna de estas herramientas requiere procesamiento en servidor o peticiones externas?',
        a: 'La inmensa mayoría de nuestras herramientas opera exclusivamente en el cliente dentro de tu equipo. Solo utilidades de red indispensables, como la búsqueda de dirección IP, consultan puntos de acceso autorizados para obtener datos de enrutamiento público, lo cual se detalla explícitamente en su página.'
      },
      {
        q: '¿Puedo utilizar estas herramientas sin conexión o instalarlas como una aplicación PWA?',
        a: 'Sí, AnyConverter es compatible con la tecnología Progressive Web App. Una vez cargada la página, puedes instalar la aplicación en el escritorio de tu ordenador o teléfono móvil para seguir utilizando las herramientas clave incluso sin conexión a internet.'
      },
      {
        q: '¿Qué navegadores, sistemas operativos y tamaños de pantalla son compatibles?',
        a: 'Nuestras utilidades cumplen con los estándares web modernos y funcionan a la perfección en Google Chrome, Mozilla Firefox, Apple Safari y Microsoft Edge sobre Windows, macOS, Linux, iOS y Android, adaptándose a ordenadores, tabletas y teléfonos móviles.'
      }
    ],
    cardsKey: 'dev_es'
  },
  da: {
    lang: 'da',
    filePath: 'da/developer-tools/index.html',
    canonical: 'https://anyconverter.io/da/developer-tools/',
    title: 'Gratis Online Udviklerværktøjer | Web & Kode | AnyConverter',
    metaDesc: 'Gratis online udviklerværktøjer til JSON, XML, Base64, regex, CSS og dataformatering direkte i browseren. Hurtigt, privat og helt uden installation.',
    ogTitle: 'Gratis Online Udviklerværktøjer | Web & Kode | AnyConverter',
    ogDesc: 'Gratis online udviklerværktøjer til JSON, XML, Base64, regex, CSS og dataformatering direkte i browseren. Hurtigt, privat og helt uden installation.',
    twitterTitle: 'Gratis Online Udviklerværktøjer | Web & Kode | AnyConverter',
    twitterDesc: 'Gratis online udviklerværktøjer til JSON, XML, Base64, regex, CSS og dataformatering direkte i browseren. Hurtigt, privat og helt uden installation.',
    breadcrumb: {
      homeName: 'Hjem',
      homeUrl: '/da/',
      hubName: 'Udviklerværktøjer',
      hubUrl: '/da/developer-tools/',
      ariaLabel: 'Brødkrumme'
    },
    hero: {
      h1: 'Gratis Online Udviklerværktøjer',
      desc: 'Formater, valider, kodér, afkod og transformer data direkte i din browser med maksimal datasikkerhed. Hurtige og pålidelige klientsideværktøjer til udviklere og systemadministratorer helt uden softwareinstallation.'
    },
    subsections: [
      {
        title: 'Dataformatering og Validering',
        desc: 'Undersøgelse, formatering og syntaksvalidering af komplekse datastrukturer er en uundværlig del af hverdagen for enhver softwareudvikler og webintegrator. Når du arbejder med dybe svar fra moderne REST- eller GraphQL-tjenester, hjælper JSON-formatering med at forskønne komprimerede data, finde syntaksfejl og strukturere objekttræer med farvekodning. Hvis du skal sammenligne konfigurationsfiler mellem testmiljøer og produktionsservere, fremhæver JSON-sammenligning nøjagtige tekstmæssige og strukturelle forskelle side om side. Til cloud- og containerarkitekturer, hvor parametre skal flyttes mellem formater, håndterer JSON ↔ YAML-konvertering tovejskonverteringer fejlfrit. Ved ældre virksomhedsintegrationer baseret på SOAP eller XML-standarder genopretter XML-formatering korrekt indrykning og validerer tags. Derudover rydder HTML-forskønner op i uoverskuelig webkode, mens Markdown til HTML leverer en hurtig forhåndsvisning. Da alle beregninger foregår lokalt i din browser, forbliver dine kildekoder beskyttet på din egen computer.'
      },
      {
        title: 'Indkodning, Kryptografi og Sikkerhed',
        desc: 'Websikkerhed og pålidelig datakommunikation bygger på stærke standarder for tekstindkodning, tokenvalidering og kryptografiske kontrolsummer. Brug Base64-indkodning til at omdanne binære filer, ikoner og autorisationsstrenge til ren ASCII-tekst samt afkode modtagne data øjeblikkeligt. Hvis du fejlfinder på brudte omdirigeringer eller parametre i webadresser, sikrer URL-indkodning korrekt RFC 3986-procentindkodning for problemfri netværkstransmission. Udviklere, der auditerer OAuth2- eller OpenID Connect-forløb, kan benytte JWT-afkodning til at undersøge claims, rettigheder og udløbstidspunkter uden at afsløre hemmelige signeringsnøgler. Til kontrol af filintegritet og downloadbekræftelse beregner Hash-generator lynhurtige kontrolsummer med MD5, SHA-1, SHA-256 og SHA-512. Når der skal oprettes unikke nøgler i distribuerede databaser, danner UUID-generator kryptografisk tilfældige version 4-identifikatorer med minimal risiko for dubletter.'
      },
      {
        title: 'Datakonvertering og Forespørgsler',
        desc: 'Håndtering af tabellariske datasæt og transformation af analytiske eksportfiler kræver hurtige arbejdsgange mellem regneark, relationsdatabaser og kolonnebaserede dataformater. Når databaser skal udfyldes med testdata, opdager CSV til SQL automatisk datatyper for hver kolonne og fremstiller gyldige INSERT-sætninger til MySQL, PostgreSQL, SQLite og SQL Server. For udviklere, som har behov for at granske store datafiler uden at installere lokale databaser, gør CSV-forespørgsel det muligt at køre komplette SQL-forespørgsler direkte i browserens hukommelse. Til moderne cloudanalyse konverterer Parquet til CSV komprimerede Apache Parquet-filer til overskuelig kommasepareret tekst med bevaret talpræcision. Desuden kan økonomiafdelinger og systemintegratorer anvende CAMT.053 til CSV til at omdanne komplekse ISO 20022 XML-bankudtog til læsbare regneark med automatisk kontrol af debet- og kreditsaldi.'
      },
      {
        title: 'CSS, Webdesign og Skærmegenskaber',
        desc: 'Opbygning af moderne og brugervenlige brugergrænseflader kræver absolut kontrol over visuelle stilelementer, skalerbar typografi og farverum. Benyt CSS-gradientgenerator til at designe lineære og radiale baggrundsgradienter med flere farvestop og kopiere ren produktionsklar CSS direkte til dit stylesheet. Når du ønsker at give komponenter i dit designsystem en naturlig dybde og visuel højde, tilbyder CSS-skyggegenerator præcis styring af skyggevinkler, sløring og gennemsigtighed. For at overholde tilgængelighedsstandarder og sikre responsiv typografi på tværs af skærmstørrelser omregner PX til REM værdier i begge retninger baseret på din valgte grundstørrelse. Front-end-udviklere kan desuden benytte Farvekonvertering til at veksle frit mellem HEX, RGB, HSL, CMYK og HSB, mens Skærmopløsning registrerer browserens viewport og pixelforhold.'
      },
      {
        title: 'System-, Godkendelses- og Tekstværktøjer',
        desc: 'Serverdrift, automatisering af faste rutiner og sikker adgangskontrol stiller store krav til præcise værktøjer for at udelukke logiske fejl og sikkerhedshuller. Anvend Regex-tester til at opbygge og afprøve regulære udtryk med direkte fremhævning af matchgrupper og øjeblikkelig tilbagemelding. Driftsfolk, som opsætter automatiske cron-jobs på servere, kan bruge Cron-udtryksfortolker til at oversætte 5-felters cron-syntaks til letforståeligt sprog og forudsige fremtidige kørselstidspunkter. Ved analyse af logbøger og tidsstemplede hændelser omregner Tidsstempelkonvertering mellem Unix-tidsstempler og læsbare datoer i UTC eller lokal tid. For at beskytte vigtige brugerkonti danner Adgangskodegenerator stærke adgangskoder, mens Sikkerhedstest for Adgangskoder evaluerer adgangskodens styrke, og IP-adresseopslag undersøger netværksoplysninger og geoplacering.'
      }
    ],
    faqsHeading: 'Ofte Stillede Spørgsmål',
    faqs: [
      {
        q: 'Er disse udviklerværktøjer helt gratis at bruge uden begrænsninger?',
        a: 'Ja, alle udviklerværktøjer på AnyConverter er 100% gratis uden betalingskrav, abonnementsplaner eller krav om oprettelse af brugerkonto. Du kan behandle kildekode, generere nøgler og analysere data så tit, som du har brug for i dit arbejde.'
      },
      {
        q: 'Er mine kildekoder, API-nøgler og følsomme data beskyttet og sikre?',
        a: 'Ja, dit privatliv og din datasikkerhed er fuldt beskyttet. Al parsing, formatering, validering og konvertering foregår udelukkende lokalt i din webbrowser via klientside-JavaScript. Dine koder og data behandles i hukommelsen uden upload til AnyConverters behandlingsservere.'
      },
      {
        q: 'Kræver nogle af disse udviklerværktøjer eksterne serverkald eller backend-tjenester?',
        a: 'Langt de fleste af vores værktøjer fungerer rent lokalt på din maskine. Kun specifikke netværksfunktioner som f.eks. IP-adresseopslag foretager godkendte forespørgsler til eksterne kilder for at hente offentlige netværksdata, hvilket fremgår tydeligt på værktøjets side.'
      },
      {
        q: 'Kan jeg bruge udviklerværktøjerne offline eller installere dem som en PWA?',
        a: 'Ja, AnyConverter er bygget med Progressive Web App-understøttelse. Når siden er indlæst, kan du installere værktøjerne på din computer eller mobil, så de vigtigste funktioner forbliver tilgængelige, selvom du midlertidigt mister internetforbindelsen.'
      },
      {
        q: 'Hvilke webbrowsere, operativsystemer og skærmstørrelser understøttes?',
        a: 'Vores værktøjer overholder moderne webstandarder og kører fejlfrit i Google Chrome, Mozilla Firefox, Apple Safari og Microsoft Edge på tværs af Windows, macOS, Linux, iOS og Android på både computere, tablets og smartphones.'
      }
    ],
    cardsKey: 'dev_da'
  }
};

// ==========================================
// CALCULATORS CONFIGURATION
// ==========================================
const CALC_SUBSECTIONS = [
  {
    id: 'percentages-discounts-pricing',
    tools: [
      'discount-calculator',
      'discount-stacking-calculator',
      'percentage-calculator',
      'reverse-percentage-calculator',
      'percentage-difference-calculator',
      'price-increase-calculator',
      'unit-price-calculator',
      'margin-vs-markup-calculator',
      'gst-vat-calculator',
      'tip-calculator'
    ]
  },
  {
    id: 'loans-pay-financial-planning',
    tools: [
      'pay-rise-calculator',
      'loan-calculator',
      'mortgage-calculator',
      'compound-interest-calculator',
      'currency-converter'
    ]
  },
  {
    id: 'slope-geometry-ratios',
    tools: [
      'rise-over-run-calculator',
      'slope-grade-angle-calculator',
      'aspect-ratio-calculator'
    ]
  },
  {
    id: 'health-fitness-daily-planning',
    tools: [
      'age-calculator',
      'bmi-calculator',
      'calorie-calculator',
      'sleep-calculator',
      'blood-type-compatibility',
      'birthday-countdown-calculator'
    ]
  },
  {
    id: 'compatibility-numerology-astrology',
    tools: [
      'love-calculator',
      'flames-calculator',
      'numerology-calculator',
      'name-numerology-calculator',
      'lo-shu-grid-calculator',
      'tarot-birth-card-calculator',
      'moon-sign-calculator',
      'rising-sign-calculator'
    ]
  }
];

const CALC_LOCALES = {
  en: {
    lang: 'en',
    filePath: 'calculators/index.html',
    canonical: 'https://anyconverter.io/calculators/',
    title: 'Free Online Calculators | Math & Finance | AnyConverter',
    metaDesc: 'Free online calculators for percentages, discounts, loans, mortgages, geometry, health, and daily planning. Fast, client-side, private, and easy to use.',
    ogTitle: 'Free Online Calculators | Math & Finance | AnyConverter',
    ogDesc: 'Free online calculators for percentages, discounts, loans, mortgages, geometry, health, and daily planning. Fast, client-side, private, and easy to use.',
    twitterTitle: 'Free Online Calculators | Math & Finance | AnyConverter',
    twitterDesc: 'Free online calculators for percentages, discounts, loans, mortgages, geometry, health, and daily planning. Fast, client-side, private, and easy to use.',
    breadcrumb: {
      homeName: 'Home',
      homeUrl: '/',
      hubName: 'Calculators',
      hubUrl: '/calculators/',
      ariaLabel: 'Breadcrumb'
    },
    hero: {
      h1: 'Free Online Calculators',
      desc: 'Accurate, private calculators for everyday maths, financial planning, commercial pricing, health metrics, and lifestyle decisions. Every calculator displays transparent formulas and worked examples in real time.'
    },
    subsections: [
      {
        title: 'Percentages, Discounts & Pricing',
        desc: 'Navigating commercial retail pricing, promotional markdowns, and tax obligations requires accurate percentage calculations without guesswork. When evaluating store bargains or seasonal promotions, Discount Calculator computes final discounted prices and net savings instantly. For complex promotional events where multiple coupons or membership incentives combine sequentially, Discount Stacking Calculator reveals why 20% followed by 10% off equals 28% rather than 30%. When tracking price adjustments or market inflation, Price Increase Calculator and Percentage Difference Calculator isolate relative shifts clearly. Entrepreneurs and retail managers can deploy Margin vs Markup Calculator to keep gross profit margins distinct from cost markups, while Unit Price Calculator identifies the most economical pack sizes across grocery and bulk purchases. Additionally, GST / VAT Calculator adds or extracts sales tax across arbitrary tax rates, and Tip Calculator splits shared dining bills effortlessly.'
      },
      {
        title: 'Loans, Pay & Financial Planning',
        desc: 'Managing personal finance and long-term borrowing commitments demands rigorous mathematical modeling of amortized interest and repayment schedules. When preparing for annual performance reviews or negotiating employment contracts, Pay Rise Calculator determines net salary increases and evaluates purchasing power adjustments after inflation. Prospective home buyers and automotive borrowers can deploy Loan & EMI Calculator and Mortgage Calculator to evaluate monthly payments, total cumulative interest expenses, and loan balance payoff horizons across diverse interest rate assumptions. To visualize the exponential compounding growth of long-term investments, retirement portfolios, and savings deposits over decades, Compound Interest Calculator models recurring contributions and returns dynamically. For international commerce and travel budgeting, Currency Converter calculates live conversions across 150 global currencies, with all calculations remaining strictly confidential on your device.'
      },
      {
        title: 'Slope, Geometry & Ratios',
        desc: 'Architectural drafting, construction carpentry, landscape grading, and digital media production require precise geometric conversions across angles and dimensions. When building ramps, staircases, retaining walls, or roof trusses, Rise Over Run Calculator determines pitch, grade percentages, and angular incline from simple elevation and horizontal run measurements. For civil engineering contractors and outdoor builders, Slope, Grade & Angle Calculator translates seamlessly between slope ratios, decimal grades, percentages, per-mille values, and degrees. Graphic designers, video editors, and front-end developers can leverage Aspect Ratio Calculator to scale screen dimensions dynamically while preserving standard 16:9, 4:3, or custom display proportions without image distortion or letterboxing issues. Every calculation executes in real time client-side with transparent formulas displayed directly on the screen.'
      },
      {
        title: 'Health, Fitness & Daily Planning',
        desc: 'Achieving wellness objectives and organizing daily schedules requires objective numerical insights into biometric baselines and temporal milestones. Use Age Calculator to calculate exact chronological age down to completed years, months, days, and total hours lived. When tracking wellness benchmarks and physique parameters, BMI Calculator assesses Body Mass Index across metric and imperial standards with standardized classification thresholds, while Calorie Calculator calculates total daily energy expenditure (TDEE) and target caloric intakes based on metabolic Basal Metabolic Rate formulas and activity factors. To wake up feeling refreshed and avoid mid-cycle grogginess, Sleep Calculator identifies optimal bedtimes and wake times aligned with natural 90-minute sleep cycles. Medical blood donor screening is simplified with Blood Type Compatibility, and Birthday Countdown Calculator tracks exact days remaining until upcoming celebrations.'
      },
      {
        title: 'Compatibility, Numerology & Astrology',
        desc: 'Exploring interpersonal dynamics, ancient numerological patterns, and astrological archetypes offers meaningful qualitative perspectives on relationships and personal growth. Use Love Calculator and FLAMES Calculator to compute fun compatibility scores and relationship affinities from names. To investigate classical esoteric traditions, Numerology Calculator derives core Life Path, Destiny, and Soul Urge vibrational numbers from full birthdates, while Name Numerology Calculator calculates Pythagorean and Chaldean vibration totals for personal and business names. To study ancient Chinese metaphysical squares, Lo Shu Grid Calculator generates 3x3 numerology grids analyzing presence and arrows of strength or weakness. Furthermore, Tarot Birth Card Calculator determines Major Arcana archetypal lessons, while Moon Sign Calculator and Rising Sign Calculator calculate astrological lunar instincts and outer ascendant personas.'
      }
    ],
    faqsHeading: 'Frequently Asked Questions',
    faqs: [
      {
        q: 'Are these online calculators free to use and do they show their formulas?',
        a: 'Yes, all calculators on AnyConverter are 100% free with no hidden charges, paywalls, or required registration. Every calculator displays the exact mathematical formula and worked example steps so you can inspect and verify how the result was computed.'
      },
      {
        q: 'Is my financial, medical, or personal calculation data kept private?',
        a: 'Yes, your privacy is completely protected. All calculation engines run client-side in your browser using JavaScript. None of the salary figures, loan balances, birthdates, or health metrics you enter are stored on or transmitted to AnyConverter processing servers.'
      },
      {
        q: 'How does AnyConverter ensure mathematical precision and avoid round-off errors?',
        a: 'Our calculation algorithms use standardized IEEE 754 floating-point safeguards, decimal scaling, and exact integer arithmetic where appropriate (such as currency and financial amortization schedules) to eliminate rounding drift across multi-step calculations.'
      },
      {
        q: 'Can I share pre-filled calculation results with clients, colleagues, or family?',
        a: 'Yes, several of our high-volume calculators (such as the Percentage Calculator and Date Difference Calculator) include shareable state URLs that encode input parameters into the URL hash or query string without sending private data to a database.'
      },
      {
        q: 'Do these calculators work on mobile phones, tablets, and touchscreen devices?',
        a: 'Yes, all calculators feature fully responsive layouts and touch-optimized controls designed for effortless use on smartphones and tablets across iOS and Android browsers without installing native apps.'
      }
    ],
    cardsKey: 'calc_en'
  },
  es: {
    lang: 'es',
    filePath: 'es/calculators/index.html',
    canonical: 'https://anyconverter.io/es/calculators/',
    title: 'Calculadoras Online Gratis | Finanzas y Salud | AnyConverter',
    metaDesc: 'Calculadoras online gratuitas para porcentajes, descuentos, préstamos, hipotecas, salud y geometría. Rápidas, precisas, privadas y sin registro previo.',
    ogTitle: 'Calculadoras Online Gratis | Finanzas y Salud | AnyConverter',
    ogDesc: 'Calculadoras online gratuitas para porcentajes, descuentos, préstamos, hipotecas, salud y geometría. Rápidas, precisas, privadas y sin registro previo.',
    twitterTitle: 'Calculadoras Online Gratis | Finanzas y Salud | AnyConverter',
    twitterDesc: 'Calculadoras online gratuitas para porcentajes, descuentos, préstamos, hipotecas, salud y geometría. Rápidas, precisas, privadas y sin registro previo.',
    breadcrumb: {
      homeName: 'Inicio',
      homeUrl: '/es/',
      hubName: 'Calculadoras',
      hubUrl: '/es/calculators/',
      ariaLabel: 'Miga de pan'
    },
    hero: {
      h1: 'Calculadoras Online Gratis',
      desc: 'Calculadoras rápidas, precisas y privadas para resolver las cuentas que realmente necesitas: precios, rebajas comerciales, préstamos, hipotecas, proporciones, salud y planificación diaria con fórmulas transparentes.'
    },
    subsections: [
      {
        title: 'Porcentajes, Descuentos y Precios',
        desc: 'Resolver rebajas comerciales, incrementos de precios y obligaciones tributarias requiere cálculos porcentuales rápidos y fiables sin margen de error. Cuando quieras comprobar ofertas en tiendas o campañas estacionales, Calculadora de Descuentos determina el precio final rebajado y el ahorro neto de inmediato. En promociones donde se combinan cupones sucesivos, Calculadora de Descuentos Acumulados demuestra con claridad por qué un 20% sumado a un 10% equivale a un 28% y no a un 30%. Si necesitas medir aumentos de costes o impacto inflacionario, Calculadora de Incremento de Precios y Calculadora de Diferencia Porcentual aíslan las variaciones relativas. Para comerciantes y emprendedores, Calculadora de Margen vs Margen Bruto ayuda a fijar precios separando margen de ganancia de recargo sobre coste, mientras que Calculadora de Precio Unitario encuentra el envase más barato por kilo o litro, y Calculadora de IVA agrega o deduce tasas impositivas al instante.'
      },
      {
        title: 'Préstamos, Salarios y Finanzas',
        desc: 'Planificar el patrimonio familiar y contraer compromisos de crédito exige estimaciones matemáticas rigurosas sobre tablas de amortización y desembolsos mensuales. Si vas a negociar una revisión salarial o evaluar una oferta laboral, Calculadora de Aumento Salarial calcula el incremento neto de tus ingresos y contrasta el poder adquisitivo frente a la inflación. Quienes estén valorando comprar una vivienda o financiar un vehículo pueden recurrir a Calculadora de Préstamos y Calculadora de Hipotecas para proyectar cuotas periódicas, coste total por intereses y plazos de amortización según el tipo pactado. Para visualizar cómo crecen tus ahorros a largo plazo mediante aportaciones periódicas, Calculadora de Interés Compuesto simula rendimientos futuros con total claridad. Asimismo, Convertidor de Moneda ofrece conversiones en tiempo real entre más de 150 divisas mundiales con total reserva de datos en tu equipo.'
      },
      {
        title: 'Pendiente, Geometría y Proporciones',
        desc: 'Los proyectos de carpintería, reformas domésticas, paisajismo y edición multimedia requieren cálculos trigonométricos y adaptaciones proporcionales exactas. Al diseñar rampas accesibles, escaleras o techos inclinados, Calculadora de Pendiente y Desnivel calcula la inclinación a partir de medidas básicas de elevación y longitud horizontal. Para contratistas y constructores, Calculadora de Grados y Pendiente traduce fácilmente relaciones de inclinación entre porcentajes de rampa, grados angulares y proporciones decimales. En el ámbito del diseño gráfico y la edición de vídeo, Calculadora de Relación de Aspecto permite redimensionar imágenes y pantallas conservando proporciones estándar como 16:9 o 4:3 sin deformar el encuadre ni perder nitidez visual. Todas las operaciones matemáticas se procesan en tu dispositivo con fórmulas y explicaciones visibles en pantalla.'
      },
      {
        title: 'Salud, Bienestar y Vida Diaria',
        desc: 'Cuidar el bienestar físico y planificar hábitos cotidianos requiere información numérica objetiva sobre indicadores corporales y etapas temporales. Con Calculadora de Edad puedes conocer tu edad exacta desglosada en años, meses, días e incluso horas transcurridas. Para vigilar el equilibrio corporal según parámetros sanitarios internacionales, Calculadora de IMC evalúa el Índice de Masa Corporal bajo unidades métricas o anglosajonas con rangos oficiales, mientras que Calculadora de Calorías estima el consumo energético diario recomendado según tu tasa metabólica basal y nivel de ejercicio. Para levantarte descansado evitando interrupciones bruscas del sueño, Calculadora de Sueño identifica horarios de descanso ideales alineados con ciclos naturales de 90 minutos. Además, Compatibilidad de Grupos Sanguíneos orienta sobre compatibilidad en donaciones y Cuenta Regresiva de Cumpleaños calcula los días que faltan para celebrar.'
      },
      {
        title: 'Compatibilidad, Numerología y Astrología',
        desc: 'Comprender afinidades personales, interpretar patrones numéricos tradicionales y analizar arquetipos astrológicos aporta una perspectiva lúdica y enriquecedora en las relaciones humanas. Con Calculadora del Amor y Calculadora FLAMES puedes explorar niveles de compatibilidad y vínculos afectivos a partir de nombres propios. Si te apasiona la numerología tradicional, Calculadora de Numerología desvela el Sendero de Vida y Número de Destino según tu fecha de nacimiento, mientras que Numerología del Nombre analiza las vibraciones de nombres según los métodos pitagórico y caldeo. Para profundizar en la metafísica oriental, Calculadora Cuadrícula Lo Shu dibuja la cuadrícula 3x3 identificando líneas de fuerza y vacíos energéticos. Por último, Carta del Tarot por Nacimiento revela lecciones del arcano mayor, mientras que Calculadora de Signo Lunar y Signo Ascendente determinan aspectos del perfil zodiacal.'
      }
    ],
    faqsHeading: 'Preguntas Frecuentes',
    faqs: [
      {
        q: '¿Estas calculadoras online son gratuitas y muestran sus fórmulas?',
        a: 'Sí, todas las calculadoras en AnyConverter son 100% gratuitas, sin cargos ocultos, sin suscripciones de pago y sin necesidad de crear cuenta. Cada herramienta explica su fórmula matemática y muestra ejemplos prácticos para que puedas contrastar el resultado obtenido.'
      },
      {
        q: '¿Mis datos financieros, médicos o de salud permanecen privados?',
        a: 'Sí, tu privacidad está totalmente salvaguardada. Todas las operaciones de cálculo se realizan localmente en tu navegador web mediante JavaScript. Los importes, sueldos, fechas de nacimiento o medidas que introduzcas no se almacenan ni se envían a servidores de AnyConverter.'
      },
      {
        q: '¿Cómo garantiza AnyConverter la precisión matemática en las operaciones?',
        a: 'Nuestros algoritmos implementan protecciones de precisión numérica en coma flotante y redondeos financieros controlados para garantizar exactitud decimal en préstamos, impuestos y proporciones geométricas sin desviación acumulada.'
      },
      {
        q: '¿Puedo compartir resultados o enlaces con datos precargados con otras personas?',
        a: 'Sí, varias de nuestras herramientas principales (como la Calculadora de Porcentajes o la Calculadora de Diferencia de Fechas) disponen de botones para generar enlaces compartibles que conservan los parámetros sin almacenar datos en bases de datos externas.'
      },
      {
        q: '¿Funcionan estas calculadoras en teléfonos móviles y tabletas?',
        a: 'Sí, todas las calculadoras cuentan con interfaces web adaptables optimizadas para pantallas táctiles, lo que permite utilizarlas con total comodidad desde navegadores móviles en dispositivos iOS y Android sin instalar ninguna aplicación.'
      }
    ],
    cardsKey: 'calc_es'
  },
  da: {
    lang: 'da',
    filePath: 'da/calculators/index.html',
    canonical: 'https://anyconverter.io/da/calculators/',
    title: 'Gratis Online Beregnere | Finans & Sundhed | AnyConverter',
    metaDesc: 'Gratis online beregnere til procenter, rabatter, lån, boliglån, geometri, sundhed og hverdagsplanlægning. Hurtigt, privat og helt uden registrering.',
    ogTitle: 'Gratis Online Beregnere | Finans & Sundhed | AnyConverter',
    ogDesc: 'Gratis online beregnere til procenter, rabatter, lån, boliglån, geometri, sundhed og hverdagsplanlægning. Hurtigt, privat og helt uden registrering.',
    twitterTitle: 'Gratis Online Beregnere | Finans & Sundhed | AnyConverter',
    twitterDesc: 'Gratis online beregnere til procenter, rabatter, lån, boliglån, geometri, sundhed og hverdagsplanlægning. Hurtigt, privat og helt uden registrering.',
    breadcrumb: {
      homeName: 'Hjem',
      homeUrl: '/da/',
      hubName: 'Beregnere',
      hubUrl: '/da/calculators/',
      ariaLabel: 'Brødkrumme'
    },
    hero: {
      h1: 'Gratis Online Beregnere',
      desc: 'Hurtige, præcise og private beregnere til hverdagens praktiske regnestykker: priser, butiksrabatter, lån, renter, geometriske hældninger, sundhed og personlig planlægning med gennemskuelige formler.'
    },
    subsections: [
      {
        title: 'Procenter, Rabatter og Priser',
        desc: 'Hverdagens indkøb, tilbudsjagt og beregning af handelsmoms kræver hurtige og pålidelige procentudregninger uden gætterier. Når du vil vurdere tilbud i butikker eller på nettet, udregner Rabatberegner den endelige pris og din samlede besparelse med det samme. Ved kampagner, hvor flere rabatkuponer kombineres efter hinanden, forklarer Beregner til Sammensatte Rabatter, hvorfor 20% efterfulgt af 10% giver 28% og ikke 30%. Hvis du skal måle prisstigninger eller prisændringer over tid, viser Beregner til Prisstigning og Procentforskel Beregner de relative udsving præcist. For erhvervsdrivende hjælper Avance vs Markup Beregner med at adskille dækningsgrad fra avancetillæg, mens Enhedspris Beregner udpeger den billigste pakke per kilo eller liter, og Momsberegner tilføjer eller fratrækker afgifter hurtigt og enkelt.'
      },
      {
        title: 'Lån, Løn og Privatøkonomi',
        desc: 'Overblik over privatøkonomien og optagelse af lån forudsætter grundige beregninger af renteudgifter og månedlige ydelser. Når du forbereder lønforhandling eller overvejer et nyt jobtilbud, udregner Lønforhøjelse Beregner den reelle lønstigning og vurderer købekraften i forhold til inflation. Hvis du skal købe bolig eller finansiere en bil, hjælper Låneberegner og Boliglånsberegner med at overskue månedlige afdrag, samlede renteomkostninger og løbetid ud fra dine renteforudsætninger. For at se, hvordan langsigtede opsparinger vokser over tid ved hjælp af renters rente, simulerer Rentes Rente Beregner formueudviklingen dynamisk. Endelig leverer Valutaomregner opdaterede vekselkurser mellem mere end 150 globale valutaer, hvor alle dine indtastede beløb behandles med fuld fortrolighed lokalt på din computer.'
      },
      {
        title: 'Hældning, Geometri og Billedforhold',
        desc: 'Håndværksopgaver, gør-det-selv-projekter, trappebyggeri og digital medieproduktion stiller krav om nøjagtige geometriske omregninger mellem mål og vinkler. Ved anlæg af ramper, tagkonstruktioner eller støttemure beregner Hældning over Længde Beregner stigningsprocent og vinkel ud fra enkle højdeforskelle og vandrette længder. For byggefolk og anlægsgartnere omregner Hældningsberegner ubesværet mellem stigningsforhold, decimaltal, procenter og vinkelgrader. Grafikere, videoredigerere og webudviklere kan desuden benytte Billedformat Beregner til at skalere skærmdimensioner og bevare standardiserede formater som 16:9 eller 4:3 uden at forvride billedet. Alle beregninger foregår lynhurtigt i browseren med klare formler og trin-for-trin-forklaringer synlige på skærmen.'
      },
      {
        title: 'Sundhed, Træning og Hverdagsplanlægning',
        desc: 'Sundhedsmæssige mål og en velstruktureret hverdag kræver pålidelige tal for kropslige nøgletal og tidsmæssige milepæle. Med Aldersberegner kan du udregne din nøjagtige kronologiske alder opgjort i hele år, måneder, dage og samlede levede timer. Til kontrol af fysiske mål efter internationale retningslinjer evaluerer BMI Beregner dit kropsmasseindeks med standardiserede vægtklasser, mens Kalorieberegner beregner det daglige energibehov ud fra hvilestofskifte og fysisk aktivitetsniveau. For at vågne veludhvilet og undgå at blive vækket i dyb søvn foreslår Søvnberegner optimale sengetider baseret på naturlige søvncyklusser á 90 minutter. Desuden giver Blodtypekompatibilitet overblik over donorforenelighed, og Fødselsdagsnedtælling tæller dagene til næste fejring.'
      },
      {
        title: 'Kompatibilitet, Numerologi og Astrologi',
        desc: 'Undersøgelse af personlige relationer, klassiske talmønstre og astrologiske arketyper giver et underholdende og tankevækkende indblik i venskaber og livsveje. Med Kærlighedsberegner og FLAMES Beregner kan du teste navnes indbyrdes harmoni og affinitet. Hvis du er fascineret af numerologi, udregner Numerologi Beregner dine centrale livsvejs- og skæbnetal ud fra din fødselsdato, mens Navnenumerologi Beregner analyserer vibrationer i person- og firmanavne via pythagoræiske og kaldæiske metoder. Til østlig metafysik danner Lo Shu Gitter Beregner et 3x3 energikvadrat, der fremhæver stærke linjer og talmangler. Endelig udpeger Tarot Fødselskort Beregner dit personlige arketypiske kort fra den store arkana, mens Månetegnberegner og Ascendantberegner kortlægger dine astrologiske instinkter og ydre fremtoning.'
      }
    ],
    faqsHeading: 'Ofte Stillede Spørgsmål',
    faqs: [
      {
        q: 'Er disse online beregnere helt gratis at bruge og viser de formlerne?',
        a: 'Ja, alle beregnere på AnyConverter er 100% gratis uden skjulte gebyrer, betalingskrav eller krav om registrering. Hvert eneste værktøj viser den matematiske formel og en trinvis udregning, så du let kan gennemskue og kontrollere resultatet.'
      },
      {
        q: 'Bliver mine økonomiske, helbredsmæssige og personlige tal holdt private?',
        a: 'Ja, dit privatliv er fuldstændig beskyttet. Alle beregninger foregår lokalt i din webbrowser ved hjælp af klientside-JavaScript. Hverken løntal, lånestørrelser, fødselsdatoer eller kropsmål overføres til eller gemmes på AnyConverters behandlingsservere.'
      },
      {
        q: 'Hvordan sikrer AnyConverter matematisk præcision uden afrundingsfejl?',
        a: 'Vores beregningsalgoritmer anvender standardiserede decimalmetoder og præcise afrundingsregler, hvilket sikrer fuld nøjagtighed ved beregning af renter, afdrag, moms og geometriske forhold uden kumulativ afvigelse.'
      },
      {
        q: 'Kan jeg dele forududfyldte beregninger og resultater med andre?',
        a: 'Ja, flere af vores populære beregnere (som f.eks. Procentberegner og Datoforskel Beregner) indeholder smarte delefunktioner, der genererer et direkte link med dine tal uden at gemme personlige oplysninger i eksterne databaser.'
      },
      {
        q: 'Fungerer disse beregnere på mobiltelefoner og tablets?',
        a: 'Ja, alle beregnerne er bygget med et fuldt responsivt design og berøringsvenlige knapper, så du nemt kan foretage beregninger direkte i browseren på din smartphone eller tablet på tværs af iOS og Android.'
      }
    ],
    cardsKey: 'calc_da'
  }
};

function generateHubHtml(cfg, loc, extractedCardsMap) {
  const urlPrefix = loc.lang === 'en' ? '/' : `/${loc.lang}/`;

  // Flatten tools in subsection order
  const allToolSlugs = [];
  cfg.subsections.forEach(sub => {
    sub.tools.forEach(slug => allToolSlugs.push(slug));
  });

  const cardsSource = extractedCards[loc.cardsKey];

  const itemListElements = allToolSlugs.map((slug, idx) => {
    const card = cardsSource[slug];
    const canonicalToolUrl = `https://anyconverter.io${urlPrefix}${slug}/`;
    return {
      '@type': 'ListItem',
      position: idx + 1,
      name: card ? card.name : slug,
      url: canonicalToolUrl
    };
  });

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
  const subsectionsHtml = cfg.subsections.map((sub, sIdx) => {
    const subData = loc.subsections[sIdx];
    const cardsHtml = sub.tools.map(slug => {
      const card = cardsSource[slug];
      const toolHref = `${urlPrefix}${slug}/`;
      const iconPath = card.icon || '/assets/img/icon-tool.svg';
      const altText = card.alt || `${card.name} icon`;
      return `        <a href="${toolHref}" class="tool-card"><img src="${iconPath}" alt="${altText}" class="tool-card-icon" width="40" height="40" loading="lazy"><h3>${card.name}</h3><p>${card.desc}</p><span class="tool-card-link">${card.linkText}</span></a>`;
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

  const hubSlug = loc.canonical.includes('developer-tools') ? 'developer-tools' : 'calculators';

  return `<!DOCTYPE html>
<html lang="${loc.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${loc.title}</title>
  <meta name="description" content="${loc.metaDesc}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${loc.canonical}">
  <link rel="alternate" hreflang="en" href="https://anyconverter.io/${hubSlug}/">
  <link rel="alternate" hreflang="es" href="https://anyconverter.io/es/${hubSlug}/">
  <link rel="alternate" hreflang="da" href="https://anyconverter.io/da/${hubSlug}/">
  <link rel="alternate" hreflang="x-default" href="https://anyconverter.io/${hubSlug}/">
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

// Inject verified subsection descriptions (strictly 150-250 words each)
const verifiedSubs = JSON.parse(fs.readFileSync(path.join(__dirname, 'verified_subsections_s18.json'), 'utf8'));

DEV_LOCALES.en.subsections.forEach((sub, i) => { sub.desc = verifiedSubs.dev_en[i]; });
DEV_LOCALES.es.subsections.forEach((sub, i) => { sub.desc = verifiedSubs.dev_es[i]; });
DEV_LOCALES.da.subsections.forEach((sub, i) => { sub.desc = verifiedSubs.dev_da[i]; });

CALC_LOCALES.en.subsections.forEach((sub, i) => { sub.desc = verifiedSubs.calc_en[i]; });
CALC_LOCALES.es.subsections.forEach((sub, i) => { sub.desc = verifiedSubs.calc_es[i]; });
CALC_LOCALES.da.subsections.forEach((sub, i) => { sub.desc = verifiedSubs.calc_da[i]; });

// Generate Developer Tools Hubs
for (const locKey of Object.keys(DEV_LOCALES)) {
  const loc = DEV_LOCALES[locKey];
  const fullPath = path.join(ROOT, loc.filePath);
  const html = generateHubHtml({ subsections: DEV_SUBSECTIONS }, loc, extractedCards);
  fs.writeFileSync(fullPath, html, 'utf8');
  console.log(`Generated ${loc.filePath} (${html.length} bytes)`);
}

// Generate Calculators Hubs
for (const locKey of Object.keys(CALC_LOCALES)) {
  const loc = CALC_LOCALES[locKey];
  const fullPath = path.join(ROOT, loc.filePath);
  const html = generateHubHtml({ subsections: CALC_SUBSECTIONS }, loc, extractedCards);
  fs.writeFileSync(fullPath, html, 'utf8');
  console.log(`Generated ${loc.filePath} (${html.length} bytes)`);
}

console.log('\nAll 6 Developer Tools and Calculators category hub pages successfully generated!');
