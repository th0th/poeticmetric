import { stringify } from "querystring";
import { useCallback, useMemo } from "react";
import { Arguments } from "swr";
import useSWRInfinite, { SWRInfiniteResponse } from "swr/infinite";
import { hydrateSitePathReport } from "../helpers";
import { useSiteReportQueryParams } from "./useSiteReportQueryParams";

type Data = SitePathReport;
type HydratedData = HydratedSitePathReport;
type HydratedSwrInfiniteResponse = Overwrite<SWRInfiniteResponse<SitePathReport, Error>, { data?: Array<HydratedData> }>;
type KeyLoader = (index: number, previousPageData: HydratedData | null) => Arguments;

export function useSitePathReport(): HydratedSwrInfiniteResponse {
  const siteReportQueryParams = useSiteReportQueryParams();

  const getKey = useCallback<KeyLoader>((index, previousPageData) => {
    let queryParams = { ...siteReportQueryParams };

    if (index !== 0 && previousPageData !== null) {
      const { paginationCursor } = previousPageData;

      if (paginationCursor !== null) {
        queryParams.paginationCursor = paginationCursor;
      }
    }

    return `/site-reports/path?${stringify(queryParams)}`;
  }, [siteReportQueryParams]);

  const { data: rawData, ...swrResponse } = useSWRInfinite<Data, Error, KeyLoader>(getKey, {
    persistSize: true,
    revalidateFirstPage: false,
  });

  const data = useMemo<HydratedSwrInfiniteResponse["data"] | undefined>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return rawData.map(hydrateSitePathReport);
  }, [rawData]);

  return { ...swrResponse, data };
}