import { createContext } from "react";

export type AuthAndApiContextValue = {
  mutate: () => Promise<void>;
  organization: HydratedOrganization | null;
  user: AuthUser | null;
};

export const AuthAndApiContext = createContext<AuthAndApiContextValue>({
  mutate: () => new Promise((resolve) => resolve()),
  organization: null,
  user: null,
});
