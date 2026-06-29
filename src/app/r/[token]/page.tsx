import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RedirectStatusPage } from "@/components/redirect-status-page";
import { hashIp, recordScan } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { getRedirectOutcome } from "@/lib/redirect-policy";
import { isValidToken } from "@/lib/tokens";

export const dynamic = "force-dynamic";

function getClientIp(headerList: Pick<Headers, "get">) {
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || null;

  return (
    headerList.get("x-real-ip") ||
    headerList.get("cf-connecting-ip") ||
    headerList.get("x-client-ip")
  );
}

export default async function RedirectPage({
  params
}: {
  params: { token: string };
}) {
  if (!isValidToken(params.token)) {
    return (
      <RedirectStatusPage
        title="QR kodas nerastas"
        message="Šis Skenis QR kodas nerastas."
        tone="error"
      />
    );
  }

  const headerList = headers();
  const ip = getClientIp(headerList);
  const rateKey = `${params.token}:${hashIp(ip) || "unknown"}`;

  if (!checkRateLimit(rateKey, 120, 60_000)) {
    return (
      <RedirectStatusPage
        title="Per daug užklausų"
        message="Šis QR kodas šiuo metu gauna per daug užklausų. Bandykite netrukus."
        tone="warning"
      />
    );
  }

  const link = await prisma.redirectLink.findUnique({
    where: { token: params.token },
    select: {
      id: true,
      status: true,
      destinationUrl: true
    }
  });

  if (!link) {
    return (
      <RedirectStatusPage
        title="QR kodas nerastas"
        message="Šis Skenis QR kodas nerastas."
        tone="error"
      />
    );
  }

  await recordScan({
    redirectLinkId: link.id,
    userAgent: headerList.get("user-agent"),
    ip,
    referrer: headerList.get("referer")
  }).catch(() => undefined);

  const outcome = getRedirectOutcome(link);

  if (outcome.type === "unassigned") {
    return (
      <RedirectStatusPage
        title="QR kodas dar neaktyvus"
        message="Šis Skenis QR kodas dar nėra aktyvuotas."
        tone="warning"
      />
    );
  }

  if (outcome.type === "disabled") {
    return (
      <RedirectStatusPage
        title="QR kodas išjungtas"
        message="Šis QR kodas laikinai išjungtas."
        tone="warning"
      />
    );
  }

  if (outcome.type === "invalid_destination") {
    return (
      <RedirectStatusPage
        title="Nukreipimas neparuoštas"
        message="Šio QR kodo nukreipimo nuoroda dar nėra paruošta."
        tone="warning"
      />
    );
  }

  redirect(outcome.destinationUrl);
}
