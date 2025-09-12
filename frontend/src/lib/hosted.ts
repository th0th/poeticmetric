import { isHosted } from "~/lib/base";

export function getIsHosted() {
  return isHosted === "true";
}
