import fs from "fs";
import getPath from "./getPath";

export default function getPostFileRelativePath(slug: string) {
  const postFileRelativePath = fs.readdirSync(getPath()).find((p) => new RegExp(`^[0-9]{4}-[0-9]{2}-[0-9]{2}_${slug}.mdx`).test(p));

  if (postFileRelativePath === undefined) {
    throw new Error("Post not found.");
  }

  return postFileRelativePath;
}
