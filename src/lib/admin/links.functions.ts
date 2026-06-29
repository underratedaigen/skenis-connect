import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { mapAudit, mapLink, mapScan } from "@/lib/supabase-mappers";
import { blankToNull, countRows, getAdminContext, writeAudit } from "@/lib/supabase-common";
import { redirectLinkUpdateBaseSchema, redirectStatusSchema } from "@/lib/validation";
import { redirectStatuses } from "@/lib/types";

const authSchema = z.object({
  accessToken: z.string().min(1)
});

export const listLinks = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    authSchema
      .extend({
        token: z.string().optional(),
        company: z.string().optional(),
        batch: z.string().optional(),
        status: z.enum(redirectStatuses).optional()
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    const { getSupabaseServerClient } = await import("@/integrations/supabase/client.server");
    const supabase = getSupabaseServerClient();
    await getAdminContext(supabase, data.accessToken);
    let query = supabase
      .from("redirect_links")
      .select("*, qr_batches(id, name)", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(100);

    if (data.token) query = query.ilike("token", `%${data.token}%`);
    if (data.company) query = query.ilike("company_name", `%${data.company}%`);
    if (data.batch) query = query.eq("batch_id", data.batch);
    if (data.status) query = query.eq("status", data.status);

    const { data: rows, count, error } = await query;

    if (error) throw new Error(error.message);

    return {
      links: (rows || []).map(mapLink),
      total: count || 0
    };
  });

export const getLinkDetail = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    authSchema.extend({ token: z.string().min(1) }).parse(data)
  )
  .handler(async ({ data }) => {
    const { getSupabaseServerClient } = await import("@/integrations/supabase/client.server");
    const supabase = getSupabaseServerClient();
    await getAdminContext(supabase, data.accessToken);
    const { data: row, error } = await supabase
      .from("redirect_links")
      .select("*, qr_batches(id, name)")
      .eq("token", data.token)
      .single();

    if (error) throw new Error(error.message);

    const link = mapLink(row);
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const seven = new Date(now);
    seven.setDate(seven.getDate() - 7);
    const thirty = new Date(now);
    thirty.setDate(thirty.getDate() - 30);

    const [todayScans, sevenDayScans, thirtyDayScans, scansResult, auditResult] =
      await Promise.all([
        countRows(supabase, "scan_events", (query) =>
          query.eq("redirect_link_id", link.id).gte("created_at", today.toISOString())
        ),
        countRows(supabase, "scan_events", (query) =>
          query.eq("redirect_link_id", link.id).gte("created_at", seven.toISOString())
        ),
        countRows(supabase, "scan_events", (query) =>
          query.eq("redirect_link_id", link.id).gte("created_at", thirty.toISOString())
        ),
        supabase
          .from("scan_events")
          .select("*")
          .eq("redirect_link_id", link.id)
          .gte("created_at", seven.toISOString())
          .order("created_at", { ascending: true }),
        supabase
          .from("audit_logs")
          .select("*")
          .eq("entity_type", "RedirectLink")
          .eq("entity_id", link.id)
          .order("created_at", { ascending: false })
          .limit(8)
      ]);

    if (scansResult.error) throw new Error(scansResult.error.message);
    if (auditResult.error) throw new Error(auditResult.error.message);

    return {
      link,
      todayScans,
      sevenDayScans,
      thirtyDayScans,
      scans: (scansResult.data || []).map(mapScan),
      auditLogs: (auditResult.data || []).map(mapAudit)
    };
  });

export const updateRedirectLink = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    redirectLinkUpdateBaseSchema
      .extend({
        accessToken: z.string().min(1),
        token: z.string().min(1)
      })
      .refine((value) => value.status !== "ACTIVE" || Boolean(value.destinationUrl), {
        path: ["destinationUrl"],
        message: "Aktyviam QR kodui būtina Google atsiliepimų nuoroda."
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    const { getSupabaseServerClient } = await import("@/integrations/supabase/client.server");
    const supabase = getSupabaseServerClient();
    const { user } = await getAdminContext(supabase, data.accessToken);
    const { data: existing, error: existingError } = await supabase
      .from("redirect_links")
      .select("*")
      .eq("token", data.token)
      .single();

    if (existingError) throw new Error(existingError.message);

    const nextValue = {
      company_name: blankToNull(data.companyName),
      contact_name: blankToNull(data.contactName),
      contact_email: blankToNull(data.contactEmail),
      contact_phone: blankToNull(data.contactPhone),
      destination_url: blankToNull(data.destinationUrl),
      notes: blankToNull(data.notes),
      status: data.status
    };

    const { error } = await supabase
      .from("redirect_links")
      .update(nextValue)
      .eq("token", data.token);

    if (error) throw new Error(error.message);

    await writeAudit(supabase, user, {
      entityType: "RedirectLink",
      entityId: existing.id,
      action: "UPDATE_REDIRECT_LINK",
      oldValue: existing,
      newValue: nextValue
    });

    return { ok: true };
  });

export const setRedirectLinkStatus = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        accessToken: z.string().min(1),
        token: z.string().min(1),
        status: redirectStatusSchema
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    const { getSupabaseServerClient } = await import("@/integrations/supabase/client.server");
    const supabase = getSupabaseServerClient();
    const { user } = await getAdminContext(supabase, data.accessToken);
    const { data: existing, error: existingError } = await supabase
      .from("redirect_links")
      .select("*")
      .eq("token", data.token)
      .single();

    if (existingError) throw new Error(existingError.message);

    if (data.status === "ACTIVE" && !existing.destination_url) {
      throw new Error("Aktyviam QR kodui būtina Google nuoroda.");
    }

    const { error } = await supabase
      .from("redirect_links")
      .update({ status: data.status })
      .eq("token", data.token);

    if (error) throw new Error(error.message);

    await writeAudit(supabase, user, {
      entityType: "RedirectLink",
      entityId: existing.id,
      action: "SET_REDIRECT_STATUS",
      oldValue: { status: existing.status },
      newValue: { status: data.status }
    });

    return { ok: true };
  });
