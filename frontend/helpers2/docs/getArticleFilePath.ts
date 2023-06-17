import fs from "fs";
import path from "path";
import getCategoryPathBySlug from "./getCategoryPathBySlug";

export default function getArticleFilePath(categorySlug: string, articleSlug: "index" | string): string {
  const categoryPath = getCategoryPathBySlug(categorySlug);

  const articleRelativePath = articleSlug === "index"
    ? "index.mdx"
    : fs.readdirSync(categoryPath).find((p) => new RegExp(`^[0-9]*?_${articleSlug}.mdx`).test(p));

  if (articleRelativePath === undefined) {
    throw new Error("Article not found.");
  }

  return path.join(categoryPath, articleRelativePath);
}
