import { useCallback } from "react";
import useSWR, { BareFetcher, SWRConfiguration, SWRResponse, useSWRConfig } from "swr";
import { hydratePlanResponse } from "~/lib/api/organizations";

type Config = SWRConfiguration<HydratedData, Error, BareFetcher<HydratedData>>;
type Data = PlanResponse;
type HydratedData = HydratedPlanResponse;
type Response = SWRResponse<HydratedData, Error>;

export default function usePlan(config?: Config): Response {
  const { fetcher: baseFetcher } = useSWRConfig();

  const fetcher = useCallback<BareFetcher<HydratedData>>(async (...args) => {
    if (baseFetcher === undefined) {
      throw new Error("Base fetcher is not defined.");
    }

    const data = (await baseFetcher(args) as Data);

    if (data === undefined) {
      return data;
    }

    return hydratePlanResponse(data);
  }, [baseFetcher]);

  return useSWR<HydratedData, Error>("/organization/plan", { ...config, fetcher });
}
