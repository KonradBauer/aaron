import { cache } from 'react'

import { services } from '@/data/services'
import { resolveMediaUrl } from '@/lib/media'
import { fetchGlobal } from '@/lib/payload-global'
import type { Oferta } from '@/payload-types'

type ServiceItem = NonNullable<Oferta['services']>[number]

/** Znormalizowany kształt usługi dla frontendu (ServiceLayout, listy). */
export interface ServiceContent {
  slug: string
  title: string
  shortDesc: string
  description: string[]
  features: string[]
  imageUrl: string
}

// Fallbacki obrazków per slug z kanonicznych danych — gdy klient nie wgrał zdjęcia.
const IMG_FALLBACK: Record<string, string> = Object.fromEntries(
  services.map((s) => [s.slug, s.imageUrl]),
)
const IMG_FALLBACK_DEFAULT = services[0]?.imageUrl ?? ''

const FALLBACK: Oferta = {
  id: 'fallback',
  intro: {
    heroTitle: 'Nasze usługi',
    heroSubtitle:
      'Kompleksowa obsługa pogrzebowa - zadbamy o każdy szczegół, byś mógł poświęcić czas rodzinie.',
  },
  services: services.map((s) => ({
    slug: s.slug,
    title: s.title,
    shortDesc: s.shortDesc,
    description: s.description.map((text) => ({ text })),
    features: s.features.map((text) => ({ text })),
  })),
}

function normalize(item: ServiceItem): ServiceContent {
  return {
    slug: item.slug,
    title: item.title,
    shortDesc: item.shortDesc,
    description: (item.description ?? []).map((d) => d.text),
    features: (item.features ?? []).map((f) => f.text),
    imageUrl: resolveMediaUrl(item.image, IMG_FALLBACK[item.slug] ?? IMG_FALLBACK_DEFAULT),
  }
}

export const getOfertaPage = cache((): Promise<Oferta> => fetchGlobal('oferta', FALLBACK))

export async function getServicesList(): Promise<ServiceContent[]> {
  const page = await getOfertaPage()
  return (page.services ?? []).map(normalize)
}

export async function getServiceContent(slug: string): Promise<ServiceContent | undefined> {
  const page = await getOfertaPage()
  const item = (page.services ?? []).find((s) => s.slug === slug)
  return item ? normalize(item) : undefined
}
