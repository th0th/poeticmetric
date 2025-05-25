import useSWR, { BareFetcher, SWRConfiguration, SWRResponse } from "swr";

type Config = SWRConfiguration<Data, Error, BareFetcher<Data>>;
type Data = Array<GoogleSearchConsoleSite>;
type Response = SWRResponse<Data, Error>;

export default function useSiteGoogleSearchConsoleSites(siteID: number | null, config?: Config): Response {
  return useSWR<Data, Error>(siteID !== null ? `/sites/${siteID}/google-search-console-sites` : null, config);
}
