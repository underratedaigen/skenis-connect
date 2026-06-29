import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FileSpreadsheet, PackageCheck, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { downloadBase64File, getAdminAccessToken } from "@/lib/client-auth";
import {
  exportBatchQrZip,
  exportBatchXlsx,
  getBatchDetail
} from "@/lib/admin/batches.functions";
import { productTypeLabels, redirectStatusLabels } from "@/lib/labels";
import { formatDate, formatNumber } from "@/lib/utils";
import type { QrBatch, RedirectLink } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/admin/batches/$id")({
  validateSearch: (search: Record<string, unknown>) => ({
    created: typeof search.created === "string" ? search.created : undefined
  }),
  head: () => ({
    meta: [{ title: "QR partija | Skenis.lt" }]
  }),
  component: BatchDetailPage
});

function BatchDetailPage() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const [batch, setBatch] = useState<QrBatch | null>(null);
  const [links, setLinks] = useState<RedirectLink[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    getAdminAccessToken()
      .then((accessToken) => getBatchDetail({ data: { accessToken, batchId: id } }))
      .then((detail) => {
        setBatch(detail.batch);
        setLinks(detail.links);
      })
      .catch((caught) =>
        setError(caught instanceof Error ? caught.message : "Nepavyko įkelti partijos.")
      );
  }, [id]);

  async function downloadXlsx() {
    setDownloading(true);
    const accessToken = await getAdminAccessToken();
    const file = await exportBatchXlsx({ data: { accessToken, batchId: id } });
    downloadBase64File(
      file.base64,
      file.fileName,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    setDownloading(false);
  }

  async function downloadZip() {
    setDownloading(true);
    const accessToken = await getAdminAccessToken();
    const file = await exportBatchQrZip({ data: { accessToken, batchId: id } });
    downloadBase64File(file.base64, file.fileName, "application/zip");
    setDownloading(false);
  }

  if (error) return <p className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</p>;
  if (!batch) return <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">Įkeliama...</p>;

  const statusCounts = links.reduce<Record<string, number>>((acc, link) => {
    acc[link.status] = (acc[link.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid gap-8">
      {search.created ? (
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
          <Link
            to="/admin/links"
            search={{ token: "", company: "", batch: batch.id, status: undefined }}
            className="admin-button-secondary"
          >
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
            {Object.entries(statusCounts).map(([status, count]) => (
              <p key={status}>
                {redirectStatusLabels[status as keyof typeof redirectStatusLabels]}:{" "}
                <strong>{formatNumber(count)}</strong>
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
              {links.slice(0, 60).map((link) => (
                <tr key={link.id}>
                  <td className="font-mono text-xs">{link.token}</td>
                  <td>
                    <Link
                      to="/admin/links/$token"
                      params={{ token: link.token }}
                      search={{}}
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
