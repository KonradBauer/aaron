---
date: 2026-06-01
topic: seo-schema-local-business
---

# SEO Schema — dynamiczny LocalBusiness z CMS

## Problem

`LocalBusinessSchema.tsx` zawiera hardcoded placeholder data: telefon `+48000000000`, adres `ul. Przykładowa 1, Miasto`. Google indeksuje błędne NAP (Name, Address, Phone) w structured data — to obniża wiarygodność local SEO i może generować niezgodności z Google Business Profile. Komponent jest statycznym Server Component niepołączonym z CMS, podczas gdy nagłówek i stopka już prawidłowo czytają z `SiteSettings`.

## Wymagania

- R1. `LocalBusinessSchema` musi czytać `phone` i `locations` z `SiteSettings` przez `getSiteSettings()` — te same dane co header i footer.
- R2. Każda lokalizacja z `SiteSettings.locations` generuje osobny obiekt `PostalAddress` w polu `address` schematu.
- R3. Pole `telephone` w schemacie używa globalnego `settings.phone` z CMS.
- R4. Schemat zachowuje `@type: 'FuneralHome'` (poprawny subtype LocalBusiness dla branży).
- R5. Schemat zachowuje `openingHours: 'Mo-Su 00:00-24:00'` jako string (domyślna wartość dla branży 24h) — nie parsujemy free-text pola `hours` z lokalizacji.
- R6. `LocalBusinessSchema` staje się async Server Component — brak zmian w miejscu użycia w `layout.tsx`.
- R7. Istniejące schematy `FAQPage` (zasiłek) i `HowTo` (krok-po-kroku) pozostają bez zmian — są już dynamiczne i poprawne.

## Kryteria sukcesu

- Google Rich Results Test dla strony głównej pokazuje poprawne dane NAP (prawdziwy telefon, adres) po uzupełnieniu CMS.
- Brak błędów walidacji w Schema.org validator dla wygenerowanego JSON-LD.
- `LocalBusinessSchema` renderuje schema z danymi z CMS — zmiana telefonu w CMS → zmiana w `<script type="application/ld+json">` po revalidation.

## Granice scope'u

- Nie dodajemy `AggregateOffer` — wymaga decyzji biznesowej o publikacji cen.
- Nie dodajemy `openingHoursSpecification` (array format) — obecny string `Mo-Su 00:00-24:00` jest akceptowany przez Google i wystarczający.
- Nie dodajemy `areaServed` — brak danych o obszarze obsługi w CMS.
- Nie duplikujemy schematu per lokalizacja — jeden `FuneralHome` z tablicą adresów jest standardowym wzorcem.

## Kluczowe decyzje

- **Async Server Component**: `LocalBusinessSchema` musi być async żeby wywołać `getSiteSettings()`. Komponent nie był oznaczony jako `'use client'` — zmiana bezkosztowa.
- **Hardcoded openingHours string**: godziny otwarcia 24h/7 dni są stałą dla tej branży; free-text pole `hours` z lokalizacji (`"Dostępni 24h / 7 dni w tygodniu"`) nie nadaje się do parsowania na DayOfWeek enum.

## Zależności / Założenia

- Klient musi uzupełnić dane w CMS (`SiteSettings → Kontakt`) żeby schemat zaczął zwracać prawdziwe NAP. Do tego czasu schema serwuje dane z `defaultValue` pól CMS (placeholdery) — to jest akceptowalne.
- `getSiteSettings()` jest memoizowane przez `React.cache()` — dodatkowe wywołanie w `LocalBusinessSchema` nie generuje dodatkowego zapytania do DB (współdzielony cache w ramach request).

## Następne kroki

→ `/dev-plan` do planowania technicznego implementacji
