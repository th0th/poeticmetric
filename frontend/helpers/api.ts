import { getUserAccessToken } from "./userAccessToken";

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
