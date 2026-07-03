import {
  AnimatePresence,
  motion,
  useReducedMotion
} from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Factory,
  Hotel,
  Link2,
  Minus,
  Nfc,
  Plus,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Store,
  Stethoscope,
  Wrench,
  X,
  type LucideIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import type React from "react";
import { cn } from "@/lib/utils";
import { LeadFormShell } from "@/components/public/lead-form-shell";

type ProductType = "CARD" | "STAND" | "NFC_CARD";

const ease = [0.16, 1, 0.3, 1] as const;

const productPhotos = [
  {
    src: "/images/skenis-product-perspective.jpg",
    alt: "Skenis NFC ir QR atsiliepimų kortelė kampu"
  },
  {
    src: "/images/skenis-product-front.jpg",
    alt: "Skenis NFC ir QR atsiliepimų kortelė iš priekio"
  }
];

const proofItems = [
  "NFC + QR vienoje kortelėje",
  "Nuorodą galima keisti",
  "Individualūs kodai",
  "Skenavimų statistika"
];

const workSteps: {
  title: string;
  text: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Pasirenkate kiekį",
    text: "Nurodote, kiek kortelių ar stendų reikia jūsų vietoms.",
    icon: ClipboardCheck
  },
  {
    title: "Sukuriame Skenis nuorodas",
    text: "Kiekvienas fizinis gaminys gauna savo trumpą skenis.lt/r/... adresą.",
    icon: Link2
  },
  {
    title: "Paruošiame gamybai",
    text: "QR partija eksportuojama su tokenais, pastabomis ir gamintojo failais.",
    icon: Factory
  },
  {
    title: "Klientas paliečia arba skenuoja",
    text: "Jis iškart patenka į jūsų Google atsiliepimo puslapį.",
    icon: Smartphone
  }
];

const comparisonRows = [
  {
    label: "Atidarymo būdas",
    basic: "Tik QR skenavimas.",
    skenis: "NFC palietimas ir QR vienoje kortelėje."
  },
  {
    label: "Nuorodos kontrolė",
    basic: "Nuoroda dažniausiai fiksuota po spausdinimo.",
    skenis: "Galutinę Google review nuorodą galima keisti vėliau."
  },
  {
    label: "Statistika",
    basic: "Nėra aiškios skenavimų statistikos.",
    skenis: "Galima sekti kortelių skenavimo aktyvumą."
  },
  {
    label: "Kodų valdymas",
    basic: "Dažnai naudojamas vienas bendras kodas.",
    skenis: "Individualūs kodai kiekvienai kortelei, vietai ar filialui."
  },
  {
    label: "Fizinis įvaizdis",
    basic: "Gali atrodyti kaip paprastas lipdukas ar spauda.",
    skenis: "Profesionalus akrilinis produktas klientų aptarnavimo vietai."
  },
  {
    label: "Verslo kontrolė",
    basic: "Mažiau lankstumo po pagaminimo.",
    skenis: "Valdoma sistema verslui: statusai, redirectai ir aktyvumas."
  }
];

const benefitCards: {
  title: string;
  text: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Daugiau atsiliepimų",
    text: "Klientui nereikia ieškoti jūsų Google profilio - kelias iki atsiliepimo tampa trumpas ir aiškus.",
    icon: Star
  },
  {
    title: "Mažiau trinties",
    text: "Vienas palietimas arba QR nuskaitymas vietoje ilgos paieškos.",
    icon: Smartphone
  },
  {
    title: "Valdoma nuoroda",
    text: "Fizinė kortelė lieka ta pati, o galutinį adresą galite koreguoti vėliau.",
    icon: Link2
  },
  {
    title: "Individualūs kodai",
    text: "Kiekviena kortelė gali turėti savo unikalią nuorodą.",
    icon: QrCode
  },
  {
    title: "Skenavimų statistika",
    text: "Matykite kortelių aktyvumą ir supraskite, kur jos veikia geriausiai.",
    icon: BarChart3
  },
  {
    title: "Tinka kelioms vietoms",
    text: "Skirtingoms lokacijoms ar filialams galima naudoti atskirus kodus.",
    icon: Building2
  }
];

const trustCards: {
  title: string;
  text: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Paruošta gamybai",
    text: "Partijos gali būti paruoštos su trumpomis nuorodomis ir gamintojo pastabomis.",
    icon: Factory
  },
  {
    title: "Individualūs kodai",
    text: "Kiekvienas fizinis gaminys gali turėti savo tokeną ir statusą.",
    icon: QrCode
  },
  {
    title: "Valdoma nuoroda",
    text: "Galutinis Google review adresas gali būti keičiamas administracijoje.",
    icon: Link2
  },
  {
    title: "Skenavimų statistika",
    text: "Matomas aktyvumas padeda suprasti, kurios vietos veikia geriausiai.",
    icon: BarChart3
  },
  {
    title: "NFC + QR",
    text: "Klientui paliekami du patogūs būdai pasiekti atsiliepimo puslapį.",
    icon: Nfc
  },
  {
    title: "Kelioms lokacijoms",
    text: "Atskiri kodai filialams, kabinetams ar paslaugų zonoms.",
    icon: Building2
  }
];

