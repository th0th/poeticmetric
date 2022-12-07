import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteUtmTermReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type Data = SiteUtmTermReport;
type HydratedData = HydratedSiteUtmTermReport;

type SwrResponse = SWRResponse<Data, Error>;
type HydratedSwrResponse = Overwrite<SwrResponse, {
  data?: HydratedData;
}>;

export function useSiteUtmTermReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const { data: rawData, ...swrResponse } = useSWR<Data>(`/site-reports/utm-term?${reportQueryParams}`);

  const data = useMemo<HydratedSwrResponse["data"]>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return hydrateSiteUtmTermReport(rawData);
  }, [rawData]);

  return { data, ...swrResponse };
}
