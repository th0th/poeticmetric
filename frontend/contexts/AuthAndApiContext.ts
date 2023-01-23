import { createContext } from "react";

export type AuthAndApiContextValue = {
  isReady: boolean;
  mutate: () => Promise<void>;
  organization: HydratedOrganization | null;
  user: AuthUser | null;
};

export const AuthAndApiContext = createContext<AuthAndApiContextValue>({
  isReady: false,
  mutate: () => new Promise((resolve) => resolve()),
  organization: null,
  user: null,
});
