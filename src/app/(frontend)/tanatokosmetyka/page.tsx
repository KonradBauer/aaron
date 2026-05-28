import type { Metadata } from 'next'
import Link from 'next/link'

import PageHero from '@/components/PageHero'
import ServiceLayout from '@/components/ServiceLayout'

export const metadata: Metadata = {
  title: 'Profesjonalna tanatokosmetyka',
  description:
    'Profesjonalna tanatokosmetyka w domu pogrzebowym Aaron — godne przygotowanie ciała do ostatniego pożegnania.',
  alternates: { canonical: '/tanatokosmetyka' },
}

export default function TanatokosmetykaPage() {
  return (
    <ServiceLayout
      title="Profesjonalna tanatokosmetyka"
      imageUrl="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&q=80&fit=crop"
      description={[
        'Tanatokosmetyka to profesjonalne przygotowanie ciała osoby zmarłej do ceremonii pogrzebowej. Nasi certyfikowani specjaliści zadbają o godny i spokojny wygląd bliskiej osoby, tak by ostatnie pożegnanie było jak najbardziej godne i wzruszające.',
        'Usługa obejmuje pełną pielęgnację i przygotowanie kosmetyczne - mycie, czesanie, delikatny makijaż oraz ubieranie zgodnie z życzeniami rodziny. Pracujemy z najwyższą troską i szacunkiem, traktując każdą osobę z godnością.',
        'Tanatokosmetyka może znacząco ułatwić rodzinie pożegnanie - widok bliskiej osoby zadbany i spokojny pomaga w procesie żałoby i pożegnania.',
      ]}
      features={[
        'Pełna pielęgnacja i przygotowanie do uroczystości',
        'Dyskretny i naturalny makijaż',
        'Fryzura i ułożenie włosów zgodnie z życzeniem rodziny',
        'Ubieranie w strój wskazany przez rodzinę',
        'Wykonywane przez certyfikowanych tanatokosmetyków',
        'Traktowanie z najwyższą godnością i szacunkiem',
      ]}
    />
  )
}
