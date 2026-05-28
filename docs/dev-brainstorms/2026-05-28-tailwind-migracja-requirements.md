---
date: 2026-05-28
topic: tailwind-migracja
---

# Migracja CSS Modules na Tailwind v4

## Problem

Projekt używa CSS Modules (.module.css) i globalnego styles.css. Dodawanie nowych komponentów wymaga tworzenia osobnych plików CSS. Tailwind v4 przyspiesza iterację i eliminuje kontekst-switching między plikami.

## Wymagania

- R1. Zainstalować i skonfigurować Tailwind v4 w Next.js 16 przez PostCSS
- R2. Przepisać wszystkie 8 plików `.module.css` na klasy Tailwind (Header, Footer, PageHero, ServiceLayout, home, oferta, kontakt, krok)
- R3. Przenieść design tokeny z CSS custom properties do bloku `@theme` w głównym pliku CSS (zachować te same wartości kolorów, fontów, spacingów)
- R4. Usunąć wszystkie pliki `.module.css` po migracji
- R5. Wygląd wizualny identyczny przed i po migracji (zero regresu)

## Granice scope'u

- NIE migrujemy CSS Payload admina (`src/app/(payload)/custom.scss`)
- NIE zmieniamy designu ani kolorystyki
- NIE dodajemy nowych funkcji ani stron podczas migracji
- Google Fonts import zostaje jako CSS `@import` (optymalizacja przez `next/font` to osobne zadanie)

## Kluczowe decyzje

- **Tailwind v4, nie v3**: CSS-first config, `@theme` zamiast `tailwind.config.js`, natywna integracja z Next.js 16
- **Pełna migracja naraz**: wszystkie pliki jednocześnie, nie inkrementalnie - unikamy stanu hybrydowego

## Kryteria sukcesu

- Zero plików `.module.css` w `src/`
- `npx tsc --noEmit` przechodzi bez błędów
- `pnpm lint` przechodzi
- Screenshot przed/po na stronie głównej, oferta, kontakt - brak wizualnych różnic

## Następne kroki

→ `/dev-plan` do planowania technicznego implementacji
