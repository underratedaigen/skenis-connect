import { DemoGallery } from "@/components/public/demo-gallery";
import { lazy, Suspense } from "react";
import { ArrowRight, ArrowUpRight, Mail, Phone } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { PublicLayout } from "@/components/public/site-layout";
import {
  StudioLanding,
  DemoCTA,
  ProcessSection,
  ProductSpotlight,
} from "@/components/public/studio-landing";
import { Seo } from "@/components/public/seo";
const StudioContactForm = lazy(() =>
  import("@/components/public/studio-contact-form").then((module) => ({
    default: module.StudioContactForm,
  })),
);
const ProductLanding = lazy(() =>
  import("@/components/public/landing-page").then((module) => ({
    default: module.SkenisLanding,
  })),
);

export function HomePage() {
  return (
    <PublicLayout>
      <Seo
        title="Skenis – svetainės, sistemos ir automatizacijos verslui"
        description="Kuriame interneto svetaines, rezervacijų sistemas, individualius verslo įrankius ir automatizacijas. Papasakokite savo idėją – pasiūlysime sprendimą."
        path="/"
      />
      <StudioLanding />
    </PublicLayout>
  );
}
export function ContactPage() {
  const [params] = useSearchParams();
  const intent = params.get("intent") === "project" ? "project" : "demo";
  return (
    <PublicLayout>
      <Seo
        title="Aptarkime jūsų projektą | Skenis"
        description="Papasakokite, ką norėtumėte pagerinti savo versle. Aptarsime svetainę, sistemą ar automatizaciją ir galimybę paruošti nemokamą pradinį pavyzdį."
        path="/kontaktai"
      />
      <main
        id="main-content"
        tabIndex={-1}
        className="studio-container studio-page-intro"
      >
        <div className="studio-contact-grid">
          <div className="studio-contact-copy">
            <p className="studio-eyebrow">Geras pokalbis — gera pradžia</p>
            <h1>
              {intent === "demo" ? (
                <>
                  Pirmiausia —<br />
                  jūsų idėja.
                </>
              ) : (
                <>
                  Aptarkime
                  <br />
                  jūsų projektą.
                </>
              )}
            </h1>
            <p>
              Nežinote, kokios sistemos reikia? Papasakokite, kas užima per daug
              laiko arba galėtų veikti geriau. Kryptį pasiūlysime mes.
            </p>
            <div className="studio-contact-details">
              <span>Patogiau pasikalbėti tiesiogiai?</span>
              <a
                href="mailto:skenis.info@gmail.com"
                data-conversion="email_click"
              >
                <Mail size={18} aria-hidden />
                skenis.info@gmail.com
              </a>
              <a href="tel:+37062357946" data-conversion="phone_click">
                <Phone size={18} aria-hidden />
                +370 623 57 946
              </a>
              <a href="tel:+37062375231" data-conversion="phone_click">
                <Phone size={18} aria-hidden />
                +370 623 75 231
              </a>
            </div>
          </div>
          <div className="studio-contact-form-wrap">
            <div className="contact-form-heading">
              <strong>Trumpai susipažinkime.</strong>
              <span>Be įsipareigojimo</span>
            </div>
            <Suspense fallback={<p role="status">Forma įkeliama…</p>}>
              <StudioContactForm
                initialService={params.get("service") || undefined}
                intent={intent}
              />
            </Suspense>
          </div>
          <div className="studio-contact-aside">
            <div className="studio-contact-expectation">
              <strong>Kas bus toliau?</strong>
              <ol className="contact-next-steps">
                <li>
                  <b>01</b>
                  <span>
                    Perskaitysime jūsų idėją ir susisieksime patikslinti
                    poreikio.
                  </span>
                </li>
                <li>
                  <b>02</b>
                  <span>
                    Tinkamam projektui sutarsime nemokamos pradinės koncepcijos
                    apimtį.
                  </span>
                </li>
                <li>
                  <b>03</b>
                  <span>
                    Darbų apimtį, kainą ir eigą suderinsime prieš pradėdami.
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
export function SolutionsPage() {
  return (
    <PublicLayout>
      <Seo
        title="Sprendimų pavyzdžiai ir koncepcijos | Skenis"
        description="Išbandykite registracijos ir skaičiuoklės demonstracijas, apžiūrėkite svetainės koncepciją. Konkretūs skaitmeninių sprendimų pavyzdžiai jūsų verslui."
        path="/sprendimai"
      />
      <main id="main-content" tabIndex={-1}>
        <section className="studio-container studio-page-intro">
          <p className="studio-eyebrow">Sprendimų laboratorija</p>
          <div className="page-intro-row">
            <h1>
              Mažiau aiškinimo.
              <br />
              Daugiau išbandymo.
            </h1>
            <div>
              <p>
                Pasirinkite laiką. Pakeiskite skaičių. Perduokite demo užklausą.
                Taip lengviau įsivaizduoti, kas tiktų jūsų verslui.
              </p>
              <p className="studio-page-lead">
                Vidinės koncepcijos ir demonstracijos. Tikri klientų duomenys
                nenaudojami.
              </p>
            </div>
          </div>
        </section>
        <DemoGallery />
        <ProductSpotlight entry />
        <DemoCTA compact />
      </main>
    </PublicLayout>
  );
}
export function AboutPage() {
  return (
    <PublicLayout>
      <Seo
        title="Apie Skenis – skaitmeninių sprendimų studiją"
        description="Padedame verslui supaprastinti darbą svetainėmis, sistemomis ir automatizacijomis. Pradedame nuo problemos, kartu sutariame sprendimą."
        path="/apie"
      />
      <main id="main-content" tabIndex={-1}>
        <section className="studio-container studio-page-intro about-story">
          <p className="studio-eyebrow">Apie Skenis</p>
          <div className="page-intro-row">
            <h1>
              Pradedame nuo to,
              <br />
              kas trukdo.
            </h1>
            <p>
              Paprastesnis kelias klientui. Aiškesnė diena komandai. Šį principą
              taikome ir mažam fiziniam produktui, ir visai verslo sistemai.
            </p>
          </div>
          <div className="about-chapters">
            <article>
              <span>01 / Klausimas</span>
              <h2>Kaip palikti atsiliepimą paprasčiau?</h2>
              <p>
                Nuo šio konkretaus klausimo ir NFC / QR kortelės prasidėjo
                „Skenis“. Vietoje nuorodos paieškų – vienas telefono
                prisilietimas.
              </p>
            </article>
            <article className="about-product-chapter">
              <span>02 / Veikiantis ryšys</span>
              <div>
                <img
                  src="/images/skenis-product-front.jpg"
                  alt="Pirmasis Skenis produktas – NFC ir QR kortelė"
                  width="1280"
                  height="1024"
                  loading="lazy"
                />
                <h2>
                  Fizinė kortelė.
                  <br />
                  Valdoma nuoroda.
                </h2>
              </div>
              <p>
                Produktą sujungėme su keičiama nuoroda ir skenavimų statistika.
              </p>
              <Link to="/google-atsiliepimai" className="studio-text-link">
                Pamatyti produktą <ArrowUpRight size={18} aria-hidden />
              </Link>
            </article>
            <article>
              <span>03 / Tas pats požiūris</span>
              <h2>Nuo vieno veiksmo iki viso proceso.</h2>
              <p>
                Šiandien kuriame svetaines, verslo sistemas ir automatizacijas.
                Pradžia ta pati: suprasti problemą ir sujungti veiksmus į aiškų
                kelią.
              </p>
              <Link to="/sprendimai" className="studio-text-link">
                Išbandyti sprendimus <ArrowUpRight size={18} aria-hidden />
              </Link>
            </article>
          </div>
        </section>
        <ProcessSection about />
        <DemoCTA />
      </main>
    </PublicLayout>
  );
}
export function ReviewProductPage() {
  return (
    <PublicLayout>
      <Seo
        title="NFC + QR Google atsiliepimų kortelės | Skenis"
        description="Skenis NFC ir QR kortelės su keičiama Google atsiliepimų nuoroda, individualiais kodais ir skenavimų statistika. Pasirinkite kiekį ir gaukite pasiūlymą."
        path="/google-atsiliepimai"
        service={{
          name: "Google atsiliepimų NFC ir QR sprendimai",
          description:
            "Fizinės NFC ir QR kortelės su valdomomis nuorodomis bei skenavimų statistika.",
        }}
      />
      <Suspense
        fallback={
          <main
            id="main-content"
            tabIndex={-1}
            className="studio-container studio-section"
            role="status"
          >
            Produktas įkeliamas…
          </main>
        }
      >
        <ProductLanding />
      </Suspense>
    </PublicLayout>
  );
}

export function PrivacyPage() {
  return (
    <PublicLayout>
      <Seo
        title="Privatumo politika | Skenis"
        description="Kaip Skenis naudoja užklausų kontaktinius duomenis ir NFC bei QR nuorodų skenavimų informaciją."
        path="/privatumo-politika"
      />
      <main
        id="main-content"
        tabIndex={-1}
        className="studio-container studio-page-intro studio-legal"
      >
        <p className="studio-eyebrow">Informacija</p>
        <h1>Privatumo politika</h1>
        <p>
          Renkame tik tuos duomenis, kurie būtini užklausoms apdoroti, QR
          nuorodoms administruoti ir skenavimų statistikai pateikti. Skenavimų
          analitikoje naudojamas IP maišos kodas, kai tokie duomenys renkami, o
          ne žalias IP adresas.
        </p>
        <h2>Jūsų užklausos duomenys</h2>
        <p>
          Formoje pateiktą vardą, įmonę, kontaktinius duomenis, svetainę ir
          projekto aprašymą naudojame atsakyti į užklausą, aptarti sprendimą,
          pasiūlymą, maketą ar gamybą. Duomenys nėra parduodami trečiosioms
          šalims.
        </p>
        <p>
          Užklausos saugomos esamoje Skenis Supabase sistemoje. Prašome nesiųsti
          slaptažodžių ar jautrių klientų duomenų užklausos formoje.
        </p>
        <h2>Susisiekite dėl savo duomenų</h2>
        <p>
          Norėdami pasiteirauti apie pateiktus duomenis, juos patikslinti arba
          paprašyti ištrinti, parašykite{" "}
          <a href="mailto:skenis.info@gmail.com">skenis.info@gmail.com</a>.
        </p>
        <h2>Techninis saugojimas</h2>
        <p>
          Administravimo prisijungimui naudojamas sesijos saugojimas naršyklėje.
          Šis svetainės atnaujinimas neprideda trečiųjų šalių reklamos ar
          analitikos sekiklių.
        </p>
      </main>
    </PublicLayout>
  );
}

export function TermsPage() {
  return (
    <PublicLayout>
      <Seo
        title="Paslaugų ir produkto taisyklės | Skenis"
        description="Skenis skaitmeninių paslaugų aptarimas, pradinės koncepcijos ir Google atsiliepimų NFC bei QR produkto naudojimas."
        path="/taisykles"
      />
      <main
        id="main-content"
        tabIndex={-1}
        className="studio-container studio-page-intro studio-legal"
      >
        <p className="studio-eyebrow">Informacija</p>
        <h1>Paslaugų ir produkto taisyklės</h1>
        <h2>Individualūs sprendimai</h2>
        <p>
          Skaitmeninių projektų darbų apimtį, kainą, terminus ir priežiūrą
          sutariame individualiai prieš pradėdami darbus. Užklausos pateikimas
          neįpareigoja užsakyti mokamų paslaugų.
        </p>
        <h2>Nemokamas pradinis pavyzdys</h2>
        <p>
          Tinkamiems projektams galime paruošti pradinę koncepciją ar
          demonstraciją. Jos galimybę ir apimtį aptariame gavę užklausą.
          Pavyzdys nėra baigtas nemokamas projektas.
        </p>
        <h2>NFC ir QR produktai</h2>
        <p>
          Skenis teikia programuojamų QR kortelių ir stendų gamybos bei
          administravimo paslaugą. Klientas atsako už pateiktos Google
          atsiliepimų nuorodos teisingumą ir teisėtą atsiliepimų rinkimo
          praktiką.
        </p>
        <p>
          Draudžiama siūlyti atlygį už atsiliepimus ar skatinti tik teigiamus
          įvertinimus.
        </p>
        <p>
          Skenis nėra oficialus Google produktas. Google yra Google LLC prekių
          ženklas. Kortelė nukreipia į įmonės Google atsiliepimų puslapį.
        </p>
        <p>
          Produkto galutinę kainą ir gamybos terminą patvirtiname individualiame
          pasiūlyme.
        </p>
      </main>
    </PublicLayout>
  );
}

export function NotFoundPage() {
  return (
    <PublicLayout>
      <Seo
        title="Puslapis nerastas | Skenis"
        description="Šio puslapio nepavyko rasti. Peržiūrėkite Skenis paslaugas arba grįžkite į pradžią."
        path="/404"
        noIndex
      />
      <main
        id="main-content"
        tabIndex={-1}
        className="studio-container studio-page-intro"
        style={{ minHeight: "60vh" }}
      >
        <p className="studio-eyebrow">404 / Pasiklydusi nuoroda</p>
        <h1>Čia sprendimo neradome.</h1>
        <p className="studio-page-lead">
          Tačiau jūsų verslui jį galime sukurti. Grįžkite į pradžią arba
          peržiūrėkite paslaugas.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/" className="studio-button">
            Į pradžią <ArrowRight size={17} aria-hidden />
          </Link>
          <Link to="/paslaugos" className="studio-button secondary">
            Peržiūrėti paslaugas
          </Link>
        </div>
      </main>
    </PublicLayout>
  );
}
