import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { mapLead } from "@/lib/supabase-mappers";
import { getAdminContext, writeAudit } from "@/lib/supabase-common";
import { leadStatusSchema } from "@/lib/validation";

const authSchema = z.object({
  accessToken: z.string().min(1)
});

export const listLeads = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    authSchema
      .extend({
        company: z.string().optional(),
        status: leadStatusSchema.optional()
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    const { getSupabaseServerClient } = await import("@/integrations/supabase/client.server");
    const supabase = getSupabaseServerClient();
    await getAdminContext(supabase, data.accessToken);
    let query = supabase
      .from("leads")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(100);

    if (data.company) query = query.ilike("company_name", `%${data.company}%`);
    if (data.status) query = query.eq("status", data.status);

    const { data: rows, count, error } = await query;

    if (error) throw new Error(error.message);

    return {
      leads: (rows || []).map(mapLead),
      total: count || 0
    };
  });

export const updateLeadStatus = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    authSchema
      .extend({
        id: z.string().uuid(),
        status: leadStatusSchema
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    const { getSupabaseServerClient } = await import("@/integrations/supabase/client.server");
    const supabase = getSupabaseServerClient();
    const { user } = await getAdminContext(supabase, data.accessToken);
    const { data: existing, error: existingError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", data.id)
      .single();

    if (existingError) throw new Error(existingError.message);

    const { error } = await supabase
      .from("leads")
      .update({ status: data.status })
      .eq("id", data.id);

    if (error) throw new Error(error.message);

    await writeAudit(supabase, user, {
      entityType: "Lead",
      entityId: data.id,
      action: "SET_LEAD_STATUS",
      oldValue: { status: existing.status },
      newValue: { status: data.status }
    });

    return { ok: true };
  });
