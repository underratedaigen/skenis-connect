import type {
  AuditLog,
  JsonValue,
  Lead,
  QrBatch,
  RedirectLink,
  ScanEvent
} from "@/lib/types";

function toJsonValue(value: unknown): JsonValue {
  return JSON.parse(JSON.stringify(value ?? null)) as JsonValue;
}

export function mapBatch(row: any): QrBatch {
  return {
    id: row.id,
    name: row.name,
    productType: row.product_type,
    quantity: row.quantity,
    tokenPrefix: row.token_prefix,
    note: row.note,
    manufacturerNote: row.manufacturer_note,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function mapLink(row: any): RedirectLink {
  return {
    id: row.id,
    token: row.token,
    batchId: row.batch_id,
    shortUrl: row.short_url,
    status: row.status,
    productType: row.product_type,
    companyName: row.company_name,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    destinationUrl: row.destination_url,
    notes: row.notes,
    scanCount: row.scan_count,
    lastScannedAt: row.last_scanned_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    batch: row.qr_batches
      ? {
          id: row.qr_batches.id,
          name: row.qr_batches.name
        }
      : row.batch
        ? row.batch
        : null
  };
}

export function mapLead(row: any): Lead {
  return {
    id: row.id,
    name: row.name,
    companyName: row.company_name,
    email: row.email,
    phone: row.phone,
    quantity: row.quantity,
    productType: row.product_type,
    googleReviewUrl: row.google_review_url,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function mapScan(row: any): ScanEvent {
  return {
    id: row.id,
    redirectLinkId: row.redirect_link_id,
    userAgent: row.user_agent,
    ipHash: row.ip_hash,
    referrer: row.referrer,
    deviceType: row.device_type,
    country: row.country,
    city: row.city,
    createdAt: row.created_at,
    redirectLink: row.redirect_links
      ? {
          token: row.redirect_links.token,
          companyName: row.redirect_links.company_name,
          shortUrl: row.redirect_links.short_url
        }
      : undefined
  };
}

export function mapAudit(row: any): AuditLog {
  return {
    id: row.id,
    userId: row.user_id,
    entityType: row.entity_type,
    entityId: row.entity_id,
    action: row.action,
    oldValue: toJsonValue(row.old_value),
    newValue: toJsonValue(row.new_value),
    createdAt: row.created_at,
    user: row.users || null
  };
}
