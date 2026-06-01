---
title: "feat: Dynamiczny LocalBusiness schema z CMS"
type: feat
status: active
date: 2026-06-01
origin: docs/dev-brainstorms/2026-06-01-seo-schema-local-business-requirements.md
---

# feat: Dynamiczny LocalBusiness schema z CMS

## Przegląd

`LocalBusinessSchema.tsx` zawiera hardcoded placeholder data (telefon `+48000000000`, adres `ul. Przykładowa 1`). Komponent staje się async Server Component czytającym dane z `getSiteSettings()` — ten sam pattern co `Header` i `Footer`. Google zacznie widzieć poprawne NAP po uzupełnieniu CMS przez klienta.

## Ujęcie problemu

Google indeksuje `LocalBusinessSchema` jako część każdej strony (serwowany przez `layout.tsx`). Placeholder NAP w structured data:
- Obniża wiarygodność local SEO
- Może generować niezgodności z danymi w Google Business Profile
- Czyni schema bezużytecznym dla rich snippets

`Header` i `Footer` już czytają `phone` i `locations` z CMS. `LocalBusinessSchema` jest jedynym komponentem który wciąż ma hardcoded dane.

## Śledzenie wymagań

- R1. `LocalBusinessSchema` czyta `phone` i `locations` przez `getSiteSettings()`
- R2. Każda lokalizacja z CMS generuje osobny `PostalAddress` w tablicy `address`
- R3. `telephone` ze `settings.phone`
- R4. Zachować `@type: 'FuneralHome'`
- R5. Zachować `openingHours: 'Mo-Su 00:00-24:00'` jako string
- R6. Zmiana transparentna dla `layout.tsx` — miejsce użycia bez zmian
- R7. `FAQPage` (zasiłek) i `HowTo` (krok-po-kroku) bez zmian

## Granice scope'u

- Bez `AggregateOffer`
- Bez `openingHoursSpecification` (array format)
- Bez `areaServed`
- Bez duplikowania schematu per lokalizacja
- Bez zmian w `JsonLd.tsx`, `ZasilekPage`, `KrokPoKrokuPage`

## Kontekst i research

### Relevantny kod i wzorce

- `src/components/Footer.tsx` — **wzorzec do naśladowania**: async function, `await getSiteSettings()`, mapowanie `settings.locations`
- `src/components/Header.tsx` — analogiczny async pattern z `getSiteSettings()`
- `src/lib/site-settings.ts` — `getSiteSettings()` oparte na `React.cache()` — zero dodatkowych DB queries
- `src/globals/SiteSettings.ts` — definicja pól: `phone` (string), `locations[]` z `name`, `street`, `postalCode`, `city`
- `src/payload-types.ts:341-364` — `SiteSetting` typ z `locations?: { label, name, street, postalCode, city, phone, hours, id }[] | null`
- `src/app/(frontend)/layout.tsx:55` — miejsce użycia `<LocalBusinessSchema />` — bez zmian

### Wiedza instytucjonalna

- Pattern `React.cache()` + Vitest: reset cache między testami nie działa (zob. `docs/solutions/testing-issues/2026-05-30-react-cache-vitest-nie-resetuje-sie.md`) — test dla `LocalBusinessSchema` powinien testować output bezpośrednio, nie przez wielokrotne mocki

## Kluczowe decyzje techniczne

- **Async Server Component bez `'use client'`**: Komponent nie miał `'use client'` — dodanie `async` jest bezkosztowe. Render dzieje się server-side, dane przychodzą z `getSiteSettings()`.
- **Tablica `address` zamiast pojedynczego obiektu**: `schema.org/FuneralHome` przyjmuje tablicę PostalAddress — poprawny format dla multi-location
- **Fallback pustej tablicy**: jeśli `settings.locations` jest `null` / puste, `address` = `[]` — schemat nadal jest validny
- **`postalCode` opcjonalny**: typ CMS ma `postalCode` bez `required` — użyć warunkowego przypisania (`loc.postalCode ?? undefined`)

## Otwarte pytania

### Rozwiązane podczas planowania

- *Czy `getSiteSettings()` generuje dodatkowe DB query?* Nie — oparte na `React.cache()`, współdzielony cache z `Header` i `Footer` w ramach tego samego request renderowania.
- *Czy placeholder z `defaultValue` CMS pojawi się w schemacie?* Tak, ale akceptowalne — dopóki klient nie uzupełni prawdziwych danych, schema serwuje placeholdery (teraz edytowalne przez CMS).

### Odroczone do implementacji

- *Czy `postalCode` powinno być w `addressRegion` czy `postalCode`?* Sprawdzić schema.org/PostalAddress spec podczas implementacji — `postalCode` jest standardowym polem.

## Implementation Units

- [ ] **Unit 1: Refactor LocalBusinessSchema na async + dane z CMS**

**Cel:** Zastąpić hardcoded data danymi z `getSiteSettings()`, zmapować lokalizacje na `PostalAddress[]`

