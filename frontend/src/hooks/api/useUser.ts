import { useCallback, useMemo } from "react";
import useSWR, { BareFetcher, SWRConfiguration, SWRResponse, useSWRConfig } from "swr";
import { hydrateUser } from "~/lib/api/users";

type Config = SWRConfiguration<HydratedData, Error, BareFetcher<HydratedData>>;
type Data = User;
type HydratedData = HydratedUser;
type Response = SWRResponse<HydratedData, Error>;

export default function useUser(userID?: number, config?: Config): Response {
  const { fetcher: baseFetcher } = useSWRConfig();
  const path = useMemo<string | null>(() => userID === undefined ? null : `/users/${userID}`, [userID]);

  const fetcher = useCallback<BareFetcher<HydratedData>>(async (...args) => {
    if (baseFetcher === undefined) {
      throw new Error("Base fetcher is not defined.");
    }

    const data = (await baseFetcher(args) as Data);

    if (data === undefined) {
      return data;
    }

    return hydrateUser(data);
  }, [baseFetcher]);

  return useSWR<HydratedData, Error>(path, { ...config, fetcher });
}
