import getRestApiUrl from "./getRestApiUrl";
import getUserAccessToken from "./getUserAccessToken";

export default async function apiCall(endpoint: string, init?: RequestInit): Promise<Response> {
  const userAccessToken = getUserAccessToken();

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...userAccessToken === undefined ? {} : { authorization: `bearer ${userAccessToken}` },
    ...init?.headers,
  };

  return fetch(getRestApiUrl(endpoint) || "", { ...init, headers });
}
