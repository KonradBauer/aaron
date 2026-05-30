import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

import { zasilekDefault as d } from '@/data/zasilek'

const toTextRows = (items: string[]) => items.map((text) => ({ text }))

export const ZasilekPage: GlobalConfig = {
  slug: 'zasilek-pogrzebowy',
  label: 'Zasiłek pogrzebowy',
  admin: {
    group: 'Treści',
  },
  hooks: {
    afterChange: [
      ({ req }) => {
        try {
          revalidatePath('/', 'layout')
        } catch (err) {
          req.payload.logger.error({ err }, 'revalidatePath failed after ZasilekPage change')
        }
      },
    ],
  },
  fields: [
    {
      type: 'group',
      name: 'intro',
      label: 'Nagłówek strony',
      fields: [
        { name: 'heroTitle', type: 'text', label: 'Tytuł', defaultValue: d.intro.heroTitle },
        { name: 'heroSubtitle', type: 'textarea', label: 'Podtytuł', defaultValue: d.intro.heroSubtitle },
      ],
    },
    {
      type: 'group',
      name: 'whatIs',
      label: 'Sekcja „Czym jest"',
      fields: [
        { name: 'label', type: 'text', label: 'Etykieta', defaultValue: d.whatIs.label },
        { name: 'heading', type: 'text', label: 'Nagłówek', defaultValue: d.whatIs.heading },
        { name: 'text', type: 'textarea', label: 'Tekst', defaultValue: d.whatIs.text },
      ],
    },
    {
      type: 'group',
      name: 'whoQualifies',
      label: 'Sekcja „Komu przysługuje"',
      fields: [
        { name: 'heading', type: 'text', label: 'Nagłówek', defaultValue: d.whoQualifies.heading },
        { name: 'intro', type: 'textarea', label: 'Wstęp', defaultValue: d.whoQualifies.intro },
        {
          name: 'bullets',
          type: 'array',
          label: 'Lista punktów',
          labels: { singular: 'Punkt', plural: 'Punkty' },
          defaultValue: toTextRows(d.whoQualifies.bullets),
          fields: [{ name: 'text', type: 'text', label: 'Treść punktu', required: true }],
        },
      ],
    },
    {
      type: 'group',
      name: 'amount',
      label: 'Sekcja „Wysokość zasiłku"',
      fields: [
        { name: 'heading', type: 'text', label: 'Nagłówek', defaultValue: d.amount.heading },
        { name: 'amountLabel', type: 'text', label: 'Etykieta nad kwotą', defaultValue: d.amount.amountLabel },
        { name: 'amountValue', type: 'text', label: 'Kwota', defaultValue: d.amount.amountValue },
        { name: 'amountNote', type: 'textarea', label: 'Notka pod kwotą', defaultValue: d.amount.amountNote },
        { name: 'text', type: 'textarea', label: 'Tekst', defaultValue: d.amount.text },
      ],
    },
    {
      type: 'group',
      name: 'documents',
      label: 'Sekcja „Wymagane dokumenty"',
      fields: [
        { name: 'heading', type: 'text', label: 'Nagłówek', defaultValue: d.documents.heading },
        {
          name: 'bullets',
          type: 'array',
          label: 'Lista dokumentów',
          labels: { singular: 'Dokument', plural: 'Dokumenty' },
          defaultValue: toTextRows(d.documents.bullets),
          fields: [{ name: 'text', type: 'text', label: 'Treść punktu', required: true }],
        },
      ],
    },
    {
      type: 'group',
      name: 'deadline',
      label: 'Sekcja „Termin złożenia"',
      fields: [
        { name: 'heading', type: 'text', label: 'Nagłówek', defaultValue: d.deadline.heading },
        { name: 'text', type: 'textarea', label: 'Tekst', defaultValue: d.deadline.text },
      ],
    },
    {
      type: 'group',
      name: 'ctaBox',
      label: 'Boks kontaktowy (dół strony)',
      fields: [
        { name: 'heading', type: 'text', label: 'Nagłówek', defaultValue: d.ctaBox.heading },
        { name: 'text', type: 'textarea', label: 'Tekst', defaultValue: d.ctaBox.text },
      ],
    },
    {
      name: 'faq',
      type: 'array',
      label: 'Pytania i odpowiedzi (dane SEO)',
      labels: { singular: 'Pytanie', plural: 'Pytania' },
      admin: {
        description:
          'Niewidoczne na stronie — używane przez Google (dane strukturalne FAQ). Trzymaj zgodne z treścią powyżej.',
      },
      defaultValue: d.faq,
      fields: [
        { name: 'question', type: 'text', label: 'Pytanie', required: true },
        { name: 'answer', type: 'textarea', label: 'Odpowiedź', required: true },
      ],
    },
  ],
}
