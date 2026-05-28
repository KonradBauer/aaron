import type { Metadata } from 'next'

import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Skontaktuj sie z domem pogrzebowym Aaron. Dwie lokalizacje, dostepni 24 godziny na dobe.',
}

const PHONE = '+48 000 000 000'
const PHONE_HREF = 'tel:+48000000000'

const locations = [
  {
    id: 1,
    label: 'Lokalizacja 1',
    name: 'Aaron - Oddzial Glówny',
    address: 'ul. Przykladowa 1\n00-000 Miasto',
    phone: PHONE,
    phoneHref: PHONE_HREF,
    hours: 'Dostepni 24h / 7 dni w tygodniu',
  },
  {
    id: 2,
    label: 'Lokalizacja 2',
    name: 'Aaron - Oddzial Drugi',
    address: 'ul. Przykladowa 2\n00-000 Miasto',
    phone: PHONE,
    phoneHref: PHONE_HREF,
    hours: 'Dostepni 24h / 7 dni w tygodniu',
  },
]

const detailLabelCls = 'text-[0.75rem] font-medium tracking-[0.1em] uppercase text-text-muted min-w-[80px] pt-[1px]'
const detailValueCls = 'text-[0.9375rem] text-text leading-[1.5]'
const inputCls = 'bg-black border border-[var(--color-border-subtle)] text-text px-4 py-3 font-body text-[0.9375rem] w-full transition-colors duration-[250ms] outline-none focus:border-gold'

export default function KontaktPage() {
  return (
    <>
      <PageHero
        title="Kontakt"
        subtitle="Jestesmy dostepni dla Ciebie 24 godziny na dobe. Skontaktuj sie z nami lub odwiedz jeden z naszych oddzialów."
        breadcrumb={[{ label: 'Kontakt' }]}
      />

      <div className="max-w-[var(--container)] mx-auto px-6 py-[var(--section-v)]">

        {/* Locations */}
        <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-8 mb-[var(--section-v)]">
          {locations.map((loc) => (
            <div key={loc.id} className="bg-surface border border-[var(--color-border-subtle)] p-10 max-[560px]:p-7 flex flex-col gap-6">
              <div className="flex flex-col gap-[6px]">
                <span className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-gold">{loc.label}</span>
                <h2 className="font-heading text-[1.5rem] font-normal text-cream tracking-[0.02em]">{loc.name}</h2>
              </div>
              <div className="flex flex-col gap-[14px]">
                <div className="flex gap-4">
                  <span className={detailLabelCls}>Adres</span>
                  <span className={detailValueCls} style={{ whiteSpace: 'pre-line' }}>{loc.address}</span>
                </div>
                <div className="flex gap-4">
                  <span className={detailLabelCls}>Telefon</span>
                  <a href={loc.phoneHref} className="text-[0.9375rem] text-text hover:text-gold transition-colors">{loc.phone}</a>
                </div>
                <div className="flex gap-4">
                  <span className={detailLabelCls}>Godziny</span>
                  <span className={detailValueCls}>{loc.hours}</span>
                </div>
              </div>
              <div className="bg-green aspect-[16/7] flex items-center justify-center text-cream/40 text-[0.75rem] tracking-[0.15em] uppercase">
                Mapa Google - placeholder
              </div>
            </div>
          ))}
        </div>

        {/* Contact bottom */}
        <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-16 max-[900px]:gap-12 items-start pt-[var(--section-v-sm)] border-t border-[var(--color-border-subtle)]">
          <div className="flex flex-col gap-6">
            <h2 className="font-heading font-normal text-cream tracking-[0.02em] leading-[1.2] text-[2rem]">
              Potrzebujesz pomocy?<br />
              <span className="text-gold">Zadzwon do nas.</span>
            </h2>
            <p className="text-[0.9375rem] text-text-muted leading-[1.7]">
              Rozumiemy, ze czas ma ogromne znaczenie. Nasz zespol jest do Twojej dyspozycji
              przez cala dobe - zadzwon, a przyjdziemy z pomoca.
            </p>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-gold">Telefon 24h</span>
                <a href={PHONE_HREF} className="text-[1rem] text-text hover:text-gold transition-colors">{PHONE}</a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-gold">Dostepnosc</span>
                <span className="text-[1rem] text-text">7 dni w tygodniu, cala dobe</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-gold">Mobilne biuro</span>
                <span className="text-[1rem] text-text">Przyjeżdżamy do Ciebie - do domu, szpitala lub hospicjum</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-[var(--color-border-subtle)] p-10 max-[560px]:p-7 flex flex-col gap-5">
            <h3 className="font-heading text-[1.5rem] font-normal text-cream tracking-[0.02em]">Napisz do nas</h3>
            <div className="flex flex-col gap-[6px]">
              <label className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-text-muted" htmlFor="name">Imie i nazwisko</label>
              <input id="name" type="text" className={inputCls} placeholder="Jan Kowalski" />
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-text-muted" htmlFor="phone">Telefon</label>
              <input id="phone" type="tel" className={inputCls} placeholder="+48 000 000 000" />
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-text-muted" htmlFor="message">Wiadomosc</label>
              <textarea id="message" className={`${inputCls} min-h-[120px] resize-y`} placeholder="Jak mozemy Ci pomóc?" />
            </div>
            <p className="text-[0.75rem] text-text-muted leading-[1.5]">
              Oddzwonimy tak szybko jak to mozliwe. W pilnych sprawach prosimy o kontakt telefoniczny.
            </p>
            <button type="submit" className="btn btn--gold">Wyslij wiadomosc</button>
          </div>
        </div>
      </div>
    </>
  )
}
