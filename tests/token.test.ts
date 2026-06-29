import { describe, expect, it } from "vitest";
import { generateSecureToken, isValidToken, sanitizeTokenPrefix } from "../src/lib/tokens";

describe("token generation", () => {
  it("creates URL-safe unguessable-looking tokens", () => {
    const tokens = new Set(
      Array.from({ length: 500 }, () => generateSecureToken(10))
    );

    expect(tokens.size).toBe(500);

    for (const token of tokens) {
      expect(isValidToken(token)).toBe(true);
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    }
  });

  it("sanitizes optional prefixes", () => {
    expect(sanitizeTokenPrefix(" LT 2026!_")).toBe("LT2026_");
    expect(generateSecureToken(8, "B2B_")).toMatch(/^B2B_[A-Za-z0-9_-]{8}$/);
  });
});
