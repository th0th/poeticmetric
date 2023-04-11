import { getIsHosted } from "./getIsHosted";

export function getRestApiUrl(path?: string): string | undefined {
  let baseUrl: string | undefined;

  if (!!process.env.NEXT_PUBLIC_REST_API_BASE_URL) {
    baseUrl = process.env.NEXT_PUBLIC_REST_API_BASE_URL;
  } else if (typeof window !== "undefined") {
    baseUrl = window.poeticMetric?.restApiBaseUrl;
  }

  if (baseUrl === undefined) {
    return undefined;
  }

  return `${baseUrl}${path || ""}`;
}

export function getTrackerUrl(): string | undefined {
  const path = "/pm.js";

  return getIsHosted() ? getUrl(path) : getRestApiUrl(path);
}

export function getUrl(path?: string): string | undefined {
  let baseUrl: string | undefined;

  if (!!process.env.NEXT_PUBLIC_BASE_URL) {
    baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  } else if (typeof window !== "undefined") {
    baseUrl = window.poeticMetric?.frontendBaseUrl;
  }

  if (baseUrl === undefined) {
    return undefined;
  }

  return `${baseUrl}${path || ""}`;
}
