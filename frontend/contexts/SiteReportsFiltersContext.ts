import dayjs from "dayjs";
import { createContext } from "react";

export type SiteReportsFiltersContextValue = SiteReportsFilters;

export const SiteReportsFiltersContext = createContext<SiteReportsFiltersContextValue>({
  browserName: null,
  browserVersion: null,
  countryIsoCode: null,
  deviceType: null,
  end: dayjs().endOf("day"),
  id: 0,
  language: null,
  operatingSystemName: null,
  operatingSystemVersion: null,
  page: null,
  referrerSite: null,
  start: dayjs().startOf("day"),
  utmCampaign: null,
  utmContent: null,
  utmMedium: null,
  utmSource: null,
  utmTerm: null,
});
