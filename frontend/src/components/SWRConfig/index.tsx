import { ReactNode } from "react";
import { SWRConfig as BaseSWRConfig } from "swr";
import { getFetcher } from "~/lib/api";

export type SwrConfigProps = {
  children: ReactNode;
};

const fetcher = getFetcher();

export default function SWRConfig({ children }: SwrConfigProps) {
  return (
    <BaseSWRConfig value={{ fetcher }}>
      {children}
    </BaseSWRConfig>
  );
}
