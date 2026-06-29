import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildQrZip } from "@/lib/zip-export";
import { buildBatchWorkbook } from "@/lib/xlsx-export";
import { mapBatch, mapLink } from "@/lib/supabase-mappers";
import { blankToNull, getAdminContext, writeAudit } from "@/lib/supabase-common";
import { generateSecureToken, sanitizeTokenPrefix } from "@/lib/tokens";
import { batchCreateSchema } from "@/lib/validation";

const authSchema = z.object({
  accessToken: z.string().min(1)
});

const createBatchInputSchema = batchCreateSchema.extend({
  accessToken: z.string().min(1)
});

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

async function generateUniqueTokens(
  supabase: any,
  quantity: number,
  prefix?: string | null
) {
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

export const createBatch = createServerFn({ method: "POST" })
  .validator((data: unknown) => createBatchInputSchema.parse(data))
  .handler(async ({ data }) => {
    const { getSupabaseServerClient } = await import("@/integrations/supabase/client.server");
    const supabase = getSupabaseServerClient();
    const { user } = await getAdminContext(supabase, data.accessToken);
    const tokens = await generateUniqueTokens(supabase, data.quantity, data.tokenPrefix);
    const baseUrl = (
      process.env.VITE_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      "https://skenis.lt"
    ).replace(/\/+$/, "");

    const { data: batch, error: batchError } = await supabase
      .from("qr_batches")
      .insert({
        name: data.name,
        product_type: data.productType,
        quantity: data.quantity,
        token_prefix: blankToNull(data.tokenPrefix),
        note: blankToNull(data.note),
        manufacturer_note: blankToNull(data.manufacturerNote)
      })
      .select("*")
      .single();

    if (batchError) throw new Error(batchError.message);

    const { error: linksError } = await supabase.from("redirect_links").insert(
      tokens.map((token) => ({
        token,
        batch_id: batch.id,
        short_url: `${baseUrl}/r/${token}`,
        product_type: data.productType,
        status: "UNASSIGNED",
        notes: blankToNull(data.note)
      }))
    );

    if (linksError) throw new Error(linksError.message);

    await writeAudit(supabase, user, {
      entityType: "QrBatch",
      entityId: batch.id,
      action: "CREATE_BATCH",
      newValue: {
        name: data.name,
        quantity: data.quantity,
        productType: data.productType
      }
    });

    return { batchId: batch.id };
  });

export const listBatches = createServerFn({ method: "POST" })
  .validator((data: unknown) => authSchema.parse(data))
  .handler(async ({ data }) => {
    const { getSupabaseServerClient } = await import("@/integrations/supabase/client.server");
    const supabase = getSupabaseServerClient();
    await getAdminContext(supabase, data.accessToken);
    const { data: rows, error } = await supabase
      .from("qr_batches")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw new Error(error.message);

    return (rows || []).map(mapBatch);
  });

export const getBatchDetail = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    authSchema.extend({ batchId: z.string().uuid() }).parse(data)
  )
  .handler(async ({ data }) => {
    const { getSupabaseServerClient } = await import("@/integrations/supabase/client.server");
    const supabase = getSupabaseServerClient();
    await getAdminContext(supabase, data.accessToken);

    const [{ data: batch, error: batchError }, { data: links, error: linksError }] =
      await Promise.all([
        supabase.from("qr_batches").select("*").eq("id", data.batchId).single(),
        supabase
          .from("redirect_links")
          .select("*")
          .eq("batch_id", data.batchId)
          .order("created_at", { ascending: true })
      ]);

    if (batchError) throw new Error(batchError.message);
    if (linksError) throw new Error(linksError.message);

    return {
      batch: mapBatch(batch),
      links: (links || []).map(mapLink)
    };
  });

export const exportBatchXlsx = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    authSchema.extend({ batchId: z.string().uuid() }).parse(data)
  )
  .handler(async ({ data }) => {
    const detail = await getBatchDetail({ data });
    const baseUrl = (
      process.env.VITE_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      "https://skenis.lt"
    ).replace(/\/+$/, "");
    const bytes = await buildBatchWorkbook({
      ...detail.batch,
      links: detail.links
    }, baseUrl);

    return {
      fileName: `skenis_${detail.batch.name.replace(/[^A-Za-z0-9_-]+/g, "_")}.xlsx`,
      base64: bytesToBase64(bytes)
    };
  });

export const exportBatchQrZip = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    authSchema.extend({ batchId: z.string().uuid() }).parse(data)
  )
  .handler(async ({ data }) => {
    const detail = await getBatchDetail({ data });
    const bytes = await buildQrZip(
      detail.links.map((link) => ({
        token: link.token,
        shortUrl: link.shortUrl
      }))
    );

    return {
      fileName: `skenis_qr_${detail.batch.name.replace(/[^A-Za-z0-9_-]+/g, "_")}.zip`,
      base64: bytesToBase64(bytes)
    };
  });
