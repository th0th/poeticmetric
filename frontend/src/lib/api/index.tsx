import { getUserAccessToken, setUserAccessToken } from "../user-access-token";

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

export async function apiCall(path: string, init?: RequestInit): Promise<Response> {
  const userAccessToken = getUserAccessToken();

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...userAccessToken === null ? {} : { authorization: `bearer ${userAccessToken}` },
    ...init?.headers,
  };

  return fetch(`${import.meta.env.VITE_REST_API_BASE_URL}${path}`, { ...init, headers });
}

export function getFetcher(requireUserAccessToken: boolean) {
  async function fetcher(endpoint: string, init?: RequestInit) {
    if (requireUserAccessToken && getUserAccessToken() === null) {
      return null;
    }

    let response: Response;

    try {
      response = await apiCall(endpoint, init);
    } catch (e) {
      throw new Error("An error occurred while calling the API.");
    }

    const responseJson = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        setUserAccessToken(null);
      }

      throw new Error(responseJson.detail || "API responded with an error.");
    }

    return responseJson;
  }

  return fetcher;
}
