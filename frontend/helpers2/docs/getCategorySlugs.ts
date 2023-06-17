import fs from "fs";
import getPath from "./getPath";

export default function getCategorySlugs(): Array<string> {
  const docsPath = getPath();

  return fs
    .readdirSync(docsPath)
    .filter((p) => p !== "index.mdx")
    .map((p) => p.split("_")[1]);
}
