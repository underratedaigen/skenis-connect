import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function LinkQrPreviewPage({
  params
}: {
  params: { token: string };
}) {
  const link = await prisma.redirectLink.findUnique({
    where: { token: params.token },
    select: {
      token: true,
      shortUrl: true,
      companyName: true
    }
  });

  if (!link) {
    notFound();
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-normal text-ink">QR peržiūra</h1>
          <p className="mt-2 text-sm text-slate-600">
            {link.companyName || link.token} · {link.shortUrl}
          </p>
        </div>
        <Link href={`/admin/links/${link.token}`} className="admin-button-secondary">
          Grįžti į nuorodą
        </Link>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <Image
          src={`/api/qr/${link.token}`}
          alt={`QR kodas ${link.token}`}
          width={900}
          height={900}
          className="mx-auto h-auto w-full max-w-md"
        />
        <p className="mt-6 break-all font-mono text-sm text-slate-700">{link.shortUrl}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <a href={`/api/qr/${link.token}`} className="admin-button">
            Atsisiųsti PNG
          </a>
          <a href={link.shortUrl} target="_blank" rel="noreferrer" className="admin-button-secondary">
            Atidaryti short URL
          </a>
        </div>
      </section>
    </div>
  );
}
