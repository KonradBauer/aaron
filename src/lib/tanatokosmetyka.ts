import { cache } from 'react'

import { fetchGlobal } from '@/lib/payload-global'
import type { Tanatokosmetyka } from '@/payload-types'

export const TANATO_IMG_FALLBACK =
  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&q=80&fit=crop'

const FALLBACK: Tanatokosmetyka = {
  id: 'fallback',
  title: 'Profesjonalna tanatokosmetyka',
  description: [
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
  features: [
    { text: 'Pełna pielęgnacja i przygotowanie do uroczystości' },
    { text: 'Dyskretny i naturalny makijaż' },
    { text: 'Fryzura i ułożenie włosów zgodnie z życzeniem rodziny' },
    { text: 'Ubieranie w strój wskazany przez rodzinę' },
    { text: 'Wykonywane przez certyfikowanych tanatokosmetyków' },
    { text: 'Traktowanie z najwyższą godnością i szacunkiem' },
  ],
}

export const getTanatoContent = cache((): Promise<Tanatokosmetyka> =>
  fetchGlobal('tanatokosmetyka', FALLBACK),
)
