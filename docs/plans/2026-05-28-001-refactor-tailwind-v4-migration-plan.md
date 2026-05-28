---
title: "refactor: Migracja CSS Modules → Tailwind v4"
type: refactor
status: active
date: 2026-05-28
origin: docs/dev-brainstorms/2026-05-28-tailwind-migracja-requirements.md
---

# refactor: Migracja CSS Modules → Tailwind v4

## Przegląd

Zastąpienie 8 plików `.module.css` (257 klas) i globalnego `styles.css` stylingiem Tailwind v4. Wygląd wizualny bez zmian. Po migracji nowe komponenty piszemy w Tailwind od razu.

## Ujęcie problemu

CSS Modules wymagają osobnego pliku `.css` per komponent. Tailwind eliminuje ten kontekst-switching i przyspiesza iterację. Projekt nie ma jeszcze Tailwinda — instalujemy od zera.

## Śledzenie wymagań

- R1. Zainstalować Tailwind v4 przez PostCSS (`@tailwindcss/postcss`)
- R2. Przepisać wszystkie 8 `.module.css` na klasy Tailwind
- R3. Przenieść 18 CSS custom properties do `@theme {}` w `styles.css`
- R4. Usunąć wszystkie pliki `.module.css` po migracji
- R5. Zero regresu wizualnego — screenshot przed/po na 3 stronach

## Granice scope'u

- NIE migrujemy `src/app/(payload)/custom.scss` (Payload admin — oddzielne style)
- NIE migrujemy na `next/font` (Google Fonts zostaje jako CSS `@import url()`)
- NIE zmieniamy designu ani kolorystyki
- NIE dodajemy nowych komponentów ani stron

## Kontekst i research

### Pliki do migracji

| Plik | Klasy | Złożoność |
|------|-------|-----------|
| `src/components/Header.module.css` | 50 | Wysoka (hamburger, dropdown, animations) |
| `src/app/(frontend)/home.module.css` | 62 | Wysoka (hero, grid, CTA) |
| `src/app/(frontend)/kontakt/kontakt.module.css` | 40 | Średnia |
| `src/components/ServiceLayout.module.css` | 36 | Średnia |
| `src/components/Footer.module.css` | 24 | Średnia |
| `src/app/(frontend)/krok-po-kroku/krok.module.css` | 23 | Niska |
| `src/components/PageHero.module.css` | 13 | Niska |
| `src/app/(frontend)/oferta/oferta.module.css` | 9 | Niska |

### Globalne utility klasy w `styles.css`

Klasy `.btn`, `.btn--gold`, `.btn--outline`, `.container`, `.section`, `.heading-*`, `.section-label`, `.divider`, `.img-placeholder` są używane przez `className=""` w JSX na wielu stronach. Muszą zostać w CSS jako `@layer components` (nie można zastąpić inline bez edycji ~15 plików).

### Inline styles do wyczyszczenia

~15 elementów ze `style={{}}` głównie w `zasilek-pogrzebowy/page.tsx` i rozproszonych komponentach.

### Referencje zewnętrzne

- Instalacja v4: `pnpm add tailwindcss @tailwindcss/postcss postcss`
- Config PostCSS: `postcss.config.mjs` z `{ plugins: { "@tailwindcss/postcss": {} } }`
- CSS-first: `@import "tailwindcss"` + `@theme {}` — brak `tailwind.config.js`
- Content paths: automatyczne w Next.js — nie potrzeba `@source`
- Breaking change v3→v4: `bg-gradient-to-*` → `bg-linear-to-*` (nieistotne — nie używamy gradientów jako Tailwind klas)

## Kluczowe decyzje techniczne

- **PostCSS, nie Vite plugin**: projekt używa Next.js z Webpack/Turbopack — `@tailwindcss/postcss` jest właściwą ścieżką
- **Google Fonts zostaje jako `@import url()`**: wymaganie z requirements doc — nie migrujemy na `next/font`
- **Fonty w `@theme`**: `--font-heading` i `--font-body` jako tokeny Tailwind
- **rgba colors**: `--color-border` i `--color-border-subtle` (rgba) zostają jako CSS variables w `:root` — Tailwind nie obsługuje rgba natively w `@theme`. Używamy `border-[var(--color-border)]` lub `@layer base` żeby je zdefiniować
- **Utility klasy `.btn`, `.container`, `.section`**: migrujemy do `@layer components` w `styles.css` używając `@apply` — unikamy edycji ~15 plików JSX
- **CSS variables dla spacing**: `--header-height`, `--section-v`, `--container` zostają jako CSS variables w `:root`, dostępne przez `h-[var(--header-height)]` lub `@layer base`
- **Animacje**: `@keyframes scrollDown` z `home.module.css` przeniesione do `styles.css`

