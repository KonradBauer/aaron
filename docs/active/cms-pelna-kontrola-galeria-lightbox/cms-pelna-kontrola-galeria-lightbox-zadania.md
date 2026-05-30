# Zadania: CMS — pełna kontrola admina + galeria masonry z lightboxem

Branch: `feature/edytowalne-tresci-podstron`
Ostatnia aktualizacja: 2026-05-30

Legenda: `Test:` = scenariusz testowy, `Weryfikacja:` = kryterium ukończenia.

---

## Unit 1: Odblokowanie liczności w globalach + pusta galeria (M)

- [ ] Modyfikuj `src/globals/GaleriaPage.ts`: usuń `minRows`/`maxRows`; `defaultValue: []`; usuń import `galleryItems`/`IMAGES_DEFAULT`; zaktualizuj `admin.description` („Dodaj dowolną liczbę zdjęć.")
- [ ] Modyfikuj `src/globals/KrokPoKrokuPage.ts`: usuń `minRows`/`maxRows`
- [ ] Modyfikuj `src/globals/SiteSettings.ts`: usuń `minRows`/`maxRows` w `locations`
- [ ] Sprawdź/zmodyfikuj `src/app/(frontend)/krok-po-kroku/page.tsx` jeśli zakłada 7 kroków
- [ ] Uruchom `pnpm generate:types`
- [ ] Test: [E2E] `/admin` → „Galeria": dodanie i usunięcie pozycji zdjęcia działa (brak blokady wierszy)
- [ ] Test: [E2E] `/admin` → „Krok po kroku": dodanie 8. kroku zapisuje się; `/krok-po-kroku` pokazuje „08"
- [ ] Test: [E2E] `/admin` → „Kontakt": dodanie 3. lokalizacji zapisuje się; `/kontakt` renderuje 3 karty
- [ ] Weryfikacja: brak blokady add/remove dla galerii, kroków, lokalizacji
- [ ] Weryfikacja: `payload-types.ts` zregenerowane bez błędów; typecheck czysty
- [ ] Weryfikacja: front „Krok po kroku" poprawne numery dla liczby ≠ 7

## Unit 2: Warstwa danych galerii — dynamiczna, z wymiarami, bez fallbacków (M)

- [ ] Modyfikuj `src/lib/galeria.ts`: przepisz `getGalleryImages` (iteruj `page.images`, tylko populowane `image`, zwróć `{ url, alt, width, height }`); `FALLBACK.images = []`; usuń import `galleryItems`
- [ ] Modyfikuj `src/lib/media.ts`: helper wymiarów (np. `resolveMediaWithSize`) lub mapper lokalny w `galeria.ts`
- [ ] Usuń `src/data/gallery.ts`
- [ ] Stwórz `tests/int/galeria.int.spec.ts`
- [ ] Test: [Unit] 3 pozycje (2 z obrazkiem, 1 pusta) → zwraca 2 z `url/width/height`
- [ ] Test: [Unit] pozycja z `image` jako string/niepopulowane → pominięta
- [ ] Test: [Unit] brak zdjęć → `[]`
- [ ] Weryfikacja: `pnpm test:int` zielony dla nowego pliku
- [ ] Weryfikacja: brak importów `@/data/gallery` w repo (grep czysty); typecheck czysty

## Unit 3: Galeria masonry + lightbox (komponent kliencki) (L)

- [ ] Stwórz `src/components/Gallery.tsx` ('use client'): masonry CSS columns + lightbox
- [ ] Modyfikuj `src/app/(frontend)/galeria/page.tsx`: render `<Gallery images={...} footerNote={...} />`
- [ ] Lightbox: prev/next + zapętlenie, licznik „N / M", bez podpisu
- [ ] `useEffect`: `keydown` (←/→/Esc) + `document.body.style.overflow`, cleanup obu
- [ ] Test: [E2E] `/galeria` (≥3 zdjęcia): klik 1. kafelek → lightbox, licznik „1 / N"
- [ ] Test: [E2E] strzałka prawo (mysz) i `→` → kolejne; z ostatniego → pierwsze (zapętlenie)
- [ ] Test: [E2E] `Esc` oraz klik w tło → zamknięcie; scroll przywrócony
- [ ] Test: [E2E] galeria pusta → brak kafelków, brak błędów; `footerNote` widoczny gdy ustawiony
- [ ] Test: [E2E] różne proporcje nie są zniekształcone (masonry respektuje aspect)
- [ ] Weryfikacja: lightbox spełnia wszystkie zachowania R4 myszą i klawiaturą
- [ ] Weryfikacja: N wgranych zdjęć → dokładnie N na froncie; masonry bez deformacji

## Unit 4: Finalny gate i spójność (S)

- [ ] Weryfikuj brak martwego kodu/importów po usunięciu `data/gallery.ts`
- [ ] Uruchom `pnpm test:int` → typecheck → `pnpm lint`
- [ ] Uruchom `pnpm generate:types` i `pnpm build`
- [ ] Test: [Unit] cały `test:int` zielony
- [ ] Test: [E2E] smoke `/galeria`, `/krok-po-kroku`, `/kontakt` renderują bez błędów
- [ ] Weryfikacja: 0 błędów typecheck/lint (brak nowych warningów), `build` exit 0, brak `any`/`!` w nowym kodzie

## Źródła
- Requirements doc: docs/dev-brainstorms/2026-05-30-cms-pelna-kontrola-galeria-lightbox-requirements.md
- Plan techniczny: docs/plans/2026-05-30-001-feat-cms-pelna-kontrola-galeria-lightbox-plan.md
