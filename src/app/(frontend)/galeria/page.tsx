import type { Metadata } from 'next'
import Image from 'next/image'

import PageHero from '@/components/PageHero'
import { getGaleriaPage, getGalleryImages } from '@/lib/galeria'

export const metadata: Metadata = {
  title: 'Galeria',
  description: 'Galeria zdjęć domu pogrzebowego Aaron — sala pożegnań, wyposażenie, lokalizacje.',
  alternates: { canonical: '/galeria' },
}

export default async function GaleriaPage() {
  const [page, images] = await Promise.all([getGaleriaPage(), getGalleryImages()])
  const intro = page.intro ?? {}

  return (
    <>
      <PageHero
        title={intro.heroTitle ?? 'Galeria'}
        subtitle={intro.heroSubtitle ?? undefined}
        breadcrumb={[{ label: 'Galeria' }]}
      />

      <div className="max-w-[var(--container)] mx-auto px-6 py-[var(--section-v)]">
        <div className="grid grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1 gap-1">
          {images.map((img, i) => (
            <div
              key={`${img.alt}-${i}`}
              className="relative overflow-hidden group"
              style={{ aspectRatio: img.ratio }}
            >
              <Image
                src={img.imageUrl}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
            </div>
          ))}
        </div>
        {page.footerNote && (
          <p className="text-center text-text-muted text-[0.875rem] mt-10">{page.footerNote}</p>
        )}
      </div>
    </>
  )
}
