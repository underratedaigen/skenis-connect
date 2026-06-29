import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RedirectStatusPage } from "@/components/redirect-status-page";
import { resolveRedirect } from "@/lib/public.functions";

type RedirectView =
  | "loading"
  | "missing"
  | "rate_limited"
  | "unassigned"
  | "disabled"
  | "invalid_destination";

export const Route = createFileRoute("/r/$token")({
  head: () => ({
    meta: [{ title: "Skenis QR | Skenis.lt" }]
  }),
  component: RedirectPage
});

function RedirectPage() {
  const { token } = Route.useParams();
  const [view, setView] = useState<RedirectView>("loading");

  useEffect(() => {
    resolveRedirect({
      data: {
        token,
        userAgent: navigator.userAgent,
        referrer: document.referrer
      }
    })
      .then((outcome) => {
        if (outcome.type === "redirect") {
          window.location.assign(outcome.destinationUrl);
          return;
        }

        setView(outcome.type);
      })
      .catch(() => setView("invalid_destination"));
  }, [token]);

  if (view === "loading") {
    return (
      <RedirectStatusPage
        title="Tikrinamas QR kodas"
        message="Ruošiamas nukreipimas..."
      />
    );
  }

  if (view === "missing") {
    return (
      <RedirectStatusPage
        title="QR kodas nerastas"
        message="Šis Skenis QR kodas nerastas."
        tone="error"
      />
    );
  }

  if (view === "rate_limited") {
    return (
      <RedirectStatusPage
        title="Per daug užklausų"
        message="Šis QR kodas šiuo metu gauna per daug užklausų. Bandykite netrukus."
        tone="warning"
      />
    );
  }

  if (view === "disabled") {
    return (
      <RedirectStatusPage
        title="QR kodas išjungtas"
        message="Šis QR kodas laikinai išjungtas."
        tone="warning"
      />
    );
  }

  if (view === "unassigned") {
    return (
      <RedirectStatusPage
        title="QR kodas dar neaktyvus"
        message="Šis Skenis QR kodas dar nėra aktyvuotas."
        tone="warning"
      />
    );
  }

  return (
    <RedirectStatusPage
      title="Nukreipimas neparuoštas"
      message="Šio QR kodo nukreipimo nuoroda dar nėra paruošta."
      tone="warning"
    />
  );
}
