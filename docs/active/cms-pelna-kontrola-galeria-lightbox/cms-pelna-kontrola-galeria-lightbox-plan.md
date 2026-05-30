# Plan: CMS — pełna kontrola admina + galeria masonry z lightboxem

Branch: `feature/edytowalne-tresci-podstron` (kontynuacja, bez nowego brancha — decyzja użytkownika)
Ostatnia aktualizacja: 2026-05-30

## Cel i zakres

Dać adminowi pełną kontrolę nad liczbą elementów (galeria, kroki, lokalizacje), usunąć przykładowe
zdjęcia galerii (start z pustą galerią) i przebudować galerię na masonry z realnych proporcji plików
z pełnoekranowym lightboxem (strzałki, klawiatura, zapętlenie, licznik).

**Poza scope:** Oferta (13 usług, stałe URL-e/SSG), tablice już wolne (akapity/punkty/features/FAQ),
swipe mobilny w lightboxie.

## Cele (wymagania)

- R1. Dowolna liczba zdjęć w galerii.
- R2. Galeria domyślnie pusta; tylko wgrane zdjęcia (brak fallbacków Unsplash).
- R3. Masonry z realnym aspect ratio (z `Media.width/height`).
- R4. Lightbox pełnoekranowy: strzałki boczne, ←/→, Esc zamyka, klik w tło zamyka, zapętlenie, licznik „N / M", bez podpisu.
- R5. Dowolna liczba kroków; numery auto wg kolejności.
- R6. Dowolna liczba lokalizacji.

## Fazy z zadaniami

### Unit 1: Odblokowanie liczności w globalach + pusta galeria (M)
Usunięcie `minRows`/`maxRows` w galerii, krokach, lokalizacjach; `defaultValue: []` dla galerii;
regeneracja typów; weryfikacja frontu „Krok po kroku" przy liczbie ≠ 7.

### Unit 2: Warstwa danych galerii — dynamiczna, z wymiarami, bez fallbacków (M)
Przepisanie `getGalleryImages()` (tylko wgrane, `{url, alt, width, height}`); usunięcie
`src/data/gallery.ts`; helper wymiarów w `media.ts`; test jednostkowy mapowania.

### Unit 3: Galeria masonry + lightbox (komponent kliencki) (L)
Nowy `src/components/Gallery.tsx` ('use client'); CSS columns; lightbox z pełną nawigacją R4;
`useEffect` z cleanupem listenera klawiatury + scroll-lock.

### Unit 4: Finalny gate i spójność (S)
`test:int` → typecheck → `lint`, `generate:types`, `build`; brak martwych importów.

## Kryteria akceptacji

- Panel: brak blokady add/remove dla galerii, kroków, lokalizacji.
- Pusta galeria = zero placeholderów; N wgranych = N na froncie.
- Masonry bez deformacji zdjęć.
- Lightbox spełnia R4 myszą i klawiaturą (zapętlenie + licznik).
- 0 błędów typecheck/lint, `build` exit 0, brak `any`/`!` w nowym kodzie.

## Źródła
- Requirements doc: docs/dev-brainstorms/2026-05-30-cms-pelna-kontrola-galeria-lightbox-requirements.md
- Plan techniczny: docs/plans/2026-05-30-001-feat-cms-pelna-kontrola-galeria-lightbox-plan.md
