import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const HomePage: GlobalConfig = {
  slug: 'strona-glowna',
  label: 'Strona główna',
  admin: {
    group: 'Treści',
  },
  hooks: {
    // Strony frontu są statycznie prerenderowane w build (direct DB call, nie fetch),
    // więc bez tego zmiany w CMS nie pojawiają się w prod do następnego rebuildu.
    afterChange: [
      ({ req }) => {
        try {
          revalidatePath('/', 'layout')
        } catch (err) {
          req.payload.logger.error({ err }, 'revalidatePath failed after HomePage change')
        }
      },
    ],
  },
  fields: [
    {
      type: 'group',
      name: 'hero',
      label: 'Sekcja główna (hero)',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Etykieta nad tytułem',
          defaultValue: 'Dom Pogrzebowy',
        },
        {
          name: 'titleLine1',
          type: 'text',
          label: 'Tytuł — pierwsza linia',
          defaultValue: 'Aaron',
        },
        {
          name: 'titleLine2',
          type: 'text',
          label: 'Tytuł — druga linia (pogrubiona)',
          defaultValue: 'Z godnością i troską.',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Podtytuł',
          defaultValue:
            'Towarzyszymy rodzinom w najtrudniejszych chwilach - profesjonalnie, dyskretnie i z najwyższą troską.',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Zdjęcie tła',
          admin: {
            description: 'Duże zdjęcie w tle sekcji głównej. Puste = zostaje zdjęcie domyślne.',
          },
        },
        {
          name: 'ctaPrimaryLabel',
          type: 'text',
          label: 'Przycisk główny (telefon)',
          defaultValue: 'Zadzwoń — dostępni 24h',
        },
        {
          name: 'ctaSecondaryLabel',
          type: 'text',
          label: 'Przycisk drugi',
          defaultValue: 'Nasze usługi',
        },
      ],
    },
    {
      type: 'group',
      name: 'about',
      label: 'Sekcja „O nas"',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Etykieta sekcji',
          defaultValue: 'O nas',
        },
        {
          name: 'heading',
          type: 'text',
          label: 'Nagłówek',
          defaultValue: 'Profesjonalizm i empatia w każdej chwili',
        },
        {
          name: 'paragraphs',
          type: 'array',
          label: 'Akapity',
          labels: { singular: 'Akapit', plural: 'Akapity' },
          defaultValue: [
            {
              text: 'Dom Pogrzebowy Aaron to firma z wieloletnią tradycją i doświadczeniem w organizacji ceremonii pogrzebowych. Naszym priorytetem jest godne i profesjonalne pożegnanie bliskiej osoby, przy jednoczesnym wsparciu rodziny na każdym etapie — od pierwszego kontaktu aż po ceremonię.',
            },
            {
              text: 'Rozumiemy, ze każde pożegnanie jest wyjątkowe. Dlatego do każdej rodziny podchodzimy indywidualnie, słuchając jej potrzeb i dostosowując każdy szczegół do oczekiwań i życzenia bliskich.',
            },
          ],
          fields: [{ name: 'text', type: 'textarea', label: 'Treść akapitu', required: true }],
        },
        {
          name: 'bullets',
          type: 'array',
          label: 'Lista punktów',
          labels: { singular: 'Punkt', plural: 'Punkty' },
          defaultValue: [
            { text: 'Dostępni 24 godziny na dobę, 7 dni w tygodniu' },
            { text: 'Dwie wygodne lokalizacje' },
            { text: 'Mobilne biuro - przyjeżdżamy do Ciebie' },
            { text: 'Pełna obsługa formalna' },
          ],
          fields: [{ name: 'text', type: 'text', label: 'Treść punktu', required: true }],
        },
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Przycisk',
          defaultValue: 'Skontaktuj się z nami',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Zdjęcie',
          admin: {
            description: 'Zdjęcie obok tekstu. Puste = zostaje zdjęcie domyślne.',
          },
        },
      ],
    },
    {
      type: 'group',
      name: 'servicesSection',
      label: 'Sekcja usług (nagłówek)',
      admin: {
        description: 'Same karty usług pochodzą z zakładki „Oferta (usługi)".',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Etykieta sekcji',
          defaultValue: 'Nasze usługi',
        },
        {
          name: 'heading',
          type: 'text',
          label: 'Nagłówek',
          defaultValue: 'Kompleksowa obsługa pogrzebowa',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Podtytuł',
          defaultValue:
            'Oferujemy pełen zakres usług pogrzebowych — zadbamy o każdy szczegół, byś mógł poświęcić czas rodzinie.',
        },
      ],
    },
    {
      type: 'group',
      name: 'cta',
      label: 'Sekcja kontaktowa (dół strony)',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Nagłówek',
          defaultValue: 'Jesteśmy dostępni dla Ciebie zawsze',
        },
        {
          name: 'text',
          type: 'textarea',
          label: 'Tekst',
          defaultValue: 'Telefon czynny 24 godziny na dobę, 7 dni w tygodniu. Przyjedziemy do Ciebie.',
        },
      ],
    },
  ],
}
