import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

import { processSidebarDefault, processSteps } from '@/data/process-steps'

export const KrokPoKrokuPage: GlobalConfig = {
  slug: 'krok-po-kroku',
  label: 'Krok po kroku',
  admin: {
    group: 'Treści',
  },
  hooks: {
    afterChange: [
      ({ req }) => {
        try {
          revalidatePath('/', 'layout')
        } catch (err) {
          req.payload.logger.error({ err }, 'revalidatePath failed after KrokPoKrokuPage change')
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
        {
          name: 'heroTitle',
          type: 'text',
          label: 'Tytuł',
          defaultValue: 'Krok po kroku',
        },
        {
          name: 'heroSubtitle',
          type: 'textarea',
          label: 'Podtytuł',
          defaultValue:
            'Co zrobić po śmierci bliskiej osoby — praktyczny przewodnik przez wszystkie formalności.',
        },
      ],
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Kroki',
      labels: { singular: 'Krok', plural: 'Kroki' },
      defaultValue: processSteps,
      admin: {
        description: 'Numery kroków (01, 02, …) nadawane są automatycznie według kolejności.',
      },
      fields: [
        { name: 'title', type: 'text', label: 'Tytuł kroku', required: true },
        { name: 'desc', type: 'textarea', label: 'Opis kroku', required: true },
      ],
    },
    {
      type: 'group',
      name: 'sidebar',
      label: 'Panel boczny',
      fields: [
        {
          name: 'reminderLabel',
          type: 'text',
          label: 'Boks „Pamiętaj" — etykieta',
          defaultValue: processSidebarDefault.reminderLabel,
        },
        {
          name: 'reminderHeading',
          type: 'text',
          label: 'Boks „Pamiętaj" — nagłówek',
          defaultValue: processSidebarDefault.reminderHeading,
        },
        {
          name: 'reminderText',
          type: 'textarea',
          label: 'Boks „Pamiętaj" — tekst',
          defaultValue: processSidebarDefault.reminderText,
        },
        {
          name: 'zasilekLabel',
          type: 'text',
          label: 'Boks „Zasiłek" — etykieta',
          defaultValue: processSidebarDefault.zasilekLabel,
        },
        {
          name: 'zasilekText',
          type: 'textarea',
          label: 'Boks „Zasiłek" — tekst',
          defaultValue: processSidebarDefault.zasilekText,
        },
      ],
    },
  ],
}
