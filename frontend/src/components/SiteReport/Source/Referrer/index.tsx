import { useMemo } from "react";
import ReferrerHost from "~/components/SiteReport/Source/Referrer/ReferrerHost";
import useSiteReportData from "~/hooks/useSiteReportData";

export default function Referrer() {
  const { filters } = useSiteReportData();
  const content = useMemo(() => filters.referrerHost === null ? <ReferrerHost /> : null, [filters.referrerHost]);

  return (
    <>{content}</>
  );
}
