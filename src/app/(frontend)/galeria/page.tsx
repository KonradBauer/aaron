import type { Metadata } from 'next'

import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Galeria',
  description:
    'Galeria zdjęć domu pogrzebowego Aaron - sala pożegnań, wyposażenie, lokalizacje.',
}

const placeholders = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  label: `Zdjęcie ${i + 1}`,
}))

export default function GaleriaPage() {
  return (
    <>
      <PageHero
        title="Galeria"
        subtitle="Zapraszamy do zapoznania się z naszymi obiektami i wyposażeniem."
        breadcrumb={[{ label: 'Galeria' }]}
      />

      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--section-v) 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '4px',
          }}
        >
          {placeholders.map((p) => (
            <div
              key={p.id}
              className="img-placeholder"
              style={{
                aspectRatio: p.id % 5 === 0 ? '16/10' : '4/3',
                fontSize: '0.6875rem',
                letterSpacing: '0.15em',
              }}
            >
              {p.label}
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '40px' }}>
          Galeria zostanie uzupełniona zdjęciami w kolejnym etapie.
        </p>
      </div>
    </>
  )
}
