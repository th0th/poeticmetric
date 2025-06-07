import useSWR, { BareFetcher, SWRConfiguration, SWRResponse } from "swr";

type Config = SWRConfiguration<Data, Error, BareFetcher<Data>>;
type Data = PublicSiteResponse;
type Response = SWRResponse<Data, Error>;

export default function usePublicSite(siteDomain: string | null, config?: Config): Response {
  return useSWR<Data, Error>(siteDomain !== null ? `/public-sites/${siteDomain}` : null, config);
}
