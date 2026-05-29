import type { Metadata } from 'next'
import Link from 'next/link'

import JsonLd from '@/components/JsonLd'
import PageHero from '@/components/PageHero'
import { getKrokContent } from '@/lib/krok-po-kroku'
import { getSiteSettings, phoneHref } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Krok po kroku — Co zrobić po śmierci bliskiej osoby',
  description: 'Praktyczny poradnik — co zrobić po śmierci bliskiej osoby. Krok po kroku przez wszystkie formalności.',
  alternates: { canonical: '/krok-po-kroku' },
}

export default async function KrokPoKrokuPage() {
  const [settings, content] = await Promise.all([getSiteSettings(), getKrokContent()])
  const PHONE = settings.phone ?? '+48 000 000 000'
  const PHONE_HREF = phoneHref(PHONE)

  const intro = content.intro ?? {}
  const steps = content.steps ?? []
  const sidebar = content.sidebar ?? {}

  const howToSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Co zrobić po śmierci bliskiej osoby',
    description: 'Praktyczny poradnik krok po kroku przez wszystkie formalności po śmierci bliskiej osoby.',
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.desc,
    })),
  })

  return (
    <>
      <JsonLd json={howToSchema} />
      <PageHero
        title={intro.heroTitle ?? 'Krok po kroku'}
        subtitle={intro.heroSubtitle ?? undefined}
        breadcrumb={[{ label: 'Krok po kroku' }]}
      />

      <div className="max-w-[var(--container)] mx-auto px-6 py-[var(--section-v)]">
        <div className="grid grid-cols-[minmax(0,1fr)_340px] max-[900px]:grid-cols-1 gap-20 max-[900px]:gap-12 items-start">

          {/* Steps */}
          <div className="flex flex-col">
            {steps.map((step, i) => (
              <div
                key={step.id ?? i}
                className={`flex gap-8 max-[560px]:gap-5 py-10 max-[560px]:py-7 ${i < steps.length - 1 ? 'border-b border-[var(--color-border-subtle)]' : ''}`}
              >
                <span className="font-heading text-[2.5rem] max-[560px]:text-[1.75rem] font-light text-gold opacity-40 leading-none min-w-[52px] max-[560px]:min-w-[36px] text-center flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex flex-col gap-3">
                  <h2 className="font-heading text-[1.5rem] max-[560px]:text-[1.25rem] font-medium text-cream tracking-[0.02em] leading-[1.2]">
                    {step.title}
                  </h2>
                  <p className="text-[0.9375rem] leading-[1.75] text-text-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="sticky top-[calc(var(--header-height)+24px)] max-[900px]:static flex flex-col gap-6">
            <div className="bg-green p-10 max-[560px]:p-7">
              <span className="section-label">{sidebar.reminderLabel}</span>
              <h3 className="font-heading text-[1.375rem] font-normal text-cream leading-[1.3] mb-3">
                {sidebar.reminderHeading}
              </h3>
              <p className="text-[0.875rem] text-cream/70 leading-relaxed mb-5">
                {sidebar.reminderText}
              </p>
              <a href={PHONE_HREF} className="block text-[1.125rem] font-semibold text-cream tracking-[0.03em] mb-4 hover:text-gold transition-colors">
                {PHONE}
              </a>
              <Link href="/kontakt" className="btn btn--outline inline-flex">Kontakt</Link>
            </div>

            <div className="bg-surface border border-[var(--color-border)] p-8 max-[560px]:p-7">
              <span className="section-label">{sidebar.zasilekLabel}</span>
              <p className="text-[0.875rem] text-text-muted leading-relaxed mb-4">
                {sidebar.zasilekText}
              </p>
              <Link href="/zasilek-pogrzebowy" className="btn btn--outline-gold inline-flex">Dowiedz się więcej</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
