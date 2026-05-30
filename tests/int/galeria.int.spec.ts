import { describe, it, expect, vi } from 'vitest'

import type { Galeria, Media } from '@/payload-types'

// Mockujemy fetchGlobal (zewnętrzny odczyt DB) — testujemy mapowanie, nie Payload.
const fetchGlobalMock = vi.fn()
vi.mock('@/lib/payload-global', () => ({
  fetchGlobal: (...args: unknown[]) => fetchGlobalMock(...args),
}))

import { resolveMediaWithSize } from '@/lib/media'
import { getGalleryImages } from '@/lib/galeria'

const media = (over: Partial<Media>): Media => ({
  id: '1',
  alt: 'Media alt',
  url: 'https://cdn.example.com/img.jpg',
  width: 800,
  height: 600,
  updatedAt: '2026-01-01',
  createdAt: '2026-01-01',
  ...over,
})

describe('resolveMediaWithSize', () => {
  it('zwraca url/width/height/alt gdy obiekt Media z wymiarami', () => {
    expect(resolveMediaWithSize(media({}))).toEqual({
      url: 'https://cdn.example.com/img.jpg',
      width: 800,
      height: 600,
      alt: 'Media alt',
    })
  })

  it('zwraca null gdy string (niepopulowane)', () => {
    expect(resolveMediaWithSize('64abc123')).toBeNull()
  })

  it('zwraca null gdy null/undefined', () => {
    expect(resolveMediaWithSize(null)).toBeNull()
    expect(resolveMediaWithSize(undefined)).toBeNull()
  })

  it('zwraca null gdy brak wymiarów', () => {
    expect(resolveMediaWithSize(media({ width: null, height: null }))).toBeNull()
  })

  it('zwraca null gdy brak url', () => {
    expect(resolveMediaWithSize(media({ url: null }))).toBeNull()
  })

  it('zwraca null gdy width lub height wynosi 0', () => {
    expect(resolveMediaWithSize(media({ width: 0, height: 600 }))).toBeNull()
    expect(resolveMediaWithSize(media({ width: 800, height: 0 }))).toBeNull()
  })
})

// getGaleriaPage jest owinięte react cache() (memoizuje pierwszy wynik w obrębie modułu),
// więc getGalleryImages wołamy raz, z jednym datasetem pokrywającym wszystkie przypadki naraz.
// Przypadek images:[] pokryty przez FALLBACK.images=[] w galeria.ts i flatMap na pustej tablicy.
describe('getGalleryImages', () => {
  it('mapuje tylko pozycje z populowanym obrazkiem (z wymiarami), resztę pomija', async () => {
    const page: Galeria = {
      id: 'g',
      images: [
        { image: media({ url: 'https://cdn/a.jpg', width: 400, height: 300 }), alt: 'Pierwsze' },
        { image: '64deadbeef', alt: 'String — pominięte' },
        { image: media({ url: 'https://cdn/b.jpg', width: 1000, height: 500 }), alt: 'Drugie' },
        { image: null, alt: 'Puste — pominięte' },
        { image: media({ width: null, height: null }), alt: 'Bez wymiarów — pominięte' },
      ],
    }
    fetchGlobalMock.mockResolvedValue(page)

    const result = await getGalleryImages()

    expect(result).toEqual([
      { url: 'https://cdn/a.jpg', alt: 'Pierwsze', width: 400, height: 300 },
      { url: 'https://cdn/b.jpg', alt: 'Drugie', width: 1000, height: 500 },
    ])
  })
})
