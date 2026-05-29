import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

import { services } from '@/data/services'

// Seed treści usług z kanonicznych danych — zachowuje slugi (stałe trasy) i pełną treść.
// Obrazków nie da się zaseedować plikiem; puste pole image → fallback Unsplash we frontendzie.
const SERVICES_DEFAULT = services.map((s) => ({
  slug: s.slug,
  title: s.title,
  shortDesc: s.shortDesc,
  description: s.description.map((text) => ({ text })),
  features: s.features.map((text) => ({ text })),
}))

export const OfertaPage: GlobalConfig = {
  slug: 'oferta',
  label: 'Oferta (usługi)',
  admin: {
    group: 'Treści',
  },
  hooks: {
    afterChange: [
      ({ req }) => {
        try {
          revalidatePath('/', 'layout')
        } catch (err) {
          req.payload.logger.error({ err }, 'revalidatePath failed after OfertaPage change')
        }
      },
    ],
  },
  fields: [
    {
      type: 'group',
      name: 'intro',
      label: 'Nagłówek strony Oferta',
      fields: [
        {
          name: 'heroTitle',
          type: 'text',
          label: 'Tytuł',
          defaultValue: 'Nasze usługi',
        },
        {
          name: 'heroSubtitle',
          type: 'textarea',
          label: 'Podtytuł',
          defaultValue:
            'Kompleksowa obsługa pogrzebowa - zadbamy o każdy szczegół, byś mógł poświęcić czas rodzinie.',
        },
      ],
    },
    {
      name: 'services',
      type: 'array',
      label: 'Usługi',
      labels: { singular: 'Usługa', plural: 'Usługi' },
      // Stały zestaw — liczba usług zafiksowana (slugi = trasy w kodzie).
      minRows: SERVICES_DEFAULT.length,
      maxRows: SERVICES_DEFAULT.length,
      defaultValue: SERVICES_DEFAULT,
      admin: {
        description: 'Edytuj treść istniejących usług. Liczba usług i ich adresy URL są stałe.',
      },
      fields: [
        {
          name: 'slug',
          type: 'text',
          label: 'Adres URL (stały)',
          required: true,
          admin: {
            readOnly: true,
            description: 'Stała część adresu /oferta/… — nieedytowalna.',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Nazwa usługi',
          required: true,
        },
        {
          name: 'shortDesc',
          type: 'textarea',
          label: 'Krótki opis (na liście usług)',
          required: true,
        },
        {
          name: 'description',
          type: 'array',
          label: 'Opis (akapity)',
          labels: { singular: 'Akapit', plural: 'Akapity' },
          fields: [{ name: 'text', type: 'textarea', label: 'Treść akapitu', required: true }],
        },
        {
          name: 'features',
          type: 'array',
          label: 'Co oferujemy (lista punktów)',
          labels: { singular: 'Punkt', plural: 'Punkty' },
          fields: [{ name: 'text', type: 'text', label: 'Treść punktu', required: true }],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Zdjęcie usługi',
          admin: {
            description: 'Puste = zostaje zdjęcie domyślne.',
          },
        },
      ],
    },
  ],
}
