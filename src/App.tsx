import {
  Activity,
  Ban,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  Link2,
  PackageCheck,
  QrCode,
  ShieldCheck
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type React from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";
import { AdminShell } from "@/components/admin/admin-shell";
import { LinkRowActions } from "@/components/admin/link-row-actions";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { LeadForm } from "@/components/lead-form";
import { RedirectStatusPage } from "@/components/redirect-status-page";
import { supabase } from "@/integrations/supabase/client";
import {
  bytesToDownload,
  createBatch,
  exportBatchQrZip,
  exportBatchXlsx,
  getBatchDetail,
  getCurrentAdmin,
  getDashboard,
  getLinkDetail,
  listBatches,
  listLeads,
  listLinks,
  productTypesForInput,
  resolveRedirectToken,
  setRedirectLinkStatus,
  updateLeadStatus,
  updateRedirectLink
} from "@/lib/app-data";
import { leadStatusLabels, productTypeLabels, redirectStatusLabels } from "@/lib/labels";
import type {
  AdminSession,
  Lead,
  LeadStatus,
  QrBatch,
  RedirectLink,
  RedirectStatus,
  ScanEvent
} from "@/lib/types";
import { formatDate, formatNumber, truncate } from "@/lib/utils";

type LoadState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: T };

function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4">
          <Link to="/" className="text-xl font-bold tracking-normal">
            Skenis.lt
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            <a href="/#kaip-veikia" className="hover:text-brand-700">
              Kaip veikia
            </a>
            <a href="/#produktai" className="hover:text-brand-700">
              Produktai
            </a>
            <Link to="/kontaktai" className="hover:text-brand-700">
              Kontaktai
            </Link>
            <Link to="/admin/login" className="hover:text-brand-700">
              Admin
            </Link>
          </nav>
          <a href="/#uzsakymas" className="button-primary hidden sm:inline-flex">
            Užsakyti
          </a>
        </div>
      </header>
      {children}
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-xl font-bold">Skenis.lt</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Programuojamos akrilinės QR kortelės ir stendai realiems klientų
            atsiliepimams rinkti.
          </p>
          <p className="mt-4 text-xs leading-5 text-slate-400">
            Google yra atitinkamo savininko prekės ženklas. Skenis nėra susijęs
            su Google.
          </p>
        </div>
        <nav className="grid gap-2 text-sm text-slate-300">
          <Link to="/privatumo-politika" className="hover:text-white">
            Privatumo politika
          </Link>
          <Link to="/taisykles" className="hover:text-white">
            Taisyklės
          </Link>
          <Link to="/kontaktai" className="hover:text-white">
            Kontaktai
          </Link>
          <a href="https://skenis.lt" className="hover:text-white">
            skenis.lt
          </a>
        </nav>
      </div>
    </footer>
  );
}

