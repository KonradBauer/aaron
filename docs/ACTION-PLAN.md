# Action Plan — SEO Aaron Dom Pogrzebowy
**Data:** 2026-05-28 | **Score startowy:** 46/100 | **Cel:** 75+/100

---

## KRYTYCZNE — przed wdrożeniem

### 1. Uzupełnij dane firmy [15 min]
Zamień placeholdery:
- `src/components/Header.tsx` → stałe PHONE, PHONE_HREF
- `src/components/Footer.tsx` → PHONE, adresy 2 lokalizacji
- `src/app/(frontend)/kontakt/page.tsx` → adresy, telefony

### 2. Napraw polskie znaki w metadata [30 min]
`src/app/(frontend)/page.tsx`:
- "obsluga pogrzebowa" → "obsługa pogrzebowa"
- "sala pozegnan" → "sala pożegnań"
- "Dostepni" → "Dostępni"

`src/app/(frontend)/layout.tsx`:
- Wszystkie placeholder teksty w description

Inne pliki: `kontakt/page.tsx`, `krok-po-kroku/page.tsx`, `oferta/page.tsx`

### 3. Napraw H1 na stronie głównej [5 min]
`src/app/(frontend)/page.tsx` — dodać spację/separator między "Aaron" i "Z godnością":
```tsx
Aaron — Z godnością i troską.
// lub osobne linie z <br />
```

### 4. Dodaj robots.txt [15 min]
Nowy plik `src/app/robots.ts` (Next.js Metadata API):
```ts
import type { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] }],
    sitemap: 'https://twoja-domena.pl/sitemap.xml',
  }
}
```

### 5. Dodaj sitemap.xml [30 min]
Nowy plik `src/app/sitemap.ts` (Next.js Metadata API):
- 7 stron statycznych (/, /oferta, /kontakt, /zasilek-pogrzebowy, /krok-po-kroku, /galeria, /tanatokosmetyka)
- 12 podstron usług z `services.map(s => ({ url: BASE + '/oferta/' + s.slug }))`

### 6. Dodaj FuneralHome Schema.org [60 min]
Nowy plik `src/components/LocalBusinessSchema.tsx`.
Umieścić w `<head>` przez layout.tsx.
Dane wymagane: name, telephone, address (obie lokalizacje), openingHours, url.
Uwaga: Schema jest staticznie generowanym JSON — bezpieczny dla SSR bez `dangerouslySetInnerHTML`.

---

## WYSOKIE — tydzień po wdrożeniu

### 7. Canonical tags [20 min]
W layout.tsx dodać `metadataBase`:
```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://twoja-domena.pl'),
  alternates: { canonical: '/' },
}
```
Na każdej podstronie: `alternates: { canonical: '/kontakt' }` itd.

### 8. og:image [30 min]
- Przygotować `public/og-image.jpg` 1200×630px
- W layout.tsx: `openGraph: { images: [{ url: '/og-image.jpg', width: 1200, height: 630 }] }`

### 9. Google Fonts → next/font [45 min]
Zamienić `@import url(...)` w styles.css na `next/font/google` w layout.tsx.
Eliminuje render-blocking request do Google Fonts.

### 10. Wyłączyć images.unoptimized [2h]
- Rozwiązać SSL: `NODE_OPTIONS="--no-deprecation --use-system-ca"` w package.json
- Usunąć `unoptimized: true` z next.config.ts
- Re-enable WebP/AVIF + srcset

---

## ŚREDNIE — w ciągu miesiąca

### 11. BreadcrumbList schema — PageHero.tsx
### 12. FAQPage schema — zasilek-pogrzebowy
### 13. HowTo schema — krok-po-kroku
### 14. Favicon — src/app/favicon.ico
### 15. Security headers — next.config.ts → headers()
### 16. Google Maps embed (prawdziwe adresy) — kontakt/page.tsx
### 17. Alt text hero image — page.tsx (aktualnie pusty "")

---

## NISKIE — backlog

### 18. public/llms.txt — opis firmy dla AI crawlerów
### 19. Skip navigation link — `<a href="#main">Przejdź do treści</a>`
### 20. Frazy lokalne w tytułach — dodać miasto do tytułów stron
### 21. Internal linking kontekstowy — między zasilek ↔ krok-po-kroku, usługi → kontakt

---

## Prognoza punktów po naprawach

| Etap | Score |
|------|-------|
| Aktualny | 46/100 |
| Po krytycznych (1-6) | ~68/100 |
| Po wysokich (7-10) | ~75/100 |
| Po wszystkich | ~82/100 |
