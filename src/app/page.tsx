import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { publicProducts } from "@/lib/catalog";

const steps = [
  "Įmonė užsisako korteles arba stendus.",
  "Mes sugeneruojame individualius QR kodus.",
  "QR kodai pagaminami ir pritvirtinami prie kortelių/stendų.",
  "Kiekvienas QR kodas admin sistemoje priskiriamas konkrečiai įmonei.",
  "Klientai skenuoja ir patenka į Google review puslapį."
];

const benefits = [
  "Programuojami QR kodai",
  "Galima keisti redirect nuorodą net po pagaminimo",
  "Individualus kodas kiekvienai kortelei",
  "Tinka restoranams, grožio salonams, odontologijos klinikoms, autoservisams, viešbučiams ir parduotuvėms",
  "Galima sekti skenavimų statistiką"
];

export default function HomePage() {
  return (
    <main className="bg-white">
      <header className="absolute left-0 right-0 top-0 z-20">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 text-white sm:px-8">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Skenis.lt
          </Link>
          <div className="hidden items-center gap-7 text-sm font-medium md:flex">
            <a href="#kaip-veikia" className="transition hover:text-brand-100">
              Kaip veikia
            </a>
            <a href="#produktai" className="transition hover:text-brand-100">
              Produktai
            </a>
            <a href="#kontaktai" className="transition hover:text-brand-100">
              Kontaktai
            </a>
            <Link href="/admin" className="transition hover:text-brand-100">
              Admin
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative min-h-[86svh] overflow-hidden bg-ink text-white">
        <Image
          src="/images/skenis-hero.png"
          alt="Akrilinis QR stendas Google atsiliepimams"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,24,32,0.86),rgba(16,24,32,0.56)_44%,rgba(16,24,32,0.12))]" />
        <div className="relative z-10 mx-auto flex min-h-[86svh] max-w-7xl items-center px-5 pb-14 pt-28 sm:px-8">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-brand-50 backdrop-blur">
              Programuojami QR sprendimai fiziniams produktams
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-normal sm:text-5xl lg:text-6xl">
              Daugiau Google atsiliepimų su išmaniais QR stendais
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100 sm:text-xl">
              Programuojamos akrilinės kortelės ir stendai, kurie nukreipia
              klientus tiesiai į jūsų Google atsiliepimų puslapį.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#kontaktai" className="button-primary bg-white text-ink hover:bg-brand-50">
                Užsakyti korteles
              </a>
              <a
                href="#kaip-veikia"
                className="button-secondary border-white/30 bg-white/10 text-white backdrop-blur hover:border-white hover:text-white"
              >
                Kaip tai veikia?
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="kaip-veikia" className="bg-mist py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
              Kaip tai veikia
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink sm:text-4xl">
              Kiekvienas fizinis QR kodas išlieka valdomas po gamybos.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-5">
            {steps.map((step, index) => (
              <article
                key={step}
                className="rounded-lg border border-line bg-white p-5 shadow-sm"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-slate-700">{step}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="produktai" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
                Produktai
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
                Akriliniai sprendimai, paruošti realiam verslo aptarnavimui.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-600">
              Kainos yra pradinės ir gali būti keičiamos pagal kiekį, maketą,
              gamybos terminą ir papildomus priedus.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {publicProducts.map((product) => (
              <article
                key={product.name}
                className="rounded-lg border border-line bg-white p-6 shadow-panel"
              >
                <h3 className="text-xl font-bold tracking-normal">{product.name}</h3>
                <p className="mt-4 text-2xl font-bold text-brand-700">{product.price}</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">{product.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-ink py-20 text-white sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-100">
              Kodėl Skenis
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
              Trumpa nuoroda ant kortelės, lankstus valdymas sistemoje.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="rounded-lg border border-white/10 bg-white/[0.06] p-5 text-sm leading-6 text-slate-100"
              >
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="kontaktai" className="bg-mist py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
              Užklausa
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
              Užsakykite programuojamas korteles arba stendus.
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Galite pateikti Google review nuorodą dabar arba priskirti ją
              vėliau, kai fiziniai QR kodai jau bus pagaminti.
            </p>
            <div className="mt-8 rounded-lg border border-brand-100 bg-brand-50 p-5 text-sm leading-6 text-brand-700">
              Skenis padeda patogiai paprašyti realių klientų palikti
              atsiliepimą. Nesiūlykite atlygio už atsiliepimus ir neskatinkite
              tik teigiamų įvertinimų.
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-500">
              Google yra atitinkamo savininko prekės ženklas. Skenis nėra
              susijęs su Google.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-white p-5 shadow-panel sm:p-7">
            <LeadForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-600 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p className="font-semibold text-ink">skenis.lt</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privatumo-politika" className="hover:text-brand-700">
              Privatumo politika
            </Link>
            <Link href="/taisykles" className="hover:text-brand-700">
              Taisyklės
            </Link>
            <Link href="/kontaktai" className="hover:text-brand-700">
              Kontaktai
            </Link>
            <Link href="/" className="hover:text-brand-700">
              skenis.lt
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
