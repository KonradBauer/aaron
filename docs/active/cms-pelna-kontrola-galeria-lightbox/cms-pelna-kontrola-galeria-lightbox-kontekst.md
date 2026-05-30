# Kontekst: CMS — pełna kontrola admina + galeria masonry z lightboxem

Branch: `feature/edytowalne-tresci-podstron`
Ostatnia aktualizacja: 2026-05-30

## Postęp

- **Unit 1 ✅** (2026-05-30): usunięto `minRows`/`maxRows` w `GaleriaPage` (+ `defaultValue: []`, usunięto import `galleryItems`/`IMAGES_DEFAULT`, nowy opis), `KrokPoKrokuPage`, `SiteSettings.locations`. Front „Krok po kroku" już numeruje z indeksu (`i + 1`) — bez zmian. `generate:types` + typecheck czyste. `data/gallery.ts` wciąż istnieje (usuwany w Unit 2; `lib/galeria.ts` nadal go importuje).

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
