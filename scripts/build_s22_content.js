const fs = require('fs');
const path = require('path');

const S22_CONTENT = {
  'json-formatter': {
    en: {
      heading: 'How It Works: JSON Formatting & Tree Serialization',
      defQuestion: 'What is a JSON Formatter?',
      defAnswer: 'A JSON formatter is a software utility that validates raw JavaScript Object Notation against RFC 8259 grammar specifications and serializes parsed tokens into human-readable, indented text hierarchies. It transforms minified, unformatted, or single-line data structures into clean trees with consistent indentation and syntax coloring.',
      mechHeading: 'How It Works in the Browser',
      mechIntro: 'AnyConverter formats and validates JSON 100% client-side inside your browser engine using high-performance JavaScript workers without transmitting data over the network:',
      steps: [
        '<strong>Lexical Analysis & Streaming Parser</strong>: The input string is parsed using native <code>JSON.parse()</code> or a streaming parser tokenizer to verify valid RFC 8259 grammar tokens (strings, numbers, booleans, null, arrays, objects).',
        '<strong>Syntax Tree Serialization</strong>: Valid structures undergo tree serialization, recursively traversing nodes to calculate indentation depth, apply chosen whitespace (2 spaces, 4 spaces, or tabs), and sort object keys alphabetically if requested.',
        '<strong>Virtual DOM Rendering</strong>: Large payloads exceeding 150 KB are mapped to an in-memory newline offset index and rendered through a 50-node virtual scroller to maintain 60 FPS performance without browser freezing.',
        '<strong>Zero-Server Privacy</strong>: All parsing, formatting, searching, and downloads happen entirely in local browser memory with zero server telemetry or payload retention.'
      ],
      factsHeading: 'Key Specifications & Technical Standards',
      facts: 'The formatter strictly adheres to <strong>RFC 8259</strong> grammar and ECMA-404 JSON data interchange standards. Valid JSON requires double-quoted property keys, prohibits trailing commas, rejects single-quoted strings, and restricts numeric values to standard decimal notation without leading zeros. Our engine validates syntax down to line and column coordinates, performs recursive tree serialization, and supports streaming parser transformations directly to YAML or CSV for supported tabular shapes.'
    },
    es: {
      heading: 'Cómo funciona: Formateo de JSON y serialización de árboles',
      defQuestion: '¿Qué es un formateador de JSON?',
      defAnswer: 'Un formateador de JSON es una utilidad de software que valida la notación de objetos JavaScript según las especificaciones gramaticales de la norma RFC 8259 y serializa los tokens analizados en jerarquías de texto legibles e indentadas. Transforma estructuras de datos comprimidas, sin formato o en una sola línea en árboles estructurados con sangrías y colores de sintaxis consistentes.',
      mechHeading: 'Cómo funciona en el navegador',
      mechIntro: 'AnyConverter formatea y valida JSON al 100% en el lado del cliente dentro de tu navegador web mediante trabajadores de JavaScript de alto rendimiento sin transmitir datos a través de la red:',
      steps: [
        '<strong>Análisis léxico y streaming parser</strong>: La cadena de entrada se analiza mediante <code>JSON.parse()</code> nativo o un streaming parser con tokenizador para comprobar tokens válidos según la gramática RFC 8259 (cadenas, números, booleanos, null, matrices y objetos).',
        '<strong>Serialización de árbol sintáctico</strong>: Las estructuras válidas ejecutan una serialización de árbol (tree serialization), recorriendo nodos para calcular la profundidad de indentación, aplicar el espaciado seleccionado (2 espacios, 4 espacios o tabulaciones) y ordenar claves alfabéticamente.',
        '<strong>Renderizado virtual DOM</strong>: Las cargas grandes superiores a 150 KB se asignan a un índice de líneas en memoria y se representan mediante un desplazador virtual de 50 nodos para mantener una tasa fluida de 60 FPS sin bloquear la interfaz.',
        '<strong>Privacidad sin servidor</strong>: Todo el análisis, formateo, búsqueda y descarga ocurre exclusivamente en la memoria local de tu dispositivo con total confidencialidad.'
      ],
      factsHeading: 'Especificaciones técnicas y estándares RFC',
      facts: 'El formateador cumple rigurosamente con la gramática de la norma <strong>RFC 8259</strong> y los estándares de intercambio de datos ECMA-404. El formato JSON estándar exige que las claves de las propiedades utilicen comillas dobles, rechaza comas finales sobrantes y prohíbe comillas simples o números con ceros a la izquierda. Nuestro motor localiza errores de sintaxis indicando la posición exacta de línea y columna, realiza serialización de árbol (tree serialization) y permite transformaciones directas con streaming parser a YAML y CSV para estructuras compatibles.'
    },
    da: {
      heading: 'Hvordan det virker: JSON-formatering og træ-serialisering',
      defQuestion: 'Hvad er en JSON-formaterer?',
      defAnswer: 'En JSON-formaterer er et softwareværktøj, der validerer JavaScript Object Notation mod RFC 8259-grammatikspecifikationen og serialiserer de analyserede tokens til et letlæseligt, indrykket teksthierarki. Værktøjet forvandler minificerede data eller rå tekstlinjer til overskuelige strukturer med ensartede indrykninger og syntaksfremhævning.',
      mechHeading: 'Hvordan det virker i browseren',
      mechIntro: 'AnyConverter formaterer og validerer JSON 100% klientside i din browser ved hjælp af optimerede JavaScript-baggrundsprocesser uden at sende data over netværket:',
      steps: [
        '<strong>Leksikalsk analyse og streaming parser</strong>: Inputstrengen parses med indbygget <code>JSON.parse()</code> eller en streaming parser-tokenizer for at bekræfte gyldige RFC 8259 grammar-tokens (strenge, tal, boolske værdier, null, lister og objekter).',
        '<strong>Træ-serialisering (tree serialization)</strong>: Gyldige datastrukturer gennemgår træ-serialisering, hvor knuder gennemgås rekursivt for at beregne indrykningsdybde, anvende valgt afstand (2 mellemrum, 4 mellemrum eller tabulator) og sortere nøgler alfabetisk efter behov.',
        '<strong>Virtuel DOM-visning</strong>: Store datamængder over 150 KB indekseres i hukommelsen og gengives via en 50-linjers virtuel scroller, hvilket fastholder 60 FPS uden at belaste browseren.',
        '<strong>Fuldstændigt privatliv</strong>: Al parsing, formatering, søgning og eksport udføres udelukkende i lokal enhedshukommelse uden ekstern datatransmission.'
      ],
      factsHeading: 'Tekniske specifikationer og RFC-standarder',
      facts: 'Formateringsmotoren overholder nøje <strong>RFC 8259</strong>-grammatikken og ECMA-404-standarden for dataudveksling. Gyldig JSON kræver dobbelte anførselstegn omkring alle nøglenavne, afviser efterfølgende kommaer og forbyder uindkapslede enkeltanførselstegn. Vores motor udfører robust træ-serialisering (tree serialization), identificerer syntaksfejl med nøjagtig linje- og kolonneangivelse og muliggør direkte streaming parser-konvertering til YAML eller CSV for kompatible tabelstrukturer.'
    }
  },
  'json-compare': {
    en: {
      heading: 'How It Works: JSON Diffing & Myers Structural Alignment',
      defQuestion: 'What is a JSON Comparison Tool?',
      defAnswer: 'A JSON comparison tool is an analytical utility that deserializes two JSON payloads, recursively aligns their structural object keys and array elements, and calculates the exact delta using graph diffing algorithms. It highlights additions, deletions, value modifications, and type shifts across complex nested objects.',
      mechHeading: 'How It Works in the Browser',
      mechIntro: 'Our client-side diff engine computes deep comparisons directly in your browser using deterministic key normalization and difference graph traversal:',
      steps: [
        '<strong>Syntax Tree Normalization</strong>: Both inputs are parsed under RFC 8259 standards into in-memory object graphs, with structural key alignment applied to eliminate false diffs caused purely by dictionary property ordering.',
        '<strong>Myers Diff Algorithm Graph Traversal</strong>: Structural lines and values are processed through Myers diff algorithm, establishing shortest edit scripts with O(ND) time and memory efficiency.',
        '<strong>Semantic Array Order Heuristics</strong>: Arrays are aligned using index-matching and array order heuristics to distinguish shifted items from genuine value updates and deletions.',
        '<strong>Side-by-Side Unified Output</strong>: Differences are color-coded in real time with synchronized scroll bars and granular diff counters without sending your payloads to a server.'
      ],
      factsHeading: 'Key Specifications & Algorithmic Mechanics',
      facts: 'The comparator relies on the <strong>Myers diff algorithm</strong> (Eugene Myers, 1986), an industry-standard shortest edit path graph solver. Unlike plain text line diffs that produce noisy outputs when JSON properties are shuffled, structural key alignment preserves syntactic integrity. Combined with array order heuristics, the algorithm evaluates nested lists accurately. Payload parsing conforms to <strong>RFC 8259</strong>, ensuring full compatibility with nested arrays, Unicode characters, and deeply nested microservice schemas.'
    },
    es: {
      heading: 'Cómo funciona: Comparación de JSON y alineación estructural de Myers',
      defQuestion: '¿Qué es una herramienta de comparación de JSON?',
      defAnswer: 'Una herramienta de comparación de JSON es una utilidad analítica que deserializa dos cargas útiles de JSON, alinea recursivamente sus claves de objetos y elementos de matrices, y calcula la diferencia exacta utilizando algoritmos de diferencias gráficas. Resalta adiciones, eliminaciones, modificaciones de valores y cambios de tipo en objetos anidados complejos.',
      mechHeading: 'Cómo funciona en el navegador',
      mechIntro: 'Nuestro motor de diferencias en el cliente calcula comparaciones profundas directamente en tu navegador mediante la normalización de claves y el recorrido de grafos de edición:',
      steps: [
        '<strong>Normalización y alineación estructural de claves</strong>: Ambas entradas se analizan bajo el estándar RFC 8259 en grafos de objetos en memoria, aplicando alineación estructural de claves (structural key alignment) para eliminar falsas discrepancias derivadas del orden de propiedades.',
        '<strong>Recorrido del grafo con el algoritmo de diff de Myers</strong>: Las líneas y valores estructurales se evalúan mediante el algoritmo de diff de Myers (Myers diff algorithm), generando el camino de edición más corto con eficiencia O(ND).',
        '<strong>Heurísticas de orden de matrices</strong>: Las listas se comparan mediante heurísticas de orden de matrices (array order heuristics) e identidad de elementos para diferenciar elementos desplazados de actualizaciones reales de valores.',
        '<strong>Visualización paralela sincronizada</strong>: Las diferencias se resaltan mediante colores en tiempo real con barras de desplazamiento coordinadas y contadores detallados, sin enviar información a ningún servidor.'
      ],
      factsHeading: 'Especificaciones técnicas y mecánica algorítmica',
      facts: 'El comparador se basa en el <strong>algoritmo de diff de Myers</strong> (Myers diff algorithm, 1986), la referencia técnica para calcular rutas de edición mínimas. A diferencia de los comparadores de texto plano que fallan cuando las claves cambian de posición, la alineación estructural de claves (structural key alignment) junto con heurísticas de orden de matrices (array order heuristics) garantiza coherencia sintáctica bajo la norma <strong>RFC 8259</strong>, admitiendo árboles jerárquicos profundos y caracteres internacionales en UTF-8.'
    },
    da: {
      heading: 'Hvordan det virker: JSON-sammenligning og Myers-strukturjustering',
      defQuestion: 'Hvad er et JSON-sammenligningsværktøj?',
      defAnswer: 'Et JSON-sammenligningsværktøj er et analytisk værktøj, der deserialiserer to JSON-nyttelaster, justerer deres strukturelle objektnøgler og matrixelementer rekursivt og beregner den nøjagtige forskel ved hjælp af avancerede graf-diff-algoritmer. Værktøjet fremhæver tilføjelser, sletninger, værdiændringer og datatyper på tværs af komplekse indlejrede objekter med millimeterpræcision.',
      mechHeading: 'Hvordan det virker i browseren',
      mechIntro: 'Vores klientside-diff-motor beregner dybdegående sammenligninger direkte i browseren ved hjælp af nøglenormalisering, grafanalyse og sikre algoritmer:',
      steps: [
        '<strong>Normalisering og strukturel nøglejustering</strong>: Begge datasæt parses under RFC 8259-standarden til hukommelsesobjekter, hvor strukturel nøglejustering (structural key alignment) anvendes for at undgå falske forskelle forårsaget af vilkårlig egenskabsrækkefølge.',
        '<strong>Myers diff algorithm grafevaluering</strong>: Strukturelle linjer og værdier behandles via Myers diff algorithm, som finder den korteste redigeringsvej med O(ND) tidseffektivitet og minimalt hukommelsesforbrug.',
        '<strong>Semantiske matrixrækkefølge-heuristikker</strong>: Lister sammenlignes via avancerede matrixrækkefølge-heuristikker (array order heuristics) for præcist at skelne mellem flyttede elementer, ændrede værdier og sletninger.',
        '<strong>Synkroniseret to-kolonne visning</strong>: Forskelle farvekodes i realtid med synkroniserede rullebjælker og detaljerede tællere uden ekstern serveroverførsel.'
      ],
      factsHeading: 'Tekniske specifikationer og algoritmiske principper',
      facts: 'Sammenligningsmotoren anvender <strong>Myers diff algorithm</strong> (Eugene Myers, 1986), den klassiske standard til beregning af minimale ændringsskripter. I modsætning til simple linje-differ, der skaber støj ved ændret nøglerækkefølge, bevarer strukturel nøglejustering (structural key alignment) og array order heuristics den fulde syntaktiske sammenhæng under <strong>RFC 8259</strong>-specifikationen med komplet understøttelse af Unicode, store datamængder og dybe datastrukturer i lokal hukommelse.'
    }
  },
  'csv-to-sql': {
    en: {
      heading: 'How It Works: CSV Parsing & SQL Dialect Generation',
      defQuestion: 'What is a CSV to SQL Converter?',
      defAnswer: 'A CSV to SQL converter is a data migration utility that tokenizes delimiter-separated tabular records according to RFC 4180 specifications, infers column datatypes, and generates structured SQL INSERT statements tailored to target database engines. It automates table schema definition and batch row transformation.',
      mechHeading: 'How It Works in the Browser',
      mechIntro: 'AnyConverter processes your spreadsheets and delimiter-separated files directly in browser memory using a streaming state-machine parser:',
      steps: [
        '<strong>RFC 4180 Lexical Parsing</strong>: The parser scans input rows adhering to RFC 4180 parsing specifications, properly handling escaped quotes, embedded commas, and multiline values within quoted strings.',
        '<strong>Type Inference Heuristics</strong>: Column cells are evaluated across sample rows using automated type inference heuristics to deduce optimal SQL types (INTEGER, DECIMAL, BOOLEAN, TIMESTAMP, or VARCHAR).',
        '<strong>Automated Dialect Quoting</strong>: Identifier names and literal values receive automated dialect quoting using engine-specific delimiters (MySQL backticks, PostgreSQL double quotes, MS SQL Server square brackets, or SQLite standard quotes).',
        '<strong>Batch Statement Construction</strong>: Rows are grouped into multi-value INSERT batches to maximize database import speed while avoiding transaction size limits.'
      ],
      factsHeading: 'Key Specifications & Dialect Support',
      facts: 'The parser complies fully with <strong>RFC 4180</strong> parsing standards for comma-separated values, supporting custom delimiters including tabs, semicolons, and pipes. The engine features automated dialect quoting and type inference heuristics across <strong>MySQL</strong>, <strong>PostgreSQL</strong>, <strong>SQLite</strong>, and <strong>Microsoft SQL Server (T-SQL)</strong>, handling NULL literals, boolean values (TRUE/FALSE vs 1/0), and date-time formats (ISO 8601 vs DATETIME2) with zero data upload to third-party servers.'
    },
    es: {
      heading: 'Cómo funciona: Análisis de CSV y generación de dialectos SQL',
      defQuestion: '¿Qué es un conversor de CSV a SQL?',
      defAnswer: 'Un conversor de CSV a SQL es una utilidad de migración de datos que tokeniza registros tabulares separados por delimitadores según las especificaciones de RFC 4180, deduce los tipos de datos de las columnas y genera sentencias SQL INSERT adaptadas al motor de base de datos de destino. Automatiza la creación del esquema y la conversión de filas por lotes.',
      mechHeading: 'Cómo funciona en el navegador',
      mechIntro: 'AnyConverter procesa tus hojas de cálculo y archivos delimitados directamente en la memoria del navegador mediante una máquina de estados optimizada:',
      steps: [
        '<strong>Análisis léxico según RFC 4180 parsing</strong>: El analizador examina las filas reconociendo comillas de escape, comas incrustadas y saltos de línea dentro de campos entrecomillados siguiendo el estándar RFC 4180.',
        '<strong>Heurísticas de inferencia de tipos (type inference heuristics)</strong>: Las columnas se analizan mediante heurísticas de inferencia de tipos para deducir tipos SQL óptimos (INTEGER, DECIMAL, BOOLEAN, TIMESTAMP o VARCHAR).',
        '<strong>Entrecomillado automático de dialectos (automated dialect quoting)</strong>: Los identificadores y literales aplican entrecomillado automático según dialecto (comillas invertidas en MySQL, comillas dobles en PostgreSQL, corchetes en SQL Server o comillas estándar en SQLite).',
        '<strong>Construcción de sentencias por lotes</strong>: Las filas se agrupan en sentencias INSERT multivalor para acelerar la importación en la base de datos de destino.'
      ],
      factsHeading: 'Especificaciones técnicas y compatibilidad de dialectos',
      facts: 'El analizador cumple rigurosamente con la norma <strong>RFC 4180</strong> (RFC 4180 parsing) para valores separados por comas y admite delimitadores alternativos como tabuladores, puntos y comas o barras verticales. Incorpora automated dialect quoting y type inference heuristics para <strong>MySQL</strong>, <strong>PostgreSQL</strong>, <strong>SQLite</strong> y <strong>Microsoft SQL Server (T-SQL)</strong>, gestionando valores nulos, literales booleanos y formatos temporales sin enviar tus datos fuera de tu equipo.'
    },
    da: {
      heading: 'Hvordan det virker: CSV-parsing og generering af SQL-dialekter',
      defQuestion: 'Hvad er en CSV til SQL-konverter?',
      defAnswer: 'En CSV til SQL-konverter er et alsidigt datamigreringsværktøj, der opdeler afgrænsede tabeldata i henhold til de officielle RFC 4180 parsing-specifikationer, udleder kolonnedatatyper og genererer strukturerede SQL INSERT-sætninger tilpasset specifikke databasemotorer. Værktøjet automatiserer tabelskemaoprettelse, datatypedetektion og batch-transformation af rækker på få millisekunder.',
      mechHeading: 'Hvordan det virker i browseren',
      mechIntro: 'AnyConverter behandler dine regneark og afgrænsede datafiler direkte i browserens hukommelse via en streaming-tilstandsmaskine med høj hastighed:',
      steps: [
        '<strong>RFC 4180 parsing og leksikalsk analyse</strong>: Parseren scanner rækker efter RFC 4180 parsing-standarden og håndterer undvegne anførselstegn, indlejrede kommaer og linjeskift inden for anførselstegn korrekt.',
        '<strong>Type inference heuristics (typeudledning)</strong>: Kolonner evalueres på tværs af rækker via automatiserede type inference heuristics for at fastlægge optimale SQL-typer (INTEGER, DECIMAL, BOOLEAN, TIMESTAMP eller VARCHAR).',
        '<strong>Automated dialect quoting (dialekt-indkapsling)</strong>: Kolonnenavne og værdier indkapsles med automated dialect quoting tilpasset specifikke motorer (MySQL backticks, PostgreSQL dobbelte anførselstegn, SQL Server klammer eller SQLite anførselstegn).',
        '<strong>Batch-sætninger</strong>: Rækker grupperes i multi-værdi INSERT-blokke for at maksimere indlæsningshastigheden i destinationsdatabasen.'
      ],
      factsHeading: 'Tekniske specifikationer og dialektunderstøttelse',
      facts: 'Værktøjet overholder <strong>RFC 4180</strong> (RFC 4180 parsing) for kommaseparerede værdier og understøtter også tabulatorer, semikoloner og pipes som separatorer. Motoren integrerer automated dialect quoting og type inference heuristics til <strong>MySQL</strong>, <strong>PostgreSQL</strong>, <strong>SQLite</strong> og <strong>Microsoft SQL Server (T-SQL)</strong> med korrekt håndtering af NULL-værdier, sandt/falsk-literaler og tidsstempler uden ekstern dataoverførsel.'
    }
  },
  'regex-tester': {
    en: {
      heading: 'How It Works: ECMAScript Regex Engine & Pattern Evaluation',
      defQuestion: 'What is a Regular Expression Tester?',
      defAnswer: 'A regular expression tester is an interactive debugging tool that compiles search patterns against sample text using the browser\'s native ECMAScript RegExp engine, capturing token groups and evaluating match offsets in real time. It enables developers to inspect matches, test boundaries, and validate complex parsing rules.',
      mechHeading: 'How It Works in the Browser',
      mechIntro: 'Our regex workbench compiles patterns in the client runtime using standard V8/SpiderMonkey regex engines for authentic JavaScript runtime parity:',
      steps: [
        '<strong>Pattern Compilation & Flag Handling</strong>: The input pattern is instantiated via <code>new RegExp(pattern, flags)</code> using the ECMAScript RegExp engine, evaluating global (<code>g</code>), case-insensitive (<code>i</code>), multiline (<code>m</code>), dotAll (<code>s</code>), and unicode (<code>u</code>) flag handling.',
        '<strong>Match Group Capturing</strong>: The engine iterates through text matches, performing match group capturing for numbered indices and named capture groups along with exact start and end offsets.',
        '<strong>Non-Destructive Highlighting</strong>: Text slices are wrapped in semantic highlight tags with alternating contrast backgrounds to differentiate consecutive adjacent matches.',
        '<strong>Safety Evaluation</strong>: Evaluation occurs with execution limits to prevent browser lockup from catastrophic backtracking in non-deterministic finite automata (NFA).'
      ],
      factsHeading: 'Key Specifications & Engine Standards',
      facts: 'The tester operates under the official <strong>ECMAScript RegExp (ECMA-262)</strong> engine specification. It fully supports lookahead (<code>(?=...)</code>, <code>(?!...)</code>) and lookbehind (<code>(?<=...)</code>, <code>(?<!...)</code>) assertions, robust match group capturing (<code>(?&lt;name&gt;...)</code>), comprehensive flag handling (<code>gimsuy</code>), Unicode property escapes (<code>\\p{...}</code>), and backreferences. All execution runs locally with zero network latency or text transmission.'
    },
    es: {
      heading: 'Cómo funciona: Motor RegExp de ECMAScript y evaluación de patrones',
      defQuestion: '¿Qué es un verificador de expresiones regulares?',
      defAnswer: 'Un verificador de expresiones regulares es una herramienta interactiva de depuración que compila patrones de búsqueda en texto de prueba mediante el motor nativo ECMAScript RegExp del navegador, capturando grupos y calculando desplazamientos de coincidencia en tiempo real. Permite inspeccionar coincidencias, comprobar límites y validar reglas de extracción complejas.',
      mechHeading: 'Cómo funciona en el navegador',
      mechIntro: 'Nuestro banco de pruebas compila patrones en el entorno local del navegador utilizando los motores estándar V8 o SpiderMonkey para garantizar paridad exacta con JavaScript:',
      steps: [
        '<strong>Compilación con motor ECMAScript RegExp y flag handling</strong>: El patrón se instancia mediante <code>new RegExp(pattern, flags)</code> bajo el motor ECMAScript RegExp engine, admitiendo flag handling para las banderas global (<code>g</code>), insensible a mayúsculas (<code>i</code>), multilínea (<code>m</code>), dotAll (<code>s</code>) y unicode (<code>u</code>).',
        '<strong>Captura de grupos (match group capturing)</strong>: El motor recorre el texto ejecutando match group capturing para grupos de captura numerados y con nombre, calculando índices de inicio y fin.',
        '<strong>Resaltado visual no destructivo</strong>: Los fragmentos coincidentes se delimitan mediante etiquetas de marcado con colores contrastados para distinguir coincidencias consecutivas.',
        '<strong>Protección de ejecución</strong>: La evaluación se ejecuta con límites de seguridad para proteger el navegador frente a bloqueos por retroceso catastrófico (catastrophic backtracking).'
      ],
      factsHeading: 'Especificaciones técnicas y estándares del motor',
      facts: 'El verificador opera bajo la especificación oficial <strong>ECMAScript RegExp (ECMA-262)</strong> engine. Es compatible con aserciones anticipadas (lookahead) y retrospectivas (lookbehind), match group capturing avanzado (<code>(?&lt;nombre&gt;...)</code>), riguroso flag handling, escapes de propiedades Unicode (<code>\\p{...}</code>) y retro-referencias, ejecutándose enteramente en tu equipo con privacidad absoluta.'
    },
    da: {
      heading: 'Hvordan det virker: ECMAScript RegExp-motor og mønsterevaluering',
      defQuestion: 'Hvad er en regulær udtrykstester?',
      defAnswer: 'En regulær udtrykstester er et interaktivt fejlfindingsværktøj, der kompilerer søgemønstre mod tekststrenge ved hjælp af browserens indbyggede ECMAScript RegExp engine, fanger tokengrupper og evaluerer match-positioner i realtid. Værktøjet gør det nemt at inspicere resultater, teste syntaksgrænser og validere avancerede tekstmønstre med høj præcision.',
      mechHeading: 'Hvordan det virker i browseren',
      mechIntro: 'Vores regex-arbejdsbænk kompilerer mønstre i browserens lokale runtime ved hjælp af standard V8/SpiderMonkey-motorer for autentisk JavaScript-funktionalitet:',
      steps: [
        '<strong>Mønsterkompilering og flag handling</strong>: Inputmønsteret instantieres i browserens ECMAScript RegExp engine via <code>new RegExp(pattern, flags)</code> med fuld flag handling af globalt (<code>g</code>), case-insensitivt (<code>i</code>), multiline (<code>m</code>), dotAll (<code>s</code>) og unicode (<code>u</code>) flag.',
        '<strong>Match group capturing</strong>: Motoren gennemgår tekstmatcher og udfører præcis match group capturing for nummererede og navngivne fangstgrupper samt start- og slutindekser.',
        '<strong>Ikke-destruktiv fremhævning</strong>: Tekststykker omsluttes af fremhævningselementer med kontrasterende baggrundsfarver, så på hinanden følgende matcher let skelnes visuelt.',
        '<strong>Udførelsesbeskyttelse</strong>: Evalueringen kører med sikkerhedsgrænser for at forhindre browserfrysning forårsaget af katastrofal backtracking i NFA-motorer.'
      ],
      factsHeading: 'Tekniske specifikationer og motorstandarder',
      facts: 'Testeren følger den officielle <strong>ECMAScript RegExp (ECMA-262)</strong> engine-standard. Den understøtter fuldt ud lookahead- og lookbehind-betingelser, avanceret match group capturing (<code>(?&lt;navn&gt;...)</code>), komplet flag handling (<code>gimsuy</code>), Unicode-egenskabs-escapes (<code>\\p{...}</code>) og backreferences. Hele evalueringen foregår lokalt uden datatransmission over internettet, hvilket beskytter følsomme logfiler og tekstdata.'
    }
  },
  'jwt-decoder': {
    en: {
      heading: 'How It Works: JSON Web Token Architecture & RFC 7519 Decoding',
      defQuestion: 'What is a JSON Web Token (JWT)?',
      defAnswer: 'A JSON Web Token (JWT) is a compact, URL-safe container format defined by RFC 7519 specification that securely transmits cryptographic claims between parties as a JSON object. It consists of three base64url-encoded segments separated by dots: a JOSE header, a payload of claims, and a cryptographic signature claims verification segment.',
      mechHeading: 'How It Works in the Browser',
      mechIntro: 'AnyConverter unpacks and inspects tokens entirely on the client side using standard cryptographic string decoding without secret exposure:',
      steps: [
        '<strong>Segment Splitting</strong>: The compact string is validated and split into its three constituent segments: <code>header.payload.signature</code>.',
        '<strong>Base64URL Decoding & Normalization</strong>: Each segment undergoes Base64URL decoding, converting from URL-safe Base64URL to standard Base64 by substituting <code>-</code> with <code>+</code>, <code>_</code> with <code>/</code>, and calculating required <code>=</code> padding.',
        '<strong>Binary UTF-8 Deserialization</strong>: Decoded bytes are converted through a UTF-8 decoder and parsed into typed JSON objects via <code>JSON.parse()</code>.',
        '<strong>Cryptographic Signature Claims & Timestamps</strong>: Standard cryptographic signature claims (<code>iss</code>, <code>sub</code>, <code>aud</code>, <code>exp</code>, <code>nbf</code>, <code>iat</code>, <code>jti</code>) are parsed from Unix epoch seconds into human-readable ISO 8601 timestamps with active expiration status flags.'
      ],
      factsHeading: 'Key Specifications & Claim Definitions',
      facts: 'The decoder implements specifications from <strong>RFC 7519 specification</strong> (JWT), <strong>RFC 7515</strong> (JSON Web Signature / JWS), and <strong>RFC 7516</strong> (JSON Web Encryption / JWE). It performs Base64URL decoding on standard cryptographic signature claims including <code>iss</code> (issuer), <code>sub</code> (subject), <code>aud</code> (audience), <code>exp</code> (expiration time), <code>nbf</code> (not before), <code>iat</code> (issued at), and <code>jti</code> (JWT ID). All decoding executes locally in browser memory, ensuring sensitive auth tokens and private credentials are never leaked.'
    },
    es: {
      heading: 'Cómo funciona: Arquitectura de JSON Web Tokens y decodificación RFC 7519',
      defQuestion: '¿Qué es un JSON Web Token (JWT)?',
      defAnswer: 'Un JSON Web Token (JWT) es un formato contenedor compacto y seguro para URL definido por la especificación RFC 7519 (RFC 7519 specification) que transmite afirmaciones criptográficas entre partes en forma de objeto JSON. Consta de tres segmentos codificados en Base64URL separados por puntos: una cabecera JOSE, una carga útil de reclamaciones y un segmento de verificación de firma.',
      mechHeading: 'Cómo funciona en el navegador',
      mechIntro: 'AnyConverter descompone e inspecciona tokens de forma totalmente local en tu navegador mediante decodificación criptográfica estándar sin exponer credenciales:',
      steps: [
        '<strong>División de segmentos</strong>: La cadena compacta se valida y se divide en sus tres partes constitutivas: <code>cabecera.carga.firma</code>.',
        '<strong>Decodificación Base64URL (Base64URL decoding)</strong>: Cada segmento se normaliza mediante Base64URL decoding a Base64 estándar sustituyendo <code>-</code> por <code>+</code>, <code>_</code> por <code>/</code> y calculando el relleno necesario con <code>=</code>.',
        '<strong>Deserialización binaria en UTF-8</strong>: Los bytes decodificados se transforman mediante un decodificador UTF-8 en objetos JSON tipados con <code>JSON.parse()</code>.',
        '<strong>Reclamaciones de firma criptográfica (cryptographic signature claims)</strong>: Las marcas de tiempo y cryptographic signature claims (<code>iss</code>, <code>sub</code>, <code>exp</code>, <code>iat</code>) se convierten de segundos Unix a fechas ISO 8601 con cálculo en tiempo real de caducidad.'
      ],
      factsHeading: 'Especificaciones técnicas y definiciones de reclamaciones',
      facts: 'El decodificador aplica las directrices de <strong>RFC 7519 specification</strong> (JWT), <strong>RFC 7515</strong> (JWS) y <strong>RFC 7516</strong> (JWE). Realiza Base64URL decoding de cryptographic signature claims reservadas como <code>iss</code> (emisor), <code>sub</code> (sujeto), <code>aud</code> (audiencia), <code>exp</code> (tiempo de expiración), <code>nbf</code> (no antes de) y <code>iat</code> (emitido en). Todo el procesamiento se realiza en la memoria del navegador, garantizando que los tokens y credenciales de sesión nunca salgan de tu equipo.'
    },
    da: {
      heading: 'Hvordan det virker: JSON Web Token-arkitektur og RFC 7519-afkodning',
      defQuestion: 'Hvad er et JSON Web Token (JWT)?',
      defAnswer: 'Et JSON Web Token (JWT) er et kompakt, URL-sikkert format defineret af RFC 7519 specification, der transmitterer kryptografiske påstande (claims) sikkert mellem parter som et JSON-objekt. Det består af tre base64url-kodede dele adskilt af punktummer: en JOSE-header, en nyttelast af claims og en kryptografisk signatur.',
      mechHeading: 'Hvordan det virker i browseren',
      mechIntro: 'AnyConverter udpakker og inspicerer tokens direkte i browseren ved hjælp af standardiseret strengafkodning uden risiko for datalækage:',
      steps: [
        '<strong>Opdeling af segmenter</strong>: Tokenstrengen valideres og opdeles i dens tre bestanddele: <code>header.payload.signature</code>.',
        '<strong>Base64URL decoding og normalisering</strong>: Hvert segment konverteres via Base64URL decoding til standard Base64 ved at erstatte <code>-</code> med <code>+</code>, <code>_</code> med <code>/</code> og tilføje den nødvendige <code>=</code> udfyldning.',
        '<strong>Binær UTF-8 deserialisering</strong>: De afkodede bytes konverteres via en UTF-8 dekoder til strukturerede JSON-objekter med <code>JSON.parse()</code>.',
        '<strong>Cryptographic signature claims og tidsstempler</strong>: Registrerede cryptographic signature claims som <code>exp</code>, <code>nbf</code>, <code>iat</code>, <code>iss</code> og <code>sub</code> omregnes fra Unix-sekunder til letlæselige ISO 8601-datoer med aktiv udløbsstatus.'
      ],
      factsHeading: 'Tekniske specifikationer og claims-definitioner',
      facts: 'Afkoderen implementerer specifikationerne fra <strong>RFC 7519 specification</strong> (JWT), <strong>RFC 7515</strong> (JWS) og <strong>RFC 7516</strong> (JWE). Den udfører Base64URL decoding på cryptographic signature claims som <code>iss</code> (udsteder), <code>sub</code> (emne), <code>aud</code> (målgruppe), <code>exp</code> (udløb), <code>nbf</code> (ikke før) og <code>iat</code> (udstedt på). Al afkodning sker lokalt i browserens hukommelse, så fortrolige adgangstokens aldrig transmitteres eksternt.'
    }
  },
  'base64-encoder': {
    en: {
      heading: 'How It Works: Base64 Encoding & RFC 4648 Binary Translation',
      defQuestion: 'What is Base64 Encoding?',
      defAnswer: 'Base64 encoding is a binary-to-text translation scheme defined by the RFC 4648 standard that represents arbitrary sequences of 8-bit octets using a restricted set of 64 printable ASCII characters. It enables raw binary files, images, and cryptographic keys to be transmitted safely over text-based channels such as email, JSON APIs, and URLs without data corruption.',
      mechHeading: 'How It Works in the Browser',
      mechIntro: 'Our converter performs high-speed bitwise transformations in the browser using native JavaScript ArrayBuffers and TextEncoder APIs:',
      steps: [
        '<strong>Byte-to-ASCII 6-Bit Translation</strong>: Input text or binary data is converted into an 8-bit byte array. Through byte-to-ASCII 6-bit translation, every three 8-bit bytes (24 bits total) are split into four 6-bit chunks (values from 0 to 63).',
        '<strong>Alphabet Mapping</strong>: Each 6-bit integer indexes into the standard Base64 alphabet: uppercase letters <code>A-Z</code> (0–25), lowercase <code>a-z</code> (26–51), digits <code>0-9</code> (52–61), plus <code>+</code> (62) and <code>/</code> (63).',
        '<strong>Padding Rules</strong>: In accordance with standard padding rules, if the input byte length is not divisible by 3, one or two <code>=</code> characters are appended as padding to complete the final 4-character block.',
        '<strong>URL-Safe Variation Handling</strong>: In URL-safe mode, <code>+</code> is replaced with <code>-</code> and <code>/</code> with <code>_</code> to prevent conflict with URL reserved characters.'
      ],
      factsHeading: 'Key Specifications & Performance Characteristics',
      facts: 'The algorithm strictly adheres to the <strong>RFC 4648 standard</strong> for Base64 and Base64URL. Applying byte-to-ASCII 6-bit translation and rigorous padding rules, Base64 maps 3 bytes of binary data into 4 ASCII characters, introducing a deterministic <strong>33.3% size overhead</strong>. Decoding operations validate character boundaries, reject illegal characters, and reconstruct raw binary octets with zero server involvement.'
    },
    es: {
      heading: 'Cómo funciona: Codificación Base64 y traducción binaria RFC 4648',
      defQuestion: '¿Qué es la codificación Base64?',
      defAnswer: 'La codificación Base64 es un esquema de traducción de binario a texto definido por la norma RFC 4648 (RFC 4648 standard) que representa secuencias arbitrarias de octetos de 8 bits mediante un conjunto restringido de 64 caracteres ASCII imprimibles. Permite transmitir archivos binarios, imágenes y claves criptográficas de forma segura a través de canales basados en texto como correo electrónico, API JSON y URL sin riesgo de corrupción.',
      mechHeading: 'Cómo funciona en el navegador',
      mechIntro: 'Nuestro conversor realiza transformaciones bit a bit de alta velocidad directamente en el navegador mediante ArrayBuffers y TextEncoder nativos:',
      steps: [
        '<strong>Traducción de bytes a ASCII de 6 bits (byte-to-ASCII 6-bit translation)</strong>: Los datos de entrada se convierten en una secuencia de bytes de 8 bits. Mediante byte-to-ASCII 6-bit translation, cada grupo de tres bytes (24 bits) se divide en cuatro fragmentos de 6 bits (valores de 0 a 63).',
        '<strong>Mapeo al alfabeto Base64</strong>: Cada entero de 6 bits se asigna a un carácter del alfabeto estándar: mayúsculas <code>A-Z</code>, minúsculas <code>a-z</code>, dígitos <code>0-9</code>, más <code>+</code> y <code>/</code>.',
        '<strong>Reglas de relleno (padding rules)</strong>: Siguiendo las padding rules estándar, si la longitud de entrada no es múltiplo de 3, se añaden uno o dos caracteres de relleno <code>=</code> para completar el bloque final de 4 caracteres.',
        '<strong>Variante segura para URL</strong>: En modo URL-safe, el signo <code>+</code> se sustituye por <code>-</code> y la barra <code>/</code> por <code>_</code> para evitar conflictos con caracteres reservados en direcciones web.'
      ],
      factsHeading: 'Especificaciones técnicas y rendimiento',
      facts: 'El algoritmo se rige rigurosamente por el <strong>RFC 4648 standard</strong> para Base64 y Base64URL. Aplicando byte-to-ASCII 6-bit translation y estrictas padding rules, Base64 convierte 3 bytes de datos binarios en 4 caracteres ASCII, introduciendo un incremento de tamaño constante del <strong>33,3%</strong>. Las operaciones de decodificación comprueban la validez de los caracteres y reconstruyen los datos originales en la memoria local.'
    },
    da: {
      heading: 'Hvordan det virker: Base64-kodning og RFC 4648-binær oversættelse',
      defQuestion: 'Hvad er Base64-kodning?',
      defAnswer: 'Base64-kodning er en binær-til-tekst oversættelsesstandard defineret af RFC 4648 standard, der repræsenterer vilkårlige sekvenser af 8-bit bytes ved hjælp af et sæt på 64 udskrivelige ASCII-tegn. Det gør det muligt at transmittere rå binære filer, billeder og kryptografiske nøgler sikkert over tekstbaserede protokoller som e-mail, JSON API\'er og URL\'er uden tab af dataintegritet.',
      mechHeading: 'Hvordan det virker i browseren',
      mechIntro: 'Vores konverter udfører lynhurtige bitvise beregninger direkte i browseren via indbyggede JavaScript ArrayBuffers og TextEncoder:',
      steps: [
        '<strong>Byte-to-ASCII 6-bit translation</strong>: Inputtekst eller binære data konverteres til et byte-array. Gennem byte-to-ASCII 6-bit translation opdeles hver gruppe af tre 8-bit bytes (24 bits) i fire 6-bit værdier (fra 0 til 63).',
        '<strong>Kortlægning til alfabetet</strong>: Hver 6-bit værdi omsættes til et tegn i Base64-alfabetet: store bogstaver <code>A-Z</code>, små bogstaver <code>a-z</code>, tal <code>0-9</code> samt <code>+</code> og <code>/</code>.',
        '<strong>Padding rules (udfyldningsregler)</strong>: I henhold til standardiserede padding rules tilføjes ét eller to <code>=</code> tegn, hvis inputmængden ikke går op med 3, for at fuldføre den sidste 4-tegns blok.',
        '<strong>URL-sikker tilstand</strong>: I URL-sikker tilstand erstattes <code>+</code> med <code>-</code> og <code>/</code> med <code>_</code> for at forhindre konflikter i webadresser.'
      ],
      factsHeading: 'Tekniske specifikationer og egenskaber',
      facts: 'Algoritmen følger den officielle <strong>RFC 4648 standard</strong> for Base64 og Base64URL. Ved hjælp af byte-to-ASCII 6-bit translation og konsistente padding rules kodes 3 binære bytes til 4 ASCII-tegn, hvilket medfører en fast <strong>størrelsesforøgelse på 33,3%</strong>. Afkodning validerer tegnsekvensen og genskaber de oprindelige binære data udelukkende på klienten uden serverkald.'
    }
  },
  'url-encoder': {
    en: {
      heading: 'How It Works: RFC 3986 Percent-Encoding & URI Octet Escaping',
      defQuestion: 'What is URL Percent-Encoding?',
      defAnswer: 'URL percent-encoding is a character substitution mechanism defined by RFC 3986 percent-encoding standards that converts non-ASCII characters, whitespace, and reserved delimiters in Uniform Resource Identifiers (URIs) into hexadecimal triplets of the form %XX. It guarantees that query parameters, path components, and headers conform to universal internet addressing standards.',
      mechHeading: 'How It Works in the Browser',
      mechIntro: 'AnyConverter handles URI normalization locally using standards-compliant JavaScript encoding functions and UTF-8 octet serialization:',
      steps: [
        '<strong>Codepoint to UTF-8 Conversion</strong>: Input characters are converted into their variable-length UTF-8 byte sequences (1 to 4 bytes per character).',
        '<strong>Reserved vs. Unreserved Characters Evaluation</strong>: Characters are classified into reserved vs. unreserved characters according to RFC 3986. The unreserved set—letters (<code>A-Z</code>, <code>a-z</code>), digits (<code>0-9</code>), hyphen (<code>-</code>), underscore (<code>_</code>), period (<code>.</code>), and tilde (<code>~</code>)—remains unescaped.',
        '<strong>Hex Triplet Substitution</strong>: All reserved characters and non-ASCII bytes are replaced with a percent sign (<code>%</code>) followed by two uppercase hexadecimal digits representing the byte value.',
        '<strong>Component vs Full URI Differentiation</strong>: Path delimiters like slashes and query delimiters like ampersands can be preserved or escaped based on whether full URI or query parameter encoding is selected.'
      ],
      factsHeading: 'Key Specifications & Reserved Character Rules',
      facts: 'The tool strictly observes <strong>RFC 3986 percent-encoding</strong> specifications and the WHATWG URL standard. It rigorously distinguishes reserved vs. unreserved characters, differentiating between <code>encodeURIComponent()</code> (which escapes reserved delimiters like <code>/</code>, <code>?</code>, <code>&amp;</code>, <code>=</code> for query parameters) and <code>encodeURI()</code> (which preserves protocol and path delimiters for full web addresses). All decoding reconstructs original UTF-8 strings entirely within your browser.'
    },
    es: {
      heading: 'Cómo funciona: Codificación porcentual RFC 3986 y escape de octetos URI',
      defQuestion: '¿Qué es la codificación porcentual de URL?',
      defAnswer: 'La codificación porcentual de URL es un mecanismo de sustitución de caracteres definido por la norma RFC 3986 percent-encoding que convierte caracteres no ASCII, espacios y delimitadores reservados en identificadores uniformes de recursos (URI) en tripletes hexadecimales con el formato %XX. Garantiza que los parámetros de consulta, rutas y cabeceras cumplan los estándares globales de direccionamiento en internet.',
      mechHeading: 'Cómo funciona en el navegador',
      mechIntro: 'AnyConverter procesa la normalización de URI de forma local mediante funciones nativas de JavaScript y serialización de octetos en UTF-8:',
      steps: [
        '<strong>Conversión de puntos de código a UTF-8</strong>: Los caracteres de entrada se transforman en sus secuencias de bytes correspondientes en UTF-8 (de 1 a 4 bytes por carácter).',
        '<strong>Evaluación de caracteres reservados vs. no reservados (reserved vs. unreserved characters)</strong>: Los caracteres se clasifican según RFC 3986. El conjunto de unreserved characters—letras (<code>A-Z</code>, <code>a-z</code>), dígitos (<code>0-9</code>), guion (<code>-</code>), guion bajo (<code>_</code>), punto (<code>.</code>) y tilde (<code>~</code>)—se mantiene intacto.',
        '<strong>Sustitución por tripletes hexadecimales</strong>: Todos los reserved characters y bytes no ASCII se reemplazan por el símbolo de porcentaje (<code>%</code>) seguido de dos dígitos hexadecimales en mayúscula.',
        '<strong>Diferenciación entre componentes y URI completa</strong>: Permite conservar o escapar delimitadores como barras o signos de interrogación según se requiera codificar un parámetro o una URL completa.'
      ],
      factsHeading: 'Especificaciones técnicas y reglas de caracteres reservados',
      facts: 'La herramienta respeta rigurosamente las normas <strong>RFC 3986 percent-encoding</strong> y las directrices WHATWG URL. Distingue con precisión entre reserved vs. unreserved characters, diferenciando entre <code>encodeURIComponent()</code> (que escapa delimitadores como <code>/</code>, <code>?</code>, <code>&amp;</code>, <code>=</code> para valores de consulta) y <code>encodeURI()</code> (que conserva la estructura de rutas completas). Todo el proceso de codificación y decodificación ocurre en tu equipo.'
    },
    da: {
      heading: 'Hvordan det virker: RFC 3986 procent-kodning og URI-oktet-escaping',
      defQuestion: 'Hvad er URL-procentkodning?',
      defAnswer: 'URL-procentkodning er en tegnerstatningsmekanisme defineret af RFC 3986 percent-encoding, der konverterer ikke-ASCII-tegn, mellemrum og reserverede skilletegn i webadresser (URI\'er) til hexadecimale tripletter på formen %XX. Det sikrer, at forespørgselsparametre, stikomponenter og overskrifter overholder internationale internetstandarder.',
      mechHeading: 'Hvordan det virker i browseren',
      mechIntro: 'AnyConverter håndterer URI-normalisering lokalt i browseren ved hjælp af standardiserede JavaScript-funktioner og UTF-8 oktet-serialisering:',
      steps: [
        '<strong>Konvertering til UTF-8</strong>: Inputtegn konverteres til deres tilsvarende sekvenser af UTF-8 bytes (1 til 4 bytes pr. tegn).',
        '<strong>Sondring mellem reserved vs. unreserved characters</strong>: Tegn klassificeres i henhold til RFC 3986. Mængden af unreserved characters—bogstaver (<code>A-Z</code>, <code>a-z</code>), tal (<code>0-9</code>), bindestreg (<code>-</code>), understreg (<code>_</code>), punktum (<code>.</code>) og tilde (<code>~</code>)—bevares uændret.',
        '<strong>Erstatning med hex-tripletter</strong>: Alle reserved characters og ikke-ASCII bytes erstattes med et procenttegn (<code>%</code>) efterfulgt af to store hexadecimale cifre.',
        '<strong>Valg mellem parameter og fuld URI</strong>: Gør det muligt at skelne mellem indkodning af en hel adresse eller isolerede parameterværdier, hvor skråstreger og parametre skal afskærmes.'
      ],
      factsHeading: 'Tekniske specifikationer og reserverede tegn',
      facts: 'Værktøjet følger <strong>RFC 3986 percent-encoding</strong>-specifikationen for URI-syntaks og WHATWG URL-standarden. Det skelner nøje mellem reserved vs. unreserved characters, differentierer mellem <code>encodeURIComponent()</code> (der koder afgrænsere som <code>/</code>, <code>?</code>, <code>&amp;</code>, <code>=</code> til parameterværdier) og <code>encodeURI()</code> (der bevarer protokollen og stien for hele webadresser). Al behandling udføres i din browser uden upload.'
    }
  },
  'hash-generator': {
    en: {
      heading: 'How It Works: Cryptographic Hashing & Web Crypto Digest Algorithms',
      defQuestion: 'What is a Cryptographic Hash Generator?',
      defAnswer: 'A cryptographic hash generator is an information security utility that transforms arbitrary input strings or binary files into fixed-length, deterministic checksum digests using cryptographic algorithms including SHA-256, SHA-512, and MD5 cryptographic digest algorithms. Hash functions are irreversible, one-way mathematical operations designed for integrity verification and password security.',
      mechHeading: 'How It Works in the Browser',
      mechIntro: 'AnyConverter computes message digests directly in your browser using the hardware-accelerated W3C Web Crypto API without uploading data:',
      steps: [
        '<strong>UTF-8 Byte Encoding</strong>: Text input is transformed into an 8-bit unsigned byte array via the native <code>TextEncoder()</code> interface.',
        '<strong>Hardware-Accelerated Web Crypto API Digesting</strong>: For SHA-256 and SHA-512 cryptographic digest algorithms, the byte buffer is processed through <code>crypto.subtle.digest()</code> via the native Web Crypto API, utilizing local hardware acceleration for maximum throughput.',
        '<strong>Hexadecimal Serialization</strong>: The resulting ArrayBuffer digest is mapped byte-by-byte into lowercase hexadecimal strings (2 hex characters per byte).',
        '<strong>Legacy MD5 Computation</strong>: MD5 cryptographic digest algorithms checksums are calculated using a pure client-side bitwise transformation pipeline for legacy checksum comparisons.'
      ],
      factsHeading: 'Key Specifications & Cryptographic Properties',
      facts: 'The hash functions implement <strong>FIPS PUB 180-4</strong> (Secure Hash Standard for SHA-256 and SHA-512) and <strong>RFC 1321</strong> (MD5). SHA-256 produces a 256-bit (32-byte / 64-hex-character) digest with pre-image and strong collision resistance. SHA-512 outputs a 512-bit (64-byte / 128-hex-character) digest suitable for high-security environments. All SHA-256 / SHA-512 / MD5 cryptographic digest algorithms execute locally through the Web Crypto API in browser memory with zero network latency or external exposure.'
    },
    es: {
      heading: 'Cómo funciona: Hashing criptográfico y algoritmos digest de Web Crypto',
      defQuestion: '¿Qué es un generador de hashes criptográficos?',
      defAnswer: 'Un generador de hashes criptográficos es una utilidad de seguridad de la información que transforma cadenas de texto arbitrarias o archivos binarios en resúmenes deterministas de longitud fija mediante SHA-256 / SHA-512 / MD5 cryptographic digest algorithms. Las funciones hash son operaciones matemáticas unidireccionales e irreversibles diseñadas para la comprobación de integridad y seguridad.',
      mechHeading: 'Cómo funciona en el navegador',
      mechIntro: 'AnyConverter calcula resúmenes de mensajes directamente en tu navegador mediante la API W3C Web Crypto API acelerada por hardware sin subir ningún archivo:',
      steps: [
        '<strong>Codificación de bytes en UTF-8</strong>: La entrada de texto se transforma en una secuencia de bytes de 8 bits mediante la interfaz nativa <code>TextEncoder()</code>.',
        '<strong>Digest acelerado mediante Web Crypto API</strong>: Para los algoritmos digest SHA-256 y SHA-512, el búfer de bytes se procesa mediante <code>crypto.subtle.digest()</code> a través de la Web Crypto API, aprovechando la aceleración criptográfica del procesador.',
        '<strong>Serialización hexadecimal</strong>: El ArrayBuffer resultante se convierte byte a byte en una cadena hexadecimal en minúsculas (2 caracteres por cada byte).',
        '<strong>Cálculo compatible de MD5</strong>: Las sumas de comprobación MD5 se calculan mediante un algoritmo bit a bit en el cliente para verificar archivos y registros históricos.'
      ],
      factsHeading: 'Especificaciones técnicas y propiedades criptográficas',
      facts: 'Los algoritmos aplican los estándares <strong>FIPS PUB 180-4</strong> (Secure Hash Standard para SHA-256 y SHA-512) y <strong>RFC 1321</strong> (MD5). SHA-256 genera un resumen de 256 bits (64 caracteres hexadecimales) con resistencia comprobada frente a colisiones. SHA-512 genera un resumen de 512 bits (128 caracteres hexadecimales) para entornos de alta seguridad. Todos los SHA-256 / SHA-512 / MD5 cryptographic digest algorithms se procesan localmente mediante la Web Crypto API en la memoria de tu dispositivo.'
    },
    da: {
      heading: 'Hvordan det virker: Kryptografisk hashing og Web Crypto digest-algoritmer',
      defQuestion: 'Hvad er en kryptografisk hash-generator?',
      defAnswer: 'En kryptografisk hash-generator er et informationssikkerhedsværktøj, der omdanner vilkårlige tekststrenge eller binære filer til deterministiske kontrolsummer med fast længde ved hjælp af SHA-256 / SHA-512 / MD5 cryptographic digest algorithms. Hash-funktioner er envejs matematiske beregninger designet til kontrol af dataintegritet, digitale signaturer og datasikkerhed.',
      mechHeading: 'Hvordan det virker i browseren',
      mechIntro: 'AnyConverter beregner kontrolsummer direkte i din browser via det hardware-accelererede W3C Web Crypto API uden ekstern dataoverførsel eller forsinkelse:',
      steps: [
        '<strong>UTF-8 byte-indkodning</strong>: Tekstinput konverteres til et 8-bit byte-array ved hjælp af det indbyggede <code>TextEncoder()</code> interface.',
        '<strong>Hardware-accelereret Web Crypto API-hashing</strong>: For SHA-256 og SHA-512 cryptographic digest algorithms behandles databufferen gennem <code>crypto.subtle.digest()</code> via Web Crypto API, som udnytter enhedens hardware-acceleration.',
        '<strong>Hexadecimal serialisering</strong>: Det resulterende ArrayBuffer-output konverteres byte for byte til en hexadecimal tekststreng med små bogstaver.',
        '<strong>MD5 kontrolsummer</strong>: MD5 cryptographic digest algorithms beregnes via klientside bitvise operationer til verifikation af ældre systemer og filintegritet.'
      ],
      factsHeading: 'Tekniske specifikationer og kryptografiske egenskaber',
      facts: 'Hash-funktionerne implementerer standarderne <strong>FIPS PUB 180-4</strong> (for SHA-256 og SHA-512) og <strong>RFC 1321</strong> (MD5). SHA-256 genererer en 256-bit (64 hex-tegn) kontrolsum med stærk kollisionsresistens. SHA-512 producerer et 512-bit (128 hex-tegn) output til højsikkerhedsmiljøer. Alle SHA-256 / SHA-512 / MD5 cryptographic digest algorithms eksekveres lokalt via browserens Web Crypto API i enhedens hukommelse uden risiko for datalækage.'
    }
  },
  'cron-expression-parser': {
    en: {
      heading: 'How It Works: Cron Expression Parsing & Schedule Calculation',
      defQuestion: 'What is a Cron Expression Parser?',
      defAnswer: 'A cron expression parser is a job scheduling utility that parses recurring time schedules across POSIX 5-field vs. Quartz 6-field cron syntax specifications, validating token expressions and projecting upcoming execution timestamps. It decodes complex intervals into clear, human-readable descriptions of automated task cadences.',
      mechHeading: 'How It Works in the Browser',
      mechIntro: 'Our scheduling engine parses and calculates recurring time triggers entirely within the browser using deterministic date algorithms:',
      steps: [
        '<strong>Tokenization by Field Position</strong>: The expression string is split into positional components: minute (0–59), hour (0–23), day of month (1–31), month (1–12), and day of week (0–7), with optional seconds (0–59) in Quartz mode, covering POSIX 5-field vs. Quartz 6-field cron syntax.',
        '<strong>Step Values & Operator Expansion</strong>: Range operators (<code>-</code>), list separators (<code>,</code>), and step values (<code>/</code>) are expanded into discrete candidate integer sets for each time dimension.',
        '<strong>Special Wildcards Evaluation</strong>: In Quartz mode, special wildcards such as <code>*</code>, <code>?</code>, <code>L</code> (last day of month/week), <code>W</code> (nearest weekday), and <code>#</code> (nth weekday of month) are resolved against dynamic calendar days.',
        '<strong>Chronological Projection</strong>: The calculation engine advances from the current timestamp minute-by-minute to locate and display the next 5 matching execution dates.'
      ],
      factsHeading: 'Key Specifications & Syntax Standards',
      facts: 'The parser complies with <strong>POSIX IEEE Std 1003.1</strong> standard 5-field cron syntax and supports 6-field and 7-field <strong>Quartz Enterprise Job Scheduler</strong> dialects, addressing differences in POSIX 5-field vs. Quartz 6-field cron syntax. It supports standard wildcards including asterisk (<code>*</code> for every unit) and question mark (<code>?</code> for no specific value), alongside step values. All schedule calculations run purely on the client side in local system time or UTC with zero server dependencies.'
    },
    es: {
      heading: 'Cómo funciona: Análisis de expresiones cron y cálculo de programaciones',
      defQuestion: '¿Qué es un analizador de expresiones cron?',
      defAnswer: 'Un analizador de expresiones cron es una utilidad de planificación de tareas que interpreta programaciones temporales recurrentes en especificaciones POSIX 5-field vs. Quartz 6-field cron syntax, validando expresiones y proyectando próximas ejecuciones. Traduce intervalos de tiempo técnicos en descripciones claras y comprensibles para humanos.',
      mechHeading: 'Cómo funciona en el navegador',
      mechIntro: 'Nuestro motor de planificación interpreta y proyecta programaciones temporales de forma interactiva en tu navegador mediante algoritmos de calendario:',
      steps: [
        '<strong>Tokenización posicional de campos</strong>: La expresión se descompone en sus componentes: minuto (0–59), hora (0–23), día del mes (1–31), mes (1–12) y día de la semana (0–7), con segundos opcionales, abarcando POSIX 5-field vs. Quartz 6-field cron syntax.',
        '<strong>Valores de paso (step values) y operadores</strong>: Los operadores de rango (<code>-</code>), listas separadas por comas (<code>,</code>) y step values (<code>/</code>) se expanden en conjuntos numéricos para cada unidad.',
        '<strong>Evaluación de comodines (wildcards)</strong>: En modo Quartz, comodines especiales (wildcards) como <code>*</code>, <code>?</code>, <code>L</code> (último día), <code>W</code> (día laborable más cercano) y <code>#</code> (enésimo día de la semana) se resuelven contra el calendario.',
        '<strong>Proyección cronológica</strong>: El motor avanza temporalmente desde el momento actual para identificar y proyectar con precisión las próximas 5 fechas de ejecución.'
      ],
      factsHeading: 'Especificaciones técnicas y estándares de sintaxis',
      facts: 'El analizador es plenamente compatible con la norma <strong>POSIX IEEE Std 1003.1</strong> de 5 campos y con el formato de 6 campos de <strong>Quartz Enterprise Job Scheduler</strong>, resolviendo diferencias entre POSIX 5-field vs. Quartz 6-field cron syntax. Admite comodines (wildcards) fundamentales como el asterisco (<code>*</code> para todos los valores) y el signo de interrogación (<code>?</code> para valor indefinido), además de step values. Todos los cálculos se efectúan en la memoria del navegador sin transmitir datos a servidores externos.'
    },
    da: {
      heading: 'Hvordan det virker: Parsing af cron-udtryk og tidsplanberegning',
      defQuestion: 'Hvad er en cron-udtryk-parser?',
      defAnswer: 'En cron-udtryk-parser er et planlægningsværktøj, der analyserer tilbagevendende tidsplaner på tværs af POSIX 5-field vs. Quartz 6-field cron syntax-specifikationer, validerer token-udtryk og beregner kommende kørselstidspunkter. Værktøjet omsætter tekniske tidsmønstre til letforståelige tekstbeskrivelser af automatiserede opgaver.',
      mechHeading: 'Hvordan det virker i browseren',
      mechIntro: 'Vores planlægningsmotor fortolker og beregner gentagne tidsintervaller direkte i browseren via deterministiske kalenderaloritmer:',
      steps: [
        '<strong>Positionsbestemt felt-tokenisering</strong>: Udtrykket opdeles i dets felter: minut (0–59), time (0–23), dag i måned (1–31), måned (1–12) og ugedag (0–7) samt valgfri sekunder i Quartz-tilstand under POSIX 5-field vs. Quartz 6-field cron syntax.',
        '<strong>Trinværdier (step values) og operator-udvidelse</strong>: Rækkevidde-operatorer (<code>-</code>), lister (<code>,</code>) og step values (<code>/</code>) udvides til konkrete heltalsmængder for hver tidsenhed.',
        '<strong>Evaluering af jokertegn (wildcards)</strong>: I Quartz-tilstand evalueres wildcards som <code>*</code>, <code>?</code>, <code>L</code> (sidste dag), <code>W</code> (nærmeste hverdag) og <code>#</code> (n\'te ugedag) i forhold til den reelle kalender.',
        '<strong>Fremskrivning af kørsler</strong>: Beregningsmotoren simulerer tidsforløbet fra det aktuelle tidspunkt for at finde og vise de næste 5 kørselstidspunkter.'
      ],
      factsHeading: 'Tekniske specifikationer og syntaksstandarder',
      facts: 'Parseren overholder <strong>POSIX IEEE Std 1003.1</strong> standarden for 5-felters cron samt dialekten fra <strong>Quartz Enterprise Job Scheduler</strong> med 6 felter, hvilket muliggør fuld forståelse af POSIX 5-field vs. Quartz 6-field cron syntax. Den understøtter klassiske wildcards som stjerne (<code>*</code> for enhver værdi) og spørgsmålstegn (<code>?</code> for uspecificeret værdi) samt step values. Al tidsberegning sker udelukkende på klienten uden serverkald.'
    }
  },
  'xml-formatter': {
    en: {
      heading: 'How It Works: XML Parsing, DOM Serialization & Tree Formatting',
      defQuestion: 'What is an XML Formatter?',
      defAnswer: 'An XML formatter is a markup utility that parses extensible markup documents using the browser\'s native DOMParser, validates XML well-formedness according to W3C specifications, and serializes elements into uniform indentation hierarchies. It reformats unindented or compressed XML structures into readable trees while preserving tag attributes and text nodes.',
      mechHeading: 'How It Works in the Browser',
      mechIntro: 'Our formatting engine parses and cleans XML documents locally using native browser XML document parsers without external dependencies:',
      steps: [
        '<strong>W3C DOMParser Instantiation</strong>: The raw XML string is parsed using the native <code>new DOMParser().parseFromString(xml, "application/xml")</code> into a structured XML Document Object Model.',
        '<strong>Well-Formedness Error Detection</strong>: The DOMParser checks for <code>parsererror</code> nodes generated on mismatched tags, unclosed elements, or invalid characters, reporting exact line error messages.',
        '<strong>Recursive Indentation Hierarchies</strong>: The DOM tree is traversed recursively to establish clean indentation hierarchies, calculating nesting levels and injecting consistent whitespace (2 spaces, 4 spaces, or tabs) between parent and child elements.',
        '<strong>CDATA & XML Entity Escaping</strong>: Text nodes and CDATA sections are safely preserved, performing CDATA & XML entity escaping (<code>&amp;amp;</code>, <code>&amp;lt;</code>, <code>&amp;gt;</code>, <code>&amp;quot;</code>, <code>&amp;apos;</code>) without unintended corruption.'
      ],
      factsHeading: 'Key Specifications & W3C Standards',
      facts: 'The tool adheres to the <strong>W3C XML 1.0 (Fifth Edition)</strong> specification and <strong>DOM Level 3 Core</strong> standards. Valid XML requires a single root element, strictly matched closing tags, case-sensitive element names, consistent indentation hierarchies, and rigorous CDATA & XML entity escaping. All formatting, minification, and downloads execute locally via DOMParser in your browser memory with 100% privacy and zero data transfer.'
    },
    es: {
      heading: 'Cómo funciona: Análisis XML, serialización DOM y formateo de árboles',
      defQuestion: '¿Qué es un formateador de XML?',
      defAnswer: 'Un formateador de XML es una utilidad de marcado que analiza documentos de marcado extensible utilizando el DOMParser nativo del navegador, valida que el XML esté bien formado según las especificaciones del W3C y serializa los elementos en jerarquías de indentación uniformes (indentation hierarchies). Reorganiza estructuras XML comprimidas o desordenadas en árboles legibles manteniendo atributos y nodos de texto.',
      mechHeading: 'Cómo funciona en el navegador',
      mechIntro: 'Nuestro motor de formateo analiza y limpia documentos XML localmente utilizando el analizador nativo del navegador sin dependencias externas:',
      steps: [
        '<strong>Instanciación de DOMParser del W3C</strong>: La cadena XML se analiza con el DOMParser nativo mediante <code>new DOMParser().parseFromString(xml, "application/xml")</code> en un modelo de objetos del documento XML.',
        '<strong>Detección de errores de sintaxis</strong>: El motor DOMParser busca nodos de tipo <code>parsererror</code> generados por etiquetas mal cerradas o caracteres ilegales, señalando el error con precisión.',
        '<strong>Jerarquías de indentación recursivas (indentation hierarchies)</strong>: El árbol DOM se recorre recursivamente construyendo indentation hierarchies, calculando los niveles de anidamiento e insertando espacios uniformes (2 espacios, 4 espacios o tabulaciones).',
        '<strong>Escapado de entidades y CDATA (CDATA & XML entity escaping)</strong>: Los bloques CDATA y nodos de texto se conservan intactos, aplicando CDATA & XML entity escaping (<code>&amp;amp;</code>, <code>&amp;lt;</code>, <code>&amp;gt;</code>, <code>&amp;quot;</code>, <code>&amp;apos;</code>) sin alteraciones no deseadas.'
      ],
      factsHeading: 'Especificaciones técnicas y estándares del W3C',
      facts: 'La herramienta cumple rigurosamente con la recomendación <strong>W3C XML 1.0 (Quinta Edición)</strong> y los estándares <strong>DOM Level 3 Core</strong>. Un documento XML válido exige un único elemento raíz, etiquetas de cierre coincidentes, indentation hierarchies uniformes y CDATA & XML entity escaping correcto. Todo el formateo, minificación y descarga de archivos se ejecuta mediante DOMParser en la memoria local con absoluta privacidad.'
    },
    da: {
      heading: 'Hvordan det virker: XML-parsing, DOM-serialisering og træ-formatering',
      defQuestion: 'Hvad er en XML-formaterer?',
      defAnswer: 'En XML-formaterer er et markup-værktøj, der analyserer extensible markup-dokumenter ved hjælp af browserens indbyggede DOMParser, validerer XML-velformethed i henhold til W3C-specifikationerne og serialiserer elementer i ensartede indrykningshierarkier (indentation hierarchies). Værktøjet genskaber komprimerede eller ustrukturerede XML-filer til overskuelige strukturer med bevarelse af attributter og tekstnoder.',
      mechHeading: 'Hvordan det virker i browseren',
      mechIntro: 'Vores formateringsmotor analyserer og strukturerer XML-dokumenter lokalt i browseren ved hjælp af standard XML-dokumentparsere uden eksterne biblioteker:',
      steps: [
        '<strong>W3C DOMParser-instantiering</strong>: XML-strengen parses via browserens indbyggede DOMParser med <code>new DOMParser().parseFromString(xml, "application/xml")</code> til en fuldstændig XML Document Object Model.',
        '<strong>Fejlfinding og velformethed</strong>: DOMParser opdager <code>parsererror</code>-noder ved uoverensstemmende tags eller ulovlige tegn og rapporterer præcise fejlmeddelelser.',
        '<strong>Rekursive indrykningshierarkier (indentation hierarchies)</strong>: DOM-træet gennemgås rekursivt for at opbygge indentation hierarchies, beregne indlejringsniveauer og indsætte ensartede indrykninger (2 mellemrum, 4 mellemrum eller tabulator).',
        '<strong>CDATA & XML entity escaping</strong>: Tekstafsnit og CDATA-blokke bevares uden ændringer, og korrekt CDATA & XML entity escaping (<code>&amp;amp;</code>, <code>&amp;lt;</code>, <code>&amp;gt;</code>, <code>&amp;quot;</code>, <code>&amp;apos;</code>) sikrer fuldkommen dataintegritet.',
        '<strong>Klientbaseret eksekvering</strong>: Behandlingen sker lokalt i browserens hukommelse uden overførsel til eksterne servere.'
      ],
      factsHeading: 'Tekniske specifikationer og W3C-standarder',
      facts: 'Værktøjet overholder <strong>W3C XML 1.0 (Fifth Edition)</strong>-standarden og <strong>DOM Level 3 Core</strong>-specifikationerne. Gyldig XML kræver ét enkelt rodelement, strengt lukkede tags, case-sensitive elementnavne, velstrukturerede indentation hierarchies og præcis CDATA & XML entity escaping. Al formatering, komprimering og eksport udføres lokalt via DOMParser i din browsers hukommelse med 100% databeskyttelse.'
    }
  }
};

