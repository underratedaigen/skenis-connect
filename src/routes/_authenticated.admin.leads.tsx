import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import type React from "react";
import { getAdminAccessToken } from "@/lib/client-auth";
import { listLeads, updateLeadStatus } from "@/lib/admin/leads.functions";
import { leadStatusLabels, productTypeLabels } from "@/lib/labels";
import { formatDate, formatNumber, truncate } from "@/lib/utils";
import type { Lead, LeadStatus } from "@/lib/types";
import { leadStatuses } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  validateSearch: (search: Record<string, unknown>) => ({
    company: typeof search.company === "string" ? search.company : "",
    status:
      typeof search.status === "string" && leadStatuses.includes(search.status as LeadStatus)
        ? (search.status as LeadStatus)
        : undefined
  }),
  head: () => ({
    meta: [{ title: "Užklausos | Skenis.lt" }]
  }),
  component: LeadsPage
});

function LeadsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/admin/leads" });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const accessToken = await getAdminAccessToken();
    const result = await listLeads({ data: { accessToken, ...search } });
    setLeads(result.leads);
    setTotal(result.total);
  }

  useEffect(() => {
    load().catch((caught) =>
      setError(caught instanceof Error ? caught.message : "Nepavyko įkelti užklausų.")
    );
  }, [search.company, search.status]);

  async function changeStatus(id: string, status: LeadStatus) {
    const accessToken = await getAdminAccessToken();
    await updateLeadStatus({ data: { accessToken, id, status } });
    await load();
  }

  function onSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    navigate({
      search: {
        company: String(form.get("company") || ""),
        status: String(form.get("status") || "") || undefined
      }
    });
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-normal text-ink">Užklausos</h1>
        <p className="mt-2 text-sm text-slate-600">
          Viešo užsakymo formos įrašai ir gamybos būsena.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</p>
      ) : null}

      <form onSubmit={onSearch} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_0.8fr_auto]">
          <label className="grid gap-2">
            <span className="admin-label">Įmonė</span>
            <input className="admin-input" name="company" defaultValue={search.company} />
          </label>
          <label className="grid gap-2">
            <span className="admin-label">Statusas</span>
            <select className="admin-input" name="status" defaultValue={search.status || ""}>
              <option value="">Visi</option>
              {leadStatuses.map((status) => (
                <option key={status} value={status}>
                  {leadStatusLabels[status]}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button className="admin-button w-full">
              <Search aria-hidden className="mr-2 h-4 w-4" />
              Ieškoti
            </button>
          </div>
        </div>
      </form>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold tracking-normal">Rasta užklausų: {formatNumber(total)}</h2>
          <p className="text-xs text-slate-500">Rodomi pirmi 100.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Įmonė</th>
                <th>Kontaktas</th>
                <th>Kiekis</th>
                <th>Produktas</th>
                <th>Google URL</th>
                <th>Komentaras</th>
                <th>Statusas</th>
                <th>Sukurta</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <p className="font-semibold text-ink">{lead.companyName}</p>
                    <p className="mt-1 text-xs text-slate-500">{lead.name}</p>
                  </td>
                  <td>
                    <a className="font-medium text-brand-700" href={`mailto:${lead.email}`}>
                      {lead.email}
                    </a>
                    <p className="mt-1 text-xs text-slate-500">{lead.phone || "—"}</p>
                  </td>
                  <td>{formatNumber(lead.quantity)}</td>
                  <td>{productTypeLabels[lead.productType]}</td>
                  <td className="max-w-72">{truncate(lead.googleReviewUrl, 54)}</td>
                  <td className="max-w-72">{truncate(lead.message, 80)}</td>
                  <td>
                    <select
                      className="admin-input min-w-52"
                      value={lead.status}
                      onChange={(event) => changeStatus(lead.id, event.target.value as LeadStatus)}
                    >
                      {leadStatuses.map((status) => (
                        <option key={status} value={status}>
                          {leadStatusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{formatDate(lead.createdAt)}</td>
                </tr>
              ))}
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    Užklausų pagal filtrus nerasta.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
