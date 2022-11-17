import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteVisitorsTimeReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type HydratedSwrResponse = SWRResponse<SiteVisitorsTimeReport> & {
  hydratedData?: HydratedSiteVisitorsTimeReport,
};

export function useSiteVisitorsTimeReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const swrResponse = useSWR<SiteVisitorsTimeReport>(`/site-reports/visitors-time?${reportQueryParams}`);

  const hydratedData = useMemo<HydratedSiteVisitorsTimeReport | undefined>(() => {
    if (swrResponse.data === undefined) {
      return undefined;
    }

    return hydrateSiteVisitorsTimeReport(swrResponse.data);
  }, [swrResponse.data]);

  return { ...swrResponse, hydratedData };
}
