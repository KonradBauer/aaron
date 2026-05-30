import { cache } from 'react'

import { processSidebarDefault, processSteps } from '@/data/process-steps'
import { fetchGlobal } from '@/lib/payload-global'
import type { KrokPoKroku } from '@/payload-types'

const FALLBACK: KrokPoKroku = {
  id: 'fallback',
  intro: {
    heroTitle: 'Krok po kroku',
    heroSubtitle:
      'Co zrobić po śmierci bliskiej osoby — praktyczny przewodnik przez wszystkie formalności.',
  },
  steps: processSteps,
  sidebar: processSidebarDefault,
}

export const getKrokContent = cache((): Promise<KrokPoKroku> => fetchGlobal('krok-po-kroku', FALLBACK))
