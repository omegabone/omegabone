// Build-time renderer used by scripts/prerender.mjs. Not shipped to browsers.
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";
import { routes } from "./app/routes";
import { AppShell } from "./app/AppShell";

export { PAGES, UNLISTED, SITE_URL, renderHeadTags } from "./app/seo";

const handler = createStaticHandler(routes);

export async function render(url: string): Promise<string> {
  const context = await handler.query(new Request(`https://omegabone.com${url}`));
  if (context instanceof Response) throw new Error(`${url} redirected`);
  const router = createStaticRouter(handler.dataRoutes, context);

  return new Promise((resolve, reject) => {
    let html = "";
    const stream = new PassThrough();
    stream.on("data", (chunk) => (html += chunk));
    stream.on("end", () => resolve(html));
    const { pipe } = renderToPipeableStream(
      <AppShell>
        <StaticRouterProvider router={router} context={context} hydrate={false} />
      </AppShell>,
      {
        // Wait for lazy page chunks so the output holds the full page, not the spinner
        onAllReady: () => pipe(stream),
        onShellError: reject,
        onError: reject,
      },
    );
  });
}
