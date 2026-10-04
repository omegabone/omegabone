// Runs after `vite build`. Writes a real HTML file for every public page, so
// crawlers that don't run JavaScript still get the page text, links, title,
// description and canonical URL. Also writes sitemap.xml and llms.txt.
//
//   dist/index.html            prerendered home page
//   dist/<path>/index.html     prerendered page for each public route
//   dist/_shell.html           empty app shell for every other URL (see vercel.json)
import { build } from "vite";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrOut = path.join(root, "node_modules/.prerender");

await build({
  root,
  logLevel: "warn",
  build: { ssr: "src/entry-server.tsx", outDir: ssrOut, emptyOutDir: true, copyPublicDir: false },
});
const { render, PAGES, UNLISTED, SITE_URL, renderHeadTags } = await import(
  pathToFileURL(path.join(ssrOut, "entry-server.js")).href
);

const template = await fs.readFile(path.join(dist, "index.html"), "utf8");
// Default <title> + description in index.html, replaced with each page's own tags
const DEFAULT_TITLE = /<title>.*?<\/title>\s*<meta name="description"[^>]*>\s*/;
const EMPTY_ROOT = '<div id="root"><div class="page-loading"></div></div>';
if (!DEFAULT_TITLE.test(template) || !template.includes(EMPTY_ROOT)) {
  throw new Error("index.html no longer matches what prerender.mjs expects");
}

function page(url, body) {
  let html = template.replace(DEFAULT_TITLE, renderHeadTags(url) + "\n    ");
  if (body !== undefined) html = html.replace(EMPTY_ROOT, `<div id="root" data-prerendered="1">${body}</div>`);
  return html;
}

async function write(url, html) {
  const file = url === "/" ? path.join(dist, "index.html") : path.join(dist, url, "index.html");
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, html);
}

await fs.writeFile(path.join(dist, "_shell.html"), template);

const failed = [];
for (const url of Object.keys(PAGES)) {
  try {
    await write(url, page(url, await render(url)));
  } catch (err) {
    // Still ship the right <head>, with the page drawn in the browser as before
    failed.push(`${url}: ${err.message}`);
    await write(url, page(url));
  }
}
// Unlisted pages (paid course vault, practice tools, forms): correct <head>
// (canonical / noindex) but no prerendered body, so nothing paid leaks into HTML.
for (const url of Object.keys(UNLISTED)) await write(url, page(url));

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(PAGES)
  .map((url) => `  <url><loc>${SITE_URL}${url === "/" ? "/" : url}</loc><lastmod>${today}</lastmod></url>`)
  .join("\n")}
</urlset>
`;
await fs.writeFile(path.join(dist, "sitemap.xml"), sitemap);

const llms = `# Omega Bone

> Omega Bone is a vocal coach and music educator with 30+ years of experience teaching singers, students and entrepreneurs. Contact: singer@omegabone.com

## Pages

${Object.entries(PAGES)
  .map(([url, m]) => `- [${m.title}](${SITE_URL}${url}): ${m.description}`)
  .join("\n")}
`;
await fs.writeFile(path.join(dist, "llms.txt"), llms);

await fs.rm(ssrOut, { recursive: true, force: true });
console.log(`prerendered ${Object.keys(PAGES).length - failed.length}/${Object.keys(PAGES).length} pages`);
if (failed.length) console.warn("rendered in browser only:\n  " + failed.join("\n  "));
