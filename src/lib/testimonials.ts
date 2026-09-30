import { z } from "zod";

export const testimonialServices = [
  "svetaines",
  "e-komercija",
  "registracijos",
  "pardavimu-irankiai",
  "skaiciuokles",
  "verslo-sistemos",
  "automatizacijos",
  "ai-sprendimai",
  "atsiliepimai",
  "nfc-product",
] as const;
export type ServiceSlug = (typeof testimonialServices)[number];
export const testimonialSchema = z
  .object({
    id: z.string().min(1).max(80),
    name: z.string().trim().min(2).max(120),
    company: z.string().trim().max(160).optional(),
    role: z.string().trim().max(120).optional(),
    service: z.enum(testimonialServices),
    rating: z.number().int().min(1).max(5),
    quote: z.string().trim().min(10).max(800),
    fullQuote: z.string().trim().max(4000).optional(),
    publishedAt: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine((value) => {
        const date = new Date(`${value}T00:00:00Z`);
        return (
          !Number.isNaN(date.getTime()) &&
          date.toISOString().slice(0, 10) === value
        );
      }, "Neteisinga data"),
    source: z.enum(["google", "direct", "facebook", "synthetic"]),
    sourceUrl: z
      .string()
      .url()
      .refine(
        (value) => /^https:\/\//.test(value),
        "Šaltinio nuoroda turi prasidėti https://",
      )
      .optional()
      .or(z.literal("")),
    verified: z.boolean(),
    featured: z.boolean(),
    synthetic: z.boolean(),
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    consent: z.boolean().default(false),
  })
  .superRefine((value, context) => {
    if (value.synthetic !== (value.source === "synthetic"))
      context.addIssue({
        code: "custom",
        path: ["source"],
        message: "Sintetinio įrašo šaltinis turi būti synthetic.",
      });
    if (
      value.synthetic &&
      (value.verified || value.featured || value.status === "published")
    )
      context.addIssue({
        code: "custom",
        path: ["status"],
        message:
          "Sintetinis įrašas negali būti patvirtintas, išskirtas ar publikuotas.",
      });
    if (
      value.status === "published" &&
      (!value.verified || !value.consent || value.synthetic)
    )
      context.addIssue({
        code: "custom",
        path: ["status"],
        message:
          "Publikavimui reikia tikro, patikrinto įrašo ir leidimo jį viešinti.",
      });
  });
export type Testimonial = z.infer<typeof testimonialSchema>;

export function isPublicTestimonial(
  value: Testimonial,
  today = new Date().toISOString().slice(0, 10),
) {
  return (
    value.synthetic === false &&
    value.source !== "synthetic" &&
    value.verified === true &&
    value.consent === true &&
    value.status === "published" &&
    value.publishedAt <= today
  );
}
export function publicTestimonials(values: Testimonial[], today?: string) {
  return values.filter(
    (value) =>
      testimonialSchema.safeParse(value).success &&
      isPublicTestimonial(value, today),
  );
}
export type ReviewFilters = {
  query?: string;
  service?: string;
  rating?: string;
  sort?: "newest" | "oldest" | "highest" | "lowest";
};
export function filterTestimonials(
  values: Testimonial[],
  filters: ReviewFilters,
) {
  const query = (filters.query || "").trim().toLocaleLowerCase("lt-LT");
  return values
    .filter(
      (item) =>
        (!filters.service || item.service === filters.service) &&
        (!filters.rating || item.rating === Number(filters.rating)) &&
        (!query ||
          [item.name, item.company, item.quote, item.fullQuote]
            .filter(Boolean)
            .join(" ")
            .toLocaleLowerCase("lt-LT")
            .includes(query)),
    )
    .sort((a, b) => {
      if (filters.sort === "highest" || filters.sort === "lowest")
        return (
          (filters.sort === "highest"
            ? b.rating - a.rating
            : a.rating - b.rating) ||
          b.publishedAt.localeCompare(a.publishedAt) ||
          a.id.localeCompare(b.id)
        );
      return (
        (filters.sort === "oldest"
          ? a.publishedAt.localeCompare(b.publishedAt)
          : b.publishedAt.localeCompare(a.publishedAt)) ||
        a.id.localeCompare(b.id)
      );
    });
}
export function testimonialSummary(values: Testimonial[]) {
  const real = publicTestimonials(values);
  return real.length
    ? {
        count: real.length,
        rating:
          real.reduce((sum, value) => sum + value.rating, 0) / real.length,
      }
    : null;
}
