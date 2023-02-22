import React, { useCallback, useMemo } from "react";
import useSWR from "swr";
import { AuthContext, AuthContextValue } from "../../contexts";
import { getFetcher, hydrateOrganization } from "../../helpers";

type AuthHandlerProps = {
  children: React.ReactNode;
};

const fetcher = getFetcher(true, false);

export function AuthHandler({ children }: AuthHandlerProps) {
  const { data: userData, isValidating: isValidatingUser, mutate: mutateUserData } = useSWR<AuthUser, Error>("/users/me", fetcher);
  const {
    data: organizationData,
    isValidating: isValidatingOrganization,
    mutate: mutateOrganizationData,
  } = useSWR<Organization, Error>("/organization", fetcher);

  const mutate = useCallback<AuthContextValue["mutate"]>(async () => {
    await Promise.all([mutateUserData(), mutateOrganizationData()]);
  }, [mutateOrganizationData, mutateUserData]);

  const value = useMemo<AuthContextValue>(() => {
    let v: AuthContextValue = {
      isReady: !isValidatingUser && !isValidatingOrganization,
      mutate,
      organization: null,
      user: null,
    };

    if (userData !== undefined && organizationData !== undefined) {
      v = { ...v, isReady: true, organization: hydrateOrganization(organizationData), user: userData };
    }

    return v;
  }, [isValidatingOrganization, isValidatingUser, mutate, organizationData, userData]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
