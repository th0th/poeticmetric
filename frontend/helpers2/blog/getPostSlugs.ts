import fs from "fs";
import getPath from "./getPath";

export default function getPostSlugs(): Array<string> {
  return fs.readdirSync(getPath()).map((p) => p.split("_")[1].slice(0, -4)).reverse();
}
