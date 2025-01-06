import { useMemo } from "react";
import { useLocation } from "wouter";
import { siteLocations } from "~/hooks/useHeaderVariant";

export default function useIsFooterRendered(): boolean {
  const [location] = useLocation();

  return useMemo<boolean>(() => siteLocations.includes(location), [location]);
}
