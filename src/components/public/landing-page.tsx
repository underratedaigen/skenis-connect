import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  Link2,
  Minus,
  Nfc,
  Plus,
  QrCode,
  Smartphone,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LeadFormShell } from "@/components/public/lead-form-shell";
import { SectionHeading } from "./studio-landing";
import { getProductPrice } from "@/lib/product-pricing";

const money = (value: number) =>
  new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR" }).format(
    value,
  );
const faqItems = [
  {
    question: "Ar galima pakeisti Google nuorodą po gamybos?",
    answer:
      "Taip. Ant fizinės kortelės lieka nuolatinė Skenis nuoroda, o galutinį Google atsiliepimų adresą galima pakeisti administracijoje.",
  },
  {
    question: "Ar kortelė veikia su iPhone ir Android?",
    answer:
      "Taip. NFC veikia daugumoje naujesnių telefonų, o QR kodas veikia kaip atsarginis būdas visiems telefonams su kamera.",
  },
  {
    question: "Kas jei klientas nenori naudoti NFC?",
    answer: "Jis gali nuskaityti QR kodą. Kortelėje yra abu būdai.",
  },
  {
    question: "Ar galima turėti skirtingus kodus filialams?",
    answer:
      "Taip. Korteles galima priskirti skirtingoms vietoms, filialams ar zonoms.",
  },
  {
    question: "Ar matysiu skenavimų statistiką?",
    answer:
      "Taip. Galima matyti kortelių aktyvumą ir suprasti, kurios vietos naudojamos geriausiai.",
  },
  {
    question: "Kiek laiko trunka gamyba?",
    answer:
      "Gamybos terminas priklauso nuo kiekio. Pateikus užklausą atsiųsime tikslų terminą.",
  },
  {
    question: "Ar tai oficialus Google produktas?",
    answer:
      "Ne. Skenis nėra oficialus Google produktas. Kortelė nukreipia į jūsų įmonės Google atsiliepimų puslapį.",
  },
];

