---
title: "feat: Pełna kontrola admina + galeria masonry z lightboxem"
type: feat
status: active
date: 2026-05-30
origin: docs/dev-brainstorms/2026-05-30-cms-pelna-kontrola-galeria-lightbox-requirements.md
---

# feat: Pełna kontrola admina + galeria masonry z lightboxem

## Przegląd

Odblokowanie wymuszonych liczności w CMS (galeria, kroki, lokalizacje), usunięcie przykładowych
zdjęć galerii oraz przebudowa galerii na masonry z realnych proporcji plików z pełnoekranowym
lightboxem (strzałki, klawiatura, zapętlenie, licznik). Oferta (13 usług) świadomie poza scope —
stałe URL-e/SSG (zob. źródło: granice scope'u).

## Ujęcie problemu

Strona to demo oddawane klientowi z założeniem pełnej kontroli nad treścią. Obecnie CMS narzuca:
galeria = dokładnie 12 kafelków, kroki = 7, lokalizacje = max 2 (`minRows === maxRows` blokuje
add/remove). Galeria pokazuje placeholdery Unsplash jako fallback i nie ma powiększania zdjęć.

## Śledzenie wymagań

- R1. Dowolna liczba zdjęć w galerii (add/remove bez limitu). (zob. źródło)
- R2. Galeria domyślnie pusta; renderują się wyłącznie zdjęcia wgrane przez admina (brak fallbacków Unsplash).
- R3. Masonry zachowujące realny aspect ratio każdego zdjęcia (z wymiarów uploadu).
- R4. Lightbox pełnoekranowy: strzałki boczne, klawiatura ←/→, Esc zamyka, klik w tło zamyka, zapętlenie, licznik „N / M", bez podpisu.
- R5. Dowolna liczba kroków w „Krok po kroku"; numery auto wg kolejności.
- R6. Dowolna liczba lokalizacji w „Kontakt".

## Granice scope'u

- Oferta (usługi) zostaje 13 ze stałymi URL-ami — NIE odblokowujemy (routing/SSG zależy od slugów).
- Tablice już wolne (akapity, punkty, features, FAQ) — bez zmian.
- Bez zmian designu siatki poza przejściem na masonry.
- Bez swipe-gestów mobilnych w lightboxie w tej iteracji (patrz Odroczone).

## Kontekst i research

### Relevantny kod i wzorce

- `src/globals/GaleriaPage.ts` — `images` array, `minRows/maxRows = IMAGES_DEFAULT.length`, `defaultValue: IMAGES_DEFAULT`, hook `revalidatePath`.
- `src/globals/KrokPoKrokuPage.ts:49-50` — `minRows/maxRows = processSteps.length`.
- `src/globals/SiteSettings.ts:39-40` — `locations` `minRows:1, maxRows:2`.
- `src/lib/galeria.ts` — `getGaleriaPage()` (cache + `fetchGlobal`), `getGalleryImages()` iteruje po stałych `galleryItems` (ratio + fallback per indeks).
- `src/data/gallery.ts` — kanoniczny zestaw 12 (alt/ratio/fallback Unsplash). Po zmianie martwy.
- `src/app/(frontend)/galeria/page.tsx` — server component, grid `grid-cols-3`, `aspectRatio` ze stałego ratio.
- `src/lib/media.ts` — `resolveMediaUrl(field, fallback)` zwraca tylko URL.
- `src/payload-types.ts` — `Media` ma `width`/`height`; `Galeria.images[]` = `{ image?, alt }`.
- Wzorzec klienta z `src/components/Header.tsx` ('use client', `useEffect` z cleanupem `document.body.style.overflow`).

### Wiedza instytucjonalna

- `findGlobal` zwraca media populowane (depth) — `image` jako obiekt `Media` z `url/width/height`.
- Każda edytowalna kolekcja/global wymaga hooka revalidate (pamięć projektu: cache prod). Globale tu już go mają — zmiany pól nie ruszają hooków.

### Referencje zewnętrzne

- Brak — lightbox i CSS columns to standardowe wzorce; codebase ma własne konwencje.

## Kluczowe decyzje techniczne

- **Galeria = komponent kliencki** (`src/components/Gallery.tsx`, `'use client'`): trzyma stan otwarcia/indeksu lightboxa. Strona serwerowa pobiera dane i przekazuje serializowalną tablicę. Uzasadnienie: lightbox wymaga interakcji/stanu; reszta strony zostaje serwerowa.
- **Masonry = CSS columns** (`columns-*` + `break-inside-avoid`), obrazek `w-full h-auto` z `width/height` z Media → naturalny aspect, działa SSR, zero JS do layoutu. Uzasadnienie: najprostszy masonry bez biblioteki (coding-rules: prostota > złożoność).
- **Dane zdjęć**: nowy helper zwracający `{ url, alt, width, height }` tylko dla pozycji z wgranym obrazkiem; brak fallbacków. Pozycje bez obrazka pomijane.
- **Klawiatura/scroll lock**: `useEffect` z rejestracją `keydown` i `document.body.style.overflow`, oba sprzątane w cleanupie (coding-rules 13).
- **Lokalizacje**: usuwamy `maxRows` i `minRows` (pełna swoboda, 0..N). `defaultValue` (2 przykłady) zostaje jako punkt startowy demo.
- **Galeria defaultValue**: pusta tablica (R2).

## Otwarte pytania

### Rozwiązane podczas planowania

- Jak liczyć aspect przy masonry: z `Media.width/height` przez CSS columns. 
- Gdzie stan lightboxa: w kliencie `Gallery.tsx`, dane z serwera.
- Co przy 0 zdjęć: pusta siatka, edytowalny „Tekst pod galerią" (`footerNote`) zostaje widoczny gdy ustawiony.

### Odroczone do implementacji

- Dokładny kształt helpera media zwracającego wymiary (rozszerzyć `media.ts` vs lokalny mapper w `galeria.ts`) — decyzja przy dotknięciu kodu.
- Weryfikacja, że front „Krok po kroku" (strona + sidebar) nie zakłada dokładnie 7 kroków — sprawdzić w trakcie Unit 1.
- Czy `image` bywa stringiem (niepopulowane) w jakimś trybie — obsłużyć type-guardem przy mapowaniu.
- Swipe-gesty mobilne w lightboxie — poza scope tej iteracji.

## Implementation Units

- [ ] **Unit 1: Odblokowanie liczności w globalach + pusta galeria**

**Cel:** Admin dodaje/usuwa dowolną liczbę zdjęć, kroków i lokalizacji; galeria startuje pusta.

**Wymagania:** R1, R2 (część konfiguracyjna), R5, R6

**Zależności:** Brak

**Pliki:**
- Modyfikuj: `src/globals/GaleriaPage.ts` (usuń `minRows`/`maxRows`; `defaultValue: []`; usuń import `galleryItems`/`IMAGES_DEFAULT`; zaktualizuj `admin.description`, np. „Dodaj dowolną liczbę zdjęć.")
- Modyfikuj: `src/globals/KrokPoKrokuPage.ts` (usuń `minRows`/`maxRows`)
- Modyfikuj: `src/globals/SiteSettings.ts` (usuń `minRows`/`maxRows` w `locations`)
- Modyfikuj: `src/app/(frontend)/krok-po-kroku/page.tsx` (tylko jeśli zakłada 7 — patrz weryfikacja)
- Po zmianie pól: regeneracja `src/payload-types.ts`

**Podejście:**
- Czysto konfiguracyjne. Sprawdź front „Krok po kroku" i sidebar pod kątem twardego założenia 7 kroków; numer kroku ma wynikać z indeksu.

**Wzorce do naśladowania:**
- Istniejące definicje array w globalach; `defaultValue` pozostałych pól.

**Scenariusze testowe:**
- [E2E] `/admin` → „Galeria": można dodać i usunąć pozycję zdjęcia (brak blokady wierszy).
- [E2E] `/admin` → „Krok po kroku": dodanie 8. kroku zapisuje się; `/krok-po-kroku` pokazuje numer „08".
- [E2E] `/admin` → „Kontakt": dodanie 3. lokalizacji zapisuje się; `/kontakt` renderuje 3 karty.

**Weryfikacja:**
- W panelu brak blokady add/remove dla galerii, kroków, lokalizacji.
- `payload-types.ts` zregenerowane bez błędów; typecheck czysty.
- Front „Krok po kroku" renderuje poprawne numery dla liczby ≠ 7.

- [ ] **Unit 2: Warstwa danych galerii — dynamiczna, z wymiarami, bez fallbacków**

**Cel:** `getGalleryImages()` zwraca tylko wgrane zdjęcia z URL + wymiarami; usunięcie martwych danych.

**Wymagania:** R2, R3 (dane)

**Zależności:** Unit 1 (pusty `defaultValue`, brak `galleryItems` w globalu)

**Pliki:**
- Modyfikuj: `src/lib/galeria.ts` (przepisz `getGalleryImages`: iteruj `page.images`, mapuj tylko pozycje z populowanym `image`, zwróć `{ url, alt, width, height }`; zaktualizuj `FALLBACK` na `images: []`; usuń import `galleryItems`)
- Modyfikuj: `src/lib/media.ts` (dodaj helper zwracający wymiary, np. `resolveMediaWithSize(field)` → `{ url, width, height } | null`, lub mapper lokalny w `galeria.ts` — decyzja w implementacji)
- Usuń: `src/data/gallery.ts` (martwy po zmianie)
- Test (unit): `tests/int/galeria.int.spec.ts`

**Podejście:**
- Type-guard na `image` (obiekt `Media` z `url`); pomiń string/null/brak `url`.
- `GalleryImage` interface rozszerzony o `width`/`height` (zamiast `ratio`).

**Notatka wykonawcza:** Zacznij od testu jednostkowego mapowania (wejście: mieszane pozycje populowane/puste → wyjście: tylko poprawne z wymiarami).

**Wzorce do naśladowania:**
- `resolveMediaUrl` i type-guard w `src/lib/media.ts`; `cache()` w `galeria.ts`; `media-url.int.spec.ts` jako wzór testu.

**Scenariusze testowe:**
- [Unit] 3 pozycje (2 z obrazkiem, 1 pusta) → zwraca 2 z `url/width/height`.
- [Unit] pozycja z `image` jako string/niepopulowane → pominięta.
- [Unit] brak zdjęć → `[]`.

**Weryfikacja:**
- `pnpm test:int` zielony dla nowego pliku.
- Brak importów `@/data/gallery` w repo (grep czysty); typecheck czysty.

- [ ] **Unit 3: Galeria masonry + lightbox (komponent kliencki)**

**Cel:** Front galerii jako masonry z realnych proporcji + pełnoekranowy lightbox wg R4.

**Wymagania:** R3, R4

**Zależności:** Unit 2 (dane z wymiarami)

**Pliki:**
- Stwórz: `src/components/Gallery.tsx` (`'use client'`)
- Modyfikuj: `src/app/(frontend)/galeria/page.tsx` (pobiera dane, renderuje `<Gallery images={...} footerNote={...} />`)
- Test (e2e): scenariusze niżej

**Podejście:**
- `Gallery` przyjmuje `images: { url, alt, width, height }[]`.
- Masonry: kontener `columns-3 max-[768px]:columns-2 max-[480px]:columns-1` + każdy kafelek `break-inside-avoid mb-1`; `next/image` z `width/height`, `className="w-full h-auto"`.
- Każdy kafelek to `<button>` otwierający lightbox z indeksem.
- Lightbox (overlay `fixed inset-0 z-[...] bg-black/95`): aktualny obraz wyśrodkowany; przyciski prev/next po bokach; licznik „idx+1 / length"; zamknięcie: przycisk ×, Esc, klik w tło (nie w obraz/przyciski).
- Nawigacja: prev/next z zapętleniem (`(i - 1 + n) % n`, `(i + 1) % n`).
- `useEffect`: gdy otwarty — `keydown` (←/→/Esc) i `document.body.style.overflow = 'hidden'`; cleanup usuwa listener i przywraca scroll.
- Dostępność: `aria-label` na przyciskach nawigacji/zamknięcia; focus na overlay przy otwarciu.

**Notatka wykonawcza:** Listener klawiatury i scroll-lock rejestrowane i sprzątane w jednym `useEffect` zależnym od stanu otwarcia (coding-rules 13).

**Wzorce do naśladowania:**
- `src/components/Header.tsx` (klient, `useEffect` + `document.body.style.overflow`, cleanup, `useState`).
- `next/image` z `fill`/wymiarami jak w istniejących stronach.

**Scenariusze testowe:**
- [E2E] `/galeria` z ≥3 zdjęciami: klik w 1. kafelek → lightbox otwarty, licznik „1 / N".
- [E2E] Strzałka „w prawo" (mysz) i klawisz `→` → kolejne zdjęcie; z ostatniego → wraca na pierwsze (zapętlenie).
- [E2E] `Esc` oraz klik w ciemne tło → lightbox zamknięty; scroll strony przywrócony.
- [E2E] Galeria pusta → brak kafelków, brak błędów; `footerNote` widoczny gdy ustawiony.
- [E2E] Zdjęcia o różnych proporcjach nie są zniekształcone (masonry respektuje aspect).

**Weryfikacja:**
- Lightbox spełnia wszystkie zachowania R4 myszą i klawiaturą.
- Po wgraniu N zdjęć front pokazuje dokładnie N; layout masonry bez deformacji.

- [ ] **Unit 4: Finalny gate i spójność**

**Cel:** Potwierdzić zgodność z wymaganiami i czystość jakościową.

**Wymagania:** R1–R6

**Zależności:** Unit 1–3

**Pliki:**
- Weryfikuj: cały dotknięty zakres; brak martwego kodu/importów po usunięciu `data/gallery.ts`.

**Podejście:**
- Uruchom gate w kolejności z CLAUDE.md: `pnpm test:int` → typecheck → `pnpm lint`; dodatkowo `pnpm generate:types` i `pnpm build`.

**Scenariusze testowe:**
- [Unit] Cały `test:int` zielony.
- [E2E] Smoke: `/galeria`, `/krok-po-kroku`, `/kontakt` renderują się bez błędów po zmianach liczności.

**Weryfikacja:**
- 0 błędów typecheck/lint (brak nowych warningów), `build` exit 0, brak `any`/`!` w nowym kodzie.

## Wpływ systemowy

- **Graf interakcji:** Zmiana globali wpływa na strony `/galeria`, `/krok-po-kroku`, `/kontakt` i `Footer` (mapuje `locations`). Hooki revalidate już obecne — bez zmian.
- **Propagacja błędów:** `fetchGlobal`/`getSiteSettings` mają FALLBACK + log; nowy mapper galerii musi bezpiecznie pomijać niepełne pozycje (type-guard), nie rzucać.
- **Ryzyka cyklu życia stanu:** Lightbox — wyciek listenera/zablokowany scroll jeśli brak cleanupu; rozwiązane w `useEffect`.
- **Parytet surface API:** `Footer` już iteruje `locations` bez limitu — zgodne z R6, bez zmian.
- **Pokrycie integracyjne:** Dynamiczna liczba kroków/lokalizacji — E2E smoke pokrywa render przy liczbie ≠ domyślna.

## Ryzyka i zależności

- `image` niepopulowane (string) w pewnych trybach — mitygacja: type-guard, pozycja pomijana.
- Brak `width/height` na starych mediach — mitygacja: pomiń wymiarowanie/użyj `h-auto` bez `next/image` dims lub pomiń pozycję; doprecyzowane w Unit 2/3.
- CSS columns zmienia kolejność wizualną (kolumnowy flow) — akceptowalne dla galerii; potwierdzić wizualnie.

## Dokumentacja / Notatki operacyjne

- Po wdrożeniu galeria startuje pusta — klient musi wgrać zdjęcia, żeby cokolwiek było widoczne (oczekiwane, demo).

## Źródła i referencje

- **Dokument źródłowy:** docs/dev-brainstorms/2026-05-30-cms-pelna-kontrola-galeria-lightbox-requirements.md
- Powiązany kod: `src/globals/GaleriaPage.ts`, `src/lib/galeria.ts`, `src/app/(frontend)/galeria/page.tsx`, `src/components/Header.tsx`, `src/lib/media.ts`
