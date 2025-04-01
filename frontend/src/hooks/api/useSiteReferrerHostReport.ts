import { useCallback } from "react";
import { BareFetcher, useSWRConfig } from "swr";
import useSWRInfinite, { SWRInfiniteConfiguration, SWRInfiniteKeyLoader, SWRInfiniteResponse } from "swr/infinite";
import useSiteReportData from "~/hooks/useSiteReportData";
import { hydrateSiteReferrerHostReport } from "~/lib/api/sites";

type Config = SWRInfiniteConfiguration<HydratedData, Error, BareFetcher<HydratedData>>;
type Data = SiteReferrerHostReport;
type HydratedData = HydratedSiteReferrerHostReport;
type Response = SWRInfiniteResponse<HydratedData, Error>;

export default function useSiteReferrerHostReport(config?: Config): Response {
  const { fetcher: baseFetcher } = useSWRConfig();
  const { filterQueryParams } = useSiteReportData();

  const getKey = useCallback<SWRInfiniteKeyLoader>((index, previousPageData) => {
    const urlSearchParams = new URLSearchParams(filterQueryParams);

    if (index !== 0 && previousPageData !== null) {
      const { paginationCursor } = previousPageData;

      if (paginationCursor !== null) {
        urlSearchParams.set("cursor", paginationCursor);
      }
    }

    return `/site-reports/referrer-host?${urlSearchParams.toString()}`;
  }, [filterQueryParams]);

  const fetcher = useCallback<BareFetcher<HydratedData>>(async (...args) => {
    if (baseFetcher === undefined) {
      throw new Error("Base fetcher is not defined.");
    }

    const data = (await baseFetcher(args) as Data);

    if (data === undefined) {
      return data;
    }

    return hydrateSiteReferrerHostReport(data);
  }, [baseFetcher]);

  return useSWRInfinite<HydratedData, Error>(getKey, { fetcher, persistSize: true, ...config });
}
