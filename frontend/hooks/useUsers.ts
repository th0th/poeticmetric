import { useEffect, useState } from "react";
import useSWR, { BareFetcher, mutate, SWRConfiguration, SWRResponse } from "swr";

type Data = Array<User>;
type HydratedData = Array<HydratedUser>;

type Config = SWRConfiguration<Data, any, BareFetcher<Data>>;

type Response = Overwrite<SWRResponse<Data>, {
  data: HydratedData | undefined,
}>;

export function useUsers(disable?: boolean, config?: Config): Response {
  const { data: rawData, ...swrResponse } = useSWR<Data>(disable ? null : "/users", config);
  const [hydratedData, setHydratedData] = useState<HydratedData>();

  useEffect(() => {
    let canceled = false;

    if (rawData !== undefined) {
      Promise
        .all(rawData.map((datum) => mutate(`/users/${datum.id}`, datum)))
        .then(() => !canceled && setHydratedData(rawData));
    }

    return () => {
      canceled = true;
    };
  }, [rawData]);

  return { data: hydratedData, ...swrResponse };
}
