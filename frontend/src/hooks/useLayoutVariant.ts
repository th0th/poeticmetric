import { useMemo } from "react";
import { useLocation } from "wouter";

export const applicationLocations: Array<string> = [
  "/billing",
  "/settings",
  "/settings/account-deletion",
  "/settings/organization-details",
  "/settings/password",
  "/settings/profile",
  "/sites",
  "/sites/add",
  "/sites/edit",
  "/sites/report",
  "/team",
  "/team/edit",
  "/team/invite",
];

export default function useLayoutVariant(): LayoutVariant {
  const [location] = useLocation();

  return useMemo(() => {
    return applicationLocations.includes(location) ? "application" : "site";
  }, [location]);
}
