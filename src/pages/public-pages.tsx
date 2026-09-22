import { lazy, Suspense } from "react";
import { ArrowRight, ArrowUpRight, Check, Mail, Phone } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { PublicLayout } from "@/components/public/site-layout";
import {
  StudioLanding,
  DemoCTA,
  ProcessSection,
  ProjectGrid,
  WorkflowPreview,
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
      <main id="main-content" className="studio-container studio-page-intro">
        <div className="studio-contact-grid">
          <div className="studio-contact-copy">
            <p className="studio-eyebrow">Nuo čia prasideda sprendimas</p>
            <h1>
              {intent === "demo" ? (
                <>
                  Pirmiausia –<br />
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
              Nežinote, kokios sistemos reikia? Ir nereikia. Papasakokite, kas
              užima per daug laiko arba galėtų veikti geriau. Kryptį pasiūlysime
              mes.
            </p>
          </div>
          <div className="studio-contact-form-wrap">
            <Suspense fallback={<p role="status">Forma įkeliama…</p>}>
              <StudioContactForm
                initialService={params.get("service") || undefined}
                intent={intent}
              />
            </Suspense>
          </div>
          <div className="studio-contact-aside">
            <div className="studio-contact-details">
              <span>Arba susisiekite tiesiogiai</span>
              <a
                href="mailto:skenis.info@gmail.com"
                data-conversion="email_click"
              >
                <Mail size={17} aria-hidden /> skenis.info@gmail.com
              </a>
              <a href="tel:+37062357946" data-conversion="phone_click">
                <Phone size={17} aria-hidden /> +370 623 57 946
              </a>
              <a href="tel:+37062375231" data-conversion="phone_click">
                <Phone size={17} aria-hidden /> +370 623 75 231
              </a>
            </div>
            <div className="studio-contact-expectation">
              <strong>Kas bus toliau?</strong>
              <p>
                Peržiūrėsime užklausą ir susisieksime patikslinti poreikio. Jei
                projektas tinkamas, sutarsime dėl nemokamos pradinės
                koncepcijos. Darbų apimtį ir kainą suderinsime prieš pradėdami.
              </p>
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
      <main id="main-content">
        <section className="studio-container studio-page-intro">
          <p className="studio-eyebrow">Sprendimų laboratorija</p>
          <h1>
            Ne tik papasakoti.
            <br />
            Parodyti, kaip veikia.
          </h1>
          <p className="studio-page-lead">
            Čia – mūsų vidinės koncepcijos ir demonstracijos. Išbandykite,
            įsivaizduokite savo versle ir pasakykite, ką pritaikytume jums.
          </p>
        </section>
        <section
          className="studio-container studio-section"
          style={{ paddingTop: 0 }}
          aria-label="Sprendimų koncepcijos"
        >
          <ProjectGrid />
          <div className="studio-case-explainer">
            <article>
              <p className="studio-eyebrow">01 / Svetainė</p>
              <h2>Suprantama nuo pirmo apsilankymo.</h2>
              <p>
                Problema: lankytojui neaišku, kuo verslas gali padėti.
                Sprendimas: paslaugų struktūra, aiškus turinys ir matoma
                užklausos forma.
              </p>
            </article>
            <article>
              <p className="studio-eyebrow">02 / Registracija</p>
              <h2>Mažiau skambučių dėl laiko.</h2>
              <p>
                Problema: laikus reikia derinti telefonu. Sprendimas: laisvų
                laikų pasirinkimas, patvirtinimas ir priminimai. Šiame demo
                galima išbandyti laiko pasirinkimą.
              </p>
            </article>
            <article>
              <p className="studio-eyebrow">03 / Skaičiuoklė</p>
              <h2>Atsakymas dar prieš pokalbį.</h2>
              <p>
                Problema: kiekvieną preliminarią sąmatą skaičiuojate iš naujo.
                Sprendimas: skaičiuoklė pagal jūsų kainodarą. Šio demo įkainis
                yra iliustracinis.
              </p>
            </article>
          </div>
        </section>
        <section className="studio-about-strip studio-section">
          <div className="studio-container studio-about-strip-grid">
            <div>
              <p className="studio-eyebrow">Veikiantis Skenis produktas</p>
              <h2>NFC + QR atsiliepimų sistema.</h2>
            </div>
            <div>
              <p>
                Fizinės kortelės su keičiamomis nuorodomis, individualiais
                kodais ir skenavimų statistika. Vienas konkretus verslo poreikis
                – vientisas sprendimas.
              </p>
              <Link to="/google-atsiliepimai" className="studio-text-link">
                Susipažinti su produktu <ArrowUpRight size={17} aria-hidden />
              </Link>
            </div>
          </div>
        </section>
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
      <main id="main-content">
        <section className="studio-container studio-page-intro">
          <div className="studio-about-hero">
            <div>
              <p className="studio-eyebrow">Apie Skenis</p>
              <h1>
                Geras sprendimas
                <br />
                palengvina darbą.
              </h1>
              <p>
                Tuo vadovaujamės kurdami. Skenis prasidėjo nuo paprastesnio būdo
                paprašyti kliento atsiliepimo. Šiandien tą patį požiūrį taikome
                svetainėms, verslo sistemoms ir kasdieniams procesams.
              </p>
              <p className="mt-5">
                Mums svarbu suprasti, kaip dirbate ir kur prarandate laiką.
                Tuomet kuriame tai, kas padeda jūsų komandai ir klientams.
              </p>
              <Link
                className="studio-text-link mt-5"
                to="/kontaktai?intent=project"
              >
                Susipažinkime <ArrowUpRight size={17} aria-hidden />
              </Link>
            </div>
            <WorkflowPreview small />
          </div>
          <div className="studio-principles">
            {[
              {
                title: "Pirmiausia – poreikis.",
                text: "Išklausome, kas stringa. Technologiją parenkame pagal darbą, kurį ji turi atlikti.",
              },
              {
                title: "Aiškūs susitarimai.",
                text: "Prieš pradėdami sutariame apimtį, kainą ir eigą. Kuriame etapais, kad matytumėte, kaip juda projektas.",
              },
              {
                title: "Patogu naudotis.",
                text: "Apie sistemą galvojame iš žmogaus perspektyvos. Patikriname veikimą, perduodame ir padedame pradėti.",
              },
            ].map((item) => (
              <article key={item.title}>
                <Check size={20} className="text-brand-700" aria-hidden />
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
        <ProcessSection />
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
