import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { getDeviceType, hashIp } from "@/lib/analytics";
import { getRedirectOutcome } from "@/lib/redirect-policy";
import { mapBatch, mapLead, mapLink, mapScan } from "@/lib/supabase-mappers";
import { generateSecureToken, isValidToken, sanitizeTokenPrefix } from "@/lib/tokens";
import type {
  AdminSession,
  LeadStatus,
  ProductType,
  QrBatch,
  Lead,
  RedirectLink,
  RedirectStatus,
  ScanEvent
} from "@/lib/types";
import { batchCreateSchema, redirectLinkUpdateSchema } from "@/lib/validation";

export type DashboardData = {
  totalLinks: number;
  activeLinks: number;
  unassignedLinks: number;
  disabledLinks: number;
  totalScans: number;
  recentScans: ScanEvent[];
  recentLeads: Lead[];
};

export type LinkDetail = {
  link: RedirectLink;
  scans: ScanEvent[];
  totalScans: number;
  scansToday: number;
  scans7Days: number;
  scans30Days: number;
  lastScanAt: string | null;
};

type PublicRedirectRow = {
  id: string;
  token: string;
  status: RedirectStatus;
  destination_url: string | null;
};

function blankToNull(value: string | null | undefined) {
  return value?.trim() ? value.trim() : null;
}

function requireSupabaseConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase aplinkos kintamieji dar nesukonfigūruoti.");
  }
}

export function getAppBaseUrl() {
  const configured = import.meta.env.VITE_PUBLIC_APP_URL;

  if (configured) return configured.replace(/\/+$/, "");
  if (typeof window !== "undefined") return window.location.origin.replace(/\/+$/, "");

  return "https://skenis.lt";
}

export async function getCurrentAdmin(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return null;

  const { data: roles, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id)
    .eq("role", "admin");

  if (roleError || !roles?.length) return null;

  return {
    id: data.user.id,
    email: data.user.email || "",
    name: data.user.user_metadata?.name || null
  };
}

async function writeAudit(
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  oldValue: unknown,
  newValue: unknown
) {
  await supabase.from("audit_logs").insert({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    old_value: oldValue ?? null,
    new_value: newValue ?? null
  });
}

async function generateUniqueTokens(quantity: number, prefix?: string | null) {
  const safePrefix = sanitizeTokenPrefix(prefix);
  const tokens = new Set<string>();

  while (tokens.size < quantity) {
    tokens.add(generateSecureToken(10, safePrefix));
  }

  let { data, error } = await supabase
    .from("redirect_links")
    .select("token")
    .in("token", [...tokens]);

  if (error) throw new Error(error.message);

  while ((data || []).length > 0) {
    for (const item of data || []) {
      tokens.delete(item.token);
    }

    while (tokens.size < quantity) {
      tokens.add(generateSecureToken(10, safePrefix));
    }

    const next = await supabase
      .from("redirect_links")
      .select("token")
      .in("token", [...tokens]);

    if (next.error) throw new Error(next.error.message);
    data = next.data;
  }

  return [...tokens];
}

export async function createBatch(formData: Record<string, FormDataEntryValue>) {
  requireSupabaseConfigured();
  const parsed = batchCreateSchema.parse(formData);
  const admin = await getCurrentAdmin();

  if (!admin) throw new Error("Admin sesija nerasta.");

  const tokens = await generateUniqueTokens(parsed.quantity, parsed.tokenPrefix);
  const baseUrl = getAppBaseUrl();

  const { data: batch, error: batchError } = await supabase
    .from("qr_batches")
    .insert({
      name: parsed.name,
      product_type: parsed.productType,
      quantity: parsed.quantity,
      token_prefix: blankToNull(parsed.tokenPrefix),
      note: blankToNull(parsed.note),
      manufacturer_note: blankToNull(parsed.manufacturerNote)
    })
    .select("*")
    .single();

  if (batchError) throw new Error(batchError.message);

  const { error: linksError } = await supabase.from("redirect_links").insert(
    tokens.map((token) => ({
      token,
      batch_id: batch.id,
      short_url: `${baseUrl}/r/${token}`,
      status: "UNASSIGNED" as RedirectStatus,
      product_type: parsed.productType,
      notes: blankToNull(parsed.note)
    }))
  );

  if (linksError) throw new Error(linksError.message);

  await writeAudit(admin.id, "CREATE_BATCH", "QrBatch", batch.id, null, {
    name: parsed.name,
    quantity: parsed.quantity,
    productType: parsed.productType
  });

  return mapBatch(batch);
}

