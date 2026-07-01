import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  Hotel,
  Link2,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Stethoscope,
  Wrench,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productImage from "@/assets/skenis-product.png.asset.json";
import { LeadForm } from "@/components/lead-form";
import { PublicLayout } from "@/components/public/site-layout";

function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

const products = [
  {
    name: "Akrilinė NFC + QR Google Reviews kortelė",
    price: "19,99 €",
    text: "Akrilinė kortelė su NFC ir QR kodu — klientas priliečia telefoną arba nuskaito kodą ir patenka į Google atsiliepimų puslapį.",
    fit: "Restoranams, klinikoms, salonams, viešbučiams"
  }
];


const steps = [
  "Įmonė užsisako korteles arba stendus.",
  "Mes sugeneruojame individualius QR kodus.",
  "QR kodai pagaminami ir pritvirtinami prie kortelių arba stendų.",
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

const proofPoints = [
  {
    title: "Nuolatinė Skenis nuoroda",
    text: "Fiziniame gaminyje lieka skenis.lt/r/... adresas, todėl Google nuorodą galima keisti vėliau."
  },
  {
    title: "Paruošta gamybai",
    text: "Partijos eksportuojamos su tokenais, short URL ir gamintojo pastabomis."
  },
  {
    title: "Aiški administracija",
    text: "Kiekviena kortelė turi statusą, priskirtą įmonę ir skenavimų statistiką."
  }
];

const industries = [
  { label: "Restoranai", icon: Store },
  { label: "Grožio salonai", icon: Sparkles },
  { label: "Odontologijos klinikos", icon: Stethoscope },
  { label: "Autoservisai", icon: Wrench },
  { label: "Viešbučiai", icon: Hotel },
  { label: "Parduotuvės", icon: Building2 }
];

export function HomePage() {
  useDocumentTitle("Skenis.lt | Programuojami Google atsiliepimų QR stendai");
  const [orderOpen, setOrderOpen] = useState(false);

  return (
    <PublicLayout>
      <main>
        <HeroSection onOrder={() => setOrderOpen(true)} />
        <ProofStrip />
        <ProcessSection />
        <ProductsSection onOrder={() => setOrderOpen(true)} />
        <BenefitsSection />
        <EthicsSection />
        <AnimatePresence>
          {orderOpen && <OrderModal onClose={() => setOrderOpen(false)} />}
        </AnimatePresence>
      </main>
    </PublicLayout>
  );
}

function HeroSection({ onOrder }: { onOrder: () => void }) {
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    })
  };

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      {/* Large teal blob behind hero image (right side) */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-1/2 h-[720px] w-[720px] -translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(45,212,191,0.9), rgba(20,184,166,0.35) 45%, rgba(255,255,255,0) 75%)"
        }}
      />
      {/* Soft supporting blob on left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-[380px] w-[380px] rounded-full bg-brand-100/60 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 md:grid-cols-2 md:gap-10">
        {/* Left */}
        <div>
          <motion.p
            custom={0}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="inline-flex items-center rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
          >
            Programuojami QR kodai fiziniams produktams
          </motion.p>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-5 text-5xl font-bold tracking-tight text-ink md:text-6xl"
          >
            Daugiau Google atsiliepimų su išmaniais QR stendais
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-5 max-w-xl text-lg leading-8 text-gray-600"
          >
            Programuojamos akrilinės kortelės ir stendai, kurie nukreipia
            klientus tiesiai į jūsų Google atsiliepimų puslapį.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#uzsakymas"
              className="group inline-flex items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-xl hover:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Užsakyti korteles
              <ArrowRight aria-hidden className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#kaip-veikia"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-all duration-200 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Kaip tai veikia?
            </a>
          </motion.div>

          <motion.div
            custom={4}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-12 flex items-center gap-4"
          >
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-6 w-6 fill-brand-500 text-brand-500" aria-hidden />
              ))}
            </div>
            <p className="text-base text-gray-600">
              {/* placeholder */}
              <span className="font-bold text-ink">Įmonės</span> jau naudoja Skenis atsiliepimams rinkti
            </p>
          </motion.div>
        </div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
            className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-black/10"
          >
            <img
              src={productImage.url}
              alt="Akrilinė NFC + QR Google Reviews kortelė"
              className="h-full w-full object-contain"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


