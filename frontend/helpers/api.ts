import { getUserAccessToken, setUserAccessToken } from "./userAccessToken";

export function getFetcher(requireUserAccessToken: boolean, throwOnErroneousResponse: boolean) {
  async function fetcher(endpoint: string, init?: RequestInit) {
    if (requireUserAccessToken && getUserAccessToken() === null) {
      return undefined;
    }

    let response: Response;

    try {
      response = await apiCall(endpoint, init);
    } catch (e) {
      throw new Error("An error occurred while fetching the data.");
    }

    const responseJson = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        setUserAccessToken(null);
      }

      if (throwOnErroneousResponse) {
        throw new Error(responseJson.detail || "An error has occurred while fetching the data.");
      }

      return undefined;
    }

    return responseJson;
  }

  return fetcher;
}

export async function apiCall(endpoint: string, init?: RequestInit): Promise<Response> {
  const userAccessToken = getUserAccessToken();

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...userAccessToken === null ? {} : { authorization: `bearer ${userAccessToken}` },
    ...init?.headers,
  };

  return fetch(`${window.poeticMetric?.restApiBaseUrl}${endpoint}`, { ...init, headers });
}

export const api = {
  delete(endpoint: string, payload?: object, config?: Omit<RequestInit, "body" | "method">) {
    return apiCall(endpoint, { ...config, body: payload ? JSON.stringify(payload) : undefined, method: "DELETE" });
  },
  get: apiCall,
  patch(endpoint: string, payload: object, config?: Omit<RequestInit, "body" | "method">) {
    return apiCall(endpoint, { ...config, body: JSON.stringify(payload), method: "PATCH" });
  },
  post(endpoint: string, payload?: object, config?: Omit<RequestInit, "body" | "method">) {
    return apiCall(endpoint, { ...config, body: JSON.stringify(payload), method: "POST" });
  },
  put(endpoint: string, payload: object, config?: Omit<RequestInit, "body" | "method">) {
    return apiCall(endpoint, { ...config, body: JSON.stringify(payload), method: "PUT" });
  },
};
