# Kontekst: CMS — pełna kontrola admina + galeria masonry z lightboxem

Branch: `feature/edytowalne-tresci-podstron`
Ostatnia aktualizacja: 2026-05-30

## Postęp

- **Unit 1 ✅** (2026-05-30): usunięto `minRows`/`maxRows` w `GaleriaPage` (+ `defaultValue: []`, usunięto import `galleryItems`/`IMAGES_DEFAULT`, nowy opis), `KrokPoKrokuPage`, `SiteSettings.locations`. Front „Krok po kroku" już numeruje z indeksu (`i + 1`) — bez zmian. `generate:types` + typecheck czyste.
- **Unit 2 ✅** (2026-05-30): `media.ts` — dodano `resolveMediaWithSize()` (+ interfejs `ResolvedMedia`). `galeria.ts` — `getGalleryImages` przepisane na `flatMap` po `page.images`, tylko populowane obrazki z wymiarami, `GalleryImage = {url, alt, width, height}`, FALLBACK `images: []`. Usunięto `src/data/gallery.ts`. Test `galeria.int.spec.ts` (mock `fetchGlobal`; uwaga: `getGaleriaPage` owinięte react `cache()` → `getGalleryImages` wołane raz na plik). 13/13 zielone.
- **Unit 3 ✅** (2026-05-30): nowy `src/components/Gallery.tsx` ('use client') — masonry `columns-3/2/1` + `break-inside-avoid`, `next/image` z `width/height` (`w-full h-auto`). Lightbox: `openIndex` state, prev/next z zapętleniem, klawiatura ←/→/Esc + scroll-lock w jednym `useEffect` z cleanupem, klik w tło zamyka (`stopPropagation` na obrazie/przyciskach), licznik „N / M", bez podpisu. Pusta galeria → tylko `footerNote` lub `null`. `galeria/page.tsx` przepięte na `<Gallery>`, usunięty bezpośredni `Image`/grid. Typecheck + lint czyste.
- **Unit 4 ✅** (2026-05-30): pełny gate. `test:int` 13/13, typecheck 0 błędów, `lint` 0 błędów (5 pre-existing warningów, brak nowych), `generate:types` OK, `pnpm build` exit 0 (24 strony, `/galeria` SSG). Grep `@/data/gallery|imageUrl|.ratio` czysty — brak martwych referencji. **Wszystkie 4 Unity ukończone.**
- **dev-docs-review ⚠️** (2026-05-30): 5 agentów równolegle. Wynik: 0 P1, 2 P2 (focus trap lightboxa + brakujący test width=0), 1 P2 pre-existing (next.config unoptimized), 4 P3. E2E 9/10 passed (1 SKIP: admin panel login). Raport: `review-wszystkie-unity.md`. Gate: KONTYNUUJ Z ZASTRZEŻENIAMI — naprawić P2-A i P2-B przed merge.

## Powiązane pliki

- `src/globals/GaleriaPage.ts` — `images` array, `minRows/maxRows = IMAGES_DEFAULT.length`, `defaultValue: IMAGES_DEFAULT`. → usunąć limity, `defaultValue: []`, usunąć import `galleryItems`.
- `src/globals/KrokPoKrokuPage.ts:49-50` — `minRows/maxRows = processSteps.length`. → usunąć limity.
- `src/globals/SiteSettings.ts:39-40` — `locations` `minRows:1, maxRows:2`. → usunąć limity.
- `src/lib/galeria.ts` — `getGaleriaPage()` (cache+`fetchGlobal`), `getGalleryImages()` po stałym zestawie. → przepisać na dynamiczne z wymiarami, FALLBACK `images: []`.
- `src/data/gallery.ts` — kanoniczny zestaw 12 (Unsplash). → usunąć (martwy).
- `src/app/(frontend)/galeria/page.tsx` — server grid ze stałym ratio. → render `<Gallery />`.
- `src/components/Gallery.tsx` — NOWY, 'use client', masonry + lightbox.
- `src/lib/media.ts` — `resolveMediaUrl`. → dodać helper wymiarów lub mapper w `galeria.ts`.
- `src/app/(frontend)/krok-po-kroku/page.tsx` — sprawdzić brak założenia 7 kroków (numer z indeksu).
- `src/components/Footer.tsx` — iteruje `locations` (już bez limitu, zgodne z R6).
- `src/payload-types.ts` — regeneracja po zmianach pól.

## Decyzje techniczne

- Galeria = komponent kliencki (stan lightboxa); strona serwerowa przekazuje serializowalne dane.
- Masonry = CSS columns (`columns-*` + `break-inside-avoid`), `next/image` z `width/height`, `w-full h-auto`.
- Dane zdjęć: tylko pozycje z populowanym `image` (type-guard); brak fallbacków.
- Lightbox: zapętlenie `(i±1+n)%n`; Esc + klik w tło zamykają; licznik „N / M"; bez podpisu.
- Klawiatura + scroll-lock w jednym `useEffect` z cleanupem (coding-rules 13).
- Lokalizacje: usunąć `minRows` i `maxRows` (0..N); `defaultValue` (2 przykłady) zostaje.

## Zależności

- Payload `findGlobal` zwraca media populowane (`url/width/height`).
- Każdy global ma już hook `revalidatePath` — bez zmian.
- Kolejność: Unit 1 → Unit 2 → Unit 3 → Unit 4.

## Odroczone do implementacji

- Kształt helpera wymiarów (`media.ts` vs lokalny mapper).
- Obsługa `image` jako string (niepopulowane) — type-guard.
- Weryfikacja sidebaru „Krok po kroku".
- Zachowanie przy 0 zdjęć (domyślnie pusta siatka + `footerNote`).

## Źródła
- Requirements doc: docs/dev-brainstorms/2026-05-30-cms-pelna-kontrola-galeria-lightbox-requirements.md
- Plan techniczny: docs/plans/2026-05-30-001-feat-cms-pelna-kontrola-galeria-lightbox-plan.md
