import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ServiceLayout from '@/components/ServiceLayout'
import { getService, services } from '@/data/services'

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
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = getService(slug)

  if (!service) notFound()

  return (
    <ServiceLayout
      title={service.title}
      description={service.description}
      features={service.features}
    />
  )
}
