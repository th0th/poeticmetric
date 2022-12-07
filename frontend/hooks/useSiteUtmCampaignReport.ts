import { useMemo } from "react";
import useSWR, { SWRResponse } from "swr";
import { hydrateSiteUtmCampaignReport } from "../helpers";
import { useReportQueryParams } from "./useReportQueryParams";

type Data = SiteUtmCampaignReport;
type HydratedData = HydratedSiteUtmCampaignReport;

type SwrResponse = SWRResponse<Data, Error>;
type HydratedSwrResponse = Overwrite<SwrResponse, {
  data?: HydratedData;
}>;

export function useSiteUtmCampaignReport(): HydratedSwrResponse {
  const reportQueryParams = useReportQueryParams();
  const { data: rawData, ...swrResponse } = useSWR<Data>(`/site-reports/utm-campaign?${reportQueryParams}`);

  const data = useMemo<HydratedSwrResponse["data"]>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return hydrateSiteUtmCampaignReport(rawData);
  }, [rawData]);

  return { data, ...swrResponse };
}
