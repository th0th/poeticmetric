import { createContext, Dispatch, SetStateAction } from "react";

export type AuthenticationContextState = {
  isNavigationInProgress: boolean;
};

export type AuthenticationContextValue = {
  refresh: () => Promise<void>;
  setState: Dispatch<SetStateAction<AuthenticationContextState>>;
  signOut: (forReal?: boolean) => void;
  state: AuthenticationContextState;
  user?: AuthenticationUser | null;
};

const AuthenticationContext = createContext<AuthenticationContextValue>({
  refresh: () => Promise.resolve(undefined),
  setState: () => {},
  signOut: () => {},
  state: { isNavigationInProgress: false },
});

export default AuthenticationContext;
