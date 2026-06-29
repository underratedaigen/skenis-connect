import { describe, expect, it } from "vitest";
import { isSafeGoogleReviewUrl } from "../src/lib/validation";

describe("Google review URL validation", () => {
  it("accepts common Google review and Maps URLs", () => {
    expect(isSafeGoogleReviewUrl("https://g.page/r/example/review")).toBe(true);
    expect(
      isSafeGoogleReviewUrl(
        "https://search.google.com/local/writereview?placeid=ChIJ123"
      )
    ).toBe(true);
    expect(isSafeGoogleReviewUrl("https://www.google.com/maps/place/example")).toBe(true);
    expect(isSafeGoogleReviewUrl("https://maps.app.goo.gl/abc123")).toBe(true);
  });

  it("rejects unsafe or non-Google destinations", () => {
    expect(isSafeGoogleReviewUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeGoogleReviewUrl("data:text/html,hello")).toBe(false);
    expect(isSafeGoogleReviewUrl("http://g.page/r/example/review")).toBe(false);
    expect(isSafeGoogleReviewUrl("https://google.com.evil.test/maps")).toBe(false);
    expect(isSafeGoogleReviewUrl("https://example.com/review")).toBe(false);
  });
});
