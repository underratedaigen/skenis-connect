import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { getServiceBySlug } from "@/data/services";
import { projects } from "@/data/projects";
import { trackConversion } from "@/lib/conversion-events";
import { HeroDemo, ServiceTeaser } from "./studio-demos";
export {
  WebsitePreview,
  BookingPreview,
  CalculatorPreview,
  WorkflowPreview,
} from "./studio-demos";

export function SectionHeading({
  label,
  title,
  children,
  action,
}: {
  label: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="studio-section-heading">
      <div>
        <p className="studio-eyebrow">{label}</p>
        <h2>{title}</h2>
        {children && <p className="studio-section-description">{children}</p>}
      </div>
      {action}
    </div>
  );
}

export function DemoCTA({
  compact = false,
  service,
  title,
}: {
  compact?: boolean;
  service?: string;
  title?: string;
}) {
  return (
    <section className={`studio-demo-cta ${compact ? "compact" : ""}`}>
      <div className="studio-container studio-demo-grid">
        <div>
          <p className="studio-eyebrow">Kitas žingsnis — jūsų</p>
          <h2>
            {title ||
              (
                {
                  svetaines: "Parodykime jūsų verslą taip, kaip jis vertas.",
                  registracijos: "Leiskite klientui pasirinkti laiką pačiam.",
                  automatizacijos: "Nuo kurio pasikartojančio darbo pradėsime?",
                  "pardavimu-irankiai":
                    "Suteikime kiekvienai užklausai kitą žingsnį.",
                  skaiciuokles: "Paverskime jūsų taisykles patogiu įrankiu.",
                  "verslo-sistemos":
                    "Sujunkime komandos darbus vienoje vietoje.",
                  "ai-sprendimai":
                    "Kokią informaciją komandai sunkiausia rasti?",
                  "e-komercija": "Padėkime jūsų klientui išsirinkti.",
                  atsiliepimai: "Sutrumpinkime kelią iki kliento atsiliepimo.",
                } as Record<string, string>
              )[service || ""] ||
              "Ką jūsų versle galėtume supaprastinti?"}
          </h2>
        </div>
        <div>
          <p>
            Papasakokite, kas stringa. Tinkamiems projektams paruošime nemokamą
            pradinę koncepciją — jos apimtį sutarsime kartu.
          </p>
          <Link
            to={`/kontaktai?intent=demo${service ? `&service=${service}` : ""}`}
            className="studio-button light"
            data-conversion={service ? "service_enquiry" : "free_demo_cta"}
          >
            Gauti nemokamą pavyzdį
            <ArrowUpRight size={19} aria-hidden />
          </Link>
          <span className="studio-demo-note">
            Pirmas pokalbis. Aiški kryptis. Jokių įsipareigojimų.
          </span>
        </div>
      </div>
    </section>
  );
}

