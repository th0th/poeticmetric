import { useCallback } from "react";
import useSWR, { BareFetcher, SWRConfiguration, SWRResponse, useSWRConfig } from "swr";
import { hydrateUsers } from "~/lib/api/users";

type Config = SWRConfiguration<HydratedData, Error, BareFetcher<HydratedData>>;
type Data = Array<User>;
type HydratedData = Array<HydratedUser>;
type Response = SWRResponse<HydratedData, Error>;

export default function useUsers(config?: Config): Response {
  const { fetcher: baseFetcher } = useSWRConfig();

  const fetcher = useCallback<BareFetcher<HydratedData>>(async (...args) => {
    if (baseFetcher === undefined) {
      throw new Error("Base fetcher is not defined.");
    }

    const data = (await baseFetcher(args) as Data);

    if (data === undefined) {
      return data;
    }

    return hydrateUsers(data);
  }, [baseFetcher]);

  return useSWR<HydratedData, Error>("/users", { ...config, fetcher });
}
