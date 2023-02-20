import { createContext } from "react";

export type AuthContextValue = {
  isReady: boolean;
  mutate: () => Promise<void>;
  organization: HydratedOrganization | null;
  user: AuthUser | null;
};

export const AuthContext = createContext<AuthContextValue>({
  isReady: false,
  mutate: () => new Promise((resolve) => resolve()),
  organization: null,
  user: null,
});
