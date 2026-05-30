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
    },
    {
      label: 'Lokalizacja 2',
      name: 'Aaron - Oddział Drugi',
      street: 'ul. Przykładowa 2',
      postalCode: '00-000',
      city: 'Miasto',
      hours: 'Dostępni 24h / 7 dni w tygodniu',
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

export function mapEmbedUrl(loc: Pick<Location, 'street' | 'postalCode' | 'city'>): string | null {
  const parts = [loc.street, loc.postalCode, loc.city]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
  if (parts.length === 0) return null
  const query = encodeURIComponent(parts.join(', '))
  return `https://maps.google.com/maps?q=${query}&z=15&output=embed`
}
