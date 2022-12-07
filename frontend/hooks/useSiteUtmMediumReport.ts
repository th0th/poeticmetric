import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteUtmMediumReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type Data = SiteUtmMediumReport;
type HydratedData = HydratedSiteUtmMediumReport;

type SwrResponse = SWRResponse<Data, Error>;
type HydratedSwrResponse = Overwrite<SwrResponse, {
  data?: HydratedData;
}>;

export function useSiteUtmMediumReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const { data: rawData, ...swrResponse } = useSWR<Data>(`/site-reports/utm-medium?${reportQueryParams}`);

  const data = useMemo<HydratedSwrResponse["data"]>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return hydrateSiteUtmMediumReport(rawData);
  }, [rawData]);

  return { data, ...swrResponse };
}
