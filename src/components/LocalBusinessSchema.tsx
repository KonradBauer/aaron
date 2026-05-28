const schema = {
  '@context': 'https://schema.org',
  '@type': 'FuneralHome',
  name: 'Aaron Dom Pogrzebowy',
  url: 'https://twoja-domena.pl',
  telephone: '+48000000000',
  openingHours: 'Mo-Su 00:00-24:00',
  priceRange: '$$',
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: 'ul. Przykładowa 1',
      addressLocality: 'Miasto',
      postalCode: '00-000',
      addressCountry: 'PL',
    },
  ],
}

// JSON.stringify on a static object — no XSS risk, standard JSON-LD pattern for Next.js
export default function LocalBusinessSchema() {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
