import { describe, expect, it } from "vitest";
import { services, primaryServices } from "../src/data/services";
import { projects } from "../src/data/projects";

describe("public service architecture", () => {
  it("keeps all 80 requested capabilities with no gaps or duplicates", () => {
    const ids = services
      .flatMap((service) => service.capabilityIds)
      .sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 80 }, (_, i) => i + 1));
    for (const service of services)
      expect(service.capabilities.length).toBe(service.capabilityIds.length);
  });
  it("has eight primary groups and a discoverable reputation category", () => {
    expect(primaryServices).toHaveLength(8);
    expect(new Set(services.map((service) => service.slug)).size).toBe(
      services.length,
    );
    expect(
      services.find((service) => service.slug === "atsiliepimai"),
    ).toBeDefined();
  });
  it("links labelled concepts to real service pages without invented results", () => {
    for (const project of projects) {
      expect(
        services.some((service) => service.slug === project.serviceSlug),
      ).toBe(true);
      expect(["concept", "demo"]).toContain(project.kind);
      expect(project.client).toBeUndefined();
      expect(project.results).toBeUndefined();
    }
  });
});
