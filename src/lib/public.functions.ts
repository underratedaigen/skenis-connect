import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getDeviceType, hashIp } from "@/lib/analytics";
import { getRedirectOutcome } from "@/lib/redirect-policy";
import { mapLink } from "@/lib/supabase-mappers";
import { checkRateLimit } from "@/lib/rate-limit";
import { isValidToken } from "@/lib/tokens";

export const resolveRedirect = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        token: z.string(),
        userAgent: z.string().optional().nullable(),
        ip: z.string().optional().nullable(),
        referrer: z.string().optional().nullable()
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    if (!isValidToken(data.token)) {
      return { type: "missing" as const };
    }

    const ipHashSecret = process.env.IP_HASH_SECRET || "skenis-privacy-salt";
    const rateKey = `${data.token}:${hashIp(data.ip, ipHashSecret) || "unknown"}`;

    if (!checkRateLimit(rateKey, 120, 60_000)) {
      return { type: "rate_limited" as const };
    }

    const { getSupabaseServerClient } = await import("@/integrations/supabase/client.server");
    const supabase = getSupabaseServerClient();
    const { data: row, error } = await supabase
      .from("redirect_links")
      .select("*")
      .eq("token", data.token)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!row) return { type: "missing" as const };

    const link = mapLink(row);
    const now = new Date().toISOString();

    await supabase.from("scan_events").insert({
      redirect_link_id: link.id,
      user_agent: data.userAgent?.slice(0, 1000) || null,
      ip_hash: hashIp(data.ip, ipHashSecret),
      referrer: data.referrer?.slice(0, 1000) || null,
      device_type: getDeviceType(data.userAgent)
    });

    await supabase.rpc("increment_redirect_scan", {
      _redirect_link_id: link.id,
      _last_scanned_at: now
    });

    const outcome = getRedirectOutcome(link);

    return outcome;
  });
