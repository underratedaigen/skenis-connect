import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadCreateSchema } from "@/lib/validation";

function blankToNull(value: string | undefined | null) {
  return value && value.trim().length > 0 ? value.trim() : null;
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = leadCreateSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message:
          parsed.error.issues[0]?.message ||
          "Patikrinkite formos laukus ir bandykite dar kartą."
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  await prisma.lead.create({
    data: {
      name: data.name,
      companyName: data.companyName,
      email: data.email,
      phone: blankToNull(data.phone),
      quantity: data.quantity,
      productType: data.productType,
      googleReviewUrl: blankToNull(data.googleReviewUrl),
      message: blankToNull(data.message)
    }
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
