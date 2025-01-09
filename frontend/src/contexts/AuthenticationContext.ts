import { createContext } from "react";

export type AuthenticationContextValue = {
  isValidating: boolean;
  refresh: () => Promise<void>;
  signOut: (forReal?: boolean) => void;
  user?: AuthenticationUser | null;
};

const AuthenticationContext = createContext<AuthenticationContextValue>({
  isValidating: false,
  refresh: () => Promise.resolve(undefined),
  signOut: () => {},
});

export default AuthenticationContext;
