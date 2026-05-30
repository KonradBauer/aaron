import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Kontakt',
  admin: {
    group: 'Treści',
  },
  hooks: {
    // Strony frontu są statycznie prerenderowane w build (direct DB call, nie fetch),
    // więc bez tego zmiany w CMS nie pojawiają się w prod do następnego rebuildu.
    // revalidatePath('/', 'layout') odświeża wszystkie trasy pod root layoutem.
    afterChange: [
      ({ req }) => {
        try {
          revalidatePath('/', 'layout')
        } catch (err) {
          req.payload.logger.error({ err }, 'revalidatePath failed after SiteSettings change')
        }
      },
    ],
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
      ],
    },
  ],
}
