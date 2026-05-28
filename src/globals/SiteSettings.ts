import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Kontakt',
  admin: {
    group: 'Treści',
  },
  fields: [
    {
      name: 'phone',
      type: 'text',
      label: 'Numer telefonu (24h)',
      defaultValue: '+48 000 000 000',
      required: true,
      admin: {
        description: 'Numer wyświetlany w nagłówku, stopce i na wszystkich stronach.',
      },
    },
    {
      name: 'locations',
      type: 'array',
      label: 'Lokalizacje',
      minRows: 1,
      maxRows: 2,
      defaultValue: [
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
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Etykieta',
          required: true,
          defaultValue: 'Lokalizacja',
        },
        {
          name: 'name',
          type: 'text',
          label: 'Nazwa oddziału',
          required: true,
        },
        {
          name: 'street',
          type: 'text',
          label: 'Ulica i numer',
          required: true,
        },
        {
          name: 'postalCode',
          type: 'text',
          label: 'Kod pocztowy',
        },
        {
          name: 'city',
          type: 'text',
          label: 'Miasto',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Numer telefonu (opcjonalny)',
          admin: {
            description: 'Zostaw puste — użyje globalnego numeru telefonu z góry strony.',
          },
        },
        {
          name: 'hours',
          type: 'text',
          label: 'Godziny otwarcia',
          defaultValue: 'Dostępni 24h / 7 dni w tygodniu',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'lat',
              type: 'number',
              label: 'Szerokość geograficzna (lat)',
              defaultValue: 0,
              admin: {
                description: 'Np. 52.2297 — skopiuj z Google Maps (prawy klik → "Co tu jest?")',
                width: '50%',
              },
            },
            {
              name: 'lng',
              type: 'number',
              label: 'Długość geograficzna (lng)',
              defaultValue: 0,
              admin: {
                description: 'Np. 21.0122',
                width: '50%',
              },
            },
          ],
        },
      ],
    },
  ],
}
