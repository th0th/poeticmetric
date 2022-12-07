import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteUtmSourceReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type Data = SiteUtmSourceReport;
type HydratedData = HydratedSiteUtmSourceReport;

type SwrResponse = SWRResponse<Data, Error>;
type HydratedSwrResponse = Overwrite<SwrResponse, {
  data?: HydratedData;
}>;

export function useSiteUtmSourceReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const { data: rawData, ...swrResponse } = useSWR<Data>(`/site-reports/utm-source?${reportQueryParams}`);

  const data = useMemo<HydratedSwrResponse["data"]>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return hydrateSiteUtmSourceReport(rawData);
  }, [rawData]);

  return { data, ...swrResponse };
}
