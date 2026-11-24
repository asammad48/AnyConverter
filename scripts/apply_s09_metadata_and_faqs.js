#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const s09Data = [
  // ==========================================
  // SPANISH COHORT (Top 10 ES Tools)
  // ==========================================
  {
    path: 'es/sticky-notes/index.html',
    slug: 'sticky-notes',
    locale: 'es',
    isDc: false,
    heading: 'Preguntas Frecuentes',
    title: 'Notas Adhesivas Online Gratis | AnyConverter',
    desc: 'Crea notas adhesivas online gratis con guardado automático local. Organiza tus ideas por colores, fija notas clave y exporta en TXT o JSON sin registro.',
    faqs: [
      {
        q: '¿Son privadas mis notas adhesivas online?',
        a: 'Sí. Todas tus notas se guardan únicamente en el almacenamiento local de tu navegador. Ningún dato se envía ni se almacena en servidores externos.'
      },
      {
        q: '¿Cómo puedo hacer una copia de seguridad de mis notas?',
        a: 'Puedes exportar tus notas adhesivas en formato TXT o JSON en cualquier momento mediante los botones de exportación y restaurarlas cuando lo necesites.'
      },
      {
        q: '¿Puedo organizar y filtrar las notas por colores?',
        a: 'Sí. Dispones de seis colores distintos para categorizar tus notas y filtros rápidos en la barra superior para visualizar únicamente las notas de un color.'
      },
      {
        q: '¿Se pierden mis notas al cerrar la pestaña o el navegador?',
        a: 'No. Las notas permanecen guardadas en tu navegador gracias a localStorage y se recargan automáticamente cuando vuelves a abrir la página.'
      },
      {
        q: '¿Puedo fijar notas prioritarias en la parte superior?',
        a: 'Sí. Puedes pulsar el icono de chincheta en cualquier tarjeta para fijar notas importantes en la parte superior del tablero sin importar el orden.'
      }
    ]
  },
  {
    path: 'es/monitor-color-test/index.html',
    slug: 'monitor-color-test',
    locale: 'es',
    isDc: false,
    heading: 'Preguntas Frecuentes',
    title: 'Monitor Color Test Online Gratis | AnyConverter',
    desc: 'Ejecuta monitor color test online gratis a pantalla completa. Evalúa pureza de color, degradados uniformes y detecta puntos defectuosos en tu pantalla.',
    faqs: [
      {
        q: '¿Cómo inicio la prueba de monitor color test a pantalla completa?',
        a: 'Selecciona cualquier modo de prueba en el panel y pulsa el botón de pantalla completa o la tecla F11 para inspeccionar la superficie de tu monitor sin distracciones.'
      },
      {
        q: '¿Cómo detecto píxeles atascados o defectuosos en mi pantalla?',
        a: 'Alterna entre fondos de colores primarios completos (rojo, verde, azul, blanco y negro) y examina visualmente el panel para identificar puntos que no cambien de color.'
      },
      {
        q: '¿Qué indica la prueba de degradados y uniformidad de color?',
        a: 'Muestra transiciones suaves de tonalidad para verificar si tu pantalla sufre de bandeado de color (banding) o problemas de calibración en la profundidad de bits.'
      },
      {
        q: '¿Funciona esta prueba de monitor en teléfonos móviles y tabletas?',
        a: 'Sí. La herramienta se ejecuta en cualquier navegador moderno y adapta la superficie de prueba al área visible de tu pantalla en ordenadores, portátiles y móviles.'
      },
      {
        q: '¿Se instala algún software para realizar el test de pantalla?',
        a: 'No. Todo el análisis visual se ejecuta directamente en tu navegador web mediante código ligero, sin descargas, complementos ni registros requeridos.'
      }
    ]
  },
  {
    path: 'es/base64-encoder/index.html',
    slug: 'base64-encoder',
    locale: 'es',
    isDc: false,
    heading: 'Preguntas Frecuentes',
    title: 'Codificar Base64 Online Gratis | AnyConverter',
    desc: 'Convierte texto plano a Base64 online gratis y decodifica código Base64 a texto al instante. Codificador rápido, seguro y procesado en tu navegador.',
    faqs: [
      {
        q: '¿Cómo convertir texto plano a Base64 online gratis?',
        a: 'Introduce o pega tu texto en el campo superior y la herramienta generará inmediatamente la cadena codificada en Base64 con compatibilidad completa para caracteres UTF-8.'
      },
      {
        q: '¿Para qué se utiliza la codificación Base64?',
        a: 'Se emplea para representar datos binarios o texto especial utilizando únicamente caracteres ASCII imprimibles, facilitando su transporte en protocolos como HTTP, JSON y correo electrónico.'
      },
      {
        q: '¿Es Base64 un método de cifrado de seguridad?',
        a: 'No. Base64 es un formato de codificación y transporte abierto, no un algoritmo de cifrado. Cualquier persona puede decodificar una cadena Base64 sin necesitar claves.'
      },
      {
        q: '¿Soporta caracteres especiales, tildes y símbolos en español?',
        a: 'Sí. El codificador utiliza codificación UTF-8 estándar, garantizando que caracteres acentuados, eñes y signos de puntuación se codifiquen y decodifiquen sin errores.'
      },
      {
        q: '¿Se transmiten mis textos a servidores externos durante la conversión?',
        a: 'No. La conversión entre texto plano y Base64 se ejecuta exclusivamente en tu navegador mediante JavaScript local, garantizando privacidad en tus datos.'
      }
    ]
  },
  {
    path: 'es/ocr-pdf/index.html',
    slug: 'ocr-pdf',
    locale: 'es',
    isDc: false,
    heading: 'Preguntas Frecuentes',
    title: 'OCR PDF Online Gratis — Extraer Texto de PDF | AnyConverter',
    desc: 'Usa OCR PDF online gratis para escanear y convertir documentos PDF en texto editable y seleccionable. Extrae contenido con precisión en tu navegador.',
    faqs: [
      {
        q: '¿Cómo funciona el reconocimiento óptico de caracteres (OCR) en PDF?',
        a: 'El motor OCR examina las imágenes y escaneos de cada página del PDF, identifica las formas tipográficas de las letras y las transforma en texto seleccionable y editable.'
      },
      {
        q: '¿Por qué el proceso de OCR en PDFs escaneados puede tardar unos segundos?',
        a: 'El procesamiento requiere analizar píxel por píxel cada imagen y ejecutar redes neuronales de reconocimiento visual directamente en los recursos de tu navegador.'
      },
      {
        q: 'Si el texto de mi PDF ya es seleccionable, ¿necesito aplicar OCR?',
        a: 'No. Si puedes seleccionar y copiar texto con el cursor en un lector común, el archivo ya contiene texto vectorial y no requiere reconocimiento óptico de caracteres.'
      },
      {
        q: '¿Qué idiomas reconoce el motor OCR integrado?',
        a: 'El sistema incluye reconocimiento de caracteres para español, inglés y las principales lenguas europeas, admitiendo tildes, signos de puntuación y números.'
      },
      {
        q: '¿Se suben mis documentos confidenciales a servidores externos?',
        a: 'No. El motor OCR se ejecuta localmente en tu navegador web mediante WebAssembly, por lo que tus archivos y su contenido de texto se procesan en tu equipo.'
      }
    ]
  },
  {
    path: 'es/pdf-merge/index.html',
    slug: 'pdf-merge',
    locale: 'es',
    isDc: true,
    heading: 'Preguntas frecuentes',
    title: 'Unir PDF Online Gratis — Juntar Archivos PDF | AnyConverter',
    desc: 'Une varios archivos PDF online gratis en un solo documento. Ordena páginas, elimina las que sobren y descarga tu archivo combinado desde el navegador.',
    faqs: [
      {
        q: '¿Cuántos archivos PDF puedo unir a la vez?',
        a: 'No hay un límite fijo de archivos. En documentos muy extensos con cientos de páginas escaneadas, la capacidad depende de la memoria disponible en tu dispositivo.'
      },
      {
        q: '¿Se suben mis documentos PDF a algún servidor externo?',
        a: 'No. Los archivos se leen y combinan localmente en tu navegador web mediante librerías de cliente, por lo que ningún documento se transmite a servidores externos.'
      },
      {
        q: '¿Puedo seleccionar y unir solo páginas específicas de un archivo PDF?',
        a: 'Sí. Puedes abrir el archivo en la lista y pulsar sobre las páginas individuales que desees excluir para que no aparezcan en el PDF resultante.'
      },
      {
        q: '¿Pierde calidad o resolución el documento PDF combinado?',
        a: 'No. Las páginas vectoriales y mapas de bits se transfieren en su estado original sin recompresión destructiva ni alteraciones tipográficas.'
      },
      {
        q: '¿Para qué sirve la opción de páginas en blanco para impresión a doble cara?',
        a: 'Añade una página en blanco tras los documentos con número impar de páginas, permitiendo que cada nuevo archivo comience en una hoja frontal al imprimir.'
      }
    ]
  },
  {
    path: 'es/rotate-pdf/index.html',
    slug: 'rotate-pdf',
    locale: 'es',
    isDc: true,
    heading: 'Preguntas frecuentes',
    title: 'Rotar PDF Online Gratis — Girar Páginas PDF | AnyConverter',
    desc: 'Gira y rota páginas PDF online gratis en tu navegador. Corrige la orientación de páginas sueltas o de todo el documento y guarda los cambios sin coste.',
    faqs: [
      {
        q: '¿Cómo puedo girar solo una página específica de mi PDF?',
        a: 'Pulsa sobre la miniatura de esa página concreta. Cada pulsación rota la página 90 grados en el sentido de las agujas del reloj de forma independiente.'
      },
      {
        q: '¿La rotación de páginas reduce la calidad del documento?',
        a: 'No. La herramienta modifica únicamente los metadatos de orientación de la página en la estructura del PDF, conservando textos e imágenes intactos.'
      },
      {
        q: '¿El cambio de orientación se guarda de forma permanente en el nuevo PDF?',
        a: 'Sí. Al descargar el documento procesado, la nueva orientación queda registrada de forma definitiva y se abrirá correctamente en cualquier lector o visor.'
      },
      {
        q: '¿Se transfieren mis archivos PDF a servidores externos para girarlos?',
        a: 'No. Toda la manipulación del documento se ejecuta en tu propio navegador mediante librerías JavaScript locales, garantizando la privacidad de tus datos.'
      },
      {
        q: '¿Puedo enderezar automáticamente páginas que salieron torcidas al escanear?',
        a: 'Sí. La función de orientación vertical identifica las páginas apaisadas y las gira automáticamente para dejarlas alineadas en formato vertical estándar.'
      }
    ]
  },
  {
    path: 'es/text-diff-checker/index.html',
    slug: 'text-diff-checker',
    locale: 'es',
    isDc: false,
    heading: 'Preguntas Frecuentes',
    title: 'Comparador de Textos Online Gratis | AnyConverter',
    desc: 'Compara dos textos online gratis lado a lado con el comparador de textos. Detecta cambios, adiciones y diferencias línea por línea sin instalar nada.',
    faqs: [
      {
        q: '¿Cómo funciona el comparador de textos para detectar diferencias?',
        a: 'La herramienta analiza ambos textos línea por línea o palabra por palabra mediante algoritmos de diferenciación, resaltando añadidos en verde y eliminaciones en rojo.'
      },
      {
        q: '¿Se envían mis textos o códigos a servidores externos al comparar?',
        a: 'No. La comparación se calcula íntegramente en tu navegador web mediante JavaScript local, por lo que ninguna línea de texto se transmite a servidores ajenos.'
      },
      {
        q: '¿Puedo comparar archivos de código fuente, JSON o Markdown?',
        a: 'Sí. Puedes pegar cualquier fragmento de código, scripts en Python, JavaScript, HTML, CSS o JSON para detectar cambios y revisiones entre dos versiones.'
      },
      {
        q: '¿Existe un límite en la cantidad de palabras o líneas que puedo comparar?',
        a: 'No existe un límite estricto impuesto por la aplicación. Puedes comparar miles de líneas de texto con alta velocidad según la capacidad de tu dispositivo.'
      },
      {
        q: '¿Qué significa la vista de diferencias lado a lado frente a la vista unificada?',
        a: 'La vista lado a lado coloca las dos versiones en columnas paralelas para cotejo visual directo, mientras que la vista unificada muestra los cambios en un único bloque continuo.'
      }
    ]
  },
  {
    path: 'es/compare-pdf/index.html',
    slug: 'compare-pdf',
    locale: 'es',
    isDc: false,
    heading: 'Preguntas Frecuentes',
    title: 'Comparar PDF Online Gratis — Ver Diferencias | AnyConverter',
    desc: 'Compara dos documentos PDF online gratis lado a lado en tu navegador. Coteja páginas sincronizadas, revisa cambios visuales y textos sin registro.',
    faqs: [
      {
        q: '¿Cómo puedo comparar dos documentos PDF online gratis?',
        a: 'Carga el archivo original y la versión modificada en los paneles correspondientes. La herramienta sincroniza la vista de páginas para revisar diferencias lado a lado.'
      },
      {
        q: '¿Pueden los dos documentos PDF tener distinto número de páginas?',
        a: 'Sí. Puedes navegar de manera independiente o bloquear la sincronización de desplazamiento para contrastar secciones específicas aunque tengan longitudes distintas.'
      },
      {
        q: '¿Resalta la herramienta las diferencias de texto de manera automática?',
        a: 'La aplicación ofrece visualización sincronizada de alta resolución para cotejar cambios de maquetación, tipografía, párrafos y elementos gráficos entre versiones.'
      },
      {
        q: '¿Qué formatos y tamaños de archivo PDF son compatibles?',
        a: 'Admite cualquier documento PDF estándar generado por procesadores de texto, escáneres o aplicaciones de diseño sin restricciones arbitrarias de tamaño.'
      },
      {
        q: '¿Se transmiten mis archivos PDF a servidores durante la comparación?',
        a: 'No. La renderización y el análisis de páginas se procesan localmente en tu navegador web mediante librerías de cliente, protegiendo tus documentos.'
      }
    ]
  },
  {
    path: 'es/edit-pdf/index.html',
    slug: 'edit-pdf',
    locale: 'es',
    isDc: false,
    heading: 'Preguntas frecuentes',
    title: 'Editar PDF Online Gratis — Anotar y Firmar | AnyConverter',
    desc: 'Edita archivos PDF online gratis en tu navegador. Agrega texto, dibuja formas, resalta párrafos clave y descarga tu documento listo sin registros.',
    faqs: [
      {
        q: '¿Cómo puedo editar un archivo PDF online gratis sin instalar programas?',
        a: 'Carga tu documento PDF en la herramienta, selecciona las utilidades de texto, dibujo o resaltado sobre las páginas deseadas y descarga la versión actualizada al terminar.'
      },
      {
        q: '¿Puedo modificar el texto ya existente dentro de las páginas del PDF?',
        a: 'Puedes agregar nuevos bloques de texto, notas, firmas y tapar o resaltar contenido existente, respetando la estructura gráfica original del documento.'
      },
      {
        q: '¿Cómo se colocan las firmas o notas en las coordenadas exactas de la página?',
        a: 'Haz clic sobre el punto exacto del documento donde quieras situar la anotación o arrastra los elementos visuales hasta ajustarlos a la posición requerida.'
      },
      {
        q: '¿Es seguro editar contratos o documentos personales en esta herramienta?',
        a: 'Sí. Toda la edición y composición de anotaciones se realiza en el entorno de tu navegador web sin transmitir tus archivos a servidores de terceros.'
      },
      {
        q: '¿Se añade alguna marca de agua en los documentos PDF editados?',
        a: 'No. Los archivos descargados permanecen limpios y fieles al diseño original, sin marcas de agua, logotipos añadidos ni cobros por exportación.'
      }
    ]
  },
  {
    path: 'es/json-formatter/index.html',
    slug: 'json-formatter',
    locale: 'es',
    isDc: false,
    heading: 'Preguntas Frecuentes',
    title: 'Formateador JSON Online Gratis — Validador | AnyConverter',
    desc: 'Formatea, valida y minifica código JSON online gratis en tu navegador. Árbol interactivo, sangría limpia, búsqueda rápida y sin enviar datos fuera.',
    faqs: [
      {
        q: '¿Qué es un formateador JSON y para qué sirve?',
        a: 'Es una utilidad que toma estructuras de datos JSON sin formato o comprimidas y las organiza con sangría legible e indentación limpia para facilitar su lectura.'
      },
      {
        q: '¿Cómo valida esta herramienta errores sintácticos en cadenas JSON?',
        a: 'El validador analiza el código en tiempo real, señalando la línea exacta y la causa del fallo (como comas sobrantes o comillas ausentes) antes de formatear.'
      },
      {
        q: '¿Cuál es la diferencia entre formatear y minificar JSON?',
        a: 'Formatear añade saltos de línea y espacios para lectura humana, mientras que minificar elimina todos los espacios en blanco innecesarios para optimizar el tamaño.'
      },
      {
        q: '¿Puedo explorar estructuras de datos grandes en vista de árbol interactivo?',
        a: 'Sí. Puedes plegar y desplegar nodos, buscar propiedades por clave o valor y navegar fácilmente por objetos y matrices complejas sin pérdida de rendimiento.'
      },
      {
        q: '¿Se procesan mis datos JSON en servidores externos?',
        a: 'No. La validación, formateo y minificación se ejecutan estrictamente en tu navegador mediante JavaScript local, garantizando la privacidad de tu información.'
      }
    ]
  },

  // ==========================================
  // DANISH COHORT (Top 10 DA Tools)
  // ==========================================
  {
    path: 'da/mortgage-calculator/index.html',
    slug: 'mortgage-calculator',
    locale: 'da',
    isDc: false,
    heading: 'Ofte stillede spørgsmål',
    title: 'Realkreditberegner Online Gratis | AnyConverter',
    desc: 'Beregn boliglånsbetalinger, rente, samlet pris og amortisering med en praktisk browserbaseret beregner. Med klare trin, praktiske resultater og ingen konto.',
    faqs: [
      {
        q: 'Hvordan beregnes den månedlige realkreditbetaling?',
        a: 'Den månedlige betaling beregnes med standard amortiseringsformel: M = P × [r(1+r)^n] ÷ [(1+r)^n − 1], hvor P er hovedstolen, r er månedsrenten og n er antal terminer.'
      },
      {
        q: 'Inkluderer beregningen bidragssats og ejendomsskatter?',
        a: 'Beregneren fokuserer på den rene kapital- og rentedel. I et dansk realkreditlån tillægges en løbende bidragssats samt eventuelle kommunale ejendomsskatter.'
      },
      {
        q: 'Skal jeg vælge et 15-årigt eller et 30-årigt realkreditlån?',
        a: 'Et 15-årigt lån har en højere månedlig ydelse, men markant lavere samlede renteudgifter, mens et 30-årigt lån giver lavere månedlige afdrag og mere luft i budgettet.'
      },
      {
        q: 'Hvordan påvirker udbetalingens størrelse mit boliglån?',
        a: 'En større udbetaling reducerer lånets hovedstol og kan sænke din belåningsgrad under 80%, hvilket ofte udløser en lavere bidragssats hos realkreditinstituttet.'
      },
      {
        q: 'Kan jeg anvende beregneren til vurdering af omlægning af lån?',
        a: 'Ja. Indtast din restgæld, den nye rente og den ønskede løbetid for at sammenligne den nye månedlige ydelse og de samlede renteomkostninger før omlægning.'
      }
    ]
  },
  {
    path: 'da/loan-calculator/index.html',
    slug: 'loan-calculator',
    locale: 'da',
    isDc: false,
    heading: 'Ofte stillede spørgsmål',
    title: 'Lånberegner Online Gratis — Beregn Dit Lån | AnyConverter',
    desc: 'Beregn din månedlige lånebetaling, rente og amortiseringsplan online gratis. Hurtig lånberegner med klar opdeling af afdrag og samlede omkostninger.',
    faqs: [
      {
        q: 'Hvad er en månedlig lånebetaling, og hvordan beregnes den?',
        a: 'Den månedlige betaling udregnes via annuitetsformlen baseret på lånets hovedstol, den pålydende rente og det samlede antal månedlige terminer i lånets løbetid.'
      },
      {
        q: 'Hvordan vælger jeg mellem løbetid i år eller måneder?',
        a: 'Du kan nemt skifte mellem år og måneder i indtastningsfeltet, så beregneren automatisk tilpasser antallet af månedlige afdrag og amortiseringsplanen.'
      },
      {
        q: 'Hvad viser amortiseringsplanen for lånet?',
        a: 'Planen giver en fuld terminsoversigt over, hvor stor en del af hver betaling der udgøres af renteomkostninger, hvor meget der afdrages på restgælden, og saldoen.'
      },
      {
        q: 'Hvad er forskellen på nominel rente og de samlede årlige omkostninger (ÅOP)?',
        a: 'Den nominelle rente dækker udelukkende lånets basisrente, mens ÅOP medregner stiftelsesgebyrer, administrationsomkostninger og løbende terminsgebyrer.'
      },
      {
        q: 'Gemmes eller uploades mine låneoplysninger til eksterne servere?',
        a: 'Nej. Alle finansielle beregninger udføres lokalt i din browser ved hjælp af JavaScript, så dine personlige lånetal aldrig forlader dit eget udstyr.'
      }
    ]
  },
  {
    path: 'da/todo-list/index.html',
    slug: 'todo-list',
    locale: 'da',
    isDc: false,
    heading: 'Ofte stillede spørgsmål',
    title: 'Opgaveliste Online Gratis — Nem To-Do Liste | AnyConverter',
    desc: 'Brug en gratis online opgaveliste i din browser med automatisk lokal lagring. Opret opgaver, filtrér aktive og færdige punkter uden konto eller registrering.',
    faqs: [
      {
        q: 'Gemmes mine opgaver automatisk, hvis jeg lukker browseren?',
        a: 'Ja. Alle opgaver og afkrydsninger gemmes løbende i browserens lokale lagring (localStorage) og indlæses automatisk igen, næste gang du besøger siden.'
      },
      {
        q: 'Kan jeg opdele mine opgaver efter aktive og fuldførte punkter?',
        a: 'Ja. Med filterknapperne øverst på listen kan du nemt skifte mellem at vise alle opgaver, kun udestående opgaver eller udelukkende færdiggjorte punkter.'
      },
      {
        q: 'Kan jeg eksportere eller tage backup af min opgaveliste?',
        a: 'Ja. Du kan downloade hele din opgaveliste som en ren tekstfil eller JSON-fil samt importere en tidligere sikkerhedskopi med et enkelt klik.'
      },
      {
        q: 'Er der en grænse for, hvor mange opgaver jeg kan oprette?',
        a: 'Nej. Browserens lokale lager kan uden problemer rumme tusindvis af opgaver og noter med øjeblikkelig søgning og hurtig svartid.'
      },
      {
        q: 'Kræver opgavelisten oprettelse af brugerkonto eller login?',
        a: 'Nej. Værktøjet er 100% frit tilgængeligt uden tilmelding, abonnementer eller krav om e-mailadresse, og dine data forbliver i din egen browser.'
      }
    ]
  },
  {
    path: 'da/bmi-calculator/index.html',
    slug: 'bmi-calculator',
    locale: 'da',
    isDc: false,
    heading: 'Ofte stillede spørgsmål',
    title: 'BMI Beregner Online Gratis — Udregn Dit BMI | AnyConverter',
    desc: 'Brug vores BMI beregner online gratis til at udregne dit body mass index. Tjek din vægtkategori, sunde vægtinterval og formkurve direkte i browseren.',
    faqs: [
      {
        q: 'Hvad er BMI, og hvordan udregnes mit body mass index?',
        a: 'BMI (Body Mass Index) udregnes ved at dividere din kropsvægt i kilo med din højde i meter ganget med sig selv (kg ÷ m²), hvilket giver et standardiseret sundhedsindeks.'
      },
      {
        q: 'Hvilke vægtkategorier inddeler Sundhedsstyrelsen og WHO voksne i?',
        a: 'Standardkategorierne for voksne er undervægt (under 18,5), normalvægt (18,5–24,9), overvægt (25,0–29,9) samt svær overvægt (BMI på 30,0 eller derover).'
      },
      {
        q: 'Er BMI et præcist og dækkende mål for den enkeltes sundhed?',
        a: 'BMI skelner ikke mellem muskelmasse og fedtvæv, så veltrænede personer med høj muskelmasse kan have et højt BMI uden forøget helbredsmæssig risiko.'
      },
      {
        q: 'Hvordan beregnes det sunde vægtinterval for min højde?',
        a: 'Det sunde vægtinterval defineres ud fra det normale BMI-spænd mellem 18,5 og 24,9 multipliceret med din højde i meter i anden potens.'
      },
      {
        q: 'Bliver mine personlige højde- og vægttal sendt videre til servere?',
        a: 'Nej. Udregningen foregår udelukkende lokalt i din browser ved hjælp af JavaScript, så ingen sundhedsdata eller personlige målinger registreres.'
      }
    ]
  },
  {
    path: 'da/invoice-generator/index.html',
    slug: 'invoice-generator',
    locale: 'da',
    isDc: false,
    heading: 'Ofte stillede spørgsmål',
    title: 'Online Faktura Generator Gratis — Lav Faktura | AnyConverter',
    desc: 'Opret en professionel online faktura gratis som PDF. Tilføj firmadetaljer, varer, moms og betalingsoplysninger, og download fakturaen med det samme.',
    faqs: [
      {
        q: 'Er der noget vandmærke eller gebyr på den genererede PDF-faktura?',
        a: 'Nej. Den færdige PDF-faktura er 100% fri for vandmærker, reklamer og gebyrer, så du kan sende den direkte videre til dine kunder og bogholderi.'
      },
      {
        q: 'Kan jeg tilføje flere linjer, rabatter og tilpasset moms?',
        a: 'Ja. Du kan tilføje så mange varelinjer og ydelser som nødvendigt, angive specifikke momssatser og automatisk få beregnet subtotal og samlet beløb.'
      },
      {
        q: 'Hvilke valutaer og betalingsmetoder understøttes på fakturaen?',
        a: 'Værktøjet understøtter danske kroner (DKK), euro (EUR), amerikanske dollars (USD) og britiske pund (GBP) samt felter til bankoverførsel og IBAN.'
      },
      {
        q: 'Gemmes mine firmaoplysninger og kundedata på jeres servere?',
        a: 'Nej. Fakturaskabelonen og PDF-genereringen afvikles lokalt i din egen browser med klientside-kode, så dine forretningsdata behandles privat.'
      },
      {
        q: 'Kan jeg gemme en faktura og genbruge oplysningerne til næste gang?',
        a: 'Ja. Værktøjet kan gemme dine stamdata i din browsers lokale hukommelse, så dit firmanavn og kontonummer automatisk udfyldes ved fremtidige fakturaer.'
      }
    ]
  },
  {
    path: 'da/pdf-compress/index.html',
    slug: 'pdf-compress',
    locale: 'da',
    isDc: true,
    heading: 'Ofte stillede spørgsmål',
    title: 'Komprimer PDF Online Gratis — Gør PDF Mindre | AnyConverter',
    desc: 'Komprimer PDF online gratis i din browser. Reducer filstørrelsen til under 2 MB, bevar skarp tekst og download dit optimerede dokument uden ventetid.',
    faqs: [
      {
        q: 'Hvordan komprimerer jeg en PDF til en bestemt størrelse under 2 MB?',
        a: 'Vælg målstørrelse i værktøjet og angiv dit ønskede maksimum i megabyte, hvorefter algoritmen automatisk optimerer billeder og ressourcer til at matche kravet.'
      },
      {
        q: 'Forbliver teksten i mit PDF-dokument skarp og markerbar efter komprimering?',
        a: 'Ja. I let komprimeringstilstand optimeres filstrukturen uden rastering, så al tekst forbliver fuldt søgbar og skarp til udskrivning og skærmlæsning.'
      },
      {
        q: 'Bliver mine PDF-filer uploadet til eksterne servere under komprimeringen?',
        a: 'Nej. Al filbehandling og billedoptimering sker direkte i din browser via WebAssembly og JavaScript, så dokumenterne forbliver på din egen computer.'
      },
      {
        q: 'Hvorfor bliver nogle PDF-filer næsten ikke mindre efter komprimering?',
        a: 'Hvis en PDF primært indeholder ren tekst og vektorgrafik uden tunge scanninger eller fotos, er filen i forvejen kompakt og kan sjældent presses yderligere.'
      },
      {
        q: 'Kan jeg komprimere scannede dokumenter og flersidede kontrakter?',
        a: 'Ja. Værktøjet er særligt effektivt til tunge scanninger og fotos i PDF-filer, hvor filstørrelsen ofte kan reduceres med 50% til 80% uden synligt kvalitetstab.'
      }
    ]
  },
  {
    path: 'da/pdf-to-jpg/index.html',
    slug: 'pdf-to-jpg',
    locale: 'da',
    isDc: true,
    heading: 'Ofte stillede spørgsmål',
    title: 'PDF til JPG Online Gratis — Lav til Billede | AnyConverter',
    desc: 'Konverter PDF til JPG online gratis i din browser. Omdan PDF-sider til skarpe billeder i høj opløsning, vælg enkeltsider og download som JPG eller ZIP.',
    faqs: [
      {
        q: 'Hvordan konverterer jeg kun bestemte sider fra en PDF til JPG?',
        a: 'Når du har indlæst dit PDF-dokument, kan du vælge specifikke sidetal eller markere de sider, du ønsker at omdanne til billedfiler, frem for hele dokumentet.'
      },
      {
        q: 'Hvilken opløsning (DPI) bør jeg vælge ved konvertering til billeder?',
        a: 'Til almindelig skærmvisning og webdeling er 150 DPI optimalt, mens 300 DPI anbefales til tryk, præsentationer og detaljerede tekstscanninger.'
      },
      {
        q: 'Bliver mine PDF-dokumenter uploadet til eksterne servere under konverteringen?',
        a: 'Nej. Siderne renderes direkte i din webbrowser ved hjælp af PDF.js og Canvas-teknologi, så dine fortrolige filer forbliver på din enhed.'
      },
      {
        q: 'Kan jeg hente alle sider samlet i en enkelt ZIP-arkivfil?',
        a: 'Ja. Hvis dit dokument indeholder flere sider, kan du med et enkelt klik hente alle de genererede JPG-billeder samlet i en praktisk ZIP-fil.'
      },
      {
        q: 'Hvad er forskellen på at eksportere til JPG frem for PNG?',
        a: 'JPG er ideelt til scannede fotos og giver mindre filstørrelser, mens PNG bevarer knivskarpe linjer og ren tekst uden komprimeringsartefakter.'
      }
    ]
  },
  {
    path: 'da/jpg-to-pdf/index.html',
    slug: 'jpg-to-pdf',
    locale: 'da',
    isDc: true,
    heading: 'Ofte stillede spørgsmål',
    title: 'JPG til PDF Online Gratis — Billeder til PDF | AnyConverter',
    desc: 'Omdan JPG til PDF online gratis i din browser. Saml flere billeder i ét overskueligt PDF-dokument med original billedkvalitet og uden registrering.',
    faqs: [
      {
        q: 'Hvordan samler jeg flere JPG- og PNG-billeder i én samlet PDF-fil?',
        a: 'Træk dine billeder over i konverteringsfeltet, arranger rækkefølgen som ønsket, og klik på konverteringsknappen for at samle dem i ét samlet PDF-dokument.'
      },
      {
        q: 'Bevarer mine fotos og billeder deres oprindelige kvalitet i PDF-filen?',
        a: 'Ja. Billederne integreres med deres fulde opløsning uden unødig rekomprimering, så detaljer og farver fremstår knivskarpt i det færdige dokument.'
      },
      {
        q: 'Retter værktøjet automatisk orienteringen på mobilfotos?',
        a: 'Ja. Værktøjet aflæser EXIF-orienteringsdata fra dine mobilbilleder, så fotos der er taget på højkant eller på tværs automatisk vender rigtigt i PDF\'en.'
      },
      {
        q: 'Bliver mine private billeder uploadet til eksterne servere?',
        a: 'Nej. Billederne behandles og konverteres lokalt i din egen browser ved hjælp af klientbaseret kode, hvilket sikrer fuld fortrolighed for dine filer.'
      },
      {
        q: 'Kan jeg justere sidemargener og papirformat (A4 eller Letter)?',
        a: 'Ja. Du kan tilpasse sidestørrelsen til standard A4 eller lade hver PDF-side tilpasse sig proportionerne af det enkelte billede uden hvide kanter.'
      }
    ]
  },
  {
    path: 'da/ocr-pdf/index.html',
    slug: 'ocr-pdf',
    locale: 'da',
    isDc: false,
    heading: 'Ofte stillede spørgsmål',
    title: 'OCR PDF Online Gratis — Udtræk Tekst fra PDF | AnyConverter',
    desc: 'Brug OCR PDF online gratis til at gøre scannede dokumenter søgbare. Udtræk tekst fra PDF-filer direkte i din browser med høj genkendelsesnøjagtighed.',
    faqs: [
      {
        q: 'Hvordan virker OCR-tekstgenkendelse på scannede PDF-dokumenter?',
        a: 'OCR-teknologien analyserer pixelmønstrene på de scannede sider, genkender bogstaver og ord og opretter et usynligt tekstlag, der gør filen fuldt søgbar.'
      },
      {
        q: 'Hvorfor kan OCR-processen tage lidt tid at gennemføre?',
        a: 'Genkendelsen kræver detaljeret billedanalyse og sprogmodeller, som afvikles direkte i din browser via WebAssembly for at sikre høj præcision uden serverupload.'
      },
      {
        q: 'Hvordan ved jeg, om mit PDF-dokument allerede indeholder søgbar tekst?',
        a: 'Hvis du kan markere og kopiere ordene med musen i en almindelig PDF-læser, indeholder filen allerede tekst og behøver ikke yderligere OCR-behandling.'
      },
      {
        q: 'Hvilke sprog understøttes til udtræk af tekst fra PDF?',
        a: 'Systemet understøtter dansk med de særlige bogstaver æ, ø og å samt engelsk, tysk og andre vesteuropæiske sprog med høj genkendelsesgrad.'
      },
      {
        q: 'Uploades eller gemmes mine fortrolige PDF-filer på eksterne servere?',
        a: 'Nej. Hele OCR-processen kører lokalt på din egen enhed i browseren, så dine scannede kontrakter, kvitteringer og personlige dokumenter forbliver private.'
      }
    ]
  },
  {
    path: 'da/word-counter/index.html',
    slug: 'word-counter',
    locale: 'da',
    isDc: false,
    heading: 'Ofte stillede spørgsmål',
    title: 'Ordtæller Online Gratis — Tæl Ord og Tegn | AnyConverter',
    desc: 'Brug en hurtig ordtæller online gratis til at tælle ord, tegn, sætninger og afsnit. Se læsetid og detaljeret tekststatistik direkte i din browser.',
    faqs: [
      {
        q: 'Hvordan tæller ordtælleren ord, tegn og mellemrum i teksten?',
        a: 'Værktøjet analyserer din tekst i realtid og deler den op ved mellemrum og skilletegn, så du får nøjagtige tal for både ord med og uden mellemrum.'
      },
      {
        q: 'Hvordan estimeres den forventede læsetid for et dokument?',
        a: 'Læsetiden beregnes ud fra en gennemsnitlig læsehastighed på cirka 200 til 250 ord i minuttet, hvilket svarer til en standard voksen læser.'
      },
      {
        q: 'Hvordan registreres antallet af sætninger og afsnit i teksten?',
        a: 'Sætninger identificeres ud fra punktummer, udråbstegn og spørgsmålstegn, mens afsnit tælles baseret på linjeskift i tekstfeltet.'
      },
      {
        q: 'Er der en grænse for, hvor mange ord eller tegn jeg kan analysere?',
        a: 'Nej. Du kan indsætte alt fra korte opslag til hele artikler og bogmanuskripter uden begrænsninger, og statistikken opdateres med det samme.'
      },
      {
        q: 'Bliver den tekst, jeg indsætter til analyse, gemt på en server?',
        a: 'Nej. Hele tekstanalysen foregår udelukkende lokalt i din egen browser ved hjælp af JavaScript, så din tekst forbliver fuldstændig privat.'
      }
    ]
  }
];

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function buildStandardFaqHtml(heading, faqs) {
  const items = faqs.map(item => {
    return `        <details class="faq-item"><summary class="faq-question">${item.q} <span class="faq-icon">+</span></summary><div class="faq-answer">${item.a}</div></details>`;
  }).join('\n');

  return `<section class="faq">\n      <h2>${heading}</h2>\n      <div class="faq-list">\n${items}\n      </div>\n    </section>`;
}

