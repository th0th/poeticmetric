import { createContext, Dispatch, SetStateAction } from "react";

export const monthlyEventCountSteps: Array<PlanMonthlyEventCount> = [100000, 500000, 1000000, 2000000, 5000000];

export type PlansContextState = {
  monthlyEventCountStepIndex: number;
  planNameInProgress: string | null;
  subscriptionPeriod: AuthenticationOrganizationSubscriptionPeriod;
};

export type PlansContextValue = PlansContextState & {
  monthlyEventCountSteps: Array<number>;
  set: Dispatch<SetStateAction<PlansContextState>>;
};

export default createContext<PlansContextValue>({
  monthlyEventCountStepIndex: 0,
  monthlyEventCountSteps,
  planNameInProgress: null,
  set: () => null,
  subscriptionPeriod: "MONTH",
});
