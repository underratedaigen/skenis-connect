"use server";

import { RedirectStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirectLinkUpdateSchema, redirectStatusSchema } from "@/lib/validation";

function blankToNull(value: string | undefined | null) {
  return value && value.trim().length > 0 ? value.trim() : null;
}

export async function updateRedirectLinkAction(token: string, formData: FormData) {
  const user = await requireAdmin();
  const parsed = redirectLinkUpdateSchema.safeParse({
    companyName: formData.get("companyName"),
    contactName: formData.get("contactName"),
    contactEmail: formData.get("contactEmail"),
    contactPhone: formData.get("contactPhone"),
    destinationUrl: formData.get("destinationUrl"),
    notes: formData.get("notes"),
    status: formData.get("status")
  });

  if (!parsed.success) {
    redirect(`/admin/links/${token}?error=1`);
  }

  const existing = await prisma.redirectLink.findUnique({
    where: { token }
  });

  if (!existing) {
    redirect("/admin/links?error=missing");
  }

  const data = parsed.data;
  const nextValue = {
    companyName: blankToNull(data.companyName),
    contactName: blankToNull(data.contactName),
    contactEmail: blankToNull(data.contactEmail),
    contactPhone: blankToNull(data.contactPhone),
    destinationUrl: blankToNull(data.destinationUrl),
    notes: blankToNull(data.notes),
    status: data.status
  };

  await prisma.$transaction([
    prisma.redirectLink.update({
      where: { token },
      data: nextValue
    }),
    prisma.auditLog.create({
      data: {
        userId: user.id,
        entityType: "RedirectLink",
        entityId: existing.id,
        action: "UPDATE_REDIRECT_LINK",
        oldValue: {
          companyName: existing.companyName,
          contactName: existing.contactName,
          contactEmail: existing.contactEmail,
          contactPhone: existing.contactPhone,
          destinationUrl: existing.destinationUrl,
          notes: existing.notes,
          status: existing.status
        },
        newValue: nextValue
      }
    })
  ]);

  revalidatePath("/admin/links");
  revalidatePath(`/admin/links/${token}`);
  redirect(`/admin/links/${token}?saved=1`);
}

export async function setRedirectLinkStatusAction(formData: FormData) {
  const user = await requireAdmin();
  const token = String(formData.get("token") || "");
  const returnTo = String(formData.get("returnTo") || "/admin/links");
  const parsedStatus = redirectStatusSchema.safeParse(formData.get("status"));

  if (!token || !parsedStatus.success) {
    redirect(returnTo);
  }

  const existing = await prisma.redirectLink.findUnique({
    where: { token }
  });

  if (!existing) {
    redirect(returnTo);
  }

  const nextStatus = parsedStatus.data as RedirectStatus;

  if (nextStatus === "ACTIVE" && !existing.destinationUrl) {
    redirect(returnTo);
  }

  await prisma.$transaction([
    prisma.redirectLink.update({
      where: { token },
      data: { status: nextStatus }
    }),
    prisma.auditLog.create({
      data: {
        userId: user.id,
        entityType: "RedirectLink",
        entityId: existing.id,
        action: "SET_REDIRECT_STATUS",
        oldValue: { status: existing.status },
        newValue: { status: nextStatus }
      }
    })
  ]);

  revalidatePath("/admin/links");
  revalidatePath(`/admin/links/${token}`);
  redirect(returnTo);
}
