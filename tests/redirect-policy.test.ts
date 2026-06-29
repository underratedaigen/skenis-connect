import { describe, expect, it } from "vitest";
import { getRedirectOutcome } from "../src/lib/redirect-policy";

describe("redirect policy", () => {
  it("redirects active links with safe Google destinations", () => {
    expect(
      getRedirectOutcome({
        status: "ACTIVE",
        destinationUrl: "https://g.page/r/example/review"
      })
    ).toEqual({
      type: "redirect",
      destinationUrl: "https://g.page/r/example/review"
    });
  });

  it("does not redirect unassigned, archived, disabled, or invalid links", () => {
    expect(getRedirectOutcome({ status: "UNASSIGNED", destinationUrl: null })).toEqual({
      type: "unassigned"
    });
    expect(getRedirectOutcome({ status: "ARCHIVED", destinationUrl: null })).toEqual({
      type: "unassigned"
    });
    expect(
      getRedirectOutcome({
        status: "DISABLED",
        destinationUrl: "https://g.page/r/example/review"
      })
    ).toEqual({ type: "disabled" });
    expect(
      getRedirectOutcome({
        status: "ACTIVE",
        destinationUrl: "https://example.com/not-google"
      })
    ).toEqual({ type: "invalid_destination" });
  });
});
