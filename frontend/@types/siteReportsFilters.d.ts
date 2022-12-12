type Dayjs = import("dayjs").Dayjs;

type SiteReportsFilters = {
  browserName: string | null;
  browserVersion: string | null;
  countryIsoCode: string | null;
  deviceType: string | null;
  end: Dayjs;
  language: string | null;
  operatingSystemName: string | null;
  operatingSystemVersion: string | null;
  page: string | null;
  referrer: string | null;
  referrerSite: string | null;
  siteId: number;
  start: Dayjs;
  utmCampaign: string | null;
  utmContent: string | null;
  utmMedium: string | null;
  utmSource: string | null;
  utmTerm: string | null;
};
