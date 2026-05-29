# Zadania: Edytowalne treści podstron

Branch: `feature/edytowalne-tresci-podstron`
Ostatnia aktualizacja: 2026-05-29

Legenda: `Test:` = scenariusz testowy, `Weryfikacja:` = kryterium ukończenia.

---

## Unit 1: Fundament — ukrycie Media, util obrazka, fetch globala (M) ✅

- [x] Modyfikuj `src/collections/Media.ts`: dodaj `admin: { hidden: true }`, polski label `alt` („Tekst alternatywny (opis zdjęcia)")
- [x] Stwórz `src/lib/media.ts`: `resolveMediaUrl(field: string | Media | null | undefined, fallback: string): string`
- [x] Stwórz `src/lib/payload-global.ts`: `fetchGlobal<S>(slug, fallback)` — generic per slug, try/catch + logger, zwraca fallback w catch
- [x] Stwórz `tests/int/media-url.int.spec.ts`
- [x] Test: `resolveMediaUrl` zwraca `media.url` gdy obiekt z `url`
- [x] Test: `resolveMediaUrl` zwraca `fallback` gdy `null`/`undefined`/string-id/obiekt bez `url`
- [ ] Test (E2E): po zalogowaniu do `/admin` nawigacja nie zawiera „Media" (do weryfikacji w dev-docs-review)
- [ ] Weryfikacja: `pnpm test:int` zielony dla nowego pliku; brak zakładki Media; typecheck czysty (test+typecheck ✅; nav wizualnie w review)

## Unit 2: Global Strona główna + wiring (L) ✅

- [x] Stwórz `src/globals/HomePage.ts` (slug `strona-glowna`, label „Strona główna", group `Treści`, hook revalidate)
- [x] Pola: `hero` {badge, titleLine1, titleLine2, subtitle, image, ctaPrimaryLabel, ctaSecondaryLabel}; `about` {label, heading, paragraphs[], bullets[], ctaLabel, image}; `servicesSection` {label, heading, subtitle}; `cta` {heading, text} — z `defaultValue` z obecnego `page.tsx`
- [x] Stwórz `src/lib/home.ts`: `getHomeContent()` + FALLBACK + stałe fallbacki `HERO_IMG_FALLBACK`/`ABOUT_IMG_FALLBACK`
- [x] Modyfikuj `src/payload.config.ts`: rejestracja globala
- [x] Modyfikuj `src/app/(frontend)/page.tsx`: czytanie z globala, obrazki przez `resolveMediaUrl` (typ wygenerowany: `StronaGlowna`)
- [x] `pnpm generate:types`
- [ ] Test (E2E): `/admin` → „Strona główna" → zmiana `hero.titleLine2` → zapis → `/` pokazuje nowy tekst (dev-docs-review)
- [ ] Test (E2E): puste `hero.image` → `/` renderuje fallback Unsplash (dev-docs-review)
- [x] Weryfikacja: `generate:types` przechodzi; typecheck czysty; lint czysty (render wizualnie w review)

## Unit 3: Global Oferta + wiring listy/szczegółów/sekcji home (XL) ✅

- [x] Stwórz `src/globals/OfertaPage.ts` (slug `oferta`, label „Oferta (usługi)", group `Treści`, hook revalidate)
- [x] Pola: `intro` {heroTitle, heroSubtitle}; `services` array `minRows:13, maxRows:13`, item {slug(readOnly), title, shortDesc, description[], features[], image} — `defaultValue` = 13 usług z `src/data/services.ts`
- [x] Stwórz `src/lib/oferta.ts`: `getOfertaPage()`, `getServicesList()`, `getServiceContent(slug)`, FALLBACK + fallbacki obrazków per slug
- [x] Modyfikuj `src/data/services.ts`: dodano `SERVICE_SLUGS` (services.ts pozostaje kanonicznym seed/fallback — uniknięcie duplikacji treści)
- [x] Modyfikuj `src/payload.config.ts`: rejestracja
- [x] Modyfikuj `src/app/(frontend)/oferta/page.tsx` (lista + intro z globala)
- [x] Modyfikuj `src/app/(frontend)/oferta/[slug]/page.tsx` (`generateStaticParams` ze `SERVICE_SLUGS`, treść+schema z globala, `notFound()` gdy brak)
- [x] Modyfikuj `src/app/(frontend)/page.tsx`: sekcja usług z `getServicesList()`
- [x] `pnpm generate:types` (typ wygenerowany: `Oferta`)
- [ ] Test (E2E): edycja `services[0].title` → `/oferta` i `/oferta/sala-pozegnan` pokazują nowy tytuł (dev-docs-review)
- [ ] Test (E2E): w panelu brak możliwości dodania 14. usługi / usunięcia istniejącej (locked rows) (dev-docs-review)
- [ ] Test (E2E): dodanie/usunięcie punktu w `features` jednej usługi działa (dev-docs-review)
- [ ] Test (E2E): nieistniejący slug → 404 (dev-docs-review)
- [x] Weryfikacja: `generate:types`; typecheck czysty; lint czysty; `generateStaticParams` ze `SERVICE_SLUGS` (render wizualnie w review)

## Unit 4: Global Galeria + wiring (M) ✅

- [x] Stwórz `src/globals/GaleriaPage.ts` (slug `galeria`, label „Galeria", hook revalidate)
- [x] Pola: `intro` {heroTitle, heroSubtitle}; `footerNote`; `images` array `minRows:12, maxRows:12`, item {image, alt}
- [x] Stwórz `src/data/gallery.ts` (statyczne dane: alt, ratio, fallback url — unika cyklu importów)
- [x] Stwórz `src/lib/galeria.ts`: `getGaleriaPage()`, `getGalleryImages()` + FALLBACK (ratio + fallback obrazka per indeks)
- [x] Modyfikuj `src/payload.config.ts`, `src/app/(frontend)/galeria/page.tsx`
- [x] `pnpm generate:types` (typ: `Galeria`)
- [ ] Test (E2E): wgranie zdjęcia w `images[0]` → `/galeria` pokazuje plik zamiast fallbacku (dev-docs-review)
- [ ] Test (E2E): puste sloty → fallback Unsplash, layout 12 kafelków zachowany (dev-docs-review)
- [x] Weryfikacja: `generate:types`; typecheck + lint czyste (render wizualnie w review)

## Unit 5: Global Krok po kroku + schema HowTo (M) ✅

- [x] Stwórz `src/globals/KrokPoKrokuPage.ts` (slug `krok-po-kroku`, label „Krok po kroku", hook revalidate)
- [x] Pola: `intro` {heroTitle, heroSubtitle}; `steps` array `minRows:7, maxRows:7`, item {title, desc}; `sidebar` {reminderLabel, reminderHeading, reminderText, zasilekLabel, zasilekText}
- [x] Stwórz `src/data/process-steps.ts` (steps + sidebar defaults) + `src/lib/krok-po-kroku.ts`: `getKrokContent()` + FALLBACK
- [x] Modyfikuj `src/payload.config.ts`, `src/app/(frontend)/krok-po-kroku/page.tsx` (numer kroku z indeksu, `howToSchema` z globala)
- [x] `pnpm generate:types` (typ: `KrokPoKroku`)
- [ ] Test (E2E): edycja `steps[2].title` → `/krok-po-kroku` pokazuje nowy tytuł i numer „03" (dev-docs-review)
- [ ] Test (E2E): locked rows — brak add/remove kroków (dev-docs-review)
- [x] Weryfikacja: `generate:types`; typecheck + lint czyste; `howToSchema` budowane z `steps` (render w review)

## Unit 6: Global Tanatokosmetyka + wiring (S)

- [ ] Stwórz `src/globals/TanatokosmetykaPage.ts` (slug `tanatokosmetyka`, label „Tanatokosmetyka", hook revalidate)
- [ ] Pola: `title`, `image`, `description[]`, `features[]`
- [ ] Stwórz `src/lib/tanatokosmetyka.ts`: `getTanatoContent()` + FALLBACK
- [ ] Modyfikuj `src/payload.config.ts`, `src/app/(frontend)/tanatokosmetyka/page.tsx` (sync → async, obrazek przez `resolveMediaUrl`)
- [ ] `pnpm generate:types`
- [ ] Test (E2E): edycja `title` → `/tanatokosmetyka` pokazuje nowy tytuł w hero i breadcrumb
- [ ] Test (E2E): puste `image` → fallback Unsplash w ServiceLayout
- [ ] Weryfikacja: `generate:types`; strona renderuje z globala; typecheck czysty

## Unit 7: Global Zasiłek pogrzebowy + schema FAQ (L)

- [ ] Stwórz `src/globals/ZasilekPage.ts` (slug `zasilek-pogrzebowy`, label „Zasiłek pogrzebowy", hook revalidate)
- [ ] Pola (groupy): `intro` {heroTitle, heroSubtitle}; `whatIs` {heading, text}; `whoQualifies` {heading, intro, bullets[]}; `amount` {heading, amountLabel, amountValue, amountNote, text}; `documents` {heading, bullets[]}; `deadline` {heading, text}; `ctaBox` {heading, text}; `faq` array {question, answer}
- [ ] Stwórz `src/lib/zasilek.ts`: `getZasilekContent()` + FALLBACK
- [ ] Modyfikuj `src/payload.config.ts`, `src/app/(frontend)/zasilek-pogrzebowy/page.tsx` (`faqSchema` z globala, obsługa `<strong>` w deadline — plain)
- [ ] `pnpm generate:types`
- [ ] Test (E2E): edycja `amount.amountValue` → `/zasilek-pogrzebowy` pokazuje nową kwotę
- [ ] Test (E2E): dodanie punktu w `documents.bullets` → widoczne na stronie
- [ ] Test (E2E): edycja `faq[0].answer` → odzwierciedlone w JSON-LD FAQ na stronie
- [ ] Weryfikacja: `generate:types`; strona i schema FAQ z globala; typecheck czysty

## Unit 8: Finalna weryfikacja, typy, quality gate (M)

- [ ] Weryfikuj `src/payload.config.ts`: 6 nowych globali + `SiteSettings` zarejestrowane
- [ ] Weryfikuj że żadna strona nie importuje usuniętych pól z `src/data/services.ts`
- [ ] Weryfikuj że wszystkie 6 globali mają hook revalidate
- [ ] Uruchom `pnpm generate:types`
- [ ] Uruchom `pnpm test:int`
- [ ] Uruchom typecheck
- [ ] Uruchom `pnpm lint`
- [ ] Uruchom `pnpm build`
- [ ] Test (E2E): wszystkie 6 podstron w panelu mają polski label, grupę „Treści", brak zakładki Media w nav
- [ ] Test (E2E): smoke front — `/`, `/oferta`, `/oferta/[slug]`, `/galeria`, `/krok-po-kroku`, `/tanatokosmetyka`, `/zasilek-pogrzebowy` renderują bez błędów
- [ ] Weryfikacja: zielony `pnpm test:int`, zero błędów typecheck/lint, `pnpm build` przechodzi, brak `any`/`!` w nowym kodzie

## Źródła
- Requirements doc: docs/dev-brainstorms/2026-05-29-edycja-tresci-podstron-requirements.md
- Plan techniczny: docs/plans/2026-05-29-001-feat-edytowalne-tresci-podstron-plan.md
