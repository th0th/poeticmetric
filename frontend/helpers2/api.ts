import apiCall from "./apiCall";

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

export default api;
