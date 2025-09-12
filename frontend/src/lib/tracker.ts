import { baseURL, restAPIBaseURL } from "~/lib/base";
import { getIsHosted } from "~/lib/hosted";

export function getTrackerURL() {
  return `${getIsHosted() ? baseURL : restAPIBaseURL}/pm.js`;
}
