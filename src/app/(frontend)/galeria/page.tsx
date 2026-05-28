import type { Metadata } from 'next'
import Image from 'next/image'

import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Galeria',
  description: 'Galeria zdjęć domu pogrzebowego Aaron — sala pożegnań, wyposażenie, lokalizacje.',
  alternates: { canonical: '/galeria' },
}

const galleryImages = [
  { id: 'photo-1518098268026-4e89f1a2cd8e', alt: 'Pejzaż o zachodzie słońca', ratio: '4/3' },
  { id: 'photo-1476514525535-07fb3b4ae5f1', alt: 'Spokojna droga', ratio: '4/3' },
  { id: 'photo-1507838153414-b4b713384a76', alt: 'Oprawa muzyczna', ratio: '4/3' },
  { id: 'photo-1508739773434-c26b3d09e071', alt: 'Świeca', ratio: '16/10' },
  { id: 'photo-1508739773434-c26b3d09e071', alt: 'Krajobraz górski', ratio: '4/3' },
  { id: 'photo-1558618666-fcd25c85cd64', alt: 'Eleganckie wnętrze', ratio: '4/3' },
  { id: 'photo-1436491865332-7a61a109cc05', alt: 'Transport międzynarodowy', ratio: '4/3' },
  { id: 'photo-1449965408869-eaa3f722e40d', alt: 'Mobilne biuro', ratio: '16/10' },
  { id: 'photo-1518098268026-4e89f1a2cd8e', alt: 'Pejzaz', ratio: '4/3' },
  { id: 'photo-1476514525535-07fb3b4ae5f1', alt: 'Natura', ratio: '4/3' },
  { id: 'photo-1507838153414-b4b713384a76', alt: 'Muzyka', ratio: '4/3' },
  { id: 'photo-1508739773434-c26b3d09e071', alt: 'Krajobraz', ratio: '4/3' },
] as const

export default function GaleriaPage() {
  return (
    <>
      <PageHero
        title="Galeria"
        subtitle="Zapraszamy do zapoznania się z naszymi obiektami i wyposażeniem."
        breadcrumb={[{ label: 'Galeria' }]}
      />

      <div className="max-w-[var(--container)] mx-auto px-6 py-[var(--section-v)]">
        <div className="grid grid-cols-3 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1 gap-1">
          {galleryImages.map((img, i) => (
            <div
              key={`${img.id}-${i}`}
              className="relative overflow-hidden group"
              style={{ aspectRatio: img.ratio }}
            >
              <Image
                src={`https://images.unsplash.com/${img.id}?w=800&q=75&fit=crop`}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
            </div>
          ))}
        </div>
        <p className="text-center text-text-muted text-[0.875rem] mt-10">
          Galeria zostanie uzupełniona własnymi zdjęciami.
        </p>
      </div>
    </>
  )
}
