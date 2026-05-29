import { describe, it, expect } from 'vitest'

import { resolveMediaUrl } from '@/lib/media'
import type { Media } from '@/payload-types'

const FALLBACK = 'https://example.com/fallback.jpg'

describe('resolveMediaUrl', () => {
  it('zwraca media.url gdy podano obiekt z url', () => {
    const media: Media = {
      id: '1',
      alt: 'opis',
      url: '/api/media/file/foo.jpg',
      updatedAt: '2026-01-01',
      createdAt: '2026-01-01',
    }
    expect(resolveMediaUrl(media, FALLBACK)).toBe('/api/media/file/foo.jpg')
  })

  it('zwraca fallback gdy null', () => {
    expect(resolveMediaUrl(null, FALLBACK)).toBe(FALLBACK)
  })

  it('zwraca fallback gdy undefined', () => {
    expect(resolveMediaUrl(undefined, FALLBACK)).toBe(FALLBACK)
  })

  it('zwraca fallback gdy string-id (nierozwiązany upload)', () => {
    expect(resolveMediaUrl('64f0c0c0c0c0c0c0c0c0c0c0', FALLBACK)).toBe(FALLBACK)
  })

  it('zwraca fallback gdy obiekt bez url', () => {
    const media: Media = {
      id: '1',
      alt: 'opis',
      updatedAt: '2026-01-01',
      createdAt: '2026-01-01',
    }
    expect(resolveMediaUrl(media, FALLBACK)).toBe(FALLBACK)
  })
})
