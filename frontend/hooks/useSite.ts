import { useMemo } from "react";
import useSWR, { BareFetcher, SWRConfiguration, SWRResponse } from "swr";

type Data = Site;
type HydratedData = Site;

type Config = SWRConfiguration<Data, any, BareFetcher<Data>>;

type Response = Overwrite<SWRResponse<Data>, {
  data: HydratedData | undefined;
}>;

export function useSite(id?: number, disable?: boolean, config?: Config): Response {
  const path = useMemo<string | null>(() => {
    if (id === undefined) {
      return null;
    }

    return `/sites/${id}`;
  }, [id]);

  const { data: rawData, ...swrResponse } = useSWR<Data>(path, config);

  const data = useMemo<Response["data"]>(() => {
    if (rawData === undefined) {
      return undefined;
    }

    return rawData;
  }, [rawData]);

  return { data, ...swrResponse };
}
