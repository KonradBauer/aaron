---
title: "React cache() w Vitest nie resetuje się między testami it()"
date: 2026-05-30
category: testing-issues
severity: medium
stack:
  - React
  - TypeScript
  - Vitest
tags:
  - react-cache
  - vitest
  - mocking
  - payload-cms
status: verified
last_verified: 2026-05-30
---

# React `cache()` w Vitest nie resetuje się między testami `it()`

## Symptomy

- Drugi `it()` blok wywołujący funkcję owiniętą `cache()` ignoruje nową wartość mocka
- `fetchGlobalMock.mockResolvedValue(newData)` nie ma efektu w kolejnych testach
- Wszystkie testy w `describe` zwracają ten sam wynik — z pierwszego wywołania
- Brak błędów — testy cicho przechodzą lub failują z wartościami z poprzedniego testu

## Root Cause

React `cache()` (z `'react'`) tworzy memoizację per-request w React Server Components. W środowisku Node.js bez React context (Vitest), działa jako **module-level singleton** — pierwsza wywołanie cache-uje wynik na cały czas życia modułu. `vi.mock` resetuje implementację funkcji niżej w stosie (`fetchGlobal`), ale cache już zwrócił wynik zanim mock się zmienił. Kolejne wywołania omijają prawdziwą implementację i zwracają zapisaną wartość.

```ts
// galeria.ts
export const getGaleriaPage = cache((): Promise<Galeria> => fetchGlobal('galeria', FALLBACK))
//                             ^^^^^ — memoizuje pierwszy wynik na zawsze w scope testu
```

## Rozwiązanie

### Opcja A (zalecana): jeden test z pełnym datasetem

Zamiast wielu `it()` z różnymi mockSetupami — jeden test pokrywający wszystkie przypadki naraz:

```ts
describe('getGalleryImages', () => {
  it('mapuje tylko pozycje z populowanym obrazkiem, resztę pomija', async () => {
    const page: Galeria = {
      id: 'g',
      images: [
        { image: media({ url: 'https://cdn/a.jpg', width: 400, height: 300 }), alt: 'OK' },
        { image: '64deadbeef', alt: 'String — pominięte' },      // string ID
        { image: null, alt: 'Null — pominięte' },                // null
        { image: media({ width: null, height: null }), alt: 'Brak wymiarów — pominięte' },
        { image: media({ url: 'https://cdn/b.jpg', width: 800, height: 600 }), alt: 'OK 2' },
      ],
    }
    fetchGlobalMock.mockResolvedValue(page)

    const result = await getGalleryImages()

    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ url: 'https://cdn/a.jpg', width: 400 })
    expect(result[1]).toMatchObject({ url: 'https://cdn/b.jpg', width: 800 })
  })
})
```

### Opcja B: `vi.resetModules()` z dynamic import

Działa, ale skomplikowane — wymaga `beforeEach` z `vi.resetModules()` i dynamicznych importów:

```ts
let getGalleryImages: typeof import('@/lib/galeria').getGalleryImages

beforeEach(async () => {
  vi.resetModules()
  const mod = await import('@/lib/galeria')
  getGalleryImages = mod.getGalleryImages
})
```

Wadą jest wolniejsza inicjalizacja i konieczność re-importowania wszystkich zależności.

### Opcja C: testuj logikę bez cache wrapper

Testuj helper bezpośrednio (`resolveMediaWithSize`, mapper) zamiast funkcji owiniętej `cache()`. Cache to infrastruktura — testuj ją osobno lub nie testuj w unit testach.

## Komendy diagnostyczne

```bash
# Sprawdź czy funkcja jest owinięta cache()
grep -n "cache(" src/lib/galeria.ts

# Uruchom testy z verbose output
pnpm test:int -- --reporter=verbose

# Zresetuj moduły w konkretnym pliku (dodaj do vitest.config)
# globals: true, restoreMocks: true — NIE pomaga, cache jest moduł-level
```

## Zapobieganie

- Funkcje owinięte `cache()` testuj w jednym `it()` z pełnym datasetem pokrywającym wszystkie edge case'y
- Logikę mapowania/transformacji wyciągnij do czystych funkcji (bez `cache()`) i testuj je osobno
- Dodaj komentarz w test file przy `describe('getGalleryImages')` wyjaśniający ograniczenie

```ts
// getGaleriaPage jest owinięte react cache() — memoizuje pierwszy wynik w module.
// Testujemy raz z pełnym datasetem zamiast wielu it() z różnymi setupami.
```

## Powiązane

- `tests/int/galeria.int.spec.ts` — zastosowane rozwiązanie (Opcja A)
- `src/lib/galeria.ts` — `getGaleriaPage` owinięte `cache()`

## Kontekst

Odkryte podczas implementacji `cms-pelna-kontrola-galeria-lightbox` (2026-05-30). `getGaleriaPage` owinięte `React.cache()` żeby deduplikować DB fetch w RSC. W Vitest (Node.js, bez React request context) cache nie ma mechanizmu reset — działa jak zwykłe closure memoization na poziomie modułu.