const industries: {
  label: string;
  placement: string;
  example: string;
  icon: LucideIcon;
}[] = [
  {
    label: "Restoranai ir kavinės",
    placement: "Ant stalo arba prie kasos",
    example: "Kortelė ant stalo arba prie kasos po aptarnavimo.",
    icon: Store
  },
  {
    label: "Grožio salonai",
    placement: "Registratūroje po vizito",
    example: "Kortelė registratūroje po vizito.",
    icon: Sparkles
  },
  {
    label: "Odontologijos klinikos",
    placement: "Laukimo zonoje arba registratūroje",
    example: "Kortelė laukimo zonoje arba registratūroje.",
    icon: Stethoscope
  },
  {
    label: "Autoservisai",
    placement: "Atsiimant automobilį",
    example: "Kortelė atsiimant automobilį.",
    icon: Wrench
  },
  {
    label: "Viešbučiai",
    placement: "Registratūroje išvykimo metu",
    example: "Kortelė registratūroje išvykimo metu.",
    icon: Hotel
  },
  {
    label: "Parduotuvės",
    placement: "Prie kasos po pirkimo",
    example: "Kortelė prie kasos po pirkimo.",
    icon: Building2
  }
];

const useCases: {
  title: string;
  text: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Prie kasos",
    text: "Po apmokėjimo darbuotojas gali natūraliai paprašyti palikti atsiliepimą.",
    icon: Store
  },
  {
    title: "Ant stalo",
    text: "Restorane ar kavinėje kortelė matoma klientui viso apsilankymo metu.",
    icon: QrCode
  },
  {
    title: "Registratūroje",
    text: "Klientas gali palikti atsiliepimą iškart po vizito.",
    icon: ClipboardCheck
  },
  {
    title: "Laukimo zonoje",
    text: "Kortelė primena apie atsiliepimą be papildomų instrukcijų.",
    icon: Building2
  }
];

const faqItems = [
  {
    question: "Ar galima pakeisti Google nuorodą po gamybos?",
    answer:
      "Taip. Ant fizinės kortelės lieka nuolatinė Skenis nuoroda, o galutinį Google review adresą galima pakeisti administracijoje."
  },
  {
    question: "Ar kortelė veikia su iPhone ir Android?",
    answer:
      "Taip. NFC veikia daugelyje šiuolaikinių telefonų, o QR kodas veikia kaip universalus alternatyvus būdas."
  },
  {
    question: "Kas jei klientas nenori naudoti NFC?",
    answer:
      "Klientas gali tiesiog nuskaityti QR kodą."
  },
  {
    question: "Ar galima turėti skirtingus kodus filialams?",
    answer:
      "Taip. Kiekviena kortelė ar stendas gali turėti individualų tokeną, įmonės informaciją, statusą ir galutinę nuorodą."
  },
  {
    question: "Ar matysiu skenavimų statistiką?",
    answer:
      "Taip. Admin sistemoje galima matyti bendrą skenavimų kiekį, paskutinį skenavimą ir aktyvumą pagal laikotarpius."
  },
  {
    question: "Kiek laiko trunka gamyba?",
    answer:
      "Terminą patikslinsime pateikę pasiūlymą, nes jis priklauso nuo kiekio, maketo ir gamybos eigos."
  },
  {
    question: "Ar tai oficialus Google produktas?",
    answer:
      "Ne. Skenis nėra susijęs su Google. Kortelė nukreipia į jūsų įmonės Google atsiliepimų puslapį, o Google yra atitinkamo savininko prekės ženklas."
  }
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

function Reveal({
  children,
  className,
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 26 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.62, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SkenisLanding() {
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderInitial, setOrderInitial] = useState<{ type: string; quantity: number }>({
    type: "NFC_CARD",
    quantity: 1
  });
  const isMobile = useIsMobile();

  const openOrder = (type?: string, quantity?: number) => {
    setOrderInitial({
      type: type ?? "NFC_CARD",
      quantity: quantity ?? 1
    });
    setOrderOpen(true);
  };

  return (
    <main className="relative overflow-hidden bg-[#f7fbfb]">
      <Hero onOrder={() => openOrder("NFC_CARD", 1)} />
      <ProblemSolution />
      <HowItWorks />
      <ProductDetails />
      <ComparisonTable />
      <ProductsSection onOrder={openOrder} />
      <BenefitsSection />
      <IndustryGrid />
      <UseCases />
      <AdminSystemPreview />
      <TrustSection />
      <FAQSection />
      <FinalCTA onOrder={() => openOrder("NFC_CARD", 1)} />
      <StickyMobileCTA onOrder={() => openOrder("NFC_CARD", 1)} hidden={orderOpen} />

      {isMobile ? (
        <OrderDrawer
          open={orderOpen}
          onOpenChange={setOrderOpen}
          initialProductType={orderInitial.type}
          initialQuantity={orderInitial.quantity}
        />
      ) : (
        <AnimatePresence>
          {orderOpen ? (
            <OrderModal
              onClose={() => setOrderOpen(false)}
              initialProductType={orderInitial.type}
              initialQuantity={orderInitial.quantity}
            />
          ) : null}
        </AnimatePresence>
      )}
    </main>
  );
}

function Hero({ onOrder }: { onOrder: () => void }) {
  const fade = {
    hidden: { opacity: 0, y: 24 },
    show: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.08, duration: 0.62, ease }
    })
  };

  return (
    <section className="relative isolate overflow-hidden px-5 py-5 sm:py-9 lg:py-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_18%,rgba(28,155,141,0.24),transparent_34%),radial-gradient(circle_at_18%_8%,rgba(47,111,219,0.14),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f2fbfa_62%,#ffffff_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.22] [background-image:linear-gradient(rgba(16,24,32,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(16,24,32,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-5 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
        <div className="max-w-3xl">
          <motion.p
            custom={0}
            variants={fade}
            initial="hidden"
            animate="show"
            className="section-kicker"
          >
            Valdoma NFC + QR atsiliepimų sistema
          </motion.p>

          <motion.h1
            custom={1}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-5 max-w-4xl text-[2rem] font-black leading-[1.08] tracking-tight text-ink sm:text-6xl sm:leading-none lg:text-[3.45rem] lg:leading-[1.02]"
          >
            Daugiau Google atsiliepimų iš klientų, kurie jau stovi prieš jus
          </motion.h1>

          <motion.p
            custom={2}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-5 max-w-2xl text-sm leading-6 text-slate-600 sm:text-lg sm:leading-8"
          >
            Padėkite kortelę prie kasos, ant stalo ar registratūroje. Klientas paliečia
            NFC arba nuskaito QR ir iškart patenka į jūsų Google atsiliepimo puslapį.
          </motion.p>

          <motion.div
            custom={3}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-6 flex flex-row gap-2 sm:gap-3"
          >
            <button
              type="button"
              onClick={onOrder}
              className="button-primary group flex-1 rounded-full px-3 py-3 text-[13px] sm:flex-none sm:px-7 sm:py-4 sm:text-base"
              data-cursor="magnetic"
            >
              Gauti pasiūlymą
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden />
            </button>
            <a href="#kaip-veikia" className="button-secondary flex-1 rounded-full px-3 py-3 text-center text-[13px] sm:flex-none sm:px-7 sm:py-4 sm:text-base">
              Pažiūrėti kaip veikia
            </a>
          </motion.div>

          <motion.div
            custom={4}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3"
          >
            {proofItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur sm:py-3 sm:text-sm"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>

          <motion.p
            custom={5}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-5 hidden text-sm font-medium text-slate-500 sm:block"
          >
            Tinka restoranams, salonams, klinikoms, autoservisams, viešbučiams ir parduotuvėms.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.18, ease }}
          className="mx-auto w-full max-w-[560px]"
        >
          <ProductMockup />
        </motion.div>
      </div>
    </section>
  );
}

