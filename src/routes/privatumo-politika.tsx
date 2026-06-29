import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privatumo-politika")({
  head: () => ({
    meta: [
      { title: "Privatumo politika | Skenis.lt" },
      {
        name: "description",
        content: "Skenis.lt privatumo politika ir skenavimų analitikos principai."
      }
    ]
  }),
  component: PrivacyPage
});

function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <Link to="/" className="text-sm font-semibold text-brand-700">
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
