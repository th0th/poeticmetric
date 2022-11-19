import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteOverviewReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type HydratedSwrResponse = SWRResponse<SiteOverviewReport> & {
  hydratedData?: HydratedSiteOverviewReport;
};

export function useSiteOverviewReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const swrResponse = useSWR<SiteOverviewReport>(`/site-reports/overview?${reportQueryParams}`);

  const hydratedData = useMemo<HydratedSiteOverviewReport | undefined>(() => {
    if (swrResponse.data === undefined) {
      return undefined;
    }

    return hydrateSiteOverviewReport(swrResponse.data);
  }, [swrResponse.data]);

  return { ...swrResponse, hydratedData };
}