function ProductMockup() {
  const reduced = useReducedMotion();

  return (
    <div className="relative min-h-[225px] sm:min-h-[470px] lg:min-h-[435px]" data-cursor="magnetic">
      <div className="absolute left-4 right-4 top-0 rounded-[2rem] border border-white/70 bg-white/[0.55] p-2 shadow-[0_30px_120px_rgba(16,24,32,0.14)] backdrop-blur-xl sm:left-10 sm:right-10 sm:top-8 sm:p-3">
        <motion.div
          animate={reduced ? undefined : { y: [0, -10, 0], rotateZ: [-1.5, 1.2, -1.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative overflow-hidden rounded-[1.55rem] bg-white shadow-2xl shadow-brand-700/10"
        >
          <img
            src={productPhotos[0].src}
            alt={productPhotos[0].alt}
            width={1280}
            height={1024}
            loading="eager"
            decoding="async"
            className="aspect-[1.24/1] w-full object-cover"
            draggable={false}
          />
          <motion.div
            aria-hidden
            animate={reduced ? undefined : { y: ["-20%", "118%"] }}
            transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
            className="absolute right-[12%] top-[52%] h-16 w-[26%] rounded-2xl border border-brand-500/45 bg-gradient-to-b from-transparent via-brand-100/70 to-transparent"
          />
        </motion.div>
      </div>

      <motion.div
        animate={reduced ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-0 top-0 w-[36%] rounded-2xl border border-white/75 bg-white/80 p-2 shadow-[0_20px_70px_rgba(16,24,32,0.14)] backdrop-blur-xl sm:w-[46%] sm:rounded-3xl sm:p-4"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
            <Nfc className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
            {!reduced ? (
              <>
                <span className="absolute inset-0 rounded-2xl border border-brand-300/70 animate-ping" />
                <span className="absolute -inset-2 rounded-3xl border border-brand-200/50 animate-pulse" />
              </>
            ) : null}
          </span>
          <div>
            <p className="hidden text-xs font-bold uppercase tracking-[0.22em] text-brand-700 sm:block">Palietimas</p>
            <p className="text-xs font-bold text-ink sm:mt-1 sm:text-sm">NFC</p>
          </div>
        </div>
      </motion.div>

      <ProductBadge className="right-2 top-0 sm:right-4 sm:top-1" label="NFC + QR" delay={0.1} />
      <ProductBadge className="right-0 top-[33%]" label="Keičiama nuoroda" delay={0.25} />
      <ProductBadge className="bottom-[28%] left-0 hidden sm:block" label="Individualūs kodai" delay={0.4} />
      <ProductBadge className="bottom-[8%] right-4 hidden sm:block" label="Skenavimų statistika" delay={0.55} />

      <motion.div
        animate={reduced ? undefined : { y: [0, 10, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 right-1 w-[36%] rounded-2xl border border-white/75 bg-ink p-2 text-white shadow-[0_24px_80px_rgba(16,24,32,0.22)] sm:bottom-20 sm:right-0 sm:w-[48%] sm:rounded-3xl sm:p-4"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-brand-100">
            <Star className="h-5 w-5 fill-brand-100" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-bold sm:text-sm">Google review</p>
            <p className="mt-1 hidden text-xs leading-5 text-slate-300 sm:block">Klientas patenka tiesiai į atsiliepimo langą.</p>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-6 right-6 hidden rounded-3xl border border-brand-100 bg-white/[0.85] p-4 shadow-[0_24px_90px_rgba(28,155,141,0.22)] backdrop-blur-xl sm:block">
        <div className="grid grid-cols-3 gap-3 text-center">
          <FlowStep icon={Nfc} label="Paliečia" />
          <FlowStep icon={QrCode} label="Skenuoja" />
          <FlowStep icon={BarChart3} label="Matuojate" />
        </div>
      </div>
    </div>
  );
}

function ProductBadge({
  label,
  className,
  delay
}: {
  label: string;
  className: string;
  delay: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12, scale: 0.94 }}
      animate={reduced ? undefined : { opacity: 1, y: [0, -5, 0], scale: 1 }}
      transition={
        reduced
          ? undefined
          : {
              opacity: { delay, duration: 0.35 },
              scale: { delay, duration: 0.35 },
              y: { delay, duration: 4, repeat: Infinity, ease: "easeInOut" }
            }
      }
      className={cn(
        "absolute z-10 rounded-full border border-white/75 bg-white/[0.85] px-3 py-2 text-[11px] font-black text-brand-800 shadow-[0_14px_44px_rgba(16,24,32,0.14)] backdrop-blur",
        className
      )}
    >
      {label}
    </motion.div>
  );
}

function FlowStep({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white px-2 py-3">
      <Icon className="mx-auto h-5 w-5 text-brand-700" aria-hidden />
      <p className="mt-2 text-xs font-bold text-slate-700">{label}</p>
    </div>
  );
}

function ProblemSolution() {
  const oldFlow = ["Ieško įmonės Google", "Randa tinkamą profilį", "Ieško review veiksmo", "Galbūt parašo vėliau"];
  const skenisFlow = ["Paliečia NFC arba QR", "Atsidaro atsiliepimo puslapis", "Palieka realų įvertinimą"];

  return (
    <section className="bg-white px-5 py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
        <Reveal className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <p className="section-kicker">Problema</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-4xl">
            Patenkinti klientai dažnai nepalieka atsiliepimo
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Reikia ieškoti įmonės Google, rasti tinkamą profilį ir prisiminti tai padaryti vėliau.
            Kuo daugiau žingsnių, tuo mažiau atsiliepimų.
          </p>
          <div className="mt-7 grid gap-3">
            {oldFlow.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.38, delay: index * 0.06, ease }}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  {index + 1}
                </span>
                {step}
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08} className="rounded-[2rem] border border-brand-200 bg-ink p-6 text-white shadow-[0_28px_90px_rgba(16,24,32,0.24)] sm:p-8">
          <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-100">
            Sprendimas
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Kortelė ten, kur klientui natūralu reaguoti
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Padėkite Skenis kortelę ant stalo, prie kasos ar registratūroje.
            Klientas paliečia NFC arba nuskaito QR ir iškart atsiduria atsiliepimo puslapyje.
          </p>
          <div className="mt-7 grid gap-3">
            {skenisFlow.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.38, delay: index * 0.07, ease }}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-semibold text-slate-100"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
                  <Check className="h-4 w-4" aria-hidden />
                </span>
                {step}
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="kaip-veikia" className="relative overflow-hidden bg-[#f7fbfb] px-5 py-16 sm:py-24">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_20%_30%,rgba(28,155,141,0.16),transparent_28%),radial-gradient(circle_at_86%_72%,rgba(47,111,219,0.12),transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="section-kicker">Kaip veikia</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">
            Vienas fizinis kodas. Lanksti nuoroda visam produkto gyvenimui.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Gamybai siunčiamas tik nuolatinis Skenis adresas. Galutinę Google review
            nuorodą galite priskirti arba pakeisti vėliau.
          </p>
        </Reveal>

        <div className="mt-10 rounded-[2rem] border border-brand-100 bg-white/80 p-4 shadow-[0_30px_100px_rgba(16,24,32,0.08)] backdrop-blur sm:p-6">
          <div className="grid gap-4 lg:grid-cols-4">
            {workSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.06}>
                <div className="relative h-full rounded-3xl border border-line bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_22px_80px_rgba(28,155,141,0.18)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">
                    <step.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-brand-700">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-lg font-black text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-5 grid gap-3 rounded-3xl border border-brand-100 bg-brand-50 p-4 text-sm font-semibold text-brand-800 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <span className="break-all">https://skenis.lt/r/A7K92LQD</span>
            <ArrowRight className="hidden h-5 w-5 text-brand-700 sm:block" aria-hidden />
            <span>jūsų Google review URL</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductDetails() {
  const details: {
    title: string;
    text: string;
    icon: LucideIcon;
  }[] = [
    {
      title: "Palieskite telefonu",
      text: "NFC zona leidžia klientui atidaryti atsiliepimo puslapį vienu telefono palietimu.",
      icon: Nfc
    },
    {
      title: "Nuskaitykite QR",
      text: "QR kodas veikia kaip atsarginis ir universalus būdas visiems telefonams.",
      icon: QrCode
    },
    {
      title: "Valdoma nuoroda",
      text: "Fizinėje kortelėje lieka Skenis trumpa nuoroda, o galutinį Google review adresą galima pakeisti vėliau.",
      icon: Link2
    }
  ];

  return (
    <section id="produktas" className="bg-white px-5 py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <Reveal>
          <div className="relative rounded-[2.25rem] border border-line bg-slate-50 p-3 shadow-[0_28px_100px_rgba(16,24,32,0.10)]">
            <img
              src={productPhotos[1].src}
              alt={productPhotos[1].alt}
              width={1280}
              height={1024}
              loading="lazy"
              decoding="async"
              className="aspect-[1.25/1] rounded-[1.75rem] object-cover"
              draggable={false}
            />
            <div className="pointer-events-none absolute left-[16%] top-[58%] hidden rounded-2xl border border-brand-300 bg-white/[0.85] px-3 py-2 text-xs font-black text-brand-800 shadow-lg backdrop-blur sm:block">
              NFC zona
            </div>
            <div className="pointer-events-none absolute right-[12%] top-[61%] hidden rounded-2xl border border-brand-300 bg-white/[0.85] px-3 py-2 text-xs font-black text-brand-800 shadow-lg backdrop-blur sm:block">
              QR kodas
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="section-kicker">Produkto detalės</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">
            Ne tik QR kodas. Fizinė kortelė su valdoma nuoroda.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Kortelė atrodo kaip aiškus klientui skirtas produktas, bet už jos veikia
            trumpų nuorodų ir statistikos sistema.
          </p>

          <div className="mt-8 grid gap-4">
            {details.map((detail, index) => (
              <Reveal key={detail.title} delay={index * 0.05}>
                <div className="flex gap-4 rounded-3xl border border-line bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_22px_80px_rgba(28,155,141,0.14)]">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <detail.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-ink">{detail.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{detail.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ComparisonTable() {
  return (
    <section id="privalumai" className="bg-white px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl">
          <p className="section-kicker">Kodėl geriau nei paprastas QR</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">
            Ne QR paveikslėlis. Valdoma atsiliepimų infrastruktūra.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Paprastas QR yra statinis. Skenis kortelė veikia kaip fizinis produktas,
            bet valdoma kaip skaitmeninė sistema.
          </p>
        </Reveal>

        <Reveal className="mt-10 overflow-hidden rounded-[2rem] border border-line bg-white shadow-[0_26px_90px_rgba(16,24,32,0.08)]">
          <div className="grid grid-cols-[1fr_1fr_1fr] bg-ink text-sm font-black text-white">
            <div className="p-4 sm:p-5">Funkcija</div>
            <div className="border-l border-white/10 p-4 sm:p-5">Paprastas QR</div>
            <div className="border-l border-white/10 bg-brand-600 p-4 sm:p-5">Skenis sistema</div>
          </div>
          {comparisonRows.map((row) => (
            <div key={row.label} className="grid grid-cols-1 border-t border-line md:grid-cols-[0.9fr_1fr_1fr]">
              <div className="bg-slate-50 p-4 text-sm font-black text-ink sm:p-5">{row.label}</div>
              <div className="border-t border-line p-4 text-sm leading-6 text-slate-600 md:border-l md:border-t-0 sm:p-5">
                {row.basic}
              </div>
              <div className="border-t border-brand-100 bg-brand-50/70 p-4 text-sm font-semibold leading-6 text-brand-800 md:border-l md:border-t-0 sm:p-5">
                {row.skenis}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function ProductsSection({ onOrder }: { onOrder: (type: string, quantity: number) => void }) {
  return (
    <section id="produktai" className="relative overflow-hidden bg-[#f2fbfa] px-5 py-16 sm:py-24">
      <span id="uzsakymas" className="absolute -top-28" aria-hidden />
      <span id="kaina" className="absolute top-10" aria-hidden />
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_72%_18%,rgba(28,155,141,0.22),transparent_32%),radial-gradient(circle_at_22%_74%,rgba(47,111,219,0.12),transparent_28%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <p className="section-kicker">Produktai ir kaina</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">
            Premium kortelė, kuri atrodo paprastai, bet valdoma iš sistemos
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Pasirinkite kiekį, gaukite pasiūlymą ir priskirkite Google nuorodas tada,
            kai kortelės jau paruoštos konkrečiam klientui ar vietai.
          </p>
          <div className="mt-7 rounded-[2rem] border border-white/80 bg-white/70 p-3 shadow-[0_24px_90px_rgba(16,24,32,0.1)] backdrop-blur">
            <img
              src={productPhotos[1].src}
              alt={productPhotos[1].alt}
              width={1280}
              height={1024}
              loading="lazy"
              decoding="async"
              className="aspect-[1.25/1] rounded-[1.5rem] object-cover"
              draggable={false}
            />
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <OrderCard onOrder={onOrder} />
        </Reveal>
      </div>
    </section>
  );
}

function OrderCard({ onOrder }: { onOrder: (type: string, quantity: number) => void }) {
  const selectedType: ProductType = "NFC_CARD";
  const [quantity, setQuantity] = useState(1);

  const currentProduct: {
    value: ProductType;
    label: string;
    text: string;
    basePrice: number;
    icon: LucideIcon;
  } = {
    value: "NFC_CARD",
    label: "NFC + QR Google atsiliepimų kortelė",
    text: "Glossy akrilinė kortelė su NFC palietimu, QR atsarginiu keliu ir valdoma Skenis nuoroda.",
    basePrice: 19.99,
    icon: Nfc
  };

  const unitPrice =
    quantity >= 100 ? 13.99 : quantity >= 25 ? 16.99 : currentProduct.basePrice;
  const totalPrice = quantity * unitPrice;
  const CurrentIcon = currentProduct.icon;

  return (
    <div className="rounded-[2rem] border border-white/80 bg-white/[0.85] p-5 shadow-[0_35px_120px_rgba(16,24,32,0.16)] backdrop-blur-xl sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-700">Užsakymo modulis</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-ink">Gaukite pasiūlymą</h3>
        </div>
        <div className="rounded-2xl bg-ink px-3 py-2 text-right text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">nuo</p>
          <p className="text-lg font-black">{unitPrice.toFixed(2)} €</p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-brand-200 bg-brand-50 p-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">
            <CurrentIcon className="h-7 w-7" aria-hidden />
          </span>
          <div>
            <h4 className="text-base font-black text-ink">{currentProduct.label}</h4>
            <p className="mt-1 text-sm leading-6 text-slate-600">{currentProduct.text}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-brand-800">
          <span className="rounded-full border border-brand-200 bg-white px-3 py-1">NFC + QR</span>
          <span className="rounded-full border border-brand-200 bg-white px-3 py-1">Keičiama nuoroda</span>
          <span className="rounded-full border border-brand-200 bg-white px-3 py-1">Statistika</span>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-line bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-black text-ink">Kiekis</p>
          <p className="text-xs font-semibold text-slate-500">Didesniems kiekiams kaina mažėja</p>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white bg-white p-3 shadow-sm">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            aria-label="Sumažinti kiekį"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white text-slate-700 transition hover:border-brand-400 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <Minus className="h-5 w-5" aria-hidden />
          </button>
          <div className="min-w-24 text-center">
            <AnimatePresence mode="popLayout">
              <motion.p
                key={quantity}
                initial={{ scale: 0.86, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.86, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="text-5xl font-black tracking-tight text-ink"
              >
                {quantity}
              </motion.p>
            </AnimatePresence>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">vnt.</p>
          </div>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(500, value + 1))}
            aria-label="Padidinti kiekį"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white text-slate-700 transition hover:border-brand-400 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <Plus className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-ink p-5 text-white">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Iš viso</p>
            <p className="mt-1 text-4xl font-black">{totalPrice.toFixed(2)} €</p>
            <p className="mt-1 text-sm text-slate-300">{unitPrice.toFixed(2)} € / vnt.</p>
          </div>
          <BadgeCheck className="h-10 w-10 text-brand-100" aria-hidden />
        </div>
        <div className="mt-5 grid gap-2 text-sm text-slate-300">
          <p className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" aria-hidden />NFC + QR vienoje kortelėje</p>
          <p className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" aria-hidden />Keičiama Google review nuoroda</p>
          <p className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" aria-hidden />Individualus trumpas Skenis linkas</p>
          <p className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" aria-hidden />Skenavimų statistika</p>
          <p className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" aria-hidden />Paruošta naudoti jūsų versle</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOrder(selectedType, quantity)}
        className="button-primary mt-5 w-full rounded-2xl py-4 text-base"
        data-cursor="magnetic"
      >
        Gauti pasiūlymą
        <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
      </button>
    </div>
  );
}

function BenefitsSection() {
  return (
    <section className="bg-white px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="section-kicker">Privalumai</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">
            Sukurta verslams, kuriems svarbi reputacija
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Skenis padeda paprašyti atsiliepimo tiksliai tada, kai klientas ką tik gavo paslaugą.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefitCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.04}>
              <div className="group h-full rounded-3xl border border-line bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_26px_90px_rgba(16,24,32,0.10)]">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                  <card.icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-black text-ink">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="bg-white px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="section-kicker">Kodėl verslai renkasi Skenis</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">
            Aiškus produktas, lanksti sistema, mažiau rankinio darbo
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Be netikrų pažadų ir be klaidinančių logotipų. Tik elementai, kurie padeda realiai valdyti atsiliepimų kelią.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trustCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.05}>
              <div className="h-full rounded-3xl border border-line bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_26px_80px_rgba(16,24,32,0.1)]">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                  <card.icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-black text-ink">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function IndustryGrid() {
  const [active, setActive] = useState(0);
  const ActiveIcon = industries[active].icon;

  return (
    <section id="kam-tinka" className="bg-[#f7fbfb] px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <Reveal>
            <p className="section-kicker">Kam tinka</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">
              Kam tinka?
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Geriausiai veikia ten, kur klientas ką tik gavo paslaugą, pirko produktą arba laukia vietoje.
            </p>
            <div className="mt-7 rounded-3xl border border-brand-100 bg-white p-5 shadow-sm">
              <ActiveIcon className="h-8 w-8 text-brand-700" aria-hidden />
              <h3 className="mt-4 text-xl font-black text-ink">{industries[active].label}</h3>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-brand-700">
                {industries[active].placement}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{industries[active].example}</p>
            </div>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2">
            {industries.map((industry, index) => (
              <Reveal key={industry.label} delay={index * 0.04}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  className={cn(
                    "group flex min-h-28 w-full items-center gap-4 rounded-3xl border p-5 text-left transition duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                    active === index
                      ? "border-brand-400 bg-white shadow-[0_24px_80px_rgba(28,155,141,0.16)]"
                      : "border-line bg-white/70 hover:border-brand-200 hover:bg-white"
                  )}
                >
                  <span className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition",
                    active === index ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700"
                  )}>
                    <industry.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-base font-black text-ink">{industry.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{industry.placement}</span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  return (
    <section className="bg-white px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="section-kicker">Naudojimo scenarijai</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">
            Aiškus kelias nuo aptarnavimo iki atsiliepimo
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Kortelė turi būti ten, kur klientui natūraliausia sureaguoti - ne vėliau, ne po priminimo, o vietoje.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {useCases.map((useCase, index) => (
            <Reveal key={useCase.title} delay={index * 0.05}>
              <div className="group h-full overflow-hidden rounded-3xl border border-line bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_26px_90px_rgba(16,24,32,0.1)]">
                <div className="h-28 bg-[radial-gradient(circle_at_30%_30%,rgba(28,155,141,0.30),transparent_42%),linear-gradient(135deg,#101820,#143e43)] p-5 text-white">
                  <useCase.icon className="h-8 w-8 text-brand-100" aria-hidden />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-black text-ink">{useCase.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{useCase.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdminSystemPreview() {
  const rows = [
    { token: "A7K92LQD", status: "Aktyvi", place: "Vilniaus filialas" },
    { token: "8fK29xQp", status: "Priskiriama", place: "Registratūra" },
    { token: "Q4L8N2RS", status: "Paruošta", place: "Gamybos partija" }
  ];

  return (
    <section className="relative overflow-hidden bg-ink px-5 py-16 text-white sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(28,155,141,0.26),transparent_32%),radial-gradient(circle_at_18%_80%,rgba(47,111,219,0.18),transparent_30%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-100">
            Valdoma sistema
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
            Fizinis produktas, kurį galite valdyti
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
            Kiekviena kortelė turi nuolatinį Skenis adresą. Galutinę Google review
            nuorodą galite keisti, korteles priskirti vietoms ir sekti aktyvumą.
          </p>
          <div className="mt-7 grid gap-3 text-sm text-slate-300">
            <p className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" aria-hidden />Nuolatinė trumpa Skenis nuoroda kiekvienai kortelei</p>
            <p className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" aria-hidden />Keičiama galutinė Google review nuoroda</p>
            <p className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" aria-hidden />Priskyrimas įmonėms, vietoms ar filialams</p>
            <p className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" aria-hidden />Skenavimų aktyvumo stebėjimas</p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-4 shadow-[0_34px_120px_rgba(0,0,0,0.28)] backdrop-blur">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#0b141a] p-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-100">Skenis admin</p>
                  <p className="mt-1 text-sm text-slate-400">Redirectų ir kortelių valdymas</p>
                </div>
                <span className="rounded-full border border-brand-300/40 bg-brand-500/15 px-3 py-1 text-xs font-bold text-brand-100">
                  Sistema
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {["Kortelės", "Nuorodos", "Aktyvumas"].map((label, index) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                    <p className="text-xs text-slate-400">{label}</p>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${60 + index * 12}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.12, ease }}
                        className="h-2 rounded-full bg-brand-400"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                {rows.map((row) => (
                  <div key={row.token} className="grid grid-cols-[1fr_auto] gap-3 border-b border-white/10 bg-white/[0.04] p-4 text-sm last:border-b-0 sm:grid-cols-[1fr_1fr_auto]">
                    <span className="font-mono text-brand-100">/r/{row.token}</span>
                    <span className="hidden text-slate-300 sm:inline">{row.place}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">{row.status}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Skenavimų aktyvumas</p>
                <div className="mt-4 flex h-28 items-end gap-2">
                  {[38, 58, 42, 76, 64, 88, 70, 92].map((height, index) => (
                    <motion.span
                      key={index}
                      initial={{ height: 8 }}
                      whileInView={{ height }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55, delay: index * 0.05, ease }}
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-brand-700 to-brand-300"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="duk" className="bg-[#f7fbfb] px-5 py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <Reveal>
          <p className="section-kicker">DUK</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-5xl">
            Klausimai prieš užsakant
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Trumpi atsakymai apie nuorodas, NFC, QR, statistiką ir Google ryšį.
          </p>
        </Reveal>

        <Reveal className="rounded-[2rem] border border-line bg-white p-2 shadow-[0_24px_90px_rgba(16,24,32,0.08)]">
          {faqItems.map((item, index) => {
            const active = open === index;
            return (
              <div key={item.question} className="border-b border-line last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpen(active ? -1 : index)}
                  aria-expanded={active}
                  className="flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-5 text-left text-base font-black text-ink transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={cn("h-5 w-5 shrink-0 text-brand-700 transition", active && "rotate-180")}
                    aria-hidden
                  />
                </button>
                <AnimatePresence initial={false}>
                  {active ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-5 text-sm leading-6 text-slate-600">{item.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA({ onOrder }: { onOrder: () => void }) {
  return (
    <section className="relative overflow-hidden bg-ink px-5 py-16 text-white sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_10%,rgba(28,155,141,0.30),transparent_34%),linear-gradient(180deg,#101820,#081015)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.78fr] lg:items-end">
          <Reveal>
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-100">
              Finalinis žingsnis
            </p>
            <h2 className="mt-5 max-w-4xl text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Paverskite kiekvieną patenkintą klientą potencialiu Google atsiliepimu
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Kortelė pašalina paiešką, administracija leidžia keisti nuorodas, o jūs matote, kas realiai naudojama.
            </p>
            <button
              type="button"
              onClick={onOrder}
              className="button-light mt-8 rounded-full px-7 py-4 text-base"
              data-cursor="magnetic"
            >
              Gauti pasiūlymą
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
            </button>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur">
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <FinalFact value="1 QR" label="nuolatinė Skenis nuoroda" />
                <FinalFact value="2 būdai" label="NFC palietimas arba QR" />
                <FinalFact value="30 d." label="aktyvumo langas sprendimams" />
              </div>
              <div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-100" aria-hidden />
                <p className="text-xs leading-5 text-slate-400">
                  Skenis padeda patogiai paprašyti realių klientų palikti atsiliepimą.
                  Nesiūlykite atlygio už atsiliepimus ir neskatinkite tik teigiamų įvertinimų.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FinalFact({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.08] p-4">
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm leading-5 text-slate-300">{label}</p>
    </div>
  );
}

function StickyMobileCTA({
  onOrder,
  hidden
}: {
  onOrder: () => void;
  hidden: boolean;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-3 bottom-3 z-30 transition duration-300 md:hidden",
        hidden || !visible ? "pointer-events-none translate-y-6 opacity-0" : "translate-y-0 opacity-100"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <button
        type="button"
        onClick={onOrder}
        className="flex w-full items-center justify-center rounded-full bg-ink px-5 py-4 text-sm font-black text-white shadow-[0_20px_70px_rgba(16,24,32,0.28)]"
      >
        Gauti pasiūlymą
        <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
      </button>
    </div>
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
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/55 p-3 pt-10 backdrop-blur-sm sm:p-6 sm:pt-16"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="desktop-order-title"
        initial={{ opacity: 0, y: 26, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 26, scale: 0.96 }}
        transition={{ duration: 0.26, ease }}
        onClick={(event) => event.stopPropagation()}
        className="relative mx-auto w-full max-w-4xl rounded-[2rem] border border-white/70 bg-white p-5 shadow-2xl sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Uždaryti"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[1.6rem] bg-ink p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-100">Užklausa</p>
            <h2 id="desktop-order-title" className="mt-4 text-3xl font-black tracking-tight">
              Paruošime pasiūlymą pagal kiekį ir naudojimo vietas
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Parašykite kiekį, produkto tipą ir, jei turite, Google review nuorodą.
              Atsakysime su kaina, terminu ir gamybos eiga.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-slate-300">
              <p className="flex gap-2"><ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" aria-hidden />Individualios Skenis nuorodos kiekvienam gaminiui.</p>
              <p className="flex gap-2"><Factory className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" aria-hidden />Partijos paruošimas gamintojui.</p>
              <p className="flex gap-2"><BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" aria-hidden />Skenavimų statistika administracijoje.</p>
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-line bg-white p-4 shadow-sm sm:p-5">
            <LeadFormShell initialProductType={initialProductType} initialQuantity={initialQuantity} />
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
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-order-title"
            className="fixed inset-x-0 bottom-0 flex max-h-[92vh] flex-col rounded-t-[2rem] border border-white/70 bg-white outline-none"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 420, damping: 38 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-slate-300" />
            <div className="flex items-start justify-between px-5 pt-4">
              <div>
                <p className="section-kicker">Užklausa</p>
                <h2 id="mobile-order-title" className="mt-3 text-xl font-black text-ink">
                  Gauti pasiūlymą
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                aria-label="Uždaryti"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="mt-4 flex-1 overflow-y-auto px-5 pb-8">
              <p className="text-sm leading-6 text-slate-600">
                Parašykite kiekį, produkto tipą ir Google review nuorodą, jei ją jau turite.
              </p>
              <div className="mt-5">
                <LeadFormShell initialProductType={initialProductType} initialQuantity={initialQuantity} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
