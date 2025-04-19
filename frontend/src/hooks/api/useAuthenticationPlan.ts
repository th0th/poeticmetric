import useSWR, { BareFetcher, SWRConfiguration, SWRResponse } from "swr";

type Config = SWRConfiguration<Data, Error, BareFetcher<Data>>;
type Data = AuthenticationPlan;
type Response = SWRResponse<Data, Error>;

export default function useAuthenticationPlan(config?: Config): Response {
  return useSWR<Data, Error>("/authentication/plan", config);
}
