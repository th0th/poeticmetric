import React from "react";
import { SWRConfig } from "swr";
import { getFetcher } from "../../helpers";

export type SwrConfigProps = {
  children: React.ReactNode;
};

const fetcher = getFetcher(false, true);

export function SwrConfig({ children }: SwrConfigProps) {
  return (
    <SWRConfig value={{ fetcher, refreshInterval: 60000 }}>{children}</SWRConfig>
  );
}
