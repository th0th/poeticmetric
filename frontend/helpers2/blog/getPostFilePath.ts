import path from "path";
import getPostFileRelativePath from "~helpers/blog/getPostFileRelativePath";
import getPath from "./getPath";

export default function getPostFilePath(slug: string) {
  return path.join(getPath(), getPostFileRelativePath(slug));
}
