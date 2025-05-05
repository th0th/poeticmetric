type AuthenticationOrganization = {
  createdAt: string;
  name: string;
  subscriptionCancelAtPeriodEnd: boolean | null;
  subscriptionPeriod: AuthenticationOrganizationSubscriptionPeriod;
  updatedAt: string;
};

type AuthenticationOrganizationSubscriptionPeriod = "MONTH" | "YEAR";
type AuthenticationOrganizationSubscriptionPeriodDisplay = "Month" | "Year";

type AuthenticationPlan = {
  maxEventsPerMonth: number;
  maxUsers: number;
  name: string;
};

type AuthenticationUser = {
  createdAt: string;
  email: string;
  id: number;
  isEmailVerified: boolean;
  isOrganizationOwner: boolean;
  name: string;
  updatedAt: string;
};

type HydratedAuthenticationOrganization = Overwrite<AuthenticationOrganization, {
  createdAtDayjs: import("dayjs").Dayjs;
  updatedAtDayjs: import("dayjs").Dayjs;
}>;

type HydratedAuthenticationUser = Overwrite<AuthenticationUser, {
  canWrite: boolean;
}>;

type OrganizationDeletionReason = {
  detailTitle: string | null;
  order: number;
  reason: string;
};
