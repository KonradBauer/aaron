import { describe, it, expect, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import type { SiteSetting } from '@/payload-types'

const getSiteSettingsMock = vi.fn()
vi.mock('@/lib/site-settings', () => ({
  getSiteSettings: () => getSiteSettingsMock(),
}))

import LocalBusinessSchema from '@/components/LocalBusinessSchema'

function makeSetting(over: Partial<SiteSetting>): SiteSetting {
  return { id: 'test', phone: '+48 000 000 000', locations: [], ...over }
}

function makeLocation(
  over: Partial<NonNullable<SiteSetting['locations']>[number]>,
): NonNullable<SiteSetting['locations']>[number] {
  return { label: 'Lok', name: 'Oddział', street: 'ul. Testowa 1', city: 'Kraków', ...over }
}

async function getSchema(): Promise<Record<string, unknown>> {
  const html = renderToStaticMarkup(await LocalBusinessSchema())
  const match = /<script[^>]*>([\s\S]*?)<\/script>/.exec(html)
  if (!match) throw new Error('Brak tagu script w renderowanym HTML')
  return JSON.parse(match[1]) as Record<string, unknown>
}

describe('LocalBusinessSchema', () => {
  it('mapuje 2 lokalizacje z CMS na tablicę PostalAddress', async () => {
    getSiteSettingsMock.mockResolvedValue(
      makeSetting({
        phone: '+48 123 456 789',
        locations: [
          makeLocation({ street: 'ul. Pierwsza 1', postalCode: '30-001', city: 'Kraków' }),
          makeLocation({ street: 'ul. Druga 2', postalCode: '00-001', city: 'Warszawa' }),
        ],
      }),
    )

    const schema = await getSchema()

    expect(schema['@type']).toBe('FuneralHome')
    expect(schema.telephone).toBe('+48 123 456 789')
    expect(schema.openingHours).toBe('Mo-Su 00:00-24:00')

    const address = schema.address as unknown[]
    expect(address).toHaveLength(2)
    expect(address[0]).toMatchObject({
      '@type': 'PostalAddress',
      streetAddress: 'ul. Pierwsza 1',
      addressLocality: 'Kraków',
      postalCode: '30-001',
      addressCountry: 'PL',
    })
    expect(address[1]).toMatchObject({
      '@type': 'PostalAddress',
      streetAddress: 'ul. Druga 2',
      addressLocality: 'Warszawa',
      addressCountry: 'PL',
    })
  })

  it('zwraca address: [] gdy locations jest null', async () => {
    getSiteSettingsMock.mockResolvedValue(makeSetting({ locations: null }))

    const schema = await getSchema()

    expect(schema.address).toEqual([])
  })

  it('pomija postalCode w PostalAddress gdy pole jest null', async () => {
    getSiteSettingsMock.mockResolvedValue(
      makeSetting({
        locations: [makeLocation({ postalCode: null })],
      }),
    )

    const schema = await getSchema()
    const address = schema.address as Record<string, unknown>[]

    expect(address[0]).not.toHaveProperty('postalCode')
    expect(address[0].addressCountry).toBe('PL')
  })

  it('używa phone z settings dla pola telephone', async () => {
    getSiteSettingsMock.mockResolvedValue(makeSetting({ phone: '+48 999 888 777' }))

    const schema = await getSchema()

    expect(schema.telephone).toBe('+48 999 888 777')
  })
})
