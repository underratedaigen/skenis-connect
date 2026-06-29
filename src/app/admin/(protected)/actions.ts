"use server";

import { redirect } from "next/navigation";
import { clearSession, requireAdmin } from "@/lib/auth";

export async function logoutAction() {
  await requireAdmin();
  clearSession();
  redirect("/admin/login");
}
