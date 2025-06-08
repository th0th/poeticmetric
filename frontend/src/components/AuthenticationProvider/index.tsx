import { ReactNode, useCallback, useEffect, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { useLocation } from "react-router";
import AuthenticationContext, { AuthenticationContextState } from "~/contexts/AuthenticationContext";
import useAuthenticationUser from "~/hooks/api/useAuthenticationUser";
import useOrganization from "~/hooks/api/useOrganization";
import usePlan from "~/hooks/api/usePlan";
import { setUserAccessToken } from "~/lib/user-access-token";

export default function AuthenticationProvider({ children }: { children: ReactNode }) {
  const { showBoundary } = useErrorBoundary();
  const location = useLocation();
  const [state, setState] = useState<AuthenticationContextState>({ isNavigationInProgress: false });
  const { data: user, error: userError, mutate: mutateUser } = useAuthenticationUser();
  const { mutate: mutateOrganization } = useOrganization({
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
  });
  const { mutate: mutatePlan } = usePlan({
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
  });

  const refresh = useCallback(async () => {
    await Promise.all([
      mutateUser(),
      mutateOrganization(),
      mutatePlan(),
    ]);
  }, [mutateUser, mutateOrganization, mutatePlan]);

  const signOut = useCallback(async () => {
    setUserAccessToken(null);

    await refresh();
  }, [refresh]);

  useEffect(() => {
    setState((s) => ({ ...s, isNavigationInProgress: false }));
  }, [location]);

  useEffect(() => {
    if (userError !== undefined) {
      showBoundary(userError);
    }
  }, [showBoundary, userError]);

  return (
    <AuthenticationContext.Provider value={{ refresh, setState, signOut, state, user }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
