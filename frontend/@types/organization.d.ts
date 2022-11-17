type OrganizationSubscriptionPeriod = "MONTH" | "YEAR";
type OrganizationSubscriptionPeriodDisplay = "monthly" | "yearly";

type Organization = {
  createdAt: string,
  id: number,
  isOnTrial: boolean,
  name: string,
  notificationCredits: number,
  plan: {
    isGazerPerformanceMonitoringEnabled: boolean,
    isGazerRequestConfigurationEnabled: boolean,
    isGazerTimesEnabled: boolean,
    isLiveChatSupportEnabled: boolean,
    maxAlertCount: number,
    maxGazerCount: number,
    maxPulseCount: number,
    maxStatusPageCount: number,
    maxUserCount: number,
    minGazerRunInterval: number,
    name: string,
  },
  stripeCustomerId: string | null,
  subscriptionPeriod: OrganizationSubscriptionPeriod | null,
  trialEndsAt: string | null,
  updatedAt: string,
};

type HydratedOrganization = Overwrite<Organization, {
  subscriptionPeriodDisplay: OrganizationSubscriptionPeriodDisplay | null,
}>;
