import { useCallback } from "react";
import useSWR, { BareFetcher, SWRConfiguration, SWRResponse, useSWRConfig } from "swr";
import { hydrateOrganizationUsageResponse } from "~/lib/api/organizations";

type Config = SWRConfiguration<HydratedData, Error, BareFetcher<HydratedData>>;
type Data = OrganizationUsageResponse;
type HydratedData = HydratedOrganizationUsageResponse;
type Response = SWRResponse<HydratedData, Error>;

export default function useOrganizationUsage(config?: Config): Response {
  const { fetcher: baseFetcher } = useSWRConfig();

  const fetcher = useCallback<BareFetcher<HydratedData>>(async (...args) => {
    if (baseFetcher === undefined) {
      throw new Error("Base fetcher is not defined.");
    }

    const data = (await baseFetcher(args) as Data);

    if (data === undefined) {
      return data;
    }

    return hydrateOrganizationUsageResponse(data);
  }, [baseFetcher]);

  return useSWR<HydratedData, Error>("/organization/usage", { ...config, fetcher });
}
