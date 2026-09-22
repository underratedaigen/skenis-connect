import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronRight,
  CircleDot,
  FileText,
  LayoutGrid,
  Mail,
  Plus,
  Send,
  Star,
  Workflow,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { primaryServices } from "@/data/services";
import { projects } from "@/data/projects";
import { trackConversion } from "@/lib/conversion-events";

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

export function DemoCTA({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={`studio-demo-cta ${compact ? "compact" : ""}`}
      id="nemokamas-pavyzdys"
    >
      <div className="studio-container studio-demo-grid">
        <div>
          <p className="studio-eyebrow">
            <span className="studio-status-dot" /> Pirmas žingsnis – be
            įsipareigojimo
          </p>
          <h2>
            Pamatykite prieš
            <br />
            <span>nuspręsdami.</span>
          </h2>
        </div>
        <div>
          <p>
            Papasakokite, ką norėtumėte pagerinti. Kai projektas tam tinkamas,
            paruošime nemokamą pradinį pavyzdį. Pamatysite kryptį, o tada
            nuspręsite.
          </p>
          <Link
            to="/kontaktai?intent=demo"
            className="studio-button light"
            data-conversion="free_demo_cta"
          >
            Gauti nemokamą pavyzdį <ArrowUpRight size={18} aria-hidden />
          </Link>
          <span className="studio-demo-note">
            Pradinė koncepcija, kurios apimtį sutariame kartu.
          </span>
        </div>
      </div>
    </section>
  );
}

export function WorkflowPreview({ small = false }: { small?: boolean }) {
  return (
    <div
      role="img"
      aria-label="Koncepcija: užklausa iš svetainės perduodama į CRM, paruošiamas pasiūlymas ir išsiunčiamas patvirtinimas."
      className={`studio-workflow-preview ${small ? "small" : ""}`}
    >
      <div className="studio-ui-top">
        <span>
          <LayoutGrid size={14} aria-hidden /> Jūsų verslo sistema
        </span>
        <span className="studio-ui-demo">Koncepcija</span>
      </div>
      <div className="studio-ui-body">
        <div className="studio-ui-title">
          <div>
            <span className="studio-mono">VISKAS SAVO VIETOJE</span>
            <h3>Gera diena darbui.</h3>
          </div>
          <span className="studio-ui-avatar">S</span>
        </div>
        <div className="studio-ui-summary">
          <div>
            <span>Užklausa gauta</span>
            <strong>
              <Mail size={17} aria-hidden /> Svetainė
            </strong>
          </div>
          <ChevronRight size={16} aria-hidden />
          <div>
            <span>Duomenys perduoti</span>
            <strong>
              <LayoutGrid size={17} aria-hidden /> CRM sistema
            </strong>
          </div>
        </div>
        <div className="studio-ui-task-heading">
          <span>Darbo eiga</span>
          <span className="studio-ui-live">
            <i /> Automatizuota
          </span>
        </div>
        <div className="studio-ui-tasks">
          {[
            ["Nauja kliento užklausa", "Forma svetainėje"],
            ["Pasiūlymas paruoštas", "Pagal kliento pasirinkimus"],
            ["Patvirtinimas išsiųstas", "El. paštu, be papildomo darbo"],
          ].map(([title, sub], i) => (
            <div className="studio-ui-task" key={title}>
              <span className="studio-ui-task-icon">
                {i === 0 ? (
                  <Mail size={16} />
                ) : i === 1 ? (
                  <FileText size={16} />
                ) : (
                  <Send size={16} />
                )}
              </span>
              <div>
                <strong>{title}</strong>
                <small>{sub}</small>
              </div>
              <Check size={16} aria-label="Atlikta" />
            </div>
          ))}
        </div>
        <div className="studio-ui-result">
          <CheckCheck size={18} aria-hidden />
          <span>Mažiau kopijavimo. Daugiau laiko klientui.</span>
        </div>
      </div>
    </div>
  );
}

