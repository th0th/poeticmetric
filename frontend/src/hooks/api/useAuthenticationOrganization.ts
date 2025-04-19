import { useCallback } from "react";
import useSWR, { BareFetcher, SWRConfiguration, SWRResponse, useSWRConfig } from "swr";
import { hydrateAuthenticationOrganization } from "~/lib/api/authentication";

type Config = SWRConfiguration<HydratedData, Error, BareFetcher<HydratedData>>;
type Data = AuthenticationOrganization;
type HydratedData = HydratedAuthenticationOrganization;
type Response = SWRResponse<HydratedData, Error>;

export default function useAuthenticationOrganization(config?: Config): Response {
  const { fetcher: baseFetcher } = useSWRConfig();

  const fetcher = useCallback<BareFetcher<HydratedData>>(async (...args) => {
    if (baseFetcher === undefined) {
      throw new Error("Base fetcher is not defined.");
    }

    const data = (await baseFetcher(args) as Data);

    if (data === undefined) {
      return data;
    }

    return hydrateAuthenticationOrganization(data);
  }, [baseFetcher]);

  return useSWR<HydratedData, Error>("/authentication/organization", { ...config, fetcher });
}
