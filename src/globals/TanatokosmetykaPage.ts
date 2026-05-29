import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const TanatokosmetykaPage: GlobalConfig = {
  slug: 'tanatokosmetyka',
  label: 'Tanatokosmetyka',
  admin: {
    group: 'Treści',
  },
  hooks: {
    afterChange: [
      ({ req }) => {
        try {
          revalidatePath('/', 'layout')
        } catch (err) {
          req.payload.logger.error({ err }, 'revalidatePath failed after TanatokosmetykaPage change')
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tytuł strony',
      defaultValue: 'Profesjonalna tanatokosmetyka',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Zdjęcie',
      admin: {
        description: 'Puste = zostaje zdjęcie domyślne.',
      },
    },
    {
      name: 'description',
      type: 'array',
      label: 'Opis (akapity)',
      labels: { singular: 'Akapit', plural: 'Akapity' },
      defaultValue: [
        {
          text: 'Tanatokosmetyka to profesjonalne przygotowanie ciała osoby zmarłej do ceremonii pogrzebowej. Nasi certyfikowani specjaliści zadbają o godny i spokojny wygląd bliskiej osoby, tak by ostatnie pożegnanie było jak najbardziej godne i wzruszające.',
        },
        {
          text: 'Usługa obejmuje pełną pielęgnację i przygotowanie kosmetyczne - mycie, czesanie, delikatny makijaż oraz ubieranie zgodnie z życzeniami rodziny. Pracujemy z najwyższą troską i szacunkiem, traktując każdą osobę z godnością.',
        },
        {
          text: 'Tanatokosmetyka może znacząco ułatwić rodzinie pożegnanie - widok bliskiej osoby zadbany i spokojny pomaga w procesie żałoby i pożegnania.',
        },
      ],
      fields: [{ name: 'text', type: 'textarea', label: 'Treść akapitu', required: true }],
    },
    {
      name: 'features',
      type: 'array',
      label: 'Co oferujemy (lista punktów)',
      labels: { singular: 'Punkt', plural: 'Punkty' },
      defaultValue: [
        { text: 'Pełna pielęgnacja i przygotowanie do uroczystości' },
        { text: 'Dyskretny i naturalny makijaż' },
        { text: 'Fryzura i ułożenie włosów zgodnie z życzeniem rodziny' },
        { text: 'Ubieranie w strój wskazany przez rodzinę' },
        { text: 'Wykonywane przez certyfikowanych tanatokosmetyków' },
        { text: 'Traktowanie z najwyższą godnością i szacunkiem' },
      ],
      fields: [{ name: 'text', type: 'text', label: 'Treść punktu', required: true }],
    },
  ],
}
