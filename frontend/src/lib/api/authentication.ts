export function hydrateAuthenticationUser(d: AuthenticationUser): HydratedAuthenticationUser {
  return {
    ...d,
    canWrite: d.isOrganizationOwner,
  };
}
