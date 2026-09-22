import { z } from "zod";

export const studioServiceOptions = [
  { value: "svetaines", label: "Svetainė arba jos atnaujinimas" },
  { value: "registracijos", label: "Registracija ir klientų aptarnavimas" },
  { value: "pardavimu-irankiai", label: "Užklausos ir pardavimų įrankiai" },
  { value: "skaiciuokles", label: "Skaičiuoklė ar individualus įrankis" },
  { value: "verslo-sistemos", label: "Vidinė verslo sistema" },
  { value: "automatizacijos", label: "Automatizacija arba integracija" },
  { value: "ai-sprendimai", label: "AI sprendimas" },
  { value: "e-komercija", label: "E. parduotuvė ar klientų platforma" },
  { value: "atsiliepimai", label: "Google atsiliepimai, NFC ir QR" },
  { value: "kita", label: "Kita idėja / dar nežinau" },
] as const;

export type StudioLeadIntent = "demo" | "project";

function isPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return (
    /^\+?[\d\s().-]+$/.test(value) && digits.length >= 7 && digits.length <= 15
  );
}

function isEmail(value: string) {
  return z.string().email().safeParse(value).success;
}

function normalizeWebsite(value: string) {
  if (!value) return "";
  return /^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`;
}

function isWebsite(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      url.hostname.includes(".") &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export const studioLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Įveskite savo vardą.")
    .max(120, "Vardas per ilgas."),
  companyName: z
    .string()
    .trim()
    .max(180, "Įmonės pavadinimas per ilgas.")
    .optional()
    .default(""),
  contact: z
    .string()
    .trim()
    .max(180, "Kontaktinis duomuo per ilgas.")
    .refine(
      (value) => isEmail(value) || isPhone(value),
      "Įveskite galiojantį el. pašto adresą arba telefono numerį.",
    ),
  website: z
    .string()
    .trim()
    .max(500, "Svetainės adresas per ilgas.")
    .optional()
    .default("")
    .transform(normalizeWebsite)
    .refine(isWebsite, "Įveskite galiojantį svetainės adresą, pvz., imone.lt."),
  service: z
    .string()
    .refine(
      (value) => studioServiceOptions.some((option) => option.value === value),
      "Pasirinkite, kuo galime padėti.",
    ),
  message: z
    .string()
    .trim()
    .min(10, "Trumpai papasakokite apie savo idėją (bent 10 simbolių).")
    .max(2000, "Komentaras gali būti iki 2 000 simbolių."),
  privacy: z.literal("on", {
    errorMap: () => ({
      message: "Patvirtinkite, kad susipažinote su privatumo politika.",
    }),
  }),
  faxNumber: z
    .string()
    .max(0, "Nepavyko patvirtinti užklausos. Susisiekite el. paštu.")
    .optional()
    .default(""),
});

export type StudioLead = z.infer<typeof studioLeadSchema>;

/** Keep studio enquiries compatible with the existing leads table and admin inbox. */
export function toStudioLeadPayload(
  lead: StudioLead,
  intent: StudioLeadIntent,
) {
  const emailContact = isEmail(lead.contact);
  const service = studioServiceOptions.find(
    (option) => option.value === lead.service,
  );

  return {
    name: lead.name,
    company_name: lead.companyName,
    // The existing schema requires text values; leave absent values empty rather than inventing details.
    email: emailContact ? lead.contact : "",
    phone: emailContact ? null : lead.contact,
    quantity: 1,
    product_type: "OTHER" as const,
    google_review_url: null,
    message: [
      "SKENIS · Skaitmeninių sprendimų užklausa",
      `Tikslas: ${intent === "demo" ? "Nemokamas pradinis pavyzdys" : "Projekto aptarimas"}`,
      `Paslauga: ${service?.label || lead.service}`,
      ...(lead.website ? [`Svetainė: ${lead.website}`] : []),
      "Privatumo politika: susipažino",
      "",
      lead.message,
    ].join("\n"),
  };
}
