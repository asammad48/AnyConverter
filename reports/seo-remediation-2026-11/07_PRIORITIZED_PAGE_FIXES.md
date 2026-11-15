# 07_PRIORITIZED_PAGE_FIXES — Before & After Metadata and Content Inventory

**Date:** 16 November 2026  
**Scope:** Pages with verified GSC traction and demonstrable SEO defects

---

## 1. Page-by-Page Comparison Inventory

### Page 1: `/da/loan-calculator/` (Danish Loan Calculator)
- **GSC Signal:** Query `lånberegner` (59 impressions, position 5.4 in Denmark). Also addresses query `låneberegner`.
- **Changes Implemented:**
  - **Before Title:** `Lånberegner Online Gratis | AnyConverter`
  - **After Title:** `Lånberegner & Låneberegner Online Gratis — Beregn Afdrag & Rente | AnyConverter`
  - **Before Meta Description:** `Beregn din månedlige lånebetaling med komplet opdeling af afdrag og renter. Se de samlede renteomkostninger og det samlede tilbagebetalingsbeløb…`
  - **After Meta Description:** `Beregn din månedlige lånebetaling, renter og amortiseringsplan online gratis. Hurtig lånberegner og låneberegner med klar opdeling af afdrag og samlede omkostninger.`
  - **On-Page Content:** Replaced thin August boilerplate with a dedicated Danish financial section explaining standard annuitetslån, the difference between nominel rente and ÅOP (Årlige Omkostninger i Procent), and term length impacts.
- **Product Verification:** Tested math formulas via `test_financial_calculations_suite.js`. Standard annuity formula executes with 100% precision.

---

### Page 2: `/da/mortgage-calculator/` (Danish Mortgage Calculator)
- **GSC Signal:** Query `realkreditberegner` (86 impressions, position 9.9 in Denmark).
- **Changes Implemented:**
  - **Before Title:** `Realkreditberegner Online Gratis | AnyConverter`
  - **After Title:** `Realkreditberegner & Boliglånsberegner Online Gratis | AnyConverter`
  - **Meta Description:** Retained compliant phrasing (`Beregn boliglånsbetalinger, rente, samlet pris og amortisering med en praktisk browserbaseret beregner. Med klare trin, praktiske resultater og ingen konto.`) to maintain 100% test suite compatibility.
  - **On-Page Content:** Removed awkward Anglicized sentence ("Denne mortgage calculator på dansk fokuserer på boliglån..."). Added detailed, truthful explanation of Danish mortgage realities: noting that the calculator models fixed-rate annuity amortization (kapital- og rentedel) and clearly explaining that Danish realkredit institutions (Totalkredit, Nykredit, RD) add a separate `bidragssats` and optional `afdragsfrihed`.
- **Product Verification:** Formulas validated against financial test suite.

---

### Page 3: `/es/sticky-notes/` (Spanish Sticky Notes)
- **GSC Signal:** Query `notas adhesivas online` (50 impressions, position 11.3 in Spain/Latin America).
- **Changes Implemented:**
  - **Before Title:** `Notas Adhesivas Online Gratis | AnyConverter`
  - **After Title:** `Notas Adhesivas Online Gratis — Tablero con Guardado Automático | AnyConverter`
  - **Before Meta Description:** `Crea notas adhesivas privadas en el navegador con guardado automatico. Fija, busca, filtra por color, exporta copias e importa notas sin registro.`
  - **After Meta Description:** `Crea notas adhesivas online gratis con guardado automático en tu navegador. Organiza ideas por colores, fija notas prioritarias y exporta tus notas sin registro.`
  - **On-Page Content:** Corrected all missing Spanish diacritics and inverted punctuation marks (`¿Son privadas mis notas?`, `Sí.`, `Añadir nota`, `Características`, `Cómo usar`). Emphasized 100% client-side privacy via localStorage and instant backup export/import without account registration.
- **Product Verification:** Tested offline autosave, color filtering, and JSON/TXT backup export in browser.

---

### Page 4: `/sticky-notes/` (English Sticky Notes)
- **GSC Signal:** Query `online sticky notes` (37 impressions, position 16.9).
- **Changes Implemented:**
  - **Before Title:** `Sticky Notes Online Free | AnyConverter`
  - **After Title:** `Free Online Sticky Notes — Digital Board with Auto-Save | AnyConverter`
  - **Before Meta Description:** `Create private online sticky notes that auto-save in your browser. Pin notes, search, filter by color, export backups, and import notes without signup.`
  - **After Meta Description:** `Create free online sticky notes with instant local auto-save. Organize ideas by color, pin key notes, search, and export to TXT or JSON without sign-up.`
  - **On-Page Content:** Streamlined copy to focus on core privacy and functionality (localStorage, zero tracking, color filtering, JSON/TXT export).
- **Product Verification:** Functional regression verified clean.

---

### Page 5: `/da/todo-list/` (Danish To-Do List)
- **GSC Signal:** Query `opgaveliste` (position 19.2 in Denmark).
- **Changes Implemented:**
  - **Before Title:** `Opgaveliste Online Gratis | AnyConverter`
  - **After Title:** `Opgaveliste Online Gratis — Enkel To-Do Liste med Lokal Lagring | AnyConverter`
  - **Before Meta Description:** `Brug en opgaveliste online gratis til enkel opgavestyring i browseren. Gem aktive og færdige opgaver uden konto.`
  - **After Meta Description:** `Brug en gratis online opgaveliste i din browser med automatisk lokal lagring. Opret opgaver, filtrér aktive og færdige punkter uden konto eller registrering.`
  - **On-Page Content:** Polished Danish text, removing mechanical duplicate section and emphasizing browser localStorage privacy.
- **Product Verification:** Tested task creation, filtering, and persistent storage.

---

### Page 6: `/ip-address-lookup/` (IP Address Lookup)
- **GSC Signal:** 44,106 historical query impressions for `ip address lookup`.
- **Changes Implemented:**
  - **Before Title:** `What Is My IP Address? — Free IP Lookup & Geolocation | AnyConverter`
  - **After Title:** `What Is My IP Address & IP Lookup — Free Geolocation & ASN | AnyConverter`
  - **Before Meta Description:** `Find your public IP address instantly with free geolocation, ISP details, city, country, and ASN lookup. Fast, private, and zero logs.`
  - **After Meta Description:** `Check your public IP address or look up any IPv4/IPv6 address instantly with free geolocation, ISP, city, country, ASN, and timezone details. Fast, private, and zero logs.`
  - **Intent Alignment:** Aligned metadata to support both "What is my IP" and "Look up an external IP" search intents truthfully, as both are supported by the tool interface.
- **Product Verification:** Tested public IP autodetection and arbitrary IP lookup via `test_ip_hero_regression.js`.
