import type { LeadStatus, ProductType, RedirectStatus } from "@prisma/client";

export const productTypeLabels: Record<ProductType, string> = {
  CARD: "Akrilinė Google Review kortelė",
  STAND: "Stalinis Google Review stendas",
  NFC_CARD: "NFC + QR Google Review kortelė",
  OTHER: "Kita"
};

export const shortProductTypeLabels: Record<ProductType, string> = {
  CARD: "Kortelė",
  STAND: "Stendas",
  NFC_CARD: "NFC + QR",
  OTHER: "Kita"
};

export const redirectStatusLabels: Record<RedirectStatus, string> = {
  UNASSIGNED: "Nepriskirtas",
  ACTIVE: "Aktyvus",
  DISABLED: "Išjungtas",
  ARCHIVED: "Archyvuotas"
};

export const leadStatusLabels: Record<LeadStatus, string> = {
  NEW: "Naujas",
  CONTACTED: "Susisiekta",
  PAID: "Apmokėta",
  IN_PRODUCTION: "Gamyboje",
  SHIPPED: "Išsiųsta",
  COMPLETED: "Užbaigta",
  CANCELLED: "Atšaukta"
};
