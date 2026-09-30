import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Command, FileText, CalendarDays, Users, Zap, Globe2, ShoppingBag, MessageSquare, Nfc } from 'lucide-react';
import { Suspense, useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { serviceContent, serviceOrder, demoOptions } from '@/data/public-content';
import { getProductPrice } from '@/lib/product-pricing';
import { usePublicTestimonials } from '@/lib/testimonial-data';
import { TestimonialCard } from '@/components/public/testimonials';
import { ProcessSection } from '@/components/public/studio-landing';
import { useStudioMotion } from './motion-provider';

const icons = [Globe2, ShoppingBag, CalendarDays, Users, FileText, Command, Zap, MessageSquare, Nfc];
const money = (value: number) => new Intl.NumberFormat('lt-LT', { style: 'currency', currency: 'EUR' }).format(value);

/** Original HTML interface fragments: meaningful even without a renderer or animation library. */
export function InterfaceSurface({ kind = 'verslo-sistemos', compact = false }: { kind?: string; compact?: boolean }) {
  const Icon = icons[serviceOrder.indexOf(kind)] || Command;
  const names: Record<string, string> = { svetaines: 'Jūsų verslas internete', 'e-komercija': 'Produktų pasirinkimas', registracijos: 'Vizito registracija', 'pardavimu-irankiai': 'Klientų užklausos', skaiciuokles: 'Pasiūlymo skaičiavimas', 'verslo-sistemos': 'Komandos darbo erdvė', automatizacijos: 'Veiksmų scenarijus', 'ai-sprendimai': 'Komandos asistentas', atsiliepimai: 'NFC + QR nuorodos' };
  return <div className={`moto-interface ui-${kind} ${compact ? 'ui-compact' : ''}`}>
    <div className="moto-interface-chrome"><span className="ui-dots" aria-hidden><i /><i /><i /></span><span>skenis / {kind}</span><span className="ui-demo">Vizuali peržiūra</span></div>
    <div className="moto-interface-body"><div className="ui-title"><Icon size={19} aria-hidden /><strong>{names[kind]}</strong><span className="ui-online" aria-hidden /></div>
      {kind === 'svetaines' ? <><div className="ui-web-nav"><b>Jūsų ženklas.</b><span>Paslaugos / Kontaktai</span></div><div className="ui-web-copy"><span>Sukurta jūsų veiklai</span><strong>Aiškus pasiūlymas.<br />Paprastas kitas žingsnis.</strong><i>Susisiekti <ArrowUpRight size={14} /></i></div><div className="ui-web-lines"><span /><span /><span /></div></>
      : kind === 'registracijos' ? <><div className="ui-calendar"><span>Rugsėjis / pavyzdiniai laikai</span><div>{['Pr 21', 'An 22', 'Tr 23', 'Kt 24', 'Pn 25'].map((day, i) => <b key={day} className={i === 2 ? 'chosen' : ''}>{day}</b>)}</div></div><div className="ui-times"><span>09:00</span><b>11:00</b><span>14:30</span></div><div className="ui-success"><Check size={16} aria-hidden />Laikas rezervuotas</div></>
      : kind === 'skaiciuokles' ? <><div className="ui-calculation"><span>Plotas / 60 m²</span><div className="ui-slider"><i /></div><span>Pavyzdinis įkainis / 15 €</span><strong>900 €</strong><small>Iliustracija, ne „Skenis“ paslaugų kaina</small></div></>
      : kind === 'ai-sprendimai' ? <><div className="ui-chat">Kur rasti projekto instrukciją?</div><div className="ui-chat answer"><MessageSquare size={18} aria-hidden /><span>Radau jūsų komandos dokumentuose.<br /><small>Šaltinis / Projekto instrukcija</small></span></div><div className="ui-success"><FileText size={15} aria-hidden />Atsakymas su šaltiniu</div></>
      : kind === 'e-komercija' ? <><div className="ui-commerce"><div className="ui-original-product" aria-hidden><ShoppingBag size={48} strokeWidth={1} /></div><div><span>Pavyzdinis produktas</span><strong>Pasirinkimas → užsakymas</strong><small>Variantai · kiekis · pristatymas</small></div></div><div className="ui-success"><Check size={16} aria-hidden />Krepšelis paruoštas</div></>
      : kind === 'automatizacijos' ? <><div className="ui-automation"><span><FileText size={17} />Forma</span><ArrowRight size={17} /><span><Users size={17} />Klientas</span><ArrowRight size={17} /><span><Zap size={17} />Veiksmas</span></div><div className="ui-success"><Check size={16} aria-hidden />Duomenys perduoti</div><div className="ui-log">09:41 / Užduotis priskirta komandai</div></>
      : kind === 'atsiliepimai' ? <><div className="ui-nfc"><Nfc size={44} strokeWidth={1} aria-hidden /><strong>Palietimas.<br />Jūsų nuoroda.</strong></div><div className="ui-success">Kortelė → telefonas → atsiliepimas</div></>
      : <><div className="ui-table-head"><span>{kind === 'pardavimu-irankiai' ? 'Užklausa' : 'Darbas'}</span><span>Atsakingas</span><span>Būsena</span></div>{[['Projekto aptarimas', 'Komanda', 'Vykdoma'], ['Pasiūlymo ruošimas', 'Projektų vadovas', 'Peržiūra'], ['Kitas žingsnis', 'Komanda', 'Paruošta']].map(([title, owner, state], i) => <div className="ui-table-row" key={title}><span><i className={`ui-item-dot dot-${i}`} />{title}</span><span>{owner}</span><b>{state}</b></div>)}<div className="ui-success"><Check size={16} aria-hidden />Komanda informuota</div></>}
    </div>
  </div>;
}

export function SessionIntro() {
  const { reduced, capture } = useStudioMotion();
  const [sequence, setSequence] = useState<'first' | 'repeat' | 'skip'>('skip');
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (reduced || capture || window.matchMedia('(prefers-reduced-motion:reduce)').matches) { setShown(false); setSequence('skip'); return; }
    try {
      if (localStorage.getItem('skenis_motion_reduced') === 'true') return;
      const first = sessionStorage.getItem('skenis_motion_intro_seen') !== 'true';
      sessionStorage.setItem('skenis_motion_intro_seen', 'true');
      setSequence(first ? 'first' : 'repeat');
      setShown(first);
    } catch { setSequence('repeat'); }
    const timer = window.setTimeout(() => setShown(false), 2300);
    return () => window.clearTimeout(timer);
  }, [reduced, capture]);
  return <div className="moto-session-intro" hidden={!shown} data-sequence={sequence} aria-hidden><div className="moto-intro-lines" /><img className="moto-intro-logo" src="/skenis-logo-compact.png" width="460" height="130" alt="" /></div>;
}

