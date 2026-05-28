import type { MetadataRoute } from 'next'

import { services } from '@/data/services'
import { SITE_URL as BASE } from '@/lib/site-url'

const staticPages = [
  { path: '/', priority: 1 as const },
  { path: '/oferta', priority: 0.8 },
  { path: '/kontakt', priority: 0.8 },
  { path: '/zasilek-pogrzebowy', priority: 0.8 },
  { path: '/krok-po-kroku', priority: 0.7 },
  { path: '/tanatokosmetyka', priority: 0.7 },
  { path: '/galeria', priority: 0.6 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPages.map(({ path, priority }) => ({
      url: `${BASE}${path}`,
      changeFrequency: 'monthly' as const,
      priority,
    })),
    ...services.map((s) => ({
      url: `${BASE}/oferta/${s.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
