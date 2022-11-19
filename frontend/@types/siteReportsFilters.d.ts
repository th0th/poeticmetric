type Dayjs = import("dayjs").Dayjs;

type SiteReportsFilters = {
  browserName: string | null;
  browserVersion: string | null;
  countryIsoCode: string | null;
  deviceType: "desktop" | "mobile" | "tablet" | null;
  end: Dayjs;
  id: number;
  language: string | null;
  operatingSystemName: string | null;
  operatingSystemVersion: string | null;
  page: string | null;
  referrerSite: string | null;
  start: Dayjs;
  utmCampaign: string | null;
  utmContent: string | null;
  utmMedium: string | null;
  utmSource: string | null;
  utmTerm: string | null;
};
