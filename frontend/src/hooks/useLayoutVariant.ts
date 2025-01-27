import { useMemo } from "react";
import { useLocation } from "wouter";

export const siteLocations: Array<string> = [
  "/",
  "/blog(/.*)?",
  "/docs(/.*)?",
  "/manifesto",
  "/open-source",
  "/pricing",
  "/privacy-policy",
  "/terms-of-service",
];

export default function useLayoutVariant(): LayoutVariant {
  const [location] = useLocation();

  return useMemo(() => {
    for (const d of siteLocations) {
      if (new RegExp(`^${d}$`).test(location)) {
        return "site";
      }
    }

    return "application";
  }, [location]);
}
