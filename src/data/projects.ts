export type Project = {
  id: string;
  name: string;
  client?: string;
  kind: "concept" | "demo" | "client" | "internal";
  industry: string;
  problem: string;
  solution: string;
  description: string;
  serviceSlug: string;
  services: string[];
  screenshots: { src: string; alt: string; width: number; height: number }[];
  results?: { label: string; value: string; source: string }[];
  projectUrl?: string;
  technologies?: string[];
  preview: "website" | "booking" | "calculator";
};

/** Internal concepts only. Add client work only with verified facts and permission. */
export const projects: Project[] = [
  {
    id: "website",
    name: "Paslaugos, kurias lengva pasirinkti.",
    kind: "concept",
    industry: "Paslaugų verslas",
    problem: "Lankytojui sunku suprasti pasiūlymą ir rasti, kaip susisiekti.",
    solution:
      "Aiški paslaugų struktūra, suprantamas turinys ir trumpas kelias iki užklausos.",
    description:
      "Aiškus paslaugų pristatymas ir paprastas kelias iki užklausos.",
    serviceSlug: "svetaines",
    services: ["Svetainės"],
    screenshots: [],
    preview: "website",
  },
  {
    id: "booking",
    name: "Laiką pasirenka pats klientas.",
    kind: "demo",
    industry: "Paslaugų verslas",
    problem: "Darbo laiką pertraukia skambučiai dėl laisvų vizitų.",
    solution:
      "Registracijos sąsaja su laisvų laikų pasirinkimu. Demonstracijoje galima pasirinkti vizito laiką; rezervacija nekuriama.",
    description:
      "Kalendorius ir vizito pasirinkimas. Išbandykite pasirinkdami laiką.",
    serviceSlug: "registracijos",
    services: ["Registracija"],
    screenshots: [],
    preview: "booking",
  },
  {
    id: "calculator",
    name: "Nuo pasirinkimo iki sąmatos.",
    kind: "demo",
    industry: "Paslaugų ir statybų verslas",
    problem: "Kiekvieną preliminarią sąmatą reikia skaičiuoti rankomis.",
    solution:
      "Skaičiuoklė pagal kliento įvestį. Demonstracijoje naudojamas iliustracinis įkainis, kuris nėra Skenis paslaugų kaina.",
    description:
      "Preliminari suma pagal kliento įvestį. Pabandykite pakeisti plotą.",
    serviceSlug: "skaiciuokles",
    services: ["Skaičiuoklės"],
    screenshots: [],
    preview: "calculator",
  },
];
