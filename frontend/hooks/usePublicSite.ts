import useSWR, { SWRResponse } from "swr";

export function usePublicSite(domain?: string): SWRResponse<Site, Error> {
  return useSWR<Site, Error>(domain === undefined ? null : `/sites/public/${domain}`);
}
