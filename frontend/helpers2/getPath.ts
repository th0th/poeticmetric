import path from "path";

export default function getPath(relativePath: string) {
  return path.join(process.cwd(), relativePath);
}
