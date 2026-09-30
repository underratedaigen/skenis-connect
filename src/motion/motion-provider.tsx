import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { resolveMotionPolicy } from './motion-policy';

type MotionState = { reduced: boolean; capture: boolean; fallback: boolean; toggle: () => void };
const MotionContext = createContext<MotionState>({ reduced: false, capture: false, fallback: false, toggle: () => {} });
export const useStudioMotion = () => useContext(MotionContext);

/** Public routes own one engine. The engine and every trigger are disposed on route/policy changes. */
export function MotionProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [systemReduced, setSystemReduced] = useState(false);
  const [manualReduced, setManualReduced] = useState(false);
  const [detectedFallback, setFallback] = useState(false);
  const [touch, setTouch] = useState(false);
  const capture = new URLSearchParams(location.search).get('capture') === '1';
  const forcedStatic = new URLSearchParams(location.search).get('motion') === 'off';
  const fallback = detectedFallback || new URLSearchParams(location.search).get('scene') === 'flat';
  const reduced = systemReduced || manualReduced || forcedStatic;
  const legal = ['/privatumo-politika', '/taisykles'].includes(location.pathname);
  const quiet = legal || location.pathname === '/kontaktai';
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 900px), (pointer: coarse)');
    const update = () => setSystemReduced(media.matches);
    const updateMobile = () => setTouch(mobile.matches);
    update();
    updateMobile();
    media.addEventListener('change', update);
    mobile.addEventListener('change', updateMobile);
    try { setManualReduced(localStorage.getItem('skenis_motion_reduced') === 'true'); } catch { /* private browsing */ }
    const device = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    setFallback(!CSS.supports('transform-style', 'preserve-3d') || (device.deviceMemory !== undefined && device.deviceMemory <= 2) || !!device.connection?.saveData);
    setReady(true);
    return () => { media.removeEventListener('change', update); mobile.removeEventListener('change', updateMobile); };
  }, []);
  const toggle = () => setManualReduced(value => {
    try { localStorage.setItem('skenis_motion_reduced', String(!value)); } catch { /* private browsing */ }
    return !value;
  });

  useEffect(() => {
    const scope = root.current;
    if (!scope || !ready) return;
    // Themes use real section boundaries; no blend mode is required for readable navigation.
    let frame = 0;
    let previousY = window.scrollY;
    const update = () => {
      const sections = [...scope.querySelectorAll<HTMLElement>('[data-theme], main, main > section')];
      const active = sections.filter(section => section.getBoundingClientRect().top <= 100).at(-1);
      scope.dataset.navTheme = active?.dataset.theme || (active?.classList.contains('studio-page-intro') && !quiet ? 'green' : 'light');
      const delta = window.scrollY - previousY;
      if (Math.abs(delta) > 4) scope.dataset.direction = delta > 0 && window.scrollY > 180 ? 'down' : 'up';
      previousY = window.scrollY;
      const workflow = scope.querySelector<HTMLElement>('.moto-workflow');
      if (workflow && touch && !reduced && !capture) {
        const box = workflow.getBoundingClientRect();
        const progress = Math.max(0, Math.min(.999, (innerHeight * .75 - box.top) / (box.height + innerHeight * .25)));
        workflow.dataset.phase = String(Math.floor(progress * 4));
      } else if (workflow && (reduced || capture)) delete workflow.dataset.phase;
      frame = 0;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    // Lazy route content can replace its placeholder without a scroll event.
    const contentObserver = new MutationObserver(schedule);
    contentObserver.observe(scope, { childList: true, subtree: true });
    return () => { contentObserver.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame); };
  }, [location.pathname, quiet, ready, touch, reduced, capture]);

  useEffect(() => {
    const scope = root.current;
    if (!ready || !scope) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const lowPower = (navigator as Navigator & { deviceMemory?: number }).deviceMemory === 1;
    const policy = resolveMotionPolicy({ reduced, capture, legal: quiet, touch, lowPower });
    scope.dataset.motion = policy.staticScenes || fallback ? 'static' : touch ? 'native' : 'pending';
    scope.dataset.triggers = '0';
    const start = () => {
      removeStartListeners();
      import('./motion-engine').then(({ mountMotion }) => {
        if (!disposed) { scope.dataset.motion = 'animated'; cleanup = mountMotion(scope, policy, location.pathname === '/'); }
      }).catch(() => { if (!disposed) { setFallback(true); scope.dataset.motion = 'static'; } });
    };
    const onKey = (event: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', 'End', ' '].includes(event.key) && !(event.target as HTMLElement)?.closest('input,textarea,select')) start();
    };
    const removeStartListeners = () => {
      window.removeEventListener('scroll', start);
      window.removeEventListener('wheel', start);
      window.removeEventListener('touchmove', start);
      window.removeEventListener('keydown', onKey);
    };
    if (!policy.staticScenes && !fallback && !touch) {
      // No large animation work competes with first paint or the contact form.
      if (window.scrollY > 0) start();
      else {
        window.addEventListener('scroll', start, { passive: true, once: true });
        window.addEventListener('wheel', start, { passive: true, once: true });
        window.addEventListener('touchmove', start, { passive: true, once: true });
        window.addEventListener('keydown', onKey);
      }
    }
    return () => { disposed = true; removeStartListeners(); cleanup?.(); scope.dataset.triggers = '0'; };
  }, [ready, reduced, capture, quiet, fallback, touch, location.pathname, location.search]);

  return <MotionContext.Provider value={{ reduced, capture, fallback, toggle }}>
    <div ref={root} className={`moto-site ${capture ? 'moto-capture' : ''} ${reduced ? 'moto-reduced' : ''} ${fallback ? 'moto-flat' : ''} ${quiet ? 'moto-quiet' : ''}`} data-nav-theme={quiet ? 'light' : 'dark'} data-motion="static" data-triggers="0">
      {children}
      {!quiet && <div className="moto-route-curtain" key={location.pathname} aria-hidden />}
    </div>
  </MotionContext.Provider>;
}

export function MotionPreference() {
  const { reduced, toggle } = useStudioMotion();
  return <button className="moto-motion-preference" type="button" aria-pressed={reduced} onClick={toggle}>{reduced ? 'Sumažintas judesys įjungtas' : 'Sumažinti judesį'}</button>;
}
