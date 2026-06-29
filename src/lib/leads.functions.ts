import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { blankToNull } from "@/lib/supabase-common";
import { leadCreateSchema } from "@/lib/validation";

export const createLead = createServerFn({ method: "POST" })
  .validator((data: unknown) => leadCreateSchema.parse(data))
  .handler(async ({ data }) => {
    const { getSupabaseServerClient } = await import("@/integrations/supabase/client.server");
    const supabase = getSupabaseServerClient();

    const { error } = await supabase.from("leads").insert({
      name: data.name,
      company_name: data.companyName,
      email: data.email,
      phone: blankToNull(data.phone),
      quantity: data.quantity,
      product_type: data.productType,
      google_review_url: blankToNull(data.googleReviewUrl),
      message: blankToNull(data.message)
    });

    if (error) {
      throw new Error(error.message);
    }

    return { ok: true };
  });

export const leadSubmitSchema = z.object({
  ok: z.boolean()
});