export async function listBatches() {
  requireSupabaseConfigured();
  const { data, error } = await supabase
    .from("qr_batches")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);
  return (data || []).map(mapBatch);
}

export async function getBatchDetail(batchId: string) {
  requireSupabaseConfigured();
  const [{ data: batch, error: batchError }, { data: links, error: linksError }] =
    await Promise.all([
      supabase.from("qr_batches").select("*").eq("id", batchId).single(),
      supabase
        .from("redirect_links")
        .select("*")
        .eq("batch_id", batchId)
        .order("created_at", { ascending: true })
    ]);

  if (batchError) throw new Error(batchError.message);
  if (linksError) throw new Error(linksError.message);

  return {
    batch: mapBatch(batch),
    links: (links || []).map(mapLink)
  };
}

export async function getDashboard(): Promise<DashboardData> {
  requireSupabaseConfigured();
  const [
    totalLinks,
    activeLinks,
    unassignedLinks,
    disabledLinks,
    totalScans,
    recentScans,
    recentLeads
  ] = await Promise.all([
    supabase.from("redirect_links").select("id", { count: "exact", head: true }),
    supabase
      .from("redirect_links")
      .select("id", { count: "exact", head: true })
      .eq("status", "ACTIVE"),
    supabase
      .from("redirect_links")
      .select("id", { count: "exact", head: true })
      .eq("status", "UNASSIGNED"),
    supabase
      .from("redirect_links")
      .select("id", { count: "exact", head: true })
      .eq("status", "DISABLED"),
    supabase.from("scan_events").select("id", { count: "exact", head: true }),
    supabase
      .from("scan_events")
      .select("*, redirect_links(token, company_name, short_url)")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(8)
  ]);

  for (const result of [
    totalLinks,
    activeLinks,
    unassignedLinks,
    disabledLinks,
    totalScans,
    recentScans,
    recentLeads
  ]) {
    if (result.error) throw new Error(result.error.message);
  }

  return {
    totalLinks: totalLinks.count || 0,
    activeLinks: activeLinks.count || 0,
    unassignedLinks: unassignedLinks.count || 0,
    disabledLinks: disabledLinks.count || 0,
    totalScans: totalScans.count || 0,
    recentScans: (recentScans.data || []).map(mapScan),
    recentLeads: (recentLeads.data || []).map(mapLead)
  };
}

export async function listLinks(filters: {
  token?: string;
  company?: string;
  batch?: string;
  status?: RedirectStatus | "";
}) {
  requireSupabaseConfigured();

  let query = supabase
    .from("redirect_links")
    .select("*, qr_batches(id, name)")
    .order("created_at", { ascending: false })
    .limit(300);

  if (filters.token) query = query.ilike("token", `%${filters.token}%`);
  if (filters.company) query = query.ilike("company_name", `%${filters.company}%`);
  if (filters.batch) query = query.eq("batch_id", filters.batch);
  if (filters.status) query = query.eq("status", filters.status);

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return (data || []).map(mapLink);
}

export async function getLinkDetail(token: string): Promise<LinkDetail> {
  requireSupabaseConfigured();
  const { data: linkRow, error: linkError } = await supabase
    .from("redirect_links")
    .select("*, qr_batches(id, name)")
    .eq("token", token)
    .single();

  if (linkError) throw new Error(linkError.message);

  const link = mapLink(linkRow);
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const sevenDays = new Date(now);
  sevenDays.setDate(sevenDays.getDate() - 7);
  const thirtyDays = new Date(now);
  thirtyDays.setDate(thirtyDays.getDate() - 30);

  const [scans, scansToday, scans7Days, scans30Days] = await Promise.all([
    supabase
      .from("scan_events")
      .select("*")
      .eq("redirect_link_id", link.id)
      .order("created_at", { ascending: false })
      .limit(80),
    supabase
      .from("scan_events")
      .select("id", { count: "exact", head: true })
      .eq("redirect_link_id", link.id)
      .gte("created_at", today.toISOString()),
    supabase
      .from("scan_events")
      .select("id", { count: "exact", head: true })
      .eq("redirect_link_id", link.id)
      .gte("created_at", sevenDays.toISOString()),
    supabase
      .from("scan_events")
      .select("id", { count: "exact", head: true })
      .eq("redirect_link_id", link.id)
      .gte("created_at", thirtyDays.toISOString())
  ]);

  for (const result of [scans, scansToday, scans7Days, scans30Days]) {
    if (result.error) throw new Error(result.error.message);
  }

  return {
    link,
    scans: (scans.data || []).map(mapScan),
    totalScans: link.scanCount,
    scansToday: scansToday.count || 0,
    scans7Days: scans7Days.count || 0,
    scans30Days: scans30Days.count || 0,
    lastScanAt: link.lastScannedAt
  };
}

