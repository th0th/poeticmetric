import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export default function getBaseDir() {
  return dirname(dirname(fileURLToPath(import.meta.url)));
}
