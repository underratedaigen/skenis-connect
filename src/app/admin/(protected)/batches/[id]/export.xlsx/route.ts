import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { buildBatchWorkbook } from "@/lib/xlsx-export";
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
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!batch) {
    return NextResponse.json({ message: "Partija nerasta." }, { status: 404 });
  }

  const workbook = await buildBatchWorkbook(batch);
  const buffer = await workbook.xlsx.writeBuffer();
  const safeName = batch.name.replace(/[^A-Za-z0-9_-]+/g, "_").slice(0, 80);

  return new NextResponse(buffer as BodyInit, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="skenis_${safeName || batch.id}.xlsx"`
    }
  });
}
