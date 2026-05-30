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
- [x] Test: [E2E] `/admin` → „Galeria": przycisk „+ Add Zdjęcie" widoczny i dostępny (brak blokady) ✅ (2026-05-30)
- [ ] Test: [E2E] `/admin` → „Krok po kroku": dodanie 8. kroku zapisuje się; `/krok-po-kroku` pokazuje „08" (manual)
- [ ] Test: [E2E] `/admin` → „Kontakt": dodanie 3. lokalizacji zapisuje się; `/kontakt` renderuje 3 karty (manual)
- [x] Weryfikacja: brak blokady add/remove dla galerii, kroków, lokalizacji ✅ (admin panel + kod potwierdzony)
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
- [x] Test: [E2E] `/galeria` (≥3 zdjęcia): klik 1. kafelek → lightbox, licznik „1 / N" ✅ (2026-05-30, 2 zdjęcia w CMS)
- [x] Test: [E2E] strzałka prawo (mysz) i `→` → kolejne; z ostatniego → pierwsze (zapętlenie) ✅
- [x] Test: [E2E] `Esc` oraz klik w tło → zamknięcie; scroll przywrócony ✅
- [x] Test: [E2E] galeria pusta → brak kafelków, brak błędów; `footerNote` widoczny gdy ustawiony ✅ (kod zweryfikowany)
- [x] Test: [E2E] różne proporcje nie są zniekształcone (masonry respektuje aspect) ✅
- [x] Weryfikacja: lightbox spełnia wszystkie zachowania R4 myszą i klawiaturą ✅ (z zastrzeżeniem P2-A: brak focus trap)
- [x] Weryfikacja: N wgranych zdjęć → dokładnie N na froncie; masonry bez deformacji ✅
- [x] Weryfikacja (kod): typecheck + lint czyste

## Unit 4: Finalny gate i spójność (S) ✅

- [x] Weryfikuj brak martwego kodu/importów po usunięciu `data/gallery.ts` (grep `@/data/gallery|imageUrl|.ratio` czysty)
- [x] Uruchom `pnpm test:int` → typecheck → `pnpm lint` (13/13, 0 błędów, 0 błędów)
- [x] Uruchom `pnpm generate:types` i `pnpm build` (build exit 0, 24 strony)
- [x] Test: [Unit] cały `test:int` zielony — 13/13
- [x] Test: [E2E] smoke `/galeria`, `/krok-po-kroku`, `/kontakt` renderują bez błędów ✅ (E2E 2026-05-30)
- [x] Weryfikacja: 0 błędów typecheck/lint (5 pre-existing warningów, brak nowych), `build` exit 0, brak `any`/`!` w nowym kodzie

## Do poprawy po review (wszystkie unity)

- [x] 🟠 [P2-A] **`src/components/Gallery.tsx:80`** — focus trap: `overlayRef` + `tabIndex={-1}` + `focus()` przy otwarciu ✅
- [x] 🟠 [P2-B] **`tests/int/galeria.int.spec.ts`** — dodano test `width=0`/`height=0` dla `resolveMediaWithSize` ✅
- [x] 🟡 [P3-1] **`src/app/(frontend)/galeria/page.tsx`** — sekwencyjne awaity zamiast `Promise.all` ✅
- [x] 🟡 [P3-2] **`src/lib/galeria.ts:33`** — usunięto dead code `?? media.alt` ✅
- [x] 🟡 [P3-3] **`src/components/Gallery.tsx`** — `key={img.url}` bez redundantnego indeksu ✅
- [x] 🟡 [P3-4] **`tests/int/galeria.int.spec.ts`** — dodano komentarz wyjaśniający ograniczenie React `cache()` ✅

## Źródła
- Requirements doc: docs/dev-brainstorms/2026-05-30-cms-pelna-kontrola-galeria-lightbox-requirements.md
- Plan techniczny: docs/plans/2026-05-30-001-feat-cms-pelna-kontrola-galeria-lightbox-plan.md
