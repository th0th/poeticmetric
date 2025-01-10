import { useMemo } from "react";
import useAuthentication from "~/hooks/useAuthentication";

export type UseAuthorizationParams<IsAuthenticated extends boolean> = IsAuthenticated extends true
  ? AuthenticatedProps : UnauthenticatedProps;

type AuthenticatedProps = {
  isAuthenticated: true;
  isOrganizationOwner?: boolean;
};

type UnauthenticatedProps = {
  isAuthenticated: false;
};

export default function useAuthorization<IsAuthenticated extends boolean>(
  params: UseAuthorizationParams<IsAuthenticated>,
): boolean | undefined {
  const { user } = useAuthentication();

  return useMemo<boolean | undefined>(() => {
    if (user === undefined) {
      return undefined;
    }

    if (params.isAuthenticated) {
      return user !== null && (params.isOrganizationOwner === undefined || user.isOrganizationOwner === params.isOrganizationOwner);
    }

    return user === null;
  }, [params, user]);
}
