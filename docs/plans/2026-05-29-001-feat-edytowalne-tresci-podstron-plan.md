---
title: "feat: Edytowalne treści wszystkich podstron w CMS"
type: feat
status: active
date: 2026-05-29
origin: docs/dev-brainstorms/2026-05-29-edycja-tresci-podstron-requirements.md
---

# feat: Edytowalne treści wszystkich podstron w CMS

## Przegląd

Wszystkie podstrony frontu (poza Kontaktem, już edytowalnym) mają teksty i obrazki zahardkodowane w kodzie. Plan udostępnia edycję tych treści w panelu Payload poprzez globale (singletony) — po jednym na podstronę, analogicznie do istniejącego `SiteSettings`/Kontakt. Obrazki wgrywane inline w polu danej podstrony (kolekcja `media` ukryta z nawigacji). Teksty edytowane prostymi polami (bez rich-text). Listy elementów (usługi, zdjęcia galerii, kroki) mają stały zestaw; akapity i punkty wewnątrz elementu — swobodne.

## Ujęcie problemu

Klient (dom pogrzebowy, nietechniczny) nie może samodzielnie zmienić treści ani zdjęć poza stroną Kontakt. Celem jest pełna, intuicyjna, polskojęzyczna edycja każdej podstrony bez udziału programisty, przy zachowaniu spójnego designu kontrolowanego przez kod. (zob. źródło: docs/dev-brainstorms/2026-05-29-edycja-tresci-podstron-requirements.md)

## Śledzenie wymagań

- R1. Każda podstrona = własny global, grupa admina `Treści`, polski label.
- R2. Edytowalne: Strona główna, Oferta (lista + szczegóły), Galeria, Krok po kroku, Tanatokosmetyka, Zasiłek pogrzebowy.
- R3. Edytowalne wszystkie widoczne teksty i wszystkie obrazki na każdej podstronie.
- R4. Obrazki przez upload inline w polu podstrony, pliki na serwerze.
- R5. Zakładka „Media" ukryta z nawigacji panelu.
- R6. Teksty przez proste pola tekstowe; bez rich-text.
- R7. Listy (usługi, zdjęcia galerii, kroki) — stały zestaw, bez dodawania/usuwania.
- R8. Listy punktowane wewnątrz elementu (cechy, akapity) — edytowalne swobodnie.
- R9. Slugi usług (`/oferta/[slug]`) pozostają w kodzie.
- R10. Każdy global ma hook `afterChange` z `revalidatePath('/', 'layout')`.
- R11. Polskie labele opisujące CO klient edytuje + `admin.description` gdzie pomocne.

## Granice scope'u

- Brak centralnej biblioteki Media jako narzędzia klienta (kolekcja istnieje, ukryta).
- Brak edytora rich-text.
- Brak dodawania/usuwania usług, zdjęć, kroków przez klienta.
- Brak edycji meta-danych SEO (title/description) w CMS — zostają w kodzie.
- Brak edycji slugów / tras URL.
- Bez zmiany istniejącego wzorca Kontakt (`SiteSettings`).

## Kontekst i research

### Relevantny kod i wzorce