export function HeroSystemScene() {
  return <div className="moto-system-scene" aria-hidden><div className="moto-orbit orbit-one" /><div className="moto-orbit orbit-two" /><div className="moto-scene-grid" /><div className="moto-hero-tilt"><div className="moto-layer layer-back"><InterfaceSurface kind="svetaines" compact /></div><div className="moto-layer layer-middle"><InterfaceSurface kind="registracijos" compact /></div><div className="moto-layer layer-front"><InterfaceSurface compact /></div><div className="moto-scene-tag"><span />Svetainė → sistema → veiksmas</div></div><span className="moto-scene-coordinate">SK / CONNECTED SYSTEMS / 001</span></div>;
}

export function WorkflowScrollytelling() {
  const steps = ['Nauja užklausa', 'Klientas sukurtas', 'Užduotis paskirta', 'Kitas žingsnis paruoštas'];
  return <section className="moto-workflow moto-dark" data-theme="dark" id="veikimo-eiga"><div className="studio-container moto-pinned-inner"><div className="moto-story-heading" data-reveal><p className="studio-eyebrow">01 / Nuo sąsajos iki veiksmo</p><h2>Nuo pirmo paspaudimo<br />iki atlikto darbo.</h2><p>Svetainė gali surinkti užklausą, sistema – perduoti ją komandai, o automatizacija – paruošti kitą žingsnį.</p></div><div className="moto-workflow-stage"><div className="moto-workflow-window" aria-hidden>{["svetaines", "registracijos", "pardavimu-irankiai", "verslo-sistemos"].map((kind, index) => <div className="moto-flow-surface" key={kind}><InterfaceSurface kind={kind} /><span className="moto-flow-surface-state">{steps[index]}</span></div>)}</div><div className="moto-flow-notices">{['Užklausa gauta', 'Laikas rezervuotas', 'Duomenys perduoti', 'Užduotis sukurta', 'Komanda informuota'].map((label, index) => <div className="moto-flow-notice" key={label}><span>0{index + 1}</span><Check size={16} aria-hidden />{label}</div>)}</div></div><ol className="moto-flow-steps">{steps.map((step, i) => <li key={step}><span>0{i + 1}</span><strong>{step}</strong></li>)}<li className="moto-flow-light" aria-hidden /></ol><span className="moto-scene-note">Iliustracinė eiga. Taisykles pritaikome jūsų procesui.</span></div></section>;
}

