export default function getRestApiUrl(path?: string): string | undefined {
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
