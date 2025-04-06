import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import getBaseDir from "./base.js";
import getHtmlFromTemplate from "./getHtmlFromTemplate.js";
import getRoutes from "./getRoutes.js";

const baseDir = getBaseDir();

const template = readFileSync(join(baseDir, "dist", "static", "index.html"), "utf-8");
const { render } = await import("../dist/server/entry-server.js"); // eslint-disable-line import/no-unresolved

async function prerender() {
  const routes = getRoutes();

  for (const path of routes) {
    const filePath = join(baseDir, "dist", "static", `${path === "/" ? "index" : path}.html`);

    mkdirSync(dirname(filePath), { recursive: true });

    const html = getHtmlFromTemplate(template, await render((new URL(process.env.VITE_BASE_URL)).hostname, path));

    writeFileSync(filePath, html);

    if (path === "/s") {
      const statusPageWithCustomDomainPath = join(baseDir, "dist", "static", "status-page-with-domain.html");

      const statusPageWithCustomDomainHtml = getHtmlFromTemplate(
        template,
        await render("", "/"),
      );

      writeFileSync(statusPageWithCustomDomainPath, statusPageWithCustomDomainHtml);
    }
  }
}

prerender().catch((e) => {
  console.error(e); // eslint-disable-line no-console
});
