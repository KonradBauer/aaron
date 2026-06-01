import type { Metadata } from 'next'

import PageHero from '@/components/PageHero'

export const dynamic = 'force-dynamic'
import { getSiteSettings, mapEmbedUrl, phoneHref } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Skontaktuj się z domem pogrzebowym Aaron. Dwie lokalizacje, dostępni 24 godziny na dobę.',
  alternates: { canonical: '/kontakt' },
}

const detailLabelCls = 'text-[0.75rem] font-medium tracking-[0.1em] uppercase text-text-muted min-w-[80px] pt-[1px]'
const detailValueCls = 'text-[0.9375rem] text-text leading-[1.5]'
const inputCls = 'bg-black border border-[var(--color-border-subtle)] text-text px-4 py-3 font-body text-[0.9375rem] w-full transition-colors duration-[250ms] outline-none focus:border-gold'

export default async function KontaktPage() {
  const settings = await getSiteSettings()
  const phone = settings.phone ?? '+48 000 000 000'
  const PHONE_HREF = phoneHref(phone)
  const locations = settings.locations ?? []

  return (
    <>
      <PageHero
        title="Kontakt"
        subtitle="Jesteśmy dostępni dla Ciebie 24 godziny na dobę. Skontaktuj się z nami lub odwiedź jeden z naszych oddziałów."
        breadcrumb={[{ label: 'Kontakt' }]}
      />

      <div className="max-w-[var(--container)] mx-auto px-6 py-[var(--section-v)]">

        {/* Locations */}
        <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-8 mb-[var(--section-v)]">
          {locations.map((loc) => {
            const embedUrl = mapEmbedUrl(loc)
            const locPhone = loc.phone || phone
            const locPhoneHref = phoneHref(locPhone)

            return (
              <div key={loc.id ?? loc.label} className="bg-surface border border-[var(--color-border-subtle)] p-10 max-[560px]:p-7 flex flex-col gap-6">
                <div className="flex flex-col gap-[6px]">
                  <span className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-gold">{loc.label}</span>
                  <h2 className="font-heading text-[1.5rem] font-normal text-cream tracking-[0.02em]">{loc.name}</h2>
                </div>
                <div className="flex flex-col gap-[14px]">
                  <div className="flex gap-4">
                    <span className={detailLabelCls}>Adres</span>
                    <span className={detailValueCls}>
                      {loc.street}<br />
                      {loc.postalCode} {loc.city}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <span className={detailLabelCls}>Telefon</span>
                    <a href={locPhoneHref} className="text-[0.9375rem] text-text hover:text-gold transition-colors">{locPhone}</a>
                  </div>
                  {loc.hours && (
                    <div className="flex gap-4">
                      <span className={detailLabelCls}>Godziny</span>
                      <span className={detailValueCls}>{loc.hours}</span>
                    </div>
                  )}
                </div>

                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={`Mapa — ${loc.name}`}
                    className="w-full aspect-[16/7] border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="bg-green aspect-[16/7] flex items-center justify-center text-cream/40 text-[0.75rem] tracking-[0.15em] uppercase">
                    Mapa — uzupełnij adres oddziału w panelu CMS
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Contact bottom */}
        <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-16 max-[900px]:gap-12 items-start pt-[var(--section-v-sm)] border-t border-[var(--color-border-subtle)]">
          <div className="flex flex-col gap-6">
            <h2 className="font-heading font-normal text-cream tracking-[0.02em] leading-[1.2] text-[2rem]">
              Potrzebujesz pomocy?<br />
              <span className="text-gold">Zadzwoń do nas.</span>
            </h2>
            <p className="text-[0.9375rem] text-text-muted leading-[1.7]">
              Rozumiemy, że czas ma ogromne znaczenie. Nasz zespół jest do Twojej dyspozycji
              przez całą dobę — zadzwoń, a przyjdziemy z pomocą.
            </p>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-gold">Telefon 24h</span>
                <a href={PHONE_HREF} className="text-[1rem] text-text hover:text-gold transition-colors">{phone}</a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-gold">Dostępność</span>
                <span className="text-[1rem] text-text">7 dni w tygodniu, całą dobę</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[0.6875rem] font-semibold tracking-[0.2em] uppercase text-gold">Mobilne biuro</span>
                <span className="text-[1rem] text-text">Przyjeżdżamy do Ciebie — do domu, szpitala lub hospicjum</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-[var(--color-border-subtle)] p-10 max-[560px]:p-7 flex flex-col gap-5">
            <h3 className="font-heading text-[1.5rem] font-normal text-cream tracking-[0.02em]">Napisz do nas</h3>
            <div className="flex flex-col gap-[6px]">
              <label className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-text-muted" htmlFor="name">Imię i nazwisko</label>
              <input id="name" type="text" className={inputCls} placeholder="Jan Kowalski" />
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-text-muted" htmlFor="contact-phone">Telefon</label>
              <input id="contact-phone" type="tel" className={inputCls} placeholder="+48 000 000 000" />
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-text-muted" htmlFor="message">Wiadomość</label>
              <textarea id="message" className={`${inputCls} min-h-[120px] resize-y`} placeholder="Jak możemy Ci pomóc?" />
            </div>
            <p className="text-[0.75rem] text-text-muted leading-[1.5]">
              Oddzwonimy tak szybko jak to możliwe. W pilnych sprawach prosimy o kontakt telefoniczny.
            </p>
            <button type="submit" className="btn btn--gold">Wyślij wiadomość</button>
          </div>
        </div>
      </div>
    </>
  )
}
