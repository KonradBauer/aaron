import type { Metadata } from 'next'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

import JsonLd from '@/components/JsonLd'
import PageHero from '@/components/PageHero'
import { getSiteSettings, phoneHref } from '@/lib/site-settings'
import { getZasilekContent } from '@/lib/zasilek'

export const metadata: Metadata = {
  title: 'Zasiłek pogrzebowy',
  description:
    'Informacje o zasiłku pogrzebowym — komu przysługuje, jak złożyć wniosek, jakie dokumenty są potrzebne.',
  alternates: { canonical: '/zasilek-pogrzebowy' },
}

const divider = (
  <div style={{ width: '100%', height: '1px', background: 'var(--color-border-subtle)' }} />
)

export default async function ZasilekPogrzebowyPage() {
  const [settings, content] = await Promise.all([getSiteSettings(), getZasilekContent()])
  const PHONE = settings.phone ?? '+48 000 000 000'
  const PHONE_HREF = phoneHref(PHONE)

  const intro = content.intro ?? {}
  const whatIs = content.whatIs ?? {}
  const whoQualifies = content.whoQualifies ?? {}
  const amount = content.amount ?? {}
  const documents = content.documents ?? {}
  const deadline = content.deadline ?? {}
  const ctaBox = content.ctaBox ?? {}
  const faq = content.faq ?? []

  const faqSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  })

  return (
    <>
      <JsonLd json={faqSchema} />
      <PageHero
        title={intro.heroTitle ?? 'Zasiłek pogrzebowy'}
        subtitle={intro.heroSubtitle ?? undefined}
        breadcrumb={[{ label: 'Zasiłek pogrzebowy' }]}
      />

      <div style={{ maxWidth: 'var(--container-narrow)', margin: '0 auto', padding: 'var(--section-v) 24px' }}>
        <article style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

          <section>
            <span className="section-label">{whatIs.label}</span>
            <h2 className="heading-md" style={{ color: 'var(--color-cream)', marginBottom: '16px' }}>
              {whatIs.heading}
            </h2>
            <p style={{ fontSize: '0.9375rem', lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
              {whatIs.text}
            </p>
          </section>

          {divider}

          <section>
            <h2 className="heading-md" style={{ color: 'var(--color-cream)', marginBottom: '16px' }}>
              {whoQualifies.heading}
            </h2>
            <p style={{ fontSize: '0.9375rem', lineHeight: '1.8', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              {whoQualifies.intro}
            </p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(whoQualifies.bullets ?? []).map((item) => (
                <li key={item.id ?? item.text} style={{ display: 'flex', gap: '12px', fontSize: '0.9375rem', color: 'var(--color-text)', lineHeight: '1.6' }}>
                  <span style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '2px' }}>-</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </section>

          {divider}

          <section>
            <h2 className="heading-md" style={{ color: 'var(--color-cream)', marginBottom: '16px' }}>
              {amount.heading}
            </h2>
            <div style={{ background: 'var(--color-green)', padding: '32px', marginBottom: '20px' }}>
              <span className="section-label" style={{ marginBottom: '8px' }}>{amount.amountLabel}</span>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--color-cream)', fontWeight: '400' }}>
                {amount.amountValue}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'rgba(240, 235, 228, 0.6)', marginTop: '8px' }}>
                {amount.amountNote}
              </p>
            </div>
            <p style={{ fontSize: '0.9375rem', lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
              {amount.text}
            </p>
          </section>

          {divider}

          <section>
            <h2 className="heading-md" style={{ color: 'var(--color-cream)', marginBottom: '16px' }}>
              {documents.heading}
            </h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(documents.bullets ?? []).map((item) => (
                <li key={item.id ?? item.text} style={{ display: 'flex', gap: '12px', fontSize: '0.9375rem', color: 'var(--color-text)', lineHeight: '1.6' }}>
                  <span style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '2px' }}>-</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </section>

          {divider}

          <section>
            <h2 className="heading-md" style={{ color: 'var(--color-cream)', marginBottom: '16px' }}>
              {deadline.heading}
            </h2>
            <p style={{ fontSize: '0.9375rem', lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
              {deadline.text}
            </p>
          </section>

          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '40px', textAlign: 'center' }}>
            <h3 className="heading-sm" style={{ color: 'var(--color-cream)', marginBottom: '12px' }}>
              {ctaBox.heading}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              {ctaBox.text}
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={PHONE_HREF} className="btn btn--gold">{PHONE}</a>
              <Link href="/kontakt" className="btn btn--outline">Kontakt</Link>
            </div>
          </div>

        </article>
      </div>
    </>
  )
}