- `src/globals/SiteSettings.ts` — wzorzec globala: `slug`, `label`, `admin.group: 'Treści'`, hook `afterChange` z `revalidatePath('/', 'layout')` w try/catch z `req.payload.logger.error`. Pola z polskimi labelami, `admin.description`, `defaultValue`.
- `src/lib/site-settings.ts` — wzorzec helpera: `cache()` + `getPayload({ config })` + `findGlobal({ slug })` + `FALLBACK` w `catch`. Eksportuje typowane `getSiteSettings`.
- `src/collections/Media.ts` — `upload: true`, `access.read: () => true`, pole `alt` required.
- `next.config.ts` — `images.unoptimized: true` → `next/image` przyjmuje lokalne URL-e uploadów (`/api/media/file/...`) bez `remotePatterns`. Zero zmian.
- `src/payload.config.ts` — rejestracja w `globals: [...]`. Komentarz: `serverURL` celowo nieustawiony (csrf).
- Strony front i ich obecna treść (źródło defaultValue):
  - `src/app/(frontend)/page.tsx` — hero, sekcja „O nas", sekcja usług (mapuje `services`), CTA. Stałe `HERO_IMG`, `ABOUT_IMG` (Unsplash).
  - `src/app/(frontend)/oferta/page.tsx` + `oferta/[slug]/page.tsx` — `generateStaticParams` z `services`, `ServiceLayout`.
  - `src/data/services.ts` — 13 usług (slug, title, shortDesc, description[], features[], imageUrl Unsplash) + `getService(slug)`.
  - `src/app/(frontend)/galeria/page.tsx` — 12 obrazków (Unsplash, stałe ratio), nota na dole.
  - `src/app/(frontend)/krok-po-kroku/page.tsx` — 7 kroków + sidebar (2 boksy) + schema HowTo.
  - `src/app/(frontend)/tanatokosmetyka/page.tsx` — `ServiceLayout`, 1 obrazek, description[], features[].
  - `src/app/(frontend)/zasilek-pogrzebowy/page.tsx` — 5 sekcji + boks kwoty + CTA + schema FAQ (3 wpisy).
  - `src/components/ServiceLayout.tsx` — props `title, description[], features[], imageUrl?`; już renderuje placeholder gdy brak `imageUrl`.
  - `src/components/PageHero.tsx` — props `title, subtitle?, breadcrumb`.

### Wiedza instytucjonalna

- `docs/solutions/` — brak (katalog pusty/nieobecny).
- Memory: każda nowa edytowalna kolekcja/global wymaga hooka revalidate (login-loop i cache-prod udokumentowane wcześniej). Wzorzec już w `SiteSettings`.

### Referencje zewnętrzne

- Nie wykonano — codebase ma silny lokalny wzorzec (`SiteSettings` + `getSiteSettings`), Payload 3 dobrze znany w projekcie.

## Kluczowe decyzje techniczne

- **Globale (singletony), nie kolekcje**: pasuje do natury podstron (po jednej z każdej) i do wzorca Kontakt.
- **Współdzielony helper `fetchGlobal(slug, fallback)`**: jedna implementacja try/catch+cache zamiast duplikacji w 6 plikach (coding rules: extract shared przy 2+ użyciach). Per-strona cienki typowany wrapper z własnym FALLBACK.
- **`resolveMediaUrl(field, fallback)`**: pole upload zwraca `string | Media | null`; util narzuca narrowing i stosuje fallback Unsplash z kodu gdy puste. Czysta, testowalna funkcja.
- **Fallback obrazków = obecne URL-e Unsplash w kodzie**: pole upload nie da się zaseedować plikiem; gdy puste, frontend używa dotychczasowego Unsplash → strona kompletna od deployu, klient podmienia gdy chce. (decyzja z planowania)
- **Slugi usług = stała w kodzie** (`SERVICE_SLUGS` / zachowany szkielet w `src/data/services.ts`): `generateStaticParams` niezależny od DB w buildzie; global trzyma tylko edytowalną treść mapowaną po slug. Slug w arrayu jako pole `admin.readOnly`.
- **Sekcja usług na Stronie głównej czerpie z globala `oferta`**: jedno źródło prawdy, brak duplikacji treści usług.
- **Stały zestaw list = `minRows = maxRows = N`** na polu array; reorder dozwolony, add/remove zablokowane. Akapity (`description`) i punkty (`features`, `bullets`) = arraye bez limitu (swobodne).
- **Media ukryte przez `admin.hidden: true`** na kolekcji — znika z nawigacji, pozostaje używalne przez pole upload.
- **Schematy JSON-LD (HowTo, FAQ, Service) budowane z treści globala**, nie z kodu — inaczej edycja rozjedzie SEO.

## Otwarte pytania

### Rozwiązane podczas planowania

