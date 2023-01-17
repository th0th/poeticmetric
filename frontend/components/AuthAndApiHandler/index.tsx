import React, { useCallback, useMemo, useState } from "react";
import { useInterval } from "react-use";
import useSWR from "swr";
import { AuthAndApiContext, AuthAndApiContextValue } from "../../contexts";
import { getUserAccessToken, hydrateOrganization } from "../../helpers";

type AuthAndApiHandlerProps = {
  children: React.ReactNode;
};

type State = {
  userAccessToken: string | null;
};

export function AuthAndApiHandler({ children }: AuthAndApiHandlerProps) {
  const [state, setState] = useState<State>({ userAccessToken: null });

  const {
    data: userData,
    error: userError,
  } = useSWR<AuthUser>(state.userAccessToken === null ? null : "/users/me");

  const {
    data: organizationData,
    error: organizationError,
  } = useSWR<Organization>(state.userAccessToken === null ? null : "/organization");

  const updateUserAccessToken = useCallback((force: boolean = false) => {
    const userAccessToken = getUserAccessToken();

    if (state.userAccessToken !== userAccessToken || force) {
      setState((s) => ({ ...s, userAccessToken: getUserAccessToken() }));
    }
  }, [state.userAccessToken]);

  const mutate = useCallback<AuthAndApiContextValue["mutate"]>(async () => {
    updateUserAccessToken(true);
  }, [updateUserAccessToken]);

  const value = useMemo<AuthAndApiContextValue>(() => {
    let user: AuthUser | null = null;
    let organization: HydratedOrganization | null = null;

    if (userData !== undefined && userError === undefined && organizationData !== undefined && organizationError === undefined) {
      user = userData;
      organization = hydrateOrganization(organizationData);
    }

    return { mutate, organization, user };
  }, [mutate, organizationData, organizationError, userData, userError]);

  useInterval(() => updateUserAccessToken(), 5000);

  return (
    <AuthAndApiContext.Provider value={value}>
      {children}
    </AuthAndApiContext.Provider>
  );
}
