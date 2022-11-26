import useSWR, { SWRResponse } from "swr";

type HydratedSwrResponse = SWRResponse<Site, Error>;

export function useSite(id?: number): HydratedSwrResponse {
  return useSWR<Site>(id === undefined ? null : `/sites/${id}`);
}
