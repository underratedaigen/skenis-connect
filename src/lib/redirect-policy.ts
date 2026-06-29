import type { RedirectStatus } from "@prisma/client";
import { isSafeGoogleReviewUrl } from "@/lib/validation";

export type RedirectOutcome =
  | { type: "redirect"; destinationUrl: string }
  | { type: "unassigned" }
  | { type: "disabled" }
  | { type: "invalid_destination" };

export function getRedirectOutcome(link: {
  status: RedirectStatus;
  destinationUrl: string | null;
}): RedirectOutcome {
  if (link.status === "UNASSIGNED" || link.status === "ARCHIVED") {
    return { type: "unassigned" };
  }

  if (link.status === "DISABLED") {
    return { type: "disabled" };
  }

  if (!link.destinationUrl || !isSafeGoogleReviewUrl(link.destinationUrl)) {
    return { type: "invalid_destination" };
  }

  return {
    type: "redirect",
    destinationUrl: link.destinationUrl
  };
}
