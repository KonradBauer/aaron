---
title: "Code Review — cms-pelna-kontrola-galeria-lightbox (Unit 1–4)"
date: 2026-05-30
branch: feature/edytowalne-tresci-podstron
gate: ⚠️ KONTYNUUJ Z ZASTRZEŻENIAMI
---

# Code Review — cms-pelna-kontrola-galeria-lightbox

Przegląd 5 agentów: security, performance, architecture/TypeScript, scenario coverage, E2E browser.

Commits objęte: 56d2a58, 2ebf56a, 394ddbe, f6c1190, c175e67

---

## 📊 Statystyki

| Poziom | Liczba |
|--------|--------|
| 🔴 P1 (blocking) | 0 |
| 🟠 P2 (important) | 3 (1 pre-existing) |
| 🟡 P3 (nit) | 4 |
| 🌐 E2E | 10 passed / 0 failed / 0 SKIP |

---

## 🔴 P1 — Blocking

Brak.

---

## 🟠 P2 — Important

### P2-A: Lightbox — brak focus trap i brak autoFocus na otwarcie

**Pliki:** `src/components/Gallery.tsx:80-131`

Po otwarciu lightboxa (`isOpen = true`) focus pozostaje na klikniętym przycisku kafelka. Dialog nie przenosi focusu na siebie, więc:
- Tab może wędrować po tle strony (tło z `overflow: hidden`, ale DOM focus nadal tam jest)
- Użytkownicy screen-reader mogą nie odczytać licznika „N / M" i przycisków nawigacji
- ARIA Authoring Practices Guide (dialog pattern) wymaga przechwycenia focusu przy otwarciu

Esc i klik backdrop działają poprawnie. Strzałki klawiszowe działają przez `useEffect` na `document`. Problem dotyczy Tab i focus management.

**Rekomendacja:** Dodaj `useRef` na div overlay, w `useEffect` (lub osobnym) wywołaj `overlayRef.current?.focus()` gdy `isOpen` → `true`. Dodaj `tabIndex={-1}` na overlay div.

---

### P2-B: Brak testu dla `width = 0` lub `height = 0`

**Pliki:** `tests/int/galeria.int.spec.ts`, `src/lib/media.ts:39-42`

`resolveMediaWithSize` blokuje wartości `<= 0` (`width > 0`, `height > 0`), ale żaden test nie weryfikuje tego edge case'u. Klient CMS może wgrać obraz z błędnymi metadanymi (Payload zapisze `0`).

**Rekomendacja:** Dodaj scenariusz w `galeria.int.spec.ts`:
```ts
it('pomija media z width=0', () => {
  // image z width: 0 → resolveMediaWithSize zwraca null → flatMap pomija
})
```

---

### P2-C (pre-existing): `next.config.ts:27` — `unoptimized: true` bez `remotePatterns`

**Plik:** `next.config.ts:27`

Nie jest nowym kodem — istniało przed tą feature. `unoptimized: true` znosi domain allowlist dla `next/image`. Payload zapisuje relatywne URL-e (`/media/...`), więc ryzyko niskie. Ale jeśli `media.url` kiedykolwiek zwróci pełny URL z zewnętrznej domeny — obraz wyśle request do dowolnego hosta.

**Tech debt:** przed deployem produkcyjnym warto zdefiniować `remotePatterns` i wyłączyć `unoptimized`.

---

## 🟡 P3 — Nit

### P3-1: `galeria/page.tsx:14` — redundant `getGaleriaPage()` w Promise.all

`getGalleryImages()` wewnętrznie woła `getGaleriaPage()`. React `cache()` deduplikuje per request — to faktycznie 1 DB fetch. Ale `Promise.all([getGaleriaPage(), getGalleryImages()])` myli czytelnika sugerując 2 operacje.

### P3-2: `galeria.ts:33` — dead code fallback `item.alt ?? media.alt`

`item.alt` jest typed jako `string` (required field), więc `?? media.alt` nigdy nie zostanie użyte. Usuń fallback.

### P3-3: `Gallery.tsx:57` — index w key redundantny

`key={\`${img.url}-${i}\`}` — `img.url` jest już unikalny per zdjęcie. Sufiks `-${i}` zbędny.

### P3-4: `galeria.int.spec.ts` — brak dedykowanego `it()` dla pustej galerii

Przypadek `images: []` nie ma osobnego `it` bloku. Obecny test pokrywa go pośrednio (flatMap na 0 wyniku), ale czytelność coverage cierpi.

---

## 🌐 E2E — Wyniki

Dev server: ✅ HTTP 200
Galeria: 2 zdjęcia w CMS (nie pusta)

| ID | Scenariusz | Status |
|----|-----------|--------|
| A1 | `/galeria` renderuje bez błędów JS | ✅ passed |
| A2 | Klik kafelek → lightbox + licznik "1 / 2" | ✅ passed |
| A3 | Strzałka "następny" → zmiana zdjęcia; zapętlenie | ✅ passed |
| A4 | Esc / klik tło → zamknięcie lightboxa | ✅ passed |
| A5 | Różne proporcje → masonry bez deformacji | ✅ passed |
| B1 | `/galeria` smoke — HTTP 200 | ✅ passed |
| B2 | `/krok-po-kroku` smoke — HTTP 200 | ✅ passed |
| B3 | `/kontakt` smoke — HTTP 200 | ✅ passed |
| C1 | Admin panel ładuje się | ✅ passed |
| C2 | Przycisk "+ Add Zdjęcie" w Galerii (brak maxRows) | ✅ passed — przycisk widoczny, 2 wpisy w CMS, brak jakiegokolwiek limitu |

**Screenshoty w:** `public/e2e/`

---

## Fałszywe alarmy (odrzucone)

- **Scenario P1: `images: undefined`** → `galeria.ts:28` ma `page.images ?? []`. RESOLVED.
- **Architecture P1/P2: `openIndex + 1`** → TypeScript narrowuje `openIndex` przez `isOpen` (`const isOpen = openIndex !== null`). tsc 0 errors. RESOLVED.
- **Architecture P1: `media.ts` narrowing** → tsc 0 errors. RESOLVED.

---

## Performance — brak problemów

`useEffect` cleanup poprawny. `useCallback` deps stabilne. React `cache()` deduplication działa. `next/image` ma `width/height` + `sizes` prop. Lightbox image ma `priority`. Brak wycieków.

---

## Security — brak nowych podatności

`resolveMediaWithSize` type guard wystarczający. Brak hardcoded secrets. Brak `console.log` z danymi wrażliwymi. `GalleryImage` przekazuje tylko `url/alt/width/height` (brak ekspozycji `id`, `createdAt`).

---

## Verdict

⚠️ **KONTYNUUJ Z ZASTRZEŻENIAMI** — 0 P1, 2 nowe P2 do naprawy (focus trap, test edge case), 1 pre-existing P2 (tech debt).
