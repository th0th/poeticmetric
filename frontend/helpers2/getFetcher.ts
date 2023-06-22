import apiCall from "./apiCall";
import getUserAccessToken from "./getUserAccessToken";
import setUserAccessToken from "./setUserAccessToken";

export default function getFetcher(requireUserAccessToken: boolean, throwOnErroneousResponse: boolean) {
  async function fetcher(endpoint: string, init?: RequestInit) {
    if (requireUserAccessToken && getUserAccessToken() === undefined) {
      return undefined;
    }

    let response: Response;

    try {
      response = await apiCall(endpoint, init);
    } catch (e) {
      throw new Error("An error occurred while fetching the data.");
    }

    const responseJson = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        setUserAccessToken();
      }

      if (throwOnErroneousResponse) {
        throw new Error(responseJson.detail || "An error has occurred while fetching the data.");
      }

      return undefined;
    }

    return responseJson;
  }

  return fetcher;
}
