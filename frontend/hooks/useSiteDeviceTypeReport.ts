import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteDeviceTypeReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type Data = SiteDeviceTypeReport;
type HydratedData = HydratedSiteDeviceTypeReport;

type SwrResponse = SWRResponse<Data, Error>;
type HydratedSwrResponse = Overwrite<SwrResponse, {
  data?: HydratedData;
}>;

export function useSiteDeviceTypeReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const { data: rawData, ...swrResponse } = useSWR<Data>(`/site-reports/device-type?${reportQueryParams}`);

  const data = useMemo<HydratedSwrResponse["data"]>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return hydrateSiteDeviceTypeReport(rawData);
  }, [rawData]);

  return { data, ...swrResponse };
}
