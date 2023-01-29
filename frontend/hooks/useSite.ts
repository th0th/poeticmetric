import useSWR, { SWRResponse } from "swr";

export function useSite(id?: number): SWRResponse<Site, Error> {
  return useSWR<Site, Error>(id === undefined ? null : `/sites/${id}`);
}
