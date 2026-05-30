# Zadania: CMS — pełna kontrola admina + galeria masonry z lightboxem

Branch: `feature/edytowalne-tresci-podstron`
Ostatnia aktualizacja: 2026-05-30

Legenda: `Test:` = scenariusz testowy, `Weryfikacja:` = kryterium ukończenia.

---

## Unit 1: Odblokowanie liczności w globalach + pusta galeria (M) ✅

- [x] Modyfikuj `src/globals/GaleriaPage.ts`: usuń `minRows`/`maxRows`; `defaultValue: []`; usuń import `galleryItems`/`IMAGES_DEFAULT`; zaktualizuj `admin.description` („Dodaj dowolną liczbę zdjęć.")
- [x] Modyfikuj `src/globals/KrokPoKrokuPage.ts`: usuń `minRows`/`maxRows`
- [x] Modyfikuj `src/globals/SiteSettings.ts`: usuń `minRows`/`maxRows` w `locations`
- [x] Sprawdź/zmodyfikuj `src/app/(frontend)/krok-po-kroku/page.tsx` jeśli zakłada 7 kroków → front już używa `i + 1` (indeks), bez zmian
- [x] Uruchom `pnpm generate:types`
- [ ] Test: [E2E] `/admin` → „Galeria": dodanie i usunięcie pozycji zdjęcia działa (brak blokady wierszy) (dev-docs-review)
- [ ] Test: [E2E] `/admin` → „Krok po kroku": dodanie 8. kroku zapisuje się; `/krok-po-kroku` pokazuje „08" (dev-docs-review)
- [ ] Test: [E2E] `/admin` → „Kontakt": dodanie 3. lokalizacji zapisuje się; `/kontakt` renderuje 3 karty (dev-docs-review)
- [ ] Weryfikacja: brak blokady add/remove dla galerii, kroków, lokalizacji (dev-docs-review)
- [x] Weryfikacja: `payload-types.ts` zregenerowane bez błędów; typecheck czysty
- [x] Weryfikacja: front „Krok po kroku" poprawne numery dla liczby ≠ 7 (numer z indeksu `i + 1`)

## Unit 2: Warstwa danych galerii — dynamiczna, z wymiarami, bez fallbacków (M) ✅

- [x] Modyfikuj `src/lib/galeria.ts`: przepisz `getGalleryImages` (iteruj `page.images`, tylko populowane `image`, `flatMap` → `{ url, alt, width, height }`); `FALLBACK.images = []`; usuń import `galleryItems`
- [x] Modyfikuj `src/lib/media.ts`: dodano `resolveMediaWithSize(field)` → `ResolvedMedia | null` (url+width+height+alt)
- [x] Usuń `src/data/gallery.ts`
- [x] Stwórz `tests/int/galeria.int.spec.ts`
- [x] Test: [Unit] dataset (2 z obrazkiem, string, null, bez-wymiarów) → zwraca 2 z `url/width/height`
- [x] Test: [Unit] pozycja z `image` jako string/niepopulowane → pominięta (`resolveMediaWithSize` → null)
- [x] Test: [Unit] brak zdjęć → `[]` (FALLBACK + flatMap)
- [x] Weryfikacja: `pnpm test:int` zielony — 13/13 (galeria 7 nowych)
- [x] Weryfikacja: brak importów `@/data/gallery` w repo (grep czysty); typecheck czysty

## Unit 3: Galeria masonry + lightbox (komponent kliencki) (L) ✅

- [x] Stwórz `src/components/Gallery.tsx` ('use client'): masonry CSS columns + lightbox
- [x] Modyfikuj `src/app/(frontend)/galeria/page.tsx`: render `<Gallery images={...} footerNote={...} />`
- [x] Lightbox: prev/next + zapętlenie (`(i±1+count)%count`), licznik „N / M", bez podpisu
- [x] `useEffect`: `keydown` (←/→/Esc) + `document.body.style.overflow`, cleanup obu
- [ ] Test: [E2E] `/galeria` (≥3 zdjęcia): klik 1. kafelek → lightbox, licznik „1 / N" (dev-docs-review)
- [ ] Test: [E2E] strzałka prawo (mysz) i `→` → kolejne; z ostatniego → pierwsze (zapętlenie) (dev-docs-review)
- [ ] Test: [E2E] `Esc` oraz klik w tło → zamknięcie; scroll przywrócony (dev-docs-review)
- [ ] Test: [E2E] galeria pusta → brak kafelków, brak błędów; `footerNote` widoczny gdy ustawiony (dev-docs-review)
- [ ] Test: [E2E] różne proporcje nie są zniekształcone (masonry respektuje aspect) (dev-docs-review)
- [ ] Weryfikacja: lightbox spełnia wszystkie zachowania R4 myszą i klawiaturą (dev-docs-review)
- [ ] Weryfikacja: N wgranych zdjęć → dokładnie N na froncie; masonry bez deformacji (dev-docs-review)
- [x] Weryfikacja (kod): typecheck + lint czyste

## Unit 4: Finalny gate i spójność (S) ✅

- [x] Weryfikuj brak martwego kodu/importów po usunięciu `data/gallery.ts` (grep `@/data/gallery|imageUrl|.ratio` czysty)
- [x] Uruchom `pnpm test:int` → typecheck → `pnpm lint` (13/13, 0 błędów, 0 błędów)
- [x] Uruchom `pnpm generate:types` i `pnpm build` (build exit 0, 24 strony)
- [x] Test: [Unit] cały `test:int` zielony — 13/13
- [ ] Test: [E2E] smoke `/galeria`, `/krok-po-kroku`, `/kontakt` renderują bez błędów (dev-docs-review; build SSG przeszedł)
- [x] Weryfikacja: 0 błędów typecheck/lint (5 pre-existing warningów, brak nowych), `build` exit 0, brak `any`/`!` w nowym kodzie

## Źródła
- Requirements doc: docs/dev-brainstorms/2026-05-30-cms-pelna-kontrola-galeria-lightbox-requirements.md
- Plan techniczny: docs/plans/2026-05-30-001-feat-cms-pelna-kontrola-galeria-lightbox-plan.md
