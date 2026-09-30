/** Visitor-facing wording shared by navigation, service pages and enquiry choices. */
export const navigation = [
  { to: "/paslaugos", label: "Paslaugos" },
  { to: "/sprendimai", label: "Pavyzdžiai" },
  { to: "/#kaip-dirbame", label: "Kaip dirbame" },
  { to: "/apie", label: "Apie" },
  { to: "/kontaktai", label: "Kontaktai" },
];

export const serviceContent: Record<
  string,
  {
    title: string;
    detailTitle: string;
    description: string;
    summary: string;
    audience: string;
    example: string;
    link: string;
    cta: string;
    formLabel: string;
  }
> = {
  svetaines: {
    title: "Interneto svetainių kūrimas",
    detailTitle: "Interneto svetainių kūrimas ir atnaujinimas",
    description:
      "Kuriame greitas ir aiškias verslo svetaines, kuriose lankytojas supranta jūsų pasiūlymą ir lengvai susisiekia.",
    summary:
      "Kuriame naujas verslo svetaines, paslaugų puslapius ir atnaujiname esamas svetaines.",
    audience:
      "Paslaugų įmonėms ir verslams, kuriems reikia naujos svetainės arba esamos atnaujinimo.",
    example:
      "Paslaugų įmonės svetainė su darbų pavyzdžiais ir užklausos forma.",
    link: "Apie svetainių kūrimą",
    cta: "Aptarti svetainės kūrimą",
    formLabel: "Interneto svetainė",
  },
  "e-komercija": {
    title: "Elektroninių parduotuvių kūrimas",
    detailTitle: "Elektroninių parduotuvių kūrimas",
    description:
      "Kuriame aiškų kelią nuo produkto pasirinkimo iki užsakymo, mokėjimo ir pristatymo.",
    summary:
      "Kuriame produktų katalogus, užsakymo eigą, mokėjimų ir pristatymo jungtis.",
    audience:
      "Verslams, parduodantiems prekes internetu arba norintiems priimti partnerių užsakymus.",
    example:
      "Parduotuvė su prekių variantais, krepšeliu ir pristatymo pasirinkimu.",
    link: "Apie e. parduotuvių kūrimą",
    cta: "Aptarti e. parduotuvę",
    formLabel: "Elektroninė parduotuvė",
  },
  registracijos: {
    title: "Registracijos ir rezervacijų sistemos",
    detailTitle: "Registracijos ir rezervacijų sistemų kūrimas",
    description:
      "Kuriame sistemas, kuriose klientai savarankiškai pasirenka laiką ar paslaugą, o komanda registracijas valdo vienoje vietoje.",
    summary:
      "Kuriame laiko, paslaugos ar darbuotojo pasirinkimą klientui ir registracijų valdymą komandai.",
    audience:
      "Konsultantams, paslaugų teikėjams, servisams ir kitoms komandoms, derinančioms klientų vizitus.",
    example:
      "Registracija konsultacijai su laisvų laikų pasirinkimu ir priminimu.",
    link: "Apie registracijų sistemas",
    cta: "Aptarti registracijos sistemą",
    formLabel: "Registracijos sistema",
  },
  "pardavimu-irankiai": {
    title: "Klientų užklausų ir pardavimų valdymo įrankiai",
    detailTitle: "Klientų užklausų ir pardavimų valdymo įrankiai",
    description:
      "Kuriame įrankius, kurie sujungia užklausas, pasiūlymus ir pardavimo etapus į aiškią darbo eigą.",
    summary:
      "Sukuriame užklausų surinkimą, pasiūlymų rengimą ir potencialių klientų etapų valdymą.",
    audience:
      "Komandoms, kurios gauna užklausas keliais kanalais ir rengia individualius pasiūlymus.",
    example:
      "Užklausų sąrašas su atsakingu darbuotoju, pasiūlymu ir kito pokalbio data.",
    link: "Apie užklausų valdymą",
    cta: "Aptarti pardavimų įrankį",
    formLabel: "Pardavimų arba užklausų įrankis",
  },
  skaiciuokles: {
    title: "Kainų ir sąmatų skaičiuoklės",
    detailTitle: "Kainų, sąmatų ir pasiūlymų skaičiuoklės",
    description:
      "Kuriame skaičiuokles, kurios rankinius skaičiavimus paverčia aiškiu įrankiu klientams arba jūsų komandai.",
    summary:
      "Kuriame kainų, sąmatų ir individualių pasiūlymų skaičiuokles klientams arba komandai.",
    audience:
      "Verslams, kurių pasiūlymo suma priklauso nuo kiekių, pasirinktų darbų ar kitų sąlygų.",
    example:
      "Apdailos darbų sąmata pagal plotą, darbų kiekį ir pasirinktą paruošimą.",
    link: "Apie kainų skaičiuokles",
    cta: "Aptarti skaičiuoklę",
    formLabel: "Skaičiuoklė",
  },
  "verslo-sistemos": {
    title: "Individualios verslo sistemos",
    detailTitle: "Individualių verslo sistemų kūrimas",
    description:
      "Kuriame jūsų procesams pritaikytą sistemą klientams, užsakymams, dokumentams, užduotims ir veiklos informacijai valdyti.",
    summary:
      "Vienoje sistemoje sujungiame klientus, užsakymus, dokumentus, užduotis ir veiklos rodiklius.",
    audience:
      "Smulkiam ir augančiam verslui, kurio darbo eiga nebetelpa į atskiras lenteles ir žinutes.",
    example:
      "Užsakymų ir komandos darbų sistema su terminais, dokumentais ir prieigos teisėmis.",
    link: "Apie verslo sistemas",
    cta: "Aptarti verslo sistemą",
    formLabel: "Vidinė verslo sistema",
  },
  automatizacijos: {
    title: "Verslo procesų automatizavimas",
    detailTitle: "Verslo procesų automatizavimas ir sistemų integracijos",
    description:
      "Sujungiame naudojamas programas ir automatizuojame pasikartojantį duomenų perdavimą, pranešimus bei dokumentų rengimą.",
    summary:
      "Sujungiame naudojamas programas ir automatizuojame duomenų perkėlimą bei dokumentų rengimą.",
    audience:
      "Komandoms, kurios tuos pačius duomenis perrašo į kelias programas arba kartoja tuos pačius veiksmus.",
    example:
      "Formos užklausa automatiškai įrašoma į klientų sistemą ir priskiriama darbuotojui.",
    link: "Apie automatizavimą",
    cta: "Aptarti automatizavimą",
    formLabel: "Automatizavimas arba integracija",
  },
  "ai-sprendimai": {
    title: "AI asistentai klientams ir komandai",
    detailTitle: "AI asistentai klientams ir komandai",
    description:
      "Kuriame asistentus, kurie padeda rasti informaciją, atsakyti į dažnus klausimus arba naudotis vidiniais dokumentais.",
    summary:
      "Kuriame asistentus klientų klausimams ir komandos informacijos paieškai pagal sutartus šaltinius.",
    audience:
      "Verslams, turintiems pasikartojančių klientų klausimų arba komandai sunkiai randamų dokumentų.",
    example:
      "Darbuotojo asistentas, pateikiantis atsakymą ir instrukcijos šaltinį.",
    link: "Apie AI asistentus",
    cta: "Aptarti AI asistentą",
    formLabel: "AI asistentas",
  },
  atsiliepimai: {
    title: "NFC, QR ir klientų atsiliepimų sprendimai",
    detailTitle: "NFC ir QR sprendimai klientų atsiliepimams",
    description:
      "Kuriame fizines korteles ir QR nuorodas, kurios padeda klientui greitai pasiekti jūsų „Google“ atsiliepimų puslapį.",
    summary:
      "Paruošiame korteles ir QR nuorodas, vedančias į įmonės „Google“ atsiliepimų puslapį.",
    audience:
      "Verslams, aptarnaujantiems klientus vietoje ir norintiems patogiai pateikti atsiliepimo nuorodą.",
    example:
      "NFC ir QR kortelė prie kasos su valdoma nuoroda ir skenavimų statistika.",
    link: "Apie NFC ir QR sprendimus",
    cta: "Aptarti NFC ar QR sprendimą",
    formLabel: "NFC arba QR sprendimas",
  },
};

