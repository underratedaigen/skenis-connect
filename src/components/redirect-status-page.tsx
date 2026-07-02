import { Link } from "react-router-dom";

export function RedirectStatusPage({
  title,
  message,
  tone = "neutral"
}: {
  title: string;
  message: string;
  tone?: "neutral" | "warning" | "error";
}) {
  const toneClass =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-brand-100 bg-brand-50 text-brand-700";

  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-5 py-12">
      <section className="w-full max-w-lg rounded-lg border border-line bg-white p-7 text-center shadow-panel">
        <Link to="/" className="inline-block">
          <img src="/skenis-logo.png" alt="Skenis" className="h-10 w-auto" />
        </Link>
        <div className={`mx-auto mt-8 rounded-lg border px-5 py-4 text-sm ${toneClass}`}>
          {message}
        </div>
        <h1 className="mt-8 text-3xl font-bold tracking-normal text-ink">{title}</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Jei manote, kad tai klaida, susisiekite su įmone, iš kurios gavote šį
          QR kodą, arba su Skenis administracija.
        </p>
        <p className="mt-8 text-xs leading-5 text-slate-500">
          Google yra atitinkamo savininko prekės ženklas. Skenis nėra susijęs
          su Google.
        </p>
      </section>
    </main>
  );
}
