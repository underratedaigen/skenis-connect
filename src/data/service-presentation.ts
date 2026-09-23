/** Presentation only; the complete service capabilities remain in services.ts. */
export const servicePresentation: Record<
  string,
  {
    family: "visual" | "tools" | "process" | "physical";
    heading: string;
    before: string;
    after: string;
    exampleHeading: string;
    flows: string[][];
  }
> = {
  svetaines: {
    family: "visual",
    heading: "Ką klientas galės padaryti jūsų svetainėje",
    before: "Lankytojas neranda pasiūlymo, o telefone susisiekti nepatogu.",
    after:
      "Aiški paslaugų struktūra, įtikinami darbų pavyzdžiai ir trumpas kelias iki užklausos.",
    exampleHeading: "Trys keliai iki jūsų kliento",
    flows: [
      ["Paslauga", "Darbų pavyzdžiai", "Užklausa"],
      ["Reklama", "Konkretus pasiūlymas", "Pokalbis"],
      ["Turinio auditas", "Nauja struktūra", "Patogi svetainė"],
    ],
  },
  registracijos: {
    family: "tools",
    heading: "Nuo laisvo laiko iki patvirtinto vizito",
    before:
      "Laikai derinami žinutėmis, o rezervacijas tenka perrašyti į kalendorių.",
    after:
      "Klientas pasirenka tinkamą laiką. Komanda gauna vizito informaciją ir gali pasiruošti.",
    exampleHeading: "Registracija pagal jūsų darbo dieną",
    flows: [
      ["Paslauga", "Specialistas", "Laikas kalendoriuje"],
      ["Automobilis", "Gedimo aprašymas", "Priėmimo užduotis"],
      ["Garantijos numeris", "Atsakingas žmogus", "Užklausos būsena"],
    ],
  },
  "pardavimu-irankiai": {
    family: "tools",
    heading: "Visa užklausos eiga vienoje vietoje",
    before:
      "Kontaktai lieka žinutėse, o po pokalbio nėra aiškaus kito veiksmo.",
    after:
      "Kiekviena užklausa turi atsakingą žmogų, etapą ir sutartą tolesnio pokalbio datą.",
    exampleHeading: "Nuo kontakto iki sprendimo",
    flows: [
      ["Užklausa #024", "Atsakinga Lina", "Atsakyti 09.25"],
      ["Paslauga + kiekis", "Pasiūlymo juodraštis", "Žmogaus patikra"],
      ["Nauja užklausa", "Pasiūlymas", "Kliento sprendimas"],
    ],
  },
  skaiciuokles: {
    family: "tools",
    heading: "Jūsų skaičiavimo taisyklės – patogiame įrankyje",
    before:
      "Kainą skaičiuojate iš naujo, o skirtingose lentelėse gaunate nevienodus atsakymus.",
    after:
      "Sutartos formulės, aiškios prielaidos ir rezultatas, kurį galima perduoti su užklausa.",
    exampleHeading: "Vienos taisyklės, skirtingi skaičiavimai",
    flows: [
      ["60 m²", "15 € / m²", "Preliminariai 900 €"],
      ["Darbų kiekiai", "Sutarti įkainiai", "Sąmatos juodraštis"],
      ["Pradiniai duomenys", "A ir B prielaidos", "Rezultatų palyginimas"],
    ],
  },
  "verslo-sistemos": {
    family: "tools",
    heading: "Darbai, žmonės ir dokumentai bendrame vaizde",
    before:
      "Vienas procesas gyvena keliose lentelėse. Komanda ieško naujausios informacijos.",
    after:
      "Bendra darbo erdvė su aiškiomis atsakomybėmis, terminais ir prieigos teisėmis.",
    exampleHeading: "Erdvė klientui ir jūsų komandai",
    flows: [
      ["Kliento prieiga", "Sutarti darbai", "Dokumentai + būsena"],
      ["Užsakymas", "Gamybos terminas", "Pristatymas"],
      ["Darbuotojo vaidmuo", "Grafikas + prašymai", "Vadovo patvirtinimas"],
    ],
  },
  automatizacijos: {
    family: "process",
    heading: "Kokius veiksmus galima sujungti",
    before:
      "Tą patį vardą, kiekį ir kainą perrašote iš formos į lentelę, CRM ir dokumentą.",
    after:
      "Duomenys perduodami pagal taisykles. Išimtys pažymimos, o svarbūs žingsniai lieka žmogaus patikrai.",
    exampleHeading: "Įvestis, veiksmas, apčiuopiamas rezultatas",
    flows: [
      ["Forma: 80 m²", "CRM: kontaktas #024", "Linos užduotis"],
      ["Savaitės įrašai", "Suvesti rodikliai", "Ataskaita komandai"],
      ["Patikrinti duomenys", "Sutarties šablonas", "Juodraštis patikrai"],
    ],
  },
  "ai-sprendimai": {
    family: "process",
    heading: "Atsakymas su nuoroda į jūsų informaciją",
    before:
      "Tie patys klausimai kartojasi, o atsakymų tenka ieškoti ilguose dokumentuose.",
    after:
      "Asistentas remiasi sutartais šaltiniais, parodo atsakymo pagrindą ir prireikus perduoda klausimą žmogui.",
    exampleHeading: "Konkreti užduotis, aiškios asistento ribos",
    flows: [
      ["Kliento klausimas", "Paslaugų aprašas", "Atsakymas + šaltinis"],
      ["Poreikis", "Katalogo savybės", "Tinkamų prekių palyginimas"],
      ["Darbuotojo klausimas", "Leistini dokumentai", "Instrukcijos ištrauka"],
    ],
  },
  "e-komercija": {
    family: "visual",
    heading: "Patogus pasirinkimas. Aiškus pirkimo kelias.",
    before:
      "Reikiamą produktą sunku rasti, o užsakymo duomenis komanda perkelia rankomis.",
    after:
      "Aiškus katalogas, tinkami variantai ir užsakymas, sujungtas su jūsų darbo eiga.",
    exampleHeading: "Prekyba pagal jūsų verslo modelį",
    flows: [
      ["Kategorija", "Dydis + kaina", "Krepšelio santrauka"],
      ["Partnerio prieiga", "Sutartos kainos", "Užsakymas komandai"],
      ["Mokymų pasirinkimas", "Apmokėjimas", "Prieiga prie pamokų"],
    ],
  },
  atsiliepimai: {
    family: "physical",
    heading: "Fizinis prisilietimas, skaitmeninis tęsinys",
    before:
      "Po geros patirties klientui dar reikia surasti įmonę ir atsiliepimo nuorodą.",
    after:
      "NFC, QR arba nuoroda po vizito nuveda tiesiai į tinkamą atsiliepimų puslapį.",
    exampleHeading: "Vienas ryšys – skirtingos aptarnavimo vietos",
    flows: [
      ["Kortelė prie kasos", "NFC arba QR", "Google atsiliepimas"],
      ["Baigtas vizitas", "Neutralus kvietimas", "Kliento patirtis"],
      ["Filialo kodas", "Tinkamas profilis", "Skenavimų suvestinė"],
    ],
  },
};

export const catalogGroups = [
  {
    id: "klientai",
    title: "Pritraukti klientus",
    description: "Aiškiai prisistatyti, gauti užklausą ir parduoti.",
    slugs: ["svetaines", "pardavimu-irankiai", "e-komercija"],
  },
  {
    id: "darbas",
    title: "Supaprastinti darbą",
    description: "Sutvarkyti laiką, skaičiavimus ir komandos kasdienybę.",
    slugs: ["registracijos", "skaiciuokles", "verslo-sistemos"],
  },
  {
    id: "jungtys",
    title: "Sujungti ir automatizuoti",
    description: "Perduoti informaciją ten, kur jos reikia.",
    slugs: ["automatizacijos", "ai-sprendimai", "atsiliepimai"],
  },
];
