export interface Service {
  slug: string
  title: string
  shortDesc: string
  description: string[]
  features: string[]
}

export const services: Service[] = [
  {
    slug: 'sala-pozegnan',
    title: 'Sala pożegnań',
    shortDesc: 'Godne i spokojne miejsce ostatniego pożegnania bliskiej osoby.',
    description: [
      'Nasza sala pożegnań to przestrzeń stworzona z myślą o godnym, spokojnym i intymnym pożegnaniu bliskiej osoby. Zadbaliśmy o każdy detal wystroju, by rodzina mogła skoncentrować się na przeżywaniu tej wyjątkowej chwili.',
      'Sala wyposażona jest w klimatyzację, dyskretne oświetlenie oraz system nagłośnienia, który umożliwia odtworzenie muzyki zgodnej z życzeniem rodziny. Dysponujemy również osobnym pomieszczeniem dla dzieci i osób potrzebujących chwili wytchnienia.',
    ],
    features: [
      'Intymna atmosfera i stonowany wystrój',
      'Klimatyzacja i system nagłośnienia',
      'Możliwość dekoracji florystycznej',
      'Obsługa ze strony naszego personelu',
      'Dostępność 24 godziny na dobę',
    ],
  },
  {
    slug: 'pogrzeb-z-trumna',
    title: 'Pogrzeb z trumną',
    shortDesc: 'Kompleksowa organizacja tradycyjnego pochówku zgodnie z Twoimi życzeniami.',
    description: [
      'Oferujemy pełną organizację tradycyjnego pogrzebu z trumną. Zadbamy o każdy szczegół - od wyboru odpowiedniej trumny, przez załatwienie wszelkich formalności administracyjnych, aż po oprawę samej ceremonii pogrzebowej.',
      'Współpracujemy z cmentarzami na terenie całego regionu i pomagamy w wyborze miejsca pochówku. Nasz zespół jest do Twojej dyspozycji przez całą dobę, siedem dni w tygodniu.',
    ],
    features: [
      'Szeroki wybór trumien i urządzeń pogrzebowych',
      'Kompleksowe załatwienie formalności',
      'Transport zmarłego',
      'Koordynacja ceremonii na cmentarzu',
      'Pomoc w wyborze miejsca pochówku',
    ],
  },
  {
    slug: 'pogrzeb-z-urna',
    title: 'Pogrzeb z urną',
    shortDesc: 'Organizacja pogrzebu po kremacji - od wyboru urny po ceremonię.',
    description: [
      'Coraz więcej rodzin decyduje się na kremację jako formę pochówku. Oferujemy kompleksową obsługę pogrzebu po kremacji - pomoc w wyborze urny, organizację ceremonii pożegnalnej oraz wsparcie w wyborze ostatecznego miejsca złożenia prochów.',
      'Prochy mogą zostać złożone na cmentarzu, w kolumbarium, w prywatnej kaplicy lub - zgodnie z obowiązującymi przepisami - rozsypane w wyznaczonym miejscu.',
    ],
    features: [
      'Bogaty wybór urn w różnych materiałach i stylach',
      'Organizacja ceremonii kremacji',
      'Pomoc w wyborze kolumbarium lub grobu',
      'Wszystkie formalności administracyjne',
      'Transport urny',
    ],
  },
  {
    slug: 'mobilne-biuro',
    title: 'Mobilne biuro',
    shortDesc: 'Przyjeżdżamy do Ciebie - formalności bez wychodzenia z domu.',
    description: [
      'Rozumiemy, że w chwilach żałoby trudno jest opuścić dom i zajmować się formalnościami. Dlatego oferujemy usługę mobilnego biura - nasz doświadczony pracownik przyjedzie na wskazany przez Ciebie adres, by omówić wszystkie szczegóły organizacji pogrzebu.',
      'Przyjeżdżamy do domu rodziny, szpitala, hospicjum lub innego miejsca. Pomagamy w wypełnieniu dokumentów, wyjaśniamy wszelkie kwestie formalne i ustalamy szczegóły ceremonii w komfortowych warunkach.',
    ],
    features: [
      'Dojazd do wybranego miejsca',
      'Pomoc w wypełnieniu dokumentów',
      'Konsultacja wszystkich szczegółów organizacji',
      'Dostępność 7 dni w tygodniu',
      'Dyskrecja i pełen profesjonalizm',
    ],
  },
  {
    slug: 'kwiaty',
    title: 'Kwiaty',
    shortDesc: 'Eleganckie kompozycje kwiatowe i wieńce jako wyraz szacunku i pamięci.',
    description: [
      'Kwiaty są ważnym elementem ceremonii pogrzebowej - wyrazem szacunku, miłości i pamięci. Oferujemy szeroki wybór kompozycji kwiatowych, wieńców i wiązanek, starannie przygotowanych przez naszych florystów.',
      'Dobieramy kwiaty zgodnie z życzeniami rodziny i charakterem uroczystości. Dbamy o to, by każda kompozycja była elegancka, stonowana i odpowiednia do powagi chwili.',
    ],
    features: [
      'Wieńce żałobne i wiązanki',
      'Dekoracje sali pożegnań',
      'Kompozycje na grób',
      'Bukiety dla żałobników',
      'Realizacja indywidualnych zamówień',
    ],
  },
  {
    slug: 'oprawa-muzyczna',
    title: 'Oprawa muzyczna',
    shortDesc: 'Muzyka dopasowana do charakteru ceremonii i życzenia rodziny.',
    description: [
      'Muzyka jest nieodłącznym elementem ceremonii pogrzebowej. Pozwala wyrazić emocje tam, gdzie brakuje słów, i nadaje pożegnaniu wyjątkowy, osobisty charakter. Oferujemy kompleksową oprawę muzyczną dostosowaną do Twoich potrzeb.',
      'Współpracujemy z muzykami wykonującymi muzykę klasyczną, sakralną, a także inne gatunki - zgodnie z życzeniem rodziny i charakterem ceremonii. Możliwe jest również odtworzenie nagrań szczególnie ważnych dla zmarłego.',
    ],
    features: [
      'Muzyk na żywo (organista, skrzypce, kwartet)',
      'Odtwarzanie wybranych nagrań',
      'Oprawa sakralna i świecka',
      'Konsultacja repertuaru z rodziną',
      'Nagłośnienie sali pożegnań',
    ],
  },
  {
    slug: 'pogrzeby-dzieci-nienarodzonych',
    title: 'Pogrzeby dzieci nienarodzonych',
    shortDesc: 'Towarzyszymy rodzicom z troską i szacunkiem w tej najcięższej chwili.',
    description: [
      'Utrata dziecka nienarodzonego to jedna z najtrudniejszych sytuacji, z jakimi mierzą się rodzice. Towarzyszy jej ogromny ból, z którym wielu nie wie jak sobie poradzić. Oferujemy pełne wsparcie w organizacji ceremonii pożegnalnej dla dzieci nienarodzonych.',
      'Podchodzimy do każdej rodziny z najwyższą empatią i szacunkiem. Pomagamy w załatwieniu formalności, doborze miejsca pochówku oraz organizacji ceremonii zgodnej z życzeniami i wyznaniem rodziców.',
    ],
    features: [
      'Pełna obsługa formalna',
      'Dobór urny lub trumienki',
      'Organizacja ceremonii religijnej lub świeckiej',
      'Wsparcie psychologiczne - kontakt ze specjalistami',
      'Dyskrecja i najwyższy szacunek',
    ],
  },
  {
    slug: 'pogrzeby-swieckie',
    title: 'Pogrzeby świeckie',
    shortDesc: 'Godne pożegnanie bez elementów religijnych - skupione na człowieku.',
    description: [
      'Pogrzeb świecki to ceremonia skupiona na osobie i pamięci o niej - bez elementów religijnych, ale z pełną godnością i troską. Pomagamy stworzyć wyjątkowe, osobiste pożegnanie, które odzwierciedla wartości i historię życia zmarłego.',
      'Ceremonia może obejmować przemówienia, muzykę, prezentację zdjęć i wspomnień, a jej przebieg ustalamy wspólnie z rodziną. Naszym celem jest, by pożegnanie było autentyczne i zgodne z wolą bliskiej osoby.',
    ],
    features: [
      'Ceremonia bez elementów religijnych',
      'Indywidualny scenariusz uroczystości',
      'Możliwość wspomnień i przemówień',
      'Oprawa muzyczna według życzenia',
      'Wsparcie na każdym etapie organizacji',
    ],
  },
  {
    slug: 'pogrzeby-wyznaniowe',
    title: 'Pogrzeby wyznaniowe',
    shortDesc: 'Organizacja ceremonii zgodnie z tradycją i obrzędami danego wyznania.',
    description: [
      'Organizujemy pogrzeby zgodnie z obrzędami różnych wyznań - katolickich, prawosławnych, ewangelickich, greckokatolickich i innych. Współpracujemy z duchownymi poszczególnych wyznań, by ceremonia przebiegła w sposób właściwy dla danej tradycji.',
      'Znamy specyfikę różnych obrządków i dbamy o to, by każdy szczegół odpowiadał przyjętym zwyczajom i oczekiwaniom rodziny. Służymy pomocą i doradztwem na każdym etapie organizacji.',
    ],
    features: [
      'Katolickie, prawosławne, ewangelickie i inne wyznania',
      'Współpraca z duchownymi różnych konfesji',
      'Pełna znajomość obrządków pogrzebowych',
      'Organizacja ceremonii w kościele lub kaplicy',
      'Kompleksowe wsparcie formalne',
    ],
  },
  {
    slug: 'odziez-zalobna',
    title: 'Odzież żałobna',
    shortDesc: 'Staranny dobór odzieży żałobnej - elegancja odpowiednia do chwili.',
    description: [
      'Oferujemy starannie dobrany wybór odzieży żałobnej dla rodziny i osób bliskich. Każdy element naszej oferty jest elegancki, stonowany i odpowiedni do powagi ceremonii pogrzebowej.',
      'Pomagamy w doborze odpowiedniego stroju, biorąc pod uwagę charakter ceremonii, porę roku i indywidualne potrzeby. Dysponujemy szerokim asortymentem dla kobiet, mężczyzn i dzieci.',
    ],
    features: [
      'Odzież dla dorosłych i dzieci',
      'Czarne i stonowane stroje',
      'Akcesoria żałobne',
      'Doradztwo w doborze stroju',
      'Szeroki rozmiarówka',
    ],
  },
  {
    slug: 'ekshumacje',
    title: 'Ekshumacje',
    shortDesc: 'Profesjonalna realizacja ekshumacji zgodnie z przepisami prawa.',
    description: [
      'Przeprowadzamy ekshumacje zgodnie z obowiązującymi przepisami prawa. Zajmujemy się kompleksowo całą procedurą - od uzyskania niezbędnych zezwoleń, przez organizację techniczną, aż po ponowny pochówek.',
      'Ekshumacja może być konieczna z różnych powodów - przeniesienia szczątków do innego miejsca, potrzeb rodziny lub wymogów prawnych. W każdym przypadku działamy z pełnym szacunkiem i dyskrecją.',
    ],
    features: [
      'Uzyskanie wszystkich wymaganych zezwoleń',
      'Organizacja techniczna ekshumacji',
      'Transport szczątków',
      'Ponowny pochówek w wybranym miejscu',
      'Pełna dokumentacja formalna',
    ],
  },
  {
    slug: 'sprowadzanie-zwlok-zza-granicy',
    title: 'Sprowadzanie zwłok zza granicy',
    shortDesc: 'Kompleksowa repatriacja - formalności konsularne i transport do kraju.',
    description: [
      'Śmierć bliskiej osoby za granicą wiąże się z koniecznością zmierzenia się z trudnymi formalnościami w obcym kraju, często w obcym języku. Oferujemy kompleksową pomoc w sprowadzeniu ciała do Polski.',
      'Zajmujemy się wszelkimi kwestiami formalnymi - kontaktem z konsulatem, uzyskaniem odpowiednich dokumentów, organizacją transportu i odprawą graniczną. Współpracujemy z firmami pogrzebowymi w wielu krajach europejskich i pozaeuropejskich.',
    ],
    features: [
      'Kontakt z konsulatem i władzami zagranicznymi',
      'Organizacja transportu lotniczego lub drogowego',
      'Uzyskanie Laissez-Passer (paszportu pośmiertnego)',
      'Współpraca z zagranicznymi domami pogrzebowymi',
      'Pomoc tłumaczeniowa i formalna',
    ],
  },
]

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}
