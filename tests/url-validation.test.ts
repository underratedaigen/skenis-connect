import { describe, expect, it } from "vitest";
import { isSafeGoogleReviewUrl } from "../src/lib/validation";

describe("URL validation", () => {
  it("accepts any http(s) URL", () => {
    expect(isSafeGoogleReviewUrl("https://g.page/r/example/review")).toBe(true);
    expect(isSafeGoogleReviewUrl("https://example.com/review")).toBe(true);
    expect(isSafeGoogleReviewUrl("http://example.com")).toBe(true);
  });

  it("rejects non-http protocols and invalid URLs", () => {
    expect(isSafeGoogleReviewUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeGoogleReviewUrl("data:text/html,hello")).toBe(false);
    expect(isSafeGoogleReviewUrl("not a url")).toBe(false);
  });
});
