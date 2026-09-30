import { useId, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  LayoutDashboard,
  Monitor,
} from "lucide-react";

/** Self-contained UI examples: no timer, real reservation or network request. */
export function HeroDemo() {
  const id = useId();
  const [mode, setMode] = useState(0);
  const [service, setService] = useState("Konsultacija");
  const [date, setDate] = useState("2026-10-06");
  const [time, setTime] = useState("11:00");
  const [confirmed, setConfirmed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const labels = ["Svetainė", "Registracija", "Verslo sistema"];
  const icons = [Monitor, CalendarDays, LayoutDashboard];
  return (
    <figure className="hero-example solutions-hero">
      <figcaption>Demonstraciniai svetainių ir sistemų pavyzdžiai</figcaption>
      <div className="solutions-demo">
        <div className="solutions-demo-top">
          <strong>Svetainių ir sistemų pavyzdžiai</strong>
          <span>Demonstracija</span>
        </div>
        <div
          className="solutions-demo-modes"
          role="group"
          aria-label="Hero demonstracijos pasirinkimas"
        >
          {labels.map((label, index) => {
            const Icon = icons[index];
            return (
              <button
                key={label}
                type="button"
                aria-pressed={mode === index}
                aria-controls={`${id}-content`}
                onClick={() => setMode(index)}
              >
                <Icon size={17} aria-hidden />
                {label}
              </button>
            );
          })}
        </div>
        <div className="solutions-demo-content" id={`${id}-content`}>
          {mode === 0 && (
            <div className="website-structure">
              <div className="structure-nav">
                <strong>Jūsų verslas</strong>
                <span>Paslaugos · Apie · Kontaktai</span>
              </div>
              <div className="structure-intro">
                <span className="structure-index">01 / Pristatymas</span>
                <h3>Aiškiai pristatykite savo paslaugas.</h3>
                <p>Kas jūs, ką siūlote ir kaip klientui susisiekti.</p>
                <span className="structure-contact">
                  Kontaktų vieta <ArrowRight size={14} aria-hidden />
                </span>
              </div>
              <div className="structure-services">
                {["Paslauga", "Praktinis pavyzdys", "Užklausos forma"].map(
                  (text, i) => (
                    <div key={text}>
                      <span>0{i + 2}</span>
                      <strong>{text}</strong>
                      <i aria-hidden />
                    </div>
                  ),
                )}
              </div>
              <p className="solutions-demo-note">
                Turinys → paslaugos → užklausa. Pavyzdinė svetainės struktūra.
              </p>
            </div>
          )}
          {mode === 1 && (
            <div className="registration-structure">
              <h3>Pasirinkite vizitą</h3>
              <div className="registration-fields">
                <label htmlFor={`${id}-service`}>
                  Paslauga
                  <select
                    id={`${id}-service`}
                    value={service}
                    onChange={(e) => {
                      setService(e.target.value);
                      setConfirmed(false);
                    }}
                  >
                    <option>Konsultacija</option>
                    <option>Projekto aptarimas</option>
                  </select>
                </label>
                <label htmlFor={`${id}-date`}>
                  Data
                  <select
                    id={`${id}-date`}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setConfirmed(false);
                    }}
                  >
                    <option value="2026-10-06">Spalio 6 d.</option>
                    <option value="2026-10-07">Spalio 7 d.</option>
                    <option value="2026-10-08">Spalio 8 d.</option>
                  </select>
                </label>
              </div>
              <div
                className="registration-times"
                role="group"
                aria-label="Demonstracinio vizito laikas"
              >
                {["09:00", "11:00", "14:30"].map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={time === value}
                    onClick={() => {
                      setTime(value);
                      setConfirmed(false);
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="demo-secondary-action"
                disabled={!date}
                onClick={() => setConfirmed(true)}
              >
                <Check size={16} aria-hidden />
                Patvirtinti pasirinkimą
              </button>
              <p className="solutions-demo-note" role="status">
                {confirmed
                  ? `${service} · ${date} · ${time}. Demonstracinis pasirinkimas patvirtintas. Tikras vizitas nesukurtas.`
                  : "Pasirinkite paslaugą, datą ir laiką. Tai demonstracija, duomenys nesiunčiami."}
              </p>
            </div>
          )}
          {mode === 2 && (
            <div className="business-structure">
              <div className="business-heading">
                <h3>Projekto darbai</h3>
                <span className="business-status">
                  {completed ? "Atlikta" : "Vykdoma"}
                </span>
              </div>
              <dl>
                <div>
                  <dt>Projektas</dt>
                  <dd>Pavyzdinė verslo svetainė</dd>
                </div>
                <div>
                  <dt>Užduotis</dt>
                  <dd>Peržiūrėti paslaugų turinį</dd>
                </div>
                <div>
                  <dt>Atsakingas žmogus</dt>
                  <dd>Testinis komandos narys</dd>
                </div>
                <div>
                  <dt>Terminas</dt>
                  <dd>2026-10-09</dd>
                </div>
              </dl>
              <div className="business-next">
                <span>Kitas žingsnis</span>
                <strong>
                  {completed
                    ? "Suderinti svetainės paleidimą"
                    : "Patvirtinti turinio juodraštį"}
                </strong>
              </div>
              <button
                type="button"
                className="demo-secondary-action"
                onClick={() => setCompleted(!completed)}
              >
                <Check size={16} aria-hidden />
                {completed ? "Grąžinti į vykdymą" : "Pažymėti užduotį atlikta"}
              </button>
              <p className="solutions-demo-note" role="status">
                {completed
                  ? "Pavyzdinė būsena atnaujinta. Tikri projektų duomenys nekeičiami."
                  : "Užduotis, atsakomybė ir kitas veiksmas vienoje vietoje. Testiniai duomenys."}
              </p>
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}
