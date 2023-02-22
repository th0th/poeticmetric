import { createContext } from "react";

export type AuthContextValue = {
  isReady: boolean;
  mutate: () => Promise<void>;
} & ({
  organization: null;
  user: null;
} | {
  organization: HydratedOrganization;
  user: AuthUser;
});

export const AuthContext = createContext<AuthContextValue>({
  isReady: false,
  mutate: () => new Promise((resolve) => resolve()),
  organization: null,
  user: null,
});
