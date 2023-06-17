import fs from "fs";
import path from "path";
import getPath from "./getPath";

export default function getCategoryPathBySlug(categorySlug: string) {
  const docsPath = getPath();
  const categoryRelativePath = fs.readdirSync(docsPath).find((p) => new RegExp(`^[0-9]*?_${categorySlug}$`).test(p));

  if (categoryRelativePath === undefined) {
    throw new Error("Category not found.");
  }

  return path.join(docsPath, categoryRelativePath);
}
