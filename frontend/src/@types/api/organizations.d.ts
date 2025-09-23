type HydratedOrganizationResponse = Overwrite<OrganizationResponse, {
  createdAtDayjs: import("dayjs").Dayjs;
  subscriptionPeriodDisplay: OrganizationResponseSubscriptionPeriodDisplay | null;
  updatedAtDayjs: import("dayjs").Dayjs;
}>;

type HydratedOrganizationUsageResponse = Overwrite<OrganizationUsageResponse, {
  canAddSite: boolean;
  canAddUser: boolean;
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
  id: number;
  isOnTrial: boolean;
  isStripeCustomer: boolean;
  name: string;
  subscriptionCancelAtPeriodEnd: boolean | null;
  subscriptionPeriod: OrganizationResponseSubscriptionPeriod | null;
  trialEndsAt: string | null;
  updatedAt: string;
};

type OrganizationUsageResponse = {
  maxSiteCount: number | null;
  maxUserCount: number | null;
  siteCount: number;
  userCount: number;
};

type OrganizationResponseSubscriptionPeriod = "MONTH" | "YEAR";
type OrganizationResponseSubscriptionPeriodDisplay = "Month" | "Year";

type PlanResponse = {
  maxEventsPerMonth: number;
  maxSiteCount: number | null;
  maxUserCount: number | null;
  name: string;
};
