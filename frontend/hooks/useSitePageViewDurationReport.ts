import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSitePageViewDurationsReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type HydratedSwrResponse = SWRResponse<SitePageViewDurationsReport> & {
  hydratedData?: HydratedSitePageViewDurationsReport;
};

export function useSitePageViewDurationReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const swrResponse = useSWR<SitePageViewDurationsReport>(`/site-reports/page-view-duration?${reportQueryParams}`);

  const hydratedData = useMemo<HydratedSitePageViewDurationsReport | undefined>(() => {
    if (swrResponse.data === undefined) {
      return undefined;
    }

    return hydrateSitePageViewDurationsReport(swrResponse.data);
  }, [swrResponse.data]);

  return { ...swrResponse, hydratedData };
}
