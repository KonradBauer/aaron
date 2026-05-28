'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { services } from '@/data/services'

const PHONE = '+48 000 000 000'
const PHONE_HREF = 'tel:+48000000000'

const navLinks = [
  { label: 'Kontakt', href: '/kontakt' },
  { label: 'Zasiłek pogrzebowy', href: '/zasilek-pogrzebowy' },
  { label: 'Krok po kroku', href: '/krok-po-kroku' },
  { label: 'Galeria', href: '/galeria' },
  { label: 'Tanatokosmetyka', href: '/tanatokosmetyka' },
]

const navLinkCls =
  'text-[0.8rem] max-[1100px]:text-[0.75rem] font-normal tracking-[0.1em] uppercase text-text px-3 max-[1100px]:px-2 py-2 whitespace-nowrap transition-colors duration-[250ms] hover:text-gold'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [ofertaOpen, setOfertaOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const closeMobile = () => {
    setMobileOpen(false)
    setOfertaOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] h-[var(--header-height)] bg-black/[0.96] backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between h-full max-w-[var(--container)] mx-auto px-6 max-[480px]:px-4 gap-6 max-[480px]:gap-3">

          <Link href="/" className="flex-shrink-0" onClick={closeMobile}>
            <Image
              src="/logo.png"
              alt="Aaron Dom Pogrzebowy"
              width={160}
              height={64}
              className="h-12 max-[480px]:h-[38px] w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="flex items-center gap-1 flex-1 justify-center max-[960px]:hidden" aria-label="Nawigacja główna">
            <Link href="/" className={navLinkCls}>Strona główna</Link>

            {/* Oferta dropdown — pt-2 bridge eliminuje gap między linkiem a menu */}
            <div className="relative group">
              <Link href="/oferta" className={`${navLinkCls} flex items-center gap-1`}>
                Oferta
                <span className="text-[0.6rem] transition-transform duration-[250ms] group-hover:rotate-180">▾</span>
              </Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-[opacity,visibility] duration-[250ms] z-50">
                <div className="bg-surface border border-[var(--color-border)] min-w-[240px] py-2" role="menu">
                  {services.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/oferta/${s.slug}`}
                      className="block px-5 py-[10px] text-[0.8125rem] text-text whitespace-nowrap hover:bg-green hover:text-cream transition-[background-color,color] duration-[250ms]"
                      role="menuitem"
                    >
                      {s.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className={navLinkCls}>{l.label}</Link>
            ))}
          </nav>

          {/* Right: phone + hamburger */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <a href={PHONE_HREF} className="flex items-center text-cream hover:text-gold transition-colors duration-[250ms] whitespace-nowrap">
              <div>
                <span className="block text-[0.625rem] tracking-[0.15em] uppercase text-gold leading-none max-[480px]:hidden">Dostępni 24h</span>
                <span className="block text-[0.9375rem] max-[480px]:text-[0.875rem] font-semibold tracking-[0.03em]">{PHONE}</span>
              </div>
            </a>

            <button
              className="hidden max-[960px]:flex flex-col justify-center gap-[5px] bg-transparent border-0 cursor-pointer p-2 relative z-[101]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Zamknij menu' : 'Otwórz menu'}
              aria-expanded={mobileOpen}
            >
              <span className={`block w-6 h-[1.5px] bg-cream transition-all duration-300 origin-center ${mobileOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
              <span className={`block w-6 h-[1.5px] bg-cream transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block w-6 h-[1.5px] bg-cream transition-all duration-300 origin-center ${mobileOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <nav
        className={`fixed inset-0 z-[99] bg-black overflow-y-auto overscroll-contain transition-[opacity,visibility,transform] duration-300 ${
          mobileOpen
            ? 'opacity-100 visible pointer-events-auto translate-y-0'
            : 'opacity-0 invisible pointer-events-none -translate-y-2'
        }`}
        aria-label="Nawigacja mobilna"
        aria-hidden={!mobileOpen}
      >
        <div className="pt-[calc(var(--header-height)+16px)] pb-10 px-6 min-h-full flex flex-col">
          <Link
            href="/"
            className="flex items-center py-[18px] font-heading text-2xl font-normal tracking-[0.03em] text-cream border-b border-[var(--color-border-subtle)] hover:text-gold transition-colors leading-none"
            onClick={closeMobile}
          >
            Strona główna
          </Link>

          <button
            className="flex items-center justify-between py-[18px] font-heading text-2xl font-normal tracking-[0.03em] text-cream hover:text-gold transition-colors leading-none bg-transparent cursor-pointer w-full text-left"
            style={{ border: 'none', borderBottom: '1px solid var(--color-border-subtle)' }}
            onClick={() => setOfertaOpen((v) => !v)}
          >
            Oferta
            <span className="text-[0.65rem]">{ofertaOpen ? '▴' : '▾'}</span>
          </button>

          {ofertaOpen && (
            <div className="bg-surface -mx-6 px-8 py-2">
              <Link href="/oferta" className="block py-3 text-[0.9375rem] text-text-muted border-b border-[var(--color-border-subtle)] hover:text-cream transition-colors" onClick={closeMobile}>
                Wszystkie usługi
              </Link>
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/oferta/${s.slug}`}
                  className="block py-3 text-[0.9375rem] text-text-muted border-b border-[var(--color-border-subtle)] last:border-0 hover:text-cream transition-colors"
                  onClick={closeMobile}
                >
                  {s.title}
                </Link>
              ))}
            </div>
          )}

          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center py-[18px] font-heading text-2xl font-normal tracking-[0.03em] text-cream border-b border-[var(--color-border-subtle)] hover:text-gold transition-colors leading-none"
              onClick={closeMobile}
            >
              {l.label}
            </Link>
          ))}

          <div className="mt-auto pt-10">
            <a href={PHONE_HREF} className="flex flex-col gap-1 hover:opacity-80 transition-opacity">
              <span className="text-[0.6875rem] font-medium tracking-[0.2em] uppercase text-gold">Dostępni 24h</span>
              <span className="text-2xl font-semibold text-cream tracking-[0.03em]">{PHONE}</span>
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}
