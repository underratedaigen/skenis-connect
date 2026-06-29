export const productTypes = ["CARD", "STAND", "NFC_CARD", "OTHER"] as const;
export type ProductType = (typeof productTypes)[number];

export const redirectStatuses = [
  "UNASSIGNED",
  "ACTIVE",
  "DISABLED",
  "ARCHIVED"
] as const;
export type RedirectStatus = (typeof redirectStatuses)[number];

export const leadStatuses = [
  "NEW",
  "CONTACTED",
  "PAID",
  "IN_PRODUCTION",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED"
] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export type AdminSession = {
  id: string;
  email: string;
  name: string | null;
};

export type QrBatch = {
  id: string;
  name: string;
  productType: ProductType;
  quantity: number;
  tokenPrefix: string | null;
  note: string | null;
  manufacturerNote: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RedirectLink = {
  id: string;
  token: string;
  batchId: string | null;
  shortUrl: string;
  status: RedirectStatus;
  productType: ProductType;
  companyName: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  destinationUrl: string | null;
  notes: string | null;
  scanCount: number;
  lastScannedAt: string | null;
  createdAt: string;
  updatedAt: string;
  batch?: Pick<QrBatch, "id" | "name"> | null;
};

export type ScanEvent = {
  id: string;
  redirectLinkId: string;
  userAgent: string | null;
  ipHash: string | null;
  referrer: string | null;
  deviceType: string | null;
  country: string | null;
  city: string | null;
  createdAt: string;
  redirectLink?: Pick<RedirectLink, "token" | "companyName" | "shortUrl">;
};

export type Lead = {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string | null;
  quantity: number;
  productType: ProductType;
  googleReviewUrl: string | null;
  message: string | null;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
};

export type AuditLog = {
  id: string;
  userId: string | null;
  entityType: string;
  entityId: string;
  action: string;
  oldValue: unknown | null;
  newValue: unknown | null;
  createdAt: string;
  user?: {
    email: string | null;
    name: string | null;
  } | null;
};
