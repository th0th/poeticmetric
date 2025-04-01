import { useMemo } from "react";
import useSiteReportData from "~/hooks/useSiteReportData";
import ReferrerPath from "./Referrer";
import ReferrerHost from "./ReferrerHost";

export default function Referrer() {
  const { filters } = useSiteReportData();
  const content = useMemo(() => filters.referrerHost === null ? <ReferrerHost /> : <ReferrerPath />, [filters.referrerHost]);

  return (
    <>{content}</>
  );
}