export async function updateRedirectLink(token: string, formData: Record<string, FormDataEntryValue>) {
  requireSupabaseConfigured();
  const parsed = redirectLinkUpdateSchema.parse(formData);
  const admin = await getCurrentAdmin();

  if (!admin) throw new Error("Admin sesija nerasta.");

  const { data: oldRow, error: oldError } = await supabase
    .from("redirect_links")
    .select("*")
    .eq("token", token)
    .single();

  if (oldError) throw new Error(oldError.message);

  const payload = {
    company_name: blankToNull(parsed.companyName),
    contact_name: blankToNull(parsed.contactName),
    contact_email: blankToNull(parsed.contactEmail),
    contact_phone: blankToNull(parsed.contactPhone),
    destination_url: blankToNull(parsed.destinationUrl),
    notes: blankToNull(parsed.notes),
    status: parsed.status
  };

  const { data, error } = await supabase
    .from("redirect_links")
    .update(payload)
    .eq("token", token)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  await writeAudit(admin.id, "UPDATE_REDIRECT_LINK", "RedirectLink", data.id, oldRow, payload);

  return mapLink(data);
}

export async function setRedirectLinkStatus(token: string, status: RedirectStatus) {
  requireSupabaseConfigured();
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Admin sesija nerasta.");

  const { data: oldRow, error: oldError } = await supabase
    .from("redirect_links")
    .select("*")
    .eq("token", token)
    .single();

  if (oldError) throw new Error(oldError.message);

  const { data, error } = await supabase
    .from("redirect_links")
    .update({ status })
    .eq("token", token)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  await writeAudit(admin.id, "SET_REDIRECT_STATUS", "RedirectLink", data.id, oldRow, {
    status
  });

  return mapLink(data);
}

export async function listLeads() {
  requireSupabaseConfigured();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) throw new Error(error.message);
  return (data || []).map(mapLead);
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  requireSupabaseConfigured();
  const { data, error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapLead(data);
}

export async function resolveRedirectToken(token: string) {
  if (!isValidToken(token)) return { type: "missing" as const };
  requireSupabaseConfigured();

  const { data, error } = await supabase
    .rpc("get_redirect_link_public", { _token: token })
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return { type: "missing" as const };
  const link = data as PublicRedirectRow;

  const now = new Date().toISOString();

  await supabase.from("scan_events").insert({
    redirect_link_id: link.id,
    user_agent: navigator.userAgent.slice(0, 1000),
    ip_hash: hashIp(null),
    referrer: document.referrer.slice(0, 1000) || null,
    device_type: getDeviceType(navigator.userAgent)
  });

  await supabase.rpc("increment_redirect_scan", {
    _redirect_link_id: link.id,
    _last_scanned_at: now
  });

  return getRedirectOutcome({
    status: link.status,
    destinationUrl: link.destination_url
  });
}

export async function exportBatchXlsx(batch: QrBatch, links: RedirectLink[]) {
  const { buildBatchWorkbook } = await import("@/lib/xlsx-export");
  return buildBatchWorkbook({ ...batch, links }, getAppBaseUrl());
}

export async function exportBatchQrZip(links: RedirectLink[]) {
  const { buildQrZip } = await import("@/lib/zip-export");
  return buildQrZip(
    links.map((link) => ({
      token: link.token,
      shortUrl: link.shortUrl
    }))
  );
}

export function bytesToDownload(bytes: Uint8Array, fileName: string, mimeType: string) {
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export const productTypesForInput: ProductType[] = ["CARD", "STAND", "NFC_CARD", "OTHER"];
