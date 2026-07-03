import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/public/site-layout";
import { LeadFormShell } from "@/components/public/lead-form-shell";
import { SkenisLanding } from "@/components/public/landing-page";

function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export function HomePage() {
  useDocumentTitle("NFC + QR kortelės Google atsiliepimams | Skenis");

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
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div>
            <p className="section-kicker">Kontaktai</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-ink sm:text-6xl">
              Pakalbėkime apie korteles jūsų verslui
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Parašykite kiekio poreikį, produkto tipą ir, jei turite, Google review
              nuorodą. Atsakysime su kaina, gamybos eiga ir terminu.
            </p>
          </div>
          <div className="rounded-[2rem] border border-line bg-white p-5 shadow-[0_28px_90px_rgba(16,24,32,0.08)] sm:p-7">
            <LeadFormShell />
          </div>
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
          administravimo paslaugą. Klientas atsako už pateiktos Google review
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
