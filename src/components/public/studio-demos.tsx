import {
  WebsitePreview,
  HeroDemo,
  WorkflowPreview,
  SalesDemo,
  BusinessDemo,
  AssistantDemo,
  CommerceDemo,
  FormaSurface,
  ceramicImage,
} from "./demo-surfaces";
export {
  WebsitePreview,
  HeroDemo,
  WorkflowPreview,
  SalesDemo,
  BusinessDemo,
  AssistantDemo,
  CommerceDemo,
  FormaSurface,
};
import { useId, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { DemoResult } from "./demo-result";
import { estimateArea } from "@/lib/demo-state";

const money = (value: number) =>
  new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR" }).format(
    value,
  );

export function DemoLabel({
  children = "Interaktyvi demonstracija",
}: {
  children?: React.ReactNode;
}) {
  return (
    <span className="demo-label">
      <span aria-hidden />
      {children}
    </span>
  );
}

export function BookingPreview({ variant = "full" }: { variant?: "full" | "context" }) {
  const id = useId(), [service, setService] = useState("");
  const [day, setDay] = useState<number | null>(null), [time, setTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const step = confirmed ? 5 : time ? 4 : day ? 3 : service ? 2 : 1;
  const reset = () => { setService(""); setDay(null); setTime(null); setConfirmed(false); };
  return <div className={"demo-panel demo-booking demo-v2 " + variant}>
    <div className="demo-panel-head"><strong>Laikas jums</strong><DemoLabel>Interaktyvi demonstracija</DemoLabel></div>
    <div className="demo-panel-body">
      <ol className="booking-progress" aria-label="Registracijos eiga">{["Paslauga", "Diena", "Laikas", "Patvirtinimas"].map((label, index) => <li key={label} aria-current={step === index + 1 ? "step" : undefined} className={step > index + 1 ? "is-done" : ""}><span>{step > index + 1 ? "✓" : index + 1}</span>{label}</li>)}</ol>
      <label className="demo-field" htmlFor={id + "-service"}>Paslauga<select id={id + "-service"} value={service} onChange={event => { setService(event.target.value); setDay(null); setTime(null); setConfirmed(false); }}><option value="" disabled>Pasirinkite paslaugą</option><option>Konsultacija · 60 min.</option><option>Susipažinimas · 30 min.</option></select></label>
      <div className="demo-calendar-title"><strong>Spalis, 2026</strong><span>Demonstraciniai laikai</span></div>
      <div className="demo-days" role="group" aria-label="Demonstracinė vizito diena">{[5, 6, 7, 8, 9].map((value, index) => <button type="button" key={value} disabled={!service} aria-label={"Spalio " + value} aria-pressed={day === value} onClick={() => { setDay(value); setTime(null); setConfirmed(false); }}><span>{["Pr", "An", "Tr", "Kt", "Pn"][index]}</span><b>{value}</b></button>)}</div>
      <div className="demo-times" role="group" aria-label="Demonstracinis vizito laikas">{["09:00", "11:00", "14:30"].map(value => <button key={value} type="button" disabled={!day} aria-pressed={time === value} onClick={() => { setTime(value); setConfirmed(false); }}>{value}</button>)}</div>
      <p className="demo-status">{!service ? "Pirmiausia pasirinkite paslaugą." : !day ? "Pasirinkite dieną, tada – laiką." : !time ? "Pasirinkite vizito laiką." : "Pasirinkta: " + service + " · spalio " + day + " d. · " + time}</p>
      <div className="demo-action-row"><button type="button" className="demo-action" disabled={!day || !time || confirmed} onClick={() => setConfirmed(true)}>Patvirtinti demonstracinį vizitą<ArrowRight size={18} aria-hidden /></button><button className="demo-reset" type="button" onClick={reset}>Pradėti iš naujo</button></div>
      {confirmed && <DemoResult id="registracija" title="Demonstracinis vizitas užregistruotas"><p>{service} · 2026 m. spalio {day} d. · {time}</p><p>Kliento patvirtinime ir komandos kalendoriuje būtų ši paslauga, data ir laikas.</p></DemoResult>}
      <p className="demo-status">Tikra registracija nekuriama, patvirtinimas nesiunčiamas.</p>
    </div>
  </div>;
}
export function CalculatorPreview() {
  const id = useId(), [area, setArea] = useState(60), [finish, setFinish] = useState(false);
  const estimate = estimateArea(area, finish);
  return <div className="demo-panel demo-calculator demo-v2">
    <div className="demo-panel-head"><strong>Jūsų erdvės sąmata</strong><DemoLabel>Interaktyvi demonstracija</DemoLabel></div>
    <div className="demo-panel-body">
      <label className="demo-range-label" htmlFor={id + "-area"}>Patalpų plotas <strong>{area}<span> m²</span></strong></label>
      <input id={id + "-area"} type="range" min="20" max="200" step="10" value={area} onChange={event => setArea(Number(event.target.value))} />
      <div className="demo-range-bounds" aria-hidden><span>20 m²</span><span>200 m²</span></div>
      <label className="demo-check"><input type="checkbox" checked={finish} onChange={event => setFinish(event.target.checked)} /><span>Su paviršiaus paruošimu <small>+7 € / m²</small></span></label>
      <DemoResult id="skaiciuokle" title={"Preliminari suma: " + money(estimate.total)}>
        <dl className="demo-record"><div><dt>Pagrindiniai darbai</dt><dd>{area} m² × 15 € = {money(estimate.base)}</dd></div><div><dt>Paviršiaus paruošimas</dt><dd>{finish ? area + " m² × 7 € = " + money(estimate.extra) : "Nepasirinktas · 0 €"}</dd></div></dl>
      </DemoResult>
      <button className="demo-reset" type="button" onClick={() => { setArea(60); setFinish(false); }}>Pradėti iš naujo</button>
      <p className="demo-status">Iliustracinis skaičiavimas, ne „Skenis“ paslaugų kaina. Tikra sąmata nekuriama.</p>
    </div>
  </div>;
}

export function ReputationVisual() {
  return (
    <div className="demo-reputation">
      <img
        src="/images/skenis-product-perspective.jpg"
        alt="Tikra Skenis NFC ir QR atsiliepimų kortelė"
        width="1280"
        height="1014"
      />
      <div className="demo-product-path">
        <span>Kortelė</span>
        <ArrowRight size={17} aria-hidden />
        <span>Telefonas</span>
        <ArrowRight size={17} aria-hidden />
        <span>Atsiliepimas</span>
      </div>
      <Link to="/google-atsiliepimai" className="studio-text-link">
        Apžiūrėti Skenis produktą
        <ArrowUpRight size={17} aria-hidden />
      </Link>
    </div>
  );
}

export function ServiceVisual({
  slug,
  variant = "context",
}: {
  slug: string;
  variant?: "full" | "context";
}) {
  const views: Record<
    string,
    React.ComponentType<{ variant?: "full" | "context" }>
  > = {
    svetaines: WebsitePreview,
    registracijos: BookingPreview,
    "pardavimu-irankiai": SalesDemo,
    skaiciuokles: CalculatorPreview,
    "verslo-sistemos": BusinessDemo,
    automatizacijos: WorkflowPreview,
    "ai-sprendimai": AssistantDemo,
    "e-komercija": CommerceDemo,
    atsiliepimai: ReputationVisual,
  };
  const Visual = views[slug] ?? WorkflowPreview;
  return (
    <div className={`service-visual visual-${slug}`}>
      <Visual variant={variant} />
    </div>
  );
}

export const servicePaths: Record<string, string[]> = {
  svetaines: ["Pasiūlymas", "Pasirinkimas", "Užklausa"],
  registracijos: ["Paslauga", "Laikas", "Patvirtinimas"],
  "pardavimu-irankiai": ["Užklausa", "Aptarimas", "Pasiūlymas"],
  skaiciuokles: ["Įvestis", "Taisyklės", "Rezultatas"],
  "verslo-sistemos": ["Užduotis", "Komanda", "Būsena"],
  automatizacijos: ["Forma", "Duomenys", "Veiksmas"],
  "ai-sprendimai": ["Klausimas", "Šaltinis", "Peržiūra"],
  "e-komercija": ["Prekė", "Variantas", "Užsakymas"],
  atsiliepimai: ["Kortelė", "Telefonas", "Atsiliepimas"],
};
export function ProcessRibbon({ slug }: { slug: string }) {
  return (
    <div className="process-ribbon" aria-label="Sprendimo eiga">
      {(servicePaths[slug] || servicePaths.svetaines).map((label, i) => (
        <span key={label}>
          <b>0{i + 1}</b>
          {label}
          {i < 2 && <ArrowRight size={18} aria-hidden />}
        </span>
      ))}
    </div>
  );
}

/** Compact editorial previews; the full interactive versions live on the detail pages. */
export function ServiceTeaser({ slug }: { slug: string }) {
  if (slug === "svetaines") return <FormaSurface compact />;
  if (slug === "registracijos")
    return (
      <div className="teaser-calendar">
        <strong>Pasirinkite laiką</strong>
        <div>
          {["09:00", "11:00", "14:30"].map((time, i) => (
            <span className={i === 1 ? "chosen" : ""} key={time}>
              {time}
            </span>
          ))}
        </div>
        <span>
          <Check size={15} aria-hidden />
          Laikas → patvirtinimas
        </span>
      </div>
    );
  if (slug === "skaiciuokles")
    return (
      <div className="teaser-calculator">
        <span>Pavyzdinis skaičiavimas</span>
        <div>
          <span>60 m² × 15 €</span>
          <ArrowRight size={22} aria-hidden />
          <strong>900 €</strong>
        </div>
        <small>Demonstracinė suma, ne „Skenis“ paslaugų kaina.</small>
      </div>
    );
  if (slug === "verslo-sistemos")
    return (
      <div className="teaser-system">
        <div>
          <strong>Komandos darbai</strong>
          <span>Būsena</span>
        </div>
        <div>
          <span>Projekto planas</span>
          <b>Vykdoma</b>
        </div>
        <div>
          <span>Dokumentai</span>
          <b>Peržiūra</b>
        </div>
      </div>
    );
  if (slug === "ai-sprendimai")
    return (
      <div className="teaser-assistant">
        <span>Kur rasti projekto instrukciją?</span>
        <div>
          <FileText size={22} aria-hidden />
          <p>
            Atsakymas iš jūsų
            <br />
            <strong>komandos dokumentų.</strong>
          </p>
        </div>
        <small>Pavyzdinis asistento scenarijus</small>
      </div>
    );
  if (slug === "e-komercija")
    return (
      <div className="teaser-commerce">
        <img
          src={ceramicImage}
          width="1000"
          height="1000"
          alt="Iliustracinis keraminis vazonas"
          loading="lazy"
        />
        <div>
          <strong>molė.</strong>
          <span>Demonstracinė prekė ir kaina</span>
          <b>24 €</b>
        </div>
      </div>
    );
  if (slug === "atsiliepimai")
    return (
      <div className="teaser-reputation">
        <span>NFC + QR</span>
        <strong>
          Palietimas.
          <br />
          Jūsų nuoroda.
        </strong>
        <span>Kortelė → atsiliepimo puslapis</span>
      </div>
    );

  return (
    <div
      className={`catalog-illustration ${slug === "automatizacijos" ? "teaser-automation" : ""}`}
      aria-label="Pavyzdinė sprendimo eiga"
    >
      {servicePaths[slug].map((label, i) => (
        <span key={label}>
          <i aria-hidden>{i < 2 ? `0${i + 1}` : <Check size={14} />}</i>
          {label}
        </span>
      ))}
    </div>
  );
}
