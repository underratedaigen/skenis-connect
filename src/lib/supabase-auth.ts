import { createMiddleware } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AdminSession } from "@/lib/types";

export const requireSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    return next();
  }
);

export async function requireAdminByToken(
  supabase: SupabaseClient,
  accessToken: string | null | undefined
): Promise<AdminSession> {
  if (!accessToken) {
    throw new Error("Prisijunkite prie admin paskyros.");
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);

  if (userError || !userData.user) {
    throw new Error("Sesija nebegalioja. Prisijunkite iš naujo.");
  }

  const { data: roleAllowed, error: roleError } = await supabase.rpc("has_role", {
    _user_id: userData.user.id,
    _role: "admin"
  });

  if (roleError || roleAllowed !== true) {
    throw new Error("Neturite admin teisių.");
  }

  return {
    id: userData.user.id,
    email: userData.user.email || "",
    name: userData.user.user_metadata?.name || null
  };
}
