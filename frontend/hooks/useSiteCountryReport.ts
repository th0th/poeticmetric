import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteCountryReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type HydratedSwrResponse = SWRResponse<SiteCountryReport, Error> & {
  hydratedData?: HydratedSiteCountryReport;
};

export function useSiteCountryReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const swrResponse = useSWR<SiteCountryReport>(`/site-reports/country?${reportQueryParams}`);

  const hydratedData = useMemo<HydratedSiteCountryReport | undefined>(() => {
    if (swrResponse.data === undefined) {
      return undefined;
    }

    return hydrateSiteCountryReport(swrResponse.data);
  }, [swrResponse.data]);

  return { ...swrResponse, hydratedData };
}
