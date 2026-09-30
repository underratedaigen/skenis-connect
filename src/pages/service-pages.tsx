import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { PublicLayout } from "@/components/public/site-layout";
import { Seo } from "@/components/public/seo";
import {
  DemoCTA,
  SectionHeading,
  ProcessSection,
} from "@/components/public/studio-landing";
import { ServiceVisual, ServiceTeaser } from "@/components/public/studio-demos";
import { getServiceBySlug, type ServiceCategory } from "@/data/services";
import { servicePresentation } from "@/data/service-presentation";
import {
  serviceContent,
  serviceOrder,
  demoOptions,
} from "@/data/public-content";
import { NotFoundPage } from "./public-pages";
import { AnimatedFAQ, ServicesShowcase } from "@/motion/scenes";

const capabilitySections: Record<string, [string, number, number?][]> = {
  svetaines: [
    ["Svetainė pagal jūsų veiklą", 0, 7],
    ["Matomumas paieškoje", 7, 10],
    ["Kokybė ir priežiūra", 10],
  ],
  registracijos: [
    ["Vizito kelias", 0, 5],
    ["Registracijos skirtingoms situacijoms", 5],
  ],
  "pardavimu-irankiai": [
    ["Kontaktai ir pardavimo eiga", 0, 4],
    ["Pasiūlymai ir tolesnis bendravimas", 4],
  ],
  skaiciuokles: [
    ["Skaičiuoklės pagal veiklą", 0, 4],
    ["Sąmatų rengimas", 4],
  ],
  "verslo-sistemos": [
    ["Klientai, projektai ir rodikliai", 0, 5],
    ["Komanda ir operacijos", 5, 11],
    ["Individualūs darbo įrankiai", 11],
  ],
  automatizacijos: [
    ["Lentelės ir dokumentai", 0, 4],
    ["Sistemų jungtys ir ataskaitos", 4],
  ],
  "ai-sprendimai": [
    ["Pagalba jūsų klientams", 0, 3],
    ["Komandos žinių paieška", 3],
  ],
  "e-komercija": [
    ["Paslaugos ir klientų erdvės", 0, 6],
    ["Specializuoti katalogai", 6, 9],
    ["Pirkimas ir mokėjimai", 9],
  ],
  atsiliepimai: [
    ["Bendravimas ir suvestinės", 0, 2],
    ["NFC ir QR sprendimai", 2],
  ],
};
const relatedSlugs: Record<string, string[]> = {
  svetaines: ["pardavimu-irankiai", "registracijos", "e-komercija"],
  registracijos: ["automatizacijos", "verslo-sistemos", "atsiliepimai"],
  "pardavimu-irankiai": ["skaiciuokles", "automatizacijos", "svetaines"],
  skaiciuokles: ["pardavimu-irankiai", "verslo-sistemos", "svetaines"],
  "verslo-sistemos": ["automatizacijos", "pardavimu-irankiai", "ai-sprendimai"],
  automatizacijos: ["verslo-sistemos", "ai-sprendimai", "registracijos"],
  "ai-sprendimai": ["automatizacijos", "verslo-sistemos", "e-komercija"],
  "e-komercija": ["automatizacijos", "pardavimu-irankiai", "ai-sprendimai"],
  atsiliepimai: ["svetaines", "registracijos", "automatizacijos"],
};

