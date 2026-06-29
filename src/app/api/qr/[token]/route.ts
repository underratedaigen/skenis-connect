import { NextResponse } from "next/server";
import { createQrPngBuffer } from "@/lib/qr";
import { prisma } from "@/lib/prisma";
import { isValidToken } from "@/lib/tokens";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: { token: string } }
) {
  if (!isValidToken(params.token)) {
    return NextResponse.json({ message: "Token neteisingas." }, { status: 400 });
  }

  const link = await prisma.redirectLink.findUnique({
    where: { token: params.token },
    select: { shortUrl: true }
  });

  if (!link) {
    return NextResponse.json({ message: "QR kodas nerastas." }, { status: 404 });
  }

  const buffer = await createQrPngBuffer(link.shortUrl);

  return new NextResponse(buffer as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
