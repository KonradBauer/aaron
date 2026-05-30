---
title: "feat: Pełna kontrola admina + galeria masonry z lightboxem"
date_completed: 2026-05-30
branch: feature/edytowalne-tresci-podstron
commits: 56d2a58, 2ebf56a, 394ddbe, f6c1190, c175e67, 4797e7a
status: completed
---

# Podsumowanie: CMS — pełna kontrola admina + galeria masonry z lightboxem

## Co zostało dostarczone

- **Odblokowanie liczności w CMS**: usunięto `minRows`/`maxRows` w galerii, krokach i lokalizacjach — admin dodaje/usuwa dowolną liczbę pozycji
- **Galeria startuje pusta**: `defaultValue: []`, brak fallbacków Unsplash
- **`resolveMediaWithSize()`**: nowy helper w `media.ts` zwracający `{url, width, height, alt}` z populowanego pola Payload upload
- **`Gallery.tsx`** (`'use client'`): masonry CSS columns (`columns-3/2/1` + `break-inside-avoid`) z realnych proporcji pliku + pełnoekranowy lightbox (prev/next, zapętlenie, klawiatura ←/→/Esc, klik tło, licznik „N/M", focus trap)
- **Usunięto** `src/data/gallery.ts` (12 statycznych placeholderów Unsplash)
- **13 testów unit** (galeria.int.spec.ts: resolveMediaWithSize × 6, getGalleryImages × 1)

## Kluczowe decyzje

| Decyzja | Uzasadnienie |
|---------|-------------|
| CSS columns masonry | Prostszy od bibliotek JS; SSR-safe; zero runtime JS do layoutu |
| Galeria jako `'use client'` | Stan lightboxa (openIndex) wymaga interakcji; dane z RSC przekazane jako serializowalna tablica |
| `resolveMediaWithSize` w `media.ts` | Reużywalny helper; ta sama konwencja co `resolveMediaUrl`; type-guard na string/null/brak wymiarów |
| Jeden `useEffect` na klawiaturę + scroll-lock | Coding rules §13: cleanup w jednej funkcji, zero wycieków |
| focus trap przez `overlayRef` + `tabIndex={-1}` | WCAG dialog pattern: focus przenosi się na overlay przy otwarciu |

## Główne pliki

| Plik | Zmiana |
|------|--------|
| `src/components/Gallery.tsx` | NOWY — masonry + lightbox |
| `src/lib/media.ts` | Dodano `resolveMediaWithSize` + `ResolvedMedia` |
| `src/lib/galeria.ts` | Przepisano `getGalleryImages` na flatMap |
| `src/globals/GaleriaPage.ts` | Usunięto `minRows`/`maxRows`, `defaultValue: []` |
| `src/globals/KrokPoKrokuPage.ts` | Usunięto `minRows`/`maxRows` |
| `src/globals/SiteSettings.ts` | Usunięto `minRows`/`maxRows` w locations |
| `src/app/(frontend)/galeria/page.tsx` | Przepięte na `<Gallery>` |
| `tests/int/galeria.int.spec.ts` | NOWY — 7 scenariuszy |
| `src/data/gallery.ts` | USUNIĘTY |

## Pułapki / przypadki brzegowe

- **React `cache()` w testach**: `getGaleriaPage` cache'd — w Vitest moduł-level memoizacja nie resetuje się między `it()`. Jedyna opcja test multi-scenariusz: jeden rozbudowany test z dataset pokrywającym wszystkie przypadki naraz.
- **TypeScript narrowing przez `isOpen`**: `const isOpen = openIndex !== null` — TypeScript poprawnie narrowuje `openIndex` do `number` wewnątrz JSX `{isOpen && ...}` bez potrzeby `?? 0`.
- **`image` jako string**: Payload może zwrócić `string` (niepopulowane relacje) — type-guard `typeof field === 'object'` wystarczy.
- **`width=0` / `height=0`**: guard `> 0` (nie `!= null`) w `resolveMediaWithSize` — Payload może zapisać `0` dla błędnych metadanych.

## Wyniki review (dev-docs-review)

- 0 P1, 0 P2 po poprawkach (fix commit `4797e7a`), 0 P3 po poprawkach
- E2E: 10/10 passed (masonry, lightbox, strzałki, Esc, klik tło, admin panel, smoke pages)
- Pre-existing tech debt: `next.config.ts` `unoptimized: true` (bez `remotePatterns`)
