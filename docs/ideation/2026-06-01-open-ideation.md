---
date: 2026-06-01
topic: open-ideation
focus: cały projekt, brak ograniczeń
---

# Ideacja: Aaron Dom Pogrzebowy — pełny przegląd

## Kontekst codebase

**Stack:** Next.js 16 + React 19 + Payload CMS 3.x + MongoDB + TypeScript + TailwindCSS 4, deploy Docker na VPS.

**Kształt projektu:**
- 7 stron frontendowych (Home, Oferta + [slug], Galeria z lightboxem masonry, Kontakt, Krok-po-kroku, Tanatokosmetyka, Zasiłek)
- 7 Globals CMS (wszystkie edytowalne przez klienta)
- 2 Collections: Users + Media
- ~4000 linii TypeScript, 42 commity, ~5 dni pracy

**Kluczowe sygnały:**
- `next.config.ts:27` — `unoptimized: true` bez remotePatterns
- `kontakt/page.tsx:127` — formularz kontaktowy bez handlera POST (nie działa!)
- Brak GA4, brak Sentry, brak uptime monitoring
- Brak operatora E2E (Playwright wymaga `playwright install`)
- 5 ESLint warnings (drobne)
- Schema.org components istnieją ale nie zoptymalizowane pod rich snippets

---

## Pomysły w rankingu

### 1. Lead Capture Pipeline *(cross-cutting: contact form + GA4)*
**Werdykt:** RECOMMENDED
**Opis:** Formularz kontaktowy na `/kontakt` ma button `type="submit"` bez żadnego handlera — wysyłanie nie działa (`kontakt/page.tsx:127`). Brak też analytics. Razem: Payload collection `Contact` + API route POST + e-mail notyfikacja 24h (Resend/SendGrid) + GA4 event tracking na formularz i kliknięcia `tel:`.
**Uzasadnienie:** P0 — główny conversion point strony jest broken. Każdy visitor który wypełnia formularz odchodzi z niczym.
**Wady:** Wymaga decyzji o dostawcy e-mail, GDPR/RODO consent na formularzu.
**Confidence:** 95%
**Złożoność:** Medium
**Status:** Unexplored

### 2. Włączenie Next.js Image Optimization
**Werdykt:** RECOMMENDED
**Opis:** `next.config.ts:27` ma `unoptimized: true` — wszystkie obrazy serwowane jako surowe pliki. Hero image, galeria masonry, karty usług — bez WebP, bez `sizes`, bez lazy loading. Przejście na `remotePatterns` + Next/Image optimization naprawia LCP o szacowane 0.8-1.5s.
**Uzasadnienie:** Galeria to kluczowy trust-builder. Wolne ładowanie obrazów = odpływ użytkowników w chwili kryzysu emocjonalnego.
**Wady:** Wymaga `remotePatterns` dla Unsplash fallbacków, testów Docker pod nowym configiem.
**Confidence:** 88%
**Złożoność:** Low
**Status:** Unexplored

### 3. Reliability Stack *(cross-cutting: Sentry + uptime monitoring)*
**Werdykt:** RECOMMENDED
**Opis:** Brand promise to "dostępni 24h". Brak: Sentry (błędy łapane tylko w `console.error` — `payload-global.ts:24`), brak uptime monitoring. Gdy strona padnie o 3 w nocy — nikt się nie dowie dopóki klient nie zadzwoni.
**Uzasadnienie:** Branża funeralna = najwyższe ryzyko reputacyjne przy downtime. Rodzina szukająca pomocy nocą trafiająca na martwą stronę = utrata klienta + zaufania.
**Wady:** Konfiguracja DSN w Docker env, darmowy tier Sentry wystarczy.
**Confidence:** 90%
**Złożoność:** Low
**Status:** Unexplored

### 4. SEO Schema Enhancement
**Werdykt:** RECOMMENDED
**Opis:** `ZasilekPage.ts` ma strukturę FAQ, `KrokPoKrokuPage.ts` ma kroki — ale FAQSchema i HowToSchema nie są zoptymalizowane dla rich snippets Google. `LocalBusinessSchema` brakuje `openingHoursSpecification`. Brak `AggregateOffer` na `/oferta`.
**Uzasadnienie:** Rich snippets (FAQ box, HowTo carousel) zwiększają CTR o 20-30%. Zapytania SOS-type ("dom pogrzebowy 24h [miasto]") — wyróżnienie w SERP = bezpośrednie leady.
**Wady:** Google może nie pokazać rich snippets nawet przy poprawnym markupie.
**Confidence:** 82%
**Złożoność:** Low
**Status:** Unexplored

