# Kontekst: Edytowalne treści podstron

Branch: `feature/edytowalne-tresci-podstron`
Ostatnia aktualizacja: 2026-05-29 (Unity 1–8 zaimplementowane)

## Powiązane pliki

### Wzorce do naśladowania
- `src/globals/SiteSettings.ts` — wzorzec globala (slug, label, `admin.group: 'Treści'`, hook `afterChange` → `revalidatePath('/', 'layout')` w try/catch z `req.payload.logger.error`, pola z polskimi labelami + `admin.description` + `defaultValue`).
- `src/lib/site-settings.ts` — wzorzec helpera (`cache()` + `getPayload({ config })` + `findGlobal({ slug })` + `FALLBACK` w catch, typowany eksport).
- `src/collections/Media.ts` — `upload: true`, `access.read: () => true`, `alt` required.
- `src/payload.config.ts` — rejestracja w `globals: [...]`; `serverURL` celowo nieustawiony (csrf).
- `next.config.ts` — `images.unoptimized: true` → `next/image` przyjmuje lokalne URL-e uploadów bez `remotePatterns`.

### Pliki do stworzenia
- `src/lib/media.ts` — `resolveMediaUrl(field, fallback)`
- `src/lib/payload-global.ts` — `fetchGlobal<T>(slug, fallback)`
- `src/globals/HomePage.ts`, `src/lib/home.ts`
- `src/globals/OfertaPage.ts`, `src/lib/oferta.ts`
- `src/globals/GaleriaPage.ts`, `src/lib/galeria.ts`
- `src/globals/KrokPoKrokuPage.ts`, `src/lib/krok-po-kroku.ts`
- `src/globals/TanatokosmetykaPage.ts`, `src/lib/tanatokosmetyka.ts`
- `src/globals/ZasilekPage.ts`, `src/lib/zasilek.ts`
- `tests/int/media-url.int.spec.ts`

### Pliki do modyfikacji
- `src/collections/Media.ts` (`admin: { hidden: true }`, polski label `alt`)
- `src/payload.config.ts` (rejestracja 6 globali)
- `src/data/services.ts` (redukcja do `SERVICE_SLUGS` + fallbacki obrazków; treść → global)
- `src/app/(frontend)/page.tsx`
- `src/app/(frontend)/oferta/page.tsx`, `src/app/(frontend)/oferta/[slug]/page.tsx`
- `src/app/(frontend)/galeria/page.tsx`
- `src/app/(frontend)/krok-po-kroku/page.tsx`
- `src/app/(frontend)/tanatokosmetyka/page.tsx` (sync → async)
- `src/app/(frontend)/zasilek-pogrzebowy/page.tsx`

## Decyzje techniczne

- Globale (singletony), nie kolekcje — pasują do natury podstron i wzorca Kontakt.
- `fetchGlobal` współdzielony (DRY try/catch+cache); per-strona cienki typowany wrapper z FALLBACK.
- `resolveMediaUrl` narzuca narrowing `string | Media | null` → url lub fallback; bez `any`, bez `!`.
- Fallback obrazków = Unsplash z kodu gdy pole upload puste.
- Slugi usług w kodzie (`SERVICE_SLUGS`); slug w arrayu jako `admin.readOnly`; mapowanie po slug; `notFound()` gdy brak.
- Sekcja usług home z globala `oferta`.
- Stały zestaw: `minRows=maxRows=N` (reorder dozwolony, add/remove nie).
- Akapity/cechy/punkty/bullets = arraye bez limitu.
- Media ukryte: `admin.hidden: true` (działa nadal w polu upload).
- Schematy JSON-LD z treści globala (SEO spójne z edycją).
- Numery kroków galerii/ratio per indeks pozostają w kodzie.

## Zależności

- Payload CMS 3.x, Next.js 16 App Router, MongoDB, React 19, TypeScript, pnpm.
- Po każdej zmianie pól: `pnpm generate:types`.
- Kolejność quality gate (CLAUDE.md): `pnpm test:int` → typecheck → `pnpm lint`.
- Każdy global → hook revalidate (memory: `payload-prod-cache-revalidate`).
- Labele = co klient edytuje, nie nazwa techniczna (memory: `feedback-cms-labels`).

## Odroczone (do potwierdzenia w implementacji)

- Drawer pola upload nadal pozwala przeglądać wcześniejsze uploady — akceptowalne.
- Depth w `findGlobal` (domyślny vs jawny `depth:1`) — zweryfikować że upload resolvuje do obiektu z `.url`.
- `ratio` galerii w kodzie per indeks — potwierdzić dopasowanie do 12 slotów.
- `<strong>` w sekcji deadline zasiłku — przy plain text pominąć/zachować jako całość; potwierdzić wizualnie.
- Persystencja uploadów na prod (`docker-compose.prod.yml`).

## Postęp / odkrycia

### Unit 1 (2026-05-29)
- `resolveMediaUrl` przyjmuje `string | Media | null | undefined` (import typu `Media` z payload-types) — bez `as`, bez `any`.
- `fetchGlobal<S extends keyof Config['globals']>` — generic per slug zwraca `Config['globals'][S]`, bez `as`. Typecheck czysty. Bez `cache()` w środku — dedup robi per-stronowy wrapper (`cache()` w helperach Unit 2+).
- `Media.admin.hidden = true` ukrywa z nawigacji; pole upload nadal działa.
- Testy `resolveMediaUrl`: 5/5 zielone (`tests/int/media-url.int.spec.ts`).

### Unity 2–8 (2026-05-29)
- 6 globali (strona-glowna, oferta, galeria, krok-po-kroku, tanatokosmetyka, zasilek-pogrzebowy) + per-strona helpery z `cache()` i FALLBACK. Każdy z hookiem revalidate.
- Wygenerowane typy: `StronaGlowna`, `Oferta`, `Galeria`, `KrokPoKroku`, `Tanatokosmetyka`, `ZasilekPogrzebowy`.
- Dane seed/fallback w `src/data/{services,gallery,process-steps,zasilek}.ts` — współdzielone przez global (defaultValue) i helper (FALLBACK), bez cyklu importów.
- Schematy JSON-LD (HowTo, FAQ, Service) budowane z treści globala.
- `getService` usunięty (martwy kod po przejściu na `getServiceContent`). `<strong>` w zasilek/deadline → plain text.
- Quality gate: typecheck 0, lint 0 errorów, test:int 6/6, build exit 0 (SSG 13 stron oferty).
- ROZWIĄZANE: eslint naprawiony osobnym commitem (migracja FlatCompat → natywny flat config Next 16).

### ESLint (rozwiązane)
- `pnpm lint` wywala `ERR_MODULE_NOT_FOUND: '@eslint/eslintrc'`. Pakiet nieobecny w `package.json` i `node_modules`, a `eslint.config.mjs` importuje go przez `FlatCompat`.
- NIE wprowadzone przez tę gałąź — config eslint nietknięty.
- Quality gate „lint" niewykonalny dopóki nie doinstalowane `@eslint/eslintrc` (devDependency). Wymaga zgody usera na instalację.

## Źródła
- Requirements doc: docs/dev-brainstorms/2026-05-29-edycja-tresci-podstron-requirements.md
- Plan techniczny: docs/plans/2026-05-29-001-feat-edytowalne-tresci-podstron-plan.md
