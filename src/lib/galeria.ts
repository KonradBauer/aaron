import { cache } from 'react'

import { resolveMediaWithSize } from '@/lib/media'
import { fetchGlobal } from '@/lib/payload-global'
import type { Galeria } from '@/payload-types'

export interface GalleryImage {
  url: string
  alt: string
  width: number
  height: number
}

const FALLBACK: Galeria = {
  id: 'fallback',
  intro: {
    heroTitle: 'Galeria',
    heroSubtitle: 'Zapraszamy do zapoznania się z naszymi obiektami i wyposażeniem.',
  },
  footerNote: 'Galeria zostanie uzupełniona własnymi zdjęciami.',
  images: [],
}

export const getGaleriaPage = cache((): Promise<Galeria> => fetchGlobal('galeria', FALLBACK))

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const page = await getGaleriaPage()
  const items = page.images ?? []
  // Tylko pozycje z wgranym, populowanym obrazkiem (z wymiarami). Reszta pomijana — brak fallbacków.
  return items.flatMap((item) => {
    const media = resolveMediaWithSize(item.image)
    if (!media) return []
    return [{ url: media.url, alt: item.alt ?? media.alt, width: media.width, height: media.height }]
  })
}
