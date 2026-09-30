import { describe, expect, it } from "vitest";
import fixture from "../src/data/fixtures/testimonials.synthetic.json";
import {
  filterTestimonials,
  publicTestimonials,
  testimonialSchema,
  testimonialSummary,
  type Testimonial,
} from "../src/lib/testimonials";

const fixtures = fixture.map((value) => testimonialSchema.parse(value));
// A unit-test record only; never included in application data or a public bundle.
const genuine: Testimonial = {
  id: "unit-only",
  name: "Unit test author",
  service: "svetaines",
  rating: 4,
  quote: "Unit test content for approval checks.",
  publishedAt: "2026-01-01",
  source: "direct",
  synthetic: false,
  verified: true,
  featured: true,
  consent: true,
  status: "published",
};
describe("synthetic testimonial isolation", () => {
  it("contains exactly 200 unique, clearly named test records", () => {
    expect(fixtures).toHaveLength(200);
    expect(new Set(fixtures.map((value) => value.id)).size).toBe(200);
    expect(new Set(fixtures.map((value) => value.quote)).size).toBe(200);
    for (const value of fixtures) {
      expect(value.name).toMatch(/^Testinis klientas \d{3}$/);
      expect(value).toMatchObject({
        source: "synthetic",
        synthetic: true,
        verified: false,
        featured: false,
        status: "draft",
        consent: false,
      });
    }
  });
  it("covers all categories, all ratings and expanded-text scenarios", () => {
    expect(new Set(fixtures.map((value) => value.service)).size).toBe(10);
    expect([...new Set(fixtures.map((value) => value.rating))].sort()).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(fixtures.filter((value) => value.fullQuote).length).toBe(50);
    expect(
      Math.max(...fixtures.map((value) => value.quote.length)) -
        Math.min(...fixtures.map((value) => value.quote.length)),
    ).toBeGreaterThan(70);
  });
  it("never publishes synthetic entries or computes a customer rating from them", () => {
    expect(publicTestimonials(fixtures)).toEqual([]);
    expect(testimonialSummary(fixtures)).toBeNull();
    for (const patch of [
      { verified: true },
      { featured: true },
      { status: "published" },
      { source: "direct" },
    ])
      expect(
        testimonialSchema.safeParse({ ...fixtures[0], ...patch }).success,
      ).toBe(false);
  });
});
describe("review publication and filtering", () => {
  it("requires review authenticity, permission and a published non-future date", () => {
    expect(publicTestimonials([genuine], "2026-09-28")).toEqual([genuine]);
    for (const patch of [
      { verified: false },
      { consent: false },
      { status: "draft" },
      { status: "archived" },
      { publishedAt: "2099-01-01" },
      { synthetic: true },
      { source: "synthetic" },
    ])
      expect(
        publicTestimonials(
          [{ ...genuine, ...patch } as Testimonial],
          "2026-09-28",
        ),
      ).toEqual([]);
    expect(testimonialSummary([...fixtures, genuine])).toEqual({
      count: 1,
      rating: 4,
    });
  });
  it("rejects malformed dates, invalid ratings and unsafe source URLs", () => {
    for (const patch of [
      { publishedAt: "2026-02-30" },
      { rating: 0 },
      { rating: 6 },
      { rating: 2.5 },
      { sourceUrl: "javascript:alert(1)" },
      { sourceUrl: "http://example.com" },
    ])
      expect(
        testimonialSchema.safeParse({ ...genuine, ...patch }).success,
      ).toBe(false);
  });
  it("combines search, category and exact rating without dropping lower ratings", () => {
    const result = filterTestimonials(fixtures, {
      query: "  TESTINIS klientas  ",
      service: "registracijos",
      rating: "1",
    });
    expect(result).toHaveLength(4);
    expect(
      result.every(
        (value) => value.service === "registracijos" && value.rating === 1,
      ),
    ).toBe(true);
    expect(
      filterTestimonials(fixtures, { query: "nerandamas-įrašas" }),
    ).toEqual([]);
  });
  it("sorts deterministically and does not mutate the source collection", () => {
    const original = fixtures.map((value) => value.id);
    const lowest = filterTestimonials(fixtures, { sort: "lowest" }),
      highest = filterTestimonials(fixtures, { sort: "highest" }),
      oldest = filterTestimonials(fixtures, { sort: "oldest" });
    expect(lowest[0].rating).toBe(1);
    expect(highest[0].rating).toBe(5);
    expect(oldest[0].id).toBe("synthetic-001");
    expect(fixtures.map((value) => value.id)).toEqual(original);
  });
});
