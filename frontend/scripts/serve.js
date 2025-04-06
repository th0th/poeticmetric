import express from "express";
import fs from "node:fs/promises";
import { join } from "node:path";
import getBaseDir from "./base.js";
import getHtmlFromTemplate from "./getHtmlFromTemplate.js";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 80;
const base = process.env.BASE || "/";

const baseDir = getBaseDir();

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile(join(baseDir, "dist", "client", "index.html"), "utf-8")
  : "";

const ssrManifest = isProduction
  ? await fs.readFile(join(baseDir, "dist", "client", ".vite", "ssr-manifest.json"), "utf-8")
  : undefined;

// Create http server
const app = express();

// Add Vite or respective production middlewares
let vite;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({ appType: "custom", base, server: { middlewareMode: true } });

  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;

  app.use(compression());
  app.use(base, sirv(join(baseDir, "dist", "client"), { extensions: [] }));
}

// Serve HTML
app.use("*all", async (req, res) => {
  try {
    const { hostname, originalUrl } = req;

    const template = isProduction
      ? templateHtml
      : await vite.transformIndexHtml(originalUrl, await fs.readFile(join(baseDir, "index.html"), "utf-8"));

    const render = isProduction
      ? (await import("../dist/server/entry-server.js")).render // eslint-disable-line import/no-unresolved
      : (await vite.ssrLoadModule(join(baseDir, "src", "entry-server.jsx"))).render;

    const html = getHtmlFromTemplate(template, await render(hostname, originalUrl, ssrManifest));

    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack); // eslint-disable-line no-console
    res.status(500).send(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`); // eslint-disable-line no-console
});
