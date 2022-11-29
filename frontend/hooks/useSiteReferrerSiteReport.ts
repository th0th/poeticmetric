import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteReferrerSiteReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type Data = SiteReferrerSiteReport;
type HydratedData = HydratedSiteReferrerSiteReport;

type SwrResponse = SWRResponse<Data, Error>;
type HydratedSwrResponse = Overwrite<SwrResponse, {
  data?: HydratedData;
}>;

export function useSiteReferrerSiteReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const { data: rawData, ...swrResponse } = useSWR<Data>(`/site-reports/referrer-site?${reportQueryParams}`);

  const data = useMemo<HydratedSwrResponse["data"]>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return hydrateSiteReferrerSiteReport(rawData);
  }, [rawData]);

  return { data, ...swrResponse };
}
