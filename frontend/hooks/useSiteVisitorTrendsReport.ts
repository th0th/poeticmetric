import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteVisitorTrendsReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type Data = SiteVisitorTrendsReport;
type HydratedData = HydratedSiteVisitorTrendsReport;

type SwrResponse = SWRResponse<Data, Error>;
type HydratedSwrResponse = Overwrite<SwrResponse, {
  data?: HydratedData;
}>;

export function useSiteVisitorTrendsReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const { data: rawData, ...swrResponse } = useSWR<Data>(`/site-reports/visitor-trends?${reportQueryParams}`);

  const data = useMemo<HydratedSwrResponse["data"]>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return hydrateSiteVisitorTrendsReport(rawData);
  }, [rawData]);

  return { data, ...swrResponse };
}
