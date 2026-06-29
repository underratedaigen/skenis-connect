import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { buildQrZip } from "@/lib/zip-export";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await requireAdmin();

  const batch = await prisma.qrBatch.findUnique({
    where: { id: params.id },
    include: {
      links: {
        orderBy: { createdAt: "asc" },
        select: { token: true, shortUrl: true }
      }
    }
  });

  if (!batch) {
    return NextResponse.json({ message: "Partija nerasta." }, { status: 404 });
  }

  const zipBuffer = await buildQrZip(batch.links);
  const safeName = batch.name.replace(/[^A-Za-z0-9_-]+/g, "_").slice(0, 80);

  return new NextResponse(zipBuffer as BodyInit, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="skenis_qr_${safeName || batch.id}.zip"`
    }
  });
}
