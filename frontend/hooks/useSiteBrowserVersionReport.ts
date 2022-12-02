import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteBrowserVersionReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type Data = SiteBrowserVersionReport;
type HydratedData = HydratedSiteBrowserVersionReport;

type SwrResponse = SWRResponse<Data, Error>;
type HydratedSwrResponse = Overwrite<SwrResponse, {
  data?: HydratedData;
}>;

export function useSiteBrowserVersionReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const { data: rawData, ...swrResponse } = useSWR<Data>(`/site-reports/browser-version?${reportQueryParams}`);

  const data = useMemo<HydratedSwrResponse["data"]>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return hydrateSiteBrowserVersionReport(rawData);
  }, [rawData]);

  return { data, ...swrResponse };
}
