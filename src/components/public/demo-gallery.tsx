import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ServiceVisual } from "./studio-demos";

export const demoOptions = [
  {
    id: "svetaine",
    slug: "svetaines",
    label: "Svetainė",
    title: "Erdvė geram pirmam įspūdžiui.",
    problem: "Lankytojas neranda aiškaus pasiūlymo ir kito žingsnio.",
    action:
      "Apžiūrėkite interjero studijos koncepciją ir perduokite pavyzdinę užklausą.",
    adapt: "Jūsų prekės ženklą, paslaugas, projektus ir užklausos kelią.",
  },
  {
    id: "registracija",
    slug: "registracijos",
    label: "Registracija",
    title: "Laiką pasirenka pats klientas.",
    problem: "Skambučiai dėl laisvo laiko pertraukia komandos darbą.",
    action: "Pasirinkite paslaugą, dieną, laiką ir patvirtinkite demo vizitą.",
    adapt: "Darbuotojų grafikus, paslaugų trukmę ir priminimų taisykles.",
  },
  {
    id: "skaiciuokle",
    slug: "skaiciuokles",
    label: "Skaičiuoklė",
    title: "Aiški suma pagal jūsų taisykles.",
    problem: "Kiekvieną preliminarią sąmatą reikia skaičiuoti rankomis.",
    action:
      "Keiskite plotą ir paruošimo pasirinkimą. Stebėkite, kaip keičiasi suma.",
    adapt: "Jūsų įkainius, pasirinkimus, išimtis ir pasiūlymo formatą.",
  },
  {
    id: "pardavimai",
    slug: "pardavimu-irankiai",
    label: "Pardavimai",
    title: "Kiekviena užklausa turi kitą žingsnį.",
    problem: "Kontaktai ir pažadai pasimeta tarp žinučių bei lentelių.",
    action:
      "Perkelkite pasirinktą užklausą iki pasiūlymo ir stebėkite kitą veiksmą.",
    adapt: "Jūsų pardavimo etapus, atsakomybes ir pasiūlymų šablonus.",
  },
  {
    id: "komanda",
    slug: "verslo-sistemos",
    label: "Komandos darbai",
    title: "Vienas vaizdas visai komandai.",
    problem: "Neaišku, kas už ką atsakingas ir kas jau atlikta.",
    action:
      "Pasirinkite projektą: matysite atsakingą žmogų, terminą ir kitą darbą.",
    adapt: "Projektų laukus, teises, būsenas ir dokumentų valdymą.",
  },
  {
    id: "automatizacija",
    slug: "automatizacijos",
    label: "Automatizacija",
    title: "Duomenys keliauja. Darbas tęsiasi.",
    problem: "Ta pati informacija kelis kartus kopijuojama rankomis.",
    action:
      "Pereikite keturis žingsnius: nuo užklausos iki pranešimo juodraščio.",
    adapt: "Jūsų naudojamų sistemų jungtis ir perdavimo taisykles.",
  },
  {
    id: "asistentas",
    slug: "ai-sprendimai",
    label: "AI scenarijus",
    title: "Atsakymas turi savo šaltinį.",
    problem: "Komanda gaišta laiką ieškodama informacijos dokumentuose.",
    action:
      "Pasirinkite vieną iš dviejų iš anksto parengtų klausimų ir palyginkite šaltinius.",
    adapt: "Jūsų žinių bazę, prieigos ribas ir žmogaus peržiūrą.",
  },
  {
    id: "parduotuve",
    slug: "e-komercija",
    label: "E. parduotuvė",
    title: "Nuo gražaus daikto iki aiškaus pasirinkimo.",
    problem: "Pirkėjui sunku palyginti variantus ir suprasti užsakymą.",
    action:
      "Pasirinkite vazono dydį ir įdėkite prekę į demonstracinį krepšelį.",
    adapt: "Katalogą, variantus, kainas ir tikrą užsakymų eigą.",
  },
] as const;
export function DemoGallery() {
  const [params] = useSearchParams();
  const { hash } = useLocation();
  const legacy: Record<string, string> = {
    "#demo-website": "svetaine",
    "#demo-booking": "registracija",
    "#demo-calculator": "skaiciuokle",
  };
  const selected =
    demoOptions.find((d) => d.id === (params.get("demo") || legacy[hash])) ||
    demoOptions[0];
  return (
    <section
      className="studio-container demo-gallery"
      id="demonstracija"
      aria-label="Sprendimų demonstracijos"
    >
      <nav className="gallery-choices" aria-label="Pasirinkite demonstraciją">
        {demoOptions.map((d) => (
          <Link
            key={d.id}
            to={`/sprendimai?demo=${d.id}#demonstracija`}
            aria-current={selected.id === d.id ? "true" : undefined}
          >
            {d.label}
          </Link>
        ))}
      </nav>
      <div className={`gallery-layout gallery-${selected.slug}`}>
        <div className="gallery-stage" key={selected.id}>
          <ServiceVisual slug={selected.slug} variant="full" />
        </div>
        <div className="gallery-context">
          <p className="studio-eyebrow">Išbandykite sprendimą</p>
          <h2>{selected.title}</h2>
          <dl>
            <div>
              <dt>Kokią problemą sprendžia</dt>
              <dd>{selected.problem}</dd>
            </div>
            <div>
              <dt>Ką galima išbandyti</dt>
              <dd>{selected.action}</dd>
            </div>
            <div>
              <dt>Ką pritaikytume jums</dt>
              <dd>{selected.adapt}</dd>
            </div>
          </dl>
          <Link className="studio-text-link" to={`/paslaugos/${selected.slug}`}>
            Apie šią paslaugą
            <ArrowUpRight size={17} aria-hidden />
          </Link>
          <Link
            className="studio-button secondary"
            to={`/kontaktai?service=${selected.slug}&intent=project`}
          >
            Aptarti savo variantą
            <ArrowUpRight size={17} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