- Jak `/oferta/[slug]` resoluje treść: `generateStaticParams` ze stałej `SERVICE_SLUGS`; strona czyta global `oferta`, mapuje po `slug`, `notFound()` gdy brak.
- Ukrycie Media: `admin.hidden: true` na kolekcji.
- Domyślne obrazki: fallback Unsplash z kodu w `resolveMediaUrl`.
- Sekcja usług na home: z globala `oferta`.
- Akapity/cechy/punkty: arraye swobodne; liczba usług/zdjęć/kroków zablokowana `minRows=maxRows`.

### Odroczone do implementacji

- Drawer pola upload nadal pozwala „przeglądać" wcześniejsze uploady (Payload native). Akceptowalne — głównym wymaganiem jest ukrycie zakładki Media z nawigacji. Ewentualny `filterOptions`/scoping per pole do rozważenia dopiero jeśli klient zgłosi problem.
- Dokładny depth w `findGlobal` (domyślny vs jawny) — zweryfikować że upload resolvuje się do obiektu z `.url` na realnych danych; w razie czego dodać `depth: 1`.
- Pole `ratio` zdjęć galerii: zostaje w kodzie per indeks (layout), nieedytowalne — potwierdzić przy wiringu że obecne ratio pasują do 12 slotów.
- Czy `bold`/inline-emfaza w tekście zasiłku (obecnie `<strong>`) zostaje pominięta przy przejściu na plain text — potwierdzić wizualnie.

## Implementation Units

- [ ] **Unit 1: Fundament — ukrycie Media, util obrazka, współdzielony fetch globala**

**Cel:** Przygotować wspólną infrastrukturę używaną przez wszystkie podstrony: ukrycie kolekcji Media z nawigacji, util `resolveMediaUrl` z fallbackiem, generyczny `fetchGlobal`.

**Wymagania:** R4, R5

**Zależności:** Brak

