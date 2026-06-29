import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/links/$token/qr")({
  head: () => ({
    meta: [{ title: "QR peržiūra | Skenis.lt" }]
  }),
  component: LinkQrPreviewPage
});

function LinkQrPreviewPage() {
  const { token } = Route.useParams();
  const origin = typeof window !== "undefined" ? window.location.origin : "https://skenis.lt";
  const shortUrl = `${origin}/r/${token}`;

  return (
    <div className="mx-auto grid max-w-3xl gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-ink">QR peržiūra</h1>
          <p className="mt-2 text-sm text-slate-600">{shortUrl}</p>
        </div>
        <Link to="/admin/links/$token" params={{ token }} search={{}} className="admin-button-secondary">
          Grįžti į nuorodą
        </Link>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <img
          src={`/api/public/qr/${token}`}
          alt={`QR kodas ${token}`}
          className="mx-auto h-auto w-full max-w-md"
        />
        <p className="mt-6 break-all font-mono text-sm text-slate-700">{shortUrl}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <a href={`/api/public/qr/${token}`} className="admin-button">
            Atsisiųsti SVG
          </a>
          <a href={shortUrl} target="_blank" rel="noreferrer" className="admin-button-secondary">
            Atidaryti short URL
          </a>
        </div>
      </section>
    </div>
  );
}
