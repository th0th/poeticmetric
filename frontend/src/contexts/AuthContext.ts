import { createContext } from "react";

export type AuthContextType = {
  canWrite: boolean;
  isOrganizationOwner: boolean;
  refreshUser: () => void;
  signOut: () => void;
  user: User | null;
};

const AuthContext = createContext<AuthContextType>({
  canWrite: false,
  isOrganizationOwner: false,
  refreshUser: () => {},
  signOut: () => {},
  user: null,
});

export default AuthContext;
