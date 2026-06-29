"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { leadStatusSchema } from "@/lib/validation";

export async function updateLeadStatusAction(formData: FormData) {
  const user = await requireAdmin();
  const id = String(formData.get("id") || "");
  const parsedStatus = leadStatusSchema.safeParse(formData.get("status"));

  if (!id || !parsedStatus.success) {
    redirect("/admin/leads");
  }

  const existing = await prisma.lead.findUnique({ where: { id } });

  if (!existing) {
    redirect("/admin/leads");
  }

  await prisma.$transaction([
    prisma.lead.update({
      where: { id },
      data: { status: parsedStatus.data }
    }),
    prisma.auditLog.create({
      data: {
        userId: user.id,
        entityType: "Lead",
        entityId: id,
        action: "SET_LEAD_STATUS",
        oldValue: { status: existing.status },
        newValue: { status: parsedStatus.data }
      }
    })
  ]);

  redirect("/admin/leads");
}
