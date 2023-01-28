import useSWR, { SWRResponse } from "swr";

type HydratedSwrResponse = SWRResponse<Site, Error>;

export function usePublicSite(domain?: string): HydratedSwrResponse {
  return useSWR<Site>(domain === undefined ? null : `/sites/public/${domain}`);
}
