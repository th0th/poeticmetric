import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { getBaseDir, placeholderBaseURL } from "./base.js";
import getHtmlFromTemplate from "./getHtmlFromTemplate.js";
import { getRoutes } from "./routes.js";

const baseDir = getBaseDir();

const template = readFileSync(join(baseDir, "dist", "static", "index.html"), "utf-8");
const { render } = await import("../dist/server/entry-server.js"); // eslint-disable-line import/no-unresolved

async function prerender() {
  const routes = getRoutes();

  for (const path of routes) {
    const filePath = join(baseDir, "dist", "static", `${path === "/" ? "index" : path}.html`);

    mkdirSync(dirname(filePath), { recursive: true });

    const html = getHtmlFromTemplate(template, await render((new URL(placeholderBaseURL)).hostname, path));

    writeFileSync(filePath, html);
  }
}

prerender().catch((e) => {
  console.error(e); // eslint-disable-line no-console
});
