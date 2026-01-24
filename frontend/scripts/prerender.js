import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { getBaseOutDir, isHostedOptions } from "./base.js";
import getHtmlFromTemplate from "./getHtmlFromTemplate.js";
import { getRoutes } from "./routes.js";

const { render: hostedRender } = await import("../dist/hosted/server/entry-server.js");  
const { render: selfHostedRender } = await import("../dist/self-hosted/server/entry-server.js");  

async function prerender() {
  for (const isHostedOption of isHostedOptions) {
    process.env.VITE_IS_HOSTED = isHostedOption;
    const baseOutDir = getBaseOutDir();
    const routes = getRoutes();

    const template = await readFile(join(baseOutDir, "static", "index.html"), "utf-8");

    const render = process.env.VITE_IS_HOSTED === "true" ? hostedRender : selfHostedRender;

    for (const path of routes) {
      const filePath = join(baseOutDir, "static", `${path === "/" ? "index" : path}.html`);

      await mkdir(dirname(filePath), { recursive: true });

      const rendered = await render(path);
      const html = getHtmlFromTemplate(template, rendered);

      await writeFile(filePath, html);
    }
  }
}

prerender().catch((e) => {
  console.error(e); // eslint-disable-line no-console
});
