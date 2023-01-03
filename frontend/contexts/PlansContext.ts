import React, { createContext } from "react";

export type PlansContextPlan = {
  description: string;
  isPriorityEmailSupportEnabled: boolean;
  maxEventsPerMonth: number;
  maxUsers: number;
  name: string;
  priceMonthly: number;
};

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
