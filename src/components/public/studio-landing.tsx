import { ArrowRight, ArrowUpRight } from "lucide-react";
import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { getServiceBySlug } from "@/data/services";
import { serviceContent, demoOptions } from "@/data/public-content";
import { TrustSection } from "./testimonials";
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
              "Aptarkime jūsų svetainę ar sistemą"}
          </h2>
        </div>
        <div>
          <p>
            Aprašykite, kokios svetainės ar sistemos reikia. Aptarsime darbų
            apimtį, eigą ir pasiūlymą. Tinkamiems projektams po pirminio
            aptarimo galime parengti nemokamą pradinę koncepciją.
          </p>
          <Link
            to={`/kontaktai?intent=project${service ? `&service=${service}` : ""}`}
            className="studio-button light"
            data-conversion={service ? "service_enquiry" : "project_cta"}
          >
            {service ? serviceContent[service].cta : "Aptarti projektą"}
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
  const selection = ["registracija", "komanda", "skaiciuokle"].map((id) =>
    demoOptions.find((demo) => demo.id === id)!,
  );
  return (
    <div className="selected-projects">
      {selection.map((demo) => (
        <article
          className={`selected-project selected-${demo.id}`}
          key={demo.id}
        >
          <div className={`selected-visual catalog-${demo.slug}`}>
            <ServiceTeaser slug={demo.slug} />
          </div>
          <div className="selected-copy">
            <span className="studio-eyebrow">Interaktyvi demonstracija</span>
            <h3>{demo.title}</h3>
            <p>{demo.problem}</p>
            <Link
              className="studio-text-link"
              to={`/sprendimai?demo=${demo.id}#demonstracija`}
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

function ServiceDirections() {
  return (
    <section className="studio-section home-services" id="paslaugos">
      <div className="studio-container">
        <SectionHeading
          label="Ką kuriame"
          title="Mūsų paslaugos"
          action={
            <Link className="studio-text-link" to="/paslaugos">
              Peržiūrėti visas paslaugas <ArrowUpRight size={18} aria-hidden />
            </Link>
          }
        >
          Nuo įmonės svetainės iki individualios sistemos kasdieniams procesams.
        </SectionHeading>
        <div className="home-service-list">
          {[
            "svetaines",
            "e-komercija",
            "registracijos",
            "pardavimu-irankiai",
            "verslo-sistemos",
            "automatizacijos",
          ].map((slug) => {
            const content = serviceContent[slug];
            const service = getServiceBySlug(slug)!;
            return (
              <article key={slug}>
                <service.icon size={25} aria-hidden />
                <div>
                  <h3>{content.title}</h3>
                  <p>{content.summary}</p>
                  <Link className="studio-text-link" to={`/paslaugos/${slug}`}>
                    {content.link}
                    <ArrowUpRight size={16} aria-hidden />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <p className="home-additional-services">
          Taip pat kuriame kainų skaičiuokles, AI asistentus ir NFC bei QR
          atsiliepimų sprendimus.
        </p>
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
export function ProcessSection({
  about = false,
  service,
}: {
  about?: boolean;
  service?: string;
}) {
  return (
    <section
      className="studio-process studio-section"
      id={service ? `projektas-${service}` : "kaip-dirbame"}
    >
      <div className="studio-container">
        <SectionHeading
          label="Nuo pokalbio iki paleidimo"
          title="Kaip vyksta projektas"
          action={
            about || service ? undefined : (
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
          <h2>NFC ir QR kortelės „Google“ atsiliepimams</h2>
          <p>
            Kortelė atidaro jūsų „Google“ atsiliepimų puslapį. Nuorodą galima
            keisti, o skenavimus – stebėti.
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
                Svetainės · verslo sistemos · automatizavimas
              </p>
              <h1>
                Kuriame interneto svetaines, e. parduotuves ir verslo sistemas.
              </h1>
              <p className="studio-hero-description">
                Kuriame ir atnaujiname verslo svetaines, diegiame registracijos,
                užsakymų ir klientų valdymo sistemas. Sujungiame naudojamas
                programas ir automatizuojame pasikartojančius darbus.
              </p>
              <div className="studio-hero-actions">
                <Link
                  to="/kontaktai?intent=project"
                  className="studio-button"
                  data-conversion="hero_project"
                >
                  Aptarti projektą
                  <ArrowUpRight size={19} aria-hidden />
                </Link>
                <Link to="/paslaugos" className="studio-text-link">
                  Peržiūrėti paslaugas
                  <ArrowRight size={18} aria-hidden />
                </Link>
              </div>
              <p className="studio-hero-note">
                Pirmiausia aptarsime poreikį ir pasiūlysime tinkamiausią
                sprendimo kryptį.
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
            title="Svetainių ir sistemų pavyzdžiai"
            action={
              <Link className="studio-text-link" to="/sprendimai">
                Visi pavyzdžiai
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
      <TrustSection />
      <ProcessSection />
      <ProductSpotlight />
      <DemoCTA />
    </main>
  );
}
