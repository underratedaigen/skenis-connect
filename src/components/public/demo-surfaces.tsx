import { Link } from "react-router-dom";
import { useEffect, useId, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCheck,
  FileText,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { DemoBenefits, DemoResult } from "./demo-result";
import { useStudioMotion } from "@/motion/motion-provider";
import { formatDemoMoney as money, normalizeQuantity } from "@/lib/demo-state";
export const interiorImage = "/images/forma-interior-v2.webp";
export const ceramicImage = "/images/ceramic-planter-v2.webp";

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

export function WebsitePreview({ variant = "full" }: { variant?: "full" | "context" }) {
  return <div className={"demo-website demo-v2 " + variant}>
    <FormaSurface compact={false}>
      <Link className="forma-cta" to="/kontaktai?service=svetaines&intent=project">Aptarti svetainę <ArrowUpRight size={17} aria-hidden /></Link>
    </FormaSurface>
    <div className="website-understanding">
      <strong>Dizaino koncepcija</strong>
      <p>Per kelias sekundes lankytojas suprastų pasiūlymą: interjero projektavimas, trys paslaugos, iliustracinė darbų kryptis ir aiškus kontaktinis veiksmas.</p>
      <p>„forma“ – sugalvota koncepcija, interjero vaizdas sugeneruotas. Tai nėra kliento projektas. Kontaktas veda į „Skenis“.</p>
      <DemoBenefits id="svetaine" />
    </div>
  </div>;
}
export { HeroDemo } from "./hero-solutions-demo";
function Panel({ title, kind = "Interaktyvi demonstracija", children }: { title: string; kind?: string; children: ReactNode }) {
  return <div className="demo-panel demo-v2">
    <div className="demo-panel-head"><strong>{title}</strong><span className="demo-label">{kind}</span></div>
    <div className="demo-panel-body">{children}</div>
  </div>;
}
const flow = [
  { title: "Gauta forma", detail: "Demonstracinė užklausa: patalpų apdaila, 80 m²." },
  { title: "Patikrinti duomenys", detail: "Paslauga ir plotas patikrinti prieš perkėlimą." },
  { title: "Sukurtas klientas", detail: "Kliento įrašas DEMO-024 su užklausos laukais." },
  { title: "Paskirta užduotis", detail: "Lina: parengti pasiūlymą iki spalio 5 d." },
  { title: "Paruoštas dokumentas", detail: "Pasiūlymo juodraštis pagal formos duomenis." },
  { title: "Informuota komanda", detail: "Pranešimo su įrašu ir užduotimi peržiūra." },
];
export function WorkflowPreview() {
  const [completed, setCompleted] = useState(0), [running, setRunning] = useState(false);
  const { reduced, capture, fallback } = useStudioMotion();
  const quiet = reduced || capture || fallback;
  useEffect(() => {
    if (!running) return;
    if (quiet || completed === flow.length) { setCompleted(flow.length); setRunning(false); return; }
    const timer = window.setTimeout(() => setCompleted(value => value + 1), 400);
    return () => window.clearTimeout(timer);
  }, [running, completed, quiet]);
  const start = () => { setCompleted(quiet ? flow.length : 0); setRunning(!quiet); };
  return <Panel title="Nuo formos iki komandos" kind="Scenarijaus simuliacija">
    <div className="demo-action-row">
      <button className="demo-action" type="button" disabled={running} onClick={start}>{completed === flow.length ? "Paleisti dar kartą" : "Paleisti demonstracinį scenarijų"}<ArrowRight size={17} aria-hidden /></button>
      {running && <button className="demo-reset" type="button" onClick={() => { setCompleted(flow.length); setRunning(false); }}>Praleisti animaciją</button>}
    </div>
    <ol className="automation-steps">{flow.map((step, index) =>
      <li key={step.title} className={index < completed ? "is-done" : ""} aria-current={running && index === completed ? "step" : undefined}>
        <span aria-hidden>{index < completed ? "✓" : index + 1}</span><div><strong>{step.title}</strong><p>{step.detail}</p></div><small>{index < completed ? "Atlikta" : running && index === completed ? "Vykdoma" : "Laukia"}</small>
      </li>)}</ol>
    <p className="demo-status" role="status">{running ? "Atlikta " + completed + " iš 6 veiksmų." : completed === 0 ? "Paspauskite paleidimo mygtuką." : "Atlikti visi 6 veiksmai."}</p>
    {completed === flow.length && <DemoResult id="automatizacija" title="Užklausa paruošta komandos darbui"><p>DEMO-024 · 80 m² · atsakinga Lina · pasiūlymo juodraštis. Pranešimas ir dokumentas tik imituojami.</p></DemoResult>}
    <p className="demo-status">Iš anksto parengti duomenys. Išorinės sistemos neprijungtos, pranešimai nesiunčiami.</p>
  </Panel>;
}
const salesStages = ["Nauja užklausa", "Susisiekta", "Pasiūlymas", "Patvirtinta"];
const inquiries = [
  { title: "Patalpų apdaila", contact: "Užklausos kontaktas A · kontaktas-a@example.com", owner: "Lina", deadline: "Spalio 5 d." },
  { title: "E. parduotuvės katalogas", contact: "Užklausos kontaktas B · kontaktas-b@example.com", owner: "Tomas", deadline: "Spalio 6 d." },
];
const nextActions = ["Suderinti 20 min. pokalbį", "Patikslinti apimtį ir biudžetą", "Gauti pasiūlymo patvirtinimą", "Perduoti sutartą apimtį projektų komandai"];
export function SalesDemo() {
  const id = useId(), [selected, setSelected] = useState(0), [stages, setStages] = useState([0, 0]);
  const inquiry = inquiries[selected], stage = stages[selected];
  return <Panel title="Užklausų centras">
    <label className="demo-field" htmlFor={id + "-inquiry"}>Demonstracinė užklausa<select id={id + "-inquiry"} value={selected} onChange={event => setSelected(Number(event.target.value))}>{inquiries.map((item, index) => <option key={item.title} value={index}>{item.title}</option>)}</select></label>
    <ol className="sales-pipeline demo-sales-stages">{salesStages.map((label, index) => <li key={label} className={index === stage ? "selected" : ""} aria-current={index === stage ? "step" : undefined}><span>0{index + 1}</span>{label}</li>)}</ol>
    <div className="sales-record">
      <h3>{inquiry.title}</h3>
      <dl className="demo-record"><div><dt>Kontaktas</dt><dd>{inquiry.contact}</dd></div><div><dt>Atsakingas žmogus</dt><dd>{inquiry.owner}</dd></div><div><dt>Etapas</dt><dd>{salesStages[stage]}</dd></div><div><dt>Kitas veiksmas</dt><dd>{nextActions[stage]}</dd></div><div><dt>Terminas</dt><dd>{inquiry.deadline}</dd></div></dl>
    </div>
    <div className="demo-action-row"><button className="demo-action" type="button" disabled={stage === 3} onClick={() => setStages(values => values.map((value, index) => index === selected ? Math.min(3, value + 1) : value))}>{stage === 3 ? "Užklausa patvirtinta" : "Perkelti į kitą etapą"}<ArrowRight size={17} aria-hidden /></button><button className="demo-reset" type="button" onClick={() => { setSelected(0); setStages([0, 0]); }}>Pradėti iš naujo</button></div>
    {stage > 0 && <DemoResult id="pardavimai" title={"Užklausos etapas atnaujintas: " + salesStages[stage]}><p>{inquiry.owner} · {nextActions[stage]} · {inquiry.deadline}</p></DemoResult>}
    <p className="demo-status">Užklausos, kontaktai ir žmonės yra iliustraciniai.</p>
  </Panel>;
}
const jobs = [
  { title: "Biuro įrengimas", person: "Lina", date: "Spalio 5 d.", status: "Vykdoma", task: "Patvirtinti apdailos medžiagas", next: "Paruošti darbų grafiką", doc: "Apdailos specifikacija.pdf" },
  { title: "Svetainės turinys", person: "Tomas", date: "Spalio 6 d.", status: "Peržiūra", task: "Peržiūrėti paslaugų tekstus", next: "Perduoti tekstus maketavimui", doc: "Turinio struktūra.pdf" },
  { title: "Salono registracija", person: "Ieva", date: "Spalio 7 d.", status: "Planuojama", task: "Suderinti darbuotojų laikus", next: "Patikrinti registracijos taisykles", doc: "Registracijos taisyklės.pdf" },
];
export function BusinessDemo() {
  const [selected, setSelected] = useState(0), [confirmed, setConfirmed] = useState([false, false, false]);
  const job = jobs[selected], done = confirmed[selected];
  return <Panel title="Komandos darbai">
    <div className="job-list" role="group" aria-label="Demonstracinis projektas">
      {jobs.map((item, index) => <button type="button" key={item.title} aria-pressed={selected === index} onClick={() => setSelected(index)}>
        <span><strong>{item.title}</strong><small>{item.person}</small></span><span>{item.date}</span><span className="job-status">{confirmed[index] ? "Žingsnis atliktas" : item.status}</span>
      </button>)}
    </div>
    <div className="job-detail"><span className="demo-chip">{done ? "Žingsnis atliktas" : job.status}</span><h3>{job.title}</h3>
      <p><strong>Kitas darbas:</strong> {done ? job.next : job.task}.</p><div><FileText size={17} aria-hidden /><span>{job.doc}</span></div><small>Atsakingas žmogus: {job.person} · terminas: {job.date}</small>
    </div>
    <div className="demo-action-row"><button className="demo-action" type="button" disabled={done} onClick={() => setConfirmed(values => values.map((value, index) => index === selected ? true : value))}>{done ? "Žingsnis patvirtintas" : "Patvirtinti kitą žingsnį"}<CheckCheck size={17} aria-hidden /></button><button className="demo-reset" type="button" onClick={() => { setSelected(0); setConfirmed([false, false, false]); }}>Pradėti iš naujo</button></div>
    {done && <DemoResult id="komanda" title="Užduoties būsena atnaujinta"><p>Atlikta: {job.task}. Toliau: {job.next}. Atsakingas žmogus: {job.person} · {job.date}</p></DemoResult>}
    <p className="demo-status">Visi projektai, žmonės ir dokumentai – iliustraciniai, ne klientų darbai.</p>
  </Panel>;
}
const answers = [
  { q: "Kaip pradėti naują projektą?", title: "Pradėkite nuo projekto kortelės.", text: "Užfiksuokite poreikį, priskirkite atsakingą žmogų ir sutarkite pirmo aptarimo laiką.", source: "Kiekvienas naujas projektas turi atsakingą asmenį ir sutartą kitą žingsnį.", doc: "Projekto pradžios atmintinė · 2 sk." },
  { q: "Kas patvirtina pasiūlymą?", title: "Juodraštį peržiūri projekto vadovas.", text: "Patikrinkite darbų apimtį, kainą ir terminą. Klientui siunčiama tik patvirtinta versija.", source: "Prieš siuntimą projekto vadovas patvirtina pasiūlymo apimtį, kainą ir terminą.", doc: "Pasiūlymų rengimo taisyklės · 3 sk." },
];
export function AssistantDemo() {
  const [selected, setSelected] = useState<number | null>(null), answer = selected === null ? null : answers[selected];
  return <Panel title="Komandos žinių asistentas" kind="Scenarijaus simuliacija">
    <p className="demo-simulation-note">Scenarijaus simuliacija – AI neprijungtas</p>
    <div className="ai-questions" role="group" aria-label="Parengtas klausimas">{answers.map((item, index) => <button type="button" key={item.q} aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.q}</button>)}</div>
    {answer ? <><div className="ai-response" role="status"><Sparkles size={22} aria-hidden /><h3>{answer.title}</h3><p>{answer.text}</p><blockquote><FileText size={17} aria-hidden /><div><span>{answer.doc}</span><p>„{answer.source}“</p></div></blockquote><DemoBenefits id="asistentas" /></div><button className="demo-reset" type="button" onClick={() => setSelected(null)}>Pradėti iš naujo</button></> : <p className="demo-status" role="status">Pasirinkite klausimą, kad pamatytumėte atsakymą ir jo šaltinį.</p>}
    <p className="demo-status">Atsakymai ir dokumentų ištraukos parengti šiai simuliacijai. Realiame sprendime būtų naudojama jūsų įmonės žinių bazė ir prieigos taisyklės.</p>
  </Panel>;
}
const sizes = [{ label: "Ø 18 cm", price: 24 }, { label: "Ø 24 cm", price: 32 }];
export function CommerceDemo() {
  const id = useId(), [variant, setVariant] = useState(0), [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<{ variant: number; quantity: number } | null>(null);
  const item = sizes[variant];
  return <div className="commerce-demo demo-v2">
    <div className="commerce-brand"><strong>molė.</strong><span>Demonstracinė prekė</span><ShoppingBag size={20} aria-hidden /></div>
    <div className="commerce-grid"><img src={ceramicImage} width="1000" height="1000" alt="Sugeneruotas keraminio vazono su alyvmedžiu produkto vaizdas" loading="lazy" />
      <div className="commerce-copy"><span className="demo-overline">Namų kolekcija / 01</span><h3>Žemės ramybė.</h3><p>Matinis keraminis vazonas. Smėlio atspalvis.</p><strong className="commerce-price">{money(item.price)}</strong>
        <div className="demo-times" role="group" aria-label="Demonstracinės prekės dydis">{sizes.map((size, index) => <button type="button" key={size.label} aria-pressed={variant === index} onClick={() => setVariant(index)}>{size.label}</button>)}</div>
        <label className="demo-field" htmlFor={id + "-qty"}>Kiekis<input id={id + "-qty"} type="number" min="1" max="20" step="1" value={quantity} onChange={event => setQuantity(normalizeQuantity(event.target.value))} onBlur={event => setQuantity(normalizeQuantity(event.target.value))} /></label>
        <button className="demo-action" type="button" onClick={() => setCart({ variant, quantity })}>Į demonstracinį krepšelį<ShoppingBag size={17} aria-hidden /></button>
        <p className="demo-status">Demonstracinė prekė ir kaina. Tikras užsakymas nesukuriamas.</p>
      </div>
    </div>
    {cart && <div className="demo-cart-result"><DemoResult id="parduotuve" title="Prekė įdėta į demonstracinį krepšelį"><p>Užsakymo suvestinė: smėlio · {sizes[cart.variant].label} · {cart.quantity} vnt. × {money(sizes[cart.variant].price)} = <strong>{money(cart.quantity * sizes[cart.variant].price)}</strong></p><p>Tikras užsakymas nesukurtas.</p></DemoResult></div>}
    <button className="demo-reset commerce-reset" type="button" onClick={() => { setCart(null); setVariant(0); setQuantity(1); }}>Pradėti iš naujo</button>
  </div>;
}
