import { stringify } from "querystring";
import { useCallback, useMemo } from "react";
import { Arguments } from "swr";
import useSWRInfinite, { SWRInfiniteResponse } from "swr/infinite";
import { hydrateSiteUtmMediumReport } from "../helpers";
import { useSiteReportQueryParams } from "./useSiteReportQueryParams";

type Data = SiteUtmMediumReport;
type HydratedData = HydratedSiteUtmMediumReport;
type HydratedSwrInfiniteResponse = Overwrite<SWRInfiniteResponse<Data, Error>, { data?: Array<HydratedData> }>;
type KeyLoader = (index: number, previousPageData: HydratedData | null) => Arguments;

export function useSiteUtmMediumReport(): HydratedSwrInfiniteResponse {
  const siteReportQueryParams = useSiteReportQueryParams();

  const getKey = useCallback<KeyLoader>((index, previousPageData) => {
    let queryParams = { ...siteReportQueryParams };

    if (index !== 0 && previousPageData !== null) {
      const { paginationCursor } = previousPageData;

      if (paginationCursor !== null) {
        queryParams.paginationCursor = paginationCursor;
      }
    }

    return `/site-reports/utm-medium?${stringify(queryParams)}`;
  }, [siteReportQueryParams]);

  const { data: rawData, ...swrResponse } = useSWRInfinite<Data, Error, KeyLoader>(getKey, {
    persistSize: true,
    revalidateFirstPage: false,
  });

  const data = useMemo<HydratedSwrInfiniteResponse["data"] | undefined>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return rawData.map(hydrateSiteUtmMediumReport);
  }, [rawData]);

  return { ...swrResponse, data };
}
