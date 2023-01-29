import { useEffect } from "react";
import useSWR, { BareFetcher, mutate, SWRConfiguration, SWRResponse } from "swr";

type Data = Array<User>;

type SwrConfig = SWRConfiguration<Data, any, BareFetcher<Data>>;
type SwrResponse = SWRResponse<Data, Error>;

export function useUsers(disable?: boolean, config?: SwrConfig): SwrResponse {
  const swrResponse = useSWR<Data, Error>(disable ? null : "/users", config);

  useEffect(() => {
    if (swrResponse.data !== undefined) {
      swrResponse.data.map((datum) => mutate(`/users/${datum.id}`, datum));
    }
  }, [swrResponse.data]);

  return swrResponse;
}
