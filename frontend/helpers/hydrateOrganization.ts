export const subscriptionPeriodDisplays: Record<OrganizationSubscriptionPeriod, OrganizationSubscriptionPeriodDisplay> = {
  MONTH: "monthly",
  YEAR: "yearly",
};

export function hydrateOrganization(o: Organization): HydratedOrganization {
  return {
    ...o,
    subscriptionPeriodDisplay: o.subscriptionPeriod === null ? null : subscriptionPeriodDisplays[o.subscriptionPeriod],
  };
}
