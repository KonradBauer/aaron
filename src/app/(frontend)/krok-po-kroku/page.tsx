import type { Metadata } from 'next'
import Link from 'next/link'

import JsonLd from '@/components/JsonLd'
import PageHero from '@/components/PageHero'
import { getSiteSettings, phoneHref } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Krok po kroku — Co zrobić po śmierci bliskiej osoby',
  description: 'Praktyczny poradnik — co zrobić po śmierci bliskiej osoby. Krok po kroku przez wszystkie formalności.',
  alternates: { canonical: '/krok-po-kroku' },
}

const steps = [
  {
    num: '01',
    title: 'Zawiadom lekarza lub służby',
    desc: 'W przypadku śmierci w domu należy wezwać lekarza, który stwierdzi zgon i wystawi kartę zgonu. Jeśli śmierć nastąpiła w szpitalu lub hospicjum — personel medyczny zajmie się tą formalnością.',
  },
  {
    num: '02',
    title: 'Skontaktuj się z domem pogrzebowym',
    desc: 'Zadzwoń do nas — jesteśmy dostępni 24 godziny na dobę. Zajmiemy się transportem i przechowaniem ciała oraz przeprowadzimy Cię przez kolejne kroki. Możemy przyjechać do Ciebie.',
  },
  {
    num: '03',
    title: 'Uzyskaj akt zgonu w Urzędzie Stanu Cywilnego',
    desc: 'Akt zgonu należy zgłosić w USC właściwym dla miejsca zgonu, w ciągu 3 dni od wystawienia karty zgonu. Potrzebne będą: karta zgonu, dowód osobisty zmarłego i Twój dowód osobisty.',
  },
  {
    num: '04',
    title: 'Ustal miejsce i termin pogrzebu',
    desc: 'Wspólnie z naszym pracownikiem ustalimy miejsce i termin ceremonii, wybierzemy trumnę lub urnę, oprawę muzyczną i inne szczegóły. Zadbamy o rezerwację miejsca na cmentarzu.',
  },
  {
    num: '05',
    title: 'Formalności w zakładzie pracy i ZUS',
    desc: 'Poinformuj pracodawcę o śmierci pracownika lub pracownika uprawnionego do świadczeń. Złóż wniosek o zasiłek pogrzebowy w ZUS lub KRUS (w ciągu 12 miesięcy od daty zgonu).',
  },
  {
    num: '06',
    title: 'Pożegnanie i ceremonia pogrzebowa',
    desc: 'Nasz zespół zatroszczy się o każdy szczegół ceremonii — od sali pożegnań, przez oprawę muzyczną, aż po transport na cmentarz. Towarzyszymy rodzinie przez cały czas.',
  },
  {
    num: '07',
    title: 'Formalności pośmiertne',
    desc: 'Po pogrzebie konieczne może być załatwienie spraw spadkowych, zamknięcie rachunków bankowych, powiadomienie urzędów. Chętnie doradzimy, co i w jakiej kolejności należy zrobić.',
  },
]

const howToSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Co zrobić po śmierci bliskiej osoby',
  description: 'Praktyczny poradnik krok po kroku przez wszystkie formalności po śmierci bliskiej osoby.',
  step: steps.map((s) => ({
    '@type': 'HowToStep',
    position: parseInt(s.num, 10),
    name: s.title,
    text: s.desc,
  })),
})

export default async function KrokPoKrokuPage() {
  const settings = await getSiteSettings()
  const PHONE = settings.phone ?? '+48 000 000 000'
  const PHONE_HREF = phoneHref(PHONE)
  return (
    <>
      <JsonLd json={howToSchema} />
      <PageHero
        title="Krok po kroku"
        subtitle="Co zrobić po śmierci bliskiej osoby — praktyczny przewodnik przez wszystkie formalności."
        breadcrumb={[{ label: 'Krok po kroku' }]}
      />

      <div className="max-w-[var(--container)] mx-auto px-6 py-[var(--section-v)]">
        <div className="grid grid-cols-[minmax(0,1fr)_340px] max-[900px]:grid-cols-1 gap-20 max-[900px]:gap-12 items-start">

          {/* Steps */}
          <div className="flex flex-col">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`flex gap-8 max-[560px]:gap-5 py-10 max-[560px]:py-7 ${i < steps.length - 1 ? 'border-b border-[var(--color-border-subtle)]' : ''}`}
              >
                <span className="font-heading text-[2.5rem] max-[560px]:text-[1.75rem] font-light text-gold opacity-40 leading-none min-w-[52px] max-[560px]:min-w-[36px] text-center flex-shrink-0">
                  {step.num}
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
              <span className="section-label">Pamiętaj</span>
              <h3 className="font-heading text-[1.375rem] font-normal text-cream leading-[1.3] mb-3">
                Nie musisz przez to przechodzić sam
              </h3>
              <p className="text-[0.875rem] text-cream/70 leading-relaxed mb-5">
                Nasz pracownik przejmie na siebie wszelkie formalności i poprowadzi Cię krok po kroku. Jesteśmy dostępni 24h.
              </p>
              <a href={PHONE_HREF} className="block text-[1.125rem] font-semibold text-cream tracking-[0.03em] mb-4 hover:text-gold transition-colors">
                {PHONE}
              </a>
              <Link href="/kontakt" className="btn btn--outline inline-flex">Kontakt</Link>
            </div>

            <div className="bg-surface border border-[var(--color-border)] p-8 max-[560px]:p-7">
              <span className="section-label">Zasiłek pogrzebowy</span>
              <p className="text-[0.875rem] text-text-muted leading-relaxed mb-4">
                Pamiętaj, że możesz ubiegać się o zasiłek pogrzebowy z ZUS. Masz na to 12 miesięcy od daty zgonu.
              </p>
              <Link href="/zasilek-pogrzebowy" className="btn btn--outline-gold inline-flex">Dowiedz się więcej</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
