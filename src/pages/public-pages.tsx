import { TrustPrinciples } from "@/components/public/testimonials";
import { getContactIntent } from "@/data/public-content";
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
import { CinematicLanding } from "@/motion/scenes";
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
        description="Kuriame ir atnaujiname interneto svetaines, elektronines parduotuves, registracijos ir individualias verslo sistemas. Sujungiame programas ir automatizuojame darbą."
        path="/"
      />
      <CinematicLanding />
    </PublicLayout>
  );
}
export function ContactPage() {
  const [params] = useSearchParams();
  const intent = getContactIntent(params.get("intent"));
  return (
    <PublicLayout>
      <Seo
        title="Aptarkime jūsų projektą | Skenis"
        description="Aptarkime jūsų interneto svetainę, e. parduotuvę, registracijos ar vidinę verslo sistemą. Parašykite apie projektą arba kasdienio darbo problemą."
        path="/kontaktai"
      />
      <main
        id="main-content"
        tabIndex={-1}
        className="studio-container studio-page-intro studio-contact-page"
      >
        <div className="studio-contact-grid">
          <div className="studio-contact-copy">
            <p className="studio-eyebrow">Geras pokalbis — gera pradžia</p>
            <h1>Aptarkime jūsų svetainę ar sistemą.</h1>
            <p>
              Parašykite, ar jums reikia svetainės, e. parduotuvės,
              registracijos, vidinės sistemos ar automatizavimo. Jei dar
              nežinote tinkamo sprendimo, aprašykite, kas šiuo metu trukdo
              dirbti arba aptarnauti klientus.
            </p>
            {intent === "demo" && (
              <p className="contact-demo-explanation">
                Pradinę koncepciją parengiame tinkamiems projektams po pirminio
                aptarimo. Jos apimtį sutariame kartu.
              </p>
            )}
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
                    Pasiūlysime tinkamą svetainės, sistemos ar automatizavimo
                    kryptį.
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
        title="Svetainių ir sistemų pavyzdžiai | Skenis"
        description="Išbandykite registracijos ir skaičiuoklės demonstracijas, apžiūrėkite svetainės koncepciją. Konkretūs skaitmeninių sprendimų pavyzdžiai jūsų verslui."
        path="/sprendimai"
      />
      <main id="main-content" tabIndex={-1}>
        <section className="studio-container studio-page-intro solutions-intro">
          <p className="studio-eyebrow">Demonstracijų centras</p>
          <div className="page-intro-row">
            <h1>Svetainių ir sistemų pavyzdžiai</h1>
            <div>
              <p>
                Pasirinkite vieną scenarijų, atlikite veiksmą ir pamatykite,
                ką gauna klientas bei jūsų komanda.
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

      </main>
    </PublicLayout>
  );
}
export function AboutPage() {
  return (
    <PublicLayout>
      <Seo
        title="Apie Skenis – skaitmeninių sprendimų studiją"
        description="Kuriame interneto svetaines, verslo sistemas ir automatizavimo sprendimus smulkiam bei augančiam verslui. Aptariame procesą, apimtį ir tikriname naudojimo eigą."
        path="/apie"
      />
      <main id="main-content" tabIndex={-1}>
        <section className="studio-container studio-page-intro about-story">
          <p className="studio-eyebrow">Apie Skenis</p>
          <div className="page-intro-row">
            <h1>Apie „Skenis“</h1>
            <p>
              Kuriame interneto svetaines, verslo sistemas ir automatizavimo
              sprendimus smulkiam bei augančiam verslui.
            </p>
          </div>
        </section>
        <section className="studio-section about-focus">
          <div className="studio-container">
            <div className="about-focus-heading">
              <p className="studio-eyebrow">Kam padedame</p>
              <h2>
                Verslui, kuriam reikia aiškios svetainės ir patogesnio darbo.
              </h2>
              <p>
                Kuriame paslaugų pristatymą ir e. prekybos eigą, klientų
                registraciją bei vidinius komandos įrankius. Sprendimą parenkame
                pagal konkretų poreikį ir naudojamas programas.
              </p>
            </div>
            <div className="about-focus-grid">
              <article>
                <span>01 / Klientams</span>
                <h3>Svetainė, parduotuvė ar registracija</h3>
                <p>
                  Padedame suprasti jūsų pasiūlymą, išsirinkti ir pateikti
                  užklausą, užsakymą ar registraciją.
                </p>
                <Link to="/paslaugos/svetaines" className="studio-text-link">
                  Apie svetainių kūrimą
                  <ArrowUpRight size={17} aria-hidden />
                </Link>
              </article>
              <article>
                <span>02 / Komandai</span>
                <h3>Užduotys, klientai ir procesai</h3>
                <p>
                  Sujungiame užklausas, dokumentus ir darbus. Automatizuojame
                  sutartus veiksmus tarp naudojamų sistemų.
                </p>
                <Link
                  to="/paslaugos/verslo-sistemos"
                  className="studio-text-link"
                >
                  Apie verslo sistemas
                  <ArrowUpRight size={17} aria-hidden />
                </Link>
              </article>
            </div>
          </div>
        </section>
        <section className="studio-container about-evidence">
          <div className="about-evidence-copy">
            <p className="studio-eyebrow">Galima pamatyti ir išbandyti</p>
            <h2>Veikimo eiga svarbiau už pažadų sąrašą.</h2>
            <p>
              Pavyzdžių puslapyje išbandykite registraciją, skaičiuoklę ar
              komandos darbų sistemą. Tai aiškiai pažymėtos demonstracijos,
              skirtos aptarti galimą jūsų sprendimą.
            </p>
            <Link to="/sprendimai" className="studio-text-link">
              Išbandyti pavyzdžius
              <ArrowUpRight size={17} aria-hidden />
            </Link>
          </div>
          <article className="about-evidence-product">
            <img
              src="/images/skenis-product-front.jpg"
              alt="Skenis NFC ir QR atsiliepimų kortelė"
              width="1280"
              height="1024"
              loading="lazy"
            />
            <div>
              <h3>Mūsų NFC ir QR produktas</h3>
              <p>
                Kortelė su valdoma atsiliepimų nuoroda. Nuorodos keitimas ir
                skenavimų statistika vienoje sistemoje.
              </p>
              <Link to="/google-atsiliepimai" className="studio-text-link">
                Produktas ir kainos
                <ArrowUpRight size={17} aria-hidden />
              </Link>
            </div>
          </article>
        </section>
        <section className="studio-section">
          <div className="studio-container">
            <div className="studio-section-heading">
              <div>
                <p className="studio-eyebrow">Prieš bendrą darbą</p>
                <h2>Ką sutariame kartu</h2>
              </div>
            </div>
            <TrustPrinciples />
          </div>
        </section>
        <ProcessSection about />

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
