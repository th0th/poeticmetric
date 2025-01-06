import { useMemo } from "react";
import { useLocation } from "wouter";

export const siteLocations: Array<string> = [
  "/",
  "/blog",
  "/docs",
  "/manifesto",
  "/open-source",
  "/pricing",
  "/privacy-policy",
  "/terms-of-service",
];

export default function useHeaderVariant(): "application" | "site" {
  const [location] = useLocation();

  return useMemo(() => siteLocations.includes(location) ? "site" : "application", [location]);
}
