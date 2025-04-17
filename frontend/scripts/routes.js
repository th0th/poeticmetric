import { range } from "lodash-es";
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
  const routesFileContent = readFileSync("src/components/App/index.tsx", "utf-8");
  const routePaths = [...routesFileContent.matchAll(/path="(.*)"/ig)].map((d) => d[1]);
  const routes = ["/404"];

  for (const routePath of routePaths) {
    handleRoutePath(routes, routePath);
  }

  return routes;
}

function handleRoutePath(routes, routePath) {
  if (routePath === "/blog/page/:blogPage") {
    for (const blogPage of range(2, Math.ceil(blogPostDirectories.length / 10) + 1)) {
      routes.push(`/blog/page/${blogPage}`);
    }
  } else if (routePath === "/blog/:blogPostSlug") {
    for (const blogPostDirectory of blogPostDirectories) {
      routes.push(`/blog/${blogPostDirectory.split("_")[1]}`);
    }
  } else if (routePath === "/docs/:docsCategorySlug/:docsArticleSlug") {
    for (const docsPath of docsPaths) {
      routes.push(`/docs/${docsPath}`);
    }
  } else {
    routes.push(routePath);
  }
}
