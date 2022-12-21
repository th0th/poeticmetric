import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteCountryReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type Data = SiteCountryReport;
type HydratedData = HydratedSiteCountryReport;

type SwrResponse = SWRResponse<Data, Error>;
type HydratedSwrResponse = Overwrite<SwrResponse, {
  data?: HydratedData;
}>;

export function useSiteCountryReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const { data: rawData, ...swrResponse } = useSWR<Data>(`/site-reports/country?${reportQueryParams}`);

  const data = useMemo<HydratedSwrResponse["data"]>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return hydrateSiteCountryReport(rawData);
  }, [rawData]);

  return { data, ...swrResponse };
}