### 5. Crisis Support Widget
**Werdykt:** RECOMMENDED
**Opis:** Floating widget dostępny na każdej podstronie: szybki kontakt 24h, checklist "co zrobić teraz", link do zasiłku. Strona ma treść w podstronach ale nie agreguje jej w jedno dostępne centrum wsparcia. Użytkownik w szoku emocjonalnym nie scrolluje do stopki.
**Uzasadnienie:** Unique differentiator — żaden konkurencyjny dom pogrzebowy nie ma tego. Pokazuje że firma rozumie emocjonalny stan użytkownika nocą.
**Wady:** Może być postrzegany jako agresywny jeśli design nie jest stonowany. Wymaga starannego UX copy.
**Confidence:** 78%
**Złożoność:** Medium
**Status:** Unexplored

### 6. WCAG Accessibility Sprint
**Werdykt:** WORTH_EXPLORING
**Opis:** Service cards (`page.tsx:120-135`) — linki bez `aria-label`. Header dropdown (`Header.tsx:64-77`) — działa na hover bez stanu dla screen reader. Gallery lightbox — brak swipe na mobile. Inputs w formularzu bez `required`/`aria-invalid`.
**Uzasadnienie:** Branża funeralna obsługuje starsze osoby (70+) — najwyższe prawdopodobieństwo potrzeby accessibility. WCAG 2.1 AA to wymaganie prawne UE.
**Wady:** Audit wymaga narzędzi (Axe, Lighthouse), niektóre fixes wymagają refactoru komponentów.
**Confidence:** 75%
**Złożoność:** Medium
**Status:** Unexplored

### 7. Kalkulator Kosztów Pogrzebu
**Werdykt:** WORTH_EXPLORING
**Opis:** `services.ts` ma pełną listę usług bez ani jednej ceny. Strona mówi "zadzwoń o cenę". Interactive step-by-step kalkulator: select usługi → get estimate → "pobierz wycenę" (lead capture).
**Uzasadnienie:** Pricing transparency to największy anxiety-reducer w branży funeralnej. Kalkulator = lead magnet + competitive moat (większość PL domów pogrzebowych nie ma tego).
**Wady:** Klient może się opierać przed publikacją cen — decyzja biznesowa, nie tylko techniczna. Najwyższa złożoność z listy.
**Confidence:** 72%
**Złożoność:** High
**Status:** Unexplored

---

## Podsumowanie odrzuceń

| # | Pomysł | Powód odrzucenia |
|---|--------|-----------------|
| 1 | Placeholder data safety | Zadanie konfiguracyjne — klient wypełnia CMS |
| 2 | Service slugs single source of truth | Obecne podejście działa, brak wartości biznesowej |
| 3 | E2E tests aktualizacja | Cleanup, nie ideation — brak jasnego scope |
| 4 | Mobile navigation entropy | Zbyt ogólnikowy, nawigacja funkcjonuje |
| 5 | Copy consistency (polskie znaki) | Zadanie contentowe, nie dev feature |
| 6 | Lazy load gallery thumbnails | Brak zmierzonego problemu performance |
| 7 | Payload .select() optimization | Preoptymalizacja bez benchmarku |
| 8 | ISR revalidation stagger | Overkill dla VPS o tej skali |
| 9 | Lightbox image prefetch | Mikrooptymalizacja, marginalny efekt |
| 10 | Ukrainian language i18n | Potrzebuje walidacji biznesowej przed devem |
| 11 | GBP/reviews strategy | Marketing/ops, nie feature dev |
| 12 | Live chat + AI bot nocny | Koszt niewspółmierny do prostego formularza |
| 13 | CRM w Payload | Preoptymalizacja — najpierw napraw formularz |
| 14 | ESLint warnings cleanup | Trivialny, nie ideacja |
| 15 | Media backup strategy | Ops/infra, poza codebase |
| 16 | Code splitting Header nav | Negligible bundle impact |

---

## Log sesji
- 2026-06-01: Poczatkowa ideacja — 32 wygenerowane z 4 sub-agentów (Tech Debt, UX, Performance, Product), 7 ocalało po adversarialnym filtrze + cross-cutting syntezie
