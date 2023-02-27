import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteTimeTrendsReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type Data = SiteTimeTrendsReport;
type HydratedData = HydratedSiteTimeTrendsReport;

type SwrResponse = SWRResponse<Data, Error>;
type HydratedSwrResponse = Overwrite<SwrResponse, {
  data?: HydratedData;
}>;

export function useSiteTimeTrendsReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const { data: rawData, ...swrResponse } = useSWR<Data>(`/site-reports/time-trends?${reportQueryParams}`);

  const data = useMemo<HydratedSwrResponse["data"]>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return hydrateSiteTimeTrendsReport(rawData);
  }, [rawData]);

  return { data, ...swrResponse };
}
