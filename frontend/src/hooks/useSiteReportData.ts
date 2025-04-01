import { useContext } from "react";
import SiteReportDataContext from "~/contexts/SiteReportDataContext";

export default function useSiteReportData() {
  return useContext(SiteReportDataContext);
}
