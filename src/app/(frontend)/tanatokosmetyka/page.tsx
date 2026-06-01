import type { Metadata } from 'next'

import ServiceLayout from '@/components/ServiceLayout'

export const dynamic = 'force-dynamic'
import { resolveMediaUrl } from '@/lib/media'
import { getTanatoContent, TANATO_IMG_FALLBACK } from '@/lib/tanatokosmetyka'

export const metadata: Metadata = {
  title: 'Profesjonalna tanatokosmetyka',
  description:
    'Profesjonalna tanatokosmetyka w domu pogrzebowym Aaron — godne przygotowanie ciała do ostatniego pożegnania.',
  alternates: { canonical: '/tanatokosmetyka' },
}

export default async function TanatokosmetykaPage() {
  const content = await getTanatoContent()
  const imageUrl = resolveMediaUrl(content.image, TANATO_IMG_FALLBACK)

  return (
    <ServiceLayout
      title={content.title ?? 'Profesjonalna tanatokosmetyka'}
      imageUrl={imageUrl}
      description={(content.description ?? []).map((d) => d.text)}
      features={(content.features ?? []).map((f) => f.text)}
    />
  )
}
