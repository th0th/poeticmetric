import React, { useCallback, useMemo } from "react";
import useSWR from "swr";
import { AuthContext, AuthContextValue } from "../../contexts";
import { getFetcher, hydrateOrganization } from "../../helpers";

type AuthHandlerProps = {
  children: React.ReactNode;
};

const fetcher = getFetcher(true, false);

export function AuthHandler({ children }: AuthHandlerProps) {
  const { data: userData, mutate: mutateUserData } = useSWR<AuthUser, Error>("/users/me", fetcher);
  const { data: organizationData, mutate: mutateOrganizationData } = useSWR<Organization, Error>("/organization", fetcher);

  const mutate = useCallback<AuthContextValue["mutate"]>(async () => {
    await Promise.all([mutateUserData(), mutateOrganizationData()]);
  }, [mutateOrganizationData, mutateUserData]);

  const value = useMemo<AuthContextValue>(() => {
    let user: AuthUser | null = null;
    let organization: HydratedOrganization | null = null;

    if (userData !== undefined && organizationData !== undefined) {
      user = userData;
      organization = hydrateOrganization(organizationData);
    }

    return { isReady: true, mutate, organization, user };
  }, [mutate, organizationData, userData]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