export function ProjectGrid() {
  const demos = {
    website: "svetaine",
    booking: "registracija",
    calculator: "skaiciuokle",
  };
  return (
    <div className="selected-projects">
      {projects.map((project, i) => (
        <article
          className={`selected-project selected-${project.preview}`}
          key={project.id}
        >
          <div className={`selected-visual catalog-${project.serviceSlug}`}>
            <ServiceTeaser slug={project.serviceSlug} />
          </div>
          <div className="selected-copy">
            <span className="studio-eyebrow">
              {i === 0 ? "Svetainės koncepcija" : "Sprendimo pavyzdys"}
            </span>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <Link
              className="studio-text-link"
              to={`/sprendimai?demo=${demos[project.preview]}#demonstracija`}
            >
              Išbandyti demonstraciją
              <ArrowUpRight size={17} aria-hidden />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

const groups = [
  {
    title: "Pritraukti klientus.",
    text: "Aiškiai pristatykite vertę. Padėkite lankytojui tapti klientu.",
    slugs: ["svetaines", "pardavimu-irankiai", "e-komercija"],
    visual: "svetaines",
  },
  {
    title: "Supaprastinti darbą.",
    text: "Registracijos, sąmatos ir komandos darbai — savo vietose.",
    slugs: ["registracijos", "skaiciuokles", "verslo-sistemos"],
    visual: "registracijos",
  },
  {
    title: "Sujungti ir automatizuoti.",
    text: "Tegu informacija keliauja, o pasikartojantys darbai vyksta patys.",
    slugs: ["automatizacijos", "ai-sprendimai", "atsiliepimai"],
    visual: "automatizacijos",
  },
];
function ServiceDirections() {
  return (
    <section className="studio-section studio-directions" id="paslaugos">
      <div className="studio-container">
        <SectionHeading
          label="Ką kuriame"
          title="Trys kryptys. Jūsų verslo ritmu."
          action={
            <Link className="studio-text-link" to="/paslaugos">
              Visos paslaugos
              <ArrowUpRight size={18} aria-hidden />
            </Link>
          }
        />{" "}
        <div className="direction-list">
          {groups.map((group, i) => (
            <article className="direction-row" key={group.title}>
              <span className="direction-number">0{i + 1}</span>
              <div>
                <h3>{group.title}</h3>
                <p>{group.text}</p>
              </div>
              <div>
                <div className="direction-links">
                  {group.slugs.map((slug) => (
                    <Link key={slug} to={`/paslaugos/${slug}`}>
                      {getServiceBySlug(slug)?.shortTitle}
                      <ArrowUpRight size={15} aria-hidden />
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const needs = [
  {
    title: "Gauti daugiau užklausų",
    situation: "Lankytojai ateina, bet nesusisiekia?",
    heading: "Parodykime, kodėl verta rinktis jus.",
    text: "Aiškus pasiūlymas, suprantamos paslaugos ir trumpas kelias iki pokalbio.",
    slug: "svetaines",
  },
  {
    title: "Sumažinti rankinį darbą",
    situation: "Ta pati informacija keliauja per kelias lenteles?",
    heading: "Tegu duomenys keliauja patys.",
    text: "Sujungiame formas, el. paštą ir naudojamus įrankius. Komanda gali tęsti svarbesnį darbą.",
    slug: "automatizacijos",
  },
  {
    title: "Supaprastinti registracijas",
    situation: "Skambučiai dėl laiko pertraukia darbą?",
    heading: "Laisvus laikus mato pats klientas.",
    text: "Registracija, patvirtinimas ir priminimas — vienoje aiškioje eigoje.",
    slug: "registracijos",
  },
  {
    title: "Valdyti užsakymus vienoje vietoje",
    situation: "Neaišku, kas atsakingas ir kas jau padaryta?",
    heading: "Visai komandai — bendras vaizdas.",
    text: "Užsakymai, terminai, dokumentai ir darbų būsenos vienoje sistemoje.",
    slug: "verslo-sistemos",
  },
  {
    title: "Palengvinti atsiliepimų pateikimą",
    situation: "Klientai patenkinti, bet sunkiai randa nuorodą?",
    heading: "Trumpesnis kelias pasidalyti patirtimi.",
    text: "Fizinė NFC / QR kortelė atveria jūsų atsiliepimo puslapį ir padeda stebėti kortelės naudojimą.",
    slug: "atsiliepimai",
  },
];
export function NeedsSelector() {
  const [index, setIndex] = useState(0);
  const id = useId();
  return (
    <section className="studio-section studio-needs" id="verslo-poreikiai">
      <div className="studio-container">
        <SectionHeading
          label="Pradėkime nuo jūsų"
          title="Ką norėtumėte supaprastinti?"
        />
        <div
          className="needs-choice-grid"
          role="group"
          aria-label="Pasirinkite verslo poreikį"
        >
          {needs.map((need, i) => (
            <div className="need-choice" key={need.slug}>
              <button
                type="button"
                aria-expanded={index === i}
                aria-controls={index === i ? `${id}-${need.slug}` : undefined}
                onClick={() => {
                  setIndex(i);
                  trackConversion("need_selected", { service: need.slug });
                }}
              >
                <span className="need-number">0{i + 1}</span>
                <span>{need.title}</span>
                {index === i ? (
                  <ArrowRight size={20} aria-hidden />
                ) : (
                  <Plus size={20} aria-hidden />
                )}
              </button>
              {index === i && (
                <div
                  className={`need-result need-${need.slug}`}
                  id={`${id}-${need.slug}`}
                >
                  <div className="need-preview">
                    <ServiceTeaser slug={need.slug} />
                  </div>
                  <div>
                    <p className="need-situation">{need.situation}</p>
                    <h3>{need.heading}</h3>
                    <p>{need.text}</p>
                    <div className="studio-need-actions">
                      <Link
                        to={`/paslaugos/${need.slug}`}
                        className="studio-text-link"
                      >
                        Apie sprendimą
                        <ArrowUpRight size={17} aria-hidden />
                      </Link>
                      <Link
                        to={`/kontaktai?service=${need.slug}&intent=project`}
                        className="studio-button secondary"
                        data-conversion="service_enquiry"
                      >
                        Aptarti poreikį
                        <ArrowRight size={17} aria-hidden />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const processSteps = [
  {
    title: "Išklausome",
    text: "Aptariame, kas stringa ir kokio rezultato reikia.",
    deliverable: "Aiškiai įvardytas poreikis",
  },
  {
    title: "Parodome kryptį",
    text: "Sutariame sprendimą, apimtį ir kainą. Tinkamam projektui paruošiame pradinį pavyzdį.",
    deliverable: "Pasiūlymas ir darbų planas",
  },
  {
    title: "Kuriame kartu",
    text: "Rodome eigą, deriname sprendimus ir tikriname realius naudojimo scenarijus.",
    deliverable: "Išbandytas sprendimas",
  },
  {
    title: "Perduodame",
    text: "Paleidžiame, parodome, kaip naudotis, ir sutariame dėl priežiūros.",
    deliverable: "Veikiantis įrankis ir aiškumas",
  },
];
export function ProcessSection({ about = false }: { about?: boolean }) {
  return (
    <section className="studio-process studio-section" id="kaip-dirbame">
      <div className="studio-container">
        <SectionHeading
          label="Nuo pokalbio iki paleidimo"
          title="Jūs žinote verslą. Mes sujungiame taškus."
          action={
            about ? undefined : (
              <Link className="studio-text-link" to="/apie">
                Apie mūsų požiūrį
                <ArrowUpRight size={18} aria-hidden />
              </Link>
            )
          }
        />
        <div className="studio-process-grid">
          {processSteps.map((step, i) => (
            <article key={step.title}>
              <div className="studio-process-number">
                <span>0{i + 1}</span>
                <i aria-hidden />
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <strong>{step.deliverable}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductSpotlight({ entry = false }: { entry?: boolean }) {
  return (
    <section
      className={`product-mention ${entry ? "product-entry" : ""}`}
      id="skenis-produktas"
    >
      <div className="studio-container product-mention-inner">
        {!entry && (
          <img
            src="/images/skenis-product-perspective.jpg"
            width="1280"
            height="1014"
            alt="Skenis NFC ir QR kortelė"
            loading="lazy"
          />
        )}
        <div>
          <p className="studio-eyebrow">Sukurtas Skenis produktas / NFC + QR</p>
          <h2>Maža kortelė. Trumpesnis kelias.</h2>
          <p>
            Jūsų atsiliepimų nuoroda vienu palietimu. Valdoma nuoroda ir
            skenavimų statistika.
          </p>
        </div>
        <Link to="/google-atsiliepimai" className="studio-text-link">
          Kortelės ir kainos
          <ArrowUpRight size={18} aria-hidden />
        </Link>
      </div>
    </section>
  );
}

export function StudioLanding() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="studio-hero">
        <div className="studio-container">
          <div className="studio-hero-grid">
            <div className="studio-hero-copy">
              <p className="studio-eyebrow">
                <span className="studio-status-dot" />
                Skaitmeninių sprendimų studija
              </p>
              <h1>
                Mažiau rutinos.<span>Daugiau verslo.</span>
              </h1>
              <p className="studio-hero-description">
                Kuriame svetaines, verslo sistemas ir automatizacijas, kurios
                padeda klientams jus pasirinkti, o komandai — dirbti paprasčiau.
              </p>
              <div className="studio-hero-actions">
                <Link
                  to="/kontaktai?intent=demo"
                  className="studio-button"
                  data-conversion="hero_demo"
                >
                  Gauti nemokamą pavyzdį
                  <ArrowUpRight size={19} aria-hidden />
                </Link>
                <Link to="/sprendimai" className="studio-text-link">
                  Pamatyti sprendimus
                  <ArrowRight size={18} aria-hidden />
                </Link>
              </div>
              <p className="studio-hero-note">
                Nemokama pradinė koncepcija tinkamiems projektams. Apimtį
                aptariame kartu.
              </p>
            </div>
            <HeroDemo />
          </div>
        </div>
      </section>
      <ServiceDirections />
      <section className="studio-work studio-section" id="sprendimu-pavyzdziai">
        <div className="studio-container">
          <SectionHeading
            label="Ne tik idėjos. Išbandykite."
            title="Taip atrodo paprasčiau."
            action={
              <Link className="studio-text-link" to="/sprendimai">
                Sprendimų galerija
                <ArrowUpRight size={18} aria-hidden />
              </Link>
            }
          >
            Mūsų sukurtos koncepcijos ir interaktyvūs pavyzdžiai. Įsivaizduokite
            juos savo versle.
          </SectionHeading>
          <ProjectGrid />
        </div>
      </section>
      <NeedsSelector />
      <ProductSpotlight />
      <ProcessSection />
      <DemoCTA />
    </main>
  );
}
