import fs from "fs";
import getCategoryPathBySlug from "./getCategoryPathBySlug";

export default function getCategoryArticleSlugs(categorySlug: string) {
  const categoryPath = getCategoryPathBySlug(categorySlug);

  return fs
    .readdirSync(categoryPath)
    .filter((p) => p !== "index.mdx")
    .map((p) => p.split("_")[1].slice(0, -4));
}
