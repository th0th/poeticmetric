import { useCallback } from "react";
import useSWR, { BareFetcher, SWRConfiguration, SWRResponse, useSWRConfig } from "swr";
import { hydrateAuthenticationOrganization } from "~/lib/api/organizations";

type Config = SWRConfiguration<HydratedData, Error, BareFetcher<HydratedData>>;
type Data = OrganizationResponse;
type HydratedData = HydratedOrganizationResponse;
type Response = SWRResponse<HydratedData, Error>;

export default function useOrganization(config?: Config): Response {
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

  return useSWR<HydratedData, Error>("/organization", { ...config, fetcher });
}
