import type { Metadata } from 'next'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

import PageHero from '@/components/PageHero'
import { getOfertaPage, getServicesList } from '@/lib/oferta'

export const metadata: Metadata = {
  title: 'Oferta',
  description:
    'Pełna oferta domu pogrzebowego Aaron — organizacja pogrzebów, sala pożegnań, kwiaty, oprawa muzyczna i wiele więcej.',
  alternates: { canonical: '/oferta' },
}

export default async function OfertaPage() {
  const [page, servicesList] = await Promise.all([getOfertaPage(), getServicesList()])
  const intro = page.intro ?? {}

  return (
    <>
      <PageHero
        title={intro.heroTitle ?? 'Nasze usługi'}
        subtitle={intro.heroSubtitle ?? undefined}
        breadcrumb={[{ label: 'Oferta' }]}
      />

      <div className="max-w-[var(--container)] mx-auto px-6 py-[var(--section-v)] grid grid-cols-3 max-[900px]:grid-cols-2 max-[560px]:grid-cols-1 gap-px bg-[var(--color-border-subtle)]">
        {servicesList.map((service, index) => (
          <Link
            key={service.slug}
            href={`/oferta/${service.slug}`}
            className="bg-surface flex flex-col gap-3 px-8 py-10 relative overflow-hidden group hover:bg-surface-2 transition-colors duration-[250ms]"
          >
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-[250ms] origin-left" />
            <span className="text-[0.6875rem] font-medium tracking-[0.15em] text-gold opacity-60">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className="font-heading text-[1.25rem] font-medium text-cream leading-[1.3] tracking-[0.02em]">
              {service.title}
            </h2>
            <p className="text-[0.875rem] text-text-muted leading-relaxed flex-1">{service.shortDesc}</p>
            <span className="text-[0.75rem] text-gold mt-2 tracking-[0.1em] uppercase">Dowiedz się więcej →</span>
          </Link>
        ))}
      </div>
    </>
  )
}
