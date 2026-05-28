import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import JsonLd from '@/components/JsonLd'
import ServiceLayout from '@/components/ServiceLayout'
import { getService, services } from '@/data/services'
import { SITE_URL } from '@/lib/site-url'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}

  return {
    title: service.title,
    description: service.shortDesc,
    alternates: { canonical: `/oferta/${slug}` },
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = getService(slug)

  if (!service) notFound()

  const serviceSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.shortDesc,
    provider: {
      '@type': 'FuneralHome',
      name: 'Aaron Dom Pogrzebowy',
      url: SITE_URL,
    },
    url: `${SITE_URL}/oferta/${slug}`,
  })

  return (
    <>
      <JsonLd json={serviceSchema} />
      <ServiceLayout
        title={service.title}
        description={service.description}
        features={service.features}
        imageUrl={service.imageUrl}
      />
    </>
  )
}