## Otwarte pytania

### Rozwiązane podczas planowania

- **Czy `@tailwindcss/nextjs` istnieje?** Nie — plugin to `@tailwindcss/postcss`, konfiguracja przez `postcss.config.mjs`
- **Czy `@source` jest potrzebny?** Nie — Tailwind v4 automatycznie skanuje w Next.js
- **Co z rgba w @theme?** Kolory rgba nie mogą być tokenami w `@theme`. Zostają jako CSS vars w `:root`, utility klasy używają `[var(--color-border)]`

### Odroczone do implementacji

- **Dokładne klasy Tailwind dla każdej reguły CSS**: wymaga ręcznego tłumaczenia podczas pisania — np. `clamp(2rem, 4vw, 3.25rem)` jako `text-[clamp(2rem,4vw,3.25rem)]`
- **Czy Turbopack akceptuje PostCSS?**: Next.js 16 z Turbopack powinien — weryfikacja przy pierwszym `pnpm dev`

## Implementation Units

- [x] **Unit 1: Instalacja i konfiguracja Tailwind v4**

**Cel:** Działający Tailwind v4 w projekcie — klasy utility dostępne w JSX

**Wymagania:** R1

**Zależności:** Brak

**Pliki:**
- Stwórz: `postcss.config.mjs`
- Modyfikuj: `src/app/(frontend)/styles.css` — `@import "tailwindcss"` + `@theme {}` z 14 kolorami i fontami
- Zachowaj: `:root` z rgba colors, `--header-height`, `--container`, `--section-v` (CSS vars nie tokeny)
- Zachowaj: `@import url(Google Fonts)` na górze

**Podejście:**
- `postcss.config.mjs` z jednym pluginem `@tailwindcss/postcss`
- `styles.css`: na górze `@import url(...)` → `@import "tailwindcss"` → `@theme { solid colors + fonts }` → `:root { rgba vars + layout vars }` → reset + base styles
- Mapowanie solid colors do `@theme`: `--color-black`, `--color-surface`, `--color-surface-2`, `--color-green`, `--color-green-2`, `--color-green-light`, `--color-gold`, `--color-gold-hover`, `--color-cream`, `--color-text`, `--color-text-muted`
- Fonty: `--font-heading: 'Cormorant Garamond', Georgia, serif` i `--font-body: 'Inter', ...`

**Wzorce do naśladowania:**
- Oficjalny guide: `tailwindcss.com/docs/guides/nextjs` (v4)

**Scenariusze testowe:**
- [E2E] Otwórz `http://localhost:3000`, snapshot — brak błędów konsoli, strona renderuje
- [E2E] Dodaj testową klasę `className="bg-gold p-4"` do dowolnego elementu, sprawdź czy kolor się pojawia → usuń

**Weryfikacja:**
- `pnpm dev` startuje bez błędów
- W DevTools: element z `bg-black` ma `background-color: rgb(13, 13, 13)`
- Brak błędów PostCSS w terminalu

---

- [ ] **Unit 2: Migracja globalnych utility klas**

**Cel:** Zastąpienie klas `.btn`, `.container`, `.section`, `.heading-*` w `styles.css` implementacją przez `@layer components` z `@apply`

**Wymagania:** R2, R3

**Zależności:** Unit 1

**Pliki:**
- Modyfikuj: `src/app/(frontend)/styles.css` — sekcja utility klas

**Podejście:**
- Zachowaj klasy `.btn`, `.btn--gold`, `.btn--outline`, `.btn--outline-gold`, `.container`, `.container--narrow`, `.section`, `.section--sm`, `.section--green`, `.section--surface`, `.heading-xl`, `.heading-lg`, `.heading-md`, `.heading-sm`, `.section-label`, `.divider`, `.divider--center`, `.img-placeholder` — ale przepisz ich ciało na `@apply`
- Klasy te są referencjonowane jako stringsowe `className="btn btn--gold"` w ~15 plikach JSX — muszą pozostać jako named klasy
- Reset (`* { box-sizing: border-box }`, `h1-h6`, `img`, `a`, `ul`) → `@layer base { @apply ... }`
- Animacje z przyszłych `module.css` (np. `@keyframes scrollDown`) przenieść tutaj

**Scenariusze testowe:**
- [E2E] Strona główna: przyciski „Zadzwoń" i „Nasze usługi" mają poprawne kolory i padding
- [E2E] Na stronie `/oferta` link „Dowiedz się więcej →" ma poprawny styl

