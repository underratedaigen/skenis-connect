import {
  Bot,
  Calculator,
  CalendarDays,
  Globe2,
  Layers3,
  MessageSquareText,
  ShoppingBag,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface ServiceCategory {
  slug: string;
  title: string;
  shortTitle: string;
  headline: string;
  description: string;
  outcome: string;
  problem: string;
  approach: string;
  icon: LucideIcon;
  primary: boolean;
  capabilities: string[];
  /** Corresponding capability numbers in the project brief, in the same order. */
  capabilityIds: number[];
  examples: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
}

export const services: ServiceCategory[] = [
  {
    slug: "svetaines",
    title: "Svetainių kūrimas ir atnaujinimas",
    shortTitle: "Svetainės",
    headline: "Aiški svetainė. Lengvesnis kelias iki kliento.",
    description:
      "Kuriame greitas, patogias verslo svetaines, kuriose lankytojas supranta jūsų pasiūlymą ir žino, ką daryti toliau.",
    outcome: "Jūsų paslaugos suprantamos, o susisiekti paprasta.",
    problem:
      "Svetainė pasenusi, telefone ja nepatogu naudotis arba lankytojui sunku suprasti, kuo galite padėti. Kartais pakanka sutvarkyti kelias svarbias vietas, o kartais reikia naujos pradžios.",
    approach:
      "Pirmiausia išsiaiškiname, ką lankytojas turi suprasti ir atlikti. Pagal tai kuriame struktūrą, turinį ir dizainą, sutvarkome greitį bei techninius paieškos pagrindus.",
    icon: Globe2,
    primary: true,
    capabilities: [
      "Naujos verslo svetainės",
      "Esamų svetainių atnaujinimas",
      "Reklamos kampanijų ir paslaugų puslapiai",
      "Pritaikymas telefonams ir planšetėms",
      "Svetainės greičio optimizavimas",
      "Filialų puslapiai ir Google Maps integracijos",
      "Daugiakalbės svetainės",
      "Techninis SEO",
      "Duomenimis pagrįsti SEO puslapiai",
      "Struktūriniai duomenys paieškos sistemoms",
      "Svetainės prieinamumo gerinimas",
      "Svetainių klaidų taisymas",
      "Svetainių ir sistemų priežiūra",
    ],
    capabilityIds: [1, 2, 3, 4, 5, 59, 60, 61, 62, 63, 64, 65, 75],
    examples: [
      {
        title: "Paslaugų įmonės svetainė",
        description:
          "Paslaugos, atliktų darbų pavyzdžiai ir trumpa užklausos forma, kurią patogu užpildyti ir telefonu.",
      },
      {
        title: "Vienos paslaugos puslapis",
        description:
          "Aiškus pasiūlymas reklamos lankytojui: kam paslauga skirta, kaip ji veikia ir kur kreiptis.",
      },
      {
        title: "Esamos svetainės atnaujinimas",
        description:
          "Išsaugome vertingą turinį ir veikiančias integracijas, sutvarkome struktūrą, dizainą bei technines kliūtis.",
      },
    ],
    faq: [
      {
        question: "Ar būtina kurti viską iš naujo?",
        answer:
          "Ne. Peržiūrime esamą svetainę ir pasiūlome, ką verta išsaugoti. Jei tikslą galima pasiekti tikslingais pakeitimais, aptarsime tokį variantą.",
      },
      {
        question: "Ar padėsite su turiniu ir struktūra?",
        answer:
          "Taip. Kartu išgryniname paslaugas, lankytojui svarbius klausimus ir pagrindinį veiksmą. Tekstų, nuotraukų bei turinio parengimo apimtį sutariame prieš pradėdami.",
      },
      {
        question: "Kiek kainuoja svetainė?",
        answer:
          "Kaina priklauso nuo turinio apimties, funkcijų ir integracijų. Aptarę poreikį pateikiame individualų pasiūlymą su aiškia darbų apimtimi.",
      },
    ],
  },
  {
    slug: "registracijos",
    title: "Registracijos ir klientų aptarnavimas",
    shortTitle: "Registracijos",
    headline: "Klientas registruojasi. Jūs tęsiate darbą.",
    description:
      "Rezervacijos, priminimai ir klientų aptarnavimas vienoje aiškioje sistemoje. Mažiau skambučių dėl laiko, daugiau tvarkos kalendoriuje.",
    outcome: "Klientai randa laiką, o komanda mato visą dieną.",
    problem:
      "Registracijos ateina telefonu, žinutėmis ir el. paštu. Jas tenka perrašyti, tikrinti laisvus laikus bei atskirai priminti apie vizitą. Kuo daugiau klientų, tuo sunkiau viską sužiūrėti.",
    approach:
      "Pritaikome registracijos eigą jūsų paslaugoms, darbuotojams ir darbo laikui. Sujungiame kalendorių, patvirtinimus ir priminimus, o prireikus – kliento anketą ar aptarnavimo užklausas.",
    icon: CalendarDays,
    primary: true,
    capabilities: [
      "Internetinės rezervacijų sistemos",
      "Vizitų ir paslaugų registracija",
      "Naujų klientų priėmimo sistemos",
      "Automatiniai vizitų priminimai",
      "Vizitų patvirtinimas ir neatvykimų mažinimas",
      "Renginių registracijos sistemos",
      "Klientų aptarnavimo užklausų sistemos",
      "Garantinių darbų registravimas",
    ],
    capabilityIds: [6, 7, 28, 33, 34, 50, 73, 74],
    examples: [
      {
        title: "Salono registracija",
        description:
          "Klientas pasirenka paslaugą, specialistą ir laisvą laiką. Komanda rezervaciją mato bendrame kalendoriuje.",
      },
      {
        title: "Autoserviso priėmimas",
        description:
          "Registruojantis surenkama informacija apie automobilį ir gedimą, kad darbuotojas galėtų pasiruošti vizitui.",
      },
      {
        title: "Aptarnavimo užklausa",
        description:
          "Klientas pateikia garantinio darbo ar pagalbos užklausą ir mato jos būseną, o komanda paskiria atsakingą žmogų.",
      },
    ],
    faq: [
      {
        question: "Ar galima naudoti turimą kalendorių?",
        answer:
          "Dažnai taip. Pirmiausia patikriname naudojamo kalendoriaus ar registracijos sistemos integravimo galimybes ir tik tada parenkame sprendimą.",
      },
      {
        question: "Ar sistema tiks keliems darbuotojams ar vietoms?",
        answer:
          "Galime numatyti atskirus darbuotojų grafikus, paslaugų trukmę, pertraukas ir padalinius. Registracijos taisykles suderiname pagal jūsų darbo tvarką.",
      },
      {
        question: "Ar klientai gaus priminimus?",
        answer:
          "Galime pridėti el. pašto ar SMS priminimus bei galimybę patvirtinti arba atšaukti vizitą. Pranešimų kanalus ir galimus tiekėjų mokesčius aptariame iš anksto.",
      },
    ],
  },
  {
    slug: "pardavimu-irankiai",
    title: "Pardavimų ir užklausų įrankiai",
    shortTitle: "Pardavimų įrankiai",
    headline: "Nuo pirmos užklausos iki aiškaus pasiūlymo.",
    description:
      "Padedame surinkti reikalingą informaciją, laiku atsakyti ir matyti, kuriame etape yra kiekvienas potencialus klientas.",
    outcome: "Užklausos vienoje vietoje, kitas žingsnis aiškus.",
    problem:
      "Kontaktai išsibarstę, pasiūlymai ruošiami rankomis, o po pokalbio lengva pamiršti sugrįžti pas klientą. Pardavimui svarbi informacija lieka atskirose žinutėse.",
    approach:
      "Sukuriame nuoseklų kelią: užklausos surinkimas, priskyrimas, pasiūlymas ir priminimas. Pradedame nuo jūsų komandai reikalingų veiksmų, kad sistema būtų naudojama kasdien.",
    icon: Workflow,
    primary: true,
    capabilities: [
      "Užklausų ir pasiūlymų prašymo formos",
      "Potencialių klientų kontaktų surinkimas",
      "Mini CRM klientų kontaktams",
      "Pardavimų etapų valdymas",
      "Automatinis komercinių pasiūlymų rengimas",
      "PDF pasiūlymų generatoriai",
      "Tolesnio bendravimo el. paštu automatizavimas",
    ],
    capabilityIds: [8, 13, 14, 15, 24, 26, 32],
    examples: [
      {
        title: "Užklausų centras",
        description:
          "Svetainės užklausos patenka į bendrą sąrašą su atsakingu darbuotoju, būsena ir kitu sutartu veiksmu.",
      },
      {
        title: "Pasiūlymas iš formos",
        description:
          "Pagal kliento pasirinktą paslaugą ir duomenis paruošiamas pasiūlymo juodraštis, kurį darbuotojas patikrina ir išsiunčia.",
      },
      {
        title: "Pardavimų lenta",
        description:
          "Kontaktai suskirstyti į aiškius etapus: nauja užklausa, pokalbis, pateiktas pasiūlymas ir priimtas sprendimas.",
      },
    ],
    faq: [
      {
        question: "Ar reikia keisti jau naudojamą CRM?",
        answer:
          "Nebūtinai. Jei dabartinė sistema tinka, galime su ja sujungti svetainės formas, pasiūlymų ruošimą ar priminimus.",
      },
      {
        question: "Ar pasiūlymai bus išsiunčiami be patikrinimo?",
        answer:
          "Tai priklauso nuo sutarto proceso. Galime palikti žmogaus patvirtinimą, kad automatiškai būtų parengtas tik juodraštis.",
      },
      {
        question: "Ar tinka mažai komandai?",
        answer:
          "Taip. Galime pradėti nuo paprasto užklausų sąrašo ir kelių pardavimo etapų, o papildomas funkcijas pridėti tada, kai jų prireiks.",
      },
    ],
  },
  {
    slug: "skaiciuokles",
    title: "Skaičiuoklės ir individualūs įrankiai",
    shortTitle: "Skaičiuoklės",
    headline: "Mažiau skaičiavimo rankomis. Greitesnis atsakymas.",
    description:
      "Jūsų kainodarą ir skaičiavimo taisykles paverčiame patogiu įrankiu klientams arba komandai.",
    outcome: "Vienodos taisyklės, aiškūs duomenys, greitesni pasiūlymai.",
    problem:
      "Kiekvienam klientui atsakymą skaičiuojate iš naujo, naudojate kelias lenteles arba gaištate rinkdami trūkstamus duomenis. Skirtingi darbuotojai kartais gauna skirtingą rezultatą.",
    approach:
      "Kartu aprašome formules, prielaidas ir išimtis. Sukuriame aiškią įvestį, rezultatą bei paaiškinimą, o skaičiavimą patikriname pagal jūsų pateiktus pavyzdžius.",
    icon: Calculator,
    primary: true,
    capabilities: [
      "Automatinės kainų ir paslaugų skaičiuoklės",
      "Automobilių remonto kainos skaičiuoklės",
      "Saulės elektrinių skaičiuoklės",
      "NT paskolos, investicijų ir grąžos skaičiuoklės",
      "Automatinės sąmatos ir jų rengimo įrankiai",
    ],
    capabilityIds: [9, 10, 11, 12, 25],
    examples: [
      {
        title: "Preliminari paslaugos kaina",
        description:
          "Lankytojas pasirenka darbų apimtį, mato orientacinę kainą ir gali perduoti skaičiavimą kartu su užklausa.",
      },
      {
        title: "Statybos darbų sąmata",
        description:
          "Darbuotojas įveda plotus ir darbų kiekius, o įrankis pritaiko sutartus įkainius bei paruošia sąmatos juodraštį.",
      },
      {
        title: "Atsipirkimo scenarijai",
        description:
          "Klientas palygina kelis variantus pagal aiškiai nurodytas prielaidas ir supranta, kas keičia rezultatą.",
      },
    ],
    faq: [
      {
        question: "Ar galima panaudoti mūsų Excel skaičiavimus?",
        answer:
          "Taip. Esama lentelė gali tapti pagrindu. Peržiūrime jos logiką, patikriname išimtis ir perkeliame skaičiavimą į patogią sąsają.",
      },
      {
        question: "Ar skaičiuoklė turi rodyti galutinę kainą?",
        answer:
          "Ne. Galime rodyti preliminarią sumą, kainos intervalą arba perduoti rezultatą jūsų komandai patikslinti. Prielaidos ir rezultato paskirtis aiškiai nurodomi.",
      },
      {
        question: "Ar galėsime keisti įkainius?",
        answer:
          "Jei to reikia, numatome valdymo vietą įkainiams ir pagrindinėms taisyklėms. Taip kasdieniams kainų pakeitimams nereikės keisti programos kodo.",
      },
    ],
  },
  {
    slug: "verslo-sistemos",
    title: "Vidinės verslo sistemos",
    shortTitle: "Verslo sistemos",
    headline: "Jūsų procesai. Viena aiški sistema.",
    description:
      "Klientai, užsakymai, dokumentai ir darbai vienoje vietoje. Kuriame sistemas pagal tai, kaip iš tikrųjų dirba jūsų komanda.",
    outcome: "Komanda mato tą pačią informaciją ir žino, kas už ką atsakingas.",
    problem:
      "Vienas procesas gyvena penkiose lentelėse, el. pašte ir žinutėse. Informaciją tenka dubliuoti, ieškoti naujausios versijos ir klausti kolegų, kokia darbų būsena.",
    approach:
      "Sutvarkome informacijos kelią ir atsakomybes. Kuriame tik tas funkcijas, kurių reikia kasdieniam darbui, numatome prieigos teises ir, kai įmanoma, panaudojame jau veikiančias sistemas.",
    icon: Layers3,
    primary: true,
    capabilities: [
      "Klientų portalai",
      "Užsakymų sekimo portalai",
      "Darbų ir projektų būsenos portalai",
      "Sąskaitų ir finansų suvestinės",
      "Veiklos rodiklių (KPI) suvestinės",
      "Darbuotojų portalai",
      "Atostogų ir kitų prašymų sistemos",
      "Darbo grafikų valdymas",
      "Atsargų valdymas",
      "Užsakymų valdymo sistemos",
      "Atstovų ir partnerių portalai",
      "Senų sistemų modernizavimas",
      "Kainų ir konkurentų stebėjimo suvestinės",
      "Darbo skelbimų agregatoriai",
      "Kandidatų valdymo sistemos (mini ATS)",
      "Individualios CRM ir kitos verslo aplikacijos",
    ],
    capabilityIds: [
      16, 17, 18, 19, 20, 39, 40, 41, 42, 43, 54, 67, 69, 71, 72, 80,
    ],
    examples: [
      {
        title: "Kliento projekto erdvė",
        description:
          "Klientas prisijungęs randa dokumentus, sutartus darbus ir dabartinę projekto būseną vienoje vietoje.",
      },
      {
        title: "Užsakymo kelias",
        description:
          "Nuo užklausos iki pristatymo: atsakingi darbuotojai, terminai, reikalingi dokumentai ir aiškūs etapai.",
      },
      {
        title: "Komandos darbo erdvė",
        description:
          "Darbo grafikai, prašymai ir veiklos rodikliai, matomi pagal darbuotojo vaidmenį bei atsakomybę.",
      },
    ],
    faq: [
      {
        question: "Ar galima pradėti nuo vieno proceso?",
        answer:
          "Taip, dažnai tai geriausia pradžia. Pasirenkame svarbiausią problemą, patikriname sprendimą su komanda ir tik tada plečiame sistemą.",
      },
      {
        question: "Kaip perkeliami esami duomenys?",
        answer:
          "Prieš perkėlimą įvertiname jų formatą, kokybę ir apimtį. Sutariame, ką perkeliame, paruošiame atvaizdavimą ir patikriname rezultatą prieš paleidimą.",
      },
      {
        question: "Ar skirtingi darbuotojai matys skirtingą informaciją?",
        answer:
          "Galime numatyti vaidmenis ir prieigos teises. Kartu nustatome, kas gali matyti, kurti, redaguoti ar tvirtinti konkrečius duomenis.",
      },
    ],
  },
  {
    slug: "automatizacijos",
    title: "Automatizacijos ir integracijos",
    shortTitle: "Automatizacijos",
    headline: "Tai, kas kartojasi, gali vykti savaime.",
    description:
      "Sujungiame naudojamus įrankius ir automatizuojame pasikartojančius darbus, kad komandai nereikėtų perrašinėti tos pačios informacijos.",
    outcome: "Mažiau kopijavimo tarp sistemų. Daugiau laiko darbui.",
    problem:
      "Duomenys iš formos keliauja į lentelę, tada į CRM, tada į dokumentą. Kiekvienas žingsnis užima laiko, o praleista eilutė ar neteisingas skaičius sukelia papildomą darbą.",
    approach:
      "Atsekame pasikartojančią eigą ir sujungiame jos žingsnius. Numatome klaidų pranešimus, patikrinimus bei vietas, kur sprendimą turi patvirtinti žmogus.",
    icon: Zap,
    primary: true,
    capabilities: [
      "Google Sheets ir Excel procesų perkėlimas į internetines aplikacijas",
      "Excel procesų automatizavimas",
      "Duomenų ištraukimas iš PDF dokumentų",
      "Sutarčių ir dokumentų generatoriai",
      "Kontaktų formų integracijos su CRM",
      "API integracijos tarp naudojamų sistemų",
      "Automatinės ir periodinės verslo ataskaitos",
      "Viešų duomenų surinkimas, kai jis teisėtas ir leidžiamas",
    ],
    capabilityIds: [21, 22, 23, 27, 31, 66, 68, 70],
    examples: [
      {
        title: "Forma → CRM → užduotis",
        description:
          "Gavus užklausą sukuriamas kontaktas, priskiriamas atsakingas darbuotojas ir nustatomas priminimas atsakyti.",
      },
      {
        title: "Savaitės veiklos ataskaita",
        description:
          "Duomenys iš sutartų šaltinių surenkami pagal grafiką ir pateikiami komandai vienodu, aiškiu formatu.",
      },
      {
        title: "Dokumentas iš duomenų",
        description:
          "Pagal patikrintus kliento ir paslaugos duomenis parengiamas sutarties ar kito dokumento juodraštis.",
      },
    ],
    faq: [
      {
        question: "Ar galima sujungti mūsų naudojamas programas?",
        answer:
          "Patikriname jų API, duomenų eksportą ir kitas integravimo galimybes. Jei tiesioginio ryšio nėra, paaiškiname alternatyvas bei apribojimus.",
      },
      {
        question: "Kas nutiks, jei automatizacija sustos?",
        answer:
          "Svarbiems procesams numatome klaidų registravimą, pranešimus ir pakartotinio vykdymo tvarką. Stebėjimo bei priežiūros apimtį sutariame projekte.",
      },
      {
        question: "Nuo kurio darbo verta pradėti?",
        answer:
          "Nuo dažnai pasikartojančio veiksmo su aiškiomis taisyklėmis: duomenų kopijavimo, dokumento ruošimo ar ataskaitos. Kartu įvertiname jo dažnį, sugaištamą laiką ir išimtis.",
      },
    ],
  },
  {
    slug: "ai-sprendimai",
    title: "AI sprendimai verslui",
    shortTitle: "AI sprendimai",
    headline: "AI ten, kur jis iš tiesų taupo laiką.",
    description:
      "Praktiški asistentai, padedantys rasti informaciją, atsakyti į pasikartojančius klausimus ar paruošti darbo juodraštį.",
    outcome: "Reikalinga informacija pasiekiama greičiau.",
    problem:
      "Komanda nuolat atsako į tuos pačius klausimus arba ieško informacijos dokumentuose. Šiems darbams nereikia naujos strategijos, bet jie kasdien atima dėmesį.",
    approach:
      "Pasirenkame konkrečią užduotį ir patikimus informacijos šaltinius. Tikriname atsakymų kokybę, nustatome asistento ribas ir numatome perdavimą žmogui, kai atsakymo nepakanka.",
    icon: Bot,
    primary: true,
    capabilities: [
      "Svetainės dažniausių klausimų AI asistentai",
      "AI produktų konsultantai",
      "Potencialių klientų poreikio įvertinimo AI asistentai",
      "Vidiniai žinių ir dokumentų paieškos asistentai",
    ],
    capabilityIds: [35, 36, 37, 38],
    examples: [
      {
        title: "Atsakymai svetainėje",
        description:
          "Asistentas padeda rasti atsakymą jūsų paslaugų informacijoje, o sudėtingesnį klausimą perduoda komandai.",
      },
      {
        title: "Produkto pasirinkimas",
        description:
          "Klientas apibūdina poreikį, o asistentas padeda palyginti tinkamus katalogo produktus pagal jų tikras savybes.",
      },
      {
        title: "Vidinė informacijos paieška",
        description:
          "Darbuotojas užduoda klausimą ir gauna atsakymą pagal jam prieinamas instrukcijas bei dokumentus su nuorodomis į šaltinius.",
      },
    ],
    faq: [
      {
        question: "Ar mūsų procesui tikrai reikia AI?",
        answer:
          "Ne visada. Jei užduotį patikimiau atlieka paprasta paieška, forma ar automatizacija, siūlome ją. AI renkamės tada, kai jo nauda konkrečiam darbui aiški.",
      },
      {
        question: "Ar asistentas gali suklysti?",
        answer:
          "Taip. Todėl ribojame informacijos šaltinius, tikriname realius klausimus ir numatome situacijas, kur būtinas žmogaus patvirtinimas. Svarbių sprendimų nepaliekame vien nepatikrintam atsakymui.",
      },
      {
        question: "Kokie duomenys bus naudojami?",
        answer:
          "Prieš kuriant sutariame, kuriuos duomenis asistentas gali pasiekti, kam jie perduodami ir kaip valdomos prieigos. Pagal tai parenkame techninį sprendimą bei paslaugų tiekėją.",
      },
    ],
  },
  {
    slug: "e-komercija",
    title: "E. komercija ir klientų platformos",
    shortTitle: "E. komercija",
    headline: "Nuo produkto pasirinkimo iki užsakymo.",
    description:
      "E. parduotuvės, katalogai ir užsakymų platformos su aiškiu pirkimo keliu bei patogiu kasdieniu valdymu.",
    outcome: "Klientui patogu pirkti, komandai – tvarkyti užsakymus.",
    problem:
      "Klientai neranda reikiamo produkto, pirkimo eiga per ilga arba užsakymus tenka rankomis perkelti į kitas sistemas. Nauja parduotuvė nepadės, jei šios kliūtys liks.",
    approach:
      "Pradedame nuo katalogo, kliento pasirinkimo ir užsakymo eigos. Pagal jūsų prekybos modelį pritaikome mokėjimus, prieigas bei integracijas ir patikriname visą pirkimo kelią.",
    icon: ShoppingBag,
    primary: true,
    capabilities: [
      "QR meniu",
      "Restoranų internetinių užsakymų sistemos",
      "Lojalumo sistemos",
      "Dovanų kuponų sistemos",
      "Narystės sistemos ir narių erdvės",
      "Kursų ir mokymų portalai",
      "Nekilnojamojo turto katalogai",
      "Automobilių katalogai",
      "Produktų ir B2B katalogai",
      "Elektroninės parduotuvės",
      "Pirkimo ir atsiskaitymo eigos gerinimas",
      "Prenumeratos sistemos",
      "Internetinių mokėjimų integracijos",
    ],
    capabilityIds: [44, 45, 46, 47, 48, 49, 51, 52, 53, 55, 56, 57, 58],
    examples: [
      {
        title: "Specializuota e. parduotuvė",
        description:
          "Katalogas su verslui svarbiais filtrais, suprantami produktų puslapiai ir trumpas užsakymo pateikimas.",
      },
      {
        title: "B2B užsakymų erdvė",
        description:
          "Partneriai prisijungę mato jiems skirtą katalogą, kainas ir užsakymų informaciją.",
      },
      {
        title: "Mokymų platforma",
        description:
          "Vienoje vietoje įsigyjami mokymai, prieiga prie pamokų ir dalyviui reikalinga medžiaga.",
      },
    ],
    faq: [
      {
        question: "Ar galite patobulinti esamą parduotuvę?",
        answer:
          "Taip. Pirmiausia įvertiname jos platformą, pirkimo eigą ir integracijas. Tuomet siūlome konkrečius patobulinimus arba paaiškiname, kada verta svarstyti kitą sprendimą.",
      },
      {
        question: "Ar galima sujungti mokėjimus ir apskaitą?",
        answer:
          "Galime integruoti pasirinktus mokėjimo tiekėjus bei apskaitos ar atsargų sistemas, jei jos turi tinkamas integravimo galimybes. Tiekėjų sąlygas ir mokesčius aptariame atskirai.",
      },
      {
        question: "Ar galėsime patys valdyti katalogą?",
        answer:
          "Taip, pagal poreikį numatome produktų, kainų, turinio ir užsakymų valdymą. Prieš perduodami sprendimą parodome pagrindinius kasdienius veiksmus.",
      },
    ],
  },
  {
    slug: "atsiliepimai",
    title: "Reputacija ir klientų atsiliepimai",
    shortTitle: "Google atsiliepimai",
    headline: "Gera patirtis verta būti pastebėta.",
    description:
      "NFC kortelės, QR sprendimai ir patogus kelias iki Google atsiliepimo. Esamas Skenis produktas – platesnės paslaugų šeimos dalis.",
    outcome: "Patenkintam klientui paprasčiau pasidalyti patirtimi.",
    problem:
      "Klientas išeina patenkintas, tačiau palikti atsiliepimą atideda. Ieškoti įmonės puslapio ir tinkamos nuorodos yra papildomas žingsnis, kurį galima sutrumpinti.",
    approach:
      "Sukuriame tiesų kelią į jūsų atsiliepimų puslapį: NFC prisilietimu, QR nuskaitymu ar nuoroda po paslaugos. Pritaikome pateikimą jūsų klientų aptarnavimo vietai ir eigai.",
    icon: MessageSquareText,
    primary: false,
    capabilities: [
      "Automatiniai prašymai pasidalyti atsiliepimu",
      "Atsiliepimų ir nuorodų naudojimo suvestinės",
      "Google atsiliepimų NFC kortelės ir stoveliai",
      "Google atsiliepimų QR sprendimai ir nuorodos",
      "NFC integracijos",
      "QR integracijos",
    ],
    capabilityIds: [29, 30, 76, 77, 78, 79],
    examples: [
      {
        title: "Kortelė prie kasos",
        description:
          "Klientas priglaudžia telefoną arba nuskaito QR kodą ir pasiekia jūsų Google atsiliepimų puslapį.",
      },
      {
        title: "Nuoroda po vizito",
        description:
          "Po suteiktos paslaugos klientui išsiunčiamas neutralus prašymas pasidalyti patirtimi.",
      },
      {
        title: "Kelios aptarnavimo vietos",
        description:
          "Atskiri kodai ir nuorodos padeda nukreipti klientą į atitinkamo filialo profilį bei stebėti nuskaitymus.",
      },
    ],
    faq: [
      {
        question: "Ar Skenis NFC korteles vis dar galima užsisakyti?",
        answer:
          "Taip. Google atsiliepimų kortelės išlieka mūsų pasiūloje. Produkto puslapyje rasite veikimo principą, dabartinę kainodarą ir užsakymo formą.",
      },
      {
        question: "Ar klientui reikia papildomos programėlės?",
        answer:
          "NFC kortelei ar QR kodui nuskaityti atskiros Skenis programėlės nereikia. Atsiliepimui palikti klientas turi prisijungti prie savo Google paskyros.",
      },
      {
        question: "Ar matysiu, kiek žmonių paliko atsiliepimą?",
        answer:
          "Kortelės nuskaitymas ir paskelbtas atsiliepimas nėra tas pats. Esamas produktas leidžia matyti nuskaitymus. Atsiliepimų duomenų integravimo galimybes vertiname atskirai.",
      },
    ],
  },
];

export const primaryServices = services.filter((service) => service.primary);

export function getServiceBySlug(slug: string | undefined) {
  return services.find((service) => service.slug === slug);
}