function HomePage() {
  useDocumentTitle("Skenis.lt | Programuojami Google atsiliepimų QR stendai");

  const products = [
    {
      name: "Akrilinė Google Review kortelė",
      price: "nuo 4,90 €",
      text: "Plona, patvari kortelė kasai, registratūrai ar laukimo zonai."
    },
    {
      name: "Stalinis Google Review stendas",
      price: "nuo 9,90 €",
      text: "Matomas stendas restoranams, salonams, klinikoms ir parduotuvėms."
    },
    {
      name: "NFC + QR Google Review kortelė",
      price: "netrukus",
      text: "Ateities produktas klientams, kurie nori skenavimo ir NFC palietimo."
    }
  ];

  return (
    <PublicLayout>
      <main>
        <section className="relative overflow-hidden bg-mist">
          <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[1fr_0.85fr]">
            <div className="max-w-3xl">
              <p className="mb-5 inline-flex rounded-full border border-brand-100 bg-white px-3 py-1 text-sm font-semibold text-brand-700">
                Skenis.lt verslui Lietuvoje
              </p>
              <h1 className="text-4xl font-bold tracking-normal text-ink sm:text-5xl lg:text-6xl">
                Daugiau Google atsiliepimų su išmaniais QR stendais
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Programuojamos akrilinės kortelės ir stendai, kurie nukreipia
                klientus tiesiai į jūsų Google atsiliepimų puslapį.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#uzsakymas" className="button-primary">
                  Užsakyti korteles
                </a>
                <a href="#kaip-veikia" className="button-secondary">
                  Kaip tai veikia?
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/skenis-hero.png"
                alt="Skenis QR akriliniai stendai"
                className="aspect-[4/3] w-full rounded-lg object-cover shadow-soft"
              />
            </div>
          </div>
        </section>

        <section id="kaip-veikia" className="mx-auto max-w-7xl px-5 py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-normal">Kaip tai veikia</h2>
            <p className="mt-3 text-slate-600">
              Fizinis QR kodas visada veda į nuolatinę Skenis nuorodą, o
              galutinį Google nukreipimą galite pakeisti vėliau.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {[
              "Įmonė užsisako korteles arba stendus.",
              "Mes sugeneruojame individualius QR kodus.",
              "QR kodai pagaminami ir pritvirtinami prie kortelių/stendų.",
              "Kiekvienas QR kodas admin sistemoje priskiriamas konkrečiai įmonei.",
              "Klientai skenuoja ir patenka į Google review puslapį."
            ].map((step, index) => (
              <div key={step} className="rounded-lg border border-line bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-brand-700">Žingsnis {index + 1}</p>
                <p className="mt-3 text-sm leading-6 text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="produktai" className="bg-mist py-20">
          <div className="mx-auto max-w-7xl px-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-3xl font-bold tracking-normal">Produktai</h2>
                <p className="mt-3 max-w-2xl text-slate-600">
                  Kainodara konfigūruojama pagal kiekį, maketą ir gamybos terminą.
                </p>
              </div>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {products.map((product) => (
                <article key={product.name} className="rounded-lg border border-line bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold tracking-normal">{product.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{product.text}</p>
                  <p className="mt-6 text-2xl font-bold text-brand-700">{product.price}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-bold tracking-normal">Kodėl Skenis</h2>
            <p className="mt-4 text-slate-600">
              Sukurta verslams, kuriems reikia patikimo fizinio produkto ir
              praktiško QR administravimo po gamybos.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Programuojami QR kodai",
              "Galima keisti redirect nuorodą net po pagaminimo",
              "Individualus kodas kiekvienai kortelei",
              "Tinka restoranams, salonams, klinikoms, autoservisams, viešbučiams ir parduotuvėms",
              "Galima sekti skenavimų statistiką"
            ].map((benefit) => (
              <div key={benefit} className="flex gap-3 rounded-lg border border-line bg-white p-4 shadow-sm">
                <CheckCircle2 aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
                <p className="text-sm leading-6 text-slate-700">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-ink py-12 text-white">
          <div className="mx-auto flex max-w-7xl gap-4 px-5">
            <ShieldCheck aria-hidden className="mt-1 h-6 w-6 shrink-0 text-brand-100" />
            <p className="max-w-4xl text-sm leading-7 text-slate-200">
              Skenis padeda patogiai paprašyti realių klientų palikti
              atsiliepimą. Nesiūlykite atlygio už atsiliepimus ir neskatinkite
              tik teigiamų įvertinimų.
            </p>
          </div>
        </section>

        <section id="uzsakymas" className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-bold tracking-normal">Užsakymo užklausa</h2>
            <p className="mt-4 text-slate-600">
              Parašykite kiekį, produkto tipą ir, jei turite, Google review
              nuorodą. Atsakysime su gamybos galimybėmis ir kaina.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-white p-6 shadow-panel">
            <LeadForm />
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

function ContactPage() {
  useDocumentTitle("Kontaktai | Skenis.lt");
  return (
    <PublicLayout>
      <main className="mx-auto max-w-4xl px-5 py-20">
        <h1 className="text-4xl font-bold tracking-normal">Kontaktai</h1>
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

function PrivacyPage() {
  useDocumentTitle("Privatumo politika | Skenis.lt");
  return (
    <PublicLayout>
      <main className="mx-auto max-w-3xl px-5 py-20 text-slate-700">
        <h1 className="text-4xl font-bold tracking-normal text-ink">Privatumo politika</h1>
        <p className="mt-6 leading-7">
          Renkame tik tuos duomenis, kurie būtini užklausoms apdoroti, QR
          nuorodoms administruoti ir skenavimų statistikai pateikti.
          Skenavimų analitikoje saugomas IP maišos kodas, o ne žalias IP
          adresas.
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

function TermsPage() {
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

function LoginPage() {
  useDocumentTitle("Admin prisijungimas | Skenis.lt");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const admin = await getCurrentAdmin();
    if (!admin) {
      await supabase.auth.signOut();
      setError("Šis vartotojas neturi admin teisių.");
      setLoading(false);
      return;
    }

    navigate("/admin", { replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-mist px-5 py-10">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-panel">
        <Link to="/" className="text-xl font-bold tracking-normal text-ink">
          Skenis.lt
        </Link>
        <h1 className="mt-8 text-2xl font-bold tracking-normal">Admin prisijungimas</h1>
        <p className="mt-2 text-sm text-slate-600">
          Prisijunkite su Supabase Auth el. paštu ir slaptažodžiu.
        </p>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="admin-label">El. paštas</span>
            <input
              className="admin-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              autoComplete="email"
              required
            />
          </label>
          <label className="grid gap-2">
            <span className="admin-label">Slaptažodis</span>
            <input
              className="admin-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <button className="admin-button" disabled={loading}>
            {loading ? "Jungiamasi..." : "Prisijungti"}
          </button>
        </div>
      </form>
    </main>
  );
}

function AdminGuard({ children }: { children: (user: AdminSession) => React.ReactNode }) {
  const [state, setState] = useState<LoadState<AdminSession>>({ status: "loading" });

  useEffect(() => {
    getCurrentAdmin()
      .then((admin) => {
        if (!admin) {
          setState({ status: "error", message: "Prisijunkite prie admin paskyros." });
          return;
        }
        setState({ status: "ready", data: admin });
      })
      .catch((error) =>
        setState({ status: "error", message: getErrorMessage(error, "Nepavyko patikrinti sesijos.") })
      );
  }, []);

  if (state.status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-mist px-5">
        <p className="rounded-lg border border-line bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
          Tikrinama admin sesija...
        </p>
      </main>
    );
  }

  if (state.status === "error") {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminShell user={state.data}>{children(state.data)}</AdminShell>;
}

function AdminDashboardPage() {
  useDocumentTitle("Admin apžvalga | Skenis.lt");
  const [state, setState] = useState<LoadState<Awaited<ReturnType<typeof getDashboard>>>>({
    status: "loading"
  });

  useEffect(() => {
    getDashboard()
      .then((data) => setState({ status: "ready", data }))
      .catch((error) =>
        setState({ status: "error", message: getErrorMessage(error, "Nepavyko įkelti apžvalgos.") })
      );
  }, []);

  if (state.status === "loading") return <AdminLoading />;
  if (state.status === "error") return <AdminError message={state.message} />;

  const data = state.data;

  return (
    <div className="grid gap-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-ink">Apžvalga</h1>
          <p className="mt-2 text-sm text-slate-600">
            QR nuorodų, skenavimų ir naujų užklausų būklė.
          </p>
        </div>
        <Link to="/admin/batches/new" className="admin-button">
          Generuoti QR partiją
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Sugeneruota QR nuorodų" value={data.totalLinks} icon={QrCode} tone="accent" />
        <StatCard label="Aktyvios nuorodos" value={data.activeLinks} icon={CheckCircle2} />
        <StatCard label="Nepriskirtos" value={data.unassignedLinks} icon={Clock} />
        <StatCard label="Išjungtos" value={data.disabledLinks} icon={Ban} />
        <StatCard label="Visi skenavimai" value={data.totalScans} icon={Activity} tone="accent" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <AdminPanel title="Naujausi skenavimai" action={<Link to="/admin/links">Visos nuorodos</Link>}>
          {data.recentScans.length ? (
            data.recentScans.map((scan) => (
              <div key={scan.id} className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 last:border-b-0">
                <div>
                  <Link
                    to={`/admin/links/${scan.redirectLink?.token || ""}`}
                    className="font-semibold text-ink hover:text-brand-700"
                  >
                    {scan.redirectLink?.companyName || scan.redirectLink?.token || "QR"}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500">{scan.deviceType || "unknown"}</p>
                </div>
                <p className="text-right text-sm text-slate-600">{formatDate(scan.createdAt)}</p>
              </div>
            ))
          ) : (
            <EmptyAdminText>Skenavimų dar nėra.</EmptyAdminText>
          )}
        </AdminPanel>

        <AdminPanel title="Naujausios užklausos" action={<Link to="/admin/leads">Visos užklausos</Link>}>
          {data.recentLeads.length ? (
            data.recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 last:border-b-0">
                <div>
                  <p className="font-semibold text-ink">{lead.companyName}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {lead.name} · {formatNumber(lead.quantity)} vnt.
                  </p>
                </div>
                <p className="text-right text-sm text-slate-600">{formatDate(lead.createdAt)}</p>
              </div>
            ))
          ) : (
            <EmptyAdminText>Užklausų dar nėra.</EmptyAdminText>
          )}
        </AdminPanel>
      </section>

      <div className="rounded-lg border border-brand-100 bg-brand-50 p-5 text-sm leading-6 text-brand-700">
        <div className="flex gap-3">
          <Link2 aria-hidden className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Kiekvienas fizinis QR kodas turi nuolatinę Skenis trumpą nuorodą.
            Gamybai siunčiamas tik <strong>skenis.lt/r/token</strong>, o
            galutinis Google nukreipimas gali būti pakeistas bet kada.
          </p>
        </div>
      </div>
    </div>
  );
}

function NewBatchPage() {
  useDocumentTitle("Generuoti QR partiją | Skenis.lt");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const batch = await createBatch(Object.fromEntries(new FormData(event.currentTarget).entries()));
      navigate(`/admin/batches/${batch.id}?created=1`);
    } catch (error) {
      setError(getErrorMessage(error, "Nepavyko sugeneruoti partijos."));
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-normal text-ink">Generuoti QR partiją</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sugeneruokite nuolatines Skenis trumpas nuorodas fizinių kortelių ar
          stendų gamybai. Visi nauji QR kodai pradedami kaip nepriskirti.
        </p>
      </div>

      {error ? <AdminError message={error} /> : null}

      <form onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="admin-label">Partijos pavadinimas</span>
            <input
              className="admin-input"
              name="name"
              placeholder="2026-07 pirmas gamybos užsakymas"
              required
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="admin-label">Kiekis</span>
              <select className="admin-input" name="quantity" defaultValue="50">
                {[1, 10, 50, 100, 500, 1000].map((quantity) => (
                  <option key={quantity} value={quantity}>
                    {quantity}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="admin-label">Produkto tipas</span>
              <select className="admin-input" name="productType" defaultValue="CARD">
                {productTypesForInput.map((type) => (
                  <option key={type} value={type}>
                    {productTypeLabels[type]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="admin-label">Token prefiksas arba žyma</span>
              <input className="admin-input" name="tokenPrefix" maxLength={12} placeholder="PVZ_" />
              <span className="text-xs text-slate-500">
                Tik raidės, skaičiai, brūkšnys ir pabraukimas.
              </span>
            </label>

            <label className="grid gap-2">
              <span className="admin-label">Vidinė pastaba</span>
              <input className="admin-input" name="note" placeholder="Pvz. juodas QR lipdukas" />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="admin-label">Pastaba gamintojui</span>
            <textarea
              className="admin-input min-h-28 resize-y"
              name="manufacturerNote"
              placeholder="Maketo, matmenų ar gamybos komentarai."
            />
          </label>

          <div className="rounded-lg border border-brand-100 bg-brand-50 p-4 text-sm leading-6 text-brand-700">
            Kiekvienas sugeneruotas tokenas taps nuolatine nuoroda formatu
            https://skenis.lt/r/token. Vėliau keičiamas tik galutinis
            nukreipimo adresas.
          </div>

          <button className="admin-button w-full sm:w-fit" disabled={loading}>
            {loading ? "Generuojama..." : "Generuoti"}
          </button>
        </div>
      </form>
    </div>
  );
}

function BatchDetailPage() {
  useDocumentTitle("QR partija | Skenis.lt");
  const { id } = useParams();
  const [search] = useSearchParams();
  const [state, setState] = useState<LoadState<{ batch: QrBatch; links: RedirectLink[] }>>({
    status: "loading"
  });
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!id) return;
    getBatchDetail(id)
      .then((data) => setState({ status: "ready", data }))
      .catch((error) =>
        setState({ status: "error", message: getErrorMessage(error, "Nepavyko įkelti partijos.") })
      );
  }, [id]);

  if (state.status === "loading") return <AdminLoading />;
  if (state.status === "error") return <AdminError message={state.message} />;

  const { batch, links } = state.data;
  const statusCounts = links.reduce<Record<string, number>>((acc, link) => {
    acc[link.status] = (acc[link.status] || 0) + 1;
    return acc;
  }, {});

  async function downloadXlsx() {
    setDownloading(true);
    try {
      const bytes = await exportBatchXlsx(batch, links);
      bytesToDownload(
        bytes,
        `skenis_${batch.name.replace(/[^A-Za-z0-9_-]+/g, "_")}.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } finally {
      setDownloading(false);
    }
  }

  async function downloadZip() {
    setDownloading(true);
    try {
      const bytes = await exportBatchQrZip(links);
      bytesToDownload(bytes, `skenis_qr_${batch.name.replace(/[^A-Za-z0-9_-]+/g, "_")}.zip`, "application/zip");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="grid gap-8">
      {search.get("created") ? (
        <div className="rounded-lg border border-brand-100 bg-brand-50 p-5 text-sm leading-6 text-brand-700">
          <div className="flex gap-3">
            <PackageCheck aria-hidden className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              Partija sugeneruota. Galite atsisiųsti XLSX failą gamintojui arba
              atidaryti sugeneruotų nuorodų sąrašą.
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-ink">{batch.name}</h1>
          <p className="mt-2 text-sm text-slate-600">
            Partija {batch.id} · {formatDate(batch.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={downloadXlsx} disabled={downloading} className="admin-button">
            <FileSpreadsheet aria-hidden className="mr-2 h-4 w-4" />
            Download XLSX
          </button>
          <button onClick={downloadZip} disabled={downloading} className="admin-button-secondary">
            <Download aria-hidden className="mr-2 h-4 w-4" />
            QR SVG ZIP
          </button>
          <Link to={`/admin/links?batch=${batch.id}`} className="admin-button-secondary">
            <QrCode aria-hidden className="mr-2 h-4 w-4" />
            View generated links
          </Link>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <MiniStat label="Kiekis" value={formatNumber(batch.quantity)} />
        <MiniStat label="Produkto tipas" value={productTypeLabels[batch.productType]} />
        <MiniStat label="Prefiksas" value={batch.tokenPrefix || "—"} />
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Būsenos</p>
          <div className="mt-2 grid gap-1 text-sm">
            {Object.entries(statusCounts).map(([status, count]) => (
              <p key={status}>
                {redirectStatusLabels[status as RedirectStatus]}: <strong>{formatNumber(count)}</strong>
              </p>
            ))}
          </div>
        </div>
      </section>

      <AdminTablePanel title="Sugeneruoti QR kodai" subtitle="Rodomi pirmi 60 įrašų.">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Short URL</th>
              <th>Status</th>
              <th>Sukurta</th>
            </tr>
          </thead>
          <tbody>
            {links.slice(0, 60).map((link) => (
              <tr key={link.id}>
                <td className="font-mono text-xs">{link.token}</td>
                <td>
                  <Link to={`/admin/links/${link.token}`} className="font-medium text-brand-700 hover:text-brand-600">
                    {link.shortUrl}
                  </Link>
                </td>
                <td>{redirectStatusLabels[link.status]}</td>
                <td>{formatDate(link.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTablePanel>
    </div>
  );
}

function LinksPage() {
  useDocumentTitle("QR nuorodos | Skenis.lt");
  const [search, setSearch] = useSearchParams();
  const [state, setState] = useState<LoadState<RedirectLink[]>>({ status: "loading" });
  const [batches, setBatches] = useState<QrBatch[]>([]);
  const searchKey = search.toString();

  const filters = useMemo(
    () => ({
      token: search.get("token") || "",
      company: search.get("company") || "",
      batch: search.get("batch") || "",
      status: (search.get("status") || "") as RedirectStatus | ""
    }),
    [searchKey]
  );

  useEffect(() => {
    setState({ status: "loading" });
    Promise.all([listLinks(filters), listBatches()])
      .then(([links, batchRows]) => {
        setState({ status: "ready", data: links });
        setBatches(batchRows);
      })
      .catch((error) =>
        setState({ status: "error", message: getErrorMessage(error, "Nepavyko įkelti nuorodų.") })
      );
  }, [searchKey]);

  function updateFilter(name: string, value: string) {
    const next = new URLSearchParams(search);
    if (value) next.set(name, value);
    else next.delete(name);
    setSearch(next);
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-ink">QR nuorodos</h1>
          <p className="mt-2 text-sm text-slate-600">Ieškokite, filtruokite ir programuokite individualius QR kodus.</p>
        </div>
        <Link to="/admin/batches/new" className="admin-button">
          Generuoti partiją
        </Link>
      </div>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
        <input className="admin-input" placeholder="Token" value={filters.token} onChange={(event) => updateFilter("token", event.target.value)} />
        <input className="admin-input" placeholder="Įmonė" value={filters.company} onChange={(event) => updateFilter("company", event.target.value)} />
        <select className="admin-input" value={filters.batch} onChange={(event) => updateFilter("batch", event.target.value)}>
          <option value="">Visos partijos</option>
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.name}
            </option>
          ))}
        </select>
        <select className="admin-input" value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
          <option value="">Visos būsenos</option>
          {Object.entries(redirectStatusLabels).map(([status, label]) => (
            <option key={status} value={status}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {state.status === "loading" ? <AdminLoading /> : null}
      {state.status === "error" ? <AdminError message={state.message} /> : null}
      {state.status === "ready" ? (
        <AdminTablePanel title="Visos QR nuorodos">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Status</th>
                <th>Įmonė</th>
                <th>Destination</th>
                <th>Tipas</th>
                <th>Partija</th>
                <th>Skenavimai</th>
                <th>Paskutinis</th>
                <th>Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {state.data.map((link) => (
                <tr key={link.id}>
                  <td className="font-mono text-xs">{link.token}</td>
                  <td>
                    <StatusBadge status={link.status} />
                  </td>
                  <td>{link.companyName || "—"}</td>
                  <td className="max-w-xs">{truncate(link.destinationUrl, 42)}</td>
                  <td>{productTypeLabels[link.productType]}</td>
                  <td>{link.batch?.name || "—"}</td>
                  <td>{formatNumber(link.scanCount)}</td>
                  <td>{formatDate(link.lastScannedAt)}</td>
                  <td>
                    <LinkRowActions token={link.token} shortUrl={link.shortUrl} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminTablePanel>
      ) : null}
    </div>
  );
}

function LinkDetailPage() {
  useDocumentTitle("QR nuoroda | Skenis.lt");
  const { token } = useParams();
  const [state, setState] = useState<LoadState<Awaited<ReturnType<typeof getLinkDetail>>>>({
    status: "loading"
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function reload() {
    if (!token) return;
    getLinkDetail(token)
      .then((data) => setState({ status: "ready", data }))
      .catch((error) =>
        setState({ status: "error", message: getErrorMessage(error, "Nepavyko įkelti QR nuorodos.") })
      );
  }

  useEffect(reload, [token]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    setMessage(null);
    try {
      await updateRedirectLink(token, Object.fromEntries(new FormData(event.currentTarget).entries()));
      setMessage("QR nuoroda išsaugota.");
      reload();
    } catch (error) {
      setMessage(getErrorMessage(error, "Nepavyko išsaugoti."));
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(status: RedirectStatus) {
    if (!token) return;
    await setRedirectLinkStatus(token, status);
    reload();
  }

  if (state.status === "loading") return <AdminLoading />;
  if (state.status === "error") return <AdminError message={state.message} />;

  const detail = state.data;
  const link = detail.link;

  return (
    <div className="grid gap-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-ink">{link.token}</h1>
          <p className="mt-2 text-sm text-slate-600">{link.shortUrl}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/admin/links/${link.token}/qr`} className="admin-button-secondary">
            QR peržiūra
          </Link>
          <button onClick={() => changeStatus("DISABLED")} className="admin-button-secondary">
            Išjungti
          </button>
          <button onClick={() => changeStatus("ACTIVE")} className="admin-button-secondary">
            Įjungti
          </button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-5">
        <MiniStat label="Visi skenavimai" value={formatNumber(detail.totalScans)} />
        <MiniStat label="Šiandien" value={formatNumber(detail.scansToday)} />
        <MiniStat label="7 dienos" value={formatNumber(detail.scans7Days)} />
        <MiniStat label="30 dienų" value={formatNumber(detail.scans30Days)} />
        <MiniStat label="Paskutinis" value={formatDate(detail.lastScanAt)} />
      </section>

      <div className="rounded-lg border border-brand-100 bg-brand-50 p-4 text-sm leading-6 text-brand-700">
        QR kodas visada liks tas pats. Pakeitus Google nuorodą, pasikeis tik
        nukreipimo adresas.
      </div>

      <form onSubmit={onSubmit} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="admin-label">Įmonė</span>
            <input className="admin-input" name="companyName" defaultValue={link.companyName || ""} />
          </label>
          <label className="grid gap-2">
            <span className="admin-label">Kontaktinis asmuo</span>
            <input className="admin-input" name="contactName" defaultValue={link.contactName || ""} />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="admin-label">El. paštas</span>
            <input className="admin-input" name="contactEmail" type="email" defaultValue={link.contactEmail || ""} />
          </label>
          <label className="grid gap-2">
            <span className="admin-label">Telefonas</span>
            <input className="admin-input" name="contactPhone" defaultValue={link.contactPhone || ""} />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="admin-label">Google review URL</span>
          <input className="admin-input" name="destinationUrl" type="url" defaultValue={link.destinationUrl || ""} />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="admin-label">Statusas</span>
            <select className="admin-input" name="status" defaultValue={link.status}>
              {Object.entries(redirectStatusLabels).map(([status, label]) => (
                <option key={status} value={status}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="admin-label">Produkto tipas</span>
            <input className="admin-input" value={productTypeLabels[link.productType]} readOnly />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="admin-label">Pastabos</span>
          <textarea className="admin-input min-h-28 resize-y" name="notes" defaultValue={link.notes || ""} />
        </label>

        {message ? (
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {message}
          </p>
        ) : null}

        <button className="admin-button w-full sm:w-fit" disabled={saving}>
          {saving ? "Saugoma..." : "Išsaugoti"}
        </button>
      </form>

      <AdminTablePanel title="Naujausi skenavimai">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Laikas</th>
              <th>Įrenginys</th>
              <th>Referrer</th>
              <th>User agent</th>
            </tr>
          </thead>
          <tbody>
            {detail.scans.map((scan) => (
              <tr key={scan.id}>
                <td>{formatDate(scan.createdAt)}</td>
                <td>{scan.deviceType || "unknown"}</td>
                <td>{truncate(scan.referrer, 40)}</td>
                <td>{truncate(scan.userAgent, 70)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTablePanel>
    </div>
  );
}

function QrPreviewPage() {
  useDocumentTitle("QR peržiūra | Skenis.lt");
  const { token } = useParams();
  const [state, setState] = useState<LoadState<{ link: RedirectLink; svg: string }>>({
    status: "loading"
  });

  useEffect(() => {
    if (!token) return;
    getLinkDetail(token)
      .then(async (detail) => {
        const { createQrSvg } = await import("@/lib/qr");
        const svg = await createQrSvg(detail.link.shortUrl);
        setState({ status: "ready", data: { link: detail.link, svg } });
      })
      .catch((error) =>
        setState({ status: "error", message: getErrorMessage(error, "Nepavyko įkelti QR.") })
      );
  }, [token]);

  if (state.status === "loading") return <AdminLoading />;
  if (state.status === "error") return <AdminError message={state.message} />;

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-normal text-ink">QR peržiūra</h1>
        <p className="mt-2 text-sm text-slate-600">{state.data.link.shortUrl}</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div
          className="mx-auto w-full max-w-sm"
          dangerouslySetInnerHTML={{ __html: state.data.svg }}
        />
      </div>
      <Link to={`/admin/links/${state.data.link.token}`} className="admin-button-secondary w-fit">
        Grįžti į redagavimą
      </Link>
    </div>
  );
}

function LeadsPage() {
  useDocumentTitle("Užklausos | Skenis.lt");
  const [state, setState] = useState<LoadState<Lead[]>>({ status: "loading" });

  function reload() {
    listLeads()
      .then((data) => setState({ status: "ready", data }))
      .catch((error) =>
        setState({ status: "error", message: getErrorMessage(error, "Nepavyko įkelti užklausų.") })
      );
  }

  useEffect(reload, []);

  async function changeStatus(id: string, status: LeadStatus) {
    await updateLeadStatus(id, status);
    reload();
  }

  if (state.status === "loading") return <AdminLoading />;
  if (state.status === "error") return <AdminError message={state.message} />;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-normal text-ink">Užklausos</h1>
        <p className="mt-2 text-sm text-slate-600">Viešos formos pateikti užsakymai ir kontaktai.</p>
      </div>
      <AdminTablePanel title="Leads">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Įmonė</th>
              <th>Kontaktas</th>
              <th>Kiekis</th>
              <th>Produktas</th>
              <th>Google URL</th>
              <th>Statusas</th>
              <th>Sukurta</th>
            </tr>
          </thead>
          <tbody>
            {state.data.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <strong>{lead.companyName}</strong>
                  <p className="mt-1 text-xs text-slate-500">{truncate(lead.message, 52)}</p>
                </td>
                <td>
                  {lead.name}
                  <p className="mt-1 text-xs text-slate-500">{lead.email}</p>
                  <p className="text-xs text-slate-500">{lead.phone || "—"}</p>
                </td>
                <td>{formatNumber(lead.quantity)}</td>
                <td>{productTypeLabels[lead.productType]}</td>
                <td>{truncate(lead.googleReviewUrl, 40)}</td>
                <td>
                  <select
                    className="admin-input min-w-40"
                    value={lead.status}
                    onChange={(event) => changeStatus(lead.id, event.target.value as LeadStatus)}
                  >
                    {Object.entries(leadStatusLabels).map(([status, label]) => (
                      <option key={status} value={status}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{formatDate(lead.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTablePanel>
    </div>
  );
}

function RedirectPage() {
  useDocumentTitle("Skenis QR | Skenis.lt");
  const { token } = useParams();
  const [view, setView] = useState<
    "loading" | "missing" | "rate_limited" | "unassigned" | "disabled" | "invalid_destination"
  >("loading");

  useEffect(() => {
    if (!token) {
      setView("missing");
      return;
    }

    resolveRedirectToken(token)
      .then((outcome) => {
        if (outcome.type === "redirect") {
          window.location.assign(outcome.destinationUrl);
          return;
        }
        setView(outcome.type);
      })
      .catch(() => setView("invalid_destination"));
  }, [token]);

  if (view === "loading") {
    return <RedirectStatusPage title="Tikrinamas QR kodas" message="Ruošiamas nukreipimas..." />;
  }
  if (view === "missing") {
    return <RedirectStatusPage title="QR kodas nerastas" message="Šis Skenis QR kodas nerastas." tone="error" />;
  }
  if (view === "disabled") {
    return <RedirectStatusPage title="QR kodas išjungtas" message="Šis QR kodas laikinai išjungtas." tone="warning" />;
  }
  if (view === "unassigned") {
    return <RedirectStatusPage title="QR kodas dar neaktyvus" message="Šis Skenis QR kodas dar nėra aktyvuotas." tone="warning" />;
  }
  if (view === "rate_limited") {
    return <RedirectStatusPage title="Per daug užklausų" message="Bandykite netrukus." tone="warning" />;
  }
  return <RedirectStatusPage title="Nukreipimas neparuoštas" message="Šio QR kodo nukreipimo nuoroda dar nėra paruošta." tone="warning" />;
}

function NotFoundPage() {
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

function AdminPanel({
  title,
  action,
  children
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="font-bold tracking-normal">{title}</h2>
        <div className="text-sm font-semibold text-brand-700">{action}</div>
      </div>
      {children}
    </div>
  );
}

function AdminTablePanel({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-bold tracking-normal">{title}</h2>
        {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

function EmptyAdminText({ children }: { children: React.ReactNode }) {
  return <p className="px-5 py-8 text-sm text-slate-500">{children}</p>;
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-bold text-ink">{value}</p>
    </div>
  );
}

function AdminLoading() {
  return <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">Įkeliama...</p>;
}

function AdminError({ message }: { message: string }) {
  return <p className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">{message}</p>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kontaktai" element={<ContactPage />} />
        <Route path="/privatumo-politika" element={<PrivacyPage />} />
        <Route path="/taisykles" element={<TermsPage />} />
        <Route path="/r/:token" element={<RedirectPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={<AdminGuard>{() => <AdminDashboardPage />}</AdminGuard>}
        />
        <Route
          path="/admin/batches/new"
          element={<AdminGuard>{() => <NewBatchPage />}</AdminGuard>}
        />
        <Route
          path="/admin/batches/:id"
          element={<AdminGuard>{() => <BatchDetailPage />}</AdminGuard>}
        />
        <Route
          path="/admin/links"
          element={<AdminGuard>{() => <LinksPage />}</AdminGuard>}
        />
        <Route
          path="/admin/links/:token"
          element={<AdminGuard>{() => <LinkDetailPage />}</AdminGuard>}
        />
        <Route
          path="/admin/links/:token/qr"
          element={<AdminGuard>{() => <QrPreviewPage />}</AdminGuard>}
        />
        <Route
          path="/admin/leads"
          element={<AdminGuard>{() => <LeadsPage />}</AdminGuard>}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
