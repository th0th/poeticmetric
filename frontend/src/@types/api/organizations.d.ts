type HydratedOrganizationResponse = Overwrite<OrganizationResponse, {
  createdAtDayjs: import("dayjs").Dayjs;
  subscriptionPeriodDisplay: OrganizationResponseSubscriptionPeriodDisplay | null;
  updatedAtDayjs: import("dayjs").Dayjs;
}>;

type HydratedPlanResponse = Overwrite<PlanResponse, {
  maxEventsPerMonthDisplay: string;
}>;

type OrganizationDeletionReason = {
  detailTitle: string | null;
  order: number;
  reason: string;
};

type OrganizationResponse = {
  createdAt: string;
  isOnTrial: boolean;
  isStripeCustomer: boolean;
  name: string;
  subscriptionCancelAtPeriodEnd: boolean | null;
  subscriptionPeriod: OrganizationResponseSubscriptionPeriod | null;
  trialEndsAt: string | null;
  updatedAt: string;
};

type OrganizationResponseSubscriptionPeriod = "MONTH" | "YEAR";
type OrganizationResponseSubscriptionPeriodDisplay = "Month" | "Year";

type PlanResponse = {
  maxEventsPerMonth: number;
  maxUsers: number;
  name: string;
};
