import { useCallback } from "react";
import useSWR, { BareFetcher, SWRConfiguration, SWRResponse, useSWRConfig } from "swr";
import { hydrateSite } from "~/lib/api/sites";

type Config = SWRConfiguration<HydratedData, Error, BareFetcher<HydratedData>>;
type Data = Array<Site>;
type HydratedData = Array<HydratedSite>;
type Response = SWRResponse<HydratedData, Error>;

export default function useSites(config?: Config): Response {
  const { fetcher: baseFetcher } = useSWRConfig();

  const fetcher = useCallback<BareFetcher<HydratedData>>(async (...args) => {
    if (baseFetcher === undefined) {
      throw new Error("Base fetcher is not defined.");
    }

    const data = (await baseFetcher(args) as Data);

    if (data === undefined) {
      return data;
    }

    return data.map(hydrateSite);
  }, [baseFetcher]);

  return useSWR<HydratedData, Error>("/sites", { ...config, fetcher });
}