function CatalogCard({ service }: { service: ServiceCategory }) {
  const content = serviceContent[service.slug];
  const groupId = (
    {
      svetaines: "klientai",
      registracijos: "darbas",
      automatizacijos: "jungtys",
    } as Record<string, string>
  )[service.slug];
  return (
    <article className={`catalog-card catalog-${service.slug}`} id={groupId}>
      <div className="catalog-card-visual">
        <div className="catalog-preview-full">
          <ServiceTeaser slug={service.slug} />
        </div>
        <div className="catalog-preview-small">
          <service.icon size={27} strokeWidth={1.4} aria-hidden />
          <span>
            {
              (
                {
                  svetaines: "forma.",
                  registracijos: "11:00",
                  skaiciuokles: "Pavyzdinė sąmata",
                  "pardavimu-irankiai": "Užklausa → pasiūlymas",
                  "verslo-sistemos": "Darbai + komanda",
                  automatizacijos: "Forma → klientų sistema",
                  "ai-sprendimai": "Atsakymas + šaltinis",
                  "e-komercija": "molė.",
                  atsiliepimai: "NFC + QR",
                } as Record<string, string>
              )[service.slug]
            }
          </span>
        </div>
      </div>
      <div className="catalog-card-copy">
        <h3>{content.title}</h3>
        <p>{content.summary}</p>
        <p className="catalog-example">
          <strong>Pavyzdys:</strong> {content.example}
        </p>
        <Link className="studio-text-link" to={`/paslaugos/${service.slug}`}>
          {content.link} <ArrowUpRight size={18} aria-hidden />
        </Link>
      </div>
    </article>
  );
}
export function ServicesPage() {
  return (
    <PublicLayout>
      <Seo
        title="Svetainių kūrimas, verslo sistemos ir automatizavimas | Skenis"
        description="Interneto svetainių ir elektroninių parduotuvių kūrimas, registracijos, užklausų valdymas, skaičiuoklės, individualios verslo sistemos ir automatizavimas."
        path="/paslaugos"
      />
      <main id="main-content" tabIndex={-1} className="catalog-page">
        <section className="studio-page-intro studio-container">
          <p className="studio-eyebrow">Kuriame tam, kad veiktų</p>
          <div className="page-intro-row">
            <h1>Svetainių kūrimas, verslo sistemos ir automatizavimas.</h1>
            <p>
              Kuriame skaitmeninius sprendimus pagal konkrečius verslo procesus:
              nuo įmonės svetainės ar e. parduotuvės iki registracijų, klientų,
              užsakymų ir vidinių darbų valdymo.
            </p>
          </div>
        </section>
        <ServicesShowcase catalog />
        <section className="studio-container catalog-help">
          <div>
            <h2>Nežinote, nuo ko pradėti?</h2>
            <p>
              Aprašykite vieną darbą, kuris užima per daug laiko. Tinkamą kryptį
              pasiūlysime kartu.
            </p>
          </div>
          <Link to="/kontaktai?intent=project" className="studio-button">
            Aptarti situaciją <ArrowUpRight size={18} aria-hidden />
          </Link>
        </section>
      </main>
    </PublicLayout>
  );
}

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const service = getServiceBySlug(slug);
  if (!service) return <NotFoundPage />;
  const sections = capabilitySections[service.slug];
  const presentation = servicePresentation[service.slug];
  const physical = presentation.family === "physical";
  const content = serviceContent[service.slug];
  return (
    <PublicLayout>
      <Seo
        title={`${service.title} | Skenis`}
        description={service.description}
        path={`/paslaugos/${service.slug}`}
        service={{ name: service.title, description: service.description }}
      />
      <main
        id="main-content"
        tabIndex={-1}
        className={`service-family-${presentation.family}`}
      >
        <section className="studio-page-intro">
          <div className="studio-container">
            <nav className="studio-breadcrumbs" aria-label="Puslapio kelias">
              <Link to="/">Pradžia</Link>
              <span aria-hidden>/</span>
              <Link to="/paslaugos">Paslaugos</Link>
              <span aria-hidden>/</span>
              <span aria-current="page">{service.shortTitle}</span>
            </nav>
            <div className="service-detail-hero">
              <div className="service-detail-copy">
                <p className="studio-eyebrow">Paslauga verslui</p>
                <h1>{content.detailTitle}</h1>
                <p>{service.description}</p>
                <div className="service-detail-actions">
                  <Link
                    className="studio-button"
                    to={`/kontaktai?service=${service.slug}&intent=project`}
                    data-conversion={"service_enquiry"}
                  >
                    {content.cta}
                    <ArrowUpRight size={18} aria-hidden />
                  </Link>
                  <a className="studio-text-link" href="#galimybes">
                    {physical ? "Individualūs sprendimai" : "Ką galime sukurti"}
                    <ArrowDown size={18} aria-hidden />
                  </a>
                </div>
                <div className="service-detail-note">
                  {physical
                    ? "Paruoštas produktas arba sprendimas pagal jūsų aptarnavimo eigą."
                    : "Pirmiausia aptarsime poreikį, darbų apimtį ir projekto eigą."}
                </div>
              </div>
              <div className="service-detail-demo">
                <p className="demo-stage-caption">
                  {demoOptions.find((demo) => demo.slug === service.slug)
                    ?.title || "Skenis produktas – NFC ir QR kortelė"}
                </p>
                <ServiceVisual slug={service.slug} variant="context" />
              </div>
            </div>
          </div>
        </section>
        <section className="service-audience studio-container">
          <h2>Kam ši paslauga skirta</h2>
          <p>{content.audience}</p>
        </section>
        <section
          className="service-comparison studio-container"
          aria-label="Problema ir paslaugos nauda"
        >
          <div>
            <span className="studio-eyebrow">Kokią problemą sprendžiame</span>
            <p>{presentation.before}</p>
          </div>
          <ArrowRight className="comparison-arrow" size={24} aria-hidden />
          <div>
            <span className="studio-eyebrow">Ką pakeičia ši paslauga</span>
            <p>{presentation.after}</p>
          </div>
        </section>
        {physical && (
          <section className="studio-container physical-options">
            <article>
              <p className="studio-eyebrow">Paruoštas produktas</p>
              <h2>NFC + QR kortelė</h2>
              <p>
                Kortelė, valdoma nuoroda ir skenavimų statistika. Kiekį ir
                kainodarą rasite produkto puslapyje.
              </p>
              <Link to="/google-atsiliepimai" className="studio-text-link">
                Peržiūrėti produktą <ArrowUpRight size={18} aria-hidden />
              </Link>
            </article>
            <article>
              <p className="studio-eyebrow">Pagal jūsų procesą</p>
              <h2>Individualus ryšys</h2>
              <p>
                Kvietimai po vizito, keli filialai ar jungtis su turima sistema.
                Galimybes ir apimtį įvertiname atskirai.
              </p>
              <Link
                to="/kontaktai?service=atsiliepimai&intent=project"
                className="studio-text-link"
              >
                Aptarti integraciją <ArrowUpRight size={18} aria-hidden />
              </Link>
            </article>
          </section>
        )}
        <section className="studio-section" id="galimybes">
          <div className="studio-container service-section-grid">
            <div>
              <p className="studio-eyebrow">Ką konkrečiai galime sukurti</p>
              <h2>{presentation.heading}</h2>
              <p>{service.outcome}</p>
            </div>
            <div className="capability-groups">
              {sections.map(([title, start, end], i) => {
                const items = service.capabilities.slice(start, end);
                const list = (
                  <ul>
                    {items.map((item) => (
                      <li key={item}>
                        <Check size={17} aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
                return items.length === 1 ? (
                  <article className="capability-open" key={title}>
                    <h3>{title}</h3>
                    {list}
                  </article>
                ) : (
                  <details key={title} open={i === 0}>
                    <summary>
                      <span>{title}</span>
                      <small>
                        {items.length}{" "}
                        {new Intl.PluralRules("lt").select(items.length) ===
                        "few"
                          ? "galimybės"
                          : "galimybių"}
                      </small>
                      <ChevronDown size={18} aria-hidden />
                    </summary>
                    {list}
                  </details>
                );
              })}
            </div>
          </div>
        </section>
        <section className="studio-section section-no-top">
          <div className="studio-container">
            <SectionHeading
              label="Galimi pritaikymai"
              title={presentation.exampleHeading}
            >
              Iliustraciniai scenarijai, kuriuos pritaikome konkrečiai veiklai.
            </SectionHeading>
            <div className="service-examples">
              {service.examples.map((example, i) => (
                <article key={example.title}>
                  <span>0{i + 1}</span>
                  <h3>{example.title}</h3>
                  <ol className="example-flow">
                    {presentation.flows[i].map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <p>{example.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <ProcessSection service={service.slug} />
        <section className="studio-section section-divider">
          <div className="studio-container service-section-grid service-faq-related">
            <div>
              <p className="studio-eyebrow">Prieš pradedant</p>
              <h2>Dažniausi klausimai</h2>
              <Link
                className="studio-text-link"
                to={`/kontaktai?service=${service.slug}&intent=project`}
                data-conversion="service_enquiry"
              >
                {content.cta} <ArrowUpRight size={18} aria-hidden />
              </Link>
              <p className="related-label">Dažnai veikia kartu</p>
              <div className="studio-related">
                {relatedSlugs[service.slug].map((s) => {
                  const related = getServiceBySlug(s)!;
                  return (
                    <Link key={s} to={`/paslaugos/${s}`}>
                      <related.icon size={19} aria-hidden />
                      {related.shortTitle}
                      <ArrowUpRight size={17} aria-hidden />
                    </Link>
                  );
                })}
              </div>
            </div>
            <AnimatedFAQ items={service.faq} />
          </div>
        </section>

      </main>
    </PublicLayout>
  );
}
