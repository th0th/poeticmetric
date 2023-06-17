import useSWR from "swr";
import getFetcher from "~helpers/getFetcher";

const fetcher = getFetcher(true, false);

export default function useAuthUser() {
  return useSWR<AuthUser, Error>("/users/me", fetcher);
}
