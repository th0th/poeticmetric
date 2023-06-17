import fs from "fs";
import path from "path";
import getCategoryPathBySlug from "./getCategoryPathBySlug";

export default function getArticleFileContent(categorySlug: string, articleSlug: "index" | string): string {
  const categoryPath = getCategoryPathBySlug(categorySlug);

  const articleRelativePath = articleSlug === "index"
    ? "index.mdx"
    : fs.readdirSync(categoryPath).find((p) => new RegExp(`^[0-9]*?_${articleSlug}.mdx`).test(p));

  if (articleRelativePath === undefined) {
    throw new Error("Article not found.");
  }

  const articlePath = path.join(categoryPath, articleRelativePath);

  return fs.readFileSync(articlePath, "utf-8");
}
