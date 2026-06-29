import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RedirectStatusPage } from "@/components/redirect-status-page";
import { resolveRedirectToken } from "@/lib/app-data";

type RedirectView =
  | "loading"
  | "missing"
  | "rate_limited"
  | "unassigned"
  | "disabled"
  | "invalid_destination";

export function RedirectPage() {
  const { token } = useParams();
  const [view, setView] = useState<RedirectView>("loading");

  useEffect(() => {
    document.title = "Skenis QR | Skenis.lt";

    if (!token) {
      setView("missing");
      return;
    }

    resolveRedirectToken(token)
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
    return <RedirectStatusPage title="Tikrinamas QR kodas" message="Ruošiamas nukreipimas..." />;
  }

  if (view === "missing") {
    return <RedirectStatusPage title="QR kodas nerastas" message="Šis Skenis QR kodas nerastas." tone="error" />;
  }

  if (view === "disabled") {
    return <RedirectStatusPage title="QR kodas išjungtas" message="Šis QR kodas laikinai išjungtas." tone="warning" />;
  }

  if (view === "unassigned") {
    return <RedirectStatusPage title="QR kodas dar neaktyvus" message="Šis Skenis QR kodas dar nėra aktyvuotas." tone="warning" />;
  }

  if (view === "rate_limited") {
    return <RedirectStatusPage title="Per daug užklausų" message="Bandykite netrukus." tone="warning" />;
  }

  return (
    <RedirectStatusPage
      title="Nukreipimas neparuoštas"
      message="Šio QR kodo nukreipimo nuoroda dar nėra paruošta."
      tone="warning"
    />
  );
}
