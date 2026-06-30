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
  ShieldCheck,
  Trash2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type React from "react";
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";
import { AdminShell } from "@/components/admin/admin-shell";
import { LinkRowActions } from "@/components/admin/link-row-actions";
import {
  AdminError,
  AdminLoading,
  AdminPanel,
  AdminTablePanel,
  EmptyAdminText,
  MiniStat
} from "@/components/admin/panels";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import {
  bytesToDownload,
  createBatch,
  deleteBatch,
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
  RedirectStatus
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

export function LoginPage() {
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

    if (!isSupabaseConfigured) {
      setError("Supabase aplinkos kintamieji dar nesukonfigūruoti.");
      setLoading(false);
      return;
    }

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
    <main className="min-h-screen bg-mist px-5 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl overflow-hidden rounded-lg border border-line bg-white shadow-panel lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden bg-ink p-8 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(207,240,234,0.24),transparent_32%),linear-gradient(135deg,#101820,#173039)]" />
          <div className="relative flex h-full flex-col justify-between">
            <Link to="/" className="text-xl font-bold tracking-normal text-white">
              Skenis.lt
            </Link>
            <div>
              <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-100">
                Admin sistema
              </p>
              <h2 className="mt-6 text-3xl font-bold tracking-normal">
                QR partijų, nukreipimų ir užklausų valdymas vienoje vietoje.
              </h2>
              <div className="mt-8 grid gap-4 text-sm leading-6 text-slate-200">
                <p className="flex gap-3">
                  <QrCode aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-brand-100" />
                  Generuokite nuolatinius short URL fizinei gamybai.
                </p>
                <p className="flex gap-3">
                  <Link2 aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-brand-100" />
                  Keiskite Google review nuorodą nekeisdami QR kodo.
                </p>
                <p className="flex gap-3">
                  <ShieldCheck aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-brand-100" />
                  Admin prieiga tik per Supabase Auth ir roles.
                </p>
              </div>
            </div>
            <p className="text-xs leading-5 text-slate-400">
              Skenis short URL lieka stabilus visam fizinio produkto gyvenimui.
            </p>
          </div>
        </section>

        <form onSubmit={onSubmit} className="flex flex-col justify-center p-6 sm:p-10">
          <Link to="/" className="text-xl font-bold tracking-normal text-ink lg:hidden">
            Skenis.lt
          </Link>
          <h1 className="mt-8 text-2xl font-bold tracking-normal lg:mt-0">Admin prisijungimas</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
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
            {error ? <AdminError message={error} /> : null}
            <button className="admin-button" disabled={loading}>
              {loading ? "Jungiamasi..." : "Prisijungti"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export function AdminGuard({ children }: { children: (user: AdminSession) => React.ReactNode }) {
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

export function AdminDashboardPage() {
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

export function NewBatchPage() {
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
              <input
                className="admin-input"
                name="quantity"
                type="number"
                min={1}
                max={1000}
                step={1}
                defaultValue={50}
                required
              />
              <span className="text-xs text-slate-500">Nuo 1 iki 1000.</span>
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

export function BatchDetailPage() {
  useDocumentTitle("QR partija | Skenis.lt");
  const { id } = useParams();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [state, setState] = useState<LoadState<{ batch: QrBatch; links: RedirectLink[] }>>({
    status: "loading"
  });
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  async function handleDelete() {
    if (!id) return;
    const confirmed = window.confirm(
      `Ar tikrai ištrinti partiją "${batch.name}" ir visas ${links.length} jos QR nuorodas? Šio veiksmo atšaukti nebus galima.`
    );
    if (!confirmed) return;
    setDeleting(true);
    try {
      await deleteBatch(id);
      navigate("/admin/batches", { replace: true });
    } catch (error) {
      alert(getErrorMessage(error, "Nepavyko ištrinti partijos."));
      setDeleting(false);
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
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:border-red-500 hover:bg-red-50 disabled:opacity-60"
          >
            <Trash2 aria-hidden className="mr-2 h-4 w-4" />
            {deleting ? "Trinama..." : "Ištrinti partiją"}
          </button>
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
            {links.map((link) => (
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

export function LinksPage() {
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

export function LinkDetailPage() {
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

export function QrPreviewPage() {
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

export function LeadsPage() {
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

export function BatchesPage() {
  useDocumentTitle("QR partijos | Skenis.lt");
  const [state, setState] = useState<LoadState<QrBatch[]>>({ status: "loading" });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function reload() {
    setState({ status: "loading" });
    listBatches()
      .then((data) => setState({ status: "ready", data }))
      .catch((error) =>
        setState({ status: "error", message: getErrorMessage(error, "Nepavyko įkelti partijų.") })
      );
  }

  useEffect(reload, []);

  async function handleDelete(batch: QrBatch) {
    const confirmed = window.confirm(
      `Ar tikrai ištrinti partiją "${batch.name}" ir visas jos QR nuorodas (${batch.quantity} vnt.)? Šio veiksmo atšaukti nebus galima.`
    );
    if (!confirmed) return;
    setDeletingId(batch.id);
    try {
      await deleteBatch(batch.id);
      reload();
    } catch (error) {
      alert(getErrorMessage(error, "Nepavyko ištrinti partijos."));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-ink">QR partijos</h1>
          <p className="mt-2 text-sm text-slate-600">
            Visos sugeneruotos partijos. Ištrynus partiją bus pašalintos ir visos jos QR nuorodos.
          </p>
        </div>
        <Link to="/admin/batches/new" className="admin-button">
          Generuoti partiją
        </Link>
      </div>

      {state.status === "loading" ? <AdminLoading /> : null}
      {state.status === "error" ? <AdminError message={state.message} /> : null}
      {state.status === "ready" ? (
        state.data.length ? (
          <AdminTablePanel title="Visos partijos">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pavadinimas</th>
                  <th>Tipas</th>
                  <th>Kiekis</th>
                  <th>Prefiksas</th>
                  <th>Sukurta</th>
                  <th>Veiksmai</th>
                </tr>
              </thead>
              <tbody>
                {state.data.map((batch) => (
                  <tr key={batch.id}>
                    <td>
                      <Link
                        to={`/admin/batches/${batch.id}`}
                        className="font-medium text-brand-700 hover:text-brand-600"
                      >
                        {batch.name}
                      </Link>
                    </td>
                    <td>{productTypeLabels[batch.productType]}</td>
                    <td>{formatNumber(batch.quantity)}</td>
                    <td>{batch.tokenPrefix || "—"}</td>
                    <td>{formatDate(batch.createdAt)}</td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/admin/batches/${batch.id}`}
                          className="admin-button-secondary"
                        >
                          Atidaryti
                        </Link>
                        <button
                          onClick={() => handleDelete(batch)}
                          disabled={deletingId === batch.id}
                          className="inline-flex items-center rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:border-red-500 hover:bg-red-50 disabled:opacity-60"
                        >
                          <Trash2 aria-hidden className="mr-2 h-4 w-4" />
                          {deletingId === batch.id ? "Trinama..." : "Ištrinti"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AdminTablePanel>
        ) : (
          <EmptyAdminText>Partijų dar nėra. Sugeneruokite pirmąją.</EmptyAdminText>
        )
      ) : null}
    </div>
  );
}

