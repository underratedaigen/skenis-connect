import { useEffect, useState } from "react";
import {
  publicTestimonials,
  testimonialSchema,
  type Testimonial,
} from "./testimonials";

export const testimonialsEnabled =
  import.meta.env.VITE_TESTIMONIALS_ENABLED === "true";
export function mapTestimonial(row: Record<string, unknown>): Testimonial {
  return testimonialSchema.parse({
    id: row.id,
    name: row.name,
    company: row.company || undefined,
    role: row.role || undefined,
    service: row.service,
    rating: row.rating,
    quote: row.quote,
    fullQuote: row.full_quote || undefined,
    publishedAt: row.published_at,
    source: row.source,
    sourceUrl: row.source_url || undefined,
    verified: row.verified,
    featured: row.featured,
    synthetic: row.synthetic,
    status: row.status,
    consent: row.consent,
  });
}
export async function listPublicTestimonials() {
  if (!testimonialsEnabled) return [];
  const { supabase } = await import("@/integrations/supabase/client");
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("status", "published")
    .eq("verified", true)
    .eq("synthetic", false)
    .eq("consent", true)
    .lte("published_at", new Date().toISOString().slice(0, 10))
    .order("published_at", { ascending: false })
    .limit(1000);
  if (error) throw new Error("Nepavyko įkelti atsiliepimų.");
  const valid = (data || []).flatMap((row) => {
    try {
      return [mapTestimonial(row)];
    } catch {
      return [];
    }
  });
  return publicTestimonials(valid);
}
export function usePublicTestimonials() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">(
    testimonialsEnabled ? "loading" : "ready",
  );
  useEffect(() => {
    let active = true;
    listPublicTestimonials()
      .then((rows) => {
        if (active) {
          setReviews(rows);
          setState("ready");
        }
      })
      .catch(() => {
        if (active) setState("error");
      });
    return () => {
      active = false;
    };
  }, []);
  return { reviews, state };
}
async function requireAdmin() {
  const { getCurrentAdmin } = await import("@/lib/app-data");
  if (!(await getCurrentAdmin()))
    throw new Error("Reikalinga administratoriaus sesija.");
}
export async function listAdminTestimonials() {
  await requireAdmin();
  const { supabase } = await import("@/integrations/supabase/client");
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("published_at", { ascending: false });
  if (error)
    throw new Error(
      "Atsiliepimų lentelė nepasiekiama. Patikrinkite naujos migracijos pritaikymą.",
    );
  return (data || []).map(mapTestimonial);
}
export async function saveTestimonial(input: Testimonial, existing: boolean) {
  await requireAdmin();
  const { supabase } = await import("@/integrations/supabase/client");
  const value = testimonialSchema.parse(input);
  if (value.synthetic || value.source === "synthetic")
    throw new Error(
      "Sintetiniai testai nėra saugomi klientų atsiliepimų lentelėje.",
    );
  if (
    value.status === "published" &&
    value.publishedAt > new Date().toISOString().slice(0, 10)
  )
    throw new Error("Publikavimo data negali būti ateityje.");
  const row = {
    id: value.id,
    name: value.name,
    company: value.company || null,
    role: value.role || null,
    service: value.service,
    rating: value.rating,
    quote: value.quote,
    full_quote: value.fullQuote || null,
    published_at: value.publishedAt,
    source: value.source,
    source_url: value.sourceUrl || null,
    verified: value.verified,
    featured: value.featured,
    synthetic: false,
    status: value.status,
    consent: value.consent,
  };
  const query = existing
    ? supabase.from("testimonials").update(row).eq("id", value.id)
    : supabase.from("testimonials").insert(row);
  const { data, error } = await query.select("*").single();
  if (error)
    throw new Error(
      "Nepavyko išsaugoti atsiliepimo. Patikrinkite duomenis ir administratoriaus teises.",
    );
  return mapTestimonial(data);
}
