import { useCallback, useMemo } from "react";
import useSWR, { BareFetcher, SWRConfiguration, SWRResponse, useSWRConfig } from "swr";
import useSiteReportData from "~/hooks/useSiteReportData";
import { hydrateSiteOverviewReport } from "~/lib/api/sites";

type Config = SWRConfiguration<HydratedData, Error, BareFetcher<HydratedData>>;
type Data = SiteOverviewReport;
type HydratedData = HydratedSiteOverviewReport;
type Response = SWRResponse<HydratedData, Error>;

export default function useSiteOverviewReport(config?: Config): Response {
  const { fetcher: baseFetcher } = useSWRConfig();
  const { filterQueryParams } = useSiteReportData();
  const path = useMemo<string | null>(() => `/site-reports/overview${filterQueryParams}`, [filterQueryParams]);

  const fetcher = useCallback<BareFetcher<HydratedData>>(async (...args) => {
    if (baseFetcher === undefined) {
      throw new Error("Base fetcher is not defined.");
    }

    const data = (await baseFetcher(args) as Data);

    if (data === undefined) {
      return data;
    }

    return hydrateSiteOverviewReport(data);
  }, [baseFetcher]);

  return useSWR<HydratedData, Error>(path, { ...config, fetcher });
}