export function BookingPreview() {
  const [selected, setSelected] = useState("11:00");
  return (
    <div className="studio-booking-preview">
      <div className="studio-preview-caption">
        <CalendarDays size={16} aria-hidden /> Vizito registracija{" "}
        <span>Demo</span>
      </div>
      <div className="studio-calendar-header">
        <strong>Pasirinkite patogų laiką</strong>
        <span>Rugsėjis</span>
      </div>
      <div className="studio-calendar-days">
        {["P", "A", "T", "K", "P", "Š", "S"].map((day, i) => (
          <div key={i} className={i === 2 ? "selected" : ""}>
            <span>{day}</span>
            <b>{21 + i}</b>
          </div>
        ))}
      </div>
      <div className="studio-time-slots">
        {["09:00", "11:00", "14:30"].map((time) => (
          <button
            key={time}
            type="button"
            aria-pressed={time === selected}
            onClick={() => setSelected(time)}
            className={time === selected ? "selected" : ""}
          >
            {time}
          </button>
        ))}
      </div>
      <div className="studio-booking-confirm" aria-live="polite">
        <Check size={15} aria-hidden /> Pasirinktas laikas: {selected}
        <span>60 min.</span>
      </div>
    </div>
  );
}

export function WebsitePreview() {
  return (
    <div
      role="img"
      className="studio-website-preview"
      aria-label="Paslaugų įmonės svetainės koncepcija"
    >
      <div className="studio-preview-browser">
        <i />
        <i />
        <i />
        <span>Jūsų verslo svetainė</span>
      </div>
      <div className="studio-mini-site">
        <div className="studio-mini-nav">
          <strong>
            JŪSŲ VERSLAS<span>®</span>
          </strong>
          <span>Paslaugos &nbsp; Apie &nbsp; Kontaktai</span>
        </div>
        <div className="studio-mini-content">
          <span>AIŠKUMAS NUO PIRMO PASPAUDIMO</span>
          <h3>
            Jūsų patirtis.
            <br />
            Aiškiai pristatyta.
          </h3>
          <span className="studio-mini-button">
            Susisiekime <ArrowUpRight size={12} />
          </span>
        </div>
        <div className="studio-mini-shape" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className="studio-mini-footer">
          Apgalvota struktūra <span>Patogus kelias iki užklausos ↗</span>
        </div>
      </div>
    </div>
  );
}

export function CalculatorPreview() {
  const [area, setArea] = useState(60);
  return (
    <div className="studio-calculator-preview">
      <div className="studio-preview-caption">
        <FileText size={16} aria-hidden /> Sąmatos skaičiuoklė <span>Demo</span>
      </div>
      <label htmlFor="demo-area">
        Pasirinkite patalpų plotą <strong>{area} m²</strong>
      </label>
      <input
        id="demo-area"
        type="range"
        min="20"
        max="200"
        step="10"
        value={area}
        onChange={(e) => setArea(Number(e.target.value))}
      />
      <div className="studio-calc-row">
        <span>Pavyzdinis įkainis</span>
        <b>15 € / m²</b>
      </div>
      <div className="studio-calc-result" aria-live="polite">
        <span>Preliminari suma</span>
        <strong>{new Intl.NumberFormat("lt-LT").format(area * 15)} €</strong>
      </div>
      <p>Iliustraciniai skaičiai. Tai nėra Skenis paslaugų kaina.</p>
    </div>
  );
}

const needs = [
  {
    title: "Gauti daugiau užklausų",
    heading: "Svetainė, kuri padeda žengti kitą žingsnį.",
    text: "Aiškiai pristatytos paslaugos, patogi užklausos forma ir tiesus kelias iki jūsų komandos.",
    slug: "svetaines",
    icon: ArrowUpRight,
  },
  {
    title: "Sutaupyti komandos laiko",
    heading: "Pasikartojančius darbus perduokite sistemai.",
    text: "Sujungiame formas, el. paštą ir jūsų naudojamus įrankius, kad duomenų nereikėtų kopijuoti rankomis.",
    slug: "automatizacijos",
    icon: Workflow,
  },
  {
    title: "Automatizuoti registracijas",
    heading: "Klientas užsiregistruoja. Jūs dirbate.",
    text: "Laisvi laikai, rezervacijos ir automatiniai priminimai vienoje vietoje, be nuolatinių skambučių.",
    slug: "registracijos",
    icon: CalendarDays,
  },
  {
    title: "Tvarkingai valdyti verslą",
    heading: "Viena sistema vietoje penkių lentelių.",
    text: "Klientai, užsakymai ir darbų eiga matomi ten, kur patogu visai komandai.",
    slug: "verslo-sistemos",
    icon: LayoutGrid,
  },
  {
    title: "Surinkti daugiau atsiliepimų",
    heading: "Trumpesnis kelias iki kliento atsiliepimo.",
    text: "NFC ir QR kortelės bei valdomos nuorodos padeda paprašyti atsiliepimo tinkamu metu.",
    slug: "atsiliepimai",
    icon: Star,
  },
];

