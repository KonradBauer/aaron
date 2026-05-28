# SEO Audit — Aaron Dom Pogrzebowy
**Data:** 2026-05-28 | **URL:** http://localhost:3000 | **Strony:** 19

---

## SEO Health Score: 46/100

| Kategoria | Waga | Wynik | Ważony |
|-----------|------|-------|--------|
| Technical SEO | 22% | 35/100 | 7.7 |
| Content Quality | 23% | 62/100 | 14.3 |
| On-Page SEO | 20% | 58/100 | 11.6 |
| Schema / Structured Data | 10% | 5/100 | 0.5 |
| Performance (CWV) | 10% | 60/100 | 6.0 |
| AI Search Readiness | 10% | 30/100 | 3.0 |
| Images | 5% | 55/100 | 2.8 |
| **TOTAL** | **100%** | | **46/100** |

---

## Typ biznesu
**Lokalny Dom Pogrzebowy** (Local Funeral Home) — brick-and-mortar, obszar świadczenia usług: lokalny/regionalny (Polska).

---

## Executive Summary

### Top 5 problemów krytycznych
1. **Brak robots.txt i sitemap.xml** — Google nie może zdekodować struktury strony, crawl budget marnowany
2. **Brak Schema.org (FuneralHome, LocalBusiness)** — zero danych strukturalnych, brak rich results
3. **Placeholder dane** — telefon "+48 000 000 000" i adresy są fikcyjne — indeksowanie z błędnymi danymi NAP
4. **Brak tagów canonical** — ryzyko duplikatów przy indeksowaniu
5. **Kodowanie — brak polskich znaków w wielu meta/tytułach** — "obsluga" zamiast "obsługa", "pozegnan" zamiast "pożegnań"

### Top 5 quick wins (< 2h pracy)
1. Dodać robots.txt i sitemap.xml przez Next.js Metadata API
2. Uzupełnić dane firmy (telefon, adresy)
3. Naprawić polskie znaki w meta description i tytułach
4. Naprawić spację w H1 (aktualnie "AaronZ" zamiast "Aaron Z")
5. Dodać FuneralHome schema JSON-LD

---

## Technical SEO (35/100)

### robots.txt — KRYTYCZNE
- **Status:** 404 (nie istnieje)
- **Wpływ:** Googlebot nie dostaje instrukcji co crawlować, brak linku do sitemap
- **Fix:** Dodać `src/app/robots.ts` w Next.js

```ts
// src/app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin/' },
    sitemap: 'https://twoja-domena.pl/sitemap.xml',
  }
}
```

