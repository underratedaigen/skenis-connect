import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <Link href="/" className="text-sm font-semibold text-brand-700">
        Skenis.lt
      </Link>
      <h1 className="mt-8 text-4xl font-bold tracking-normal">Taisyklės</h1>
      <div className="mt-8 space-y-5 text-base leading-8 text-slate-700">
        <p>
          Skenis teikia programuojamų QR nuorodų ir fizinių akrilinių produktų
          gamybos pagrindą. Galutiniai kiekiai, kainos ir terminai patvirtinami
          individualiai.
        </p>
        <p>
          Klientas atsako už pateiktos Google atsiliepimų nuorodos tikslumą.
          Sistema priima tik HTTPS Google review arba Maps tipo nuorodas.
        </p>
        <p>
          Prašydami atsiliepimų laikykitės Google gairių: neskatinkite tik
          teigiamų įvertinimų ir nesiūlykite atlygio už atsiliepimus.
        </p>
      </div>
    </main>
  );
}
