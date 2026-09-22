import { describe, expect, it } from "vitest";
import { renderSeoHead, type SeoProps } from "../src/components/public/seo";

const page: SeoProps = {
  title: "Svetainių kūrimas | Skenis",
  description: "Svetainės pagal jūsų verslo poreikius.",
  path: "/paslaugos/svetaines",
  service: {
    name: "Interneto svetainių kūrimas",
    description: "Verslo svetainės ir jų priežiūra.",
  },
};

function schema(head: string) {
  const content = head.match(/<script[^>]*>(.*?)<\/script>/)?.[1];
  if (!content) throw new Error("Missing structured data");
  return JSON.parse(content) as { "@graph": Record<string, unknown>[] };
}

describe("public-page SEO", () => {
  it("uses one canonical without tracking parameters or hash fragments", () => {
    const head = renderSeoHead({
      ...page,
      path: "/paslaugos/svetaines/?utm_source=demo#kontaktai",
    });
    expect(head).toContain(
      'rel="canonical" href="https://skenis.lt/paslaugos/svetaines"',
    );
    expect(head).not.toContain("utm_source");
    expect(head).toContain(
      'property="og:url" content="https://skenis.lt/paslaugos/svetaines"',
    );
    expect(head).toContain('name="twitter:title"');
  });

  it("connects services and useful breadcrumbs to the real organization", () => {
    const graph = schema(renderSeoHead(page))["@graph"];
    const service = graph.find((item) => item["@type"] === "Service");
    const organization = graph.find((item) => item["@type"] === "Organization");
    const breadcrumbs = graph.find(
      (item) => item["@type"] === "BreadcrumbList",
    );
    expect(service?.provider).toEqual({
      "@id": "https://skenis.lt/#organization",
    });
    expect(organization?.email).toBe("skenis.info@gmail.com");
    expect(organization?.telephone).toEqual(["+37062357946", "+37062375231"]);
    expect(breadcrumbs?.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Pradžia",
        item: "https://skenis.lt/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Paslaugos",
        item: "https://skenis.lt/paslaugos",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.service?.name,
        item: "https://skenis.lt/paslaugos/svetaines",
      },
    ]);
    expect(graph.some((item) => item["@type"] === "LocalBusiness")).toBe(false);
  });

  it("marks private and missing pages as noindex without public schema", () => {
    const head = renderSeoHead({ ...page, noIndex: true, path: "/admin" });
    expect(head).toContain('content="noindex, nofollow"');
    expect(head).not.toContain("application/ld+json");
  });

  it("escapes content before placing it into HTML or JSON-LD", () => {
    const injected = '</script><script>alert("test")</script>';
    const head = renderSeoHead({
      ...page,
      title: injected,
      description: 'Pasiūlymas "A & B"',
      service: { name: injected, description: injected },
    });
    expect(head).not.toContain(injected);
    expect(head).toContain("&quot;A &amp; B&quot;");
    expect(
      schema(head)["@graph"].find((item) => item["@type"] === "Service")?.name,
    ).toBe(injected);
  });
});
