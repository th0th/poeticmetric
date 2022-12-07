import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteUtmContentReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type Data = SiteUtmContentReport;
type HydratedData = HydratedSiteUtmContentReport;

type SwrResponse = SWRResponse<Data, Error>;
type HydratedSwrResponse = Overwrite<SwrResponse, {
  data?: HydratedData;
}>;

export function useSiteUtmContentReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const { data: rawData, ...swrResponse } = useSWR<Data>(`/site-reports/utm-content?${reportQueryParams}`);

  const data = useMemo<HydratedSwrResponse["data"]>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return hydrateSiteUtmContentReport(rawData);
  }, [rawData]);

  return { data, ...swrResponse };
}
