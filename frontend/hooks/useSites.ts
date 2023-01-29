import { useEffect } from "react";
import useSWR, { BareFetcher, mutate, SWRConfiguration, SWRResponse } from "swr";

type Data = Array<Site>;

type SwrConfig = SWRConfiguration<Data, any, BareFetcher<Data>>;
type SwrResponse = SWRResponse<Data, Error>;

export function useSites(disable?: boolean, config?: SwrConfig): SwrResponse {
  const swrResponse = useSWR<Data, Error>(disable ? null : "/sites", config);

  useEffect(() => {
    if (swrResponse.data !== undefined) {
      swrResponse.data.map((datum) => mutate(`/sites/${datum.id}`, datum));
    }
  }, [swrResponse.data]);

  return swrResponse;
}
