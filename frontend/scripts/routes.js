import { range, uniq } from "lodash-es";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getBaseDir } from "./base.js";

const baseDir = getBaseDir();

const blogPostDirectories = readdirSync("src/blog", { withFileTypes: true })
  .filter((b) => b.isDirectory())
  .map((d) => d.name);

const docsPaths = readdirSync(join(baseDir, "src", "docs"), { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
  .map((d) => {
    return readdirSync(join(baseDir, "src", "docs", d.name), { withFileTypes: true })
      .filter((d2) => d2.isDirectory())
      .map((d2) => `${d.name.split("_")[1]}/${d2.name.split("_")[1]}`);
  }).flat().sort();

export function getRoutes() {
  const routesFileContent = readFileSync("src/routes.ts", "utf-8");

  let [routerRoutesStr] = routesFileContent.match(/(const routes.*?;)/s);
  routerRoutesStr = routerRoutesStr.replace(/const routes.*?=/s, "routerRoutes =");
  routerRoutesStr = routerRoutesStr.replace(
    /Component:\s+(?:[a-zA-Z_][a-zA-Z0-9_]*\({.*?}\)|[^,]+),|lazy:\s*\(\)\s*=>\s*import\("([^"]*?)"\),/gs,
    "hasC: true,",
  );

  let routerRoutes;

  eval(routerRoutesStr);

  /** @type {Array<string>} */
  const routes = [];

  for (const routerRoute of routerRoutes) {
    handleRouteObject(routes, undefined, routerRoute);
  }

  return uniq(routes).sort();
}

function handleRouteObject(routes, parentRoute, routeObject) {
  const route = parentRoute !== undefined || routeObject.path !== undefined
    ? `${parentRoute || ""}${parentRoute !== undefined && routeObject.path ? "/" : ""}${routeObject.path || ""}`
    : undefined;

  if (route !== undefined && routeObject.hasC) {
    if (route === "*") {
      routes.push("/404");
    } else if (route === "/") {
      routes.push("/");
    } else if (route === "blog/page/:blogPage") {
      for (const blogPage of range(2, Math.ceil(blogPostDirectories.length / 10) + 1)) {
        routes.push(`/blog/page/${blogPage}`);
      }
    } else if (route === "blog/:blogPostSlug") {
      for (const blogPostDirectory of blogPostDirectories) {
        routes.push(`/blog/${blogPostDirectory.split("_")[1]}`);
      }
    } else if (route === "docs/:docsCategorySlug/:docsArticleSlug") {
      for (const docsPath of docsPaths) {
        routes.push(`/docs/${docsPath}`);
      }
    } else {
      routes.push(`/${route}`);
    }
  }

  if (routeObject.children) {
    for (const child of routeObject.children) {
      handleRouteObject(routes, route, child);
    }
  }
}
