---
date: 2026-05-29
topic: edycja-tresci-podstron
---

# Edycja treści wszystkich podstron w panelu CMS

## Problem
Obecnie tylko strona Kontakt (`SiteSettings` global) jest edytowalna w panelu. Pozostałe podstrony mają treść i obrazki zahardkodowane w kodzie (teksty inline, zdjęcia z Unsplash jako placeholdery). Klient — dom pogrzebowy, nietechniczny — nie może samodzielnie zmienić ani jednego słowa czy zdjęcia poza Kontaktem. Cel: udostępnić edycję tekstów i obrazków na wszystkich podstronach, analogicznie do wzorca Kontakt, z bardzo dobrym, intuicyjnym UX po polsku.

## Wymagania

- **R1.** Każda podstrona dostaje własny global (singleton), analogicznie do `SiteSettings`/Kontakt, z grupą admina `Treści` i polskim labelem opisującym co klient edytuje.
- **R2.** Edytowalne podstrony: Strona główna, Oferta (lista usług + szczegóły usług), Galeria, Krok po kroku, Tanatokosmetyka, Zasiłek pogrzebowy.
- **R3.** Na każdej podstronie edytowalne są wszystkie widoczne teksty (nagłówki sekcji, akapity, podtytuły hero, etykiety) oraz wszystkie obrazki.
- **R4.** Obrazki wgrywane przez upload inline w polu danej podstrony (klik → wybór pliku z dysku). Pliki trzymane na serwerze.
- **R5.** Centralna zakładka „Media" ukryta z menu nawigacji panelu — klient nigdy nie przegląda wspólnej biblioteki, wgrywa zdjęcia tylko z poziomu edytowanej podstrony.
- **R6.** Teksty edytowane przez proste pola tekstowe (osobne pole na nagłówek, osobne na akapit). Bez edytora rich-text — formatowanie i design kontrolowane przez kod, spójny wygląd.
- **R7.** Listy elementów (usługi, zdjęcia galerii, kroki w „Krok po kroku") mają stały zestaw — klient edytuje istniejące pozycje, ale nie dodaje/usuwa nowych. Liczba pozycji zafiksowana w kodzie.
- **R8.** Listy punktowane wewnątrz pojedynczego elementu (np. cechy/features usługi) pozostają edytowalne swobodnie (dodawanie/usuwanie punktów) — to nie jest „dodanie usługi".
- **R9.** Slugi usług (trasy `/oferta/[slug]`) pozostają w kodzie (stałe). Klient edytuje treść usługi, nie jej adres URL.
- **R10.** Każdy global ma hook `afterChange` z `revalidatePath('/', 'layout')` — bez tego zmiany nie wchodzą na prod (strony prerenderowane w build). Wzorzec już istnieje w `SiteSettings`.
- **R11.** Pola w panelu mają polskie labele opisujące CO klient edytuje (nie nazwy techniczne), z `admin.description` gdzie pomocne — analogicznie do Kontakt.

## Kryteria sukcesu
- Klient może zmienić dowolny tekst i dowolne zdjęcie na każdej z 6 podstron bez udziału programisty.
- Klient nigdy nie widzi zakładki Media ani nie zarządza wspólną biblioteką — wgrywa zdjęcia kontekstowo na podstronie.
- Zmiana w panelu pojawia się na produkcji bez rebuildu (revalidate działa).
- Panel jest w całości po polsku, labele zrozumiałe dla nietechnicznej osoby w ≤5 sekund.
- Zero placeholderów Unsplash w finalnym stanie — wszystkie obrazki pochodzą z uploadu klienta (placeholdery jako defaultValue do podmiany).

## Granice scope'u
- **Brak** centralnej biblioteki Media jako narzędzia dla klienta (kolekcja `media` istnieje technicznie, ale ukryta z nawigacji).
- **Brak** edytora rich-text — tylko proste pola tekstowe.
- **Brak** dodawania/usuwania usług, zdjęć galerii, kroków przez klienta (stały zestaw).
- **Brak** edycji meta-danych SEO (title/description) w CMS — zostają w kodzie.
- **Brak** edycji slugów / tras URL przez klienta.
- **Bez** zmiany istniejącego wzorca Kontakt (`SiteSettings`) — nowe globale go naśladują.

## Kluczowe decyzje
- **Upload inline per strona, Media ukryta**: najlepszy UX dla nietechnicznego klienta; jedna kolekcja upload technicznie, ale używana kontekstowo z poziomu podstrony. Wybrane zamiast osobnych kolekcji per strona (mniej boilerplate) i pól URL (zły UX — klient musiałby sam hostować pliki).
- **Globale (singletony) per podstrona**: pasują do istniejącego wzorca Kontakt i do natury podstron (po jednej z każdej). Wybrane zamiast kolekcji.
- **Proste pola tekstowe zamiast rich-text**: spójność designu, intuicyjność, mniejsze ryzyko że klient zepsuje wygląd.
- **Stały zestaw list**: prostota i kontrola; klient nie rozjedzie layoutu przez dodanie 13. zdjęcia czy 5. usługi.
- **SEO w kodzie**: prostszy panel, klient nie musi znać się na SEO; można dodać później bez przebudowy struktury.

## Zależności / Założenia
- Wzorzec do skopiowania: `src/globals/SiteSettings.ts` (struktura, grupa `Treści`, hook revalidate) + `src/lib/site-settings.ts` (helper czytający global w Server Component, direct DB call).
- Po każdej zmianie pól kolekcji/globala uruchomić `pnpm generate:types` (sync `src/payload-types.ts`).
- Każdy nowy global rejestrowany w `src/payload.config.ts` w tablicy `globals`.
- Źródło treści do zaseedowania defaultValue: obecne zahardkodowane teksty/obrazki w plikach stron oraz `src/data/services.ts`.
- Memory: każda nowa edytowalna kolekcja/global wymaga hooka revalidate (patrz `payload-prod-cache-revalidate`).

## Otwarte pytania

### Do rozwiązania przed planowaniem
- (brak — wszystkie decyzje produktowe rozstrzygnięte)

### Odroczone do planowania
- [Dotyczy R7][Techniczne] Mechanizm „stałego zestawu": pola array z `minRows = maxRows = N` vs nazwane grupy per pozycja — wybrać podczas planowania per podstrona.
- [Dotyczy R9][Techniczne] Jak `/oferta/[slug]` resoluje treść z globala po stałym slugu (mapowanie slug→pozycja, `generateStaticParams`).
- [Dotyczy R5][Techniczne] Sposób ukrycia Media z nawigacji (`admin.hidden` / `hideFromNav` na kolekcji) oraz czy ograniczyć modal „przeglądaj bibliotekę" w polu upload.
- [Dotyczy R3][Techniczne] Dokładny rozkład pól per podstrona — wymaga przeczytania każdego `page.tsx` i `PageHero` przy planowaniu, by zmapować sekcje na pola.
- [Dotyczy R2][Techniczne] Czy sekcja usług na Stronie głównej współdzieli dane z globalem Oferty, czy ma własne pola.
- [Dotyczy R4][Wymaga researchu] Konfiguracja przechowywania uploadów na prod (Docker volume / storage) — zweryfikować że pliki przetrwają deploy.

## Następne kroki
→ `/dev-plan` do planowania technicznego implementacji
