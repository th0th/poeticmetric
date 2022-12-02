import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteOperatingSystemNameReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type Data = SiteOperatingSystemNameReport;
type HydratedData = HydratedSiteOperatingSystemNameReport;

type SwrResponse = SWRResponse<Data, Error>;
type HydratedSwrResponse = Overwrite<SwrResponse, {
  data?: HydratedData;
}>;

export function useSiteOperatingSystemNameReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const { data: rawData, ...swrResponse } = useSWR<Data>(`/site-reports/operating-system-name?${reportQueryParams}`);

  const data = useMemo<HydratedSwrResponse["data"]>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return hydrateSiteOperatingSystemNameReport(rawData);
  }, [rawData]);

  return { data, ...swrResponse };
}
