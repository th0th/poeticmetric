import useSWR from "swr";
import getFetcher from "~helpers/getFetcher";

const fetcher = getFetcher(true, true);

export default function useAuthUser() {
  return useSWR<AuthUser, Error>("/users/me", fetcher);
}
