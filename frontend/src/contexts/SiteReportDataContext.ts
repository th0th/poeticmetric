import { Dayjs } from "dayjs";
import { createContext } from "react";

export type SiteReportDataContextValue = {
  filterQueryParams: string;
  filters: {
    browserName: string | null;
    browserVersion: string | null;
    countryISOCode: string | null;
    deviceType: string | null;
    end: Dayjs;
    language: string | null;
    operatingSystemName: string | null;
    operatingSystemVersion: string | null;
    path: string | null;
    referrer: string | null;
    referrerHost: string | null;
    start: Dayjs;
    timeZone: string | null;
    utmCampaign: string | null;
    utmContent: string | null;
    utmMedium: string | null;
    utmSource: string | null;
    utmTerm: string | null;
  };
  site: {
    id: number;
    isGoogleSearchConsoleSiteURLSet: boolean;
  };
};

export default createContext<SiteReportDataContextValue>(undefined!);
