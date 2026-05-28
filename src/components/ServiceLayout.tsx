import Image from 'next/image'
import Link from 'next/link'

import PageHero from '@/components/PageHero'

const PHONE = '+48 000 000 000'
const PHONE_HREF = 'tel:+48000000000'

interface Props {
  title: string
  description: string[]
  features: string[]
  imageUrl?: string
}

export default function ServiceLayout({ title, description, features, imageUrl }: Props) {
  return (
    <>
      <PageHero
        title={title}
        breadcrumb={[{ label: 'Oferta', href: '/oferta' }, { label: title }]}
      />

      <section className="max-w-[var(--container)] mx-auto px-6 py-[var(--section-v)] grid grid-cols-[1fr_380px] max-[900px]:grid-cols-1 gap-20 max-[900px]:gap-12 items-start">

        <div className="flex flex-col gap-6">
          <div className="aspect-video relative overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 900px) 100vw, 60vw"
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-green)_0%,var(--color-black)_100%)] flex items-center justify-center text-text-muted text-[0.75rem] tracking-[0.1em] uppercase">
                Zdjecie - placeholder
              </div>
            )}
          </div>
          {description.map((para, i) => (
            <p key={i} className="text-[0.9375rem] leading-[1.8] text-text-muted">{para}</p>
          ))}
        </div>

        <aside className="flex flex-col gap-8 sticky top-[calc(var(--header-height)+24px)] max-[900px]:static">
          {features.length > 0 && (
            <div className="bg-surface border border-[var(--color-border)] p-8">
              <span className="block text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-gold mb-5">Co oferujemy</span>
              <ul className="flex flex-col gap-3">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[0.875rem] text-text leading-[1.5]">
                    <span className="w-[5px] h-[5px] bg-gold rounded-full flex-shrink-0 mt-2" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-green p-8">
            <h3 className="font-heading text-[1.375rem] font-normal text-cream leading-[1.3] mb-3">
              Potrzebujesz pomocy?
            </h3>
            <p className="text-[0.875rem] text-cream/70 leading-relaxed mb-5">
              Jestesmy dostepni dla Ciebie 24 godziny na dobe. Zadzwon lub odwiedz jedno z naszych biur.
            </p>
            <a href={PHONE_HREF} className="block text-[1.125rem] font-semibold text-cream tracking-[0.03em] mb-4 hover:text-gold transition-colors">
              {PHONE}
            </a>
            <Link href="/kontakt" className="btn btn--outline inline-flex">
              Kontakt
            </Link>
          </div>
        </aside>
      </section>
    </>
  )
}
