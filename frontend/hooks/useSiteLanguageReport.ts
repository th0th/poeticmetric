import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteLanguageReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type HydratedSwrResponse = SWRResponse<SiteLanguageReport> & {
  hydratedData?: HydratedSiteLanguageReport;
};

export function useSiteLanguageReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const swrResponse = useSWR<SiteLanguageReport>(`/site-reports/language?${reportQueryParams}`);

  const hydratedData = useMemo<HydratedSiteLanguageReport | undefined>(() => {
    if (swrResponse.data === undefined) {
      return undefined;
    }

    return hydrateSiteLanguageReport(swrResponse.data);
  }, [swrResponse.data]);

  return { ...swrResponse, hydratedData };
}
