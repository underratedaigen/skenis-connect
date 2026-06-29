import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, CalendarDays, Clock, ExternalLink, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import type React from "react";
import { StatusBadge } from "@/components/admin/status-badge";
import { getAdminAccessToken } from "@/lib/client-auth";
import { getLinkDetail, updateRedirectLink } from "@/lib/admin/links.functions";
import { productTypeLabels, redirectStatusLabels } from "@/lib/labels";
import { formatDate, formatNumber } from "@/lib/utils";
import type { AuditLog, RedirectLink, ScanEvent } from "@/lib/types";
import { redirectStatuses } from "@/lib/types";

type LinkDetail = {
  link: RedirectLink;
  todayScans: number;
  sevenDayScans: number;
  thirtyDayScans: number;
  scans: ScanEvent[];
  auditLogs: AuditLog[];
};

export const Route = createFileRoute("/_authenticated/admin/links/$token")({
  head: () => ({
    meta: [{ title: "QR nuoroda | Skenis.lt" }]
  }),
  component: LinkDetailPage
});

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function LinkDetailPage() {
  const { token } = Route.useParams();
  const [link, setLink] = useState<RedirectLink | null>(null);
  const [todayScans, setTodayScans] = useState(0);
  const [sevenDayScans, setSevenDayScans] = useState(0);
  const [thirtyDayScans, setThirtyDayScans] = useState(0);
  const [scans, setScans] = useState<ScanEvent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const accessToken = await getAdminAccessToken();
    const detail = (await getLinkDetail({ data: { accessToken, token } })) as LinkDetail;
    setLink(detail.link);
    setTodayScans(detail.todayScans);
    setSevenDayScans(detail.sevenDayScans);
    setThirtyDayScans(detail.thirtyDayScans);
    setScans(detail.scans);
    setAuditLogs(detail.auditLogs);
  }

  useEffect(() => {
    load().catch((caught) =>
      setError(caught instanceof Error ? caught.message : "Nepavyko įkelti QR nuorodos.")
    );
  }, [token]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const accessToken = await getAdminAccessToken();
      await updateRedirectLink({
        data: {
          accessToken,
          token,
          companyName: form.get("companyName"),
          contactName: form.get("contactName"),
          contactEmail: form.get("contactEmail"),
          contactPhone: form.get("contactPhone"),
          destinationUrl: form.get("destinationUrl"),
          notes: form.get("notes"),
          status: form.get("status")
        }
      });
      setMessage("Nuoroda išsaugota. QR kodas liko tas pats, pasikeitė tik nukreipimo adresas.");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nepavyko išsaugoti pakeitimų.");
    }
  }

  if (error && !link) return <p className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</p>;
  if (!link) return <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">Įkeliama...</p>;

  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      key: dayKey(date),
      label: new Intl.DateTimeFormat("lt-LT", { weekday: "short" }).format(date),
      count: 0
    };
  });

  for (const scan of scans) {
    const bucket = lastSevenDays.find((item) => item.key === dayKey(new Date(scan.createdAt)));
    if (bucket) bucket.count += 1;
  }

  const maxCount = Math.max(1, ...lastSevenDays.map((item) => item.count));

  return (
    <div className="grid gap-8">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <div className="mb-3">
            <StatusBadge status={link.status} />
          </div>
          <h1 className="text-3xl font-bold tracking-normal text-ink">{link.token}</h1>
          <p className="mt-2 text-sm text-slate-600">{link.shortUrl}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/links/$token/qr"
            params={{ token: link.token }}
            search={{ token: "", company: "", batch: "", status: undefined }}
            className="admin-button-secondary"
          >
            <QrCode aria-hidden className="mr-2 h-4 w-4" />
            QR peržiūra
          </Link>
          <a href={link.shortUrl} target="_blank" rel="noreferrer" className="admin-button-secondary">
            <ExternalLink aria-hidden className="mr-2 h-4 w-4" />
            Atidaryti short URL
          </a>
          <Link
            to="/admin/links"
            search={{ token: "", company: "", batch: "", status: undefined }}
            className="admin-button-secondary"
          >
            Grįžti
          </Link>
        </div>
      </div>

      {message ? (
        <p className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <section className="grid gap-4 md:grid-cols-4">
        <Metric icon={Activity} label="Visi skenavimai" value={link.scanCount} />
        <Metric icon={Clock} label="Šiandien" value={todayScans} />
        <Metric icon={CalendarDays} label="Per 7 dienas" value={sevenDayScans} />
        <Metric icon={CalendarDays} label="Per 30 dienų" value={thirtyDayScans} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <form onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 rounded-lg border border-brand-100 bg-brand-50 p-4 text-sm leading-6 text-brand-700">
            QR kodas visada liks tas pats. Pakeitus Google nuorodą, pasikeis
            tik nukreipimo adresas.
          </div>

          <div className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="admin-label">Įmonės pavadinimas</span>
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
              <input
                className="admin-input"
                name="destinationUrl"
                type="url"
                defaultValue={link.destinationUrl || ""}
                placeholder="https://g.page/r/.../review"
              />
              <span className="text-xs text-slate-500">
                Priimamos tik HTTPS Google review, Google Maps arba g.page tipo nuorodos.
              </span>
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="admin-label">Statusas</span>
                <select className="admin-input" name="status" defaultValue={link.status}>
                  {redirectStatuses.map((status) => (
                    <option key={status} value={status}>
                      {redirectStatusLabels[status]}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-2">
                <span className="admin-label">Produktas</span>
                <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {productTypeLabels[link.productType]}
                </div>
              </div>
            </div>

            <label className="grid gap-2">
              <span className="admin-label">Pastabos</span>
              <textarea className="admin-input min-h-32 resize-y" name="notes" defaultValue={link.notes || ""} />
            </label>

            <button className="admin-button w-full sm:w-fit">Išsaugoti pakeitimus</button>
          </div>
        </form>

        <div className="grid gap-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold tracking-normal">Informacija</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div>
                <dt className="text-slate-500">Partija</dt>
                <dd className="mt-1 font-medium text-ink">{link.batch?.name || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Paskutinis skenavimas</dt>
                <dd className="mt-1 font-medium text-ink">{formatDate(link.lastScannedAt)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Sukurta</dt>
                <dd className="mt-1 font-medium text-ink">{formatDate(link.createdAt)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold tracking-normal">7 dienų skenavimai</h2>
            <div className="mt-5 flex h-48 items-end gap-3">
              {lastSevenDays.map((item) => (
                <div key={item.key} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-36 w-full items-end rounded-md bg-slate-100">
                    <div
                      className="w-full rounded-md bg-brand-500"
                      style={{ height: `${Math.max(6, (item.count / maxCount) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{item.label}</span>
                  <span className="text-xs font-semibold text-ink">{item.count}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold tracking-normal">Audit log</h2>
            <div className="mt-4 divide-y divide-slate-100">
              {auditLogs.length ? (
                auditLogs.map((log) => (
                  <div key={log.id} className="py-3 text-sm">
                    <p className="font-medium text-ink">{log.action}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDate(log.createdAt)}</p>
                  </div>
                ))
              ) : (
                <p className="py-4 text-sm text-slate-500">Pakeitimų istorijos dar nėra.</p>
              )}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <Icon aria-hidden className="h-5 w-5 text-brand-700" />
      <p className="mt-3 text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{formatNumber(value)}</p>
    </div>
  );
}
