import { createContext } from "react";

export type AuthAndApiContextValue = {
  api: {
    delete(endpoint: string, payload?: object, config?: Omit<RequestInit, "body" | "method">): Promise<Response>;
    get(endpoint: string, config?: Omit<RequestInit, "body" | "method">): Promise<Response>;
    patch(endpoint: string, payload?: object, config?: Omit<RequestInit, "body" | "method">): Promise<Response>;
    post(endpoint: string, payload?: object, config?: Omit<RequestInit, "body" | "method">): Promise<Response>;
  };
  inProgress: boolean;
  organization: HydratedOrganization | null;
  setUserAccessToken: (userAccessToken: string | null) => void;
  user: AuthUser | null;
};

export const AuthAndApiContext = createContext<AuthAndApiContextValue>({
  api: {
    delete(endpoint: string) {
      return fetch(endpoint);
    },
    get(endpoint: string) {
      return fetch(endpoint);
    },
    patch(endpoint: string) {
      return fetch(endpoint);
    },
    post(endpoint: string) {
      return fetch(endpoint);
    },
  },
  inProgress: false,
  organization: null,
  setUserAccessToken: (_: string | null) => null,
  user: null,
});
