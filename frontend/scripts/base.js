import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const placeholderBaseURL = process.env.VITE_BASE_URL || "https://placeholder.poeticmetric.com";
export const placeholderRestAPIBaseURL = process.env.VITE_REST_API_BASE_URL || "https://api.placeholder.poeticmetric.com";

export function getBaseDir() {
  return dirname(dirname(fileURLToPath(import.meta.url)));
}
