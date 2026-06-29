import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <Link href="/" className="text-sm font-semibold text-brand-700">
        Skenis.lt
      </Link>
      <h1 className="mt-8 text-4xl font-bold tracking-normal">Privatumo politika</h1>
      <div className="mt-8 space-y-5 text-base leading-8 text-slate-700">
        <p>
          Skenis renka tik tuos duomenis, kurie reikalingi užklausoms apdoroti,
          QR nuorodoms administruoti ir skenavimų statistikai parodyti.
        </p>
        <p>
          Skenavimų analitikoje saugomas laikas, naršyklės informacija,
          referrer reikšmė ir IP adreso maiša. Neapdorotas IP adresas nėra
          saugomas.
        </p>
        <p>
          Klientų pateiktos Google nuorodos naudojamos tik QR nukreipimui
          sukonfigūruoti. Dėl duomenų pašalinimo ar koregavimo susisiekite per
          kontaktų formą.
        </p>
      </div>
    </main>
  );
}
