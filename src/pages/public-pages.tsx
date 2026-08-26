import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/public/site-layout";
import { SkenisLanding } from "@/components/public/landing-page";

const homeTitle = "Skenis – NFC + QR Google atsiliepimų kortelės su keičiama nuoroda";
const homeDescription =
  "Fizinės NFC + QR kortelės, kurios nukreipia klientus į jūsų Google atsiliepimų puslapį. Keičiama nuoroda, individualūs kodai ir skenavimų statistika.";
const homeOgImage = "/images/skenis-product-perspective.jpg";

function setMetaTag(selector: string, attribute: "content", value: string) {
  const element = document.head.querySelector<HTMLMetaElement>(selector);

  if (element) {
    element.setAttribute(attribute, value);
  }
}

function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    document.title = title;

    if (description) {
      setMetaTag('meta[name="description"]', "content", description);
      setMetaTag('meta[property="og:title"]', "content", title);
      setMetaTag('meta[property="og:description"]', "content", description);
      setMetaTag('meta[property="og:image"]', "content", homeOgImage);
    }
  }, [description, title]);
}

export function HomePage() {
  useDocumentTitle(homeTitle, homeDescription);

  return (
    <PublicLayout>
      <SkenisLanding />
    </PublicLayout>
  );
}

export function ContactPage() {
  useDocumentTitle("Kontaktai | Skenis.lt");

  return (
    <PublicLayout>
      <main className="bg-[#f7fbfb] px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-kicker">Kontaktai</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-ink sm:text-6xl">
            Susisiekite su mumis
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Turite klausimų apie NFC + QR korteles? Parašykite mums el. paštu ir atsakysime artimiausiu metu.
          </p>
          <a
            href="mailto:skenis.info@gmail.com"
            className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-brand-200 bg-white px-6 py-5 text-xl font-bold text-ink shadow-soft transition hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-700 hover:shadow-[0_10px_30px_-10px_hsl(var(--brand-500)/0.25)] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            <svg className="h-7 w-7 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            skenis.info@gmail.com
          </a>
          <p className="mt-6 text-sm text-slate-500">
            Atsakome darbo dienomis per 24 val.
          </p>
        </div>
      </main>
    </PublicLayout>
  );
}

export function PrivacyPage() {
  useDocumentTitle("Privatumo politika | Skenis.lt");

  return (
    <PublicLayout>
      <main className="mx-auto max-w-3xl px-5 py-20 text-slate-700">
        <h1 className="text-4xl font-black tracking-tight text-ink">Privatumo politika</h1>
        <p className="mt-6 leading-7">
          Renkame tik tuos duomenis, kurie būtini užklausoms apdoroti, QR nuorodoms
          administruoti ir skenavimų statistikai pateikti. Skenavimų analitikoje
          saugomas IP maišos kodas, o ne žalias IP adresas.
        </p>
        <p className="mt-4 leading-7">
          Užklausose pateiktus kontaktinius duomenis naudojame susisiekti dėl
          užsakymo, maketo ir gamybos. Duomenys nėra parduodami trečiosioms šalims.
        </p>
      </main>
    </PublicLayout>
  );
}

export function TermsPage() {
  useDocumentTitle("Taisyklės | Skenis.lt");

  return (
    <PublicLayout>
      <main className="mx-auto max-w-3xl px-5 py-20 text-slate-700">
        <h1 className="text-4xl font-black tracking-tight text-ink">Taisyklės</h1>
        <p className="mt-6 leading-7">
          Skenis teikia programuojamų QR kortelių ir stendų gamybos bei
          administravimo paslaugą. Klientas atsako už pateiktos Google atsiliepimų
          nuorodos teisingumą ir teisėtą atsiliepimų rinkimo praktiką.
        </p>
        <p className="mt-4 leading-7">
          Draudžiama siūlyti atlygį už atsiliepimus ar skatinti tik teigiamus
          įvertinimus.
        </p>
      </main>
    </PublicLayout>
  );
}

export function NotFoundPage() {
  useDocumentTitle("Puslapis nerastas | Skenis.lt");

  return (
    <PublicLayout>
      <main className="mx-auto max-w-3xl px-5 py-24">
        <h1 className="text-4xl font-black tracking-tight text-ink">Puslapis nerastas</h1>
        <p className="mt-4 text-slate-600">Patikrinkite adresą arba grįžkite į pradžią.</p>
        <Link to="/" className="button-primary mt-8 rounded-full">
          Į pradžią
        </Link>
      </main>
    </PublicLayout>
  );
}