**Weryfikacja:**
- Przyciski `.btn--gold` wyglądają identycznie jak przed migracją
- Brak błędów TS ani lint

---

- [ ] **Unit 3: Migracja Header i Footer**

**Cel:** Przepisanie `Header.module.css` (50 klas) i `Footer.module.css` (24 klasy) na Tailwind w plikach TSX

**Wymagania:** R2, R4

**Zależności:** Unit 1, Unit 2

**Pliki:**
- Modyfikuj: `src/components/Header.tsx` — zamień `styles.X` na `className="..."`
- Usuń: `src/components/Header.module.css`
- Modyfikuj: `src/components/Footer.tsx`
- Usuń: `src/components/Footer.module.css`

**Podejście:**
- Zacznij od Header — najkompleksniejszy komponent (hamburger transitions, dropdown hover, fixed positioning)
- Hamburger animacja (`translateY + rotate`) jako arbitrary values lub `@layer components`
- Mobile overlay: `fixed inset-0 z-[99] bg-black overflow-y-auto overscroll-contain opacity-0 invisible transition-[opacity,visibility,transform] duration-300`
- Open state: `aria-hidden` → używaj conditional classes z `mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"`
- Dropdown hover: CSS `:hover` descendant selector nie ma odpowiednika w Tailwind — użyj `group` + `group-hover:` pattern

**Wzorce do naśladowania:**
- Tailwind `group` / `group-hover:` dla dropdown
- `peer` dla hamburger lines jeśli potrzebne
- Arbitrary values dla wartości niestandardowych: `h-[var(--header-height)]`

**Scenariusze testowe:**
- [E2E] Desktop: hover na „Oferta" pokazuje dropdown z listą usług
- [E2E] Mobile (375px): hamburger otwiera full-screen overlay, body nie scrolluje
- [E2E] Kliknięcie linku w mobile menu zamyka overlay

**Weryfikacja:**
- Zero plików `Header.module.css` i `Footer.module.css`
- Brak importów `styles` w `Header.tsx` i `Footer.tsx`
- `npx tsc --noEmit` bez błędów

---

- [ ] **Unit 4: Migracja PageHero i ServiceLayout**

**Cel:** Przepisanie `PageHero.module.css` (13 klas) i `ServiceLayout.module.css` (36 klas)

**Wymagania:** R2, R4

**Zależności:** Unit 1, Unit 2

**Pliki:**
- Modyfikuj: `src/components/PageHero.tsx`
- Usuń: `src/components/PageHero.module.css`
- Modyfikuj: `src/components/ServiceLayout.tsx`
- Usuń: `src/components/ServiceLayout.module.css`

**Podejście:**
- PageHero: prosty layout — `pt-[calc(var(--header-height)+72px)] pb-18 bg-surface relative overflow-hidden`
- `::before` pseudo-elementy (gradient overlay w PageHero) → `@layer components` lub inline `<div className="absolute inset-0 ...">` zamiast CSS pseudo
- ServiceLayout: 2-column grid `grid grid-cols-[1fr_380px]`, sidebar `sticky top-[calc(var(--header-height)+24px)]`
- Pseudo-elementy nie mają odpowiednika w Tailwind className — zamienić na dodatkowy `<div>` element lub `@layer components`

**Scenariusze testowe:**
- [E2E] `/oferta/sala-pozegnan`: PageHero renderuje breadcrumb i tytuł, sidebar z features box i contact box widoczny
- [E2E] Na mobile sidebar jest pod treścią (1 kolumna)

**Weryfikacja:**
- Zero plików `PageHero.module.css`, `ServiceLayout.module.css`
- Wygląd identyczny na 1440px i 375px

---

- [ ] **Unit 5: Migracja page-level modules**

**Cel:** Przepisanie `home.module.css` (62), `oferta.module.css` (9), `kontakt.module.css` (40), `krok.module.css` (23) na Tailwind

**Wymagania:** R2, R4

**Zależności:** Unit 1, Unit 2

**Pliki:**
- Modyfikuj: `src/app/(frontend)/page.tsx`
- Usuń: `src/app/(frontend)/home.module.css`
- Modyfikuj: `src/app/(frontend)/oferta/page.tsx`
- Usuń: `src/app/(frontend)/oferta/oferta.module.css`
- Modyfikuj: `src/app/(frontend)/kontakt/page.tsx`
- Usuń: `src/app/(frontend)/kontakt/kontakt.module.css`
- Modyfikuj: `src/app/(frontend)/krok-po-kroku/page.tsx`
- Usuń: `src/app/(frontend)/krok-po-kroku/krok.module.css`

