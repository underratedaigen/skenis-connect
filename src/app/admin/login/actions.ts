"use server";

import { redirect } from "next/navigation";
import { createSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    redirect("/admin/login?error=1");
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() }
  });

  if (!user) {
    redirect("/admin/login?error=1");
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);

  if (!valid) {
    redirect("/admin/login?error=1");
  }

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: "ADMIN"
  });

  redirect("/admin");
}
