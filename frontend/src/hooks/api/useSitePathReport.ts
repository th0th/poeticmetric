import { useCallback } from "react";
import { BareFetcher, useSWRConfig } from "swr";
import useSWRInfinite, { SWRInfiniteConfiguration, SWRInfiniteKeyLoader, SWRInfiniteResponse } from "swr/infinite";
import useSiteReportData from "~/hooks/useSiteReportData";
import { hydrateSitePathReport } from "~/lib/api/sites";

type Config = SWRInfiniteConfiguration<HydratedData, Error, BareFetcher<HydratedData>>;
type Data = SitePathReport;
type HydratedData = HydratedSitePathReport;
type Response = SWRInfiniteResponse<HydratedData, Error>;

export default function useSitePathReport(config?: Config): Response {
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

    return `/site-reports/path?${urlSearchParams.toString()}`;
  }, [filterQueryParams]);

  const fetcher = useCallback<BareFetcher<HydratedData>>(async (...args) => {
    if (baseFetcher === undefined) {
      throw new Error("Base fetcher is not defined.");
    }

    const data = (await baseFetcher(args) as Data);

    if (data === undefined) {
      return data;
    }

    return hydrateSitePathReport(data);
  }, [baseFetcher]);

  return useSWRInfinite<HydratedData, Error>(getKey, { fetcher, persistSize: true, ...config });
}
