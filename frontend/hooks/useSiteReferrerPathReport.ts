import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteReferrerPathReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type Data = SiteReferrerPathReport;
type HydratedData = HydratedSiteReferrerPathReport;

type SwrResponse = SWRResponse<Data, Error>;
type HydratedSwrResponse = Overwrite<SwrResponse, {
  data?: HydratedData;
}>;

export function useSiteReferrerPathReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const { data: rawData, ...swrResponse } = useSWR<Data>(`/site-reports/referrer-path?${reportQueryParams}`);

  const data = useMemo<HydratedSwrResponse["data"]>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return hydrateSiteReferrerPathReport(rawData);
  }, [rawData]);

  return { data, ...swrResponse };
}
