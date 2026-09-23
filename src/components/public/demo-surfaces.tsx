import { useId, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCheck,
  FileText,
  Mail,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
export const interiorImage = "/images/forma-interior-v2.webp";
export const ceramicImage = "/images/ceramic-planter-v2.webp";
const money = (n: number) =>
  new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR" }).format(
    n,
  );

export function FormaSurface({
  compact = false,
  children,
}: {
  compact?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`forma-surface ${compact ? "forma-compact" : ""}`}>
      <div className="forma-nav">
        <strong>
          forma<span> / interjerai</span>
        </strong>
        <span>Erdvės su mintimi.</span>
      </div>
      <div className="forma-composition">
        <img
          src={interiorImage}
          width="1440"
          height="960"
          alt="Sugeneruotas interjero vaizdas: šviesi sofa, medžio ir akmens detalės"
          loading={compact ? undefined : "lazy"}
        />
        <div className="forma-copy">
          <span>Gyventi savaip.</span>
          <h3>
            Namai, kuriuose
            <br />
            norisi likti.
          </h3>
          {children}
        </div>
        <span className="forma-caption">01 / Šviesos ir medžiagų dialogas</span>
      </div>
      {!compact && (
        <div className="forma-services">
          <span>Interjero koncepcija</span>
          <span>Detalus projektas</span>
          <span>Įgyvendinimo palydėjimas</span>
        </div>
      )}
    </div>
  );
}
export function WebsitePreview({
  variant = "full",
}: {
  variant?: "full" | "context";
}) {
  const [sent, setSent] = useState(false);
  return (
    <div className={`demo-website ${variant}`}>
      <FormaSurface compact={variant === "context"}>
        <button
          type="button"
          className="forma-cta"
          onClick={() => setSent(!sent)}
        >
          {sent ? "Pradėti iš naujo" : "Aptarti erdvę"}
          <ArrowUpRight size={17} aria-hidden />
        </button>
      </FormaSurface>
      <div className="demo-website-result" role="status">
        <CheckCheck size={18} aria-hidden />
        <span>
          {sent
            ? "Pavyzdinė užklausa perduota projekto vadovui. Duomenys nesiunčiami."
            : "Svetainės koncepcija · sugeneruotas iliustracinis interjeras."}
        </span>
      </div>
    </div>
  );
}
export function HeroDemo() {
  const id = useId();
  const [mode, setMode] = useState(0),
    [done, setDone] = useState(false),
    [time, setTime] = useState("11:00");
  return (
    <div className="hero-scene">
      <div className="hero-scene-top">
        <span>Vienas ryšys. Mažiau rutinos.</span>
        <span>Demo</span>
      </div>
      <div className="hero-scene-main" id={`${id}-scene`}>
        {mode === 0 ? (
          <FormaSurface compact>
            <button
              className="forma-cta"
              type="button"
              onClick={() => setDone(!done)}
            >
              {done ? "Pakartoti užklausą" : "Aptarti erdvę"}
              <ArrowUpRight size={16} aria-hidden />
            </button>
          </FormaSurface>
        ) : mode === 1 ? (
          <div className="hero-booking">
            <span>R. / Laikas jums</span>
            <h3>
              Kitas susitikimas —<br />
              jūsų pasirinktu laiku.
            </h3>
            <p>Rugsėjo 23 · konsultacija</p>
            <div
              className="demo-times"
              role="group"
              aria-label="Hero demonstracijos laikas"
            >
              {["09:00", "11:00", "14:30"].map((t) => (
                <button
                  type="button"
                  key={t}
                  aria-pressed={t === time}
                  onClick={() => {
                    setTime(t);
                    setDone(false);
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              className="demo-action"
              type="button"
              onClick={() => setDone(!done)}
            >
              {done ? "Pasirinkti iš naujo" : "Patvirtinti demo laiką"}
              <ArrowRight size={16} aria-hidden />
            </button>
          </div>
        ) : (
          <div className="hero-document-scene">
            <div>
              <FileText size={24} aria-hidden />
              <span>Pasiūlymas / 024</span>
            </div>
            <h3>
              Užklausa tampa
              <br />
              paruoštu dokumentu.
            </h3>
            <dl>
              <div>
                <dt>Paslauga</dt>
                <dd>Interjero projektas</dd>
              </div>
              <div>
                <dt>Apimtis</dt>
                <dd>80 m² · biuro erdvė</dd>
              </div>
            </dl>
            <button
              className="demo-action"
              type="button"
              onClick={() => setDone(!done)}
            >
              {done ? "Pakartoti procesą" : "Paruošti juodraštį"}
              <ArrowRight size={16} aria-hidden />
            </button>
          </div>
        )}
      </div>
      <div
        className={`hero-result-path ${done ? "completed" : ""}`}
        role="status"
      >
        <div>
          <Mail size={18} aria-hidden />
          <span>
            {["Nauja užklausa", `${time} · vizitas`, "Formos duomenys"][mode]}
          </span>
        </div>
        <ArrowRight size={22} aria-hidden />
        <div>
          <CheckCheck size={20} aria-hidden />
          <span>
            <strong>
              {
                [
                  "Komanda turi kitą žingsnį",
                  "Laikas kalendoriuje",
                  "Juodraštis peržiūrai",
                ][mode]
              }
            </strong>
            <small>
              {done
                ? "Demo atlikta · niekas nesiunčiama"
                : "Taip atrodo sujungtas procesas"}
            </small>
          </span>
        </div>
      </div>
      <div
        className="hero-mode-switch"
        role="group"
        aria-label="Demonstracijos režimas"
      >
        {["Svetainė", "Registracija", "Automatizacija"].map((m, i) => (
          <button
            type="button"
            key={m}
            aria-pressed={mode === i}
            aria-controls={`${id}-scene`}
            onClick={() => {
              setMode(i);
              setDone(false);
            }}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="demo-panel">
      <div className="demo-panel-head">
        <strong>{title}</strong>
        <span className="demo-label">Demonstracija</span>
      </div>
      <div className="demo-panel-body">{children}</div>
    </div>
  );
}
const flow = [
  {
    title: "Gauta forma",
    value: "Interjero projektas · 80 m²",
    result: "Poreikis užfiksuotas",
    detail: "Užklausa #024 · biuro erdvės atnaujinimas.",
  },
  {
    title: "Sutvarkyti duomenys",
    value: "Paslauga: interjeras / plotas: 80",
    result: "Vienas įrašas sistemoje",
    detail: "Paslauga ir plotas perkelti į projekto laukus.",
  },
  {
    title: "Komandos užduotis",
    value: "Lina · rugsėjo 25 d.",
    result: "Aišku, kas tęsia darbą",
    detail: "Linai priskirta užduotis paruošti projekto apimties pasiūlymą.",
  },
  {
    title: "Pranešimo juodraštis",
    value: "„Gavome jūsų užklausą…“",
    result: "Paruošta žmogaus peržiūrai",
    detail:
      "Pranešime yra paslauga, plotas ir kitas žingsnis. Niekas neišsiųsta.",
  },
];
export function WorkflowPreview() {
  const [step, setStep] = useState(0);
  return (
    <Panel title="Nuo formos iki komandos">
      <ol className="flow-track">
        {flow.map((s, i) => (
          <li className={i <= step ? "reached" : ""} key={s.title}>
            <span>{i + 1}</span>
            <strong>{s.title}</strong>
            <small>{s.value}</small>
          </li>
        ))}
      </ol>
      <div className="flow-output" role="status">
        <span>Žingsnio rezultatas</span>
        <strong>{flow[step].result}</strong>
        <p>{flow[step].detail}</p>
      </div>
      <button
        className="demo-action"
        type="button"
        onClick={() => setStep((step + 1) % 4)}
      >
        {step === 3 ? "Pakartoti procesą" : "Kitas proceso žingsnis"}
        <ArrowRight size={17} aria-hidden />
      </button>
      <p className="demo-status">
        Pavyzdiniai duomenys. Išorinės sistemos neprijungtos.
      </p>
    </Panel>
  );
}
export function SalesDemo() {
  const [stage, setStage] = useState(0);
  const stages = ["Nauja", "Aptarimas", "Pasiūlymas"];
  return (
    <Panel title="Užklausų centras">
      <ol className="sales-pipeline">
        {stages.map((s, i) => (
          <li key={s} className={i === stage ? "selected" : ""}>
            <span>0{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      <div className="sales-record">
        <span className="demo-overline">Užklausa #024 · demonstracinė</span>
        <h3>Biuro erdvės atnaujinimas</h3>
        <div className="record-meta">
          <span>80 m²</span>
          <span>Interjero projektas</span>
          <span>Lina · projektų vadovė</span>
        </div>
        <div className="sales-next" role="status">
          <small>{stages[stage]} · kitas veiksmas</small>
          <strong>
            {
              [
                "Suderinti 20 min. pokalbį",
                "Patikslinti apimtį ir biudžetą",
                "Peržiūrėti pasiūlymo juodraštį",
              ][stage]
            }
          </strong>
          <span>
            {
              [
                "Rugsėjo 24 d., 11:00",
                "Susitikimo pastabos pridėtos",
                "Paslauga ir 80 m² apimtis perkelta į pasiūlymą",
              ][stage]
            }
          </span>
        </div>
      </div>
      <button
        className="demo-action"
        type="button"
        onClick={() => setStage((stage + 1) % 3)}
      >
        {stage === 2 ? "Grįžti į pradžią" : "Perkelti į kitą etapą"}
        <ArrowRight size={17} aria-hidden />
      </button>
    </Panel>
  );
}
const jobs = [
  {
    title: "Biuro įrengimas",
    person: "Lina",
    date: "09.25",
    status: "Vykdoma",
    task: "Patvirtinti apdailos medžiagas",
    doc: "Apdailos specifikacija.pdf",
  },
  {
    title: "Svetainės turinys",
    person: "Tomas",
    date: "09.28",
    status: "Peržiūra",
    task: "Peržiūrėti paslaugų tekstus",
    doc: "Turinio struktūra.pdf",
  },
  {
    title: "Salono registracija",
    person: "Ieva",
    date: "09.30",
    status: "Planuojama",
    task: "Suderinti darbuotojų darbo laikus",
    doc: "Registracijos taisyklės.pdf",
  },
];
export function BusinessDemo() {
  const [selected, setSelected] = useState(0);
  const j = jobs[selected];
  return (
    <Panel title="Komandos darbai">
      <div
        className="job-list"
        role="group"
        aria-label="Demonstracinis projektas"
      >
        <div className="job-table-head" aria-hidden>
          <span>Projektas / atsakingas</span>
          <span>Terminas</span>
          <span>Būsena</span>
        </div>
        {jobs.map((j, i) => (
          <button
            type="button"
            key={j.title}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            <span>
              <strong>{j.title}</strong>
              <small>{j.person}</small>
            </span>
            <span>{j.date}</span>
            <span className="job-status">{j.status}</span>
          </button>
        ))}
      </div>
      <div className="job-detail" aria-live="polite">
        <span className="demo-chip">{j.status}</span>
        <h3>{j.title}</h3>
        <p>
          <strong>Kitas darbas:</strong> {j.task}.
        </p>
        <div>
          <FileText size={17} aria-hidden />
          <span>{j.doc}</span>
        </div>
        <small>
          Atsakingas žmogus: {j.person} · terminas: {j.date}
        </small>
      </div>
      <p className="demo-status">
        Pavyzdiniai projektai, žmonės ir dokumentai.
      </p>
    </Panel>
  );
}
const answers = [
  {
    q: "Kaip pradėti naują projektą?",
    title: "Pradėkite nuo projekto kortelės.",
    text: "Užfiksuokite poreikį, priskirkite atsakingą žmogų ir sutarkite pirmo aptarimo laiką.",
    source:
      "Kiekvienas naujas projektas turi atsakingą asmenį ir sutartą kitą žingsnį.",
    doc: "Projekto pradžios atmintinė · 2 sk.",
  },
  {
    q: "Kas patvirtina pasiūlymą?",
    title: "Juodraštį peržiūri projekto vadovas.",
    text: "Patikrinkite darbų apimtį, kainą ir terminą. Klientui siunčiama tik patvirtinta versija.",
    source:
      "Prieš siuntimą projekto vadovas patvirtina pasiūlymo apimtį, kainą ir terminą.",
    doc: "Pasiūlymų rengimo taisyklės · 3 sk.",
  },
];
export function AssistantDemo() {
  const [selected, setSelected] = useState(0);
  const a = answers[selected];
  return (
    <Panel title="Komandos žinių asistentas">
      <div
        className="ai-questions"
        role="group"
        aria-label="Pavyzdinis klausimas"
      >
        {answers.map((a, i) => (
          <button
            type="button"
            key={a.q}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            {a.q}
          </button>
        ))}
      </div>
      <div className="ai-response" role="status">
        <Sparkles size={22} aria-hidden />
        <h3>{a.title}</h3>
        <p>{a.text}</p>
        <blockquote>
          <FileText size={17} aria-hidden />
          <div>
            <span>{a.doc}</span>
            <p>„{a.source}“</p>
          </div>
        </blockquote>
      </div>
      <p className="demo-status">
        Iš anksto parengti atsakymai ir šaltiniai. AI neprijungtas; tikrą
        atsakymą peržiūri žmogus.
      </p>
    </Panel>
  );
}
export function CommerceDemo() {
  const [variant, setVariant] = useState(0),
    [added, setAdded] = useState(false);
  const sizes = [
    { label: "Ø 18 cm", price: 24 },
    { label: "Ø 24 cm", price: 32 },
  ];
  const item = sizes[variant];
  return (
    <div className="commerce-demo">
      <div className="commerce-brand">
        <strong>molė.</strong>
        <span>Daiktai lėtam gyvenimui · koncepcija</span>
        <ShoppingBag size={20} aria-hidden />
      </div>
      <div className="commerce-grid">
        <img
          src={ceramicImage}
          width="1000"
          height="1000"
          alt="Sugeneruotas keraminio vazono su alyvmedžiu produkto vaizdas"
          loading="lazy"
        />
        <div className="commerce-copy">
          <span className="demo-overline">Namų kolekcija / 01</span>
          <h3>Žemės ramybė.</h3>
          <p>Matinis keraminis vazonas. Smėlio atspalvis, švelni faktūra.</p>
          <strong className="commerce-price">{money(item.price)}</strong>
          <div
            className="demo-times"
            role="group"
            aria-label="Pavyzdinės prekės dydis"
          >
            {sizes.map((s, i) => (
              <button
                type="button"
                key={s.label}
                aria-pressed={variant === i}
                onClick={() => {
                  setVariant(i);
                  setAdded(false);
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button
            className="demo-action"
            type="button"
            onClick={() => setAdded(!added)}
          >
            {added ? "Išvalyti demo krepšelį" : "Į demo krepšelį"}
            <ShoppingBag size={17} aria-hidden />
          </button>
          <div className="commerce-cart" role="status">
            <span>{added ? "Krepšelio santrauka" : "Jūsų pasirinkimas"}</span>
            <strong>
              {added ? "1 vnt. · " : ""}Smėlio · {item.label} ·{" "}
              {money(item.price)}
            </strong>
            <small>
              Demonstracinė prekė ir iliustracija. Užsakymas nesukuriamas.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
