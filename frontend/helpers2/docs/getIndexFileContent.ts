import fs from "fs";
import path from "path";
import getPath from "./getPath";

export default function getIndexFileContent() {
  const docsPath = getPath();
  const articlePath = path.join(docsPath, "index.mdx");

  return fs.readFileSync(articlePath, "utf-8");
}
