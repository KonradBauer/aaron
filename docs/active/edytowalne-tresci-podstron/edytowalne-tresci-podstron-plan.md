# Plan: Edytowalne treści wszystkich podstron w CMS

Branch: `feature/edytowalne-tresci-podstron`
Ostatnia aktualizacja: 2026-05-29

## Cele i zakres

Udostępnić klientowi (dom pogrzebowy, nietechniczny) edycję tekstów i obrazków na wszystkich podstronach frontu poza Kontaktem (już edytowalnym). Mechanizm: globale Payload (singletony) per podstrona, analogicznie do `SiteSettings`/Kontakt. Obrazki wgrywane inline (kolekcja `media` ukryta z nawigacji). Teksty przez proste pola (bez rich-text). Listy (usługi, zdjęcia, kroki) stały zestaw; akapity i punkty swobodne.

**W zakresie:** Strona główna, Oferta (lista + szczegóły usług), Galeria, Krok po kroku, Tanatokosmetyka, Zasiłek pogrzebowy.

**Poza zakresem:** centralna biblioteka Media dla klienta, rich-text, dodawanie/usuwanie usług/zdjęć/kroków, edycja SEO meta w CMS, edycja slugów/tras.

## Kluczowe decyzje

- Globale per strona (wzorzec `SiteSettings`), grupa admina `Treści`, polskie labele.
- Współdzielony `fetchGlobal(slug, fallback)` + `resolveMediaUrl(field, fallback)`.
- Fallback obrazków = obecne URL-e Unsplash w kodzie (pole upload nie da się zaseedować plikiem).
- Slugi usług = stała w kodzie; `generateStaticParams` niezależny od DB.
- Sekcja usług na home czerpie z globala `oferta` (jedno źródło prawdy).
- Stały zestaw list = `minRows = maxRows = N`.
- Media ukryte przez `admin.hidden: true`.
- Schematy JSON-LD (HowTo, FAQ, Service) budowane z treści globala.

## Fazy z zadaniami

### Unit 1: Fundament (ukrycie Media, util obrazka, fetch globala) — M
Modyfikacja `Media.ts`, nowe `src/lib/media.ts` i `src/lib/payload-global.ts`. Test jednostkowy `resolveMediaUrl`.

### Unit 2: Global Strona główna + wiring — L
Nowy `HomePage.ts`, `src/lib/home.ts`, rejestracja w configu, wiring `page.tsx`.

### Unit 3: Global Oferta + wiring listy/szczegółów/sekcji home — XL
Nowy `OfertaPage.ts`, `src/lib/oferta.ts`, redukcja `services.ts` do slugów, wiring 3 miejsc.

### Unit 4: Global Galeria + wiring — M
Nowy `GaleriaPage.ts`, `src/lib/galeria.ts`, wiring `galeria/page.tsx`.

### Unit 5: Global Krok po kroku + schema HowTo — M
Nowy `KrokPoKrokuPage.ts`, `src/lib/krok-po-kroku.ts`, wiring + schema z treści.

### Unit 6: Global Tanatokosmetyka + wiring — S
Nowy `TanatokosmetykaPage.ts`, `src/lib/tanatokosmetyka.ts`, wiring (strona → async).

### Unit 7: Global Zasiłek pogrzebowy + schema FAQ — L
Nowy `ZasilekPage.ts`, `src/lib/zasilek.ts`, wiring 5 sekcji + boks kwoty + CTA + FAQ.

### Unit 8: Finalna weryfikacja, typy, quality gate — M
`generate:types`, test:int, typecheck, lint, build. Weryfikacja 6 globali + hooków revalidate.

## Kryteria akceptacji (całościowe)

- Klient edytuje dowolny tekst i obrazek na 6 podstronach bez programisty.
- Zakładka Media niewidoczna w nawigacji panelu.
- Zmiana w panelu pojawia się na prod bez rebuildu (revalidate).
- Panel w całości po polsku, labele zrozumiałe w ≤5 s.
- Quality gate: zielony `pnpm test:int`, zero błędów typecheck/lint, `pnpm build` przechodzi, brak `any`/`!` w nowym kodzie.

## Ryzyka i mitygacje

- Upload nie przyjmuje defaultValue z plikiem → fallback Unsplash w `resolveMediaUrl`.
- Persystencja uploadów na prod (Docker volume) — zweryfikować `docker-compose.prod.yml` (odroczone).
- Brak hooka revalidate = zmiany nie wejdą na prod → każdy global MUSI mieć hook.
- Duża liczba pól (zasiłek) → dbać o labele + `admin.description`.

## Źródła
- Requirements doc: docs/dev-brainstorms/2026-05-29-edycja-tresci-podstron-requirements.md
- Plan techniczny: docs/plans/2026-05-29-001-feat-edytowalne-tresci-podstron-plan.md
