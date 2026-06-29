import { LeadStatus, Prisma } from "@prisma/client";
import { Search } from "lucide-react";
import { leadStatusLabels, productTypeLabels } from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import { formatDate, formatNumber, truncate } from "@/lib/utils";
import { updateLeadStatusAction } from "./actions";

export default async function LeadsPage({
  searchParams
}: {
  searchParams: {
    status?: LeadStatus;
    company?: string;
  };
}) {
  const where: Prisma.LeadWhereInput = {};

  if (
    searchParams.status &&
    Object.values(LeadStatus).includes(searchParams.status)
  ) {
    where.status = searchParams.status;
  }

  if (searchParams.company) {
    where.companyName = { contains: searchParams.company, mode: "insensitive" };
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100
    }),
    prisma.lead.count({ where })
  ]);

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-normal text-ink">Užklausos</h1>
        <p className="mt-2 text-sm text-slate-600">
          Viešo užsakymo formos įrašai ir gamybos būsena.
        </p>
      </div>

      <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_0.8fr_auto]">
          <label className="grid gap-2">
            <span className="admin-label">Įmonė</span>
            <input
              className="admin-input"
              name="company"
              defaultValue={searchParams.company || ""}
              placeholder="Įmonės pavadinimas"
            />
          </label>
          <label className="grid gap-2">
            <span className="admin-label">Statusas</span>
            <select className="admin-input" name="status" defaultValue={searchParams.status || ""}>
              <option value="">Visi</option>
              {Object.values(LeadStatus).map((status) => (
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
                    <form action={updateLeadStatusAction} className="flex min-w-52 gap-2">
                      <input type="hidden" name="id" value={lead.id} />
                      <select className="admin-input" name="status" defaultValue={lead.status}>
                        {Object.values(LeadStatus).map((status) => (
                          <option key={status} value={status}>
                            {leadStatusLabels[status]}
                          </option>
                        ))}
                      </select>
                      <button className="admin-button-secondary">OK</button>
                    </form>
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
