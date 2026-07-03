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
  "NFC + QR",
  "keičiama nuoroda",
  "statistika"
];

const googleAccents = [
  {
    icon: "text-[#4285F4]",
    bg: "bg-[#EEF5FF]",
    border: "border-[#BFDBFE]",
    text: "text-[#1D4ED8]",
    bar: "bg-[#4285F4]"
  },
  {
    icon: "text-[#34A853]",
    bg: "bg-[#ECFDF5]",
    border: "border-[#BBF7D0]",
    text: "text-[#15803D]",
    bar: "bg-[#34A853]"
  },
  {
    icon: "text-[#FBBC05]",
    bg: "bg-[#FFFAE6]",
    border: "border-[#FDE68A]",
    text: "text-[#A16207]",
    bar: "bg-[#FBBC05]"
  },
  {
    icon: "text-[#EA4335]",
    bg: "bg-[#FEF2F2]",
    border: "border-[#FECACA]",
    text: "text-[#B91C1C]",
    bar: "bg-[#EA4335]"
  }
] as const;

const workSteps: {
  title: string;
  text: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Pasirenkate kiekį",
    text: "Nurodote, kiek kortelių reikia jūsų vietoms.",
    icon: ClipboardCheck
  },
  {
    title: "Sukuriame Skenis nuorodas",
    text: "Kiekviena kortelė gauna savo trumpą Skenis adresą.",
    icon: Link2
  },
  {
    title: "Paruošiame korteles",
    text: "Kortelės paruošiamos su unikaliomis nuorodomis.",
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
    basic: "Tik QR skenavimas",
    skenis: "NFC palietimas arba QR"
  },
  {
    label: "Nuorodos kontrolė",
    basic: "Dažnai fiksuota po pagaminimo",
    skenis: "Galutinę nuorodą galima keisti"
  },
  {
    label: "Statistika",
    basic: "Dažniausiai nematoma",
    skenis: "Galima sekti aktyvumą"
  },
  {
    label: "Kodų valdymas",
    basic: "Vienas bendras kodas",
    skenis: "Individualūs kodai kortelėms ar vietoms"
  },
  {
    label: "Fizinis įvaizdis",
    basic: "Gali atrodyti kaip lipdukas ar spauda",
    skenis: "Profesionalus akrilinis produktas"
  },
  {
    label: "Verslo kontrolė",
    basic: "Mažiau lankstumo po pagaminimo",
    skenis: "Valdoma sistema verslui"
  }
];

const benefitCards: {
  title: string;
  text: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Daugiau atsiliepimų",
    text: "Trumpesnis kelias iki Google atsiliepimo.",
    icon: Star
  },
  {
    title: "Mažiau trinties",
    text: "Vienas palietimas arba QR skenavimas.",
    icon: Smartphone
  },
  {
    title: "Keičiama nuoroda",
    text: "Kortelė lieka ta pati, adresą keičiate vėliau.",
    icon: Link2
  },
  {
    title: "Skenavimų statistika",
    text: "Matykite, kurios kortelės naudojamos.",
    icon: BarChart3
  },
  {
    title: "Individualūs kodai",
    text: "Atskira nuoroda kiekvienai kortelei.",
    icon: QrCode
  },
  {
    title: "Kelioms vietoms",
    text: "Tinka filialams ir skirtingoms zonoms.",
    icon: Building2
  }
];

