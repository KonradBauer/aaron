---
date: 2026-05-30
topic: cms-pelna-kontrola-galeria-lightbox
---

# CMS — pełna kontrola admina + galeria masonry z lightboxem

## Problem
Strona to demo oddawane klientowi, który ma mieć pełną kontrolę nad treścią. Obecny CMS
narzuca sztywne liczności: galeria = dokładnie 12 kafelków, kroki = 7, lokalizacje = max 2.
Wiersze są zablokowane (`minRows === maxRows`), więc admin nie może dodać ani usunąć pozycji.
Dodatkowo galeria pokazuje przykładowe zdjęcia (placeholdery Unsplash) jako fallback, których
klient nie chce. Galeria nie ma też powiększania zdjęć (lightbox).

## Wymagania

- R1. Admin ustawia dowolną liczbę zdjęć w galerii (dodawanie/usuwanie bez limitu).
- R2. Usuwamy przykładowe zdjęcia galerii — galeria domyślnie pusta; renderują się wyłącznie
  zdjęcia wgrane przez admina (brak fallbacków Unsplash).
- R3. Galeria renderuje się jako masonry zachowujące realne proporcje każdego zdjęcia
  (aspect ratio z wymiarów uploadu), zamiast stałych proporcji z kodu.
- R4. Klik w zdjęcie otwiera lightbox na pełny ekran z nawigacją:
  - strzałki boczne (lewa/prawa),
  - klawiatura: ←/→ przewija, Esc zamyka,
  - klik w ciemne tło zamyka,
  - zapętlenie (z ostatniego → pierwsze i odwrotnie),
  - licznik pozycji (np. „3 / 15"); BEZ opisu/podpisu zdjęcia.
- R5. Admin ustawia dowolną liczbę kroków w „Krok po kroku" (bez sztywnych 7). Numery kroków
  (01, 02, …) nadawane automatycznie wg kolejności.
- R6. Admin ustawia dowolną liczbę lokalizacji w „Kontakt" (bez limitu max 2).

## Kryteria sukcesu
- W panelu można dodać/usunąć dowolną liczbę zdjęć galerii, kroków i lokalizacji.
- Pusta galeria nie pokazuje żadnych placeholderów; po wgraniu N zdjęć front pokazuje dokładnie N.
- Zdjęcia w galerii nie są deformowane — siatka respektuje proporcje oryginałów.
- Lightbox działa myszą i klawiaturą zgodnie z R4 (w tym zapętlenie i licznik).

## Granice scope'u
- Oferta (usługi) zostaje 13 pozycji ze stałymi URL-ami — NIE odblokowujemy (routing/SSG
  zależy od stałych slugów). Poza tym brainstormem.
- Tablice treściowe już wolne (akapity, punkty, features, FAQ) — bez zmian, działają.
- Brak zmian w designie samej siatki poza przejściem na masonry z realnych proporcji.

## Kluczowe decyzje
- Odblokowanie liczności: galeria + kroki + lokalizacje (Oferta wyłączona — stałe URL-e).
- Galeria masonry z realnych proporcji pliku (nie jednolite kafelki) — naturalny, zróżnicowany układ.
- Lightbox: Esc + klik w tło zamykają, zapętlenie ON, licznik ON, podpis/opis OFF.
- Placeholdery galerii usunięte całkowicie (nie chowane warunkowo) — demo startuje z pustą galerią.

## Zależności / Założenia
- Payload `Media` przechowuje `width`/`height` uploadu → wystarczają do policzenia aspect ratio (R3).
- Usunięcie sztywnego zestawu galerii czyni `src/data/gallery.ts` martwym (do usunięcia w implementacji).
- Lightbox wymaga komponentu klienckiego ('use client'); reszta galerii pozostaje server-rendered.

## Otwarte pytania

### Do rozwiązania przed planowaniem
- (brak — decyzje produktowe rozstrzygnięte)

### Odroczone do planowania
- [Dotyczy R3][Techniczne] Sposób masonry: CSS columns vs grid z aspect-ratio per element —
  wybór w planowaniu.
- [Dotyczy R3][Techniczne] Przekazanie wymiarów obrazka (width/height z Media) do frontu —
  `resolveMediaUrl` zwraca tylko URL; trzeba udostępnić też wymiary.
- [Dotyczy R4][Techniczne] Architektura komponentu lightbox (state, focus trap, cleanup
  listenerów klawiatury wg coding-rules 13) — w planowaniu.
- [Dotyczy R5][Techniczne] Weryfikacja, że front „Krok po kroku" (strona + sidebar) nie zakłada
  dokładnie 7 kroków.
- [Dotyczy R2][Produktowe, niski priorytet] Co pokazać przy 0 zdjęć — domyślnie: pusta siatka,
  edytowalny „Tekst pod galerią" zostaje. Do potwierdzenia w implementacji.

## Następne kroki
→ `/dev-plan` do planowania technicznego implementacji
