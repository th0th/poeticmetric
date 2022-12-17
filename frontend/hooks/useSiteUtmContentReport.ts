import { stringify } from "querystring";
import { useCallback, useMemo } from "react";
import { Arguments } from "swr";
import useSWRInfinite, { SWRInfiniteResponse } from "swr/infinite";
import { hydrateSiteUtmContentReport } from "../helpers";
import { useSiteReportQueryParams } from "./useSiteReportQueryParams";

type Data = SiteUtmContentReport;
type HydratedData = HydratedSiteUtmContentReport;
type HydratedSwrInfiniteResponse = Overwrite<SWRInfiniteResponse<Data, Error>, { data?: Array<HydratedData> }>;
type KeyLoader = (index: number, previousPageData: HydratedData | null) => Arguments;

export function useSiteUtmContentReport(): HydratedSwrInfiniteResponse {
  const siteReportQueryParams = useSiteReportQueryParams();

  const getKey = useCallback<KeyLoader>((index, previousPageData) => {
    let queryParams = { ...siteReportQueryParams };

    if (index !== 0 && previousPageData !== null) {
      const { paginationCursor } = previousPageData;

      if (paginationCursor !== null) {
        queryParams.paginationCursor = paginationCursor;
      }
    }

    return `/site-reports/utm-content?${stringify(queryParams)}`;
  }, [siteReportQueryParams]);

  const { data: rawData, ...swrResponse } = useSWRInfinite<Data, Error, KeyLoader>(getKey, {
    persistSize: true,
    revalidateFirstPage: false,
  });

  const data = useMemo<HydratedSwrInfiniteResponse["data"] | undefined>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return rawData.map(hydrateSiteUtmContentReport);
  }, [rawData]);

  return { ...swrResponse, data };
}
