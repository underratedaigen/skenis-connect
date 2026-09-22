import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const distribution = path.join(projectRoot, "dist");
const serverOutput = path.join(
  projectRoot,
  "node_modules",
  ".cache",
  "skenis-prerender",
);
const template = await readFile(path.join(distribution, "index.html"), "utf8");
const sitemap = await readFile(
  path.join(projectRoot, "public", "sitemap.xml"),
  "utf8",
);
const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  ([, location]) => {
    const url = new URL(location);
    if (url.origin !== "https://skenis.lt")
      throw new Error(`Unexpected sitemap URL: ${location}`);
    return url.pathname;
  },
);

if (
  !routes.length ||
  !template.includes("<!-- seo:start -->") ||
  !template.includes('<div id="root"></div>')
) {
  throw new Error("Missing sitemap routes or HTML template markers.");
}

await build({
  root: projectRoot,
  mode: "production",
  publicDir: false,
  build: {
    ssr: path.join(projectRoot, "src", "entry-server.tsx"),
    outDir: serverOutput,
    emptyOutDir: true,
  },
});

const { render } = await import(
  pathToFileURL(path.join(serverOutput, "entry-server.js")).href
);
for (const route of [...routes, "/404"]) {
  const { html, head } = await render(route);
  if (
    route !== "/404" &&
    (head.includes('content="noindex') ||
      !head.includes(`href="https://skenis.lt${route}"`))
  ) {
    throw new Error(
      `Public route is missing or has incorrect canonical metadata: ${route}`,
    );
  }
  if (route === "/404" && !head.includes('content="noindex')) {
    throw new Error("The 404 page must have noindex metadata.");
  }
  const document = template
    .replace(
      /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/,
      () => `<!-- seo:start -->\n    ${head}\n    <!-- seo:end -->`,
    )
    .replace(
      '<div id="root"></div>',
      () => `<div id="root" data-prerender-path="${route}">${html}</div>`,
    );
  const destination =
    route === "/404"
      ? path.join(distribution, "404.html")
      : path.join(distribution, route.replace(/^\//, ""), "index.html");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, document, "utf8");
}

// The host can use this for /admin/* and /r/* without exposing public-page metadata.
const fallback = template.replace(
  /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/,
  () =>
    [
      "<!-- seo:start -->",
      "<title>Skenis</title>",
      '<meta name="robots" content="noindex, nofollow" data-skenis-seo="true" />',
      "<!-- seo:end -->",
    ].join("\n    "),
);
await writeFile(path.join(distribution, "spa.html"), fallback, "utf8");
console.log(
  `Prerendered ${routes.length} public pages, 404.html, and private-route SPA fallback.`,
);