function buildStandardFaqSchema(faqs) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function buildDcFaqHtmlSsr(heading, faqs) {
  const items = faqs.map((item, idx) => {
    const openAttr = idx === 0 ? ' open' : '';
    const clickIdx = idx + 5;
    return `<details${openAttr} style="background:#fff;border:1px solid #e6ded4;border-radius:12px;padding:0 18px"><summary data-dc-click="${clickIdx}" style="cursor:pointer;padding:16px 0;font-size:16px;font-weight:600;list-style-position:outside">${item.q}</summary><p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#3a332e">${item.a}</p></details>`;
  }).join('');

  return `<section style="display:flex;flex-direction:column;gap:16px"><h2 style="margin:0;font-family:'Bricolage Grotesque',ui-sans-serif,system-ui,sans-serif;font-size:28px;line-height:1.15;letter-spacing:-0.02em;text-wrap:balance">${heading}</h2><div style="display:flex;flex-direction:column;gap:8px">${items}</div></section>`;
}

function buildDcFaqHtmlTemplate(heading, faqs) {
  const items = faqs.map((item, idx) => {
    const openAttr = idx === 0 ? ' open' : '';
    return `<details${openAttr} style="background:#fff;border:1px solid #e6ded4;border-radius:12px;padding:0 18px"><summary onClick="{{ onFaq }}" style="cursor:pointer;padding:16px 0;font-size:16px;font-weight:600;list-style-position:outside">${item.q}</summary><p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#3a332e">${item.a}</p></details>`;
  }).join('');

  return `<section style="display:flex;flex-direction:column;gap:16px"><h2 style="margin:0;font-family:'Bricolage Grotesque',ui-sans-serif,system-ui,sans-serif;font-size:28px;line-height:1.15;letter-spacing:-0.02em;text-wrap:balance">${heading}</h2><div style="display:flex;flex-direction:column;gap:8px">${items}</div></section>`;
}

