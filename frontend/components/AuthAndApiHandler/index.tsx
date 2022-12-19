import React, { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { AuthAndApiContext, AuthAndApiContextValue } from "../../contexts";
import { getUserAccessToken, hydrateOrganization, setUserAccessToken as setUserAccessTokenInLocalStorage } from "../../helpers";

type AuthAndApiHandlerProps = {
  children: React.ReactNode;
};

type State = {
  isLocalStorageChecked: boolean;
  userAccessToken: string | null;
};

export function AuthAndApiHandler({ children }: AuthAndApiHandlerProps) {
  const [state, setState] = useState<State>({ isLocalStorageChecked: false, userAccessToken: null });
  const { data: userData, error: userError } = useSWR<AuthUser>(state.userAccessToken === null ? null : "/users/me");
  const {
    data: organizationData,
    error: organizationError,
  } = useSWR<Organization>(state.userAccessToken === null ? null : "/organization");

  const setUserAccessToken = useCallback((userAccessToken: string | null): void => {
    setUserAccessTokenInLocalStorage(userAccessToken);

    setState((s) => ({ ...s, userAccessToken }));
  }, [setState]);

  const value = useMemo<AuthAndApiContextValue>(() => {
    let user: AuthUser | null = null;
    let organization: HydratedOrganization | null = null;

    if (userData !== undefined && organizationData !== undefined) {
      user = userData;
      organization = hydrateOrganization(organizationData);
    }

    const inProgress = !state.isLocalStorageChecked
      || (state.userAccessToken === null && user !== null)
      || (state.userAccessToken !== null && user === null);

    function apiCall(endpoint: URL | RequestInfo, init?: RequestInit) {
      const headers: HeadersInit = {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...state.userAccessToken === null ? {} : { authorization: `bearer ${state.userAccessToken}` },
        ...init?.headers,
      };

      return fetch(`${process.env.NEXT_PUBLIC_POETICMETRIC_REST_API_BASE_URL}${endpoint}`, { ...init, headers });
    }

    const api = {
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

    return { api, inProgress, organization, setUserAccessToken, user };
  }, [organizationData, setUserAccessToken, state.isLocalStorageChecked, state.userAccessToken, userData]);

  useEffect(() => {
    const newUserAccessToken = getUserAccessToken();

    setState((s) => ({ ...s, isLocalStorageChecked: true, userAccessToken: newUserAccessToken }));
  }, []);

  useEffect(() => {
    const userAccessTokenFromLocalStorage = getUserAccessToken();

    if (
      (organizationError !== undefined || userError !== undefined)
      && userAccessTokenFromLocalStorage !== state.userAccessToken
    ) {
      setState((s) => ({ ...s, userAccessToken: userAccessTokenFromLocalStorage }));
    }
  }, [organizationError, state.userAccessToken, userError]);

  return (
    <AuthAndApiContext.Provider value={value}>
      {children}
    </AuthAndApiContext.Provider>
  );
}
