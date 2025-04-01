import { useMemo } from "react";
import useSiteReportData from "~/hooks/useSiteReportData";
import BrowserName from "./BrowserName";
import BrowserVersion from "./BrowserVersion";

export default function Browsers() {
  const { filters } = useSiteReportData();
  const content = useMemo(() => filters.browserName === null ? <BrowserName /> : <BrowserVersion />, [filters.browserName]);

  return (
    <>{content}</>
  );
}