const trustCards: {
  title: string;
  text: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Be netikrų pažadų",
    text: "Skenis padeda paprašyti realaus atsiliepimo, ne imituoti reputaciją.",
    icon: ShieldCheck
  },
  {
    title: "Be klaidinančios partnerystės",
    text: "Aiškiai nurodoma, kad Skenis nėra oficialus Google produktas.",
    icon: BadgeCheck
  },
  {
    title: "Valdoma nuoroda",
    text: "Galutinį adresą galima keisti administracijoje.",
    icon: Link2
  },
  {
    title: "Aiški statistika",
    text: "Matote, kurios kortelės naudojamos.",
    icon: BarChart3
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
    text: "Po apmokėjimo darbuotojas gali natūraliai paprašyti atsiliepimo.",
    icon: Store
  },
  {
    title: "Ant stalo",
    text: "Kortelė matoma klientui viso apsilankymo metu.",
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
      "Taip. Ant fizinės kortelės lieka nuolatinė Skenis nuoroda, o galutinį Google atsiliepimų adresą galima pakeisti administracijoje."
  },
  {
    question: "Ar kortelė veikia su iPhone ir Android?",
    answer:
      "Taip. NFC veikia daugumoje naujesnių telefonų, o QR kodas veikia kaip atsarginis būdas visiems telefonams su kamera."
  },
  {
    question: "Kas jei klientas nenori naudoti NFC?",
    answer:
      "Jis gali nuskaityti QR kodą. Kortelėje yra abu būdai."
  },
  {
    question: "Ar galima turėti skirtingus kodus filialams?",
    answer:
      "Taip. Korteles galima priskirti skirtingoms vietoms, filialams ar zonoms."
  },
  {
    question: "Ar matysiu skenavimų statistiką?",
    answer:
      "Taip. Galima matyti kortelių aktyvumą ir suprasti, kurios vietos naudojamos geriausiai."
  },
  {
    question: "Kiek laiko trunka gamyba?",
    answer:
      "Gamybos terminas priklauso nuo kiekio. Pateikus užklausą atsiųsime tikslų terminą."
  },
  {
    question: "Ar tai oficialus Google produktas?",
    answer:
      "Ne. Skenis nėra oficialus Google produktas. Kortelė nukreipia į jūsų įmonės Google atsiliepimų puslapį."
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
  const isMobile = useIsMobile();
  const shouldAnimate = !reduced && !isMobile;

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 26 } : false}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
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
    <section data-hero data-sticky-hide className="relative isolate overflow-hidden px-5 py-4 sm:py-9 lg:py-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_18%,rgba(66,133,244,0.16),transparent_28%),radial-gradient(circle_at_74%_42%,rgba(52,168,83,0.16),transparent_24%),radial-gradient(circle_at_18%_8%,rgba(251,188,5,0.12),transparent_26%),radial-gradient(circle_at_24%_72%,rgba(234,67,53,0.10),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fafc_62%,#ffffff_100%)]" />
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
            className="mt-4 max-w-4xl text-[2rem] font-black leading-[1.08] tracking-tight text-ink sm:mt-5 sm:text-6xl sm:leading-none lg:text-[3.45rem] lg:leading-[1.02]"
          >
            Daugiau Google atsiliepimų iš klientų, kurie jau yra pas jus
          </motion.h1>

          <motion.p
            custom={2}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8"
          >
            NFC + QR kortelė sutrumpina kelią iki jūsų Google atsiliepimo puslapio
            iki vieno palietimo arba skenavimo.
          </motion.p>

          <motion.div
            custom={3}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-5 flex flex-row gap-2 sm:mt-6 sm:gap-3"
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
              Kaip veikia?
            </a>
          </motion.div>

          <motion.div
            custom={4}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-5 hidden grid-cols-3 gap-2 sm:grid sm:gap-3"
          >
            {proofItems.map((item, index) => {
              const accent = googleAccents[index % googleAccents.length];

              return (
              <div
                key={item}
                className={cn(
                  "flex items-center gap-2 rounded-2xl border bg-white/75 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur sm:py-3 sm:text-sm",
                  accent.border
                )}
              >
                <CheckCircle2 className={cn("h-4 w-4 shrink-0", accent.icon)} aria-hidden />
                <span>{item}</span>
              </div>
              );
            })}
          </motion.div>

          <motion.p
            custom={4.5}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-slate-700 sm:hidden"
          >
            {proofItems.map((item, index) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                {index > 0 ? <span className={cn("h-1.5 w-1.5 rounded-full", googleAccents[index].bar)} aria-hidden /> : null}
                {item}
              </span>
            ))}
          </motion.p>

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
      <div className="pointer-events-none absolute inset-x-2 top-6 h-44 rounded-full bg-[conic-gradient(from_120deg,rgba(66,133,244,0.26),rgba(52,168,83,0.22),rgba(251,188,5,0.20),rgba(234,67,53,0.18),rgba(66,133,244,0.26))] blur-3xl sm:inset-x-6 sm:top-16 sm:h-72" />
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

      <ProductBadge className="right-2 top-0 sm:right-4 sm:top-1" label="NFC + QR" delay={0.1} accentClass="border-[#BFDBFE] bg-white/90 text-[#1D4ED8]" />
      <ProductBadge className="right-0 top-[33%]" label="Keičiama nuoroda" delay={0.25} accentClass="border-[#BBF7D0] bg-white/90 text-[#15803D]" />
      <ProductBadge className="bottom-[28%] left-0 hidden sm:block" label="Individualūs kodai" delay={0.4} accentClass="border-[#FECACA] bg-white/90 text-[#B91C1C]" />
      <ProductBadge className="bottom-[8%] right-4 hidden sm:block" label="Skenavimų statistika" delay={0.55} accentClass="border-[#FDE68A] bg-white/90 text-[#A16207]" />

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
            <p className="text-xs font-bold sm:text-sm">Google atsiliepimas</p>
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
  delay,
  accentClass
}: {
  label: string;
  className: string;
  delay: number;
  accentClass?: string;
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
        "absolute z-10 rounded-full border px-3 py-2 text-[11px] font-black shadow-[0_14px_44px_rgba(16,24,32,0.14)] backdrop-blur",
        accentClass ?? "border-white/75 bg-white/[0.85] text-brand-800",
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
  const oldFlow = ["Ieško įmonės Google", "Randa tinkamą profilį", "Ieško, kur palikti atsiliepimą", "Dažnai nebegrįžta parašyti"];
  const skenisFlow = ["Paliečia NFC arba QR", "Atsidaro atsiliepimo puslapis", "Palieka realų įvertinimą"];

  return (
    <section className="bg-white px-5 py-8 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
        <Reveal className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 sm:rounded-[2rem] sm:p-8">
          <p className="section-kicker">Problema</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-ink sm:mt-4 sm:text-4xl">
            Patenkinti klientai dažnai nepalieka atsiliepimo
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
            Jei klientui reikia ieškoti jūsų Google profilio, rasti tinkamą vietą ir prisiminti tai padaryti vėliau - dalis atsiliepimų dingsta.
          </p>
          <div className="mt-5 grid gap-2 sm:mt-7 sm:gap-3">
            {oldFlow.map((step, index) => {
              const accent = index < 2 ? googleAccents[3] : googleAccents[2];

              return (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.38, delay: index * 0.06, ease }}
                className={cn("flex items-center gap-3 rounded-2xl border bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 sm:px-4 sm:py-3", accent.border)}
              >
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", accent.bg, accent.text)}>
                  {index + 1}
                </span>
                {step}
              </motion.div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.08} className="rounded-[1.5rem] border border-[#4285F4]/20 bg-ink p-4 text-white shadow-[0_28px_90px_rgba(16,24,32,0.24)] sm:rounded-[2rem] sm:p-8">
          <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-100">
            Sprendimas
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight sm:mt-4 sm:text-4xl">
            Kortelė ten, kur klientui natūralu reaguoti
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300 sm:mt-4 sm:text-base sm:leading-7">
            Kortelė stovi ten, kur klientas ką tik gavo paslaugą. Jis paliečia NFC arba nuskaito QR ir iškart patenka į atsiliepimo puslapį.
          </p>
          <div className="mt-5 grid gap-2 sm:mt-7 sm:gap-3">
            {skenisFlow.map((step, index) => {
              const accent = index === 0 ? googleAccents[0] : googleAccents[1];

              return (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.38, delay: index * 0.07, ease }}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.08] px-3 py-2.5 text-sm font-semibold text-slate-100 sm:px-4 sm:py-3"
              >
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white", accent.bar)}>
                  <Check className="h-4 w-4" aria-hidden />
                </span>
                {step}
              </motion.div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="kaip-veikia" data-sticky-hide className="relative overflow-hidden bg-[#f8fafc] px-5 py-8 sm:py-24">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_20%_30%,rgba(66,133,244,0.12),transparent_28%),radial-gradient(circle_at_86%_72%,rgba(52,168,83,0.12),transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="section-kicker">Kaip veikia</p>
          <h2 className="mt-3 text-[2rem] font-black leading-tight tracking-tight text-ink sm:mt-4 sm:text-5xl">
            Ta pati kortelė. Keičiama atsiliepimų nuoroda.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-lg sm:leading-7">
            Kortelėje lieka nuolatinis Skenis adresas. Galutinę Google atsiliepimų
            nuorodą galite priskirti arba pakeisti vėliau.
          </p>
        </Reveal>

        <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white/80 p-2.5 shadow-[0_24px_80px_rgba(16,24,32,0.07)] backdrop-blur sm:mt-10 sm:rounded-[2rem] sm:p-6">
          <div className="grid gap-2 sm:gap-4 lg:grid-cols-4">
            {workSteps.map((step, index) => {
              const accent = googleAccents[index % googleAccents.length];

              return (
              <Reveal key={step.title} delay={index * 0.06}>
                <div className="relative flex h-full gap-3 rounded-2xl border border-line bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_22px_80px_rgba(16,24,32,0.10)] sm:block sm:rounded-3xl sm:p-5">
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border shadow-sm sm:h-12 sm:w-12", accent.bg, accent.border, accent.icon)}>
                    <step.icon className="h-4 w-4 sm:h-6 sm:w-6" aria-hidden />
                  </span>
                  <div>
                    <p className={cn("text-[10px] font-black uppercase tracking-[0.18em] sm:mt-5 sm:text-xs sm:tracking-[0.2em]", accent.text)}>
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 text-sm font-black text-ink sm:mt-2 sm:text-lg">{step.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-6">{step.text}</p>
                  </div>
                </div>
              </Reveal>
              );
            })}
          </div>

          <div className="mt-3 grid gap-2 rounded-2xl border border-[#BFDBFE] bg-[#EEF5FF] p-3 text-sm font-semibold text-[#1D4ED8] sm:mt-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:rounded-3xl sm:p-4">
            <span className="break-all">https://skenis.lt/r/A7K92LQD</span>
            <ArrowRight className="hidden h-5 w-5 text-[#34A853] sm:block" aria-hidden />
            <span>jūsų Google atsiliepimų nuoroda</span>
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
      text: "NFC atidaro atsiliepimo puslapį vienu palietimu.",
      icon: Nfc
    },
    {
      title: "Nuskaitykite QR",
      text: "QR veikia kaip universalus būdas visiems telefonams.",
      icon: QrCode
    },
    {
      title: "Valdoma nuoroda",
      text: "Kortelėje lieka Skenis adresas, o galutinį puslapį galima keisti.",
      icon: Link2
    }
  ];

  return (
    <section id="produktas" data-sticky-hide className="bg-white px-5 py-8 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
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
          <h2 className="mt-3 text-[2rem] font-black leading-tight tracking-tight text-ink sm:mt-4 sm:text-5xl">
            Ne tik QR kodas. Fizinė kortelė su valdoma nuoroda.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
            Kortelė atrodo kaip aiškus klientui skirtas produktas, bet už jos veikia
            trumpų nuorodų ir statistikos sistema.
          </p>

          <div className="mt-5 grid gap-3 sm:mt-8 sm:gap-4">
            {details.map((detail, index) => {
              const accent = googleAccents[index % googleAccents.length];

              return (
              <Reveal key={detail.title} delay={index * 0.05}>
                <div className="flex gap-3 rounded-2xl border border-line bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_22px_80px_rgba(16,24,32,0.10)] sm:gap-4 sm:rounded-3xl sm:p-5">
                  <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border sm:h-12 sm:w-12", accent.bg, accent.border, accent.icon)}>
                    <detail.icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-base font-black text-ink sm:text-lg">{detail.title}</h3>
                    <p className="mt-1 text-sm leading-5 text-slate-600 sm:leading-6">{detail.text}</p>
                  </div>
                </div>
              </Reveal>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ComparisonTable() {
  return (
    <section id="privalumai" data-sticky-hide className="bg-white px-5 py-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-3xl">
          <p className="section-kicker">Kodėl geriau nei paprastas QR</p>
          <h2 className="mt-3 text-[2rem] font-black leading-tight tracking-tight text-ink sm:mt-4 sm:text-5xl">
            Ne QR paveikslėlis. Valdoma atsiliepimų infrastruktūra.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
            Paprastas QR yra statinis. Skenis kortelė veikia kaip fizinis produktas,
            bet valdoma kaip skaitmeninė sistema.
          </p>
        </Reveal>

        <div className="mt-6 grid gap-3 md:hidden">
          {comparisonRows.map((row, index) => {
            const accent = googleAccents[index % googleAccents.length];

            return (
              <Reveal key={row.label} delay={index * 0.04}>
                <div className="rounded-2xl border border-line bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2.5 w-2.5 rounded-full", accent.bar)} aria-hidden />
                    <h3 className="text-sm font-black text-ink">{row.label}</h3>
                  </div>
                  <div className="mt-3 grid gap-2">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Paprastas QR</p>
                      <p className="mt-1 text-sm leading-5 text-slate-600">{row.basic}</p>
                    </div>
                    <div className={cn("rounded-xl border p-3", accent.border, accent.bg)}>
                      <p className={cn("text-[10px] font-black uppercase tracking-[0.16em]", accent.text)}>Skenis sistema</p>
                      <p className="mt-1 flex items-start gap-2 text-sm font-semibold leading-5 text-ink">
                        <Check className={cn("mt-0.5 h-4 w-4 shrink-0", accent.icon)} aria-hidden />
                        {row.skenis}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10 hidden overflow-hidden rounded-[2rem] border border-line bg-white shadow-[0_26px_90px_rgba(16,24,32,0.08)] md:block">
          <div className="grid grid-cols-[1fr_1fr_1fr] bg-ink text-sm font-black text-white">
            <div className="p-4 sm:p-5">Funkcija</div>
            <div className="border-l border-white/10 p-4 sm:p-5">Paprastas QR</div>
            <div className="border-l border-white/10 bg-[#4285F4] p-4 sm:p-5">Skenis sistema</div>
          </div>
          {comparisonRows.map((row, index) => {
            const accent = googleAccents[index % googleAccents.length];

            return (
            <div key={row.label} className="grid grid-cols-1 border-t border-line md:grid-cols-[0.9fr_1fr_1fr]">
              <div className="bg-slate-50 p-4 text-sm font-black text-ink sm:p-5">{row.label}</div>
              <div className="border-t border-line p-4 text-sm leading-6 text-slate-600 md:border-l md:border-t-0 sm:p-5">
                {row.basic}
              </div>
              <div className={cn("border-t p-4 text-sm font-semibold leading-6 md:border-l md:border-t-0 sm:p-5", accent.border, accent.bg, accent.text)}>
                <span className="flex items-start gap-2">
                  <Check className={cn("mt-1 h-4 w-4 shrink-0", accent.icon)} aria-hidden />
                  {row.skenis}
                </span>
              </div>
            </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

function ProductsSection({ onOrder }: { onOrder: (type: string, quantity: number) => void }) {
  return (
    <section id="produktai" data-sticky-hide className="relative overflow-hidden bg-[#F8FAFC] px-5 py-8 sm:py-24">
      <span id="uzsakymas" className="absolute -top-28" aria-hidden />
      <span id="kaina" className="absolute top-10" aria-hidden />
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_72%_18%,rgba(66,133,244,0.14),transparent_32%),radial-gradient(circle_at_22%_74%,rgba(52,168,83,0.13),transparent_28%),radial-gradient(circle_at_80%_72%,rgba(251,188,5,0.10),transparent_28%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <p className="section-kicker">Produktai ir kaina</p>
          <h2 className="mt-3 text-[2rem] font-black leading-tight tracking-tight text-ink sm:mt-4 sm:text-5xl">
            Premium kortelė, kuri atrodo paprastai, bet valdoma iš sistemos
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
            Pasirinkite kiekį. Google atsiliepimų nuorodą galėsite priskirti dabar arba po gamybos.
          </p>
          <div className="mt-5 rounded-[1.5rem] border border-white/80 bg-white/75 p-4 shadow-[0_24px_90px_rgba(16,24,32,0.1)] backdrop-blur sm:mt-7 sm:rounded-[2rem] sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Po užklausos</p>
            <div className="mt-4 grid gap-3">
              {[
                {
                  title: "Patiksliname kainą",
                  text: "Įvertiname kiekį, maketą ir gamybos terminą.",
                  icon: ClipboardCheck,
                  accent: googleAccents[0]
                },
                {
                  title: "Paruošiame gamybai",
                  text: "Kortelės gauna nuolatines Skenis nuorodas.",
                  icon: Factory,
                  accent: googleAccents[2]
                },
                {
                  title: "Priskiriate Google nuorodą",
                  text: "Galutinį adresą galima keisti ir po gamybos.",
                  icon: Link2,
                  accent: googleAccents[1]
                }
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-3">
                  <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border", item.accent.bg, item.accent.border, item.accent.icon)}>
                    <item.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-ink">{item.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
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
    text: "Blizgi akrilinė kortelė su NFC palietimu, QR atsarginiu keliu ir valdoma Skenis nuoroda.",
    basePrice: 19.99,
    icon: Nfc
  };

  const unitPrice =
    quantity >= 100 ? 13.99 : quantity >= 25 ? 16.99 : currentProduct.basePrice;
  const totalPrice = quantity * unitPrice;
  const CurrentIcon = currentProduct.icon;

  return (
    <div className="rounded-[1.5rem] border border-white/80 bg-white/[0.88] p-3 shadow-[0_24px_80px_rgba(16,24,32,0.12)] backdrop-blur-xl sm:rounded-[2rem] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-700">Užsakymo modulis</p>
          <h3 className="mt-1 text-xl font-black tracking-tight text-ink sm:text-2xl">Gaukite pasiūlymą</h3>
        </div>
        <div className="shrink-0 rounded-2xl border border-white/10 bg-ink px-3 py-2 text-right text-white shadow-[0_10px_30px_rgba(11,18,24,0.18)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">nuo</p>
          <p className="text-lg font-black leading-none">{unitPrice.toFixed(2)} €</p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-[#BFDBFE] bg-[#EEF5FF] p-2.5 sm:mt-6 sm:rounded-3xl sm:p-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#4285F4] text-white shadow-lg shadow-blue-500/20 sm:h-14 sm:w-14">
            <CurrentIcon className="h-5 w-5 sm:h-7 sm:w-7" aria-hidden />
          </span>
          <div>
            <h4 className="text-sm font-black text-ink sm:text-base">{currentProduct.label}</h4>
            <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">{currentProduct.text}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-700 sm:mt-4">
          <span className="rounded-full border border-[#BFDBFE] bg-white px-3 py-1 text-[#1D4ED8]">NFC + QR</span>
          <span className="rounded-full border border-[#BBF7D0] bg-white px-3 py-1 text-[#15803D]">Keičiama nuoroda</span>
          <span className="rounded-full border border-[#FDE68A] bg-white px-3 py-1 text-[#A16207]">Statistika</span>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-line bg-slate-50 p-2.5 sm:mt-6 sm:rounded-3xl sm:p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-black text-ink">Kiekis</p>
          <p className="text-xs font-semibold text-slate-500">Kiekio kaina mažėja</p>
        </div>
        <div className="mt-2.5 flex items-center justify-between rounded-2xl border border-white bg-white p-2 shadow-sm sm:mt-4 sm:p-3">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            aria-label="Sumažinti kiekį"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-slate-700 transition hover:border-[#4285F4] hover:text-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-brand-500 sm:h-12 sm:w-12"
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
                  className="text-3xl font-black tracking-tight text-ink sm:text-5xl"
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
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-slate-700 transition hover:border-[#34A853] hover:text-[#15803D] focus:outline-none focus:ring-2 focus:ring-brand-500 sm:h-12 sm:w-12"
          >
            <Plus className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-ink p-3.5 text-white sm:mt-5 sm:rounded-3xl sm:p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Iš viso</p>
            <p className="mt-1 text-3xl font-black sm:text-4xl">{totalPrice.toFixed(2)} €</p>
            <p className="mt-1 text-sm text-slate-300">{unitPrice.toFixed(2)} € / vnt.</p>
          </div>
          <BadgeCheck className="h-9 w-9 text-[#34A853] sm:h-10 sm:w-10" aria-hidden />
        </div>
        <div className="mt-3 grid gap-1.5 text-xs text-slate-300 sm:mt-5 sm:gap-2 sm:text-sm">
          <p className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#4285F4]" aria-hidden />NFC + QR</p>
          <p className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#34A853]" aria-hidden />Keičiama nuoroda</p>
          <p className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FBBC05]" aria-hidden />Unikali Skenis nuoroda</p>
          <p className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#34A853]" aria-hidden />Skenavimų statistika</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOrder(selectedType, quantity)}
        className="button-primary mt-4 w-full rounded-2xl py-3 text-sm sm:mt-5 sm:py-4 sm:text-base"
        data-cursor="magnetic"
      >
        Gauti pasiūlymą
        <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
      </button>
      <p className="mt-2 text-center text-xs font-medium leading-5 text-slate-500">
        Atsakysime su galutine kaina ir gamybos terminu.
      </p>
    </div>
  );
}

function BenefitsSection() {
  return (
    <section data-sticky-hide className="bg-white px-5 py-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="section-kicker">Privalumai</p>
          <h2 className="mt-3 text-[2rem] font-black leading-tight tracking-tight text-ink sm:mt-4 sm:text-5xl">
            Sukurta verslams, kuriems svarbi reputacija
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
            Skenis padeda paprašyti atsiliepimo tiksliai tada, kai klientas ką tik gavo paslaugą.
          </p>
        </Reveal>

        <div className="mt-6 grid gap-2.5 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {benefitCards.map((card, index) => {
            const accent = googleAccents[index % googleAccents.length];

            return (
            <Reveal key={card.title} delay={index * 0.04}>
              <div className="group flex h-full gap-3 rounded-2xl border border-line bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_20px_70px_rgba(16,24,32,0.08)] sm:block sm:rounded-3xl sm:p-6">
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition sm:h-12 sm:w-12 sm:rounded-2xl", accent.bg, accent.border, accent.icon)}>
                  <card.icon className="h-4 w-4 sm:h-6 sm:w-6" aria-hidden />
                </span>
                <div>
                  <h3 className="text-sm font-black leading-tight text-ink sm:mt-5 sm:text-xl">{card.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-6">{card.text}</p>
                </div>
              </div>
            </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="bg-white px-5 py-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="section-kicker">Kodėl verslai renkasi Skenis</p>
          <h2 className="mt-3 text-[1.75rem] font-black leading-tight tracking-tight text-ink sm:mt-4 sm:text-5xl">
            Aiškus produktas be klaidinančių pažadų
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
            Padeda paprašyti realaus atsiliepimo tinkamu momentu, ne kurti dirbtinį įspūdį.
          </p>
        </Reveal>

        <div className="mt-6 grid gap-2.5 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {trustCards.map((card, index) => {
            const accent = googleAccents[index % googleAccents.length];

            return (
            <Reveal key={card.title} delay={index * 0.05}>
              <div className="h-full rounded-2xl border border-line bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_20px_60px_rgba(16,24,32,0.08)] sm:rounded-3xl sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border sm:h-10 sm:w-10", accent.bg, accent.border, accent.icon)}>
                    <card.icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-sm font-black leading-tight text-ink sm:text-base">{card.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">{card.text}</p>
                  </div>
                </div>
              </div>
            </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function IndustryGrid() {
  const [active, setActive] = useState(0);
  const ActiveIcon = industries[active].icon;

  return (
    <section id="kam-tinka" className="bg-[#F8FAFC] px-5 py-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-7 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <Reveal>
            <p className="section-kicker">Kam tinka</p>
            <h2 className="mt-3 text-[2rem] font-black leading-tight tracking-tight text-ink sm:mt-4 sm:text-5xl">
              Kam tinka?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
              Geriausiai veikia ten, kur klientas ką tik gavo paslaugą, pirko produktą arba laukia vietoje.
            </p>
            <div className="mt-7 hidden rounded-3xl border border-brand-100 bg-white p-5 shadow-sm lg:block">
              <ActiveIcon className="h-8 w-8 text-brand-700" aria-hidden />
              <h3 className="mt-4 text-xl font-black text-ink">{industries[active].label}</h3>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-brand-700">
                {industries[active].placement}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{industries[active].example}</p>
            </div>
          </Reveal>

          <div className="-mx-5 grid auto-cols-[82vw] grid-flow-col gap-3 overflow-x-auto px-5 pb-3 snap-x snap-mandatory sm:mx-0 sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0">
            {industries.map((industry, index) => (
              <Reveal key={industry.label} delay={index * 0.04}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  className={cn(
                    "group flex min-h-[148px] w-full snap-start items-start gap-3 rounded-2xl border p-3 text-left transition duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 sm:min-h-28 sm:gap-4 sm:rounded-3xl sm:p-5",
                    active === index
                      ? "border-[#4285F4]/50 bg-white shadow-[0_24px_80px_rgba(66,133,244,0.14)]"
                      : "border-line bg-white/70 hover:border-brand-200 hover:bg-white"
                  )}
                >
                  <span className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition sm:h-12 sm:w-12",
                    active === index ? "bg-[#4285F4] text-white" : "bg-[#EEF5FF] text-[#1D4ED8]"
                  )}>
                    <industry.icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-black text-ink sm:text-base">{industry.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{industry.placement}</span>
                    {active === index ? (
                      <span className="mt-2 block text-xs leading-5 text-brand-800 lg:hidden">{industry.example}</span>
                    ) : null}
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
          <p className="mt-1 text-center text-xs font-semibold text-slate-400 sm:hidden">Braukite per verslo tipus</p>
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  return (
    <section data-sticky-hide className="bg-white px-5 py-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="section-kicker">Naudojimo scenarijai</p>
          <h2 className="mt-3 text-[2rem] font-black leading-tight tracking-tight text-ink sm:mt-4 sm:text-5xl">
            Aiškus kelias nuo aptarnavimo iki atsiliepimo
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
            Kortelė turi būti ten, kur klientui natūraliausia sureaguoti - ne vėliau, ne po priminimo, o vietoje.
          </p>
        </Reveal>

        <div className="-mx-5 mt-6 grid auto-cols-[82vw] grid-flow-col gap-3 overflow-x-auto scroll-smooth px-5 pb-3 snap-x snap-mandatory sm:mx-0 sm:mt-10 sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-4">
          {useCases.map((useCase, index) => (
            <Reveal key={useCase.title} delay={index * 0.05}>
              <div className="group h-full min-h-[168px] snap-start rounded-2xl border border-line bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_26px_90px_rgba(16,24,32,0.1)] sm:min-h-0 sm:rounded-3xl sm:p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#101820,#143e43)] text-[#34A853]">
                  <useCase.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-black text-ink sm:text-lg">{useCase.title}</h3>
                <p className="mt-2 text-sm leading-5 text-slate-600 sm:leading-6">{useCase.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-1 text-center text-xs font-semibold text-slate-400 sm:hidden">Braukite per scenarijus</p>
      </div>
    </section>
  );
}

function AdminSystemPreview() {
  const rows = [
    { token: "A7K92LQD", status: "Aktyvi", place: "Vilniaus filialas" },
    { token: "8fK29xQp", status: "Priskiriama", place: "Registratūra" },
    { token: "Q4L8N2RS", status: "Paruošta", place: "Kortelių grupė" }
  ];

  return (
    <section data-sticky-hide className="relative overflow-hidden bg-ink px-5 py-10 text-white sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(66,133,244,0.20),transparent_32%),radial-gradient(circle_at_18%_80%,rgba(52,168,83,0.18),transparent_30%),radial-gradient(circle_at_80%_76%,rgba(251,188,5,0.10),transparent_28%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-100">
            Valdoma sistema
          </p>
          <h2 className="mt-3 text-[2rem] font-black leading-tight tracking-tight sm:mt-4 sm:text-5xl">
            Fizinis produktas, kurį galite valdyti
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:mt-4 sm:text-base sm:leading-7">
            Kiekviena kortelė turi nuolatinį Skenis adresą. Galutinę Google atsiliepimų nuorodą galite keisti vėliau.
          </p>
          <div className="mt-5 grid gap-2 text-sm text-slate-300 sm:mt-7 sm:gap-3">
            <p className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" aria-hidden />Keičiama galutinė nuoroda</p>
            <p className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" aria-hidden />Kortelių priskyrimas vietoms</p>
            <p className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" aria-hidden />Skenavimų aktyvumas</p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-3 shadow-[0_34px_120px_rgba(0,0,0,0.28)] backdrop-blur sm:rounded-[2rem] sm:p-4">
            <div className="max-h-[380px] overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#0b141a] p-3 sm:max-h-none sm:rounded-[1.5rem] sm:p-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-100">Skenis admin</p>
                  <p className="mt-1 text-sm text-slate-400">Nuorodų ir kortelių valdymas</p>
                </div>
                <span className="rounded-full border border-[#34A853]/40 bg-[#34A853]/15 px-3 py-1 text-xs font-bold text-[#BBF7D0]">
                  Sistema
                </span>
              </div>

              <div className="mt-3 grid gap-2 sm:mt-4 sm:grid-cols-3 sm:gap-3">
                {["Kortelės", "Nuorodos", "Aktyvumas"].map((label, index) => {
                  const accent = googleAccents[index % googleAccents.length];

                  return (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                    <p className="text-xs text-slate-400">{label}</p>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${60 + index * 12}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.12, ease }}
                        className={cn("h-2 rounded-full", accent.bar)}
                      />
                    </div>
                  </div>
                  );
                })}
              </div>

              <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 sm:mt-4">
                {rows.map((row) => (
                  <div key={row.token} className="grid grid-cols-[1fr_auto] gap-3 border-b border-white/10 bg-white/[0.04] p-3 text-sm last:border-b-0 sm:grid-cols-[1fr_1fr_auto] sm:p-4">
                    <span className="font-mono text-brand-100">/r/{row.token}</span>
                    <span className="hidden text-slate-300 sm:inline">{row.place}</span>
                    <span className="rounded-full border border-[#34A853]/25 bg-[#34A853]/15 px-3 py-1 text-xs font-bold text-[#BBF7D0]">{row.status}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:mt-4 sm:p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Skenavimų aktyvumas</p>
                <div className="mt-3 flex h-20 items-end gap-2 sm:mt-4 sm:h-28">
                  {[38, 58, 42, 76, 64, 88, 70, 92].map((height, index) => (
                    <motion.span
                      key={index}
                      initial={{ height: 8 }}
                      whileInView={{ height }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55, delay: index * 0.05, ease }}
                      className={cn("flex-1 rounded-t-lg", googleAccents[index % googleAccents.length].bar)}
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
    <section id="duk" data-sticky-hide className="bg-[#F8FAFC] px-5 py-8 pb-14 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <Reveal>
          <p className="section-kicker">DUK</p>
          <h2 className="mt-3 text-[2rem] font-black leading-tight tracking-tight text-ink sm:mt-4 sm:text-5xl">
            Klausimai prieš užsakant
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
            Trumpi atsakymai apie nuorodas, NFC, QR, statistiką ir Google ryšį.
          </p>
        </Reveal>

        <Reveal className="rounded-[1.5rem] border border-line bg-white p-1.5 shadow-[0_24px_90px_rgba(16,24,32,0.08)] sm:rounded-[2rem] sm:p-2">
          {faqItems.map((item, index) => {
            const active = open === index;
            return (
              <div key={item.question} className="border-b border-line last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpen(active ? -1 : index)}
                  aria-expanded={active}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3.5 text-left text-sm font-black text-ink transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 sm:gap-4 sm:px-4 sm:py-5 sm:text-base"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={cn("h-5 w-5 shrink-0 text-[#4285F4] transition", active && "rotate-180 text-[#34A853]")}
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
                      <p className="px-3 pb-4 text-sm leading-6 text-slate-600 sm:px-4 sm:pb-5">{item.answer}</p>
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
    <section data-sticky-hide className="relative overflow-hidden bg-ink px-5 py-10 text-white sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_10%,rgba(66,133,244,0.20),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(52,168,83,0.16),transparent_28%),linear-gradient(180deg,#101820,#081015)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-7 lg:grid-cols-[1fr_0.78fr] lg:items-end">
          <Reveal>
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-100">
              Finalinis žingsnis
            </p>
            <h2 className="mt-4 max-w-4xl text-[2rem] font-black leading-tight tracking-tight sm:mt-5 sm:text-5xl lg:text-6xl">
              Paverskite kiekvieną patenkintą klientą potencialiu Google atsiliepimu
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:mt-5 sm:text-lg sm:leading-7">
              Padėkite kortelę ten, kur klientas ką tik gavo paslaugą. Vienas palietimas arba QR - ir kelias iki atsiliepimo aiškus.
            </p>
            <button
              type="button"
              onClick={onOrder}
              className="button-light mt-6 rounded-full px-6 py-3 text-sm sm:mt-8 sm:px-7 sm:py-4 sm:text-base"
              data-cursor="magnetic"
            >
              Gauti pasiūlymą
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
            </button>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-4 backdrop-blur sm:rounded-[2rem] sm:p-5">
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <FinalFact value="1 nuolatinė nuoroda" label="kortelė lieka ta pati" />
                <FinalFact value="NFC arba QR" label="du paprasti būdai klientui" />
                <FinalFact value="Aiškus aktyvumas" label="matote, kurios kortelės naudojamos" />
              </div>
              <div className="mt-4 flex items-start gap-3 border-t border-white/10 pt-4 sm:mt-6 sm:pt-5">
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-3 sm:rounded-3xl sm:p-4">
      <p className="text-lg font-black leading-tight text-white sm:text-3xl">{value}</p>
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
    const isInHideZone = () => {
      const zones = Array.from(document.querySelectorAll<HTMLElement>("[data-sticky-hide], footer"));

      return zones.some((zone) => {
        const rect = zone.getBoundingClientRect();
        return rect.top < window.innerHeight - 64 && rect.bottom > 80;
      });
    };

    const onScroll = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      const heroPassed = hero ? hero.getBoundingClientRect().bottom < 24 : window.scrollY > 420;
      setVisible(heroPassed && !isInHideZone());
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-4 bottom-3 z-30 mx-auto max-w-sm transition duration-300 md:hidden",
        hidden || !visible ? "pointer-events-none translate-y-5 opacity-0" : "translate-y-0 opacity-100"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <button
        type="button"
        onClick={onOrder}
        className="relative flex min-h-[56px] w-full items-center justify-center overflow-hidden rounded-full bg-[#0B1218] px-5 py-3 text-sm font-black text-white shadow-[0_18px_54px_rgba(11,18,24,0.28)]"
      >
        <span className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,#4285F4,#34A853,#FBBC05,#EA4335)]" aria-hidden />
        Gauti pasiūlymą
        <ArrowRight className="ml-2 h-4 w-4 text-[#FBBC05]" aria-hidden />
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
              Parašykite kiekį, produkto tipą ir, jei turite, Google atsiliepimų nuorodą.
              Atsakysime su kaina, terminu ir gamybos eiga.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-slate-300">
              <p className="flex gap-2"><ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" aria-hidden />Individualios Skenis nuorodos kiekvienam gaminiui.</p>
              <p className="flex gap-2"><Factory className="mt-0.5 h-4 w-4 shrink-0 text-brand-100" aria-hidden />Kortelių grupės paruošimas gamintojui.</p>
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
                Parašykite kiekį, produkto tipą ir Google atsiliepimų nuorodą, jei ją jau turite.
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
