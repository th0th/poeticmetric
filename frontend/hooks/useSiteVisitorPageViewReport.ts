import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteVisitorPageViewReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type Data = SiteVisitorPageViewReport;
type HydratedData = HydratedSiteVisitorPageViewReport;

type HydratedSwrResponse = Overwrite<SWRResponse<Data, Error>, {
  data?: HydratedData;
}>;

export function useSiteVisitorPageViewReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const { data: rawData, ...swrResponse } = useSWR<Data>(`/site-reports/visitor-page-view?${reportQueryParams}`);

  const data = useMemo<HydratedSwrResponse["data"]>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return hydrateSiteVisitorPageViewReport(rawData);
  }, [rawData]);

  return { data, ...swrResponse };
}
