import dayjs from "dayjs";
import { ReactNode, useMemo } from "react";
import { useSearchParams } from "wouter";
import ActivityIndicator from "~/components/ActivityIndicator";
import SiteReportDataContext, { SiteReportDataContextValue } from "~/contexts/SiteReportDataContext";
import useSite from "~/hooks/api/useSite";

export type SiteReportProviderProps = {
  children?: ReactNode;
};

export default function SiteReportDataProvider({ children }: SiteReportProviderProps) {
  const [searchParams] = useSearchParams();
  const siteID = useMemo(() => Number(searchParams.get("siteID")) || undefined, [searchParams]);
  const { data: site } = useSite(siteID);
  const value = useMemo<SiteReportDataContextValue | null>(() => {
    if (site === undefined) {
      return null;
    }

    // end
    let end = dayjs().endOf("day");
    const endFromQuery = searchParams.get("end");

    if (endFromQuery !== null) {
      const endTemp = dayjs(endFromQuery);

      if (endTemp.isValid()) {
        end = endTemp;
      }
    }

    // start
    let start = dayjs().subtract(29, "day").startOf("day");
    const startFromQuery = searchParams.get("start");

    if (startFromQuery !== null) {
      const startTemp = dayjs(startFromQuery);

      if (startTemp.isValid()) {
        start = startTemp;
      }
    }

    const filters: SiteReportDataContextValue["filters"] = {
      browserName: searchParams.get("browserName"),
      browserVersion: searchParams.get("browserVersion"),
      countryIsoCode: searchParams.get("countryIsoCode"),
      deviceType: searchParams.get("deviceType"),
      end,
      language: searchParams.get("language"),
      operatingSystemName: searchParams.get("operatingSystemName"),
      operatingSystemVersion: searchParams.get("operatingSystemVersion"),
      path: searchParams.get("path"),
      referrer: searchParams.get("referrer"),
      referrerHost: searchParams.get("referrerHost"),
      siteID: site.id,
      start,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      utmCampaign: searchParams.get("utmCampaign"),
      utmContent: searchParams.get("utmContent"),
      utmMedium: searchParams.get("utmMedium"),
      utmSource: searchParams.get("utmSource"),
      utmTerm: searchParams.get("utmTerm"),
    };

    const urlSearchParams = new URLSearchParams();
    Object.entries(filters).map(([key, value]) => {
      if (typeof value === "number") {
        urlSearchParams.set(key, value.toString());
      } else if (typeof value === "string") {
        urlSearchParams.set(key, value);
      } else if (dayjs.isDayjs(value)) {
        urlSearchParams.set(key, value.toISOString());
      }
    });
    const filterQueryParams = `?${urlSearchParams.toString()}`;

    return { filterQueryParams, filters, site };
  }, [searchParams, site]);

  return value === null ? (
    <div className="align-items-center d-flex flex-grow-1 justify-content-center p-12">
      <ActivityIndicator />
    </div>
  ) : (
    <SiteReportDataContext.Provider value={value}>{children}</SiteReportDataContext.Provider>
  );
}
