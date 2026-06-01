---
title: "feat: Włączenie Next.js Image Optimization"
type: feat
status: active
date: 2026-06-01
origin: docs/dev-brainstorms/2026-06-01-image-optimization-requirements.md
---

# feat: Włączenie Next.js Image Optimization

## Przegląd

Usunięcie `unoptimized: true` z `next.config.ts` i dodanie `remotePatterns` dla `images.unsplash.com`. Next.js zaczyna serwować WebP/AVIF automatycznie. Lokalne obrazy Payload (`/public/media/`) nie wymagają dodatkowej konfiguracji.

## Ujęcie problemu

`next.config.ts:27` wyłącza optymalizację obrazów z komentarzem "prostsze w standalone Docker" — ale standalone Docker obsługuje image optimization out-of-the-box (optimizer działa in-process). Wszystkie obrazy serwowane są jako surowe JPEG/PNG bez kompresji, bez WebP, bez lazy loading (choć `sizes` są poprawnie ustawione i czekają na włączenie). Negatywny wpływ na LCP i Core Web Vitals galerii i hero.

## Śledzenie wymagań

- R1. Usunąć `unoptimized: true` z `next.config.ts`
- R2. Dodać `remotePatterns` dla `images.unsplash.com` (fallbacki hero, about, services)
- R3. Obrazy Payload (`/media/...`) obsługiwane automatycznie — brak zmian w media config
- R4. Docker standalone build + run nie psuje się

## Granice scope'u

- Bez zmian w `sizes` atrybutach — poprawnie skonfigurowane (Gallery: `33vw/50vw/100vw`, lightbox: `90vw`)
- Bez zmian w `deviceSizes` / `imageSizes` — domyślne Next.js wystarczające
- Bez zmian w `SkeletonImage` — działa poprawnie z optymalizacją
- Bez migracji fallbacków Unsplash na własne zdjęcia

## Kontekst i research

### Relevantny kod i wzorce

- `next.config.ts:23-28` — docelowe miejsce zmiany, komentarz wprost wskazuje co dodać
- `src/lib/home.ts:7-10` — `HERO_IMG_FALLBACK` i `ABOUT_IMG_FALLBACK` — Unsplash URLs wymagające `remotePatterns`
- `src/data/services.ts:10-11` — helper `unsplash()` — kolejne Unsplash URLs
- `src/components/Gallery.tsx:84-91` — `SkeletonImage` z poprawnymi `sizes` — zadziała natychmiast
- `src/components/Gallery.tsx:149-157` — lightbox `Image` z `sizes="90vw"` — zadziała natychmiast
- `Dockerfile` — multi-stage build, runner kopiuje `.next/standalone` + `.next/static`
- `docker-compose.prod.yml` — volume `/public/media`, port 8976

### Wiedza instytucjonalna

- Brak relevantnych wpisów w `docs/solutions/` dla image optimization

## Kluczowe decyzje techniczne

- **`remotePatterns` zamiast `domains`**: `domains` jest deprecated w Next.js 13+, `remotePatterns` jest poprawnym API
- **Tylko `hostname: 'images.unsplash.com'`**: nie ograniczamy pathname ani port — fallbacki używają różnych ścieżek Unsplash
- **Nie dodajemy `localPatterns`**: obrazy Payload są serwowane przez Next.js jako pliki statyczne z `/public/` — optymizer obsługuje je automatycznie bez konfiguracji

## Otwarte pytania

### Rozwiązane podczas planowania

- *Czy standalone Docker obsługuje image optimization?* Tak — Next.js Image Optimization Server jest embedded w `node server.js` trybie standalone. Nie wymaga zewnętrznego serwera.
- *Czy Unsplash URLs z query params (`?w=1920&q=85`) przejdą przez remotePatterns?* Tak — `remotePatterns` matchuje tylko `protocol` + `hostname` (+ opcjonalny `port` i `pathname`) — query params są ignorowane podczas matchowania.