export function SystemCore() {
  return <section className="moto-core moto-green" data-theme="green"><div className="studio-container moto-pinned-inner"><p className="studio-eyebrow" data-reveal>02 / Sujungta darbo erdvė</p><div className="moto-core-stage" aria-hidden><div className="moto-core-object"><div className="moto-core-depth depth-two" /><div className="moto-core-depth depth-one" /><InterfaceSurface /><div className="moto-core-light" /></div><div className="moto-core-satellite satellite-calendar"><CalendarDays size={25} /><span>Laikas suderintas</span></div><div className="moto-core-satellite satellite-document"><FileText size={25} /><span>Dokumentas paruoštas</span></div><div className="moto-core-satellite satellite-task"><Check size={25} /><span>Aiški atsakomybė</span></div></div><h2 data-reveal>Viena sistema.<br /><em>Aiškus kitas žingsnis.</em></h2><p>Klientai, užduotys, dokumentai ir terminai. Vienoje jūsų darbui pritaikytoje sistemoje.</p><Link className="studio-text-link" to="/paslaugos/verslo-sistemos">Apie verslo sistemas <ArrowUpRight size={18} aria-hidden /></Link></div></section>;
}

export function IntegrationLightScene() {
  const columns = [['UŽKLAUSA', 'KLIENTAS', 'REGISTRACIJA'], ['UŽSAKYMAS', 'PASIŪLYMAS', 'DOKUMENTAS'], ['UŽDUOTIS', 'PRIMINIMAS', 'APMOKĖJIMAS', 'ATASKAITA']];
  return <section className="moto-integration" data-theme="light"><div className="moto-data-columns" aria-hidden>{columns.map((column, index) => <div className="moto-data-column" key={index}>{column.map(word => <span key={word}>{word}</span>)}</div>)}</div><div className="studio-container" data-reveal><p className="studio-eyebrow">03 / Aiškumas tarp sistemų</p><h2>Sujungiame tai,<br />kas šiandien<br /><em>išskaidyta.</em></h2><p>Jūsų svetainė, kalendorius, klientų duomenys ir kasdieniai komandos įrankiai gali veikti kartu.</p></div></section>;
}

export function ServicesShowcase({ catalog = false }: { catalog?: boolean }) {
  const [active, setActive] = useState(serviceOrder[0]);
  return <section className={`moto-services ${catalog ? 'moto-catalog-services' : ''}`} data-theme="light" id="paslaugos"><div className="studio-container"><div className="moto-section-top" data-reveal><div><p className="studio-eyebrow">04 / Ką kuriame</p><h2>{catalog ? 'Devynios kryptys. Jūsų konkretus poreikis.' : 'Nuo svetainės iki jūsų darbo sistemos.'}</h2></div>{!catalog && <Link className="studio-text-link" to="/paslaugos">Visos paslaugos <ArrowUpRight size={18} aria-hidden /></Link>}</div><div className="moto-service-layout"><div className="moto-service-list">{serviceOrder.map((slug, i) => <article key={slug} className={`moto-service-row ${active === slug ? 'is-active' : ''}`} id={catalog ? ({ svetaines: 'klientai', registracijos: 'darbas', automatizacijos: 'jungtys' } as Record<string, string>)[slug] : undefined} onMouseEnter={() => setActive(slug)} onFocus={() => setActive(slug)}><div className="moto-service-row-title"><span>0{i + 1}</span><h3><button type="button" aria-pressed={active === slug} onClick={() => setActive(slug)}>{serviceContent[slug].title}<ArrowUpRight size={22} aria-hidden /></button></h3></div><div className="moto-service-row-content"><p>{serviceContent[slug].summary}</p><div className="moto-service-inline-visual"><InterfaceSurface kind={slug} compact /></div><Link className="studio-text-link" to={`/paslaugos/${slug}`}>{serviceContent[slug].link}<ArrowRight size={17} aria-hidden /></Link></div></article>)}</div><div className="moto-service-stage"><div className="moto-mask-visual" key={active}><InterfaceSurface kind={active} /></div><div className="moto-active-service"><p className="studio-eyebrow">Sprendimo pavyzdys</p><p>{serviceContent[active].example}</p><Link className="studio-text-link" to={`/paslaugos/${active}`}>{serviceContent[active].link}<ArrowUpRight size={18} aria-hidden /></Link></div></div></div></div></section>;
}

