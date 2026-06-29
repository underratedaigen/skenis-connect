import Link from "next/link";
import { Archive, Ban, RotateCcw, Search } from "lucide-react";
import { Prisma, RedirectStatus } from "@prisma/client";
import { LinkRowActions } from "@/components/admin/link-row-actions";
import { StatusBadge } from "@/components/admin/status-badge";
import { productTypeLabels, redirectStatusLabels } from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import { formatDate, formatNumber, truncate } from "@/lib/utils";
import { setRedirectLinkStatusAction } from "./actions";

export default async function LinksPage({
  searchParams
}: {
  searchParams: {
    token?: string;
    company?: string;
    batch?: string;
    status?: RedirectStatus;
    error?: string;
  };
}) {
  const where: Prisma.RedirectLinkWhereInput = {};

  if (searchParams.token) {
    where.token = { contains: searchParams.token, mode: "insensitive" };
  }

  if (searchParams.company) {
    where.companyName = { contains: searchParams.company, mode: "insensitive" };
  }

  if (searchParams.batch) {
    where.batchId = searchParams.batch;
  }

  if (
    searchParams.status &&
    Object.values(RedirectStatus).includes(searchParams.status)
  ) {
    where.status = searchParams.status;
  }

  const [links, total, batches] = await Promise.all([
    prisma.redirectLink.findMany({
      where,
      take: 100,
      orderBy: { createdAt: "desc" },
      include: {
        batch: {
          select: { id: true, name: true }
        }
      }
    }),
    prisma.redirectLink.count({ where }),
    prisma.qrBatch.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true }
    })
  ]);

  return (
    <div className="grid gap-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-ink">QR nuorodos</h1>
          <p className="mt-2 text-sm text-slate-600">
            Valdykite kiekvieno fizinio QR kodo galutinę Google nuorodą.
          </p>
        </div>
        <Link href="/admin/batches/new" className="admin-button">
          Generuoti naują partiją
        </Link>
      </div>

      {searchParams.error === "missing" ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          QR nuoroda nerasta.
        </p>
      ) : null}

      <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_0.7fr_auto]">
          <label className="grid gap-2">
            <span className="admin-label">Token</span>
            <input
              className="admin-input"
              name="token"
              defaultValue={searchParams.token || ""}
              placeholder="8fK29xQp"
            />
          </label>
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
            <span className="admin-label">Partija</span>
            <select className="admin-input" name="batch" defaultValue={searchParams.batch || ""}>
              <option value="">Visos partijos</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="admin-label">Statusas</span>
            <select className="admin-input" name="status" defaultValue={searchParams.status || ""}>
              <option value="">Visi</option>
              {Object.values(RedirectStatus).map((status) => (
                <option key={status} value={status}>
                  {redirectStatusLabels[status]}
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
          <h2 className="font-bold tracking-normal">Rasta įrašų: {formatNumber(total)}</h2>
          <p className="text-xs text-slate-500">Rodomi pirmi 100.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Short URL</th>
                <th>Status</th>
                <th>Įmonė</th>
                <th>Destination</th>
                <th>Produktas</th>
                <th>Partija</th>
                <th>Skenavimai</th>
                <th>Paskutinis</th>
                <th>Sukurta</th>
                <th>Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id}>
                  <td className="font-mono text-xs text-ink">{link.token}</td>
                  <td className="min-w-64">
                    <a
                      href={link.shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-brand-700 hover:text-brand-600"
                    >
                      {link.shortUrl}
                    </a>
                  </td>
                  <td>
                    <StatusBadge status={link.status} />
                  </td>
                  <td>{link.companyName || "—"}</td>
                  <td className="max-w-72">{truncate(link.destinationUrl, 58)}</td>
                  <td>{productTypeLabels[link.productType]}</td>
                  <td>
                    {link.batch ? (
                      <Link
                        href={`/admin/batches/${link.batch.id}`}
                        className="font-medium text-brand-700 hover:text-brand-600"
                      >
                        {link.batch.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{formatNumber(link.scanCount)}</td>
                  <td>{formatDate(link.lastScannedAt)}</td>
                  <td>{formatDate(link.createdAt)}</td>
                  <td>
                    <div className="flex flex-col gap-2">
                      <LinkRowActions token={link.token} shortUrl={link.shortUrl} />
                      <div className="flex gap-1.5">
                        {link.status === "DISABLED" ? (
                          <form action={setRedirectLinkStatusAction}>
                            <input type="hidden" name="token" value={link.token} />
                            <input
                              type="hidden"
                              name="status"
                              value={link.destinationUrl ? "ACTIVE" : "UNASSIGNED"}
                            />
                            <input type="hidden" name="returnTo" value="/admin/links" />
                            <button
                              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:border-brand-500 hover:text-brand-700 focus-ring"
                              title="Įjungti"
                            >
                              <RotateCcw aria-hidden className="h-4 w-4" />
                            </button>
                          </form>
                        ) : (
                          <form action={setRedirectLinkStatusAction}>
                            <input type="hidden" name="token" value={link.token} />
                            <input type="hidden" name="status" value="DISABLED" />
                            <input type="hidden" name="returnTo" value="/admin/links" />
                            <button
                              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:border-red-300 hover:text-red-700 focus-ring"
                              title="Išjungti"
                            >
                              <Ban aria-hidden className="h-4 w-4" />
                            </button>
                          </form>
                        )}
                        <form action={setRedirectLinkStatusAction}>
                          <input type="hidden" name="token" value={link.token} />
                          <input type="hidden" name="status" value="ARCHIVED" />
                          <input type="hidden" name="returnTo" value="/admin/links" />
                          <button
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:border-slate-500 hover:text-slate-900 focus-ring"
                            title="Archyvuoti"
                          >
                            <Archive aria-hidden className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {links.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-slate-500">
                    QR nuorodų pagal filtrus nerasta.
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
