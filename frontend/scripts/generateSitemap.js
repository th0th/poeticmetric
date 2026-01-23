import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Readable } from "node:stream";
import { SitemapStream, streamToPromise } from "sitemap";
import { baseURL, getBaseDir, getBaseOutDir, isHostedOptions } from "./base.js";
import { getRoutes } from "./routes.js";

const baseDir = getBaseDir();

const routesToExclude = [
  "/404",
  "/billing",
  "/bootstrap",
  "/docs",
  "/email-address-verification",
  "/password-reset",
  "/settings(/.*)?",
  "/s",
  "/sites(/.*)?",
  "/team(/.*)?",
];

const routesToExcludeRegex = routesToExclude.map((route) => new RegExp(`^${route}$`, "m"));

async function main() {
  for (const isHostedOption of isHostedOptions) {
    process.env.VITE_IS_HOSTED = isHostedOption;
    const baseOutDir = getBaseOutDir();
    const routes = getRoutes();

    const links = routes
      .filter((route) => {
        for (const routeToExcludeRegex of routesToExcludeRegex) {
          if (routeToExcludeRegex.test(route)) {
            return false;
          }
        }

        return true;
      })
      .map((route) => {
        return { url: route };
      });

    const stream = new SitemapStream({
      hostname: baseURL,
      xmlns: { image: false, news: false, video: false, xhtml: false },
    });

    const data = (await streamToPromise(Readable.from(links).pipe(stream))).toString();

    await mkdir(join(baseOutDir, "public"), { recursive: true });
    await writeFile(join(baseOutDir, "public", "sitemap.xml"), data);
  }
}

main().catch((error) => {
  throw error;
});
