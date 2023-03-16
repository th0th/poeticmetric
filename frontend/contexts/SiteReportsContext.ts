import dayjs from "dayjs";
import { createContext } from "react";

export type SiteReportsContextValue = {
  filters: SiteReportsFilters;
  site: Site;
};

export const SiteReportsContext = createContext<SiteReportsContextValue>({
  filters: {
    browserName: null,
    browserVersion: null,
    countryIsoCode: null,
    deviceType: null,
    end: dayjs().endOf("day"),
    language: null,
    operatingSystemName: null,
    operatingSystemVersion: null,
    path: null,
    referrer: null,
    referrerSite: null,
    siteId: 0,
    start: dayjs().startOf("day"),
    utmCampaign: null,
    utmContent: null,
    utmMedium: null,
    utmSource: null,
    utmTerm: null,
  },
  site: {
    createdAt: "",
    domain: "",
    googleSearchConsoleSiteUrl: null,
    hasEvents: false,
    id: 0,
    isPublic: false,
    name: "",
    safeQueryParameters: [],
    updatedAt: "",
  },
});
