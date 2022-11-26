import React from "react";
import { SWRConfig } from "swr";
import { apiCall, setUserAccessToken } from "../../helpers";

export type SwrConfigProps = {
  children: React.ReactNode;
};

async function fetcher(endpoint: string, init?: RequestInit) {
  let response: Response;

  try {
    response = await apiCall(endpoint, init);
  } catch (e) {
    throw new Error("An error occurred while fetching the data.");
  }

  if (!response.ok) {
    if (response.status === 401) {
      setUserAccessToken(null);
    }

    const responseJson = await response.json();

    throw new Error(responseJson.detail || "An error has occurred while fetching the data.");
  }

  return response.json();
}

export function SwrConfig({ children }: SwrConfigProps) {
  return (
    <SWRConfig value={{ fetcher, refreshInterval: 60000 }}>
      {children}
    </SWRConfig>
  );
}