export function AutomationStory() {
  const steps = ['Gauta forma', 'Duomenys patikrinti', 'Klientas įrašytas', 'Užduotis paskirta', 'Dokumentas paruoštas', 'Komanda informuota'];
  return <section className="moto-automation moto-dark" data-theme="dark"><div className="studio-container moto-automation-layout"><div className="moto-automation-copy" data-reveal><p className="studio-eyebrow">05 / Mažiau pasikartojimų</p><h2>Pasikartojantis<br />darbas gali<br /><em>vykti savaime.</em></h2><p>Sutartos taisyklės perduoda informaciją, paruošia dokumentą ir informuoja komandą. Žmogus įsitraukia ten, kur reikia sprendimo.</p><Link to="/paslaugos/automatizacijos" className="studio-text-link">Apie automatizavimą <ArrowUpRight size={18} aria-hidden /></Link><span className="moto-scene-note">Pavyzdinis scenarijus / ne gyvi klientų duomenys</span></div><div className="moto-automation-track"><div className="moto-automation-light" aria-hidden />{steps.map((step, i) => <article key={step} data-reveal><span className="moto-step-node">{i === 5 ? <Check size={16} aria-hidden /> : `0${i + 1}`}</span><div><span className="studio-eyebrow">09:4{i} / {i < 3 ? 'Sistema' : i < 5 ? 'Projektų komanda' : 'Komanda'}</span><h3>{step}</h3><p>{['Užklausa iš svetainės', 'Privalomi laukai ir perdavimo taisyklės', 'Vienas įrašas klientų sistemoje', 'Aiškus atsakingas žmogus', 'Pasiūlymo juodraštis peržiūrai', 'Kitas veiksmas ir jo terminas'][i]}</p></div><span className="moto-step-status">Atlikta <Check size={13} aria-hidden /></span></article>)}</div></div></section>;
}

export function ProjectsShowcase() {
  const examples = [
    { id: 'registracija', title: 'Registracijos sistema', cta: 'Išbandyti registraciją' },
    { id: 'komanda', title: 'Komandos sistema', cta: 'Išbandyti komandos sistemą' },
    { id: 'svetaine', title: 'Interneto svetainė', cta: 'Peržiūrėti svetainės koncepciją' },
  ];
  return <section className="home-examples" data-theme="light" id="sprendimu-pavyzdziai">
    <div className="studio-container">
      <div className="moto-section-top" data-reveal>
        <div><p className="studio-eyebrow">06 / Galima pamatyti ir išbandyti</p><h2>Trys situacijos.<br />Aiškūs sprendimai.</h2></div>
        <p>Čia – vizualios peržiūros. Paspaudę nuorodą atidarysite pasirinktą demonstraciją arba koncepciją.</p>
      </div>
      <div className="home-example-grid">{examples.map(example => {
        const demo = demoOptions.find(item => item.id === example.id)!;
        return <article className="home-example" key={demo.id}>
          <div className="home-example-visual" aria-hidden="true"><InterfaceSurface kind={demo.slug} compact /><span>Vizuali peržiūra</span></div>
          <div className="home-example-copy">
            <h3>{example.title}</h3>
            <dl><div><dt>Problema</dt><dd>{demo.problem}</dd></div><div><dt>Sprendimas</dt><dd>{demo.solution}</dd></div><div><dt>Rezultatas</dt><dd>{demo.result}</dd></div></dl>
            <Link className="studio-text-link" to={'/sprendimai?demo=' + demo.id + '#demonstracija'}>{example.cta}<ArrowUpRight size={18} aria-hidden /></Link>
          </div>
        </article>;
      })}</div>
      <Link className="studio-button secondary home-all-demos" to="/sprendimai">Visas demonstracijų centras <ArrowUpRight size={18} aria-hidden /></Link>
    </div>
  </section>;
}

