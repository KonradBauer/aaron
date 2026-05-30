import { cache } from 'react'

import { fetchGlobal } from '@/lib/payload-global'
import type { StronaGlowna } from '@/payload-types'

// Fallbacki obrazków używane gdy klient nie wgrał jeszcze własnego zdjęcia.
export const HERO_IMG_FALLBACK =
  'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=1920&q=85&fit=crop'
export const ABOUT_IMG_FALLBACK =
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80&fit=crop'

const FALLBACK: StronaGlowna = {
  id: 'fallback',
  hero: {
    badge: 'Dom Pogrzebowy',
    titleLine1: 'Aaron',
    titleLine2: 'Z godnością i troską.',
    subtitle:
      'Towarzyszymy rodzinom w najtrudniejszych chwilach - profesjonalnie, dyskretnie i z najwyższą troską.',
    ctaPrimaryLabel: 'Zadzwoń — dostępni 24h',
    ctaSecondaryLabel: 'Nasze usługi',
  },
  about: {
    label: 'O nas',
    heading: 'Profesjonalizm i empatia w każdej chwili',
    paragraphs: [
      {
        text: 'Dom Pogrzebowy Aaron to firma z wieloletnią tradycją i doświadczeniem w organizacji ceremonii pogrzebowych. Naszym priorytetem jest godne i profesjonalne pożegnanie bliskiej osoby, przy jednoczesnym wsparciu rodziny na każdym etapie — od pierwszego kontaktu aż po ceremonię.',
      },
      {
        text: 'Rozumiemy, ze każde pożegnanie jest wyjątkowe. Dlatego do każdej rodziny podchodzimy indywidualnie, słuchając jej potrzeb i dostosowując każdy szczegół do oczekiwań i życzenia bliskich.',
      },
    ],
    bullets: [
      { text: 'Dostępni 24 godziny na dobę, 7 dni w tygodniu' },
      { text: 'Dwie wygodne lokalizacje' },
      { text: 'Mobilne biuro - przyjeżdżamy do Ciebie' },
      { text: 'Pełna obsługa formalna' },
    ],
    ctaLabel: 'Skontaktuj się z nami',
  },
  servicesSection: {
    label: 'Nasze usługi',
    heading: 'Kompleksowa obsługa pogrzebowa',
    subtitle:
      'Oferujemy pełen zakres usług pogrzebowych — zadbamy o każdy szczegół, byś mógł poświęcić czas rodzinie.',
  },
  cta: {
    heading: 'Jesteśmy dostępni dla Ciebie zawsze',
    text: 'Telefon czynny 24 godziny na dobę, 7 dni w tygodniu. Przyjedziemy do Ciebie.',
  },
}

export const getHomeContent = cache((): Promise<StronaGlowna> => fetchGlobal('strona-glowna', FALLBACK))
