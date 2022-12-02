import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteOperatingSystemVersionReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type Data = SiteOperatingSystemVersionReport;
type HydratedData = HydratedSiteOperatingSystemVersionReport;

type SwrResponse = SWRResponse<Data, Error>;
type HydratedSwrResponse = Overwrite<SwrResponse, {
  data?: HydratedData;
}>;

export function useSiteOperatingSystemVersionReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const { data: rawData, ...swrResponse } = useSWR<Data>(`/site-reports/operating-system-version?${reportQueryParams}`);

  const data = useMemo<HydratedSwrResponse["data"]>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return hydrateSiteOperatingSystemVersionReport(rawData);
  }, [rawData]);

  return { data, ...swrResponse };
}
