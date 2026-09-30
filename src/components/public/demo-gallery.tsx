import { useEffect, useId, useLayoutEffect, useRef, type KeyboardEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { demoOptions, serviceContent } from "@/data/public-content";
import { legacyDemoHashes, resolveDemo, type DemoId } from "@/lib/demo-state";
import { useStudioMotion } from "@/motion/motion-provider";
import { ServiceVisual } from "./studio-demos";
import { DemoBenefits } from "./demo-result";
const useDemoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** The URL owns selection; switching panels disposes scenario state and timers. */
export function DemoGallery() {
  const [params] = useSearchParams();
  const location = useLocation(), navigate = useNavigate();
  const selected = resolveDemo(params.get("demo"), location.hash);
  const id = useId(), anchor = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { reduced, capture, fallback } = useStudioMotion();
  const quiet = reduced || capture || fallback;
  useEffect(() => {
    if (params.get("demo") === selected.id && !legacyDemoHashes[location.hash]) return;
    const next = new URLSearchParams(params);
    next.set("demo", selected.id);
    navigate({ pathname: location.pathname, search: next.toString(),
      hash: legacyDemoHashes[location.hash] ? "#demonstracija" : location.hash }, { replace: true });
  }, [params, selected.id, location.pathname, location.hash, navigate]);

  useDemoLayoutEffect(() => {
    if (location.hash !== "#demonstracija" || !anchor.current) return;
    let frame = 0, cancelled = false, stable = 0, previous = -1;
    const target = anchor.current;
    const align = () => {
      if (cancelled) return;
      const header = document.querySelector(".studio-nav");
      const offset = (header?.getBoundingClientRect().height || 80) + 16;
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
      window.scrollTo({ top, behavior: "instant" });
    };
    // Consecutive stable layout frames, then a second alignment after fonts settle.
    const settle = () => {
      const top = target.getBoundingClientRect().top + window.scrollY;
      stable = Math.abs(top - previous) < .5 ? stable + 1 : 0;
      previous = top;
      if (stable >= 2) { align(); return; }
      frame = requestAnimationFrame(settle);
    };
    const schedule = () => { stable = 0; cancelAnimationFrame(frame); frame = requestAnimationFrame(settle); };
    const observer = new ResizeObserver(schedule);
    const intro = document.querySelector(".solutions-intro");
    if (intro) observer.observe(intro);
    const stop = () => { cancelled = true; observer.disconnect(); cancelAnimationFrame(frame); };
    for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) window.addEventListener(event, stop, { passive: true, once: true });
    schedule();
    document.fonts.ready.then(() => { if (!cancelled) schedule(); });
    return () => {
      stop();
      for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) window.removeEventListener(event, stop);
    };
  }, [location.key, location.hash, selected.id]);

  const choose = (value: DemoId) => {
    if (value === selected.id) return;
    const next = new URLSearchParams(params);
    next.set("demo", value);
    navigate({ pathname: "/sprendimai", search: next.toString(), hash: "#demonstracija" });
  };
  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = demoOptions.length;
    const next = event.key === "Home" ? 0 : event.key === "End" ? count - 1
      : event.key === "ArrowRight" || event.key === "ArrowDown" ? (index + 1) % count
      : event.key === "ArrowLeft" || event.key === "ArrowUp" ? (index + count - 1) % count : null;
    if (next !== null) { event.preventDefault(); tabs.current[next]?.focus(); }
  };
  return <section className="studio-container demo-center" aria-label="Demonstracijų centras" data-theme="light" data-quiet={quiet}>
    <div className="demo-selector">
      <p className="studio-eyebrow">Pasirinkite, ką išbandyti</p>
      <div className="demo-tabs" role="tablist" aria-label="Demonstracijos">
        {demoOptions.map((demo, index) => <button key={demo.id} type="button" role="tab"
          id={id + "-tab-" + demo.id} ref={element => { tabs.current[index] = element; }}
          aria-selected={selected.id === demo.id} aria-controls={id + "-panel"}
          tabIndex={selected.id === demo.id ? 0 : -1}
          onKeyDown={event => onTabKey(event, index)} onClick={() => choose(demo.id)}>
          <span>{demo.label}</span>{selected.id === demo.id && <Check size={17} aria-hidden />}
        </button>)}
      </div>
    </div>
    <div id="demonstracija" ref={anchor} className="demo-anchor">
      <label className="demo-mobile-selector" htmlFor={id + "-select"}><span>Demonstracija</span>
        <select id={id + "-select"} value={selected.id} onChange={event => choose(event.target.value as DemoId)}>
          {demoOptions.map(demo => <option key={demo.id} value={demo.id}>{demo.label}</option>)}
        </select>
      </label>
      <article id={id + "-panel"} role="tabpanel" aria-labelledby={id + "-tab-" + selected.id}
        className="demo-active" key={selected.id} data-demo={selected.id}>
        <div className="demo-heading">
          <span className="demo-kind">{selected.kind}</span>
          <h2>{selected.title}</h2>
          <p className="demo-problem"><strong>Problema.</strong> {selected.problem}</p>
          <p className="demo-instruction"><strong>{selected.id === "svetaine" ? "Peržiūrėkite:" : "Išbandykite:"}</strong> {selected.action}</p>
        </div>
        <div className="demo-center-layout">
          <div className="demo-window"><ServiceVisual slug={selected.slug} variant="full" /></div>
          <aside className="demo-adaptation">
            <p className="studio-eyebrow">Rezultatas verslui</p><p className="demo-business-result">{selected.result}</p>
            <DemoBenefits id={selected.id} />
            <h3>Kaip pritaikytume jums</h3><p>{selected.adapt}</p>
            <Link className="studio-text-link" to={"/paslaugos/" + selected.slug}>{serviceContent[selected.slug].link}<ArrowUpRight size={17} aria-hidden /></Link>
            <Link className="studio-button" to={"/kontaktai?service=" + selected.slug + "&intent=project"} data-demo-contact={selected.id}>{serviceContent[selected.slug].cta}<ArrowUpRight size={17} aria-hidden /></Link>
            <small>Demonstraciniai duomenys. Veiksmai niekur nesiunčiami.</small>
          </aside>
        </div>
      </article>
    </div>
  </section>;
}
