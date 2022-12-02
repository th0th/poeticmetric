import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteBrowserNameReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type Data = SiteBrowserNameReport;
type HydratedData = HydratedSiteBrowserNameReport;

type SwrResponse = SWRResponse<Data, Error>;
type HydratedSwrResponse = Overwrite<SwrResponse, {
  data?: HydratedData;
}>;

export function useSiteBrowserNameReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const { data: rawData, ...swrResponse } = useSWR<Data>(`/site-reports/browser-name?${reportQueryParams}`);

  const data = useMemo<HydratedSwrResponse["data"]>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return hydrateSiteBrowserNameReport(rawData);
  }, [rawData]);

  return { data, ...swrResponse };
}