function generateSectionHtml(toolKey, lang) {
  const data = S22_CONTENT[toolKey][lang];
  const stepsHtml = data.steps.map(s => `        <li>${s}</li>`).join('\n');
  return `    <section class="how-it-works" id="how-it-works">
      <h2>${data.heading}</h2>

      <h3>${data.defQuestion}</h3>
      <p>${data.defAnswer}</p>

      <h3>${data.mechHeading}</h3>
      <p>${data.mechIntro}</p>
      <ol class="how-it-works-steps">
${stepsHtml}
      </ol>

      <h3>${data.factsHeading}</h3>
      <p>${data.facts}</p>
    </section>`;
}

function countWords(html) {
  const plainText = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plainText.split(/\s+/).filter(Boolean).length;
}

const REQUIRED_TERMS = {
  'json-formatter': ['RFC 8259', 'tree serialization', 'streaming parser'],
  'json-compare': ['Myers diff algorithm', 'structural key alignment', 'array order heuristics'],
  'csv-to-sql': ['RFC 4180', 'automated dialect quoting', 'type inference heuristics'],
  'regex-tester': ['ECMAScript RegExp', 'flag handling', 'match group capturing'],
  'jwt-decoder': ['RFC 7519', 'Base64URL decoding', 'cryptographic signature claims'],
  'base64-encoder': ['RFC 4648', 'byte-to-ASCII 6-bit translation', 'padding rules'],
  'url-encoder': ['RFC 3986', 'percent-encoding', 'reserved vs. unreserved characters'],
  'hash-generator': ['SHA-256', 'Web Crypto API'],
  'cron-expression-parser': ['POSIX 5-field vs. Quartz 6-field', 'step values', 'wildcards'],
  'xml-formatter': ['DOMParser', 'indentation hierarchies', 'CDATA & XML entity escaping']
};

console.log('Testing S22 Content generation, word counts, and citations...\n');
let allPass = true;
const tools = Object.keys(S22_CONTENT);
const langs = ['en', 'es', 'da'];

for (const t of tools) {
  for (const l of langs) {
    const sec = generateSectionHtml(t, l);
    const wc = countWords(sec);
    const hasRequiredHeadings = sec.includes('<h2>') && (sec.match(/<h3>/g) || []).length >= 3;
    const required = REQUIRED_TERMS[t];
    const missingTerms = required.filter(term => !sec.toLowerCase().includes(term.toLowerCase()));
    const pass = (wc >= 200 && wc <= 500) && hasRequiredHeadings && missingTerms.length === 0;
    if (!pass) allPass = false;
    console.log(`[${t} | ${l}] Words: ${wc} | Missing Terms: [${missingTerms.join(', ')}] | Headings: ${hasRequiredHeadings} => ${pass ? 'PASS' : 'FAIL'}`);
  }
}

console.log('\nOverall content test result:', allPass ? 'ALL PASS' : 'SOME FAILED');

module.exports = {
  S22_CONTENT,
  REQUIRED_TERMS,
  generateSectionHtml,
  countWords
};
