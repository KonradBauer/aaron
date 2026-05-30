import { cache } from 'react'

import { zasilekDefault as d } from '@/data/zasilek'
import { fetchGlobal } from '@/lib/payload-global'
import type { ZasilekPogrzebowy } from '@/payload-types'

const toTextRows = (items: string[]) => items.map((text) => ({ text }))

const FALLBACK: ZasilekPogrzebowy = {
  id: 'fallback',
  intro: d.intro,
  whatIs: d.whatIs,
  whoQualifies: {
    heading: d.whoQualifies.heading,
    intro: d.whoQualifies.intro,
    bullets: toTextRows(d.whoQualifies.bullets),
  },
  amount: d.amount,
  documents: { heading: d.documents.heading, bullets: toTextRows(d.documents.bullets) },
  deadline: d.deadline,
  ctaBox: d.ctaBox,
  faq: d.faq,
}

export const getZasilekContent = cache((): Promise<ZasilekPogrzebowy> =>
  fetchGlobal('zasilek-pogrzebowy', FALLBACK),
)
