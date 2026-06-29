import { Link } from "@tanstack/react-router";
import { Copy, ExternalLink, Pencil, QrCode } from "lucide-react";
import { useState } from "react";

export function LinkRowActions({
  token,
  shortUrl
}: {
  token: string;
  shortUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyUrl() {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={copyUrl}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:border-brand-500 hover:text-brand-700 focus-ring"
        title={copied ? "Nukopijuota" : "Kopijuoti short URL"}
      >
        <Copy aria-hidden className="h-4 w-4" />
      </button>
      <Link
        to="/admin/links/$token"
        params={{ token }}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:border-brand-500 hover:text-brand-700 focus-ring"
        title="Redaguoti"
      >
        <Pencil aria-hidden className="h-4 w-4" />
      </Link>
      <Link
        to="/admin/links/$token/qr"
        params={{ token }}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:border-brand-500 hover:text-brand-700 focus-ring"
        title="QR peržiūra"
      >
        <QrCode aria-hidden className="h-4 w-4" />
      </Link>
      <a
        href={shortUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:border-brand-500 hover:text-brand-700 focus-ring"
        title="Atidaryti short URL"
      >
        <ExternalLink aria-hidden className="h-4 w-4" />
      </a>
    </div>
  );
}