export function SkenisLanding() {
  const [quantity, setQuantity] = useState(1);
  const [orderQuantity, setOrderQuantity] = useState<number | null>(null);
  const [photo, setPhoto] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { unitPrice, totalPrice } = getProductPrice(quantity);
  const photos = [
    "/images/skenis-product-perspective.jpg",
    "/images/skenis-product-front.jpg",
  ];
  const openOrder = (amount: number) => setOrderQuantity(amount);
  useEffect(() => {
    if (orderQuantity === null) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = [
      ...document.querySelectorAll<HTMLElement>(
        ".studio-nav,.studio-footer,.product-page > section",
      ),
    ];
    const prior = background.map((el) => el.inert);
    background.forEach((el) => (el.inert = true));
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOrderQuantity(null);
        return;
      }
      if (event.key !== "Tab") return;
      const controls = [
        ...(dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]),a[href],input:not([disabled]),select,textarea",
        ) || []),
      ].filter((el) => el.getClientRects().length > 0);
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      background.forEach((el, i) => (el.inert = prior[i]));
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      previousFocus?.focus();
    };
  }, [orderQuantity]);
  return (
    <main id="main-content" tabIndex={-1} className="product-page">
      <section
        className="studio-container studio-page-intro product-hero"
        id="produktas"
      >
        <div>
          <p className="studio-eyebrow">Skenis produktas / NFC + QR</p>
          <h1>
            Gera patirtis.
            <br />
            <span>Vienu žingsniu arčiau atsiliepimo.</span>
          </h1>
          <p className="studio-page-lead">
            Klientas paliečia kortelę telefonu arba nuskaito QR kodą ir
            atsiduria jūsų Google atsiliepimų puslapyje. Be nuorodos paieškų.
          </p>
          <div className="product-hero-actions">
            <a className="studio-button" href="#kaina">
              Pasirinkti kiekį
              <ArrowDownIcon />
            </a>
            <a className="studio-text-link" href="#kaip-veikia">
              Kaip tai veikia
              <ArrowRight size={18} aria-hidden />
            </a>
          </div>
          <div className="product-price-note">
            <strong>1 kortelė — {money(getProductPrice(1).unitPrice)}</strong>
            <br />
            Nuo 100 vnt. — {money(getProductPrice(100).unitPrice)} / vnt.
            Galutinę kainą patvirtiname pasiūlyme.
          </div>
        </div>
        <div className="product-photo-stage">
          <div className="product-photo-top">
            <span>NFC + QR</span>
            <span>Fizinis produktas ↗</span>
          </div>
          <img
            src={photos[photo]}
            width="1280"
            height={photo === 0 ? 1014 : 1024}
            alt={
              photo === 0
                ? "Skenis akrilinė NFC ir QR atsiliepimų kortelė kampu"
                : "Skenis NFC ir QR atsiliepimų kortelė iš priekio"
            }
          />
          <div
            className="product-photo-controls"
            role="group"
            aria-label="Produkto nuotrauka"
          >
            {["Kampu", "Iš priekio"].map((label, i) => (
              <button
                type="button"
                key={label}
                aria-pressed={photo === i}
                onClick={() => setPhoto(i)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section id="produktai" className="studio-section">
        <div className="studio-container product-order-grid" id="uzsakymas">
          <div>
            <p className="studio-eyebrow">Jūsų vietoms. Jūsų kiekiui.</p>
            <h2>
              Pasirinkite kiekį.
              <br />
              Suderinkime detales.
            </h2>
            <p>
              Akrilinė NFC + QR Google atsiliepimų kortelė su unikalia Skenis
              nuoroda. Gamybos terminą ir galutinę kainą pateiksime pasiūlyme.
            </p>
            <div className="product-price-tiers">
              {[
                ["1–24 vnt.", getProductPrice(1).unitPrice],
                ["25–99 vnt.", getProductPrice(25).unitPrice],
                ["100–500 vnt.", getProductPrice(100).unitPrice],
              ].map(([label, price]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{money(Number(price))} / vnt.</strong>
                </div>
              ))}
            </div>
            <p className="product-order-note">
              Užklausa nėra apmokėjimas ar automatinis užsakymo patvirtinimas.
            </p>
          </div>
          <div id="kaina" className="product-order-card">
            <p className="studio-eyebrow">NFC + QR kortelės</p>
            <h3>Kiek kortelių reikia?</h3>
            <div className="product-quantity">
              <button
                type="button"
                aria-label="Sumažinti kiekį"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity === 1}
              >
                <Minus size={22} aria-hidden />
              </button>
              <label>
                <span className="sr-only">Kortelių kiekis</span>
                <input
                  type="number"
                  min="1"
                  max="500"
                  step="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.min(
                        500,
                        Math.max(1, Math.trunc(Number(e.target.value)) || 1),
                      ),
                    )
                  }
                />
                <span>vnt.</span>
              </label>
              <button
                type="button"
                aria-label="Padidinti kiekį"
                onClick={() => setQuantity((q) => Math.min(500, q + 1))}
                disabled={quantity === 500}
              >
                <Plus size={22} aria-hidden />
              </button>
            </div>
            <div
              className="product-quantity-presets"
              role="group"
              aria-label="Dažniausi kortelių kiekiai"
            >
              {[1, 25, 100].map((q) => (
                <button
                  key={q}
                  type="button"
                  aria-pressed={quantity === q}
                  onClick={() => setQuantity(q)}
                >
                  {q} vnt.
                </button>
              ))}
            </div>
            <div className="product-total" aria-live="polite">
              <span>Preliminari suma</span>
              <strong>{money(totalPrice)}</strong>
              <span>{money(unitPrice)} / vnt.</span>
            </div>
            <button
              type="button"
              className="studio-button"
              onClick={() => openOrder(quantity)}
            >
              Gauti pasiūlymą
              <ArrowUpRight size={18} aria-hidden />
            </button>
            <p>Atsakysime su galutine kaina ir gamybos terminu.</p>
          </div>
        </div>
      </section>
      <section id="kaip-veikia" className="studio-section product-how">
        <div className="studio-container">
          <SectionHeading
            label="Paprasta jūsų klientui"
            title="Paliečia. Atsidaro. Pasidalija."
          />
          <div className="product-how-grid">
            {[
              {
                Icon: Nfc,
                title: "Telefonas prie kortelės",
                text: "NFC palietimas arba QR skenavimas telefono kamera. Atskiros Skenis programėlės nereikia.",
              },
              {
                Icon: Smartphone,
                title: "Jūsų atsiliepimų puslapis",
                text: "Klientui atsidaro konkrečios jūsų įmonės Google atsiliepimų nuoroda.",
              },
              {
                Icon: Check,
                title: "Savarankiškas atsiliepimas",
                text: "Prisijungęs prie Google paskyros klientas gali pasidalyti savo patirtimi.",
              },
            ].map(({ Icon, title, text }, i) => (
              <article key={title}>
                <div>
                  <Icon size={28} strokeWidth={1.5} aria-hidden />
                  <span>0{i + 1}</span>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="privalumai" className="studio-section">
        <div className="studio-container product-control-grid">
          <div>
            <p className="studio-eyebrow">Verslui — daugiau kontrolės</p>
            <h2>
              Kortelė lieka.
              <br />
              Nuorodą valdote jūs.
            </h2>
            <p>
              Ant gaminio esanti Skenis nuoroda išlieka. Jos galutinį adresą
              galima pakeisti administracijoje, o skirtingoms vietoms priskirti
              atskirus kodus.
            </p>
            <div className="studio-product-benefits">
              <span>
                <Link2 size={18} aria-hidden />
                Keičiama galutinė nuoroda
              </span>
              <span>
                <QrCode size={18} aria-hidden />
                Individualūs kortelių kodai
              </span>
              <span>
                <BarChart3 size={18} aria-hidden />
                Kortelių skenavimų statistika
              </span>
            </div>
          </div>
          <div className="product-control-demo">
            <div>
              <strong>Kortelių valdymas</strong>
              <span>Sąsajos koncepcija</span>
            </div>
            <div className="product-control-row">
              <span className="product-control-icon">
                <QrCode size={25} aria-hidden />
              </span>
              <div>
                <strong>Registratūra / 01</strong>
                <span>Google atsiliepimų nuoroda</span>
              </div>
              <span className="demo-chip">Aktyvi</span>
            </div>
            <div className="product-control-field">
              <span>Galutinis adresas</span>
              <strong>Jūsų įmonės atsiliepimų puslapis</strong>
              <span>Gali būti pakeistas nekeičiant kortelės.</span>
            </div>
            <div className="product-control-metric">
              <BarChart3 size={24} aria-hidden />
              <div>
                <strong>Kortelės naudojimo aktyvumas</strong>
                <p>Skenavimai nėra parašytų atsiliepimų skaičius.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="kam-tinka" className="studio-section product-use">
        <div className="studio-container">
          <SectionHeading
            label="Ten, kur susitinkate"
            title="Padėkite ten, kur pokalbis baigiasi."
          >
            Klientui patogioje vietoje — po suteiktos paslaugos ar apsilankymo.
          </SectionHeading>
          <div className="product-use-list">
            {[
              "Registratūroje",
              "Prie kasos",
              "Salone",
              "Autoservise",
              "Restorane",
              "Keliuose filialuose",
            ].map((place, i) => (
              <span key={place}>
                <b>0{i + 1}</b>
                {place}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section id="duk" className="studio-section section-divider">
        <div className="studio-container service-section-grid">
          <div>
            <p className="studio-eyebrow">Prieš užsakant</p>
            <h2>Svarbu žinoti.</h2>
            <p>
              Skenis nėra oficialus Google produktas. Kortelė palengvina
              atsiliepimo pateikimą, tačiau negarantuoja atsiliepimų ar teigiamų
              įvertinimų.
            </p>
          </div>
          <div className="studio-faq">
            {faqItems.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <ChevronDown size={19} aria-hidden />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      {orderQuantity !== null && (
        <div
          className="product-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOrderQuantity(null);
          }}
        >
          <div
            ref={dialogRef}
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-order-title"
          >
            <button
              type="button"
              className="product-modal-close"
              aria-label="Uždaryti"
              onClick={() => setOrderQuantity(null)}
            >
              <X size={23} aria-hidden />
            </button>
            <div className="product-modal-heading">
              <p className="studio-eyebrow">Jūsų produkto užklausa</p>
              <h2 id="product-order-title">Paruošime pasiūlymą.</h2>
              <p>
                Pasirinkta {orderQuantity} vnt. Parašykite, kur naudosite
                korteles. Suderinsime galutinę kainą ir terminą.
              </p>
            </div>
            <LeadFormShell
              initialProductType="NFC_CARD"
              initialQuantity={orderQuantity}
            />
          </div>
        </div>
      )}
    </main>
  );
}
function ArrowDownIcon() {
  return (
    <ArrowRight size={18} style={{ transform: "rotate(90deg)" }} aria-hidden />
  );
}
