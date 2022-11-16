import dayjs from "dayjs";
import { stringify } from "querystring";
import { useContext, useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { SiteReportsFiltersContext } from "../contexts";

type KindOverview = "overview";
type KindPageViewsTime = "pageViewsTime";

type Kind = KindOverview
  | KindPageViewsTime;

const apiPaths: Record<Kind, string> = {
  overview: "overview",
  pageViewsTime: "page-views-time",
};

export function useSiteReports(kind: KindOverview): SWRResponse<SiteOverviewReport>;
export function useSiteReports(kind: KindPageViewsTime): SWRResponse<SitePageViewsTimeReport>;

export function useSiteReports(kind: Kind): SWRResponse {
  const siteReportsFilters = useContext(SiteReportsFiltersContext);

  const reportQueryParams = useMemo<string>(() => {
    const q: Record<string, string> = {
      siteId: siteReportsFilters.id.toString(),
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

  return useSWR(`/site-reports/${apiPaths[kind]}?${reportQueryParams}`);
}
