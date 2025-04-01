import { useMemo } from "react";
import useSiteReportData from "~/hooks/useSiteReportData";
import OperatingSystemName from "./OperatingSystemName";
import OperatingSystemVersion from "./OperatingSystemVersion";

export default function OperatingSystems() {
  const { filters } = useSiteReportData();
  const content = useMemo(
    () => filters.operatingSystemName === null ? <OperatingSystemName /> : <OperatingSystemVersion />,
    [filters.operatingSystemName],
  );

  return (
    <>{content}</>
  );
}
