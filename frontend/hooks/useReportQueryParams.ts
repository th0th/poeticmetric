import dayjs from "dayjs";
import { stringify } from "querystring";
import { useContext, useMemo } from "react";
import { SiteReportsFiltersContext } from "../contexts";

export function useReportQueryParams(): string {
  const siteReportsFilters = useContext(SiteReportsFiltersContext);

  return useMemo<string>(() => {
    const q: Record<string, string> = {
      siteId: siteReportsFilters.siteId.toString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    (Object.keys(siteReportsFilters) as Array<keyof typeof siteReportsFilters>).forEach((key) => {
      const value = siteReportsFilters[key];

      if (typeof value === "string") {
        q[key] = value;
      } else if (dayjs.isDayjs(value)) {
        q[key] = value.toISOString();
      }
    });

    return stringify(q);
  }, [siteReportsFilters]);
}
