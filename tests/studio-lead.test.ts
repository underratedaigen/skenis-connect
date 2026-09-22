import { describe, expect, it } from "vitest";
import { studioLeadSchema, toStudioLeadPayload } from "../src/lib/studio-lead";

const enquiry = {
  name: "Jonas",
  companyName: "",
  contact: "jonas@example.com",
  website: "",
  service: "automatizacijos",
  message: "Norime automatizuoti klientų užklausas.",
  privacy: "on",
  faxNumber: "",
};

describe("studio enquiry validation", () => {
  it("accepts email contact and an optional company and website", () => {
    const result = studioLeadSchema.safeParse(enquiry);
    expect(result.success).toBe(true);
  });

  it("accepts international and local telephone contacts without inventing an email", () => {
    for (const contact of [
      "+370 623 57 946",
      "062357946",
      "+44 (20) 7946-0123",
    ]) {
      const lead = studioLeadSchema.parse({ ...enquiry, contact });
      const payload = toStudioLeadPayload(lead, "project");
      expect(payload.email).toBe("");
      expect(payload.phone).toBe(contact);
    }
  });

  it("rejects missing or invalid contact information", () => {
    for (const contact of [
      "",
      "jonas@",
      "not an email",
      "123",
      "1234567890123456",
      "letters12345678",
    ]) {
      expect(studioLeadSchema.safeParse({ ...enquiry, contact }).success).toBe(
        false,
      );
    }
  });

  it("normalizes a bare domain and only accepts web URLs", () => {
    expect(
      studioLeadSchema.parse({ ...enquiry, website: " imone.lt/paslaugos " })
        .website,
    ).toBe("https://imone.lt/paslaugos");
    for (const website of [
      "javascript:alert(1)",
      "ftp://imone.lt",
      "not a website",
      "https://user:password@imone.lt",
    ]) {
      expect(studioLeadSchema.safeParse({ ...enquiry, website }).success).toBe(
        false,
      );
    }
  });

  it("requires explicit privacy consent, a known category and a meaningful comment", () => {
    for (const patch of [
      { privacy: undefined },
      { privacy: "off" },
      { service: "unknown" },
      { message: " " },
    ]) {
      expect(studioLeadSchema.safeParse({ ...enquiry, ...patch }).success).toBe(
        false,
      );
    }
  });

  it("rejects a filled honeypot", () => {
    expect(
      studioLeadSchema.safeParse({ ...enquiry, faxNumber: "spam" }).success,
    ).toBe(false);
  });
});

describe("existing lead integration compatibility", () => {
  it("preserves the service, website, intent and message in the existing inbox", () => {
    const lead = studioLeadSchema.parse({
      ...enquiry,
      website: "https://imone.lt",
    });
    const payload = toStudioLeadPayload(lead, "demo");
    expect(payload).toMatchObject({
      name: "Jonas",
      company_name: "",
      email: "jonas@example.com",
      phone: null,
      product_type: "OTHER",
      quantity: 1,
      google_review_url: null,
    });
    expect(payload.message).toContain("Nemokamas pradinis pavyzdys");
    expect(payload.message).toContain("Automatizacija arba integracija");
    expect(payload.message).toContain("https://imone.lt");
    expect(payload.message).toContain(enquiry.message);
  });
});
