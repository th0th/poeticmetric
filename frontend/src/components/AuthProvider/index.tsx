import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import AuthContext, { AuthContextType } from "~/contexts/AuthContext";
import { setUserAccessToken } from "~/lib/user-access-token";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { showBoundary } = useErrorBoundary();
  const [user] = useState<AuthContextType["user"] | null>(null);
  const canWrite = useMemo<AuthContextType["canWrite"]>(() => ["ADMIN", "OWNER"].includes(user?.role || ""), [user]);
  const isOrganizationOwner = useMemo<AuthContextType["isOrganizationOwner"]>(() => user?.role === "OWNER", [user]);

  const getAuthUser = useCallback(async () => {
    try {
      /* TODO: Update endpoint */
      // const response = await api.get("/authentication/user");
      // const responseJson = await response.json();
      //
      // if (response.ok) {
      //   setUser(responseJson);
      // } else {
      //   await signOut();
      // }
    } catch (error) {
      return showBoundary(error);
    }
  }, []);

  const refreshUser = useCallback(async () => getAuthUser(), [getAuthUser]);

  const signOut = useCallback(async () => {
    setUserAccessToken(null);

    await getAuthUser();
  }, []);

  useEffect(() => {
    getAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        canWrite,
        isOrganizationOwner,
        refreshUser,
        signOut,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
