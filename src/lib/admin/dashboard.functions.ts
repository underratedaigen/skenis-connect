import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { countRows, getAdminContext } from "@/lib/supabase-common";
import { mapLead, mapScan } from "@/lib/supabase-mappers";

const authSchema = z.object({
  accessToken: z.string().min(1)
});

export const getDashboard = createServerFn({ method: "POST" })
  .validator((data: unknown) => authSchema.parse(data))
  .handler(async ({ data }) => {
    const { getSupabaseServerClient } = await import("@/integrations/supabase/client.server");
    const supabase = getSupabaseServerClient();
    await getAdminContext(supabase, data.accessToken);

    const [
      totalLinks,
      activeLinks,
      unassignedLinks,
      disabledLinks,
      totalScans,
      recentScansResult,
      recentLeadsResult
    ] = await Promise.all([
      countRows(supabase, "redirect_links"),
      countRows(supabase, "redirect_links", (query) => query.eq("status", "ACTIVE")),
      countRows(supabase, "redirect_links", (query) => query.eq("status", "UNASSIGNED")),
      countRows(supabase, "redirect_links", (query) => query.eq("status", "DISABLED")),
      countRows(supabase, "scan_events"),
      supabase
        .from("scan_events")
        .select("*, redirect_links(token, company_name, short_url)")
        .order("created_at", { ascending: false })
        .limit(8),
      supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(8)
    ]);

    if (recentScansResult.error) throw new Error(recentScansResult.error.message);
    if (recentLeadsResult.error) throw new Error(recentLeadsResult.error.message);

    return {
      totalLinks,
      activeLinks,
      unassignedLinks,
      disabledLinks,
      totalScans,
      recentScans: (recentScansResult.data || []).map(mapScan),
      recentLeads: (recentLeadsResult.data || []).map(mapLead)
    };
  });
