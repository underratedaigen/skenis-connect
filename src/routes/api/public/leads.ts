import { createFileRoute } from "@tanstack/react-router";
import { blankToNull } from "@/lib/supabase-common";
import { leadCreateSchema } from "@/lib/validation";

export const Route = createFileRoute("/api/public/leads")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        const parsed = leadCreateSchema.safeParse(body);

        if (!parsed.success) {
          return Response.json(
            {
              message:
                parsed.error.issues[0]?.message ||
                "Patikrinkite formos laukus ir bandykite dar kartą."
            },
            { status: 400 }
          );
        }

        const { getSupabaseServerClient } = await import("@/integrations/supabase/client.server");
        const supabase = getSupabaseServerClient();
        const data = parsed.data;

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
          return Response.json({ message: error.message }, { status: 500 });
        }

        return Response.json({ ok: true }, { status: 201 });
      }
    }
  }
});
