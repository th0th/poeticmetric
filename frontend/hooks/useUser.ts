import useSWR, { SWRResponse } from "swr";

export function useUser(id?: number): SWRResponse<User, Error> {
  return useSWR<User, Error>(id === undefined ? null : `/users/${id}`);
}