// Execution
for (const item of s09Data) {
  const filePath = path.join(process.cwd(), item.path);
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] File missing: ${filePath}`);
    process.exit(1);
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Update <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${item.title}</title>`);

  // 2. Update <meta name="description">
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']/i,
    `<meta name="description" content="${escapeHtml(item.desc)}"`
  );

  // 3. Update <meta property="og:title">
  if (/<meta\s+property=["']og:title["']/i.test(html)) {
    html = html.replace(
      /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']/i,
      `<meta property="og:title" content="${escapeHtml(item.title)}"`
    );
  }

  // 4. Update <meta property="og:description">
  if (/<meta\s+property=["']og:description["']/i.test(html)) {
    html = html.replace(
      /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']/i,
      `<meta property="og:description" content="${escapeHtml(item.desc)}"`
    );
  }

  // 5. Update or insert Twitter tags
  if (/<meta\s+name=["']twitter:title["']/i.test(html)) {
    html = html.replace(
      /<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']/i,
      `<meta name="twitter:title" content="${escapeHtml(item.title)}"`
    );
  } else if (/<meta\s+name=["']twitter:card["']/i.test(html)) {
    html = html.replace(
      /<meta\s+name=["']twitter:card["'][^>]*>/i,
      `$&<meta name="twitter:title" content="${escapeHtml(item.title)}">`
    );
  }

  if (/<meta\s+name=["']twitter:description["']/i.test(html)) {
    html = html.replace(
      /<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']/i,
      `<meta name="twitter:description" content="${escapeHtml(item.desc)}"`
    );
  } else if (/<meta\s+name=["']twitter:title["']/i.test(html)) {
    html = html.replace(
      /<meta\s+name=["']twitter:title["'][^>]*>/i,
      `$&<meta name="twitter:description" content="${escapeHtml(item.desc)}">`
    );
  }

  // 6. FAQs & Schema
  if (item.isDc) {
    // DC template tool: update JSON-LD in @graph
    const graphRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i;
    const graphMatch = html.match(graphRegex);
    if (graphMatch) {
      const graphObj = JSON.parse(graphMatch[1]);
      const faqIndex = graphObj['@graph'].findIndex(x => x['@type'] === 'FAQPage');
      const newFaqNode = {
        "@type": "FAQPage",
        "mainEntity": item.faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      };
      if (faqIndex !== -1) {
        graphObj['@graph'][faqIndex] = newFaqNode;
      } else {
        graphObj['@graph'].push(newFaqNode);
      }
      const replGraph = `<script type="application/ld+json">${JSON.stringify(graphObj)}</script>`;
      html = html.replace(graphRegex, () => replGraph);
    }

    // Split HTML at <script type="text/x-dc-template" to cleanly isolate SSR from client-side template
    const parts = html.split('<script type="text/x-dc-template"');
    if (parts.length === 2) {
      let beforeTpl = parts[0];
      let insideTpl = '<script type="text/x-dc-template"' + parts[1];

      const ssrFaqRegex = /<section\s+style="display:flex;flex-direction:column;gap:16px">\s*<h2[^>]*>(?:Preguntas frecuentes|Ofte stillede spørgsmål)<\/h2>\s*<div[^>]*>[\s\S]*?<\/div>\s*<\/section>/i;
      const replSsr = buildDcFaqHtmlSsr(item.heading, item.faqs);
      if (ssrFaqRegex.test(beforeTpl)) {
        beforeTpl = beforeTpl.replace(ssrFaqRegex, () => replSsr);
      } else {
        console.warn(`[WARN] SSR FAQ section not matched in ${item.path}`);
      }

      const tplFaqRegex = /<section\s+style="display:flex;flex-direction:column;gap:16px">\s*<h2[^>]*>(?:Preguntas frecuentes|Ofte stillede spørgsmål)<\/h2>\s*<div[^>]*>[\s\S]*?<\/div>\s*<\/section>/i;
      const replTpl = buildDcFaqHtmlTemplate(item.heading, item.faqs);
      if (tplFaqRegex.test(insideTpl)) {
        insideTpl = insideTpl.replace(tplFaqRegex, () => replTpl);
      } else {
        console.warn(`[WARN] Template FAQ section not matched in ${item.path}`);
      }

      html = beforeTpl + insideTpl;
    } else {
      console.warn(`[WARN] Expected exactly 2 parts when splitting ${item.path} by dc-template`);
    }

  } else {
    // Standard tool pages
    // JSON-LD FAQPage script
    const faqSchemaRegex = /<script\s+type="application\/ld\+json">([\s\S]*?FAQPage[\s\S]*?)<\/script>/i;
    const newSchemaHtml = buildStandardFaqSchema(item.faqs);
    if (faqSchemaRegex.test(html)) {
      html = html.replace(faqSchemaRegex, () => newSchemaHtml);
    } else {
      html = html.replace('</head>', () => `  ${newSchemaHtml}\n</head>`);
    }

    // Visible FAQ section
    const faqSectionRegex = /<section[^>]*class=["'][^"']*faq[^"']*["'][^>]*>[\s\S]*?<\/section>/i;
    const newFaqHtml = buildStandardFaqHtml(item.heading, item.faqs);
    if (faqSectionRegex.test(html)) {
      html = html.replace(faqSectionRegex, () => newFaqHtml);
    } else {
      console.warn(`[WARN] No faq section regex match in ${item.path}`);
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`[UPDATED] ${item.path} (Title: ${item.title.length}c, Desc: ${item.desc.length}c, FAQs: ${item.faqs.length})`);
}

console.log('\nAll 20 S09 pages successfully updated.');
