import { writeFile } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";
import { SitemapStream, streamToPromise } from "sitemap";
import { getBaseDir, baseURL } from "./base.js";
import { getRoutes } from "./routes.js";

const baseDir = getBaseDir();
const routes = getRoutes();

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

  await writeFile(join(baseDir, "public", "sitemap.xml"), data, function (error) {
    if (error) throw error;
  });
}

main().catch((error) => {
  throw error;
});
