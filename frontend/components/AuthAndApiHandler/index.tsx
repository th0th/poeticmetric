import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useInterval } from "react-use";
import useSWR from "swr";
import { AuthAndApiContext, AuthAndApiContextValue } from "../../contexts";
import { getUserAccessToken, hydrateOrganization } from "../../helpers";

type AuthAndApiHandlerProps = {
  children: React.ReactNode;
};

type State = {
  isReady: boolean;
  userAccessToken: string | null;
};

export function AuthAndApiHandler({ children }: AuthAndApiHandlerProps) {
  const [state, setState] = useState<State>({ isReady: false, userAccessToken: null });

  const {
    data: userData,
    error: userError,
  } = useSWR<AuthUser>(state.userAccessToken === null ? null : "/users/me");

  const {
    data: organizationData,
    error: organizationError,
  } = useSWR<Organization>(state.userAccessToken === null ? null : "/organization");

  const updateUserAccessToken = useCallback(() => {
    let stateUpdate: Partial<State> = {};

    if (!state.isReady) {
      stateUpdate.isReady = true;
    }

    const userAccessToken = getUserAccessToken();

    if (state.userAccessToken !== userAccessToken) {
      stateUpdate.userAccessToken = userAccessToken;
    }

    if (Object.keys(stateUpdate).length > 0) {
      setState((s) => ({ ...s, ...stateUpdate }));
    }
  }, [state.isReady, state.userAccessToken]);

  const mutate = useCallback<AuthAndApiContextValue["mutate"]>(async () => {
    setState((s) => ({ ...s, userAccessToken: getUserAccessToken() }));
  }, []);

  const value = useMemo<AuthAndApiContextValue>(() => {
    let user: AuthUser | null = null;
    let organization: HydratedOrganization | null = null;

    if (userData !== undefined && userError === undefined && organizationData !== undefined && organizationError === undefined) {
      user = userData;
      organization = hydrateOrganization(organizationData);
    }

    const isReady = state.isReady && (state.userAccessToken === null && user === null && organization === null)
      || (state.userAccessToken !== null && user !== null && organization !== null);

    return { isReady, mutate, organization, user };
  }, [mutate, organizationData, organizationError, state.isReady, state.userAccessToken, userData, userError]);

  useEffect(() => updateUserAccessToken(), [updateUserAccessToken]);

  useInterval(() => updateUserAccessToken(), 10000);

  return (
    <AuthAndApiContext.Provider value={value}>
      {children}
    </AuthAndApiContext.Provider>
  );
}