function ProofStrip() {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-4 px-5 py-8 md:grid-cols-3">
        {proofPoints.map((point) => (
          <div key={point.title} className="flex gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700">
              <BadgeCheck aria-hidden className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold tracking-normal text-ink">{point.title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{point.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HeroFact({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-white/25 pl-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-1 leading-5 text-slate-200">{label}</p>
    </div>
  );
}

function ProcessSection() {
  return (
    <section id="kaip-veikia" className="mx-auto max-w-7xl px-5 py-20">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="section-kicker">Procesas</p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
            Vienas fizinis QR kodas. Lanksti nuoroda visam produkto gyvenimui.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Gamybai siunčiamas tik nuolatinis Skenis adresas. Galutinę Google
            review nuorodą priskiriate tada, kai klientas jau aiškus.
          </p>
          <div className="mt-6 rounded-lg border border-brand-100 bg-brand-50 p-4 text-sm leading-6 text-brand-700">
            <Link2 aria-hidden className="mr-2 inline h-4 w-4" />
            https://skenis.lt/r/A7K92LQD → Google review URL
          </div>
        </div>
        <div className="grid gap-3">
          {steps.map((step, index) => (
            <div key={step} className="flex gap-4 rounded-lg border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-panel">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink text-sm font-bold text-white">
                {index + 1}
              </span>
              <p className="pt-1 text-sm leading-6 text-slate-700">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  return (
    <section id="produktai" className="bg-mist py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-2xl">
          <p className="section-kicker">Produktai</p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
            Akriliniai sprendimai kasdieniam klientų srautui
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Kainodara konfigūruojama pagal kiekį, maketą ir gamybos terminą.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {products.map((product) => (
            <a
              key={product.name}
              href="#uzsakymas"
              className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-500 hover:shadow-panel focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              <div className="flex h-52 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_25%_10%,#ffffff,transparent_28%),linear-gradient(135deg,#eef7f6,#f8fbfc)] p-4">
                <img
                  src={productImage.url}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold tracking-normal">{product.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{product.text}</p>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {product.fit}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-2xl font-bold text-brand-700">{product.price}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 transition group-hover:gap-2">
                    Užsakyti
                    <ArrowRight aria-hidden className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductMockup({ compact, dark }: { compact: boolean; dark: boolean }) {
  return (
    <div className="relative h-44 overflow-hidden bg-[radial-gradient(circle_at_25%_10%,#ffffff,transparent_28%),linear-gradient(135deg,#eef7f6,#f8fbfc)]">
      <div className="absolute inset-x-0 bottom-0 h-16 bg-white/55" />
      <div
        className={
          compact
            ? "absolute left-1/2 top-8 h-24 w-40 -translate-x-1/2 rounded-md border border-white/70 bg-white/45 p-2 shadow-soft backdrop-blur"
            : "absolute left-1/2 top-5 h-32 w-24 -translate-x-1/2 rounded-md border border-white/70 bg-white/45 p-2 shadow-soft backdrop-blur"
        }
      >
        <div className={dark ? "h-full rounded bg-ink p-3 text-brand-100" : "h-full rounded bg-white p-3 text-brand-700 ring-1 ring-line"}>
          <div className="mx-auto mb-2 flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <span key={index} className="h-1.5 w-1.5 rounded-full bg-current" />
            ))}
          </div>
          <div className="mx-auto grid h-16 w-16 grid-cols-4 gap-1 bg-white p-1">
            {Array.from({ length: 16 }).map((_, index) => (
              <span
                key={index}
                className={index % 3 === 0 || index === 5 || index === 10 ? "bg-ink" : "bg-slate-200"}
              />
            ))}
          </div>
        </div>
      </div>
      <QrCode aria-hidden className="absolute bottom-4 right-5 h-5 w-5 text-brand-700" />
    </div>
  );
}

function BenefitsSection() {
  return (
    <section id="privalumai" className="mx-auto max-w-7xl px-5 py-20">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="section-kicker">Privalumai</p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
            Sukurta verslams, kuriems reikia aiškios kontrolės
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Kortelės ir stendai atrodo kaip fizinis produktas, bet veikia kaip
            valdoma skaitmeninė sistema.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex gap-3 rounded-lg border border-line bg-white p-4 shadow-sm">
              <CheckCircle2 aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
              <p className="text-sm leading-6 text-slate-700">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12 rounded-lg border border-line bg-mist p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="section-kicker">Kam tinka</p>
            <h3 className="mt-2 text-xl font-bold tracking-normal">Kasdieniam klientų srautui</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <div key={industry.label} className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                  <Icon aria-hidden className="h-4 w-4 text-brand-700" />
                  {industry.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function EthicsSection() {
  return (
    <section className="bg-ink py-12 text-white">
      <div className="mx-auto flex max-w-7xl gap-4 px-5">
        <ShieldCheck aria-hidden className="mt-1 h-6 w-6 shrink-0 text-brand-100" />
        <p className="max-w-4xl text-sm leading-7 text-slate-200">
          Skenis padeda patogiai paprašyti realių klientų palikti atsiliepimą.
          Nesiūlykite atlygio už atsiliepimus ir neskatinkite tik teigiamų
          įvertinimų.
        </p>
      </div>
    </section>
  );
}

function OrderSection() {
  return (
    <section id="uzsakymas" className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <p className="section-kicker">Užklausa</p>
        <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
          Pasiruošę gamybai ar tik renkatės kiekį?
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Parašykite kiekį, produkto tipą ir, jei turite, Google review
          nuorodą. Atsakysime su gamybos galimybėmis ir kaina.
        </p>
        <div className="mt-6 flex gap-3 rounded-lg border border-line bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm">
          <ClipboardCheck aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
          <p>
            Galime paruošti QR partiją gamintojui prieš galutinį kiekvienos
            kortelės priskyrimą klientui.
          </p>
        </div>
        <div className="mt-3 flex gap-3 rounded-lg border border-line bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm">
          <Factory aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
          <p>
            XLSX eksportas turi tokeną, trumpą nuorodą, produkto tipą ir
            gamintojo pastabas kiekvienai fizinei kortelei.
          </p>
        </div>
      </div>
      <div className="rounded-lg border border-line bg-white p-6 shadow-panel">
        <LeadForm />
      </div>
    </section>
  );
}

export function ContactPage() {
  useDocumentTitle("Kontaktai | Skenis.lt");
  return (
    <PublicLayout>
      <main className="mx-auto max-w-4xl px-5 py-20">
        <p className="section-kicker">Kontaktai</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal">Kontaktai</h1>
        <p className="mt-5 text-lg leading-8 text-slate-700">
          Parašykite dėl programuojamų QR kortelių, stendų, gamybos ar
          individualaus užsakymo.
        </p>
        <div className="mt-8 rounded-lg border border-line bg-white p-6 shadow-sm">
          <LeadForm />
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
        <h1 className="text-4xl font-bold tracking-normal text-ink">Privatumo politika</h1>
        <p className="mt-6 leading-7">
          Renkame tik tuos duomenis, kurie būtini užklausoms apdoroti, QR
          nuorodoms administruoti ir skenavimų statistikai pateikti. Skenavimų
          analitikoje saugomas IP maišos kodas, o ne žalias IP adresas.
        </p>
        <p className="mt-4 leading-7">
          Užklausose pateiktus kontaktinius duomenis naudojame susisiekti dėl
          užsakymo, maketo ir gamybos. Duomenys nėra parduodami trečiosioms
          šalims.
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
        <h1 className="text-4xl font-bold tracking-normal text-ink">Taisyklės</h1>
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
        <h1 className="text-4xl font-bold tracking-normal">Puslapis nerastas</h1>
        <p className="mt-4 text-slate-600">Patikrinkite adresą arba grįžkite į pradžią.</p>
        <Link to="/" className="button-primary mt-8">
          Į pradžią
        </Link>
      </main>
    </PublicLayout>
  );
}
