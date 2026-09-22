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
  getServiceBySlug,
  primaryServices,
  type ServiceCategory,
} from "@/data/services";

function ServiceCard({
  service,
  index,
}: {
  service: ServiceCategory;
  index: number;
}) {
  const Icon = service.icon;
  return (
    <Link
      to={`/paslaugos/${service.slug}`}
      className="group flex h-full flex-col rounded-3xl border border-line bg-white p-6 transition-colors hover:border-brand-300 hover:bg-brand-50/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 sm:p-8"
    >
      <div className="mb-8 flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Icon size={21} strokeWidth={1.6} aria-hidden />
        </span>
        <span className="font-mono text-xs text-slate-400" aria-hidden>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h2 className="text-xl font-semibold tracking-[-0.035em] text-ink sm:text-2xl">
        {service.title}
      </h2>
      <p className="mb-7 mt-3 max-w-lg text-sm leading-7 text-slate-600">
        {service.description}
      </p>
      <div className="mt-auto flex items-center justify-between gap-4 border-t border-line/80 pt-5 text-sm font-semibold text-brand-700">
        <span>Plačiau apie sprendimus</span>
        <ArrowUpRight
          size={19}
          strokeWidth={1.6}
          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
          aria-hidden
        />
      </div>
    </Link>
  );
}

