import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { demoOptions } from "../src/data/public-content";
import { estimateArea, normalizeQuantity, resolveDemo } from "../src/lib/demo-state";
import { DemoGallery } from "../src/components/public/demo-gallery";
import { ProjectsShowcase } from "../src/motion/scenes";

describe("demo deep links and one selected interface", () => {
  it.each(demoOptions)("renders only $id with its matching tab and enquiry service", demo => {
    const html = renderToStaticMarkup(createElement(StaticRouter,
      { location: "/sprendimai?demo=" + demo.id + "#demonstracija" },
      createElement(DemoGallery)));
    expect(html.match(/role="tabpanel"/g)).toHaveLength(1);
    expect(html.match(/aria-selected="true"/g)).toHaveLength(1);
    expect(html).toContain('data-demo="' + demo.id + '"');
    expect(html).toContain("/kontaktai?service=" + demo.slug + "&amp;intent=project");
    expect(html).toContain(demo.kind);
    expect(html).toContain("KLIENTAS GAUNA");
    expect(html).toContain("KOMANDA MATYTŲ");
  });
  it("uses registration for missing and invalid IDs, preserving valid IDs over legacy hashes", () => {
    expect(resolveDemo(null).id).toBe("registracija");
    expect(resolveDemo("unknown").id).toBe("registracija");
    expect(resolveDemo("komanda", "#demo-booking").id).toBe("komanda");
    expect(resolveDemo(null, "#demo-website").id).toBe("svetaine");
    expect(resolveDemo(null, "#demo-calculator").id).toBe("skaiciuokle");
  });
  it("limits home to three explanatory previews and direct scenario actions", () => {
    const html = renderToStaticMarkup(createElement(StaticRouter, { location: "/" }, createElement(ProjectsShowcase)));
    expect(html.match(/class="home-example"/g)).toHaveLength(3);
    for (const id of ["registracija", "komanda", "svetaine"]) expect(html).toContain("?demo=" + id + "#demonstracija");
    expect(html).not.toContain("?demo=asistentas");
    expect(html).toContain("Vizuali peržiūra");
    expect(html).toContain("Peržiūrėti svetainės koncepciją");
  });
  it("classifies the static concept and two prepared simulations accurately", () => {
    expect(resolveDemo("svetaine").kind).toBe("Dizaino koncepcija");
    for (const id of ["asistentas", "automatizacija"]) expect(resolveDemo(id).kind).toBe("Scenarijaus simuliacija");
  });
});
describe("illustrative amount calculations", () => {
  it("shows a total consistent with each chosen work component", () => {
    expect(estimateArea(80, false)).toEqual({ base: 1200, extra: 0, total: 1200 });
    expect(estimateArea(80, true)).toEqual({ base: 1200, extra: 560, total: 1760 });
  });
  it.each([[0, 1], [-2, 1], [25, 20], [2.9, 2], ["not-a-number", 1], ["", 1], [Infinity, 1]])("keeps cart quantity %s in the integer range 1–20", (input, expected) => {
    expect(normalizeQuantity(input)).toBe(expected);
  });
});
