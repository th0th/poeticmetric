import dayjs from "dayjs";

export function hydrateAuthenticationUser(d: AuthenticationUser): HydratedAuthenticationUser {
  return {
    ...d,
    canWrite: d.isOrganizationOwner,
  };
}

export function hydrateAuthenticationOrganization(d: AuthenticationOrganization): HydratedAuthenticationOrganization {
  return {
    ...d,
    createdAtDayjs: dayjs(d.createdAt),
    updatedAtDayjs: dayjs(d.updatedAt),
  };
}
