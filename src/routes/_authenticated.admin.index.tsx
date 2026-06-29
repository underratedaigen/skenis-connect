import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Ban, CheckCircle2, Clock, Link2, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/admin/stat-card";
import { getAdminAccessToken } from "@/lib/client-auth";
import { getDashboard } from "@/lib/admin/dashboard.functions";
import { formatDate, formatNumber } from "@/lib/utils";
import type { Lead, ScanEvent } from "@/lib/types";

type DashboardData = {
  totalLinks: number;
  activeLinks: number;
  unassignedLinks: number;
  disabledLinks: number;
  totalScans: number;
  recentScans: ScanEvent[];
  recentLeads: Lead[];
};

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [{ title: "Admin apžvalga | Skenis.lt" }]
  }),
  component: AdminDashboardPage
});

function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminAccessToken()
      .then((accessToken) => getDashboard({ data: { accessToken } }))
      .then(setData)
      .catch((caught) =>
        setError(caught instanceof Error ? caught.message : "Nepavyko įkelti apžvalgos.")
      );
  }, []);

  if (error) return <AdminError message={error} />;
  if (!data) return <AdminLoading />;

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
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold tracking-normal">Naujausi skenavimai</h2>
            <Link
              to="/admin/links"
              search={{ token: "", company: "", batch: "", status: undefined }}
              className="text-sm font-semibold text-brand-700"
            >
              Visos nuorodos
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {data.recentScans.length ? (
              data.recentScans.map((scan) => (
                <div key={scan.id} className="flex items-start justify-between gap-4 px-5 py-4">
                  <div>
                    <Link
                      to="/admin/links/$token"
                      params={{ token: scan.redirectLink?.token || "" }}
                      search={{ token: "", company: "", batch: "", status: undefined }}
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
              <p className="px-5 py-8 text-sm text-slate-500">Skenavimų dar nėra.</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold tracking-normal">Naujausios užklausos</h2>
            <Link
              to="/admin/leads"
              search={{ company: "", status: undefined }}
              className="text-sm font-semibold text-brand-700"
            >
              Visos užklausos
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {data.recentLeads.length ? (
              data.recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-start justify-between gap-4 px-5 py-4">
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
              <p className="px-5 py-8 text-sm text-slate-500">Užklausų dar nėra.</p>
            )}
          </div>
        </div>
      </section>

      <div className="rounded-lg border border-brand-100 bg-brand-50 p-5 text-sm leading-6 text-brand-700">
        <div className="flex gap-3">
          <Link2 aria-hidden className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Kiekvienas fizinis QR kodas turi nuolatinę Skenis trumpą nuorodą.
            Gamybai siunčiamas tik <strong>skenis.lt/r/token</strong>, o galutinis
            Google nukreipimas gali būti pakeistas bet kada.
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminLoading() {
  return <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">Įkeliama...</p>;
}

function AdminError({ message }: { message: string }) {
  return <p className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">{message}</p>;
}
