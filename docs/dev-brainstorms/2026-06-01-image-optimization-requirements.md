---
date: 2026-06-01
topic: image-optimization
---

# Image Optimization — włączenie Next.js next/image

## Problem

`next.config.ts:27` ma `unoptimized: true` — wszystkie obrazy serwowane jako surowe pliki bez kompresji, bez WebP/AVIF, bez responsive sizing. Komentarz w kodzie wprost wskazuje co zrobić gdy "kiedyś włączyć optymalizację". Gallery, hero, karty usług — wszystkie images serwowane pełnowymiarowo. Negatywny wpływ na LCP i Core Web Vitals.

## Wymagania

- R1. Usunąć `unoptimized: true` z `next.config.ts` — Next.js wraca do domyślnej optymalizacji obrazów.
- R2. Dodać `remotePatterns` dla `images.unsplash.com` — fallbackowe URL-e serwisów (hero, about, usługi) nie zepsują się w trybie optymalizacji.
- R3. Obrazy z Payload (`/media/...`) powinny być obsługiwane przez wbudowany optimizer bez dodatkowej konfiguracji — są lokalne.
- R4. Weryfikacja: build i uruchomienie Docker standalone nie zepsuje się po zmianie (obrazy nadal ładują się poprawnie).

## Kryteria sukcesu

- Strona w DevTools Network pokazuje obrazy w formacie WebP lub AVIF zamiast JPEG/PNG.
- Galeria i hero nie wykazują regresji wizualnych.
- Docker build + uruchomienie kontenera kończy się sukcesem.

## Granice scope'u

- Nie zmieniamy atrybutów `sizes` — Gallery ma je już poprawnie skonfigurowane (`33vw/50vw/100vw`, lightbox `90vw`).
- Nie dodajemy `deviceSizes` ani `imageSizes` — domyślne wartości Next.js są wystarczające.
- Nie zmieniamy SkeletonImage — działa poprawnie z optymalizacją.
- Nie migrujemy fallbacków Unsplash na własne zdjęcia — to osobna decyzja contentowa.

## Kluczowe decyzje

- **Nie dodajemy `localPatterns`**: obrazy Payload są w `public/media/` i obsługiwane automatycznie przez Next.js jako lokalne.
- **Unsplash jako remotePattern**: fallbacki są tymczasowe (do momentu wgrania zdjęć przez klienta), ale muszą działać przez cały okres przejściowy.

## Następne kroki

→ `/dev-plan` do planowania technicznego implementacji