export function CinematicTrust() {
  const { reviews } = usePublicTestimonials();
  const [active, setActive] = useState(0);
  const review = reviews[Math.min(active, reviews.length - 1)];
  const principles = ['Darbų apimtį sutariame prieš pradėdami', 'Kainą ir projekto eigą suderiname iš anksto', 'Sprendimą tikriname realiais naudojimo scenarijais', 'Po paleidimo paaiškiname, kaip naudotis'];
  return <section className="moto-trust" data-theme="light"><div className="studio-container"><p className="studio-eyebrow">07 / Bendras darbas</p><h2 data-reveal>{review ? 'Klientų patirtis' : 'Aiškumas nuo pradžios.'}</h2>{review ? <div className="moto-review-layout"><TestimonialCard review={review} /><div>{reviews.map((item, index) => <button type="button" key={item.id} aria-pressed={index === active} onClick={() => setActive(index)}>{item.name}</button>)}<Link className="studio-text-link" to="/atsiliepimai">Visi atsiliepimai <ArrowUpRight size={18} aria-hidden /></Link></div></div> : <ol className="moto-trust-list">{principles.map((principle, i) => <li key={principle} data-reveal><span>0{i + 1}</span><h3>{principle}</h3><Check size={22} aria-hidden /></li>)}</ol>}</div></section>;
}

export function ProductScene() {
  const id = useId();
  const [photo, setPhoto] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const price = getProductPrice(quantity);
  return <section className="moto-product moto-dark" data-theme="dark" id="skenis-produktas"><div className="studio-container moto-product-layout"><div className="moto-product-photo"><img src={photo === 0 ? '/images/skenis-product-perspective.jpg' : '/images/skenis-product-front.jpg'} alt={photo === 0 ? 'Tikra Skenis NFC ir QR atsiliepimų kortelė kampu' : 'Tikra Skenis NFC ir QR atsiliepimų kortelė iš priekio'} width="1280" height="1024" loading="lazy" /><div className="moto-product-reflection" aria-hidden /><div className="moto-photo-switch" role="group" aria-label="Kortelės vaizdas">{['Kampu', 'Iš priekio'].map((label, index) => <button type="button" key={label} aria-pressed={photo === index} onClick={() => setPhoto(index)}>{label}</button>)}</div></div><div data-reveal><p className="studio-eyebrow">08 / Tikras „Skenis“ produktas</p><h2>NFC ir QR kortelės „Google“ atsiliepimams</h2><p>Palietus kortelę arba nuskenavus QR, atidaromas jūsų atsiliepimų puslapis. Nuorodą galima keisti, skenavimus – stebėti.</p><div className="moto-product-price"><label htmlFor={`${id}-quantity`}>Kortelių kiekis</label><select id={`${id}-quantity`} value={quantity} onChange={event => setQuantity(Number(event.target.value))}>{[1, 10, 25, 50, 100].map(amount => <option value={amount} key={amount}>{amount} vnt.</option>)}</select><strong>{money(price.totalPrice)}</strong><span>{money(price.unitPrice)} / vnt.</span></div><Link className="studio-button light" to={`/google-atsiliepimai?quantity=${quantity}#kaina`}>Kortelės ir užsakymas <ArrowUpRight size={18} aria-hidden /></Link><span className="moto-scene-note">Galutinę kainą ir terminą patvirtiname pasiūlyme.</span></div></div></section>;
}

export type FAQItem = { question: string; answer: string };
export function AnimatedFAQ({ items }: { items: readonly FAQItem[] }) {
  const id = useId();
  const { reduced, capture } = useStudioMotion();
  const [open, setOpen] = useState<number | null>(0);
  const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const fallback = '<div class="moto-faq-fallback">' + items.map(item => `<article><h3>${escape(item.question)}</h3><p>${escape(item.answer)}</p></article>`).join('') + '</div>';
  return <><noscript dangerouslySetInnerHTML={{ __html: fallback }} /><div className="moto-faq-items">{items.map((item, i) => <div className="moto-faq-item" key={item.question}><h3><button id={`${id}-question-${i}`} type="button" aria-expanded={open === i} aria-controls={`${id}-answer-${i}`} onClick={() => setOpen(open === i ? null : i)}><span>{item.question}</span><ChevronDown size={20} aria-hidden /></button></h3><div className="moto-faq-panel" id={`${id}-answer-${i}`} role="region" aria-labelledby={`${id}-question-${i}`} style={{ gridTemplateRows: open === i ? '1fr' : '0fr', transitionDuration: reduced || capture ? '0s' : undefined }} aria-hidden={open !== i}><div><p>{item.answer}</p></div></div></div>)}</div></>;
}

