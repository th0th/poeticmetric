import { baseURL, isHosted, restAPIBaseURL } from "~/lib/base";

export function getTrackerURL() {
  return `${isHosted === "true" ? baseURL : restAPIBaseURL}/pm.js`;
}
