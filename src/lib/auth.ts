import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSessionSecret } from "@/lib/env";

const SESSION_COOKIE = "skenis_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

export type AdminSession = {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN";
};

function getSecretKey() {
  return new TextEncoder().encode(getSessionSecret());
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function createSession(user: AdminSession) {
  const token = await new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS
  });
}

export function clearSession() {
  cookies().delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<AdminSession | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.role !== "ADMIN" || !payload.sub || !payload.email) return null;

    return {
      id: payload.sub,
      email: String(payload.email),
      name: payload.name ? String(payload.name) : null,
      role: "ADMIN"
    };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getCurrentUser();

  if (!session) {
    redirect("/admin/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, email: true, name: true, role: true }
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: "ADMIN" as const
  };
}
