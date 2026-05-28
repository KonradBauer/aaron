import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { services } from '@/data/services'

export const metadata: Metadata = {
  title: 'Aaron Dom Pogrzebowy - Profesjonalna obsluga pogrzebowa 24h',
  description:
    'Dom pogrzebowy Aaron - godna i profesjonalna obsluga pogrzebowa. Organizacja pogrzebów, sala pozegnan, tanatokosmetyka. Dostepni 24 godziny na dobe.',
}

const PHONE_HREF = 'tel:+48000000000'
const PHONE = '+48 000 000 000'

const HERO_IMG = 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1920&q=85&fit=crop'
const ABOUT_IMG = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80&fit=crop'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-label="Sekcja glówna">
        <Image
          src={HERO_IMG}
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="relative z-10 max-w-[var(--container)] mx-auto px-6 pt-[calc(var(--header-height)+40px)] pb-20 w-full flex flex-col items-start">
          <span className="text-[0.75rem] font-medium tracking-[0.25em] uppercase text-gold mb-5">Dom Pogrzebowy</span>
          <h1 className="font-heading font-light tracking-[0.03em] text-cream leading-[1.05] text-[clamp(3rem,7vw,6rem)] mb-2">
            Aaron
            <strong className="font-semibold block">Z godnością i troską.</strong>
          </h1>
          <div className="w-[60px] h-[1px] bg-gold my-7" />
          <p className="font-heading font-light italic text-text text-[clamp(1.125rem,2.5vw,1.5rem)] max-w-[560px] leading-[1.5] mb-10">
            Towarzyszymy rodzinom w najtrudniejszych chwilach - profesjonalnie, dyskretnie i z najwyzsza troską.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <a href={PHONE_HREF} className="btn btn--gold">Zadzwon - dostepni 24h</a>
            <Link href="/oferta" className="btn btn--outline">Nasze usługi</Link>
          </div>
        </div>
      </section>

      {/* O nas */}
      <section className="bg-surface py-[var(--section-v)]" aria-labelledby="about-heading">
        <div className="max-w-[var(--container)] mx-auto px-6 grid grid-cols-2 max-[900px]:grid-cols-1 gap-20 max-[900px]:gap-12 items-center">
          <div className="flex flex-col gap-6">
            <span className="section-label">O nas</span>
            <h2 id="about-heading" className="font-heading font-normal text-cream tracking-[0.02em] leading-[1.15] text-[clamp(2rem,4vw,3rem)]">
              Profesjonalizm i empatia w kazdej chwili
            </h2>
            <p className="text-[0.9375rem] leading-[1.75] text-text-muted">
              Dom Pogrzebowy Aaron to firma z wieloletnia tradycja i doswiadczeniem w organizacji ceremonii pogrzebowych.
              Naszym priorytetem jest godne i profesjonalne pozegnanie bliskiej osoby, przy jednoczesnym wsparciu
              rodziny na kazdym etapie - od pierwszego kontaktu az po ceremonie.
            </p>
            <p className="text-[0.9375rem] leading-[1.75] text-text-muted">
              Rozumiemy, ze kazde pozegnanie jest wyjatkowe. Dlatego do kazdej rodziny podchodzimy indywidualnie,
              sluchajac jej potrzeb i dostosowujac kazdy szczegol do oczekiwan i zyczenia bliskich.
            </p>
            <ul className="flex flex-col gap-4">
              {[
                'Dostepni 24 godziny na dobe, 7 dni w tygodniu',
                'Dwie wygodne lokalizacje',
                'Mobilne biuro - przyjeżdżamy do Ciebie',
                'Pelna obsluga formalna',
              ].map((v) => (
                <li key={v} className="flex items-start gap-4">
                  <span className="w-[6px] h-[6px] bg-gold rounded-full flex-shrink-0 mt-[7px]" />
                  <span className="text-[0.9375rem] text-text leading-[1.5]">{v}</span>
                </li>
              ))}
            </ul>
            <div>
              <Link href="/kontakt" className="btn btn--outline-gold">Skontaktuj sie z nami</Link>
            </div>
          </div>

          {/* About image */}
          <div className="relative aspect-[4/5] max-[900px]:aspect-video overflow-hidden">
            <Image
              src={ABOUT_IMG}
              alt="Kwiaty - Aaron Dom Pogrzebowy"
              fill
              className="object-cover"
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <div className="absolute bottom-[-16px] right-[-16px] w-4/5 h-4/5 border border-[var(--color-border)] pointer-events-none max-[900px]:hidden" />
          </div>
        </div>
      </section>

      {/* Usługi */}
      <section className="py-[var(--section-v)]" aria-labelledby="services-heading">
        <div className="max-w-[var(--container)] mx-auto px-6 text-center mb-16">
          <span className="section-label">Nasze usługi</span>
          <h2 id="services-heading" className="font-heading font-normal text-cream tracking-[0.02em] text-[clamp(1.75rem,3.5vw,2.75rem)]">
            Kompleksowa obsluga pogrzebowa
          </h2>
          <p className="mt-4 text-[0.9375rem] text-text-muted max-w-[500px] mx-auto leading-[1.65]">
            Oferujemy pelen zakres uslug pogrzebowych - zadbamy o kazdy szczegol, bys mógł poswiecic czas rodzinie.
          </p>
        </div>

        <div className="max-w-[var(--container)] mx-auto px-6 grid grid-cols-3 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1 gap-px bg-[var(--color-border-subtle)]">
          {services.map((service, index) => (
            <Link
              key={service.slug}
              href={`/oferta/${service.slug}`}
              className="bg-surface flex flex-col gap-3 px-8 py-10 relative overflow-hidden group hover:bg-surface-2 transition-colors duration-[250ms]"
            >
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-[250ms] origin-left" />
              <span className="text-[0.6875rem] font-medium tracking-[0.15em] text-gold opacity-60">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading text-[1.25rem] font-medium text-cream leading-[1.3] tracking-[0.02em]">
                {service.title}
              </h3>
              <p className="text-[0.875rem] text-text-muted leading-relaxed flex-1">{service.shortDesc}</p>
              <span className="text-[0.75rem] text-gold mt-2 tracking-[0.1em] uppercase">Dowiedz sie wiecej →</span>
            </Link>
          ))}
        </div>

        <div className="max-w-[var(--container)] mx-auto px-6 mt-12 text-center">
          <Link href="/oferta" className="btn btn--outline-gold">Zobacz wszystkie usługi</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-[72px] bg-green" aria-label="Kontakt 24h">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(201,168,76,0.05)_0%,transparent_50%,rgba(201,168,76,0.05)_100%)]" />
        <div className="relative max-w-[var(--container)] mx-auto px-6 flex items-center justify-between gap-10 flex-wrap max-[600px]:flex-col max-[600px]:items-start">
          <div className="flex flex-col gap-2">
            <h2 className="font-heading font-normal text-cream tracking-[0.02em] text-[clamp(1.5rem,3vw,2.25rem)]">
              Jestesmy dostepni dla Ciebie zawsze
            </h2>
            <p className="text-[0.9375rem] text-cream/65">
              Telefon czynny 24 godziny na dobe, 7 dni w tygodniu. Przyjedziemy do Ciebie.
            </p>
          </div>
          <a href={PHONE_HREF} className="btn btn--gold">{PHONE}</a>
        </div>
      </section>
    </>
  )
}