### sitemap.xml — KRYTYCZNE
- **Status:** 404 (nie istnieje)
- **Wpływ:** Google nie zna pełnej struktury 19 stron, może nie zaindeksować podstron usług
- **Fix:** Dodać `src/app/sitemap.ts`

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { services } from '@/data/services'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://twoja-domena.pl'
  const staticPages = ['/', '/oferta', '/kontakt', '/zasilek-pogrzebowy',
    '/krok-po-kroku', '/galeria', '/tanatokosmetyka']

  return [
    ...staticPages.map(p => ({ url: `${base}${p}`, changeFrequency: 'monthly' as const, priority: p === '/' ? 1 : 0.8 })),
    ...services.map(s => ({ url: `${base}/oferta/${s.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
}
```

### Canonical tags — WYSOKIE
- **Status:** Brak na wszystkich 19 stronach
- **Fix:** Dodać w `layout.tsx` lub przez Next.js `alternates.canonical` w każdej stronie

### Favicon — ŚREDNIE
- **Status:** 404
- **Fix:** Dodać `src/app/favicon.ico` lub `src/app/icon.png`

### HTTPS
- **Status:** Dev (localhost) — produkcja musi mieć HTTPS z redirect 301 z HTTP

### Security headers — ŚREDNIE
- Brak `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`
- **Fix:** Dodać w `next.config.ts` → `headers()`

---

## Content Quality (62/100)

### Polskie znaki w treści meta — KRYTYCZNE
Wiele stron ma usunięte polskie znaki w meta title i description. Szkodzi to pozycjonowaniu na frazy z polskimi znakami.

| Strona | Problem | Powinno być |
|--------|---------|-------------|
| `/` title | "obsluga pogrzebowa" | "obsługa pogrzebowa" |
| `/` meta desc | "obsluga", "pozegnan", "Dostepni" | "obsługa", "pożegnań", "Dostępni" |
| `/oferta` meta desc | "sala pozegnan" | "sala pożegnań" |
| `/krok-po-kroku` title | "Co zrobic po smierci" | "Co zrobić po śmierci" |
| `/kontakt` meta desc | "Skontaktuj sie" | "Skontaktuj się" |

### H1 — spacja brak — WYSOKIE
Na stronie głównej: `"AaronZ godnością i troską."` (brak spacji między "Aaron" a "Z").

W kodzie `page.tsx`:
```tsx
<h1>
  Aaron          ← brak whitespace między tymi elementami
  <strong>Z godnością i troską.</strong>
</h1>
```
Fix: `Aaron<br />` lub `Aaron ` (spacja + newline) lub użyć ` `.

### Treść stron — DOBRA
- ✅ Każda strona ma unikalny, trafny opis
- ✅ Krok po kroku — 7 kroków wartościowej treści
- ✅ Zasiłek pogrzebowy — kompletna informacja z kwotą
- ✅ Każda podstrona usługi ma opis + listę funkcji
- ⚠️ Treść zawiera placeholder "jestesmy" zamiast "jesteśmy" — wewnętrznie spójna

### Duplikaty — BRAK
Wszystkie 19 stron mają unikalny title i description.

---

## On-Page SEO (58/100)

### Tytuły stron
| Strona | Tytuł | Ocena |
|--------|-------|-------|
| / | Aaron Dom Pogrzebowy - Profesjonalna obsluga... | ⚠️ brak polskich znaków |
| /oferta | Oferta \| Aaron Dom Pogrzebowy | ✅ |
| /kontakt | Kontakt \| Aaron Dom Pogrzebowy | ✅ |
| /zasilek-pogrzebowy | Zasiłek pogrzebowy \| Aaron Dom Pogrzebowy | ✅ |
| /oferta/sala-pozegnan | Sala pożegnań \| Aaron Dom Pogrzebowy | ✅ |

### H1 struktura
- ✅ Każda strona ma dokładnie 1 H1
- ✅ H1 opisuje stronę (np. "Sala pożegnań", "Kontakt", "Zasiłek pogrzebowy")
- ⚠️ Strona główna: H1 = "AaronZ godnością i troską." (błąd spacji)

### H2/H3 hierarchia — OK
- H2 używane do sekcji stron
- H3 dla kart usług na stronie głównej

### Meta descriptions
- ✅ Wszystkie strony mają unikalne opisy
- ⚠️ Brak polskich znaków w kilku opisach (patrz Content Quality)
- ✅ Długość 120-160 znaków

### Open Graph
- ✅ og:title — obecny
- ✅ og:description — obecny
- ❌ og:image — BRAK na wszystkich stronach (krytyczne dla social sharing)
- ❌ og:url — brak

### Internal linking (58 linków)
- ✅ Dobre nasycenie linkami wewnętrznymi
- ✅ Footer linkuje do wszystkich usług
- ✅ Breadcrumby na podstronach
- ⚠️ Brak linkowania kontekstowego (np. ze strony "Zasiłek" do "Krok po kroku")

---

## Schema / Structured Data (5/100)

### Status: BRAK structured data

Żadna strona nie posiada JSON-LD. Dla domu pogrzebowego to krytyczny brak — bogatsze wyniki w Google (rich results, knowledge panel) są niemożliwe.

### Wymagane schematy

**1. FuneralHome (strona główna)**
```json
{
  "@context": "https://schema.org",
  "@type": "FuneralHome",
  "name": "Aaron Dom Pogrzebowy",
  "url": "https://twoja-domena.pl",
  "telephone": "+48XXXXXXXXX",
  "openingHours": "Mo-Su 00:00-24:00",
  "priceRange": "$$",
  "address": [
    { "@type": "PostalAddress", "streetAddress": "...", "addressLocality": "...", "postalCode": "...", "addressCountry": "PL" }
  ],
  "hasMap": "https://maps.google.com/...",
  "sameAs": ["https://facebook.com/...", "https://instagram.com/..."]
}
```

**2. BreadcrumbList (podstrony usług)**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Strona główna", "item": "https://..." },
    { "@type": "ListItem", "position": 2, "name": "Oferta", "item": "https://.../oferta" },
    { "@type": "ListItem", "position": 3, "name": "Sala pożegnań", "item": "https://.../oferta/sala-pozegnan" }
  ]
}
```

**3. FAQPage (zasiłek pogrzebowy, krok po kroku)**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Komu przysługuje zasiłek pogrzebowy?", "acceptedAnswer": { "@type": "Answer", "text": "..." } }
  ]
}
```

**4. HowTo (krok po kroku)**
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Co zrobić po śmierci bliskiej osoby",
  "step": [...]
}
```

**5. Service (podstrony usług)**
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Sala pożegnań",
  "provider": { "@type": "FuneralHome", "name": "Aaron Dom Pogrzebowy" },
  "description": "..."
}
```

---

## Performance (60/100)

### Zmierzone metryki (dev, localhost)

| Metryka | Wartość | Ocena |
|---------|---------|-------|
| TTFB | 79ms | ✅ Dobry |
| FCP | 116ms | ✅ Dobry |
| DOMContentLoaded | 122ms | ✅ Dobry |
| LoadComplete | 183ms | ✅ Dobry |
| Transfer size | 18KB HTML | ✅ Mały |
| Zasoby | 23 | ✅ OK |

> ⚠️ Uwaga: To są wartości dev (localhost, bez sieci). Produkcja z Unsplash CDN i Google Fonts będzie wolniejsza.

### Kluczowe problemy produkcyjne

**1. `images.unoptimized: true` — WYSOKIE**
Wyłączona optymalizacja obrazów Next.js. Oznacza brak:
- WebP/AVIF konwersji
- Lazy loading przez optimizera
- Responsive srcset

Naprawić przed wdrożeniem przez:
- Rozwiązanie SSL (Node.js `--use-system-ca` lub certyfikaty systemowe)
- Lub migrację na `next/font` + rozwiązanie certyfikatów produkcyjnych

**2. Google Fonts przez CSS @import — ŚREDNIE**
Render-blocking request do `fonts.googleapis.com`. Należy przenieść na `next/font/google` (font jest wtedy bundle'owany i nie blokuje renderowania).

**3. Brak image preloading hero**
Hero image z Unsplash nie ma `fetchpriority="high"`. Na produkcji z własnymi zdjęciami — dodać.

---

## Images (55/100)

| Problem | Liczba | Strony |
|---------|--------|--------|
| Brak alt (pusty string "") | 1 | Strona główna — hero image |
| `unoptimized: true` | Wszystkie | Brak WebP/AVIF |
| Zewnętrzne CDN (Unsplash) | 15+ | Wszystkie podstrony usług + galeria |

**Fix hero alt:**
```tsx
// page.tsx — hero Image
<Image src={HERO_IMG} alt="Dom Pogrzebowy Aaron — sala pożegnań" fill ... />
```

---

## AI Search Readiness (30/100)

| Czynnik | Status |
|---------|--------|
| llms.txt | ❌ Brak |
| Structured data | ❌ Brak |
| Clear entity signals | ⚠️ Słabe — brak NAP, adresu, telefonu |
| Citability (paragraphs) | ✅ Dobra struktura tekstu |
| Author/expertise signals | ❌ Brak (E-E-A-T) |

**Fix:** Dodać `/llms.txt` z opisem firmy w formacie tekstowym dla AI crawlerów.

---

## Local SEO (szczególnie ważne dla domu pogrzebowego)

### NAP Consistency — KRYTYCZNE
- Telefon: "+48 000 000 000" — placeholder
- Adresy: "ul. Przykładowa 1/2, Miasto" — placeholder
- Mapa Google: placeholder div — brak embed

Przed wdrożeniem: uzupełnić WSZYSTKIE dane firmy w:
- `src/components/Header.tsx` (stała PHONE)
- `src/components/Footer.tsx`
- `src/app/(frontend)/kontakt/page.tsx`

### Google Business Profile
Brak linku do GBP — po rejestracji dodać `sameAs` w FuneralHome schema.

### Lokalne frazy kluczowe
Tytuły stron powinny zawierać miasto/region — np.:
- "Dom Pogrzebowy [Miasto] — Aaron | Usługi 24h"
- "Sala pożegnań [Miasto] — Aaron Dom Pogrzebowy"

---

## Podsumowanie — co zrobić przed wdrożeniem

| Priorytet | Zadanie | Czas |
|-----------|---------|------|
| 🔴 KRYTYCZNE | Uzupełnić dane firmy (telefon, adresy, city) | 15 min |
| 🔴 KRYTYCZNE | Naprawić polskie znaki w meta/title | 30 min |
| 🔴 KRYTYCZNE | Dodać robots.txt i sitemap.xml | 45 min |
| 🔴 KRYTYCZNE | Naprawić H1 spację | 5 min |
| 🔴 KRYTYCZNE | Dodać FuneralHome JSON-LD schema | 60 min |
| 🟠 WYSOKIE | Dodać canonical tags | 20 min |
| 🟠 WYSOKIE | Dodać og:image (1200×630px) | 30 min |
| 🟠 WYSOKIE | Wyłączyć `images.unoptimized` (naprawić SSL) | 2h |
| 🟠 WYSOKIE | Przenieść fonty na `next/font/google` | 45 min |
| 🟡 ŚREDNIE | Dodać BreadcrumbList schema | 45 min |
| 🟡 ŚREDNIE | Dodać FAQPage schema (zasiłek, krok po kroku) | 60 min |
| 🟡 ŚREDNIE | Dodać favicon | 10 min |
| 🟡 ŚREDNIE | Embed map Google (rzeczywiste adresy) | 30 min |
| 🟡 ŚREDNIE | Security headers w next.config.ts | 30 min |
| 🟢 NISKIE | Dodać llms.txt | 15 min |
| 🟢 NISKIE | Skip navigation link | 10 min |
| 🟢 NISKIE | Linkowanie kontekstowe między podstronami | 30 min |
