import { ReactNode, useCallback, useEffect } from "react";
import { useErrorBoundary } from "react-error-boundary";
import AuthenticationContext from "~/contexts/AuthenticationContext";
import useAuthenticationUser from "~/hooks/api/useAuthenticationUser";
import { setUserAccessToken } from "~/lib/user-access-token";

export default function AuthenticationProvider({ children }: { children: ReactNode }) {
  const { showBoundary } = useErrorBoundary();
  const { data: user, error, isValidating, mutate } = useAuthenticationUser();

  const refresh = useCallback(async () => {await mutate();}, [mutate]);

  const signOut = useCallback(async () => {
    setUserAccessToken(null);
    await mutate(null);
  }, [mutate]);

  useEffect(() => {
    if (error !== undefined) {
      showBoundary(error);
    }
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        isValidating,
        refresh,
        signOut,
        user,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
