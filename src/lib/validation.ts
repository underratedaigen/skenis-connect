import { LeadStatus, ProductType, RedirectStatus } from "@prisma/client";
import { z } from "zod";

export function isSafeGoogleReviewUrl(value: string) {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase();
    const path = url.pathname.toLowerCase();

    if (url.protocol !== "https:") return false;

    if (host === "g.page") return path.length > 1;
    if (host === "maps.app.goo.gl") return path.length > 1;

    if (host === "search.google.com") {
      return path.startsWith("/local/writereview");
    }

    const isGoogleHost =
      host === "google.com" ||
      host === "www.google.com" ||
      host === "maps.google.com" ||
      host.endsWith(".google.com");

    if (!isGoogleHost) return false;

    return (
      host === "maps.google.com" ||
      path.startsWith("/maps") ||
      path.includes("/writereview") ||
      url.searchParams.has("placeid") ||
      url.searchParams.has("cid")
    );
  } catch {
    return false;
  }
}

export const productTypeSchema = z.nativeEnum(ProductType);
export const redirectStatusSchema = z.nativeEnum(RedirectStatus);
export const leadStatusSchema = z.nativeEnum(LeadStatus);

export const optionalGoogleReviewUrlSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined))
  .refine((value) => !value || isSafeGoogleReviewUrl(value), {
    message: "Įveskite saugią Google atsiliepimų arba Maps HTTPS nuorodą."
  });

export const leadCreateSchema = z.object({
  name: z.string().trim().min(2, "Įveskite vardą.").max(120),
  companyName: z.string().trim().min(2, "Įveskite įmonės pavadinimą.").max(180),
  email: z.string().trim().email("Įveskite teisingą el. pašto adresą.").max(180),
  phone: z.string().trim().max(80).optional().or(z.literal("")),
  quantity: z.coerce.number().int().min(1).max(10000),
  productType: productTypeSchema,
  googleReviewUrl: optionalGoogleReviewUrlSchema,
  message: z.string().trim().max(2000).optional().or(z.literal(""))
});

export const batchCreateSchema = z.object({
  name: z.string().trim().min(3).max(180),
  quantity: z.coerce.number().int().min(1).max(1000),
  productType: productTypeSchema,
  tokenPrefix: z
    .string()
    .trim()
    .max(12)
    .regex(/^[A-Za-z0-9_-]*$/, "Naudokite tik raides, skaičius, _ arba -.")
    .optional()
    .or(z.literal("")),
  note: z.string().trim().max(500).optional().or(z.literal("")),
  manufacturerNote: z.string().trim().max(2000).optional().or(z.literal(""))
});

export const redirectLinkUpdateSchema = z
  .object({
    companyName: z.string().trim().max(180).optional().or(z.literal("")),
    contactName: z.string().trim().max(120).optional().or(z.literal("")),
    contactEmail: z
      .string()
      .trim()
      .email("Įveskite teisingą el. pašto adresą.")
      .max(180)
      .optional()
      .or(z.literal("")),
    contactPhone: z.string().trim().max(80).optional().or(z.literal("")),
    destinationUrl: optionalGoogleReviewUrlSchema,
    notes: z.string().trim().max(2000).optional().or(z.literal("")),
    status: redirectStatusSchema
  })
  .refine(
    (value) => value.status !== "ACTIVE" || Boolean(value.destinationUrl),
    {
      path: ["destinationUrl"],
      message: "Aktyviam QR kodui būtina Google atsiliepimų nuoroda."
    }
  );

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8)
});