**Podejście:**
- `home.module.css` jest największy (62 klasy) — zacznij od niego
- Hero section: `relative min-h-screen flex items-center justify-center overflow-hidden`
- `@keyframes scrollDown` z `home.module.css` → przenieść do `styles.css` jako `@keyframes` + `@theme { --animate-scroll-down: ... }`
- `grid-template-columns: repeat(3, 1fr)` z `gap: 1px; background: var(--color-border-subtle)` (separator trick) → `grid grid-cols-3 gap-px bg-[var(--color-border-subtle)]`
- `clamp()` dla font-size → arbitrary value `text-[clamp(3rem,7vw,6rem)]`
- Hover `::before` na kartach usług → zamienić na `<div>` z `absolute bottom-0 left-0 w-full h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left`

**Scenariusze testowe:**
- [E2E] Strona główna: hero renderuje z tłem, tytułem i przyciskami
- [E2E] Siatka usług (3 kolumny desktop, 2 tablet, 1 mobile) — hover pokazuje złotą kreskę
- [E2E] `/kontakt`: 2 karty lokalizacji side-by-side, formularz po prawej

**Weryfikacja:**
- Zero plików `home.module.css`, `oferta.module.css`, `kontakt.module.css`, `krok.module.css`
- `pnpm lint` bez błędów

---

- [ ] **Unit 6: Migracja inline styles i final cleanup**

**Cel:** Zamiana `style={{}}` na Tailwind, weryfikacja zero `.module.css`, screenshot diff

**Wymagania:** R4, R5

**Zależności:** Unit 3, Unit 4, Unit 5

**Pliki:**
- Modyfikuj: `src/app/(frontend)/zasilek-pogrzebowy/page.tsx` (36 inline style props)
- Modyfikuj: `src/components/Footer.tsx`, `Header.tsx`, `PageHero.tsx`, `ServiceLayout.tsx`, `kontakt/page.tsx` (pozostałe ~15 inline styles)

**Podejście:**
- `zasilek-pogrzebowy/page.tsx` ma ~36 `style={{}}` z font-size, colors, gap, flex — wszystkie zastąpić Tailwind
- Wzorzec: `style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}` → `className="flex flex-col gap-10"`
- CSS vars w inline styles: `style={{ color: 'var(--color-cream)' }}` → `className="text-cream"` (token z @theme)
- `style={{ display: 'inline-flex' }}` na `<Link>` → `className="inline-flex"`
- `style={{ display: 'contents' }}` w `PageHero.tsx` → zachować lub przemyśleć inną strukturę

**Scenariusze testowe:**
- [E2E] `/zasilek-pogrzebowy`: sekcja „Wysokość zasiłku" z zielonym tłem i kwotą 4 636 zł renderuje poprawnie
- [E2E] Wszystkie strony: brak widocznych regresji vs screenshoty z Unit 1

**Weryfikacja:**
- `grep -r "\.module\.css" src/` → zero wyników
- `grep -r "style={{" src/` → drastycznie mniej (lub zero) wyników
- `npx tsc --noEmit` → bez błędów
- `pnpm lint` → bez błędów
- Screenshot strona główna / oferta / kontakt: wizualnie identyczne

## Wpływ systemowy

- **Brak wpływu na routing**: pure refactor CSS, żadne URL ani API endpoints się nie zmieniają
- **Payload admin**: `src/app/(payload)/custom.scss` nie dotykamy — oddzielny bundle
- **`next.config.ts`**: bez zmian — PostCSS jest obsługiwany automatycznie przez Next.js
- **Pseudo-elementy `::before`/`::after`**: zastąpić dodatkowym `<div>` — zmiana HTML struktury, ale nie widoczna wizualnie

## Ryzyka i zależności

- **Turbopack + PostCSS**: Next.js 16 z Turbopack powinien obsługiwać PostCSS — jeśli nie, fallback do `next dev --no-turbopack`
- **Pseudo-elementy → div zamienniki**: zmiana struktury HTML może wpłynąć na selektory CSS (nie mamy własnych — OK)
- **`clamp()` w arbitrary values**: Tailwind v4 obsługuje — weryfikacja przy kompilacji
- **Dropdown hover desktop**: `group/group-hover:` wymaga dodatkowego `className="group"` na parent — łatwe do przeoczenia

## Źródła i referencje

- **Dokument źródłowy:** [docs/dev-brainstorms/2026-05-28-tailwind-migracja-requirements.md](../dev-brainstorms/2026-05-28-tailwind-migracja-requirements.md)
- Tailwind v4 install: `tailwindcss.com/docs/guides/nextjs`
- PostCSS plugin: `@tailwindcss/postcss`
- `group`/`group-hover:`: `tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state`
