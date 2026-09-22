import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.js";
import { AppRoutes } from "./App";
import {
  SeoProvider,
  renderSeoHead,
  type SeoCollector,
} from "./components/public/seo";

/** Wait for lazy public components so crawlers receive the actual page content. */
export function render(path: string): Promise<{ html: string; head: string }> {
  return new Promise((resolve, reject) => {
    const collector: SeoCollector = { current: null };
    const output = new PassThrough();
    let html = "";
    let renderError: unknown;
    const timer = setTimeout(() => {
      stream.abort();
      reject(new Error(`Static rendering timed out: ${path}`));
    }, 30_000);

    output.setEncoding("utf8");
    output.on("data", (chunk: string) => {
      html += chunk;
    });
    output.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    output.on("end", () => {
      clearTimeout(timer);
      if (renderError) return reject(renderError);
      if (!collector.current)
        return reject(new Error(`Missing SEO metadata for ${path}`));
      resolve({ html, head: renderSeoHead(collector.current) });
    });

    const stream = renderToPipeableStream(
      <SeoProvider value={collector}>
        <StaticRouter location={path}>
          <AppRoutes />
        </StaticRouter>
      </SeoProvider>,
      {
        onAllReady() {
          stream.pipe(output);
        },
        onShellError(error) {
          clearTimeout(timer);
          reject(error);
        },
        onError(error) {
          renderError = error;
        },
      },
    );
  });
}
