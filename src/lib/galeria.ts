import { cache } from 'react'

import { galleryItems } from '@/data/gallery'
import { resolveMediaUrl } from '@/lib/media'
import { fetchGlobal } from '@/lib/payload-global'
import type { Galeria } from '@/payload-types'

export interface GalleryImage {
  imageUrl: string
  alt: string
  ratio: string
}

const FALLBACK: Galeria = {
  id: 'fallback',
  intro: {
    heroTitle: 'Galeria',
    heroSubtitle: 'Zapraszamy do zapoznania się z naszymi obiektami i wyposażeniem.',
  },
  footerNote: 'Galeria zostanie uzupełniona własnymi zdjęciami.',
  images: galleryItems.map((g) => ({ alt: g.alt })),
}

export const getGaleriaPage = cache((): Promise<Galeria> => fetchGlobal('galeria', FALLBACK))

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const page = await getGaleriaPage()
  const items = page.images ?? []
  // Iterujemy po stałym zestawie 12 kafelków — gwarantuje poprawne ratio i fallback per indeks.
  return galleryItems.map((fallback, i) => {
    const item = items[i]
    return {
      imageUrl: resolveMediaUrl(item?.image, fallback.imageUrl),
      alt: item?.alt ?? fallback.alt,
      ratio: fallback.ratio,
    }
  })
}
