import type { Metadata } from 'next'
import Link from 'next/link'

import JsonLd from '@/components/JsonLd'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Krok po kroku — Co zrobić po śmierci bliskiej osoby',
  description: 'Praktyczny poradnik — co zrobić po śmierci bliskiej osoby. Krok po kroku przez wszystkie formalności.',
  alternates: { canonical: '/krok-po-kroku' },
}

const PHONE_HREF = 'tel:+48000000000'
const PHONE = '+48 000 000 000'

const steps = [
  {
    num: '01',
    title: 'Zawiadom lekarza lub sluzby',
    desc: 'W przypadku smierci w domu nalezy wezwac lekarza, który stwierdzi zgon i wystawi karte zgonu. Jesli smierc nastapila w szpitalu lub hospicjum - personel medyczny zajmie sie ta formalnoscią.',
  },
  {
    num: '02',
    title: 'Skontaktuj sie z domem pogrzebowym',
    desc: 'Zadzwon do nas - jestesmy dostepni 24 godziny na dobe. Zajmiemy sie transportem i przechowaniem ciala oraz przeprowadzimy Cie przez kolejne kroki. Mozemy przyjechac do Ciebie.',
  },
  {
    num: '03',
    title: 'Uzyskaj akt zgonu w Urzedzie Stanu Cywilnego',
    desc: 'Akt zgonu nalezy zglosic w USC wlasciwym dla miejsca zgonu, w ciagu 3 dni od wystawienia karty zgonu. Potrzebne beda: karta zgonu, dowód osobisty zmarlego i Twój dowód osobisty.',
  },
  {
    num: '04',
    title: 'Ustal miejsce i termin pogrzebu',
    desc: 'Wspólnie z naszym pracownikiem ustalimy miejsce i termin ceremonii, wybierzemy trumne lub urne, oprawe muzyczna i inne szczególy. Zadbamy o rezerwacje miejsca na cmentarzu.',
  },
  {
    num: '05',
    title: 'Formalnosci w zakladzie pracy i ZUS',
    desc: 'Poinformuj pracodawce o smierci pracownika lub pracownika uprawnionego do swiadczen. Zlóz wniosek o zasilek pogrzebowy w ZUS lub KRUS (w ciagu 12 miesiecy od daty zgonu).',
  },
  {
    num: '06',
    title: 'Pozegnanie i ceremonia pogrzebowa',
    desc: 'Nasz zespol zatrosczy sie o kazdy szczegól ceremonii - od sali pozegnan, przez oprawe muzyczna, az po transport na cmentarz. Towarzyszymy rodzinie przez caly czas.',
  },
  {
    num: '07',
    title: 'Formalnosci posmiertne',
    desc: 'Po pogrzebie konieczne moze byc zalatwienie spraw spadkowych, zamkniecie rachunków bankowych, powiadomienie urzedów. Chetnie doradzimy, co i w jakiej kolejnosci nalezy zrobic.',
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

export default function KrokPoKrokuPage() {
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
              <span className="section-label">Pamietaj</span>
              <h3 className="font-heading text-[1.375rem] font-normal text-cream leading-[1.3] mb-3">
                Nie musisz przez to przechodzic sam
              </h3>
              <p className="text-[0.875rem] text-cream/70 leading-relaxed mb-5">
                Nasz pracownik przejmie na siebie wszelkie formalnosci i poprowadzi Cie krok po kroku. Jestesmy dostepni 24h.
              </p>
              <a href={PHONE_HREF} className="block text-[1.125rem] font-semibold text-cream tracking-[0.03em] mb-4 hover:text-gold transition-colors">
                {PHONE}
              </a>
              <Link href="/kontakt" className="btn btn--outline inline-flex">Kontakt</Link>
            </div>

            <div className="bg-surface border border-[var(--color-border)] p-8 max-[560px]:p-7">
              <span className="section-label">Zasilek pogrzebowy</span>
              <p className="text-[0.875rem] text-text-muted leading-relaxed mb-4">
                Pamietaj, ze mozesz ubiegac sie o zasilek pogrzebowy z ZUS. Masz na to 12 miesiecy od daty zgonu.
              </p>
              <Link href="/zasilek-pogrzebowy" className="btn btn--outline-gold inline-flex">Dowiedz sie wiecej</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
