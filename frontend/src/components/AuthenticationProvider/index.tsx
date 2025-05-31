import { ReactNode, useCallback, useEffect } from "react";
import { useErrorBoundary } from "react-error-boundary";
import AuthenticationContext from "~/contexts/AuthenticationContext";
import useAuthenticationUser from "~/hooks/api/useAuthenticationUser";
import useOrganization from "~/hooks/api/useOrganization";
import usePlan from "~/hooks/api/usePlan";
import { setUserAccessToken } from "~/lib/user-access-token";

export default function AuthenticationProvider({ children }: { children: ReactNode }) {
  const { showBoundary } = useErrorBoundary();
  const { data: user, error, isValidating, mutate: mutateAuthenticationUser } = useAuthenticationUser();
  const { mutate: mutateOrganization } = useOrganization();
  const { mutate: mutatePlan } = usePlan();

  const refresh = useCallback(async () => {await mutateAuthenticationUser();}, [mutateAuthenticationUser]);

  const signOut = useCallback(async () => {
    setUserAccessToken(null);

    await Promise.all([
      mutateAuthenticationUser(null),
      mutateOrganization(undefined),
      mutatePlan(undefined),
    ]);

    await mutateAuthenticationUser(null);
  }, [mutateAuthenticationUser, mutateOrganization, mutatePlan]);

  useEffect(() => {
    if (error !== undefined) {
      showBoundary(error);
    }
  }, [error, showBoundary]);

  return (
    <AuthenticationContext.Provider value={{ isValidating, refresh, signOut, user }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
