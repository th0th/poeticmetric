import dayjs from "dayjs";
import millify from "millify";

const subscriptionPeriodDisplayMap: Record<OrganizationResponseSubscriptionPeriod, OrganizationResponseSubscriptionPeriodDisplay> = {
  MONTH: "Month",
  YEAR: "Year",
};

export function hydrateAuthenticationOrganization(d: OrganizationResponse): HydratedOrganizationResponse {
  return {
    ...d,
    createdAtDayjs: dayjs(d.createdAt),
    subscriptionPeriodDisplay: d.subscriptionPeriod === null ? null : subscriptionPeriodDisplayMap[d.subscriptionPeriod],
    updatedAtDayjs: dayjs(d.updatedAt),
  };
}

export function hydrateOrganizationUsageResponse(d: OrganizationUsageResponse): HydratedOrganizationUsageResponse {
  return {
    ...d,
    canAddSite: d.maxSiteCount === null || d.siteCount < d.maxSiteCount,
    canAddUser: d.maxUserCount === null || d.userCount < d.maxUserCount,
  };
}

export function hydratePlanResponse(d: PlanResponse): HydratedPlanResponse {
  return {
    ...d,
    maxEventsPerMonthDisplay: millify(d.maxEventsPerMonth),
  };
}
