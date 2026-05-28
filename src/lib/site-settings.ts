import { cache } from 'react'
import config from '@payload-config'
import { getPayload } from 'payload'

import type { SiteSetting } from '@/payload-types'

export type Location = NonNullable<SiteSetting['locations']>[number]

const FALLBACK: SiteSetting = {
  id: 'fallback',
  phone: '+48 000 000 000',
  locations: [
    {
      label: 'Lokalizacja 1',
      name: 'Aaron - Oddział Główny',
      street: 'ul. Przykładowa 1',
      postalCode: '00-000',
      city: 'Miasto',
      hours: 'Dostępni 24h / 7 dni w tygodniu',
      lat: 0,
      lng: 0,
    },
    {
      label: 'Lokalizacja 2',
      name: 'Aaron - Oddział Drugi',
      street: 'ul. Przykładowa 2',
      postalCode: '00-000',
      city: 'Miasto',
      hours: 'Dostępni 24h / 7 dni w tygodniu',
      lat: 0,
      lng: 0,
    },
  ],
}

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  try {
    const payload = await getPayload({ config })
    return await payload.findGlobal({ slug: 'site-settings' })
  } catch (err) {
    console.error('getSiteSettings: nie udało się pobrać site-settings, używam FALLBACK', err)
    return FALLBACK
  }
})

export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[\s-]/g, '')}`
}

export function mapEmbedUrl(lat: number | null | undefined, lng: number | null | undefined): string | null {
  if (!lat || !lng || lat === 0 || lng === 0) return null
  return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
}
