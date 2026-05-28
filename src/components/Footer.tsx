import Link from 'next/link'
import Image from 'next/image'

import { services } from '@/data/services'

const PHONE = '+48 000 000 000'
const PHONE_HREF = 'tel:+48000000000'

const infoLinks = [
  { label: 'Zasiłek pogrzebowy', href: '/zasilek-pogrzebowy' },
  { label: 'Krok po kroku', href: '/krok-po-kroku' },
  { label: 'Galeria', href: '/galeria' },
  { label: 'Tanatokosmetyka', href: '/tanatokosmetyka' },
  { label: 'Kontakt', href: '/kontakt' },
]

const colLinkCls = 'text-[0.875rem] text-text-muted hover:text-cream transition-colors duration-[250ms]'
const colTitleCls = 'text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-gold mb-1'

export default function Footer() {
  const firstSix = services.slice(0, 6)
  const secondSix = services.slice(6)

  return (
    <footer className="bg-surface border-t border-[var(--color-border)] pt-16 pb-8">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] max-[900px]:grid-cols-2 max-[560px]:grid-cols-1 gap-12 max-w-[var(--container)] mx-auto px-6">

        {/* Brand */}
        <div className="flex flex-col gap-5 max-[900px]:col-span-2 max-[560px]:col-span-1">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Aaron Dom Pogrzebowy"
              width={120}
              height={52}
              className="h-11 w-auto object-contain"
            />
          </Link>
          <p className="text-[0.875rem] text-text-muted leading-relaxed max-w-[260px] max-[900px]:max-w-full">
            Profesjonalna i godna obsługa pogrzebowa. Dostępni dla rodzin 24 godziny na dobę, 7 dni w tygodniu.
          </p>
        </div>

        {/* Usługi 1-6 */}
        <div className="flex flex-col gap-4">
          <span className={colTitleCls}>Usługi</span>
          {firstSix.map((s) => (
            <Link key={s.slug} href={`/oferta/${s.slug}`} className={colLinkCls}>{s.title}</Link>
          ))}
        </div>

        {/* Usługi 7-12 */}
        <div className="flex flex-col gap-4">
          <span className={colTitleCls}>Usługi</span>
          {secondSix.map((s) => (
            <Link key={s.slug} href={`/oferta/${s.slug}`} className={colLinkCls}>{s.title}</Link>
          ))}
        </div>

        {/* Informacje + kontakt */}
        <div className="flex flex-col gap-4">
          <span className={colTitleCls}>Informacje</span>
          {infoLinks.map((l) => (
            <Link key={l.href} href={l.href} className={colLinkCls}>{l.label}</Link>
          ))}

          <span className={`${colTitleCls} mt-4`}>Kontakt</span>
          <div className="flex flex-col gap-1">
            <span className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-text-muted">Telefon 24h</span>
            <a href={PHONE_HREF} className="text-[0.9375rem] text-text hover:text-gold transition-colors duration-[250ms]">{PHONE}</a>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-text-muted">Lokalizacja 1</span>
            <span className="text-[0.9375rem] text-text">ul. Przykładowa 1, Miasto</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-text-muted">Lokalizacja 2</span>
            <span className="text-[0.9375rem] text-text">ul. Przykładowa 2, Miasto</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[var(--container)] mx-auto px-6 mt-12 pt-6 border-t border-[var(--color-border-subtle)] flex items-center justify-between gap-4 flex-wrap max-[560px]:flex-col max-[560px]:items-start max-[560px]:gap-3">
        <span className="text-[0.75rem] text-text-muted">
          © {new Date().getFullYear()} Aaron Dom Pogrzebowy. Wszelkie prawa zastrzeżone.
        </span>
        <Link href="/polityka-prywatnosci" className="text-[0.75rem] text-text-muted hover:text-cream transition-colors">
          Polityka prywatności
        </Link>
      </div>
    </footer>
  )
}