export const serviceOrder = [
  "svetaines",
  "e-komercija",
  "registracijos",
  "pardavimu-irankiai",
  "skaiciuokles",
  "verslo-sistemos",
  "automatizacijos",
  "ai-sprendimai",
  "atsiliepimai",
];

export function getContactIntent(value: string | null): "demo" | "project" {
  return value === "demo" ? "demo" : "project";
}

export const demoOptions = [
  {
    id: "svetaine", slug: "svetaines", label: "Svetainė", kind: "Dizaino koncepcija",
    title: "Svetainė, kurioje aišku, ką siūlote",
    problem: "Lankytojas neranda paslaugų ir nežino, kaip susisiekti.",
    action: "Peržiūrėkite pasiūlymą, tris paslaugas ir iliustracinį darbą. Kontaktinė nuoroda veda į „Skenis“.",
    solution: "Pasiūlymas, paslaugos ir kontaktinis veiksmas matomi vienoje aiškioje struktūroje.",
    result: "Lankytojas supranta pasiūlymą ir randa kelią iki užklausos.",
    customer: "Aiškų pasiūlymą, darbų kryptį ir būdą susisiekti.",
    team: "Užklausą apie konkrečią paslaugą, kai prijungiama tikra forma.",
    adapt: "Jūsų pasiūlymą, paslaugų struktūrą, tikrus darbus ir kontaktų kelią.",
    cta: "Peržiūrėti koncepciją",
  },
  {
    id: "registracija", slug: "registracijos", label: "Registracija", kind: "Interaktyvi demonstracija",
    title: "Klientas pats pasirenka vizito laiką",
    problem: "Skambučiai dėl laisvo laiko pertraukia komandos darbą.",
    action: "Pasirinkite paslaugą, dieną ir laiką. Tada patvirtinkite demonstracinį vizitą.",
    solution: "Klientas pats pasirenka paslaugą, dieną ir laiką.",
    result: "Komanda gauna tvarkingą rezervaciją, o klientas – patvirtinimą.",
    customer: "Vizito patvirtinimą su paslauga, data ir laiku.",
    team: "Naują rezervaciją bendrame kalendoriuje.",
    adapt: "Jūsų paslaugas, darbuotojų grafikus, laiko trukmę ir priminimų taisykles.",
    cta: "Išbandyti demonstraciją",
  },
  {
    id: "skaiciuokle", slug: "skaiciuokles", label: "Skaičiuoklė", kind: "Interaktyvi demonstracija",
    title: "Kaina perskaičiuojama pakeitus plotą",
    problem: "Komanda kiekvieną preliminarią sąmatą skaičiuoja rankomis.",
    action: "Pakeiskite plotą ir pasirinkite paviršiaus paruošimą. Suma ir jos dalys perskaičiuojamos iškart.",
    solution: "Skaičiavimo taisyklės sujungiamos į klientui suprantamą įrankį.",
    result: "Klientas mato preliminarią sumą, komanda – skaičiavimo pagrindą.",
    customer: "Preliminarią kainą ir aiškų jos išskaidymą.",
    team: "Plotą, pasirinktus darbus ir pagal tas pačias taisykles apskaičiuotą sumą.",
    adapt: "Jūsų įkainius, parametrus, skaičiavimo taisykles ir pasiūlymo formą.",
    cta: "Išbandyti demonstraciją",
  },
  {
    id: "komanda", slug: "verslo-sistemos", label: "Komandos sistema", kind: "Interaktyvi demonstracija",
    title: "Komanda žino, kas daro kitą žingsnį",
    problem: "Neaišku, kas už ką atsakingas ir kas jau atlikta.",
    action: "Pasirinkite projektą ir patvirtinkite kitą žingsnį. Matysite atnaujintą užduoties būseną.",
    solution: "Projektas, atsakingas žmogus, terminas ir kitas darbas matomi vienoje vietoje.",
    result: "Komanda mato, kas atlikta ir kam perduoti tolesnį darbą.",
    customer: "Aiškią projekto eigą ir sutartą kitą žingsnį.",
    team: "Patvirtintą užduotį, atsakingą žmogų ir kito darbo terminą.",
    adapt: "Jūsų projektų laukus, prieigos teises, būsenas ir dokumentų valdymą.",
    cta: "Išbandyti demonstraciją",
  },
  {
    id: "pardavimai", slug: "pardavimu-irankiai", label: "Pardavimų valdymas", kind: "Interaktyvi demonstracija",
    title: "Kiekviena užklausa turi kitą veiksmą",
    problem: "Klientų užklausos pasimeta tarp laiškų ir žinučių.",
    action: "Pasirinkite užklausą ir perkelkite ją į kitą etapą. Stebėkite atsakingą žmogų, terminą ir kitą veiksmą.",
    solution: "Užklausos nuo pirmo kontakto iki patvirtinimo valdomos vienoje vietoje.",
    result: "Komanda žino, su kuo ir kada susisiekti.",
    customer: "Nuoseklų kontaktą ir aiškų pasiūlymo žingsnį.",
    team: "Kontaktą, atsakingą žmogų, etapą ir priminimą apie kitą veiksmą.",
    adapt: "Jūsų užklausų kanalus, pardavimo etapus ir atsakomybių taisykles.",
    cta: "Išbandyti demonstraciją",
  },
  {
    id: "automatizacija", slug: "automatizacijos", label: "Automatizacija", kind: "Scenarijaus simuliacija",
    title: "Viena forma pradeda šešių veiksmų eigą",
    problem: "Ta pati informacija kelis kartus kopijuojama rankomis.",
    action: "Paleiskite scenarijų: forma virs kliento įrašu, užduotimi ir dokumentu. Animaciją galite praleisti.",
    solution: "Formos duomenys perduodami pagal sutartas taisykles.",
    result: "Komanda gauna paruoštą įrašą, užduotį ir dokumentą.",
    customer: "Pranešimą, kad užklausa gauta ir kas vyks toliau.",
    team: "Kliento įrašą, paskirtą užduotį ir paruoštą dokumentą.",
    adapt: "Jūsų sistemų jungtis, duomenų tikrinimą ir klaidų valdymo taisykles.",
    cta: "Paleisti simuliaciją",
  },
  {
    id: "asistentas", slug: "ai-sprendimai", label: "AI asistentas", kind: "Scenarijaus simuliacija",
    title: "Atsakymas pateikiamas kartu su šaltiniu",
    problem: "Komanda gaišta laiką ieškodama informacijos dokumentuose.",
    action: "Pasirinkite parengtą klausimą. Pamatysite atsakymą, šaltinio pavadinimą ir jo ištrauką.",
    solution: "Klausimas susiejamas su aiškiu atsakymu ir dokumento šaltiniu.",
    result: "Žmogus gali patikrinti, kuo pagrįstas atsakymas.",
    customer: "Greitą atsakymą į pasikartojantį klausimą.",
    team: "Atsakymą su šaltiniu, kurį galima patikrinti.",
    adapt: "Jūsų įmonės žinių bazę, prieigos taisykles ir žmogaus peržiūrą.",
    cta: "Paleisti simuliaciją",
  },
  {
    id: "parduotuve", slug: "e-komercija", label: "E. parduotuvė", kind: "Interaktyvi demonstracija",
    title: "Nuo prekės iki krepšelio",
    problem: "Pirkėjui sunku palyginti variantus ir suprasti užsakymą.",
    action: "Pasirinkite vazono dydį, kiekį ir įdėkite į demonstracinį krepšelį. Pamatysite sumą ir suvestinę.",
    solution: "Prekės variantas, kiekis ir suma sujungiami į aiškią užsakymo eigą.",
    result: "Pirkėjas supranta pasirinkimą, komanda mato tikslią užsakymo sudėtį.",
    customer: "Prekės variantą, kiekį ir užsakymo suvestinę.",
    team: "Tikslią užsakymo sudėtį ir sumą.",
    adapt: "Jūsų katalogą, kainas, mokėjimus, pristatymą ir tikrą užsakymų eigą.",
    cta: "Išbandyti demonstraciją",
  },
] as const;
