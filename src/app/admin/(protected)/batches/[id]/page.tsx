import Link from "next/link";
import { Download, FileSpreadsheet, PackageCheck, QrCode } from "lucide-react";
import { notFound } from "next/navigation";
import { productTypeLabels, redirectStatusLabels } from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function BatchDetailPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { created?: string };
}) {
  const batch = await prisma.qrBatch.findUnique({
    where: { id: params.id },
    include: {
      links: {
        orderBy: { createdAt: "asc" },
        take: 60
      }
    }
  });

  if (!batch) {
    notFound();
  }

  const statusCounts = await prisma.redirectLink.groupBy({
    by: ["status"],
    where: { batchId: batch.id },
    _count: true
  });

  return (
    <div className="grid gap-8">
      {searchParams.created ? (
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
          <a href={`/admin/batches/${batch.id}/export.xlsx`} className="admin-button">
            <FileSpreadsheet aria-hidden className="mr-2 h-4 w-4" />
            Download XLSX
          </a>
          <a href={`/admin/batches/${batch.id}/qr.zip`} className="admin-button-secondary">
            <Download aria-hidden className="mr-2 h-4 w-4" />
            QR PNG ZIP
          </a>
          <Link href={`/admin/links?batch=${batch.id}`} className="admin-button-secondary">
            <QrCode aria-hidden className="mr-2 h-4 w-4" />
            View generated links
          </Link>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Kiekis</p>
          <p className="mt-2 text-3xl font-bold">{formatNumber(batch.quantity)}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Produkto tipas</p>
          <p className="mt-2 text-lg font-bold">{productTypeLabels[batch.productType]}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Prefiksas</p>
          <p className="mt-2 text-lg font-bold">{batch.tokenPrefix || "—"}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Būsenos</p>
          <div className="mt-2 grid gap-1 text-sm">
            {statusCounts.map((item) => (
              <p key={item.status}>
                {redirectStatusLabels[item.status]}:{" "}
                <strong>{formatNumber(item._count)}</strong>
              </p>
            ))}
          </div>
        </div>
      </section>

      {batch.manufacturerNote ? (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold tracking-normal">Pastaba gamintojui</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">
            {batch.manufacturerNote}
          </p>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold tracking-normal">Sugeneruoti QR kodai</h2>
          <p className="mt-1 text-xs text-slate-500">Rodomi pirmi 60 įrašų.</p>
        </div>
        <div className="overflow-x-auto">
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
              {batch.links.map((link) => (
                <tr key={link.id}>
                  <td className="font-mono text-xs">{link.token}</td>
                  <td>
                    <Link
                      href={`/admin/links/${link.token}`}
                      className="font-medium text-brand-700 hover:text-brand-600"
                    >
                      {link.shortUrl}
                    </Link>
                  </td>
                  <td>{redirectStatusLabels[link.status]}</td>
                  <td>{formatDate(link.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
