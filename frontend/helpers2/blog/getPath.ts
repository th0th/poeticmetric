import path from "path";

export default function getPath() {
  return path.join(process.cwd(), "blog");
}
