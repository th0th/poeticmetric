import { useCallback, useMemo } from "react";
import useSWR, { BareFetcher, SWRConfiguration, SWRResponse, useSWRConfig } from "swr";
import { hydrateSite } from "~/lib/api/sites";

type Config = SWRConfiguration<HydratedData, Error, BareFetcher<HydratedData>>;
type Data = Site;
type HydratedData = HydratedSite;
type Response = SWRResponse<HydratedData, Error>;

export default function useSite(siteID?: number, config?: Config): Response {
  const { fetcher: baseFetcher } = useSWRConfig();
  const path = useMemo<string | null>(() => siteID === undefined ? null : `/sites/${siteID}`, [siteID]);

  const fetcher = useCallback<BareFetcher<HydratedData>>(async (...args) => {
    if (baseFetcher === undefined) {
      throw new Error("Base fetcher is not defined.");
    }

    const data = (await baseFetcher(args) as Data);

    if (data === undefined) {
      return data;
    }

    return hydrateSite(data);
  }, [baseFetcher]);

  return useSWR<HydratedData, Error>(path, { ...config, fetcher });
}
