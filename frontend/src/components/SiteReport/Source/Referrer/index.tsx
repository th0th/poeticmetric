import { useMemo } from "react";
import ReferrerHost from "~/components/SiteReport/Source/Referrer/ReferrerHost";
import useSiteReportData from "~/hooks/useSiteReportData";
import ReferrerPath from "./Referrer";

export default function Referrer() {
  const { filters } = useSiteReportData();
  const content = useMemo(() => filters.referrerHost === null ? <ReferrerHost /> : <ReferrerPath />, [filters.referrerHost]);

  return (
    <>{content}</>
  );
}
