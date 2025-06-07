type GoogleSearchConsoleSite = {
  siteURL: string;
};

type HydratedSite = Overwrite<Site, {
  createdAtDayjs: import("dayjs").Dayjs;
  updatedAtDayjs: import("dayjs").Dayjs;
}>;

type PublicSiteResponse = {
  domain: string;
  id: number;
  isGoogleSearchConsoleSiteURLSet: boolean;
  name: string;
};

type Site = {
  createdAt: string;
  domain: string;
  googleSearchConsoleSiteURL: string | null;
  hasEvents: boolean;
  id: number;
  isPublic: boolean;
  name: string;
  safeQueryParameters: Array<string>;
  updatedAt: string;
};
