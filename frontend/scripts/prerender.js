import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { getBaseOutDir, isHostedOptions } from "./base.js";
import getHtmlFromTemplate from "./getHtmlFromTemplate.js";
import { getRoutes } from "./routes.js";

const baseOutDir = getBaseOutDir();

const template = readFileSync(join(baseOutDir, "static", "index.html"), "utf-8");
const { render: hostedRender } = await import("../dist/hosted/server/entry-server.js"); // eslint-disable-line import/no-unresolved
const { render: nonHostedRender } = await import("../dist/non-hosted/server/entry-server.js"); // eslint-disable-line import/no-unresolved

async function prerender() {
  for (const isHostedOption of isHostedOptions) {
    process.env.VITE_IS_HOSTED = isHostedOption;
    const baseOutDir = getBaseOutDir();
    const routes = getRoutes();

    const render = process.env.VITE_IS_HOSTED === "true" ? hostedRender : nonHostedRender;

    for (const path of routes) {
      const filePath = join(baseOutDir, "static", `${path === "/" ? "index" : path}.html`);

      mkdirSync(dirname(filePath), { recursive: true });

      const rendered = await render(path);
      const html = getHtmlFromTemplate(template, rendered);

      writeFileSync(filePath, html);
    }
  }
}

prerender().catch((e) => {
  console.error(e); // eslint-disable-line no-console
});
