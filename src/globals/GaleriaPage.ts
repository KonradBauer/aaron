import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const GaleriaPage: GlobalConfig = {
  slug: 'galeria',
  label: 'Galeria',
  admin: {
    group: 'Treści',
  },
  hooks: {
    afterChange: [
      ({ req }) => {
        try {
          revalidatePath('/', 'layout')
        } catch (err) {
          req.payload.logger.error({ err }, 'revalidatePath failed after GaleriaPage change')
        }
      },
    ],
  },
  fields: [
    {
      type: 'group',
      name: 'intro',
      label: 'Nagłówek strony Galeria',
      fields: [
        {
          name: 'heroTitle',
          type: 'text',
          label: 'Tytuł',
          defaultValue: 'Galeria',
        },
        {
          name: 'heroSubtitle',
          type: 'textarea',
          label: 'Podtytuł',
          defaultValue: 'Zapraszamy do zapoznania się z naszymi obiektami i wyposażeniem.',
        },
      ],
    },
    {
      name: 'footerNote',
      type: 'text',
      label: 'Tekst pod galerią',
      defaultValue: 'Galeria zostanie uzupełniona własnymi zdjęciami.',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Zdjęcia',
      labels: { singular: 'Zdjęcie', plural: 'Zdjęcia' },
      defaultValue: [],
      admin: {
        description: 'Dodaj dowolną liczbę zdjęć. Galeria pokazuje tylko zdjęcia tutaj wgrane.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Zdjęcie',
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Opis zdjęcia',
          required: true,
        },
      ],
    },
  ],
}
