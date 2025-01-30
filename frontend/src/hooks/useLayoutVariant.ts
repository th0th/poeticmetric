import { useMemo } from "react";
import { useLocation } from "wouter";

export const applicationLocations: Array<string> = [
  "/billing",
  "/settings",
  "/settings/organization-details",
  "/settings/organization-deletion",
  "/settings/password",
  "/settings/profile",
  "/sites",
  "/sites/add",
  "/sites/edit",
  "/sites/report",
  "/team",
  "/team/invite",
  "/team/edit",
];

export default function useLayoutVariant(): LayoutVariant {
  const [location] = useLocation();

  return useMemo(() => {
    return applicationLocations.includes(location) ? "application" : "site";
  }, [location]);
}
