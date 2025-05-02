import { useMemo } from "react";
import useAuthentication from "~/hooks/useAuthentication";

export type UseAuthorizationParams<IsAuthenticated extends boolean> = IsAuthenticated extends true
  ? AuthenticatedProps
  : UnauthenticatedProps;

type AuthenticatedProps = {
  isAuthenticated: true;
  isEmailVerified?: boolean;
  isOrganizationOwner?: boolean;
};

type UnauthenticatedProps = {
  isAuthenticated: false;
};

type AuthorizationResult = {
  error?: string;
  isAuthorized: boolean | undefined;
};

export const
  ERR_AUTHENTICATED = "ERR_AUTHENTICATED",
  ERR_EMAIL_NOT_VERIFIED = "ERR_EMAIL_NOT_VERIFIED",
  ERR_EMAIL_VERIFIED = "ERR_EMAIL_VERIFIED",
  ERR_NOT_AUTHENTICATED = "ERR_NOT_AUTHENTICATED",
  ERR_NOT_ORGANIZATION_OWNER = "ERR_NOT_ORGANIZATION_OWNER",
  ERR_ORGANIZATION_OWNER = "ERR_ORGANIZATION_OWNER";

export default function useAuthorization<IsAuthenticated extends boolean>(
  params: UseAuthorizationParams<IsAuthenticated>,
): AuthorizationResult {
  const { user } = useAuthentication();

  return useMemo<AuthorizationResult>(() => {
    // authentication is not handled yet
    if (user === undefined) {
      return { isAuthorized: undefined };
    }

    // authentication is required
    if (params.isAuthenticated) {
      if (user === null) {
        return { error: ERR_NOT_AUTHENTICATED, isAuthorized: false };
      }

      if (params.isEmailVerified !== undefined && user.isEmailVerified !== params.isEmailVerified) {
        return {
          error: params.isEmailVerified ? ERR_EMAIL_NOT_VERIFIED : ERR_EMAIL_VERIFIED,
          isAuthorized: false,
        };
      }

      if (params.isOrganizationOwner !== undefined && user.isOrganizationOwner !== params.isOrganizationOwner) {
        return {
          error: params.isOrganizationOwner ? ERR_NOT_ORGANIZATION_OWNER : ERR_ORGANIZATION_OWNER,
          isAuthorized: false,
        };
      }
    }

    if (!params.isAuthenticated) {
      if (user !== null) {
        return { error: ERR_AUTHENTICATED, isAuthorized: false };
      }
    }

    return { isAuthorized: true };
  }, [params, user]);
}
