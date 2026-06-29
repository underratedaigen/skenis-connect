import { createFileRoute } from "@tanstack/react-router";
import { createQrSvg } from "@/lib/qr";
import { isValidToken } from "@/lib/tokens";

export const Route = createFileRoute("/api/public/qr/$token")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        if (!isValidToken(params.token)) {
          return new Response("Token neteisingas.", { status: 400 });
        }

        const { getSupabaseServerClient } = await import("@/integrations/supabase/client.server");
        const supabase = getSupabaseServerClient();
        const { data, error } = await supabase
          .from("redirect_links")
          .select("short_url")
          .eq("token", params.token)
          .maybeSingle();

        if (error) {
          return new Response(error.message, { status: 500 });
        }

        if (!data) {
          return new Response("QR kodas nerastas.", { status: 404 });
        }

        const svg = await createQrSvg(data.short_url);

        return new Response(svg, {
          headers: {
            "Content-Type": "image/svg+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600"
          }
        });
      }
    }
  }
});
