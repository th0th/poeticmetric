import React, { createContext } from "react";

export type PlansContextState = {
  isDisabled: boolean;
  subscriptionPeriod: "MONTH" | "YEAR";
};

export type PlansContextValue = PlansContextState & {
  set: React.Dispatch<React.SetStateAction<PlansContextState>>;
};

export const PlansContext = createContext<PlansContextValue>({
  isDisabled: false,
  set: () => {},
  subscriptionPeriod: "MONTH",
});