function ServiceCta({ service }: { service?: ServiceCategory }) {
  return (
    <section
      className="studio-section pt-0"
      aria-labelledby="service-cta-heading"
    >
      <div className="studio-container">
        <div className="grid gap-8 rounded-[2rem] bg-ink p-7 text-white sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:p-14">
          <div className="max-w-2xl">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-200">
              Pradėkime nuo pokalbio
            </p>
            <h2
              id="service-cta-heading"
              className="text-[1.9rem] font-semibold leading-tight tracking-[-0.045em] sm:text-4xl"
            >
              Papasakokite, kas šiandien užima per daug laiko.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
              Nereikia techninės užduoties. Padėsime išgryninti poreikį, o
              tinkamiems projektams paruošime nemokamą pradinę koncepciją.
            </p>
          </div>
          <Link
            to={service ? `/kontaktai?service=${service.slug}` : "/kontaktai"}
            data-conversion="service_enquiry"
            className="studio-button !bg-white !text-ink hover:!bg-brand-100"
          >
            Gauti nemokamą pavyzdį <ArrowUpRight size={17} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ServicesPage() {
  const reputation = getServiceBySlug("atsiliepimai")!;
  const ReputationIcon = reputation.icon;

  return (
    <PublicLayout>
      <Seo
        title="Paslaugos: svetainės, sistemos ir automatizacijos | Skenis"
        description="Svetainių kūrimas, rezervacijų sistemos, CRM, skaičiuoklės, verslo automatizavimas ir e. komercija. Parenkame sprendimą pagal jūsų verslo poreikį."
        path="/paslaugos"
      />
      <main id="main-content">
        <section
          className="studio-page-intro"
          aria-labelledby="services-heading"
        >
          <div className="studio-container">
            <p className="studio-eyebrow">Paslaugos</p>
            <div className="mt-6 grid gap-7 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-20">
              <h1
                id="services-heading"
                className="max-w-3xl text-[2.6rem] font-semibold leading-[1.12] tracking-[-0.055em] sm:text-5xl lg:text-[3.6rem]"
              >
                Nuo geros svetainės
                <br className="hidden sm:block" /> iki tvarkingesnio darbo.
              </h1>
              <div>
                <p className="max-w-lg text-base leading-8 text-slate-600">
                  Kiekvienas verslas turi savų iššūkių. Kuriame svetaines,
                  įrankius ir sistemas, kurios padeda juos spręsti.
                </p>
                <a
                  href="#paslaugu-kryptys"
                  className="mt-5 inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-ink hover:text-brand-700"
                >
                  Raskite savo kryptį <ArrowDown size={16} aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="paslaugu-kryptys"
          className="studio-section !pt-0"
          aria-label="Paslaugų kryptys"
        >
          <div className="studio-container">
            <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
              {primaryServices.map((service, index) => (
                <ServiceCard
                  key={service.slug}
                  service={service}
                  index={index}
                />
              ))}
            </div>

            <div className="mt-5 grid gap-6 rounded-3xl border border-line bg-mist p-6 sm:p-8 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-white text-brand-700">
                <ReputationIcon size={23} strokeWidth={1.6} aria-hidden />
              </div>
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Pažįstamas Skenis sprendimas
                </p>
                <h2 className="text-xl font-semibold tracking-[-0.035em]">
                  Google atsiliepimai, NFC ir QR
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                  Mūsų kortelės niekur nedingo. Padėkite klientams lengviau
                  pasidalyti patirtimi ir atraskite kitus reputacijos
                  sprendimus.
                </p>
              </div>
              <Link
                to="/paslaugos/atsiliepimai"
                className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-ink hover:text-brand-700"
              >
                Apie sprendimą <ArrowUpRight size={18} aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        <section
          className="studio-section border-t border-line"
          aria-labelledby="service-selection-heading"
        >
          <div className="studio-container grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div>
              <p className="studio-eyebrow">Sprendimas pagal poreikį</p>
              <h2
                id="service-selection-heading"
                className="mt-5 max-w-md text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl"
              >
                Nežinote, kokios sistemos reikia?
              </h2>
            </div>
            <div>
              <p className="max-w-xl text-base leading-8 text-slate-600">
                Pradėkime nuo to, kas neveikia: pasimetančių užklausų,
                pasikartojančio duomenų kopijavimo ar svetainės, kuri
                nebeatspindi jūsų verslo. Techninį sprendimą pasiūlysime mes.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/kontaktai?intent=project" className="studio-button secondary" data-conversion="service_enquiry">
                  Aptarti projektą <ArrowRight size={16} aria-hidden />
                </Link>
                <Link
                  to="/#kaip-dirbame"
                  className="inline-flex min-h-12 items-center px-3 text-sm font-semibold text-slate-600 hover:text-brand-700"
                >
                  Kaip dirbame
                </Link>
              </div>
            </div>
          </div>
        </section>
        <ServiceCta />
      </main>
    </PublicLayout>
  );
}

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const service = getServiceBySlug(slug);

  if (!service) {
    return (
      <PublicLayout>
        <Seo
          title="Paslauga nerasta | Skenis"
          description="Atraskite Skenis svetainių kūrimo, verslo sistemų ir automatizavimo paslaugas."
          path={`/paslaugos/${slug ?? ""}`}
          noIndex
        />
        <main id="main-content" className="studio-section">
          <div className="studio-container">
            <p className="studio-eyebrow">404</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight">
              Šios paslaugos puslapio neradome.
            </h1>
            <p className="mt-5 text-slate-600">
              Peržiūrėkite paslaugų kryptis arba papasakokite apie savo idėją.
            </p>
            <Link to="/paslaugos" className="studio-button mt-8">
              Visos paslaugos <ArrowRight size={17} aria-hidden />
            </Link>
          </div>
        </main>
      </PublicLayout>
    );
  }

  const Icon = service.icon;
  const relatedSlugs: Record<string, string[]> = {
    svetaines: ["pardavimu-irankiai", "registracijos", "e-komercija"],
    registracijos: ["automatizacijos", "verslo-sistemos", "atsiliepimai"],
    "pardavimu-irankiai": ["skaiciuokles", "automatizacijos", "svetaines"],
    skaiciuokles: ["pardavimu-irankiai", "verslo-sistemos", "svetaines"],
    "verslo-sistemos": [
      "automatizacijos",
      "pardavimu-irankiai",
      "ai-sprendimai",
    ],
    automatizacijos: ["verslo-sistemos", "ai-sprendimai", "registracijos"],
    "ai-sprendimai": ["automatizacijos", "verslo-sistemos", "e-komercija"],
    "e-komercija": ["automatizacijos", "pardavimu-irankiai", "ai-sprendimai"],
    atsiliepimai: ["svetaines", "registracijos", "automatizacijos"],
  };
  const relatedServices = (relatedSlugs[service.slug] ?? [])
    .map(getServiceBySlug)
    .filter((item): item is ServiceCategory => !!item);

  return (
    <PublicLayout>
      <Seo
        title={`${service.title} | Skenis`}
        description={service.description}
        path={`/paslaugos/${service.slug}`}
        service={{ name: service.title, description: service.description }}
      />
      <main id="main-content">
        <section
          className="studio-page-intro"
          aria-labelledby="service-heading"
        >
          <div className="studio-container">
            <nav
              aria-label="Puslapio kelias"
              className="mb-9 flex flex-wrap items-center gap-2 text-xs text-slate-500"
            >
              <Link to="/" className="py-2 hover:text-ink">
                Pradžia
              </Link>
              <span aria-hidden>/</span>
              <Link to="/paslaugos" className="py-2 hover:text-ink">
                Paslaugos
              </Link>
              <span aria-hidden>/</span>
              <span aria-current="page" className="text-ink">
                {service.shortTitle}
              </span>
            </nav>
            <div className="grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:items-end lg:gap-20">
              <div>
                <p className="studio-eyebrow">{service.title}</p>
                <h1
                  id="service-heading"
                  className="mt-6 max-w-3xl text-[2.5rem] font-semibold leading-[1.13] tracking-[-0.055em] sm:text-5xl lg:text-[3.45rem]"
                >
                  {service.headline}
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
                  {service.description}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to={`/kontaktai?service=${service.slug}`}
                    data-conversion="service_enquiry"
                    className="studio-button"
                  >
                    Gauti nemokamą pavyzdį{" "}
                    <ArrowUpRight size={17} aria-hidden />
                  </Link>
                  <a
                    href="#galimybes"
                    className="inline-flex min-h-12 items-center gap-3 px-3 text-sm font-semibold text-slate-600 hover:text-brand-700"
                  >
                    Ką galime sukurti <ArrowDown size={15} aria-hidden />
                  </a>
                </div>
              </div>
              <aside
                className="relative overflow-hidden rounded-3xl border border-line bg-mist p-7 sm:p-9"
                aria-label="Sprendimo nauda"
              >
                <div className="mb-9 flex items-center justify-between">
                  <Icon
                    size={29}
                    strokeWidth={1.4}
                    className="text-brand-700"
                    aria-hidden
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-brand-500"
                    aria-hidden
                  />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Tikslas
                </p>
                <p className="mt-4 text-2xl font-semibold leading-snug tracking-[-0.035em] text-ink">
                  {service.outcome}
                </p>
                <div className="mt-7 border-t border-line pt-5 text-xs leading-6 text-slate-500">
                  Sprendimo apimtį, terminą ir kainą sutariame pagal jūsų
                  situaciją.
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section
          className="studio-section border-y border-line bg-mist/60"
          aria-labelledby="service-problem-heading"
        >
          <div className="studio-container grid gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
            <div>
              <p className="studio-eyebrow">Pažįstama situacija?</p>
              <h2
                id="service-problem-heading"
                className="mt-5 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl"
              >
                Kur stringa kasdienis darbas.
              </h2>
              <p className="mt-5 text-sm leading-8 text-slate-600">
                {service.problem}
              </p>
            </div>
            <div>
              <p className="studio-eyebrow">Mūsų požiūris</p>
              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                Pradėkime nuo to, kas svarbu.
              </h2>
              <p className="mt-5 text-sm leading-8 text-slate-600">
                {service.approach}
              </p>
            </div>
          </div>
        </section>

        <section
          id="galimybes"
          className="studio-section"
          aria-labelledby="service-capabilities-heading"
        >
          <div className="studio-container grid gap-9 lg:grid-cols-[0.85fr_1.6fr] lg:gap-16">
            <div>
              <p className="studio-eyebrow">Galimybės</p>
              <h2
                id="service-capabilities-heading"
                className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl"
              >
                Ką galime sukurti.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-600">
                Vieną konkretų įrankį arba kelis tarpusavyje veikiančius
                sprendimus. Apimtį parenkame pagal jūsų poreikį.
              </p>
            </div>
            <ul className="grid content-start gap-x-8 sm:grid-cols-2">
              {service.capabilities.map((capability) => (
                <li
                  key={capability}
                  className="flex items-start gap-3 border-b border-line py-4 text-sm leading-6 text-slate-700"
                >
                  <Check
                    size={16}
                    strokeWidth={1.8}
                    className="mt-1 shrink-0 text-brand-600"
                    aria-hidden
                  />
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="studio-section !pt-0"
          aria-labelledby="service-examples-heading"
        >
          <div className="studio-container">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="studio-eyebrow">Praktikoje</p>
                <h2
                  id="service-examples-heading"
                  className="mt-5 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl"
                >
                  Kaip tai galėtų atrodyti.
                </h2>
              </div>
              <p className="max-w-xs text-xs leading-6 text-slate-500">
                Galimų sprendimų pavyzdžiai. Kiekvieną pritaikome konkrečiam
                verslui.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {service.examples.map((example, index) => (
                <article
                  key={example.title}
                  className="rounded-3xl border border-line bg-mist/50 p-6 sm:p-7"
                >
                  <div className="mb-7 flex items-center justify-between">
                    <span
                      className="font-mono text-xs text-brand-700"
                      aria-hidden
                    >
                      0{index + 1}
                    </span>
                    <span className="rounded-full border border-line bg-white px-2.5 py-1 text-[10px] font-medium text-slate-500">
                      Pavyzdys
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold leading-snug tracking-[-0.025em]">
                    {example.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {example.description}
                  </p>
                </article>
              ))}
            </div>
            {service.slug === "atsiliepimai" && (
              <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-2xl border border-brand-200 bg-brand-50 p-6 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-semibold text-ink">
                    Ieškote NFC kortelės?
                  </h3>
                  <p className="mt-1 text-sm leading-7 text-slate-600">
                    Peržiūrėkite esamą produktą, jo funkcijas ir užsakymo
                    galimybes.
                  </p>
                </div>
                <Link
                  to="/google-atsiliepimai"
                  className="studio-button secondary shrink-0"
                >
                  Peržiūrėti korteles <ArrowUpRight size={16} aria-hidden />
                </Link>
              </div>
            )}
          </div>
        </section>

        <section
          className="studio-section border-t border-line"
          aria-labelledby="service-faq-heading"
        >
          <div className="studio-container grid gap-9 lg:grid-cols-[0.85fr_1.6fr] lg:gap-16">
            <div>
              <p className="studio-eyebrow">Prieš pradedant</p>
              <h2
                id="service-faq-heading"
                className="mt-5 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl"
              >
                Dažni klausimai.
              </h2>
              <Link
                to={`/kontaktai?service=${service.slug}`}
                data-conversion="service_enquiry"
                className="mt-5 inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-brand-700"
              >
                Aptarti savo situaciją <ArrowUpRight size={17} aria-hidden />
              </Link>
            </div>
            <div className="border-t border-line">
              {service.faq.map((item) => (
                <details
                  key={item.question}
                  className="group border-b border-line"
                >
                  <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-5 py-5 text-sm font-semibold leading-6 text-ink hover:text-brand-700 [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <ChevronDown
                      size={17}
                      className="shrink-0 text-slate-500 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                      aria-hidden
                    />
                  </summary>
                  <p className="max-w-2xl pb-6 pr-6 text-sm leading-7 text-slate-600">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          className="studio-section !pt-0"
          aria-labelledby="related-services-heading"
        >
          <div className="studio-container">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2
                id="related-services-heading"
                className="text-xl font-semibold tracking-[-0.03em]"
              >
                Dažnai veikia kartu
              </h2>
              <Link
                to="/paslaugos"
                className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-slate-600 hover:text-brand-700"
              >
                Visos paslaugos <ArrowRight size={15} aria-hidden />
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {relatedServices.map((related) => {
                const RelatedIcon = related.icon;
                return (
                  <Link
                    key={related.slug}
                    to={`/paslaugos/${related.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-line px-5 py-6 transition-colors hover:border-brand-300 hover:bg-brand-50/40"
                  >
                    <RelatedIcon
                      size={20}
                      strokeWidth={1.5}
                      className="shrink-0 text-brand-700"
                      aria-hidden
                    />
                    <span className="text-sm font-semibold">
                      {related.shortTitle}
                    </span>
                    <ArrowUpRight
                      size={17}
                      className="ml-auto shrink-0 text-slate-400 group-hover:text-brand-700"
                      aria-hidden
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
        <ServiceCta service={service} />
      </main>
    </PublicLayout>
  );
}