**Pliki:**
- Modyfikuj: `src/collections/Media.ts` (dodaj `admin: { hidden: true }`, polski label pola `alt`: „Tekst alternatywny (opis zdjęcia)")
- Stwórz: `src/lib/media.ts` (`resolveMediaUrl(field, fallback)`)
- Stwórz: `src/lib/payload-global.ts` (`fetchGlobal<T>(slug, fallback)` — cache+try/catch+logger)
- Test (unit): `tests/int/media-url.int.spec.ts`

**Podejście:**
- `resolveMediaUrl`: przyjmuje `string | { url?: string | null } | null | undefined` + `fallback: string`; zwraca `media.url` gdy obiekt z url, inaczej `fallback`. Bez `any` — typ wejścia jako union, narrowing po `typeof`/`'url' in`.
- `fetchGlobal`: opakowuje `getPayload({ config })` + `findGlobal({ slug })`, `cache()`, w catch loguje i zwraca przekazany `fallback`. Sygnatura generyczna typowana per global.
- `Media.admin.hidden: true` ukrywa z nawigacji, pole upload nadal działa.

**Wzorce do naśladowania:**
- `src/lib/site-settings.ts` (cache + try/catch + FALLBACK + logging).

**Scenariusze testowe:**
- [Unit] `resolveMediaUrl` zwraca `media.url` gdy podano obiekt z `url`.
- [Unit] `resolveMediaUrl` zwraca `fallback` gdy `null`/`undefined`/string-id/obiekt bez `url`.
- [E2E] Po zalogowaniu do `/admin` nawigacja nie zawiera pozycji „Media".

**Weryfikacja:**
- `pnpm test:int` zielony dla nowego pliku; w panelu brak zakładki Media; typecheck czysty.

- [ ] **Unit 2: Global Strona główna + wiring**

**Cel:** Uedytowalnić hero, „O nas", nagłówki sekcji usług i CTA na stronie głównej.

**Wymagania:** R1, R2, R3, R6, R8, R10, R11

**Zależności:** Unit 1

**Pliki:**
- Stwórz: `src/globals/HomePage.ts` (slug `strona-glowna`, label „Strona główna", group `Treści`)
- Stwórz: `src/lib/home.ts` (`getHomeContent()` przez `fetchGlobal` + FALLBACK)
- Modyfikuj: `src/payload.config.ts` (rejestracja globala)
- Modyfikuj: `src/app/(frontend)/page.tsx` (czytanie z globala, fallback Unsplash przez `resolveMediaUrl`)
- Test (e2e): scenariusz poniżej

**Podejście:**
- Pola (group): `hero` {badge, titleLine1, titleLine2, subtitle(textarea), image(upload), ctaPrimaryLabel, ctaSecondaryLabel}; `about` {label, heading, paragraphs(array textarea, swobodne), bullets(array text, swobodne), ctaLabel, image(upload)}; `services` {label, heading, subtitle}; `cta` {heading, text}.
- `defaultValue` z obecnych tekstów `page.tsx`. Obrazki bez defaultu → fallback `HERO_IMG`/`ABOUT_IMG` (przenieść stałe do `src/lib/home.ts` jako fallbacki).
- Sekcja kart usług dalej mapuje treść z globala `oferta` (Unit 3) — do czasu Unit 3 zostaje na `services` z `src/data/services.ts`; po Unit 3 przełączyć na `getOfertaContent()`.
- Hook `afterChange` revalidate jak w `SiteSettings`.

**Wzorce do naśladowania:**
- `src/globals/SiteSettings.ts`, `src/lib/site-settings.ts`.

**Scenariusze testowe:**
- [E2E] `/admin` → „Strona główna" → zmiana `hero.titleLine2` → zapis → `/` pokazuje nowy tekst.
- [E2E] Puste `hero.image` → `/` renderuje fallback Unsplash (strona nie jest pusta).

**Weryfikacja:**
- `pnpm generate:types` przechodzi; `/` renderuje treść z globala; typecheck czysty.

- [ ] **Unit 3: Global Oferta (usługi) + wiring listy, szczegółów i sekcji home**

**Cel:** Uedytowalnić 13 usług (tytuł, opis, akapity, cechy, obrazek) używanych w `/oferta`, `/oferta/[slug]` i sekcji usług na home; slugi pozostają w kodzie.

**Wymagania:** R1, R2, R3, R6, R7, R8, R9, R10, R11

**Zależności:** Unit 1, Unit 2

**Pliki:**
- Stwórz: `src/globals/OfertaPage.ts` (slug `oferta`, label „Oferta (usługi)", group `Treści`)
- Stwórz: `src/lib/oferta.ts` (`getOfertaContent()`, `getServiceContent(slug)`, FALLBACK z obecnych danych)
- Modyfikuj: `src/data/services.ts` (zredukować do `SERVICE_SLUGS` + szkielet kolejności/fallbacków obrazków; usunąć treść przeniesioną do globala) lub zastąpić nowym `src/data/service-slugs.ts`
- Modyfikuj: `src/payload.config.ts` (rejestracja)
- Modyfikuj: `src/app/(frontend)/oferta/page.tsx`, `src/app/(frontend)/oferta/[slug]/page.tsx`, `src/app/(frontend)/page.tsx` (sekcja usług)
- Test (e2e): scenariusz poniżej

**Podejście:**
- Pola: `intro` {heroTitle, heroSubtitle}; `services` array `minRows: 13, maxRows: 13`, item {slug(text, `admin.readOnly`), title, shortDesc(textarea), description(array textarea, swobodne), features(array text, swobodne), image(upload)}.
- `defaultValue` arraya = pełna obecna treść z `src/data/services.ts` (13 pozycji ze slugami).
- `generateStaticParams` czyta `SERVICE_SLUGS` (stała w kodzie) — niezależne od DB.
- `getServiceContent(slug)` mapuje pozycję arraya po `slug`; `notFound()` gdy brak; obrazek przez `resolveMediaUrl(item.image, fallbackPerSlug)`.
- Schema `Service` w `[slug]/page.tsx` używa `title`/`shortDesc` z globala.

**Wzorce do naśladowania:**
- `SiteSettings.locations` (array z polami + defaultValue), `getService` (mapowanie po slug).

**Scenariusze testowe:**
- [E2E] Edycja `services[0].title` → zapis → `/oferta` i `/oferta/sala-pozegnan` pokazują nowy tytuł.
- [E2E] W panelu nie da się dodać 14. usługi ani usunąć istniejącej (locked rows).
- [E2E] Dodanie/usunięcie punktu w `features` jednej usługi działa (swobodny array).
- [E2E] Wejście na nieistniejący slug → 404.

**Weryfikacja:**
- `pnpm generate:types`; `/oferta`, każdy `/oferta/[slug]` i sekcja usług na `/` renderują z globala; `generateStaticParams` zwraca 13 slugów; typecheck czysty.

- [ ] **Unit 4: Global Galeria + wiring**

**Cel:** Uedytowalnić 12 zdjęć galerii (obrazek + alt) oraz teksty hero i notę.

**Wymagania:** R1, R2, R3, R4, R6, R7, R10, R11

**Zależności:** Unit 1

**Pliki:**
- Stwórz: `src/globals/GaleriaPage.ts` (slug `galeria`, label „Galeria")
- Stwórz: `src/lib/galeria.ts` (`getGaleriaContent()` + FALLBACK)
- Modyfikuj: `src/payload.config.ts`, `src/app/(frontend)/galeria/page.tsx`
- Test (e2e): scenariusz poniżej

**Podejście:**
- Pola: `intro` {heroTitle, heroSubtitle}; `footerNote` (text); `images` array `minRows: 12, maxRows: 12`, item {image(upload), alt(text)}.
- `ratio` per indeks pozostaje w kodzie (layout) — mapowane po indeksie arraya.
- Fallback obrazka per indeks = obecny Unsplash z `galeria/page.tsx`.

**Wzorce do naśladowania:**
- `SiteSettings.locations` (locked-ish array), `resolveMediaUrl`.

**Scenariusze testowe:**
- [E2E] Wgranie zdjęcia w `images[0]` → `/galeria` pokazuje wgrany plik zamiast fallbacku.
- [E2E] Puste sloty → fallback Unsplash, layout 12 kafelków zachowany.

**Weryfikacja:**
- `pnpm generate:types`; `/galeria` renderuje 12 kafelków z poprawnymi ratio; typecheck czysty.

- [ ] **Unit 5: Global Krok po kroku + wiring + schema HowTo**

**Cel:** Uedytowalnić 7 kroków, teksty hero i sidebar; schema HowTo z treści.

**Wymagania:** R1, R2, R3, R6, R7, R8, R10, R11

**Zależności:** Unit 1

**Pliki:**
- Stwórz: `src/globals/KrokPoKrokuPage.ts` (slug `krok-po-kroku`, label „Krok po kroku")
- Stwórz: `src/lib/krok-po-kroku.ts` (`getKrokContent()` + FALLBACK)
- Modyfikuj: `src/payload.config.ts`, `src/app/(frontend)/krok-po-kroku/page.tsx`
- Test (e2e): scenariusz poniżej

**Podejście:**
- Pola: `intro` {heroTitle, heroSubtitle}; `steps` array `minRows: 7, maxRows: 7`, item {title, desc(textarea)}; `sidebar` {reminderLabel, reminderHeading, reminderText, zasilekLabel, zasilekText}.
- Numer kroku (`01`..`07`) generowany z indeksu w kodzie.
- `howToSchema` budowane z `steps` globala (position=index+1).

**Wzorce do naśladowania:**
- `SiteSettings`, schema-building inline w obecnym `krok-po-kroku/page.tsx`.

**Scenariusze testowe:**
- [E2E] Edycja `steps[2].title` → `/krok-po-kroku` pokazuje nowy tytuł i numer „03".
- [E2E] Locked rows: brak add/remove kroków.
- [Unit] (opcjonalnie) builder schematu HowTo z 7 kroków daje 7 `HowToStep` z poprawnymi `position`.

**Weryfikacja:**
- `pnpm generate:types`; strona i `<script type="application/ld+json">` odzwierciedlają treść globala; typecheck czysty.

- [ ] **Unit 6: Global Tanatokosmetyka + wiring**

**Cel:** Uedytowalnić tytuł, obrazek, akapity i cechy strony tanatokosmetyki (ServiceLayout).

**Wymagania:** R1, R2, R3, R4, R6, R8, R10, R11

**Zależności:** Unit 1

**Pliki:**
- Stwórz: `src/globals/TanatokosmetykaPage.ts` (slug `tanatokosmetyka`, label „Tanatokosmetyka")
- Stwórz: `src/lib/tanatokosmetyka.ts` (`getTanatoContent()` + FALLBACK)
- Modyfikuj: `src/payload.config.ts`, `src/app/(frontend)/tanatokosmetyka/page.tsx`
- Test (e2e): scenariusz poniżej

**Podejście:**
- Pola: `title`, `image(upload)`, `description`(array textarea, swobodne), `features`(array text, swobodne).
- Strona musi stać się `async` (czyta global) — obecnie sync. Obrazek przez `resolveMediaUrl(image, fallbackUnsplash)`.

**Wzorce do naśladowania:**
- `ServiceLayout` props, `src/lib/site-settings.ts`.

**Scenariusze testowe:**
- [E2E] Edycja `title` → `/tanatokosmetyka` pokazuje nowy tytuł w hero i breadcrumb.
- [E2E] Puste `image` → fallback Unsplash w ServiceLayout.

**Weryfikacja:**
- `pnpm generate:types`; strona renderuje z globala; typecheck czysty.

- [ ] **Unit 7: Global Zasiłek pogrzebowy + wiring + schema FAQ**

**Cel:** Uedytowalnić 5 sekcji treści, boks kwoty, CTA i hero; schema FAQ z edytowalnych danych.

**Wymagania:** R1, R2, R3, R6, R8, R10, R11

**Zależności:** Unit 1

**Pliki:**
- Stwórz: `src/globals/ZasilekPage.ts` (slug `zasilek-pogrzebowy`, label „Zasiłek pogrzebowy")
- Stwórz: `src/lib/zasilek.ts` (`getZasilekContent()` + FALLBACK)
- Modyfikuj: `src/payload.config.ts`, `src/app/(frontend)/zasilek-pogrzebowy/page.tsx`
- Test (e2e): scenariusz poniżej

**Podejście:**
- Pola (groupy): `intro` {heroTitle, heroSubtitle}; `whatIs` {heading, text}; `whoQualifies` {heading, intro, bullets(array swobodne)}; `amount` {heading, amountLabel, amountValue, amountNote, text}; `documents` {heading, bullets(array swobodne)}; `deadline` {heading, text}; `ctaBox` {heading, text}; `faq` array swobodne {question, answer} (dane do schematu FAQ — niewidoczne, ale SEO musi zgadzać się z `amount`).
- `<strong>` w sekcji deadline: przy plain text pominąć inline-bold lub zachować całość jako jedno pole text (bez formatowania). Potwierdzić wizualnie (odroczone).
- `faqSchema` budowane z `faq` globala.

**Wzorce do naśladowania:**
- `SiteSettings` (groupy + arraye), obecny schema-building w `zasilek-pogrzebowy/page.tsx`.

**Scenariusze testowe:**
- [E2E] Edycja `amount.amountValue` → `/zasilek-pogrzebowy` pokazuje nową kwotę.
- [E2E] Dodanie punktu w `documents.bullets` → widoczne na stronie.
- [E2E] Edycja `faq[0].answer` → odzwierciedlone w JSON-LD FAQ na stronie.

**Weryfikacja:**
- `pnpm generate:types`; strona i schema FAQ z globala; typecheck czysty.

- [ ] **Unit 8: Finalna weryfikacja, typy i quality gate**

**Cel:** Upewnić się że wszystkie globale zarejestrowane, typy zsynchronizowane, build i front spójne; przejść quality gate.

**Wymagania:** R1–R11 (weryfikacja całościowa)

**Zależności:** Unit 1–7

**Pliki:**
- Modyfikuj (weryfikacja): `src/payload.config.ts` (6 nowych globali + `SiteSettings` w `globals`)
- Weryfikacja: `src/payload-types.ts` (po `pnpm generate:types`)

**Podejście:**
- Uruchomić `pnpm generate:types`, `pnpm test:int`, typecheck, `pnpm lint`, `pnpm build` (kolejność z CLAUDE.md: test:int → typecheck → lint).
- Sprawdzić że żadna strona nie importuje już usuniętych pól z `src/data/services.ts`.
- Sprawdzić że wszystkie hooki revalidate obecne (6 globali).

**Wzorce do naśladowania:**
- Quality gate z CLAUDE.md i coding-rules.md.

**Scenariusze testowe:**
- [E2E] Przejście przez wszystkie 6 podstron w panelu: każda ma polski label, grupę „Treści", brak zakładki Media w nav.
- [E2E] Smoke front: `/`, `/oferta`, `/oferta/[slug]`, `/galeria`, `/krok-po-kroku`, `/tanatokosmetyka`, `/zasilek-pogrzebowy` renderują bez błędów.

**Weryfikacja:**
- Zielony `pnpm test:int`, zero błędów typecheck/lint, `pnpm build` przechodzi, brak `any`/`!` w nowym kodzie.

## Wpływ systemowy

- **Graf interakcji:** Każdy global wprowadza hook `afterChange` → `revalidatePath('/', 'layout')`. Frontend Server Components czytają globale przez helpery `cache()` (direct DB, bez HTTP).
- **Propagacja błędów:** Helpery łapią błąd `findGlobal`, logują przez `console.error`/logger i zwracają FALLBACK — strona nigdy nie wywala się przez brak danych CMS.
- **Ryzyka cyklu życia stanu:** Bez hooka revalidate zmiany nie wejdą na prod (strony prerenderowane) — każdy global MUSI mieć hook (memory: cache-prod-revalidate).
- **Parytet surface API:** Wszystkie globale naśladują `SiteSettings` — spójny kształt dla przyszłych edycji.
- **Pokrycie integracyjne:** Realne resolvowanie upload→`.url` w `findGlobal` weryfikowalne tylko na żywym panelu (E2E), nie unit testem.

## Ryzyka i zależności

- Pola upload nie przyjmują `defaultValue` z plikiem → zależność od fallbacku Unsplash w kodzie (zaadresowane przez `resolveMediaUrl`).
- Trwałość uploadów na prod (Docker) — pliki muszą lądować na wolumenie przetrwającym deploy; zweryfikować konfigurację storage (odroczone z requirements R4). Jeśli brak persystencji, rozważyć adapter storage — poza scope tego planu, ale zasygnalizować.
- `minRows=maxRows` blokuje add/remove, ale klient może zmienić kolejność — akceptowalne (R7 mówi o stałym zestawie, nie o stałej kolejności).
- Duża liczba pól w panelu (zwł. zasiłek) — dbać o polskie labele i `admin.description`, by panel pozostał intuicyjny (R11).

## Dokumentacja / Notatki operacyjne

- Po wdrożeniu: krótka instrukcja dla klienta gdzie edytować co (opcjonalnie, poza scope kodu).
- Zweryfikować wolumen uploadów w `docker-compose.prod.yml` (persystencja plików media).

## Źródła i referencje

- **Dokument źródłowy:** docs/dev-brainstorms/2026-05-29-edycja-tresci-podstron-requirements.md
- Powiązany kod: `src/globals/SiteSettings.ts`, `src/lib/site-settings.ts`, `src/collections/Media.ts`, `src/data/services.ts`
- Powiązane memory: `payload-prod-cache-revalidate`, `feedback-cms-labels`
