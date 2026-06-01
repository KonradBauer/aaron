import type { Metadata } from 'next'

import Gallery from '@/components/Gallery'

export const dynamic = 'force-dynamic'
import PageHero from '@/components/PageHero'
import { getGaleriaPage, getGalleryImages } from '@/lib/galeria'

export const metadata: Metadata = {
  title: 'Galeria',
  description: 'Galeria zdjęć domu pogrzebowego Aaron — sala pożegnań, wyposażenie, lokalizacje.',
  alternates: { canonical: '/galeria' },
}

export default async function GaleriaPage() {
  const page = await getGaleriaPage()
  const images = await getGalleryImages()
  const intro = page.intro ?? {}

  return (
    <>
      <PageHero
        title={intro.heroTitle ?? 'Galeria'}
        subtitle={intro.heroSubtitle ?? undefined}
        breadcrumb={[{ label: 'Galeria' }]}
      />

      <div className="max-w-[var(--container)] mx-auto px-6 py-[var(--section-v)]">
        <Gallery images={images} footerNote={page.footerNote} />
      </div>
    </>
  )
}
