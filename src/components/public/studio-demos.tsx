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
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

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

export function BookingPreview({
  variant = "full",
}: {
  variant?: "full" | "context";
}) {
  const id = useId();
  const [day, setDay] = useState(23);
  const [time, setTime] = useState("11:00");
  const [service, setService] = useState("Konsultacija · 60 min.");
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div className="demo-panel demo-booking">
      <div className="demo-panel-head">
        <span className="demo-symbol">R.</span>
        <div>
          <strong>Laikas jums</strong>
          <span>Registracijos scenarijus</span>
        </div>
        <DemoLabel>Demo</DemoLabel>
      </div>
      <div className="demo-panel-body">
        {variant === "full" ? (
          <label className="demo-field" htmlFor={`${id}-service`}>
            Paslauga
            <select
              id={`${id}-service`}
              value={service}
              onChange={(e) => {
                setService(e.target.value);
                setConfirmed(false);
              }}
            >
              <option>Konsultacija · 60 min.</option>
              <option>Susipažinimas · 30 min.</option>
            </select>
          </label>
        ) : (
          <p className="demo-context-line">{service}</p>
        )}
        <div className="demo-calendar-title">
          <strong>Rugsėjis, 2026</strong>
          <span>Pavyzdiniai laikai</span>
        </div>
        <div
          className="demo-days"
          role="group"
          aria-label="Demonstracinė vizito diena"
        >
          {[21, 22, 23, 24, 25].map((d, i) => (
            <button
              type="button"
              key={d}
              aria-label={`Rugsėjo ${d}`}
              aria-pressed={day === d}
              onClick={() => {
                setDay(d);
                setConfirmed(false);
              }}
            >
              <span>{["Pr", "An", "Tr", "Kt", "Pn"][i]}</span>
              <b>{d}</b>
            </button>
          ))}
        </div>
        <div
          className="demo-times"
          role="group"
          aria-label="Demonstracinis vizito laikas"
        >
          {["09:00", "11:00", "14:30"].map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={time === t}
              onClick={() => {
                setTime(t);
                setConfirmed(false);
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="demo-action"
          onClick={() => setConfirmed(!confirmed)}
        >
          {confirmed ? "Pasirinkti iš naujo" : "Patvirtinti demo laiką"}
          {confirmed ? (
            <Check size={18} aria-hidden />
          ) : (
            <ArrowRight size={18} aria-hidden />
          )}
        </button>
        <p className="demo-status" role="status">
          {confirmed
            ? `Pavyzdinis patvirtinimas: rugsėjo ${day} d., ${time}. Tikras vizitas nesukurtas.`
            : `Pasirinkta: rugsėjo ${day} d., ${time}. Tikra rezervacija nekuriama.`}
        </p>
      </div>
    </div>
  );
}

export function CalculatorPreview() {
  const id = useId();
  const [area, setArea] = useState(60);
  const [finish, setFinish] = useState(false);
  const rate = finish ? 22 : 15;
  return (
    <div className="demo-panel demo-calculator">
      <div className="demo-panel-head">
        <FileText size={22} aria-hidden />
        <div>
          <strong>Jūsų erdvės sąmata</strong>
          <span>Apdailos darbų scenarijus</span>
        </div>
        <DemoLabel>Demo</DemoLabel>
      </div>
      <div className="demo-panel-body">
        <label className="demo-range-label" htmlFor={`${id}-area`}>
          Patalpų plotas{" "}
          <strong>
            {area}
            <span> m²</span>
          </strong>
        </label>
        <input
          id={`${id}-area`}
          type="range"
          min="20"
          max="200"
          step="10"
          value={area}
          onChange={(e) => setArea(Number(e.target.value))}
        />
        <div className="demo-range-bounds" aria-hidden>
          <span>20 m²</span>
          <span>200 m²</span>
        </div>
        <label className="demo-check">
          <input
            type="checkbox"
            checked={finish}
            onChange={(e) => setFinish(e.target.checked)}
          />
          <span>
            Su paviršiaus paruošimu <small>+7 € / m²</small>
          </span>
        </label>
        <div className="demo-estimate" aria-live="polite">
          <span>Preliminari suma</span>
          <strong>{money(area * rate)}</strong>
          <span>
            {area} m² × {money(rate)} / m²
          </span>
        </div>
        <p className="demo-status">
          Iliustracinis įkainis. Tai nėra „Skenis“ paslaugų kaina.
        </p>
      </div>
    </div>
  );
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
        <small>Įvestis → aiškus rezultatas</small>
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
          <span>Keramika namams</span>
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
