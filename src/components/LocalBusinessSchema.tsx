import { getSiteSettings } from '@/lib/site-settings'
import { SITE_URL } from '@/lib/site-url'

// JSON.stringify on server-side data — no XSS risk, standard JSON-LD pattern for Next.js
export default async function LocalBusinessSchema() {
  const settings = await getSiteSettings()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FuneralHome',
    name: 'Aaron Dom Pogrzebowy',
    url: SITE_URL,
    telephone: settings.phone ?? '',
    openingHours: 'Mo-Su 00:00-24:00',
    priceRange: '$$',
    address: (settings.locations ?? []).map((loc) => ({
      '@type': 'PostalAddress',
      streetAddress: loc.street,
      addressLocality: loc.city,
      ...(loc.postalCode ? { postalCode: loc.postalCode } : {}),
      addressCountry: 'PL',
    })),
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
