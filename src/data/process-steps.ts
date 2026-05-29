export interface ProcessStep {
  title: string
  desc: string
}

export const processSteps: ProcessStep[] = [
  {
    title: 'Zawiadom lekarza lub służby',
    desc: 'W przypadku śmierci w domu należy wezwać lekarza, który stwierdzi zgon i wystawi kartę zgonu. Jeśli śmierć nastąpiła w szpitalu lub hospicjum — personel medyczny zajmie się tą formalnością.',
  },
  {
    title: 'Skontaktuj się z domem pogrzebowym',
    desc: 'Zadzwoń do nas — jesteśmy dostępni 24 godziny na dobę. Zajmiemy się transportem i przechowaniem ciała oraz przeprowadzimy Cię przez kolejne kroki. Możemy przyjechać do Ciebie.',
  },
  {
    title: 'Uzyskaj akt zgonu w Urzędzie Stanu Cywilnego',
    desc: 'Akt zgonu należy zgłosić w USC właściwym dla miejsca zgonu, w ciągu 3 dni od wystawienia karty zgonu. Potrzebne będą: karta zgonu, dowód osobisty zmarłego i Twój dowód osobisty.',
  },
  {
    title: 'Ustal miejsce i termin pogrzebu',
    desc: 'Wspólnie z naszym pracownikiem ustalimy miejsce i termin ceremonii, wybierzemy trumnę lub urnę, oprawę muzyczną i inne szczegóły. Zadbamy o rezerwację miejsca na cmentarzu.',
  },
  {
    title: 'Formalności w zakładzie pracy i ZUS',
    desc: 'Poinformuj pracodawcę o śmierci pracownika lub pracownika uprawnionego do świadczeń. Złóż wniosek o zasiłek pogrzebowy w ZUS lub KRUS (w ciągu 12 miesięcy od daty zgonu).',
  },
  {
    title: 'Pożegnanie i ceremonia pogrzebowa',
    desc: 'Nasz zespół zatroszczy się o każdy szczegół ceremonii — od sali pożegnań, przez oprawę muzyczną, aż po transport na cmentarz. Towarzyszymy rodzinie przez cały czas.',
  },
  {
    title: 'Formalności pośmiertne',
    desc: 'Po pogrzebie konieczne może być załatwienie spraw spadkowych, zamknięcie rachunków bankowych, powiadomienie urzędów. Chętnie doradzimy, co i w jakiej kolejności należy zrobić.',
  },
]

export const processSidebarDefault = {
  reminderLabel: 'Pamiętaj',
  reminderHeading: 'Nie musisz przez to przechodzić sam',
  reminderText:
    'Nasz pracownik przejmie na siebie wszelkie formalności i poprowadzi Cię krok po kroku. Jesteśmy dostępni 24h.',
  zasilekLabel: 'Zasiłek pogrzebowy',
  zasilekText:
    'Pamiętaj, że możesz ubiegać się o zasiłek pogrzebowy z ZUS. Masz na to 12 miesięcy od daty zgonu.',
}