function NeedsSelector() {
  const [index, setIndex] = useState(0);
  const need = needs[index];
  const Icon = need.icon;
  return (
    <section className="studio-needs studio-section" id="privalumai">
      <div className="studio-container">
        <SectionHeading
          label="Nuo problemos iki sprendimo"
          title="Ką norėtumėte pagerinti?"
        >
          Nereikia žinoti, kokios sistemos jums reikia. Pradėkime nuo to, kas
          šiandien stringa.
        </SectionHeading>
        <div className="studio-needs-grid">
          <div
            className="studio-need-options"
            role="group"
            aria-label="Pasirinkite verslo poreikį"
          >
            {needs.map((item, i) => (
              <button
                type="button"
                aria-pressed={index === i}
                aria-controls="need-recommendation"
                key={item.slug}
                onClick={() => {
                  setIndex(i);
                  trackConversion("need_selected", { service: item.slug });
                }}
              >
                <span>{item.title}</span>
                {index === i ? (
                  <ArrowRight size={18} aria-hidden />
                ) : (
                  <Plus size={17} aria-hidden />
                )}
              </button>
            ))}
          </div>
          <div
            className="studio-need-answer"
            id="need-recommendation"
            aria-live="polite"
          >
            <span className="studio-icon-tile">
              <Icon size={24} aria-hidden />
            </span>
            <p className="studio-eyebrow">Galimas sprendimas</p>
            <h3>{need.heading}</h3>
            <p>{need.text}</p>
            <Link to={`/paslaugos/${need.slug}`} className="studio-text-link">
              Daugiau apie sprendimą <ArrowUpRight size={17} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const industries = [
  [
    "Paslaugų verslams",
    "Registracija internetu, klientų priminimai ir aiškus paslaugų pristatymas.",
    "registracijos",
  ],
  [
    "Autoservisams",
    "Remonto užklausos, preliminarios sąmatos ir darbų būklė klientui.",
    "skaiciuokles",
  ],
  [
    "Grožio salonams",
    "Laisvi specialistų laikai ir rezervacijos be nuolatinių skambučių.",
    "registracijos",
  ],
  [
    "Klinikoms",
    "Patogus paslaugų pristatymas ir registracija konsultacijai.",
    "svetaines",
  ],
  [
    "Statybų įmonėms",
    "Darbų sąmatos, projektų eiga ir dokumentai vienoje vietoje.",
    "verslo-sistemos",
  ],
  [
    "NT brokeriams",
    "Objektų katalogas, užklausos ir būsto skaičiuoklės.",
    "e-komercija",
  ],
  [
    "Restoranams",
    "QR meniu, užsakymai internetu ir paprastesnis atsiliepimų rinkimas.",
    "e-komercija",
  ],
  [
    "B2B ir gamybai",
    "Partnerių portalai, užsakymų valdymas ir sistemų integracijos.",
    "verslo-sistemos",
  ],
];

function Industries() {
  const [selected, setSelected] = useState(0);
  return (
    <section className="studio-industries studio-section" id="kam-tinka">
      <div className="studio-container studio-industries-grid">
        <div>
          <p className="studio-eyebrow">Pritaikyta jūsų veiklai</p>
          <h2>
            Skirtingi verslai.
            <br />
            Tas pats aiškumo poreikis.
          </h2>
        </div>
        <div>
          <div
            className="studio-industry-options"
            role="group"
            aria-label="Verslo sritis"
          >
            {industries.map(([title], i) => (
              <button
                type="button"
                key={title}
                aria-pressed={selected === i}
                onClick={() => setSelected(i)}
              >
                {title}
              </button>
            ))}
          </div>
          <div className="studio-industry-result" aria-live="polite">
            <p>{industries[selected][1]}</p>
            <Link to={`/paslaugos/${industries[selected][2]}`}>
              Peržiūrėti galimybes <ArrowUpRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export const processSteps = [
  {
    title: "Suprantame problemą",
    text: "Aptariame jūsų verslą, kas stringa ir kokio rezultato tikitės.",
  },
  {
    title: "Parodome kryptį",
    text: "Pasiūlome sprendimą. Tinkamam projektui paruošiame pradinį nemokamą pavyzdį.",
  },
  {
    title: "Sukuriame ir išbandome",
    text: "Kuriame etapais, deriname su jumis ir patikriname realius naudojimo scenarijus.",
  },
  {
    title: "Paleidžiame ir padedame",
    text: "Perduodame sprendimą, parodome, kaip juo naudotis, ir sutariame dėl priežiūros.",
  },
];

export function ProcessSection() {
  return (
    <section className="studio-process studio-section" id="kaip-dirbame">
      <div className="studio-container">
        <SectionHeading
          label="Kaip dirbame"
          title="Aiškus procesas. Jokio spėliojimo."
          action={
            <Link className="studio-text-link" to="/kontaktai?intent=project">
              Aptarti projektą <ArrowUpRight size={17} aria-hidden />
            </Link>
          }
        />
        <div className="studio-process-grid">
          {processSteps.map((step, i) => (
            <article key={step.title}>
              <div className="studio-process-number">
                <span>0{i + 1}</span>
                <ArrowRight size={18} aria-hidden />
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectGrid() {
  const previews = {
    website: WebsitePreview,
    booking: BookingPreview,
    calculator: CalculatorPreview,
  };
  const backgrounds = { website: "mint", booking: "sand", calculator: "lilac" };
  return (
    <div className="studio-project-grid">
      {projects.map((project) => {
        const Preview = previews[project.preview];
        return (
          <article className="studio-project-card" key={project.id}>
            <div
              className={`studio-project-visual ${backgrounds[project.preview]}`}
            >
              <Preview />
            </div>
            <div className="studio-project-info">
              <div>
                <span className="studio-eyebrow">
                  {project.services[0]} ·{" "}
                  {project.kind === "concept"
                    ? "Koncepcija"
                    : "Interaktyvus demo"}
                </span>
                <h3>{project.name}</h3>
              </div>
              <Link
                to={`/paslaugos/${project.serviceSlug}`}
                aria-label={`Apie sprendimą: ${project.services[0]}`}
              >
                <ArrowUpRight size={22} />
              </Link>
            </div>
            <p>{project.description}</p>
          </article>
        );
      })}
    </div>
  );
}
export function StudioLanding() {
  return (
    <main id="main-content">
      <section className="studio-hero">
        <div className="studio-container">
          <div className="studio-hero-grid">
            <div className="studio-hero-copy">
              <p className="studio-eyebrow">
                <span className="studio-status-dot" /> Skaitmeniniai sprendimai
                verslui
              </p>
              <h1>
                Jūsų verslui.
                <br />
                Mažiau rutinos.
                <br />
                <span>Daugiau galimybių.</span>
              </h1>
              <p className="studio-hero-description">
                Kuriame svetaines, sistemas ir automatizacijas, kurios
                palengvina kasdienį darbą ir padeda verslui augti.
              </p>
              <div className="studio-hero-actions">
                <Link
                  to="/kontaktai?intent=demo"
                  className="studio-button"
                  data-conversion="hero_demo"
                >
                  Gauti nemokamą pavyzdį <ArrowUpRight size={18} aria-hidden />
                </Link>
                <Link to="/paslaugos" className="studio-text-link">
                  Peržiūrėti paslaugas <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
              <p className="studio-hero-note">
                <Check size={14} aria-hidden /> Nuo pirmos idėjos iki veikiančio
                sprendimo.
              </p>
            </div>
            <div className="studio-hero-visual">
              <div className="studio-visual-label">
                <span className="studio-mono">SKENIS / SPRENDIMŲ STUDIJA</span>
                <span className="studio-coordinate">01 — 03</span>
              </div>
              <div className="studio-visual-grid">
                <div className="studio-floating-label">
                  <CircleDot size={14} aria-hidden /> Jūsų procesai. Sujungti.
                </div>
                <WorkflowPreview />
                <div className="studio-visual-bottom">
                  <span>
                    <span className="studio-status-dot" /> Mažiau rankinio darbo
                  </span>
                  <span className="studio-mono">DAUGIAU AIŠKUMO ↗</span>
                </div>
              </div>
            </div>
          </div>
          <div className="studio-hero-bottom">
            <span>Gera technologija prasideda nuo jūsų verslo.</span>
            <div>
              <span>Svetainės</span>
              <i />
              <span>Sistemos</span>
              <i />
              <span>Automatizacijos</span>
            </div>
            <a href="#paslaugos" aria-label="Slinkti prie paslaugų">
              <ArrowDown size={17} />
            </a>
          </div>
        </div>
      </section>
      <section className="studio-services studio-section" id="paslaugos">
        <div className="studio-container">
          <SectionHeading
            label="Ką kuriame"
            title="Sprendimai, kurie atlieka darbą."
            action={
              <Link to="/paslaugos" className="studio-text-link">
                Visos paslaugos <ArrowUpRight size={18} aria-hidden />
              </Link>
            }
          >
            Nuo pirmo įspūdžio internete iki procesų, kurių klientas nemato.
          </SectionHeading>
          <div className="studio-service-grid">
            {primaryServices.map((service, i) => (
              <Link
                to={`/paslaugos/${service.slug}`}
                key={service.slug}
                className="studio-service-card"
              >
                <div className="studio-service-card-top">
                  <service.icon size={23} strokeWidth={1.5} aria-hidden />
                  <span className="studio-mono">0{i + 1}</span>
                </div>
                <h3>{service.shortTitle}</h3>
                <p>{service.description}</p>
                <div className="studio-service-card-bottom">
                  <span>{service.examples[0]?.title}</span>
                  <ArrowUpRight size={18} aria-hidden />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <NeedsSelector />
      <section className="studio-work studio-section" id="sprendimai">
        <div className="studio-container">
          <SectionHeading
            label="Idėjos, kurios tampa įrankiais"
            title="Taip galėtų veikti jūsų verslas."
            action={
              <Link className="studio-text-link" to="/sprendimai">
                Apžiūrėti sprendimus <ArrowUpRight size={17} aria-hidden />
              </Link>
            }
          >
            Mūsų paruoštos koncepcijos. Ne klientų projektai – konkretūs
            pavyzdžiai, ką galime sukurti.
          </SectionHeading>
          <ProjectGrid />
        </div>
      </section>
      <ProcessSection />
      <DemoCTA />
      <Industries />
      <section className="studio-reputation studio-section" id="produktas">
        <div className="studio-container studio-reputation-grid">
          <div className="studio-reputation-image">
            <img
              src="/images/skenis-product-perspective.jpg"
              width="1024"
              height="1024"
              alt="Skenis NFC ir QR kortelė Google atsiliepimams rinkti"
              loading="lazy"
            />
            <span className="studio-product-tag">
              <Star size={15} aria-hidden /> Skenis NFC + QR
            </span>
          </div>
          <div>
            <p className="studio-eyebrow">Produktas, nuo kurio pradėjome</p>
            <h2>
              Mažas palietimas.
              <br />
              Tikras atsiliepimas.
            </h2>
            <p>
              NFC ir QR kortelės padeda klientui paprasčiau palikti Google
              atsiliepimą. Ta pati idėja lydi ir kitus mūsų sprendimus: mažiau
              žingsnių, daugiau naudos.
            </p>
            <div className="studio-product-benefits">
              <span>
                <Check size={15} aria-hidden /> Keičiama nuoroda
              </span>
              <span>
                <Check size={15} aria-hidden /> Skenavimų statistika
              </span>
              <span>
                <Check size={15} aria-hidden /> Individualūs kodai
              </span>
            </div>
            <Link to="/google-atsiliepimai" className="studio-button secondary">
              Google atsiliepimų sprendimai{" "}
              <ArrowUpRight size={17} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
      <section className="studio-about-strip studio-section">
        <div className="studio-container studio-about-strip-grid">
          <div>
            <p className="studio-eyebrow">Kodėl Skenis</p>
            <h2>
              Pradedame nuo jūsų.
              <br />
              Technologijas parenkame po to.
            </h2>
          </div>
          <div>
            <p>
              Papasakokite, kas užima per daug laiko arba neveikia taip, kaip
              norėtumėte. Pasiūlysime aiškų sprendimą, sutarsime apimtį ir
              kainą, o kurdami palaikysime ryšį.
            </p>
            <Link to="/apie" className="studio-text-link">
              Susipažinkime <ArrowUpRight size={17} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
      <section className="studio-final-cta">
        <div className="studio-container">
          <div>
            <p className="studio-eyebrow">Pradėkime nuo pokalbio</p>
            <h2>
              Kas jūsų versle galėtų
              <br />
              veikti paprasčiau?
            </h2>
          </div>
          <Link
            to="/kontaktai?intent=project"
            className="studio-button"
            data-conversion="contact_cta"
          >
            Aptarti projektą <ArrowUpRight size={18} aria-hidden />
          </Link>
        </div>
      </section>
    </main>
  );
}