**Wymagania:** R1, R2, R3, R4, R5, R6

**Zależności:** Brak

**Pliki:**
- Modyfikuj: `src/components/LocalBusinessSchema.tsx`

**Podejście:**
- Zmień `export default function` na `export default async function`
- Wywołaj `const settings = await getSiteSettings()` (wzorzec z `Footer.tsx`)
- Zbuduj obiekt `schema` dynamicznie:
  - `telephone`: `settings.phone ?? ''`
  - `address`: mapowanie `settings.locations` na `PostalAddress` — `streetAddress`, `addressLocality`, `postalCode`, `addressCountry: 'PL'`
  - Zachować: `name`, `url`, `openingHours`, `priceRange`, `@type`
- Import `getSiteSettings` z `@/lib/site-settings`
- Sprawdzić czy eslint-disable na JSON-LD script tag jest nadal potrzebny

**Wzorce do naśladowania:**
- `src/components/Footer.tsx` — identyczny wzorzec async + getSiteSettings + mapowanie locations
- `src/components/LocalBusinessSchema.tsx` — istniejący kształt JSON-LD (tylko dane stają się dynamiczne)

**Scenariusze testowe:**
- [E2E] Otwórz stronę główną, sprawdź `<script type="application/ld+json">` w źródle strony — telefon i adres odpowiadają danym z CMS
- [E2E] Walidacja przez `validator.schema.org` — brak błędów dla `FuneralHome` schema

**Weryfikacja:**
- `pnpm typecheck` i `pnpm lint` przechodzą bez błędów
- `pnpm build` kończy się sukcesem
- W źródle HTML strony głównej widać `"@type":"FuneralHome"` z dynamicznymi danymi

---

- [ ] **Unit 2: Test integracyjny LocalBusinessSchema**

**Cel:** Pokryć happy path i edge case (brak lokalizacji, fallback phone) testem integracyjnym

**Wymagania:** R1, R2, R3 — kryteria sukcesu

**Zależności:** Unit 1

**Pliki:**
- Stwórz: `tests/int/local-business-schema.int.spec.ts`

**Podejście:**
- Mockuj `getSiteSettings` z konkretnym zestawem danych (telefon, 2 lokalizacje)
- Renderuj `LocalBusinessSchema` i sprawdź wygenerowany JSON-LD w outpucie HTML
- Osobny test: brak lokalizacji (`locations: null`) — `address: []`, schemat nadal valid
- Zgodnie z `learned-patterns.md`: `React.cache()` nie resetuje się między testami — testuj w jednym `it()` z pełnym datasetem

**Wzorce do naśladowania:**
- Istniejące testy integracyjne w `tests/int/` — wzorzec mockowania Payload globals

**Scenariusze testowe:**
- [Unit] `getSiteSettings()` zwraca dane z 2 lokalizacjami → JSON-LD zawiera 2 obiekty `PostalAddress`
- [Unit] `getSiteSettings()` zwraca `locations: null` → JSON-LD ma `address: []`
- [Unit] `settings.phone` ustawiony → JSON-LD zawiera `"telephone"` z tą wartością
- [Unit] Schemat zawiera `"@type": "FuneralHome"` i `"openingHours": "Mo-Su 00:00-24:00"`

**Weryfikacja:**
- `pnpm test:int` przechodzi z nowymi testami

## Wpływ systemowy

- **Renderowanie server-side**: `LocalBusinessSchema` renderuje się na serwerze przy każdym page load (ISR cache) — zmiana danych w CMS → revalidation → nowe dane w schemacie
- **`React.cache()` sharing**: `getSiteSettings()` współdzielone z `Header`, `Footer`, `LocalBusinessSchema` w ramach jednego request — zero overhead
- **`layout.tsx`**: `<LocalBusinessSchema />` pozostaje bez zmian — async component w Server Component layout jest standardowym wzorcem Next.js App Router

## Ryzyka i zależności

- **Niskie ryzyko**: Pattern identyczny jak `Footer.tsx` — sprawdzony w projekcie
- **Zależność od wypełnienia CMS**: Schema pokaże poprawne dane dopiero po uzupełnieniu przez klienta — do zakomunikowania po deployu

## Dokumentacja / Notatki operacyjne

- Po implementacji: poinformować klienta że musi uzupełnić dane w panelu CMS (`Treści → Kontakt`) — telefon i adresy oddziałów — żeby schema zwracała prawdziwe NAP
- Weryfikacja po deployu: Google Search Console → URL Inspection → Rich Results

## Źródła i referencje

- **Dokument źródłowy:** [docs/dev-brainstorms/2026-06-01-seo-schema-local-business-requirements.md](../dev-brainstorms/2026-06-01-seo-schema-local-business-requirements.md)
- Powiązany kod: `src/components/LocalBusinessSchema.tsx`, `src/components/Footer.tsx`, `src/lib/site-settings.ts`
- Wiedza: `docs/solutions/testing-issues/2026-05-30-react-cache-vitest-nie-resetuje-sie.md`
