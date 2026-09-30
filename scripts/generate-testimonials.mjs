import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const services = [
  "svetaines",
  "e-komercija",
  "registracijos",
  "pardavimu-irankiai",
  "skaiciuokles",
  "verslo-sistemos",
  "automatizacijos",
  "ai-sprendimai",
  "atsiliepimai",
  "nfc-product",
];
const subjects = [
  "svetainės paslaugų pristatymą",
  "parduotuvės užsakymo eigą",
  "vizito laiko pasirinkimą",
  "užklausų perdavimą komandai",
  "sąmatos skaičiavimą",
  "projekto užduočių valdymą",
  "duomenų perdavimą tarp programų",
  "asistento atsakymo šaltinius",
  "atsiliepimo nuorodos atidarymą",
  "NFC kortelės naudojimo eigą",
];
const observations = [
  "Pirmas veiksmas aiškus, tačiau ilgesnį paaiškinimą dar reikėtų patikslinti.",
  "Mobiliajame vaizde patogu pereiti prie kito žingsnio.",
  "Bandant siaurą ekraną svarbiausi pasirinkimai lieka matomi.",
  "Informacija išdėstyta nuosekliai; lengva suprasti, ką tikrinti toliau.",
  "Šiame scenarijuje ieškome aiškesnio būsenos paaiškinimo.",
  "Filtrų ir pasirinkimų pavadinimai padeda orientuotis.",
  "Ilgesnis tekstas leidžia įvertinti kortelės aukštį bei tarpus.",
  "Keli paspaudimai parodo pasirinkto veiksmo rezultatą.",
  "Pranešimą apie rezultatą norėtųsi matyti arčiau veiksmo.",
  "Trumpas aprašymas gerai tinka kompaktiškam kortelės variantui.",
];
const entries = Array.from({ length: 200 }, (_, index) => {
  const n = index + 1,
    category = index % 10,
    variant = Math.floor(index / 10);
  const quote = `Testinis scenarijus ${String(n).padStart(3, "0")}: tikriname ${subjects[category]}. ${observations[variant % 10]}${variant % 3 === 0 ? " Lyginame kompiuterio ir telefono vaizdus, teksto lūžius bei valdymą klaviatūra." : ""}`;
  return {
    id: `synthetic-${String(n).padStart(3, "0")}`,
    synthetic: true,
    verified: false,
    name: `Testinis klientas ${String(n).padStart(3, "0")}`,
    service: services[category],
    rating: (variant % 5) + 1,
    quote,
    ...(index % 4 === 0
      ? {
          fullQuote:
            quote +
            " Tai išplėstinio teksto bandymas, skirtas atidarymo ir uždarymo valdikliui, fokusui bei ilgos kortelės išdėstymui. Šis įrašas nėra tikro kliento nuomonė.",
        }
      : {}),
    publishedAt: new Date(Date.UTC(2026, 0, 1 + index))
      .toISOString()
      .slice(0, 10),
    source: "synthetic",
    featured: false,
    status: "draft",
    consent: false,
  };
});
const destination = fileURLToPath(
  new URL("../src/data/fixtures/testimonials.synthetic.json", import.meta.url),
);
await mkdir(fileURLToPath(new URL("../src/data/fixtures/", import.meta.url)), {
  recursive: true,
});
await writeFile(destination, JSON.stringify(entries, null, 2) + "\n");
console.log(`Generated ${entries.length} labelled synthetic testimonials.`);