const homeFAQ = [
  { question: 'Nuo ko pradėti, jei dar nežinome, kokios sistemos reikia?', answer: 'Aprašykite, ką šiandien darote rankomis arba kur stringa klientų kelias. Aptarsime procesą ir pasiūlysime konkrečią sprendimo kryptį.' },
  { question: 'Ar atnaujinate esamas svetaines?', answer: 'Taip. Pirmiausia įvertiname dabartinį turinį, veikimo eigą ir techninį pagrindą. Sutariame, ką išlaikyti ir ką verta pakeisti.' },
  { question: 'Ar galite sujungti mūsų naudojamas programas?', answer: 'Įvertiname jų API ir duomenų perdavimo galimybes. Prieš kurdami sutariame laukus, taisykles, prieigos ribas ir klaidų valdymą.' },
  { question: 'Kaip nustatoma projekto kaina?', answer: 'Pagal sutartą darbų apimtį, integracijas ir reikalingą funkcionalumą. Kainą ir eigą suderiname prieš pradėdami; papildomus darbus aptariame atskirai.' },
  { question: 'Ar pavyzdžius galima išbandyti?', answer: 'Taip. Pavyzdžių puslapyje veikia registracijos, skaičiuoklės, užklausų, komandos darbų ir kitų sprendimų demonstracijos. Jose nėra tikrų klientų duomenų.' },
  { question: 'Kas vyksta po paleidimo?', answer: 'Parodome, kaip naudotis sprendimu, ir perduodame sutartą informaciją. Atnaujinimų ir tolesnės priežiūros apimtį aptariame individualiai.' },
];
export function HomeFAQ() {
  return <section className="moto-faq" data-theme="light"><div className="studio-container moto-faq-layout"><div data-reveal><p className="studio-eyebrow">09 / Prieš pradedant</p><h2>Aiškūs atsakymai.<br />Gera pradžia.</h2><p>Projektas · Integracijos · Darbo eiga</p><Link className="studio-text-link" to="/kontaktai?intent=project">Aptarti jūsų klausimą <ArrowUpRight size={18} aria-hidden /></Link></div><AnimatedFAQ items={homeFAQ} /></div></section>;
}

export function CinematicLanding() {
  return <main id="main-content" tabIndex={-1} className="moto-home"><SessionIntro /><section className="moto-hero moto-dark" data-theme="dark"><div className="moto-hero-glow" aria-hidden /><div className="studio-container moto-hero-layout"><div className="moto-hero-copy"><p className="studio-eyebrow" data-entrance>SVETAINĖS · E. PARDUOTUVĖS · VERSLO SISTEMOS</p><h1 data-entrance>Kuriame interneto svetaines, e. parduotuves ir <em>verslo sistemas.</em></h1><p className="moto-hero-description" data-entrance>Kuriame ir atnaujiname verslo svetaines, diegiame registracijos, užsakymų ir klientų valdymo sistemas. Sujungiame naudojamas programas ir automatizuojame pasikartojančius darbus.</p><div className="moto-hero-actions" data-entrance><Link className="studio-button" to="/kontaktai?intent=project" data-conversion="hero_project">Aptarti projektą <ArrowUpRight size={19} aria-hidden /></Link><Link className="studio-text-link" to="/paslaugos">Peržiūrėti paslaugas <ArrowRight size={18} aria-hidden /></Link></div></div><HeroSystemScene /></div><div className="studio-container moto-hero-bottom"><span>Aiški sąsaja. Sujungti procesai.</span><a href="#veikimo-eiga">Toliau – veikimo eiga <ArrowDown size={15} aria-hidden /></a></div></section><Suspense fallback={null}><WorkflowScrollytelling /></Suspense><Suspense fallback={null}><SystemCore /></Suspense><Suspense fallback={null}><IntegrationLightScene /></Suspense><Suspense fallback={null}><ServicesShowcase /></Suspense><Suspense fallback={null}><AutomationStory /></Suspense><Suspense fallback={null}><ProjectsShowcase /></Suspense><Suspense fallback={null}><CinematicTrust /></Suspense><div className="moto-process" data-theme="light"><ProcessSection /></div><Suspense fallback={null}><ProductScene /></Suspense><Suspense fallback={null}><HomeFAQ /></Suspense></main>;
}