### Odroczone do implementacji

- *Czy Docker cache obrazów (`.next/cache/images`) persystuje między deploymentami?* Zależy od konfiguracji volumes — do sprawdzenia w `docker-compose.prod.yml` podczas implementacji, jeśli cache chcemy zachować między restartami.

## Implementation Units

- [ ] **Unit 1: Konfiguracja next.config.ts**

**Cel:** Włączyć Next.js image optimization i dodać remotePatterns dla Unsplash

**Wymagania:** R1, R2, R3

**Zależności:** Brak

**Pliki:**
- Modyfikuj: `next.config.ts`

**Podejście:**
- Usuń `unoptimized: true` z bloku `images: {}`
- Dodaj `remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }]`
- Komentarz aktualizuj lub usuń — nie jest już potrzebny

**Wzorce do naśladowania:**
- Komentarz w `next.config.ts:24-26` wprost wskazuje co dodać

**Scenariusze testowe:**
- [E2E] Otwórz stronę główną, sprawdź w DevTools Network że obrazy hero mają typ `image/webp` lub `image/avif`
- [E2E] Otwórz galerię, sprawdź że thumbnails ładują się jako WebP
- [E2E] Otwórz lightbox — pełnowymiarowe zdjęcie ładuje się poprawnie

**Weryfikacja:**
- `pnpm build` kończy się sukcesem
- DevTools → Network → Img: format `webp` lub `avif` dla obrazów hero i galerii
- Brak błędów w konsoli przeglądarki dot. blokowania obrazów

---

- [ ] **Unit 2: Weryfikacja Docker standalone**

**Cel:** Potwierdzić że Docker build i uruchomienie kontenera działa po zmianie konfiguracji

**Wymagania:** R4

**Zależności:** Unit 1

**Pliki:**
- Sprawdź: `Dockerfile`, `docker-compose.prod.yml`
- Brak modyfikacji plików (weryfikacja runtime)

**Podejście:**
- `docker-compose.prod.yml` uruchamia kontener z `output: 'standalone'`
- Image optimizer w trybie standalone jest in-process — nie wymaga dodatkowego serwisu
- Sprawdzić czy `/public/media/` volume jest poprawnie montowany (lokalne obrazy Payload muszą być dostępne)

**Scenariusze testowe:**
- [E2E] Po `docker-compose up` strona ładuje się na porcie 8976
- [E2E] Obrazy z `/media/...` (Payload uploads) ładują się poprawnie przez optymizer
- [E2E] Obrazy Unsplash (hero fallback) ładują się przez optymizer

**Weryfikacja:**
- Kontener uruchamia się bez błędów
- Strona główna renderuje się poprawnie z obrazami

## Wpływ systemowy

- **Zmiana behawioralna**: Next.js zaczyna serwować `/_next/image?url=...&w=...&q=...` zamiast bezpośrednich URLi — wszystkie istniejące `<Image>` komponenty automatycznie korzystają z nowego pipeline'u
- **Cache**: Optimizer tworzy `.next/cache/images/` w runtime — nie jest kopiowany do standalone bundle, generowany on-demand
- **Brak regresji API**: `SkeletonImage`, `Gallery`, `ServiceLayout` — nie wymagają żadnych zmian

## Ryzyka i zależności

- **Niskie ryzyko**: Zmiana czysto konfiguracyjna, istniejące `sizes` atrybuty są już poprawne
- **Unsplash rate limiting**: Unlikely — obrazy są cachowane przez Next.js optimizer po pierwszym załadowaniu

## Źródła i referencje

- **Dokument źródłowy:** [docs/dev-brainstorms/2026-06-01-image-optimization-requirements.md](../dev-brainstorms/2026-06-01-image-optimization-requirements.md)
- Powiązany kod: `next.config.ts:23-28`, `src/lib/home.ts:7-10`, `src/data/services.ts:10-11`
