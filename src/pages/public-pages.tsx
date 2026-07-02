import * as TabsPrimitive from "@radix-ui/react-tabs";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Factory,
  Hotel,
  LayoutGrid,
  Link2,
  Minus,
  Nfc,
  Plus,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Stethoscope,
  Wrench,
  X
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { Drawer } from "vaul";
import productImage from "@/assets/skenis-product.png.asset.json";
import { LeadForm } from "@/components/lead-form";
import { shortProductTypeLabels } from "@/lib/labels";
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
  const [orderInitial, setOrderInitial] = useState<{ type: string; quantity: number }>({
    type: "CARD",
    quantity: 1
  });
  const isMobile = useIsMobile();

  const openOrder = (type?: string, quantity?: number) => {
    if (type || quantity) {
      setOrderInitial({
        type: type ?? "CARD",
        quantity: quantity ?? 1
      });
    }
    setOrderOpen(true);
  };

  return (
    <PublicLayout>
      <main>
        <HeroSection onOrder={() => openOrder()} />
        <ProofStrip />
        <ProcessSection />
        <ProductsSection onOrder={(type, quantity) => openOrder(type, quantity)} />
        <BenefitsSection />
        <TestimonialsSection />
        <EthicsSection onOrder={() => openOrder()} />
        {isMobile ? (
          <OrderDrawer
            open={orderOpen}
            onOpenChange={setOrderOpen}
            initialProductType={orderInitial.type}
            initialQuantity={orderInitial.quantity}
          />
        ) : (
          <AnimatePresence>
            {orderOpen && (
              <OrderModal
                onClose={() => setOrderOpen(false)}
                initialProductType={orderInitial.type}
                initialQuantity={orderInitial.quantity}
              />
            )}
          </AnimatePresence>
        )}
      </main>
    </PublicLayout>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false
  );
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return isMobile;
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
    <section className="relative overflow-hidden bg-white py-14 md:py-28">
      {/* Large teal blob behind hero image (right side) */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-30%] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full opacity-45 blur-3xl md:right-[-10%] md:h-[720px] md:w-[720px] md:opacity-55"
        style={{
          background:
            "radial-gradient(circle at center, rgba(45,212,191,0.95), rgba(20,184,166,0.45) 45%, rgba(255,255,255,0) 75%)"
        }}
      />
      {/* Soft supporting blob on left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-[280px] w-[280px] rounded-full bg-brand-100/60 blur-3xl md:h-[380px] md:w-[380px]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 md:grid-cols-2 md:gap-10">

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
            className="mt-5 text-4xl font-bold tracking-tight text-ink sm:text-5xl md:text-6xl"
          >
            Daugiau Google atsiliepimų su išmaniais QR stendais
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8"

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
            <button
              onClick={onOrder}
              className="group inline-flex items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-xl hover:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Užsakyti korteles
              <ArrowRight aria-hidden className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
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
            className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-5 w-5 fill-brand-500 text-brand-500 sm:h-6 sm:w-6" aria-hidden />
              ))}
            </div>
            <p className="text-sm text-gray-600 sm:text-base">
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
          >
            <ProductGallery
              images={[
                { src: productImage.url, alt: "Akrilinė NFC + QR Google Reviews kortelė" }
              ]}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


function SectionFadeTop({ color = "white" }: { color?: "white" | "brand-50" | "ink" }) {
  const stops: Record<string, string> = {
    white: "from-white",
    "brand-50": "from-brand-50",
    ink: "from-ink"
  };
  return <div className={cn("pointer-events-none h-16 w-full bg-gradient-to-b to-transparent", stops[color])} />;
}

function SectionFadeBottom({ color = "white" }: { color?: "white" | "brand-50" | "ink" }) {
  const stops: Record<string, string> = {
    white: "to-white",
    "brand-50": "to-brand-50",
    ink: "to-ink"
  };
  return <div className={cn("pointer-events-none h-16 w-full bg-gradient-to-b from-transparent", stops[color])} />;
}

function ProofStrip() {
  return (
    <section className="relative bg-white">
      <SectionFadeTop color="brand-50" />
      <div className="mx-auto grid max-w-7xl gap-4 px-5 py-8 md:grid-cols-3">
        {proofPoints.map((point) => (
          <div key={point.title} className="flex gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/50 bg-white/60 text-brand-700 shadow-sm backdrop-blur">
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
    <section id="kaip-veikia" className="relative overflow-hidden bg-white py-14 md:py-20">
      {/* Atmospheric teal glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 h-[480px] w-[480px] rounded-full opacity-40 blur-3xl md:h-[620px] md:w-[620px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(28,155,141,0.35), rgba(28,155,141,0.10) 50%, rgba(255,255,255,0) 75%)"
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-[280px] w-[280px] rounded-full bg-brand-100/50 blur-3xl md:h-[360px] md:w-[360px]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="section-kicker">Procesas</p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
            Vienas fizinis QR kodas. Lanksti nuoroda visam produkto gyvenimui.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Gamybai siunčiamas tik nuolatinis Skenis adresas. Galutinę Google
            review nuorodą priskiriate tada, kai klientas jau aiškus.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-brand-100 bg-brand-50 p-4 text-sm leading-6 text-brand-700">
            <Link2 aria-hidden className="h-4 w-4 shrink-0 text-brand-600" />
            <span className="min-w-0 break-all">https://skenis.lt/r/A7K92LQD</span>
            <ArrowRight aria-hidden className="h-4 w-4 shrink-0 text-brand-600" />
            <span>Google review URL</span>
          </div>
        </div>
        <div className="grid gap-3">
          {steps.map((step, index) => (
            <div
              key={step}
              className="flex gap-4 rounded-lg border border-line bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-brand-500 hover:shadow-[0_20px_60px_-15px_rgba(28,155,141,0.35)]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-600 text-sm font-bold text-white shadow-sm shadow-brand-600/20">
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

function ProductsSection({ onOrder }: { onOrder: (type: string, quantity: number) => void }) {
  const [selectedType, setSelectedType] = useState<"CARD" | "STAND" | "NFC_CARD">("NFC_CARD");
  const [quantity, setQuantity] = useState(1);

  const typeOptions: { value: "CARD" | "STAND" | "NFC_CARD"; icon: typeof CreditCard }[] = [
    { value: "NFC_CARD", icon: Nfc }
  ];

  const unitPrice = quantity >= 100 ? 13.99 : quantity >= 25 ? 16.99 : 19.99;
  const totalPrice = quantity * unitPrice;

  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const inc = () => setQuantity((q) => Math.min(500, q + 1));

  return (
    <section
      id="produktai"
      className="relative overflow-hidden bg-brand-50/60 py-14 md:py-20"
      style={{
        backgroundImage:
          "radial-gradient(circle at 15% 20%, rgba(28,155,141,0.18), transparent 45%), radial-gradient(circle at 85% 30%, rgba(47,111,219,0.14), transparent 50%), radial-gradient(circle at 50% 90%, rgba(28,155,141,0.10), transparent 55%)"
      }}
    >
      <div className="relative mx-auto max-w-7xl px-5">
        <div className="grid gap-10 md:grid-cols-[45fr_55fr] md:items-center md:gap-12">
          {/* LEFT — image */}
          <div>
            <ProductGallery
              images={[{ src: productImage.url, alt: "Skenis produktas" }]}
            />
          </div>

          {/* RIGHT — configurator */}
          <TabsPrimitive.Root
            value={selectedType}
            onValueChange={(v) => setSelectedType(v as typeof selectedType)}
          >
            <p className="section-kicker">Produktai</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
              Sukurkite savo užsakymą
            </h2>

            {/* Type selector */}
            <TabsPrimitive.List
              aria-label="Produkto tipas"
              className="mt-8 mx-auto grid grid-cols-1 gap-3 sm:max-w-xs"
            >
              {typeOptions.map(({ value, icon: Icon }) => {
                const active = selectedType === value;
                return (
                  <TabsPrimitive.Trigger
                    key={value}
                    value={value}
                    className={
                      "group flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 " +
                      (active
                        ? "border-brand-500 bg-brand-50 text-brand-700 scale-105 shadow-[0_15px_40px_-15px_rgba(28,155,141,0.35)]"
                        : "border-gray-200 bg-white text-slate-600 hover:border-brand-300")
                    }
                  >
                    <Icon aria-hidden className="h-6 w-6" />
                    <span>NFC + QR Kortelė</span>
                  </TabsPrimitive.Trigger>
                );
              })}
            </TabsPrimitive.List>

            {/* Quantity stepper */}
            <div className="mt-8">
              <p className="label mb-3">Kiekis</p>
              <div className="flex items-center justify-center gap-6 rounded-xl border border-gray-200 bg-white/70 py-5 backdrop-blur">
                <button
                  type="button"
                  onClick={dec}
                  aria-label="Sumažinti"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-500 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <div className="min-w-[5rem] text-center">
                  <motion.div
                    key={quantity}
                    initial={{ scale: 0.85, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl font-bold tracking-tight text-ink"
                  >
                    {quantity}
                  </motion.div>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">vnt.</p>
                </div>
                <button
                  type="button"
                  onClick={inc}
                  aria-label="Padidinti"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-500 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-end justify-between rounded-xl border border-brand-100 bg-white/80 p-5 backdrop-blur">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Iš viso</p>
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={`${selectedType}-${quantity}`}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1 text-4xl font-bold text-brand-700"
                  >
                    {totalPrice.toFixed(2)} €
                  </motion.p>
                </AnimatePresence>
                <p className="mt-1 text-sm text-slate-500">
                  {unitPrice.toFixed(2)} € / vnt.
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={() => onOrder(selectedType, quantity)}
              className="button-primary mt-6 inline-flex w-full items-center justify-center gap-2 sm:w-auto"
            >
              Gauti pasiūlymą
              <ArrowRight aria-hidden className="h-4 w-4" />
            </button>
          </TabsPrimitive.Root>
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
    <section
      id="privalumai"
      className="relative overflow-hidden bg-gradient-to-br from-brand-50/40 via-white to-brand-50/30 py-14 md:py-20"
    >
      {/* Atmospheric depth blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-20 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl md:h-[520px] md:w-[520px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(28,155,141,0.30), rgba(28,155,141,0.08) 55%, rgba(255,255,255,0) 78%)"
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-10 h-[320px] w-[320px] rounded-full bg-brand-100/60 blur-3xl md:h-[420px] md:w-[420px]"
      />
      <div className="relative mx-auto max-w-7xl px-5">
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
              <div
                key={benefit}
                className="flex gap-3 rounded-lg border border-line bg-white/80 p-4 shadow-sm backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:border-brand-500 hover:shadow-[0_20px_60px_-15px_rgba(28,155,141,0.35)]"
              >
                <CheckCircle2 aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
                <p className="text-sm leading-6 text-slate-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 rounded-lg border border-brand-100 bg-brand-50/40 p-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="section-kicker">Kam tinka</p>
              <h3 className="mt-2 text-xl font-bold tracking-normal">Kasdieniam klientų srautui</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
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
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { end: 500, suffix: "+", label: "nuskaitymų per mėnesį" },
    { end: 98, suffix: "%", label: "klientų rekomenduoja" },
    { end: 3, suffix: "×", label: "daugiau atsiliepimų per mėnesį" }
  ];

  const reviews = [
    {
      quote: "Per savaitę po QR stendo pastatymo ant baro gavome daugiau atsiliepimų nei per visą praėjusį mėnesį. Klientams tereikia nuskenuoti ir viskas aišku.",
      name: "Tomas R.",
      role: "baro savininkas",
      initials: "TR"
    },
    {
      quote: "Patiko, kad nuoroda visada ta pati — jei kada reikės pakeisti Google profilį, kortelės keisti nereikės. Labai patogu ilgalaikiam naudojimui.",
      name: "Ieva K.",
      role: "grožio salono administratorė",
      initials: "IK"
    },
    {
      quote: "Užsakymas ir gamyba buvo greita, o admin sistemoje matau, kiek kartų kortelė buvo nuskenuota. Naudinga sekant, ar stendas iš viso veikia.",
      name: "Mantas P.",
      role: "kavinės vadovas",
      initials: "MP"
    }
  ];

  return (
    <section id="atsiliepimai" className="relative overflow-hidden bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5" ref={ref}>
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-kicker">Ką galvoja mūsų klientai?</p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
            Įmonės, kurios jau renka daugiau atsiliepimų
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Realūs rezultatai iš verslų, kurie jau naudoja Skenis programuojamus QR stendus ir korteles.
          </p>
        </div>

        <div className="relative mt-10">
          {/* Teal glow behind stats row */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[80%] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at center, rgba(28,155,141,0.28), rgba(28,155,141,0.08) 55%, rgba(255,255,255,0) 78%)"
            }}
          />
          <div className="relative grid grid-cols-3 gap-4 sm:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                className="text-center"
              >
                <p className="text-2xl font-bold text-ink sm:text-3xl md:text-4xl">
                  {isInView ? (
                    <CountUp end={stat.end} duration={2} />
                  ) : (
                    0
                  )}
                  {stat.suffix}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">{stat.label}</p>

              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              className="flex flex-col rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-brand-500 hover:shadow-[0_25px_70px_-15px_rgba(28,155,141,0.35)]"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-brand-500 text-brand-500"
                    aria-hidden
                  />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-6 text-slate-700">
                &ldquo;{review.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  {review.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{review.name}</p>
                  <p className="text-xs text-slate-500">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

function EthicsSection({ onOrder }: { onOrder: () => void }) {
  const stats = [
    { value: "500+", label: "nuskaitymų per mėnesį" },
    { value: "98%", label: "klientų rekomenduoja" },
    { value: "3×", label: "daugiau atsiliepimų per mėnesį" }
  ];

  return (
    <section className="relative overflow-hidden bg-ink py-20">
      {/* Large soft teal radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full blur-3xl md:-right-20 md:-top-20 md:h-[560px] md:w-[560px]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(28,155,141,0.30), rgba(19,127,116,0.12) 50%, transparent 75%)"
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left — headline + subtext + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Pasiruošę gauti daugiau atsiliepimų?
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
              Programuojamos QR kortelės ir stendai, nukreipiantys klientus tiesiai į jūsų Google atsiliepimų puslapį.
            </p>
            <button onClick={onOrder} className="button-light mt-8">
              Užsakyti korteles
              <ArrowRight aria-hidden className="ml-2 h-4 w-4" />
            </button>
          </motion.div>

          {/* Right — stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 gap-6 text-white sm:grid-cols-3"
          >
            {stats.map((stat) => (
              <HeroFact key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </motion.div>
        </div>

        {/* Ethics disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 flex items-start gap-3 border-t border-white/10 pt-8"
        >
          <ShieldCheck aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-brand-100" />
          <p className="max-w-3xl text-xs leading-5 text-slate-400">
            Skenis padeda patogiai paprašyti realių klientų palikti atsiliepimą.
            Nesiūlykite atlygio už atsiliepimus ir neskatinkite tik teigiamų
            įvertinimų.
          </p>
        </motion.div>
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

function OrderModal({
  onClose,
  initialProductType,
  initialQuantity
}: {
  onClose: () => void;
  initialProductType?: string;
  initialQuantity?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-2 backdrop-blur-sm sm:p-4 sm:pt-20"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative mx-auto w-full max-w-3xl rounded-xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-8"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 sm:right-4 sm:top-4"
          aria-label="Uždaryti"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-8">

          <div>
            <p className="section-kicker">Užklausa</p>
            <h2 className="mt-3 text-xl font-bold tracking-normal sm:text-2xl md:text-3xl">
              Pasiruošę gamybai ar tik renkatės kiekį?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
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
          <div className="rounded-lg border border-line bg-white p-4 shadow-panel sm:p-6">

            <LeadForm initialProductType={initialProductType} initialQuantity={initialQuantity} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function OrderDrawer({
  open,
  onOpenChange,
  initialProductType,
  initialQuantity
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProductType?: string;
  initialQuantity?: number;
}) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[92vh] flex-col rounded-t-2xl border border-gray-200 bg-white outline-none">
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-slate-300" />
          <div className="flex items-start justify-between px-5 pt-4">
            <div>
              <Drawer.Title className="section-kicker">Užklausa</Drawer.Title>
              <p className="mt-2 text-lg font-bold tracking-normal">
                Pasiruošę gamybai ar tik renkatės kiekį?
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Uždaryti"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 flex-1 overflow-y-auto px-5 pb-8">
            <Drawer.Description className="text-sm leading-6 text-slate-600">
              Parašykite kiekį, produkto tipą ir, jei turite, Google review nuorodą.
            </Drawer.Description>
            <div className="mt-5">
              <LeadForm initialProductType={initialProductType} initialQuantity={initialQuantity} />
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function ProductGallery({
  images
}: {
  images: { src: string; alt: string }[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > 1, dragFree: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div
        ref={emblaRef}
        className="overflow-hidden rounded-2xl border border-gray-100/60 bg-white shadow-2xl shadow-black/10"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 88%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 88%, transparent 100%)"
        }}
      >
        <div className="flex touch-pan-y">
          {images.map((image) => (
            <div key={image.src} className="min-w-0 flex-[0_0_100%]">
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-contain"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        {images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            aria-label={`Rodyti nuotrauką ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={
              i === selectedIndex
                ? "h-2 w-6 rounded-full bg-brand-600 transition-all"
                : "h-2 w-2 rounded-full bg-slate-300 transition-all hover:bg-slate-400"
            }
          />
        ))}
      </div>
    </div>
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
