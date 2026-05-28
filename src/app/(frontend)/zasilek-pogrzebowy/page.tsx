import type { Metadata } from 'next'
import Link from 'next/link'

import JsonLd from '@/components/JsonLd'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Zasiłek pogrzebowy',
  description:
    'Informacje o zasiłku pogrzebowym — komu przysługuje, jak złożyć wniosek, jakie dokumenty są potrzebne.',
  alternates: { canonical: '/zasilek-pogrzebowy' },
}

const PHONE_HREF = 'tel:+48000000000'
const PHONE = '+48 000 000 000'

const faqSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Komu przysługuje zasiłek pogrzebowy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Zasiłek pogrzebowy przysługuje osobie, która pokryła koszty pogrzebu ubezpieczonego, osoby pobierającej emeryturę lub rentę z ZUS/KRUS, członka rodziny ubezpieczonego lub emeryta/rencisty.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ile wynosi zasiłek pogrzebowy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Zasiłek pogrzebowy wynosi 4 636 zł (200% przeciętnego miesięcznego wynagrodzenia). Kwota może ulec zmianie — sprawdź aktualną wartość na stronie ZUS.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jak długo można złożyć wniosek o zasiłek pogrzebowy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Wniosek o zasiłek pogrzebowy należy złożyć nie później niż w ciągu 12 miesięcy od dnia śmierci osoby, po której zasiłek przysługuje.',
      },
    },
  ],
})

export default function ZasilekPogrzebowyPage() {
  return (
    <>
      <JsonLd json={faqSchema} />
      <PageHero
        title="Zasiłek pogrzebowy"
        subtitle="Dowiedz się, komu przysługuje zasiłek pogrzebowy i jak złożyć wniosek. Chętnie pomożemy w formalnościach."
        breadcrumb={[{ label: 'Zasiłek pogrzebowy' }]}
      />

      <div style={{ maxWidth: 'var(--container-narrow)', margin: '0 auto', padding: 'var(--section-v) 24px' }}>
        <article style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

          <section>
            <span className="section-label">Co to jest</span>
            <h2 className="heading-md" style={{ color: 'var(--color-cream)', marginBottom: '16px' }}>
              Czym jest zasiłek pogrzebowy?
            </h2>
            <p style={{ fontSize: '0.9375rem', lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
              Zasiłek pogrzebowy to jednorazowe świadczenie pieniężne wypłacane przez ZUS lub KRUS osobie,
              która poniosła koszty pogrzebu. Jego celem jest częściowe pokrycie wydatków związanych z organizacją
              ceremonii pogrzebowej.
            </p>
          </section>

          <div style={{ width: '100%', height: '1px', background: 'var(--color-border-subtle)' }} />

          <section>
            <h2 className="heading-md" style={{ color: 'var(--color-cream)', marginBottom: '16px' }}>
              Komu przysługuje?
            </h2>
            <p style={{ fontSize: '0.9375rem', lineHeight: '1.8', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Zasiłek pogrzebowy przysługuje osobie, która pokryła koszty pogrzebu:
            </p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                'ubezpieczonego lub osoby pobierającej emeryturę lub rentę z ZUS/KRUS',
                'członka rodziny ubezpieczonego lub emeryta/rencisty',
                'osoby, która w dniu śmierci nie była ubezpieczona, ale miała ustalone prawo do emerytury lub renty',
              ].map((item) => (
                <li key={item} style={{ display: 'flex', gap: '12px', fontSize: '0.9375rem', color: 'var(--color-text)', lineHeight: '1.6' }}>
                  <span style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '2px' }}>-</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div style={{ width: '100%', height: '1px', background: 'var(--color-border-subtle)' }} />

          <section>
            <h2 className="heading-md" style={{ color: 'var(--color-cream)', marginBottom: '16px' }}>
              Wysokość zasiłku
            </h2>
            <div style={{ background: 'var(--color-green)', padding: '32px', marginBottom: '20px' }}>
              <span className="section-label" style={{ marginBottom: '8px' }}>Aktualna kwota</span>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--color-cream)', fontWeight: '400' }}>
                4 636 zł
              </p>
              <p style={{ fontSize: '0.875rem', color: 'rgba(240, 235, 228, 0.6)', marginTop: '8px' }}>
                Kwota może ulec zmianie - sprawdź aktualną wartość na stronie ZUS lub zapytaj naszego pracownika.
              </p>
            </div>
            <p style={{ fontSize: '0.9375rem', lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
              Zasiłek pogrzebowy jest wypłacany w wysokości 200% przeciętnego miesięcznego wynagrodzenia
              obowiązującego w dniu śmierci osoby, której koszty pogrzebu zostały poniesione.
            </p>
          </section>

          <div style={{ width: '100%', height: '1px', background: 'var(--color-border-subtle)' }} />

          <section>
            <h2 className="heading-md" style={{ color: 'var(--color-cream)', marginBottom: '16px' }}>
              Wymagane dokumenty
            </h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                'Wniosek Z-12 (dostępny w ZUS lub online)',
                'Akt zgonu osoby, po której zasiłek przysługuje',
                'Rachunki i faktury potwierdzające koszty pogrzebu',
                'Dokumenty potwierdzające pokrewieństwo lub powinowactwo (np. akt małżeństwa, urodzenia)',
                'Numer rachunku bankowego do wypłaty zasiłku',
              ].map((item) => (
                <li key={item} style={{ display: 'flex', gap: '12px', fontSize: '0.9375rem', color: 'var(--color-text)', lineHeight: '1.6' }}>
                  <span style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '2px' }}>-</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div style={{ width: '100%', height: '1px', background: 'var(--color-border-subtle)' }} />

          <section>
            <h2 className="heading-md" style={{ color: 'var(--color-cream)', marginBottom: '16px' }}>
              Termin złożenia wniosku
            </h2>
            <p style={{ fontSize: '0.9375rem', lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
              Wniosek o zasiłek pogrzebowy należy złożyć <strong style={{ color: 'var(--color-cream)' }}>nie później niż w ciągu 12 miesięcy</strong> od
              dnia śmierci osoby, po której zasiłek przysługuje. Niezłożenie wniosku w tym terminie skutkuje
              utratą prawa do zasiłku.
            </p>
          </section>

          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '40px', textAlign: 'center' }}>
            <h3 className="heading-sm" style={{ color: 'var(--color-cream)', marginBottom: '12px' }}>
              Potrzebujesz pomocy z wnioskiem?
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Nasi pracownicy pomogą Ci w skompletowaniu dokumentów i wypełnieniu wniosku.
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
