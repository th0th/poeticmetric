import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteVisitorsTimeReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type HydratedSwrResponse = SWRResponse<SiteVisitorsTimeReport> & {
  hydratedData?: HydratedSiteVisitorsTimeReport;
};

export function useSiteVisitorReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const swrResponse = useSWR<SiteVisitorsTimeReport>(`/site-reports/visitors?${reportQueryParams}`);

  const hydratedData = useMemo<HydratedSiteVisitorsTimeReport | undefined>(() => {
    if (swrResponse.data === undefined) {
      return undefined;
    }

    return hydrateSiteVisitorsTimeReport(swrResponse.data);
  }, [swrResponse.data]);

  return { ...swrResponse, hydratedData };
}
