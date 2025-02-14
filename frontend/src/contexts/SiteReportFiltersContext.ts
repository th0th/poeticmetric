import { Dayjs } from "dayjs";
import { createContext } from "react";

export type SiteReportFiltersContextValue = {
  end: Dayjs;
  start: Dayjs;
} | undefined;

export default createContext<SiteReportFiltersContextValue>(undefined);
