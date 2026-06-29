import type { SupabaseClient } from "@supabase/supabase-js";
import type { AdminSession } from "@/lib/types";
import { requireAdminByToken } from "@/lib/supabase-auth";

export function blankToNull(value: string | null | undefined) {
  return value && value.trim().length > 0 ? value.trim() : null;
}

export async function getAdminContext(supabase: SupabaseClient, accessToken: string) {
  const user = await requireAdminByToken(supabase, accessToken);

  return { supabase, user };
}

export async function writeAudit(
  supabase: SupabaseClient,
  user: AdminSession,
  input: {
    entityType: string;
    entityId: string;
    action: string;
    oldValue?: unknown;
    newValue?: unknown;
  }
) {
  await supabase.from("audit_logs").insert({
    user_id: user.id,
    entity_type: input.entityType,
    entity_id: input.entityId,
    action: input.action,
    old_value: input.oldValue ?? null,
    new_value: input.newValue ?? null
  });
}

export function requireSupabaseOk<T>(result: { data: T; error: any }) {
  if (result.error) {
    throw new Error(result.error.message || "Supabase request failed.");
  }

  return result.data;
}

export async function countRows(
  supabase: SupabaseClient,
  table: string,
  configure?: (query: any) => any
) {
  let query = supabase.from(table).select("id", {
    count: "exact",
    head: true
  });

  if (configure) {
    query = configure(query);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return count || 0;
}
