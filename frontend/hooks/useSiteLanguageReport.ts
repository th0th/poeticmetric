import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteLanguageReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type Data = SiteLanguageReport;
type HydratedData = HydratedSiteLanguageReport;

type SwrResponse = SWRResponse<Data, Error>;
type HydratedSwrResponse = Overwrite<SwrResponse, {
  data?: HydratedData;
}>;

export function useSiteLanguageReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const { data: rawData, ...swrResponse } = useSWR<Data>(`/site-reports/language?${reportQueryParams}`);

  const data = useMemo<HydratedSwrResponse["data"]>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return hydrateSiteLanguageReport(rawData);
  }, [rawData]);

  return { data, ...swrResponse };
}
