"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getPublicBaseUrl } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { generateSecureToken, sanitizeTokenPrefix } from "@/lib/tokens";
import { batchCreateSchema } from "@/lib/validation";

async function generateUniqueTokens(quantity: number, prefix?: string | null) {
  const safePrefix = sanitizeTokenPrefix(prefix);
  const tokens = new Set<string>();

  while (tokens.size < quantity) {
    tokens.add(generateSecureToken(10, safePrefix));
  }

  let existing = await prisma.redirectLink.findMany({
    where: { token: { in: [...tokens] } },
    select: { token: true }
  });

  while (existing.length > 0) {
    for (const item of existing) {
      tokens.delete(item.token);
    }

    while (tokens.size < quantity) {
      tokens.add(generateSecureToken(10, safePrefix));
    }

    existing = await prisma.redirectLink.findMany({
      where: { token: { in: [...tokens] } },
      select: { token: true }
    });
  }

  return [...tokens];
}

function blankToNull(value: string | undefined) {
  return value && value.trim().length > 0 ? value.trim() : null;
}

export async function createBatchAction(formData: FormData) {
  const user = await requireAdmin();
  const parsed = batchCreateSchema.safeParse({
    name: formData.get("name"),
    quantity: formData.get("quantity"),
    productType: formData.get("productType"),
    tokenPrefix: formData.get("tokenPrefix"),
    note: formData.get("note"),
    manufacturerNote: formData.get("manufacturerNote")
  });

  if (!parsed.success) {
    redirect("/admin/batches/new?error=1");
  }

  const data = parsed.data;
  const tokens = await generateUniqueTokens(data.quantity, data.tokenPrefix);
  const baseUrl = getPublicBaseUrl();

  try {
    const batch = await prisma.qrBatch.create({
      data: {
        name: data.name,
        productType: data.productType,
        quantity: data.quantity,
        tokenPrefix: blankToNull(data.tokenPrefix),
        note: blankToNull(data.note),
        manufacturerNote: blankToNull(data.manufacturerNote),
        links: {
          create: tokens.map((token) => ({
            token,
            shortUrl: `${baseUrl}/r/${token}`,
            productType: data.productType,
            status: "UNASSIGNED",
            notes: blankToNull(data.note)
          }))
        }
      },
      select: { id: true }
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        entityType: "QrBatch",
        entityId: batch.id,
        action: "CREATE_BATCH",
        newValue: {
          name: data.name,
          quantity: data.quantity,
          productType: data.productType
        }
      }
    });

    redirect(`/admin/batches/${batch.id}?created=1`);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirect("/admin/batches/new?error=collision");
    }

    throw error;
  }
}
